export type PublishingResourceType =
  | "worksheet"
  | "practice-exam"
  | "formula-sheet"
  | "worked-problem"
  | "visual-guide"
  | "interactive-practice"
  | "answer-key"
  | "download"
  | "glossary-term";

export type ResourceProblem = {
  id: string;
  prompt: string;
  answer: string;
  steps: string[];
  method: string;
  commonError: string;
  verificationMethod: string;
};

export type PublishingResource = {
  id: string;
  resourceType: PublishingResourceType;
  subject: string;
  course: string;
  unit: string;
  topics: string[];
  sourceLessons: string[];
  sourceAssessments: string[];
  title: string;
  shortTitle: string;
  slug: string;
  canonicalPath: string;
  summary: string;
  description: string;
  searchIntent: string[];
  skills: string[];
  prerequisites: string[];
  difficulty: string;
  estimatedTime: number;
  problemCount: number;
  audience: string;
  studentPdf: string | null;
  answerKeyPdf: string | null;
  workedHtmlSolutions: boolean;
  primaryVisual: string | null;
  downloadFormats: string[];
  relatedLessons: string[];
  relatedArticles: string[];
  relatedResources: string[];
  relatedGlossaryTerms: string[];
  license: string;
  revisionDate: string;
  indexPolicy: "index" | "noindex" | "canonicalize";
  status: "draft" | "review" | "published" | "retired";
  problems?: ResourceProblem[];
  problem?: ResourceProblem;
  formulaGroups?: [string, string[]][];
  commonErrors?: string[];
  suggestedTime?: number;
  pointValues?: string;
  calculatorAssumptions?: string;
  parentResourceId?: string;
  alternativeMethod?: string;
  glossaryTermId?: string;
  explanation?: string;
  notation?: string;
  workedExample?: string;
  commonConfusion?: string;
};

export type ResourceHub = {
  id: string;
  resourceType: PublishingResourceType;
  title: string;
  description: string;
  path: string;
};

export const resourceHubs: readonly ResourceHub[];
export const flagshipResources: readonly PublishingResource[];
export const promotedVisualPages: readonly PublishingResource[];
export const workedProblemResources: readonly PublishingResource[];
export const enrichedGlossaryResources: readonly PublishingResource[];
export const publishedResourcePages: readonly PublishingResource[];
export function getPublishedResourcePage(path: string): PublishingResource | undefined;
export function getResourceHub(path: string): ResourceHub | undefined;
export function getResourcesForHub(resourceType: PublishingResourceType): PublishingResource[];
