"""Semantic Textual Fidelity (BERTScore).

Compares each generated master prompt against the project ground-truth master
prompt and reports BERTScore **Precision / Recall / F1** (Zhang et al., ICLR 2020,
arXiv:1904.09675).

Why only BERTScore (token overlap removed): consolidating a long prompt history
into one master prompt necessarily paraphrases and reorders requirements, so
word-level unigram overlap is unfairly low and measures surface form, not meaning.
BERTScore matches tokens by *contextual-embedding cosine similarity*, so it credits
paraphrase and is order-insensitive - the right instrument for this comparison.
Its P/R decomposition still gives the add-vs-drop diagnostic (precision = agent's
content anchored in the reference; recall = reference content the agent preserved),
now at the semantic level instead of the lexical one.

Model choice (see METRICS_JUSTIFICATION.md):
  - deberta : microsoft/deberta-xlarge-mnli - highest human-correlation model per
              the bert_score authors ("the best model ... please consider using it
              instead of the default roberta-large"). Rescaled with baseline. 512-tok cap.
  - roberta : roberta-large L17 - the library default for English. Rescaled. 512-tok cap.

Both cap at 512 tokens; long prompts are TRUNCATED (see over_limit). Length-robust
faithfulness is handled by AlignScore instead (SplitSum, no truncation) - see
run_align.py; BERTScore here is the semantic-similarity / paraphrase axis.
"""
from __future__ import annotations
import argparse

# ------------------------------------------------------------ model presets
# num_layers=None -> bert_score uses its validated default layer for that model.
# rescale=True needs a shipped baseline (both deberta and roberta have one).
MODELS = {
    "deberta": dict(model="microsoft/deberta-xlarge-mnli", num_layers=None, rescale=True, max_tokens=512),
    "roberta": dict(model="roberta-large",                 num_layers=None, rescale=True, max_tokens=512),
}
DEFAULT_MODEL = "deberta"


def count_tokens(text: str, model_key: str = DEFAULT_MODEL) -> int:
    """Subword-token length of `text` under the chosen model's tokenizer, incl.
    special tokens - used to warn before BERTScore silently truncates."""
    from transformers import AutoTokenizer  # type: ignore
    tok = AutoTokenizer.from_pretrained(MODELS[model_key]["model"])
    return len(tok.encode(text, add_special_tokens=True))


def over_limit(texts: list[str], labels: list[str], model_key: str = DEFAULT_MODEL) -> list[tuple[str, int]]:
    """Return (label, n_tokens) for every text that exceeds the model's window and
    would therefore be TRUNCATED (content silently dropped from the score)."""
    cfg = MODELS[model_key]
    out = []
    for t, lab in zip(texts, labels):
        n = count_tokens(t, model_key)
        if n > cfg["max_tokens"]:
            out.append((lab, n))
    return out


# ------------------------------------------------------------ BERTScore
def bert_prf(candidates: list[str], references: list[str],
             model_key: str = DEFAULT_MODEL) -> list[dict]:
    """BERTScore Precision / Recall / F1 for each candidate/reference pair.

    Returns one dict per pair: {bertscore_precision, bertscore_recall, bertscore_f1}.
    """
    try:
        from bert_score import score  # type: ignore
        import bert_score.utils as _bsu
    except ImportError:
        empty = {"bertscore_precision": "(install bert-score)",
                 "bertscore_recall": "(install bert-score)",
                 "bertscore_f1": "(install bert-score)"}
        return [dict(empty) for _ in candidates]

    cfg = MODELS[model_key]

    # deberta's tokenizer reports a giant sentinel model_max_length; bert-score
    # passes it as `max_length`, which overflows the C int in tokenizer.encode.
    # Cap it to the model's real window.
    _orig = _bsu.sent_encode

    def _capped(tokenizer, sent):
        if getattr(tokenizer, "model_max_length", 0) > cfg["max_tokens"]:
            tokenizer.model_max_length = cfg["max_tokens"]
        return _orig(tokenizer, sent)

    _bsu.sent_encode = _capped
    try:
        P, R, F1 = score(
            candidates, references,
            model_type=cfg["model"],
            num_layers=cfg["num_layers"],
            rescale_with_baseline=cfg["rescale"],
            lang="en",
            verbose=False,
        )
    finally:
        _bsu.sent_encode = _orig

    return [
        {"bertscore_precision": round(float(p), 4),
         "bertscore_recall": round(float(r), 4),
         "bertscore_f1": round(float(f), 4)}
        for p, r, f in zip(P, R, F1)
    ]


