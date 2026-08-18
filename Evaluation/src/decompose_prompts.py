"""Atomic REQUIREMENT extraction from a raw prompt history.

Adapts the DECOMPOSITION stage of Claimify (Metropolitansky & Larson, Microsoft,
arXiv:2502.10855) from *fact* extraction to *requirement* extraction. Claimify's
Selection and Disambiguation stages are NOT used in this thesis: the prompt histories
are already requirement-dense and both the ground-truth map and the candidate maps are
kept keep-all, so nothing is dropped or resolved away.

  DECOMPOSITION  - split each sentence into the simplest self-contained
                   (decontextualized) atomic requirements, following the project's
                   granularity rules (permissions fine-grained, enumerations merged).

Then a QUALITY GATE reuses AlignScore: each atomic requirement must be entailed by its
source prompt,  AlignScore(context = source prompt, claim = atomic) >= gate_tau,  else it is
flagged as possibly hallucinated / over-split. Provenance (source prompt number) is FREE
because we decompose per prompt.

Finally, VALIDATION compares the extracted set against the hand-built gold
(requirements_split.md, 52 reqs) and reports recall / precision / missed / spurious.

Runs in .venv-align (py3.10). The LLM is called over raw HTTP (no SDK needed); pick a
provider + model + key at runtime. Use --provider mock + --matcher token to dry-run the
whole pipeline with no API and no AlignScore load.

Run (real):
  HF_HOME=.../.models/hf TMPDIR=.../.models/tmp \
    .venv-align/Scripts/python.exe src/decompose_prompts.py \
      "../hard erp project/Codex/additional prompts.txt" \
      --provider anthropic --model claude-... --api-key $ANTHROPIC_API_KEY \
      --gold "../hard erp project/requirements_split.md" --matcher alignscore

Dry-run (no API, no model load):
  .venv-align/Scripts/python.exe src/decompose_prompts.py \
      "../hard erp project/Codex/additional prompts.txt" \
      --provider mock --matcher token --gold "../hard erp project/requirements_split.md"
"""
from __future__ import annotations
import argparse
import json
import os
import re
from pathlib import Path

from common import OUT, clean_prompt, ensure_dir, load_atomic_requirements, read_text, write_csv

# --------------------------------------------------------------------------- prompts
# Only Claimify's Decomposition stage is used, reworded from "verifiable factual
# proposition" to "requirement". Few-shot examples use this project's own domain and
# encode its granularity rules.

DECOMP_SYS = """\
You are given the prompt history as context and ONE clarified requirement sentence. Split it
into the SIMPLEST self-contained atomic requirements. Each atomic requirement must be
understandable in isolation and mean the same as in context.

FIDELITY (highest priority — do this before anything else):
- REUSE THE SOURCE'S EXACT WORDS. Do NOT paraphrase, do NOT swap synonyms, do NOT drop
  qualifiers or adjectives. If the source says "build", write "build", not "create". If it
  says "the overall structure", keep "the overall structure", do not add "code".
- The ONLY edits allowed are: (1) split into separate sentences; (2) resolve a pronoun or a
  back-reference ("it", "that", "do that", "them") by inserting the referent in [square
  brackets]; (3) add the minimum connective words, also in [square brackets], to make the
  unit a standalone sentence. Everything NOT in brackets must be a verbatim span of the
  source.
- NEVER consult any ground truth, reference answer, or outside knowledge. Work only from the
  given source text. Your job is to split and lightly decontextualize, never to correct,
  normalize, or improve the wording.

Granularity rules (follow exactly):
- PERMISSIONS: one requirement per (role, object). "Staff can't delete customers or products"
  -> two requirements.
- COMPOUND actions/side-effects: split. "When confirmed, reduce stock and generate an invoice"
  -> two requirements.
- ENUMERATIONS / attribute sets stated together: keep as ONE requirement. Do NOT over-split
  "name, SKU, price, and stock" or "Cash and Bank Transfer" into separate requirements.
- Keep the acting entity/context ("A sales order should...", "The dashboard should...").

Output: a bullet list, one atomic requirement per line starting with "- ". Nothing else.

Examples:
Sentence: "If the label starts with H the background is blue; if it starts with O it is red; if it starts with D it is yellow."
- A navigation label starting with H must have a blue background.
- A navigation label starting with O must have a red background.
- A navigation label starting with D must have a yellow background.

Sentence: "Each product should have a name, SKU, price, and current stock quantity."
- Each product must have a name, SKU, price, and current stock quantity.

Sentence: "Staff members shouldn't be allowed to delete customers or products. Only Admin users can do that."
- Staff users shouldn't be allowed to delete customers.
- Staff users shouldn't be allowed to delete products.
- Admin users should be able to delete customers.
- Admin users should be able to delete products.
"""

