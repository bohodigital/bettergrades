# Architecture integration

Unit 3 uses the already accepted Better Grades architecture. No parallel site shell, parser, graph engine, assessment API, database, or runtime model service was introduced.

## Reused boundaries

- `tools/import-calculus-unit.mjs` imports normalized handoff artifacts into the generic calculus-unit contract.
- `lib/calculus/calculus-units-index.mjs` owns unit discovery and route lookup.
- `lib/calculus/calculus-unit.mjs` owns route-local public page delivery.
- `lib/calculus/calculus-assessment.server.mjs` owns answer evaluation and reveal authorization.
- `lib/visualization/calculus-units-public.server.mjs` owns route-scoped public visual delivery.
- The existing BVLP compiler produces deterministic, content-addressed SVG fallbacks and bounded interactive scenes.
- The existing vinext/Cloudflare Pages advanced Worker owns rendering, API boundaries, headers, search, sitemap, analytics, and static assets.

## Generalization performed

The importer now accepts both the legacy Unit 2 source layout and the normalized Unit 3 handoff layout. Unit-specific configuration is data-driven: canonical root, inventory expectations, section grouping, answer sources, and visual authoring briefs. The public artifacts strip canonical answers, solutions, source paths, and private rubrics.

The grading boundary gained bounded antiderivative normalization, including required additive constants, and structural definite-integral setup comparison. Unsupported or unparseable structures return `uncertain`; they are never promoted to correct by string resemblance.

## Rollback boundary

Unit 3 is isolated behind registry entries and generated unit artifacts. Reverting the release commit removes the new unit while retaining the previously accepted Units 1, 2A, and 2B implementation.
