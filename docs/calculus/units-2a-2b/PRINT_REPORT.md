# Unit 2A print report

## Compilation

- Engine: pinned Pi Tectonic 0.16.9.
- Source: preserved normalized Unit 2A `source/latex-project/main.tex`.
- Output: 166-page US Letter student PDF.
- Output size: 528.3 KiB.
- SHA-256: `1a1acbb6e897ad9d426f44faad4f3a6dff35172ebbf3228534cd6eee89363de1`.
- Encryption: none.
- Extractable text: 200,811 characters.
- Blank pages with fewer than 20 extracted characters: none.

## Visual inspection

Two representative ten-page contact sheets were rendered from the compiled PDF. Inspected pages include the cover, start guide, quick checks, core exposition, rule derivations, trigonometric/logarithmic applications, implicit-curve graph, higher-derivative strategy, practice exam, rights notes, and graph-heavy pages 18 and 32.

Observed result:

- no clipped text or equations;
- no overlapping graph labels;
- centered and legible plots;
- consistent headers, page numbers, margins, and semantic callout colors;
- grayscale-distinguishable line work;
- clean section transitions;
- no missing glyph boxes or blank output pages.

## Compiler warnings

Tectonic reports underfull vertical boxes at section boundaries, one minor underfull heading line, and duplicate PDF figure-object warnings. These do not indicate overflow. The relevant sparse section-ending and figure pages were visually inspected and render correctly. No overfull box, fatal error, missing character, or clipped-object defect was observed.
