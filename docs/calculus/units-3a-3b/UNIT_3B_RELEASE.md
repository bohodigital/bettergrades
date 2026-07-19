# Unit 3B release

Status: accepted and live-verified on 2026-07-19 UTC.

## Outcome

Unit 3B, Applications of Integration, is published at `https://bettergrades.net/subjects/math/calculus/integration-applications/`. The main unit map leads the textbook path, links back to Unit 3A, exposes the two published exam keys, and places focused explorations and supporting practice beneath the core sequence. The release retained the existing BetterGrades shell, search, assessment boundary, BVLP compiler, print system, analytics, SEO, and identity assets.

## Controlling inputs

- Work order: `WO-2026-07-18-BETTERGRADES-CALCULUS-UNITS-3A-3B-V3-001`
- Handoff archive SHA-256: `d6a102fca7235eb850747a22d9b2f42394db3643d52e4374bb8cd31289a80655`
- Preserved owner-instruction SHA-256: `fa666564799e45556c545bee9a36f1b50820244993c6798c2fe216924955b9d4`
- Unit 3B root: `/subjects/math/calculus/integration-applications/`
- Accepted Unit 3A base before Unit 3B implementation: `fd3f2d90f7818c3945b866ff3777b92028071d59`

## Git lineage

| Gate | Candidate head | Merge commit | Result |
| --- | --- | --- | --- |
| Unit 3B curriculum and product release, PR 33 | `ce60e06a9e3dfc81d1cba84efd6af6997daefb50` | `6b38b7cd83ec7b9b35a2a8179da84eab76445a6c` | Both repository validations passed |
| Pages runtime-size correction, PR 34 | `0ade9d4a26b2934e1daeca80ad556fbc7dd682c4` | `5a19b34ee611ee4eaea03ba723bed8c798099181` | Both repository validations passed |
| Standalone Worker prebundle, PR 35 | `1d2af156942e74071a7e1da04f466befa9f4dd1a` | `b955d0a44937eb5ed275dd78e667a638eda7e14a` | Both repository validations passed |
| Sampled-geometry browser correction, PR 36 | `8b7b83e3e51c5acfcf039c235d244122bcd2c7e6` | `ccd2f172f73c8a83f73e17b2008838a14b2d21bc` | Both repository validations passed |

Final deployed Git tree: `2616ac44de0da31b7bb4dead1b83740f5facaabf`.

The final correction was intentionally narrow. It added `sampled-series` support to the lightweight interactive SVG renderer, reserved lower plotting space for the washer radius label, and regenerated the affected content-addressed fallback. Curriculum, routes, answers, SEO, analytics, and navigation were unchanged.

## Owner-only Sites review

- Project: `appgprj_6a52d8b9848c81918fa5ff88a08eece0`
- URL: `https://better-grades.mankopoppi.chatgpt.site`
- Access: custom allowlist; one owner; no workspace or tenant groups
- Final version: 34
- Version ID: `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_933072133f348191b2ca856bc60a986c`
- Deployment ID: `appgdep_6a5c588b748481919a5f1e1ee53ec0c5`
- Deployment state: succeeded
- Source commit: `8b7b83e3e51c5acfcf039c235d244122bcd2c7e6`
- Source tree: `2616ac44de0da31b7bb4dead1b83740f5facaabf`
- Local archive SHA-256: `74a03a34795923aaeb41f9aa25075ebcef61ad811d16e04dbe4f26022cc1dcda`
- Sites content hash: `sha256:75d49a9ff2f17ec48a69d4623421b387ae2b5876494aa1ce6812ce1f1ed2d6e7`
- Archive storage: 45,598,720 bytes, 466 files

Candidate history remained auditable: version 31 reviewed the curriculum candidate, version 32 the projected runtime graph, version 33 the standalone prebundle, and version 34 the browser-driven visual correction.

## Cloudflare production release

