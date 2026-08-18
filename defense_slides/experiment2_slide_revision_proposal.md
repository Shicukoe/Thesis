# Proposed Revision — Experiment 2: Semantic Conflict Handling

## Goal

Reduce Experiment 2 from 11 content slides to 7 slides while keeping the full experimental logic:

**Pipeline → conflict definition → controlled setup → conditions & evaluation → evidence → interpretation**

---

# Slide 1 — Experiment 2 Pipeline

Keep this slide.

### Content

**1. Settled ground-truth Master Prompt**  
→ **2. Later prompt**  
→ **3. Three conflict-handling conditions**  
→ **4. Conflict-handling output**  
→ **5. Manual evaluation**  
→ **6. Interpretation**

**5 semantic conflicts + 2 compatible controls**

---

# Slide 2 — What Counts as a Semantic Conflict?

Merge the current slides **“When Does a Later Prompt Become a Conflict?”** and **“Clear Revision vs. Semantic Conflict.”**

### Settled Requirement

> **Invoice due date = 15 days**

### Clear Revision

**Example**

> “Change the due date to 30 days.”

**Meaning**

The user explicitly replaces the settled 15-day value.

**Action**

> **Update the requirement.**

### Semantic Conflict

**Example**

> “Add a reminder before the 30-day due date.”

**Meaning**

The prompt assumes a different value but does not explicitly revise the settled 15-day requirement.

**Action**

> **Keep the settled requirement, report the conflict, and ask the user.**

### Takeaway

> **Semantic conflict = an incompatible later assumption without a clear revision request.**

---

# Slide 3 — Experiment 2: Controlled Test Setup

Merge the current slides **“Controlled Starting Specification,” “Five Constructed Semantic Conflicts,”** and **“Two Compatible Controls.”**

### Pipeline

**Hand-written ground-truth Master Prompt**  
→ **Later prompts, one at a time**  
→ **Same three conflict-handling conditions**

### 5 Semantic Conflicts

- **Due-date value**
- **Recycle-bin scope**
- **Navigation layout**
- **Permission**
- **Navigation count**

### 2 Compatible Controls

- **Hard project:** print button
- **Simple project:** footer note

### Bottom statement

> **All conditions receive the same settled specification and the same later prompts.**

---

# Slide 4 — Experiment 2: Conditions and Evaluation

Merge the current slides **“Three Conflict-Handling Conditions”** and **“Experiment 2 — Evaluation Criteria.”**

## Three Conditions

- **Consolidate-then-ask** — consolidate first, then inspect conflicts afterward.
- **Do-not-resolve** — do not choose or merge conflicting values; keep the conflict separate.
- **Spec-guided** — check each later prompt against the settled specification as it arrives.

## Manual Evaluation

- **Detect the conflict**
- **Do not resolve it automatically**
- **Keep the settled requirement**
- **Do not invent new details**
- **Show both sources**

### Compatible controls

> **Compatible additions should be accepted normally.**

---

# Slide 5 — Gemini Output: Consolidate-Then-Ask vs. Do-Not-Resolve

Keep this evidence slide.

## Consolidate-Then-Ask

**Settled**

> “…four buttons: Dashboard, Policies, History, and Contact.”

**Later**

> “…five navigation buttons wrap onto two rows…”

**Gemini Master Prompt**

> “The navigation must contain five navigation buttons, including Dashboard, Policies, History, and Contact… Make sure all five navigation buttons wrap onto two rows on small screens…”

## Do-Not-Resolve

**Settled**

> “…four buttons: Dashboard, Policies, History, and Contact.”

**Later**

> “…five navigation buttons wrap onto two rows…”

**Gemini Master Prompt**

> “…Style the navigation with rounded buttons, a blue accent, and a modern font. Make sure navigation buttons wrap onto two rows on small screens…”

---

# Slide 6 — Gemini Output: Spec-Guided Conflict Handling

Keep this evidence slide.

### Settled Requirement

> “The navigation must contain four buttons: Dashboard, Policies, History, and Contact.”

### Later Conflicting Instruction

> “Make sure all five navigation buttons wrap onto two rows on small screens.”

### Gemini Output

> “An unresolved conflict has been detected… Settled Code Retained: kept the settled 4 navigation buttons in index.html… Which requirement would you like to keep: 4 buttons as settled initially, or 5 buttons (and if 5, what should the label of the 5th button be)?”

### Bottom statement

> **If revision intent is unclear, preserve the settled requirement and ask the user instead of guessing.**

---

# Slide 7 — Experiment 2: Interpretation and Key Challenge

Replace the current **“Experiment 2 — Interpretation and Challenges”** slide.

## Interpretation

- **Consolidate-then-ask** — the conflicting assumption can enter the Master Prompt before it is checked.
- **Do-not-resolve** — keeps the conflicting value outside the Master Prompt.
- **Spec-guided** — checks the later instruction before updating the settled specification, preserves the settled value, and asks the user.

## Key Challenge — Revision or Conflict?

> A later prompt may introduce a new value without making it clear whether the user intended to revise the settled requirement.

## Design Response

> **If the revision is unclear, preserve the settled requirement and ask the user.**

### Bottom statement

> **The main difference is when the conflict is checked: spec-guided checks the new instruction against the settled Master Prompt before changing it.**

---

# New Experiment 2 Flow

1. **Experiment 2 Pipeline**
2. **What Counts as a Semantic Conflict?**
3. **Experiment 2: Controlled Test Setup**
4. **Experiment 2: Conditions and Evaluation**
5. **Gemini Output: Consolidate-Then-Ask vs. Do-Not-Resolve**
6. **Gemini Output: Spec-Guided Conflict Handling**
7. **Experiment 2: Interpretation and Key Challenge**
