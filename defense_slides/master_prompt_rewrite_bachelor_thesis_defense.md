# MASTER INSTRUCTION — REWRITE MY BACHELOR THESIS DEFENSE PRESENTATION

## 0. Role

Act as a **professor and thesis-defense presentation expert in Computer Science / Software Engineering / AI research**.

Rewrite my existing Bachelor Thesis Defense presentation based strictly on:

1. `10422080_NguyenThanhTu_Bachelor Thesis Report.pdf` — the authoritative source for research claims, methodology, results, limitations, and conclusions.
2. `defense.pdf` — the current presentation that needs to be improved.

The goal is **NOT to change the research itself**.

The goal is to make the defense presentation:

- academically rigorous;
- easy for a thesis committee to follow;
- logically structured;
- concise enough for oral presentation;
- visually clear;
- defensible under questioning;
- faithful to the actual thesis report.

**Do not invent new experiments, results, claims, datasets, or citations.**

---

# 1. 🔴 CRITICAL CHANGES — MUST CHANGE

## 🔴 1.1. Change the overall presentation flow

The current presentation starts with a demo before fully establishing the research questions.

Replace the overall structure with:

### Part 1 — Problem
1. Title
2. Why prompt history is not a specification
3. What is a master prompt?
4. Two failure modes
5. Research questions
6. Contributions + research gap

### Part 2 — Related Work
7. Research gap
8. Closest prior work: Semantic Commit

### Part 3 — Experiment 1: Faithful Consolidation
9. Experimental setup
10. Two prompt-history datasets
11. Four consolidation strategies
12. Requirement-level traceability evaluation
13. Why AlignScore is used
14. RQ1 results
15. RQ2 results
16. What low AlignScore actually means
17. Interpretation / trade-off

### Part 4 — Experiment 2: Conflict Detection
18. What is a semantic conflict?
19. Explicit revision vs. semantic conflict
20. Settled requirement vs. later prompt
21. Three conflict-handling conditions
22. Observed results
23. Output structure
24. Five planted conflicts + controls

### Part 5 — Discussion
25. Main findings
26. Limitations
27. Future work
28. Final answer to RQ1–RQ3
29. Thank you / Q&A

Then put additional technical explanations into **4–5 backup slides**.

The core narrative must be:

> **Problem → Research Gap → Research Questions → Method → Evidence → Interpretation → Conclusion**

---

# 2. 🔴 Fix the definition of a “good master prompt”

The current slide says:

> “Current — new requirements override old ones.”

This is too broad because the thesis also studies cases where a later prompt **implicitly conflicts** with an existing requirement.

Rewrite the concept as:

> **Faithful** — every requirement is supported by the user's history; nothing is invented.  
> **Current** — explicit revisions update earlier requirements; revoked requirements disappear.  
> **Conflict-aware** — ambiguous semantic conflicts are surfaced rather than silently resolved.

Do NOT claim that every later requirement automatically overrides an earlier one.

---

# 3. 🔴 Remove “compact enough to hand off” as an evaluated property

The current presentation presents:

> “Compact enough to hand off”

as one of the properties of a good master prompt.

However, the thesis does **not quantitatively evaluate compactness**.

Do not make compactness appear to be an experimental result.

If this concept is retained, phrase it only as a **practical motivation**, e.g.:

> **Portable** — the current project state should be represented in one document.

But preferably keep it out of the main evaluation criteria.

Also make clear that the thesis does not measure completeness/recall. AlignScore evaluates precision/traceability, not whether every valid requirement was captured.

---

# 4. 🔴 Fix the “Three Contributions” slide

The current slide says:

> “Three contributions”

but contains four conceptual bullets.

Separate **contributions** from **research gap**.

Use exactly three contributions:

### Contribution 1
**Requirement-level traceability evaluation**

A candidate master prompt is decomposed into atomic requirements and evaluated using entailment-based AlignScore.

### Contribution 2
**Spec-guided consolidation**

