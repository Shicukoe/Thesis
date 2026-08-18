# How to run the spec-guided approach (RQ1/RQ2, the 4th consolidation strategy)

Goal: produce one more master-prompt candidate per agent — `<Agent>__spec_guided` —
built by maintaining a living intent spec turn-by-turn (governance.md), then score it the
same way as basic / loose / strict and compare.

Inputs (feed one prompt at a time, in order):
- `inputs/simple_portal_history.md` — 12 prompts
- `inputs/hard_erp_history.md` — 45 prompts

Do this for each project × each agent (Claude, Codex, Gemini) → 6 runs.

## Per run

1. **Fresh session** for the agent (no leftover context from another run).
2. **Send the governance instruction once** — the "paste verbatim" block from
   `governance.md`. Wait for the agent to acknowledge.
3. **Feed the history one prompt at a time**, in order, from the project's `inputs/…`
   file. Let the agent respond to each (it appends to prompts.md, updates spec.md).
4. When the history is done, send: **"give me the master prompt"**. The agent outputs
   `spec.md`'s requirements section — that is the candidate master prompt.
5. **Save** that master prompt verbatim to:
   `data/<project>/candidates/<Agent>__spec_guided.md`
6. **Hand-decompose** it keep-all/verbatim (same rule as the other candidates: split into
   atomic requirements, change nothing, drop nothing) into:
   `data/<project>/candidates_atomic/<Agent>__spec_guided.md`
   using `### Requirement N` blocks.

### Two variants (report which one you used)

- **In-agent (default).** The coding agent maintains spec.md itself, alongside writing
  code. Realistic, but the agent's implementation context can leak file names/libraries
  into spec.md; the "INTENT ONLY" rule is what guards against it.
- **Isolated (controlled).** Do the spec update with a *separate* call that sees only
  (current spec.md + the new prompt), never the code. Removes the leak, fully
  reproducible. Use this if the in-agent spec.md shows implementation noise.

## Score + compare

Requirement-level AlignScore for one candidate:
```
HF_HOME=.models/hf TMPDIR=.models/tmp .venv-align/Scripts/python.exe \
  src/score_requirements.py <project> data/<project>/candidates_atomic/<Agent>__spec_guided.md
```

Full RQ1/RQ2 table (all approaches × all agents that have an atomic file present):
```
HF_HOME=.models/hf TMPDIR=.models/tmp .venv-align/Scripts/python.exe \
  src/compare_rq12.py <project>
```
`compare_rq12.py` skips any candidate whose atomic file is missing, so run it now to get
the basic/loose/strict table and re-run it as each spec_guided file lands.

## Ablation (hard_erp only) — where does the gain come from?

Hold the strict instruction fixed, vary only what the agent works from:
1. **memory-only** = the existing `Claude/Codex/Gemini __strict_consolidate` run (consolidate
   from the session at the end, no re-supplied log).
2. **+log** = re-supply `inputs/hard_erp_history.md` verbatim at consolidation time, then
   send the strict prompt. Save as `<Agent>__strict_plus_log`.
3. **+governance** = this method (`<Agent>__spec_guided`).

Gap 1→2 = effect of having the verbatim prompts back; gap 2→3 = effect of the spec-guided
discipline. This separates "re-pasting the prompts" from the method itself.
