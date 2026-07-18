# Architecture integration

## Decision

Unit 2A extends the accepted BetterGrades architecture. It does not introduce a second site shell, route framework, search system, assessment runtime, or visualization platform.

## Data flow

1. Normalized server artifacts remain under `content/calculus/units/unit-2a/`.
2. `tools/import-calculus-unit.mjs` validates the exact inventory and compiles LaTeX into typed semantic nodes.
3. `routes.public.json` contains browser-safe navigation and metadata only.
4. `pages.compiled.server.json`, server assessment records, and route-scoped reveal bodies stay on the server boundary.
5. `lib/calculus/calculus-unit.mjs` assembles one route-local public payload.
6. `app/CalculusUnitPages.tsx` renders the payload inside the existing BetterGrades shell.
7. Existing search, sitemap, metadata, analytics, footer, theme, and 404 behavior remain shared.

## Assessment boundary

- Public assessment records contain prompts, choices, hints, types, and attempt policy.
- Canonical answers and worked solutions remain in server-only JSON and modules.
- `/api/calculus-check` accepts bounded JSON and performs deterministic grading.
- `/api/calculus-reveal` requires the exact unit, route, reveal ID, and a nonempty attempt.
- `exercise-answers.server.json` supplies route-scoped cumulative-practice answers without entering browser-safe indexes or unrelated client assets. The generic importer validates one answer per semantic exercise and converts each server solution into an attempt-gated reveal placeholder for the browser.
- Open conceptual responses return `uncertain` unless the deterministic rubric can prove correctness; the UI does not pretend free prose has one machine-provable wording.

## BVLP boundary

- The normalized visual briefs are authoring inputs, not runtime programs.
- The authoring step emits strict `VisualSpec v1`.
- The compiler emits `CompiledScene v1` plus content-addressed SVG fallbacks.
- Raw LaTeX, TikZ, PGFPlots, CortexJS, source paths, executable callbacks, and canonical answers are excluded from public visual payloads.
- Twenty-six Unit 2A visuals are static-first and one uses the existing bounded interactive 2D runtime. Every scene retains equivalent static, accessible, print, and no-JavaScript meaning.

## Limits compatibility

The Limits implementation remains separately owned. Its release invariants continue to be checked at exactly 73 routes, 38 checks, 348 route-scoped answer reveals, and 13 immutable BVLP visual assets. Shared visual verification now scopes stale-asset checks to each manifest while the Pages package test requires the exact combined 13+27 inventory.

## Resource discipline learned from the Pi

The suite is intentionally serial (`--test-concurrency=1`), and Unit 2A's exhaustive 67-route render sweep runs in its own test file/process. Parallel Node workers created avoidable ARM memory pressure; serializing alone still let the already-large general rendered-page file retain enough heap to hit Node's 2 GiB default after the Unit 2A sweep had passed. Process isolation preserves the same assertions, releases heap between route families, and is the controlling Raspberry Pi validation mode for Unit 2A and later units.
