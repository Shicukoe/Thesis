# Spec-guided consolidation — Level 0 governance (the standing instruction)

This is the proposed method for RQ2. It is delivered as a **standing instruction**: put the
block below in the agent's rules file (`CLAUDE.md` / `AGENTS.md` / `GEMINI.md` /
`.cursor/rules/*.mdc`) so it is auto-loaded at the start of every session, or send it once
before the first prompt. `spec.md` itself is the master prompt at any point.

`spec.md` is not an itemized, tagged list — it is a single flowing text, written the same way
`strict_consolidate` writes its output. The difference from `strict_consolidate` is not the
wording of the rule, it is *when* it runs: `strict_consolidate` reconciles the whole history in
one pass at the very end; this method reconciles (current spec.md + one new prompt) on every
turn, so the agent never has to hold the full history in mind at once. `prompts.md` is a
reference log, not something spec.md is rebuilt from each turn.

It combines three ideas: **spec-driven development** (spec.md is the single source of truth,
code derives from it), **full-context reconciliation** (each new prompt is checked against the
whole spec, no retrieval — the "DropAllDocs" setting of Semantic Commit), and **reusing
`strict_consolidate`'s own wording** for the actual consolidation rule, since it is the only
wording in this thesis with measured evidence of staying close to the ground truth. Each rule
below is grounded in prior work; see the mapping table.

---

## Governance instruction (paste verbatim)

```
This project keeps its INTENT as a living master prompt, maintained under the rules below.
Two files matter:

- prompts.md — an append-only, verbatim log of every instruction I give, in order. You never
  edit, reorder, or delete a past entry. Keep it as a reference to check order or intent if
  spec.md is ever unclear — you do not rebuild spec.md from it on every turn.
- spec.md — the current master prompt, as a single flowing text, written the same way you
  would consolidate a whole prompt history into one master prompt in a single pass. Not a
  tagged list of individual items. spec.md is the single source of truth for WHAT to build;
  all code derives from it.

This governance message itself is not a numbered prompt. Do not add it to prompts.md, and do
not treat any part of it as a requirement to fold into spec.md — it is a standing rule about
HOW you work, not something I am asking you to build. Prompt numbering starts at 1 with the
first message I send after this one.

On EVERY instruction I give you after this one, before you write or change any code, do the
following in order.

1. Record. Append my instruction to prompts.md verbatim, as the next numbered entry.

2. Re-consolidate. Read the current spec.md in full together with my new instruction, then
   rewrite spec.md exactly the way you would consolidate a whole prompt history into one
   master prompt in a single pass:
   - If my instruction is compatible with what's already in spec.md, integrate it.
   - If it clearly changes or withdraws something already in spec.md, update spec.md so only
     the current version remains. If it withdraws something with nothing replacing it, delete
     that detail outright — do not replace it with a restated explanation of the withdrawal
     (e.g. do not turn "remove dark theme" into "use light theme only", or "undo the sidebar"
     into "use no sidebar" — nobody asked for either; the correct result is that spec.md simply
     says nothing about it). This holds no matter what words I used to say it ("remove",
     "undo", "cancel", "never mind", "go back to", or any other phrasing with the same intent
     — judge by what I mean, not which word appears).
   - If it cannot both hold with something already in spec.md, and I did not clearly signal
     that I am revising that detail, do not pick a side and do not merge. Leave spec.md as it
     was, list the conflict under a "## Unresolved conflicts" section (both sides, and the
     instruction each came from), and ask me to decide.
   If you cannot tell a revision from a conflict, treat it as a conflict and ask.

   Every requirement in spec.md, after this rewrite, must be something I actually wrote across
   prompts.md. Do not add a file name, library, framework, code, or any design or
   implementation choice I did not state, even if it seems reasonable. Do not reword the
   CONTENT of what I wrote into your own phrasing either, even to make it read more cleanly —
   reuse my exact words for names, values, and conditions; a reworded restatement of content is
   how an unwritten detail slips in disguised as a summary, the same failure as inventing
   content outright. If something is not directly traceable back to what I wrote, leave it out.

   Do not edit spec.md's existing sentence for a topic by splicing my new instruction's own
   wording into it, the way a text editor would patch a line. Instead, whenever my instruction
   touches a topic already covered in spec.md, gather EVERY prompt in prompts.md that has ever
   said something about that same topic (including this new one), and write ONE fresh sentence
   for that topic from that whole set — exactly the way you would if you were consolidating
   only those prompts into a master prompt for the first time, in a single pass. Treat the
   topic's history as raw material to write from, not text to edit: the fresh sentence states
   only the requirement itself, in the same plain, declarative register a master prompt is
   written in — whatever in the source prompts was about the conversation itself, rather than
   about what must be built, does not survive into a document freshly written from scratch, the
   same way it would never appear if you were drafting a specification from these prompts for
   the first time. You are recomposing from wording I actually used, not inventing anything, so
   this is still fidelity, not paraphrase — but fidelity is to the CONTENT (names, values,
   conditions, constraints) of the topic's full history, not to reproducing any one prompt's
   sentence whole, including whatever in it was not content. For example, this single fresh-
   from-history rule is why "I'd like to build a simple ERP web application for a small
   business. Let's start with a clean foundation that we can gradually expand." becomes "Build a
   simple ERP web application for a small business with a clean foundation that can be gradually
   expanded.", and why "Add 3 navigation buttons: Home, Orders, Contact." plus a later "Change
   navigation buttons: Dashboard, Policies, History, Contact." becomes one fresh "Add 4
   navigation buttons: Dashboard, Policies, History, Contact." — the same operation both times,
   not two different rules. Doing this per topic, every time that topic is touched, is what
   keeps every turn's spec.md reading the way one whole-history consolidation would.
   Also keep the source's own economy of language: if a sentence omits repeated words across a
   list of clauses, keep that same omission rather than spelling every clause out in full.

3. Derive. Write or change code so it matches spec.md.

When I say "consolidate", output spec.md exactly as it stands, plus "## Unresolved conflicts"
if that section is non-empty. Do not re-derive it from prompts.md — spec.md, as already
maintained, is the master prompt.
```

