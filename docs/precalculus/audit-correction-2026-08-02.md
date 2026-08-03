# Precalculus audit correction implementation record

## Record control

- Authorization: owner request to implement the 2026-07-31 BetterGrades Precalculus audit correction handoff
- Audit work order: `WO-2026-07-30-BETTERGRADES-PRECALCULUS-LIVE-AUDIT-001`
- Governing constitutions: `boho.company` v0.1.0 and `boho.operations-agents` v0.1.0
- Owning repository: `bettergrades`
- Implementation branch: `codex/precalculus-audit-correction-20260802`
- Current implementation commit: `be2ac4cdef8e1b673320b0664ca2d5cfaebab81e`, tree `dc612f2cd39803d401d139ccf5e1c82523f97226`
- Reconciled canonical baseline: commit `de3ef3acd6e8de72c987bb8cce9e1cdba5a25ee4`, tree `afc841c32d0a42a9143916f4a55f193531331acf`
- Accepted audit Markdown SHA-256: `c84576796bcebf4f69647842db72d03e839d79645ed49fd1197b48c2617dda1c`
- Accepted audit JSON SHA-256: `5325b325bdc60d9ddbf7e6d0d5b59a07c2315fe37e634955d15531025ddd79db`
- Production state: unchanged; no preview, deployment, cache purge, DNS change, credential change, or provider mutation was performed
- Release verdict: `HOLD`

## Objective and economic purpose

Contain the protected-answer defect, correct the exact audited mathematics and misleading anchor figures, make the full rendered-DOM audit finish reproducibly, and leave a truthful release handoff. This protects assessment integrity, learner trust, search value, and the durability of BetterGrades as an advertising and affiliate property.

## Implemented locally

### Protected-answer boundary

- Removed the direct import of `solutions.server.json` from the public Pages Worker graph.
- Added a fail-closed `PRECALCULUS_SOLUTIONS` protected-storage boundary.
- Changed both Precalculus endpoints so arbitrary nonempty attempts are rejected.
- A reveal now requires the same answer validation as the check endpoint.
- Missing protected storage returns `503`; unknown records return `404`; wrong attempts return `422` or `403` without an answer field.
- Added a protected KV bulk-export tool. It requires an absolute outside-repository output path, writes mode `0600`, and verifies exactly 2,454 unique records.
- Added regression coverage proving all 2,454 public IDs are absent from `_worker.js`.
- Removed inert no-JavaScript forms. Prompts remain server-rendered, readable, and printable; controls appear only after hydration.

All 2,454 records now declare one bounded policy: 70 numerical, 233 symbolic, 23 multipart, 315 exact-text, and 1,813 manual-rubric/model-comparison records. Numerical answers use finite value comparison with declared tolerance; symbolic answers use the existing bounded server-only equivalence checker; multipart answers require every component; exact text is normalized deterministically; and explanatory work is never called automatically correct. A substantive manual response may unlock an explicitly declared model comparison while retaining `manual_review` status.

The generated correct corpus passes every machine-gradeable policy. Arbitrary nonempty text is not accepted as correct or reveal-authorized for any record, including manual-policy records.

### Assessment and navigation surfaces

- Added review, flexible-practice, mastery-check, and investigation routes for each of 16 units.
- Added one 64-item cumulative final assessment.
- Added 65 canonical assessment routes and 2,013 source-traced assessment placements without duplicating protected answer values.
- Every placement has a stable source ID, declared response policy, fixed randomization policy, hint, error tags, repair target, unit/course navigation, and server-held answer or model-response boundary.
- Assessment nodes are classified as assessments in the learning graph rather than textbook lessons.

### P8–P15 concrete exercise rewrite

- Replaced the five generic prompts repeated across every P8–P15 lesson with lesson-specific procedural, conceptual, graphical, error-analysis, verification, transfer, modeling, and exit-check work.
- Preserved the immutable approved Phase B source package; all rewrite adaptations occur in the deterministic import layer.
- Expanded all 90 P8–P15 lessons from 10 to 16 concrete practice exercises, for 1,440 second-half items and 2,280 course practice items overall.
- Added public exercise type, difficulty, and provenance labels and updated the learner-facing practice count.
- Added `content/precalculus/exercise-inventory.server.json`, with per-unit and per-lesson counts by type, difficulty, response policy, and provenance.
- The generated P8–P15 inventory has zero normalized duplicate prompt groups, zero duplicate placements, and zero authoring-instruction-only items.

This closes the repository-level duplication rewrite. Independent mathematics and editorial sampling remain acceptance gates; this implementation does not substitute machine completeness for independent review.

### Exact mathematics corrections

The supplied source packages remain byte-identical and checksum-valid. Corrections are applied as explicit, provenance-recorded import adaptations:

