# Bachelor Thesis Defense — Slide Revision Guide
## Focus: Experimental Design, Evidence, Interpretation, and Challenges
### Target: 15–20 minutes

Revise `defense(7).pdf` using the thesis report as the source of truth. Do not add speaker scripts or invent new claims, metrics, experiments, or outputs.

# 1. Keep the current opening

Keep this sequence:
1. What Is a Master Prompt?
2. A Master Prompt Is Not Exactly a Conversation Summary
3. From Prompt History to a Master Prompt
4. Properties of a Reliable Master Prompt
5. Research Questions
6. Three Contributions
7. Related Work / Research Gap
8. Closest Prior Work: Semantic Commit

Only make small wording/layout improvements.

# 2. Research Questions — align more closely with the report

## RQ1
**To what extent do AI-generated Master Prompts contain non-traceable content, including agent-added and outdated requirements, and how does consolidation instruction strictness affect this problem?**

## RQ2
**Does spec-guided consolidation produce a more traceable Master Prompt than single-pass consolidation of the raw prompt history?**

## RQ3
**When a later instruction semantically conflicts with a settled requirement, how can a spec-guided approach surface the conflict, trace both sides, and avoid resolving it without user input?**

# 3. Contributions

Keep:
- Requirement-level traceability evaluation
- Spec-guided consolidation
- Conflict-aware project handoff

“Conflict-aware project handoff” is consistent with the thesis report. Do not imply the thesis solves handoff as a whole.

# 4. Related Work — remove the comparison table

Replace the current feature-matrix table with a short research progression.

## Slide: Related Work and Research Gap

### Mondal et al. — Prompt Consolidation
- Combines sequences of prompts into one prompt.
- Main goal: interaction efficiency.
- Does not evaluate requirement-level traceability or later undo/replacement behavior.

### AlignScore / FActScore / Claimify
- Provide ideas for semantic support and atomic evaluation.
- Do not construct or maintain a Master Prompt.

### Spec-Driven Development
- Treats a specification as a maintained artifact.
- Does not directly evaluate unsupported or outdated requirements in an AI-generated Master Prompt.

### Research Gap
Use concise bullet points instead of a flow diagram:

- Existing prompt-consolidation work does not evaluate whether every consolidated requirement is traceable to the original prompt history.
- Fine-grained evaluation methods provide useful ideas for semantic support, but do not construct or maintain a Master Prompt.
- Maintained-specification approaches assume or maintain an existing specification, but do not study how a faithful Master Prompt is first reconstructed from an evolving coding-agent prompt history.
- Semantic Commit is closest to Experiment 2, but starts from an already-prepared intent specification.

Bottom:
**This thesis focuses on constructing a traceable Master Prompt from chronological prompt history, comparing single-pass and maintained-specification approaches, and examining later semantic conflicts in the settled specification.**

Keep the next slide:

## Closest Prior Work: Semantic Commit
Main distinction:
**Semantic Commit starts from an existing intent specification. This thesis first studies how that specification can be constructed faithfully from chronological prompt history.**

# 5. Methodology — one general design slide

Remove duplicated overview/pipeline slides.

## Slide: Experimental Design — Two Connected Experiments

### Experiment 1 — Master-Prompt Construction & Traceability
**Input**
- 2 controlled histories: 12-prompt simple project, 45-prompt hard project

**Process**
- 4 consolidation strategies
- 3 AI coding agents

**Output**
- Candidate Master Prompts

**Evaluation**
- Requirement-level traceability
- RQ1 / RQ2

### Experiment 2 — Semantic Conflict Handling
**Input**
- Hand-written ground-truth Master Prompt as settled specification
- Later prompts

**Process**
- 3 conflict-handling conditions
- Same 3 AI coding agents

**Output**
- Updated specification / conflict-handling behavior

**Evaluation**
- Qualitative review
- RQ3

Bottom:
**Experiment 1 uses ground truth as a scoring reference. Experiment 2 reuses it as the settled starting specification.**

# 6. Dataset and Ground Truth

## Slide: Two Controlled Project Histories and Ground Truth

### Simple
- 12 prompts
- Portal project
- Navigation changes, styling rule, contact form

### Hard
- 45 prompts
- ERP-style application
- More revisions, removals, permissions, conversational wording

### Ground Truth
- Manually constructed from the ordered history
- Keeps only requirements valid at the end
- Reflects modifications
- Removes explicit undo/removal
- Excludes unsupported implementation details

Add:
**For Experiment 1, the ground-truth Master Prompt is also manually decomposed into atomic requirements.**

Do not explain decomposition fully yet.

# 7. Experiment 1 — start with a pipeline

## Slide: Experiment 1 Pipeline

```text
1. Prompt History
        ↓
2. Consolidation Strategy
        ↓
3. Candidate Master Prompt
        ↓
4. Atomic Requirement Decomposition
        ↓
5. AlignScore vs. Ground Truth
        ↓
6. Results & Interpretation
```

