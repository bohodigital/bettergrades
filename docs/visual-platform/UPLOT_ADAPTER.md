# uPlot adapter

## Boundary and selection

uPlot is a browser-lazy adapter for dense, already-computed numerical series. It
receives numeric arrays, never raw LaTeX, symbolic expressions, MathJSON, or
author source. Dependency `uplot` 1.6.32 is exactly pinned in
`package.json`/`pnpm-lock.yaml`, and the registry-owned module path is
`lib/visualization/renderers/uplot-adapter/`. Commit `33850e4` accepts the lazy
boundary and makes its dynamic import the sole vendor-package occurrence.
Built-chunk measurement, plot configuration/browser behavior, and release
evidence remain pending.

Use it for multiple series with a shared x-axis, scientific/experimental data,
solver outputs, convergence/error curves, spectra, kinetics, synchronized
traces, cursor readout, or justified zoom. Use Static SVG for small fixed plots,
Interactive 2D for symbolic/simple coordinate manipulation, and JSXGraph for
geometry. Do not use uPlot for tangent/secant lines, open/closed calculus points,
number lines, free-body/circuit diagrams, implicit curves, or expression parsing.

## Required mappings

Numeric x/y arrays, multiple named series, shared x-axis, legend, units, cursor
readout, data markers, appropriate pan/zoom, practical error bands, responsive
resize, accessible summary, and an accessible data table or equivalent where
useful. Inputs and sample counts are bounded; preprocessing/solver work is
outside uPlot and abortable if performed in a Worker.

The implemented request guard requires 256–20,000 strictly increasing finite x
values, 1–8 aligned finite series, at most 60,000 total numeric values, a
1–4,000-character data summary, resolver selection for `data-series` plus
`dense-series`, and a retained described Static SVG. Symbolic-expression fields
fail before the dynamic import.

## Loading and lifecycle

The adapter is a separate dynamic chunk loaded only for requested data-series
scenes. Automatic near-viewport load is acceptable when dataset and library cost
are justified; use explicit activation for larger data. Static SVG/summary is
present first and remains on failure. Cleanup destroys the plot, observers,
resize/listener hooks, timers, and detached DOM.

## Accessibility, print, and budgets

Series names, units, summary, key values, keyboard behavior where exposed, and
data table/equivalent remain available without Canvas. Print uses the spec's
static mapping, not a screenshot of the interactive plot. Lazy chunk size,
dataset thresholds, ordinary scene target <=25 KB gzip, and larger-data
justifications are implementation evidence still pending.

## Testing and replacement

Maintain a non-public physics/scientific time-series fixture outside public
routes/search/sitemap. Test isolation, numeric-only validation, series/units,
cursor, resize, cleanup, fallback, accessible summary/table, and no source leak.
A replacement adapter consumes the same compiled numeric-series contract;
content does not change.

`tests/bvlp-adapters-boundary.test.mjs` verifies numeric-only validation, every
bound above, fallback ownership, renderer selection, isolation, and the explicit
default export unwrap. These tests establish the adapter boundary, not completed
cursor/resize/plot browser behavior.
