# Unit 2A performance and payload report

## Built candidate measurements

| Artifact | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| BetterGradesApp client chunk | 377,026 | 104,417 |
| CalculusUnitPages client chunk | 24,283 | 7,162 |
| BetterGradesVisual client chunk | 3,106 | 1,407 |

The complete advanced Pages package contains 146 files totaling 18,697,940 raw bytes. Unit 2A's 27 static SVG fallbacks total 356,554 bytes; the largest is 18,088 bytes. The visual-fidelity correction remained below the 50 KB per-asset ceiling and did not change the three measured client chunks. Route-scoped cumulative-practice answers increase server payload only; they do not enter the client chunks.

## Budget controls

- BetterGradesApp client-chunk hard gate: 500 KB raw.
- Static SVG hard gate: 50 KB each.
- Interactive BVLP source: existing 30 KB gzip gate.
- Heavy JSXGraph and uPlot adapters remain lazy capability-gated imports.
- Canonical page bodies, solutions, and answers remain server-side and route-local.

## Pi behavior

Frozen dependency installation reused the lockfile and committed package build allowlist. The first unconstrained test attempt exhausted practical memory during the 67-route sweep, and a later long-lived general rendered-page process reached Node's 2 GiB heap ceiling. The final suite fixes concurrency at one and runs the Unit 2A route family in a separate process. Exact candidate and exact merged `main` each passed 175/175 in 130.2 seconds; the candidate pass left 6.9 GiB available with zero swap use.

## Production measurements

The immutable deployment, Pages host, apex, and WWW each returned the Unit 2A hub as 51,550-byte HTML. The representative derivative lesson returned 53,932 bytes, the Exam A answer key returned 71,784 bytes, the corrected representative SVG returned 11,814 bytes, `robots.txt` returned 100 bytes, and `sitemap.xml` returned 48,306 bytes.
