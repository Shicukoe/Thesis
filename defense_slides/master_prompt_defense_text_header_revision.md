# Bachelor Thesis Defense — Text & Header Revision Guide

## Purpose

This document is a **textual revision specification** for rewriting the current `defense(1).pdf`.

The thesis report is the authoritative source. The goal is **not to redesign the research or change the findings**, but to make the presentation language:

- academically professional;
- consistent with the terminology and claims in the report;
- precise enough for a thesis-defense committee;
- concise enough for oral presentation;
- free from meta-commentary, speaker coaching, or language that sounds like it anticipates questions.

A key principle:

> **Do not write on the slide what the presenter is thinking about the audience. Write what the research found.**

For example, avoid:

- “Reading this correctly”
- “Being upfront”
- “Limitations — stated before they’re asked”
- “Why this is important”
- “If asked…”
- “Honest answer…”
- “The real trade-off…”
- “What actually happened”

These can be useful speaker notes, but they should not appear as academic slide text.

---

# 1. Thesis-level terminology that must remain consistent

Use the terminology from the report wherever possible.

| Concept | Preferred terminology |
|---|---|
| Overall artifact | **master prompt** |
| Master prompt definition | **single, self-contained specification of the user's currently valid intent** |
| Main Experiment 1 problem | **non-traceable consolidation** |
| Main Experiment 1 evaluation | **traceability evaluation** |
| Main metric | **AlignScore** |
| Threshold metric | **untraceable rate** |
| Maintenance approach | **spec-guided consolidation** |
| Persistent artifact | **maintained specification** |
| Main Experiment 2 problem | **semantic conflict** |
| Experiment 2 method | **conflict-handling method / spec-guided conflict handling** |
| Explicit change | **clear revision** |
| Ambiguous contradiction | **semantic conflict** |
| Experiment 2 evaluation type | **qualitative demonstration** |
| Research limitation | **threats to validity / limitations** |

Avoid inventing broader terms such as “conflict resolution system”, “hallucination detector”, or “automatic intent resolver”.

---

# 2. Title slide

## Current

> AI-ASSISTED MASTER PROMPT GENERATION  
> CHALLENGES AND PROPOSED SOLUTIONS

## Recommended

Keep the exact thesis title:

> **AI-ASSISTED MASTER PROMPT GENERATION**  
> **CHALLENGES AND PROPOSED SOLUTIONS**

This matches the submitted report and should not be changed.

Optional subtitle:

> **Bachelor’s Thesis Defense**

Do not add a broader claim such as “A New Framework for Reliable AI Coding Agents”.

---

# 3. Outline slide

## Current

> Motivation & Problem  
> Research Questions & Contributions  
> Related Work  
> Methodology  
> Experiment 1: Results  
> Experiment 2: Conflict Detection  
> Discussion  
> Conclusion

## Recommended

> **Motivation & Problem**  
> **Research Questions & Contributions**  
> **Related Work**  
> **Methodology**  
> **Experiment 1: Traceability Evaluation**  
> **Experiment 2: Semantic Conflict Handling**  
> **Discussion, Limitations & Future Work**  
> **Conclusion**

The report names Chapter 4 “Experiment 1: Traceability Evaluation (RQ1, RQ2)” and Chapter 5 “Experiment 2: Semantic Conflict in a Master Prompt (RQ3)”. The presentation titles should reflect this terminology.

---

# 4. Section divider — Motivation & Problem

## Recommended

> **Motivation & Problem**

Keep this unchanged.

---

# 5. Slide: “A prompt history is not a specification”

## Current header

> A prompt history is not a specification

## Recommended header

> **Why a Prompt History Is Not a Current Specification**

### Recommended body

> In AI-assisted development, project requirements evolve through a sequence of prompts containing additions, corrections, removals, replacements, and changes of direction.
>
> The history records how the project evolved, but it does not directly state which requirements remain valid.
>
> **Master prompt:** a single, self-contained specification of the user's currently valid intent.

### Replace

> “If the project is ever handed off, nobody wants to re-read every turn…”

with:

> **A handoff should not require reconstructing the current project state from the entire prompt history.**

---

# 6. Slide: “What a master prompt needs to be”

## Recommended header

> **Properties of a Reliable Master Prompt**

### Recommended body

