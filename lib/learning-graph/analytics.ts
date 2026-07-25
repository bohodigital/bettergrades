"use client";

export type FindabilityEventData = {
  source_page_id?: string;
  source_page_role?: string;
  target_page_id?: string;
  target_page_role?: string;
  relationship_type?: string;
  placement?: string;
  query?: string;
  result_rank?: number;
  navigation_surface?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

export function trackFindabilityEvent(event: string, data: FindabilityEventData = {}) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1" || (window as Window & { doNotTrack?: string }).doNotTrack === "1") return;
  const clean = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined && value !== ""));
  window.gtag?.("event", event, clean);
  window.umami?.track(event, clean as Record<string, string | number>);
}
