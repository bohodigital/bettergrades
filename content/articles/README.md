# Better Grades article sources

The article body has one canonical format: a small, valid LaTeX subset. The website parses that document into accessible HTML and sends every equation through KaTeX. The same source can be wrapped as a standalone `.tex` file for XeLaTeX or LuaLaTeX.

## Recommended authoring path

Write a plain Markdown draft using the pattern in `_example.md`, then compile it:

```sh
pnpm article:compile content/articles/_example.md build/example.tex
pnpm article:compile content/articles/_example.md build/example-standalone.tex --standalone --title="Completing the square"
```

The first command produces the canonical `bgarticle` body used by the site. The second produces a complete LaTeX document suitable for PDF compilation. The compiler is deterministic and does not need a browser, a Worker, or an external API.

## Supported Markdown

- `## Heading` becomes `\section{Heading}`. A single `# Title` is ignored because title and SEO metadata belong to the content registry.
- `$x^2$` becomes inline math; a `$$` block becomes display math.
- Paragraphs, bold, emphasis, ordered lists, and unordered lists are supported.
- `> [!NOTE] Title` and `> [!TIP] Title` create the occasional note box.
- `> [!EXAMPLE] Title` creates an example box.

Keep the article itself plain. Navigation, related links, search terms, route metadata, review dates, and tool/practice connections remain registry fields; they are not presentation markup inside the lesson.

## Canonical LaTeX subset

The browser renderer accepts `bgarticle`, `bgbox`, `bgexample`, `itemize`, `enumerate`, `\section`, `\textbf`, `\emph`, inline `\( ... \)`, and display `\[ ... \]`. The standard `aligned` and `cases` math environments are allowed inside display equations. Unknown environments fail validation instead of silently producing a broken article.

Existing articles still keep their legacy structured fields for search and metadata compatibility, but every one is compiled to this canonical document before rendering. New articles can set `documentSource` directly and use those old fields only until the registry's searchable excerpt model is separated from the legacy schema.

## Writing rules

1. Lead with the governing equation or the answer.
2. Use normal paragraphs for explanation. Do not design the page in Markdown.
3. Use boxes sparingly: usually one short “start here” note and one worked example.
4. Put each mathematical transformation in display math when a student needs to inspect it.
5. End with mistakes and durable takeaways as short lists.
6. Run the article tests before publishing. Production deployment still follows the Pi, Git, MCP, and approval workflow.
