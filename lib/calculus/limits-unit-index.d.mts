import type { LimitsUnitRoute } from "./limits-unit.mjs";

export const LIMITS_UNIT_PREFIX: string;
export const limitsUnitIndex: {
  unit: {
    routeCount: number;
    coreRouteCount: number;
    supportingRouteCount: number;
    checkCount: number;
  };
};
export const limitsUnitRoutes: LimitsUnitRoute[];
export const limitsUnitPracticeRoutes: LimitsUnitRoute[];
export const limitsUnitCoreRoutes: LimitsUnitRoute[];
export const limitsUnitSearchRecords: Array<{
  id: string;
  kind: "guide" | "topic" | "practice";
  title: string;
  description: string;
  path: string;
  domainSlug: string;
  domainName: string;
  topicName: string;
  label: string;
  keywords: string[];
  priority: number;
}>;
export type LimitsUnitChapter = {
  id: string;
  from: number;
  to: number;
  title: string;
  description: string;
  lens: string;
  mentalModel: string;
  decision: string;
  commonTrap: string;
  checkpoint: string;
  routes: LimitsUnitRoute[];
};
export const limitsUnitChapters: LimitsUnitChapter[];
export function getLimitsUnitChapter(coreSequenceIndex: number | null | undefined): LimitsUnitChapter | undefined;
export function getLimitsUnitRoute(path: string): LimitsUnitRoute | undefined;
export function getLimitsUnitRouteBySlug(sourceSlug: string): LimitsUnitRoute | undefined;
export function isLimitsUnitPath(path: string): boolean;
