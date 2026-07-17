# BVLP dependencies

Dependencies use pnpm and the existing lockfile; no external runtime CDN. Browser
impact must be measured from emitted assets, not estimated from package names.

## Verified package decisions

| Package/version | License/source | Purpose and runtime | Imports/browser impact | Replacement/removal and limits |
| --- | --- | --- | --- | --- |
| `zod` 4.4.3 | MIT; [official package](https://www.npmjs.com/package/zod) | canonical strict schemas and inferred types; existing browser/build-core dependency | named schema API; included in existing shared build output rather than a separately attributable BVLP chunk | migrate schemas/types together, remove imports/package only after replacement; avoid duplicate hand-written validation |
| `@cortex-js/compute-engine` 0.75.0 | MIT; [official package](https://www.npmjs.com/package/@cortex-js/compute-engine) | LaTeX/MathJSON compilation; BVLP build/server only | no browser import permitted; client scan required | lock resolves 0.75.0 while npm stable observed at 0.81.0; pin exact behavior until regression/security review, then upgrade deliberately |
| `d3-scale` 4.0.2 | ISC; [official package](https://www.npmjs.com/package/d3-scale) | narrow deterministic scale primitives; build/server plus justified small core use | named ESM imports; included in the 24,829-byte gzip Interactive 2D route chunk and build-side tools, not emitted as a standalone chunk | replace scale helpers behind renderer; never install/import full D3 |
| `d3-shape` 3.2.0 | ISC; [official package](https://www.npmjs.com/package/d3-shape) | narrow deterministic path/shape primitives; build/server plus justified small core use | named ESM imports; included in build/static-renderer tooling with no separately named public chunk | replace path helpers behind renderer; never expose D3 as authoring API |
| `@types/d3-scale` 4.0.9 | MIT; [official package](https://www.npmjs.com/package/@types/d3-scale) | TypeScript declarations; dev-only | zero runtime impact | remove with `d3-scale` or when first-party types supersede |
| `@types/d3-shape` 3.1.8 | MIT; [official package](https://www.npmjs.com/package/@types/d3-shape) | TypeScript declarations; dev-only | zero runtime impact | remove with `d3-shape` or when first-party types supersede |
| `jsxgraph` 1.12.2 | MIT OR LGPL-3.0-or-later; [official package](https://www.npmjs.com/package/jsxgraph) | advanced-geometry adapter; browser-lazy, explicit activation preferred; first-party types | guarded adapter boundary only; no JSXGraph vendor chunk is emitted in the accepted Limits build | unusually large 75,027,436-byte unpacked package and self-dependency require isolation/audit; replace solely through adapter |
| `uplot` 1.6.32 | MIT; [official package](https://www.npmjs.com/package/uplot) | dense numeric-series adapter; browser-lazy; first-party types, zero runtime deps | guarded adapter boundary only; no uPlot vendor chunk is emitted in the accepted Limits build | replace through numeric-series adapter; not a symbolic renderer |

Zod and Compute Engine were present in the integration base. The exact D3,
declaration, JSXGraph, and uPlot versions above are now resolved with integrity
hashes in `pnpm-lock.yaml` and installed in the isolated Pi worktree with pnpm
10.30.0. JSXGraph resolves once (the package's unusual self-dependency does not
produce a duplicate lockfile package). The accepted build emits no Cortex,
JSXGraph, or uPlot public client chunk; its complete candidate totals and leak
scan are recorded in [Bundle and hydration](BUNDLE_AND_HYDRATION.md). No
overlapping plotting suite, second symbolic engine, runtime CDN, or 3D library
is authorized.

The final dependency gate must record exact lockfile resolution, integrity,
license file, official repository, TypeScript/runtime compatibility, equivalent-
dependency check, imported modules, raw/gzip delta by chunk, known limitations,
and tested removal command for each installed package.
