# Unit 3B prepublication QA

## Candidate basis

- Branch: `agent/bettergrades-unit-3b-v3`
- Accepted base: `fd3f2d90f7818c3945b866ff3777b92028071d59`
- Work order: `WO-2026-07-18-BETTERGRADES-CALCULUS-UNITS-3A-3B-V3-001`
- Canonical root: `/subjects/math/calculus/integration-applications/`
- Handoff archive SHA-256: `d6a102fca7235eb850747a22d9b2f42394db3643d52e4374bb8cd31289a80655`
- Owner-instruction SHA-256: `fa666564799e45556c545bee9a36f1b50820244993c6798c2fe216924955b9d4`

## Architecture and content

Unit 3B continues the accepted calculus lane. The normalized source is installed under `content/calculus/units/unit-3b/handoff/`; generated route, page, assessment, and visual artifacts remain distinct from that immutable intake. No parser, grader API, visual runtime, site shell, database, or deployment lane was duplicated.

The main route leads with the complete textbook map. The supporting application studios, review, cumulative practice, exams, and published keys follow the core sequence. Unit 3A links forward to 3B; every 3B page exposes an immediate return to 3A. Public UI copy does not market page, topic, check, or visual inventory counts.

The physics studio, review, and cumulative-practice prompts were made fully specified in the importer while the handoff remains preserved. Each exercise receives one server-only worked answer after the exercise node. Public pages expose only an opaque reveal identifier until the learner submits an attempt.

## Assessment boundary

Unit 3B uses the existing bounded server evaluator. Numeric, rational, multiple-choice, and symbolic checks retain their established policies. The pumping check exercises the structural integral comparator with equivalent factor placement accepted, contradictory bounds and lift distance rejected, prose or unprovable structure returned as `uncertain`, and empty attempts blocked from evaluation and reveal.

The integral normalizer now preserves the boundary between an upper limit and an immediately following factor, so `9800\\int_0^2 12(3-y)dy` compares structurally with `117600\\int_0^2(3-y)dy` without answer-string equality.

## Visual QA

The authored collection contains the handoff-defined static and interactive allocation. Every scene compiles through VisualSpec v1 into a content-addressed SVG fallback, bounded public scene, accessible description, grayscale-safe print representation, and reduced-motion contract where interactive.

The complete SVG gallery was inspected at desktop size. A first pass found auto-positioned labels colliding in the area, washer, shell, arc-length, and pumping scenes. The authored definitions were corrected to use explicit label positions and unlabeled geometry guides. The regenerated gallery and full-size washer/shell screenshots showed centered diagrams, distinct labels, unclipped callouts, and no remaining label collision in the reviewed fallback state.

## Accessibility, SEO, print, and leakage

- Each route renders a visible heading, Section overview, Reading lens, breadcrumbs, Unit 3 navigation, canonical URL, index/follow metadata, and learning-resource schema.
- The unit root, lessons, application studios, exams, and keys enter the shared search and sitemap registries exactly once.
- The greater-or-equal identity assets, manifest, Organization schema, and sitewide analytics remain inherited on every new route.
- Public route, assessment, and set artifacts contain no canonical answers, worked solutions, local archive paths, or authoring source fields.
- All SVG fallbacks remain under the static asset byte ceiling and declare accessible summaries and print-safe output.
- The Pages package contains the exact combined visual asset inventory; stale Unit 3B SVG hashes are removed during compilation.

## Local validation

- TypeScript: pass.
- ESLint: pass.
- Unit 3A/3B focused suite: pass.
- Full generated build and Pages preparation: pass.
- Full repository test suite: `213/213` pass with serial execution.
- Unit 3B rendered-route crawl: pass with no visible raw LaTeX, KaTeX error marker, duplicate check, source command, missing Lens block, missing Unit 3A return path, or missing exam-key link.
- Visual author/compile freshness: pass for Units 2A, 2B, 3A, and 3B.
- Existing Limits visual verifier: pass.

The build reports the existing JSXGraph dependency's bundled `eval` warning and an existing chunk-size warning. Unit 3B adds no JSXGraph scene, arbitrary JavaScript, runtime expression compiler, or new heavy dependency. These warnings are not treated as proof of a Unit 3B regression.

## Browser evidence boundary

The local application runtime supplied semantic DOM evidence for the exact Unit 3B map, navigation, Section/Lens copy, support resources, and answer-key links. Its direct asset route applies the application trailing-slash redirect and therefore is not a faithful styled Pages emulator. The exact generated SVG fallbacks were reviewed through a static local origin. Styled shell, interaction, narrow-layout, and production-origin checks remain mandatory at the owner-only Sites and Cloudflare release gates; no production claim is made in this report.

## Rollback

Before publication, discard only the Unit 3B branch or revert its eventual merge commit. After publication, use the exact merge and immutable deployment identifiers recorded in `UNIT_3B_RELEASE.md`; do not reset shared history, alter DNS, or expose credentials.