> **Faithful**  
> Every requirement is supported by the user's prompt history.
>
> **Current**  
> Later modifications, removals, and replacements are reflected in the final specification.
>
> **Conflict-aware**  
> Ambiguous semantic conflicts are surfaced rather than silently resolved.

### Remove from visible slide

- “BEING UPFRONT”
- “These three are what RQ1–RQ3 test.”
- “Completeness (recall) isn’t measured either…”

Put recall limitations on the Limitations slide instead.

### Important

Do not write:

> “New requirements override old ones.”

The report distinguishes clear revisions from ambiguous semantic conflicts.

---

# 7. Slide: Two failure modes

## Current header

> But that document can be wrong in two ways

## Recommended header

> **Two Failure Modes in Master-Prompt Construction**

### Recommended body

### 1. Non-traceable consolidation
The master prompt may:

- include requirements the user never requested;
- retain requirements that were later removed or replaced;
- omit valid requirements.

### 2. Semantic conflict after handoff
A later prompt may assume a value or condition that conflicts with an already-settled requirement without explicitly requesting a change.

### Replace

> “Both failures look fine on the page — the rest of this talk is about catching them.”

with:

> **These failures motivate the two experiments in this thesis.**

---

# 8. Section divider — Research Questions & Contributions

## Recommended

> **Research Questions & Contributions**

---

# 9. Slide: Research Questions

## Current header

> Three research questions

## Recommended header

> **Research Questions**

### Recommended wording

> **RQ1**  
> To what extent do AI-generated master prompts contain non-traceable content, and how does consolidation instruction strictness affect this problem?
>
> **RQ2**  
> Does spec-guided consolidation produce a more traceable master prompt than single-pass consolidation?
>
> **RQ3**  
> When a later instruction semantically conflicts with a settled requirement, how can a spec-guided approach surface the conflict and avoid resolving it without user input?

Do not use conversational wording such as “beat”.

---

# 10. Slide: Contributions

## Header

> **Three Contributions**

### Recommended body

**1. Requirement-level traceability evaluation**

> A requirement-level method using atomic decomposition and entailment-based AlignScore to evaluate whether candidate master-prompt requirements are supported by the ground truth.

**2. Spec-guided consolidation**

> A maintained specification is updated throughout the prompt history rather than reconstructed only at the end.

**3. Conflict-aware project handoff**

> Later instructions are checked against the settled specification; unclear conflicts are preserved for user resolution rather than silently resolved.

Keep contributions separate from the research-gap claim.

---

# 11. Section divider — Related Work

## Recommended

> **Related Work**

---

# 12. Slide: Research gap matrix

## Current header

> No single approach covers all three at once

## Recommended header

> **Research Gap: Three Complementary Requirements**

Keep the comparison table.

### Recommended conclusion

> **Among the reviewed works, no single approach addresses all three aspects together.**

Do not use:

> “Nobody else’s row is full.”

Do not claim:

> “No one else does this.”

---

# 13. Slide: closest prior work

## Current header

> The closest prior work — one difference

## Recommended header

> **Closest Prior Work: Semantic Commit**

### Recommended body

> Semantic Commit checks new information against an existing intent specification and supports user review of conflicts.
>
> **Key difference:** Semantic Commit starts with an existing specification. This thesis first studies how a traceable master prompt can be constructed from a chronological prompt history, then reuses the maintained specification for post-handoff conflict handling.

Optional final sentence:

> **This thesis therefore addresses specification construction before specification maintenance.**

Avoid the metaphorical phrase “defend it after handoff”.

---

# 14. Section divider — Methodology

## Recommended

> **Methodology**

---

# 15. Slide: Overview of experiments

## Current header

> Two experiments, one pipeline

## Recommended header

> **Two Experiments Across the Master-Prompt Lifecycle**

### Recommended text

> **Experiment 1 — Traceability Evaluation (RQ1, RQ2)**  
> Construct candidate master prompts from prompt histories and evaluate requirement-level traceability.
>
> **Experiment 2 — Semantic Conflict Handling (RQ3)**  
> Start from a settled master prompt and evaluate how later instructions that conflict with it are handled.

“Two experiments, one pipeline” is slightly misleading because the report treats them as two connected experiments rather than one technical pipeline.

---

# 16. Slide: datasets

## Current header

> Two datasets

## Recommended header

> **Two Controlled Project Histories**

### Recommended table labels

