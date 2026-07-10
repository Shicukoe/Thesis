# Faithfulness Metrics: What They Measure, Why They Are Valid, How to Read Them

> Methodology justification for the automatic metrics in `Evaluation/`. Every
> equation is the one actually implemented (`src/textual_fidelity.py`,
> `src/run_align.py`), not a textbook default. Two metrics are reported per
> candidate: **AlignScore** (primary, faithfulness/traceability) and **BERTScore**
> (secondary, semantic similarity + counter-example).

---

## 0. The measurement model

Each metric compares **one agent-produced master prompt** (candidate) against **one
human-consolidated master prompt** (reference, `ground_truth.md`). The thesis
question is not "does it read similarly" but **"is every requirement faithfully
preserved and traceable"** — did the consolidation *drop*, *fabricate*, or silently
*contradict* a requirement.

Two failure modes, split by precision vs recall:

| Failure mode (thesis language) | Detected by | Direction |
|---|---|---|
| Agent **injects** content the reference does not support (non-traceable / Implementation Bias) | **Precision ↓** | over-inclusion |
| Agent **drops** content the reference kept (loses requirements) | **Recall ↓** | under-inclusion |

We report P and R separately and never collapse to F1 alone: F1 says *how much* is
wrong, P vs R says *what kind* — and "what kind" is RQ1.

---

## 1. Why token / n-gram overlap was removed

The harness previously used token Precision/Recall/F1 (clipped unigram overlap),
and ROUGE-L / BLEU were considered. **All were dropped**, for one reason:

> They score **surface form**, not meaning. They only reward *identical* tokens.

Consolidating a long prompt history into one master prompt **necessarily
paraphrases and reorders** requirements. So:

- "Users must authenticate" vs "Login is required for every user" carry the same
  requirement but share **no** content token → token overlap punishes a *faithful*
  rewording.
- ROUGE-L / BLEU are additionally **order-sensitive** (LCS / n-gram position), which
  penalises a faithful candidate merely for reordering an order-free requirement list.

A metric whose score drops when the meaning is preserved is the wrong instrument for
a consolidation task. Token/n-gram overlap measures *lexical* similarity; the thesis
needs *semantic* and *entailment* judgements. Hence the two metrics below.

---

## 2. BERTScore — the semantic-similarity axis (secondary)

### 2.1 What it measures

BERTScore (Zhang et al., ICLR 2020, arXiv:1904.09675) measures **meaning** overlap.
It tokenises each text into **subwords** (BPE — "freezing" → `freez`+`ing`), embeds
each subword into a **contextual vector**, then greedy-matches subwords by **cosine
similarity** between vectors — so paraphrases score high and word order is ignored.

With reference embeddings `{r_1..r_n}` and candidate embeddings `{c_1..c_m}`:

$$
R_{\text{BERT}}=\frac{1}{n}\sum_{i}\max_{j} r_i^\top c_j
\qquad
P_{\text{BERT}}=\frac{1}{m}\sum_{j}\max_{i} c_j^\top r_i
\qquad
F_{\text{BERT}}=\frac{2P R}{P+R}
$$

### 2.2 Model choice: `microsoft/deberta-xlarge-mnli`

