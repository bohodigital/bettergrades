import answerKeyPayload from "../../content/limits-continuity/exam-answer-keys.json" with { type: "json" };
import { LIMITS_UNIT_PREFIX } from "./limits-unit-core.mjs";

export function sectionizeLimitsCopy(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/\bChapters\b/g, "Sections")
    .replace(/\bChapter\b/g, "Section")
    .replace(/\bchapters\b/g, "sections")
    .replace(/\bchapter\b/g, "section");
}

const keySlug = (exam) => `calculus/limits/practice-exam-${exam.toLowerCase()}/answer-key`;

export function adaptImportedLimitsRoute(route) {
  const answerKeySlug = route.pageType === "exam" ? `${route.sourceSlug}/answer-key` : undefined;
  return {
    ...route,
    title: sectionizeLimitsCopy(route.title),
    h1: sectionizeLimitsCopy(route.h1),
    description: sectionizeLimitsCopy(route.description),
    breadcrumbs: route.breadcrumbs.map(sectionizeLimitsCopy),
    relatedResources: answerKeySlug && !route.relatedResources.includes(answerKeySlug)
      ? [...route.relatedResources, answerKeySlug]
      : route.relatedResources,
    metadataTitle: sectionizeLimitsCopy(route.title).replace(/\s*\|\s*BetterGrades$/i, ""),
  };
}

export const limitsExamAnswerKeyRoutes = answerKeyPayload.keys.map((key, index, keys) => {
  const exam = key.exam.toLowerCase();
  const sourceSlug = keySlug(key.exam);
  const peer = keys.find((candidate) => candidate.exam !== key.exam);
  return {
    sourceSlug,
    sourceCanonicalPath: `/calculus/limits/practice-exam-${exam}/answer-key/`,
    path: `${LIMITS_UNIT_PREFIX}limits/practice-exam-${exam}/answer-key/`,
    title: `Limits and Continuity Practice Exam ${key.exam} Answer Key | BetterGrades`,
    metadataTitle: `Limits and Continuity Practice Exam ${key.exam} Answer Key`,
    h1: `Practice Exam ${key.exam} Answer Key`,
    description: `Check all ${key.answers.length} answers for Limits and Continuity Practice Exam ${key.exam}, with concise reasoning and source-traced solutions.`,
    pageType: "answer-key",
    primaryQuery: `limits and continuity practice exam ${exam} answer key`,
    sourceFile: answerKeyPayload.sourceFile,
    sequenceIndex: 72 + index,
    breadcrumbs: ["Subjects", "Mathematics", "Calculus", "Limits and Continuity", `Practice Exam ${key.exam} Answer Key`],
    indexable: true,
    schemaTypes: ["LearningResource"],
    checkIds: [],
    relatedResources: [
      `calculus/limits/practice-exam-${exam}`,
      "calculus/limits/unit-review",
      ...(peer ? [keySlug(peer.exam)] : []),
    ],
    isCoreSequence: false,
    coreSequenceIndex: null,
    previousCoreSlug: "calculus/limits/unit-review",
    nextCoreSlug: null,
    returnToSequenceSlug: `calculus/limits/practice-exam-${exam}`,
    supportCluster: "practice-exams",
    supportKind: "answer-key",
  };
});

export const limitsExamAnswerKeyPages = answerKeyPayload.keys.map((key) => ({
  sourceSlug: keySlug(key.exam),
  sourceFile: answerKeyPayload.sourceFile,
  sha256: key.sourceSha256,
  source: key.answers.map((answer) => `\\item ${answer.content}`).join("\n"),
  nodes: [
    { type: "heading", level: 2, text: "Use the key as feedback, not a shortcut" },
    { type: "paragraph", text: `Compare one item at a time after completing Practice Exam ${key.exam}. For every mismatch, name the method you should have recognized before reading the next answer.` },
  ],
  answerKey: {
    exam: key.exam,
    answers: key.answers,
    sourceFile: answerKeyPayload.sourceFile,
    sourceSha256: key.sourceSha256,
    sourceHeading: key.sourceHeading,
  },
}));

export { answerKeyPayload as limitsExamAnswerKeyPayload };
