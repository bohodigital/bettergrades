# BetterGrades Handoff 3 release binding

Work order: `WO-2026-07-26-BETTERGRADES-HANDOFF-C3-TEMPLATE-INTENT-001`

## Release disposition

- Implementation: complete
- Independent release review: `SHIP`
- Production baseline: Handoff 2 commit `61463a9d26fcf5fe8c4bc32658675b4b056dd8d8`
- Production baseline tree: `05472147834d17563a435318ed3611653e25ef2f`
- Handoff 3 graph-reproducible candidate commit:
  `a43c3fe88bbd01ebc025ad1a17d201860a56eb93`
- Handoff 3 graph-reproducible candidate tree:
  `eb5a4df9e3e700e97841ffe9995f37498a3b7184`
- Review branch: `codex/handoff-c3-release-repro-20260727`

The commit containing this document is an evidence-only descendant of the
approved code commit. It does not change the deployable application output.
Production must be rebuilt from the eventual merged `main` commit and must
retain the normalized build hash below.

## Owner-only candidate preview

- Preview URL: `https://better-grades.mankopoppi.chatgpt.site`
- Sites project: `appgprj_6a52d8b9848c81918fa5ff88a08eece0`
- Sites version: `56`
- Sites version ID: `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_ede9a20fd610819198646afe647d39d1`
- Sites deployment ID: `appgdep_6a67a60bc3f88191b5668abcd57e3c3b`
- Sites source commit: `a43c3fe88bbd01ebc025ad1a17d201860a56eb93`
- Sites archive SHA-256: `5dc83c173eccaa66da8dbe34b29d2ec715da421c0ab528411bb3ff73a48a7ecc`
- Sites deployment status: `succeeded`
- Access mode: `custom`, with the owner as the sole allowed viewer and no
  allowed groups

## Candidate package identity

- Build command: `corepack pnpm run build:pages`
- Output directory: `dist/pages`
- Canonical HTML routes: `509`
- One-hop redirects: `135`
- Normalized Pages build SHA-256:
  `c0ef4ed4a3e627fe65126fdacc393113549e27d68c32a68eeb2d2b66ac8dd4d9`
- Candidate raw Pages build SHA-256:
  `f9382efcff40bce27064b44913002ef7ccb2c11ef40d7269fc9185b25a60f376`

The normalized hash removes only documented vinext deployment/build UUIDs and
the prerender secret. The raw hash identifies the final local candidate build;
the Sites archive hash identifies the uploaded v55 package.

## Validation and independent review

- Full Node test/build suite: passed
- Browser matrix: `24/24` passed
- Exact-search corpus: `2,380/2,380` passed
- Rendered preservation audit: `509/509` routes passed
- Protected removed words: `0`
- Unclassified removed words: `0`
- Short-form median words before substantive content: `7` to `2`
  (`71.4%` reduction)
- Required 320-by-720 mobile contract: passed
- Unapproved destructive route decisions: `0`
- Analytics exact-once and Do Not Track verification: passed
- Graph generation/check: `495` nodes, `3,706` relationships, `848` public,
  and `2,858` provisional
- Graph correction: `5,007` obsolete Handoff 2 rendered-navigation edges
  removed and `17` current rendered edges added
- Explicit approved relationships changed: `0`; all `20` remain public
- Provisional relationships changed: `0`; none render publicly
- Independent reviewer: fresh-context release review
- Independent verdict: `SHIP`

The final independent review reproduced the graph check and exact edge
classification, verified all approved and provisional relationships, confirmed
the rendered baseline-to-candidate preservation evidence and browser matrix,
and found no release blocker.

## Owner release instruction

On 2026-07-27, the owner supplied the Handoff 3 audit and instructed the release
lane to bind the exact preview, review the candidate, open the pull request,
merge, rebuild exact `main`, deploy through the fixed Cloudflare wrapper,
verify production, and close Handoff 3.

## Cloudflare release constraints

- Account: `41791497823353577cba1af7179342dd`
- Existing Pages project: `bettergrades`
- Pages subdomain: `bettergrades-vhc.pages.dev`
- Production domains: `bettergrades.net`, `www.bettergrades.net`
- Fixed deployment wrapper: `tools/deploy_cloudflare_pages.py`
- Secret Broker reference:
  `boho-digital-services.cloudflare.pages-deploy`

Do not create another Pages project, alter DNS, expose a credential, or deploy
the pre-merge branch package.

## Rollback targets

- Handoff 2: `https://dfd06155.bettergrades-vhc.pages.dev`
- Handoff 1: `https://d40825cc.bettergrades-vhc.pages.dev`
- Release B: `https://7029f1e2.bettergrades-vhc.pages.dev`
