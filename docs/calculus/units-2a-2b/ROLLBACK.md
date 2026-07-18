# Calculus unit rollback

## Source rollback

The accepted pre-Unit-2A production baseline is commit `e85b9b80fdb77aaf5346c555a2c1378024fd33ca`.

Do not reset or rewrite shared history. Create a normal revert of the Unit 2A merge commit on `main`, validate the resulting tree, and release that revert through the same wrapper and production verification lane.

## Deployment rollback

Use the previously verified immutable Cloudflare Pages deployment associated with the accepted baseline. The release report records its exact URL and deployment ID before Unit 2A publication. Do not change DNS, custom domains, bindings, ownership, or billing to roll back content.

## Data and service scope

Unit 2A introduces no database migration, external account, durable learner record, or new service. Rollback is source-and-deployment only. Existing Limits routes, search, analytics, and static identity assets are part of the baseline and must remain present.

## Verification after rollback

Recheck the apex and www hosts, the Limits landing page, an epsilon-delta page, both Limits exam keys, all 13 Limits visual hashes, sitemap, robots, analytics markup, security headers, and a representative 404. A successful HTTP status alone is not sufficient.
