# Defense Slide Revision — Focused Fixes for `defense(8).pdf`

Use the thesis report as the source of truth. Keep the presentation concise for a 15–20 minute defense.

Do **not** invent or paraphrase experimental outputs when the instruction below asks for an exact model output.

---

# 1. Remove the Research Gap Slide

Delete the current **Research Gap** slide completely.

The preceding **Related Work** slide already gives enough context:
- Mondal et al.: prompt consolidation, but not requirement-level traceability / undo-replacement handling.
- AlignScore / FActScore / Claimify: useful for semantic support and atomic evaluation, but do not construct or maintain a Master Prompt.
- Spec-driven development: maintained specification, but not evaluation of unsupported/outdated requirements in an AI-generated Master Prompt.

Keep **Closest Prior Work: Semantic Commit** as the next slide.

The research gap can be mentioned briefly in the speaker script instead of using a dedicated slide.

---

# 2. Rename “Post-Handoff Maintenance”

In **Experimental Design: Two Stages of the Master-Prompt Lifecycle**, replace:

> **Post-Handoff Maintenance**

with:

> **Semantic Conflict Handling**

The two experiment headings should therefore be:

- **Master-Prompt Construction & Traceability**
- **Semantic Conflict Handling**

Keep “Conflict-aware project handoff” in the Contributions slide; that wording is consistent with the report. The Experiment 2 heading itself should stay focused on the actual problem being evaluated.

---

# 3. Fix “Why Semantic Entailment Is Needed for Traceability”

The current slide shows only:

> “blue” vs “red” background  
> faithful paraphrase

This is too vague. If the table is kept, show the **full sentence pairs exactly as in the thesis report**.

## Pair 1 — Contradiction

**Ground truth**
> “A navigation label starting with H must have a blue background.”

**Candidate**
> “A navigation label starting with H must have a red background.”

- BERTScore (P): **0.98**
- AlignScore: **0.0002**

## Pair 2 — Faithful paraphrase

**Ground truth**
> “Implement customer management with create, edit, delete, and browse operations.”

**Candidate**
> “Include customer management: Users can create, edit, delete, and browse customers.”

- BERTScore (P): **0.63**
- AlignScore: **0.87**

Keep the takeaway short:

> **Similar wording can still contradict the requirement, while different wording can express the same requirement.**

Then show:

> `context = ground-truth Master Prompt`  
> `claim = candidate requirement`

Do not call AlignScore a similarity metric.

---

# 4. Rewrite “Interpreting Low AlignScore” in Simpler Language

Rename the slide to:

## **Why Can a Requirement Receive a Low AlignScore?**

Use three simple cases that stay faithful to the report:

### 1. Same requirement, different wording
Example:
> “Introduce user roles...” vs. “Support the user roles...”

Meaning is still correct, but AlignScore can score the wording lower.

### 2. Text came from the prompt, but it is not a final requirement
Example:
> A reason, transition, or temporary comment is kept in the Master Prompt.

It was not invented, but it should not remain as a software requirement.

### 3. The model actually added something the user never requested
Example:
> Gemini adds an Admin-only “User Accounts” screen and adds “Vendors” to a 3-item navigation bar.

Bottom takeaway:

> **A low AlignScore needs manual review — it does not automatically mean hallucination.**

Avoid phrases such as:
- “non-requirement conversational content”
- “genuinely hallucinated details”

when a simpler phrase communicates the same idea.

---

# 5. Redesign “Clear Revision vs. Semantic Conflict”

Do not use the current wide table. The large spacing between cells makes the comparison hard to follow.

Use **two side-by-side cards** instead.

## Left card — Clear Revision

**Example**
> “Change the due date to 30 days.”

**Meaning**
> The user clearly replaces the existing 15-day value.

**Action**
> Update the requirement.

## Right card — Semantic Conflict

**Example**
> “Add a reminder before the 30-day due date.”

**Meaning**
> The prompt assumes 30 days but never clearly asks to replace the settled 15-day value.

**Action**
> Keep the settled requirement, report the conflict, and ask the user.

This should be readable immediately without matching distant table cells.

---

# 6. Simplify “Experiment 2 — Controlled Starting Specification”

Remove the sentence:

> “Starting from ground truth prevents Experiment 1 errors from confounding the RQ3 evaluation.”

Do not use the word **confounding** on the slide.

Keep only the useful design facts:

- The hand-written ground-truth Master Prompt is the settled starting specification.
- Every condition starts from the same correct project state.
- Later prompts are sent one at a time.
- The three conditions receive the same starting specification and later prompts.

No extra bottom conclusion is necessary.

---

# 7. Rewrite “Experiment 2 — Evaluation Criteria”