# --------------------------------------------------------------------------- prompt IO
_PROMPT_HEADER = re.compile(r"(?mi)^#{1,6}[ \t]*Prompt[ \t]+(\d+)\b")


def load_prompt_history(path: Path) -> list[tuple[int, str]]:
    """Parse '### Prompt N' blocks from a raw prompt-history file into (number, text)."""
    text = read_text(path)
    parts = _PROMPT_HEADER.split(text)
    out = []
    # parts = [pre, num1, body1, num2, body2, ...]
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        body = parts[i + 1]
        body = re.sub(r"(?m)^[ \t]*\\?-{3,}[ \t]*$", " ", body)   # drop --- dividers
        body = clean_prompt(body)
        if body:
            out.append((num, body))
    return out


def split_sentences(text: str) -> list[str]:
    try:
        from nltk.tokenize import sent_tokenize
        return [s.strip() for s in sent_tokenize(text) if s.strip()]
    except Exception:
        return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]


# --------------------------------------------------------------------------- LLM backends
def llm_call(system: str, user: str, provider: str, model: str, api_key: str,
             base_url: str | None, max_tokens: int = 1024) -> str:
    if provider == "mock":
        return _mock_llm(system, user)
    import requests
    if provider == "anthropic":
        url = (base_url or "https://api.anthropic.com") + "/v1/messages"
        r = requests.post(url, timeout=120, headers={
            "x-api-key": api_key, "anthropic-version": "2023-06-01",
            "content-type": "application/json"},
            json={"model": model, "max_tokens": max_tokens, "system": system,
                  "messages": [{"role": "user", "content": user}]})
        r.raise_for_status()
        return "".join(b.get("text", "") for b in r.json()["content"])
    # openai-compatible (OpenAI, Gemini via openai-compat, Groq, ...)
    url = (base_url or "https://api.openai.com/v1") + "/chat/completions"
    r = requests.post(url, timeout=120,
                      headers={"Authorization": f"Bearer {api_key}",
                               "content-type": "application/json"},
                      json={"model": model, "max_tokens": max_tokens, "temperature": 0,
                            "messages": [{"role": "system", "content": system},
                                         {"role": "user", "content": user}]})
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"]


def _mock_llm(system: str, user: str) -> str:
    """Offline stand-in so the pipeline runs without an API key. Decomposition splits
    on ';' and ' and '."""
    sent = re.search(r"Sentence:\s*(.+)", user)
    s = (sent.group(1).strip() if sent else user.strip()).strip('"')
    parts = re.split(r";|\band\b", s)
    parts = [p.strip(" .") for p in parts if len(p.strip()) > 3]
    return "\n".join(f"- {p}." for p in parts) or f"- {s}"


# --------------------------------------------------------------------------- pipeline
def decompose_candidate(text: str, cfg) -> list[str]:
    """CANDIDATE mode (keep-all): decompose a candidate master prompt into atomic units with
    NO Selection/Disambiguation drop, so added implementation detail and fabricated
    requirements are RETAINED and later scored (untraceable) by score_requirements.py.
    Only Decomposition runs; decontextualization clarifies but never removes a proposition."""
    atomics: list[str] = []
    for sentence in split_sentences(clean_prompt(text)):
        dec = llm_call(DECOMP_SYS, f"Sentence: {sentence}", **cfg)
        got = [clean_prompt(l[1:]) for l in dec.splitlines() if l.strip().startswith(("-", "*", "•"))]
        got = [u for u in got if u]
        atomics.extend(got or [clean_prompt(sentence)])   # never drop: keep the sentence if no split
    return atomics