| Project | Prompts | Description |
|---|---:|---|
| **Simple project** | 12 | Portal with navigation, conditional styling, and contact form |
| **Hard project** | 45 | ERP-style application with customers, vendors, orders, invoices, roles, and permissions |

Where space allows, state:

> **Both histories were created by the author for controlled evaluation.**

This can also be mentioned in Limitations.

---

# 17. Slide: four strategies

## Current header

> Four strategies, one shared governance rule

## Recommended header

> **Four Consolidation Strategies**

### Recommended body

> **Single-pass strategies**
>
> **Basic** — consolidate the ordered history into one master prompt.
>
> **Loose** — additionally account for modifications, removals, and missing/additional features.
>
> **Strict** — explicitly require every requirement to be traceable to the numbered prompts.
>
> **Spec-guided** — maintain `prompts.md` and `spec.md`, updating the current specification after each prompt.

Do not describe all four as having “one shared governance rule”.

---

# 18. Slide: traceability evaluation

## Current header

> Requirement-level traceability evaluation

## Recommended

Keep:

> **Requirement-Level Traceability Evaluation**

### Replace

> “Split the consolidated prompt into its smallest individual requirements.”

with:

> **Decompose the candidate master prompt into atomic software requirements.**

Then:

> **For each requirement:** Is it supported by the ground-truth master prompt?
>
> **Metrics:** Mean AlignScore; untraceable rate (AlignScore < 0.5).

Do not say that AlignScore measures “correctness”. It measures whether a candidate requirement is supported by the ground-truth context.

---

# 19. Section divider — Experiment 1

## 🔴 Must change

### Current

> Experiment 1: Results

### Recommended

> **Experiment 1: Traceability Evaluation**

Optional subtitle:

> **RQ1 & RQ2**

This should match the report.

---

# 20. Slide: why AlignScore

## Current header

> Why semantic entailment is needed for traceability evaluation

## Recommended

Keep this header.

### Replace

> “98% word-similar, completely wrong”

with:

> **High lexical similarity does not imply semantic support.**

The evidence can remain:

- contradiction: BERTScore 0.98 vs. AlignScore 0.0002;
- faithful paraphrase: BERTScore 0.63 vs. AlignScore 0.87.

---

# 21. Slide: RQ1 results

## Current header

> RQ1 — does stricter wording help

## Recommended header

> **RQ1 — Effect of Consolidation Instruction Strictness**

### Recommended conclusion

> **Strict outperforms basic in all six agent–project comparisons and outperforms loose in five.**

Then:

> **The improvement is not monotonic from basic → loose → strict.**

This is more faithful to the report than “loose is not a stable middle step”.

---

# 22. Slide: RQ2 results

## Current header

> RQ2 — does per-turn consolidation help

## Recommended header

> **RQ2 — Spec-Guided vs. Single-Pass Consolidation**

### Recommended conclusion

> **Spec-guided improves traceability over the same agent’s strict baseline in 4 of 6 comparisons.**

Then:

> **The effect depends on project complexity and agent.**

### Remove

> “READING THIS CORRECTLY”

Replace with direct interpretation:

> **Claude and Gemini perform better with strict on the hard project, while all three agents improve on the simple project.**

### Replace

> “0.987–0.989 / 0% untraceable does not mean the prompt is complete…”

with:

> **A 0% untraceable rate does not establish completeness because the evaluation does not measure omitted requirements.**

---

# 23. Slide: basic example

## Current header

> Same agent, same history — basic consolidation

## Recommended header

> **Example: Non-Traceable Content in Single-Pass Consolidation**

Use:

> **Claude · Simple project · Basic**

### Replace

> “REAL NUMBERS — TABLE 4.1”

with:

> **AlignScore: 0.086 · Untraceable rate: 92%**

This is cleaner and more research-oriented.

---

# 24. Slide: spec-guided example

## Current header

> Same agent, same history — spec_guided

## Recommended header

> **Example: Spec-Guided Consolidation**

Use:

> **Claude · Simple project · Spec-guided**

### Replace

> “Not just avoiding invention: it forgets what it was told to forget.”

with:

> **Removed requirements are excluded from the final specification.**

Optional:

> **The final specification reflects the current project state rather than the complete historical sequence.**

---

# 25. Slide: governance instruction development

## Current header

> Two real failure modes in the governance rule

## Recommended header

