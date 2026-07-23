# Search measurement plan

## Baseline and windows

Pin Release A merge commit, tree, immutable deployment, production timestamp, and prior deployment. Compare:

- 28 complete days before the full-course launch;
- launch day through the day before Release A;
- Release A day and daily cohorts afterward;
- rolling 7-day and 28-day windows, with weekday-aligned comparisons.

Segment by page type: legacy concise article, course lesson, unit map, practice/exam, answer key, glossary, tool, and future Release B resource/worked problem/visual.

## Measures

- Search Console web and image clicks, impressions, CTR, average position, indexed state, selected canonical, crawl status, new/lost query, and new/lost landing page.
- GA4 landing sessions, engaged sessions, engagement rate, and existing resource interaction events.
- Umami pageviews and unique visitors as an independent first-party directional check.
- Cloudflare status, cache outcome, origin/Worker invocation, Worker error, and representative latency.
- Technical audit counts: sitemap routes, redirects, canonical conflicts, `404`, soft-404, `5xx`, duplicate bodies, public leaks, and malformed math.

## Interpretation

Do not infer causation from a single short window. Treat redirect migration separately from retained-page performance. Annotate every release and deployment. Compare page/query pairs, not only site totals. Escalate if canonical conflicts, unexplained `5xx`, or indexed-page loss rises after release.

The repository currently lacks the needed exports. The schema-only CSV artifacts define the exact Search Console handoff; populate them without changing column names when access is supplied.

## Release B reporting

Report weekly by lessons, articles, unit hubs, worksheets, practice exams, formula sheets, worked problems, visuals, enriched glossary pages, and image-search landing pages.

Include impressions, clicks, CTR, position, queries, indexed URLs, canonical conflicts, downloads, practice/exam starts and completions, Image Search performance, referring domains, crawl failures, orphans, and redirect hits.

Resource events use only `resource_id`, `resource_type`, `course`, `unit`, `topic`, `difficulty`, `file_type`, and `source_lesson`. They never include identity, contact details, full responses, or raw work.

The local `boho-analytics-platform` mirror contains no BetterGrades measurement id or site binding. Bounded, human-approved follow-up `CR-2026-07-23-BOHO-ANALYTICS-BETTERGRADES-GA4-BINDING-001` records the exact read-only cross-repository change. Dashboard ingestion does not block this release.
