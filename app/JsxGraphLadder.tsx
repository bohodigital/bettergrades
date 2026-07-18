"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PublicCompiledScene } from "../lib/visualization/schema/index.ts";

type Board = { create: (kind: string, parents: unknown[], attributes?: Record<string, unknown>) => unknown; update: () => void };
type Point = { X: () => number; moveTo: (position: [number, number]) => void; on: (event: string, callback: () => void) => void };
type JxgApi = { JSXGraph: { initBoard: (id: string, options: Record<string, unknown>) => Board; freeBoard: (board: Board) => void } };

export function JsxGraphLadder({ scene, descriptionId, onReady, onError }: { scene: PublicCompiledScene; descriptionId: string; onReady: () => void; onError: (error: Error) => void }) {
  const boardId = `jsxgraph-ladder-${useId().replace(/[^A-Za-z0-9_-]/g, "")}`;
  const boardRef = useRef<Board | null>(null);
  const footRef = useRef<Point | null>(null);
  const vendorRef = useRef<JxgApi | null>(null);
  const [active, setActive] = useState(false);
  const [distance, setDistance] = useState(8);
  const [loading, setLoading] = useState(false);

  useEffect(() => () => {
    const board = boardRef.current;
    const vendor = vendorRef.current;
    if (board && vendor) vendor.JSXGraph.freeBoard(board);
  }, []);

  async function activate() {
    if (active || loading) return;
    setLoading(true);
    try {
      const { loadJsxGraphAdapter } = await import("../lib/visualization/renderers/jsxgraph-adapter/index.ts");
      const loaded = await loadJsxGraphAdapter({
        scene: scene as never,
        learnerActivated: true,
        staticFallback: { available: true, elementId: `bvlp-static-${scene.id}`, describedById: descriptionId, preserveDuringEnhancement: true },
      });
      const vendor = loaded.vendor as JxgApi;
      vendorRef.current = vendor;
      const board = vendor.JSXGraph.initBoard(boardId, { boundingbox: [-1, 7, 9, -1], axis: false, showNavigation: false, showCopyright: false, keepAspectRatio: true, pan: { enabled: false }, zoom: { enabled: false } });
      const ground = board.create("line", [[0, 0], [9, 0]], { straightFirst: false, straightLast: false, fixed: true, strokeColor: "#273342", strokeWidth: 3 });
      board.create("line", [[0, 0], [0, 7]], { straightFirst: false, straightLast: false, fixed: true, strokeColor: "#273342", strokeWidth: 3 });
      const foot = board.create("glider", [8, 0, ground], { name: "x", size: 5, snapSizeX: 0.25, color: "#bd4f3d" }) as Point;
      const top = board.create("point", [() => 0, () => Math.sqrt(Math.max(0, 100 - foot.X() ** 2))], { name: "y", fixed: true, size: 5, color: "#256f72" });
      board.create("segment", [top, foot], { name: "L=10", withLabel: true, strokeColor: "#3455a4", strokeWidth: 5 });
      board.create("text", [4.2, 6.2, () => `x² + y² = 100; x=${foot.X().toFixed(2)}, y=${Math.sqrt(Math.max(0, 100 - foot.X() ** 2)).toFixed(2)}`], { fixed: true, fontSize: 15 });
      foot.on("drag", () => setDistance(Number(foot.X().toFixed(2))));
      boardRef.current = board;
      footRef.current = foot;
      setActive(true);
      onReady();
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }

  function updateDistance(value: number) {
    const bounded = Math.min(9.5, Math.max(1, value));
    setDistance(bounded);
    footRef.current?.moveTo([bounded, 0]);
    boardRef.current?.update();
  }

  return <div className="bvlp-jsxgraph-enhancement">
    {!active ? <button className="button button-ink" type="button" onClick={() => void activate()} disabled={loading}>{loading ? "Loading constrained geometry…" : "Activate the sliding ladder"}</button> : null}
    <div id={boardId} className="bvlp-jsxgraph-board" aria-label="Interactive sliding ladder constrained to a wall and ground" />
    {active ? <label className="bvlp-jsxgraph-control">Ladder foot x
      <input type="range" min="1" max="9.5" step="0.25" value={distance} onChange={(event) => updateDistance(Number(event.target.value))} />
      <output aria-live="polite">x = {distance.toFixed(2)}; y = {Math.sqrt(Math.max(0, 100 - distance ** 2)).toFixed(2)}</output>
    </label> : null}
  </div>;
}
