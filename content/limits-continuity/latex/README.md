# BetterGrades Limits and Continuity Web Textbook v3

This revision keeps the expanded tutorial content while changing the delivery model from a boxed lecture-note PDF into a semantic, web-ready textbook source.

Key files:

- `main.tex`: printable build entry point
- `bettergrades-webtext.sty`: custom semantic environments
- `chapters/`: tutorial content with explicit `webpage` boundaries
- `checks/`: reusable in-flow knowledge checks
- `quizzes/`: chapter concept quizzes
- `../unit.json`: canonical imported route, SEO, navigation, provenance, and typed-node payload
- `../unit-index.json`: compact public route/search/sitemap index
- `../unit-checks-public.json`: public check metadata without canonical answers or worked feedback
- `../../../tools/import-limits-unit.mjs`: deterministic importer and payload generator

Build:

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

For an editorial PDF with visible route markers, set `\bgshowwebmarkerstrue` in `main.tex`.
For a student worksheet build without worked reveals, set `\bgshowrevealsfalse`.