> **Developing the Spec-Guided Governance Instruction**

### Subheading 1

> **Failure Mode 1 — Edit Instructions Remain in the Specification**

Example:

> “Change navigation buttons: …”

→

> “Add 4 navigation buttons: …”

### Subheading 2

> **Failure Mode 2 — Conversational Wording Remains in the Specification**

Example:

> “I’d like to build…”

→

> “Build a simple ERP web application…”

### Remove

> “PROMPT EDITS AND THE EXPERIMENT — ANGLE TWO”

This is internal presentation-planning language.

Also make clear that these were problems **observed while developing the governance instruction**, rather than universal failure modes of the whole method.

---

# 26. Slide: low AlignScore interpretation

## Current header

> Not every low score is a hallucination

## Recommended

Keep this header.

### Recommended structure

> **Three causes identified by manual review:**
>
> 1. Same requirement, different wording
> 2. Non-requirement conversational content
> 3. Genuine hallucinated detail
>
> **Untraceable rate is a screening measure, not a hallucination rate.**

Do not say AlignScore is “wrong”. Instead:

> **AlignScore is useful for screening, but interpretation is limited by wording sensitivity and requirement decomposition.**

---

# 27. Slide: trade-off

## Current header

> The trade-off of per-turn maintenance

## Recommended

Keep:

> **The Trade-Off of Spec-Guided Maintenance**

### Recommended final sentence

> **Spec-guided consolidation reduces one large reconstruction problem, but replaces it with repeated interpretation decisions.**

Avoid:

> “more chances to slip.”

---

# 28. Section divider — Experiment 2

## 🔴 Must change

### Current

> Experiment 2: Conflict Detection

### Recommended

> **Experiment 2: Semantic Conflict Handling**

Optional subtitle:

> **RQ3**

The experiment compares conflict-handling conditions, not only detection.

---

# 29. Slide: revision vs. semantic conflict

## Current header

> Explicit revision vs. semantic conflict

## Recommended

Keep.

### Improve table wording

| | **Clear revision** | **Semantic conflict** |
|---|---|---|
| Example | “Change the due date to 30 days.” | “Add a reminder before the 30-day due date.” |
| Relationship to settled requirement | Explicitly replaces it | Assumes an incompatible value |
| Expected handling | Update the requirement | Preserve and report the conflict for user resolution |

Avoid:

> “Flag it, ask the user.”

Use:

> **Preserve and report; ask the user to decide.**

---

# 30. Slide: settled requirement vs. later prompt

## Current header

> One settled fact, one later prompt

## Recommended header

> **Handoff Scenario: Settled Requirement vs. Later Instruction**

### Recommended labels

> **Settled master prompt**
>
> “Invoices should have a due date 15 days after they are created.”

> **Later instruction**
>
> “Add a reminder that gets sent 3 days before an invoice’s 30-day due date.”

### Conclusion

> **The later prompt requests a feature but assumes a different settled value.**

---

# 31. Slide: three conflict-handling conditions

## Current header

> Three conflict-handling conditions

## Recommended

Keep.

### Recommended body

> **Consolidate-then-ask**  
> Consolidate the settled specification and later prompts first; inspect conflicts afterward.
>
> **Do-not-resolve**  
> Do not select or merge conflicting values; list the conflict separately.
>
> **Spec-guided**  
> Check each later prompt against the settled specification as it arrives.

Avoid conversational phrasing such as:

> “the value may already be overwritten before anyone asks.”

Use:

> **A conflict may only become visible after the specification has already been changed.**

---

# 32. Slide: observed results — conditions 1 & 2

## Current header

> Observed results — Conditions 1 & 2

## Recommended header

> **Observed Behavior: Consolidate-Then-Ask and Do-Not-Resolve**

### Recommended interpretation

**Consolidate-then-ask**

> The output contains both the settled 15-day requirement and the later 30-day assumption without explicitly identifying the semantic conflict.

**Do-not-resolve**

> The condition avoids selecting between conflicting values, but the tested output did not identify the planted conflicts.

This is better than showing quotations without stating what they demonstrate.

---

# 33. Slide: observed results — condition 3

## Current header

> Observed results — Condition 3

## Recommended header

> **Observed Behavior: Spec-Guided Conflict Handling**

### Recommended body

