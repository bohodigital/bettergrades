# BVLP integrated QA report

Date: 2026-07-17 (America/Chicago)

Implementation under test:
`dee8fd962dbbeeb1f5ae7dedc721ebc738b74cda`

Worktree:
`/srv/local1/worktrees/bettergrades-bvlp-infrastructure-only-20260717`

This report records completed local/Pi validation after the power interruption.
It is not a preview or production release report. Documentation changes that
include this report are intentionally not represented by the implementation SHA
above; the final release commit must be recorded in the work-order closeout.

## Outcome

The integrated candidate passes its Pages build, strengthened visual release
gate, typecheck, full lint, and full 159-test repository suite. Local Pages-emulator
browser QA confirms all 13 current Limits visual assets, all four interactions,
mobile/desktop fallback behavior, answer-key discoverability, unit navigation,
rendered math, analytics, indexability, and site identity. QA found one dark-
theme toolbar contrast defect; it was fixed and rechecked in `5a1a13d`.

The corrected 175-page PDF compiles successfully, contains no case-insensitive
learner-visible `chapter` wording, and passes representative rendered-page
inspection. Candidate and baseline chunks are measured, and the emitted client
assets contain no Cortex, JSXGraph, uPlot, canonical-answer, internal Pi-path,
or route-source-file markers. Owner-only Sites preview and the production
publish/live verification are still pending. The candidate is not yet declared
released.

## Automated validation

