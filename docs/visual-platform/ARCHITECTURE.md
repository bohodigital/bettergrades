# BVLP architecture

## Scope boundary

BVLP adds visual infrastructure to the existing BetterGrades application. It
preserves the Pages/vinext/Workers delivery model and the current content,
article, assessment, search, routing, and site-shell architecture. Version 1
migrates every existing public Limits and Continuity visual and no other public
curriculum. Unit 2A and public derivative material are forbidden.

## End-to-end data flow

```text
Content source
  -> VisualSpec v1 (renderer-neutral, no arbitrary code)
  -> strict Zod validation
  -> build/server-only LaTeX -> Compute Engine -> MathJSON normalization
  -> allowlisted bounded numerical AST
  -> capability analysis and reference validation
  -> CompiledScene
       -> deterministic SVG asset
       -> caption, title, long description, semantic relationships
       -> explicit print representation
       -> optional bounded interaction payload
  -> deterministic least-cost renderer resolution
       -> static-svg
       -> bg-interactive-2d
       -> lazy jsxgraph adapter
       -> lazy uplot adapter
       -> explicit unsupported-capability failure
```

Renderers consume `CompiledScene`; they never parse raw lesson LaTeX. Lesson
content declares requirements, not vendor APIs or route-name hints.

## Trust and runtime boundaries

| Boundary | Allowed | Forbidden |
| --- | --- | --- |
| authoring | versioned data, approved LaTeX, explicit capabilities | JavaScript, renderer APIs, network references |
| build/server | Zod, Compute Engine, normalization, safe-AST compilation, deterministic sampling | persisting unvalidated source to public payloads |
| static asset | script-free SVG, hashed assets, safe text, no external resources | inline executable script, CDN dependency, source LaTeX |
| browser core | compact validated scene data and first-party evaluator | Compute Engine, arbitrary parsing/eval, whole-site registry |
| browser lazy | JSXGraph/uPlot adapter and only the requested scene | global imports, unrelated scenes, author/source notes |
| print | generated mapping or a verified retained asset | missing or implicit print representation |

Compute Engine and MathJSON normalization are build/server only. The browser
evaluator accepts only the compiled allowlisted AST. Static visuals require no
visualization JavaScript.

## Renderer lifecycle

1. Render server HTML with static SVG, caption, and long description.
2. Reserve stable layout dimensions; do not replace the educational fallback
   with a spinner.
3. Resolve the least expensive compatible renderer from the canonical registry.
4. For Interactive 2D, enhance near the viewport. For JSXGraph and larger uPlot
   scenes, prefer an explicit **Explore interactively** action.
5. Hydrate only the requested scene and controls.
6. On teardown, abort work and remove listeners, observers, animation frames,
   canvases, and adapter objects.
7. On load/runtime failure, retain the unchanged static figure and explain that
   interaction is unavailable.

## Static and Cloudflare boundaries

Generated SVG, renderer chunks, CSS, and safe public scene payloads use the
existing hashed static-asset path. Ordinary assets must not invoke a custom
visual API. Route rendering exposes only visuals needed by that page. No KV,
R2, D1, Durable Objects, Queues, Browser Rendering, Workers AI, Vectorize,
Hyperdrive, new DNS, or separate Worker architecture is introduced.

If page payloads later prove insufficient, a separately reviewed bounded API
may expose known public IDs only. It must return a real 404 for unknown IDs and
must never compile user expressions, interpret file paths, return a sitewide
registry, or expose answers/provenance notes.

## Accessibility and print relationships

The semantic title, visible caption, purpose, long description, non-color-only
distinctions, static fallback, print mapping, and failure behavior are compiled
from the same validated spec. Canvas may optimize dense drawing but can never be
the sole semantic representation. Each public visual must have a generated
print mapping or an explicitly retained verified print asset.

## Security and failure behavior

All validation is fail-closed. Unknown fields, kinds, layers, operators,
capabilities, controls, references, or unsupported 3D fail with route, source,
visual, layer, and correction context when available. Bounds cover input length,
AST depth/nodes, evaluation operations, samples, recursion, controls, animation,
and worker cancellation. See [Threat model](THREAT_MODEL.md) and [Expression
pipeline](EXPRESSION_PIPELINE.md).

## Performance model

Static-first delivery is the primary optimization. Nonvisual routes receive no
renderer implementation, registry, scene data, or Compute Engine. Static visual
routes receive no interactive runtime. Lazy adapters never enter global chunks.
Budgets and evidence procedures are in [Performance budgets](PERFORMANCE_BUDGETS.md).

## Extension model

A new renderer implements the adapter interface, declares exact supported and
unsupported capabilities, supplies accessibility/print/fallback behavior,
registers one dynamic import, adds anti-use guidance, tests, budgets, and docs,
and cannot add vendor calls to content. Unsupported 3D remains a reserved,
explicitly failing boundary in v1.

## Repository paths and implementation evidence

The committed v1 schema, compiler, capability resolver, safe AST, server-only
MathJSON boundary, sampler, and Interactive 2D runtime live at the exact paths
listed in [README](README.md). Their commits and focused test evidence are in
[phase-ledger.md](phase-ledger.md). Static asset generation, guarded lazy adapter
boundaries, and bounded per-route serialization for all 13 current Limits
visuals are committed. Exactly four scenes progressively enhance with the
first-party Interactive 2D renderer; no current Limits route activates a heavy
vendor adapter. Final preview/production delivery evidence remains pending and
must not be inferred from this architecture contract.

## Architecture decisions

- [ADR 0001: renderer-neutral VisualSpec](adr/0001-renderer-neutral-visualspec.md)
- [ADR 0002: Static SVG default](adr/0002-static-svg-default.md)
- [ADR 0003: interactive renderer hierarchy](adr/0003-interactive-renderer-hierarchy.md)
- [ADR 0004: expression compilation boundary](adr/0004-expression-compilation-boundary.md)
- [ADR 0005: Cloudflare delivery model](adr/0005-cloudflare-delivery-model.md)
- [ADR 0006: adapter isolation](adr/0006-adapter-isolation.md)

`tests/bvlp-documentation.test.mjs` enforces that these references exist and
that the renderer/schema/dependency/migration vocabulary remains synchronized.
