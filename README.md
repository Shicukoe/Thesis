# AI-Assisted Master Prompt Generation: Challenges and Proposed Solutions

Bachelor Thesis · Computer Science · Vietnamese-German University, 2026
**Nguyen Thanh Tu** — Supervisors: Assoc. Prof. Dr. Garcia Clavel Manuel, Dr. Nguyen Tuan Cuong

📄 [**Read the full report (PDF)**](<10422080_NguyenThanhTu_Bachelor Thesis Report.pdf>) · 🖥️ [Defense slides (PDF)](defense_slides/defense.pdf) · 🧪 [Evaluation code & results](Evaluation/)

---

## Summary

When an AI coding agent works through a long sequence of prompts, the running history
eventually needs to be **consolidated into one master prompt** — a single document a new
session, a new agent, or a teammate can pick up from. Two things can go wrong when that
document is generated automatically:

1. **Non-traceable content.** The generated master prompt states details the user never
   asked for (agent-added technologies, filenames, design choices), or keeps an old
   requirement after a later prompt removed, replaced, or undid it.
2. **Silent conflict resolution.** After the master prompt is handed off, a later
   instruction may semantically contradict an already-settled requirement. If the agent
   picks a value on its own instead of flagging the contradiction, the document stops
   being a reliable record of what was actually decided.

This thesis studies both problems and proposes **`spec_guided`**, a consolidation method
that maintains a living specification (`spec.md`) under an explicit governance instruction
throughout the session, instead of reconstructing the whole history in one pass at the end.

### Research questions

| | |
|---|---|
| **RQ1** | To what extent do AI-generated master prompts contain non-traceable content, and how does consolidation instruction strictness (basic / loose / strict) affect this? |
| **RQ2** | Does a spec-guided consolidation approach produce a more traceable master prompt than single-pass consolidation? |
| **RQ3** | When a later instruction semantically conflicts with a settled requirement, how can a spec-guided approach surface the conflict and avoid resolving it without user input? |

### Method

- **Evaluation metric:** requirement-level traceability via [AlignScore](https://arxiv.org/abs/2305.16739)
  (entailment-based), not word/embedding similarity — a paraphrase can be faithful with
  very different wording, and a near-identical sentence can still contradict the source.
  Each master prompt is split into atomic requirements and scored individually against a
  hand-built ground truth: `AlignScore(context = ground truth, claim = candidate requirement)`.
- **Experiment 1 (RQ1/RQ2):** 2 project histories × 3 AI coding agents (Claude, Codex,
  Gemini) × 4 consolidation strategies (basic, loose, strict, spec-guided) = 24 candidate
  master prompts, scored by mean AlignScore and untraceable rate.
- **Experiment 2 (RQ3):** starting from each project's settled ground-truth master prompt,
  later prompts introduce constructed semantic conflicts. Three conflict-handling
  conditions are compared: consolidate-then-ask, do-not-resolve, and spec-guided.

### Key findings

- **Strict instructions help, but don't fully solve it.** Requiring every requirement to
  be traceable to a numbered prompt outperforms a basic "consolidate this" instruction in
  every tested agent/project pair — but even the strict rule doesn't eliminate all
  non-traceable content.
- **Spec-guided improves traceability in 4 of 6 agent–project comparisons** over each
  agent's own strict baseline — strong on the smaller project, mixed on the larger one.
  Maintaining a specification turn-by-turn trades one large reconstruction decision for
  many smaller ones, which is where the two harder cases lose ground.
- **A low AlignScore is a screening signal, not a verdict** — manual review is still
  needed to tell invented content apart from a faithful paraphrase or leftover
  conversational wording.
- **The spec-guided governance instruction also generalizes to conflict handling:**
  checking each later prompt against the settled specification before updating it lets
  the agent preserve the settled value and ask, instead of silently overwriting it.

## Repository contents

```
10422080_NguyenThanhTu_Bachelor Thesis Report.pdf   final compiled report (read this first)
defense_slides/         thesis defense deck (PDF)
Evaluation/             traceability/conflict scoring harness, data, and results (see its own README)
```

See [`Evaluation/README.md`](Evaluation/README.md) for how the AlignScore/BERTScore
harness works and how to reproduce the numbers.