1. `/subjects/math/precalculus/conic-sections-and-implicit-relations/conics-as-loci-and-the-circle-foundation/`
   - Added x-intercepts `(-6,0)` and `(2,0)`.
   - Added y-intercepts `(0,3-sqrt(21))` and `(0,3+sqrt(21))`.
2. `/subjects/math/precalculus/parametric-polar-and-complex-representations/parametric-equations-and-orientation/`
   - Added the exact Cartesian restriction `-5<=x<=5`.
   - Added left-to-right direction as `t` increases from `-2` to `3`.

### Visual program

- Expanded the semantic manifest for all 522 scenes with mathematical claim, required objects, labels/units, domain/excluded cases, visible relationships, forbidden states, renderer/fallback, keyboard contract, initial state, reduced-motion, dark-mode, 320-pixel, print, short/long descriptions, and machine assertions.
- Replaced static titles that falsely claimed animation or a moving point.
- Reauthored the 11 route anchors that the accepted audit proved misleading: P0, P1, P2, P4, P5, P6, P9, P11, P12, P13, and P15.
- Regenerated deterministic compiled scenes, runtime records, and content-addressed SVGs.

Machine completeness is established. Independent mathematical contact-sheet review of all 522 scenes is still required before acceptance.

### Browser, no-JavaScript, and rendered DOM

- Replaced the stale hard-coded homepage count with an explicit current course inventory: Algebra, Precalculus, and Calculus.
- Added course hub, all 16 unit hubs, and representative lesson checks at 1440, 768, 390, and 320 widths with JavaScript on and off.
- Added keyboard focus, dark mode, reduced motion, print, no-overflow, prompt preservation, and no-inert-form assertions.
- Made the rendered-DOM runner resumable and deterministically shardable, with a strict shard combiner.
- Completed a fresh, non-resumed audit of all 988 routes with zero failures, bound to the implementation commit and tree above.

## Validation completed

- `corepack pnpm run build:pages`: pass; 988 canonical HTML routes and 135 redirects built
- `corepack pnpm test`: pass; 334/334
- `corepack pnpm run graph:check`: pass; 974 nodes and 4,486 relationships
- protected KV export smoke test: pass; 2,454 unique records, outside repository, mode `0600`
- protected-answer Worker scan: pass; 2,454/2,454 IDs absent
- P8–P15 concrete exercise audit: pass; 1,440/1,440 typed items, zero normalized duplicate groups, zero authoring-only placeholders
- client release budget: pass; `BetterGradesApp` 596,628 bytes raw, within the 600,000-byte gate
- audited math regression checks: pass
- 522-manifest completeness checks: pass
- 11 corrected anchor-scene checks: pass
- full Playwright browser suite: pass; 50/50, including the Precalculus accessibility/no-JavaScript matrix
- rendered-DOM audit: 988/988, zero failures; evidence source commit and tree match the implementation commit above

## Intentionally not completed and release blockers

1. `P0-01` is implemented and corpus-tested locally but not production-accepted. Cloudflare protected storage must be created, bound, and populated without exposing the export; the exact preview must then repeat the public-leak and behavioral corpus checks.
2. `P0-02` belongs to the provider/connector security boundary, not this repository. The credential class must be identified, usage audited, credential rotated, and response sanitizer fixed under a separately protected security record. No secret was read or copied during this work.
3. Full independent mathematics review across P0-P15, protected-policy sampling, P8–P15 exercise editorial sampling, assessment editorial review, and independent review of all 522 visuals remain outstanding.
4. No private noindex preview has been created or approved.
5. No release merge, Cloudflare deployment, cache purge, provider UUID capture, new release binding, rollback exercise, or independent post-release audit has occurred.

## SEO, security, privacy, and rollback

- SEO: canonical route count and paths remain stable; the two math corrections improve answer completeness without changing intent. No production indexability changed.
- Security/privacy: protected plaintext remains in the server-only tracked source record and the optional outside-repository KV export. The public Worker no longer embeds Precalculus solution records. No student data, token, or raw credential was accessed.
- Candidate rollback: discard or revert the implementation commits before merge. Production rollback remains the previously recorded immutable deployment because production was not changed.

## Required human actions and next stage

1. Authorize and provision the protected Cloudflare storage binding, then import the 2,454-record export through a protected Pi runtime path.
2. Authorize the separate credential incident/rotation work for `P0-02`.
3. Assign independent mathematics, P8–P15 exercise editorial, assessment-policy, and visual reviewers.
4. After those gates pass, build an exact private noindex preview, bind it to commit/tree/digests/inventories/rollback, and obtain owner approval before any production action.

## Completion classification

- Local repository correction stage: complete and committed for review.
- P0 validation implementation: complete locally and corpus-tested, externally unbound.
- Assessment/navigation implementation: complete locally and awaiting independent editorial review.
- Repository implementation: complete locally; external security, protected-storage, independent-review, preview, and release gates remain open.
- Production accepted: no.
- Project complete: no.