> The settled requirement remains unchanged.
>
> The incompatible later assumption is recorded separately.
>
> The user is asked to decide whether the earlier requirement should be revised.
>
> **The two compatible controls were accepted without being flagged as conflicts.**

This directly reflects the manual evaluation criteria in the report.

---

# 34. Slide: output structure

## Current header

> What the governance rule actually outputs

## Recommended header

> **Output Structure of the Spec-Guided Conflict Method**

### Recommended structure

```text
Master Prompt
Current, conflict-free requirements

Unresolved Conflicts
Settled requirement
Later conflicting instruction
Reason for conflict
```

Then:

> **Conflict decisions are based on requirement meaning rather than trigger words such as “change” or “instead”.**

Do not make the literal Markdown headings `## Master prompt` and `## Unresolved conflicts` the conceptual focus. Those are implementation details.

---

# 35. Slide: five conflicts

## Current header

> Five constructed conflicts, across two projects

## Recommended header

> **Experiment 2: Five Semantic Conflicts and Two Controls**

### Recommended table

| Conflict | Settled requirement | Later assumption |
|---|---|---|
| Due date | 15-day due date | 30-day due date |
| Recycle bin | Only vendors use recycle bin | Customers also use recycle bin |
| Navigation | Top navigation | Left sidebar |
| Permission | Staff cannot delete products | Staff deletion is audited |
| Navigation count | Four navigation buttons | Five navigation buttons |

Then:

> **Two compatible controls were included to test whether non-conflicting additions are accepted normally.**

---

# 36. Section divider — Discussion

## Current

> Discussion

## Recommended

> **Discussion, Limitations & Future Work**

This matches Chapter 6 of the report.

---

# 37. Slide: limitations

## Current header

> Limitations — stated before they’re asked

## 🔴 Recommended header

> **Limitations and Threats to Validity**

### Recommended body

**Limited dataset**
> Two author-created project histories, five constructed semantic conflicts, and two compatible controls.

**Limited repeated runs**
> Experiment 1 uses one scored candidate per condition; model outputs are non-deterministic.

**Single-author evaluation**
> Ground truth, requirement decomposition review, and conflict labels were produced by the same author.

**Metric coverage**
> AlignScore is wording-sensitive and does not measure omitted requirements.

### Remove completely

- “stated before they’re asked”
- “A current ceiling, not an oversight”
- “the clear next step…”

These sound like defensive preparation rather than scientific reporting.

---

# 38. Slide: conclusion

## Current header

> What did the thesis show?

## Recommended header

> **Conclusion: Answers to the Research Questions**

### RQ1

> **Strict consolidation outperforms basic consolidation in all six agent–project comparisons and outperforms loose consolidation in five.**
>
> However, strict prompting does not eliminate all non-traceable content.

### RQ2

> **Spec-guided consolidation improves traceability over the same agent's strict baseline in 4 of 6 comparisons.**
>
> The benefit is accompanied by a trade-off: fewer requirements must be reconstructed at once, but each prompt introduces another interpretation decision.

### RQ3

> **The qualitative handoff study demonstrates that spec-guided conflict handling can preserve settled requirements and surface incompatible later assumptions for user resolution.**

### Final takeaway

> **A master prompt should be treated as a maintained project specification, not merely as a one-shot summary of prompt history.**

---

# 39. Final slide

## Current

> Thank you  
> Questions?

## Recommended

> **Thank You**  
> **Questions?**

Keep it simple.

---

# 40. Global wording changes

| Current style | Recommended |
|---|---|
| “strict beats basic” | **Strict outperforms basic** |
| “spec_guided wins 4/6” | **Spec-guided improves over strict in 4 of 6 comparisons** |
| “Does per-turn consolidation beat single-pass?” | **Does spec-guided consolidation improve traceability over single-pass consolidation?** |
| “Nobody else…” | **Among the reviewed works…** |
| “What actually happened” | **Observed behavior** |
| “Reading this correctly” | **Interpretation of the results** |
| “Being upfront” | **Evaluation scope** / remove |
| “The real trade-off” | **The trade-off of spec-guided maintenance** |
| “The value may already be overwritten before anyone asks” | **The conflict may only become visible after consolidation** |
| “Flag it, ask the user” | **Preserve and report the conflict for user resolution** |
| “not just avoiding invention” | **The final specification reflects the current project state** |
| “forget what it was told to forget” | **Removed requirements are excluded from the final specification** |
| “one big decision” | **one large reconstruction decision** |
| “many small decisions” | **repeated interpretation decisions** |
| “more chances to slip” | **more opportunities for interpretation errors** |
| “real numbers” | **Quantitative result** |
| “the same discipline defends it” | **the same specification is reused for conflict checking** |

