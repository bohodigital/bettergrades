# Precalculus production release — 2026-08-03

## Outcome

The audited Precalculus correction is live on BetterGrades. The accepted production source is merge commit `907748d80136f572277be6447e7ae52db30169fd`, deployed at `https://8c3c7a33.bettergrades-vhc.pages.dev` and served by `bettergrades.net` and `www.bettergrades.net`.

The first release deployment, `https://84e60266.bettergrades-vhc.pages.dev`, was rejected during live acceptance because its protected-answer APIs failed closed with `503`. Cloudflare Pages treated the checked-in Wrangler file as deployment configuration and did not snapshot the dashboard-only KV binding. PR #62 added the already-provisioned namespace to `wrangler.jsonc`, added a regression test, passed both GitHub validation jobs, and produced the accepted replacement deployment above.

## Security and storage binding

- KV namespace title: `bettergrades-precalculus-solutions-production`
- Provider namespace UUID: `a50750ebee8244dca1cc3b8d93319bc7`
- Worker binding: `PRECALCULUS_SOLUTIONS`
- Verified records: 2,454 exact canonical IDs
- Verified environments: preview and production
- The public Worker leak scan found none of the protected records.
- The Sites bypass bearer credential was rotated through the explicit Sites credential tool on 2026-08-03; prior values were invalidated and no credential value was printed or committed.
- The dedicated governed Cloudflare cache-purge reference confirmed an exact purge of eight affected apex and `www` URLs. No full-zone purge occurred.

## Acceptance evidence

- PR #61 merged the audited correction and protected provisioning lane.
- PR #62 merged the Wrangler binding hotfix.
- Both PR #61 validation jobs passed; both PR #62 validation jobs passed.
- Full release suite: 337/337 tests passed.
- Canonical replacement build: 988 HTML routes, 135 redirects, zero public leak findings.
- Live protected-answer matrix passed on apex and immutable hosts:
  - wrong check: `422`
  - wrong reveal: `403` and no answer field
  - correct check: `200`
  - correct reveal: `200`
- Live course-page audit passed at 1280 and 390 CSS pixels with no horizontal overflow, overflowing elements, broken images, or browser warnings/errors.
- Both custom domains were active, validated, and verified after deployment.

## Rollback

The immediate pre-release production baseline is commit `de3ef3acd6e8de72c987bb8cce9e1cdba5a25ee4` at `https://0455dda4.bettergrades-vhc.pages.dev` (provider deployment `0455dda4-8ef6-4947-904b-bf2dfbde2e66`). Do not use the rejected `84e60266` deployment as a rollback target.

Rollback requires selecting the recorded baseline deployment or normally reverting the release commits, rebuilding through the fixed wrapper, and repeating domain, route, protected-answer, leak, and browser acceptance checks. No DNS change or KV deletion is required.

## Classification

- Repository implementation: complete.
- Protected storage and credential remediation: complete.
- Production technical acceptance: complete under the owner's explicit release authorization.
- Independent mathematics, exercise-editorial, assessment-policy, and full visual reviews remain follow-up assurance work; this record does not misclassify them as completed.
- Project complete: no; production release complete: yes.

The machine-readable binding is `docs/precalculus/production-release-2026-08-03.json`.
