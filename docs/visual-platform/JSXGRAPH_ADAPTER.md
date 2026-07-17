# JSXGraph adapter

## Boundary and selection

JSXGraph is a browser-lazy adapter for advanced mathematical geometry and
constrained interactive constructions. Lesson content, VisualSpec, unit
manifests, and public authoring files must contain no JSXGraph calls or options;
all translation belongs inside the adapter. Dependency `jsxgraph` 1.12.2 is
exactly pinned in `package.json`/`pnpm-lock.yaml`, and the registry-owned module
path is `lib/visualization/renderers/jsxgraph-adapter/`. Commit `33850e4`
accepts the lazy boundary: it validates resolver selection, an advanced
capability, explicit learner activation, and retained described Static SVG
before the sole `import("jsxgraph")` call. Built-chunk measurement, vendor board
mapping, browser behavior, and release evidence remain pending.

Use it for dependency-heavy draggable geometry, implicit curves, loci, Euclidean
constructions, advanced conics/vectors, related-rates geometry, or advanced
direction-field/ODE solution-family fixtures that the first-party core cannot
handle reliably. Do not use it for ordinary/static functions, simple piecewise
graphs, one draggable point, basic secant-to-tangent interaction, dense numeric
series, or every visual on a route because one needs JSXGraph.

## Required mappings

Function, point/draggable point, segment, line, circle, polygon, slider, tangent,
secant, linked object, reliable basic implicit curve, reliable direction-field
or ODE fixture, KaTeX-compatible label, and keyboard/accessibility wrapper
behavior. Unmapped capabilities fail; adapter options are never silently dropped.

## Loading and lifecycle

The adapter is dynamically imported only after resolver selection, preferably
after an explicit **Explore interactively** action. Static SVG stays visible
before and during load and on failure. Only the requested scene is passed. No
global bundle or ordinary static Limits route may include JSXGraph.

Cleanup destroys the board/construction graph and removes listeners, observers,
resize hooks, timers, and generated nodes. Compatibility/version errors fall
back without changing the static educational meaning.

## Accessibility, print, and performance

The wrapper supplies caption/description association, keyboard-operable controls,
focus, value/coordinate announcements, reduced-motion behavior, and a static
semantic fallback. JSXGraph output does not define print; the VisualSpec print
mapping does. Lazy gzip and payload budgets must be measured and recorded.

## Testing and replacement

Maintain at least one non-public fixture; it must not enter routes, search, or
sitemap. Test dynamic isolation, mapping support and rejection, keyboard/failure/
resize/cleanup behavior, fallback persistence, and no vendor API in content.
Replacement requires a new isolated adapter meeting identical capabilities and
parity, followed by registry change and removal procedure; no content rewrite.

`tests/bvlp-adapters-boundary.test.mjs` verifies that JSXGraph remains confined
to its lazy import expression, rejects ordinary scenes or missing activation/
fallback, and exposes no top-level vendor import. The cross-domain ODE fixture
selects this adapter without entering public routes. These tests establish the
adapter boundary, not a completed JSXGraph board implementation.

Known v1 limitation: production Limits visuals should remain on Static SVG or
Interactive 2D unless actual capabilities prove JSXGraph necessary.
