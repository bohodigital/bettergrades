# Performance report

## Preserved budgets

- Interactive BVLP runtime source remains below its 30 KB gzip test budget.
- JSXGraph remains explicit-action lazy and below its 180 KB gzip test budget.
- Unit 3A uses the built-in interactive renderer for its four interactive scenes and static SVG for seven scenes.
- Route-local public payloads exclude whole-unit bodies, answer registries, source metadata, and unrelated visual registries.
- No new Cloudflare binding, database, queue, object store, runtime model, or specialist renderer was added.

The production build retains pre-existing vinext warnings for a large client chunk and direct `eval` inside the installed JSXGraph parser. Unit 3A does not add JSXGraph usage or executable authored visual code. These warnings are tracked rather than misreported as new Unit 3 defects.

Exact hosted transfer and cache observations are recorded after immutable deployment.

## Unit 3A production observations

The Unit 3A map HTML was 48,459 bytes on immutable, pages.dev, apex, and www during the release crawl. The apex and www dynamic HTML responses reported `CF-Cache-Status: DYNAMIC`. Robots and sitemap remain explicitly cache-ineligible through the verified primary-management rule. No route-specific Unit 3A visual dependency loaded on the map, and the selected Riemann visual enhanced only after entering the relevant lesson.

The Pi's default 2 GB Node heap was insufficient for the final long rendered-HTML child process. A bounded 4 GB heap passed on hardware with adequate available memory. This affects release-test configuration, not the production Worker runtime.
