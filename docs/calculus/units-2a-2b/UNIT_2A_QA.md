# Unit 2A QA record

## Exact candidate and release identity

- Branch: `agent/bettergrades-unit-2a-v3`.
- Baseline: `e85b9b80fdb77aaf5346c555a2c1378024fd33ca`.
- Initial implementation: `c5274b51c41065ce4b8a74f40d3331b288f1f815`.
- Visual-fidelity correction: `08205022b4ca0f67a620c4d116b2a53dd862b39a`.
- Corrected reviewed branch head: `32717b4bb60fb858b9baab6482696f9ee3444ddb`.
- Corrected reviewed branch tree: `839f910b25782065d713c4dcb472a5cf427217b7`.
- PR 24 merged commit: `36e0091b9014ea13c7a043ff258c9edd05bdf2f4`.
- Merged tree: `839f910b25782065d713c4dcb472a5cf427217b7`, exactly equal to the reviewed tree.
- Unit public-route SHA-256: `0e5d94136eb5dd161b7bec8002cebc58ce246823d64c7e4ec2633f7c3113592e`.

## Inventory and contract gates

- 67 routes, 49 core routes, 34 checks, 7 assessment sets, and 27 visuals.
- 36 cumulative exercises, 36 server-only answers, and 36 independent attempt gates.
- Two exam keys with 14 numbered answers each.
- All Unit 2A pages passed title, Lens, route ownership, raw-TeX, math-error, missing-visual, unique-check, public-payload, and source-path gates.
- Limits retained 73 routes, 38 checks, 348 route answers, two exam keys, and 13 visuals.

## Windows and Pi validation

Frozen install, supply-chain allowlist, answer checks, visual checks, ESLint, TypeScript, Vinext/Pages build, and the complete suite passed. The final Windows suite passed 175/175 in 164.9 seconds after the visual correction. The final isolated Pi suite passed 175/175 in 130.2 seconds. Exact merged canonical `main` then rebuilt and passed 175/175 in 130.2 seconds; GitHub main workflow run `29634083079` also succeeded.

The initial unconstrained Pi run caused temporary memory pressure, and a combined long-lived render process later reached Node's 2 GiB heap ceiling. No canonical worktree was mutated. Serial concurrency and a separate Unit 2A render process corrected the failure mode and are mandatory for Unit 2B.

## Private Sites QA

Private Sites version 22 at `ae0efbeed3857460a78d0a4e0ede1ab854b8dfff` was rejected: the first derivative figure was a sparse generic scaffold and multiple plots used placeholder curve families. It was not merged or publicly released.

All 27 scenes were corrected to encode the exact instructional relationships and bounded centered labels. The corrected set passed a 27-item desktop contact grid. A real 390 by 844 lesson view showed a 315 by 183 rendering from its 960 by 558 source without overflow.

The accepted owner-only candidate is Sites version 23, source `32717b4bb60fb858b9baab6482696f9ee3444ddb`, version ID `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_e88f255de780819199ed94ec10d930da`, and deployment ID `appgdep_6a5b1a537a5481919c1b6673c0935692`. Access was custom, one owner, zero groups.

## Live production QA

Immutable deployment `https://b9fa0b41.bettergrades-vhc.pages.dev`, Pages host, apex, and WWW served the exact Unit 2A hub. Browser QA confirmed:

- map-first 49-page textbook sequence and eight specific Section/Reading Lens groups;
- no learner-visible `Chapter`, raw TeX, missing math, or horizontal overflow;
- a centered, collision-free, correctly labeled derivative-loop visual on desktop and 390-pixel mobile;
- an empty exercise attempt remains blocked and a real attempt reveals only that exercise's answer;
- Exam A key lists Problems 1 through 14 and both keys are prominent from the hub;
- unique canonical, `index, follow`, analytics, sitemap, robots, greater-or-equal icons and Organization logo JSON-LD;
- Limits hub and a representative legacy route remain live;
- representative unknown route returns the custom 404.

The primary-management status check confirmed the BetterGrades SEO control-document cache rule is current. No DNS, binding, ownership, billing, credential, or deployment-wrapper mutation was required.
