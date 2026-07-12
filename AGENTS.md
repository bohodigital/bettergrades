# Better Grades Agent Instructions

This repository is the GitHub production handoff for Better Grades. The exact
approved source and preview are recorded in `SITES-CLOUDFLARE-HANDOFF.md`.

Before Sites work, source replacement, merge, or deployment, read:

```text
SITES-CLOUDFLARE-HANDOFF.md
/srv/local1/hub/ops/runbooks/sites-cloudflare-pages.md
```

- Deploy only the source commit tied to the approved private preview.
- Any design or content change after that commit requires a new private preview
  and a new owner approval before another production deployment.
- Use the authenticated GitHub owner `bohodigital`.
- Reuse the existing Cloudflare Pages project and domains. Do not create a
  replacement project or unrelated DNS records.
- Never commit API tokens, account credentials, `.env` files, student data,
  browser profiles, caches, build output, or generated logs.
- Normal Pages deployment uses the fixed Pi Secret Broker reference
  `boho-digital-services.cloudflare.pages-deploy` through
  `tools/deploy_cloudflare_pages.py`.
- A successful build does not prove that the visual design is owner-approved.
