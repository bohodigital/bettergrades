# Unit 2A production release

Status: accepted and live.

## Exact source and review chain

- Baseline before Unit 2A: `e85b9b80fdb77aaf5346c555a2c1378024fd33ca`.
- Review branch: `agent/bettergrades-unit-2a-v3`.
- Corrected reviewed branch head: `32717b4bb60fb858b9baab6482696f9ee3444ddb`.
- Corrected reviewed tree: `839f910b25782065d713c4dcb472a5cf427217b7`.
- GitHub PR: `bohodigital/bettergrades#24`.
- Squash-merged production commit: `36e0091b9014ea13c7a043ff258c9edd05bdf2f4`.
- Merged production tree: `839f910b25782065d713c4dcb472a5cf427217b7`, exactly equal to the reviewed branch tree.
- Main validation workflow run `29634083079`: success on the exact merged commit.
- Canonical Pi `main`, `origin/main`, tested source, and deployed source all identify the same commit.

## Sites review evidence

The first private candidate, version 22, was rejected because browser QA found generic diagram scaffolding and placeholder curve families. It never reached GitHub `main` or public production.

The corrected exact candidate is:

- Sites project: `appgprj_6a52d8b9848c81918fa5ff88a08eece0`.
- Saved version: 23.
- Version ID: `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_e88f255de780819199ed94ec10d930da`.
- Source commit: `32717b4bb60fb858b9baab6482696f9ee3444ddb`.
- Deployment ID: `appgdep_6a5b1a537a5481919c1b6673c0935692`.
- Review URL: `https://better-grades.mankopoppi.chatgpt.site`.
- Access at review: custom owner-only, one allowed user, zero groups.
- Result: succeeded and accepted after desktop plus actual 390 by 844 browser QA.

## Cloudflare production release

- Fixed Pages project: `bettergrades`.
- Fixed production branch: `main`.
- Immutable deployment: `https://b9fa0b41.bettergrades-vhc.pages.dev`.
- Pages host: `https://bettergrades-vhc.pages.dev`.
- Apex: `https://bettergrades.net`.
- WWW: `https://www.bettergrades.net`.
- Deployment timestamp: `2026-07-18T06:36:06.163285+00:00`.
- Both custom domains: active, validation active, verification active.

The unchanged fixed-purpose deployment wrapper used the Pages deployment credential only for the normal Pages release. The separate read-only zone/control-plane check used `boho-digital-services.cloudflare.primary-management` and confirmed the active `bettergrades_seo_control_documents_bypass_cache` rule for `/robots.txt` and `/sitemap.xml`. No DNS, binding, ownership, billing, credential, or deployment-wrapper change occurred.

## Validation accepted

- Windows frozen install, lint, typecheck, Pages build, and 175/175 tests passed; final measured suite time was 164.9 seconds.
- Pi frozen install, lint, typecheck, ARM Pages build, and 175/175 tests passed in 130.2 seconds on the reviewed branch and again on exact merged `main`.
- The 67-route Unit 2A inventory, 49 core route sequence, 34 quick checks, 7 assessment sets, 27 visuals, two 14-item answer keys, and 36 cumulative-practice answers passed their exact-count gates.
- Immutable, pages.dev, apex, and WWW each returned the Unit 2A hub with identical 51,550-byte HTML responses.
- The live derivative lesson returned 53,932 bytes; the Exam A key returned 71,784 bytes; the accepted Limits hub remained live.
- Live browser QA confirmed the map-first hub, eight `Section` and Reading Lens groups, no learner-visible `Chapter`, no raw TeX, unique canonical, `index, follow`, analytics, and two prominent answer-key links.
- The corrected derivative-loop SVG `/visuals/v1/unit-2a-2a-v01.1a4c76cad05f607d.svg` returned 200 as `image/svg+xml`; it was centered and collision-free in desktop and 390-pixel mobile views.
- Empty exercise attempts remained blocked; a real attempt revealed only the selected supplied answer. Exam A published exactly Problems 1 through 14.
- `/robots.txt`, `/sitemap.xml`, the greater-or-equal icon set, Organization `logo` and `image` JSON-LD, analytics, custom 404, and baseline security headers remained present.

## Rollback

The immediate source rollback target is baseline commit `e85b9b80fdb77aaf5346c555a2c1378024fd33ca`; its last verified production deployment is `https://624f0ef1.bettergrades-vhc.pages.dev`. Revert PR 24 normally, rebuild and validate, and deploy through the same fixed wrapper. Cloudflare can also roll production back to that immutable deployment without changing DNS.

The owner program supplied explicit authorization to publish after the gates passed. This record closes the Unit 2A release gate and authorizes the mandatory postmortem and revised Unit 2B plan; it does not combine Unit 2B into this release.
