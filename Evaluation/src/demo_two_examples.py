"""Sanity demo: run BERTScore on TWO hand-picked sentence pairs and dump to a file.

Purpose: show, on the record, WHY BERTScore alone is not enough for a
traceability thesis. It scores both pairs below HIGH, even though only the first
is a faithful paraphrase and the second is a direct CONTRADICTION.

  1. weather     : paraphrase  -> SHOULD be high  (meaning preserved)  -> good
  2. blue vs red : contradiction -> BERTScore ALSO high (blind spot)   -> the problem

Run:  .venv/Scripts/python src/demo_two_examples.py
Out:  outputs/demo_two_examples.md
"""
from __future__ import annotations

from textual_fidelity import bert_prf, MODELS, DEFAULT_MODEL
from common import OUT, ensure_dir

PAIRS = [
    ("weather (paraphrase - meaning preserved)",
     "The weather is cold today.", "It is freezing today."),
    ("requirement (contradiction - blue vs red)",
     "A navigation label starting with H must have a blue background.",
     "A navigation label starting with H must have a red background."),
    ("customer mgmt (real paraphrase - GT vs Codex)",
     "Implement customer management with create, edit, delete, and browse operations.",
     "Include customer management: Users can create, edit, delete, and browse customers."),
]

NOTE = f"""# Demo: two sentence pairs through BERTScore

> **What this file is.** A minimal sanity check on exactly TWO sentence pairs, not
> the full dataset. It exists to document one point before we add an entailment
> metric: **BERTScore measures topical/semantic *similarity*, not *support*.**
>
> - Pair 1 (weather) is a faithful paraphrase -> a HIGH score is CORRECT.
> - Pair 2 (blue vs red) is a direct CONTRADICTION -> a HIGH score here is the
>   BLIND SPOT. Cosine similarity sees "same sentence, one word different" and
>   cannot tell that "red" negates "blue".
>
> If pair 2 also scores high, that is the evidence motivating an entailment /
> alignment metric (SummaC / AlignScore) as a second axis for the traceability RQ.
>
> Model: `{MODELS[DEFAULT_MODEL]['model']}`, rescaled with baseline. Scores are
> BERTScore P/R/F1 in [~0,1] after rescaling.

"""


def main() -> None:
    out = ensure_dir(OUT) / "demo_two_examples.md"
    out.write_text(NOTE, encoding="utf-8")  # note FIRST, before the slow model call

    cands = [c for _, _, c in PAIRS]
    refs = [r for _, r, _ in PAIRS]
    rows = bert_prf(cands, refs, DEFAULT_MODEL)

    lines = ["| pair | reference | candidate | P | R | F1 |",
             "|---|---|---|---|---|---|"]
    for (label, ref, cand), s in zip(PAIRS, rows):
        lines.append(f"| {label} | {ref} | {cand} | "
                     f"{s['bertscore_precision']} | {s['bertscore_recall']} | {s['bertscore_f1']} |")

    with out.open("a", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"wrote {out}")
    for (label, _, _), s in zip(PAIRS, rows):
        print(f"  {label}: F1={s['bertscore_f1']}")


if __name__ == "__main__":
    main()
