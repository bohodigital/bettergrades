# Unit 2B QA record

Status: implementation candidate; production identity is recorded only after merge and deployment.

## Baseline and content identity

- Accepted Unit 2A baseline: `1c5415113141e570f336c06210a8ff94cfee6d7f`.
- Unit 2B public-route SHA-256: `4ee6d6591e408b956440a36284d00479e3ad38c221b7ccdc357f8f2cf1fad3ae`.
- Archive SHA-256: `e641e8ea951006e81548eaca12749675a0d6aa38f5a5ff689c641c295e9443e7`.
- Master-program SHA-256: `3ffef61ddc2b6f3cd67127555ac2e3470cd3d41637436f80e5ea6be7646fc469`.

## Deterministic Windows gates

At `2026-07-18T08:26:46Z`, the candidate passed:

- answer import checks;
- Limits, Unit 2A, and Unit 2B visual authoring and compilation checks;
- exact Unit 2A and Unit 2B route import checks;
- ESLint and TypeScript with no errors;
- production Vinext build and Cloudflare Pages advanced-worker packaging;
- 159/159 schema, compiler, inventory, leak, bundle, package, search, and API tests;
- 3/3 exhaustive calculus-unit rendered-route tests;
- 26/26 exhaustive site-shell and registry rendered-route tests.

Total: **188/188 passing**. Exhaustive rendered routes run in separate serial Node processes to release heap between families and remain economical on ARM.

## Rejected private preview and renderer correction

The first owner-only Sites preview (version 24, source commit `75363212dfc9fbe4c2cead19969fa1f46e550312`) was **rejected** during browser-visible QA. The Unit 2B position/velocity/acceleration figure exposed a shared static-renderer defect: a long vertical-axis title was placed just outside the plot and clipped at the left edge.

The correction anchors vertical-axis titles at the plot's left boundary and lets the text extend inward. Limits, Unit 2A, and Unit 2B content-addressed SVG fallbacks were regenerated because the shared renderer owns all three collections. After regeneration, Windows again passed ESLint, TypeScript, the production build and Pages package, 159/159 core tests, 3/3 exhaustive calculus route tests, and 26/26 shell route tests: **188/188 passing**. Version 24 is not an acceptable release artifact and must be replaced by a preview built from the corrected commit.

The replacement owner-only Sites preview (version 25, exact source `660d02de27827b8fb6c499a535c96d4a55958ca8`) passed the desktop and mobile map, Section/Lens, static-visual, native-interactive, answer-reveal, exam-key, metadata, analytics, indexability, and search-identity checks. The explicitly activated JSXGraph ladder also loaded its constrained board while retaining the complete static fallback. That review nevertheless found that the ladder range input relied only on browser-native keyboard stepping even though its authored accessibility contract promises a keyboard-operable endpoint. Version 25 was therefore **rejected** rather than promoted.

The ladder now implements explicit Arrow, Page, Home, and End behavior, updates the constrained point and board through one bounded path, exposes a descriptive control label and live value text, and has a source-contract regression test. After this correction, Windows passed ESLint, TypeScript, the production build and Pages package, 160/160 core tests, 3/3 exhaustive calculus route tests, and 26/26 shell route tests: **189/189 passing**. A new private preview is required from the corrected commit.

## Pi validation

The isolated ARM worktree `/srv/local1/worktrees/bettergrades-unit-2b-v3` at implementation commit `897a6f064f2480717eec403bed28397dc013bb86` passed the frozen install, ESLint, TypeScript, exact import/visual checks, production Vinext build, advanced-worker package, 159/159 inexpensive tests, 3/3 calculus-unit route renders, and 26/26 site-shell route renders. Total: **188/188 passing on the Pi**. The final render process left 6.1 GiB available with zero swap use. Canonical `/srv/local1/repos/bettergrades` remained clean on the accepted Unit 2A baseline during this validation.

