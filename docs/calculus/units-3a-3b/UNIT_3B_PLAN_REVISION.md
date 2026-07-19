# Unit 3B plan revision after Unit 3A

## Gate

Unit 3B branches only from canonical `main` after the corrected Unit 3A production release, postmortem, revised plan, and fresh-context review remediation are merged. The canonical root remains `/subjects/math/calculus/integration-applications/`.

## Architecture decision

Continue the accepted Unit 3A lane:

- normalized handoff installation through `tools/install-calculus-unit-handoff.mjs`;
- generic import through `tools/import-calculus-unit.mjs`;
- existing calculus registry, route-local public payload, server-only assessment/reveal boundary, BVLP compiler/runtime, site shell, search, SEO, print, and Pages package;
- no parallel parser, model service, graph engine, grading API, database, or site shell.

## Revised implementation order

1. Install and validate the Unit 3B public/server/provenance/renderer artifacts and exact checksum manifest.
2. Run route-collision and search-ownership checks against accepted Units 1 through 3A.
3. Extend unit configuration and tests for the declared Unit 3B route, core, check, assessment-set, and visual inventories.
4. Implement content in the handoff batches: area/slices; cross-sections and volume methods; arc/surface length; density/mass/moments; work/pumping/hydrostatic force; marginal/probability/physics; review and exams.
5. For every substantial model, assert variables, units, assumptions, representative contribution, bounds, integral, evaluation where appropriate, interpretation, and reasonableness.
6. Add Unit 3B visual definitions to the existing BVLP author/compiler dispatch and exact Pages inventory assertion.
7. Add pumping and hydrostatic structural grading through the bounded server comparator. Unsupported structures must return `uncertain`; no answer-string equality shortcut is allowed.
8. Connect Unit 3A forward navigation to released Unit 3B and Unit 3B backward navigation to Unit 3A.
9. Run source, Pi, owner-only Sites, Git, merged-tree, Cloudflare, all-origin crawl, and real-browser gates as a separate release.

## Evidence-driven changes from Unit 3A

- Use complete generated lesson descriptions from the start; do not publish clipped handoff metadata.
- Treat the visual-authoring brief as the authoritative route-placement map and fail on missing placements.
- Review every visual screenshot for clipping, guide noise, unit labels, and mobile-readable callouts before compiling the candidate.
- Add the Unit 3B manifest to the exact static-asset inventory test in the same commit that introduces its assets.
- Run Pi tests with a bounded 4 GB Node heap.
- Keep live visible-text checks separate from hidden MathML annotation checks.
- Require at least one exercised structural setup check when a unit declares a structural grading mode; a dormant comparator is not coverage.
- Test arbitrary constants with case variants, different names, and nonzero scalar multiples while continuing to reject a missing family constant.
- Treat literal list commands as forbidden compiled source, even when the client renderer could cosmetically clean them.
- Require a collection gateway when focused application articles sit below the Unit 3B map.
- Record any inability to emulate mobile honestly and use an actual narrow browser surface when available.

## Renderer plan

Use the handoff's proposed five static and four built-in interactive scenes unless authoring evidence shows a simpler faithful allocation. No evidence from Unit 3A justifies JSXGraph, uPlot, 3D, or a new renderer for Unit 3B. Every scene requires an accessible content-addressed SVG and print fallback.

## Stop conditions

Stop before release if an application lacks units/assumptions/local contribution/bounds/interpretation, pumping grading falls back to text equality, answer or rubric content enters a public bundle, a visual requires arbitrary authored code, accepted Units 1 through 3A regress, or the reviewed/merged/deployed trees differ.
