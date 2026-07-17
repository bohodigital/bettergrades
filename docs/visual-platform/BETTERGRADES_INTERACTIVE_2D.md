# BetterGrades Interactive 2D

## Role and public interface

The first-party Interactive 2D renderer progressively enhances simple 2D
`CompiledScene` objects. It is exported from
`lib/visualization/renderers/bg-interactive-2d/index.tsx` as both default and
named `BgInteractive2D`. Its props are `{ scene: CompiledScene, className?,
onReady?(sceneId), onError?(Error) }`. It never reads lesson source, parses
LaTeX, executes arbitrary expressions, or replaces the parent-owned static
semantic figure.

## Capabilities

The accepted first pass supports pointer pan, wheel/button/keyboard zoom,
keyboard reset, coordinate readout, bounded sliders, parameter inputs, discrete
step controls, toggles, resize observation, reduced-motion detection, and live
control/value announcements. Its committed scene summaries cover the four
interactive Limits records `secant-tangent`, `squeeze-bounds`,
`unit-circle-squeeze`, and `epsilon-delta-window`. It evaluates only the
allowlisted compiled AST.

The capability schema reserves draggable points, play/pause animation, linked
views/cursors, and other future controls, but the accepted first-pass component
does not render draggable-point or play-pause controls. Those capabilities must
not be claimed for a delivered scene until their UI, lifecycle, accessibility,
and browser tests exist.

Use it for ordinary Cartesian/vector/elementary geometry with simple built-in
controls. Do not extend it into a constraint solver, implicit-curve engine,
advanced ODE geometry system, dense-data renderer, or 3D engine.

## Internal architecture and lifecycle

Route integration must output stable-size static SVG, caption, and description.
Near the viewport, it must load only the requested compact interaction payload,
then let the component verify compatibility/version and attach semantic controls
without meaningful layout shift. The accepted component uses SVG for ordinary
shapes, labels, and controls; it has no Canvas dependency. All four current
interactive Limits scenes now use the static-first lazy route path. Desktop and
mobile inspection confirms retained fallbacks and no horizontal overflow;
quantitative layout-shift measurement remains part of final network/performance
evidence.

Cleanup removes the ResizeObserver and media-query listener; there is no
animation loop or Worker in the accepted first pass. Any future animation or
asynchronous work must add cancellation. Compatibility/runtime errors render a
visible alert and leave parent fallback ownership unchanged; route failure tests
must still prove the static figure remains usable.

## Accessibility and input

Implemented range/step/toggle controls have names, states, bounded values,
44-pixel minimum targets, native focus, keyboard range behavior, and announced
updates. The plot exposes named zoom/reset controls and a polite coordinate
readout. Touch and keyboard must produce equivalent instructional outcomes in
route QA. Reduced motion is detected without starting animation and never
removes content. Draggable-point requirements remain future acceptance work.

## Performance and loading

The interactive source target is 30 KiB gzip. At `a4519d9`, the five committed
TypeScript/TSX files total 36,801 raw bytes and 9,796 gzip bytes under the same
deterministic aggregation used by the boundary test. The final candidate emits
one 87,031-byte raw/24,829-byte gzip Interactive 2D chunk. The source and emitted
client scans exclude Compute Engine, JSXGraph, uPlot, D3, `eval`, and
`Function`; no heavy adapter chunk is emitted for current Limits routes. Live
request and hydration-timing observations remain part of preview/production QA.

## Tests, troubleshooting, replacement

The focused tests verify the source budget and forbidden-import boundary,
visible failure with parent fallback ownership, deterministic range/step
behavior, mathematical metric groups, scene summaries, bounded
pan/zoom/reset transforms, ResizeObserver cleanup, reduced-motion detection,
and fail-closed compiled-AST evaluation. The integrated 158/158 suite and local
browser QA additionally cover route enhancement, mobile targets/overflow, and
epsilon-delta keyboard behavior. The production chunk passes its boundary;
live payload/network observations remain pending until preview/production QA.

Because content is renderer-neutral, a later adapter may replace this runtime by
matching capabilities, lifecycle, accessibility, fallback, print, and budget
contracts.
