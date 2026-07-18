# Unit 2A production postmortem

## Outcome

Unit 2A shipped as an additive extension of the accepted BetterGrades shell, search, assessment boundary, print lane, and BVLP infrastructure. The production result contains 67 unique routes, 49 ordered core pages, 34 quick checks, 7 assessment sets, 36 cumulative exercises with attempt-gated answers, two complete 14-item exam keys, and 27 compiled visuals. No Limits route, visual, answer key, reveal set, or navigation contract was removed.

The release was not accepted on build success alone. A private browser review rejected the first candidate, the visual authoring was corrected, the complete suite was rerun on Windows and ARM, an exact-tree private candidate was reviewed, PR 24 was merged, exact merged `main` was tested again, and the immutable Cloudflare deployment was verified across all production hosts.

## What went well

- The normalized archive, internal checksums, route inventory, provenance split, and rights records were verified before import. This prevented the source package from silently becoming runtime authority.
- Unit routes resolve before legacy registry routes, while conflicting legacy entries are filtered from routing and search. The 67 public intents remained unique without replacing the existing registry.
- The semantic content compiler eliminated raw HTML, raw TikZ, raw LaTeX commands, and drawing source from learner payloads. Unsupported environments fail closed.
- Public route payloads carry opaque reveal IDs instead of solutions. Unit, route, reveal ID, and real-attempt checks isolate each answer. Public exam keys remain deliberately separate and easy to find.
- The renderer-neutral VisualSpec to CompiledScene boundary supported 26 static-first scenes and one bounded interactive scene without adding a dependency or widening Cloudflare bindings.
- Exact inventory, public-artifact, leak, bundle, print, accessibility, SEO, and rendered-route tests made regressions measurable. The Limits unit remained an explicit regression target rather than an informal assumption.
- The release lane preserved exact source identity: reviewed tree `839f910b...` equals merged tree `839f910b...`, and deployed commit `36e0091b...` is the clean canonical Pi and GitHub `main`.

## What failed or cost more than expected

### Visual authoring fidelity

The largest miss was conceptual, not syntactic. The first pass satisfied schema and asset-count tests but converted detailed visual briefs into a generic three-note diagram scaffold and reused placeholder curve families. It was technically valid and pedagogically weak. Private browser QA caught the problem before merge.

The remediation replaced every placeholder relationship with the specific mathematical object required by its lesson: exact functions and derivatives, secants and tangents, inverse pairs, implicit curves, little-o comparisons, Darboux behavior, product and quotient contributions, chain-rule machines, and structured workflows. Centered-label placement was added within explicit collision boxes. The corrected asset set kept the same 27-scene and payload budgets.

Lesson for Unit 2B: schema validity is necessary but cannot establish instructional truth. Every visual brief needs a fidelity assertion naming the quantities, relations, objective, feasible domain, derivative/candidate structure, and required labels; the contact grid must be reviewed before a Sites version is saved.

### ARM test economy

The first unconstrained Pi run created severe temporary memory pressure during exhaustive route rendering. A later long-lived general render process reached Node's 2 GiB heap ceiling even after a serial route sweep passed. Nothing touched canonical `main`, but the run was economically poor.

The durable correction fixes test concurrency at one and isolates the large Unit 2A rendered-route sweep in a separate process so the heap is released. The exact candidate then passed 175/175 in 130.2 seconds with 6.9 GiB available and no swap use.

Lesson for Unit 2B: keep route families in separate Node processes, keep concurrency at one on ARM, and run the cheapest schema/inventory/leak gates before builds and exhaustive SSR.

### Browser timing and viewport evidence

Hydrated lesson pages briefly expose a loading shell. A first DOM measurement taken immediately after navigation reported a zero-sized figure even though the final page was correct. Waiting for the loading state to detach produced the real 760-pixel desktop card and 347-pixel mobile card measurements.

Lesson for Unit 2B: browser QA scripts must wait on semantic readiness, not network completion alone, and must record the actual viewport, document scroll width, figure bounds, and visible text state.

### Route and editorial normalization

The archive carried 67 route intents spanning hub, core, support, assessment, key, and exploration roles. The import could not simply register every artifact independently: the hub had to lead with the complete map, legacy path owners had to be filtered, extra articles had to remain below the textbook sequence, and learner-facing `Chapter` language had to become `Section` without altering the print source's LaTeX structure.

The accepted result has one canonical owner per path, continuous previous/next core navigation, support-resource returns, and separately linked answer keys. Thin support descriptions were expanded through route-specific section guides and Reading Lenses rather than by cloning one generic paragraph.

Lesson for Unit 2B: route accountability and editorial role are ingestion inputs. Do not postpone collision resolution, map order, Lens copy, or support/core classification until UI assembly.

### Assessment ambiguity and leakage

Expression, numeric, rational, multiple-choice, and rubric prompts need different validators. Treating all answers as strings would reject equivalents; treating all open responses as binary would fabricate certainty. Separately, including answer bodies in public registries would make an attractive UI leak answers before attempts.

