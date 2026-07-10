# Evaluation Harness — Master-Prompt Faithfulness

Scores each master prompt produced in the experiments (`simple_portal`, `hard_erp`)
against a human-consolidated **ground-truth master prompt**. The question is not
"does it read similarly" but **"is every requirement faithfully preserved and
traceable"** — did the consolidation *drop* a requirement, *fabricate* one, or
silently *contradict* one.

## Two metrics, two axes

| Metric | Backbone | Measures | Role |
|---|---|---|---|
| **AlignScore** | RoBERTa (fine-tuned) | **support / entailment** — is the claim *backed by* the context | **primary** — faithfulness & traceability |
| **BERTScore** | DeBERTa-xlarge-MNLI (frozen) | **semantic similarity** — how close in meaning | secondary — paraphrase check + foil |

They are **not** interchangeable. BERTScore asks *"is this worded/meant similarly"*;
AlignScore asks *"does the source actually support this"*. For a traceability thesis
the second question is the one that matters, so AlignScore leads and BERTScore
plays support (and doubles as the counter-example that justifies AlignScore).

### Why both — the evidence (see `outputs/demo_*.md`)

Three hand-picked pairs, scored by both metrics:

| pair | BERT P | BERT R | Align P (GT→cand) | Align R (cand→GT) |
|---|---|---|---|---|
| weather (paraphrase) | 0.875 | 0.755 | 0.958 | 0.990 |
| **blue vs red (CONTRADICTION)** | **0.977** | **0.977** | **0.0003** | **0.0003** |
| customer mgmt (real paraphrase) | 0.634 | 0.679 | 0.855 | 0.908 |

- **BERTScore is fooled by the contradiction** (0.977 — nearly every word matches,
  only "blue"→"red" changed) and **penalises the honest paraphrase** (0.63/0.68 —
  the wording was restructured). Its ranking is *backwards* for faithfulness.
- **AlignScore is correct in both**: the contradiction collapses to ~0, the honest
  paraphrase stays high (~0.86–0.91). It scores *support*, not surface form.

Regenerate: `demo_two_examples.py` (BERTScore) and `demo_alignscore.py` (AlignScore).

---

## How AlignScore works, and how it is obtained

(Zha, Yang, Li & Hu, *AlignScore: Evaluating Factual Consistency with a Unified
Alignment Function*, ACL 2023, arXiv:2305.16739. Mechanics confirmed against the
installed `alignscore` source.)

### It is a *learned* metric, not an embedding formula

BERTScore takes a **frozen** language model and just reads out cosine similarity
of its embeddings — no training. AlignScore is the opposite: it is a RoBERTa
encoder **fine-tuned end-to-end as a classifier** to answer one question —
*given a context and a claim, is the claim supported by the context?* You do not
compute AlignScore from a raw model; you download the **already-trained ALIGN
checkpoint** and run it.

**How the checkpoint is obtained (their training, not ours):** the authors unify
**4.7M examples from 7 task families** — NLI, QA, paraphrase, fact verification,
information retrieval, semantic textual similarity, and summarization — into one
common shape `(context, claim, label)`. A single shared RoBERTa encoder is trained
with **three output heads** at once:
- **3-way** head → {entailment, neutral, contradiction}
- **binary** head → {aligned, not-aligned}
- **regression** head → a 0–1 alignment score

Training on this much cross-task alignment data is exactly *why* it beats
embedding-similarity metrics: it has learned what "supported by" means, not just
what "looks alike" means. We reuse their released checkpoint — we do **not** retrain.

### How a score is produced at inference (`nli_sp` mode)

`ALIGN(context, claim)` is **directional**. For one (context, claim) pair:

1. **Split the context** into ~350-word chunks; **split the claim** into sentences
   (spaCy/NLTK). This is what lets it handle long prompts without the 512-token
   truncation that limits BERTScore.
2. For every (context-chunk, claim-sentence) pair, run RoBERTa and take the
   **3-way head's ENTAILMENT probability** as the pairwise alignment
   (`inference.py`: `tri_label` softmax, column 0).
3. **Aggregate (SplitSum):** for each claim sentence take the **max** over context
   chunks (the claim only needs *one* place in the source to back it), then take
   the **mean** over claim sentences:

   `AlignScore = mean_i ( max_k  ENTAIL(context_chunk_k, claim_sentence_i) )`

Output is in **[0, 1]** (raw — not baseline-rescaled like BERTScore, so read it as
a ranking / support probability, not a "% identical").

### Directionality → precision and recall

Because it is directional, each candidate is scored **twice**:

- **precision / traceability** = `ALIGN(context = ground-truth, claim = candidate)`
  → low means the candidate says things the GT does **not** support → *fabricated /
  non-traceable content* (the core RQ).
- **recall / coverage** = `ALIGN(context = candidate, claim = ground-truth)`
  → low means a GT requirement is **not** supported by the candidate → *dropped
  requirement*.

## Why RoBERTa for AlignScore but DeBERTa for BERTScore

They are chosen for **opposite reasons**, because the model is used in opposite ways:

- **BERTScore uses the model frozen, for embeddings.** There, embedding quality is
  everything, so we pick the strongest *frozen* encoder for semantic matching:
  **DeBERTa-xlarge-MNLI** (disentangled attention + MNLI fine-tuning → the highest
  human-correlation backbone the BERTScore authors recommend).
- **AlignScore uses the model fine-tuned, as a classifier.** The value is not in
  the backbone's raw embeddings but in the **4.7M-example alignment training**. The
  released ALIGN checkpoint simply *is* a fine-tuned **RoBERTa** — there is no
  DeBERTa checkpoint, and swapping the backbone would mean retraining the whole
  alignment function from scratch. So you use RoBERTa here because that is what
  ALIGN was trained on; the encoder is almost incidental next to the training data.

