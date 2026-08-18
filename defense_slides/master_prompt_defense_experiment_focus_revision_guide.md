# Revision Guide for Bachelor Thesis Defense Slides
## Focus: Experimental Design, Interpretation, and Research Challenges

Use this document to revise the current Bachelor Thesis Defense slide deck.

### Source priority
Use the following files as the authoritative basis:
1. `10422080_NguyenThanhTu_Bachelor Thesis Report(3).pdf`
2. `defense(7).pdf`

The thesis report is the source of truth for:
- terminology;
- methodology;
- experiment design;
- numerical results;
- interpretations;
- limitations;
- claims.

Do **not** invent experiments, results, datasets, metrics, model names, or conclusions.

Do **not** write speaker scripts or speaker notes.

The task is to revise:
- slide order;
- slide titles;
- concise bullet points;
- diagrams;
- tables;
- visual emphasis;
- interpretation slides.

---

# 1. Main Presentation Goal

The revised presentation should spend less time on generic discussion/conclusion slides and more time on:

- experimental design;
- why the experiment was designed that way;
- evaluation methodology;
- research challenges;
- evidence;
- interpretation;
- limitations directly connected to each experiment.

The presentation should tell this story:

```text
Master Prompt problem
        ↓
Research Questions
        ↓
Experimental Design
        ↓
Experiment 1:
Can we construct a traceable Master Prompt?
        ↓
Evidence
        ↓
Interpretation + Challenges
        ↓
Experiment 2:
Can we maintain a settled Master Prompt
without silently changing it?
        ↓
Evidence
        ↓
Interpretation + Challenges
        ↓
Overall Interpretation
        ↓
Q&A
```

Do **not** keep separate main sections titled:
- Discussion
- Conclusion

Instead, integrate their useful content into the interpretation slides after each experiment.

---

# 2. Keep the Existing Beginning

Keep the current Motivation & Problem sequence from `defense(7).pdf`:

1. **What Is a Master Prompt?**
2. **A Master Prompt Is Not Exactly a Conversation Summary**
3. **From Prompt History to a Master Prompt**
4. **Properties of a Reliable Master Prompt**
5. **Research Questions**
6. **Three Contributions**
7. **Research Gap**
8. **Closest Prior Work: Semantic Commit**

Do not redesign this section unless a small wording or layout change is necessary.

The current narrative is:

```text
What is a Master Prompt?
        ↓
Why it is not simply a conversation summary
        ↓
Expected Master Prompt from evolving prompt history
        ↓
Faithful / Current / Conflict-aware
        ↓
Research Questions
```

Preserve this logic.

---

# 3. Methodology Section — Reduce Redundancy

The current deck contains both:

- `Experimental Design: From Master-Prompt Construction to Conflict Handling`
- `Experimental Pipeline: Step by Step`

These slides overlap too much.

## Replace them with ONE overview slide

### Title
**Experimental Design: Two Stages of the Master-Prompt Lifecycle**

### Left side — Experiment 1
**Master-Prompt Construction**

**Question**
> Can a traceable Master Prompt be constructed from an evolving prompt history?

Flow:

```text
Prompt History
→ Consolidation Strategy
→ Candidate Master Prompt
→ Requirement-Level Evaluation
→ RQ1 / RQ2
```

Supporting bullets:
- 2 project histories
- 3 AI coding agents
- 4 consolidation strategies
- AlignScore + untraceable rate

### Right side — Experiment 2
**Post-Handoff Maintenance**

**Question**
> Can later semantic conflicts be surfaced without silently changing a settled Master Prompt?

Flow:

```text
Settled Master Prompt
→ Later Prompts
→ Conflict-Handling Condition
→ Qualitative Evaluation
→ RQ3
```

Supporting bullets:
- same settled ground-truth Master Prompt
- later prompts sent one at a time
- 3 conflict-handling conditions
- 5 constructed conflicts + 2 compatible controls

Do not over-explain the full pipeline on this overview slide.

---

# 4. Two Controlled Project Histories & Ground Truth

The current slide only shows the two project histories.

Expand it slightly so the audience understands why ground truth exists.

### Title
**Two Controlled Project Histories and Ground Truth**

### Content

| Project | Prompts | Description |
|---|---:|---|
| Simple | 12 | Portal with navigation, conditional styling, contact form, and later navigation changes |
| Hard | 45 | ERP-style application with customers, vendors, products, orders, invoices, reports, roles, permissions, revisions, removals, and conversational wording |

