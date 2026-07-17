# Performance budgets

Budgets are hard release gates measured against the accepted baseline; hints
may tighten but never relax them.

| Surface | Budget/policy |
| --- | --- |
| nonvisual route | <=5 KB gzip BVLP increase; no renderer, registry, scenes, or Compute Engine |
| static visual route | static SVG immediately; no interactive JS/JSXGraph/uPlot/Compute Engine |
| Interactive 2D core | source boundary <30 KiB gzip; production chunk still measured separately; requested scenes only |
| ordinary interactive scene | target <25 KB gzip; larger requires reason |
| JSXGraph | separate lazy chunk; explicit activation preferred; absent from ordinary Limits unless required |
| uPlot | separate lazy chunk; only data-series routes; absent from ordinary Limits unless required |
| typical optimized SVG | target <50 KB; >75 KB requires written justification |
| worker work | bounded, abortable, never blocks initial/static rendering |

Hashed assets are immutable and duplicate scene data requires justification.
Do not hydrate a unit-wide or sitewide registry. Compute Engine, JSXGraph, and
uPlot are forbidden from the global/root chunks; static routes need zero visual
runtime.

## Measurement gates

Record baseline and candidate raw/gzip bytes for root, application shell,
representative nonvisual/static/interactive routes, renderer chunks, route scene
payloads, and generated assets. Inspect chunk dependency graphs and actual
network requests, not only source imports. Automated tests cover
global/nonvisual delta, static isolation, interactive size, adapter isolation,
Compute Engine absence, payload/asset size, and no source/answer/whole-unit
leaks.

At `a4519d9`, the deterministic source aggregation used by
`bvlp-interactive-2d-boundary.test.mjs` measures 36,801 bytes raw and 9,796
bytes gzip for the five Interactive 2D TypeScript/TSX files, below the 30 KiB
source boundary. The final production build at `dee8fd9` emits Interactive 2D
as an 87,031-byte raw/24,829-byte gzip chunk, below both the 30 KiB core boundary
and 25 KB ordinary-scene target. All client JavaScript totals 1,117,910 raw and
311,680 gzip versus 4,883,623 raw and 1,247,617 gzip in the pre-release main
build. JSXGraph, uPlot, and Compute Engine emit no candidate client chunk.
Exact live request observations remain part of preview/production QA.

The 13 generated Limits SVGs are 10,466–30,350 bytes each and all pass the
50,000-byte compiler gate. Integrated Pages-package tests also pass the client
answer/source/Cortex and whole-unit leakage guards. A material exceedance is a
stop condition until tree-shaking/design restores the budget or an explicit
architectural review approves a documented deviation.
