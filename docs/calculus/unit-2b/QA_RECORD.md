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

## Pi validation

The isolated ARM worktree `/srv/local1/worktrees/bettergrades-unit-2b-v3` at implementation commit `897a6f064f2480717eec403bed28397dc013bb86` passed the frozen install, ESLint, TypeScript, exact import/visual checks, production Vinext build, advanced-worker package, 159/159 inexpensive tests, 3/3 calculus-unit route renders, and 26/26 site-shell route renders. Total: **188/188 passing on the Pi**. The final render process left 6.1 GiB available with zero swap use. Canonical `/srv/local1/repos/bettergrades` remained clean on the accepted Unit 2A baseline during this validation.

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

## Browser gates required before acceptance

The owner-only Sites candidate and exact public deployment must verify:

- map-first hub with nine distinct Section/Reading Lens groups and explorations below;
- no learner-visible `Chapter`, raw TeX, math errors, loading shell, or horizontal overflow;
- representative static and BetterGrades Interactive 2D visuals on desktop and an actual 390 by 844 viewport;
- JSXGraph static fallback before activation, lazy network load only after activation, usable ladder/slider afterward, and no console error;
- empty answer reveal blocked, then a real attempt revealing only the selected answer;
- Practice Exams A and B each show 14 problems and prominent key links;
- both key routes show 14 numbered answers and Exam B answer 14 includes the required modeling critique;
- unique canonical, `index, follow`, analytics, sitemap, robots, greater-or-equal icons, Organization logo/image JSON-LD, security headers, and custom 404;
- Limits and Unit 2A regression samples remain live.

Exact Sites and production evidence is added after those gates pass; a successful status code is not acceptance.
