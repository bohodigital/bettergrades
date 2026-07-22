# Unit 4A production postmortem

## Decision

Unit 4A is accepted in production at merged commit `9af98dc2106fed1e36d2250f9ff7855f39e3d414` and immutable deployment `https://23816f0f.bettergrades-vhc.pages.dev`. The release exposed bounded print and no-JavaScript delivery defects, but no broad defect requiring replacement of the accepted calculus importer, assessment boundary, BVLP runtime, site shell, or Cloudflare lane. Unit 4B may proceed on a separate branch from this accepted production main.

## Source intake, routes, and search ownership

The v3 archive passed its checksum, ZIP-safety, schema, handoff, PDF, and rights checks. The installer preserved nine exact Unit 4A handoff artifacts with a generated checksum manifest. The normalized package was internally consistent, but it could not decide live ownership by itself.

Live reconciliation produced three permanent redirects from the old `sequences-series` hub and its superseded geometric-series and test-selection guides. The narrower harmonic-divergence and ratio-versus-root guides were retained as distinct deep dives. The two legacy power/Taylor guides were deliberately left unchanged for Unit 4B review. No numbered suffix, duplicate search intent, or thin-page deletion was introduced.

## Semantic and formal-math rendering

The existing normalized-handoff importer handled the 34 routes without a new parser. Formal math, structured exposition, quick checks, visuals, exams, and keys passed the visible-source scans. The release did expose a delivery gap outside the content importer: JavaScript-disabled lesson responses initially showed only the loading shell even though the static lesson data and SVGs existed.

A synchronous-import experiment fixed visibility but grew the ordinary app bundle to 937,854 bytes and failed the established 500 KB gate. It was reverted. The accepted repair adds a server-light, static lesson fallback while keeping route bodies and specialist visual code out of the ordinary client bundle. Follow-up passes normalized titles, structured markup, and piecewise math. True browser content-setting tests then showed the H1, full lesson body, and static SVGs with the interactive shell hidden.

## Assessments and public/server separation

The 22 lesson checks, three assessment sets, two exams, and two complete answer keys preserved the existing attempt-and-reveal contract. Public artifacts contain prompts and hints but no canonical answers, worked solutions, rubrics, model responses, or server paths. No interval-equivalence or series-equivalence defect was observed in Unit 4A. Unit 4B must nevertheless add explicit endpoint-versus-radius and Taylor-bound audits because those are new mathematical failure modes.

## Visual authoring and renderer selection

All 18 VisualSpecs compiled through the existing BVLP path: 11 static-first scenes and seven BetterGrades Interactive 2D scenes, each with an accessible content-addressed SVG and print fallback. No JSXGraph, uPlot, 3D, arbitrary callback, vendor API, or new dependency was needed. Screenshot and mobile review found no unresolved label overlap, clipping, dark-theme defect, reduced-motion defect, or horizontal overflow. Production browser review confirmed both lesson visuals load at their natural 960 by 558 dimensions.

## Print, mobile, accessibility, and themes

Print review found two defects after the first candidate: the site footer appeared in lesson printouts and the sticky header repeated across pages. Both were removed from print without changing screen navigation. The accepted PDF showed no clipped text, overlapping labels, broken tables, black glyph boxes, or repeated chrome.

Desktop and 390 by 844 browser checks passed with equal document/client widths, visible headings, accessible navigation, loaded styles, and no console errors. Light, dark, reduced-motion, keyboard, static-fallback, and screen-reader text contracts passed the candidate suite. The no-JavaScript fallback remains a separate required gate because ordinary responsive testing did not reveal that defect.

## Build, Worker, indexing, and production behavior

The exact merged tree passed lint, TypeScript, the Pages build, visual and handoff checks, and 226 of 226 tests with the established 3,072 MB Node heap. Existing build warnings remain for large chunks and direct `eval` inside the installed JSXGraph parser; Unit 4A adds no JSXGraph scene and did not worsen either contract.

The immutable deployment, Pages domain, apex, and `www` each returned 200 for the home page, Unit 4A map, representative lesson, robots, and sitemap; an unknown route returned 404. The representative lesson retained its canonical URL, `index, follow`, analytics, complete server lesson body, static SVGs, CSS asset, `X-Content-Type-Options`, and `Referrer-Policy`. The Worker APIs, answer-reveal boundary, canonical redirects, search records, and sitemap tests passed.

## Remediation passes

1. Installed and imported the normalized Unit 4A handoff.
2. Registered exact Unit 4A route and visual inventories in the Pages tests.
3. Removed the site footer from printed lessons.
4. Tested and rejected the synchronous no-JavaScript import because it broke the bundle gate.
5. Reverted the failed architecture experiment without weakening tests.
6. Added the server-light static textbook fallback.
7. Normalized fallback titles and lesson markup.
8. Reduced the fallback payload while retaining full visible content.
9. Repaired piecewise-math fallback rendering.
10. Removed the repeated sticky header from print.
11. Rebuilt, republished, and verified the exact merged tree on all production origins.

## Time and usage evidence

The repository does not instrument model-token use or reliable per-phase elapsed time, so no estimate is invented. Durable timestamps exist in Git commits, GitHub checks, Sites version metadata, the Cloudflare deployment, and MCP request `CR-2026-07-21-BETTERGRADES-UNITS-4A-4B-RELEASE-001`. The full merged-tree validation took about 320 seconds on the Pi; production deployment took about 29 seconds.

## Automation required before Unit 4B

- Add `unit-4b` to the handoff installer, importer, author/compiler dispatch, exact visual inventory, runtime registries, course navigation, search, sitemap, and assessment registries in one bounded release branch.
- Run the complete suite with `NODE_OPTIONS=--max-old-space-size=3072`.
- Keep a raw-response, JavaScript-disabled lesson-body and SVG assertion.
- Keep print assertions that exclude both site footer and sticky header.
- Independently test endpoint convergence after the radius calculation.
- Audit every Taylor response for polynomial construction, numerical value, error bound, bound interval, and proof of convergence to the source function.
- Require all 20 Unit 4B visuals to use the existing 14-static/six-interactive allocation unless an owner-approved ADR says otherwise.
- Review actual desktop, 390 px mobile, dark-theme, print, and lazy-loaded visual behavior before creating the owner-only candidate.

## Practices not to repeat

- Do not fix no-JavaScript delivery by importing every route body into the ordinary client bundle.
- Do not treat a green JavaScript-enabled browser as proof of server-readable lesson content.
- Do not allow site chrome to repeat in textbook print output.
- Do not trust an offline collision matrix without comparing the live registry, search index, sitemap, and existing redirects.
- Do not weaken bundle, leak, or reveal tests to accommodate a content release.
- Do not start Unit 4B from the old Unit 4A feature branch; branch only from accepted production main.

