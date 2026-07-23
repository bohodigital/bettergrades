# SEO release rollback

## Release A

Rollback is deployment-based and reversible:

1. Mark the Release A immutable deployment and exact commit as rejected.
2. Reassign production to the previously accepted immutable deployment `83eb34a3.bettergrades-vhc.pages.dev` through the governed Cloudflare wrapper.
3. Verify stable Pages, apex, and WWW on representative routes, assets, APIs, analytics bootstraps, and the five Unit 4 redirects.
4. Revert the Release A commit in Git with a new reviewed commit; do not rewrite shared history.
5. Record the failed gate and deployment identifiers in the release report.

The release changes static packaging, rendering composition, generated visuals, and public-copy serialization. It has no database migration, account change, credential rotation, DNS change, or destructive content operation.

Rollback triggers include an unexplained production `5xx`, missing canonical route, broken grader/API, missing visual asset, analytics duplication, or material rendering/accessibility regression. A ranking fluctuation alone is not an emergency rollback signal without corroborating technical failure.

## Release B

Release B remains a separate commit, PR, and production deployment based on accepted Release A merge `b88496d53f73c0d23f5a890d07e1acfc38966b72`.

1. Reassign production to the accepted Release A immutable deployment `https://2cf44708.bettergrades-vhc.pages.dev` through the governed wrapper.
2. Verify immutable, stable Pages, apex, WWW, representative lessons, graders, analytics, robots, and the Release A sitemap behavior.
3. Revert the Release B merge with a new reviewed commit; do not rewrite shared history.
4. Confirm that resource HTML, PDFs, visual downloads, and segmented sitemaps no longer appear while every Release A route remains healthy.

Release B has no runtime data or schema migration. Rollback removes only static resource-engine routes and assets while retaining the Release A technical recovery.