A maintained specification is updated after each prompt instead of reconstructing the entire history only at the end.

### Contribution 3
**Conflict-aware handoff**

Semantic conflicts between the settled specification and later prompts are surfaced rather than silently resolved.

Then put this separately:

> **Research gap:** The reviewed literature does not combine faithful construction and post-handoff conflict handling in a single approach.

---

# 5. 🔴 Never use absolute claims such as “Nobody else”

The current presentation says:

> “Nobody else’s row is full — that’s the gap.”

Do NOT use this wording.

Replace it with:

> **Among the reviewed works, no single approach addresses all three aspects together.**

Or:

> **The reviewed literature does not combine all three aspects in a single approach.**

This is academically safer and accurately reflects the scope of the literature review.

---

# 6. 🔴 Fix the Experiment 1 results presentation

Do NOT show only two examples and then claim the result across all six comparisons.

The thesis contains six agent–project comparisons.

Show all six comparisons in one compact table or chart:

| Project | Agent | Strict | Spec-guided | Better |
|---|---|---:|---:|---|
| Simple | Claude | 0.988 | 0.989 | Spec-guided |
| Simple | Codex | 0.828 | 0.987 | Spec-guided |
| Simple | Gemini | 0.917 | 0.989 | Spec-guided |
| Hard | Claude | 0.905 | 0.882 | Strict |
| Hard | Codex | 0.860 | 0.895 | Spec-guided |
| Hard | Gemini | 0.865 | 0.785 | Strict |

Then state:

> **Spec-guided improves traceability in 4 of 6 agent–project comparisons.**

Do not make the audience infer the other four rows.

---

# 7. 🔴 Make RQ1/RQ2 distinction explicit

The audience must understand:

### RQ1
Tests whether **stricter single-pass instructions** reduce non-traceable content.

Result:

> Strict outperforms basic in all six comparisons.

But:

> Strict still does not perfectly reproduce the ground truth.

### RQ2
Tests whether **spec-guided maintenance** improves over each agent's single-pass strict baseline.

Result:

> Spec-guided wins in 4/6 comparisons.

Do not present RQ1 and RQ2 as the same experiment or the same claim.

---

# 8. 🔴 Explain the RQ2 trade-off honestly

Do NOT present:

> “spec_guided is better.”

as a universal conclusion.

The actual finding is:

> **Spec-guided improves traceability in 4/6 comparisons, but continuous maintenance introduces more interpretation decisions.**

Explain the trade-off visually:

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

Then:

> **Single-pass:** one large reconstruction decision.  
> **Spec-guided:** many smaller interpretation decisions.

This trade-off is an important discussion point, not something to hide.

---

# 9. 🔴 Make the AlignScore limitation explicit

Do not imply:

> untraceable rate = hallucination rate.

The thesis distinguishes:

- paraphrases / wording differences;
- content that is not actually a requirement;
- genuine hallucinations.

Therefore use:

> **Untraceable rate is a screening signal, not a hallucination count.**

Explain briefly that a low score can result from wording sensitivity or requirement decomposition issues.

---

# 10. 🔴 Fix Experiment 2 conceptual ordering

Before showing the due-date conflict, explain:

### Explicit revision

> “Change the due date to 30 days.”

→ Explicitly changes the old value  
→ **Update the specification**

### Semantic conflict

> “Add a reminder before the 30-day due date.”

while the specification says:

> “Due date = 15 days.”

→ Does not explicitly revise the requirement  
→ **Conflict should be surfaced**

Use a table:

| | Explicit revision | Semantic conflict |
|---|---|---|
| Example | “Change due date to 30 days.” | “Add a reminder before the 30-day due date.” |
| Explicitly changes old value? | Yes | No |
| Correct response | Update | Flag + ask |

This distinction is fundamental to RQ3.

---

# 11. 🔴 Present Experiment 2 as a qualitative study

Do NOT present Experiment 2 as if it were a statistically validated benchmark.

Explicitly say:

> **Qualitative demonstration of conflict handling**

