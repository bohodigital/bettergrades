# Release A — technical SEO recovery

## Scope

This release contains only the technical-recovery work authorized for `fix/bettergrades-seo-recovery-20260723`.

- Removed the second complete `<noscript>` lesson tree. The existing server-rendered application is now the single no-JavaScript document and progressive-enhancement base.
- Added H1s to three legacy practice assessment routes so all 440 sitemap pages have one H1 and one main region.
- Removed `misconception_control` from the public Unit 4 visual-description compiler and regenerated all affected content-addressed SVGs and manifests.
- Replaced regex math flattening with a KaTeX AST serializer.
- Added a final-output leak gate with zero default exceptions.
- Prerendered all canonical pages and generated `_redirects`, robots, sitemap, and 404 assets at build time.
- Restricted Worker execution to API and image paths.
- Preserved the reviewed Unit 4 redirect/retention decisions.
- Added raw-response, static-package, redirect, sitemap, math, leak, load, and browser evidence.

## Acceptance status

Local candidate:

- 440/440 canonical routes return `200`;
- 440/440 have one H1 and one main region;
- 0 duplicate lesson bodies;
- 0 public editorial-leak routes;
- 0 malformed-math routes;
- 135/135 redirects are one hop;
- 0 load-test failures across serial, c5, c10, and five c20 bursts;
- GA4 and Umami retain their single existing bootstraps;
- visual inventories and content-addressed fallbacks pass;
- focused regression tests pass.

The historical all-unit render suite requires an 8 GB Node heap on this machine. With that established gate it passed all pre-existing test groups; the newly tightened single-document assertion was corrected and rerun green. The final full-suite run and private-preview browser matrix remain release-gate tasks before approval.

Release B is intentionally not started here. Governance requires it to branch from accepted Release A production main.

## Private-preview packaging

The Sites source-build path can exceed its remote build-stream window while installing the locked dependency graph. The governed fallback is the Sites packaging helper: package the already validated `dist/` output with hosting metadata from the same committed source, save that archive against the exact pushed commit, and deploy it only under verified owner-only access. This changes neither the application tree nor the Cloudflare production release process.
