# BetterGrades Algebra install storyboard v2.0

This package updates the complete Algebra editorial storyboard for the current BetterGrades production architecture.

## Primary files

- `01_INSTALL_HANDOFF.docx` / `.pdf` - audit, architecture, route decisions, QA, and installation order.
- `02_FULL_EDITORIAL_STORYBOARD.docx` / `.pdf` / `.md` / `.json` - complete 15-unit, 139-lesson editorial storyboard.
- `bettergrades_algebra_install_storyboard_v2_0.json` - enriched machine-readable install source.
- `route_registry.csv` - 226 planned course routes.
- `unit_registry.csv` - canonical roots and release phases.
- `lesson_registry.csv` - all 139 lesson routes and instructional metadata.
- `visual_authoring_briefs.csv` - all 417 figures with BVLP renderer and accessibility contracts.
- `exercise_manifest.csv` - all exercise families with server/public answer boundary.
- `assessment_manifest.csv` - unit and course assessment routes and policies.
- `legacy_content_policy.csv` - preservation rules for the current 36 compact Algebra guides.
- `learning_graph_seed.csv` - reviewed seed relationships; final graph remains generated from authoritative registries.
- `CODEX_MASTER_PROMPT.md` and `WORK_ORDER_DRAFT.md` - governed execution instructions.

## Audit result

The content is ready. The previous article-oriented install format is not. Algebra must be installed through the full course-unit architecture now used by Calculus, while retaining the current guide library as a concise reference layer.

## Planned inventory

- 15 units
- 139 lessons
- 417 visuals
- 9 bounded interactive figures; all others static SVG
- 226 course routes
- 223 net-new routes after existing-path reuse
- estimated post-install inventory: 732 canonical routes, subject to authoritative collision verification

Production deployment is explicitly outside this package. A new private preview and owner approval are required.