In short: **DeBERTa powers the *similarity* axis (frozen embeddings), RoBERTa powers
the *support* axis (learned alignment).** Each backbone is the right tool for its
own metric, and mixing them up would be a category error.

We use **AlignScore-base** (RoBERTa-base) rather than -large purely to save disk;
`nli_sp` on base is already strong on short requirement units. Upgrade to -large if
scores look noisy.

---

## Requirement level

A master prompt is a long multi-requirement document. Both axes are also applied at
the **requirement level**: each text is split into atomic requirement units (one per
sentence/bullet, `common.split_requirements`), scored per unit pair, then aggregated
with a max-align matrix. This (a) keeps every unit well under any token limit and
(b) yields the diagnostic table — *which* GT requirement was dropped, *which*
candidate requirement is non-traceable. Grounded in Pyramid/SCU (Nenkova &
Passonneau 2004), FACTScore atomic facts (Min et al. 2023), and the sentence-matrix
aggregation of SummaC (Laban et al. 2022).

## Environments (everything on D: — the C: drive is nearly full)

Two isolated venvs, because AlignScore pins old dependencies (torch 1.12.1,
transformers 4.30) that conflict with BERTScore's modern stack:

| venv | Python | Holds | Model cache |
|---|---|---|---|
| `.venv/` | 3.13 | BERTScore (`bert-score`, modern torch) | `C:\Users\Admin\.cache\huggingface` (deberta already there) |
| `.venv-align/` | 3.10 | AlignScore (`alignscore`, torch 1.12.1 CPU) | `.models/hf` on D |

All AlignScore artifacts live under `.models/` on D: the repo clone, the
`AlignScore-base.ckpt` (~1.9 GB), the HF cache, and the pip/tmp caches. Set the
redirect env vars before running anything in the align venv:

```bash
export HF_HOME="D:/Coding_Stuffs/Thesis/Evaluation/.models/hf"
export TMPDIR="D:/Coding_Stuffs/Thesis/Evaluation/.models/tmp"
```

## Install

**BERTScore venv** (already set up):
```bash
py -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt
```

**AlignScore venv** (Python 3.10, CPU torch, caches forced to D):
```bash
export PIP_CACHE_DIR="D:/Coding_Stuffs/Thesis/Evaluation/.models/pipcache"
export TMPDIR="D:/Coding_Stuffs/Thesis/Evaluation/.models/tmp"
<py3.10> -m venv .venv-align
.venv-align/Scripts/python.exe -m pip install "torch==1.12.1+cpu" --index-url https://download.pytorch.org/whl/cpu
git clone --depth 1 https://github.com/yuh-zha/AlignScore.git .models/AlignScore
.venv-align/Scripts/python.exe -m pip install ./.models/AlignScore
.venv-align/Scripts/python.exe -m pip install "transformers==4.30.2"   # downgrade for torch 1.12 compat
.venv-align/Scripts/python.exe -m spacy download en_core_web_sm
.venv-align/Scripts/python.exe -c "import nltk; nltk.download('punkt_tab'); nltk.download('punkt')"
# checkpoint -> D:
curl -L -o .models/AlignScore-base.ckpt https://huggingface.co/yzha/AlignScore/resolve/main/AlignScore-base.ckpt
```

## Run

```bash
# BERTScore (venv 3.13)
PYTHONIOENCODING=utf-8 .venv/Scripts/python.exe src/demo_two_examples.py   # 3-pair sanity demo
.venv/Scripts/python.exe src/run.py                                        # full dataset -> CSV + summary

# AlignScore (venv 3.10, D caches)
HF_HOME=.../.models/hf TMPDIR=.../.models/tmp \
  .venv-align/Scripts/python.exe src/demo_alignscore.py                    # 3-pair, both directions
```

Score one BERTScore pair ad hoc:
```bash
.venv/Scripts/python.exe src/textual_fidelity.py path/to/candidate.md path/to/ground_truth.md
```

## Data layout — you place every file by hand

```
data/<project>/
  ground_truth.md            # human-consolidated reference (see EXPERT_BRIEF.md)
  candidates/<Agent>__<type>.md   # one master prompt per file; filename = row label
```
`<type>` ∈ `basic_prompt` | `loose_consolidate` | `strict_consolidate`.
`<!-- HTML comments -->` are stripped before scoring.

## Folder layout

```
Evaluation/
  README.md  METRICS_JUSTIFICATION.md  EXPERT_BRIEF.md  requirements.txt
  src/
    common.py             # paths, IO, text cleaning, split_requirements
    textual_fidelity.py   # BERTScore P/R/F1 + requirement_prf; CLI
    requirement_level.py  # requirement-level BERTScore CLI / demo
    demo_two_examples.py  # 3-pair BERTScore sanity demo
    demo_alignscore.py    # 3-pair AlignScore demo (both directions)
    run.py                # scores every candidate -> CSV + summary.md
  data/<project>/{ground_truth.md, candidates/*.md}
  outputs/                # CSVs, summary.md, demo_*.md
  .venv/ .venv-align/     # the two environments
  .models/                # AlignScore repo, checkpoint, HF/pip/tmp caches (all on D)
```

## Notes

- `ground_truth.md` files are **drafts** — confirm each matches the intent fed to
  the agents before trusting numbers (see `EXPERT_BRIEF.md` for the expert flow).
- AlignScore is directional → always run **both** directions; do not average one
  direction and call it F1.
- Both models were validated on sentence/short-text and NLG-faithfulness data, not
  requirement text — a domain shift to disclose in Limitations.
