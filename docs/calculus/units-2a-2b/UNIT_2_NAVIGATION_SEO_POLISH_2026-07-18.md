# Unit 2 navigation and SEO polish — implementation record

Date: 2026-07-18
Work order: `WO-2026-07-18-BETTERGRADES-UNIT-2-LABEL-NAVIGATION-POLISH-001`
Canonical Pi worktree: `/srv/local1/worktrees/bettergrades-unit2-navigation-seo-20260718`
Implementation commit on the Pi branch: `06a93747fac1ac44a86e902d01d8fcbf000e45ab`
Implementation tree: `6a61d76223e1bf7ea685e1017fac7374ea5ab518`

## Purpose

Make Calculus Unit 2 read as one connected course split into clearly named Units 2A and 2B. Learners must be able to identify their current half, open either unit map, and move from foundations into applications without hunting. Search presentation and page metadata must preserve the same identity. Inventory-style totals belong only in the glossary, not in course marketing or navigation.

## Changes

- Added one accessible Unit 2 course navigator shared by every generated Unit 2A and Unit 2B route.
- Made the current half explicit with `aria-current="location"`, while keeping direct links to both canonical maps in the same block.
- Added the same navigator to the focused derivative articles that sit beside the generated textbook routes.
- Added prominent 2A-to-2B continuation language and reciprocal 2B-to-2A foundation-review links in the hero, sidebar, unit map, search index, and calculus course hub.
- Added Unit 2A or Unit 2B context to deep-page titles, descriptions, keywords, Open Graph data, Twitter data, course JSON-LD, and breadcrumb JSON-LD.
- Replaced page, topic, guide, check, visual, time, match, and question inventory totals in course, search, practice, and Limits navigation with descriptive language. Exercise numbering, assessment progress, unit numbering, and glossary totals remain functional.
- Added responsive, keyboard-visible, dark-theme-compatible, and print-safe styling for the shared navigator.
- Added rendered-route regression coverage for all generated Unit 2 routes, the focused derivative articles, metadata, navigation, indexability, count-free directories, and existing visual/print boundaries.

## Validation evidence

Windows validation of the exact implementation tree:

- ESLint: pass with generated output excluded by the repository lint contract.
- TypeScript: pass with `tsc --noEmit`.
- Production vinext build: pass.
- Cloudflare Pages package preparation: pass.
- Full test suite: `191/191` pass.
- Answer checks: pass for the committed Limits exercise and exam-key inventories.
- Visual checks: pass for Limits, Unit 2A, and Unit 2B authored and compiled artifacts.

Pi-native validation of commit `06a9374`:

- Locked dependency install: pass with no lockfile changes.
- `corepack pnpm run lint`: pass.
- `corepack pnpm exec tsc --noEmit`: pass.
- `corepack pnpm run build:pages`: pass.
- Generated Pages Worker SHA-256: `e19e3eeef4820e5bfc22091e67404b6469f09717984f5c49eff0044334ac58cc`.
- The all-files test command reached Node's default 2 GB heap limit late in `rendered-html.test.mjs`; no assertion had failed before the process-level allocation failure.
- The complete rendered-route file was rerun on the Pi with `--max-old-space-size=4096`: `27/27` pass. Together with the completed all-files run, this exercises the entire committed suite on the Pi without treating the resource failure as a product pass.
- Worktree status after generation, build, and tests: clean.

## Security, privacy, and SEO boundaries

- No answer corpus or server-only solution payload was added to public artifacts.
- Existing same-origin answer and reveal endpoints remain unchanged.
- `robots` remains `index, follow`; the sitemap, canonical URLs, analytics tag, and greater-or-equal identity assets remain covered by rendered tests.
- The navigator is ordinary semantic HTML and CSS. It adds no client dependency or hydration requirement.
- Heavy graph renderers remain behind the existing lazy capability gates and bundle tests.

## Release gate

The implementation is eligible for a private Sites candidate. The exact candidate URL and Sites version must be recorded in MCP after creation and browser QA. The repository runbook requires explicit owner approval of that exact candidate before merging to canonical `main` or publishing through Cloudflare. Production remains unchanged until that approval is recorded.

## Rollback

Before production, discard the private Sites candidate and leave canonical `main` unchanged. After an approved merge, revert the implementation commit (and this record commit if desired), rebuild from the previous `main`, publish through the normal Pages deployment path, and verify the Unit 2 hubs plus a deep route from each half. No database, DNS, credential, or migration rollback is required.
