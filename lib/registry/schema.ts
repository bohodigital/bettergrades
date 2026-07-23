import type { Question } from "../activities";

export type ResourceKind = "answer" | "concept" | "method" | "decision-guide" | "tool";
export type AssessmentKind = "quiz" | "diagnostic" | "practice-exam" | "challenge";
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
export type PublishingResourceStatus = "draft" | "review" | "published" | "retired";
export type ResourceIndexPolicy = "index" | "noindex" | "canonicalize";

export type SubjectRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  path: string;
};

export type DomainRecord = {
  id: string;
  subjectId: string;
  slug: string;
  name: string;
  description: string;
  path: string;
};

export type TopicRecord = {
  id: string;
  domainId: string;
  slug: string;
  name: string;
  description: string;
  sequence: number;
  path: string;
};

export type ResourceRecord = {
  id: string;
  domainId: string;
  topicId: string;
  slug: string;
  title: string;
  description: string;
  kind: ResourceKind;
  path: string;
  aliases: string[];
  reviewed: string;
  sequence: number;
  searchTerms: string[];
  relatedToolIds: string[];
  relatedAssessmentIds: string[];
};

export type PublishingResourceRecord = {
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
  indexPolicy: ResourceIndexPolicy;
  status: PublishingResourceStatus;
};

export type RegistryQuestion = Question & {
  id: string;
  expressionTex?: string;
  topicIds: string[];
  skillIds: string[];
  remediationResourceIds: string[];
};

export type AssessmentRecord = {
  id: string;
  domainId: string;
  topicIds: string[];
  slug: string;
  title: string;
  description: string;
  kind: AssessmentKind;
  path: string;
  aliases: string[];
  durationMinutes: number;
  storageKey: string;
  questions: RegistryQuestion[];
};

export type ToolRecord = {
  id: string;
  domainId: string;
  slug: string;
  title: string;
  description: string;
  path: string;
  aliases: string[];
};

export type RegistryRoute = {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
};

export type RedirectRecord = { from: string; to: string; status: 301 | 308 };
