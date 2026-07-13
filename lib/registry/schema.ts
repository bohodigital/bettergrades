import type { Question } from "../activities";

export type ResourceKind = "answer" | "concept" | "method" | "decision-guide" | "tool";
export type AssessmentKind = "quiz" | "diagnostic" | "practice-exam" | "challenge";

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