# ------------------------------------------------------------ requirement level
def requirement_prf(candidate: str, reference: str,
                    model_key: str = DEFAULT_MODEL) -> dict:
    """Requirement-level BERTScore: split both texts into requirement units, score
    every ref-unit vs cand-unit pair with BERTScore, then greedy max-align.

      Recall    = mean over reference units of their best match in the candidate
                  (low  -> a reference requirement was dropped)
      Precision = mean over candidate units of their best match in the reference
                  (low  -> a candidate requirement was fabricated)

    Each unit is short, so the model's 512-token window is never reached.
    Returns the P/R/F1 plus the units, the similarity matrix, and the worst-matched
    units (dropped / fabricated) for inspection.
    """
    from common import split_requirements

    ref_reqs = split_requirements(reference)
    cand_reqs = split_requirements(candidate)
    if not ref_reqs or not cand_reqs:
        return {"bertscore_precision": 0.0, "bertscore_recall": 0.0, "bertscore_f1": 0.0,
                "ref_reqs": ref_reqs, "cand_reqs": cand_reqs, "matrix": [],
                "dropped": [], "fabricated": []}

    # one flat BERTScore call over every (cand_j, ref_i) pair, then reshape to S[i][j]
    flat_c, flat_r = [], []
    for r in ref_reqs:
        for c in cand_reqs:
            flat_c.append(c)
            flat_r.append(r)
    f1 = [s["bertscore_f1"] for s in bert_prf(flat_c, flat_r, model_key)]
    nref, ncand = len(ref_reqs), len(cand_reqs)
    S = [f1[i * ncand:(i + 1) * ncand] for i in range(nref)]

    row_best = [max(row) for row in S]                                    # per reference unit
    col_best = [max(S[i][j] for i in range(nref)) for j in range(ncand)]  # per candidate unit
    recall = round(sum(row_best) / nref, 4)
    precision = round(sum(col_best) / ncand, 4)
    f1_agg = round(2 * precision * recall / (precision + recall), 4) if (precision + recall) else 0.0

    return {"bertscore_precision": precision, "bertscore_recall": recall,
            "bertscore_f1": f1_agg, "ref_reqs": ref_reqs, "cand_reqs": cand_reqs,
            "matrix": S,
            "dropped": sorted(zip(ref_reqs, row_best), key=lambda x: x[1]),
            "fabricated": sorted(zip(cand_reqs, col_best), key=lambda x: x[1])}


# ------------------------------------------------------------ CLI
def cli() -> None:
    ap = argparse.ArgumentParser(description="BERTScore P/R/F1 for one candidate vs reference.")
    ap.add_argument("candidate")
    ap.add_argument("reference")
    ap.add_argument("--model", choices=list(MODELS), default=DEFAULT_MODEL)
    a = ap.parse_args()
    from common import read_text, clean_prompt

    cand = clean_prompt(read_text(a.candidate))
    ref = clean_prompt(read_text(a.reference))
    for lab, n in over_limit([cand, ref], ["candidate", "reference"], a.model):
        print(f"[WARN] {lab} = {n} tokens > {MODELS[a.model]['max_tokens']}: will be TRUNCATED")
    row = bert_prf([cand], [ref], a.model)[0]
    for k, v in row.items():
        print(f"{k:20s}: {v}")


if __name__ == "__main__":
    cli()
