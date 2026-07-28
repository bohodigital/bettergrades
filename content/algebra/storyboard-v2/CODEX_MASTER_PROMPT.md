# MASTER CODEX PROMPT - BetterGrades Algebra full-course installation

You are implementing the BetterGrades Algebra course from the attached `bettergrades_algebra_install_storyboard_v2_0.zip` package.

## Authority and baseline

- Canonical project: `bettergrades`
- Audit baseline: clean `main` at `f04574b0052824348f7bf6fa5dfaf246e504109e`
- Before changing anything, resolve the current canonical main branch again. If it has advanced, re-run the audit and preserve newer accepted behavior. Do not reset current work to the historical audit commit.
- Read `AGENTS.md`, `SITES-CLOUDFLARE-HANDOFF.md`, the governing Sites runbook, `SITE_AUDIT.md`, `INSTALL_ARCHITECTURE.md`, `QA_ACCEPTANCE.md`, and the full editorial storyboard.
- Create a clean review branch. Do not work across unrelated dirty paths.

## Objective

Install the complete 15-unit, 139-lesson Algebra course as a first-class sequenced course using the accepted BetterGrades full-unit architecture. Preserve the existing 36 compact Algebra guides, Algebra Expression Checker, current resources, and all Calculus units. Produce an owner-visible private preview and full evidence package. Do not deploy production without explicit owner approval for the exact preview commit.

## Non-negotiable architecture

1. Do not create a second application shell, route framework, search system, assessment runtime, visual platform, analytics system, or learning graph.
2. Do not encode 139 lessons as additional compact `algebraArticle(...)` objects.
3. Add normalized unit artifacts under `content/algebra/units/unit-a0` through `unit-a14` using the accepted public/server split.
4. Extract only the minimum subject-neutral course-unit core needed to reuse the full-unit pipeline. Preserve existing Calculus imports through compatibility wrappers and prove zero rendered-content change on current routes.
5. Course and unit route records must be browser-safe. Canonical answers, worked solutions, answer-key source bodies, and provenance remain server-side until explicitly routed through approved keys or attempt-gated reveals.
6. Author visuals as strict VisualSpec v1 and compile them through BVLP. Static SVG is the default. Use BetterGrades Interactive 2D only for figures marked interactive in `visual_authoring_briefs.csv`. Do not use JSXGraph or uPlot unless an exact figure requirement proves the core renderer insufficient and an architectural review approves the change.
7. Preserve every current Algebra guide child route. The course root and the A4/A10 claimed roots retain their canonical URLs. No destructive redirect or content merge is allowed in this work.

## Editorial fidelity

The JSON and full editorial storyboard are authoritative. Each lesson must include its complete narrative beats, outcomes, local prerequisites, visual sequence, worked-example ladder, exercise families, misconceptions, checkpoint, exit check, and bridge. Do not summarize the lesson into the existing compact guide archetype. Do not ask Codex to invent substantive exposition; use the exact storyboard and flag genuine gaps for editorial resolution.

## Route and registry requirements

- Implement exactly the inventory in `route_registry.csv`, subject to an authoritative collision audit.
- Expected course inventory: 226 routes; expected net-new count: 223; planning estimate after install: 732 canonical routes.
- Final generated route inventory is authoritative and must explain any variance.
- Register durable subject/domain/unit/lesson/assessment/visual IDs.
- Generate search, sitemap, canonical metadata, structured data, analytics, and learning graph records from authoritative content.
- Use only reviewed literal relationships. A compact guide may have at most one primary `full_version_of` lesson.

## Assessment requirements

- Implement the review, practice, mastery, investigation, diagnostic, and exam inventory in `assessment_manifest.csv`.
- Reuse the deterministic attempt-gated course assessment boundary.
- The Algebra Expression Checker may support evaluation, simplification, and equivalence only where appropriate; it is not a substitute for equation, inequality, graph, modeling, or domain grading.
- Open conceptual responses may return `uncertain`; never pretend one prose wording is uniquely machine-provable.

## Visual requirements

- Implement all 417 stable figure briefs.
- Exact instructional relationship is required; generic placeholders fail acceptance.
- Every scene includes title, visible caption, long description, reading order, non-color cues, responsive viewport, no-JS fallback, print mapping, and route placement.
- Static visual routes load no visualization JavaScript.
- Interactive routes hydrate only the requested scene and retain the exact static fallback on failure.

## Phased execution

Commit and validate in bounded phases:

0. Shared course-unit adaptation, collision inventory, course/unit shells, and preservation tests.
1. A0-A3.
2. A4-A5.
3. A6-A9.
4. A10-A13.
5. A14, diagnostic, final exam/key, complete graph/SEO/resource QA.

Do not leave production in a partially migrated mixed architecture. A phase may receive a private preview, but production release requires the owner-approved scope and exact preview commit.

## Required evidence

Produce:

- exact starting and final commits;
- changed-file ledger by phase;
- generated route inventory and collision decisions;
- content/lesson/assessment/visual counts;
- mathematical verification report;
- legacy guide preservation and relationship map;
- visual renderer inventory, hashes, budgets, and browser grid;
- accessibility, keyboard, no-JS, reduced-motion, mobile, dark-mode, and print reports;
- search, sitemap, canonical, structured-data, analytics, link-graph, and orphan reports;
- current-site rendered-content preservation report;
- build/test/browser commands and exact results;
- rollback instructions;
- owner-visible private preview URL tied to the exact candidate commit.

## Stop before production

After the complete candidate passes all acceptance gates, deploy only an owner-visible private preview and report the exact commit, inventory, evidence, and preview URL. Do not merge or deploy production until the owner explicitly approves that exact preview.
