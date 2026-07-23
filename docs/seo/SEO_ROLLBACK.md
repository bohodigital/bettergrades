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

Release B must remain a separate commit, PR, and production deployment based on accepted Release A. Its future rollback must remove only resource-engine routes/assets while retaining Release A technical recovery.
