# CompiledScene contract

`CompiledScene` is the validated, normalized, renderer-facing representation of
a `VisualSpec`. It is the only scene form consumed by renderers. It contains no
raw lesson LaTeX, author-only notes, assessment answers, executable source, or
renderer-vendor API calls. The internal scene does retain route and source-file
provenance for diagnostics; the public projection removes private path and
provenance data from browser payloads. All current Limits routes retain that
allowlist.

## Compiler inputs and outputs

Inputs are a strictly validated `VisualSpec`, its source/route provenance for
diagnostics and internal scene identity, and the canonical renderer registry.
Compilation performs
expression normalization, safe-AST lowering, reference resolution, capability
analysis, scene-variable allowlist validation, renderer resolution, default
performance normalization, source fingerprinting, and hydration classification.
Sampling and static rendering are separate consumers of the compiled scene.

`CompiledSceneSchema` currently includes:

- `compiledSceneVersion`, `sourceSpecVersion`, stable `id`, and `kind`;
- normalized coordinate space, viewport, axes/no-axis decision, and units;
- stable ordered `panels` and `layers`, containing only bounded numerical AST or
  precomputed arrays rather than authored expression LaTeX;
- normalized `controls`, `accessibility`, `print`, and `performance` data;
- `requiredCapabilities`, `selectedRenderer`, and the required `static-svg`
  fallback record;
- semantic `title`, `caption`, `learningPurpose`, and `longDescription`;
- delivery hydration mode (`none`, `near-viewport`, or
  `explicit-user-action`) with `publicFieldsOnly: true`;
- route/source visual provenance, `bvlp-compiler-v1`, and a deterministic
  `bvlp1-` source fingerprint.

Generated SVG asset identity is stored beside each scene in the committed
`compiled-scenes.v1.json` manifest rather than inside `CompiledSceneSchema`.
The route projection in `lib/visualization/limits-public.server.mjs` sends only
the visuals requested by the current route. All 13 Limits visuals use this
projection at `8a32870`; exactly four include bounded interactive payloads.

## Invariants

Compilation fails rather than discarding unsupported content. IDs are unique,
references resolve, cycles are approved or rejected, numeric values are finite
where required, domains are explicit, and print/accessibility fallbacks exist.
A preferred renderer cannot override capability support or least-cost policy.

The compiled scene already omits authored LaTeX. The public projection
allowlists only scenes requested by the route and removes internal source
provenance. Integrated tests verify that it excludes unsupported raw input,
debug internals, entire-site registries, unrelated scenes, source textbook
material, and answer data.

## Renderer adapter interface

Every adapter must receive a readonly scene plus bounded lifecycle context.
Static SVG generation is exported from
`lib/visualization/renderers/static-svg/index.ts`; the accepted Interactive 2D
component is exported from
`lib/visualization/renderers/bg-interactive-2d/index.tsx` and accepts
`{ scene, className?, onReady?, onError? }`. It verifies scene versions,
renderer selection, controls, and fallback declaration before rendering and
never recompiles expressions. JSXGraph/uPlot now have accepted guarded lazy-load
request boundaries, while vendor-specific rendering interfaces and a universal
adapter interface remain pending.

## Determinism and compatibility

Identical validated inputs, compiler version, and configuration produce the same
normalized scene and fingerprint; this is covered by the phase 1 focused tests.
Byte-stable static SVG and 13 content-addressed assets are covered by phase 3
tests and the compiler `--check` gate. Schema/compiler upgrades require fixtures,
migration tests, snapshot review, rollback compatibility, and a changelog entry.
