# BVLP changelog

## 2026-07-17 — Limits editorial and visual polish

- Added route-scoped study placements of existing verified scenes on eleven
  previously text-heavy lessons and practice pages without expanding the exact
  13-scene canonical migration inventory.
- Added deterministic collision-aware label layout metadata to generated SVGs,
  plus leader lines for moved annotations.
- Added labeled axes, ticks, bounded label placement, larger margins, and clearer
  controls to BetterGrades Interactive 2D.
- Centered and width-bounded canonical and companion visual containers.
- Added a verifier path for companion scene safety and a generated-asset overlap
  test. See `docs/limits-unit/EDITORIAL_VISUAL_POLISH_2026-07-17.md`.

## Unreleased

- Established the infrastructure-only BVLP documentation and decision record.
- Defined renderer-neutral VisualSpec/CompiledScene, static-first progressive
  enhancement, expression trust boundaries, deterministic capability selection,
  accessibility/print/performance/delivery contracts, migration evidence, and
  release/rollback requirements.
- Preserved explicit exclusions: no Unit 2A, public derivative material, broad
  content/article/assessment/search/site-shell replacement, production 3D,
  persistent Cloudflare bindings, runtime CDN, or unreviewed deployment.
- Implemented strict VisualSpec/CompiledScene contracts, capability inference
  and least-cost resolution, bounded allowlisted AST evaluation, server-only real
  Cortex/MathJSON compilation, adaptive discontinuity-aware sampling, and
  compiler scene-variable allowlist validation (`40c542c` through `867f1b2`).
- Inventoried the exact 13 rendered Limits visuals and 3 non-rendering
  explanatory nodes with strict authored specs, provenance, print declarations,
  and legacy parity assertions (`3f39b06`).
- Implemented the first-party `bg-interactive-2d` renderer with bounded controls,
  pan/zoom/reset/readout, scene-specific Limits metrics, reduced-motion and
  cleanup helpers, visible failure behavior, and a passing source boundary
  (`a4519d9`).
- Added deterministic accessible Static SVG rendering (`b646c86`), guarded lazy
  JSXGraph/uPlot/future-specialist boundaries plus five non-public cross-subject
  fixtures (`33850e4`), and deterministic compiled manifests/assets for all 13
  Limits visuals (`723b2f3`, normalized in `2a801d7`).
- Implemented a one-visual representative route gate for `removable-hole` with
  a retained Static SVG fallback and bounded public projection (`0c7aa1d`).
- Migrated all 13 current Limits visuals through the bounded BVLP public
  projection, retained static SVG/long-description fallbacks, progressively
  enhanced exactly four scenes, removed the legacy Limits canvas, stripped
  source-file provenance from client scenes, added optional-renderer error
  containment, installed a strict `verify:visuals` gate with mutation tests,
  and repaired 16 truncated learner-visible descriptions (`8a32870`).
- Fixed Interactive 2D toolbar background/text/border tokens in dark mode after
  mobile browser QA exposed a white-on-white control regression (`5a1a13d`).
- Replaced learner-visible print terminology with `Section`, including running
  heads; hardened the print-source regression test; and made `verify:visuals`
  run the complete repository suite before the strict visual verifier
  (`79660f2`, `400c937`).
- Removed source filenames from the public route index and client route payloads
  while retaining the answer-key source trace that supports editorial audit
  (`a261279`, `400c937`). Excluded only generated Wrangler scratch output from
  lint after the Pages emulator proved that scratch was otherwise scanned
  (`dee8fd9`).
- Verified the Pages build, focused visual gate (13 public/4 interactive),
  typecheck, full lint, and full 159/159 repository suite, including the
  schema/registry/dependency/migration documentation-drift gate. Completed local
  desktop/mobile route, interaction, answer-key, map-order, math-rendering,
  metadata, analytics, and greater-or-equal identity inspection.
- Compiled the final 175-page print artifact with Tectonic 0.16.9 cache-only;
  extracted text contains zero case-insensitive `chapter` occurrences, and 19
  representative pages passed rendered-image inspection. Its exact hash and
  warning evidence are recorded in `PRINT_AND_EXPORT.md`.
- Measured the complete emitted client candidate at 1,117,910 raw / 311,680
  gzip bytes; the Interactive 2D chunk is 24,829 gzip bytes, no Cortex,
  JSXGraph, or uPlot public client chunk is emitted, and forbidden-source scans
  pass. Exact files are recorded in `BUNDLE_AND_HYDRATION.md`.
- Owner-only Sites preview and production deployment/live QA remain pending.

Integration history and baseline evidence are recorded in
[integration-gate.md](integration-gate.md) and [phase-ledger.md](phase-ledger.md).
