"""Requirement-level BERTScore - quick CLI / demo.

Splits both master prompts into requirement units (sentences / bullets), scores every
reference-vs-candidate unit pair with BERTScore, then greedy-aligns at the requirement
level. Each unit is short, so the model's 512-token window is never reached.

    py src/requirement_level.py                    # runs the BERTScore paper's weather demo
    py src/requirement_level.py cand.md ref.md     # score two files (or two literal strings)
    py src/requirement_level.py --model roberta     # pick the backbone
"""
from __future__ import annotations
import argparse
from pathlib import Path

from textual_fidelity import requirement_prf, MODELS, DEFAULT_MODEL


def _load(arg: str) -> str:
    p = Path(arg)
    return p.read_text(encoding="utf-8") if p.exists() else arg


def main() -> None:
    ap = argparse.ArgumentParser(description="Requirement-level BERTScore")
    ap.add_argument("candidate", nargs="?", help="candidate text or file path")
    ap.add_argument("reference", nargs="?", help="reference text or file path")
    ap.add_argument("--model", choices=list(MODELS), default=DEFAULT_MODEL)
    a = ap.parse_args()

    if a.candidate and a.reference:
        cand, ref = _load(a.candidate), _load(a.reference)
    else:  # BERTScore paper Figure-1 example
        ref, cand = "The weather is cold today.", "It is freezing today."
        print("(no args -> running the BERTScore paper's weather example)\n")

    r = requirement_prf(cand, ref, a.model)

    print(f"model: {MODELS[a.model]['model']}\n")
    print("reference units:")
    for u in r["ref_reqs"]:
        print(f"  - {u}")
    print("candidate units:")
    for u in r["cand_reqs"]:
        print(f"  - {u}")

    if r["matrix"]:
        print("\nrequirement-similarity matrix  S[ref][cand]:")
        for row in r["matrix"]:
            print("  " + "  ".join(f"{v:.3f}" for v in row))

    print(f"\nbertscore_precision : {r['bertscore_precision']}")
    print(f"bertscore_recall    : {r['bertscore_recall']}")
    print(f"bertscore_f1        : {r['bertscore_f1']}")

    if len(r["ref_reqs"]) > 1 and r["dropped"]:
        u, s = r["dropped"][0]
        print(f"\nleast-covered reference unit  (most 'dropped'):   {s:.3f}  \"{u}\"")
    if len(r["cand_reqs"]) > 1 and r["fabricated"]:
        u, s = r["fabricated"][0]
        print(f"least-anchored candidate unit (most 'fabricated'): {s:.3f}  \"{u}\"")


if __name__ == "__main__":
    main()
