# Unit 3A release

Status: initial release completed and live-verified on 2026-07-18/19 UTC; adversarial-review corrective release is required before Unit 3B.

## Exact source lineage

- Implementation commit: `4a9768dce752baaa452f71cdce14ebf41c0701ed`
- Sites-source merge commit: `c82ae15d64f46f6088983f73a03d5e50b6e1ec8d`
- Reviewed candidate tree: `bba38e6767835380ce18a78202ba360018710bf6`
- Pull request: `https://github.com/bohodigital/bettergrades/pull/30`
- Repository validation: two `Validate Better Grades preview` runs passed for the exact head
- Merged main commit: `85e884278ebb2ce1c49c9849172efca9822b0bf0`
- Merged main tree: `bba38e6767835380ce18a78202ba360018710bf6`

The reviewed candidate and merged production source have the same Git tree. Canonical Pi `main` was rebuilt after merge.

## Owner-only Sites candidate

- Project: `appgprj_6a52d8b9848c81918fa5ff88a08eece0`
- Access: custom allowlist with one owner and no users beyond the owner, workspace groups, or tenant groups
- Version: 29
- Version ID: `appgprj_6a52d8b9848c81918fa5ff88a08eece0~appgver_e762d4052a4481918f01fcbdfce0bef0`
- Deployment ID: `appgdep_6a5c21eac01c8191a96a83776d8a68ce`
- Source commit: `c82ae15d64f46f6088983f73a03d5e50b6e1ec8d`
- Archive SHA-256: `67807da4224da5823fb3cdeacdf6ff71328ca07c0eaeb7ae96f5234bbee95c6e`
- URL: `https://better-grades.mankopoppi.chatgpt.site`

The in-app browser session was not signed into the owner-only Sites gate. Visual QA therefore used the exact local candidate tree, while Sites provenance, access, version, archive, and deployment status were verified through the authenticated connector.

## Production deployment

- Cloudflare Pages project: `bettergrades`
- Production branch: `main`
- Deployed commit: `85e884278ebb2ce1c49c9849172efca9822b0bf0`
- Immutable URL: `https://f9e1ec70.bettergrades-vhc.pages.dev`
- Pages URL: `https://bettergrades-vhc.pages.dev`
- Apex: `https://bettergrades.net`
- WWW: `https://www.bettergrades.net`
- Previous production commit: `8885939a6807e64a1758799733e7a3cf52e46b0d`
- Previous immutable URL: `https://64a6928b.bettergrades-vhc.pages.dev`

The fixed Pages credential published the build. The primary Cloudflare management credential separately verified the active robots/sitemap no-cache control-plane rule; it was current and required no change. DNS and bindings were unchanged.

## Live verification

The immutable URL, pages.dev, apex, and www each passed the same semantic crawl:

- every Unit 3A route returned HTML with its own title, canonical URL, `index, follow`, analytics, and rendered learner content;
- every Unit 3A visual returned an accessible SVG fallback with title, description, and view box;
- all Unit 3A routes were present in the live sitemap;
- robots did not block crawling and remained edge-cache ineligible;
- the main map contained the complete textbook path, published answer-key area, focused explorations, Unit 2B prerequisite link, and Unit 3B transition;
- both answer keys were public, numbered, indexable, canonicalized, and reachable from exams and the map;
- favicon, greater-or-equal identity assets, manifest, apple icon, and social image were available;
- response security headers and canonical analytics tags were present;
- no visible raw LaTeX/source commands, KaTeX error marker, noindex, or horizontal overflow was found.

Real-browser desktop QA at 1280 by 720 verified the map, light and dark themes, one interactive Riemann visual, zoom feedback, static fallback retention, a cumulative-practice attempt gate and server reveal, and a complete exam key. This browser surface could not emulate a true mobile viewport; mobile safety is supported by the responsive browser-independent suite and narrow-screen overflow/print tests, not claimed as a separate physical-device session.

## Rollback

Preserve the failing deployment evidence, revert the Unit 3A merge commit without rewriting history, rebuild, and redeploy the prior accepted source or immutable target `https://64a6928b.bettergrades-vhc.pages.dev`. Then reverify all four origins, Units 1 through 2B, sitemap, robots, search, analytics, answer keys, and visual assets.

## Adversarial-review corrective release

The independent review found narrow arbitrary-constant normalization, an unexercised integral-setup comparator, and residual list source in the common-errors compiled artifact. The corrective candidate fixes all three and passes the full local 202-test suite. Exact corrected Sites, Git, Cloudflare, Pi, crawl, and browser evidence is recorded here before this report is accepted and before Unit 3B begins.
