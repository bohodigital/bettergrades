# Precalculus audit correction implementation record

## Record control

- Authorization: owner request to implement the 2026-07-31 BetterGrades Precalculus audit correction handoff
- Audit work order: `WO-2026-07-30-BETTERGRADES-PRECALCULUS-LIVE-AUDIT-001`
- Governing constitutions: `boho.company` v0.1.0 and `boho.operations-agents` v0.1.0
- Owning repository: `bettergrades`
- Implementation branch: `codex/precalculus-audit-correction-20260802`
- Implementation commit: `8ae4c172b04f55369054dd6611e89f76aac37a13`, tree `32ac01b88dfbcba1666cf25596022e46a44ce7c7`
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
- Added a protected KV bulk-export tool. It requires an absolute outside-repository output path, writes mode `0600`, and verifies exactly 1,914 unique records.
- Added regression coverage proving all 1,914 public IDs are absent from `_worker.js`.
- Removed inert no-JavaScript forms. Prompts remain server-rendered, readable, and printable; controls appear only after hydration.

The present declared validator is normalized exact-answer matching. It closes the universal-any-nonempty gate and supports the exact correct-answer corpus, but it does not yet provide approved symbolic equivalence or rubric evaluation for every response class. Production release remains blocked until records are classified and the required numerical, symbolic, multipart, and rubric policies are implemented and independently tested.

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
- Completed a fresh, non-resumed audit of all 923 routes with zero failures, bound to the implementation commit and tree above.

## Validation completed

- `corepack pnpm run build:pages`: pass; 923 canonical HTML routes and 135 redirects built
- `corepack pnpm test`: pass; 330/330
- `corepack pnpm run graph:check`: pass; 909 nodes and 4,486 relationships
- protected KV export smoke test: pass; 1,914 unique records, outside repository, mode `0600`
- protected-answer Worker scan: pass; 1,914/1,914 IDs absent
- audited math regression checks: pass
- 522-manifest completeness checks: pass
- 11 corrected anchor-scene checks: pass
- full Playwright browser suite: pass; 50/50, including the Precalculus accessibility/no-JavaScript matrix
- rendered-DOM audit: 923/923, zero failures; evidence source commit and tree match the implementation commit above

## Intentionally not completed and release blockers

1. `P0-01` is contained in candidate code but not production-accepted. Cloudflare protected storage must be created/bound and populated without exposing the export. Symbolic, numerical, multipart, and rubric policy classification remains incomplete.
2. `P0-02` belongs to the provider/connector security boundary, not this repository. The credential class must be identified, usage audited, credential rotated, and response sanitizer fixed under a separately protected security record. No secret was read or copied during this work.
3. Precalculus still lacks dedicated review, flexible-practice, mastery-check, investigation, answer-key, resource, and final-assessment route types. These require approved editorial content rather than generated placeholders.
4. P8-P15 still require a reviewed exercise rewrite. The audit found 45.0%-46.7% normalized duplication; this implementation did not manufacture template variants to inflate counts.
5. Full independent mathematics review across P0-P15 and independent review of all 522 visuals remain outstanding.
6. No private noindex preview has been created or approved.
7. No release merge, Cloudflare deployment, cache purge, provider UUID capture, new release binding, rollback exercise, or independent post-release audit has occurred.

## SEO, security, privacy, and rollback

- SEO: canonical route count and paths remain stable; the two math corrections improve answer completeness without changing intent. No production indexability changed.
- Security/privacy: protected plaintext remains in the server-only tracked source record and the optional outside-repository KV export. The public Worker no longer embeds Precalculus solution records. No student data, token, or raw credential was accessed.
- Candidate rollback: discard or revert the implementation commits before merge. Production rollback remains the previously recorded immutable deployment because production was not changed.

## Required human actions and next stage

1. Authorize and provision the protected Cloudflare storage binding, then import the 1,914-record export through a protected Pi runtime path.
2. Authorize the separate credential incident/rotation work for `P0-02`.
3. Approve an editorial work order for the missing assessment routes and P8-P15 exercise rewrite.
4. Assign independent mathematics and visual reviewers.
5. After those gates pass, build an exact private noindex preview, bind it to commit/tree/digests/inventories/rollback, and obtain owner approval before any production action.

## Completion classification

- Local correction stage: partially complete and committed for review.
- P0 containment implementation: complete locally, externally unbound.
- Full implementation: incomplete.
- Production accepted: no.
- Project complete: no.
