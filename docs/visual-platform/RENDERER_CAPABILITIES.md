# Renderer capability registry

The canonical registry and least-cost resolver are implemented in
`lib/visualization/capabilities/index.ts` (`fc3de72`). This handwritten table
summarizes that registry; it does not by itself prove that every renderer module
or release integration is accepted. Phase status remains authoritative in
[phase-ledger.md](phase-ledger.md). The code registry and its resolver tests are
authoritative; this table is reviewed documentation rather than generated code.
Static SVG and Interactive 2D implementations and the guarded lazy adapter
boundaries now have committed focused tests; JSXGraph/uPlot vendor-browser
rendering remains outside the accepted boundary work.

## Required registry record

Each renderer definition declares ID/display name, runtime class, supported
kinds and capabilities, unsupported cases, interaction model, accessibility and
print responsibilities, preferred and prohibited use cases, global/lazy/payload
cost budgets, activation mode, dynamic import path, fallback, and module owner.

## Policy matrix

| Renderer | Runtime/cost class | Intended capabilities | Explicitly unsupported | Activation | Fallback |
| --- | --- | --- | --- | --- | --- |
| `static-svg` | static, zero visual JS | deterministic 2D paths/points/regions/diagrams, labels, multi-panel, accessibility, print | instructionally required live manipulation, dense interactive data, 3D | build | none; it is the fallback |
| `bg-interactive-2d` | browser-core, <=30 KB gzip source target | pan/zoom/reset, readout, bounded controls, and compiled 2D layers; the accepted first pass covers four interactive Limits scenes | advanced constraints/loci/implicit curves, dense data, 3D; draggable-point/play-pause UI is not implemented in the accepted first pass | automatic progressive | `static-svg` |
| `jsxgraph` | browser-lazy, registry budget 180,000 gzip bytes; no vendor chunk emitted by accepted Limits build | advanced constraints, geometry dependency graphs, implicit curves, loci, advanced ODE geometry | ordinary/static plots, dense series, 3D | explicit action required | `static-svg` |
| `uplot` | browser-lazy, registry budget 55,000 gzip bytes; no vendor chunk emitted by accepted Limits build | dense precomputed numeric series, shared x-axis, cursor, zoom, markers/error bands | symbolic parsing, geometry, diagrams, 3D | near viewport | `static-svg`/static summary |
| reserved 3D | unsupported | reserved camera/lighting/mesh/3D axes contracts | all production v1 rendering | fail | no silent fallback |

## Capability categories

`VisualCapabilitySchema` currently enumerates these exact semantic IDs:

- static/base: `static-fallback`, `cartesian-axes`, `function-paths`,
  `piecewise-paths`, `parametric-curves`, `polar-curves`, `number-line`,
  `complex-plane`, `geometry-primitives`, `matrix-transform`, `data-series`,
  `vector-fields`, `direction-fields`, `phase-lines`, `diagram-primitives`,
  `annotations`, `regions`, `open-closed-points`, `asymptotes`, `multi-panel`,
  and `error-bands`;
- interaction/specialist: `parameter-controls`, `draggable-points`,
  `linked-views`, `animation`, `coordinate-readout`, `advanced-constraints`,
  `implicit-curves`, `dynamic-loci`, `ode-solution-family`, `dense-series`,
  `linked-cursors`, and `zoom-pan`;
- reserved unsupported 3D: `surface-3d`, `vector-field-3d`, `molecular-3d`,
  `camera-3d`, and `mesh-3d`.

Touch, keyboard, announcements, reduced motion, cleanup, fallback retention, and
print are renderer/accessibility contracts rather than capability IDs.

## Drift control

The resolver tests in `tests/bvlp-core-schema.test.mjs` verify least-cost
selection, capability inference, preferred-renderer safety, and fail-closed
unsupported 3D. The full repository suite and strict visual verifier are the
release gates. No handwritten support claim may override code evidence; a
future generated documentation check may improve maintenance ergonomics but is
not treated as implementation evidence.