The exact renderer-corrected candidate `660d02de27827b8fb6c499a535c96d4a55958ca8` (tree `67a626da8a5da4438ddc0ae5d017626d975039fc`) was then revalidated independently in the same isolated Pi worktree. Frozen install, ESLint, TypeScript, build, Pages package, 159/159 core tests, 3/3 calculus route tests, and 26/26 shell route tests all passed again: **188/188**. The host reported 6.3 GiB available after validation; 267 MiB of the configured 2 GiB swap was in use system-wide. Canonical `main` was still the clean accepted Unit 2A baseline.

The final interaction-hardened candidate `2363b95f8672baa62394c9a944e8c0dbf0c6f2a8` (tree `4e39203bd0bba04652061eaf63ffa22a4a2f0834`) passed the entire ARM sequence once more: frozen install, ESLint, TypeScript, production build, Pages package, 160/160 core tests, 3/3 exhaustive calculus route tests, and 26/26 shell route tests. Total: **189/189 passing on the Pi**. The host reported 6.3 GiB available afterward; 389 MiB of the configured 2 GiB swap was in use system-wide. Canonical `main` remained clean on the accepted Unit 2A baseline.

## Payload and performance gates

| Artifact | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| BetterGradesApp client chunk | 377,026 | 104,687 |
| CalculusUnitPages client chunk | 25,812 | 7,642 |
| BetterGradesVisual client chunk | 6,087 | 2,549 |
| BetterGrades Interactive 2D chunk | 91,297 | 26,303 |
| lazy minimal JSXGraph vendor chunk | 548,122 | 143,735 |

The advanced Pages package contains 184 files totaling 23,611,615 raw bytes. Unit 2B's 34 SVG fallbacks total 456,707 bytes; the largest is 18,161 bytes, below the 50 KB per-asset gate. The JSXGraph vendor chunk remains below its 180 KB gzip gate and is absent until explicit activation.

## Static visual review

A deterministic 34-item contact grid was reviewed at desktop scale after authoring. Each graph or diagram was checked for the intended mathematical relationship, centered composition, bounded labels, collision-free annotations, units where applicable, color-independent cues, accessible title/description, and static/no-JavaScript meaning. Mathematical and label defects found in the first review were corrected and the affected assets were regenerated and rechecked.

## Accepted owner-only Sites browser validation

Sites version 26 is the accepted private review candidate. It was saved from exact source commit `2363b95f8672baa62394c9a944e8c0dbf0c6f2a8` and deployed only to the existing custom access policy: one allowed owner and zero groups. Browser-visible checks established:

- the map-first hub contains nine distinct Section/Reading Lens groups, assessments and prominent keys after the map, then optional explorations;
- no learner-visible `Chapter`, raw TeX, noindex, loading shell, or horizontal overflow on the audited routes;
- the corrected position/velocity/acceleration visual loads at 960 by 558 source resolution, is exactly centered, keeps the complete `aligned values` title inside the plot, and scales to 315 pixels within a 375-pixel mobile layout;
- all six BetterGrades Interactive 2D lessons enhanced successfully, exposed bounded controls or layer toggles, responded to interaction, and retained zero horizontal overflow;
- the JSXGraph ladder retained its complete static fallback before activation, created the constrained SVG board only after explicit activation, and exposed the labeled slider afterward;
- ArrowLeft changed the ladder from `x=8.00, y=6.00` to `x=7.75, y=6.32`; Home changed it to `x=1.00, y=9.95`; End changed it to `x=9.50, y=3.12`;
- an empty cumulative-practice reveal remained blocked; after one real attempt, exactly one supplied answer appeared and the other 29 remained closed;
- Practice Exams A and B each contain 14 exercises and prominent key links; both key routes contain 14 numbered answers; Exam B answer 14 names an assumption, consequence, and measurement or model improvement;
- canonical URLs, `index, follow`, analytics, sitemap/robots coverage, greater-or-equal icons, Web App Manifest, and Organization logo/image JSON-LD are present;
- the 375-pixel mobile hub has nine readable Lens blocks with body and root scroll width exactly 375 pixels.

The public Cloudflare deployment must repeat representative identity, navigation, visual, answer, indexability, security-header, and Limits/Unit 2A regression checks against the immutable deployment and both public hostnames. A successful status code alone is not acceptance.
