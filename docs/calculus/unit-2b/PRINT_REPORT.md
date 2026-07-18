# Unit 2B print report

## Supplied normalized artifact

- File: `bettergrades-calculus-unit-2b-normalized-v3.pdf` from the verified source archive.
- Pages: 170 US Letter pages.
- Bytes: 847,866.
- SHA-256: `b15261aa30924bb30586517e8a605d2e9440554ff5130f763539b8fd21613741`.
- Producer: pdfTeX 1.40.26.
- Encryption: none.
- Embedded JavaScript: none.

## Visual inspection

Representative rendered pages included the cover, start guide, contents, section endings, linear-approximation exposition, extrema work, optimization modeling, l'Hopital work, advanced material, practice-exam answers, and sources/rights notes. The inspected pages have consistent margins and headers, centered and legible figures, readable equations, clean answer-key numbering, and no observed clipped text, overlapping labels, missing glyph boxes, or unintended blank page.

Sparse section-ending pages are intentional. The supplied log reports small vertical box warnings and PDF bookmark/duplicate-destination warnings; visual inspection found no corresponding content loss. The largest reported overfull vertical box is 6.28 points and is included in the Pi recompile review gate rather than silently ignored.

## Pi compilation gate

Before production acceptance, compile the preserved normalized `unit-2b/source/latex-project/main.tex` on the Pi with the pinned Tectonic 0.16.9/cache lane. Record compiler version, page count, byte count, SHA-256, warning classes, text extraction, blank-page probe, and representative rendered-page inspection. Do not commit generated PDFs or extracted source directories to the web runtime.
