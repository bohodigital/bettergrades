# BetterGrades Limits and Continuity Web Textbook v3

This revision keeps the expanded tutorial content while changing the delivery model from a boxed lecture-note PDF into a semantic, web-ready textbook source.

Key files:

- `main.tex`: printable build
- `bettergrades-webtext.sty`: custom semantic environments
- `chapters/`: tutorial content with explicit `webpage` boundaries
- `checks/`: reusable in-flow knowledge checks
- `quizzes/`: chapter concept quizzes
- `web/manifest.json`: canonical route, SEO and navigation data
- `web/checks.json`: answer-checker definitions
- `web/problem-object-schema.json`: future public problem-page schema
- `web/IMPLEMENTATION.md`: delivery requirements

Build:

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
```

For an editorial PDF with visible route markers, set `\bgshowwebmarkerstrue` in `main.tex`.
For a student worksheet build without worked reveals, set `\bgshowrevealsfalse`.
