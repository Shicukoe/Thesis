# Professor Review — Bachelor Thesis Defense
## Master Prompt Thesis: Demo, Narrative, Headers & Defense Readiness

Use this document as an instruction for rewriting and improving the current Bachelor Thesis Defense presentation.

Act as a professor/thesis committee member in Computer Science, Software Engineering, and AI research.

The thesis report is the authoritative source for research claims, methodology, experiments, results, limitations, and conclusions.

## 1. MOST IMPORTANT CHANGE — ADD A CONCEPTUAL DEMO

The current presentation contains experimental demos, but the audience still needs a short demonstration answering:

> **What exactly is a master prompt?**

Add a short conceptual demo **before Experiment 1**.

### Recommended slide

# From Prompt History to a Master Prompt

Show:

```text
PROMPT HISTORY

1. Add dark theme
2. Remove dark theme
3. Add sidebar
4. Undo sidebar
5. Use top navigation
6. Rename buttons:
   Dashboard, Policies,
   History, Contact
7. Add contact form
...
```

↓

```text
MASTER PROMPT

Navigation
• Dashboard
• Policies
• History
• Contact
• Top navigation

Contact Form
• Name
• Email
• Message
• Email validation

Responsive
• Mobile support
```

Visually mark:

```text
REMOVED / OUTDATED

✗ Dark theme
✗ Sidebar
```

Say:

> **“The master prompt is not a summary of everything the user said. It is a specification of what is still valid at the end of the history.”**

Keep this demo to approximately **45–60 seconds**.

Its purpose is conceptual understanding, not experimental evaluation.

---

# 2. DISTINGUISH THE TWO DEMOS

## Demo A — Conceptual

### What Is a Master Prompt?

Purpose:

> Explain the artifact.

Flow:

```text
Prompt history
      ↓
add / remove / replace / undo
      ↓
current valid requirements
      ↓
MASTER PROMPT
```

## Demo B — Experimental

### Why Faithful Consolidation Matters

Keep the existing Claude examples.

### Basic

```text
Claude / Basic
AlignScore = 0.086
Untraceable = 92%

Unsupported:
• framework
• localStorage
• glassmorphism
• app launchpad
```

### Spec-guided

```text
Claude / Spec-guided
AlignScore = 0.989
Untraceable = 0%

Requirements remain supported by the history.
```

The first demo explains **what the artifact is**.  
The second demonstrates **why faithful consolidation matters**.

---

# 3. RECOMMENDED NARRATIVE

Use this overall story:

```text
WHY?
Prompt history is not a current specification.
        ↓
WHAT?
A master prompt represents the currently valid project state.
        ↓
SHOW IT
Prompt history → Master Prompt conceptual demo.
        ↓
WHY IS THIS HARD?
History contains additions, corrections, removals,
replacements, and changes of direction.
        ↓
WHAT CAN GO WRONG?
Non-traceable consolidation + semantic conflicts.
        ↓
RQ1 / RQ2
Can stricter consolidation improve traceability?
Can spec-guided maintenance improve it further?
        ↓
RQ3
What happens when a later prompt semantically conflicts
with an already-settled requirement?
        ↓
CONCLUSION
A master prompt should be treated as a maintained
project specification, not merely a one-shot summary.
```

Central narrative:

> **Prompt history → current specification → maintained specification → conflict-aware handoff**

---

# 4. PROFESSOR-LEVEL ASSESSMENT

The research story is strong because it connects:

> consolidation → traceability → maintained specification → conflict handling.

The main weakness is not lack of technical content.

The main weakness is:

> **The master prompt is still somewhat abstract before the experiments begin.**

The audience should visually understand the artifact before hearing about AlignScore, RQ1, RQ2, or RQ3.

---

# 5. QUESTIONS A THESIS COMMITTEE MAY ASK

