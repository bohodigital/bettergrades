# Unit 4A visual mapping

Unit 4A contains exactly 18 public visuals:

- 11 static-first explanatory SVG scenes
- 7 bounded BetterGrades Interactive 2D scenes
- 18 content-addressed SVG and print fallbacks

Every visual has a stable source ID, route, instructional title and description, color-independent explanation, reading order, reduced-motion behavior, grayscale-safe print representation, operation/sample budgets, and public-only provenance. The import rejects mismatches between a lesson's declared `bgvisual` ID and the route's registered visual order.

Raw TikZ, authored LaTeX, source filenames, executable callbacks, and renderer-vendor APIs are not present in public runtime payloads.
