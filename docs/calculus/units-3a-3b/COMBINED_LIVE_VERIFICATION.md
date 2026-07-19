# Combined Unit 3 live verification

Status: passed on 2026-07-19 UTC for immutable, Pages, apex, and www production origins.

## Exact deployed source

- Commit: `ccd2f172f73c8a83f73e17b2008838a14b2d21bc`
- Tree: `2616ac44de0da31b7bb4dead1b83740f5facaabf`
- Immutable release: `https://a14da09c.bettergrades-vhc.pages.dev`

The subsequent closeout commit contains documentation only and is not part of the deployed Worker or asset graph.

## Origin matrix

The same checks passed at:

- `https://a14da09c.bettergrades-vhc.pages.dev`
- `https://bettergrades-vhc.pages.dev`
- `https://bettergrades.net`
- `https://www.bettergrades.net`

Unit 3A: all 36 registered routes, all 11 visual fallbacks, and both published answer keys passed at every origin. Each answer key was present through Problem 10.

Unit 3B: all 25 registered routes, all nine visual fallbacks, both published answer keys, the map, the Unit 3A return link, grader states, and the attempted exercise reveal passed at every origin. Each answer key was present through Problem 13.

## Shared release checks

- Every route returned HTML with its own canonical URL, `index, follow`, analytics tag and site ID, structured data, unit shell, and required security headers.
- Every route appeared in the live sitemap. Robots permitted crawling and both SEO control documents remained ineligible for edge-cache hits.
- No route contained `noindex`, visible raw LaTeX/TikZ/source commands, KaTeX error markers, or visual-unavailable messages.
- Every visual fallback returned an SVG with a title, description, and view box and without scripts, foreign objects, expression source, or internal source paths.
- Greater-or-equal favicon and profile-identity assets, PNG icons, Apple touch icon, manifest, and social image returned successfully.
- Unit 3A linked forward to Unit 3B, and every Unit 3B route linked back to the Unit 3A foundations map.
- Unit 3B's map put the complete textbook path and published answer keys before focused explorations and supporting resources.

## Browser matrix

| Surface | Result |
| --- | --- |
| Desktop map and course navigation | Passed |
| Desktop Section/Lens exposition | Passed |
| Light and dark themes | Passed |
| Washer sampled rings and labels | Passed |
| Shell sampled rims and labels | Passed |
| Washer keyboard slider and live status | Passed |
| Attempt-gated supplied answer | Passed |
| Published exam key through final problem | Passed |
| Mobile map at 390 by 844 | Passed |
| Mobile washer visual and controls | Passed |
| Horizontal overflow | None observed |

## Evidence files

- Unit 3A report: `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/unit3a-live-verification-final.json`
- Unit 3B report: `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/unit3b-live-verification-final.json`
- Unit 3A verifier: `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/verify-unit3a-final-live.mjs`
- Unit 3B verifier: `/srv/local1/runtime/bettergrades/intake/units-3a-3b-v3/verify-unit3-live.mjs`

## Release boundary

This verification confirms production publication and browser-visible behavior. It does not claim future search-engine recrawl timing or ranking. Search identity, indexability, canonical metadata, sitemap inclusion, and crawler access are present and technically ready.
