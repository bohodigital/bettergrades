# Renderer selection policy

The capability resolver, not an author or route name, makes the final choice.
It selects the least expensive installed renderer that satisfies every required
capability. A preferred renderer is only a hint and cannot override support,
fallback, accessibility, print, activation, or budget rules.

## Decision tree

```text
Does the complete core meaning require interaction?
  no  -> Static SVG
  yes -> Can BetterGrades Interactive 2D satisfy every capability?
           yes -> BetterGrades Interactive 2D
           no  -> Advanced geometry, constraints, implicit curves, loci,
                  or advanced ODE geometry?
                    yes -> JSXGraph
                  Dense precomputed numeric series?
                    yes -> uPlot
                  Unsupported 3D or any unsupported capability?
                    yes -> fail validation/build with actionable context
```

The resolver must not infer capabilities from lesson prose or route names and
must not choose a heavier renderer merely because it supports a simple feature.

## Comparison matrix

| Renderer | Use when | Do not use when | Activation | Bundle/fallback |
| --- | --- | --- | --- | --- |
| Static SVG | complete core meaning is static; ordinary functions, diagrams, small/medium data | live manipulation is required to understand the lesson | build/static | zero visualization JS; mandatory fallback |
| BetterGrades Interactive 2D | ordinary 2D/vector/elementary geometry with simple built-in controls | complex constraints, implicit curves, dense data, 3D | automatic progressive enhancement allowed | route-only core, target <=30 KB gzip; SVG first |
| JSXGraph | advanced constrained geometry, loci, implicit curves, advanced ODE geometry | ordinary plots, one draggable point, dense series, decorative interaction | lazy; usually explicit action | isolated lazy chunk; SVG first |
| uPlot | dense, already-computed numeric arrays, shared x-axis, cursor/zoom | raw symbolic functions, geometry, tangent/secant, number lines | lazy near viewport or explicit for large data | isolated lazy chunk; static summary/SVG first |
| Future adapter | capability not covered by v1 after approved extension | production 3D in v1 | undefined until approved | v1 fails; no 3D library installed |

## Static SVG

Use it by default for ordinary and piecewise functions, holes, jumps,
asymptotes, number lines, intervals, sign charts, comparisons, fixed tangent or
secant lines, conics, fixed vector/matrix/geometry diagrams, free-body/circuit/
reaction/energy diagrams, small data plots, and print-first figures. Zoom or
dragging that is merely convenient does not justify interaction.

Do not use it alone when required understanding depends on manipulating a
parameter, constrained object, continuous change, linked views, dense-series
cursor/zoom, or a construction impractical to author statically.

Accessibility and print semantics are native responsibilities. Replacement is
possible through the adapter contract, but every replacement must preserve
determinism, no-JS behavior, semantic output, snapshots, and budgets.

## BetterGrades Interactive 2D

Use for bounded sliders/parameter/step/toggle controls, ordinary compiled 2D
layers, epsilon-delta bands, secant/squeeze explorations, coordinate readout,
and bounded pan/zoom/reset. It is preferred over JSXGraph when its implemented
capabilities cover the whole scene and no mature geometry solver is needed.
Draggable points, play/pause animation, and linked-cursor UI remain schema/
registry capabilities awaiting accepted runtime implementation.

Do not extend it ad hoc for complex constraints, implicit curves, loci,
advanced ODE geometry, dense sampled data, or 3D. It consumes only
`CompiledScene`, retains SVG on failure, announces values and coordinates,
supports keyboard/touch/reset/reduced motion, cleans up all runtime resources,
and hydrates only the requested scene.

## JSXGraph

Use only for advanced constrained draggable constructions, implicit curves,
dynamic loci, rich Euclidean dependencies, related-rates geometry, interactive
conics, advanced direction fields/ODE families, phase portraits, or advanced
vector constructions where reimplementation would add mathematical risk.

Do not use for ordinary static functions/piecewise/asymptote figures, a single
draggable point, a basic secant graph supported by core, dense data, or every
visual on a route because one needs it. It must be dynamically imported inside
the adapter, usually after **Explore interactively**, and must cleanly dispose
boards, listeners, observers, and linked objects.

## uPlot

Use for dense precomputed numeric arrays such as experimental series, solver
outputs, convergence/error curves, spectra, kinetics, or synchronized physical
traces. Cursor readout, zoom, and shared axes must serve instruction.

Do not send raw LaTeX or symbolic functions to uPlot and do not use it for
geometry, open/closed points, tangent/secant lines, diagrams, or small plots SVG
handles better. It is lazy, responsive, disposable, has units and series names,
and includes an accessible summary/table where useful.

## Concrete decisions

1. Algebra quadratic with roots and vertex -> Static SVG.
2. Algebra rational sign chart -> Static SVG.
3. Algebra `a/h/k` transformation sliders -> Interactive 2D.
4. Precalculus static unit-circle labels -> Static SVG.
5. Precalculus linked unit circle and sinusoid with simple angle control -> Interactive 2D.
6. Precalculus advanced constrained conic construction -> JSXGraph.
7. Limits removable discontinuity -> Static SVG.
8. Limits one-sided jump -> Static SVG.
9. Limits vertical-asymptote comparison -> Static SVG.
10. Limits squeeze bounds with its existing parameter control -> Interactive 2D with Static SVG fallback.
11. Limits epsilon-delta band adjustment -> Interactive 2D.
12. Existing Limits `why-limits-matter` secant-to-tangent visual -> Interactive 2D with Static SVG fallback; this does not authorize Unit 2A or new derivative curriculum.
13. Linear algebra fixed vector projection -> Static SVG.
14. Linear algebra bounded matrix sliders -> Interactive 2D.
15. Linear algebra dependency-heavy vector construction -> JSXGraph.
16. ODE static direction field -> Static SVG.
17. ODE field with draggable initial condition and solution family -> JSXGraph.
18. Physics static free-body diagram -> Static SVG.
19. Physics precomputed position/velocity/acceleration traces -> uPlot.
20. Physics small fixed error-band plot -> Static SVG.
21. Chemistry reaction-coordinate diagram -> Static SVG.
22. Chemistry dense absorbance spectrum with cursor -> uPlot.
23. Chemistry energy-level diagram -> Static SVG.
24. Molecular 3D scene -> fail in v1; no renderer installed.

The registry and resolver are implemented in
`lib/visualization/capabilities/index.ts`; 10/10 phase 1 focused tests cover
capability inference, deterministic least-cost selection, advisory preference,
and fail-closed unsupported cases. Static rendering and guarded lazy-adapter
boundaries are now committed with focused tests. The accepted Limits build
emits no JSXGraph/uPlot vendor chunk; vendor-browser rendering remains outside
this infrastructure-only release because no accepted Limits scene selects those
specialists.