| Priority | Likely committee question | What the presentation should make clear |
|---|---|---|
| 🔴 | What exactly is a master prompt? Can you show me one? | Add the conceptual demo. |
| 🔴 | Why can't I simply give the entire prompt history to another AI agent? | History does not directly encode which requirements remain valid. |
| 🔴 | What is the difference between a summary and a master prompt? | A summary compresses history; a master prompt reconstructs the current specification. |
| 🔴 | Show me an example where the final master prompt differs from the history. | Demonstrate add/remove/undo/replacement. |
| 🔴 | What exactly does your thesis measure? | Requirement-level traceability, not overall correctness. |
| 🔴 | Does 0% untraceable mean the master prompt is complete? | No. Omitted requirements are not measured. |
| 🔴 | Does spec-guided always outperform strict? | No. It improves in 4/6 comparisons. |
| 🔴 | Why do some hard-project results become worse with spec-guided? | Repeated interpretation decisions create additional opportunities for error. |
| 🔴 | Is untraceable rate the same as hallucination rate? | No. It is a screening signal; manual review found wording differences, non-requirements, and genuine hallucinated details. |
| 🔴 | Why AlignScore rather than lexical similarity? | Semantic support is more appropriate than word overlap. |
| 🟠 | Why did you create your own project histories? | Controlled evaluation; acknowledge limited external validity. |
| 🟠 | Why only two project histories? | This is a limitation; larger and real-world histories are future work. |
| 🟠 | Why three AI agents? | To examine behavior across multiple agent/provider ecosystems rather than one model. |
| 🟠 | How do you define a semantic conflict? | Two requirements cannot both hold under the same interpretation. |
| 🟠 | Why not automatically resolve conflicts? | The model cannot reliably infer whether the user intended a revision when a later prompt only assumes a conflicting value. |
| 🟠 | Is Experiment 2 a benchmark? | No. It is a qualitative demonstration. |
| 🟠 | Does Experiment 2 use exactly the same method as Experiment 1? | Same underlying principle, but a separate governance instruction is used for the post-handoff setting. |
| 🟡 | What is the novelty compared with Semantic Commit? | Semantic Commit assumes an existing specification; this thesis studies faithful construction first. |
| 🟡 | What does “current” mean? | Valid after explicit revisions, removals, and replacements; it does not simply mean “latest prompt wins.” |
| 🟡 | What is the downside of your approach? | Spec-guided maintenance reduces one large reconstruction but introduces repeated interpretation decisions. |
| 🟡 | What would you do next in a Master's thesis? | Larger real-world histories, repeated runs, multi-author evaluation, stronger coverage metrics, and a scored conflict benchmark. |

---

# 6. RECOMMENDED FLOW

## Part 1 — Motivation & Problem

1. Title
2. **Why a Prompt History Is Not a Current Specification**
3. **Properties of a Reliable Master Prompt**
4. **From Prompt History to a Master Prompt** — NEW conceptual demo
5. **Two Failure Modes in Master-Prompt Construction**

## Part 2 — Research Questions & Contributions

6. Research Questions
7. Three Contributions

## Part 3 — Related Work

8. Research Gap
9. Closest Prior Work: Semantic Commit

## Part 4 — Methodology

10. Two Experiments Across the Master-Prompt Lifecycle
11. Two Controlled Project Histories
12. Four Consolidation Strategies
13. Requirement-Level Traceability Evaluation

## Part 5 — Experiment 1: Traceability Evaluation

14. Why Semantic Entailment Is Needed for Traceability Evaluation
15. RQ1 — Effect of Consolidation Instruction Strictness
16. RQ2 — Spec-Guided vs. Single-Pass Consolidation
17. Example: Non-Traceable Content in Single-Pass Consolidation
18. Example: Spec-Guided Consolidation
19. Interpreting Low AlignScore
20. The Trade-Off of Spec-Guided Maintenance

## Part 6 — Experiment 2: Semantic Conflict Handling

21. What Is a Semantic Conflict?
22. When Does a Later Prompt Become a Conflict?
23. Clear Revision vs. Semantic Conflict
24. Three Conflict-Handling Conditions
25. Observed Behavior
26. Five Semantic Conflicts and Two Controls

## Part 7 — Discussion

27. Main Findings
28. Limitations and Threats to Validity
29. Future Work

## Part 8 — Conclusion

30. Conclusion: Answers to the Research Questions
31. Thank You / Questions

If time is limited, merge slides rather than removing the conceptual demo.

---

# 7. RESEARCH QUESTIONS

