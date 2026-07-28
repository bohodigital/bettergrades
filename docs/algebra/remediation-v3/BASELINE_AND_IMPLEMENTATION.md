# BetterGrades Algebra remediation v3

## Audited baseline

- Canonical starting commit: `186c23ce6177c23fe3104247377b0ff0f515745c`
- Starting tree: `670df16b83f58b299768f3ce43bdcb45d94a5182`
- Inventory preserved: 15 units, 139 lessons, 226 Algebra course routes, 509 earlier canonicals, and 732 combined public routes
- Visual inventory preserved: 417 figures, including 9 bounded interactives
- Editorial inventory preserved: 695 exercise-family briefs and 55 assessment briefs
- Baseline build: passed for all 732 routes
- Baseline focused tests: 60/60 passed
- Baseline learning-graph check: failed because the generated relationship outputs had drifted

The baseline was held because the public course rendered authoring directions, repeated generic visual scaffolds, question-family ranges instead of concrete questions, literal `undefined` in every unit-hub description, stale sitemap classification and dates, and incomplete release evidence.

## Implemented boundary

The source storyboard remains a private authoring input. `tools/import-algebra-course.mjs` now compiles it into three distinct layers:

1. finished public lesson records;
2. public concrete question banks and materialized assessment inventories;
3. server-only scoring criteria and worked solutions.

Private lesson records are generated under `content/algebra/authoring/`. Public lesson records no longer contain story beats, example targets, exercise-family counts, grading policies, answer boundaries, or editorial visual roles.

## Learner-content contract

Every one of the 139 lessons now contains:

- one opening situation and purpose;
- exactly three prerequisite checks;
- at least three substantial explanation paragraphs;
- definitions with validity conditions;
- three complete worked examples (calculation, second representation, and transfer);
- concept-specific figures;
- one structured misconception and repair;
- a checkpoint;
- 16 concrete practice questions;
- exactly two exit questions;
- a takeaway, conditions, navigation, and rights-separated source record.

The course contains 2,224 unique concrete questions. Every question has a complete prompt, hint, response type, skill, purpose, difficulty, error tags, remediation path, deterministic seed record, units/rounding policy, and a server-only solution reference.

All 55 assessments now declare an exact integer count and exact question IDs. The generated server layer contains 2,224 matching scoring and worked-solution records.

## Visual contract

All 417 visuals are regenerated as mathematical scenes rather than repeated three-panel diagrams. Each unit includes a semantic-manifest collection naming the learning claim, required objects, labels, relationships, renderer, fallback, accessibility reading order, forbidden forms, and machine assertions.

The signed-number interactive is now a real one-dimensional number line. The other eight bounded interactives retain their exact parameter families. Every scene has a deterministic SVG fallback below the 50 KB asset target.

## Information architecture and release boundary

Algebra routes are classified by route role into course hubs, unit hubs, lessons, reviews/practice, mastery checks, investigations, and answer keys. Sitemap dates come from the repository’s revision date rather than a hard-coded historical value.

The learning-graph relationship products and graph were regenerated. Production remains prohibited until the exact owner-only preview is approved. The production phase must still bind the approved preview commit/tree to the merge tree, immutable Cloudflare deployment, live-host verification, API matrix, and rollback record.
