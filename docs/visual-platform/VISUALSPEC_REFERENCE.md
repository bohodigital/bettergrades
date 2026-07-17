# VisualSpec v1 reference

## Contract

`VisualSpec` is authored instructional data. It says what is present, why it is
present, and which capabilities are required. It contains no JSXGraph, uPlot,
Canvas, SVG, D3, or arbitrary JavaScript implementation details. One strict Zod
schema is canonical and TypeScript types are inferred from it.

The canonical implementation is `lib/visualization/schema/index.ts`. The
following is a condensed view of its current v1 surface; nested values are the
strict Zod types exported from that module.

```ts
type VisualSpec = {
  schemaVersion: 1;
  id: string;
  kind: VisualKind;
  title: RichText;
  caption: RichText;
  learningPurpose: string;
  longDescription: string;
  coordinateSpace: CoordinateSpaceSpec;
  viewport: ViewportSpec;
  axes: AxesConfiguration;
  panels: PanelSpec[];
  layers: VisualLayer[];
  controls: ControlSpec[];
  accessibility: AccessibilitySpec;
  print: PrintSpec;
  performance?: PerformanceHints;
  requiredCapabilities: VisualCapability[];
  preferredRenderer: RendererPreference;
  provenance: ProvenanceSpec;
};
```

## Required fields

| Field | Meaning and rule |
| --- | --- |
| `schemaVersion` | literal `1`; future versions require explicit migration |
| `id` | stable, repository-unique, safe identifier; duplicates fail |
| `kind` | one documented `VisualKind`; unknown/reserved unsupported kinds fail |
| `title` | semantic title, safely renderable; must not expose author source |
| `caption` | visible instructional caption; nonempty |
| `learningPurpose` | concise link to the lesson objective; nonempty |
| `longDescription` | complete nonvisual account of the core meaning; nonempty |
| `coordinateSpace` | units, coordinate model, orientation, transforms as applicable |
| `viewport` | finite valid bounds and responsive behavior |
| `axes` | explicit axes or explicit no-axis choice; units where applicable |
| `panels` | ordered, non-overlapping panels; defaults to an empty array |
| `layers` | ordered, typed scene objects with stable IDs and valid references |
| `controls` | bounded, accessible controls; defaults to an empty array |
| `accessibility` | non-color distinctions, semantics, focus/announcements/fallbacks |
| `print` | required generated mapping or retained verified asset mapping |
| `performance` | optional hints that may tighten but never bypass hard budgets |
| `requiredCapabilities` | explicit resolver inputs; missing support fails |
| `preferredRenderer` | advisory only; defaults to `lowest-cost` and cannot override capability or cost policy |
| `provenance` | route, source file, authoring ID, and public/fixture visibility |

## Visual kinds

Initially supported or schema-recognized kinds are `cartesian-2d`,
`piecewise-cartesian-2d`, `parametric-2d`, `polar-2d`, `number-line`,
`complex-plane`, `geometry-2d`, `matrix-transform-2d`, `data-series`,
`vector-field-2d`, `direction-field`, `phase-line`, `free-body-diagram`,
`circuit-diagram`, `reaction-coordinate`, and `energy-level-diagram`.

`surface-3d`, `vector-field-3d`, and `molecular-3d` are reserved but unsupported
in production v1. A requested 3D capability fails with visual ID, source,
missing capability, and adapter guidance.

## Layer kinds

The implemented v1 schema documents and validates: `function`, `parametric-curve`,
`polar-curve`, `sampled-series`, `piecewise-branch`, `point`, `open-point`,
`closed-point`, `line`, `ray`, `segment`, `vector`, `polygon`, `circle`,
`ellipse`, `region`, `inequality-region`, `vertical-asymptote`,
`horizontal-asymptote`, `tangent-line`, `secant-line`, `grid`, `basis-grid`,
`label`, `annotation`, `direction-arrow`, `error-band`, `data-marker`, `trace`,
and `linked-object`.

Each layer has a unique ID, kind-specific data, safe style semantics, and no
vendor options. References must resolve; unsupported cycles fail.

## Control kinds

The v1 control vocabulary is `slider`, `draggable-point`, `toggle`,
`reset-view`, `play-pause`, `step-control`, `parameter-input`, and
`linked-cursor`. Every control needs an accessible name, bounded values or
states, deterministic reset, keyboard behavior, and declared target references.

## Capabilities

