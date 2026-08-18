"""RQ1/RQ2 comparison table: requirement-level AlignScore for every consolidation
approach x every agent, in one run.

Reuses score_requirements.py's metric exactly -- AlignScore(context = ground truth,
claim = each hand-split atomic requirement of the candidate) -- but loads the checkpoint
ONCE and sweeps all candidates, so basic / loose / strict / spec_guided are directly
comparable per agent. A candidate whose atomic file is missing is shown as "-" and
skipped, so this runs today for basic/loose/strict and again as each spec_guided
(and optional strict_plus_log ablation) file lands.

Per candidate it reports:
    mean   = mean requirement-level AlignScore (higher = more faithful)
    untr%  = fraction of requirements with score < tau (added / non-traceable content)
    n      = number of atomic requirements

Runs in .venv-align (py3.10).
Run:
  HF_HOME=.models/hf TMPDIR=.models/tmp .venv-align/Scripts/python.exe \
    src/compare_rq12.py <project> [--size large] [--tau 0.5]
  (project omitted or 'all' -> every folder under data/ that has ground_truth.md)
"""
from __future__ import annotations
import argparse
from pathlib import Path

from common import DATA, OUT, clean_prompt, ensure_dir, load_atomic_requirements, read_text, write_csv
from run_align import MODELS

# column order = the story: single-pass basic -> loose -> strict, then the 4th approach,
# then the optional ablation rung.
APPROACHES = ["basic_prompt", "loose_consolidate", "strict_consolidate",
              "strict_plus_log", "spec_guided"]
AGENTS = ["Claude", "Codex", "Gemini"]
_COLS = ["project", "agent", "approach", "mean_alignscore", "untraceable_rate", "n_reqs"]


def _projects(arg: str) -> list[str]:
    if arg and arg != "all":
        return [arg]
    return sorted(p.name for p in DATA.iterdir()
                  if (p / "ground_truth.md").exists() and (p / "candidates_atomic").is_dir())


def main() -> None:
    ap = argparse.ArgumentParser(description="RQ1/RQ2 comparison: requirement-level AlignScore, all approaches x agents.")
    ap.add_argument("project", nargs="?", default="all", help="project folder under data/, or 'all'")
    ap.add_argument("--size", choices=list(MODELS), default="large")
    ap.add_argument("--tau", type=float, default=0.5, help="untraceable threshold (score < tau is flagged)")
    args = ap.parse_args()

    projects = _projects(args.project)
    if not projects:
        print("no projects found under data/")
        return

    cfg = MODELS[args.size]
    from alignscore import AlignScore
    scorer = AlignScore(model=cfg["model"], batch_size=32, device="cpu",
                        ckpt_path=cfg["ckpt"], evaluation_mode="nli_sp")

    rows: list[dict] = []
    for project in projects:
        gt = clean_prompt(read_text(DATA / project / "ground_truth.md"))
        atomic_dir = DATA / project / "candidates_atomic"
        print(f"\n{'='*72}\n{project}  (size={args.size}, tau={args.tau})\n{'='*72}")
        header = f"{'agent':<8} " + " ".join(f"{a.split('_')[0][:5]:>17}" for a in APPROACHES)
        print(header)
        print(f"{'':8} " + " ".join(f"{'mean untr%  n':>17}" for _ in APPROACHES))

        for agent in AGENTS:
            cells = []
            for approach in APPROACHES:
                f = atomic_dir / f"{agent}__{approach}.md"
                if not f.exists():
                    cells.append(f"{'-':>17}")
                    continue
                reqs = load_atomic_requirements(read_text(f))
                if not reqs:
                    cells.append(f"{'empty':>17}")
                    continue
                scores = [float(s) for s in scorer.score(contexts=[gt] * len(reqs), claims=reqs)]
                mean = sum(scores) / len(scores)
                untr = sum(1 for s in scores if s < args.tau) / len(scores)
                cells.append(f"{mean:>5.3f} {untr:>4.0%} {len(reqs):>3}")
                rows.append({"project": project, "agent": agent, "approach": approach,
                             "mean_alignscore": round(mean, 4),
                             "untraceable_rate": round(untr, 4), "n_reqs": len(reqs)})
            print(f"{agent:<8} " + " ".join(cells))

    ensure_dir(OUT)
    out = OUT / "rq12_comparison.csv"
    write_csv(out, rows, fieldnames=_COLS)
    print(f"\nwrote {out} ({len(rows)} candidate rows). Higher mean = more faithful; lower untr% = less added noise.")


if __name__ == "__main__":
    main()
