# Print and export parity

VisualSpec is the long-term source of truth for web and print. Version 1
preserves the existing Limits TeX source and pinned Tectonic workflow while the
web migration uses generated static SVG fallbacks.

## Mapping policy

1. For safely translatable kinds, generate or bridge PGFPlots/TikZ or another
   existing print representation from the validated spec.
2. When translation is not safe in v1, retain the previously verified print
   figure and record an explicit parity mapping.
3. Every public visual identifies exactly one current print representation.
4. Missing mappings fail validation; never silently omit a figure.

Each mapping records visual ID/kind, source, web static asset, generated or
retained print mode, print asset/source, caption/description relationship,
known intentional differences, parity reviewer, compile evidence, and rollback.
All 13 current Limits VisualSpecs declare a generated-SVG web mapping,
grayscale safety, print caption, page-break policy, and width. The migration
manifest maps each web visual to its existing TeX figure.

## Candidate compile evidence

The integrated candidate through
`400c937` was compiled on the Pi after the
power interruption with Tectonic 0.16.9 in cache-only mode. The durable output
and log are under:

`/srv/local1/runtime/bettergrades/print-validation/WO-2026-07-17-BETTERGRADES-BVLP-INFRASTRUCTURE-001-section/`

| Evidence | Result |
| --- | --- |
| mode | cache-only; no dependency/network mutation |
| PDF | `main.pdf` |
| PDF size | 481,925 bytes |
| page count | 175 |
| PDF SHA-256 | `ce8ead4ce7099e4eb98855395fcf1b1432c43d266e9b01d7951b81614feaeae4` |
| Tectonic binary SHA-256 | `d5bc7fdf216689a14996a4d06b3807841336bbb9aff4114102701f7c1e39579f` |
| fatal or unresolved-error scan | 0 |
| underfull/overfull warnings | 8; accepted compile-warning count |
| PDF terminology scan | 0 case-insensitive `chapter` hits |
| representative rendered-page visual inspection | pass; 19 pages at 144 DPI with Poppler 26.05.0 |

The version, command mode, binary identity, output identity, count, hash, and
log scan are verified.

## Visual parity review

Compare mathematical objects/functions/domains, discontinuities, open/closed
points, asymptotes, annotations, captions, panel order, units, grayscale-safe
distinctions, and instructional purpose. Pixel identity is not required. Print
must not expose raw LaTeX/TikZ/PGFPlots source to learners.

Pages 3, 13, 14, 32, 39, 57, 63, 80, 102, 107, 126, 142, 144, 145, 155,
159, 164, 169, and 174 were inspected. They contain no clipping, overlap,
missing glyphs, broken math, black boxes, or page-edge collisions, and they use
`Section`/`SECTION` consistently. Full extracted text contains no
case-insensitive `chapter` occurrence. The accepted 175-page parity is complete;
the prior production source remains the rollback point.

Future print adapters follow the renderer-neutral compiled contract, add
kind/capability coverage and tests, and migrate mappings explicitly; they do
not change lesson content or silently reinterpret old specs.
