"""Per-requirement recall diagnostic (AlignScore).

For one project+candidate: split the GROUND TRUTH into requirement sentences and
score each one against the WHOLE candidate (context=candidate, claim=gt_sentence).
Low score = that GT requirement is weakly entailed by the candidate -> inspect
whether it was truly dropped or merely reworded/merged.

Run (venv-align):
  HF_HOME=... .venv-align/Scripts/python.exe src/diag_recall.py <project> <cand_label> [<cand_label> ...]
"""
from __future__ import annotations
import sys

from common import DATA, clean_prompt, read_text, split_requirements

CKPT = "D:/Coding_Stuffs/Thesis/Evaluation/.models/AlignScore-base.ckpt"


def main() -> None:
    project = sys.argv[1]
    labels = sys.argv[2:]
    gt_raw = read_text(DATA / project / "ground_truth.md")
    gt_reqs = split_requirements(gt_raw)

    from alignscore import AlignScore
    scorer = AlignScore(model="roberta-base", batch_size=32, device="cpu",
                        ckpt_path=CKPT, evaluation_mode="nli_sp")

    for label in labels:
        cand = clean_prompt(read_text(DATA / project / "candidates" / f"{label}.md"))
        # recall per GT requirement = ALIGN(context=candidate, claim=gt_req)
        scores = scorer.score(contexts=[cand] * len(gt_reqs), claims=gt_reqs)
        pairs = sorted(zip(gt_reqs, scores), key=lambda x: x[1])
        print(f"\n=== {project}/{label}  (mean recall = {sum(scores)/len(scores):.3f}) ===")
        for req, s in pairs:
            print(f"  {s:.3f}  {req}")


if __name__ == "__main__":
    main()
