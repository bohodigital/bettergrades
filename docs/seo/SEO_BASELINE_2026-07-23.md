# BetterGrades SEO baseline — 2026-07-23

## Anchors

- Canonical repository: `bohodigital/bettergrades`
- Audited commit: `2b084353f14f90eb737c5554427bcf3dcd355267`
- Audited tree: `c503014e461b43a6fe013ae2ddb79ddd05f5c320`
- Verified production deployment entering the work: `https://83eb34a3.bettergrades-vhc.pages.dev`
- Stable host: `https://bettergrades-vhc.pages.dev`
- Apex and WWW: `https://bettergrades.net`, `https://www.bettergrades.net`
- Public sitemap routes: 440

The Pi remains operational source of truth. Bohopi intake reconciliation found the BetterGrades project records but no canonical work-order row matching the attached master order. The Mac mirror matched current `origin/main`; work therefore began from that clean upstream commit in the required isolated branch.

## Reproducible raw-response findings

The unchanged production build was generated and audited with `node tools/seo-audit.mjs --label=baseline`.

| Check | Baseline |
| --- | ---: |
| Routes returning an unexpected status | 0 |
| Canonical mismatches | 0 |
| Routes without exactly one raw H1 | 345 |
| Routes without exactly one raw main region | 342 |
| Routes with two substantive lesson bodies | 269 |
| Routes exposing the Unit 4 authoring directive | 30 |
| Routes with malformed visible math fallback tokens | 32 |
| Broken tested one-hop redirects | 0 |
| Worker bytes, uncompressed | 12,892,008 |

The route mix was 347 lessons, 68 subject/article routes, 9 policy/directory routes, 7 practice routes, 3 glossary routes, 3 tools, 2 answers, and the home page.

The duplicate was structural: the catch-all page emitted the complete server-rendered application and a second complete calculus lesson inside `<noscript>`. A hydrated browser displayed one lesson because the browser suppresses `<noscript>` content when JavaScript is active; an ordinary crawler response still contained both trees.

The exact authoring leak originated in Unit 4 visual compilation: `misconception_control` was concatenated into the public `longDescription`, then propagated into manifests and public SVGs. The malformed fallback came from a regex serializer that removed LaTeX structure, producing text such as `frac13` and `cdots`.

## Route and delivery baseline

All 440 sitemap routes returned `200`, the declared canonical, HTML content type, and a stable title/main marker. All tested redirects were one hop. Local load tests produced no `5xx`, resource-limit page, soft-200 error, or rotating failure:

- 440 routes serially: 2,146.68 ms
- 440 routes at concurrency 5: 2,014.84 ms
- 200 routes at concurrency 10: 896.88 ms
- Five 80-route bursts at concurrency 20: 355.23–363.04 ms

These numbers measure the local Worker execution path, not public-network latency. They establish repeatable correctness and relative load, not a production service-level objective.

## Evidence

The complete per-route title, description, status, canonical, robots value, H1/main counts, image/alt counts, structured-data types, text lengths, and raw/rendered fingerprints are in `artifacts/seo/baseline-route-inventory.{json,csv}`. Raw HTML, browser, redirects, and load evidence are stored beside it.

Link/orphan classification is registry-based in this release; a complete editorial link graph is reserved for Release B because Release B must start from accepted Release A production main.
