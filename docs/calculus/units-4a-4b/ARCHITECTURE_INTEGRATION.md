# Architecture integration

Unit 4A extends the established Units 2A-3B pipeline rather than adding a parallel renderer or content system.

- Exact handoff artifacts are installed under `content/calculus/units/unit-4a/handoff/`.
- `tools/import-calculus-unit.mjs` compiles route and page data while preserving public/server answer separation.
- `tools/visualization/unit-4a-visual-definitions.mjs` authors the 18 explicit VisualSpec records.
- The existing BVLP compiler produces 18 content-addressed SVG fallbacks and seven bounded interactive scenes.
- Existing registry, search, assessment, reveal, navigation, SEO, and Worker paths register the new unit.
- The parser adds only the handoff's `bgvisual` and `bgvisualreading` contracts. Declared visual IDs are checked against route order, so drift fails the import.

Unit 4B is deliberately absent from public navigation, route registration, server payloads, and visual manifests in this release.
