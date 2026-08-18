# simple_portal — Automatic Atomic Requirement Split

> **How this was produced.** The `DECOMP_SYS` decomposition prompt of
> `src/decompose_prompts.py` (Claimify decomposition stage, candidate mode) applied
> to `data/simple_portal/ground_truth.md`. The consolidated prose is split into
> sentences, then each sentence is decomposed into the simplest self-contained atomic
> requirements under the granularity rules (permissions per role×object; compound
> actions split; enumerations kept as one set; verbatim words, no paraphrase, no typo
> normalization; back-references resolved in [brackets]).
>
> Because the metered API is unavailable ($0 credit), the LLM step was run by an LLM
> (Opus) applying `DECOMP_SYS` directly, not the trivial `mock` backend. Candidate mode
> carries **no provenance** (no source-prompt tags) — that is a manual-only step.

### Requirement 1

Create a portal homepage.

### Requirement 2

Add top navigation.

### Requirement 3

The navigation must contain four buttons: Dashboard, Policies, History, and Contact.

### Requirement 4

If the label of a navigation button starts with "H", its background color should be blue.

### Requirement 5

If the label [of a navigation button] starts with "O", its background color should be red.

### Requirement 6

If the label [of a navigation button] starts with "D", its background color should be yellow.

### Requirement 7

Style the navigation with rounded buttons, a blue accent, and a modern font.

### Requirement 8

Add a contact form with name, email, and message fields.

### Requirement 9

The email field must be validated before the form can submit.

### Requirement 10

Make sure the page also works well on mobile screens.
