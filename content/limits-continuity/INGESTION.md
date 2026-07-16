# Limits and Continuity v3 ingestion verification

Work order: `WO-2026-07-15-BETTERGRADES-LIMITS-UNIT-INGEST-001`

## Verified artifact

- Durable intake path: `/srv/local1/runtime/bettergrades/handoff/bettergrades_limits_continuity_complete_handoff_v3.zip`
- Expected SHA-256: `24e5cf5ca36d9756dc5fb9b799be1dc1c480891ef6046039440cd9b5e8b926f1`
- Observed SHA-256: `24e5cf5ca36d9756dc5fb9b799be1dc1c480891ef6046039440cd9b5e8b926f1`
- ZIP entries: 231
- Archive CRC test: passed
- Declared payload files: 212
- Selectively extracted files: 198
- Files verified against the archive's internal checksums: 195 passed, 0 failed

The SHA-256 was checked before extraction. A pre-extraction central-directory scan rejected absolute paths, `..` traversal, symlinks, hidden Git metadata, secrets and environment files, generated dependencies, deployment output, and unexpected executable content. The selective extraction created no symlink or executable file.

The full command evidence is retained outside the production repository under:

`/srv/local1/runtime/bettergrades/handoff/WO-2026-07-15-BETTERGRADES-LIMITS-UNIT-INGEST-001/logs/`

## Excluded archive members

The following binaries, source books, nested archives, and executable tooling were verified but deliberately excluded from the production source tree:

- `01_FINAL_DELIVERABLES/student_textbook.pdf`
- `01_FINAL_DELIVERABLES/editorial_web_boundary_textbook.pdf`
- `02_MODULAR_SOURCE/main.pdf`
- `02_MODULAR_SOURCE/main_editorial.pdf`
- `02_MODULAR_SOURCE/bettergrades_limits_continuity_webtext_v3_singlefile.pdf`
- `04_SOURCE_MATERIAL/active_calculus_single_2e.pdf`
- `04_SOURCE_MATERIAL/calculus_made_easy.pdf`
- `04_SOURCE_MATERIAL/granville_elements_calculus.pdf`
- `04_SOURCE_MATERIAL/greenhill_differential_integral_calculus.pdf`
- `04_SOURCE_MATERIAL/vector_calculus_shaw.pdf`
- `02_MODULAR_SOURCE/tools/split_webpages.py`
- `05_TOOLING/bg_v3_build.py`
- `05_TOOLING/update_core_nav.py`
- `05_TOOLING/split_webpages.py`
- `06_ARCHIVES/webtext_v3_source.zip`
- `06_ARCHIVES/calculus_source_pack.zip`

The redundant `01_FINAL_DELIVERABLES/single_file_source.tex` was not imported because the verified modular source is canonical and the matching single-file source is already present under `content/limits-continuity/latex/`.

## Imported inventory

- 71 canonical web routes
- 47 sequential core routes
- 24 supporting routes
- 40 lessons
- 8 reviews
- 7 practice sets
- 6 quizzes
- 4 references
- 2 exams
- 1 diagnostic
- 1 unit landing page
- 1 extension
- 1 study guide
- 38 deterministic interactive checks
- 35 printable LaTeX source files

The generated, reviewable web payload is `unit.json`. It contains each route's canonical path, unique title, H1, description, breadcrumb chain, indexing state, core position, previous/next relationship, related resources, check IDs, provenance, source checksum, raw LaTeX fragment, and typed semantic nodes.

## Provenance and rights separation

The package labels the exposition as BetterGrades-original. Active Calculus, 2nd edition (CC BY-SA 4.0), was consulted only for scope and sequencing; no Active Calculus exercise is reproduced verbatim and no adapted Active Calculus material is published in this unit. Referenced public-domain examples were modernized and recomposed rather than copied as an unlabeled corpus.

Source categories remain explicit in `unit.json`:

- `bettergrades-original`
- `cc-by-sa-reference-only`
- `public-domain-reference-only`

No source textbook PDF is present in the application source or build input.

## Repository baseline

The durable task worktree was created at `/srv/local1/worktrees/bettergrades-limits-unit-1` on branch `agent/bettergrades-limits-continuity-unit-1`, based exactly on `origin/main` commit `c780b9afd6540308a0a19505bb5f280b5ff44222`. The canonical main checkout and its unrelated local-only commit were not modified or included.

Before content changes, all required baseline gates passed:

- `corepack pnpm install --frozen-lockfile`
- `corepack pnpm lint`
- `corepack pnpm test`
- `corepack pnpm build`
- `corepack pnpm run build:pages`

## Print validation status

The safe modular source, semantic style, chapter files, appendices, reusable checks, quizzes, editorial entry point, and single-file entry point are retained in `content/limits-continuity/latex/`. Static source-integrity tests pass and reject PDF, ZIP, or compiled output in that tree.

Runtime compilation completed with the verified, isolated Tectonic 0.16.9 ARM64 executable at `/srv/local1/runtime/bettergrades/tooling/tectonic-0.16.9/tectonic`. The cache and output remained outside the repository:

- Cache: `/srv/local1/runtime/bettergrades/tooling/tectonic-cache`
- Output: `/srv/local1/runtime/bettergrades/print-validation/WO-2026-07-15-BETTERGRADES-LIMITS-UNIT-INGEST-001`
- PDF: `main.pdf`, 175 pages
- PDF SHA-256: `cc7918f269dff413813e4a98a327003c784253bfe05520755280d1fdef812511` (this rerun; the prior verified compile artifact was `f501b192789158027958f04a000c60d65faaccb69cb6fff3f1b5a1f1844eca08`)
- Result: 0 fatal errors, 0 unresolved references, 8 Underfull/Overfull box warnings

Representative rendered pages (including lessons, checks, quizzes, exams, answers, graphs, and licensing) were visually inspected from the isolated PDF; no clipping, overlap, missing glyphs, or broken math was found. The PDF and all build output remain runtime validation artifacts and are not committed.

No private preview, pull request, merge, production deployment, DNS change, or production-domain claim was made. The remaining publication boundary is explicit owner approval for the external Git push and subsequent preview workflow.
