# BetterGrades information architecture and findability audit — 2026-07-24

## 1. Executive verdict

**Machine-observed:** 509 canonical HTML routes resolve into 328 textbook lessons, 6 worksheets, 26 worked problems, and the other roles in the inventory. The rendered graph has 34247 deduplicated typed internal-link edges. 311 routes have no contextual incoming link, and 0 important routes are beyond four navigation edges or unreachable in the navigation-only graph.

**High-confidence inference:** BetterGrades has ample content and crawlable structure, but exact-role findability is weaker than the prior zero-orphan metric implied. Structural links keep pages reachable while many routes lack an editorially meaningful continuation path.

**Editorial judgment:** Prioritize relationship schema and search-role clarity before a broad navigation redesign. Do not mass-link the candidate queue.

## 2. Audited repository and deployment

- Repository start: `0a7c9ea3be4235ba2b99147d5ee4eb26394ce7b9`
- Source tree: `79cf43f486b60bfa72732c0647e40fad298c79e6`
- Local Pages build hash: `43e28d1961fdba0679783925032d7eb2b5b1a0d21b631835f5aa29f0ab4640aa`
- Accepted pre-audit raw Pages hash: `e92dac55168fb8f492381019b7cc3070b2dbd1d12e244f9361d9217ab9d39c63`
- Accepted immutable deployment sampled by retained live evidence: https://7029f1e2.bettergrades-vhc.pages.dev
- Audit worktree: `/Users/darksmarskin/Documents/local2/worktrees/bettergrades-handoff-c2-learning-paths-20260726`
- Branch: `audit/bettergrades-ia-findability-20260724`
- Governing constitutions: Company Constitution v0.1.0; Operations and Agent Constitution v0.1.0
- Economic purpose: improve sustainable organic discovery and useful onward learning without publishing thin, duplicative, or crawler-only content
- Authorized scope: audit tooling, tests, evidence, and documentation only

The deployment was not changed. Live-production provenance is taken from the accepted `artifacts/production` bundle; interactive audit scenarios use the exact local production build.

Security and privacy posture: no credential, account, analytics-configuration, DNS, or production-setting change was made. Rollback is limited to discarding this audit-only branch/worktree; no public rollback is necessary.

The raw Pages package hash is not deterministic because VINEXT emits fresh build/deployment/draft UUIDs and a prerender secret on each build. Two consecutive post-audit builds changed 512 of 809 files at the raw-byte level, but their normalized hashes were both `29f76d98fe03b8ef6cf997333db2c9ac33429d9dc264419c3b4aac8b03ca78a2` with 0 remaining file differences. This is packaging nondeterminism, not audit-induced public content drift.

## 3. Exact route inventory

- answer: 1
- assessment: 3
- concept-explainer: 16
- course-hub: 2
- decision-guide: 19
- directory: 5
- formula-sheet: 1
- glossary-hub: 2
- glossary-term: 25
- home: 1
- method-guide: 31
- policy: 7
- practice-exam: 3
- quick-answer: 11
- resource-hub: 5
- resource-library: 1
- search: 1
- subject-hub: 2
- textbook-lesson: 328
- tool: 2
- unit-hub: 7
- visual-guide: 4
- worked-problem: 26
- worksheet: 6

## 4. Current information architecture

- answer-bank: 1
- assessment-registry: 3
- calculus-resources: 46
- calculus-units: 268
- editorial-library: 77
- limits-textbook: 67
- math-glossary: 27
- site-shell: 18
- tool-registry: 2

## 5. Navigation systems

- assessment-reference: 365
- breadcrumb: 1900
- contextual-body: 6658
- course-map: 61
- footer: 8111
- global-navigation: 7214
- glossary-reference: 6
- hub-listing: 1012
- mobile-navigation: 6916
- primary-action: 81
- related-content: 1044
- resource-companion: 256
- sequential-next: 67
- sequential-previous: 55
- tool-reference: 54
- unit-map: 447

## 6. Findability and click-depth results

- Navigation-deep or unreachable routes: 41
- Important navigation-deep or unreachable routes: 0
- All-link unreachable routes: 0
- Navigation-only incoming pages: 311
- Browser scenario rows: 0; failures: 0
- Direct-navigation rows: 0; search-assisted rows: 0
- Search-assisted rows ranking the exact destination below first: 0