Then add a compact ground-truth box:

**Ground truth**
- Manually constructed from the ordered prompt history.
- Retains only requirements still valid at the end.
- Later modifications replace earlier values.
- Removals / undo instructions remove affected requirements.
- Unsupported implementation details are excluded.

Add:

> **The same ground-truth Master Prompt is later reused as the settled starting artifact in Experiment 2.**

This point is important because it links the two experiments.

---

# 5. Experiment 1 — Four Consolidation Strategies

Keep the current strategy slide, but make the experimental comparison clearer.

### Title
**Experiment 1 — Four Consolidation Strategies**

### Group A — Single-pass
- **Basic** — consolidate the ordered history once at the end.
- **Loose** — additionally account for modifications, removals, and missing/additional features.
- **Strict** — additionally require every requirement to be traceable to the numbered prompts.

### Group B — Per-turn
- **Spec-guided** — maintain:
  - `prompts.md`: append-only original prompts;
  - `spec.md`: current Master Prompt.
- Update `spec.md` after each prompt.

Visual:

```text
Single-pass:
Prompt 1 → Prompt 2 → ... → Prompt N → Consolidate Once

Spec-guided:
Prompt 1 → Update
Prompt 2 → Update
...
Prompt N → Update
```

Important:
Do not imply spec-guided is already proven better.
At this point it is only a different experimental strategy.

---

# 6. Experiment 1 — Requirement-Level Evaluation

Replace the current minimal slide with a more explicit visual.

### Title
**Experiment 1 — Requirement-Level Traceability Evaluation**

### Pipeline

```text
Candidate Master Prompt
        ↓
Requirement Decomposition
        ↓
Atomic Candidate Requirements
        ↓
AlignScore
context = Ground-Truth Master Prompt
claim   = Candidate Requirement
        ↓
Mean AlignScore
+
Untraceable Rate
```

### Keep these exact meanings

**Mean AlignScore**
- average support score across candidate requirements.

**Untraceable rate**
- percentage of candidate requirements with AlignScore < 0.5.

Add a small note:

> **Precision-style evaluation: it checks included candidate content, not omitted ground-truth requirements.**

Do not call AlignScore a similarity metric.

---

# 7. ADD — Challenge: Defining the Evaluation Unit

This is an important methodology slide that is currently missing.

### Title
**Challenge: Defining the Evaluation Unit**

### Left — Ground Truth

```text
Hand-Written Ground-Truth Master Prompt
        ↓
Manual Semantic Decomposition
        ↓
Reference Requirements
```

### Right — Candidate

```text
Candidate Master Prompt
        ↓
Fixed LLM Decomposition Prompt
        ↓
Author Review of Segmentation
        ↓
Candidate Requirements
```

### Key bullets
- Ground-truth requirements are manually decomposed.
- Candidate requirements are initially decomposed by an LLM.
- Few-shot examples follow the same splitting decisions used for the ground truth.
- Candidate segmentation is manually reviewed to keep a similar semantic granularity.
- Review changes **only segmentation**, not candidate content.

### Important example

Show:

```text
"Add 4 navigation buttons:
Dashboard, Policies, History, Contact."
```

Do **not** force decomposition into:

```text
Add Dashboard
Add Policies
Add History
Add Contact
```

because this can lose the group/count constraint.

### Bottom takeaway

> **Atomic means a meaningful software-requirement unit, not the smallest possible sentence.**

This is an important methodological challenge and should be visible in the defense.

---

# 8. Why Semantic Entailment Is Needed

Keep the current AlignScore comparison slide.

### Title
**Why Semantic Entailment Is Needed for Traceability**

Keep the two examples:

| Pair | BERTScore (P) | AlignScore |
|---|---:|---:|
| Blue vs. red background | 0.98 | 0.0002 |
| Faithful paraphrase | 0.63 | 0.87 |

Use the takeaway:

> **High lexical similarity does not imply semantic support.**

And:

> **Traceability requires checking whether the candidate requirement is supported by the ground truth.**

Do not describe AlignScore as similarity.

---

# 9. RQ1 — Results

Keep the full current table.

### Title
**RQ1 — Effect of Consolidation Instruction Strictness**

Highlight:
- Strict > Basic: **6 / 6**
- Strict > Loose: **5 / 6**

Keep the sentence:

> **The improvement is not monotonic from Basic → Loose → Strict.**

Do not reduce the result to:
> “More instructions are better.”

---

# 10. ADD / MERGE — RQ1 Interpretation

