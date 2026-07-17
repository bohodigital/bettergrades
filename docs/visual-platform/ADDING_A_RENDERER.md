# Adding or replacing a renderer

Adding a renderer requires an approved need and an ADR; it is not a shortcut for
unsupported content. Production 3D is outside v1.

1. Prove no existing renderer satisfies the required capability economically.
2. Implement the common `RendererAdapter` against readonly `CompiledScene`.
3. Register an ID, runtime class, exact supported/unsupported kinds and
   capabilities, preferred and prohibited uses, cost budgets, activation,
   accessibility/print duties, fallback, dynamic import, owner, and module.
4. Keep vendor APIs entirely inside the adapter. Add a lint/leak gate preventing
   vendor names in content, specs, and manifests.
5. Supply deterministic static fallback and explicit failure behavior.
6. Add keyboard, focus, announcement, reduced-motion, mobile, resize, cleanup,
   and failure-path behavior.
7. Add unit/adapter/browser tests, a non-public fixture, capability/resolver
   cases, bundle/payload budgets, static fallback/print parity, and leak scans.
8. Add when-to-use and anti-use guidance, examples/counterexamples, dependency
   record, troubleshooting, migration and removal procedure.
9. Regenerate/validate capability documentation, run `verify:visuals`, and run
   the broader gates in [Testing](TESTING.md).
10. Preview the exact reviewed source; do not publish from an unreviewed build.

## Lazy import rule

Browser-specialist renderers use one registry-owned dynamic import. They must be
absent from global/nonvisual/static chunks and may receive only the requested
public-safe scene. No external runtime CDN is allowed.

## Migration and deprecation

Run old and new adapters only in bounded review fixtures, prove mathematical,
accessibility, print, mobile, no-JS, performance, and cleanup parity, then change
the registry deterministically. Remove or formally deprecate the old adapter;
do not preserve permanent duplicate infrastructure. Record rollback to the prior
immutable commit/deployment and a clean dependency-removal path.
