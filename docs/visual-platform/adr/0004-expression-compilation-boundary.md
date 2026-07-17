# ADR 0004: Compute Engine is build/server only

- Status: accepted by owner contract

## Context

Authors need approved LaTeX, but a symbolic engine or arbitrary parser in client
assets increases bundle, security, and runtime uncertainty.

## Decision

CortexJS Compute Engine parses and normalizes at build/server time. BVLP lowers
MathJSON into a compact allowlisted bounded numerical AST or precomputed arrays.
Browser renderers consume only compiled forms. Asset scans fail if Compute Engine
enters BVLP/public client chunks.

## Consequences

Client evaluation is small, deterministic, and auditable; unsupported syntax
fails early with source context. Compiler/version upgrades need regression
fixtures. Runtime user-supplied LaTeX compilation and a second symbolic engine
are prohibited.

## Rejected alternatives

Browser-side Compute Engine, `eval`/generated JavaScript, arbitrary function
plugins, and preserving raw LaTeX for each renderer to interpret.
