# Sites handoff: Better Grades

Stop before production work and read:

```text
/srv/local1/hub/ops/runbooks/sites-cloudflare-pages.md
```

There is no owner-approved Better Grades design currently recorded in the Pi
hub. Treat existing GitHub and Pages content as a placeholder.

Use Sites to create a private preview, visually inspect it, show the owner the
exact URL, and stop for explicit approval.

Production mapping after approval:

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