Small note:
**2 histories × 3 agents × 4 strategies = 24 candidates**

Use this pipeline as the structure for the following slides.

# 8. Experiment 1 — Four Strategies

Keep:
- Basic
- Loose
- Strict
- Spec-guided

Make the distinction visual:

```text
Single-pass
Prompt 1 → ... → Prompt N → Consolidate once

Spec-guided
Prompt 1 → Update spec
Prompt 2 → Update spec
...
Prompt N → Update spec
```

Do not imply spec-guided is already proven better.

# 9. Experiment 1 — use Codex as the running example

Prefer Codex as the main recurring quantitative example.

### Simple
- Basic: 0.387 / 62%
- Loose: 0.857 / 18%
- Strict: 0.828 / 18%
- Spec-guided: 0.987 / 0%

### Hard
- Strict: 0.860 / 10%
- Spec-guided: 0.895 / 8%

Keep full tables for RQ1/RQ2, but zoom into Codex when explaining behavior.

Do not invent a Codex textual output if the raw output is unavailable.

# 10. Experiment 1 — Atomic Requirement Decomposition

## Slide: Challenge — Defining the Evaluation Unit

Show:

```text
Ground-Truth Master Prompt
        ↓
Manual decomposition
        ↓
Atomic Ground-Truth Requirements
```

and:

```text
Candidate Master Prompt
        ↓
Fixed LLM decomposition prompt
        ↓
Manual segmentation review
        ↓
Atomic Candidate Requirements
```

Key point:
**Atomic means a meaningful software-requirement unit, not the smallest possible sentence.**

Example:
> “Add 4 navigation buttons: Dashboard, Policies, History, Contact.”

Do not automatically split this into four independent requirements if that loses the four-button-set constraint.

# 11. Experiment 1 — AlignScore

Keep the semantic-entailment comparison.

Use:
```text
context = Ground-Truth Master Prompt
claim   = Candidate Requirement
```

Report:
- Mean AlignScore
- Untraceable rate: AlignScore < 0.5

Bottom:
**High lexical similarity does not imply semantic support.**

Do not call AlignScore a similarity metric.

# 12. Experiment 1 — Results and Interpretation

## RQ1
Keep the full table.

Highlight:
- Strict > Basic: **6/6**
- Strict > Loose: **5/6**

Interpretation:
**The explicit traceability rule matters more than simply adding more instructions.**

Also:
**Improvement is not monotonic from Basic → Loose → Strict.**

## RQ2
Keep the current table.

Highlight:
- Spec-guided improves over Strict in **4/6**
- All three improve on the simple project
- Hard project is mixed

Zoom into Codex:

```text
Simple:
Strict        0.828 / 18%
Spec-guided   0.987 / 0%

Hard:
Strict        0.860 / 10%
Spec-guided   0.895 / 8%
```

Do not claim spec-guided is universally better.

# 13. Experiment 1 — Challenges

## Slide: Challenge — Maintaining a Standalone Specification

Keep:
- Edit-oriented wording remains
- Conversational wording remains

Example:
> “Change navigation buttons...”  
becomes  
> “Add 4 navigation buttons...”

Main design response:
**Reconstruct the affected topic from its relevant history rather than patching the previous sentence with the latest wording.**

## Slide: Interpreting Low AlignScore

Keep three causes:
1. Same requirement, different wording
2. Non-requirement conversational content
3. Genuine hallucinated detail

Bottom:
**Untraceable rate is a screening measure, not a hallucination rate.**

# 14. Experiment 1 — Final Interpretation

## Slide: Experiment 1 — Interpretation and Trade-Off

```text
Single-pass
→ one large reconstruction decision

Spec-guided
→ many smaller interpretation decisions
```

Main points:
- Explicit traceability constraints improve single-pass consolidation.
- Spec-guided improves 4/6 comparisons.
- Simple project performs strongly.
- Hard project is mixed.
- Repeated updates create more interpretation opportunities.

Bottom:
**Spec-guided is an alternative workflow, not a guaranteed improvement.**


# 15. Experiment 2 — start with a pipeline

## Slide: Experiment 2 Pipeline

```text
1. Settled Ground-Truth Master Prompt
        ↓
2. Later Prompt
        ↓
3. Three Conflict-Handling Conditions
        ↓
4. Conflict-Handling Output
        ↓
5. Manual Evaluation
        ↓
6. Interpretation
```

Small note:
**5 semantic conflicts + 2 compatible controls**

# 16. Experiment 2 — Controlled Starting Point

## Slide: Controlled Starting Specification

```text
Hand-Written Ground-Truth Master Prompt
        ↓
Neutral Handoff Prompt
        ↓
Later Prompts, One at a Time
```

Key point:
**Experiment 2 starts from the correct ground-truth Master Prompt, not an Experiment 1 candidate.**

Reason:
**This isolates semantic conflict handling from earlier consolidation errors.**

# 17. Experiment 2 — explain the conflict first

