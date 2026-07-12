# Better Grades Agent Instructions

This repository is the GitHub production handoff for Better Grades. It is not
the authority for choosing an unapproved design.

Before Sites work, source replacement, merge, or deployment, read:

```text
SITES-CLOUDFLARE-HANDOFF.md
/srv/local1/hub/ops/runbooks/sites-cloudflare-pages.md
```

- There is no owner-approved Better Grades design recorded in the Pi hub.
- Treat current repository and Pages content as a placeholder.
- Sites must create a private preview, visually inspect it, show the owner the
  exact URL, and stop for explicit approval.
- Use the authenticated GitHub owner `bohodigital`.
- Do not create another Cloudflare Pages project or change DNS/custom domains.
- Never commit API tokens, account credentials, `.env` files, student data,
  browser profiles, caches, build output, or generated logs.
- Normal Pages deployment uses the fixed Pi Secret Broker reference
  `boho-digital-services.cloudflare.pages-deploy` through an approved wrapper.
- A successful build does not prove that the visual design is owner-approved.
