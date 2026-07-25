"use client";

const routeIdentitiesPromise = import("../../data/learning-graph/route-identities.json").then((module) => module.default);
const pendingNavigationKey = "bettergrades:pending-findability-navigation";

export type FindabilityEventData = {
  source_page_id?: string;
  source_page_role?: string;
  target_page_id?: string;
  target_page_role?: string;
  relationship_type?: string;
  placement?: string;
  query?: string;
  result_rank?: number;
  result_count?: number;
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

function canonicalPath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0];
  return pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
}

export async function findabilityIdentity(path: string) {
  const normalizedPath = canonicalPath(path);
  const routeIdentities = await routeIdentitiesPromise;
  return routeIdentities[normalizedPath as keyof typeof routeIdentities] ?? {
    id: `route:${normalizedPath}`,
    pageRole: "other",
  };
}

type NavigationClick = {
  altKey: boolean;
  button: number;
  ctrlKey: boolean;
  defaultPrevented: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  currentTarget: { target: string };
};

type PendingNavigation = {
  event: string;
  sourcePath: string;
  targetPath: string;
  data: FindabilityEventData;
  createdAt: number;
};

async function resolveAndTrackNavigation(pending: PendingNavigation) {
  const [source, target] = await Promise.all([
    findabilityIdentity(pending.sourcePath),
    findabilityIdentity(pending.targetPath),
  ]);
  trackFindabilityEvent(pending.event, {
    ...pending.data,
    source_page_id: source.id,
    source_page_role: source.pageRole,
    target_page_id: target.id,
    target_page_role: target.pageRole,
  });
}

export function trackFindabilityNavigation(
  click: NavigationClick,
  event: string,
  sourcePath: string,
  targetPath: string,
  data: FindabilityEventData,
) {
  const isNativeSameTabNavigation = !click.defaultPrevented && click.button === 0 && !click.metaKey && !click.ctrlKey && !click.shiftKey && !click.altKey && click.currentTarget.target !== "_blank";
  const pending = { event, sourcePath, targetPath, data, createdAt: Date.now() };
  if (isNativeSameTabNavigation) {
    try {
      sessionStorage.setItem(pendingNavigationKey, JSON.stringify(pending));
      return;
    } catch {
      // Storage can be unavailable; navigation must remain native and non-blocking.
    }
  }
  void resolveAndTrackNavigation(pending);
}

async function replayPendingNavigation() {
  let serialized: string | null = null;
  try {
    serialized = sessionStorage.getItem(pendingNavigationKey);
  } catch {
    return;
  }
  if (!serialized) return;
  try {
    const pending = JSON.parse(serialized) as PendingNavigation;
    if (Date.now() - pending.createdAt > 300_000) {
      sessionStorage.removeItem(pendingNavigationKey);
      return;
    }
    await resolveAndTrackNavigation(pending);
    sessionStorage.removeItem(pendingNavigationKey);
  } catch {
    // Keep a current pending event available for a later same-origin page load.
  }
}

if (typeof window !== "undefined") void replayPendingNavigation();
