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

## Pi compilation

The preserved normalized `unit-2b/source/latex-project/main.tex` was compiled in the isolated temporary Pi lane `/srv/local1/tmp/bettergrades-unit2b-print-897a6f0` with Tectonic 0.16.9 and the BetterGrades Tectonic cache.

- Pages: 170 US Letter pages.
- Bytes: 530,075.
- SHA-256: `5816ba382ed9aa7abdcf1654ebcd6eac0db8fba638c5124aaf8847deb6ff3da9`.
- Producer: xdvipdfmx 0.1.
- Extractable text: 210,790 characters.
- Encryption: none.
- Embedded JavaScript: none.

The sole page below the 20-character blank-page heuristic is physical page 8, an intentional final continuation page of the contents with the `CONTENTS` running head and roman page number `viii`; it is not an empty or missing-content output page. Representative output plus every reported overfull location was rendered and inspected. The 2.55-point and 3.26-point vertical warnings remain within the page, and the 7.46-point heading warning on the Section 6 opening is visible but not clipped. No missing glyph, overlapping label, equation cutoff, or content loss was observed.

Generated PDFs, logs, and extracted source directories remain outside the web runtime and are not committed.
