"use client";

import { useEffect, useRef } from "react";

type GraphTheme = {
  paper: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  brand: string;
  warm: string;
  good: string;
  bad: string;
  brandSoft: string;
  warmSoft: string;
};

type Area = { left: number; top: number; width: number; height: number };
type Range = { xMin: number; xMax: number; yMin: number; yMax: number };
type Plot = Area & Range & { x: (value: number) => number; y: (value: number) => number };

function cssColor(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}

function graphTheme(): GraphTheme {
  const styles = getComputedStyle(document.documentElement);
  return {
    paper: cssColor(styles, "--paper", "#f6f2e9"),
    surface: cssColor(styles, "--surface", "#fffcf6"),
    ink: cssColor(styles, "--ink", "#17231e"),
    muted: cssColor(styles, "--muted", "#68716a"),
    line: cssColor(styles, "--line", "#cfcabe"),
    brand: cssColor(styles, "--brand", "#125d50"),
    warm: cssColor(styles, "--warm", "#e96b3b"),
    good: cssColor(styles, "--good", "#1b7258"),
    bad: cssColor(styles, "--bad", "#b94738"),
    brandSoft: cssColor(styles, "--brand-soft", "#dcebe4"),
    warmSoft: cssColor(styles, "--warm-soft", "#f8dccd"),
  };
}

