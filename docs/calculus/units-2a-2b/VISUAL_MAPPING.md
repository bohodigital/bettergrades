# Unit 2A visualization mapping

## Inventory and renderer decision

- 27 strict VisualSpec v1 records.
- 27 deterministic CompiledScene v1 records.
- 26 static-first scenes.
- 1 bounded interactive scene.
- 27 content-addressed SVG fallbacks.
- Aggregate SVG size: 356,020 bytes.
- Largest SVG: 16,468 bytes; hard limit: 50,000 bytes.

The default policy is exact static explanation first. Interaction is used only where manipulating a mathematical parameter materially improves the lesson. No heavyweight renderer is loaded merely because a brief mentions one.

## Visual QA contract

Every scene contains:

- a stable ID and route placement;
- an instructional purpose;
- structured caption segments;
- alt text and a long description;
- screen-reader reading order;
- color-independent line, point, or region cues;
- responsive dimensions;
- grayscale-safe print behavior;
- a no-JavaScript SVG fallback;
- bounded sampling and content-addressed integrity metadata.

## Label and overlap policy

Labels are placed by the compiled scene rather than overlaid by page prose. Generated SVGs use bounded viewports, explicit panels, direct labels where useful, solid/dashed distinctions, and written descriptions. No text is injected as executable SVG, `foreignObject`, or event handler.

## Limits compatibility

The original 13 Limits scenes retain their exact IDs, routes, hashes, and four-item interaction allowlist. The combined public and Pages directories must equal the exact union of the Limits and Unit 2A manifests; missing and stale assets fail the build.
