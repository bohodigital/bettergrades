# Troubleshooting

| Symptom | Investigate and correct |
| --- | --- |
| raw LaTeX visible | source-to-rich-text boundary, compiler diagnostic, label KaTeX path, asset/source leak scan |
| missing graph/fallback | spec validation, route mapping, emitted asset manifest/path, static renderer error; never hide with a spinner |
| wrong renderer | declared capabilities, registry support/cost/activation, resolver trace; never key on route prose/name |
| curve crosses asymptote | explicit domain/asymptote, non-finite segmentation, jump threshold, clipping order |
| labels clipped/mobile overflow | viewBox, reserved margins, responsive layout, long labels/zoom/text scaling |
| Canvas blurry | CSS/device-pixel dimensions and resize lifecycle; keep semantic fallback |
| drag broken | point bounds, transforms, pointer capture, keyboard parity, overlay hit area, cleanup race |
| JSXGraph fails to load | registry dynamic import, chunk/network/CSP, version mapping; retain SVG and show optional-interaction failure |
| uPlot fails to resize | container observation, hidden-to-visible transition, cleanup, data dimensions |
| static fallback missing | compiler output/SSR/asset mapping; release-blocking contract violation |
| Worker computation fails | bounds, cancellation, transferable data, main-thread fallback; static output must remain |
| Compute Engine in client | import graph/server boundary/dynamic dependency; fail bundle scan and remove client path |
| budget exceeded | compare baseline/chunk graph/gzip, narrow imports, duplicated scenes, activation; stop for review if unresolved |
| unknown capability | correct author requirement or install an approved documented adapter; never discard |
| print figure missing | print mapping validation, asset/bridge, Tectonic log; release blocker |
| missing accessibility | schema/author/compiler/association; do not ship a renderer-only patch |
| Cloudflare asset 404 | emitted filename/manifest/generated routing/MIME/cache and immutable deployment source |
| wrong cache | actual response headers and existing rule; avoid unapproved DNS/product changes |
| unknown visual returns 200 | bounded resolver/API 404 behavior and catch-all routing |
| visual data duplicated | route serializer and hydration payload; exclude unit/site registries |
| old Limits renderer active | migration matrix, route output, imports/chunks and deprecation/removal gate |

Always reproduce at the exact commit/deployment, capture console/network and
visual IDs, and distinguish source/build/asset/routing/runtime failures. Never
print secrets or patch generated Cloudflare configuration without understanding
its source generator.