## 7. Internal-link graph results

- Deduplicated rendered edges: 34247
- Contextual incoming zero: 311
- Contextual candidate edges currently present: 8383
- Sequential gaps: 320

## 8. Site-search results

- Search records: 680
- Queries executed: 2380
- Exact-title queries not ranking exact page first: 0
- Zero-result queries: 0
- Alias/skill gaps: 0

## 9. Article-to-textbook candidate results

78 non-textbook instructional pages produced 234 ranked candidate/no-match rows. Every row is provisional. No relationship was published.

## 10. Textbook companion-resource gaps

328 textbook lessons were assessed. The candidate file contains 2644 rows; practice and reference gaps are separated for editorial review.

## 11. Search-intent and cannibalization risks

76 provisional concept clusters contain 29 same-role conflict rows. These are screening results, not automatic merge/noindex decisions.

## 12. Page-template and chrome findings

Static framing metrics cover 509 routes; browser geometry covers 0. 0 routes exceed the bounded framing threshold.

No canonical route currently has the primary role `topic-hub`. The requested topic-hub screenshots therefore use the current Sequences and Series grouping surface as an explicitly disclosed surrogate; the inventory classification remains `unit-hub`.

## 13. Mobile findings

Desktop/mobile target parity has 0 mismatches. Mobile screenshots and scenario evidence are under `artifacts/ia/screenshots/`.

## 14. Metadata and structured-data findings

- Duplicate-title groups: 1
- Duplicate-description groups: 2
- Exact vague anchors: 0
- Routes without detected JSON-LD types: 0

## 15. Traffic evidence and limitations

Repository exports were inventoried, but fresh approved GSC/GA4/Umami data was not available at a trustworthy current grain. Schema-only outputs are marked and contain no fabricated rows.

## 16. Highest-priority problems

- **IA-001 P3_LOW:** 0 exact-title queries did not rank the exact page first.
- **IA-002 P1_HIGH:** 311 routes have zero contextual incoming links.
- **IA-003 P3_LOW:** 0 important routes are unreachable or more than four navigation edges from home.
- **IA-004 P1_HIGH:** 29 inferred concept/role clusters contain multiple pages with the same role.
- **IA-005 P3_LOW:** 0 routes exceed the audit framing threshold.

## 17. Recommended release sequence

1. RELATIONSHIP_SCHEMA
2. SEARCH_AND_FINDABILITY
3. HUB_RESTRUCTURE / GLOBAL_NAVIGATION
4. ARTICLE_TEMPLATE / TEXTBOOK_TEMPLATE / GLOSSARY_TEMPLATE
5. SEO_INTENT_CLEANUP
6. ANALYTICS_AND_MEASUREMENT

## 18. Editorial decisions required

- Approve or reject each article-to-lesson candidate.
- Decide whether same-concept/same-role clusters are distinct intents.
- Approve taxonomy normalization.
- Select navigation labels and parent hierarchy before implementation.

## 19. Complete artifact index

All requested artifacts are under `data/ia/`, `artifacts/ia/`, and `docs/ia/`. `artifacts/ia/audit-manifest.json` is the complete content-hashed index, including screenshots, and binds every listed artifact to the source commit, source tree, generation timestamp, route count, tool version, and failure count. Machine-readable JSON artifacts also carry provenance internally.

## 20. Reproduction commands

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm run build:pages
corepack pnpm run audit:ia
corepack pnpm run audit:ia:browser
corepack pnpm run audit:ia
corepack pnpm run audit:ia:test
corepack pnpm run resources:check
corepack pnpm run answers:check
corepack pnpm run visuals:check
corepack pnpm run test:seo
node tools/ia-audit/build-reproducibility.mjs --before=<first-pages-build> --after=dist/pages --accepted-baseline-raw-hash=<baseline-sha256>
```

## Evidence classification

- **Machine-observed facts:** route, DOM, link, metadata, search-ranking, geometry, and test outputs.
- **High-confidence inferences:** role and concept assignments derived from route/title/H1/registry conventions.
- **Editorial judgments:** priorities, candidate relationships, consolidation classifications, and template recommendations.
- **Missing data:** current traffic and conversion exports.
- **Proposed next steps:** the backlog; none are authorized public changes.