The accepted grader uses typed normalization and server-only equivalence boundaries. Open conceptual checks use bounded rubric feedback. Public indexes omit answer bodies and source paths; the cumulative practice API returns one answer only after a nonempty route-scoped attempt.

Lesson for Unit 2B: every assessment item must declare validator type, accepted equivalence, ambiguity policy, reveal policy, and public/server ownership before import. Exam B problem 14 receives an explicit answer-key and leakage test.

## Defect classes checked and their disposition

| Area | Evidence and disposition |
| --- | --- |
| Intake and provenance | Archive hash and internal validators passed; source textbooks remain rights-separated. |
| Route collisions and redirects | Unit routes win only their declared paths; conflicting legacy records are excluded; no wholesale registry replacement. |
| Thin pages and exposition | All 67 pages compile semantically; route-scoped section guides and eight specific Lens blocks replace generic filler. |
| Raw LaTeX and math errors | All routes passed visible-text scans; unsupported source environments fail closed. |
| VisualSpec capability | All 27 specs compile; no unsupported kind was silently downgraded. |
| Visual fidelity and labels | First private candidate rejected; all 27 scenes corrected and reviewed in a contact grid; representative desktop/mobile lesson has no overlap or overflow. |
| Assessments and answers | Exact counts pass; equivalents are typed; empty attempts block; answer keys contain 14 items each; public bundles contain no canonical answers. |
| Print | Tectonic 0.16.9 produced 166 US Letter pages, SHA-256 `1a1acb...`, with no blank or clipped pages. |
| Accessibility | Semantic controls, alt/long descriptions, reading order, color-independent cues, static fallbacks, keyboard-native inputs, and live feedback passed. |
| Mobile, dark, reduced motion, no JS | Responsive layout and both themes passed; static meaning survives no JS; motion is optional and bounded. |
| Bundle and performance | Main chunks unchanged by the fidelity correction; 356,554 SVG bytes total; largest asset 18,088 bytes under the 50 KB gate. |
| Hydration | Semantic-readiness wait added to browser QA; SSR and client states agree after hydration. |
| Search, SEO, and indexability | Unique metadata, canonicals, `index, follow`, sitemap entries, analytics, icon/Organization identity, and active control-document cache bypass verified live. |
| Limits regression | Limits hub, 73 routes, 38 checks, 348 reveals, two keys, 13 visuals, and exact asset union remain under regression tests and live checks. |

## Time and usage accounting

The work order was created at `2026-07-18T02:02:36Z`; the corrected candidate evidence was recorded at `06:26:39Z`; production deployment completed at `06:36:06Z`. The controlled program window through Unit 2A publication was therefore approximately 4 hours 34 minutes. Within that window, the final Windows suite took 164.9 seconds, each final Pi suite took 130.2 seconds, and the production deployment took about 23 seconds.

Per-phase model-token telemetry was not captured by the work-order system, so a token estimate would be invented evidence and is intentionally omitted. Unit 2B must record phase start/end timestamps and available task-scoped usage snapshots at intake, import, visual review, private candidate, PR, and production release.

## Automation to add before or during Unit 2B

1. Generate a visual-fidelity checklist from each brief and require named domain quantities and relationships in the compiled scene.
2. Render the 34 Unit 2B visuals into a deterministic contact grid before the first Sites candidate.
3. Add an overlap probe that checks compiled label boxes, plot bounds, mobile CSS bounds, and long-label fixtures.
4. Add an application-template validator requiring variables, units, assumptions, diagram need, governing relation, objective, feasible domain, derivative, candidates, boundaries, interpretation, and reasonableness.
5. Keep answer bodies out of route indexes and add explicit Exam B problem 14 presence, reveal, and bundle-leak assertions.
6. Run schema, route, assessment, and leak gates before build; split exhaustive SSR by route family on the Pi.
7. Capture browser readiness, viewport, scroll width, figure bounds, theme, motion preference, JavaScript mode, and screenshot evidence in a small machine-readable QA record.
8. Record exact Sites source, version, deployment, Git tree, Cloudflare commit, immutable URL, and rollback URL automatically.

## Practices not to repeat

- Do not infer a useful visual from schema validity or asset count.
- Do not use generic diagram scaffolds, placeholder parabolas, or repeated curves for distinct application models.
- Do not start exhaustive ARM rendering before cheap fail-closed checks pass.
- Do not run all route families in one long-lived Node process on the Pi.
- Do not measure a hydrated page before its semantic loading state is gone.
- Do not put solutions, canonical answers, source paths, or Compute Engine objects in public route or search payloads.
- Do not publish support articles above the main unit map or allow them to fragment the textbook sequence.
- Do not mark a release successful from a 200 response, a successful CLI message, or a private candidate alone.

## Decision for Unit 2B

No broad platform replacement is required. The accepted architecture is adequate if Unit 2B adds the application-template and visual-fidelity validators, preserves server-only assessment boundaries, keeps static-first visuals, and uses the corrected economical QA order. Unit 2B may proceed only from accepted production `main` after this postmortem and the revised plan are merged.