Use this exact title:

## **Experiment 2 — Evaluation Criteria**

Do not use a two-column **Criterion / Expected behavior** table.

Use a single compact table or boxed list containing the five criteria as complete, easy-to-read statements:

| Evaluation criteria |
|---|
| **Detect the conflict** — identify the two incompatible requirements. |
| **Do not resolve it automatically** — do not choose or merge the conflicting values without user input. |
| **Keep the settled requirement** — the existing requirement remains unchanged while the conflict is unresolved. |
| **Do not invent new details** — add no new value, condition, or technical choice. |
| **Show both sources** — identify the settled requirement and the later conflicting instruction. |

Small note only if space allows:

> Compatible control prompts should be accepted normally.

Do not add a long methodological disclaimer on this slide.

---

# 8. Experiment 2 Observed Behavior — Use Exact Gemini Outputs

Revise both slides:

- **Observed Behavior: Consolidate-Then-Ask and Do-Not-Resolve**
- **Observed Behavior: Spec-Guided Conflict Handling**

Use **Gemini** as the Experiment 2 running example, just as Codex is used as the running example in Experiment 1.

## Critical rule

Use the **exact verified Gemini output from the Experiment 2 raw results**.

- Do not paraphrase it.
- Do not convert a report summary into a fake model quote.
- Do not reuse generic text without confirming it came from Gemini.
- If the raw Gemini outputs are not available in the supplied experiment files, ask for them instead of inventing text.

The thesis report confirms that Gemini was tested under all three conditions, but it does not reproduce the full raw Gemini outputs. Therefore, the slide editor must obtain the actual Gemini experiment output before inserting quotations.

---

# 9. Slide: Observed Behavior — Consolidate-Then-Ask and Do-Not-Resolve

Use the same conflict case for both conditions, preferably the **due-date conflict**.

## Gemini — Consolidate-Then-Ask

Show the relevant **exact Gemini output excerpt**.

Highlight only the words/values needed to show what happened.

Do not write the interpretation as if it were part of the model output.

## Gemini — Do-Not-Resolve

Show the relevant **exact Gemini output excerpt**.

Again, highlight only the evidence.

Keep detailed interpretation mainly for the speaker script, similar to how Experiment 1 presents actual output first and discusses its meaning afterward.

---

# 10. Slide: Observed Behavior — Spec-Guided Conflict Handling

Remove **Figure 5.1** completely.

Instead, show the **exact Gemini spec-guided output** for the same conflict used on the previous slide.

Recommended structure:

## Gemini — Spec-Guided

**Settled requirement**
> short exact relevant requirement

**Later conflicting instruction**
> short exact later prompt

**Gemini output**
> exact relevant excerpt from the raw Experiment 2 output

The slide should provide the evidence only.

The speaker script can explain observations such as:
- the settled value stayed unchanged;
- the incompatible assumption was recorded separately;
- the user was asked to decide;
- compatible controls were accepted.

Do not put a large interpretation paragraph on this output slide.

---

# 11. Rewrite “Experiment 2 — Interpretation and Challenges”

Make the conclusion simpler and directly tied to the tested outputs.

Keep a short **What we observed** section:

- Consolidate-then-ask did not reliably surface the conflict before consolidation.
- A “do not resolve” instruction was not enough when the model failed to recognize the conflict.
- In the tested spec-guided output, the settled requirement was kept and the incompatible later assumption was surfaced for the user.

Then use one clear conclusion box:

> **The main difference is when the conflict is checked: spec-guided checks the new instruction against the settled Master Prompt before changing it.**

Optional second sentence:

> **If the later instruction is incompatible but does not clearly request a revision, keep the settled requirement and ask the user.**

Avoid abstract wording such as:
- “controlled update timing”
- “semantic detection and controlled update timing”
- “silently becoming a project decision”

The slide should be understandable without additional explanation.

---

# 12. Keep the Conclusion Slide

Keep:

## **Conclusion: Answers to the Research Questions**

Do not rename it to “Overall Interpretation”.

The detailed interpretation should happen inside Experiment 1 and Experiment 2. The Conclusion should remain short and only summarize RQ1–RQ3 plus the thesis takeaway.

---

# 13. General Style Rule for These Revisions

For a 15–20 minute defense:

- Prefer one clear example over many examples.
- Experiment 1 running example: **Codex**.
- Experiment 2 running example: **Gemini**.
- Show actual evidence on the slide.
- Put deeper interpretation in the speaker script.
- Avoid long bottom paragraphs.
- Avoid academic wording when a simpler sentence preserves the same meaning.
- Never invent model output or attribute an output to the wrong agent.
