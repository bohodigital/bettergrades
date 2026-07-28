# BetterGrades Algebra installation audit

**Audit date:** 2026-07-27  
**Canonical project:** `bettergrades`  
**Audited commit:** `f04574b0052824348f7bf6fa5dfaf246e504109e`  
**Git state at audit:** clean `main`, synchronized with `origin/main`

## Executive judgment

The site is ready to receive the Algebra course, but the old storyboard cannot be installed through the old compact-article path. BetterGrades now has two different curriculum layers:

1. a compact guide library, which currently owns Algebra; and
2. a full course-unit system, which currently owns the released Calculus textbook units.

The Algebra storyboard contains 15 units, 139 lessons, 417 visual briefs, cumulative assessments, repair routing, investigations, and a full course narrative. Stuffing that into `lib/algebra/*.ts` as another pile of `algebraArticle(...)` records would preserve the wrong architecture and turn the registry into a hostage situation. The install must use the full course-unit model.

## What the audit found

| Surface | Current condition | Installation consequence |
|---|---|---|
| Repository | Canonical Pi checkout is clean at `f04574b0052824348f7bf6fa5dfaf246e504109e`. | Safe baseline for a new governed branch and private preview. |
| Production governance | Existing Cloudflare Pages project and domains are protected; any content/design change requires a new private preview and owner approval. | No direct production deploy from the package. Build, verify, preview, obtain approval, then release. |
| Public information architecture | The current release contains 509 canonical routes, a typed registry, search, sitemap, analytics, glossary, resources, and a generated learning graph. | Algebra must register once in the authoritative registries and regenerate the graph; it must not create parallel discovery systems. |
| Existing Algebra | Six topic hubs, 36 compact guides, the Algebra Expression Checker, and six seed practice problems. | Preserve these as focused references and tools. They are not the full course. |
| Full-course precedent | Calculus units use normalized content artifacts, route records, server-only answers, route-local payloads, dedicated unit rendering, assessment APIs, and exact course navigation. | Algebra should enter through the same course-unit contract. |
| Visual platform | BVLP is static-first, renderer-neutral, accessible, printable, and route-scoped. | All 417 briefs must compile through VisualSpec/CompiledScene. Most remain static SVG; only 9 currently require bounded interaction. |
| Assessment boundary | Current full units keep answers and reveals server-side and require an attempt before a worked solution appears. | The Algebra checker may support evaluation/equivalence, but cannot be the whole course grader. Use the unit assessment runtime. |
| Learning graph | New content must receive durable IDs, canonical routes, concepts, skills, and reviewed literal relationships. | Generate `part_of`, `precedes`, `practices`, `references`, `full_version_of`, and `uses_tool` relationships from authoritative data. |
| Performance | Static visual routes must ship zero interactive runtime; SVG and route payload budgets are hard gates. | Do not hydrate a unit-wide registry or load interactive code globally. |

## Current live-product confirmation

The live course pages now present a unit map, a core textbook path, section overview, reading lens, explicit “notice / decide / avoid / check yourself” guidance, static visual descriptions, attempt-gated checks, and cumulative exercises. Algebra should inherit that grammar rather than revive the earlier article-only model.

## Principal gaps to close

1. **No Algebra full-unit index or unit payload assembler exists.**
2. **Current unit import/build scripts are calculus-specific.** They must be minimally generalized or wrapped without changing existing Calculus behavior.
3. **The current Algebra schema is too compact.** It cannot represent lesson outcomes, multiple exposition beats, route-scoped figures, cumulative exercise families, investigations, mastery gates, or repair routing.
4. **Current Algebra practice is only a six-item seed.** The storyboard defines 695 exercise families plus unit and course assessments.
5. **Two proposed unit roots collide intentionally with current topic hubs:** `/linear-relationships/` and `/rational-expressions/`. Unit routing must claim those roots while preserving all current child guides.
6. **The course root already exists.** Its canonical path must remain stable while its body becomes a course map first and compact-library hub second.
7. **Legacy guide-to-lesson relationships must be editorially reviewed.** Do not generate links from word similarity alone.

## Route impact

The install package defines **226 course routes**. Three canonical paths already exist: the Algebra course root and two topic roots claimed as unit roots. Therefore the package expects **223 net-new routes** and an approximate post-install canonical inventory of **732 routes**, before any later deliberate consolidation. The final generated route inventory is authoritative; this estimate is a planning target, not an excuse to ignore collisions.

## Audit verdict

**READY FOR GOVERNED INSTALLATION, WITH ARCHITECTURE ADAPTATION REQUIRED.**

The content plan is sound. The old delivery format is obsolete. The install should extend the accepted course-unit architecture, preserve the current Algebra guide layer, and prove that all existing public routes render identically before the new course is approved.