---

# 41. Global rule: remove meta-commentary from slide text

The following categories should **never appear in the final presentation**.

### Audience coaching

- “Reading this correctly”
- “If you remember one thing”
- “Why this matters”
- “What I want you to notice”
- “As you can see”
- “The important part is…”

### Anticipating questions

- “stated before they’re asked”
- “if someone asks…”
- “honest answer”
- “if pushed further”
- “you may wonder…”

### Internal presentation planning

- “angle two”
- “demo 1”
- “real numbers”
- “this is the part where…”
- “what actually happened”

### Defensive wording

- “not an oversight”
- “I know this looks…”
- “this may seem…”

These can belong in speaker notes, but not in the final academic deck.

---

# 42. Global rule: titles should describe research content

Prefer:

> **RQ2 — Spec-Guided vs. Single-Pass Consolidation**

over:

> **Let’s see whether spec-guided wins**

Prefer:

> **Observed Behavior: Spec-Guided Conflict Handling**

over:

> **What actually happened**

Prefer:

> **Limitations and Threats to Validity**

over:

> **Limitations — stated before they’re asked**

Prefer:

> **The Trade-Off of Spec-Guided Maintenance**

over:

> **Where the real trade-off sits**

The title should remain meaningful if the slide is read without the presenter.

---

# 43. Global rule: distinguish evidence from interpretation

For results slides, use:

### Header
What is being evaluated?

### Evidence
Numbers, example, or observed output.

### Interpretation
One concise sentence explaining what the evidence supports.

Example:

> **RQ2 — Spec-Guided vs. Single-Pass Consolidation**
>
> **Evidence:** 4/6 comparisons improve.
>
> **Interpretation:** Spec-guided maintenance can improve traceability, but its effectiveness depends on the agent and project history.

Do not reduce the finding to:

> “Spec-guided wins.”

---

# 44. Global rule: do not turn limitations into self-defense

The report has four genuine limitations:

1. limited dataset;
2. limited repeated runs;
3. single-author evaluation;
4. metric coverage.

Present these neutrally.

Bad:

> “A current ceiling, not an oversight.”

Better:

> **AlignScore does not measure omitted requirements; coverage/recall evaluation is future work.**

---

# 45. Global rule: do not overclaim novelty

The report scopes the research gap to the reviewed literature.

Use:

> **Among the works reviewed in this chapter, the specific combination studied in this thesis remains open.**

Avoid:

> “This is the first system…”

unless a systematic literature review establishes that claim.

Avoid:

> “No existing system can…”

The thesis does not support a universal statement.

---

# 46. Global rule: Experiment 2 is qualitative

Experiment 2 is explicitly a:

> **qualitative demonstration**

It uses:

- five constructed conflicts;
- two compatible controls;
- manual evaluation criteria;
- no general conflict-detection score.

Therefore use:

> **Qualitative demonstration of semantic conflict handling**

Do not use:

- “benchmark”;
- “accuracy evaluation”;
- “conflict detection accuracy”.

---

# 47. Global rule: be precise about AlignScore

Use:

> **AlignScore measures whether a candidate requirement is supported by the ground-truth master prompt.**

Do not use:

> “AlignScore measures correctness.”

Do not use:

> “AlignScore detects hallucinations.”

Do not use:

> “0% untraceable means the master prompt is correct.”

Correct interpretation:

> **A low AlignScore identifies a candidate requirement that requires further inspection.**

Manual review identified:

1. same requirement, different wording;
2. non-requirement conversational content;
3. genuine hallucinated details.

---

# 48. Global rule: distinguish the two uses of spec-guided

There are two related but distinct uses.

### Experiment 1 / RQ2

Spec-guided **constructs and maintains the master prompt during the original prompt history**.

### Experiment 2 / RQ3

A separate governance instruction **checks later prompts against an already-settled master prompt after handoff**.

Use:

> **Both methods use the same conflict-handling principle, but Experiment 2 uses a separate governance instruction for the post-handoff setting.**

Do not imply that the two experiments use exactly the same prompt or identical procedure.

