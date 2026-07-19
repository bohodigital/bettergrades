# Unit 3A QA

## Candidate state

The Unit 3A source candidate passes:

- archive and internal checksum validation;
- deterministic import and exact route/core/check/assessment/visual inventory checks;
- public/server answer separation and leak scans;
- numeric, rational, symbolic, additive-constant, integral-setup, and reveal tests;
- visual schema, authoring, compilation, static asset, interaction, accessibility, and content-address checks;
- type checking and lint;
- production vinext and Cloudflare Pages package builds;
- rendered HTML review for every Unit 3A route;
- no raw LaTeX, TikZ, PGFPlots, source commands, or KaTeX error markers;
- complete, separately routed exam answer keys;
- canonical, index/follow, sitemap, search, analytics, search-identity, security-header, and 404 regressions; and
- full existing Unit 1, Unit 2A, and Unit 2B regressions.

Corrective-candidate local suite: 202 tests passed, 0 failed. The initial release's Pi-native build and suite passed after the one heap-limited rendered file was rerun with a bounded 4 GB Node heap; the corrected candidate receives a fresh Pi-native validation before merge. Exact commits, owner-only Sites versions, Git integration, immutable deployments, hosted browser evidence, and the limitation for true mobile emulation are recorded in `UNIT_3A_RELEASE.md`.