Use precise academic wording.

### RQ1

> **To what extent do AI-generated master prompts contain non-traceable content, and how does consolidation instruction strictness affect this problem?**

### RQ2

> **Does spec-guided consolidation produce a more traceable master prompt than single-pass consolidation?**

### RQ3

> **When a later instruction semantically conflicts with a settled requirement, how can a spec-guided approach surface the conflict and avoid resolving it without user input?**

---

# 8. CONTRIBUTIONS

Use exactly three:

### Contribution 1 — Requirement-Level Traceability Evaluation

> A requirement-level method using atomic decomposition and entailment-based AlignScore.

### Contribution 2 — Spec-Guided Consolidation

> A maintained specification is updated throughout the prompt history rather than reconstructed only at the end.

### Contribution 3 — Conflict-Aware Project Handoff

> Later instructions are checked against the settled specification; unclear conflicts are preserved for user resolution rather than silently resolved.

---

# 9. RELATED WORK

Use:

> **“Among the reviewed works, no single approach addresses all three aspects together.”**

Never use:

> “Nobody else…”

For Semantic Commit:

> **“Semantic Commit assumes an existing specification. This thesis first studies how that specification can be constructed faithfully from a prompt history, then reuses it for post-handoff conflict handling.”**

---

# 10. METHODOLOGY

## Two Experiments Across the Master-Prompt Lifecycle

### Experiment 1 — Traceability Evaluation

> Construct candidate master prompts from prompt histories and evaluate requirement-level traceability.

### Experiment 2 — Semantic Conflict Handling

> Start from a settled master prompt and evaluate how later instructions that conflict with it are handled.

---

# 11. FOUR CONSOLIDATION STRATEGIES

### Basic

> Consolidate the ordered history into one master prompt.

### Loose

> Additionally account for modifications, removals, and missing/additional features.

### Strict

> Require every requirement to be traceable to the numbered prompts.

### Spec-guided

> Maintain `prompts.md` and `spec.md`, updating the current specification after each prompt.

---

# 12. TRACEABILITY EVALUATION

Use:

```text
Prompt History
      ↓
Consolidation Strategy
      ↓
Candidate Master Prompt
      ↓
Atomic Software Requirements
      ↓
AlignScore
      ↓
Mean AlignScore
+
Untraceable Rate
```

Key wording:

> **AlignScore measures whether a candidate requirement is supported by the ground-truth master prompt.**

Do NOT say:

> “AlignScore measures correctness.”

Do NOT say:

> “AlignScore detects hallucinations.”

---

# 13. RQ1 PRESENTATION

## Header

> **RQ1 — Effect of Consolidation Instruction Strictness**

Finding:

> **Strict outperforms basic in all six agent–project comparisons and outperforms loose in five.**

Then:

> **The improvement is not monotonic from basic → loose → strict.**

---

# 14. RQ2 PRESENTATION

## Header

> **RQ2 — Spec-Guided vs. Single-Pass Consolidation**

Finding:

> **Spec-guided improves traceability over the same agent's strict baseline in 4 of 6 comparisons.**

Immediately state:

> **The benefit depends on the agent and project history.**

And:

> **A 0% untraceable rate does not establish completeness because omitted requirements are not measured.**

Never say:

> “Spec-guided is always better.”

---

# 15. EXPERIMENTAL DEMO

## Header

> **Example: Non-Traceable Content in Single-Pass Consolidation**

Show the contrast:

```text
Claude / Basic
AlignScore = 0.086
Untraceable = 92%

Unsupported:
• framework
• localStorage
• glassmorphism
• app launchpad
```

versus:

```text
Claude / Spec-guided
AlignScore = 0.989
Untraceable = 0%

Requirements remain supported by the history.
```

The demo should directly support RQ1/RQ2.

---

# 16. LOW ALIGNSCORE

Use:

> **Untraceable rate is a screening measure, not a hallucination rate.**

Manual review identified:

1. same requirement, different wording;
2. non-requirement conversational content;
3. genuine hallucinated details.

Do not claim AlignScore is perfect.

---

# 17. SPEC-GUIDED TRADE-OFF

## Header

