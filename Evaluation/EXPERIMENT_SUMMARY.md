# Experiment summary — master-prompt consolidation & conflict handling

Two lines of work: (A) a requirement-level evaluation of master-prompt consolidation with
AlignScore, and (B) semantic-conflict experiments + a proposed spec-guided method.

---

## A. AlignScore results — master-prompt consolidation (RQ1/RQ2)

Each candidate master prompt is broken into atomic requirements (Claimify decomposition,
keep-all), and each requirement is scored with AlignScore against the ground truth.
`mean` = average requirement-level AlignScore (higher = more faithful); `untr%` = fraction
of requirements not supported by the ground truth (score < 0.5) = added/stale content.
Numbers below supersede the ones in the first document: the atomic split was re-audited
against the ground truth's own granularity (permission rules split per role × object,
existence split from contents) and corrected where a candidate had bundled two of these
into one requirement; the ordering and the conclusion are unchanged.

`spec_guided` is the fourth method, and the one this document reports as newly complete
(§A.1): instead of consolidating the whole prompt history once at the end the way
`basic`/`loose`/`strict` do, the agent maintains a living specification (`spec.md`) and
re-consolidates it against the whole spec on every turn, under one governance instruction
(§D) installed before the first prompt.

### simple_portal
| Agent | basic (mean / untr%) | loose | strict | spec\_guided |
|---|---|---|---|---|
| Claude | 0.086 / 92% | 0.827 / 10% | 0.986 / 0% | **0.989 / 0%** |
| Codex  | 0.387 / 62% | 0.857 / 18% | 0.828 / 18% | 0.905 / 10% |
| Gemini | 0.083 / 97% | 0.737 / 21% | 0.917 / 10% | **0.989 / 0%** |

### hard_erp
| Agent | basic | loose | strict | spec\_guided |
|---|---|---|---|---|
| Claude | 0.371 / 65% | 0.353 / 68% | 0.905 / 3% | 0.925 / 4% |
| Codex  | 0.787 / 19% | 0.771 / 21% | 0.858 / 10% | **0.924 / 4%** |
| Gemini | 0.382 / 70% | 0.415 / 58% | **0.864 / 10%** | 0.823 / 14% |

**Reading:** stricter prompting sharply reduces untraceable content (e.g. Claude
simple_portal 92% → 0% untraceable; hard_erp 65% → 3%). `basic` prompts add the most
non-traceable detail (file names, libraries, invented rules). `spec_guided` improves on
`strict_consolidate` -- the strongest of the three single-pass baselines -- in **5 of 6**
agent×project combinations (bold = the better of the two per row). The sixth, Gemini on
`hard_erp`, is a genuine regression on both numbers, not a tie or a scoring artifact: §A.2
looks at it directly, because I think it is more informative than the wins. §A.1 walks
through one of the wins.

### A.1 A worked example: what the metric catches that reading the text misses

Codex's `spec_guided` candidate for `simple_portal` illustrates both the method's gain and
its one remaining known failure mode in the same ten-requirement output. Nine of its ten
requirements score 0.976–0.996 -- e.g. `Add a contact form with name, email, and message
fields.` → 0.990. The tenth, `Change navigation buttons: Dashboard, Policies, History,
Contact.`, scores **0.144** and is flagged untraceable. The button names and count are all
correct; what AlignScore is actually catching is that "Change navigation buttons: X" does
not read as a settled fact the way "Add navigation buttons: X" or the ground truth's "The
navigation must contain buttons: X" does -- it is phrased as a mid-conversation instruction
("change this to that"), not a specification. That phrasing survived because, at this point
in the session, the agent had not yet finished reconciling an earlier instruction whose
wording only made sense next to a state (an older 3-button list) already replaced elsewhere
in the specification; the fix that closes this generally is not to detect that one phrase,
but to make the agent always rewrite a touched topic's requirement fresh from that topic's
full prompt history rather than editing the previous sentence in place -- the same
discipline `strict_consolidate` gets "for free" from processing the whole history in one
pass instead of one prompt per turn. Even with this one uncorrected item, the candidate's
mean and untraceable rate both still beat Codex's own `strict_consolidate` run on the same
project (0.905/10% vs. 0.828/18%), which is the more interesting result: the method's gain
on the other nine requirements outweighs the cost of one live bug on the tenth.

### A.2 The one regression: Gemini on hard_erp, and what actually went wrong

`spec_guided` loses to `strict_consolidate` here on both numbers (0.823/14% vs. 0.864/10%),
and it is not the dangling-reference bug from §A.1 -- it is ordinary extrinsic
hallucination, the exact thing the method's fidelity rule exists to prevent, entering
somewhere across the 45-turn session anyway. Three concrete examples, out of the
candidate's seven untraceable requirements:
- `The top navigation bar should contain Dashboard, Customers, Vendors, and Products.`
  (0.845 -- just above the untraceable line, but the lowest-scoring navigation requirement
  in any `spec_guided` candidate). Every raw prompt and the ground truth say the nav bar is
  Dashboard, Customers, and Products -- no prompt ever adds Vendors to it.
