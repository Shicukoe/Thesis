"""Sanity demo: run AlignScore on the same THREE pairs, in BOTH directions.

Runs in the SEPARATE align venv (.venv-align, py3.10) with the official
`alignscore` package + AlignScore-base checkpoint, evaluation_mode='nli_sp'.

AlignScore is DIRECTIONAL: ALIGN(context, claim) = "is the claim supported by
the context". So each pair is scored twice:

  precision / traceability : context = ground-truth, claim = candidate
                             (low -> candidate has non-traceable/fabricated content)
  recall / coverage        : context = candidate,    claim = ground-truth
                             (low -> a ground-truth requirement was dropped)

Expected contrast vs BERTScore:
  1. weather (paraphrase)      -> both fairly high (meaning entailed)
  2. blue vs red (contradiction) -> LOW  (AlignScore catches what BERTScore missed)
  3. customer mgmt (paraphrase) -> both HIGH (AlignScore does NOT punish honest paraphrase)

Run:  .venv-align/Scripts/python src/demo_alignscore.py
Out:  outputs/demo_alignscore.md
"""
from __future__ import annotations
import os
from pathlib import Path

CKPT = "D:/Coding_Stuffs/Thesis/Evaluation/.models/AlignScore-base.ckpt"
OUT = Path("D:/Coding_Stuffs/Thesis/Evaluation/outputs/demo_alignscore.md")

# label, ground-truth, candidate
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

NOTE = """# Demo: three pairs through AlignScore (both directions)

> **What this file is.** The SAME three pairs as `demo_two_examples.md` (BERTScore),
> now scored with **AlignScore-base** (`nli_sp`), which measures **support/entailment**,
> not similarity. AlignScore is directional, so each pair is scored twice:
>
> - **precision** = ALIGN(context=ground-truth, claim=candidate) -> is the candidate
>   *supported by* the GT? (low = non-traceable / fabricated content)
> - **recall**    = ALIGN(context=candidate, claim=ground-truth) -> is the GT
>   *covered by* the candidate? (low = dropped requirement)
>
> Read against BERTScore:
> - Pair 2 (blue vs red) is the key: BERTScore scored it ~0.98 (blind to the
>   contradiction); AlignScore should score it LOW in both directions.
> - Pair 3 (customer mgmt) checks the opposite worry: an honest paraphrase should
>   stay HIGH -> AlignScore does not penalise rewording, only broken support.
>
> Scores are in [0,1] (raw, not baseline-rescaled). Model: AlignScore-base (roberta-base).

"""


def main() -> None:
    from alignscore import AlignScore  # only available in .venv-align

    scorer = AlignScore(model="roberta-base", batch_size=32, device="cpu",
                        ckpt_path=CKPT, evaluation_mode="nli_sp")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(NOTE, encoding="utf-8")  # note FIRST

    lines = ["| pair | ground-truth | candidate | precision (GT->cand) | recall (cand->GT) |",
             "|---|---|---|---|---|"]
    for label, gt, cand in PAIRS:
        prec = scorer.score(contexts=[gt], claims=[cand])[0]     # cand supported by GT
        rec = scorer.score(contexts=[cand], claims=[gt])[0]      # GT supported by cand
        lines.append(f"| {label} | {gt} | {cand} | {prec:.4f} | {rec:.4f} |")
        print(f"  {label}: precision={prec:.4f}  recall={rec:.4f}")

    with OUT.open("a", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
