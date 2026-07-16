export type LimitsUnitNode = {
  type: string;
  title?: string;
  text?: string;
  tex?: string;
  level?: number;
  checkId?: string;
  children?: LimitsUnitNode[];
  environment?: string;
  rows?: string[][];
  graphId?: string;
};
export type LimitsUnitCheck = {
  id: string; routeSlug: string; mode: "checker"; answerType: "choice" | "expression" | "integer" | "rational";
  canonicalAnswer: string; promptLatex: string; hintLatex: string; workedFeedbackLatex: string;
  attemptRequiredBeforeReveal: boolean;
};
export type LimitsUnitPublicCheck = Omit<LimitsUnitCheck, "canonicalAnswer" | "workedFeedbackLatex">;
export type LimitsUnitRoute = {
  sourceSlug: string; sourceCanonicalPath: string; path: string; title: string; metadataTitle: string; h1: string; description: string;
  pageType: string; primaryQuery: string; sourceFile: string; sequenceIndex: number; breadcrumbs: string[];
  indexable: boolean; schemaTypes: string[]; checkIds: string[]; relatedResources: string[];
  isCoreSequence: boolean; coreSequenceIndex: number | null; previousCoreSlug: string | null;
  nextCoreSlug: string | null; returnToSequenceSlug: string | null; supportCluster: string | null; supportKind: string | null;
};
export type LimitsUnitPageRecord = { sourceSlug: string; sourceFile: string; sha256: string; source: string; nodes: LimitsUnitNode[] };
export type LimitsExamAnswerKey = {
  exam: "A" | "B";
  answers: Array<{ number: number; content: string }>;
  sourceFile: string;
  sourceSha256: string;
  sourceHeading: string;
};
export type LimitsUnitPage = {
  route: LimitsUnitRoute;
  page: LimitsUnitPageRecord;
  checks: LimitsUnitCheck[];
  previous?: LimitsUnitRoute;
  next?: LimitsUnitRoute;
  returnRoute?: LimitsUnitRoute;
  related: LimitsUnitRoute[];
  answerKey?: LimitsExamAnswerKey;
};
export type LimitsUnitPublicPage = {
  route: LimitsUnitRoute;
  page: Omit<LimitsUnitPageRecord, "source">;
  checks: LimitsUnitPublicCheck[];
  previous?: LimitsUnitRoute;
  next?: LimitsUnitRoute;
  returnRoute?: LimitsUnitRoute;
  related: LimitsUnitRoute[];
  answerKey?: LimitsExamAnswerKey;
  provenanceNote: string;
};
export const LIMITS_UNIT_PREFIX: string;
export const limitsUnitPayload: {
  unit: { routeCount: number; coreRouteCount: number; supportingRouteCount: number; checkCount: number };
  source: { provenance: { status: string; note: string } };
  routes: LimitsUnitRoute[];
  checks: LimitsUnitCheck[];
  pages: LimitsUnitPageRecord[];
};
export const limitsUnitRoutes: LimitsUnitRoute[];
export const limitsUnitChapters: Array<{ id: string; from: number; to: number; title: string; description: string; lens: string; routes: LimitsUnitRoute[] }>;
export const limitsUnitSearchRecords: Array<{ id: string; kind: "guide" | "topic" | "practice"; title: string; description: string; path: string; domainSlug: string; domainName: string; topicName: string; label: string; keywords: string[]; priority: number }>;
export const limitsUnitPracticeRoutes: LimitsUnitRoute[];
export const limitsUnitCoreRoutes: LimitsUnitRoute[];
export function getLimitsUnitChapter(coreSequenceIndex: number | null | undefined): { id: string; from: number; to: number; title: string; description: string; lens: string; routes: LimitsUnitRoute[] } | undefined;
export function getLimitsUnitRoute(path: string): LimitsUnitRoute | undefined;
export function getLimitsUnitRouteBySlug(sourceSlug: string): LimitsUnitRoute | undefined;
export function getLimitsUnitPage(path: string): LimitsUnitPage | undefined;
export function getPublicLimitsUnitPage(path: string): LimitsUnitPublicPage | undefined;
export function isLimitsUnitPath(path: string): boolean;
