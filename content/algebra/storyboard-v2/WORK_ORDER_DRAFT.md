# Work order draft

**Key:** `WO-2026-07-27-BETTERGRADES-ALGEBRA-FULL-COURSE-INSTALL-001`  
**Project:** `bettergrades`  
**Risk:** High - large content and route expansion with shared course-unit extraction  
**Human approval required:** Yes  
**Git commit required:** Yes  
**Production push allowed:** No, until exact private preview is approved

## Objective

Install the complete BetterGrades Algebra storyboard as a 15-unit, 139-lesson, visual-heavy full course using the accepted BetterGrades unit, assessment, registry, learning-graph, and BVLP architecture. Preserve all current public routes and compact Algebra guides.

## Allowed paths

- `content/algebra/**`
- `lib/course-units/**`
- bounded Algebra unit adapters under `lib/algebra/**`
- compatibility-preserving shared unit changes under `lib/calculus/**`
- `app/CourseUnitPages.tsx` and thin existing wrappers
- bounded catch-all routing changes
- `tools/**` for generic/algebra import, visual, graph, audit, and evidence tooling
- `tests/**`
- `docs/algebra/**`
- generated public visual/download paths owned by manifests
- exact registry, sitemap, search, learning-graph, package-script, and style changes required by the course

## Forbidden paths and actions

- credentials, secret stores, browser profiles, student data, unrelated projects
- new Cloudflare Pages project, DNS records, or analytics identifiers
- destructive rewrites of existing Calculus or Algebra guide content
- production deployment before owner approval
- global import of Compute Engine, JSXGraph, uPlot, or whole-course scene registries
- weakening tests or deleting evidence to make counts pass

## Acceptance criteria

Use `QA_ACCEPTANCE.md` verbatim as the acceptance contract. The exact course inventories in the CSV registries are binding unless the final collision audit produces a documented, owner-reviewed correction.

## Expected artifacts

- implementation report and commit ledger
- route and collision report
- mathematical verification
- current-site preservation diff
- visual/accessibility/performance/print reports
- assessment security and no-leak report
- learning graph and SEO reports
- private preview binding
- rollback plan

## Stop conditions

Any current-site regression, unresolved canonical collision, abbreviated lesson, placeholder visual, answer/source leak, failed full test suite, exceeded budget, or missing exact-preview owner approval.
