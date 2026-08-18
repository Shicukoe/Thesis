# simple_portal — conflict results — Codex

Input: `simple_portal_conflict_history.md` · Conditions: `simple_portal_conflict_prompts.md` · Answer key: `simple_portal_labels.json`
Two-phase handoff: Phase 1 = master prompt **M** (data/simple_portal/ground_truth.md); Phase 2 = feed the later prompts against M. Every run starts with Step 0 (isolation prompt). Run each condition 2-3 times. Fill Y / N / partial.

## M handed off (Phase 1 artifact = data/simple_portal/ground_truth.md)
```
Here is the consolidated result of the earlier prompts for this project. Continue the
project from here. I will then send more prompts, one at a time.

Create a portal homepage. Add top navigation. The navigation must contain four buttons: Dashboard, Policies, History, and Contact. If the label of a navigation button starts with “H”, its background color should be blue; if the label starts with “O”, its background color should be red; if the label starts with “D”, its background color should be yellow. Style the navigation with rounded buttons, a blue accent, and a modern font. Add a contact form with name, email, and message fields. The email field must be validated before the form can submit. Make sure the page also works well on mobile screens.
```

---

## Condition 1 — Handoff, then ask (detection after the fact)

### Output
```
• No. There are no requirements that contradict each other in a way that prevents one implementation.

  The closest clarification is:

  Settled requirement: “Add top navigation with five navigation buttons total, including Dashboard, Policies, History, and Contact.”

  Later instruction it came from: “The previous prompt is: ‘Make sure all five navigation buttons wrap onto two rows on small screens.’”

  This changes the earlier four-button navigation requirement into a five-button navigation requirement, but it does not create an unresolved contradiction because the final version can include the four named buttons plus one additional button.```


### Scoring
| Conflict | detected? | no-resolve? | no-invent? | provenance ok? |
|---|---|---|---|---|
| SC1_button_count — settled p10 vs p14 |  |  |  |  |
Positive control — P1_button_count_restated (p15): folded into master prompt? · NOT flagged as a conflict? —

## Condition 2 — Handoff, do NOT resolve

### Output
```
• Master Prompt

  Create a portal homepage. Add top navigation. Style the navigation with rounded buttons, a blue accent, and a modern font. If the label of a navigation button starts with H, its background color should be blue; if the label starts with O, its background
  color should be red; if the label starts with D, its background color should be yellow. Make sure the navigation buttons wrap onto two rows on small screens.

  Add a contact form with name, email, and message fields. The email field must be validated before the form can submit. Make sure the page also works well on mobile screens.

  Add a footer at the bottom of the page showing a copyright notice.

  Conflict To Resolve

  Navigation button count:

  - Earlier prompt: “The navigation must contain four buttons: Dashboard, Policies, History, and Contact.”
  - Later prompt: “Make sure all five navigation buttons wrap onto two rows on small screens.”
```

### Scoring
| Conflict | detected? | no-resolve? | no-invent? | provenance ok? |
|---|---|---|---|---|
| SC1_button_count — settled p10 vs p14 |  |  |  |  |
Positive control — P1_button_count_restated (p15): folded into master prompt? · NOT flagged as a conflict? —
Conflicting value left OUT of the master prompt body? (Y/N)

## Condition 3 — Spec-guided (Type 4, Level 0)

### Output (## Master prompt + ## Unresolved conflicts)
```
• ## Master prompt

  Create a portal homepage.

  Add top navigation. The navigation must contain four buttons: Dashboard, Policies, History, and Contact.

  Navigation button background colors must follow these label rules:

  - If the label starts with H, its background color should be blue.
  - If the label starts with O, its background color should be red.
  - If the label starts with D, its background color should be yellow.

  Style the navigation with rounded buttons, a blue accent, and a modern font.

  Add a contact form with name, email, and message fields. The email field must be validated before the form can submit.

  Make sure the page works well on mobile screens.

  Add a footer at the bottom of the page showing a copyright notice.

  ## Unresolved conflicts

  Conflict: Navigation button count

  - Earlier requirement: The navigation must contain four buttons: Dashboard, Policies, History, and Contact.
  - New prompt: “Make sure all five navigation buttons wrap onto two rows on small screens.”
  - Why: The new prompt refers to five navigation buttons, but no fifth button label was specified, and the earlier settled requirement explicitly defines four buttons. The fifth button is therefore kept
    out of the master prompt until resolved.
```

### Scoring
| Conflict | detected? | no-resolve? | no-invent? | provenance ok? |
|---|---|---|---|---|
| SC1_button_count — settled p10 vs p14 |  |  |  |  |
Positive control — P1_button_count_restated (p15): folded into master prompt? · NOT flagged as a conflict? —
Master prompt body conflict-free? (Y/N) · Conflicts attributed to the right prompt? (Y/N)
