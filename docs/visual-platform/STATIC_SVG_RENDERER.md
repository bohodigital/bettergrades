# Static SVG renderer

## Role and interface

Static SVG is the deterministic default renderer and mandatory public fallback.
Its implementation is `lib/visualization/renderers/static-svg/`, exported as
`renderStaticSvg(scene, options?)`. The result contains SVG bytes, width/height,
SHA-256, a 16-character content-addressed filename/path, and budget status. The
renderer consumes only a validated `CompiledScene`, produces script-free SVG and
safe metadata, and does not parse raw LaTeX or call the network.

## Required support

Cartesian axes/grid, responsive viewport, function/piecewise paths, open/closed
and labeled points, vertical/horizontal asymptotes, tangent/secant lines, bounds,
regions, annotations, direction arrows, multi-panel layouts, accessible title/
description, grayscale-safe distinctions, and print-safe styling are required to
migrate Limits. Initial cross-subject primitives include number lines, vectors,
basis grids, polygons, circles, ellipses, error bands/data markers, free-body
arrows, circuit segments, reaction paths, and energy levels.

## Selection and anti-use

Use whenever static output communicates the complete core meaning. Do not add an
interactive renderer for decorative dragging or convenience-only zoom. Static
SVG alone is insufficient only when live manipulation or dense data interaction
is instructionally required; even then it remains the fallback.

## Output contract

- deterministic bytes and stable IDs suitable for snapshot tests;
- responsive `viewBox` with no meaningful enhancement layout shift;
- useful title/description and caption association;
- safe text, no raw author LaTeX/TikZ/PGFPlots;
- no script, external resource, external font, or runtime parser;
- clipped/split curves with no false bridges through discontinuities;
- color-independent line/marker/label distinctions;
- hashed optimized asset naming and explicit print behavior.

## Performance, loading, and cleanup

Typical optimized assets target under 50 KB; assets over 75 KB require recorded
justification. Static output needs no browser renderer, hydration, observer, or
cleanup. Build-side resources still require bounded sampling and deterministic
failure.

The committed 13 Limits assets range from 10,466 to 30,350 bytes and total
194,425 bytes. They are indexed in
`content/visualizations/limits-continuity/compiled-scenes.v1.json` and emitted at
`public/visuals/v1/<id>.<sha16>.svg`.

## Testing and troubleshooting

Test byte determinism, IDs, viewBox, every required primitive, title/description,
safe text, grayscale/print, clipping, sample bounds, and all discontinuity cases.
If a graph is missing, inspect schema/compiler diagnostics before renderer code.
If a curve crosses an asymptote, treat it as a release blocker and inspect domain
segmentation and jump thresholds. See [Sampling](SAMPLING_AND_DISCONTINUITIES.md).

The three focused renderer files pass 11/11, including every Limits-required
layer family, all 13 compiled scenes, multi-panel clipping/titles, safe text,
determinism/content addressing, hard budgets, and fail-closed 3D/malformed input.
`node tools/visualization/compile-visuals.mjs --check` verifies the committed
manifest and all 13 assets without rewriting them.

## Replacement and limitations

A replacement must implement the same adapter/fallback interface and preserve
determinism, semantics, print, no-JS behavior, snapshots, and budgets before a
migration ADR. The module path, asset count, and hashes are accepted. Local
desktop/mobile browser delivery, server-rendered fallback semantics, and
representative PDF page inspection are verified; production-live evidence
remains pending.

Known v1 boundary: logarithmic axes fail clearly. Region support covers the
bounded forms required by the current Limits inventory; new region semantics
need fixtures and review rather than silent approximation.
