# Unit 3A production postmortem

## Decision

Unit 3A is accepted only after its adversarial-review remediation is merged, republished, and live-verified. The review found bounded assessment and compiled-content defects, not a broad defect requiring replacement of the accepted calculus, assessment, BVLP, site-shell, or Cloudflare architecture. Unit 3B may proceed only after the corrected release, this postmortem, and its revised plan are merged into canonical `main`.

## What the release exposed

### Intake and mapping

The archive itself was safe and internally consistent. Two normalized-data assumptions were not safe to carry into production unchanged:

- several handoff SEO descriptions ended mid-word near a length boundary; lesson metadata now uses a complete route-specific Better Grades fallback;
- route records had empty visual identifier arrays even though the visual-authoring brief carried exact route mappings; the importer now derives and validates those mappings from the authoritative visual brief.

There were no route collisions. Existing integration-technique articles were preserved at their canonical paths and connected below the new textbook map. No thin page was silently deleted or merged.

### Semantic rendering

The generic Unit 2 importer assumed a legacy source layout. It was generalized to accept the normalized Unit 3 artifact contract while retaining Unit 2 behavior. Unsupported structures still fail closed. Rendered route tests found no visible LaTeX, TikZ, PGFPlots, table-layout syntax, or source path.

The live verifier initially reported false raw-LaTeX failures because it treated hidden MathML `annotation` nodes as visible text. The verifier was corrected; the application was not changed for that false positive.

### Assessment equivalence

Antiderivative checks needed explicit arbitrary-constant handling. `C`, `K`, and equivalent named constants normalize at the server boundary, while a missing required constant remains wrong. Integral setup checks now compare coefficient, bounds, variable, and integrand structurally and return `uncertain` when parsing or proof is not supported.

No public answer, solution, model rubric, or server-only registry leak was found. Live cumulative-practice review confirmed that clicking without an attempt does not reveal an answer, and a written attempt authorizes only the requested reveal.

### Visual authoring

The first compiled pass exposed practical label and clipping defects:

- the convergence visual retained an extra clipped refinement rectangle;
- the midpoint/trapezoid visual leaked midpoint labels beyond the plot;
- the signed-velocity visual duplicated a curve label;
- substitution and parts diagrams carried noisy guide labels; and
- the moving-bound label competed with the plotted region.

All were corrected in the authored scene definitions before release. The final allocation stayed at seven static and four built-in interactive scenes. No specialist renderer or new dependency was justified.

### Print, responsive behavior, themes, keyboard, and motion

Static visual fallbacks, print rules, table bounds, reduced-motion logic, and keyboard contracts passed. Desktop light and dark themes passed. The interactive zoom control produced a live status update and hid—not removed—the static fallback. The available in-app browser could not create a true mobile viewport; this is an evidence limitation, not a passing mobile-device claim. Narrow-screen regression tests found no overflow.

### Build and performance

Unit 3A added no new runtime dependency, Cloudflare binding, persistent service, runtime model, arbitrary JavaScript, `eval`, or `Function`. Existing vinext warnings remain for a large client chunk and direct `eval` inside the installed JSXGraph parser. Unit 3A uses no JSXGraph scene.

The Pi full-suite process exhausted Node's default 2 GB heap near the end of the long rendered-HTML file. The build and other checks had passed, and the failed file passed when rerun with a bounded 4 GB heap on a Pi with adequate available memory. Unit 3B validation should set the bounded heap explicitly for the full suite.

## Remediation passes

1. Generalized normalized-handoff import without replacing legacy Unit 2 support.
2. Repaired visual-route mapping and clipped SEO metadata.
3. Added and reviewed Unit 3A visual definitions.
4. Fixed visual clipping, labels, and guide noise after actual screenshots.
5. Extended exact Pages visual inventory tests.
6. Added the missing integration-techniques collection gateway discovered by rendered navigation testing.
7. Rebuilt and reran the full local and Pi suites.
8. Reconciled owner-only Sites, GitHub checks, merged-tree equality, production deploy, primary-management SEO control, live crawl, and real-browser evidence.

## Time and usage evidence

The repository does not instrument model-token use or reliable per-phase elapsed time. No estimate is invented. Durable timestamps exist in GitHub Actions, Sites deployment metadata, Cloudflare audit logs, Git commits, and the work-order record. The economical choice was to rerun only the heap-limited Pi test file rather than repeat all already-green child processes.

## Automation required before Unit 3B

- Run the Pi suite with `NODE_OPTIONS=--max-old-space-size=4096`.
- Add Unit 3B to the exact visual inventory assertion when its manifest is introduced.
- Derive visual placement from the authoritative authoring brief and fail when a required route is unmapped.
- Apply complete generated SEO descriptions for normalized lesson routes instead of trusting length-clipped handoff text.
- Exclude non-rendered MathML annotation content from visible-source live checks.
- Keep all-origin semantic crawl and real-browser interaction as separate release gates.

## Practices not to repeat

- Do not trust an empty route `visual_ids` array when a separate authoritative mapping exists.
- Do not treat a hidden accessibility annotation as learner-visible source.
- Do not run the long Pi rendered suite at Node's default heap and then mistake process exhaustion for an assertion failure.
- Do not accept a deep-dive list that omits its collection gateway.
- Do not claim mobile browser evidence when only responsive code/tests were available.
- Do not start Unit 3B until this postmortem and the revised plan are merged.

## Fresh-context review

The required fresh-context reviewer independently verified the owner-contract hash, exact merged tree, route/check/exam/key/visual inventories, live route availability, sitemap, canonical/index/analytics identity, SVG fallbacks, and the public/server answer boundary. It blocked Unit 3B for three product findings and one evidence contradiction:

- arbitrary-constant normalization accepted only `C` and `K`, rejecting valid `c`, `D`, and `2C` forms;
- the structural integral-setup grader existed but no Unit 3A check exercised it;
- the common-errors page retained literal `\\item` commands in the compiled server artifact; and
- the merged release report still described evidence as pending even though the initial production release had occurred.

The remediation generalizes additive named-constant normalization while continuing to reject a missing constant, converts the rate-to-total quick check into a bounded equivalent-integral-setup check, removes residual list source during normalized-handoff compilation, expands the forbidden-source and assessment regression tests, and completes the release record. The fresh reviewer had no browser backend, so its visual-matrix limitation is retained alongside the primary browser evidence rather than converted into a pass.

The installed `handoff/` subtree remains a checksum-traceable historical intake snapshot and deliberately retains draft release fields and original metadata. Generated public registries are authoritative for release state and repaired descriptions; this distinction is documented to prevent reuse of the raw intake as production state.
