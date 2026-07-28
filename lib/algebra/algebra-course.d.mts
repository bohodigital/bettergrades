export type AlgebraRoute = {
  id: string;
  path: string;
  sourcePath: string;
  title: string;
  pageType: string;
  unitCode: string | null;
  action: string;
  indexable: boolean;
  sequence: number | null;
  lessonId: string | null;
  description: string;
  searchTerms: string[];
};

export type AlgebraUnit = {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  act: string;
  role: string;
  governingQuestion: string;
  root: string;
  lessonCount: number;
  estimatedHours: number;
  storyArc: string;
  outcomes: string[];
  investigation: string;
  mastery: string;
  investigationRoute: string | null;
  reviewRoute: string;
  practiceRoute: string;
  masteryRoute: string;
  answerKeyRoute: string;
};

export type AlgebraFigure = {
  id: string;
  role: string;
  description: string;
  interactive: boolean;
  altText: string;
  visual?: import("../calculus/limits-unit.mjs").LimitsPublicVisual;
};

export type AlgebraLesson = {
  id: string;
  unitCode: string;
  sequence: number;
  title: string;
  path: string;
  outcome: string;
  opening: string;
  prerequisites: string;
  storyBeat: string;
  checkpoint: string;
  exitCheck: string[];
  expositionBeats: string[];
  examples: string[];
  misconceptions: string[];
  bridgeForward: string;
  exerciseCount: string;
  figures: AlgebraFigure[];
  exerciseFamilies: Array<{ id: string; purpose: string; recommendedCount: string }>;
  previous: { title: string; path: string } | null;
  next: { title: string; path: string } | null;
};

export type AlgebraAssessmentPrompt = { id: string; lessonId: string; prompt: string };
export type AlgebraCoursePage = {
  route: AlgebraRoute;
  unit: AlgebraUnit | null;
  lesson: AlgebraLesson | null;
  assessment: null | {
    id: string;
    kind: string;
    questionCount: string;
    durationMinutes: string;
    grading: string;
    answerRoute: string;
    cumulativeShare: string;
  };
  assessmentPrompts: AlgebraAssessmentPrompt[];
  unitLessons: AlgebraLesson[];
  units: AlgebraUnit[];
  breadcrumbs: Array<{ name: string; path: string }>;
};

export const algebraCourse: {
  title: string;
  subtitle: string;
  centralStory: string;
  counts: Record<string, number>;
  units: AlgebraUnit[];
  routes: AlgebraRoute[];
  pages: AlgebraCoursePage[];
  learningGraph: Array<{
    sourceId: string;
    relationship: string;
    targetId: string;
    public: boolean;
    reviewState: string;
    purpose: string;
  }>;
};
export const algebraCourseRoutes: AlgebraRoute[];
export const algebraUnits: AlgebraUnit[];
export const algebraCourseSearchRecords: unknown[];
export function isAlgebraCoursePath(path: string): boolean;
export function getAlgebraCourseRoute(path: string): AlgebraRoute | undefined;
export function getPublicAlgebraCoursePage(path: string): AlgebraCoursePage | undefined;
