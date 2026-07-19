# Rollback

## Source rollback

Revert the exact Unit 3 release merge commit on canonical `main`, rebuild, and rerun the release suite. Do not reset shared history or discard unrelated work.

## Deployment rollback

Redeploy the recorded prior immutable Cloudflare Pages deployment through the existing secret-safe wrapper. Do not change DNS, print credentials, or replace the project.

Before rollback, capture the failing immutable URL, route, response headers, console/network evidence, and deployment identifier. After rollback, verify pages.dev, apex, www, representative routes from Units 1 through the last accepted unit, sitemap, robots, search, analytics, answer keys, and static visual assets.

Unit-specific accepted commits and immutable deployment targets are appended to the release reports.

For the Unit 3A release, the immediate prior accepted point is commit `8885939a6807e64a1758799733e7a3cf52e46b0d` at `https://64a6928b.bettergrades-vhc.pages.dev`. The Unit 3A merged commit is `85e884278ebb2ce1c49c9849172efca9822b0bf0` and its immutable deployment is `https://f9e1ec70.bettergrades-vhc.pages.dev`.