> **The Trade-Off of Spec-Guided Maintenance**

### Single-pass

```text
Prompt history
      ↓
one large reconstruction
      ↓
Master Prompt
```

### Spec-guided

```text
Prompt 1 → update
Prompt 2 → update
Prompt 3 → update
...
Prompt N → update
```

Conclusion:

> **Spec-guided maintenance reduces one large reconstruction problem, but replaces it with repeated interpretation decisions.**

Avoid:

> “more chances to slip.”

---

# 18. EXPERIMENT 2

## Header

> **Experiment 2: Semantic Conflict Handling**

Label:

> **RQ3**

Do not call this simply “Conflict Detection” because the experiment evaluates how conflicts are handled.

---

# 19. SEMANTIC-CONFLICT “AHA” MOMENT

Recommended slide:

# **When Does a Later Prompt Become a Conflict?**

### Settled requirement

```text
Invoice due date = 15 days
```

### Later instruction

```text
Add a reminder before
the 30-day due date
```

↓

### Semantic conflict

> **The later instruction assumes a value incompatible with the settled requirement.**

Then:

> **Do not silently choose a value. Preserve the settled requirement and ask the user to decide.**

---

# 20. CLEAR REVISION VS. SEMANTIC CONFLICT

| | Clear revision | Semantic conflict |
|---|---|---|
| Example | “Change the due date to 30 days.” | “Add a reminder before the 30-day due date.” |
| Relationship | Explicitly replaces old value | Assumes an incompatible value |
| Handling | Update | Preserve + report + ask |

This distinction is central to RQ3.

---

# 21. THREE CONFLICT-HANDLING CONDITIONS

### Consolidate-Then-Ask

> Consolidate first and inspect conflicts afterward.

### Do-Not-Resolve

> Do not choose between conflicting values; list conflicts separately.

### Spec-Guided

> Check each later prompt against the settled specification as it arrives.

---

# 22. EXPERIMENT 2 RESULTS

## Header

> **Observed Behavior: Spec-Guided Conflict Handling**

State:

> The settled requirement remains unchanged.

> The incompatible later assumption is recorded separately.

> The user is asked to decide whether the earlier requirement should be revised.

> Compatible controls are accepted without being flagged as conflicts.

---

# 23. EXPERIMENT 2 IS QUALITATIVE

Always say:

> **Qualitative demonstration of semantic conflict handling**

Do NOT call it:

- benchmark;
- accuracy evaluation;
- conflict detection accuracy.

The experiment uses:

- five planted semantic conflicts;
- two compatible controls;
- manual evaluation.

---

# 24. DISCUSSION

Do not conclude:

> “I created spec_guided and it works better.”

Instead:

> **Stricter instructions reduce non-traceable content, but do not eliminate it.**

> **Spec-guided maintenance improves traceability in 4/6 comparisons, with a trade-off between one large reconstruction and repeated interpretation decisions.**

> **The maintained specification can also serve as a reference for surfacing semantic conflicts after handoff.**

---

# 25. LIMITATIONS

## Header

> **Limitations and Threats to Validity**

Use neutral scientific wording.

### Limited dataset

> Two author-created project histories, five constructed semantic conflicts, and two compatible controls.

### Limited repeated runs

> Experiment 1 uses one scored candidate per condition; model outputs are non-deterministic.

### Single-author evaluation

> Ground truth, requirement decomposition review, and conflict labels were produced by the same author.

### Metric coverage

> AlignScore is wording-sensitive and does not measure omitted requirements.

Never use:

> “stated before they’re asked”

or:

> “A current ceiling, not an oversight.”

---

# 26. CONCLUSION

## Header

> **Conclusion: Answers to the Research Questions**

### RQ1

> **Strict consolidation outperforms basic consolidation in all six agent–project comparisons and outperforms loose consolidation in five.**

### RQ2

> **Spec-guided consolidation improves traceability over the same agent's strict baseline in 4 of 6 comparisons.**

### RQ3

> **The qualitative handoff study demonstrates that spec-guided conflict handling can preserve settled requirements and surface incompatible later assumptions for user resolution.**

### Final takeaway

> **A master prompt should be treated as a maintained project specification, not merely as a one-shot summary of prompt history.**

