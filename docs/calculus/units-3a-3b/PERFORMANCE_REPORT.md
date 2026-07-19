# Performance report

## Preserved budgets

- Interactive BVLP runtime source remains below its 30 KB gzip test budget.
- JSXGraph remains explicit-action lazy and below its 180 KB gzip test budget.
- Unit 3A uses the built-in interactive renderer for its four interactive scenes and static SVG for seven scenes.
- Route-local public payloads exclude whole-unit bodies, answer registries, source metadata, and unrelated visual registries.
- No new Cloudflare binding, database, queue, object store, runtime model, or specialist renderer was added.

The production build retains pre-existing vinext warnings for a large client chunk and direct `eval` inside the installed JSXGraph parser. Unit 3A does not add JSXGraph usage or executable authored visual code. These warnings are tracked rather than misreported as new Unit 3 defects.

Exact hosted transfer and cache observations are recorded after immutable deployment.