| Gate | Exact result |
| --- | --- |
| `corepack pnpm run build:pages` | pass; existing vinext/Pages pipeline built the candidate |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm run verify:visuals` | pass; production Pages build, 159/159 repository tests including documentation drift, strict 13-scene/4-interactive verifier |
| `corepack pnpm exec tsc --noEmit` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm lint` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm test` | pass as part of `verify:visuals`; 159/159, 0 failed; final duration recorded in command output |

The initial default-heap lint process exhausted its 2 GB Node heap while stale
local preview processes occupied memory. Only the stale loopback preview
processes were stopped. The entire lint then passed with a 4 GB Node heap; no
rule was disabled and no source/test expectation was weakened.

A later lint rerun initially traversed generated `.wrangler/tmp` scratch output
left by Pages emulation. Commit `dee8fd9` added that generated directory to the
existing lint exclusions alongside `dist` and `.next`; full source lint and
`tsc --noEmit` then passed. No product source was excluded.

The full test suite includes every current Limits route, epsilon-delta rendered
HTML, map ordering, answer keys, robots/sitemap, analytics/identity metadata,
visual route placement, fallback/long-description preservation, Pages-package
integrity, and scans for client-side canonical answers, Cortex, and source
leakage. The visual verifier additionally checks manifest/asset hashes, public
serialization, exact public/interactive counts, and removal of
`app/LimitsGraphCanvas.tsx`. Its mutation tests prove representative corruptions
fail the gate.

## Browser environment and coverage

The exact candidate was served through the local Pages emulator and inspected
in the Codex in-app browser. The control API did not expose a trustworthy
browser version, so none is invented here.

| Surface | Coverage |
| --- | --- |
| desktop | 1280 by 720 |
| mobile | 390 by 844 |
| unit landing | main map, answer-key section, deep-dive section, metadata and identity |
| lesson visuals | all 12 routes that collectively deliver the 13 visual IDs |
| interactions | secant, squeeze, unit-circle, epsilon-delta |
| assessments | Exam A and B answer-key discovery and key contents |
| search identity | Organization logo/image, icons, manifest, header mark |

No console errors or warnings were observed on the inspected desktop/mobile
pages. Mobile checks found no horizontal overflow. Static fallback markup and
long descriptions remained in the DOM after enhancement.

## Exact visual delivery

All 13 asset requests returned successfully from the exact candidate and every
image decoded to nonzero natural dimensions:

| Visual ID | Natural dimensions |
| --- | --- |
| `secant-tangent` | 960 by 533 |
| `removable-hole` | 960 by 600 |
| `limit-versus-value` | 960 by 619 |
| `jump-discontinuity` | 960 by 582 |
| `rapid-oscillation` | 960 by 480 |
| `squeeze-bounds` | 960 by 505 |
| `unit-circle-squeeze` | 960 by 680 |
| `sine-over-x` | 960 by 533 |
| `vertical-asymptotes` | 960 by 338 |
| `horizontal-asymptote` | 960 by 519 |
| `discontinuity-gallery` | 960 by 644 |
| `ivt-root` | 960 by 582 |
| `epsilon-delta-window` | 960 by 582 |

The crawl found no raw LaTeX, `katex-error`, legacy `<canvas>`, visible
`Chapter`, or `noindex` on the visual-bearing routes. Every route retained its
static fallback and long description. The generated visual assets remain below
the 50,000-byte per-asset gate.

## Built bundle and leak evidence

The final Pi Pages build at `dee8fd9` emits 1,117,910 raw bytes and 311,680 gzip
bytes across all client JavaScript assets. The pre-release canonical-main build
contained 4,883,623 raw bytes and 1,247,617 gzip bytes, including two accidental
Compute Engine client chunks. The candidate removes those two chunks entirely.

| Candidate asset | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| `BetterGradesApp-DvTDm7VC.js` | 375,746 | 104,237 |
| `Math-CbU7hihp.js` | 261,285 | 77,648 |
| `framework-CXnKph_e.js` | 189,805 | 58,935 |
| `LimitsUnitMap-BEfEyjio.js` | 93,858 | 11,755 |
| `bg-interactive-2d-DAA3XDNU.js` | 87,031 | 24,829 |
| `index-BAv4EaSw.js` | 80,832 | 24,376 |
| `LimitsUnitPages-9Rto_0Pl.js` | 17,411 | 5,750 |
| remaining three small chunks | 11,942 | 4,150 |

The Interactive 2D production chunk is 24,829 gzip bytes, below the 30 KiB
core boundary and the 25 KB ordinary-scene target. No JSXGraph or uPlot chunk is
emitted because no current public Limits route selects those adapters. The full
client scan finds no `@cortex-js`, `ComputeEngine`, `jsxgraph`, `uplot`,
`canonicalAnswer`, `workedFeedbackLatex`, `/srv/local1`, or imported route
`sourceFile` filename. Commit `400c937` removed the 71 route-source filenames
from the public navigation index and made the importer preserve that boundary.

## Interaction, keyboard, touch target, and failure fallback

The four eligible scenes lazy-loaded only when their visuals approached the
viewport. `secant-tangent`, `squeeze-bounds`, `unit-circle-squeeze`, and
`epsilon-delta-window` all enhanced without removing the fallback from the DOM.
No optional-renderer alert was emitted.

On the epsilon-delta route, ArrowRight changed the control value from 0.75 to
0.8. The visible output, ARIA state, and status text updated with the new
epsilon/delta values. Mobile buttons measured 44 by 44 pixels and the slider
retained the minimum 44-pixel interaction height. The 317-pixel-wide mobile
graph root remained within the viewport.

The optional renderer is protected by an error boundary, so a render exception
does not replace the instructional SVG/caption/description. Unit/source tests
cover observer cleanup, visible failure ownership, keyboard bounds, and
reduced-motion detection.

## Dark-theme defect and fix

Browser QA found Interactive 2D toolbar buttons rendering white text on a white
background in dark mode. Commit
`5a1a13d694b41e5b426d3c4061226bc7c8d68af3` replaced hard-coded toolbar colors
with theme tokens and added a regression assertion. The mobile recheck measured:

- background: `rgb(19, 26, 23)`
- text: `rgb(237, 241, 233)`
- border: `rgb(59, 73, 66)`
- button size: 44 by 44 pixels
- horizontal overflow: none

## Unit navigation, exposition, and answer keys

The unit landing is ordered as a textbook:

1. `The complete textbook path`
2. `Exam answer keys`
3. `Deep dives and extra articles`

The map contains eight sections. Visible map labels use `Section`, not
`Chapter`. Two answer-key links are directly exposed from the unit page. Exam A
also presents three prominent paths to its key. Exam A's published key contains
18 answers and Exam B's contains 14. Both keys render headings and math, carry
canonical/indexable metadata and analytics, identify their LaTeX answer source
with a 64-character content hash, and expose neither raw LaTeX nor `Chapter`.

The full rendered-route tests cover all 73 current Limits and Continuity routes,
including the additional in-depth articles. The browser pass was deliberately
focused on the unit landing, every visual-bearing lesson, interactions, and
answer keys rather than claiming 73 separate manual page inspections.

## Math, SEO, analytics, and identity

The inspected visual routes and epsilon-delta content had no raw LaTeX or KaTeX
error. Repaired learner-visible descriptions end cleanly rather than at their
prior 160-character truncation boundary; this is enforced across all unit
descriptions by a regression test.

The landing and inspected lesson/answer routes expose canonical metadata,
index/follow robots behavior, and the existing analytics tag. No inspected
route enables `noindex`; the full tests also cover robots and sitemap output.
The Organization schema uses
`https://bettergrades.net/icon-512.png` for both logo and image. That asset is a
512 by 512 PNG showing the white greater-or-equal identity on green. Favicon,
SVG icon, 192/512 icons, Apple touch icon, web manifest, and the visible header
greater-or-equal mark are present.

