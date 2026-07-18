# Calculus unit rollback

## Unit 2A source rollback

The accepted pre-Unit-2A production baseline is commit `e85b9b80fdb77aaf5346c555a2c1378024fd33ca`. Do not reset or rewrite shared history. Create a normal revert of Unit 2A merge commit `36e0091b9014ea13c7a043ff258c9edd05bdf2f4` on `main`, validate the resulting tree, and release that revert through the fixed production wrapper.

## Unit 2A deployment rollback

- Accepted pre-Unit-2A deployment: `https://624f0ef1.bettergrades-vhc.pages.dev`.
- Accepted Unit 2A deployment: `https://b9fa0b41.bettergrades-vhc.pages.dev`.

Roll Cloudflare Pages production back to the baseline immutable deployment when Unit 2A itself must be removed. Do not change DNS, custom domains, bindings, ownership, billing, or credentials to roll back content.

## Unit 2B rollback baseline

The accepted Unit 2A commit and immutable deployment above are the mandatory rollback point for the later, separate Unit 2B release. Unit 2B must record its own merge commit and immutable deployment without overwriting this evidence.

## Data and service scope

Unit 2A introduces no database migration, external account, durable learner record, new service, or Cloudflare binding. Rollback is source-and-deployment only. Existing Limits routes, search, analytics, and static identity assets are part of the baseline and must remain present.

## Verification after rollback

Recheck the apex and WWW hosts, the Limits landing page, an epsilon-delta page, both Limits exam keys, all 13 Limits visual hashes, sitemap, robots, analytics markup, greater-or-equal identity assets, security headers, cache controls, and a representative 404. A successful HTTP status alone is not sufficient.
