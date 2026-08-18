# simple_portal — conflict experiment (three conditions, two-phase handoff)

Input: `simple_portal_conflict_history.md`. The master prompt **M** is the hand-built
ground-truth master prompt (`../simple_portal/ground_truth.md`) — a faithful, fully-settled
consolidation of the build, the same M for all three agents (this isolates RQ3 from
RQ1/RQ2). Phase 2 hands M to a fresh session and feeds prompts 14–15 one at a time. Prompt
14 contradicts the settled button count (four vs five); prompt 15 is a separate compatible
feature (a footer) — a positive control that must be folded in, not flagged, and that does
not touch the button count, so it does not resolve the prompt-14 conflict.

Run each condition 2–3 times per agent (Claude, Codex, Gemini). No scoring — qualitative
demonstration. Record per conflict (14): detected? · silently resolved (picked a value with
no warning)? · invented anything not written (e.g. a fifth button name)? · named the right
settled prompt? Positive control (15): folded in and NOT flagged?

**Every condition starts with Step 0 (isolation prompt), then presents M with a minimal
handoff line — nothing added to M itself.** Keep the handoff neutral (do NOT say "watch for
conflicts"; that would contaminate condition 1). The experimental variable is only the
closing instruction.

Handoff line (paste M verbatim right after it). This line frames M as the earlier prompts
already consolidated, so the consolidation instruction below can stay **byte-for-byte
identical to the RQ1/RQ2 strict prompt** — that identity is what isolates RQ3:
```
The following instructions are only for setting up our conversation. They are **not** part of the software project's requirements and **must not** be included if you are later asked to summarize, consolidate, or generate a master prompt for the project.

Throughout this conversation, treat every subsequent request as part of the same software project. Only work within the current project folder and do not create a new project or switch to another workspace unless I explicitly ask you to.

Acknowledge these instructions and wait for the first project prompt.

```
Here is the consolidated result of the earlier prompts for this project. Continue the
project from here. I will then send more prompts, one at a time.

Create a portal homepage. Add top navigation. The navigation must contain four buttons: Dashboard, Policies, History, and Contact. If the label of a navigation button starts with "H", its background color should be blue; if the label starts with "O", its background color should be red; if the label starts with "D", its background color should be yellow. Style the navigation with rounded buttons, a blue accent, and a modern font. Add a contact form with name, email, and message fields. The email field must be validated before the form can submit. Make sure the page also works well on mobile screens.
```

---

## Condition 1 — Handoff, then ask (detection after the fact)

1. Step 0 isolation. Present M with the handoff line.
2. Feed prompts 14–15 one at a time, letting the agent respond to each.
3. Send **1a** (the RQ1/RQ2 strict consolidation prompt), save the updated master prompt,
   then send **1b** in the same chat.

**1a (consolidate — the RQ1/RQ2 strict prompt, verbatim):**
```
I have given you a sequence of prompts to build a project, in order. Some prompts
added a new requirement, some changed an earlier requirement, and some canceled or
undo an earlier requirement completely. Read them in the exact order given. Create
a master prompt that consolidate all of them into one single prompt.

Make sure that if I have modified or remove a requirement, this is correctly
reflected in the final single prompt. The final single prompt should have the exact
same meaning of all prompts without any additional or missing features.

Important rule: every requirement in the master prompt must be something I actually
wrote in one of these prompts. Do not add any requirement, detail, file name,
library, or design choice that I did not explicitly ask for, even if it seems like
a reasonable or natural thing to include. If something is not directly traceable
back to one of these numbered prompts, leave it out.
```

**1b (ask about conflict, after the updated master prompt is returned):**
```
Before I use this master prompt, are there any requirements that contradict each other —
two that cannot both be true in one implementation? List each one and quote the settled
requirement and the later instruction it came from.
```

Shows: whether the updated master prompt silently resolved the conflict (picked a value,
merged, or even invented a fifth button) with no warning, and whether the agent finds it
only when explicitly asked.

---

## Condition 2 — Handoff, do NOT resolve

Same as Condition 1 through step 2 (Step 0 → M → feed 14–15), then send the **RQ1/RQ2
strict prompt verbatim** with only a "do not resolve" clause appended (the appended clause
is the sole experimental change):
```
I have given you a sequence of prompts to build a project, in order. Some prompts
added a new requirement, some changed an earlier requirement, and some canceled or
undo an earlier requirement completely. Read them in the exact order given. Create
a master prompt that consolidate all of them into one single prompt.

Make sure that if I have modified or remove a requirement, this is correctly
reflected in the final single prompt. The final single prompt should have the exact
same meaning of all prompts without any additional or missing features.

Important rule: every requirement in the master prompt must be something I actually
wrote in one of these prompts. Do not add any requirement, detail, file name,
library, or design choice that I did not explicitly ask for, even if it seems like
a reasonable or natural thing to include. If something is not directly traceable
back to one of these numbered prompts, leave it out.

And do NOT resolve conflicts yourself. If two requirements cannot both hold, do not
pick one and do not merge them — leave that value OUT of the master prompt and list the
conflict separately, quoting both prompts it came from, for me to decide.
```

Shows: whether an explicit "do not resolve" keeps the conflict out of the master prompt and
surfaces it instead.

---

## Condition 3 — Spec-guided (track conflicts from the start of the handoff) — Type 4, Level 0

1. Step 0 isolation. Send the **governance instruction** below first; wait for the agent to
   acknowledge.
2. Present M with the **same handoff line as Conditions 1–2**, then feed 14–15 one at a time.
3. Finally, send "consolidate". The governance already carries the strict faithfulness rules
   (intent-only, never invent, traceable to a prompt), so the master prompt it emits is
   strict-faithful — applied incrementally rather than in one final pass. Do not re-send the
   strict prompt here; that would make the agent re-consolidate from scratch and discard the
   maintained spec.

This is the Level 0 (prompt-delivered) version of the spec-guided method; the full
governance and its grounding are in `../spec_guided/governance.md`.

**Governance instruction (send first):**
```
I am going to give you the consolidated result of the earlier prompts as your starting
specification, then send more prompts one at a time. Build this project and implement each new
prompt in code as usual — building the app stays your main task. As each new prompt arrives,
check it against everything already in the specification that describes the same thing.

- If the new prompt is compatible with the specification, consolidate it in and implement it.
- If the new prompt cannot both hold with something already settled, do not silently
  overwrite the earlier requirement. Whether I am deliberately revising that earlier
  decision, or I have simply overlooked that it was already settled, is something you often
  cannot tell — so unless I clearly mean to revise that specific earlier requirement, treat
  the clash as an unresolved conflict: keep both, record it with the earlier requirement and
  the new prompt, keep the conflicting value out of the master prompt, and ask me which I
  want — but keep building everything else. When in doubt, ask rather than pick.
- Never invent a value, rule, or detail that is not written. Do not add coding conventions,
  file names, or any implementation choice I did not ask for.

When I say "consolidate", output the specification you have maintained, in two sections:
"## Master prompt" (the conflict-free requirements) and "## Unresolved conflicts" (each
conflict, both sides, why). Emit the specification you have kept current; do not re-derive it
from the raw prompts. Acknowledge and wait for the consolidated result.
```

Shows: whether tracking conflicts from the start of the handoff produces a clean master
prompt of pure intent (four buttons) plus a correct, attributed conflict list, while folding
the compatible prompt 15 in — the proposed method.