---

# 27. HEADER STYLE RULES

Every slide title should describe research content.

Prefer:

> **RQ2 — Spec-Guided vs. Single-Pass Consolidation**

over:

> “Let's see whether spec-guided wins”

Prefer:

> **Observed Behavior: Spec-Guided Conflict Handling**

over:

> “What actually happened”

Prefer:

> **Limitations and Threats to Validity**

over:

> “Limitations — stated before they're asked”

Prefer:

> **The Trade-Off of Spec-Guided Maintenance**

over:

> “Where the real trade-off sits”

A title should remain meaningful when the slide is read without the presenter.

---

# 28. REMOVE META-COMMENTARY FROM VISIBLE SLIDES

Do not use:

### Audience coaching
- “Reading this correctly”
- “If you remember one thing”
- “Why this matters”
- “What I want you to notice”
- “As you can see”

### Anticipating questions
- “stated before they’re asked”
- “if someone asks…”
- “honest answer”
- “if pushed further”
- “you may wonder…”

### Internal planning
- “angle two”
- “demo 1”
- “real numbers”
- “this is the part where…”

### Defensive language
- “not an oversight”
- “I know this looks…”
- “this may seem…”

These may exist in private speaker notes, but not in the academic slide content.

---

# 29. EVIDENCE VS. INTERPRETATION

For results slides, structure the text as:

### Evidence
Numbers, output examples, or observations.

### Interpretation
One concise sentence explaining what the evidence supports.

Example:

> **Evidence:** Spec-guided improves in 4/6 comparisons.
>
> **Interpretation:** Spec-guided maintenance can improve traceability, but its effectiveness depends on the agent and project history.

Do not reduce a scientific result to:

> “Spec-guided wins.”

---

# 30. AVOID OVERCLAIMING NOVELTY

Use:

> **“Among the works reviewed in this chapter, no single approach combines all three aspects.”**

Avoid:

> “This is the first system…”

unless the literature review supports that claim.

Avoid:

> “No existing system can…”

The thesis does not establish universal absence.

---

# 31. FINAL PRIORITY LIST

## 🔴 MUST CHANGE

1. Add the conceptual **From Prompt History to a Master Prompt** demo.
2. Explain visually that master prompt ≠ summary.
3. Show add/remove/undo/replacement in the conceptual demo.
4. Keep the existing experimental demo, but make its role explicit.
5. Make RQ1/RQ2 distinction unmistakable.
6. Present RQ2 as **4/6**, not universally better.
7. Explain the spec-guided trade-off.
8. Make semantic conflict vs. explicit revision visually obvious.
9. Present RQ3 as a qualitative demonstration.
10. Remove all meta-commentary and defensive wording.
11. Keep terminology consistent with the thesis report.
12. Make the final conclusion answer RQ1, RQ2, and RQ3 explicitly.

## 🟠 SHOULD CHANGE

13. Use “project histories” rather than implying the author-created histories are benchmark datasets.
14. Add a backup answer for why three agents were used.
15. Add a backup answer for why two project histories were used.
16. Add a backup explanation of hard-project degradation.
17. Make limitations scientifically neutral.
18. Keep evidence and interpretation visually separate.
19. Make every header meaningful without presenter narration.
20. Keep the existing visual identity unless there is a strong reason to redesign it.

---

# 32. FINAL INSTRUCTION TO THE PRESENTATION-WRITING AI

Rewrite the current Bachelor Thesis Defense presentation according to this document and the thesis report.

Do not rewrite the research.

Do not invent experiments.

Do not change numerical results.

Do not turn qualitative observations into quantitative claims.

Do not make universal novelty claims.

Do not use conversational, defensive, or examiner-facing language.

The final deck should feel like:

> **A researcher reporting a well-defined problem, a controlled evaluation, observed evidence, supported interpretation, and clearly stated limitations.**

The central narrative must be:

> **Prompt history → current specification → maintained specification → conflict-aware handoff**

Most importantly:

> **The audience must understand what a master prompt is before being asked to evaluate the experiments.**

Therefore, the conceptual demo is not optional decoration. It is a key explanatory component of the defense.
