"""AlignScore for every candidate master prompt, used exactly as released in
the official repo (https://github.com/yuh-zha/AlignScore).

AlignScore is ONE function: ALIGN(context, claim) -> a single score in [0,1]
telling whether `claim` is factually supported by `context` (Zha et al.,
ACL 2023). It has NO precision/recall variant.

This thesis uses it in the metric's canonical direction only -- context = the
trusted reference (the human ground truth), claim = the text being judged
(the candidate master prompt):

  AlignScore = ALIGN(context=ground_truth, claim=candidate)

A high score means everything the candidate states is supported by the ground
truth (traceable); a low score means the candidate adds content the ground
truth does not support (non-traceable / fabricated). One number per candidate.

The API call matches the repo README verbatim: AlignScore(model=,
batch_size=32, device=, ckpt_path=, evaluation_mode='nli_sp') and
.score(contexts=, claims=). nli_sp = 3-way NLI head (aligned prob) with the
SplitSum aggregation (context -> ~350-token chunks, claim -> sentences, max
over chunks then mean), so long prompts are not truncated at 512 tokens.
Writes outputs/alignscore.csv, which run_combined.py merges with BERTScore.

Runs in .venv-align (py3.10).
Run:
  HF_HOME=.../.models/hf TMPDIR=.../.models/tmp \
    .venv-align/Scripts/python.exe src/run_align.py
"""
from __future__ import annotations
import argparse

from common import DATA, OUT, clean_prompt, ensure_dir, read_text, write_csv

MODELS = {
    "base":  dict(model="roberta-base",  ckpt="D:/Coding_Stuffs/Thesis/Evaluation/.models/AlignScore-base.ckpt"),
    "large": dict(model="roberta-large", ckpt="D:/Coding_Stuffs/Thesis/Evaluation/.models/AlignScore-large.ckpt"),
}
_COLS = ["project", "candidate", "alignscore"]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", choices=list(MODELS), default="large",
                    help="AlignScore checkpoint (base=roberta-base, large=roberta-large, stronger/slower)")
    args = ap.parse_args()
    cfg = MODELS[args.size]

    from alignscore import AlignScore
    from run import discover  # document-level candidate discovery (deprecated path; requirement-level is score_requirements.py / compare_rq12.py)

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

    scorer = AlignScore(model=cfg["model"], batch_size=32, device="cpu",
                        ckpt_path=cfg["ckpt"], evaluation_mode="nli_sp")
    print(f"AlignScore size={args.size} ({cfg['model']})")

    gts = [g for _, _, _, g in items]
    cands = [c for _, _, c, _ in items]
    # AlignScore = ALIGN(context=ground_truth, claim=candidate): the single
    # canonical direction (is the candidate supported by the ground truth?).
    align = scorer.score(contexts=gts, claims=cands)

    rows = []
    for (project, label, _, _), s in zip(items, align):
        rows.append({"project": project, "candidate": label,
                     "alignscore": round(float(s), 4)})
        print(f"  {project}/{label}: AlignScore={s:.4f}")

    ensure_dir(OUT)
    write_csv(OUT / "alignscore.csv", rows, fieldnames=_COLS)
    print(f"wrote {OUT / 'alignscore.csv'} ({len(rows)} candidates)")


if __name__ == "__main__":
    main()
