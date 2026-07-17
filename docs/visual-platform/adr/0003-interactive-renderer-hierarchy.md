# ADR 0003: Deterministic least-cost renderer hierarchy

- Status: accepted by owner contract

## Decision

The resolver uses explicit capabilities and the canonical registry. It selects
Static SVG when interaction is unnecessary, BetterGrades Interactive 2D when it
satisfies all interaction, JSXGraph for advanced geometry/constraints/implicit/
ODE capability, uPlot for dense precomputed numeric series, and fails unsupported
3D/capabilities. Preferred renderer hints cannot bypass capability or cost rules.

## Consequences

Simple routes avoid heavyweight libraries and authors do not choose vendors.
Registry data, anti-use guidance, tests, and generated/validated docs must remain
synchronized. New capabilities require explicit adapter and budget review.

## Rejected alternatives

Route-name/prose heuristics, author-selected vendor IDs, one general-purpose
library, and choosing the heaviest compatible renderer.
