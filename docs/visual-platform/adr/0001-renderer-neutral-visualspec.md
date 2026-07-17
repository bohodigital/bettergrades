# ADR 0001: Renderer-neutral VisualSpec

- Status: accepted by owner contract
- Scope: BVLP v1

## Context

Limits-specific and vendor-specific authoring makes content expensive to migrate
and lets renderer details drift into lessons. BVLP must serve many future
technical subjects without replacing the working content system.

## Decision

Authors create strict versioned `VisualSpec` data describing instructional
objects, relationships, coordinates, units, accessibility, print, and required
capabilities. Zod is canonical; types are inferred. Build tooling produces
`CompiledScene`; only adapters know vendor APIs. Unsupported data fails.

## Consequences

Renderer replacement does not rewrite content, documentation can be validated
against schemas/registry, and public payloads are bounded. Authors must learn the
semantic model, migrations require explicit schema versions, and compiler/tests
become critical infrastructure. This decision does not authorize a new course,
content, article, assessment, search, or site-shell registry.

## Rejected alternatives

Vendor calls in lessons, one permanent renderer, duplicated TypeScript and
validation definitions, and silent unsupported-field removal.
