# Glossary registry

Glossaries are subject-owned data registries. UI components, search records, page-term popovers, routes, and sitemap entries consume those registries; glossary definitions do not belong in page components.

## Mathematics layout

- `math/define.mjs` defines the immutable term shape.
- `math/terms/*.mjs` shards terms by durable editorial category. Add a new shard when a file becomes difficult to review; do not create a new display page for every small branch of mathematics.
- `math/registry.mjs` combines and validates the shards, owns search helpers, maps visible LaTeX commands to glossary entries, and defines reserved uppercase uses.
- `page-terms.ts` selects the small contextual set shown near the top of each route. Article terms are inferred from the article and topic registry with a short explicit topic profile as the stable starting point.

## Required term fields

Every term has a stable lowercase `id`, display `term`, subject category, short popover definition, full definition, aliases, search keywords, at least one labeled LaTeX visual, and optional external links. IDs are permanent URL anchors. Rename display text freely when editorially useful; do not recycle an existing ID for a different idea.

External links use `{ label, url }`. Keep them on the term record so a future source review or link checker can inspect the complete outbound-link surface without parsing rendered pages.

## Adding notation

1. Add or update the appropriate glossary term.
2. Map every new visible LaTeX command in `latexCommandGlossaryMap`. Formatting-only commands belong in `latexStructuralCommands` only when they do not introduce mathematical meaning.
3. Use lowercase ordinary variables. If an uppercase letter has a legitimate recurring role, document that role in `uppercaseVariableConventions` and on the conventions page before using it.
4. Add the term ID to a topic or fixed-route profile only when it is genuinely central to that page. The bar should remain a concise orientation layer, not a dump of every word in the article.
5. Run lint, build, and the complete test suite. Registry validation rejects duplicate IDs, missing visuals, undocumented commands, and undocumented uppercase variables in canonical articles.

## Adding another subject

Create a sibling registry with the same stable term contract, add a subject card to `/glossary/`, and provide a subject resolver for contextual page terms. The shared popover should receive a glossary namespace and destination rather than absorbing subject-specific definitions. This keeps thousands of future terms independently searchable and reviewable without one global data file.
