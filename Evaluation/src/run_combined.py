"""Combined report: AlignScore P/R (from alignscore.csv) + BERTScore P/R/F1.

Runs in .venv/ (py3.13, BERTScore). Computes BERTScore for every candidate,
merges the AlignScore columns produced by run_align.py, and writes one table.

Order to run:
  1) .venv-align/Scripts/python.exe src/run_align.py     # -> outputs/alignscore.csv
  2) .venv/Scripts/python.exe       src/run_combined.py  # -> outputs/combined.{csv,md}
"""
from __future__ import annotations

import textual_fidelity as tf
from common import DATA, OUT, clean_prompt, ensure_dir, read_text, read_csv, write_csv, write_text
from run import discover

_COLS = ["project", "candidate",
         "align_precision", "align_recall",
         "bertscore_precision", "bertscore_recall", "bertscore_f1"]


def main() -> None:
    ensure_dir(OUT)

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

    # warn on BERTScore truncation (deberta caps at 512; AlignScore is unaffected)
    trunc = tf.over_limit([c for _, _, c, _ in items], [f"{p}/{l}" for p, l, _, _ in items])
    if trunc:
        cap = tf.MODELS[tf.DEFAULT_MODEL]["max_tokens"]
        print(f"[WARN] BERTScore truncates {len(trunc)} candidate(s) at {cap} tokens "
              f"(AlignScore scores them in full):")
        for lab, n in trunc:
            print(f"        {lab}: {n} tokens")

    bert = tf.bert_prf([c for _, _, c, _ in items], [g for _, _, _, g in items])

    # AlignScore columns keyed by (project, candidate)
    align = {}
    apath = OUT / "alignscore.csv"
    if apath.exists():
        for r in read_csv(apath):
            align[(r["project"], r["candidate"])] = r
    else:
        print(f"[WARN] {apath} missing - run run_align.py first; AlignScore cols will be blank.")

    rows = []
    for (project, label, _, _), b in zip(items, bert):
        a = align.get((project, label), {})
        rows.append({"project": project, "candidate": label,
                     "align_precision": a.get("align_precision", ""),
                     "align_recall": a.get("align_recall", ""),
                     **b})

    write_csv(OUT / "combined.csv", rows, fieldnames=_COLS)
    _write_md(rows)
    print(f"Scored {len(rows)} candidates -> {OUT / 'combined.csv'} / combined.md")


def _write_md(rows: list[dict]) -> None:
    head = "| " + " | ".join(_COLS) + " |\n| " + " | ".join("---" for _ in _COLS) + " |\n"
    body = "".join("| " + " | ".join(str(r.get(c, "")) for c in _COLS) + " |\n" for r in rows)
    note = (
        "# Combined faithfulness report\n\n"
        f"AlignScore-base (`nli_sp`, [0,1] raw) + BERTScore (`{tf.MODELS[tf.DEFAULT_MODEL]['model']}`, "
        "baseline-rescaled). Each candidate scored against its project `ground_truth.md`.\n\n"
        "- **align_precision** = ALIGN(GT->candidate): candidate content *supported by* GT "
        "(low = fabricated / non-traceable).\n"
        "- **align_recall** = ALIGN(candidate->GT): GT content *covered by* candidate "
        "(low = dropped requirement).\n"
        "- **bertscore_\\*** = semantic-similarity P/R/F1 (surface-meaning, order-insensitive). "
        "Long candidates may be truncated at 512 tokens; AlignScore is not.\n\n"
    )
    write_text(OUT / "combined.md", note + head + body)


if __name__ == "__main__":
    main()
