"""AlignScore precision + recall for every candidate master prompt.

Runs in .venv-align (py3.10). Directional, so each candidate is scored twice:
  precision = ALIGN(context=ground-truth, claim=candidate)  -> non-traceable/fabricated
  recall    = ALIGN(context=candidate,    claim=ground-truth) -> dropped requirement

SplitSum handles long prompts internally (no 512 truncation). Writes
outputs/alignscore.csv, which run_combined.py merges with BERTScore.

Run:
  HF_HOME=.../.models/hf TMPDIR=.../.models/tmp \
    .venv-align/Scripts/python.exe src/run_align.py
"""
from __future__ import annotations

from common import DATA, OUT, clean_prompt, ensure_dir, read_text, write_csv
from run import discover  # reuse the same project/candidate discovery

CKPT = "D:/Coding_Stuffs/Thesis/Evaluation/.models/AlignScore-base.ckpt"
_COLS = ["project", "candidate", "align_precision", "align_recall"]


def main() -> None:
    from alignscore import AlignScore

    items = []  # (project, label, cand_text, gt_text)
    for project, gt, cands in discover(DATA):
        if not gt:
            continue
        for label, path in cands:
            ctext = clean_prompt(read_text(path))
            if ctext:
                items.append((project, label, ctext, gt))
    if not items:
        print("No candidates found.")
        return

    scorer = AlignScore(model="roberta-base", batch_size=32, device="cpu",
                        ckpt_path=CKPT, evaluation_mode="nli_sp")

    gts = [g for _, _, _, g in items]
    cands = [c for _, _, c, _ in items]
    precision = scorer.score(contexts=gts, claims=cands)    # candidate supported by GT
    recall = scorer.score(contexts=cands, claims=gts)       # GT supported by candidate

    rows = []
    for (project, label, _, _), p, r in zip(items, precision, recall):
        rows.append({"project": project, "candidate": label,
                     "align_precision": round(float(p), 4), "align_recall": round(float(r), 4)})
        print(f"  {project}/{label}: P={p:.4f} R={r:.4f}")

    ensure_dir(OUT)
    write_csv(OUT / "alignscore.csv", rows, fieldnames=_COLS)
    print(f"wrote {OUT / 'alignscore.csv'} ({len(rows)} candidates)")


if __name__ == "__main__":
    main()
