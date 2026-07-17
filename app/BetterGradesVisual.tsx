"use client";

/* eslint-disable @next/next/no-img-element -- immutable generated SVG is the authored fallback asset */

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { LimitsPublicVisual } from "../lib/calculus/limits-unit.mjs";
import type { BgInteractive2DProps } from "../lib/visualization/renderers/bg-interactive-2d/index.tsx";

type InteractiveRenderer = ComponentType<BgInteractive2DProps>;

function richText(value: LimitsPublicVisual["title"]): string {
  return value.segments
    .map((segment) => segment.kind === "text" ? segment.text : segment.spokenText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function useNearViewport(enabled: boolean) {
  const target = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!enabled || near) return;
    const element = target.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "320px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, near]);
  return { near, target };
}

export function BetterGradesVisual({ visual }: { visual: LimitsPublicVisual }) {
  const descriptionId = `bvlp-description-${visual.id}`;
  const hasInteractiveScene = Boolean(visual.interactiveScene);
  const { near, target } = useNearViewport(hasInteractiveScene);
  const [Renderer, setRenderer] = useState<InteractiveRenderer>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!near || !visual.interactiveScene || Renderer || error) return;
    let active = true;
    import("../lib/visualization/renderers/bg-interactive-2d/index.tsx")
      .then((module) => {
        if (active) setRenderer(() => module.BgInteractive2D);
      })
      .catch(() => {
        if (active) setError("Interactive controls could not load. The complete static graph remains available.");
      });
    return () => { active = false; };
  }, [Renderer, error, near, visual.interactiveScene]);

  return <div
    className={`bvlp-visual${ready ? " is-interactive-ready" : ""}`}
    data-bvlp-visual={visual.id}
    data-bvlp-renderer={visual.selectedRenderer}
    data-source-fingerprint={visual.sourceFingerprint}
  >
    <div className="bvlp-static-visual" data-static-fallback="retained" aria-hidden={ready ? "true" : undefined}>
      <img
        src={visual.staticAsset.path}
        width={visual.staticAsset.width}
        height={visual.staticAsset.height}
        alt={visual.accessibility.ariaLabel}
        aria-describedby={descriptionId}
        loading="lazy"
        decoding="async"
      />
    </div>
    {hasInteractiveScene ? <div ref={target} className="bvlp-interactive-slot" aria-busy={near && !Renderer && !error}>
      {Renderer && visual.interactiveScene ? <Renderer
        scene={visual.interactiveScene}
        className="bvlp-interactive-runtime"
        onReady={() => { setReady(true); setError(undefined); }}
        onError={(renderError) => { setReady(false); setError(renderError.message); }}
      /> : null}
      {near && !Renderer && !error ? <p className="sr-only" role="status">Loading optional graph controls.</p> : null}
      {error ? <p className="bvlp-interactive-error" role="alert">{error}</p> : null}
    </div> : null}
    <details className="bvlp-long-description" id={descriptionId}>
      <summary>Read this graph as text</summary>
      <p><strong>{richText(visual.title)}.</strong> {visual.longDescription}</p>
      <p>{visual.accessibility.colorIndependentDescription}</p>
      <p><strong>Why it matters:</strong> {visual.learningPurpose}</p>
    </details>
  </div>;
}
