# Release and rollback

## Release gates

1. Reconcile the exact clean implementation commit with canonical Git/MCP/Pi.
2. Run frozen install, lint, repository tests, production and Pages builds,
   `verify:visuals` and the broader checks from [Testing](TESTING.md), Tectonic,
   documentation, bundle/payload/asset, source/answer leak, and real-browser QA
   gates.
3. Confirm all Limits migration rows and URLs, static SVG/no-JS, interaction,
   keyboard/reduced motion, print, mobile, search/sitemap/canonical metadata,
   analytics/indexability/identity, unknown-route behavior, and old-renderer
   disposition.
4. Build and publish that exact reviewed source to the existing owner-only Sites
   project. Verify exactly one owner and zero groups plus version/deployment,
   source commit, every Limits route/visual, representative interaction,
   console/network, desktop/mobile, and access.
5. Record explicit authorization for that exact owner-reviewed preview and source
   before production. Authorization for a branch, PR, or different preview is not
   transferable.
6. Merge/push through the established Git lane and deploy the exact merged source
   with the existing secret-safe Cloudflare Pages wrapper/project. Never expose a
   token or create DNS/products/bindings.
7. Verify immutable URL, pages.dev, apex, and www from real browsers. Record
   deployed commit, build/package hash, deployment ID, cache headers, visual IDs,
   screenshots, checks, print hash, and MCP/Git closeout.

The locally validated implementation is
`dee8fd962dbbeeb1f5ae7dedc721ebc738b74cda`; its completed and pending gates are
recorded in [QA_REPORT.md](QA_REPORT.md). The final documentation/release commit,
Sites version/deployment, preview URL, production deployment, and live
validation outcomes are pending. This document does not claim a release has
occurred.

## Rollback

The primary rollback is the prior verified immutable Cloudflare deployment and
its exact source commit. Record that point before publishing. If rollback is
needed:

1. preserve failing deployment/source/browser evidence;
2. confirm the prior deployment matches its recorded commit and is healthy;
3. redeploy/promote that immutable source using the established wrapper/lane;
4. verify pages.dev/apex/www, representative Limits visuals, answer keys,
   metadata/search/sitemap, and cache behavior;
5. revert the release commit in Git without destructive history rewriting;
6. update MCP/report with cause, scope, evidence, restored deployment, and next
   remediation.

Do not retain a duplicate old renderer as permanent rollback infrastructure,
delete worktrees/history, reset canonical main, change DNS, or rotate credentials
unless a separately authorized incident procedure requires it.

## Stop report

When a gate cannot be satisfied, report exact blocker/evidence, current commit,
worktree/branch and clean state, completed/remnant work, safe rollback, and the
recommended bounded resolution. Production source mismatch, secret exposure,
unrecoverable print/parity/accessibility, or unauthorized exact-preview state is
a hard stop.
