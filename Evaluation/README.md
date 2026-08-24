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

| pair | BERTScore precision | AlignScore (GT→cand) |
|---|---|---|
| weather (paraphrase) | 0.87 | 0.84 |
| **blue vs red (CONTRADICTION)** | **0.98** | **0.0002** |
| customer mgmt (real paraphrase) | 0.63 | 0.87 |

- **BERTScore is fooled by the contradiction** (0.98 — nearly every word matches,
  only "blue"→"red" changed) and **penalises the honest paraphrase** (0.63 —
  the wording was restructured). Its ranking is *backwards* for faithfulness.
- **AlignScore is correct in both**: the contradiction collapses to ~0, the honest
  paraphrase stays high (0.87). It scores *support*, not surface form.

Regenerate: `demo_two_examples.py` (BERTScore) and `demo_align3_large.py` (AlignScore-large).

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

### One direction only (single score)

`ALIGN(context, claim)` is directional, but this thesis reports **one** score per
candidate, in the metric's canonical direction:

- **AlignScore** = `ALIGN(context = ground-truth, claim = candidate)`
  → low means the candidate says things the GT does **not** support → *fabricated /
  non-traceable content* (the core RQ).

The reverse direction (coverage → dropped requirements) is **not** reported
automatically; dropped requirements are caught in the manual traceability pass.
BERTScore is likewise reported as **precision only** (share of the candidate
anchored in the GT), the same faithfulness axis as AlignScore.

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

We use **AlignScore-large** (RoBERTa-large) — the strongest released checkpoint per
the AlignScore paper. `run_align.py --size base` is still available (RoBERTa-base,
faster, was the original disk-saving default) if you need a quick/cheap re-check.

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

## Environments

Two isolated venvs, because AlignScore pins old dependencies (torch 1.12.1,
transformers 4.30) that conflict with BERTScore's modern stack:

| venv | Python | Holds | Model cache |
|---|---|---|---|
| `.venv/` | 3.13 | BERTScore (`bert-score`, modern torch) | default HF cache (`~/.cache/huggingface`) |
| `.venv-align/` | 3.10 | AlignScore (`alignscore`, torch 1.12.1 CPU) | `.models/hf` (local to this folder) |

All AlignScore artifacts live under `.models/` (repo-local, gitignored): the
`AlignScore-large.ckpt` (~4.6 GB, used by default) and optionally `AlignScore-base.ckpt`
(~1.9 GB, `--size base`), the HF cache, and the pip/tmp caches. Set the
redirect env vars before running anything in the align venv (point them anywhere with
enough free disk space if `.models/` isn't practical on your machine):

```bash
export HF_HOME="$(pwd)/.models/hf"
export TMPDIR="$(pwd)/.models/tmp"
```

## Install

**BERTScore venv** (already set up):
```bash
py -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt
```

**AlignScore venv** (Python 3.10, CPU torch, caches kept repo-local under `.models/`):
```bash
export PIP_CACHE_DIR="$(pwd)/.models/pipcache"
export TMPDIR="$(pwd)/.models/tmp"
<py3.10> -m venv .venv-align
.venv-align/Scripts/python.exe -m pip install "torch==1.12.1+cpu" --index-url https://download.pytorch.org/whl/cpu
git clone --depth 1 https://github.com/yuh-zha/AlignScore.git .models/AlignScore
.venv-align/Scripts/python.exe -m pip install ./.models/AlignScore
.venv-align/Scripts/python.exe -m pip install "transformers==4.30.2"   # downgrade for torch 1.12 compat
.venv-align/Scripts/python.exe -m spacy download en_core_web_sm
.venv-align/Scripts/python.exe -c "import nltk; nltk.download('punkt_tab'); nltk.download('punkt')"
# checkpoints (large is the one actually used by default; base is optional)
curl -L -o .models/AlignScore-large.ckpt https://huggingface.co/yzha/AlignScore/resolve/main/AlignScore-large.ckpt
curl -L -o .models/AlignScore-base.ckpt https://huggingface.co/yzha/AlignScore/resolve/main/AlignScore-base.ckpt
```

## Run

```bash
# BERTScore foil (venv 3.13)
PYTHONIOENCODING=utf-8 .venv/Scripts/python.exe src/demo_two_examples.py   # 2-pair BERTScore sanity demo

# AlignScore (venv 3.10, D caches)
HF_HOME=.../.models/hf TMPDIR=.../.models/tmp \
  .venv-align/Scripts/python.exe src/demo_align3_large.py                  # 3-pair demo (tab:demo-pairs)
HF_HOME=.../.models/hf TMPDIR=.../.models/tmp \
  .venv-align/Scripts/python.exe src/score_requirements.py <project> data/<project>/candidates_atomic/<Agent>__<type>.md   # requirement-level AlignScore (MAIN)
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
    common.py             # paths, IO, text cleaning, split_requirements, load_atomic_requirements
    decompose_prompts.py  # Claimify decomposition (candidate/gold modes)
    score_requirements.py # requirement-level AlignScore (each candidate requirement vs whole GT) -- MAIN
    run_align.py          # AlignScore: single (document-level) score per candidate
    textual_fidelity.py   # BERTScore (precision) -- foil only
    demo_two_examples.py  # 2-pair BERTScore sanity demo (foil)
    demo_align3_large.py  # 3-pair AlignScore-large demo (tab:demo-pairs)
  data/<project>/{ground_truth.md, candidates/*.md, candidates_atomic/*.md}
  outputs/                # requirement-level result .txt, demo_*.md
  .venv/ .venv-align/     # the two environments
  .models/                # AlignScore repo, checkpoint, HF/pip/tmp caches (all on D)
```

## Notes

- `ground_truth.md` files are **drafts** — confirm each matches the intent fed to
  the agents before trusting numbers (see `EXPERT_BRIEF.md` for the expert flow).
- AlignScore is reported as a **single** score, `ALIGN(context=GT, claim=candidate)`;
  the reverse direction is not reported (dropped requirements are caught in the
  manual pass). BERTScore is reported as **precision** only, the same faithfulness axis.
- Both models were validated on sentence/short-text and NLG-faithfulness data, not
  requirement text — a domain shift to disclose in Limitations.