Immediately after the RQ1 results, add a short interpretation block or slide.

### Title
**RQ1 — Interpretation**

### Evidence
- Strict outperforms Basic in all 6 comparisons.
- Strict outperforms Loose in 5 of 6 comparisons.
- Loose occasionally performs worse than Basic.

### Interpretation

> **The explicit traceability constraint matters more than simply adding more consolidation instructions.**

Also state:

> **Strict prompting reduces non-traceable content, but does not guarantee a fully traceable Master Prompt.**

Do not overclaim.

---

# 11. RQ2 — Results

Keep the current table.

### Title
**RQ2 — Spec-Guided vs. Single-Pass Consolidation**

Highlight:
- Spec-guided improves in **4 / 6** agent–project comparisons.
- All three agents improve on the simple project.
- Only Codex improves automatically on the hard project.
- Claude and Gemini have lower automatic scores on the hard project.

Keep:

> **0% untraceable does not prove completeness because omitted requirements are not measured.**

Do not claim:
> “Spec-guided is better.”

---

# 12. Keep the Concrete Output Examples

Keep both:

### Slide
**Example: Non-Traceable Content in Single-Pass Consolidation**

Claude · Simple Project · Basic

Highlight:
- HTML / CSS / JavaScript
- filenames
- app launchpad
- localStorage
- glassmorphic styling

Keep:
- AlignScore = 0.086
- Untraceable rate = 92%

### Slide
**Example: Spec-Guided Consolidation**

Claude · Simple Project · Spec-Guided

Highlight:
- four requested navigation buttons
- top navigation
- contact form
- removed dark theme/sidebar do not appear

Keep:
- AlignScore = 0.989
- Untraceable rate = 0%

Do not claim the second output proves completeness.

---

# 13. Reframe the Governance-Development Slide as a Research Challenge

Current title:
`Developing the Spec-Guided Governance Instruction`

Change to:

### Title
**Challenge: Maintaining a Standalone Specification**

### Problem 1 — Edit-oriented wording
Example:

```text
"Change navigation buttons:
Dashboard, Policies, History, Contact."
```

should become:

```text
"Add 4 navigation buttons:
Dashboard, Policies, History, Contact."
```

### Problem 2 — Conversation-dependent wording
Example:

```text
"I'd like to build..."
"Let's start with..."
```

should become a standalone software requirement.

### Design response

> **Reconstruct the affected topic from its relevant prompt history rather than patching the previous sentence with the latest wording.**

Important:
Keep the note that these are observed failure modes during governance-instruction development, not universal properties of spec-guided methods.

---

# 14. Interpreting Low AlignScore

Keep this slide and strengthen its role.

### Title
**Interpreting Low AlignScore**

Three observed causes:

1. **Same requirement, different wording**
2. **Non-requirement conversational content**
3. **Genuinely hallucinated details**

Keep the actual examples from the report:
- `Introduce user roles...` vs. `Support the user roles...`
- reason/temporary comment mis-split as requirement
- Gemini: Admin-only User Accounts view
- Gemini: Vendors added to a 3-item navigation bar

Bottom:

> **Untraceable rate is a screening measure, not a hallucination rate.**

---

# 15. Experiment 1 — Final Interpretation & Trade-Off

Upgrade the existing trade-off slide.

### Title
**Experiment 1 — Interpretation and Trade-Off**

Use three blocks.

### What worked
- Explicit traceability rules improve single-pass consolidation.
- Strict > Basic in 6/6 comparisons.

### What is mixed
- Spec-guided improves in 4/6 comparisons.
- Strong on the simple project.
- Mixed on the harder project.

### Why

```text
Single-pass
→ one large reconstruction decision

Spec-guided
→ many smaller interpretation decisions
```

Main takeaway:

> **Spec-guided should be understood as an alternative workflow, not a guaranteed improvement.**

Bottom limitations:
- AlignScore can be wording-sensitive.
- Low score does not automatically mean hallucination.
- Omitted valid requirements are not measured.

This slide should absorb the relevant Experiment 1 discussion and limitation content.

---

# 16. Experiment 2 — Start With the New Problem

Keep:

### Title
**When Does a Later Prompt Become a Conflict?**

Use the due-date example:

Settled:
> Invoice due date = 15 days

Later:
> Reminder before the 30-day due date

Explain visually:

```text
Later prompt does NOT explicitly revise 15 → 30.
It assumes an incompatible value.
```

Bottom:

