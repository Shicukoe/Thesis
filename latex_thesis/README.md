# LaTeX bachelor thesis skeleton

This is a draft skeleton, not a finished thesis. Every `[TODO: ...]` marker
(shown in red in the compiled PDF) is either a placeholder that needs your
input (name, student ID, supervisors, exact model versions) or a suggestion
left for you to confirm, expand, or replace with your own writing/research,
per your request.

## Layout

```
main.tex                    entry point, packages, page setup
titlepage.tex                VGU cover page (fill in the TODOs)
references.bib               bibliography -- see the notes below
chapters/
  01_introduction.tex
  02_related_work.tex
  03_methodology.tex
  04_experiment_traceability.tex   RQ1 / RQ2
  05_experiment_conflict.tex       RQ3 (design only -- not yet run)
  06_discussion_future.tex
  07_conclusion.tex
appendix/
  appendix_a_results.tex     the 18-candidate results table (kept out of
                              the body per the "Annex" rule)
```

## Compiling

Requires a TeX distribution (TeX Live or MiKTeX; MiKTeX will offer to
auto-install missing packages the first time you compile). Bibliography
uses classic `natbib` + `bibtex` (not `biblatex`/`biber` -- biber is
noticeably heavier to invoke and is a common cause of "compile timed out"
on Overleaf's free plan for even a modest document like this one).

```
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

(Two `pdflatex` passes after `bibtex` are needed to resolve all
cross-references and citation numbers.)

On Overleaf: upload `latex_thesis_overleaf.zip` (the contents of this
folder, zipped so that `main.tex` sits at the zip root, not inside a
subfolder) via New Project -> Upload Project. Overleaf auto-detects
`bibtex` from the `.bbl`/`.bib` usage and runs the full toolchain on
Recompile; no manual "Main document" / bibliography-engine change should
be needed, but if citations show as `[?]`, check Menu -> Settings that the
compiler is pdfLaTeX (default) and just Recompile again once more.

## Before you submit

- Search for `TODO` in the compiled PDF (they are in red) and resolve every
  one: title page fields, unrun RQ3 results, unverified citations in
  `references.bib` (marked `note = {TODO verify ...}`).
- Rename the final PDF per the school's convention:
  `VGUID_Fullname_Bachelor Thesis Report.pdf`.
- Run source code (if you add real listings beyond the illustrative
  pseudocode in Chapter 5) through the `listings` package, not screenshots --
  already configured in `main.tex`.
- Check the body page count (excluding the Appendix, which is deliberately
  separated) falls in the 25-60 page range required for a Bachelor thesis.
- Run a plagiarism check and confirm the similarity rate is under 15%.
