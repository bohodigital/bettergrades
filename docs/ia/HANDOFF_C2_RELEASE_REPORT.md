# BetterGrades Handoff C2 release report

Work order: `WO-2026-07-26-BETTERGRADES-HANDOFF-C2-LEARNING-PATHS-001`

## 1. Handoff 1 provenance and acceptance

- Accepted Handoff 1 merge: `bf5751658b0b86fae1a777f9147788161ac18085`
- Accepted Handoff 1 tree: `a562b9fd9cc40fef34f8cac49c695dd4993d1c7a`
- Accepted Handoff 1 immutable deployment: `https://d40825cc.bettergrades-vhc.pages.dev`
- Handoff 1 PR: `#50`
- Handoff 1 was independently reviewed, merged separately, rebuilt from merged `main`, deployed, and verified before Handoff 2 began.

## 2. Starting Handoff 2 state

- Branch: `feat/bettergrades-handoff-c2-learning-paths-20260726`
- Starting commit: `bf5751658b0b86fae1a777f9147788161ac18085`
- Starting tree: `a562b9fd9cc40fef34f8cac49c695dd4993d1c7a`
- Audit source: `12e9983d429c4b6411ecf55591298fffb7874f03`
- Work was performed in an isolated worktree.

## 3. Relationship decisions

- All 78 short-form instructional articles have an explicit decision.
- Three exact article-to-textbook matches were approved; 75 were deferred.
- All 328 textbook lessons were evaluated across five companion roles, for 1,640 explicit evaluations.
- Seventeen exact lesson companions were approved; 1,623 evaluations were deferred or had no exact candidate.
- Public placements enforce one primary and at most three secondary destinations.
- Provisional relationships remain in editorial data and do not render.

## 4. Navigation, homepage, and hubs

- Global navigation is reconstructed around Learn, Practice, Resources, and Search with desktop/mobile parity.
- The homepage leads with the approved identity, direct search, three learner paths, and the published Algebra and Calculus subjects.
- Course, unit, topic, practice, and resource hubs now communicate learner purpose and keep textbook lessons primary.
- `/practice/` is organized by worksheets, worked problems, quizzes and assessments, and practice exams.
- `/resources/` exposes the complete library with course, unit, topic, type, and difficulty filters.
- Breadcrumbs reflect the conceptual learning hierarchy.

## 5. Findability and internal links

- Canonical routes: 509.
- Orphan canonical routes: 0.
- Important routes beyond four meaningful navigation clicks: 0.
- Internal-link totals and contextual-link counts are recorded in `artifacts/ia/handoff-c2-internal-link-graph.json`.
- No canonical URLs, sitemap segmentation, index policy, or PDF canonical headers changed.

## 6. Analytics

- One GA4 loader, one GA4 configuration, and one Umami loader are preserved.
- New navigation and relationship events were verified through both sinks.
- Exact-once behavior, Do Not Track suppression, navigation without analytics, and the sensitive-data denylist passed.

## 7. Validation

- Full repository suite: 281/281 passed.
- Browser release matrix: 18/18 passed.
- Rendered-DOM audit: 509/509 routes passed.
- Crawl audit: zero H1, main, redirect, leak, malformed-math, or crawl failures.
- Semantic graph: 495 instructional/resource nodes and 8,696 relationships; 5,838 public and 2,858 provisional after removing broad rendered relationships and adding the 20 exact C2 approvals.
- TypeScript: pass.
- ESLint: zero errors and three inherited unused-parameter warnings.
- Production Pages build: 509 canonical routes and 135 one-hop redirects.

## 8. Candidate preview, review, PR, merge, and production

Handoff 2 completed every release gate:

- Pull request: `#51`
- Reviewed candidate commit: `863841b87a43c31be76b5d517938bcc405b7ee80`
- Reviewed candidate tree: `05472147834d17563a435318ed3611653e25ef2f`
- Merge commit: `61463a9d26fcf5fe8c4bc32658675b4b056dd8d8`
- Final merged tree: `05472147834d17563a435318ed3611653e25ef2f`
- Merged-tree equality: the merge tree exactly equals the reviewed candidate tree.
- Normalized Pages build hash: `9953ef1faa37e24ca45decfd741bc363685f0416ddd3809b89dacad92eaadd3d`
- Owner-only preview: `https://better-grades.mankopoppi.chatgpt.site`
- Sites version: `52`
- Sites version ID: `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_23c1be972be481919ad1ab3c72563fc4`
- Sites deployment ID: `appgdep_6a65a0c6a548819191f006d18f147587`
- Sites source commit: `863841b87a43c31be76b5d517938bcc405b7ee80`
- Sites package SHA-256: `7864921c63a4e1954c2a1361a0bbe2bf4094597a4665101585062ca344b81180`
- Sites archive content hash: `b92943547ca3eecf70b12dbf84226da3b58008874d01382db4515d48399d8cb5`
- Independent review: `SHIP`
- GitHub validation: passed.
- Exact merged-main repository tests: 281/281 passed.
- Final browser verification: 18/18 passed.
- Analytics verification: passed with exactly-once GA4 and Umami delivery, Do Not Track suppression, and the sensitive-data denylist.
- Cloudflare deployment timestamp: `2026-07-26T06:05:27.784392+00:00`
- Immutable deployment: `https://dfd06155.bettergrades-vhc.pages.dev`
- Stable Pages: `https://bettergrades-vhc.pages.dev`
- Apex: `https://bettergrades.net`
- WWW: `https://www.bettergrades.net`
- Live HTTP verification: 8/8 sampled release endpoints returned HTTP 200, including immutable, stable, apex, WWW, Calculus, Practice, Resources, and Search.

The deployment used the existing BetterGrades Cloudflare Pages project and fixed
credential wrapper. It did not change DNS, bindings, credentials, analytics
identifiers, ownership, billing, or retained deployments.

The two earlier blocked audit shells,
`WO-2026-07-25-BETTERGRADES-HANDOFF-C1-PREVIEW-AUDIT-001` and
`WO-2026-07-25-BETTERGRADES-HANDOFF-C1-AUDIT-RECOVERY-002`, remain preserved
as history. They were blocked by evidence-access and work-order serialization
problems, not by a technical rejection of the candidate. Handoff 1 was later
independently reviewed and accepted through PR `#50`; Handoff 2 was independently
reviewed as `SHIP` and merged through PR `#51`.

## 9. Rollback

Preserve every accepted immutable deployment. The rollback sequence is:

1. Revert the Handoff 2 merge normally without rewriting history.
2. Rebuild exact clean Handoff 1 commit `bf5751658b0b86fae1a777f9147788161ac18085`.
3. Redeploy it through the governed BetterGrades Cloudflare wrapper and verify
   `https://d40825cc.bettergrades-vhc.pages.dev`, stable Pages, apex, and WWW.
4. If an earlier recovery point is required, preserve and use Release B at
   `https://7029f1e2.bettergrades-vhc.pages.dev`.

Do not alter DNS, bindings, credentials, analytics identifiers, ownership,
billing, or retained deployments.

## 10. Handoff 3 locked queues

- `data/ia/handoff-c3-intent-conflict-review.csv`
- `data/ia/handoff-c3-title-opening-review.csv`
- `data/ia/handoff-c3-template-friction-review.csv`
- `data/ia/handoff-c3-merge-redirect-candidates.csv`

No Handoff 3 title, opening, merge, redirect, or template-compression decision was resolved in Handoff 2.
