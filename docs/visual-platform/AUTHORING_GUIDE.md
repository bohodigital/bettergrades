# Visual authoring guide

## Start with instruction, not a renderer

1. State the learning objective and what a learner should notice.
2. Ask whether prose, notation, or a table is clearer than a visual.
3. If a visual helps, decide whether its complete core meaning can be static.
4. Add interaction only when manipulating or linking values is instructional.
5. Author `VisualSpec`; never call JSXGraph, uPlot, D3, SVG, Canvas, or runtime
   parser APIs from lesson content.

Version 1 authoring must not create Unit 2A, public derivative lessons,
assessments, routes, or fixtures. It must not replace the content/article/
assessment/search/site-shell systems.

## Required author inputs

Give each visual a stable ID, kind, title, visible caption, learning purpose,
long description, coordinate space, finite viewport, axes or explicit no-axis
choice, applicable units, ordered layers, explicit domains, accessibility and
print behavior, and required capabilities. Controls need accessible names,
bounds, steps/units, deterministic reset, and keyboard behavior.

Use color plus shape, line style, marker fill, label, or position. Connect the
figure to nearby prose and describe relationships among panels in reading order.
Avoid decorative interaction and overloaded figures; split figures when a
learner cannot explain the key comparison in one sentence.

## Mathematical authoring

- Expressions may use approved LaTeX that the build compiler lowers to the
  allowlisted numerical AST; never embed JavaScript.
- Declare domains and piecewise boundaries explicitly.
- Represent holes with open points and actual values with closed points.
- Declare asymptotes; do not rely only on sampling to infer them.
- Use units consistently on axes, controls, data series, and announcements.
- Review clipping, rapid oscillation, non-finite values, and discontinuity
  segmentation at the target viewport.

## Renderer-independent subject examples

| Subject | Author intent and capabilities | Expected selection |
| --- | --- | --- |
| Algebra | fixed quadratic with roots and vertex | Static SVG |
| Algebra | bounded sliders for `a`, `h`, `k` | Interactive 2D |
| Precalculus | linked unit-circle angle and sinusoid | Interactive 2D if core capabilities suffice; otherwise JSXGraph |
| Calculus | removable discontinuity | Static SVG |
| Calculus | existing Limits `why-limits-matter` secant-to-tangent visual | Interactive 2D with Static SVG fallback; no Unit 2A or new derivative route |
| Linear algebra | fixed basis transformation | Static SVG |
| Linear algebra | bounded two-parameter basis transformation | Interactive 2D or JSXGraph by capability |
| ODE | advanced direction field plus draggable initial condition | JSXGraph |
| Physics | precomputed position/velocity/acceleration arrays | uPlot |
| Chemistry | reaction-coordinate diagram | Static SVG |

## Review checklist

- The static SVG alone communicates the core concept.
- Caption, long description, title, units, non-color distinctions, and panel
  relationships match the mathematics.
- Domains, discontinuities, open/closed points, and asymptotes are correct.
- Selected capabilities are necessary and no vendor is named in content.
- Mobile labels and controls do not overflow; touch targets remain usable.
- Keyboard, announcements, reset, reduced motion, and failure fallback work.
- Print mapping has been compiled and compared with the web figure.
- No raw LaTeX, TikZ, PGFPlots, author notes, source code, or answer data leaks.
- The visual appears exactly where intended, with no search/sitemap change except
  the existing public Limits route records.
- `verify:visuals`, the broader commands in [Testing](TESTING.md), and applicable
  build, browser, print, preview, and production gates pass.

Exact public Limits examples are the 13 strict records in
`content/visualizations/limits-continuity/visual-specs.v1.json`; they pass the
schema, inventory, and real Cortex focused tests. Five accepted non-public
cross-subject schema/resolver fixtures live in
`content/visualizations/fixtures/cross-domain.visual-specs.v1.json`; their tests
prove they are not registered as public routes, search, or sitemap content.
