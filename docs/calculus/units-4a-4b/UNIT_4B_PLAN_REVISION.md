# Unit 4B plan revision after Unit 4A

## Gate and architecture decision

Unit 4B branches from accepted Unit 4A production main at `9af98dc2106fed1e36d2250f9ff7855f39e3d414`. The Unit 4A postmortem found no broad architecture defect. Continue the accepted normalized-handoff importer, server-only assessment boundary, BVLP runtime, site shell, search/SEO/print pipeline, owner-only Sites preview, and fixed Cloudflare release lane. Add no renderer, dependency, service, database, binding, or parallel content system.

## Revised route and collision plan

- Own the 31 declared intents under `/subjects/math/calculus/power-series-and-taylor-series/`.
- Preserve `/subjects/math/calculus/sequences-and-series/` as Unit 4A and change its transition notice to the Unit 4B canonical link only in the Unit 4B candidate.
- Merge and redirect the old `/subjects/math/calculus/sequences-series/power-series-interval-of-convergence/` intent to the complete radius-and-interval lesson unless live comparison finds a narrower distinct treatment.
- Merge and redirect the old `/subjects/math/calculus/sequences-series/taylor-series-remainder/` intent to the complete Taylor remainder theorem lesson unless live comparison finds a narrower distinct treatment.
- Fail on duplicate canonical, sitemap, or search ownership; do not invent suffixes.

## Revised implementation order

1. Install the nine exact Unit 4B handoff artifacts and generate the checksum manifest.
2. Run live/source route and search-intent reconciliation before registering public routes.
3. Extend the existing unit configuration and runtime registries for exactly 31 routes, 21 core routes, 20 checks, three assessment sets, two exams and keys, and 20 visuals.
4. Batch 1: power series as functions; radius/interval; Ratio Test; independent endpoint testing.
5. Batch 2: algebra; differentiation/integration; geometric-series transformation library.
6. Batch 3: Taylor polynomials; Maclaurin; center `a`; standard series.
7. Batch 4: logarithm/arctangent; building new series; binomial series.
8. Batch 5: Taylor theorem/remainder; alternating approximation; definite integrals; small-angle physics.
9. Batch 6: ODE and uniform-convergence previews; reviews; mixed practice; quiz; two exams/keys; reference and common-errors pages.
10. Connect Unit 4A forward navigation and Unit 4B backward navigation, then run the full course-map and legacy-regression suite.

## Evidence-driven mathematical gates

- Every power-series identity must state whether it is formal or proved on an interval.
- Radius calculation and endpoint substitution are separate checks; a correct radius cannot imply correct endpoints.
- Every Taylor approximation must distinguish polynomial construction, approximation value, remainder/error bound, the interval supporting the bound, and whether convergence to the original function is established.
- Audit logarithm, arctangent, binomial, alternating-error, definite-integral, and small-angle answers independently of their source strings.
- Unsupported equivalence must return `uncertain`; do not fall back to answer-string equality.

## Renderer and delivery plan

Use the handoff allocation of 14 static-first and six BetterGrades Interactive 2D scenes. Every scene keeps an accessible content-addressed SVG and print fallback. Reject arbitrary JavaScript, callback source, JSXGraph, uPlot, 3D, and vendor APIs unless a separate ADR and owner approval justify them.

Retain Unit 4A's server-light no-JavaScript lesson fallback. Add Unit 4B raw-response and true browser content-setting checks before preview. Keep the ordinary app bundle at or below the established gate and specialist visual code lazy.

## QA and release sequence

1. Exact handoff/checksum, route, search, assessment, visual, source, and public/server leak checks.
2. Lint, TypeScript, Pages build, and full 3,072 MB-heap suite.
3. All-route rendered HTML, canonical, sitemap, robots, analytics, unknown-route 404, API, redirect, and prior-unit regression checks.
4. Desktop, 390 px mobile, light/dark, keyboard, reduced-motion, lazy visual, reveal-gate, and no-JavaScript browser review.
5. Print-to-PDF render and PNG inspection with no site footer, sticky header, clipped math, overlap, or broken tables.
6. Separate exact owner-only Sites candidate and separate draft pull request.
7. Stop for owner approval before merge or Unit 4B Cloudflare production deployment.

## Stop conditions

Stop if Unit 4A or any earlier unit regresses, answer/rubric content enters a public payload, endpoints are inferred from radius alone, a Taylor bound lacks its domain hypotheses, no-JavaScript delivery requires a full synchronous content import, print chrome returns, a new renderer/dependency is required without approval, or the validated, pushed, previewed, and proposed trees differ.

