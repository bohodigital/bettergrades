import type { VisualSpec } from "../schema/index.ts";

export function richText(text: string) {
  return { segments: [{ kind: "text" as const, text }] };
}

export function makeVisualSpec(
  overrides: Partial<VisualSpec> = {},
): VisualSpec {
  const base = {
    schemaVersion: 1 as const,
    id: "fixture-function-plot",
    kind: "cartesian-2d" as const,
    title: richText("A quadratic function"),
    caption: richText("The graph of y equals x squared."),
    learningPurpose: "Connect the symbolic rule x squared with its Cartesian graph.",
    longDescription: "A U-shaped parabola opens upward, has vertex at the origin, and passes through negative two comma four and two comma four.",
    coordinateSpace: {
      type: "cartesian-2d" as const,
      variables: ["x", "y"],
      unitsRequired: false,
    },
    viewport: {
      xMin: -4,
      xMax: 4,
      yMin: -1,
      yMax: 8,
      aspectRatio: 1.6,
      padding: 0.04,
    },
    axes: {
      mode: "explicit" as const,
      axes: [
        {
          id: "x-axis",
          orientation: "x" as const,
          label: richText("x"),
          scale: "linear" as const,
          tickMode: "automatic" as const,
          showGrid: true,
        },
        {
          id: "y-axis",
          orientation: "y" as const,
          label: richText("y"),
          scale: "linear" as const,
          tickMode: "automatic" as const,
          showGrid: true,
        },
      ],
    },
    panels: [],
    layers: [
      {
        id: "quadratic",
        kind: "function" as const,
        visible: true,
        zIndex: 1,
        presentation: {
          strokeToken: "visual-primary",
          lineStyle: "solid" as const,
          markerShape: "none" as const,
          pattern: "none" as const,
          colorIndependentCue: "A solid curve labeled y equals x squared.",
        },
        references: [],
        geometry: {
          expression: {
            format: "ast" as const,
            ast: {
              type: "power" as const,
              left: { type: "variable" as const, name: "x" },
              right: { type: "number" as const, value: 2 },
            },
          },
          variable: "x",
          domain: { min: -4, max: 4, includeMin: true, includeMax: true },
        },
      },
    ],
    controls: [],
    accessibility: {
      ariaLabel: "Graph of y equals x squared",
      summary: "A parabola with vertex at the origin.",
      readingOrder: ["quadratic"],
      colorIndependentDescription: "The function is distinguished by a solid curve and its label, not by color alone.",
      controlInstructions: [],
      reducedMotion: "not-applicable" as const,
      staticFallbackEquivalent: true as const,
    },
    print: {
      representation: "generated-svg" as const,
      caption: richText("The graph of y equals x squared."),
      grayscaleSafe: true as const,
      pageBreak: "avoid" as const,
      widthInches: 5.5,
    },
    requiredCapabilities: ["static-fallback" as const, "cartesian-axes" as const, "function-paths" as const],
    preferredRenderer: "lowest-cost" as const,
    provenance: {
      route: "/fixtures/quadratic/",
      sourceFile: "fixtures/quadratic.visual.ts",
      authoringId: "fixture-quadratic",
      visibility: "fixture" as const,
    },
  } satisfies VisualSpec;
  return { ...base, ...overrides } as VisualSpec;
}

export function cloneFixture<T>(value: T): T {
  return structuredClone(value);
}