def extract_from_prompt(prompt_no: int, prompt_text: str, context: str, cfg) -> list[str]:
    """Decomposition only (Selection and Disambiguation are not used in this thesis):
    split each sentence of the prompt into atomic requirements, keep all."""
    atomics: list[str] = []
    for sentence in split_sentences(prompt_text):
        dec = llm_call(DECOMP_SYS, f"Prompt history (context):\n{context}\n\nSentence: {sentence}", **cfg)
        for line in dec.splitlines():
            line = line.strip()
            if line.startswith(("-", "*", "•")):
                unit = clean_prompt(line[1:])
                if unit:
                    atomics.append(unit)
    return atomics


# --------------------------------------------------------------------------- scorers
class TokenScorer:
    """Cheap Jaccard-over-words scorer for dry-runs (no model load)."""
    def score(self, contexts, claims):
        out = []
        for c, q in zip(contexts, claims):
            a, b = set(c.lower().split()), set(q.lower().split())
            out.append(len(a & b) / len(b) if b else 0.0)      # share of claim words in context
        return out


class AlignScorer:
    def __init__(self, size="large"):
        from run_align import MODELS
        from alignscore import AlignScore
        cfg = MODELS[size]
        self.s = AlignScore(model=cfg["model"], batch_size=32, device="cpu",
                            ckpt_path=cfg["ckpt"], evaluation_mode="nli_sp")

    def score(self, contexts, claims):
        return [float(x) for x in self.s.score(contexts=contexts, claims=claims)]


# --------------------------------------------------------------------------- gate + validation
def entailment_gate(items, scorer, tau):
    """items = list[(atomic, source_prompt_no, source_prompt_text)]. Keep those entailed by
    their source prompt; flag the rest."""
    if not items:
        return [], []
    scores = scorer.score([t[2] for t in items], [t[0] for t in items])
    kept, flagged = [], []
    for (atomic, no, _), sc in zip(items, scores):
        row = {"source_prompt": no, "score": round(sc, 4), "requirement": atomic}
        (kept if sc >= tau else flagged).append(row)
    return kept, flagged


def validate_against_gold(extracted, gold, scorer, tau):
    """Match extracted <-> gold by AlignScore(gold, extracted) >= tau (extracted entailed by a
    gold req). Recall = golds covered; precision = extracted that map to a gold."""
    if not extracted or not gold:
        return {}
    contexts, claims, idx = [], [], []
    for gi, g in enumerate(gold):
        for ei, e in enumerate(extracted):
            contexts.append(g); claims.append(e); idx.append((gi, ei))
    scores = scorer.score(contexts, claims)
    best_for_gold = [0.0] * len(gold)
    best_for_extr = [0.0] * len(extracted)
    for (gi, ei), sc in zip(idx, scores):
        best_for_gold[gi] = max(best_for_gold[gi], sc)
        best_for_extr[ei] = max(best_for_extr[ei], sc)
    recovered = sum(1 for x in best_for_gold if x >= tau)
    real = sum(1 for x in best_for_extr if x >= tau)
    return {
        "gold": len(gold), "extracted": len(extracted),
        "recall": recovered / len(gold), "recovered": recovered,
        "precision": real / len(extracted), "spurious": len(extracted) - real,
        "missed_gold": [gold[i] for i, x in enumerate(best_for_gold) if x < tau],
        "spurious_extracted": [extracted[i] for i, x in enumerate(best_for_extr) if x < tau],
    }