The BERTScore authors report DeBERTa-xlarge-MNLI as their **highest human-correlation
backbone** ("the best model ... please consider using it instead of the default
roberta-large"). DeBERTa (He et al., ICLR 2021, arXiv:2006.03654) adds *disentangled
attention* and is fine-tuned on MNLI, which improves paraphrase robustness — the
right frozen encoder for a *similarity* read. Scores are **baseline-rescaled**
(≈0 = random, 1 = identical).

### 2.3 The limitation that makes it secondary

DeBERTa caps at **512 tokens**. Our master prompts are long (up to **1417** tokens),
multi-requirement, with irregular line breaks. Feeding a whole long prompt to
BERTScore **truncates** it — content past 512 tokens is silently dropped, so the
score becomes unreliable (8 of 18 candidates truncate; see `outputs/combined.md`).
BERTScore is also a *pure similarity* metric, which is the deeper problem:

> **BERTScore cannot tell a paraphrase from a contradiction.**

Demonstrated on three pairs (`outputs/demo_two_examples.md`):

| pair | BERTScore F1 | should be |
|---|---|---|
| "cold" vs "freezing" (paraphrase) | 0.81 | high ✓ |
| "H → **blue**" vs "H → **red**" (contradiction) | **0.98** | low ✗ |
| customer mgmt reworded (real paraphrase) | 0.66 | high (under-scored) |

The contradiction scores **higher** than the honest paraphrase — cosine similarity
sees "same sentence, one word different". This is why BERTScore is kept only as a
*similarity* signal and as the **counter-example** that motivates an entailment
metric.

---

## 3. AlignScore — the faithfulness axis (primary)

### 3.1 What it measures, and how it is obtained

AlignScore (Zha et al., ACL 2023, arXiv:2305.16739) is a **learned** metric, not a
similarity formula. It asks one directional question: **is the claim *supported by*
the context?** The released checkpoint is a **RoBERTa** encoder fine-tuned end-to-end
on **4.7M examples** unified from 7 task families (NLI, QA, paraphrase, fact
verification, information retrieval, semantic similarity, summarization) into one
`(context, claim, label)` shape, with three heads (3-way NLI / binary / regression).
We download and run this checkpoint — we do not retrain. It has *learned* what
"supported by" means, which pure embedding similarity has not.

### 3.2 How a score is computed (`nli_sp`, confirmed against the source)

For one (context, claim) pair, `ALIGN(context, claim)`:

1. Split the context into ~350-word **chunks**; split the claim into **sentences**.
   (This is why it handles long prompts with **no 512-token truncation**.)
2. For every (chunk, sentence) pair, feed `[CLS] chunk [SEP] sentence [SEP]` through
   RoBERTa **together** (so the two texts interact via cross-attention), pool the
   `[CLS]` vector, and read the **3-way head's ENTAILMENT probability**.
3. Aggregate (SplitSum): for each claim sentence take the **max** over context chunks,
   then the **mean** over claim sentences:

$$
\text{AlignScore}=\frac{1}{N}\sum_{i}\max_{k}\ \text{ENTAIL}\big(\text{chunk}_k,\ \text{sentence}_i\big)
$$

Output ∈ [0,1] (raw, not baseline-rescaled → read as a ranking / support strength).

### 3.3 Directional → precision and recall

Because it is directional, each candidate is scored **twice** (`run_align.py`):

- **precision / traceability** = `ALIGN(context = ground-truth, claim = candidate)`
  → low = candidate content **not supported by** GT = *fabricated / non-traceable* (RQ1).
- **recall / coverage** = `ALIGN(context = candidate, claim = ground-truth)`
  → low = GT content **not supported by** candidate = *dropped requirement*.

### 3.4 Why RoBERTa here, DeBERTa there

Opposite uses of the model → opposite choices. BERTScore uses the model **frozen for
embeddings**, so we pick the strongest frozen encoder (DeBERTa). AlignScore uses the
model **fine-tuned as a classifier**, where the value is the 4.7M-example alignment
training, not the raw encoder — and the released checkpoint simply *is* a fine-tuned
RoBERTa. Swapping the backbone would mean retraining the whole alignment function.

### 3.5 Why it is correct where BERTScore fails

Same three pairs, now AlignScore (`outputs/demo_alignscore.md`):

| pair | Align P | Align R | BERTScore F1 |
|---|---|---|---|
| paraphrase (weather) | 0.96 | 0.99 | 0.81 |
| **contradiction (blue/red)** | **0.0003** | **0.0003** | 0.98 |
| real paraphrase (customer) | 0.86 | 0.91 | 0.66 |

AlignScore collapses the contradiction to ~0 (catches what BERTScore missed) and
keeps the honest paraphrase high (does **not** punish rewording). Its ranking is the
correct one for faithfulness.

---

## 4. Requirement-level scoring and its known limitation

A master prompt is a long multi-requirement document; a single document-level score
hides *which* requirement failed. The harness also splits each text into requirement
units (`common.split_requirements`: one per sentence / bullet) and scores per unit,
yielding a per-requirement diagnostic (which GT unit was dropped, which candidate
unit is non-traceable).

**Disclosed limitation — a sentence is not a requirement.** Splitting on `.!?` +
line breaks is a cheap proxy, not truth:

- **Bundling:** one sentence can carry several requirements. In our own GT,
  *"if H→blue; if O→red; if D→yellow"* is **one sentence = three requirements**; if a
  candidate drops "D→yellow", the bundled unit still matches on H/O and the partial
  drop is **hidden**.
- **Decontextualisation:** splitting "It must be blue" loses the subject.
- It also passes through draft noise (e.g. a stray token in a draft GT).

The correct decomposition is **atomic, self-contained** units, ideally human-made
(Pyramid / Summary Content Units, Nenkova & Passonneau 2004; atomic facts, FACTScore,
Min et al. 2023). That is the ask in `EXPERT_BRIEF.md`. Middle option: LLM-decompose,
then human-verify. This is the main open item: reliably extracting the exact span of
each requirement, no more, no less.

---

## 5. Reading the current results (`outputs/combined.md`)

- **Consolidation raises traceability** (Align precision), every agent: e.g.
  simple_portal Claude **0.12 → 0.97**, Gemini **0.12 → 0.87** (basic → strict).
- **Precision/recall trade-off** between loose and strict: strict compresses, so it
  gains precision and gives up a little recall (Claude simple: loose 0.51/0.97 →
  strict 0.97/0.87).
- **basic_prompt = low precision, decent recall** → covers the requirements but bolts
  on non-traceable detail (the Implementation-Bias phenomenon RQ1 is about).
- **Caveat:** low Align recall ≠ dropped requirement. It is graded entailment; a
  requirement that is present but reworded/compressed scores < 1. Verified: Claude
  strict keeps all four nav buttons yet the "must contain four buttons" sentence
  scores 0.18 because the candidate lists them without asserting "four". Read low
  recall as a **flag to inspect**, not proof of loss.
- **Caveat:** ground truths are **drafts**; numbers are provisional until the expert
  gold list. BERTScore rows for the 8 long candidates are truncated at 512 tokens.

---

## 6. Validity threats to disclose

1. **Single reference** — one human consolidation; a different-but-valid one scores
   lower. Report as agreement with one gold; multiple references / a second annotator
   (inter-annotator κ) would tighten it.
2. **Domain shift** — DeBERTa/BERTScore validated on short sentence pairs, AlignScore
   on NLG-faithfulness data; neither on requirement text. "Supported-by" transfers
   well, but state it.
3. **Sentence ≠ requirement** — §4. The requirement split is a proxy pending atomic
   decomposition.
4. **Draft ground truth** — §5.

---

### References

- Zhang et al. (2020). *BERTScore.* ICLR. arXiv:1904.09675.
- He et al. (2021). *DeBERTa.* ICLR. arXiv:2006.03654. — the frozen embedding backbone.
- Zha et al. (2023). *AlignScore.* ACL. arXiv:2305.16739. — the learned alignment metric.
- Laban et al. (2022). *SummaC.* TACL. — sentence-matrix NLI aggregation (the max-align structure).
- Nenkova & Passonneau (2004). *Pyramid / SCU.* NAACL. — atomic content units.
- Min et al. (2023). *FACTScore.* EMNLP. arXiv:2305.14251. — atomic-fact decomposition + verify.
- Maynez et al. (2020). *On Faithfulness and Factuality.* ACL. — extrinsic hallucination (precision ↔ non-traceable).
