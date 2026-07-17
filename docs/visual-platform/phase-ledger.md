# BVLP phase ledger

This ledger records only verified work on the infrastructure-only BetterGrades
Visual Learning Platform branch. The controlling owner contract SHA-256 is
`7d12ebf341362801514cf0c221ca304bcdad7655e23150e9c9396f83fa1081e1`.

## Integration gate — complete

Date: 2026-07-16/17 (America/Chicago)

- Canonical source before work: clean `main == origin/main` at
  `eb665cef15c58592a7e99c979af6d04fbc823eea`.
- Reviewed worker commit:
  `4decc2528f473f579823b55041d903809faa7282`.
- History-preserving integration merge: `2649ac0`.
- Visual-only scope reconciliation: `1f59126`.
- Worker uncommitted diff: empty.
- Durable implementation worktree:
  `/srv/local1/worktrees/bettergrades-bvlp-infrastructure-only-20260717`.
- Included/excluded artifact review: `docs/visual-platform/integration-gate.md`.

Post-reconciliation checks from the durable Pi worktree passed frozen install,
lint, the then-current Pages build/test suite (67/67), and `git diff --check`.
The prior worker-only generic registry/ingestion/assessment/renderer/textbook
gates were intentionally excluded because they conflicted with the controlling
visual-only contract; the exact review is retained in the integration report.

Rollback for the integration gate is non-destructive: branch from
`eb665cef15c58592a7e99c979af6d04fbc823eea`. Worker artifacts remain
recoverable through `4decc252`, and the pre-reconciliation merged tree remains
recoverable through `2649ac0`.

## Phase status through `dee8fd9`

| Phase | Status | Exit evidence |
| --- | --- | --- |
| 0 — baseline and integration | complete | commits and checks above |
| 1 — contracts and resolver | complete | `fc3de72`, allowlist correction `867f1b2`, integrated tests |
| 2 — safe expression compiler and sampler | complete | `40c542c`, `bcdee90`, real Cortex boundary `5cc2257` |
| 3 — static SVG and accessibility | complete | `b646c86`, `723b2f3`, `2a801d7`; exact 13-asset check |
| 4 — lightweight interactive 2D | complete | `a4519d9`; controls/metrics/runtime/boundary tests and 9,796-byte gzip source boundary |
| 5 — lazy adapter boundaries | complete | `33850e4`; adapter isolation and non-public fixture tests |
| 6 — representative Limits migration | complete | `0c7aa1d`; representative source gate, then browser evidence as part of bulk QA |
| 7 — all Limits visual migration | complete | `8a32870`; exact 13 public visuals, 4 interactive, legacy canvas removed, mutation-tested verifier |
| 8 — print parity | complete | Tectonic 0.16.9 cache-only 175-page compile, zero case-insensitive `chapter` terms, 19-page Poppler visual inspection pass |
| 9 — verifier, performance, leak, and browser QA | complete locally | build/typecheck/lint/159 tests, documentation drift, desktop/mobile QA, final chunk measurement, and client leak scan pass; live host checks remain phase 10 |
| 10 — exact preview, reviewed release, and live verification | pending | owner-only Sites preview and production deployment/live QA have not occurred |

## Integrated automated evidence

All of the following were run after the power interruption against the current
implementation candidate:

