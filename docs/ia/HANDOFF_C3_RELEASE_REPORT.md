# BetterGrades Handoff C3 release report

Work order: `WO-2026-07-26-BETTERGRADES-HANDOFF-C3-TEMPLATE-INTENT-001`

## 1. Owner approval

On 2026-07-27, the owner approved Better Grades preview v56 at
`https://better-grades.mankopoppi.chatgpt.site` and exact source commit
`a43c3fe88bbd01ebc025ad1a17d201860a56eb93` for Cloudflare production.

The approved Sites release was owner-only:

- Sites version: `56`
- Sites version ID:
  `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_ede9a20fd610819198646afe647d39d1`
- Sites deployment ID: `appgdep_6a67a60bc3f88191b5668abcd57e3c3b`
- Sites source commit: `a43c3fe88bbd01ebc025ad1a17d201860a56eb93`
- Sites archive SHA-256:
  `5dc83c173eccaa66da8dbe34b29d2ec715da421c0ab528411bb3ff73a48a7ecc`
- Access: owner only, with no allowed groups

## 2. Review, pull requests, and merge identity

Handoff C3 was delivered through two normally merged pull requests:

- Implementation PR: `https://github.com/bohodigital/bettergrades/pull/52`
- Implementation merge commit:
  `7bf96bd5b572b38cd1eab999c2bfcc7a98cb0461`
- Implementation merge tree:
  `b83689b4380d3b331730b2fa61b59f5685690a78`
- Graph-reproducibility and release-binding PR:
  `https://github.com/bohodigital/bettergrades/pull/53`
- Reviewed PR-tip commit:
  `e68e55fb58aea42eeb2e389b0691fdbd3fc05f9f`
- Final merge commit:
  `48fef43bc068744e1bc20aba0c144cac7fb25451`
- Final merged tree:
  `f37d9223f1bb19d058c5808d1891c286ae490cdb`

The final merge tree exactly equals the reviewed PR-tip tree. Both required
GitHub validation runs passed. A fresh-context independent release review
returned `SHIP`.

## 3. Graph correction and provenance

The graph is generated from the deployable implementation merge
`7bf96bd5b572b38cd1eab999c2bfcc7a98cb0461` and tree
`b83689b4380d3b331730b2fa61b59f5685690a78`. Evidence-only descendants do not
change that recorded application-source provenance.

The exact generation sequence reproduced the committed graph byte for byte:

1. `corepack pnpm run relationships:generate`
2. `node tools/generate-learning-graph.mjs` with the recorded implementation
   source commit and tree

Final graph inventory:

- Nodes: `495`
- Relationships: `3,706`
- Public relationships: `848`
- Provisional relationships: `2,858`
- Obsolete Handoff C2 rendered-navigation edges removed: `5,007`
- Current rendered-navigation edges added: `17`
- Approved relationship changes: `0`; all `20` remain public
- Provisional relationship changes: `0`; none render publicly

## 4. Exact merged-main validation

The durable Pi checkout was clean on `main` at exact commit
`48fef43bc068744e1bc20aba0c144cac7fb25451` before deployment.

- Full build and Node test suite: `291/291` passed
- Browser matrix: `24/24` passed
- Canonical routes built: `509`
- One-hop redirects built: `135`
- Exact-search corpus: `2,380/2,380` passed
- Rendered preservation audit: `509/509` routes passed
- Protected removed words: `0`
- Unclassified removed words: `0`
- Unapproved destructive route decisions: `0`
- Public-output leak failures: `0`
- Analytics exact-once, Do Not Track, and sensitive-data checks: passed
- Desktop, tablet, 320-pixel mobile, JavaScript-disabled, keyboard, dark-mode,
  and print checks: passed

The two large rendering files that can exceed Node's default four-gigabyte heap
were run with `NODE_OPTIONS=--max-old-space-size=8192`; both passed as part of
the complete sequential suite.

## 5. Cloudflare production deployment

The release was deployed from exact clean merged `main` through
`tools/deploy_cloudflare_pages.py` and the fixed Secret Broker reference
`boho-digital-services.cloudflare.pages-deploy`.

- Cloudflare account: `41791497823353577cba1af7179342dd`
- Existing Pages project: `bettergrades`
- Production branch: `main`
- Deployed Git commit:
  `48fef43bc068744e1bc20aba0c144cac7fb25451`
- Cloudflare deployment ID:
  `9a7de363-720e-4ece-a16e-ffb7031d17bd`
- Deployment created: `2026-07-27T19:22:49.089601Z`
- Deployment stage: `deploy`
- Deployment status: `success`
- Immutable deployment:
  `https://9a7de363.bettergrades-vhc.pages.dev`
- Stable Pages: `https://bettergrades-vhc.pages.dev`
- Apex: `https://bettergrades.net`
- WWW: `https://www.bettergrades.net`

Cloudflare reported both custom domains active, validated, and verified. The
release did not create another Pages project or alter DNS, bindings,
credentials, analytics identifiers, ownership, billing, or retained
deployments.

## 6. Live production acceptance

Eight sampled release endpoints returned HTTP 200: immutable, stable Pages,
apex, WWW, Calculus, Practice, Resources, and exact Search.

Rendered live-browser checks confirmed:

- title: `Better Grades — Free answers, full explanations`
- canonical: `https://bettergrades.net/`
- robots: `index, follow`
- exactly one H1 and one main landmark
- one JSON-LD block on the homepage
- no horizontal overflow
- no browser console warnings or errors
- no visible provisional relationship text
- no visible raw TeX command leakage
- exact search for `integral of sec cubed` ranks
  `/answers/calculus/integral-of-sec-cubed/` first

Visual inspection of the immutable production homepage matched the accepted
v56 composition, navigation, identity, search, learner paths, and dark-theme
presentation without a visible release regression.

Production acceptance is complete.

## 7. Rollback

Preserve every accepted immutable deployment. If rollback is required, revert
normally without rewriting history, rebuild the selected exact clean source,
deploy through the governed wrapper, and verify immutable, stable, apex, and
WWW.

Accepted recovery points:

1. Handoff C2: `https://dfd06155.bettergrades-vhc.pages.dev`
2. Handoff C1: `https://d40825cc.bettergrades-vhc.pages.dev`
3. Release B: `https://7029f1e2.bettergrades-vhc.pages.dev`

Do not alter DNS, bindings, credentials, analytics identifiers, ownership,
billing, or retained deployments during rollback.

## 8. Closeout and next phase

Handoff C3 implementation, independent review, owner preview acceptance, merge,
exact-main rebuild, Cloudflare deployment, and live verification are complete.

Phase D is the next planning phase. This report does not authorize or implement
Phase D work.
