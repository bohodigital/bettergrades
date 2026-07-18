# Unit 2A performance and payload report

## Built candidate measurements

| Artifact | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| BetterGradesApp client chunk | 377,026 | 104,417 |
| CalculusUnitPages client chunk | 24,283 | 7,162 |
| BetterGradesVisual client chunk | 3,106 | 1,407 |

The complete advanced Pages package contains 146 files totaling 18,697,940 raw bytes. Unit 2A's 27 static SVG fallbacks total 356,554 bytes; the largest is 18,088 bytes. The visual-fidelity correction therefore remains far below the 50 KB per-asset ceiling and does not change the BetterGradesApp, CalculusUnitPages, or BetterGradesVisual client chunks. The route-scoped cumulative-practice answers increase server payload only; they do not change the client chunks.

## Budget controls

- The existing BetterGradesApp client-chunk hard gate remains 500 KB raw.
- Each static SVG has a 50 KB hard limit.
- Interactive BVLP source stays below its existing 30 KB gzip budget.
- Heavy JSXGraph and uPlot adapters remain lazy, capability-gated imports.
- Canonical page bodies, solutions, and answers remain server-side and route-local rather than entering a global client bundle.

## Pi behavior

Frozen dependency installation reuses the lockfile and the committed package build allowlist. ARM-native `sharp`, `workerd`, `esbuild`, and `unrs-resolver` postinstalls pass. Build and server-render tests are the controlling platform evidence; Windows workerd availability is not treated as production evidence.

The first unconstrained Pi test attempt exhausted practical memory while concurrent Node test files reached the 67-route sweep. A serial rerun then passed the complete Unit 2A sweep but the long-lived general rendered-page process reached Node's 2 GiB heap limit afterward. The final suite fixes concurrency at one and runs the 67-route Unit 2A sweep in a separate process so heap is released between route families. That exact candidate passed 175/175 Pi tests in 130.2 seconds and left 6.9 GiB available with zero swap use.

## Remaining release measurement

Browser-visible network, cache, and production response measurements are recorded in the release report after the owner-only Sites candidate and Cloudflare Pages deployment exist.