Capabilities are stable semantic requirements, not vendor names. The canonical
list must be exported by code and validated against
[RENDERER_CAPABILITIES.md](RENDERER_CAPABILITIES.md). At minimum the vocabulary
must distinguish static drawing, pan/zoom, coordinate readout, draggable points,
bounded parameters, linked panels/cursors, animation, constrained geometry,
implicit curves, direction fields/ODE geometry, dense precomputed series,
cursor/zoom data exploration, and reserved 3D behavior.

## Validation and errors

Validation is strict: unknown fields are rejected rather than stripped. Fail on
missing/duplicate IDs, unknown kinds/layers/operators/controls, missing required
units/accessibility/print data, invalid viewport, empty caption/description,
missing references, unsupported cycles, unsupported capability/3D, and any
expression or control exceeding safety bounds. Errors identify source file,
route, visual ID, layer ID, offending value, category, and suggested correction
where practical.

## Defaults

The schema supplies presentation and bounded-performance defaults only. It does
not invent units, accessibility meaning, print mapping, capabilities, or domain
behavior.

| Surface | Implemented default |
| --- | --- |
| viewport | `aspectRatio: 1.6`, `padding: 0.04` |
| axis | `scale: linear`, `showGrid: false` |
| panel | `rowSpan: 1`, `columnSpan: 1` |
| layer | `visible: true`, `zIndex: 0`, `references: []` |
| presentation | `lineStyle: solid`, `markerShape: none`, `pattern: none` |
| visual | `panels: []`, `controls: []`, `preferredRenderer: lowest-cost` |
| accessibility | `controlInstructions: []` |
| compiler performance when omitted | 2,048 samples, adaptive depth 12, 256 AST nodes, AST depth 24, 2,048 operations/evaluation, 64,000 payload bytes, 30 animation FPS, activation `none` |

## Minimal example

The following JSON is a complete minimal value accepted by the implemented
`VisualSpecSchema`; it is intentionally a schema example rather than a public
Limits migration record.

```json
{
  "schemaVersion": 1,
  "id": "schema-example-point",
  "kind": "cartesian-2d",
  "title": { "segments": [{ "kind": "text", "text": "A point on a plane" }] },
  "caption": { "segments": [{ "kind": "text", "text": "The filled point is located at one, two." }] },
  "learningPurpose": "Connect an ordered pair to its Cartesian location.",
  "longDescription": "A Cartesian plane contains one filled point at x equals 1 and y equals 2.",
  "coordinateSpace": {
    "type": "cartesian-2d",
    "variables": ["x", "y"],
    "unitsRequired": false
  },
  "viewport": { "xMin": -1, "xMax": 3, "yMin": -1, "yMax": 4 },
  "axes": {
    "mode": "explicit",
    "axes": [
      {
        "id": "x-axis",
        "orientation": "x",
        "label": { "segments": [{ "kind": "text", "text": "x" }] },
        "tickMode": "fixed-step",
        "tickStep": 1
      },
      {
        "id": "y-axis",
        "orientation": "y",
        "label": { "segments": [{ "kind": "text", "text": "y" }] },
        "tickMode": "fixed-step",
        "tickStep": 1
      }
    ]
  },
  "layers": [
    {
      "id": "point-a",
      "kind": "closed-point",
      "label": { "segments": [{ "kind": "text", "text": "point at (1, 2)" }] },
      "geometry": { "position": { "x": 1, "y": 2 } },
      "presentation": {
        "markerShape": "circle",
        "colorIndependentCue": "A filled circle marks the included point."
      }
    }
  ],
  "accessibility": {
    "ariaLabel": "Cartesian point at one, two.",
    "summary": "One filled point appears at the ordered pair one, two.",
    "readingOrder": ["point-a"],
    "colorIndependentDescription": "A filled circular marker identifies the point without relying on color.",
    "reducedMotion": "not-applicable",
    "staticFallbackEquivalent": true
  },
  "print": {
    "representation": "generated-svg",
    "caption": { "segments": [{ "kind": "text", "text": "A filled point at (1, 2)." }] },
    "grayscaleSafe": true,
    "pageBreak": "avoid",
    "widthInches": 4
  },
  "requiredCapabilities": ["static-fallback", "cartesian-axes", "open-closed-points"],
  "provenance": {
    "route": "/fixtures/schema-example-point/",
    "sourceFile": "content/visualizations/fixtures/schema-example-point.json",
    "authoringId": "schema-example-point",
    "visibility": "fixture"
  }
}
```

## Versioning

Existing v1 specs remain immutable in meaning. Additive or breaking changes
require schema-version policy, a deterministic migration, fixtures, generated
docs, compatibility tests, and an ADR when renderer/content semantics change.
Never silently reinterpret or downgrade a stored v1 field.
