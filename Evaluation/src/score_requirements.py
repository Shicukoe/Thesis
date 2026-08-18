"""Requirement-level AlignScore.

Document-level AlignScore (run_align.py) averages over the candidate's sentences, so a
few fabricated sentences get diluted by the many traceable ones. This script instead
scores each HAND-SPLIT atomic requirement of a candidate on its own, so an untraceable
requirement gets its own low score and is flagged, with no dilution.

For each candidate atomic requirement r:

    AlignScore(r) = ALIGN(context = ground_truth, claim = r)   in [0, 1]

Low = r is not supported by the ground truth = fabricated / non-traceable. It is the same
single canonical direction as run_align.py (context = the trusted reference, claim = the
text being judged), and the same checkpoint / API (nli_sp, large). Because context and
claim roles are unchanged, `nli_sp` still scores a plausible-but-unsupported requirement
(a NEUTRAL pair) low, so noise the ground truth never asked for pulls its score down.

Aggregate per candidate:
    requirement-level AlignScore = mean over the candidate's atomic requirements
    untraceable rate             = fraction with score < tau   (a precision-style number)

Input: a hand-written atomic-requirement file for the candidate (one requirement per line,
or `### Requirement N` blocks like requirements_split.md). Suggested location:
    data/<project>/candidates_atomic/<Agent>__<type>.md

Runs in .venv-align (py3.10).
Run:
  HF_HOME=.../.models/hf TMPDIR=.../.models/tmp \
    .venv-align/Scripts/python.exe src/score_requirements.py \
      <project> <cand_atomic_file> [--gt <path>] [--size large] [--tau 0.5]

Example:
  ... src/score_requirements.py hard_erp \
      data/hard_erp/candidates_atomic/Claude__strict_consolidate.md
"""
from __future__ import annotations
import argparse
from pathlib import Path

from common import DATA, OUT, clean_prompt, ensure_dir, load_atomic_requirements, read_text, write_csv
from run_align import MODELS  # reuse the same checkpoint config (base / large)

_COLS = ["req_id", "alignscore", "untraceable", "requirement"]


def main() -> None:
    ap = argparse.ArgumentParser(description="Requirement-level AlignScore for one candidate.")
    ap.add_argument("project", help="project folder under data/, e.g. hard_erp")
    ap.add_argument("cand_file", help="candidate atomic-requirement file (one req/line or '### Requirement' blocks)")
    ap.add_argument("--gt", default=None, help="ground-truth context (default: data/<project>/ground_truth.md)")
    ap.add_argument("--size", choices=list(MODELS), default="large")
    ap.add_argument("--tau", type=float, default=0.5, help="untraceable threshold (score < tau is flagged)")
    args = ap.parse_args()

    gt_path = Path(args.gt) if args.gt else DATA / args.project / "ground_truth.md"
    gt = clean_prompt(read_text(gt_path))                      # context = the trusted reference
    reqs = load_atomic_requirements(read_text(Path(args.cand_file)))
    if not reqs:
        print(f"No atomic requirements parsed from {args.cand_file}")
        return
    label = Path(args.cand_file).stem

    cfg = MODELS[args.size]
    from alignscore import AlignScore
    scorer = AlignScore(model=cfg["model"], batch_size=32, device="cpu",
                        ckpt_path=cfg["ckpt"], evaluation_mode="nli_sp")

    # AlignScore(context=GT, claim=requirement) for every candidate requirement
    scores = scorer.score(contexts=[gt] * len(reqs), claims=reqs)

    rows = []
    for i, (req, s) in enumerate(zip(reqs, scores), start=1):
        rows.append({"req_id": i, "alignscore": round(float(s), 4),
                     "untraceable": int(float(s) < args.tau), "requirement": req})

    mean = sum(r["alignscore"] for r in rows) / len(rows)
    untr = sum(r["untraceable"] for r in rows)
    ensure_dir(OUT)
    out_path = OUT / f"req_align_{args.project}_{label}.csv"
    write_csv(out_path, rows, fieldnames=_COLS)

    # print worst-first so fabricated / non-traceable requirements surface at the top
    print(f"\n=== {args.project}/{label}  (size={args.size}, tau={args.tau}) ===")
    print(f"requirement-level AlignScore (mean) = {mean:.4f}")
    print(f"untraceable requirements = {untr}/{len(rows)} = {untr/len(rows):.1%}\n")
    for r in sorted(rows, key=lambda x: x["alignscore"]):
        flag = "  <-- untraceable" if r["untraceable"] else ""
        print(f"  R{r['req_id']:>2} {r['alignscore']:.3f}  {r['requirement'][:90]}{flag}")
    print(f"\nwrote {out_path} ({len(rows)} requirements)")


if __name__ == "__main__":
    main()
