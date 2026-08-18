# Simple Portal Project — Atomic Requirement Split

## Method — how this ground truth was built

This file is the **ground truth** for the simple_portal project, built by hand as an
**atomic requirement-level traceability map** rather than as free prose, using the same
method as the hard_erp `requirements_split.md`. It is the reference every candidate
master prompt is scored against, and it supplies the gold atomic units for
requirement-level evaluation.

Construction steps:

1. Start from the raw numbered prompt history (12 prompts).
2. Decompose the consolidated intent into **atomic requirements** — the smallest unit that
   can be independently satisfied or missed — grouped by feature.
3. Tag each requirement with the **source prompt number(s)** that produced its *final*
   form, including every prompt that touched it (e.g. Requirement 3 — Prompts 2 *and* 9,
   because 2 set three buttons Home/Orders/Contact and 9 replaced them with four buttons
   Dashboard/Policies/History/Contact).
4. State each requirement in its **final resolved form**: all temporal conflicts are
   already collapsed to the last decision (top navigation, four current buttons; the dark
   theme and the sidebar are gone).
5. Choose **granularity** by these rules:
   - **Split a compound requirement** that bundles distinct decisions: the navigation
     bar's *existence* vs its *contents* → two; the contact form's *fields* vs its *email
     validation* → two; the three colour conditions → one requirement each, since a
     candidate can satisfy or miss each independently.
   - **Merge an enumeration when its members are stated together as one set** (the four
     button labels, the three form fields, the three style attributes): it is one
     decision a candidate satisfies as a set.
6. **Match the modal verb to the ground truth** (`should` / `must` / imperative) so wording
   is consistent with the reference being scored against.
7. Record **corrections** inline: the colour rule (Prompt 3) is kept **verbatim** even
   though the button labels changed in Prompt 9. When it was written the buttons were
   Home/Orders/Contact (Home→H→blue, Orders→O→red); after Prompt 9 they are
   Dashboard/Policies/History/Contact (History→H→blue, Dashboard→D→yellow, none start with
   O). The user never cancelled the rule, so it stays in its final form as a preserved
   requirement — not an error to be "fixed".

A separate **added-then-modified/removed** list at the end records requirements that were
introduced and later changed or cancelled; those are the *negative* gold (a candidate that
still asserts a superseded form — dark theme, sidebar, the old three-button set — is
non-traceable).

---

## Project Foundation

### Requirement 1 — Prompt 1

Create a portal homepage.

### Requirement 2 — Prompts 6, 7, and 8

Use a top navigation bar.

### Requirement 3 — Prompts 2 and 9

The navigation must contain four buttons: Dashboard, Policies, History, and Contact.

### Requirement 4 — Prompt 10

Style the navigation with rounded buttons, a blue accent, and a modern font.

### Requirement 5 — Prompt 3

If a navigation button's label starts with "H", its background colour should be blue.

### Requirement 6 — Prompt 3

If a navigation button's label starts with "O", its background colour should be red.

### Requirement 7 — Prompt 3

If a navigation button's label starts with "D", its background colour should be yellow.

### Requirement 8 — Prompt 11

Add a contact form with name, email, and message fields.

### Requirement 9 — Prompt 11

The email field must be validated before the form can submit.

### Requirement 10 — Prompt 12

The page must also work well on mobile screens.
