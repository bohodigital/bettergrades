# Limits and Continuity migration

## Scope

This is the only public curriculum migration in BVLP v1. Preserve every
existing public URL, order, check, search/sitemap record, canonical metadata,
print figure, accessibility behavior, and mobile/no-JavaScript usability. Do not
implement Unit 2A or add public derivative fixtures.

Commit `3f39b06` completed the source inventory: exactly 13 rendered graph IDs
and 3 non-rendering explanatory nodes were reconciled across generated unit
data, LaTeX provenance, authored specs, and migration records. Commit
`8a32870b833cb1a9182aea4f7cfb3fe88cf63b3a` completed route delivery for that
exact inventory. Commit `5a1a13d694b41e5b426d3c4061226bc7c8d68af3`
then corrected Interactive 2D toolbar contrast in dark mode. Owner-only preview
and production delivery are still pending.

## Inventoried concepts

The records cover secant lines, removable discontinuity/function-value
difference, one-sided limits and jumps, oscillation, squeeze bounds,
`sin(x)/x`, infinite limits and vertical/horizontal asymptotes, IVT,
epsilon-delta bands, and the two existing multi-panel comparisons. Three
graph-like authoring notes remain non-rendering explanatory nodes and are not
public visuals.

## Public migration matrix

The detailed legacy component, generated LaTeX source, print figure,
VisualSpec pointer, capabilities, parity assertions, and known variances are in
`content/visualizations/limits-continuity/migration-manifest.v1.json`. Routes
below are relative to `/subjects/math/calculus/limits-continuity/`.

| Stable ID | Existing public route | Kind | Public renderer intent | Existing print figure |
| --- | --- | --- | --- | --- |
| `secant-tangent` | `unit/limits/why-limits-matter/` | `cartesian-2d` | Interactive 2D over retained SVG | `fig:secants` |
| `removable-hole` | `unit/limits/limit-at-a-hole/` | `piecewise-cartesian-2d` | static SVG | `fig:hole` |
| `limit-versus-value` | `unit/limits/function-value-vs-limit/` | `piecewise-cartesian-2d` | static SVG | `fig:value-v-limit` |
| `jump-discontinuity` | `unit/limits/one-sided-limits/` | `piecewise-cartesian-2d` | static SVG | `fig:jump` |
| `rapid-oscillation` | `unit/limits/when-a-limit-does-not-exist/` | `piecewise-cartesian-2d` | static SVG | `fig:oscillation` |
| `squeeze-bounds` | `unit/limits/squeeze-theorem/` | `piecewise-cartesian-2d` | Interactive 2D over retained SVG | `fig:squeeze-oscillation` |
| `unit-circle-squeeze` | `unit/limits/sin-x-over-x-proof/` | `geometry-2d` | Interactive 2D over retained SVG | `fig:unit-circle-squeeze` |
| `sine-over-x` | `unit/limits/sin-x-over-x-proof/` | `piecewise-cartesian-2d` | static SVG | `fig:sinc` |
| `vertical-asymptotes` | `unit/limits/infinite-limits/` | `piecewise-cartesian-2d` | static SVG | `fig:odd-even-asymptote` |
| `horizontal-asymptote` | `unit/limits/limits-at-infinity/` | `cartesian-2d` | static SVG | `fig:horizontal-asymptote` |
| `discontinuity-gallery` | `unit/continuity/types-of-discontinuity/` | `piecewise-cartesian-2d` | static SVG | `fig:discontinuities` |
| `ivt-root` | `unit/continuity/intermediate-value-theorem/` | `cartesian-2d` | static SVG | `fig:ivt` |
| `epsilon-delta-window` | `unit/limits/epsilon-delta-graph/` | `cartesian-2d` | Interactive 2D over retained SVG | `fig:epsilon-delta` |

All 13 VisualSpecs have complete caption, long description, accessibility,
performance, provenance, and generated-SVG print declarations. The compiled
manifest maps all 13 to hashed SVG assets. The integrated 159/159 repository
test run includes strict 13-to-13 mapping, the 3 non-rendering nodes, stable
routes/figures, schema parsing, discontinuity domains, semantic fields,
multi-panel layouts, and absence of raw legacy drawing programs or executable
vendor callbacks.

