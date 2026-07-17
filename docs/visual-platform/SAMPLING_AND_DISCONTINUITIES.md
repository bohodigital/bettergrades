# Sampling and discontinuities

Adaptive sampling must preserve mathematical topology, not merely draw a smooth
path. Every sampler is bounded and deterministic for a given compiled scene.

## Required cases

Smooth functions, holes, non-finite values, explicit domain and piecewise
boundaries, vertical asymptotes, large adjacent jumps, rapid oscillation,
parametric loops, polar discontinuities, viewport clipping, and maximum-sample/
recursion behavior all need focused fixtures.

## Segmentation rules

- Split paths at explicit domains, piecewise boundaries, non-finite samples,
  asymptotes, and detected discontinuity intervals.
- Never connect the final finite point on one side of an asymptote to the first
  finite point on the other side.
- Represent holes/open endpoints with semantic open-point layers, not gaps whose
  meaning is inferred only from pixels.
- Render actual function values separately with closed-point layers.
- Treat jump thresholds as a signal to subdivide/segment, not proof that a
  vertical line is meaningful.
- Clip paths to the viewport only after segmentation so clipping cannot create a
  false bridge.
- Stop at hard depth/sample/operation limits with a clear visual/layer diagnostic.

Rapid oscillation may require an explicit author domain/tolerance or a static
summary. Never hide undersampling behind a smooth-looking curve. Parametric and
polar samplers use parameter-domain continuity; Cartesian x-order assumptions do
not apply to loops.

## Validation and review

Tests cover all required cases, deterministic output, maximum bounds, and a
specific assertion that no segment crosses a declared vertical asymptote. Visual
QA must still compare open/closed markers, one-sided behavior, clipping, and
mobile output.

The implemented sampler in `lib/visualization/sampling/index.ts` defaults to 16
initial intervals, normalized chord tolerance `0.0025`, normalized
discontinuity threshold `0.35`, adaptive depth 12, 2,048 samples, and minimum
parameter step equal to the larger of machine epsilon or `span * 1e-10`. Hard
caps are 256 initial intervals, tolerance range `1e-7`–`0.25`, discontinuity
threshold range `0.05`–`4`, depth 24, and 20,000 samples. Explicit break gaps
use the larger of twice the minimum step or `span * 1e-8`.

`tests/bvlp-core-sampling.test.mjs` covers smooth output, holes, jumps, vertical
asymptotes, rapid oscillation, parametric/polar behavior, viewport clipping,
sample ceilings, and cancellation. Browser-visible delivery for all current
Limits scenes is verified in [QA_REPORT.md](QA_REPORT.md). Final production
network/performance measurements remain pending before release parity closes.
