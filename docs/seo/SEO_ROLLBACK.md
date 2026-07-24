# SEO release rollback

## Release B production chain

| State | Source | Immutable deployment |
|---|---|---|
| Final accepted Release B | `40d9aa4de5122c75bff7ec519b393be9042e242f` | `https://7029f1e2.bettergrades-vhc.pages.dev` |
| Previous corrected Release B | `552e5041a0e5ba31829cb017337b1a92a077f27b` | `https://10ace1bb.bettergrades-vhc.pages.dev` |
| Original Release B | PR 43-era source | `https://4c145136.bettergrades-vhc.pages.dev` |
| Accepted Release A recovery | `b88496d53f73c0d23f5a890d07e1acfc38966b72` | `https://2cf44708.bettergrades-vhc.pages.dev` |

The final Release B source was deployed without changing DNS, domains, account or project ownership, bindings, credentials, or billing.

## Rollback procedure

Rollback is deployment-based and reversible.

1. Select the last known-good immutable deployment. Use `10ace1bb` for a narrow rollback of the PDF-link closeout, or `2cf44708` to remove Release B completely and return to accepted Release A.
2. Reassign production only through the fixed BetterGrades Pi wrapper and its Pages-only Secret Broker reference.
3. Verify the selected immutable URL, stable Pages, apex, and WWW with cache-bypassed requests.
4. Verify representative lessons, graders, analytics bootstraps, robots, segmented sitemaps, PDFs, images, redirects, and a deliberate 404.
5. Revert the corresponding Git merge with a new reviewed commit. Do not rewrite shared history.
6. Record the trigger, source, deployment identifier, timestamp, live evidence, and recovery decision in the canonical release report.

Release B has no runtime data or schema migration. A complete Release B rollback removes only static resource-engine routes and assets while retaining the accepted Release A technical recovery.

Rollback triggers include an unexplained production `5xx`, missing canonical route, broken grader or API, missing required asset, analytics duplication, unsafe PDF behavior, or a material rendering or accessibility regression. A ranking fluctuation alone is not an emergency rollback signal without corroborating technical failure.