- Pages project: `bettergrades`
- Production branch: `main`
- Deployed commit: `ccd2f172f73c8a83f73e17b2008838a14b2d21bc`
- Immutable URL: `https://a14da09c.bettergrades-vhc.pages.dev`
- Pages URL: `https://bettergrades-vhc.pages.dev`
- Apex: `https://bettergrades.net`
- WWW: `https://www.bettergrades.net`
- Immediate prior immutable Unit 3B release: `https://8da64cc8.bettergrades-vhc.pages.dev`
- Last accepted Unit 3A-only immutable release: `https://65e4d5ff.bettergrades-vhc.pages.dev`

The fixed Pages credential was used only for the content publish. The primary Cloudflare management credential separately verified that both custom domains were active and that the robots/sitemap cache-bypass rule was current. DNS, bindings, ownership, and billing were unchanged.

## Packaging corrections and release lessons

The first Unit 3B Worker exceeded Cloudflare's compressed upload limit. The corrective lane projected server-only calculus runtime data into public runtime manifests and retained `no_bundle=true`. Cloudflare then rejected the raw upload because the Worker still contained relative imports. The final packaging correction used the existing pinned build with direct `esbuild` prebundling to emit one standalone Worker while preserving static assets and the fixed deployment wrapper.

The accepted Worker measured 11,476,461 bytes raw and 2,506,639 bytes gzip, below the repository's 2.75 MB gzip release budget. No deploy wrapper, workflow, DNS, or binding was changed.

The first final-alias crawl observed one transient 404 for the newly content-addressed washer SVG on the Pages alias while the immutable origin already served it. All four hostnames converged to 200 before the complete verifier was rerun. The successful report was written only after convergence.

## Validation

- Candidate lint: passed.
- Candidate TypeScript check: passed.
- Complete serial repository suite: 214 passed, 0 failed.
- Visual compiler, authoring, importer, and standalone visual verifier: passed.
- Final canonical rebuild: passed from merge `ccd2f172f73c8a83f73e17b2008838a14b2d21bc`.
- Final Pages package test: 5 passed, 0 failed.
- Canonical Pi checkout after deploy: clean.
- Live Unit 3B verification: 25 routes and nine visual fallbacks passed on each of the immutable, Pages, apex, and www origins.
- Both Unit 3B answer-key routes were present, canonical, indexable, linked from the map, and complete through Problem 13.
- Equivalent pumping setup returned `correct`; wrong bounds returned `incorrect`; unprovable prose returned `uncertain`; an empty reveal was blocked; a real attempted exercise revealed its supplied answer.
- Robots and sitemap remained cache-ineligible; favicon, greater-or-equal identity assets, manifest, apple icon, and social image returned successfully.
- Canonical, `index, follow`, analytics, structured-data, security-header, sitemap, raw-source, KaTeX-error, and noindex checks passed.

## Browser-visible verification

Desktop QA at the default browser viewport verified the Unit 3B map, the Unit 3A/3B course-navigation block, Section/Lens exposition, published key navigation, dark theme, answer reveal, and complete exam key. The corrected washer interactive rendered both sampled rings and kept the lower-radius label clear of the axis; its keyboard slider changed from 2.5 to 3 and announced the new value. The cylindrical-shell interactive rendered both elliptical rims with separated labels. Area and pumping visuals remained clean from the preceding unchanged release candidate.

Responsive QA at 390 by 844 verified the Unit 3B map and washer visual without horizontal overflow. The washer figure stayed within the viewport, retained its accessible text, sampled rings, controls, and static fallback. The temporary viewport override was reset and all browser tabs were finalized after QA.

## Rollback

For a visual-only rollback, revert PR 36 without rewriting history, rebuild, and redeploy the immediate prior Unit 3B source at `https://8da64cc8.bettergrades-vhc.pages.dev`; that release contains Unit 3B but predates the sampled-geometry rendering correction. For a full Unit 3B rollback, redeploy the accepted Unit 3A-only source at `https://65e4d5ff.bettergrades-vhc.pages.dev`. After either rollback, rerun the four-origin semantic crawl, browser QA, answer/grader probes, search, sitemap, robots, analytics, identity, and visual checks.

## Durable evidence

- `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/unit3b-live-verification-final.json`
- `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/verify-unit3-live.mjs`
- `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/unit3a-live-verification-final.json`
- `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/verify-unit3a-final-live.mjs`