# --------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description="Atomic requirement extraction (Claimify decomposition stage only).")
    ap.add_argument("prompts_file", help="gold mode: raw prompt history (### Prompt N). candidate mode: a candidate master prompt .md")
    ap.add_argument("--mode", choices=["gold", "candidate"], default="gold",
                    help="gold = decompose per prompt (provenance kept); candidate = decompose one master prompt. Both KEEP ALL")
    ap.add_argument("--provider", choices=["anthropic", "openai", "mock"], default="mock")
    ap.add_argument("--model", default="mock-model")
    ap.add_argument("--api-key", default=os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("OPENAI_API_KEY", ""))
    ap.add_argument("--base-url", default=None)
    ap.add_argument("--context-window", type=int, default=6, help="preceding+following prompts given as context")
    ap.add_argument("--limit", type=int, default=0, help="only first N prompts (0 = all)")
    ap.add_argument("--matcher", choices=["alignscore", "token"], default="alignscore",
                    help="scorer for the entailment gate + validation (token = dry-run, no model)")
    ap.add_argument("--gate-tau", type=float, default=0.5)
    ap.add_argument("--match-tau", type=float, default=0.5)
    ap.add_argument("--gold", default=None, help="gold atomic map to validate against (requirements_split.md)")
    ap.add_argument("--label", default="auto")
    args = ap.parse_args()

    cfg = dict(provider=args.provider, model=args.model, api_key=args.api_key, base_url=args.base_url)
    label = args.label if args.label != "auto" else Path(args.prompts_file).stem.replace(" ", "_")

    # ---- CANDIDATE mode: keep-all decomposition of one candidate master prompt ----
    if args.mode == "candidate":
        atomics = decompose_candidate(read_text(Path(args.prompts_file)), cfg)
        ensure_dir(OUT)
        out = OUT / f"candidate_atomic_{label}.md"
        out.write_text("\n".join(f"### Requirement {i}\n\n{a}\n" for i, a in enumerate(atomics, 1)),
                       encoding="utf-8")
        print(f"candidate mode: {len(atomics)} atomic units kept (no drop) -> {out}")
        print("next: score with  score_requirements.py <project> " + str(out))
        return

    prompts = load_prompt_history(Path(args.prompts_file))
    if args.limit:
        prompts = prompts[:args.limit]
    print(f"loaded {len(prompts)} prompts from {args.prompts_file}")

    # 1) extract atomic requirements per prompt (provenance = prompt number)
    items = []   # (atomic, source_prompt_no, source_prompt_text)
    for pos, (no, text) in enumerate(prompts):
        lo = max(0, pos - args.context_window)
        hi = min(len(prompts), pos + args.context_window + 1)
        context = "\n".join(f"### Prompt {n}\n{t}" for n, t in prompts[lo:hi])
        for atomic in extract_from_prompt(no, text, context, cfg):
            items.append((atomic, no, text))
    print(f"extracted {len(items)} atomic requirements (pre-gate)")

    scorer = TokenScorer() if args.matcher == "token" else AlignScorer()

    # 2) entailment gate
    kept, flagged = entailment_gate(items, scorer, args.gate_tau)
    print(f"gate: kept {len(kept)}, flagged {len(flagged)}  (tau={args.gate_tau}, matcher={args.matcher})")

    ensure_dir(OUT)
    label = args.label if args.label != "auto" else Path(args.prompts_file).stem.replace(" ", "_")
    write_csv(OUT / f"decomp_{label}.csv", kept + flagged,
              fieldnames=["source_prompt", "score", "requirement"])
    (OUT / f"decomp_{label}.md").write_text(
        "\n".join(f"### Requirement {i} — Prompt {r['source_prompt']}\n\n{r['requirement']}\n"
                  for i, r in enumerate(kept, 1)), encoding="utf-8")

    # 3) validation vs gold
    if args.gold:
        gold = load_atomic_requirements(read_text(Path(args.gold)))
        extracted = [r["requirement"] for r in kept]
        rep = validate_against_gold(extracted, gold, scorer, args.match_tau)
        if rep:
            print(f"\n=== validation vs gold ({args.gold}) ===")
            print(f"gold={rep['gold']}  extracted={rep['extracted']}  (matcher={args.matcher}, tau={args.match_tau})")
            print(f"recall    = {rep['recovered']}/{rep['gold']} = {rep['recall']:.1%}  (gold reqs recovered)")
            print(f"precision = {rep['extracted']-rep['spurious']}/{rep['extracted']} = {rep['precision']:.1%}  (extracted that map to a gold)")
            print(f"missed gold reqs: {len(rep['missed_gold'])} | spurious/over-split: {rep['spurious']}")
            for g in rep["missed_gold"][:12]:
                print(f"   MISSED  {g[:90]}")
            (OUT / f"decomp_{label}_validation.json").write_text(
                json.dumps(rep, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nwrote outputs/decomp_{label}.md  (+ .csv, validation.json)")


if __name__ == "__main__":
    main()
