# simple_portal — conflict experiment input (two-phase handoff)

Mirrors the `hard_erp` conflict setup on the smaller, clearer portal case. A semantic
conflict is never written into the master prompt by hand; it arrives as a NEW prompt that
hits the settled artifact. Build and consolidate the project into a master prompt, hand it
to a fresh session, then send later prompts — one contradicts a value settled in the
artifact, one is compatible.

## Step 0 — isolate every session
Before anything else, send the pre-experiment isolation prompt (sandbox the agent to the
project folder; exclude the setup text from any master prompt). See
`../spec_guided/RUN.md` Step 0.

## Phase 1 — the master prompt M
Prompts 1–13 are the ordinary build. For the conflict experiment, use the hand-built
**ground-truth master prompt** (`../simple_portal/ground_truth.md`) as **M** — a faithful,
fully-settled consolidation of the build. Using the GT isolates RQ3 from RQ1/RQ2: M is
guaranteed to contain the value the conflict targets — the navigation has exactly **four**
buttons (Dashboard, Policies, History, Contact) — so a conflict always has something to
collide with, and all three agents receive the same M.

Prompts 1–13 are listed below for reference only; they are what M consolidates, not what you
feed in Phase 2:

Create a portal homepage. Add top navigation. The navigation must contain four buttons: Dashboard, Policies, History, and Contact. If the label of a navigation button starts with “H”, its background color should be blue; if the label starts with “O”, its background color should be red; if the label starts with “D”, its background color should be yellow. Style the navigation with rounded buttons, a blue accent, and a modern font. Add a contact form with name, email, and message fields. The email field must be validated before the form can submit. Make sure the page also works well on mobile screens.

## Phase 2 — hand M to a fresh session, then feed prompts 14–15 one at a time
These arrive AFTER M is settled — as if a contributor continued the project from the master
prompt. Feed only the numbered text, one prompt per turn.

Prompt 14 contradicts the settled button count:

14. Make sure all five navigation buttons wrap onto two rows on small screens.

Prompt 14 is phrased as a plausible feature request that PRESUPPOSES a state contradicting M
— it assumes five navigation buttons, while M settles four — so it cannot be built without
the contradiction being true, and last-write-wins does not cleanly dispose of it. It does
not read as a deliberate revision; it simply assumes the contradicting state as if it were
already true.

Prompt 15 is a POSITIVE CONTROL — a genuinely new, standalone feature that touches nothing
in M and, crucially, does NOT concern the navigation button count, so it neither contradicts
M nor resolves the prompt-14 conflict. It must be folded in, NOT flagged. This keeps the
conflict from prompt 14 visible during the run while still checking that the method does not
over-flag a harmless addition:

15. Add a footer at the bottom of the page showing a copyright notice.

## Conflict map (full provenance in `simple_portal_labels.json`)
- 14 → CONFLICT SC1: presupposes five navigation buttons vs settled four (prompt 10).
- 15 → COMPATIBLE (positive control): a new footer with a copyright notice — contradicts nothing and does not touch the button count, so it does NOT resolve the conflict; must be folded in, not flagged.

Note: a second, styling-level clash in the original log (per-letter colors vs "blue accent")
is NOT used as a conflict here — the ground truth keeps both, so they coexist rather than
contradict, which makes it a weak/ambiguous conflict.
