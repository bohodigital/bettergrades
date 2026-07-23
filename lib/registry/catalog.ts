import { allLibraryArticles, courseLibraries, getCourseTopicArticles } from "../course-library";
import { archetypes } from "../library";
import type { DomainRecord, ResourceRecord, SubjectRecord, TopicRecord, ToolRecord } from "./schema";
import { publishedResourcePages } from "../resources/catalog.mjs";
import type { PublishingResourceRecord } from "./schema";

export const subjects: SubjectRecord[] = [{
  id: "subject-math",
  slug: "math",
  name: "Mathematics",
  description: "Clear explanations, worked examples, tools, and practice organized by the mathematics you are learning.",
  path: "/subjects/math/",
}];

export const domains: DomainRecord[] = courseLibraries.map((course) => ({
  id: `domain-math-${course.slug}`,
  subjectId: "subject-math",
  slug: course.slug,
  name: course.name,
  description: course.description,
  path: `/subjects/math/${course.slug}/`,
}));

export const topics: TopicRecord[] = courseLibraries.flatMap((course) => course.topics.map((topic) => ({
  id: `topic-math-${course.slug}-${topic.slug}`,
  domainId: `domain-math-${course.slug}`,
  slug: topic.slug,
  name: topic.name,
  description: topic.description,
  sequence: Number(topic.sequence),
  path: `/subjects/math/${course.slug}/${topic.slug}/`,
})));

const relatedToolIds = (domainSlug: string, topicSlug: string) => {
  if (domainSlug === "algebra") return ["tool-math-algebra-expression-checker"];
  if (domainSlug === "calculus" && topicSlug === "integration-techniques") return ["tool-math-calculus-integration-method-finder"];
  return [];
};

const relatedAssessmentIds = (domainSlug: string, topicSlug: string) => {
  if (domainSlug !== "calculus") return [];
  if (topicSlug === "limits-continuity") return ["assessment-math-calculus-readiness", "assessment-math-calculus-foundations-exam"];
  if (topicSlug === "integration-techniques") return ["assessment-math-calculus-method-selection", "assessment-math-calculus-foundations-exam", "assessment-math-calculus-integration-bee"];
  return ["assessment-math-calculus-foundations-exam"];
};

export const resources: ResourceRecord[] = [...allLibraryArticles.map((article) => ({
  id: `resource-math-${article.domainSlug}-${article.topicSlug}-${article.slug}`,
  domainId: `domain-math-${article.domainSlug}`,
  topicId: `topic-math-${article.domainSlug}-${article.topicSlug}`,
  slug: article.slug,
  title: article.title,
  description: article.deck,
  kind: article.archetype === "decision" ? "decision-guide" as const : article.archetype,
  path: `/subjects/math/${article.domainSlug}/${article.topicSlug}/${article.slug}/`,
  aliases: article.domainSlug === "calculus" ? [`/library/${article.topicSlug}/${article.slug}/`] : [],
  reviewed: article.reviewed,
  sequence: getCourseTopicArticles(article.domainSlug, article.topicSlug).findIndex((item) => item.slug === article.slug) + 1,
  searchTerms: article.searchTerms ?? [],
  relatedToolIds: relatedToolIds(article.domainSlug, article.topicSlug),
  relatedAssessmentIds: relatedAssessmentIds(article.domainSlug, article.topicSlug),
})), {
  id: "resource-math-calculus-integration-techniques-integration-by-parts",
  domainId: "domain-math-calculus",
  topicId: "topic-math-calculus-integration-techniques",
  slug: "integration-by-parts",
  title: "Integration by parts: recognition, setup, and examples",
  description: "Recognize integration by parts, choose u and dv, and know when another method is better.",
  kind: "method",
  path: "/learn/calculus/integration-by-parts/",
  aliases: [],
  reviewed: "July 11, 2026",
  sequence: getCourseTopicArticles("calculus", "integration-techniques").length + 1,
  searchTerms: ["integration by parts formula", "choose u and dv", "LIATE"],
  relatedToolIds: ["tool-math-calculus-integration-method-finder"],
  relatedAssessmentIds: ["assessment-math-calculus-method-selection", "assessment-math-calculus-foundations-exam", "assessment-math-calculus-integration-bee"],
}];

export const tools: ToolRecord[] = [
  {
    id: "tool-math-algebra-expression-checker",
    domainId: "domain-math-algebra",
    slug: "expression-checker",
    title: "Algebra Expression Checker",
    description: "Enter keyboard math or raw LaTeX, simplify it, and check equivalent algebraic answers in the browser.",
    path: "/tools/math/algebra/expression-checker/",
    aliases: ["/calculators/algebra-expression-checker/"],
  },
  {
    id: "tool-math-calculus-integration-method-finder",
    domainId: "domain-math-calculus",
    slug: "integration-method-finder",
    title: "Integration Method Finder",
    description: "Describe the structure of an integral and get a ranked first move with an honest explanation.",
    path: "/tools/math/calculus/integration-method-finder/",
    aliases: ["/calculators/integration-method-finder/"],
  },
];

export const publishingResources: PublishingResourceRecord[] = [...publishedResourcePages];

export const getTopicRecord = (domainSlug: string, slug: string) => topics.find((topic) => topic.domainId === `domain-math-${domainSlug}` && topic.slug === slug);
export const getResourceRecord = (domainSlug: string, topicSlug: string, slug: string) => resources.find((resource) => resource.topicId === `topic-math-${domainSlug}-${topicSlug}` && resource.slug === slug);
export const getResourcesForTopic = (topicId: string) => resources.filter((resource) => resource.topicId === topicId);

export const resourceFormatLabel = (resource: ResourceRecord) => {
  const article = allLibraryArticles.find((item) => item.slug === resource.slug && `topic-math-${item.domainSlug}-${item.topicSlug}` === resource.topicId);
  if (article) return archetypes[article.archetype].label;
  return resource.kind === "decision-guide" ? "Decision guide" : resource.kind === "method" ? "Method guide" : resource.kind === "concept" ? "Concept explainer" : resource.kind === "tool" ? "Tool" : "Direct answer";
};
