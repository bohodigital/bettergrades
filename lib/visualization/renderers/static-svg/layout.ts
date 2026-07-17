import type { CompiledScene } from "../../schema/index.ts";
import { StaticSvgRenderError } from "./errors.ts";

export const SVG_WIDTH = 960;
const OUTER_PADDING = 28;
const PANEL_GAP = 24;

export type Viewport = CompiledScene["viewport"];
export type Axes = CompiledScene["axes"];

export type PanelLayout = Readonly<{
  id?: string;
  title?: CompiledScene["title"];
  description?: string;
  order: number;
  viewport: Viewport;
  axes: Axes;
  frame: Readonly<{ x: number; y: number; width: number; height: number }>;
  plot: Readonly<{ x: number; y: number; width: number; height: number }>;
}>;

export type SceneLayout = Readonly<{
  width: number;
  height: number;
  panels: readonly PanelLayout[];
}>;

export function createSceneLayout(scene: CompiledScene): SceneLayout {
  if (!scene.panels.length) {
    const height = Math.max(400, Math.min(680, Math.round(SVG_WIDTH / scene.viewport.aspectRatio)));
    const frame = { x: OUTER_PADDING, y: OUTER_PADDING, width: SVG_WIDTH - OUTER_PADDING * 2, height: height - OUTER_PADDING * 2 };
    return Object.freeze({
      width: SVG_WIDTH,
      height,
      panels: Object.freeze([createPanelLayout(undefined, scene.viewport, scene.axes, frame)]),
    });
  }

  const columns = Math.max(...scene.panels.map((panel) => panel.column + panel.columnSpan));
  const rows = Math.max(...scene.panels.map((panel) => panel.row + panel.rowSpan));
  if (columns < 1 || rows < 1) {
    throw new StaticSvgRenderError("invalid-panel-grid", `Scene ${scene.id} has an empty panel grid.`, scene.id);
  }
  const height = OUTER_PADDING * 2 + rows * 282 + (rows - 1) * PANEL_GAP;
  const availableWidth = SVG_WIDTH - OUTER_PADDING * 2 - (columns - 1) * PANEL_GAP;
  const availableHeight = height - OUTER_PADDING * 2 - (rows - 1) * PANEL_GAP;
  const columnWidth = availableWidth / columns;
  const rowHeight = availableHeight / rows;
  const panels = [...scene.panels]
    .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id))
    .map((panel) => {
      const frame = {
        x: OUTER_PADDING + panel.column * (columnWidth + PANEL_GAP),
        y: OUTER_PADDING + panel.row * (rowHeight + PANEL_GAP),
        width: panel.columnSpan * columnWidth + (panel.columnSpan - 1) * PANEL_GAP,
        height: panel.rowSpan * rowHeight + (panel.rowSpan - 1) * PANEL_GAP,
      };
      return createPanelLayout(panel, panel.viewport ?? scene.viewport, panel.axes ?? scene.axes, frame);
    });
  return Object.freeze({ width: SVG_WIDTH, height, panels: Object.freeze(panels) });
}

function createPanelLayout(
  panel: CompiledScene["panels"][number] | undefined,
  viewport: Viewport,
  axes: Axes,
  frame: { x: number; y: number; width: number; height: number },
): PanelLayout {
  const titleSpace = panel ? 34 : 0;
  const left = 56;
  const right = 18;
  const top = 18 + titleSpace;
  const bottom = 48;
  if (frame.width <= left + right + 40 || frame.height <= top + bottom + 40) {
    throw new StaticSvgRenderError("panel-too-small", `Panel ${panel?.id ?? "default"} is too small to render safely.`);
  }
  return Object.freeze({
    id: panel?.id,
    title: panel?.title,
    description: panel?.description,
    order: panel?.order ?? 0,
    viewport,
    axes,
    frame: Object.freeze(frame),
    plot: Object.freeze({
      x: frame.x + left,
      y: frame.y + top,
      width: frame.width - left - right,
      height: frame.height - top - bottom,
    }),
  });
}

export function projectX(value: number, panel: PanelLayout): number {
  return panel.plot.x + ((value - panel.viewport.xMin) / (panel.viewport.xMax - panel.viewport.xMin)) * panel.plot.width;
}

export function projectY(value: number, panel: PanelLayout): number {
  return panel.plot.y + (1 - (value - panel.viewport.yMin) / (panel.viewport.yMax - panel.viewport.yMin)) * panel.plot.height;
}

export function panelForLayer(scene: CompiledScene, layout: SceneLayout, panelId?: string): PanelLayout {
  if (!scene.panels.length) return layout.panels[0];
  const panel = layout.panels.find((candidate) => candidate.id === panelId);
  if (!panel) {
    throw new StaticSvgRenderError("missing-panel", `Layer references missing panel ${panelId ?? "(none)"}.`, scene.id);
  }
  return panel;
}
