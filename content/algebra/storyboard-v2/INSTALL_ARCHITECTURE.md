# Algebra installation architecture

## Canonical product decision

Install Algebra as a full course-unit corpus under the existing BetterGrades shell. Do not create a new application, route framework, search index, assessment engine, visual runtime, or analytics surface.

## Target data flow

```text
Editorial storyboard v2.0
  -> normalized Algebra unit source records
  -> strict import validation
  -> browser-safe route records
  -> server-only compiled lesson and solution records
  -> VisualSpec v1 / CompiledScene v1 / deterministic SVG assets
  -> route-local public payload
  -> shared CourseUnitPage renderer inside BetterGradesApp
  -> registry + learning graph + search + sitemap + structured data
```

## Required repository shape

```text
content/algebra/units/unit-a0/
...
content/algebra/units/unit-a14/
  routes.public.json
  unit-index.public.json
  pages.server.json
  pages.compiled.server.json
  assessments.public.json
  assessments.server.json
  assessment-sets.public.json
  assessment-sets.server.json
  exercise-answers.server.json
  visual-authoring-briefs.v3.json
  visual-specs.v1.json
  compiled-scenes.v1.json
  public-runtime-scenes.server.json
  provenance.json
```

Use the exact accepted artifact split already proven by the Calculus units. The names may be made subject-neutral only through a compatibility-preserving extraction. Do not fork a second incompatible schema because duplicating the same architecture under a different noun is how software becomes folklore.

## Minimal shared-core extraction

The preferred implementation is a bounded generic core:

- `lib/course-units/` for shared route, unit, page, search, and assessment contracts;
- `app/CourseUnitPages.tsx` for the shared renderer;
- thin `lib/calculus/*` wrappers that preserve existing imports and output;
- thin `lib/algebra/*` unit indexes and adapters;
- a subject-neutral importer/validator that accepts an explicit subject and unit allowlist;
- subject-specific editorial guidance and assessment policies supplied as data.

A direct copy of the Calculus implementation is forbidden unless an architectural review proves generic extraction is materially riskier. Either path must retain all existing public behavior and tests.

## Route rules

- Course root: `/subjects/math/algebra/`.
- Unit roots and all 226 routes are listed in `route_registry.csv`.
- Core lesson pages expose previous/next course navigation.
- Support pages return to the unit map.
- Reviews, practice, mastery checks, and answer keys are separately indexable routes.
- The final exam and answer key are separately routed.
- Unit routes resolve before legacy topic/article routes only for exact claimed paths.
- Current child guide routes remain unchanged.
- No redirects or destructive merges are allowed in this install without a separate intent review.

## Content page contract

Every lesson must render:

1. course and unit context;
2. one-sentence objective;
3. local prerequisite checks with exact repair links;
4. reading lens, notice, decide, avoid, and checkpoint guidance;
5. complete narrative exposition from the storyboard;
6. route-scoped visuals with visible captions and long descriptions;
7. foundation, interpretation, and transfer examples;
8. attempt-before-reveal check;
9. cumulative exercises;
10. common mistakes and first-invalid-step analysis;
11. standalone takeaway;
12. previous/next navigation and related compact guides.

No lesson may be reduced to a title, three summary paragraphs, and one worked example. That format is useful for the existing guide layer, not for the canonical course.

## Assessment contract

- Public records contain prompts, choices, hints, rubric metadata, and attempt policy.
- Canonical answers and worked solutions remain server-only until routed through an approved key or reveal action.
- Every deterministic checker is bounded, fail-closed, and route-scoped.
- Free-response prose is never falsely declared uniquely machine-gradable.
- Existing Algebra Expression Checker may be linked where it literally supports evaluation, simplification, or equivalence.
- Equation, inequality, modeling, graph, and domain work uses the course assessment runtime rather than pretending the expression checker can adjudicate everything.

## Visual contract

- Author intent lives in `visual_authoring_briefs.csv` and strict VisualSpec records, never renderer code.
- Static SVG is the default and must communicate the complete core idea.
- BetterGrades Interactive 2D is allowed only for the 9 selected figures where manipulation is instructional.
- JSXGraph and uPlot are not required for the core Algebra install.
- Every visual has stable ID, route placement, title, visible caption, long description, reading order, non-color cue, responsive viewport, print mapping, and no-JavaScript fallback.
- Generic placeholder curves or generic three-note diagram scaffolds are rejection conditions.

## Search, SEO, and graph contract

- Every route receives a unique title, H1, description, canonical, index/follow, sitemap entry, search record, analytics, and course-oriented structured data.
- Course and unit names must not overwrite specific query intent in lesson titles.
- Existing compact guides remain searchable and are differentiated as “Quick guide,” “Method guide,” or “Direct answer.”
- A compact guide may point to one clear canonical full lesson with `full_version_of`; never assign multiple primary destinations.
- Related links are literal `practices`, `references`, `visualizes`, or `uses_tool` relationships.
- Generate and validate the learning graph; do not hand-edit generated graph output.

## Preservation gate

Before any new route is approved, the candidate must show:

- zero unexpected rendered-content differences across all current 509 canonical routes;
- zero route loss or accidental canonical change;
- no change to existing Calculus unit counts, checks, answer reveals, visual hashes, or route behavior except any explicitly reviewed generic import path;
- no new global visual runtime or whole-course payload;
- no raw source, answer, LaTeX command, provenance note, or registry leak;
- clean mobile, keyboard, no-JS, reduced-motion, dark-mode, and print behavior.

## Release phases

| Phase | Scope | Production rule |
|---|---|---|
| 0 | Shared course-unit adaptation, course root, unit shells, registries, collision audit | Private preview and preservation proof only |
| 1 | A0-A3: arithmetic, mathematical objects, equations, inequalities | May release only after owner approves the complete phase preview |
| 2 | A4-A5: linear relationships and systems | Same gated preview/release process |
| 3 | A6-A9: powers, polynomials, factoring, quadratics | Same gated preview/release process |
| 4 | A10-A13: rational, radicals/complex, functions, exponential/logarithmic | Same gated preview/release process |
| 5 | A14, course diagnostic, final exam/key, complete graph/SEO QA | Final whole-course acceptance preview required |

The preferred editorial outcome is a single coherent public course. The phased gates exist to constrain implementation risk, not to leave half the course permanently scattered across unmerged branches.
