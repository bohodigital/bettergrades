# Unit 2B rollback

## Source rollback baseline

The released Unit 2B source is commit `2f6d46f16941b8c932d4104c03339e58a6db607e`, tree `d9d277ccc6d362fba59447c878e4f55fecedb8be`. The accepted pre-Unit-2B baseline is Unit 2A closeout commit `1c5415113141e570f336c06210a8ff94cfee6d7f`. Do not reset or rewrite shared history. Revert the hotfix merge `2f6d46f16941b8c932d4104c03339e58a6db607e` and Unit 2B merge `9377587b9c1459fc107b892df2c9a805b09657d5` normally on a review branch, rebuild and validate the resulting tree, and release the reviewed revert through the fixed BetterGrades Pages wrapper.

## Deployment rollback baseline

The accepted pre-Unit-2B immutable production deployment is `https://b9fa0b41.bettergrades-vhc.pages.dev`. Cloudflare Pages can roll production back to that exact deployment without changing DNS, custom domains, project bindings, ownership, billing, analytics, or credentials.

The current Unit 2B production deployment is `cce6668e-f111-4f6c-ad68-9e06cc3b7080` at `https://cce6668e.bettergrades-vhc.pages.dev`. Preserve the current deployment, wrapper audit, Git commits, and browser evidence before selecting the rollback deployment.

## Scope

Unit 2B creates no database migration, learner data, external account, background service, Cloudflare binding, or DNS change. Rollback is source-and-deployment only. Limits, Unit 2A, the site shell, search, analytics, SEO identity, and control documents are baseline behavior that must remain available.

## Verification after rollback

Verify the immutable deployment, Pages host, apex, and WWW; Limits hub and epsilon-delta sample; both Limits answer keys; Unit 2A hub, visual, exercise reveal, and exam key; sitemap, robots, analytics, canonical metadata, greater-or-equal icon/Organization identity, security headers, custom 404, and the absence of Unit 2B routes. A 200 response alone is insufficient.