> **Semantic conflict ≠ clear revision**

---

# 17. Keep — Clear Revision vs. Semantic Conflict

Keep the current comparison table.

### Clear revision
> “Change the due date to 30 days.”

Expected:
> update requirement.

### Semantic conflict
> “Add a reminder before the 30-day due date.”

Expected:
> preserve + report + user resolution.

This distinction is central to RQ3.

---

# 18. ADD — Experiment 2 Controlled Handoff Design

This design decision should be made explicit.

### Title
**Experiment 2 — Controlled Handoff Design**

Visual:

```text
Hand-Written Ground-Truth Master Prompt
        ↓
Neutral Handoff Prompt
        ↓
Later Prompts
(one at a time)
        ↓
3 Conflict-Handling Conditions
```

### Key bullets
- The ground-truth Master Prompt is used as the settled starting artifact.
- Every condition starts from the same correct project state.
- Later prompts are sent one at a time.
- This isolates conflict handling from errors introduced during Experiment 1 consolidation.

Bottom:

> **Starting from ground truth prevents Experiment 1 errors from confounding the RQ3 evaluation.**

This is an important methodological strength.

---

# 19. Move the Conflict Cases BEFORE Results

Currently, the conflict-case slides appear after the observed results.

Move them before the results.

### Slide
**Five Constructed Semantic Conflicts**

Hard project:
1. Due-date value
2. Recycle-bin scope
3. Navigation layout
4. Permission

Simple project:
5. Navigation count

### Slide
**Two Compatible Controls**

- Hard project: print button
- Simple project: footer note

Purpose:

> **Controls test whether compatible additions are accepted normally rather than incorrectly reported as conflicts.**

---

# 20. Three Conflict-Handling Conditions

Keep the current slide.

### Consolidate-Then-Ask
- consolidate first;
- inspect conflicts afterward.

### Do-Not-Resolve
- do not select or merge conflicting values;
- list conflict separately.

### Spec-Guided
- check each later prompt against the settled specification as it arrives.

Keep the note:

> **Qualitative demonstration — not a scored benchmark.**

---

# 21. ADD — How Experiment 2 Is Evaluated

This is currently missing and should be added.

### Title
**Experiment 2 — Qualitative Evaluation Criteria**

Use the five criteria from the report:

| Criterion | Expected Behavior |
|---|---|
| Conflict detection | Incompatible requirements are reported |
| No automatic resolution | Do not select or merge conflicting values |
| Preservation | Settled requirement remains |
| No invention | No new values or technical details |
| Source identification | Both conflicting requirements are identified |

Controls:

> Compatible control prompts should be added normally.

Bottom:

> **These criteria guide manual inspection; they do not produce a general conflict-detection accuracy score.**

---

# 22. Observed Behavior — Baselines

Keep:

### Title
**Observed Behavior: Consolidate-Then-Ask and Do-Not-Resolve**

Show the actual outputs.

### Consolidate-Then-Ask
- both 15-day and 30-day values remain;
- conflict is not explicitly identified.

### Do-Not-Resolve
- tested output reports:
  > “Conflicts found between prompts — None.”
- constructed conflicts were not identified.

Do not generalize beyond the tested outputs.

---

# 23. Observed Behavior — Spec-Guided

Keep the current due-date comparison figure.

### Title
**Observed Behavior: Spec-Guided Conflict Handling**

Highlight:

- settled 15-day requirement remains;
- later 30-day assumption is recorded separately;
- user is asked to decide.

Also mention:
- positive controls are accepted normally.

---

# 24. Experiment 2 — Interpretation & Challenges

Replace the separate generic Discussion later with this slide.

### Title
**Experiment 2 — Interpretation and Challenges**

### Observed behavior
- Settled requirement preserved.
- Incompatible assumption surfaced separately.
- User remains responsible for resolving unclear intent.
- Compatible controls accepted normally.

### Interpretation

> **Continuous checking can prevent an unclear semantic conflict from silently becoming a project decision.**

### Challenges / limitations
- 5 constructed conflicts + 2 compatible controls only.
- Direct conflict wording may be easier than realistic ambiguous conflicts.
- Outputs are non-deterministic.
- Same author designed and evaluated the conflict cases.
- This is a qualitative demonstration, not a general accuracy benchmark.

---

# 25. Remove Separate Discussion and Conclusion Sections

Remove the main-section dividers:

- `Discussion, Limitations & Future Work`
- `Conclusion`

Remove the standalone generic limitations slide from the main deck.

