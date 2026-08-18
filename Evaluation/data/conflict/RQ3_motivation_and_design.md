# RQ3 — Semantic Conflicts in a Master Prompt: Motivation and Design
### (for discussion with the advisor)

## 1. What the thesis is really about

A **master prompt** is meant to be the pure **intent** of a project: what the user
asked for, and only that. The central contribution is keeping it pure — the master
prompt must **add nothing** the user did not ask for (no coding conventions, no file
names, no tech-stack or implementation choices the agent invented, no untraceable
requirements) and **drop nothing** the user did ask for. Extracting that clean intent
from a long, messy prompt-and-code session is the hard part, and it is what RQ1 and
RQ2 measure.

This is also what distinguishes the work from **Semantic Commit** (UIST 2025), the
closest prior system. Semantic Commit operates on **intent specifications that are
already clean and curated**; it does not deal with recovering pure intent from a
noisy coding session, which is the master-prompt problem. So the main point of
difference is not conflict detection — Semantic Commit already detects conflicts in
intents — but **faithful intent extraction**.

## 2. Where RQ3 fits

RQ3 applies the **same discipline** to a second failure of intent-purity. Besides
adding or dropping requirements, a master prompt can end up holding two requirements
that **cannot both be true** — a **semantic conflict** (for example, an invoice due
date stated as 15 days in one place and 30 days in another). The key property is that
this is not a text-level clash: the two requirements sit in different parts of the
history, so the document reads cleanly and nothing warns the reader. When an agent
consolidates such a history, the faithful thing to do is **not** to silently pick a
value or invent a resolution, but to **surface the conflict** and leave it for the
user. Silently resolving a conflict is the same intent-purity failure as inventing a
requirement: the agent is making a decision the user did not make.

The conflict is studied as a property of the **master prompt itself**, not of who
wrote it. Whether the contradictory requirements came from one person over a long
session or from several people editing a shared prompt file is not important; what
matters is that the accumulated intent now contains a contradiction. Provenance is
tracked only to the **source prompt**, so a surfaced conflict can be traced back —
the same traceability discipline as RQ1/RQ2.

## 3. How it is run (demonstration, not scored)

RQ3 is a **demonstration**, not a scored benchmark; the quantitative faithfulness
results come from RQ1/RQ2. It uses a prompt history that contains a known semantic
conflict (`hard_erp_conflict_history.md`: the ordinary build plus a few later prompts
that re-assert a value contradicting one already settled), fed to the three agents
(Claude, Codex, Gemini) one prompt at a time, under three conditions of increasing
strength:

1. **Consolidate, then ask about the conflict.** Consolidate as usual, then ask
   whether any requirements contradict each other. Shows whether the conflict passed
   silently into the master prompt and whether the agent finds it when asked.
2. **Consolidate, do not resolve.** Instruct the agent to leave any conflicting value
   out of the master prompt and list the conflict separately. Shows whether an
   explicit "do not resolve" makes it surface the conflict instead of deciding.
3. **Spec-guided.** Track requirements against a running specification from the start;
   when a new one contradicts a settled one, quarantine both with their source prompts
   and keep the value out of the master prompt. The proposed method.

For each run we simply observe, against the known conflicts: was each conflict
detected, was it left unresolved rather than silently decided, was anything invented,
and was it traced to the right source prompt. No score is computed.

## 4. Relation to the literature

- **Semantic Commit (UIST 2025)** detects conflicts in intent specifications, but
  starts from clean intents and does not address faithful intent extraction from a
  coding session. Its conflict step is a full-context ("DropAllDocs") classification;
  since a master prompt is small enough to fit in context, the detector here uses that
  same full-context setting and leaves retrieval (RAG) as future work for very large
  specs.
- **CodeCRDT (2025)** shows that even a merge with zero character-level conflicts
  still leaves semantic conflicts, and that such tools cannot detect them — which is
  why a meaning-level check on the master prompt is needed and a text merge is not.
- Multi-stakeholder inconsistency is a classic requirements-engineering problem
  (Finkelstein et al. 1994; Nuseibeh et al. 2000); the contribution here is not that
  contradictions arise, but applying the master-prompt intent-purity discipline —
  surface, do not resolve, do not invent — to them.
