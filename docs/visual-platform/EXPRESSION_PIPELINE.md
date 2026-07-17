# Expression pipeline and trust boundary

## Pipeline

```text
approved author LaTeX
  -> build/server-only CortexJS Compute Engine parse
  -> MathJSON normalization
  -> BetterGrades allowlisted bounded numerical AST
  -> deterministic static sampler or compact browser evaluator
```

Compute Engine is a compiler dependency, not a renderer or browser parser. It
must not enter the homepage, root application, ordinary client assets, static
graph display path, or BVLP interaction chunks. Renderers consume compiled
expressions or precomputed arrays and never raw lesson LaTeX.

## Allowed numerical surface

The implemented v1 AST in `lib/visualization/ast/schema.ts` supports finite
numbers; allowlisted variables; unary `negate`, `abs`, `sqrt`, `exp`, `ln`,
`log10`, `sin`, `cos`, `tan`, `asin`, `acos`, and `atan`; binary `add`,
`subtract`, `multiply`, `divide`, `power`, `min`, `max`, `lt`, `lte`, `gt`,
`gte`, `eq`, `neq`, `and`, and `or`; and bounded piecewise branches. Results
that are not finite fail. Anything outside this canonical list fails.

Reject arbitrary functions or executable symbol names, `eval`, `Function`,
JavaScript, imports, property/prototype/DOM/network/file access, side effects,
loops/recursion, unsupported special functions, and non-finite unsafe forms.

## Resource bounds

`DEFAULT_AST_LIMITS` sets 2,048 source characters, AST depth 24, 256 nodes, and
2,048 operations per evaluation. A validated scene may tighten those limits
within the schema's hard maxima (2,048 characters, depth 32, 512 nodes, and
8,192 operations). The sampler independently defaults to 2,048 samples and
depth 12 and caps them at 20,000 and 24. Controls, payload, and animation hints
are also schema-bounded. User-controlled runtime LaTeX compilation is not
permitted.

## Diagnostics

Errors include route, source file, visual ID, layer ID, source expression,
unsupported syntax/operator or exceeded bound, and a correction when practical.
Diagnostics shown publicly must not expose filesystem paths, author-only notes,
or private source.

## Verification

`tests/bvlp-core-ast.test.mjs`, `tests/bvlp-core-sampling.test.mjs`, and
`tests/bvlp-cortex-integration.test.mjs` pass 15/15 focused tests through
`5cc2257`. They cover evaluation, validation, bounds, MathJSON normalization,
unknown-operator rejection, required build-only compilation, discontinuities,
determinism, clipping, cancellation, and all 13 migrated expression sets through
the real Cortex boundary. Final emitted-client-asset scans and production bundle
evidence remain release-phase work; no claim about them is made here.
