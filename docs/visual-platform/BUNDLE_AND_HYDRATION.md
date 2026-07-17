# Bundle and hydration policy

## Route isolation

- Nonvisual routes ship no BVLP renderer implementation, registry, scene data,
  Compute Engine, JSXGraph, or uPlot.
- Static visual routes ship deterministic SVG and semantics with no required
  visualization JavaScript.
- Interactive routes hydrate only the scenes and controls needed on that route.
- No browser response includes the whole Limits unit or sitewide visual registry.
- Compute Engine and source MathJSON compilation remain build/server only.

## Progressive loading

Interactive 2D may load as a compatible figure approaches the viewport.
JSXGraph and larger uPlot scenes should load after explicit learner activation;
small justified uPlot scenes may load near viewport. Every dynamic import is
owned by the registry/adapter boundary, never by lesson content. Static layout
is reserved and remains visible before/during/after failed enhancement.

## Public payload allowlist

Include stable IDs, normalized public geometry/data, bounded controls, semantic
accessibility data, and integrity/version metadata required by the adapter.
Exclude raw source LaTeX, uncompiled AST forms, author/provenance notes, file
paths, assessment answers, unrelated scenes, private fixtures, and debug data.

The complete Limits projection implements this allowlist for all 13 current
scenes. Static routes send no optional interaction scene; the four interactive
routes receive only their compact public scene. The serializer explicitly
removes private file provenance such as `provenance.sourceFile`. Tests assert
that the client retains the external SVG fallback, owns the isolated Interactive
2D import boundary, never ships the full visual registry, and does not expose
canonical answers, source material, or Cortex in the Pages client output.

## Enforcement

Analyze built chunks and route network responses for forbidden package markers,
unexpected renderer imports, duplicate/all-unit scene data, source textbook
leaks, and answers. The integrated Pages-package/leak tests pass through
`dee8fd9`. The candidate emits 1,117,910 raw/311,680 gzip client-JavaScript
bytes versus 4,883,623 raw/1,247,617 gzip in the canonical-main pre-release
build. The reduction comes primarily from removing two unintended Compute
Engine client chunks. Interactive 2D is its own 87,031 raw/24,829 gzip chunk;
JSXGraph and uPlot emit no public chunk because no current Limits route selects
them. The final client scan also rejects route-source filenames, canonical
answers, internal Pi paths, Cortex, JSXGraph, and uPlot markers. Exact live
route/network observations remain part of preview and production QA.
