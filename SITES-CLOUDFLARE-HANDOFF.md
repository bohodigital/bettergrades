# Sites handoff: Better Grades

Stop before production work and read:

```text
/srv/local1/hub/ops/runbooks/sites-cloudflare-pages.md
```

## Approved production source

The owner approved the current Better Grades private preview for connection to
the production domain on 2026-07-11.

```text
Site: Better Grades
Approved private preview: https://better-grades.mankopoppi.chatgpt.site/
Approved source commit: 48afa1b02a0bba058ec0083c3d523be2cc8360d5
Approved source bundle: /srv/local1/runtime/bettergrades/handoff/bettergrades-approved-48afa1b.bundle
Durable production checkout: /srv/local1/repos/bettergrades
Review branch: agent/approved-sites-library-launch
Build command: corepack pnpm install --frozen-lockfile && corepack pnpm test
Pages output directory: dist/pages
Approval instruction: properly connect it to bettergrades.net
```

Changes to the design or content after the approved source commit require a new
private preview and approval before the next production deployment.

Production mapping:

```text
GitHub: bohodigital/bettergrades
Cloudflare account: 41791497823353577cba1af7179342dd
Pages project: bettergrades
Pages subdomain: bettergrades-vhc.pages.dev
Domains: bettergrades.net, www.bettergrades.net
Credential reference: boho-digital-services.cloudflare.pages-deploy
```

Never read the raw token. Never treat a `/tmp` checkout as durable source.
Never deploy merely because a build or CLI command succeeds. The live visuals
must match the exact owner-approved private preview.
