# BetterGrades URL migration map

The canonical redirect registry currently expands to 135 legacy URLs. `data/seo/url-migration-map.csv` records every source, final target, decision, HTTP status, chain depth, target status, sitemap membership, evidence, and local verification status.

Local verification proves:

- 135 of 135 sources return their declared permanent status;
- every redirect reaches its canonical target in one hop;
- every target returns `200`;
- there are no self-redirects or detected loops;
- no redirected source appears in the sitemap;
- all targets appear in the canonical sitemap.

The five article/lesson decisions are governed by `ARTICLE_LESSON_INTENT_MAP.md`. Other entries are existing aliases and historical route migrations already represented by the canonical registry. Release A changes delivery by generating the same registry into `_redirects`; it does not invent a second redirect source.

Any future `MERGE_AND_REDIRECT`, `REMOVE_404`, `REMOVE_410`, or `NOINDEX` decision requires page/query history, inbound-link evidence, or an explicit editorial migration record.
