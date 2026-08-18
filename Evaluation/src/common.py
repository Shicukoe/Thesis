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


# ---- hand-written ATOMIC requirement files (the gold split, e.g. requirements_split.md,
# and the per-candidate atomic splits). Unlike split_requirements (which cuts by
# punctuation), these are units a human already decided on, so we parse them as authored.
_ATOMIC_HEADER = re.compile(r"(?m)^#{1,6}[ \t]+Requirement\b[^\n]*$")
_NOTE_LINE = re.compile(r"^(?:\*\*|>)")  # **Splitting note:** / **Correction:** / blockquote


def load_atomic_requirements(text: str) -> list[str]:
    """Parse a hand-written atomic-requirement file into a flat list of requirement
    strings. Supports two layouts:

      (1) `### Requirement N - Prompt X` headers, each followed by the requirement text
          as a short paragraph. Notes/corrections/alternatives (lines starting with `**`
          or `>`) and any `## Module` / `## Method` / `## Added-then-...` sections that
          are not `### Requirement` blocks are ignored. This matches requirements_split.md.

      (2) A plain list: one requirement per non-blank line (markdown bullets / numbering /
          `#` headers / `---` rules / `**...**` notes are dropped).

    Every word of the requirement text is kept; only structure/formatting is stripped.
    """
    text = _HTML_COMMENT.sub(" ", text)
    if _ATOMIC_HEADER.search(text):
        return _parse_requirement_blocks(text)
    return _parse_requirement_lines(text)


def _parse_requirement_blocks(text: str) -> list[str]:
    reqs = []
    # split on each '### Requirement ...' header; section = text until the next such header
    for section in _ATOMIC_HEADER.split(text)[1:]:
        buf = []
        for line in section.splitlines():
            s = line.strip()
            if not s or s.startswith("#") or _NOTE_LINE.match(s) or _MD_RULE.match(s):
                if buf:
                    break           # blank / note / next header ends the requirement paragraph
                continue            # skip leading blanks / notes before the requirement text
            buf.append(s)
        unit = clean_prompt(" ".join(buf))
        if unit:
            reqs.append(unit)
    return reqs


def _parse_requirement_lines(text: str) -> list[str]:
    reqs = []
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or _NOTE_LINE.match(s) or _MD_RULE.match(s):
            continue
        unit = clean_prompt(s)
        if unit:
            reqs.append(unit)
    return reqs
