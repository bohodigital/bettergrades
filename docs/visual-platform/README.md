# BetterGrades Visual Learning Platform

## Purpose and scope

The BetterGrades Visual Learning Platform (BVLP) is the renderer-neutral
infrastructure for mathematical, scientific, geometric, data-driven, and
diagrammatic instructional visuals. Authors describe instructional meaning in a
versioned `VisualSpec`; build tooling validates and compiles it into a
`CompiledScene`; a deterministic resolver chooses the least expensive installed
renderer that satisfies every declared capability.

Version 1 is infrastructure-only. Its sole public curriculum migration is the
existing Limits and Continuity unit. It explicitly does **not** implement Unit
2A, derivative curriculum, new derivative routes or assessments, or a broad
replacement for the working content, article, assessment, search, or site-shell
systems. Private secant-to-tangent fixtures may prove platform capability, but
must never enter public routes, search, or sitemaps.

## Architecture at a glance

```text
authored lesson -> VisualSpec -> Zod validation -> safe expression compiler
                -> capability analysis -> CompiledScene
                  |-> deterministic static SVG + accessibility + print mapping
                  `-> optional compact interaction payload
                       -> least-cost compatible renderer adapter
```

Static SVG is the default and mandatory public fallback. BetterGrades
Interactive 2D progressively enhances simple 2D interaction. JSXGraph and
uPlot are isolated lazy adapters for advanced constructions and dense,
precomputed numeric series. Production 3D is unsupported in v1 and fails
clearly instead of silently degrading.

## Repository map and status

This table describes the integrated implementation at
`dee8fd962dbbeeb1f5ae7dedc721ebc738b74cda`. Preview and production status are
tracked separately because a passing local candidate is not a release.

| Concern | Contractual location | Status |
| --- | --- | --- |
| Zod schemas and inferred types | `lib/visualization/schema/` | implemented in `fc3de72` |
| allowlisted numerical AST, evaluator, and server-only MathJSON boundary | `lib/visualization/ast/` | implemented in `40c542c`; real Cortex boundary verified in `5cc2257` |
| deterministic bounded sampler | `lib/visualization/sampling/` | implemented in `40c542c`, cleanup `bcdee90` |
| `CompiledScene` compiler | `lib/visualization/compiler/` | implemented in `fc3de72`; scene-variable allowlist enforced in `867f1b2` |
| capability registry and least-cost resolver | `lib/visualization/capabilities/` | implemented in `fc3de72` |
| static SVG renderer | `lib/visualization/renderers/static-svg/` | implemented in `b646c86`; deterministic 13-asset compilation in `723b2f3` and cross-platform normalization in `2a801d7` |
| interactive runtime | `lib/visualization/renderers/bg-interactive-2d/` | implemented and focused tests passing in `a4519d9` |
| lazy adapter boundaries | `lib/visualization/renderers/jsxgraph-adapter/`, `lib/visualization/renderers/uplot-adapter/`, `lib/visualization/renderers/future-specialist/` | implemented and isolated in `33850e4`; no heavy vendor adapter is activated by the current Limits migration |
| compiled Limits manifest/assets | `content/visualizations/limits-continuity/compiled-scenes.v1.json`, `public/visuals/v1/` | 13 deterministic content-addressed assets generated and `--check` passing through `2a801d7` |
| Limits source inventory and route delivery | `content/visualizations/limits-continuity/`, `lib/visualization/limits-public.server.mjs`, and `LIMITS_MIGRATION.md` | all 13 current visuals delivered through BVLP in `8a32870`; four progressively enhance with Interactive 2D; the legacy Limits canvas component is removed |
| visual verification | `tools/visualization/verify-visuals.mjs` and `verify:visuals` | passing through `dee8fd9`: production build, 158/158 tests, exactly 13 public visuals, exactly 4 interactive scenes, strict artifact/route/leak checks, and mutation coverage |
| integrated QA | `QA_REPORT.md` | build, typecheck, lint, 158/158 tests, desktop/mobile browser QA, measured bundles/leaks, answer-key/navigation/SEO checks, and a visually inspected 175-page cache-only Tectonic PDF; owner-only Sites preview and production remain pending |

## Author workflow

1. Start with the learning objective and decide whether a visual is necessary.
2. Author a `VisualSpec`; do not call renderer or vendor APIs from content.
3. Supply a caption, purpose, long description, viewport, axes/no-axis choice,
   units where applicable, print mapping, accessibility behavior, and explicit
   required capabilities.
4. Validate and compile the spec; unsupported fields and capabilities must fail.
5. Review the static SVG and print representation first.
6. If interaction is instructionally necessary, test enhancement, keyboard,
   touch, reduced motion, no-JavaScript fallback, cleanup, and failure fallback.
7. Run `pnpm verify:visuals` and the broader gates in [Testing](TESTING.md).
   The gate includes the build, full tests, and strict artifact verifier, but it
   does not replace typecheck, lint, browser/print inspection, preview, or live
   deployment verification.

## Documentation index

- [Architecture](ARCHITECTURE.md)
- [VisualSpec reference](VISUALSPEC_REFERENCE.md)
- [CompiledScene reference](COMPILED_SCENE_REFERENCE.md)
- [Authoring guide](AUTHORING_GUIDE.md)
- [Renderer selection](RENDERER_SELECTION.md)
- [Renderer capabilities](RENDERER_CAPABILITIES.md)
- [Static SVG](STATIC_SVG_RENDERER.md)
- [BetterGrades Interactive 2D](BETTERGRADES_INTERACTIVE_2D.md)
- [JSXGraph adapter](JSXGRAPH_ADAPTER.md)
- [uPlot adapter](UPLOT_ADAPTER.md)
- [Adding a renderer](ADDING_A_RENDERER.md)
- [Future 3D boundary](FUTURE_3D_BOUNDARY.md)
- [Expression pipeline](EXPRESSION_PIPELINE.md)
- [Sampling and discontinuities](SAMPLING_AND_DISCONTINUITIES.md)
- [Accessibility](ACCESSIBILITY.md)
- [No-JS, reduced-motion, and keyboard behavior](NO_JS_REDUCED_MOTION_KEYBOARD.md)
- [Performance budgets](PERFORMANCE_BUDGETS.md)
- [Bundle and hydration policy](BUNDLE_AND_HYDRATION.md)
- [Cloudflare delivery](CLOUDFLARE_DELIVERY.md)
- [Print and export](PRINT_AND_EXPORT.md)
- [Testing](TESTING.md)
- [QA report](QA_REPORT.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Limits migration](LIMITS_MIGRATION.md)
- [Cross-subject fixtures](CROSS_SUBJECT_FIXTURES.md)
- [Dependencies](DEPENDENCIES.md)
- [Provenance](PROVENANCE.md)
- [Threat model](THREAT_MODEL.md)
- [Operations](OPERATIONS.md)
- [Release and rollback](RELEASE_AND_ROLLBACK.md)
- [Changelog](CHANGELOG.md)
- [Integration gate](integration-gate.md)
- [Phase ledger](phase-ledger.md)
- [Architecture decisions](adr/)

Bulk route migration, local desktop/mobile browser QA, bundle/leak measurement,
and representative PDF inspection are complete. Owner-only Sites preview,
deployment IDs, and production browser evidence remain
pending and are not implied by the completed local gates.