The limitations should already appear in:
- Experiment 1 interpretation;
- Experiment 2 interpretation.

Do not completely delete them from the presentation.

---

# 26. Final Main Slide Before Q&A

Add one final synthesis slide.

### Title
**Overall Interpretation: What the Two Experiments Show**

### RQ1
> **Explicit traceability constraints reduce non-traceable content in single-pass consolidation.**

Supporting result:
- Strict > Basic: 6/6
- Strict > Loose: 5/6

### RQ2
> **Spec-guided consolidation improves traceability in 4/6 comparisons, but introduces repeated interpretation decisions.**

### RQ3
> **The qualitative handoff study shows that a settled specification can be used to surface incompatible later assumptions without silently resolving them.**

### Final takeaway

> **Master-prompt construction is not only a generation problem; it is also a specification-maintenance problem.**

Do not introduce new conclusions here.

---

# 27. Final Slide

### Title
**Thank You**

Subtitle:
**Questions?**

Keep minimal.

---

# 28. Recommended Final Order

```text
Title
Outline

Motivation & Problem
1. What Is a Master Prompt?
2. A Master Prompt Is Not Exactly a Conversation Summary
3. From Prompt History to a Master Prompt
4. Properties of a Reliable Master Prompt

Research Questions & Contributions
5. Research Questions
6. Three Contributions

Related Work
7. Research Gap
8. Closest Prior Work: Semantic Commit

Methodology
9. Experimental Design: Two Stages of the Master-Prompt Lifecycle
10. Two Controlled Project Histories and Ground Truth

Experiment 1
11. Four Consolidation Strategies
12. Requirement-Level Traceability Evaluation
13. Challenge: Defining the Evaluation Unit
14. Why Semantic Entailment Is Needed for Traceability
15. RQ1 — Effect of Consolidation Instruction Strictness
16. RQ1 — Interpretation
17. RQ2 — Spec-Guided vs. Single-Pass Consolidation
18. Example: Non-Traceable Content in Single-Pass Consolidation
19. Example: Spec-Guided Consolidation
20. Challenge: Maintaining a Standalone Specification
21. Interpreting Low AlignScore
22. Experiment 1 — Interpretation and Trade-Off

Experiment 2
23. When Does a Later Prompt Become a Conflict?
24. Clear Revision vs. Semantic Conflict
25. Experiment 2 — Controlled Handoff Design
26. Five Constructed Semantic Conflicts
27. Two Compatible Controls
28. Three Conflict-Handling Conditions
29. Experiment 2 — Qualitative Evaluation Criteria
30. Observed Behavior: Consolidate-Then-Ask and Do-Not-Resolve
31. Observed Behavior: Spec-Guided Conflict Handling
32. Experiment 2 — Interpretation and Challenges

Synthesis
33. Overall Interpretation: What the Two Experiments Show

34. Thank You / Questions
```

If presentation time is too short, merge rather than delete the key methodology/challenge slides.

Recommended merges:
- RQ1 results + RQ1 interpretation
- two concrete Experiment 1 example slides
- five conflicts + two controls
- Experiment 2 observed behavior slides

Do **not** remove:
- evaluation-unit challenge;
- Experiment 2 controlled handoff design;
- Experiment 2 evaluation criteria;
- final interpretation slides.

These are important for demonstrating research design rather than only reporting results.

---

# 29. Scientific Wording Rules

Always use:

- **traceability**
- **semantic support**
- **entailment-based AlignScore**
- **untraceable rate**
- **spec-guided consolidation**
- **semantic conflict**
- **clear revision**
- **qualitative demonstration**
- **maintained specification**

Do not use:

- “similarity” for AlignScore;
- “hallucination rate” for untraceable rate;
- “spec-guided always performs better”;
- “conflict detection accuracy” for Experiment 2;
- “the method solves handoff”;
- “all later requirements override earlier requirements.”

---

# 30. Final Revision Principle

The revised defense should spend more time answering:

> **How was the experiment designed?**

> **Why was it designed that way?**

> **What challenge did this design have to solve?**

> **What does the evidence actually show?**

> **What does it not show?**

The final presentation should feel less like:

```text
Method → Table → Table → Conclusion
```

and more like:

```text
Research Question
        ↓
Experimental Design
        ↓
Methodological Challenge
        ↓
Evidence
        ↓
Interpretation
        ↓
Limitation
```

The goal is to make the committee see not only the results, but also the research reasoning behind the experiments.