---

## Design rationale (each rule → prior work)

| Rule in the instruction | Grounded in |
|---|---|
| spec.md is the single source of truth; code derives from it | Spec-Driven Development \citep{piskala2026specdriven} |
| Re-consolidate against the **whole** current spec.md, no retrieval, every turn | Semantic Commit full-context ("DropAllDocs") \citep{vaithilingam2025semanticcommit} |
| Compatible / revision / conflict classification | Semantic Commit conflict taxonomy (Direct / Ambiguous / Non-conflict) \citep{vaithilingam2025semanticcommit} |
| The re-consolidation rule reuses \texttt{strict\_consolidate}'s own wording ("must be something I actually wrote", "traceable back to", no rewording into your own phrasing), applied every turn instead of once at the end | \texttt{strict\_consolidate} is the only wording in this thesis with measured evidence of staying close to the ground truth (RQ1 result: 0.83–0.99 AlignScore, near-0\% untraceable, all 3 agents, both projects) — reusing it rather than inventing new wording for the hardest rule in the instruction. Doing it every turn instead of once is this method's actual hypothesis for RQ2: a single end-of-session pass over a long history (hard\_erp: 45 prompts) asks the model to hold everything at once, where multi-turn state-tracking is shown to degrade (\textit{MultiTurnInstruct}, Han et al., EMNLP Findings 2025, arXiv:2503.13222); reconciling (current spec.md + one new prompt) each turn never asks for more than that |
| Withdrawing something must delete it outright, never replace it with a restated explanation, regardless of the word used ("remove"/"undo"/"cancel"/...) | closes a real failure observed in this project: "remove dark theme" was rewritten as "use light theme only" — an unstated detail entering disguised as a paraphrase of a removal rather than as an outright addition; judged by intent, not by which word appears, so it is not a keyword rule |
| Re-derive a touched topic's sentence from its WHOLE history in prompts.md, every time, the same way a single-pass consolidation would -- not a special-cased "detect a dangling word, then patch" rule | ten iterations trying to patch the symptom (rounds 1-10, live-tested on \texttt{simple\_portal} across three agents), summarized: verbatim reuse left dangling words (1); a fidelity exception over- (2) then under-fired (3); a synthesized replacement verb produced a fragment (4); borrowing an earlier prompt's frame worked once (5) but was unreliable across repeated runs (6); relocating the borrow source to spec.md's own line still missed the base case on Gemini (7); reverting to (5) worked on Gemini twice (8, confirmed with a stale count regression fixed then reverted, 9-10) but never once worked on Codex across three different wordings of the same rule -- and then reproduced on Claude too, the model expected to be the strongest instruction-follower, on the very first test (round 11's trigger). Two of three agents failing the same detection-based patch, including the strongest one, was the signal that the rule was fighting the model's default behavior rather than using it: per-turn re-consolidation, given only the current spec.md sentence plus one new instruction, defaults to a local text-edit (splice the new instruction's own words in), whereas \texttt{strict\_consolidate} never has this problem because single-pass synthesis composes a topic's whole raw history into one fresh sentence as a side effect of writing the document once, no special rule needed. (11) Replaced the whole detect-and-patch apparatus with one general instruction: for any topic a new instruction touches, gather that topic's entire history from prompts.md and recompose ONE fresh sentence from it, exactly as a single-pass consolidation of just those prompts would -- generalizes beyond dangling comparative words to any kind of stale value (count, name, condition), per the concern that fixing only "words like instead/now" would not generalize. (12) The same instruction, tested next on \texttt{hard\_erp} on Gemini (45 prompts, conversational register unlike \texttt{simple\_portal}'s clipped imperatives), surfaced a second symptom of the identical mechanism: by prompt 10-11, spec.md was absorbing whole sentences of scene-setting verbatim ("I'd like to build...", "We'll probably need..."), because the per-turn framing still defaults to preserving a new raw sentence's own wording wholesale unless told otherwise -- the same edit-vs-regenerate gap as the dangling-word case, just showing up as register instead of a stale value. The first attempt at a fix enumerated specific filler phrases to drop, which was itself the same hard-coding mistake as rounds 2-4 of the dangling-word saga; corrected by folding this into rule (11) as one general clause instead of a second rule: a topic's fresh sentence is written in specification register because it is freshly written from the topic's whole history, not edited from the newest prompt's sentence, so conversational wrapper never survives for the same reason a stale value never survives -- one mechanism, illustrated (not enumerated) with both the ERP-intro example (register) and the navigation-buttons example (value), grounded in \texttt{strict\_consolidate}'s own verified Codex output doing exactly this for the ERP-intro sentence for free. Scoped naturally to \texttt{hard\_erp}-style conversational prompts -- a no-op on \texttt{simple\_portal}'s already-terse prompts, so it does not risk that project's already-confirmed results; pending re-test on \texttt{hard\_erp} across all three agents |
| Surface the conflict, do not auto-resolve, ask the user | no oracle for intent \citep{lahiri2026intent}; collapsing conflicting requirements into one winner is not faithful \citep{liu2025condorcet}; human-in-the-loop resolution \citep{vaithilingam2025semanticcommit} |
| Append-only, verbatim prompt log, kept as a reference — not rebuilt from every turn | prompts as preserved, versioned artifacts \citep{tafreshipour2025wild}; preserve exact inputs for reproducibility \citep{vangala2025reproducible}; spec.md, not prompts.md, is what the agent actively maintains and works from each turn, matching how \texttt{strict\_consolidate} itself treats the prompt history as input rather than as the artifact being built |
| Delivered as a persistent standing instruction (rules file), not a one-time message | instruction decay over long context — *Lost in the Middle* (Liu et al. 2023) and *MultiTurnInstruct* (Han et al. 2025) |

## Evaluation (RQ2)

Run this on the same clean prompt histories as basic/loose/strict; the final `spec.md` is the
candidate `spec_guided`, scored the same way as the others: decompose keep-all and compute
requirement-level AlignScore + untraceable rate against the ground truth
(`score_requirements.py` / `compare_rq12.py`). Compare against basic/loose/strict, and run the
ablation (memory-only -> +log -> +governance, `RUN.md`) to separate re-supplying the log from
the governance itself — this is also the real test of whether reconciling every turn actually
beats a single end-of-session `strict_consolidate` pass, which is this method's core claim.

## Level 1 (packaged code) — when a stronger claim is wanted

Level 0 above is prompt-delivered: the agent performs record / re-consolidate / derive, entirely
in free text. Level 1 would move the deterministic parts into code and run a programmatic
conflict check (e.g. a local NLI contradiction pass) as a cross-check on the model's own
Compatible/Revision/Conflict judgment. Needs metered API access, unavailable this session ($0
credit) — not built.
