import type { LimitsPublicVisual } from "./limits-unit.mjs";
import type { CalculusUnitCollection, CalculusUnitRoute } from "./calculus-units-index.mjs";

export type CalculusUnitNode = {
  type: string;
  title?: string;
  text?: string;
  tex?: string;
  level?: number;
  checkId?: string;
  revealId?: string;
  visualId?: string;
  answerNumber?: number;
  children?: CalculusUnitNode[];
  environment?: string;
  rows?: string[][];
  visual?: LimitsPublicVisual;
};
export type CalculusPublicProblem = {
  id: string;
  unitId: string;
  pageSlug: string;
  promptLatex: string;
  answerType: string;
  choices: string[];
  hints: string[];
  difficulty: string;
  topics: string[];
  skills: string[];
  attemptRequiredBeforeReveal: true;
};
export type CalculusAssessmentSet = {
  id: string;
  kind: string;
  title: string;
  gradingMode: string;
  items: Array<{ id: string; promptLatex: string; answerType: string }>;
};
export type CalculusUnitPublicPage = {
  unit: CalculusUnitCollection["unit"];
  route: CalculusUnitRoute;
  page: { nodes: CalculusUnitNode[]; sectionId: string; sectionTitle: string; compositionStatus: string };
  checks: CalculusPublicProblem[];
  assessmentSet?: CalculusAssessmentSet;
  previous?: CalculusUnitRoute;
  next?: CalculusUnitRoute;
  previousCore?: CalculusUnitRoute;
  nextCore?: CalculusUnitRoute;
  related: CalculusUnitRoute[];
};
export function getPublicCalculusUnitPage(path: string): CalculusUnitPublicPage | undefined;
export function getCalculusUnitReveal(unitId: string, routeId: string, revealId: string): CalculusUnitNode[] | undefined;