The experiment contains:

- five planted semantic conflicts;
- two positive controls;
- three conflict-handling conditions.

Therefore RQ3 should be phrased carefully:

> **In this qualitative study, spec-guided processing surfaced the planted semantic conflicts while preserving the settled requirements.**

Avoid:

> “Spec-guided solves semantic conflicts.”

---

# 12. 🔴 Replace the current dense “five conflicts” slide

Do not compress all conflicts into:

> “Value / Scope / Layout / Permission — due date, recycle bin, top nav…”

Instead use a readable table:

| Conflict | Settled requirement | Later assumption |
|---|---|---|
| Due date | 15-day due date | 30-day due date |
| Recycle bin | permanent deletion | recycle bin |
| Navigation | top navigation | sidebar |
| Permission | staff cannot delete | staff deletion |
| Navigation count | 4 buttons | additional navigation |

Keep only the information necessary to understand the experiment.

---

# 13. 🔴 Remove private speaker notes from the presentation

The current final slides contain text such as:

> “Not addressed in the report — prepare separately.”

> “If pushed further…”

> “Honest answer…”

These MUST NOT appear in the final defense deck.

Convert them into clean **backup slides**.

For example:

### Backup — Why these three agents?
> Three different provider ecosystems were evaluated to reduce dependence on a single model/provider.

### Backup — Reproducibility
> Experiment 1 uses one run per condition; model outputs are non-deterministic. Repeated runs are future work.

### Backup — Why a master prompt?
> The goal is not merely shorter text. The master prompt provides one current-state representation, collapses edit/undo chains, resolves precedence, and serves as the reference for later conflict checking.

---

# 14. 🟡 SHOULD CHANGE — Improve wording throughout

Use **academic but natural English**.

Avoid overly casual wording such as:

> “strict beats basic”

Use:

> **“Strict outperforms basic in all six comparisons.”**

Avoid:

> “spec_guided wins 4 of 6”

Use:

> **“Spec-guided outperforms strict in 4 of 6 agent–project comparisons.”**

Avoid:

> “Nobody else…”

Use:

> **“Among the reviewed works…”**

Avoid:

> “What actually happened”

Use:

> **“Observed behavior”**

Avoid:

> “Where the real trade-off sits”

Use:

> **“The trade-off of per-turn maintenance”**

Avoid:

> “Why word-overlap scoring doesn’t work here”

Prefer:

> **“Why semantic entailment is needed for traceability evaluation”**

Keep strong storytelling titles where they help, but ensure the wording remains academically defensible.

---

# 15. 🟡 SHOULD CHANGE — Simplify Related Work

Do not spend too much presentation time on literature.

Use one main table:

| Prior work | Consolidation | Traceability | Conflict handling |
|---|---|---|---|
| Mondal et al. | ✓ | – | – |
| AlignScore / Claimify | – | ✓ | – |
| Semantic Commit | – | – | ✓ |
| This thesis | ✓ | ✓ | ✓ |

Then explain only the closest work:

> **Semantic Commit assumes an existing clean intent specification. This thesis studies how to construct that specification faithfully first, then use it for post-handoff conflict checking.**

This is the most important related-work distinction.

---

# 16. 🟡 SHOULD CHANGE — Improve methodology visualization

Use diagrams instead of paragraphs.

For Experiment 1:

```text
Prompt History
      ↓
Consolidation Strategy
      ↓
Candidate Master Prompt
      ↓
Atomic Requirements
      ↓
AlignScore
      ↓
Mean Score + Untraceable Rate
```

For Experiment 2:

```text
Settled Master Prompt
          +
      Later Prompt
          ↓
   Conflict Detection
          ↓
 ┌────────┼────────┐
Update   Conflict   Compatible
          ↓
      Ask User
```

The goal is for the audience to understand the methodology in **5–10 seconds**.

---

# 17. 🟡 SHOULD CHANGE — Reduce text density

The current deck is visually clean, so **do not redesign the entire visual style**.