---

# 49. Recommended final presentation flow

1. **Motivation & Problem**
   - Why a prompt history is not a current specification
   - Properties of a reliable master prompt
   - Two failure modes

2. **Research Questions & Contributions**
   - RQ1–RQ3
   - Three contributions

3. **Related Work**
   - Research gap
   - Semantic Commit as closest prior work

4. **Methodology**
   - Two experiments across the lifecycle
   - Two project histories
   - Four consolidation strategies
   - Requirement-level evaluation

5. **Experiment 1: Traceability Evaluation**
   - Why AlignScore
   - RQ1
   - RQ2
   - Evidence examples
   - Low-score interpretation
   - Spec-guided trade-off

6. **Experiment 2: Semantic Conflict Handling**
   - Definition
   - Clear revision vs. semantic conflict
   - Handoff scenario
   - Three conditions
   - Observed behavior
   - Five conflicts + controls

7. **Discussion, Limitations & Future Work**
   - Main interpretation
   - Limitations
   - Future work

8. **Conclusion**
   - Explicit answer to RQ1
   - Explicit answer to RQ2
   - Explicit answer to RQ3
   - One final takeaway

---

# 50. Highest-priority textual fixes

## 🔴 MUST CHANGE

1. **“Experiment 1: Results” → “Experiment 1: Traceability Evaluation”**
2. **“Experiment 2: Conflict Detection” → “Experiment 2: Semantic Conflict Handling”**
3. **“Limitations — stated before they’re asked” → “Limitations and Threats to Validity”**
4. Remove **“READING THIS CORRECTLY”**.
5. Remove **“BEING UPFRONT”**.
6. Remove **“PROMPT EDITS AND THE EXPERIMENT — ANGLE TWO”**.
7. Replace conversational RQ wording such as **“beat”** with **“improve over”**.
8. Replace **“strict beats basic”** with **“strict outperforms basic”**.
9. Replace **“Nobody else…”** with **“Among the reviewed works…”**.
10. Replace **“one shared governance rule”** with **“Four Consolidation Strategies”**.
11. Replace **“The closest prior work — one difference”** with **“Closest Prior Work: Semantic Commit”**.
12. Replace **“What the governance rule actually outputs”** with **“Output Structure of the Spec-Guided Conflict Method”**.
13. Replace **“five constructed conflicts, across two projects”** with **“Five Semantic Conflicts and Two Controls”**.
14. Remove all presenter-facing/meta commentary from visible slides.
15. Make the conclusion use the exact RQ1/RQ2/RQ3 logic supported by the report.

## 🟡 SHOULD CHANGE

16. Use **“project histories”** instead of “datasets” where appropriate.
17. Use **“atomic software requirements”** instead of “smallest individual requirements”.
18. Use **“qualitative demonstration”** consistently for Experiment 2.
19. Use **“screening measure”** instead of implying untraceable rate equals hallucination rate.
20. Use **“maintained specification”** and **“spec-guided consolidation”** consistently.
21. Keep the visual style, but make titles and body text more research-oriented.
22. Keep slide titles understandable when read without the presenter.
23. Put caveats in the appropriate slide, especially Limitations, rather than anticipating examiner questions.
24. Separate raw evidence from interpretation.
25. Do not strengthen any claim beyond what the report demonstrates.

---

# 51. Final instruction to the presentation-writing AI

Rewrite the current defense presentation **slide by slide** using the thesis report as the authoritative source.

For every slide:

1. Give it a precise, academic header.
2. Keep the body concise enough for oral presentation.
3. Preserve the actual numerical results and experimental design.
4. Do not invent evidence.
5. Do not use conversational or defensive meta-commentary.
6. Do not anticipate examiner questions on the slide.
7. Do not make universal claims from a small experiment.
8. Clearly distinguish evidence, interpretation, and limitation.
9. Clearly distinguish Experiment 1 / RQ1–RQ2 from Experiment 2 / RQ3.
10. Use the thesis report's terminology wherever possible.

The final presentation should sound like:

> **a researcher reporting what was studied, how it was evaluated, what was observed, and what those observations support.**

It should **not** sound like:

> a presenter trying to convince the audience that the thesis is correct before they have asked questions.

The central textual principle is:

> **State the evidence first. State the supported interpretation second. Do not pre-emptively defend the thesis.**
