"""Compute semantic textual-fidelity (BERTScore P/R/F1) for every candidate
master prompt.

For each project under data/, compares every candidate in candidates/*.md against
that project's ground_truth.md and writes:
    outputs/textual_fidelity.csv
    outputs/summary.md

Usage:
    py src/run.py                    # BERTScore with the proven default model (deberta)
    py src/run.py --model roberta    # library-default roberta-large L17 (also 512-cap)

Long prompts are truncated at 512 tokens (both models); length-robust faithfulness
is AlignScore's job (run_align.py / run_combined.py).
"""
from __future__ import annotations
import argparse
from pathlib import Path

import textual_fidelity as tf
from common import DATA, OUT, clean_prompt, ensure_dir, read_text, write_csv, write_text

_COLS = ["project", "candidate", "bertscore_precision", "bertscore_recall", "bertscore_f1"]


def discover(data_dir: Path):
    """Yield (project, ground_truth_text, [(label, path), ...]) per project."""
    for pdir in sorted(p for p in data_dir.iterdir() if p.is_dir()):
        gt = pdir / "ground_truth.md"
        cand_dir = pdir / "candidates"
        if not gt.exists() or not cand_dir.is_dir():
            continue
        cands = [(c.stem, c) for c in sorted(cand_dir.glob("*.md"))]
        yield pdir.name, clean_prompt(read_text(gt)), cands


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", choices=list(tf.MODELS), default=tf.DEFAULT_MODEL,
                    help="BERTScore embedding model (see textual_fidelity.MODELS)")
    args = ap.parse_args()

    ensure_dir(OUT)

    # (project, label, candidate_text, ground_truth_text)
    items = []
    for project, gt, cands in discover(DATA):
        if not gt:
            print(f"[skip] {project}: ground_truth.md is empty - paste your master prompt there.")
            continue
        if not cands:
            print(f"[skip] {project}: no candidates - add master prompts to candidates/*.md.")
            continue
        for label, path in cands:
            ctext = clean_prompt(read_text(path))
            if not ctext:
                print(f"[skip] {project}/{label}: empty - paste the master prompt into candidates/{path.name}.")
                continue
            items.append((project, label, ctext, gt))

    if not items:
        print("No candidates found. Add ground_truth.md and candidates/*.md under data/<project>/.")
        return

    # Warn before BERTScore silently truncates any prompt past the model's window.
    texts = [c for _, _, c, _ in items] + [g for _, _, _, g in {(p, "gt", "", g) for p, _, _, g in items}]
    labels = [f"{p}/{l}" for p, l, _, _ in items] + [f"{p}/ground_truth" for p in sorted({p for p, _, _, _ in items})]
    truncated = tf.over_limit(texts, labels, args.model)
    if truncated:
        cap = tf.MODELS[args.model]["max_tokens"]
        print(f"[WARN] model '{args.model}' truncates at {cap} tokens; {len(truncated)} input(s) exceed it:")
        for lab, n in truncated:
            print(f"        {lab}: {n} tokens (loses {n - cap})")
        print("        -> these scores are computed on TRUNCATED text; use AlignScore (run_align.py) for full-length faithfulness.")

    # BERTScore loads a model once, so batch it across all candidates.
    scores = tf.bert_prf([c for _, _, c, _ in items], [g for _, _, _, g in items], args.model)

    rows = []
    for (project, label, _, _), sc in zip(items, scores):
        rows.append({"project": project, "candidate": label, **sc})

    write_csv(OUT / "textual_fidelity.csv", rows, fieldnames=_COLS)
    _write_summary(rows, args)
    print(f"Scored {len(rows)} candidate master prompt(s) with model '{args.model}'.")
    print(f"Outputs -> {OUT}")


def _md_table(rows: list[dict], cols: list[str]) -> str:
    head = "| " + " | ".join(cols) + " |\n"
    sep = "| " + " | ".join("---" for _ in cols) + " |\n"
    body = "".join("| " + " | ".join(str(r.get(c, "")) for c in cols) + " |\n" for r in rows)
    return head + sep + body


def _write_summary(rows: list[dict], args) -> None:
    cfg = tf.MODELS[args.model]
    note = ("scores are **rescaled** with the shipped baseline (0 = no better than random, "
            "1 = identical); read them as proportions."
            if cfg["rescale"] else
            "scores are **RAW** (no baseline for this model): read them as a RANKING, not a percentage.")
    md = ["# Semantic Textual Fidelity (BERTScore)\n\n",
          f"Model: `{cfg['model']}`. Each candidate master prompt scored against its "
          f"project `ground_truth.md`. {note}\n\n",
          _md_table(rows, _COLS)]
    write_text(OUT / "summary.md", "".join(md))


if __name__ == "__main__":
    main()
