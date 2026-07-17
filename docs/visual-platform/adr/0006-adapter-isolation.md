# ADR 0006: Specialist renderer adapter isolation

- Status: accepted by owner contract

## Context

JSXGraph and uPlot solve valuable specialist problems but are inappropriate as
global authoring/runtime dependencies. Vendor APIs in content would defeat
renderer neutrality and make replacement costly.

## Decision

Vendor translation lives solely inside stable adapters consuming
`CompiledScene`. JSXGraph and uPlot are separate dynamic imports selected by
explicit capabilities, receive only requested public-safe scenes, retain Static
SVG, implement cleanup/accessibility, and are absent from global/nonvisual/static
chunks. Lesson/spec/manifest vendor APIs fail policy checks.

## Consequences

Libraries can be upgraded/replaced without content migration and cost is paid
only where needed. Adapters require mapping/rejection tests, fallback parity,
bundle budgets, non-public fixtures, and documented removal paths.

## Rejected alternatives

Global imports, direct content imports, adapter-specific VisualSpec options,
loading a specialist library on every visual route, and silent feature dropping.
