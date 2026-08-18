# RQ2 — the fourth approach: spec-guided consolidation

The three baseline approaches (basic / loose / strict) consolidate the whole
prompt history in **one pass at the end**. The fourth approach maintains a **living
intent spec** during the session and takes the master prompt from it. It combines
**spec-driven development** (spec.md is the source of truth, maintained alongside
the work) with **prompt engineering** (the RQ1/RQ2 traceability rules, applied on
every turn instead of once at the end).

## Two files

- `prompts.md` — append-only log of the raw instructions, verbatim, numbered. Never
  edited. This is the honest record of what was asked (see *Prompting in the Wild*,
  Tafreshipour et al.), kept as a reference to check order/intent — spec.md is not
  rebuilt from it every turn.
- `spec.md` — a single flowing master prompt (not a tagged, itemized list), written the
  same way `strict_consolidate` writes its output, re-consolidated in full against
  (spec.md + the new prompt) on every turn: edit chains already applied (no stale
  values), no implementation noise. An "## Unresolved conflicts" section holds anything
  that contradicts.

`spec.md` itself is the master prompt — at any point in the session.

## Per-turn protocol (driven by `governance.md`)

Put the instruction in `governance.md` into the agent's rules file
(`AGENTS.md` / `CLAUDE.md` / `.cursorrules`) once, or send it at the start. Then, on
every prompt, the agent: (1) appends the prompt to `prompts.md`; (2) updates
`spec.md` — apply add / change / cancel, tag provenance, refuse implementation
noise, surface contradictions; (3) writes the code to match `spec.md`.

**Isolation note.** Because the coding agent is full of implementation context, it
can leak file names / conventions into `spec.md`. The governance rule "INTENT ONLY"
guards against this. For a fully controlled run, do the spec update with a
**separate call** that sees only (current `spec.md` + new prompt), never the code —
this removes the leak and is reproducible. Report which variant was used.

## How it is run and evaluated (RQ2)

Run spec-guided on the **same clean prompt histories** used for RQ1/RQ2
(`simple_portal`, `hard_erp`), across the three agents. The output master prompt =
the final `spec.md`. Score it exactly like the other candidates: decompose into
atomic requirements and compute requirement-level AlignScore + untraceable rate
against the project's ground truth (`score_requirements.py`). Compare against
basic / loose / strict.

**Ablation (where does the gain come from?).** On `hard_erp`, hold the strict
instruction fixed and vary only what the agent works from, three rungs:
1. **memory-only** — consolidate from the session at the end, no log (= the
   existing strict run).
2. **+ log** — re-supply `prompts.md` (verbatim) at consolidation.
3. **+ governance** — maintain `spec.md` throughout (this method).

Gap 1→2 = the effect of re-supplying the verbatim log; gap 2→3 = the effect of the
governance. This separates "having the prompts back" from "the spec-guided
discipline", and protects the method from the objection that it only re-pastes the
prompts.

## Hypothesis

The spec-guided master prompt is closer to the ground truth (higher AlignScore,
lower untraceable rate) than any single-pass variant, because it never accumulates
the mess a one-pass consolidation must untangle: changes are applied immediately,
implementation noise is refused at the door, and provenance is kept per requirement.
