export const learningNodeTypes = [
  "subject", "course", "unit", "topic", "concept", "skill", "article",
  "textbook-lesson", "worksheet", "practice-exam", "worked-problem",
  "formula-sheet", "visual-guide", "glossary-term", "tool", "assessment",
  "resource-hub",
] as const;

export const relationshipTypes = [
  "belongs_to", "teaches", "explains", "answers", "full_version_of",
  "quick_version_of", "prerequisite_for", "follows", "practices", "assesses",
  "references", "visualizes", "compares", "uses_tool", "remediates", "derived_from",
] as const;

export type LearningNodeType = typeof learningNodeTypes[number];
export type RelationshipType = typeof relationshipTypes[number];
export type EditorialStatus = "approved" | "existing" | "provisional" | "rejected" | "not-required";

export type LearningNode = {
  id: string;
  nodeType: LearningNodeType;
  pageRole: string;
  title: string;
  shortTitle: string;
  canonicalPath: string;
  subjectId: string | null;
  courseId: string | null;
  unitId: string | null;
  topicIds: string[];
  primaryConceptId: string | null;
  secondaryConceptIds: string[];
  skillIds: string[];
  indexPolicy: "index" | "noindex" | "canonicalize";
  status: "published" | "draft" | "review" | "retired";
  searchAliases: string[];
  formerPaths: string[];
  difficulty?: string;
  estimatedTime?: number;
  problemCount?: number;
  sourceLessonIds?: string[];
  sourceAssessmentIds?: string[];
};

export type LearningRelationship = {
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  confidence: "high" | "medium" | "low";
  source: string;
  editorialStatus: EditorialStatus;
  placement: string;
  anchorText: string;
  reciprocalRequired: boolean;
};

export type LearningGraph = {
  schemaVersion: 1;
  generatedAt: string;
  sourceCommit: string;
  sourceTree: string;
  auditCommit: string;
  nodes: LearningNode[];
  relationships: LearningRelationship[];
  exclusions: Array<{ canonicalPath: string; pageRole: string; reason: string }>;
};