## Delivery architecture

`pnpm verify:visuals` verifies exactly 13 public scenes, exactly four
Interactive 2D scenes, manifest/asset integrity, route delivery, bounded public
serialization, and removal of the legacy Limits canvas component. Mutation
tests prove that representative manifest, asset, public-projection, and route
delivery defects make the verifier fail. Generated SVGs range from 10,466 to
30,350 bytes, below the 50,000-byte gate.

Commit `0c7aa1d` established the representative `removable-hole` gate; commit
`8a32870` extended that static-first contract to all 13 visuals.
`lib/visualization/limits-public.server.mjs` emits only scenes used by a route
and strips private provenance such as `provenance.sourceFile` from interactive
payloads. `BetterGradesVisual.tsx` retains the external SVG and semantic
description before enhancement, lazy-loads only the four requested interactive
scenes, and contains optional-renderer failure with a React error boundary. The
previous `app/LimitsGraphCanvas.tsx` implementation is deleted.

## Completed local parity evidence

The exact candidate was built and served through the Pages emulator. Browser
inspection at 1280 by 720 and 390 by 844 verified all 13 static assets decode,
all 12 visual-bearing lesson routes retain fallbacks and long descriptions, and
no inspected route exposes raw LaTeX, KaTeX errors, `noindex`, or the legacy
canvas. The four interactive scenes enhanced successfully. The epsilon-delta
control responded to an ArrowRight key and updated its value, output,
accessible state, and status. Mobile controls meet the 44-pixel target, and the
tested pages did not overflow horizontally.

The unit landing preserves textbook order: the main unit map is before exam
answer keys, and answer keys are before deep dives. Exam A and B answer keys
were directly reachable and contained 18 and 14 answers respectively. Limits
pages used `Section`, not `Chapter`; analytics, canonical/indexable metadata,
and the greater-or-equal identity were present. Dark-theme inspection found a
white-on-white interaction-toolbar regression; `5a1a13d` fixed it. The mobile
recheck measured dark background `rgb(19, 26, 23)`, light text
`rgb(237, 241, 233)`, and a 44 by 44 control.

## Route-scoped study placements and label layout

The canonical table above remains the exact source migration map: every one of
the 13 scenes is still requested and delivered once by its authored graph node.
The 2026-07-17 editorial pass additionally reuses verified public scenes as
route-scoped study stops on selected text-heavy pages. These wrappers carry a
page-specific heading and explanation, never a second specification, renderer,
or source expression. `verifyPublicProjection` validates their public safety,
manifest metadata, static asset identity, and route-local uniqueness.

The same pass made generated layer labels deterministic and collision-aware.
Each static label publishes a bounded `data-bvlp-label-box`; the release test
asserts that boxes do not overlap within an asset and never escape the SVG.
Interactive 2D now renders labeled axes and uses the same bounded placement
strategy for authored labels. Full rationale, answer-reveal provenance, and
route placement inventory are in
`docs/limits-unit/EDITORIAL_VISUAL_POLISH_2026-07-17.md`.

## Remaining gates

Parity requires correct objects/functions/domains/discontinuities/open and
closed points/asymptotes/annotations/captions, equivalent accessibility
meaning, valid print, usable desktop/mobile, no raw source, and preserved
instructional purpose. It does not require pixel identity.

The old Limits-specific renderer is removed, so there are not two permanent
architectures. The prior migration release was completed in `af95228`, with
owner-only preview, production deployment, and live QA recorded by its release
work order. The cache-only Tectonic 0.16.9 compile produced a 175-page candidate
PDF with no fatal or unresolved errors; its full terminology scan and 19-page
rendered inspection pass. This editorial pass retains the same release gates
and rollback design. Its exact commit, preview, deployment, live QA, and
rollback evidence belong to
`WO-2026-07-17-BETTERGRADES-LIMITS-EDITORIAL-VISUAL-POLISH-001`; rollback uses
the prior immutable deployment or a source revert and does not restore a
duplicate runtime architecture.
