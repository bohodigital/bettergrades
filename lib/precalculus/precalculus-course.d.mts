import type { LimitsPublicVisual } from "../calculus/limits-unit.mjs";

export type PrecalculusRoute = {
  id: string;
  path: string;
  title: string;
  description: string;
  pageType: "course-hub" | "unit-hub" | "lesson";
  indexable: boolean;
  unitId: string | null;
  lessonId: string | null;
};

export type PrecalculusLessonSummary = {
  id: string;
  sequence: number;
  title: string;
  path: string;
  outcome: string;
};

export type PrecalculusUnit = {
  id: string;
  sequence: number;
  title: string;
  root: string;
  description: string;
  lessonCount: number;
  outcomes: string[];
  sources: string[];
  lessons: PrecalculusLessonSummary[];
};

export type PrecalculusPrompt = {
  id: string;
  sequence?: number;
  prompt: string;
};

export type PrecalculusTextbookBlock =
  | { type: "paragraph" | "subheading"; text: string }
  | { type: "callout"; label: string; text: string }
  | { type: "list"; items: string[] };

export type PrecalculusTextbookSection = {
  kind: "reading" | "figures" | "checkpoint" | "practice" | "sources";
  heading: string;
  blocks: PrecalculusTextbookBlock[];
};

export type PrecalculusLesson = PrecalculusLessonSummary & {
  unitId: string;
  unitSequence: number;
  courseSequence: number;
  opening: string[];
  prerequisites: string[];
  exposition: string[];
  commonMistake: string;
  examples: Array<{ type: string; problem: string; solution: string; interpretation: string }>;
  figures: Array<{
    id: string;
    sequence: number;
    role: string;
    title: string;
    description: string;
    visual?: LimitsPublicVisual;
  }>;
  checkpoint: PrecalculusPrompt;
  practice: PrecalculusPrompt[];
  close: string;
  sources: string[];
  textbookSections?: PrecalculusTextbookSection[];
  previous: { title: string; path: string } | null;
  next: { title: string; path: string } | null;
};

export type PrecalculusCoursePage = {
  route: PrecalculusRoute;
  unit: PrecalculusUnit | null;
  lesson: PrecalculusLesson | null;
  unitLessons: PrecalculusLesson[];
  units: PrecalculusUnit[];
  breadcrumbs: Array<{ name: string; path: string }>;
};

export const precalculusCourse: {
  schemaVersion: number;
  title: string;
  subtitle: string;
  description: string;
  root: string;
  counts: Record<string, number>;
  units: PrecalculusUnit[];
  lessons: PrecalculusLesson[];
  routes: PrecalculusRoute[];
};
export const precalculusUnits: PrecalculusUnit[];
export const precalculusCourseRoutes: PrecalculusRoute[];
export const precalculusCourseSearchRecords: unknown[];
export function isPrecalculusCoursePath(path: string): boolean;
export function getPrecalculusCourseRoute(path: string): PrecalculusRoute | undefined;
export function getPublicPrecalculusCoursePage(path: string): PrecalculusCoursePage | undefined;
