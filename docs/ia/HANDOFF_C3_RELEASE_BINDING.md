# BetterGrades Handoff 3 release binding

Work order: `WO-2026-07-26-BETTERGRADES-HANDOFF-C3-TEMPLATE-INTENT-001`

## Release disposition

- Implementation: complete
- Independent release review: `SHIP`
- Production baseline: Handoff 2 commit `61463a9d26fcf5fe8c4bc32658675b4b056dd8d8`
- Production baseline tree: `05472147834d17563a435318ed3611653e25ef2f`
- Handoff 3 approved code commit: `3d58f0dfdaa789ba33ed42eaca69ed6dc0b692b0`
- Handoff 3 approved code tree: `708c5cc2ade7631c2482bfe9b1ae29b5bdd62dc4`
- Review branch: `feat/bettergrades-handoff-c3-template-intent-20260726`

The commit containing this document is an evidence-only descendant of the
approved code commit. It does not change the deployable application output.
Production must be rebuilt from the eventual merged `main` commit and must
retain the normalized build hash below.

## Owner-only candidate preview

- Preview URL: `https://better-grades.mankopoppi.chatgpt.site`
- Sites project: `appgprj_6a52d8b9848c81918fa5ff88a08eece0`
- Sites version: `55`
- Sites version ID: `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_c909260762d081918b98910889036709`
- Sites deployment ID: `appgdep_6a6685e0cff8819191f928fae960029c`
- Sites source commit: `3d58f0dfdaa789ba33ed42eaca69ed6dc0b692b0`
- Sites archive SHA-256: `453de1f2f6a20addcd8e76dd420531830d40ab402d94286b038fe8ca8bd7e2d6`
- Sites deployment status: `succeeded`
- Access mode: `custom`, with the owner as the sole allowed viewer and no
  allowed groups

## Candidate package identity

- Build command: `corepack pnpm run build:pages`
- Output directory: `dist/pages`
- Canonical HTML routes: `509`
- One-hop redirects: `135`
- Normalized Pages build SHA-256:
  `80df906ccb13dc432673b201f2935a7b474c4aad87a1e620543ec0fd315163fb`
- Candidate raw Pages build SHA-256:
  `abe99c2ffface6653729cb258eefe92af69243c573b448ef9ab1c4cbad3ad3a5`

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
- Independent reviewer: fresh-context release review
- Independent verdict: `SHIP`

The final independent review reproduced the rendered baseline-to-candidate
audit, confirmed that protected and unclassified synthetic deletions fail
closed, inspected the 320-pixel mobile evidence, and found no release blocker.

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

