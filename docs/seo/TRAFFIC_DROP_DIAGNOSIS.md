# BetterGrades traffic-drop diagnosis

## Conclusion

The technical defects are verified; a ranking cause is not.

### Verified causes of crawl-quality risk

- 269 lesson responses contained two complete crawl-visible copies of the lesson.
- 30 routes exposed an internal Unit 4 visual-authoring directive in public copy and SVG metadata.
- 32 routes exposed malformed visible math fallback tokens.
- Educational HTML was evaluated through a large Worker on every request even though the content is deterministic.

These defects can waste crawl resources, confuse document extraction, reduce snippet quality, and increase the chance of resource-limit responses. The audit does not prove that any one defect caused the reported traffic drop.

### Strong contributors

- The duplicate document architecture affected most of the curriculum and changed the raw document seen by crawlers.
- Unit 4 introduced approved redirects from five older page intents to comprehensive lessons. Without page/query history, redistribution between old and new landing pages cannot be quantified.
- Dynamic evaluation of all educational routes created avoidable operational exposure under crawler bursts.

### Plausible contributors

- Search engines may have needed time to recrawl and reassess a large course expansion.
- New lesson clusters may temporarily compete with retained concise articles before intent separation is understood.
- Publicly malformed fallback text may have influenced snippets on affected pages.

### Coincidental timing and unknowns

No Search Console connector, credentials, or export was available in the workspace. Repository search found no Search Console, GA4, Umami, Cloudflare, or Boho Analytics export containing the required before/after landing-page and query series. A bounded Bohopi knowledge search likewise returned no BetterGrades traffic dataset. The three required CSV artifacts therefore contain schemas only and no invented rows.

Required Search Console exports:

- Pages: `page`, `date`, `clicks`, `impressions`, `ctr`, `position`, filtered to the 28 days before the full-course launch and every day after.
- Queries: `query`, `page`, `date`, `clicks`, `impressions`, `ctr`, `position`.
- URL inspection: `inspected_url`, `indexed_status`, `user_selected_canonical`, `google_selected_canonical`, `last_crawl`, `crawl_status`.
- Coverage: indexed, excluded, redirect, 404, soft-404, and 5xx URLs with first/last detected dates.
- Image Search: query/page/date metrics with search type `image`.

GA4/Umami/Cloudflare exports should include date, landing path, referrer/source, pageviews or sessions, unique visitors, status, cache outcome, Worker invocation/error, and deployment marker. Until those are available, traffic attribution remains unknown and no redirect is justified by presumed rankings alone.
