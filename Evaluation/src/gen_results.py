"""Generate empty per-model result-entry files for the RQ3 conflict experiment.

Both projects use the same two-phase handoff structure now, so one template serves both.
Reads each project's <project>_labels.json (conflicts with settled/conflicting prompts, plus
optional compatible_additions) so the scoring rows stay in sync with the answer key, and
writes data/conflict/results/<project>__<Model>.md.

Safety: a results file that already holds pasted content (no "(paste)" placeholder left) is
NOT overwritten, so filling one in is never clobbered by a re-run.

Run (no deps beyond stdlib):
  python src/gen_results.py
"""
from __future__ import annotations
import json
from pathlib import Path

CONFLICT = Path(__file__).resolve().parent.parent / "data" / "conflict"
RESULTS = CONFLICT / "results"
MODELS = ["Claude", "Codex", "Gemini"]
PROJECTS = {                       # project -> its labels file
    "hard_erp": "hard_erp_labels.json",
    "simple_portal": "simple_portal_labels.json",
}
SCORE_HEADER = "| Conflict | detected? | no-resolve? | no-invent? | provenance ok? |\n|---|---|---|---|---|"


def conflict_rows(d: dict) -> tuple[str, str]:
    rows = [f"| {c['id']} — settled p{c['settled']['prompt']} vs p{c['conflicting']['prompt']} |  |  |  |  |"
            for c in d["conflicts"]]
    comp = d.get("compatible_additions", [])
    ctrl = ""
    if comp:
        items = " · ".join(f"{x['id']} (p{x['prompt']})" for x in comp)
        ctrl = f"Positive control — {items}: folded into master prompt? · NOT flagged as a conflict? —"
    return "\n".join(rows), ctrl


def section(title: str, body: str, rows: str, ctrl: str, tail: str = "") -> str:
    out = [f"## {title}", "", body, "### Scoring", SCORE_HEADER, rows]
    if ctrl:
        out.append(ctrl)
    if tail:
        out.append(tail)
    return "\n".join(out) + "\n"


def results_file(project: str, model: str) -> str:
    d = json.loads((CONFLICT / PROJECTS[project]).read_text(encoding="utf-8"))
    rows, ctrl = conflict_rows(d)
    head = (
        f"# {project} — conflict results — {model}\n\n"
        f"Input: `{project}_conflict_history.md` · Conditions: `{project}_conflict_prompts.md` "
        f"· Answer key: `{PROJECTS[project]}`\n"
        f"Two-phase handoff: Phase 1 = master prompt **M** (data/{project}/ground_truth.md); "
        "Phase 2 = feed the later prompts against M. Every run starts with Step 0 (isolation "
        "prompt). Run each condition 2-3 times. Fill Y / N / partial.\n\n"
        f"## M handed off (Phase 1 artifact = data/{project}/ground_truth.md)\n"
        "```\n(paste M)\n```\n\n---\n\n"
    )
    c1 = section(
        "Condition 1 — Handoff, then ask (detection after the fact)",
        "### Updated master prompt (from 1a)\n```\n(paste)\n```\n"
        "### Detection answer (from 1b)\n```\n(paste)\n```\n",
        rows, ctrl)
    c2 = section(
        "Condition 2 — Handoff, do NOT resolve",
        "### Output\n```\n(paste)\n```\n",
        rows, ctrl, "Conflicting value left OUT of the master prompt body? (Y/N)")
    c3 = section(
        "Condition 3 — Spec-guided (Type 4, Level 0)",
        "### Output (## Master prompt + ## Unresolved conflicts)\n```\n(paste)\n```\n",
        rows, ctrl,
        "Master prompt body conflict-free? (Y/N) · Conflicts attributed to the right prompt? (Y/N)")
    return head + c1 + "\n" + c2 + "\n" + c3


def main() -> None:
    RESULTS.mkdir(parents=True, exist_ok=True)
    for project in PROJECTS:
        for model in MODELS:
            path = RESULTS / f"{project}__{model}.md"
            if path.exists():
                # Never overwrite an existing results file — it may hold pasted runs.
                # To regenerate after a template change, delete the target file first.
                print(f"skip {path.name} (exists — delete it first to regenerate)")
                continue
            path.write_text(results_file(project, model), encoding="utf-8")
            print(f"wrote {path.name}")


if __name__ == "__main__":
    main()
