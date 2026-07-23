# BetterGrades Resource Publishing Architecture

Release B extends the canonical typed registry with `PublishingResourceRecord`; existing article, assessment, glossary, search, calculus-unit, and visual records remain authoritative.

`tools/generate-calculus-resources.mjs` deterministically emits the resource catalog, build-time student and key PDFs, SVG/PNG downloads, canonical PDF headers, and verification manifests. `lib/resources/catalog.mjs` projects those records into canonical routing and search. The catch-all route resolves one public record and the Pages build pre-renders it.

No runtime database, runtime PDF generator, or second route registry is used. Static downloads and sitemaps stay outside the Worker. Because the Pages routing contract sends only `/api/*` and `/_vinext/image` to compute, `tools/pages-worker-entry.ts` packages only those four bounded APIs and the image-asset pass-through. The complete educational corpus remains in the build-time renderer and static output, not the production Worker.

The build fails for duplicate ids or paths, missing relationships, incomplete problem/answer coverage, absent files, unresolved mathematics, stale generation, or missing visual alternatives.

Release B is independently reversible to Release A merge `b88496d53f73c0d23f5a890d07e1acfc38966b72`; no data migration is required.
