"""Per-candidate requirement-level AlignScore dump for a whole project.

Produces the combined report (summary table + per-candidate worst-first requirement
listing) for every consolidation approach x agent that has an atomic file, in one model
load. Same metric as score_requirements.py -- AlignScore(context = ground truth,
claim = each hand-split atomic requirement) -- reported at two untraceable thresholds
(.25 and .5). This regenerates outputs/<project>_req_align.txt for simple_portal and
creates the matching one for hard_erp.

Runs in .venv-align (py3.10).
Run:
  HF_HOME=.models/hf TMPDIR=.models/tmp .venv-align/Scripts/python.exe \
    src/req_align_dump.py <project> [--size large]
"""
from __future__ import annotations
import argparse
from pathlib import Path

from common import DATA, OUT, clean_prompt, ensure_dir, load_atomic_requirements, read_text
from run_align import MODELS

APPROACHES = ["basic_prompt", "loose_consolidate", "strict_consolidate",
              "strict_plus_log", "spec_guided"]
AGENTS = ["Claude", "Codex", "Gemini"]
_SHORT = {"basic_prompt": "basic", "loose_consolidate": "loose",
          "strict_consolidate": "strict", "strict_plus_log": "strict+log",
          "spec_guided": "spec"}


def main() -> None:
    ap = argparse.ArgumentParser(description="Per-candidate requirement-level AlignScore dump for a project.")
    ap.add_argument("project", help="project folder under data/, e.g. hard_erp")
    ap.add_argument("--size", choices=list(MODELS), default="large")
    args = ap.parse_args()

    gt = clean_prompt(read_text(DATA / args.project / "ground_truth.md"))
    atomic_dir = DATA / args.project / "candidates_atomic"

    cfg = MODELS[args.size]
    from alignscore import AlignScore
    scorer = AlignScore(model=cfg["model"], batch_size=32, device="cpu",
                        ckpt_path=cfg["ckpt"], evaluation_mode="nli_sp")

    ensure_dir(OUT)
    out = OUT / f"{args.project}_req_align.txt"

    # score every present candidate once; checkpoint the file after EACH candidate so a
    # stop mid-run leaves a valid partial report instead of nothing.
    cands: dict[str, list[tuple[float, str]]] = {}   # label -> [(score, req), ...]
    for agent in AGENTS:
        for approach in APPROACHES:
            f = atomic_dir / f"{agent}__{approach}.md"
            if not f.exists():
                continue
            reqs = load_atomic_requirements(read_text(f))
            if not reqs:
                continue
            scores = [float(s) for s in scorer.score(contexts=[gt] * len(reqs), claims=reqs)]
            cands[f"{agent}__{approach}"] = list(zip(scores, reqs))
            out.write_text(render(args.project, cands) + "\n", encoding="utf-8")  # checkpoint
            print(f"  scored {agent}__{approach} ({len(reqs)} reqs) -> checkpoint written")

    final = render(args.project, cands)
    out.write_text(final + "\n", encoding="utf-8")
    print(final)
    print(f"\nwrote {out}")


def render(project: str, cands: dict[str, list[tuple[float, str]]]) -> str:
    """Build the full report text (summary table + per-agent progression + per-candidate
    worst-first requirement dump) from whatever candidates have been scored so far."""
    def mean(label: str) -> float:
        rows = cands[label]
        return sum(s for s, _ in rows) / len(rows)

    def untr(label: str, tau: float) -> float:
        rows = cands[label]
        return sum(1 for s, _ in rows if s < tau) / len(rows)

    L: list[str] = []
    L.append(f"GT context = {project} ground_truth.md (whole-GT)")
    L.append(f"{'candidate':<32} {'units':>5}   {'mean':>4}  {'untr@.25':>8}  {'untr@.5':>7}")
    for agent in AGENTS:
        for approach in APPROACHES:
            label = f"{agent}__{approach}"
            if label not in cands:
                continue
            L.append(f"{label:<32} {len(cands[label]):>5}  {mean(label):>5.3f}     "
                     f"{untr(label,0.25):>4.0%}     {untr(label,0.5):>4.0%}")
    L.append("")
    for agent in AGENTS:   # per-agent progression across whatever approaches are present
        parts = [f"{_SHORT[a]} {mean(f'{agent}__{a}'):.3f}"
                 for a in APPROACHES if f"{agent}__{a}" in cands]
        if parts:
            L.append(f"{agent}: " + " -> ".join(parts))

    L.append("")
    L.append("--- all requirements per candidate (score + full requirement, worst first) ---")
    for agent in AGENTS:
        for approach in APPROACHES:
            label = f"{agent}__{approach}"
            if label not in cands:
                continue
            L.append("")
            L.append(f"[{label}]  mean {mean(label):.3f}  units {len(cands[label])}  "
                     f"untraceable@.5 {untr(label,0.5):.0%}")
            for s, req in sorted(cands[label], key=lambda x: x[0]):
                flag = "   <-- untraceable" if s < 0.5 else ""
                L.append(f"  {s:.4f}  {req}{flag}")
    return "\n".join(L)


if __name__ == "__main__":
    main()
