# BetterGrades Calculus Traffic Engine — Release B

Release B is live and has passed the engineering gates described below. It adds the resource contract, templates, static PDF pipeline, hubs, ten flagship clusters, worked problems, enriched glossary pages, promoted visuals, segmented sitemaps, internal-link graph, privacy-respecting resource events, complete top-level Resources navigation, and safe accessible new-tab behavior for every public PDF.

## Source history

| Change | Pull request | Merge commit | Purpose |
|---|---:|---|---|
| Resource engine | 43 | `fc17c4098f0a0a441326a658b055953b277c1e41` | Initial calculus resource engine |
| Educational QA | 44 | `fc5b9c006b92acb511d43b87b3f3d1ae5e3a46e2` | Mathematical and editorial verification correction |
| Resource navigation | 45 | `552e5041a0e5ba31829cb017337b1a92a077f27b` | Complete Resources library navigation |
| Final PDF closeout | 46 | `40d9aa4de5122c75bff7ec519b393be9042e242f` | Safe PDF new tabs, accessible disclosure, analytics continuity, and final evidence |

The final merge tree is `f41713fb9565f29cd7a2cd4fe3b4a8c1a81d5e6c`. It exactly matches the reviewed PR head tree.

## Preview and production

- Owner-only Sites preview: `https://better-grades.mankopoppi.chatgpt.site`
- Sites version: 47
- Sites source: `f262a7399001d19be57be744a4f931ae2e20e19f`
- Final Cloudflare source: `40d9aa4de5122c75bff7ec519b393be9042e242f`
- Deployment timestamp: `2026-07-24T17:51:28.179329+00:00`
- Immutable production: `https://7029f1e2.bettergrades-vhc.pages.dev`
- Stable Pages: `https://bettergrades-vhc.pages.dev`
- Apex: `https://bettergrades.net`
- WWW: `https://www.bettergrades.net`
- Previous corrected production: `https://10ace1bb.bettergrades-vhc.pages.dev`
- Original Release B deployment: `https://4c145136.bettergrades-vhc.pages.dev`
- Release A rollback: `https://2cf44708.bettergrades-vhc.pages.dev`

The exact post-merge Pages package hash is `aeb370da44b26c4c413fba71a487b5b9378e6f2fd34a7dd64994c71c532c67c4`. The API-only production Worker is 4,457,391 bytes raw and 916,676 bytes gzip as measured in the Pi deployment lane.

## Inventory

- Canonical HTML routes: 509
- One-hop redirects: 135
- Published resource pages: 63
- Public PDF files: 21
- PDF pages rendered during visual audit: 60
- Internal-link graph: 678 edges and zero indexable resource orphans

The 11 segmented sitemap files contain 518 URL or image-location entries:

| Sitemap | Entries |
|---|---:|
| Lessons | 352 |
| Articles | 61 |
| Unit hubs | 9 |
| Worksheets | 6 |
| Practice exams | 2 |
| Formula sheets | 1 |
| Worked problems | 26 |
| Visuals | 4 |
| Glossary | 27 |
| Pages | 21 |
| Images | 9 |

## Final validation

- GitHub required check: passed
- Repository tests on exact merged main: 255 passed, 0 failed
- Browser release matrix on exact merged main: 10 passed, 0 failed
- Browser release matrix on the immutable production URL: 10 passed, 0 failed
- Cache-bypassed production requests across immutable, stable Pages, apex, and WWW: 141 passed, 0 failed
- Rendered-DOM routes: 509 passed, 0 failed
- PDFs: 21 passed, 0 failed
- Rendered PDF pages: 60 passed, 0 failed
- Redirect, sitemap, canonical, robots, duplicate-body, leak, malformed-math, crawl-load, mobile, print, JavaScript-disabled, console, required-network, event-duplication, and Do Not Track findings: 0
- Live apex analytics installation: one GA4 loader, one GA4 bootstrap/config, and one Umami loader
- Live Resources library: 21 PDF links, all 21 native, new-tab, `noopener`, screen-reader disclosed, and without `download`

The timestamped, machine-readable production evidence is preserved in:

- `artifacts/production/live-release-binding.json`
- `artifacts/production/live-http-verification.json`
- `artifacts/production/live-browser-verification.json`
- `artifacts/production/live-browser-results.json`

The release-binding artifact ties the immutable production deployment and both raw verification records to the final merge commit, matching merge tree, exact Pages package hash, and Worker hash.

Release B has no database migration, runtime-data migration, DNS change, binding change, project replacement, credential rotation, ownership change, or billing change.
