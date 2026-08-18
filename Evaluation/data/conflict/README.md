# Conflict experiment (RQ3)

Propose + demonstrate. A master prompt is meant to be pure intent — a settled artifact. A
semantic conflict is never written into it by hand; it arrives as a NEW prompt that hits
the settled artifact. This experiment reproduces that as a **two-phase handoff**:

- **Phase 1** — **M** is the hand-built ground-truth master prompt
  (`../hard_erp/ground_truth.md`), a faithful consolidation of prompts 1–45. Using the GT
  (same M for all three agents) isolates RQ3 from RQ1/RQ2 and guarantees every settled value
  the conflicts target is present.
- **Phase 2** — hand M to a fresh session and feed prompts 46–49 one at a time, as if a
  second person continued from the master prompt. Each contradicts a value settled in M.

It asks: does the agent surface the conflict, or silently pick a value / merge / invent?
And does a spec-guided method keep the conflict out of the master prompt and surface it
instead? Qualitative demonstration, **no scoring**. Every session starts with the Step 0
isolation prompt (see `../spec_guided/RUN.md`).

**Do `hard_erp` first, then `simple_portal`** (same three conditions).

## Files
- `hard_erp_conflict_history.md` — Phase 1 prompts 1–45 (→ M) and Phase 2 prompts 46–49, **fed one at a time**. **INPUT**
- `hard_erp_labels.json` — the 4 conflicts, mapped to prompt numbers (reference; **do not give to the model**)
- `hard_erp_conflict_prompts.md` — the **3 condition prompts** (run these), handoff form
- `simple_portal_conflict_history.md` / `simple_portal_conflict_prompts.md` / `simple_portal_labels.json` — the same two-phase handoff on the smaller button-count case (M = four buttons; prompt 14 presupposes five = conflict; prompt 15 restates four = positive control)
- `RQ3_motivation_and_design.md` — rationale
- `results/<project>__<model>.md` — fill in per model

## The 3 conditions (in order; each: Step 0 → present M → feed 46–49 → closing instruction)
1. **Handoff, then ask about conflict** — re-consolidate, then ask; detection after the fact.
2. **Handoff, do NOT resolve** — re-consolidate with a do-not-resolve clause; surface only.
3. **Spec-guided** — track conflicts from the start of the handoff (the proposed method).

Full prompt text: `hard_erp_conflict_prompts.md`.

## Planted semantic conflicts (`hard_erp_labels.json`)
- C1 invoice due date: 15 days (prompt 18) vs 30 days (prompt 46)
- C2 recycle-bin scope: vendors only (prompt 43) vs also customers & products (prompt 47)
- C3 navigation: top bar (prompt 10) vs left sidebar (prompt 48)
- C4 staff delete: forbidden (prompt 24) vs allowed for own records (prompt 49)

## What to record (per condition, per model, 2–3 runs)
- Per conflict: detected? · did NOT resolve it? · did NOT invent anything? · named the right source prompt?

Expected: condition 1 shows the conflict often passes silently into the master
prompt; conditions 2 and 3 keep it out and surface it, condition 3 also tracing
each conflict to its source prompts.
