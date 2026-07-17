# Cross-subject non-public fixtures

Fixtures prove the platform is not calculus-specific without becoming
curriculum. They live only in tests, internal fixture modules, owner-only
diagnostics, or generated QA artifacts and must be absent from public routes,
search, sitemap, and indexable metadata.

| Subject | Committed fixture ID | Verified resolver result |
| --- | --- | --- |
| Algebra | `fixture-algebra-function` | `static-svg`; Cartesian function path |
| Linear algebra | `fixture-linear-algebra-basis` | `static-svg`; matrix transform, basis grid, vectors |
| ODE | `fixture-ode-direction-field` | `jsxgraph`; direction field plus advanced ODE family, explicit activation |
| Physics | `fixture-physics-free-body` | `static-svg`; diagram primitives, point, vectors |
| Chemistry | `fixture-chemistry-reaction-coordinate` | `static-svg`; sampled series and data marker |

All five live in
`content/visualizations/fixtures/cross-domain.visual-specs.v1.json`, use
`visibility: fixture` and `/__nonpublic__/fixtures/` provenance, and declare
generated-SVG print fallbacks. Commit `33850e4` adds 3/3 passing tests for strict
schema validation, inferred-capability coverage, deterministic renderer choice,
fallback/hydration policy, and absence from app routes, public compiler, search,
and sitemap sources. No calculus or Unit 2A fixture is included.