- `The User Accounts management view is restricted to Admin only.` (0.045). No prompt
  states this. The raw history only ever says who *cannot* manage user accounts (Staff,
  then Managers); it never asserts a specific "User Accounts management view" exists or is
  Admin-restricted -- a plausible inference, stated as if it were a requirement.
- `Provide a user interface to browse these audit logs.` (0.759). An implementation-shaped
  addition of the same kind `strict_consolidate`'s explicit rule is written to forbid.

My reading: per-turn reconciliation removes the problem of holding the *whole* history in
mind at once (the actual hypothesis behind proposing this method for RQ2), but it trades
that for a *different* risk -- 45 separate rewrites are 45 separate chances for a small
elaboration to slip in, where a single end-of-session pass only has one chance. Whether this
is specific to Gemini, or a property of the method on long histories generally, is not
something one run per condition can settle -- I think the ablation I describe at the end of
§D (memory-only → +log → +governance) is the right next step to pull apart "does having the
log back help" from "does the governance discipline itself help," and I'd want a few repeated
runs per agent before treating this as more than one data point.

**A metric-side note, not a method one.** In every `hard_erp` `spec_guided` candidate,
including Claude's and Codex's near-perfect runs, two short existence statements score low
(0.27-0.34) despite being supported almost verbatim by the ground truth: `Introduce user
roles: Admin, Staff, and Manager.` and `Add sales orders.` (ground truth: "Support the user
roles Admin, Manager, and Staff"; "Implement sales orders"). Neither crosses the untraceable
threshold, but a 0.3 on something this clearly faithful looks like the checkpoint being less
reliable on short, one-clause claims scored against a long, multi-topic context -- worth
flagging for anyone repeating this pipeline, separate from anything the method itself did.

---

## B. Conflict experiments (RQ3) — qualitative, no scoring

**Setup.** Start from a hand-built master prompt = shared spec (also the ground truth). Each
run begins with a handoff, then later prompts that conflict with the settled spec are fed one
at a time. Conflicts are written to *presuppose* the contradicting state (so they can't be
read as a normal edit).
- `simple_portal`: navigation buttons stated as 2 → 3 → 5.
- `hard_erp`: four conflicts — due date 15 vs 30, recycle-bin vendors-only vs also customers,
  top-nav vs left sidebar, staff can't vs can delete their own records — plus one compatible
  positive control (a print button) that must be folded in, not flagged.

**Baseline (strict_consolidate).** All three models **silently resolve** the conflict while
consolidating, sometimes incoherently. On `simple_portal`, after "add 3 navigation buttons"
and later "all five buttons must wrap", **Gemini invented two extra buttons**, naming them
from earlier prompts, to reach five — with no warning.

**Three attempts.**
1. *Consolidate, then ask.* The model can name the conflict when asked, but the master prompt
   has already merged/picked a value — detecting it afterward does not keep it out.
2. *Mark and leave out, then consolidate.* Told before consolidating to flag conflicts and
   leave them out, the model can do it.
3. *Check continuously (proposed method).* A governance rule installed before the master
   prompt: treat the master prompt as a running spec; for each new prompt, if it conflicts
   with something settled, leave it out and record it under "Unresolved conflicts"; if
   compatible, build and add it. On "consolidate" → clean master prompt + conflict list.
   **Observed (Gemini, hard_erp):** the compatible print button is folded in while all four
   conflicts are held open under "Unresolved conflicts" — the intended behavior.

*Full 3 conditions × 3 models pending.*

---

## C. Papers (why the idea came from each)

| Paper | Link | Why / how used |
|---|---|---|
| **Claimify** — Metropolitansky & Larson (Microsoft), 2025 | arxiv.org/abs/2502.10855 | Decomposes text into simplest self-contained claims. Used to break the ground truth and each master prompt into **atomic requirements** so each is scored on its own (whole-doc averaging hides a few fabricated sentences). |
| **AlignScore** — Zha et al., ACL 2023 | arxiv.org/abs/2305.16739 | Scores whether a claim is *entailed by* a context, not just similar. Used to score each requirement vs the ground truth → the **untraceable rate**. |
| **BERTScore** — Zhang et al., ICLR 2020 | arxiv.org/abs/1904.09675 | Embedding-similarity baseline; the wording "foil" that similarity alone cannot tell a paraphrase from a contradiction. |
| **Semantic Commit** — Vaithilingam et al., UIST 2025 | arxiv.org/abs/2504.09283 | Integrates new info into an intent store and **detects conflicts continuously**, full-context ("DropAllDocs", no retrieval). Gave the idea to **check each requirement continuously** (Attempt 3) and the full-context check for the stronger consolidation. |
| **Spec-Driven Development** — Piskala et al., 2026 | arxiv.org/abs/2602.00180 | The specification, not the code, is the single source of truth. Grounds the **living `spec.md`** the agent maintains. |
| **Prompting in the Wild** — Tafreshipour et al., MSR 2025 | arxiv.org/abs/2412.17298 | Prompts are versioned, preserved artifacts in repos. Grounds the **append-only, verbatim prompt log**. |
| **CodeCRDT** — Pugachev, 2025 | arxiv.org/abs/2510.18893 | Even a clean, conflict-free merge still leaves 5–10% **semantic** conflicts. Motivates conflict detection at the *meaning* level (a text merge won't catch it). |

---

## D. Prompts used

**Handoff (starts every conflict run):**
```
Here is the consolidated result of the earlier prompts for this project. Continue the
project from here. I will then send more prompts, one at a time.
<paste the master prompt here>
```

**strict_consolidate (faithfulness prompt; the RQ1/RQ2 baseline, also used in conflict):**
```
I have given you a sequence of prompts to build a project, in order. Some prompts added a new
requirement, some changed an earlier requirement, and some canceled or undo an earlier
requirement completely. Read them in the exact order given. Create a master prompt that
consolidate all of them into one single prompt. Make sure that if I have modified or remove a
requirement, this is correctly reflected in the final single prompt. The final single prompt
should have the exact same meaning of all prompts without any additional or missing features.
Important rule: every requirement in the master prompt must be something I actually wrote in
one of these prompts. Do not add any requirement, detail, file name, library, or design choice
that I did not explicitly ask for, even if it seems like a reasonable or natural thing to
include. If something is not directly traceable back to one of these numbered prompts, leave
it out.
```

**Conflict detection question (Attempt 1):**
```
Before I use this master prompt, are there any requirements that contradict each other — two
that cannot both be true in one implementation? List each one and quote the settled
requirement and the later instruction it came from.
```

**Mark conflict and do not resolve (Attempt 2 — appended to strict_consolidate):**
```
And do NOT resolve conflicts yourself. If two requirements cannot both hold, do not pick one
and do not merge them — leave that value OUT of the master prompt and list the conflict
separately, quoting both prompts it came from, for me to decide.
```

**Governance rule (Attempt 3 — sent before the master prompt):**
```
I am going to give you the consolidated result of the earlier prompts as your starting
specification, then send more prompts one at a time. Build this project and implement each new
prompt in code as usual — building the app stays your main task. As each new prompt arrives,
check it against everything already in the specification that describes the same thing.

- If the new prompt is compatible with the specification, consolidate it in and implement it.
- If the new prompt cannot both hold with something already settled, do not silently overwrite
  the earlier requirement. Whether I am deliberately revising that earlier decision, or I have
  simply overlooked that it was already settled, is something you often cannot tell — so unless
  I clearly mean to revise that specific earlier requirement, treat the clash as an unresolved
  conflict: keep both, record it with the earlier requirement and the new prompt, keep the
  conflicting value out of the master prompt, and ask me which I want — but keep building
  everything else. When in doubt, ask rather than pick.
- Never invent a value, rule, or detail that is not written. Do not add coding conventions,
  file names, or any implementation choice I did not ask for.

When I say "consolidate", output the specification you have maintained, in two sections:
"## Master prompt" (the conflict-free requirements) and "## Unresolved conflicts" (each
conflict, both sides, why). Emit the specification you have kept current; do not re-derive it
from the raw prompts.
```

**Governance rule for normal consolidation (`spec_guided`, RQ2) — sent once before prompt 1,
no prior handoff.** Same underlying idea as Attempt 3 above, applied from the start of a
session instead of to a pre-existing specification, and refined further through repeated
live testing against Gemini, Codex, and Claude (each round tested by actually running the
instruction against the real prompt histories and reading what `spec.md` contained partway
through, not by inspecting the wording alone). Two live bugs found and closed this way: (1)
raw prompts that refer back to their own conversational history ("Change navigation buttons:
X", "Use top navigation *instead*") were being kept in `spec.md` almost verbatim, dangling,
because the agent defaults to editing the previous sentence in place rather than rewriting
it; (2) on the more conversational `hard_erp` history, whole sentences of scene-setting
("I'd like to build...") were surviving into `spec.md` the same way. Both traced back to the
same cause and are closed by the same rule below (final paragraph of step 2): rewrite a
touched topic's requirement fresh from that topic's *whole* prompt history every time,
instead of editing the newest prompt's sentence into place.
```
This project keeps its INTENT as a living master prompt, maintained under the rules below.
Two files matter:

- prompts.md -- an append-only, verbatim log of every instruction I give, in order. You never
  edit, reorder, or delete a past entry. Keep it as a reference to check order or intent if
  spec.md is ever unclear -- you do not rebuild spec.md from it on every turn.
- spec.md -- the current master prompt, as a single flowing text, written the same way you
  would consolidate a whole prompt history into one master prompt in a single pass. Not a
  tagged list of individual items. spec.md is the single source of truth for WHAT to build;
  all code derives from it.

This governance message itself is not a numbered prompt. Do not add it to prompts.md, and do
not treat any part of it as a requirement to fold into spec.md -- it is a standing rule about
HOW you work, not something I am asking you to build. Prompt numbering starts at 1 with the
first message I send after this one.

On EVERY instruction I give you after this one, before you write or change any code, do the
following in order.

1. Record. Append my instruction to prompts.md verbatim, as the next numbered entry.

2. Re-consolidate. Read the current spec.md in full together with my new instruction, then
   rewrite spec.md exactly the way you would consolidate a whole prompt history into one
   master prompt in a single pass:
   - If my instruction is compatible with what's already in spec.md, integrate it.
   - If it clearly changes or withdraws something already in spec.md, update spec.md so only
     the current version remains. If it withdraws something with nothing replacing it, delete
     that detail outright -- do not replace it with a restated explanation of the withdrawal
     (e.g. do not turn "remove dark theme" into "use light theme only", or "undo the sidebar"
     into "use no sidebar" -- nobody asked for either; the correct result is that spec.md simply
     says nothing about it). This holds no matter what words I used to say it ("remove",
     "undo", "cancel", "never mind", "go back to", or any other phrasing with the same intent
     -- judge by what I mean, not which word appears).
   - If it cannot both hold with something already in spec.md, and I did not clearly signal
     that I am revising that detail, do not pick a side and do not merge. Leave spec.md as it
     was, list the conflict under a "## Unresolved conflicts" section (both sides, and the
     instruction each came from), and ask me to decide.
   If you cannot tell a revision from a conflict, treat it as a conflict and ask.

   Every requirement in spec.md, after this rewrite, must be something I actually wrote across
   prompts.md. Do not add a file name, library, framework, code, or any design or
   implementation choice I did not state, even if it seems reasonable. Do not reword the
   CONTENT of what I wrote into your own phrasing either, even to make it read more cleanly --
   reuse my exact words for names, values, and conditions; a reworded restatement of content is
   how an unwritten detail slips in disguised as a summary, the same failure as inventing
   content outright. If something is not directly traceable back to what I wrote, leave it out.

   Do not edit spec.md's existing sentence for a topic by splicing my new instruction's own
   wording into it, the way a text editor would patch a line. Instead, whenever my instruction
   touches a topic already covered in spec.md, gather EVERY prompt in prompts.md that has ever
   said something about that same topic (including this new one), and write ONE fresh sentence
   for that topic from that whole set -- exactly the way you would if you were consolidating
   only those prompts into a master prompt for the first time, in a single pass. Treat the
   topic's history as raw material to write from, not text to edit: the fresh sentence states
   only the requirement itself, in the same plain, declarative register a master prompt is
   written in -- whatever in the source prompts was about the conversation itself, rather than
   about what must be built, does not survive into a document freshly written from scratch, the
   same way it would never appear if you were drafting a specification from these prompts for
   the first time. You are recomposing from wording I actually used, not inventing anything, so
   this is still fidelity, not paraphrase -- but fidelity is to the CONTENT (names, values,
   conditions, constraints) of the topic's full history, not to reproducing any one prompt's
   sentence whole, including whatever in it was not content. For example, this single fresh-
   from-history rule is why "I'd like to build a simple ERP web application for a small
   business. Let's start with a clean foundation that we can gradually expand." becomes "Build a
   simple ERP web application for a small business with a clean foundation that can be gradually
   expanded.", and why "Add 3 navigation buttons: Home, Orders, Contact." plus a later "Change
   navigation buttons: Dashboard, Policies, History, Contact." becomes one fresh "Add 4
   navigation buttons: Dashboard, Policies, History, Contact." -- the same operation both times,
   not two different rules. Doing this per topic, every time that topic is touched, is what
   keeps every turn's spec.md reading the way one whole-history consolidation would.
   Also keep the source's own economy of language: if a sentence omits repeated words across a
   list of clauses, keep that same omission rather than spelling every clause out in full.

3. Derive. Write or change code so it matches spec.md.

When I say "consolidate", output spec.md exactly as it stands, plus "## Unresolved conflicts"
if that section is non-empty. Do not re-derive it from prompts.md -- spec.md, as already
maintained, is the master prompt.
```
