# Unit 2A route decisions

## Canonical root

`/subjects/math/calculus/derivatives/` is the Unit 2A landing page and main textbook map.

Its learner-visible order is:

1. What the unit teaches.
2. Prerequisites.
3. The complete 49-page sequence, including the overview as page 01.
4. Progress and a 9-12 hour pacing estimate.
5. Reviews, quizzes, diagnostics, cumulative practice, and exams.
6. Prominent separately routed answer keys.
7. Optional advanced explorations and focused articles.

The unit map uses `Section`, never `Chapter`, and every section includes a readable Lens block.

## Ownership and collision handling

- Unit routes are resolved before legacy topic/article registry routes.
- Legacy registry records whose paths are claimed by Unit 2A are filtered from search and topic routing.
- Non-conflicting legacy guides remain unchanged and are covered by the original document-render tests.
- Every Unit 2A path, ID, title, and canonical is unique.

## Navigation

- Core pages expose previous and next course links.
- Supporting resources return to the main unit map.
- Exam pages link prominently to their answer key.
- Both answer keys are independent, indexable routes with 14 numbered answers each.
- Unit 2B is not linked as released until its separate release gate passes.

## SEO contract

All 67 routes emit a unique title, H1, description, canonical URL, `index, follow`, sitemap entry, search record, analytics script, and course-oriented structured data. No route uses `noindex`.
