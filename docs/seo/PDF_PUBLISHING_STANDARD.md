# BetterGrades PDF Publishing Standard

PDFs are compiled at build time with Tectonic from deterministic resource records.

Each PDF has searchable text, embedded fonts, BetterGrades identity, title/author/subject metadata, revision date, canonical landing URL, page numbers, useful workspace, and no local paths or internal instructions.

Student PDFs contain prompts and workspace only. Answer-key PDFs contain every expected answer and derivation.

Cloudflare Pages serves each PDF with a canonical `Link` to its HTML page, `X-Robots-Tag: noindex`, and inline disposition. The HTML page remains indexable. `artifacts/seo/pdf-verification.json` records hashes, sizes, variants, and canonical targets; production acceptance rechecks actual MIME and headers.
