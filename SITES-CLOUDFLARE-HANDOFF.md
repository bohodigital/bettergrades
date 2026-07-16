# Sites handoff: Better Grades

Stop before production work and read:

```text
/srv/local1/hub/ops/runbooks/sites-cloudflare-pages.md
```

## Current owner-authorized release

On 2026-07-16, the owner authorized this final Limits and Continuity release and
instructed the team to push it live after validation. The authorized scope is:
use Section instead of learner-visible Chapter wording; publish complete,
source-traced answer keys for Practice Exams A and B with prominent links from
the exams and main unit map; keep the complete 47-page textbook map above the
deep-dive articles; make every public page indexable with canonical, sitemap,
and analytics tags; and publish the Better Grades greater-or-equal brand mark
as the stable favicon and Organization logo identity.

```text
Work order: WO-2026-07-16-BETTERGRADES-LIMITS-SECTION-ANSWERKEY-SEO-001
Review branch: agent/bettergrades-limits-section-answer-keys-seo
Pull request: recorded in MCP after exact-source preview validation
Owner-visible private preview: https://better-grades.mankopoppi.chatgpt.site/
Approval instruction: once done, push it live; do not stop until done
Release evidence: exact commit, Sites version, Cloudflare deployment, and live checks are recorded in MCP
```

The release commit is the commit containing this handoff entry. Production must
be built from the merged tree for this release, and that tree must match the
validated private-preview source tree. Any content or design change beyond this
scope requires another private preview and approval.

## Previous Limits cleanup release

The prior navigation and rendering cleanup was published through PR 15 under
work order `WO-2026-07-15-BETTERGRADES-LIMITS-UNIT-INGEST-001`. It established
the 47-page unit map, the deep-dive article flow, expanded exposition, and the
removal of learner-visible LaTeX/TikZ/table-layout source.

## Previous approved production source

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
