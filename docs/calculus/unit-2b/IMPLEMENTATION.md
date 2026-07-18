# Unit 2B implementation record

## Accepted architecture

Unit 2B extends the accepted Unit 2A production tree. Public route metadata is indexed separately from server-only semantic page bodies, assessments, answer reveals, provenance, and solution material. Unit routes resolve before colliding legacy registry records; the rest of the working content library remains intact.

The import produces typed semantic nodes rather than learner-visible TeX, TikZ, raw HTML, or executable source. Unsupported source constructs fail closed. Public search and route payloads contain no canonical exercise answers, source paths, CortexJS objects, or answer corpus.

## Inventory

- 76 unique routes and 57 ordered core routes.
- 22 quick checks and 8 assessment sets.
- 34 visuals: 27 static SVG scenes, 6 BetterGrades Interactive 2D scenes, and 1 explicitly activated JSXGraph scene.
- 10 exercise-first routes with 91 attempt-gated server-only supplied answers.
- two separately indexable practice-exam answer keys with 14 numbered answers each.
- 11 substantial application-model records carrying variables, units, assumptions, diagram need, governing relation, objective, feasible domain, derivative, candidates, boundaries, interpretation, and reasonableness.

Practice Exam B problem 14 explicitly requires the learner to name an assumption, explain a consequence if it fails, and identify a measurement or model improvement. Its prompt and key retain stopping-distance and medication-model contexts.

## Textbook and exposition structure

The hub leads with application-specific orientation and a nine-section map. Each section has a distinct Reading Lens and a coherent core sequence. Focused explorations appear below the map. The Unit 2A hub links forward to released Unit 2B, and Unit 2B links back to derivative foundations.

Learner-facing headings use `Section`; no `Chapter` terminology is introduced into web pages. Core pages, support pages, assessments, and explorations retain different editorial roles rather than being flattened into a list of worked examples.

## Visual authoring

All 34 scenes are named explicit definitions in `tools/visualization/unit-2b-visual-definitions.mjs`. Missing or extra definitions fail the authoring gate; no generic fallback scene is synthesized. Every scene has a static, accessible, print-safe SVG representation and route-scoped exposition.

The visual contact-grid review checked every asset and led to mathematical and label corrections, including exact extrema endpoint/critical values, a profit model whose marginal-revenue and marginal-cost curves meet at `q = 6`, a Cauchy MVT interval with the required quotient, shorter bounded graph labels, hidden redundant connector captions, and explicit shadow-diagram dimensions. On-canvas labels are concise while full accessible descriptions retain the instructional meaning.

The six core interactive scenes use the existing bounded BetterGrades renderer. The ladder scene uses the already pinned JSXGraph package through a minimal lazy adapter. It retains a static fallback, requires explicit learner activation, accepts only fixed authored geometry plus bounded controls, and performs no JessieCode or learner-expression evaluation. The package contains a direct `eval` in its unused JessieCode parser; the build warning is accepted only under these controls and the 180 KB gzip lazy-chunk gate.

## Assessment and leak boundary

Quick checks retain typed server evaluation. Exercise-first pages expose one opaque reveal identifier per exercise. The reveal endpoint requires the exact unit, route, reveal ID, and a nonempty attempt, and returns only the selected supplied answer. Exam answer keys are intentionally public, separately indexed, and linked prominently from both exam pages and the hub.

Tests reject canonical answer bodies, source paths, answer corpora, heavy renderer imports, build-only math compilers, and executable authoring source in public artifacts or client graphs.

## Infrastructure scope

No new runtime dependency, CDN, LLM, database migration, Cloudflare binding, deployment project, DNS record, credential, external account, or site-shell replacement is introduced. Production publication uses the fixed BetterGrades Pages project and wrapper. Read-only Cloudflare control-plane validation uses the primary management credential separately from the Pages deployment credential.
