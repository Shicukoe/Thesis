"""Shared utilities for the evaluation harness: paths, IO, text normalization,
and lightweight token metrics (no heavy deps)."""
from __future__ import annotations
import csv
import json
import re
from pathlib import Path

# ---------------------------------------------------------------- paths
# .../Evaluation/src/common.py  -> ROOT = .../Evaluation
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "outputs"


def ensure_dir(p: Path) -> Path:
    p.mkdir(parents=True, exist_ok=True)
    return p


# ---------------------------------------------------------------- IO
def read_text(p: Path) -> str:
    return Path(p).read_text(encoding="utf-8")


def write_text(p: Path, text: str) -> None:
    Path(p).parent.mkdir(parents=True, exist_ok=True)
    Path(p).write_text(text, encoding="utf-8")


def read_csv(p: Path) -> list[dict]:
    with open(p, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(p: Path, rows: list[dict], fieldnames: list[str] | None = None) -> None:
    Path(p).parent.mkdir(parents=True, exist_ok=True)
    if not rows and not fieldnames:
        Path(p).write_text("", encoding="utf-8")
        return
    fieldnames = fieldnames or list(rows[0].keys())
    with open(p, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in fieldnames})


def read_json(p: Path):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def write_json(p: Path, obj) -> None:
    Path(p).parent.mkdir(parents=True, exist_ok=True)
    Path(p).write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding="utf-8")


# ---------------------------------------------------------------- text
# ---- normalization so markdown formatting / copy-paste noise don't skew scores
_HTML_COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
_MD_LINK = re.compile(r"!?\[([^\]]*)\]\([^)]*\)")            # [text](url) / ![alt](url) -> text
_MD_RULE = re.compile(r"(?m)^[ \t]*([-*_=])\1{2,}[ \t]*$")  # --- *** ___ === divider lines
_MD_HEADER = re.compile(r"(?m)^[ \t]{0,3}#{1,6}[ \t]*")     # leading #, ##, ###
_MD_QUOTE = re.compile(r"(?m)^[ \t]{0,3}>[ \t]?")           # blockquote >
_MD_BULLET = re.compile(r"(?m)^[ \t]*(?:[-*+]|\d+[.)])[ \t]+")  # -, *, +, 1., 2) markers
_MD_EMPH = re.compile(r"[*`~]+")                            # bold / italic / code / strike
_WS = re.compile(r"\s+")


def clean_prompt(text: str) -> str:
    """Normalize a pasted master prompt before scoring so markdown formatting and
    copy-paste noise (extra blank lines / spaces, `**bold**`, `## headings`, `- bullets`,
    `` `code` ``, `[text](url)` links, `---` rules) do not skew the comparison. Only
    formatting is stripped; every word is kept.

    BERTScore reads the raw text, so this mainly makes scoring fair across a
    heavily-formatted candidate and a plain-prose ground truth (formatting tokens
    the transformer would otherwise embed are stripped; every word is kept)."""
    text = _HTML_COMMENT.sub(" ", text)
    text = _MD_LINK.sub(r"\1", text)
    text = _MD_RULE.sub(" ", text)
    text = _MD_HEADER.sub("", text)
    text = _MD_QUOTE.sub("", text)
    text = _MD_BULLET.sub("", text)
    text = _MD_EMPH.sub("", text)
    text = _WS.sub(" ", text)
    return text.strip()


# split a master prompt into requirement units (one per sentence or bullet) for
# requirement-level scoring; each unit is short, so it never hits the model's
# token limit.
_REQ_SPLIT = re.compile(r"(?<=[.!?])\s+|[\r\n]+")


def split_requirements(text: str) -> list[str]:
    """Split a master prompt into requirement units: one per sentence or bullet.
    Markdown is stripped per unit; blank lines and `---` dividers are dropped."""
    text = _HTML_COMMENT.sub(" ", text)
    reqs = []
    for part in _REQ_SPLIT.split(text):
        if _MD_RULE.match(part.strip()):
            continue
        unit = clean_prompt(part)
        if unit:
            reqs.append(unit)
    return reqs