| Check | Result |
| --- | --- |
| `corepack pnpm run build:pages` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm run verify:visuals` | pass; Pages build, 159/159 tests, exactly 13 public visual scenes and 4 interactive scenes |
| `corepack pnpm exec tsc --noEmit` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm lint` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm test` | pass inside `verify:visuals`; 159/159, 0 failed |

The initial default-heap lint process exhausted its 2 GB Node heap while stale
loopback preview servers were still resident. Those stale preview processes
were stopped and the complete lint was rerun with 4 GB. No lint rule or test was
removed, suppressed, or weakened.

The generated manifest contains exactly 13 deterministic content-addressed SVG
assets and four scenes eligible for Interactive 2D. Individual SVG sizes remain
10,466–30,350 bytes, below the 50,000-byte gate. The verifier covers manifest,
asset, public serializer, route placement, exact counts, and legacy renderer
removal; mutation tests prove representative corruptions fail closed.

## Integrated browser evidence

The exact Pages-emulator candidate was inspected at 1280 by 720 and 390 by 844.
All 13 asset URLs decoded; all 12 visual-bearing routes retained static
fallbacks/long descriptions; the four interactive scenes enhanced; epsilon-
delta keyboard input updated its visual and accessible state. The crawl found
no raw LaTeX, KaTeX error, `noindex`, legacy canvas, console error/warning, or
mobile horizontal overflow. Unit-map, answer-key, and deep-dive order was
correct; Exam A and B keys contained 18 and 14 answers. Analytics, canonicals,
indexable robots metadata, and the greater-or-equal identity were present.

QA exposed a dark-theme white-on-white interaction toolbar. Commit `5a1a13d`
changed it to theme tokens; the mobile recheck measured background
`rgb(19, 26, 23)`, text `rgb(237, 241, 233)`, border `rgb(59, 73, 66)`, and a
44 by 44 control.

True JavaScript-disable and reduced-motion emulation were unavailable in the
browser API. SSR/rendered-HTML tests verify the complete static fallback and
unit tests/CSS verify reduced-motion behavior. These are recorded as automated
evidence, not direct browser emulation. No screen-reader pass is claimed.

## Print candidate evidence

Tectonic 0.16.9 compiled in cache-only mode to the durable Pi validation
directory. The PDF is 481,925 bytes, 175 pages, and has SHA-256
`ce8ead4ce7099e4eb98855395fcf1b1432c43d266e9b01d7951b81614feaeae4`.
The Tectonic binary hash is
`d5bc7fdf216689a14996a4d06b3807841336bbb9aff4114102701f7c1e39579f`.
The log has no fatal or unresolved errors and 8 accepted underfull/overfull
warnings. Full PDF text contains zero case-insensitive `chapter` hits. Nineteen
representative pages rendered at 144 DPI with Poppler 26.05.0 and passed visual
inspection without clipping, overlap, missing glyphs, broken math, black boxes,
or page-edge collisions.

## Bundle and leak evidence

The candidate totals 1,117,910 raw/311,680 gzip bytes of client JavaScript,
versus 4,883,623 raw/1,247,617 gzip in the pre-release main build. Interactive
2D is isolated at 87,031 raw/24,829 gzip bytes. Compute Engine, JSXGraph, and
uPlot emit no candidate client chunk. Commit `400c937` removed imported route
source filenames from the public index; the final client scan also finds no
canonical answers, worked feedback, internal Pi path, or heavy-renderer marker.

## Exact implementation milestones

| Milestone | Commit |
| --- | --- |
| schema/compiler/registry/resolver | `fc3de720a700a8bb51e89b2997aca4023c58bb3e` |
| bounded AST and sampler | `40c542c074d2fcf318d940f97299508275767ec7` |
| sampler cleanup | `bcdee90e19a09866def445077d3654ad53aadf24` |
| compiler scene-variable allowlist | `867f1b2ecba4764f24f64a9e5498ed9eaa920c43` |
| Limits inventory | `3f39b06cbccb684b266e61b5286375ab612469f2` |
| real Cortex boundary over all 13 specs | `5cc2257e04d6b2bba25b223c1a7ca02b0231303e` |
| Interactive 2D | `a4519d9d265db0f5f2ac1fe0eaad198a1e3f55fd` |
| Static SVG renderer | `b646c86b3c2506bb3e03e9a2fc88943731e90608` |
| lazy adapter boundaries/non-public fixtures | `33850e4369e4a71ea71e9e3b5c7a19005fb6daa7` |
| compiled manifest and 13 SVG assets | `723b2f3e20a29ef387371486371e664c74cf2c4f` |
| cross-platform static normalization | `2a801d71d4a7cbe2f50a98126122ab4aa316ea59` |
| strict TypeScript boundary cleanup | `626cdcb5a337cf6b0aaa93c082ce3b86f212cd3c` |
| representative `removable-hole` delivery | `0c7aa1dec2ce02b19358e36a027edcdf0b1b64a1` |
| complete Limits migration and verifier | `8a32870b833cb1a9182aea4f7cfb3fe88cf63b3a` |
| dark-theme toolbar contrast | `5a1a13d694b41e5b426d3c4061226bc7c8d68af3` |
| printable Section terminology and regression gate | `79660f2` (reconciles `e24694a`/`b8c99b8`) |
| public route-source boundary and complete terminology | `a261279`, `400c937` |
| generated Wrangler lint boundary | `dee8fd962dbbeeb1f5ae7dedc721ebc738b74cda` |

## Remaining work

Commit the documentation, rerun proportionate exact-source gates, then execute
the owner-only Sites preview and exact production publish/live QA.
No preview or production success is claimed by this ledger.
