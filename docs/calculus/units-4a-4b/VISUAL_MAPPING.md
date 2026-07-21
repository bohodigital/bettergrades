# Unit 4 visual mapping

## Unit 4A

Unit 4A contains exactly 18 public visuals:

- 11 static-first explanatory SVG scenes
- 7 bounded BetterGrades Interactive 2D scenes
- 18 content-addressed SVG and print fallbacks

Every visual has a stable source ID, route, instructional title and description, color-independent explanation, reading order, reduced-motion behavior, grayscale-safe print representation, operation/sample budgets, and public-only provenance. The import rejects mismatches between a lesson's declared `bgvisual` ID and the route's registered visual order.

Raw TikZ, authored LaTeX, source filenames, executable callbacks, and renderer-vendor APIs are not present in public runtime payloads.

## Unit 4B

Unit 4B contains exactly 20 public visuals:

- 14 static-first explanatory SVG scenes
- 6 bounded BetterGrades Interactive 2D scenes
- 20 content-addressed SVG and print fallbacks
- 0 JSXGraph, uPlot, 3D, callback, or vendor-API scenes

Every Unit 4B scene uses the existing BVLP compiler and lightweight runtime. Dedicated verification checks source-to-route ordering, accessibility, reduced motion, grayscale-safe print output, deterministic compilation, bounded sampling, stable controls, and exclusion of source LaTeX, canonical answers, and executable drawing programs from public payloads.