Keep:

- current VGU identity;
- whitespace;
- blue/orange accent;
- consistent footer;
- simple typography.

But reduce paragraphs.

For most slides:

> **1 key message + 2–4 supporting points**

Avoid putting the thesis paragraph directly on the slide.

The slide should support what I say, not contain everything I say.

---

# 18. 🟡 SHOULD CHANGE — Make the final conclusion more precise

Use:

# **What did the thesis show?**

### RQ1
**Stricter consolidation instructions substantially reduce non-traceable content, although they do not perfectly reproduce the ground truth.**

### RQ2
**Spec-guided maintenance improves traceability in 4/6 agent–project comparisons, with a trade-off between one large reconstruction and many per-turn interpretation decisions.**

### RQ3
**In the qualitative handoff study, spec-guided processing surfaced planted semantic conflicts instead of silently resolving them.**

Then the final takeaway:

> **A reliable master prompt should be treated as a maintained specification, not merely as a one-shot summary of prompt history.**

---

# 19. Final presentation philosophy

The rewritten presentation must NOT tell this story:

> “I created `spec_guided`, and it works better.”

Instead, tell this story:

> **AI-generated master prompts can contain unsupported or outdated requirements.**
>
> **Stricter instructions reduce this problem, but do not eliminate it.**
>
> **A maintained specification can improve traceability, although continuous updates introduce additional interpretation opportunities.**
>
> **The same specification can then serve as a reference for detecting semantic conflicts after handoff.**
>
> **Therefore, the key idea is not simply summarization, but governance of a living specification.**

This should be the **central narrative of the entire defense**.

---

# 20. Target final slide count

Aim for approximately:

**24–29 main slides**

plus:

**4–5 backup/Q&A slides**

Do NOT artificially increase the number of slides.

Every main slide should answer one of these questions:

> **Why does the problem matter?**  
> **What exactly is the research question?**  
> **How did you test it?**  
> **What did you observe?**  
> **What does that observation actually mean?**  
> **What can and cannot be concluded?**

---

# Priority Summary

## 🔴 MUST FIX

1. Flow: Problem → Gap → RQ → Method → Results → Discussion → Conclusion.
2. Fix slide 5's “new requirements override old ones” wording.
3. Remove/qualify “compactness” because it is not measured.
4. Separate 3 contributions from research gap.
5. Remove “Nobody else…” absolute claims.
6. Show all six comparisons for RQ1/RQ2.
7. Clearly distinguish RQ1 from RQ2.
8. Present `spec_guided` as **4/6**, not universally superior.
9. Explain the spec-guided trade-off.
10. Explain explicit revision vs semantic conflict before Experiment 2.
11. Present RQ3 as a **qualitative demonstration**, not a general benchmark.
12. Remove all private speaker notes from the final slides.

## 🟡 SHOULD FIX

13. Improve academic wording.
14. Simplify Related Work.
15. Convert methodology text into diagrams.
16. Replace dense conflict slide with a table.
17. Reduce text per slide.
18. Make conclusion explicitly answer RQ1/RQ2/RQ3.
19. Keep current visual style; do not redesign unnecessarily.
20. Move technical/Q&A material into clean backup slides.

---

## Final instruction to the presentation-writing AI

**Rewrite the entire defense presentation according to the instructions above.**

The result should feel like a **Bachelor thesis research defense**, not a product demo or project presentation.

The presentation must be:

> **clear → rigorous → evidence-driven → cautious in claims → easy to defend**

Most importantly, preserve the actual findings of the thesis:

- **RQ1:** strict outperforms basic in all six comparisons, but does not perfectly reproduce the ground truth.
- **RQ2:** spec-guided improves traceability in 4/6 comparisons, with a per-turn interpretation trade-off.
- **RQ3:** the qualitative experiment demonstrates that spec-guided processing can surface planted semantic conflicts rather than silently resolving them.

Do not strengthen these claims beyond what the thesis evidence supports.
