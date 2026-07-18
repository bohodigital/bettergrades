# Revised Unit 2B implementation plan

This revision is the mandatory gate between accepted Unit 2A production and Unit 2B implementation. It incorporates measured Unit 2A defects and keeps the accepted architecture.

## Fixed starting point

Create `agent/bettergrades-unit-2b-v3` from accepted production `main` after this closeout branch is merged. The source lineage must contain Unit 2A merge commit `36e0091b9014ea13c7a043ff258c9edd05bdf2f4` and the closeout commit. Do not branch from the original Unit 2A review branch, the rejected Sites candidate, the archive, or a stale Windows checkout.

The canonical Unit 2B root is `/subjects/math/calculus/derivative-applications/`. Unit 2B must account for exactly 76 unique public routes, 57 continuous core routes, 22 quick checks, 8 assessment sets, 34 visuals, and two complete answer keys. It is a separate PR, Sites version, Cloudflare deployment, and rollback point.

## Architecture decision

Extend the current route loader, semantic content compiler, typed assessment boundary, VisualSpec/CompiledScene registries, static SVG generator, optional interactive renderer, search, sitemap, print, and Pages Worker. Do not replace the site shell, content registry, search, assessment endpoints, BVLP core, Cloudflare project, bindings, or deployment wrapper. Add no runtime dependency, CDN, LLM, database migration, or new Cloudflare binding.

## New import gates learned from Unit 2A

### Application completeness

Every substantial optimization, related-rates, linearization, differential, approximation, Newton-method, motion, graph-analysis, or modeling lesson must encode:

1. variables and units;
2. assumptions and sign conventions;
3. a diagram need and named diagram objects when appropriate;
4. the governing relation or constraint;
5. the objective or requested rate;
6. the feasible domain;
7. the derivative with respect to the correct variable;
8. interior candidates or update steps;
9. boundary, endpoint, or stopping checks;
10. interpretation in the original units;
11. a reasonableness or error check.

The importer must reject substantial application pages missing a required field. These records drive prose, visual briefs, worked-example checks, and assessment review rather than existing only in documentation.

### Visual fidelity

- Convert each of the 34 briefs into a scene-specific checklist naming required quantities, geometry, arrows, constraints, objective, candidate points, units, and interpretations.
- Reject generic scaffold records, placeholder curves, repeated coordinates for mathematically distinct models, labels without bounded boxes, and diagrams whose accessible description does not match the visible scene.
- Generate exact function/rate/constraint data from the reviewed application record, not from a generic example family.
- Preserve static-first delivery. Interaction is allowed only when changing a bounded parameter materially teaches the application and a complete static fallback remains.
- Render and inspect a deterministic 34-item contact grid before saving the first Sites version. Also inspect representative graph analysis, optimization geometry, related-rates geometry, Newton iteration, motion, and linearization scenes in actual desktop and 390 by 844 lesson pages.

### Assessment and answer integrity

- Declare validator type, equivalence, ambiguity policy, attempt policy, hint, and server/public ownership for every check.
- Preserve route-scoped opaque reveal IDs and one-answer-at-a-time server responses.
- Keep exam answers out of exam payloads, route indexes, search artifacts, client chunks, source metadata, and visual assets.
- Publish two separately routed, prominent, indexable answer keys with exact item numbering.
- Add dedicated tests proving Exam B problem 14 exists in the exam, exists in its key, maps to the correct source, reveals only under the intended public-key route, and does not appear in unrelated client payloads.

## Batches and validation order

Use the batch order in the owner program and normalized migration matrix. Within every batch:

1. import and validate route/application records;
2. compile semantic content and typed assessments;
3. compile exact VisualSpecs and SVG fallbacks;
4. run inventory, collision, raw-source, unsupported-capability, answer-leak, and asset-budget gates;
5. review the batch contact-grid slice;
6. run route SSR for that batch in its own Node process;
7. commit a working increment with source traceability.

Do not defer all visuals, answers, exposition, or route conflicts to a final cleanup pass. A batch is not complete while its application fields or scene-specific fidelity checklist is incomplete.

## Pi economy

- Run frozen install once per exact dependency state.
- Run cheap schema, route, assessment, leak, and visual-manifest tests before full build.
- Use `--test-concurrency=1` on the Pi.
- Split Unit 2A, Unit 2B, Limits, and general rendered-route sweeps into separate processes so heaps are released.
- Capture elapsed time and available task-scoped usage at the start/end of intake, import, visual correction, private candidate, PR, and production release.
- Stop and investigate repeated identical failures; do not rerun a memory-exhausting command without a changed hypothesis or process boundary.

## Required product QA

- Hub starts with the complete 57-page map; eight application assessments and support resources follow; optional focused articles remain below the textbook path.
- Every Section overview and Reading Lens is route- or section-specific and stable in light/dark, mobile, print, reduced-motion, and no-JavaScript modes.
- Every exercise-only route supplies an attempt-gated answer control; both exam keys are linked from the hub and their exams.
- No raw TeX, TikZ, KaTeX error text, source path, answer payload, missing visual, unsupported scene, duplicate path, `Chapter`, or accidental `noindex` appears.
- Graph labels, units, extrema/candidate labels, feasible-domain boundaries, and diagram annotations are centered, bounded, non-overlapping, and readable at desktop, 390 pixels, print, and grayscale.
- Keyboard, screen-reader description order, color-independent cues, static fallbacks, and live feedback remain intact.
- Bundle, SVG, interactive-source, hydration, worker, and response-size budgets do not regress without an explicit reviewed exception.

## Release gates

1. Validate the complete exact branch on Windows and Pi.
2. Compile and inspect the print artifact.
3. Save one exact owner-only Sites version and deploy it privately.
4. Perform semantic-readiness browser QA on the exact candidate across desktop/mobile/light/dark/keyboard/reduced motion/JavaScript disabled, including real answer attempts and Exam B problem 14.
5. Open a separate PR; review the complete diff and secret/leak scans; require checks.
6. Merge only the accepted tree; rebuild and retest exact merged `main`.
7. Deploy through the unchanged fixed Cloudflare Pages wrapper; use the primary-management credential only for the separate zone/control-plane verification.
8. Verify immutable, pages.dev, apex, and WWW routes, visuals, answer keys, attempts, Limits and Unit 2A regressions, search, sitemap, canonical, analytics, identity, headers, cache controls, indexability, 404, desktop, and mobile.
9. Record rollback to the accepted Unit 2A deployment `https://b9fa0b41.bettergrades-vhc.pages.dev` and close MCP only after the combined audit passes.

## Stop conditions

Stop before release if counts do not reconcile; rights are unresolved; application records are incomplete; a visual uses generic or mathematically incorrect scaffolding; a label overlaps or exits its bounds; an answer leaks; Exam B problem 14 is absent or ambiguous; Limits/Unit 2A regress; print is clipped; budgets fail; the reviewed and merged trees differ; the Sites access gate is wrong; or live hosts do not serve the exact deployment. A broad platform replacement proposal is not a workaround for a failing content or authoring gate.