function makePlot(ctx: CanvasRenderingContext2D, area: Area, range: Range, theme: GraphTheme, compact = false): Plot {
  const leftPad = compact ? 30 : 48;
  const rightPad = compact ? 10 : 18;
  const topPad = compact ? 26 : 20;
  const bottomPad = compact ? 25 : 38;
  const plotArea = {
    left: area.left + leftPad,
    top: area.top + topPad,
    width: Math.max(10, area.width - leftPad - rightPad),
    height: Math.max(10, area.height - topPad - bottomPad),
  };
  const x = (value: number) => plotArea.left + ((value - range.xMin) / (range.xMax - range.xMin)) * plotArea.width;
  const y = (value: number) => plotArea.top + ((range.yMax - value) / (range.yMax - range.yMin)) * plotArea.height;
  const plot = { ...plotArea, ...range, x, y };

  ctx.save();
  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.55;
  for (let index = 0; index <= 5; index += 1) {
    const gx = plot.left + (plot.width * index) / 5;
    const gy = plot.top + (plot.height * index) / 5;
    ctx.beginPath(); ctx.moveTo(gx, plot.top); ctx.lineTo(gx, plot.top + plot.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(plot.left, gy); ctx.lineTo(plot.left + plot.width, gy); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = theme.muted;
  ctx.lineWidth = 1.5;
  const axisX = Math.max(plot.left, Math.min(plot.left + plot.width, x(0)));
  const axisY = Math.max(plot.top, Math.min(plot.top + plot.height, y(0)));
  ctx.beginPath(); ctx.moveTo(plot.left, axisY); ctx.lineTo(plot.left + plot.width, axisY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(axisX, plot.top); ctx.lineTo(axisX, plot.top + plot.height); ctx.stroke();
  ctx.fillStyle = theme.muted;
  ctx.font = `${compact ? 10 : 11}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(formatTick(range.xMin), plot.left, plot.top + plot.height + (compact ? 16 : 22));
  ctx.fillText(formatTick(range.xMax), plot.left + plot.width, plot.top + plot.height + (compact ? 16 : 22));
  ctx.textAlign = "right";
  ctx.fillText(formatTick(range.yMax), plot.left - 6, plot.top + 4);
  ctx.fillText(formatTick(range.yMin), plot.left - 6, plot.top + plot.height);
  ctx.restore();
  return plot;
}

function formatTick(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function clipPlot(ctx: CanvasRenderingContext2D, plot: Plot) {
  ctx.beginPath();
  ctx.rect(plot.left, plot.top, plot.width, plot.height);
  ctx.clip();
}

function curve(ctx: CanvasRenderingContext2D, plot: Plot, fn: (x: number) => number, color: string, options: { from?: number; to?: number; dashed?: boolean; width?: number; samples?: number } = {}) {
  const from = options.from ?? plot.xMin;
  const to = options.to ?? plot.xMax;
  const samples = options.samples ?? 560;
  ctx.save();
  clipPlot(ctx, plot);
  ctx.strokeStyle = color;
  ctx.lineWidth = options.width ?? 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash(options.dashed ? [7, 6] : []);
  ctx.beginPath();
  let drawing = false;
  let previousY = 0;
  for (let index = 0; index <= samples; index += 1) {
    const input = from + ((to - from) * index) / samples;
    const output = fn(input);
    const px = plot.x(input);
    const py = plot.y(output);
    const discontinuous = !Number.isFinite(output) || py < plot.top - plot.height * 2 || py > plot.top + plot.height * 3 || (drawing && Math.abs(py - previousY) > plot.height * 0.7);
    if (discontinuous) drawing = false;
    else if (!drawing) { ctx.moveTo(px, py); drawing = true; }
    else ctx.lineTo(px, py);
    previousY = py;
  }
  ctx.stroke();
  ctx.restore();
}

function segment(ctx: CanvasRenderingContext2D, plot: Plot, from: [number, number], to: [number, number], color: string, dashed = false, width = 2) {
  ctx.save();
  clipPlot(ctx, plot);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dashed ? [7, 6] : []);
  ctx.beginPath(); ctx.moveTo(plot.x(from[0]), plot.y(from[1])); ctx.lineTo(plot.x(to[0]), plot.y(to[1])); ctx.stroke();
  ctx.restore();
}

function point(ctx: CanvasRenderingContext2D, plot: Plot, at: [number, number], color: string, open = false, radius = 6) {
  ctx.save();
  ctx.beginPath(); ctx.arc(plot.x(at[0]), plot.y(at[1]), radius, 0, Math.PI * 2);
  ctx.fillStyle = open ? themeSurface(ctx) : color;
  ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}

function themeSurface(ctx: CanvasRenderingContext2D) {
  return ctx.canvas.dataset.surface || "#fffcf6";
}

function label(ctx: CanvasRenderingContext2D, plot: Plot, text: string, at: [number, number], color: string, align: CanvasTextAlign = "left") {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = align;
  ctx.fillText(text, plot.x(at[0]), plot.y(at[1]));
  ctx.restore();
}

function title(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, theme: GraphTheme, align: CanvasTextAlign = "left") {
  ctx.save();
  ctx.fillStyle = theme.ink;
  ctx.font = "700 12px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawSingleGraph(ctx: CanvasRenderingContext2D, width: number, height: number, graphId: string, theme: GraphTheme) {
  const area = { left: 12, top: 10, width: width - 24, height: height - 20 };
  if (graphId === "secant-tangent") {
    const plot = makePlot(ctx, area, { xMin: 0, xMax: 3.2, yMin: 0, yMax: 70 }, theme);
    curve(ctx, plot, (x) => 64 * x - 16 * x * x, theme.brand);
    segment(ctx, plot, [0, 16], [2.2, 86.4], theme.warm, false, 2.5);
    segment(ctx, plot, [0, 24], [2.8, 91.2], theme.good, true, 2);
    point(ctx, plot, [1, 48], theme.ink); label(ctx, plot, "P (1, 48)", [1.08, 53], theme.ink);
    label(ctx, plot, "tangent", [1.85, 69], theme.warm);
    return;
  }
  if (graphId === "removable-hole") {
    const plot = makePlot(ctx, area, { xMin: -1, xMax: 5, yMin: 0, yMax: 7 }, theme);
    curve(ctx, plot, (x) => x + 2, theme.brand); point(ctx, plot, [2, 4], theme.warm, true, 7);
    label(ctx, plot, "hole at (2, 4)", [2.15, 4.6], theme.warm);
    return;
  }
  if (graphId === "limit-versus-value") {
    const plot = makePlot(ctx, area, { xMin: -1, xMax: 4, yMin: 0, yMax: 10 }, theme);
    curve(ctx, plot, (x) => x * x + 1, theme.brand); point(ctx, plot, [2, 5], theme.warm, true, 7); point(ctx, plot, [2, 9], theme.bad, false, 7);
    label(ctx, plot, "limit = 5", [2.15, 5.6], theme.warm); label(ctx, plot, "f(2) = 9", [2.15, 9.3], theme.bad);
    return;
  }
  if (graphId === "jump-discontinuity") {
    const plot = makePlot(ctx, area, { xMin: -1, xMax: 5, yMin: 0, yMax: 7 }, theme);
    curve(ctx, plot, (x) => x + 1, theme.brand, { to: 2 }); curve(ctx, plot, (x) => 6 - x, theme.warm, { from: 2 });
    point(ctx, plot, [2, 3], theme.brand, true, 7); point(ctx, plot, [2, 4], theme.warm, false, 7);
    label(ctx, plot, "left → 3", [0.2, 2.2], theme.brand); label(ctx, plot, "right → 4", [2.25, 4.7], theme.warm);
    return;
  }
  if (graphId === "rapid-oscillation") {
    const plot = makePlot(ctx, area, { xMin: -0.65, xMax: 0.65, yMin: -1.4, yMax: 1.4 }, theme);
    curve(ctx, plot, (x) => Math.sin(1 / x), theme.brand, { from: -0.65, to: -0.012, samples: 900, width: 2 });
    curve(ctx, plot, (x) => Math.sin(1 / x), theme.brand, { from: 0.012, to: 0.65, samples: 900, width: 2 });
    label(ctx, plot, "infinitely many swings near 0", [0.03, 1.18], theme.warm);
    return;
  }
  if (graphId === "squeeze-bounds") {
    const plot = makePlot(ctx, area, { xMin: -1.1, xMax: 1.1, yMin: -1.15, yMax: 1.15 }, theme);
    curve(ctx, plot, (x) => x * x, theme.warm, { dashed: true, width: 2 });
    curve(ctx, plot, (x) => -x * x, theme.warm, { dashed: true, width: 2 });
    curve(ctx, plot, (x) => x === 0 ? 0 : x * x * Math.sin(1 / x), theme.brand, { samples: 1200, width: 2.5 });
    label(ctx, plot, "y = x²", [0.62, 0.72], theme.warm); label(ctx, plot, "y = −x²", [0.6, -0.62], theme.warm);
    return;
  }
  if (graphId === "unit-circle-squeeze") {
    const plot = makePlot(ctx, area, { xMin: -0.1, xMax: 1.25, yMin: -0.1, yMax: 1.2 }, theme);
    curve(ctx, plot, (x) => Math.sqrt(Math.max(0, 1 - x * x)), theme.brand, { from: 0, to: 1, width: 3 });
    const angle = 0.68; const c = Math.cos(angle); const s = Math.sin(angle); const tangentY = Math.tan(angle);
    segment(ctx, plot, [0, 0], [1, 0], theme.ink); segment(ctx, plot, [0, 0], [c, s], theme.brand, false, 3);
    segment(ctx, plot, [c, s], [c, 0], theme.good, false, 2); segment(ctx, plot, [1, 0], [1, tangentY], theme.warm, false, 2);
    segment(ctx, plot, [0, 0], [1, tangentY], theme.warm, false, 2); point(ctx, plot, [c, s], theme.brand, false, 5);
    label(ctx, plot, "x", [0.28, 0.12], theme.brand); label(ctx, plot, "inner ≤ sector ≤ outer", [0.12, 1.02], theme.ink);
    return;
  }
  if (graphId === "sine-over-x") {
    const plot = makePlot(ctx, area, { xMin: -12, xMax: 12, yMin: -0.5, yMax: 1.2 }, theme);
    curve(ctx, plot, (x) => x === 0 ? 1 : Math.sin(x) / x, theme.brand, { samples: 900 });
    point(ctx, plot, [0, 1], theme.warm, true, 7); segment(ctx, plot, [-12, 1], [12, 1], theme.warm, true, 1.5);
    label(ctx, plot, "approaches 1", [0.55, 1.08], theme.warm);
    return;
  }
  if (graphId === "horizontal-asymptote") {
    const plot = makePlot(ctx, area, { xMin: -8, xMax: 8, yMin: 0, yMax: 5 }, theme);
    curve(ctx, plot, (x) => (3 * x * x - 2 * x + 5) / (x * x + 4), theme.brand);
    segment(ctx, plot, [-8, 3], [8, 3], theme.warm, true, 2); label(ctx, plot, "y = 3", [5.5, 3.25], theme.warm);
    return;
  }
  if (graphId === "ivt-root") {
    const plot = makePlot(ctx, area, { xMin: -0.1, xMax: 1.1, yMin: -1.2, yMax: 1.5 }, theme);
    curve(ctx, plot, (x) => x * x * x + x - 1, theme.brand);
    point(ctx, plot, [0, -1], theme.bad); point(ctx, plot, [1, 1], theme.good);
    const root = 0.6823278; point(ctx, plot, [root, 0], theme.warm, true, 7);
    label(ctx, plot, "f(0) < 0", [0.05, -0.78], theme.bad); label(ctx, plot, "f(1) > 0", [0.96, 1.18], theme.good, "right");
    label(ctx, plot, "a root must lie between", [0.24, 0.32], theme.warm);
    return;
  }
  if (graphId === "epsilon-delta-window") {
    const plot = makePlot(ctx, area, { xMin: 0, xMax: 4.5, yMin: 0.5, yMax: 8.5 }, theme);
    const epsilon = 0.75; const delta = 0.34; const a = 2; const limit = 3;
    ctx.save(); clipPlot(ctx, plot);
    ctx.fillStyle = theme.warmSoft; ctx.globalAlpha = 0.72;
    ctx.fillRect(plot.left, plot.y(limit + epsilon), plot.width, plot.y(limit - epsilon) - plot.y(limit + epsilon));
    ctx.fillStyle = theme.brandSoft; ctx.globalAlpha = 0.72;
    ctx.fillRect(plot.x(a - delta), plot.top, plot.x(a + delta) - plot.x(a - delta), plot.height);
    ctx.restore();
    curve(ctx, plot, (x) => x * x / 2 + 1, theme.brand);
    segment(ctx, plot, [0, limit - epsilon], [4.5, limit - epsilon], theme.warm, true, 2);
    segment(ctx, plot, [0, limit + epsilon], [4.5, limit + epsilon], theme.warm, true, 2);
    segment(ctx, plot, [a - delta, 0.5], [a - delta, 8.5], theme.good, true, 2);
    segment(ctx, plot, [a + delta, 0.5], [a + delta, 8.5], theme.good, true, 2);
    point(ctx, plot, [a, limit], theme.ink, false, 5);
    label(ctx, plot, "L + ε", [3.65, limit + epsilon + 0.18], theme.warm);
    label(ctx, plot, "L − ε", [3.65, limit - epsilon - 0.15], theme.warm);
    label(ctx, plot, "a − δ", [a - delta - 0.04, 0.85], theme.good, "right");
    label(ctx, plot, "a + δ", [a + delta + 0.04, 0.85], theme.good);
  }
}

function drawVerticalAsymptotes(ctx: CanvasRenderingContext2D, width: number, height: number, theme: GraphTheme) {
  const gap = 18; const panelWidth = (width - gap - 16) / 2;
  const panels = [
    { title: "Odd power: 1/(x−1)", fn: (x: number) => 1 / (x - 1) },
    { title: "Even power: 1/(x−1)²", fn: (x: number) => 1 / ((x - 1) ** 2) },
  ];
  panels.forEach((panel, index) => {
    const area = { left: 8 + index * (panelWidth + gap), top: 8, width: panelWidth, height: height - 16 };
    title(ctx, panel.title, area.left + area.width / 2, area.top + 12, theme, "center");
    const plot = makePlot(ctx, area, { xMin: -2, xMax: 4, yMin: -6, yMax: 8 }, theme, width < 620);
    segment(ctx, plot, [1, -6], [1, 8], theme.warm, true, 2);
    curve(ctx, plot, panel.fn, index === 0 ? theme.brand : theme.good, { samples: 900 });
  });
}

function drawDiscontinuityGallery(ctx: CanvasRenderingContext2D, width: number, height: number, theme: GraphTheme) {
  const gap = 12; const panelWidth = (width - gap - 16) / 2; const panelHeight = (height - gap - 16) / 2;
  const panels = ["Removable", "Jump", "Infinite", "Oscillating"];
  panels.forEach((name, index) => {
    const column = index % 2; const row = Math.floor(index / 2);
    const area = { left: 8 + column * (panelWidth + gap), top: 8 + row * (panelHeight + gap), width: panelWidth, height: panelHeight };
    title(ctx, name, area.left + area.width / 2, area.top + 12, theme, "center");
    const plot = makePlot(ctx, area, { xMin: -2, xMax: 2, yMin: -2, yMax: 2 }, theme, true);
    if (index === 0) { curve(ctx, plot, (x) => x, theme.brand); point(ctx, plot, [0, 0], theme.warm, true, 5); }
    if (index === 1) { curve(ctx, plot, () => -0.75, theme.brand, { to: 0 }); curve(ctx, plot, () => 0.75, theme.warm, { from: 0 }); point(ctx, plot, [0, -0.75], theme.brand, true, 5); point(ctx, plot, [0, 0.75], theme.warm, false, 5); }
    if (index === 2) { segment(ctx, plot, [0, -2], [0, 2], theme.warm, true, 1.5); curve(ctx, plot, (x) => 0.45 / x, theme.brand, { samples: 800 }); }
    if (index === 3) { curve(ctx, plot, (x) => Math.sin(1 / x), theme.brand, { from: -2, to: -0.02, samples: 700, width: 2 }); curve(ctx, plot, (x) => Math.sin(1 / x), theme.brand, { from: 0.02, to: 2, samples: 700, width: 2 }); }
  });
}

function drawGraph(canvas: HTMLCanvasElement, graphId: string) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const theme = graphTheme();
  const cssWidth = Math.max(280, Math.floor(canvas.getBoundingClientRect().width || 720));
  const isGallery = graphId === "discontinuity-gallery";
  const isSplit = graphId === "vertical-asymptotes";
  const cssHeight = Math.round(cssWidth * (isGallery ? 0.78 : isSplit ? 0.58 : 0.58));
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.height = `${cssHeight}px`;
  canvas.dataset.surface = theme.surface;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, cssWidth, cssHeight);
  context.fillStyle = theme.surface;
  context.fillRect(0, 0, cssWidth, cssHeight);
  if (isGallery) drawDiscontinuityGallery(context, cssWidth, cssHeight, theme);
  else if (isSplit) drawVerticalAsymptotes(context, cssWidth, cssHeight, theme);
  else drawSingleGraph(context, cssWidth, cssHeight, graphId, theme);
}

export function LimitsGraphCanvas({ graphId, label }: { graphId: string; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const redraw = () => drawGraph(canvas, graphId);
    redraw();
    const resize = new ResizeObserver(redraw);
    resize.observe(canvas);
    const themeObserver = new MutationObserver(redraw);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { resize.disconnect(); themeObserver.disconnect(); };
  }, [graphId]);
  return <canvas ref={ref} className="limits-graph-canvas" width="960" height="560" role="img" aria-label={label} data-graph-id={graphId} />;
}
