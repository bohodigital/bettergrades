# BetterGrades Handoff C1 release report

Work order: `WO-2026-07-24-BETTERGRADES-HANDOFF-C1-FINDABILITY-001`

## 1. Starting repository state

- Canonical Pi `main`: `bd8c106e74f203f68e2f27595523610c4a911c39`
- Starting tree: `badf00de3bad5d9c348275d8d09b8fdb24a82c92`
- Isolated worktree: `worktrees/bettergrades-handoff-c1-findability-20260724`
- Branch: `feat/bettergrades-handoff-c1-findability-20260724`
- Canonical checkout and isolated worktree were clean before implementation.

## 2. Audit evidence consumed

- Audit commit: `12e9983d429c4b6411ecf55591298fffb7874f03`
- Audit tree: `576e3af606491210f47d76810a3e4b1c099d522c`
- Audit manifest SHA-256: `de960dfb665a42b3ee1bc8525684aeef122e5ac3723cff24c6b095da95e5e1cc`
- The immutable baseline, raw queues, audit documentation, deterministic runner, and machine reports were imported. Audit screenshots were excluded.

## 3. Files changed

The implementation changes the shared application shell, course/article/resource navigation, search core and records, package scripts, graph modules and generators, audit/evidence tooling, regression tests, governed data queues, and this documentation set. Generated public output is retained only where it is existing repository evidence.

## 4–6. Graph totals and publication boundary

- Instructional/resource nodes: 497
- Explicit non-instructional exclusions: 12
- Canonical routes covered: 509
- Relationships: 9,404
- Existing or approved relationships: 6,648
- Provisional relationships: 2,756
- Provisional article-to-lesson candidates: 234
- Provisional lesson-companion candidates: 2,522

Public queries reject provisional relationships. The browser receives only a compact generated projection of existing article relationships; the complete graph and editorial queues do not enter client JavaScript. No provisional candidate was mass-published.

## 7. Five unreachable-route repairs

The exact five-route baseline queue is recorded in `data/ia/handoff-c1-unreachable-route-fixes.csv`. Canonical anchors were added through the resource library and correct course/unit parents. Candidate audit result: zero completely unreachable canonical indexable routes.

## 8. Fifteen important-route repairs

The exact repair paths are recorded in `data/ia/handoff-c1-important-route-rescue.csv`. Limits supporting lessons are exposed through the topic/unit map; integration and sequence articles have ordinary canonical parent links; resource and practice destinations are discoverable without search. Candidate audit result: zero hidden important routes and every scoped route within four meaningful clicks.

## 9. Search repairs

Search now normalizes case, spacing, dashes, apostrophes, diacritics, and common mathematical punctuation. Ranking enforces exact title, short title, alias, former path, canonical fragment, concept, skill, title-token, topic/course, then body precedence. Role-specific labels are visible. The 2,390-query candidate audit reports zero exact-title failures, zero audited zero-result queries, zero alias gaps, and zero absent canonical records.

## 10. Navigation parity repairs

Desktop and mobile expose the same substantive Home, mathematics, calculus, practice, foundations exam, resource, and glossary destinations through ordinary anchors. The exact seven-item repair record is `data/ia/handoff-c1-navigation-parity-fixes.csv`. Candidate result: zero parity failures.

## 11. Analytics

Privacy-bounded GA4/Umami events cover search, zero results, search-result clicks, navigation destinations, and learning relationships. Dimensions contain stable page/result identifiers, roles, relationship type, placement, rank, and query where applicable. Do Not Track suppresses emission.

## 12. Validation

- Full repository suite: 267/267 passed.
- Browser matrix: 12/12 passed.
- Rendered-DOM audit: 509 routes, zero failures.
- Graph generation/check: 497 nodes, 9,404 relationships, pass.
- Search corpus: 2,390 queries, zero scoped failures.
- Build: 509 canonical routes and 135 one-hop redirects.
- TypeScript: pass.
- ESLint: zero errors; three pre-existing unused-parameter warnings.
- Resources: 10 flagship resources, 174 problems, 26 worked pages, 24 glossary pages.
- Public leak scan, SEO, crawl, link, sitemap, PDF/resource, no-JavaScript, keyboard, accessibility, analytics, and Do Not Track gates passed.

In-app browser QA additionally verified exact search, canonical metadata, one H1, one main, bounded purpose-labeled learning links, 390 px navigation parity without horizontal overflow, and zero console errors.

## 13–18. Release gates

Private preview, pull request, merge binding, exact merged-main rebuild, production deployment, live verification, and independent final review are recorded in the final release-binding and live-verification artifacts after those gates complete.

## 19. Rollback

Follow `docs/ia/HANDOFF_C1_ROLLBACK.md`. Restore the previous Cloudflare Pages production deployment through the governed BetterGrades wrapper; do not alter DNS, bindings, credentials, analytics identifiers, or retained Release B deployments.

## 20. Deferred Handoff 2 and Handoff 3 queues

- Handoff 2 article/lesson review: 234 rows.
- Handoff 2 ranked lesson-companion review: 1,040 rows selected from the 2,522 raw candidates.
- Handoff 3 same-role intent conflicts: 26 rows.
- Handoff 3 template-friction review: 55 rows.

These remain editorial queues. No conflict was automatically merged or redirected.
