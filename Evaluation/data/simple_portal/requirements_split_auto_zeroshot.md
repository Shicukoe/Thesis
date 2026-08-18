# simple_portal — Automatic Atomic Requirement Split (ZERO-SHOT)

> **Config.** Same `DECOMP_SYS` core + FIDELITY block as `requirements_split_auto.md`,
> but with the **few-shot examples removed** and the **4 granularity rules removed**.
> Only the instruction "split into the simplest self-contained atomic requirements,
> reuse exact words, edits only in [brackets]" remains. No rule says to keep an
> enumeration together, so every list is split per item.
>
> Purpose: measure how far an *unprimed* splitter drifts from the manual split, to show
> that the closeness of `requirements_split_auto.md` came from the granularity policy
> (which is the author's), not from the LLM alone. Run by an LLM (Opus) applying the
> zero-shot prompt directly (metered API unavailable, $0 credit).

### Requirement 1

Create a portal homepage.

### Requirement 2

Add top navigation.

### Requirement 3

The navigation must contain [the] Dashboard [button].

### Requirement 4

The navigation must contain [the] Policies [button].

### Requirement 5

The navigation must contain [the] History [button].

### Requirement 6

The navigation must contain [the] Contact [button].

### Requirement 7

If the label of a navigation button starts with "H", its background color should be blue.

### Requirement 8

If the label [of a navigation button] starts with "O", its background color should be red.

### Requirement 9

If the label [of a navigation button] starts with "D", its background color should be yellow.

### Requirement 10

Style the navigation with rounded buttons.

### Requirement 11

Style the navigation with a blue accent.

### Requirement 12

Style the navigation with a modern font.

### Requirement 13

Add a contact form with [a] name [field].

### Requirement 14

Add a contact form with [an] email [field].

### Requirement 15

Add a contact form with [a] message field.

### Requirement 16

The email field must be validated before the form can submit.

### Requirement 17

Make sure the page also works well on mobile screens.