## No-JavaScript, reduced motion, and assistive technology

The in-app browser did not expose a true JavaScript-disable mode or reduced-
motion emulation. Direct browser success is therefore not claimed for those two
modes. Server-rendered HTML tests confirm the external SVG, semantic caption,
and long description exist before enhancement; runtime tests cover
`matchMedia` reduced-motion handling and assert no animation starts, and the CSS
contains `prefers-reduced-motion` behavior.

Keyboard behavior was directly tested on epsilon-delta, but a dedicated screen-
reader/assistive-technology pass was not performed. These limitations do not
erase the completed SSR, semantics, keyboard, focus-target, and fallback tests;
they remain explicit rather than being mislabeled as manual browser evidence.

## Print evidence

The Pi compiled the candidate with Tectonic 0.16.9 in cache-only mode. Durable
artifacts are under:

`/srv/local1/runtime/bettergrades/print-validation/WO-2026-07-17-BETTERGRADES-BVLP-INFRASTRUCTURE-001-section/`

| Evidence | Result |
| --- | --- |
| file | `main.pdf` |
| bytes | 481,925 |
| pages | 175 |
| SHA-256 | `ce8ead4ce7099e4eb98855395fcf1b1432c43d266e9b01d7951b81614feaeae4` |
| Tectonic binary SHA-256 | `d5bc7fdf216689a14996a4d06b3807841336bbb9aff4114102701f7c1e39579f` |
| fatal/unresolved errors | 0 |
| accepted underfull/overfull warnings | 8 |
| terminology scan | 0 case-insensitive `chapter` hits in extracted PDF text |
| representative page rendering and visual inspection | pass; 19 pages rendered at 144 DPI with Poppler 26.05.0 |

Pages 3, 13, 14, 32, 39, 57, 63, 80, 102, 107, 126, 142, 144, 145, 155,
159, 164, 169, and 174 were inspected. They show `Section`/`SECTION` where
applicable and no clipping, overlap, missing glyphs, broken math, black boxes,
or page-edge collisions. This closes the v1 print-parity gate while preserving
the book-class structure used by the TeX source.

## Pending gates — no success claimed

- Exact owner-only Sites preview, including one-owner/zero-group access proof,
  preview source/version, and browser-visible QA.
- Exact production publish and immutable URL/pages.dev/apex/www desktop/mobile
  live verification.
- Final deployment IDs, release commit, artifact/package identity, cache-header
  evidence, rollback point, and MCP work-order closeout.

Until these gates are recorded, this report supports a locally validated release
candidate only. It must not be cited as evidence that Sites preview or
production is already complete.
