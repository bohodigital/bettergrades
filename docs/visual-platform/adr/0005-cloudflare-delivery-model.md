# ADR 0005: Preserve existing Cloudflare delivery model

- Status: accepted by owner contract

## Decision

Keep the current BetterGrades Pages/vinext/Workers architecture. Deliver hashed
SVG/assets/chunks through existing static paths; route output includes only the
needed public scenes. Add no persistent bindings, DNS, project, or separate
Worker. A visual API requires later evidence/review and strict known-ID bounds.

## Consequences

BVLP minimizes Worker invocations and operational surface while using current
secret-safe deployment and rollback lanes. Generated configuration must be
understood at its source rather than manually patched. Exact preview/source and
production authorization remain release gates.

## Rejected alternatives

New KV/R2/D1/DO services, sitewide visual APIs, CDN-loaded renderers, new DNS,
and a visualization-specific Worker architecture.
