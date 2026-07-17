# Limits unit editorial and visual polish

Date: 2026-07-17

Work order: `WO-2026-07-17-BETTERGRADES-LIMITS-EDITORIAL-VISUAL-POLISH-001`

Base: canonical BetterGrades `main` at `af9522889e8fd490ee8d876ea2254d7b5d4c059b`

## Outcome

This pass turns the Limits and Continuity unit's repeated introductory paragraph
and exercise-only pages into a more textbook-like reading experience. It does
not create a second content lane, replace the imported unit, add Unit 2A, or
weaken the server-only answer-check boundary.

The release adds four coordinated improvements:

1. a structured section overview on every instructional, diagnostic, quiz,
   practice, review, study, extension, and exam page;
2. source-traced native answer reveals for every supplied exercise answer;
3. route-scoped visual study stops that reuse the 13 verified BVLP scenes; and
4. deterministic collision-aware label placement plus labeled axes in the
   interactive renderer.

## Editorial model

The previous overview placed the section description, reading lens, and generic
navigation advice into one long paragraph block. The shared overview now gives
each idea a stable job:

- **Reading lens** asks the question that should remain active while reading.
- **Notice** gives a section-specific mental model.
- **Decide** names the mathematical decision the learner must make.
- **Avoid** names the section's most consequential misconception.
- **Use this page** changes with the page type, so practice, exams, references,
  quizzes, and lessons do not receive identical instructions.
- **Check yourself** supplies a concrete mastery criterion.

The eight section records contain original, concept-specific copy in
`lib/calculus/limits-unit-index.mjs`. Supporting pages resolve by their declared
support cluster instead of inheriting the next core page's section. This keeps,
for example, Meaning Practice in Section 1 rather than incorrectly presenting
it as finite-limit algebra.

## Exercise answer reveals

`tools/import-limits-exercise-answers.mjs` deterministically imports the existing
answer appendix into a route-scoped artifact. The build checks that artifact for
staleness. The public projection sends only the answers for the current route;
the global route/search index still contains no page bodies or answers.

| Route family | Answers |
| --- | ---: |
| prerequisite diagnostic | 20 |
| Section 1 practice | 42 |
| Section 2 practice | 58 |
| Section 3 practice | 38 |
| Section 4 practice | 40 |
| Section 5 practice | 48 |
| Section 6 practice | 18 |
| cumulative practice | 52 |
| practice exams A and B | 32 |
| **Total** | **348** |

Every exercise receives its stable source-order number on the server. The page
renders a native HTML `details` disclosure immediately below the prompt. This
works without client JavaScript, is keyboard accessible, and renders the same
safe inline mathematics used elsewhere in the unit. Exam answer-key routes stay
published and prominent; inline reveals are an additional correction workflow,
not a replacement for those complete keys.

## Additional visual placements

The visual inventory remains exactly 13 compiled VisualSpec scenes. This pass
adds instructionally relevant placements on previously text-heavy pages rather
than duplicating specifications or inventing a competing renderer. Each route
receives only its declared companion visual payload.

| Page | Visual study stop |
| --- | --- |
| What a Limit Means | removable hole |
| Section 1 practice | jump discontinuity |
| Section 2 practice | removable hole |
| Section 3 practice | sine over x |
| Section 4 practice | vertical and horizontal asymptotes |
| Continuity at a Point | limit versus function value |
| Bisection Method | IVT root |
| Section 5 practice | discontinuity gallery and IVT root |
| Epsilon-Delta Introduction | epsilon-delta window |
| Section 6 practice | epsilon-delta window |
| Cumulative Practice | discontinuity gallery |

The canonical migration route for each scene remains unchanged and is still
delivered exactly once through its authored graph node. Companion placements
are separately validated wrappers around the same safe public scene.

## Visual layout changes

Static SVG labels now use bounded, deterministic placement:

1. estimate the wrapped label box;
2. try six positions around the authored anchor;
3. reject positions that collide with an already placed label;
4. scan the plot for the first free bounded position when necessary; and
5. emit placement metadata that the automated overlap test verifies.

Annotations retain their anchor dot and gain a subtle leader line when the label
moves. All label boxes remain inside their plot. The enhanced interactive plots
now draw labeled axes, ticks, readable zoom button text, larger plot margins,
and the same collision-aware label treatment with a contrast halo. Visual
containers are width-bounded and centered in both canonical and companion
figures.

## Validation contract

Release validation covers:

- deterministic 348-answer import and source SHA-256 equality;
- one answer reveal per exercise on all ten answer-bearing routes;
- all eight section guides and support-cluster routing;
- the exact 13-scene canonical BVLP contract plus declared companion placement;
- bounded, non-overlapping label boxes in every generated SVG;
- TypeScript and focused ESLint checks;
- production build and complete Node test suite;
- no raw TeX or KaTeX errors across every Limits route;
- desktop and mobile browser checks for the map, overview, practice reveals,
  epsilon-delta visual, axes, labels, and horizontal overflow;
- owner-only Sites preview before Cloudflare Pages publication; and
- post-publish checks on the immutable Pages deployment and `bettergrades.net`.

Exact commit, preview, production deployment, and live browser evidence are
recorded in the work-order closeout report on the Pi.

## Rollback

Revert the release commit and rebuild. The content-addressed SVG manifest will
then point back to the prior 13 assets. No database, schema migration, DNS,
credential, or environment-variable rollback is required. Existing full exam
answer-key routes and the original imported LaTeX source are not removed by this
release.