Keep:

## When Does a Later Prompt Become a Conflict?

Settled:
> Due date = 15 days

Later:
> Reminder before the 30-day due date

Main message:
**The later prompt assumes an incompatible value without clearly requesting a revision.**

Then keep:

## Clear Revision vs. Semantic Conflict

```text
Clear revision
“Change the due date to 30 days.”
→ update requirement

Semantic conflict
“Add a reminder before the 30-day due date.”
→ preserve + report + ask user
```

# 18. Experiment 2 — show inputs before results

Move the conflict cases before results.

## Five Constructed Conflicts
- Due-date value
- Recycle-bin scope
- Navigation layout
- Permission
- Navigation count

## Two Compatible Controls
- Print button
- Footer note

Purpose:
**Controls test whether normal compatible additions are accepted without being incorrectly flagged.**

# 19. Experiment 2 — Three Conditions

Keep:
- Consolidate-then-ask
- Do-not-resolve
- Spec-guided

Main distinction:

```text
Consolidate-then-ask
update first → inspect later

Do-not-resolve
avoid choosing values

Spec-guided
check incoming prompt against settled specification before updating
```

# 20. Experiment 2 — use Gemini as the running example

If raw Gemini outputs are available, use Gemini consistently as the main Experiment 2 example.

Prefer one conflict, such as the due-date case, across all three conditions.

Do not label an output as Gemini unless verified from the raw experiment result.

# 21. Experiment 2 — Manual Evaluation

## Slide: Qualitative Evaluation Criteria

Use:
- Conflict detection
- No automatic resolution
- Preservation of settled requirement
- No invention
- Source identification

Controls:
**Compatible prompts should be added normally.**

Bottom:
**Qualitative demonstration — not a general conflict-detection accuracy score.**

# 22. Experiment 2 — Keep the Report Figure as the Main Evidence

Do not replace the Experiment 2 comparison with a newly invented explanatory diagram.

Keep **Figure 5.1 from the thesis report** as the central visual for the due-date conflict across the three conditions:

- Consolidate-then-ask
- Do-not-resolve
- Spec-guided

Use the figure to explain the experiment directly:
- the settled requirement;
- the later incompatible assumption;
- how each condition handles the same case.

If raw Gemini outputs are available, they may be used as a short supporting example, but the report figure should remain the main visual anchor.

After showing the figure, interpret the observed behavior briefly:
- checking only after consolidation may allow incompatible information to enter the specification before conflict inspection;
- a no-resolution rule is insufficient if the model does not identify the semantic conflict;
- spec-guided checks the later prompt against the settled specification before updating it.

Keep these as **interpretations of the observed cases**, not universal claims.

# 23. Experiment 2 — Final Interpretation and Challenges

## Slide: Experiment 2 — Interpretation and Challenges

### Evidence
- Settled requirement remains.
- Incompatible later assumption is recorded separately.
- User is asked to decide.
- Compatible controls are accepted normally.

### Interpretation
**Conflict handling requires both semantic detection and controlled update timing.**

**A no-resolution rule alone is insufficient if the conflict itself is not recognized.**

**Checking before updating can prevent an unclear assumption from silently becoming a project decision.**


# 24. Conclusion

Keep a short final **Conclusion** slide rather than renaming it “Overall Interpretation”.

## Slide: Conclusion — Answers to the Research Questions

### RQ1
**Explicit traceability constraints reduce non-traceable content in single-pass consolidation.**

### RQ2
**Spec-guided improves 4/6 comparisons, but replaces one large reconstruction with repeated interpretation decisions.**

### RQ3
**The qualitative conflict study shows that a settled specification can be used to surface incompatible later assumptions without silently resolving them.**

### Takeaway
> **A Master Prompt should be treated as a maintained project specification, not merely as a one-shot summary of prompt history.**

Keep the conclusion concise and go directly to:

## Thank You / Questions

# 25. Limitations in the Defense

Do **not** add long limitation bullet lists to the Experiment 1 or Experiment 2 interpretation slides.

Keep the slides focused on:
- evidence;
- interpretation;
- research challenges.

If needed, mention the most important limitations briefly in the **speaker script** or during Q&A, since the full limitations are already documented in the thesis report.

# 25. Timing

Target:
- Motivation + Master Prompt: 2–3 min
- RQs + Contributions + Related Work: 2 min
- Experimental overview + ground truth: 2 min
- Experiment 1: 5–6 min
- Experiment 2: 4–5 min
- Conclusion: 30–45 sec

Spend most of the time on:

**experimental design → evidence → interpretation → challenges**

# 26. Final Design Principle

Each experiment should feel like:

```text
Pipeline
    ↓
Step-by-Step Design
    ↓
One Running Model Example
    ↓
Results
    ↓
Interpretation
    ↓
Challenges / Limitations
```

Use **Codex** as the main Experiment 1 example.

Use **Gemini** as the main Experiment 2 example only when the raw outputs are verified.
