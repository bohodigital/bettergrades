# BVLP threat model

## Protected assets

Learner safety and trust, mathematical correctness, public route integrity,
assessment answers, private author/source/provenance material, browser/runtime
integrity, Cloudflare credentials/configuration, availability, bundle budgets,
and deterministic rollback.

## Trust boundaries and threats

| Boundary | Primary threats | Required controls |
| --- | --- | --- |
| author input -> schema | arbitrary/unknown fields, duplicate IDs, broken references, unsupported 3D | strict Zod, unique/reference/cycle/capability checks, fail closed |
| LaTeX -> numerical AST | code injection, property/prototype access, denial by depth/operations | build-only Compute Engine, allowlisted AST, hard bounds, no eval/import/side effects |
| compiler -> public payload | answer/source/path/provenance or whole-registry leak | explicit serializer allowlist, per-route scenes, leak scans |
| sampler/renderer | non-finite loops, false asymptote bridges, unsafe text/script/resources | bounded deterministic sampling, segmentation, escaping, script/external-resource bans |
| browser adapter | global dependency leak, stale listeners, layout shift, Canvas-only meaning | lazy isolation, version check, cleanup/abort, static semantic fallback |
| visual/API routing | path traversal, arbitrary expression compilation, unknown ID 200, oversized registry | known ID lookup, real 404, bounded response, no file/query execution |
| delivery/release | token exposure, wrong source, cache poisoning/stale metadata, unauthorized production | secret-safe wrapper, exact commit/preview authorization, immutable proof, live header/route QA |

## Abuse and failure limits

The accepted AST defaults are 2,048 expression characters, depth 24, 256 nodes,
and 2,048 operations/evaluation. Scene schema maxima are depth 32, 512 nodes,
and 8,192 operations. Sampling defaults to depth 12 and 2,048 samples with hard
caps of depth 24 and 20,000 samples. Control ranges/frequency, payload size, and
numeric-series arrays are also schema-bounded. Any future Worker computation
must be abortable, and static rendering may not depend on Worker support.
External runtime CDNs and persistent Cloudflare bindings are prohibited.

## Privacy and answer safety

Public scenes contain only data needed to teach that route. They exclude
assessment answers, private fixtures, source textbook/PDF content, author notes,
filesystem paths, diagnostics, secrets, and unrelated visuals. Answer/leak scans
must include short/generic values, not only distinctive long strings.

## Residual risk and response

Third-party adapters increase supply-chain, bundle, and accessibility risk;
dynamic isolation and static fallback reduce impact. JSXGraph's unusually large
package requires explicit artifact audit. Core expression/sampling bounds,
focused rejection tests, bounded per-route serialization, and Pages-package
answer/source/Cortex leak scans are verified. Final dependency integrity,
built-chunk measurements, unused vendor-adapter audit, production route checks,
and residual live findings remain pending. A detected secret, arbitrary execution path, answer leak, false
mathematical rendering, or source mismatch blocks release and triggers evidence
preservation and rollback.
