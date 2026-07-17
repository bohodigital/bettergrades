# Verification strategy

`verify:visuals` is the deterministic release gate. It runs the production
Pages build, full repository test suite, and strict artifact verifier. It
complements, and does not replace, frozen install, typecheck, lint, Tectonic,
manual print inspection, documentation review, browser QA, owner-only preview,
and production verification.

## Integrated candidate results

The following results were obtained after the power interruption from the Pi
implementation worktree at
`dee8fd962dbbeeb1f5ae7dedc721ebc738b74cda`:

| Gate | Result |
| --- | --- |
| `corepack pnpm run build:pages` | pass; exact candidate built through the existing Pages/vinext path |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm run verify:visuals` | pass; Pages build, 158/158 tests, strict 13-public/4-interactive artifact verifier |
| `corepack pnpm exec tsc --noEmit` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm lint` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 corepack pnpm test` | pass inside `verify:visuals`; 158/158, 0 failed |
| cache-only Tectonic 0.16.9 compile | pass; 175 pages, 0 fatal/unresolved errors, 8 accepted under/overfull warnings, 19-page visual inspection pass |

The first default-heap lint attempt exhausted its 2 GB Node heap while stale
loopback preview servers were still consuming memory. Only those stale preview
processes were stopped, and the full lint was rerun with a 4 GB heap. That rerun
passed without suppressing or weakening a lint rule. This is recorded as a host
resource recovery, not a code defect or a skipped gate.

The visual verifier checks the compiled manifest, content-addressed SVG files,
public serializer, route placement, exactly four interactive scenes, absence of
the legacy canvas renderer, and deterministic asset generation. Dedicated
mutation tests demonstrate that malformed representative artifacts, projections,
and route delivery cause the verifier to fail. The Pages-package tests also scan
client output for canonical answer/source/Cortex leakage and imported route
source filenames.

## Automated groups

- **Schema:** valid/invalid/unknown fields and kinds, duplicate IDs, missing
  accessibility/print, bad references/cycles, unsupported 3D.
- **Expressions:** supported LaTeX/AST/evaluation/piecewise, dangerous and
  unknown syntax rejection, length/depth/node/operation bounds.
- **Sampling:** smooth, hole, jump, asymptote, domain/piecewise boundary, rapid
  oscillation, parametric loop, polar discontinuity, clipping, max samples, and
  false-bridge prevention.
- **Static rendering:** deterministic SVG/IDs/viewBox, primitives, labels,
  annotations, regions, multi-panel, title/description, no raw LaTeX.
- **Resolver:** static default, Interactive 2D before heavier adapters,
  JSXGraph advanced geometry, uPlot dense series, unsupported 3D failure,
  preferred-renderer safety, least-cost selection.
- **Interactive/adapters:** enhancement, retained fallback, keyboard, sliders,
  drag/reset/resize/touch, cleanup, reduced motion, adapter isolation/failure.
- **Delivery:** asset/manifest integrity, bounded payloads, complete route
  placement, Pages package validity, legacy-renderer removal, no whole registry.
- **Limits:** exact one-to-one migration, captions/descriptions, marker and
  asymptote parity, no placeholders/old output/raw source/KaTeX errors.
- **Performance/leaks:** Interactive 2D boundary, adapter isolation, Compute
  Engine absence, and no answers/source/whole-unit payload.
- **Print/docs:** every visual has a print mapping; Tectonic and final visual
  inspection remain separate release gates.

## Browser QA completed locally

The exact candidate was served by the Pages emulator and inspected with the
in-app browser at 1280 by 720 and 390 by 844. The browser build/version was not
exposed by the control API and is therefore not invented in the report.

The crawl covered the unit landing, all 12 lesson routes that collectively
deliver the 13 visual IDs, four interactive routes, both answer keys, and search
identity assets. All 13 SVGs decoded to nonzero natural dimensions. Retained
fallbacks and long descriptions were present, and the inspected content had no
raw LaTeX, KaTeX error, `noindex`, legacy canvas, console error, console warning,
or horizontal mobile overflow. The secant, squeeze, unit-circle, and
epsilon-delta scenes enhanced. Epsilon-delta keyboard input changed state and
accessible output. The dark-theme regression discovered during QA was fixed and
rechecked at `5a1a13d`.

The browser API did not provide true JavaScript-disable or reduced-motion
emulation. Server-rendered HTML tests prove the static image, caption, and long
description are emitted without relying on enhancement; runtime unit tests cover
`matchMedia` reduced-motion behavior, and CSS includes the reduced-motion media
query. Those are strong automated checks but are not mislabeled as direct
browser emulation. A direct screen-reader/assistive-technology pass is also not
claimed.

## Remaining release gates

- Publish and inspect the exact owner-only Sites preview.
- Deploy the exact reviewed source and verify immutable URL, pages.dev, apex,
  and www on desktop/mobile.

Do not weaken tests, suppress warnings, update snapshots without review, or
substitute a route-level 200 for visual/math/interaction validation. Exact
details and limitations are in [QA_REPORT.md](QA_REPORT.md).
