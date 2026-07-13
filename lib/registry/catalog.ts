import { allLibraryArticles, courseLibraries } from "../course-library";
import { archetypes } from "../library";
import type { DomainRecord, ResourceRecord, SubjectRecord, TopicRecord, ToolRecord } from "./schema";

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
}];

export const tools: ToolRecord[] = [{
  id: "tool-math-calculus-integration-method-finder",
  domainId: "domain-math-calculus",
  slug: "integration-method-finder",
  title: "Integration Method Finder",
  description: "Describe the structure of an integral and get a ranked first move with an honest explanation.",
  path: "/tools/math/calculus/integration-method-finder/",
  aliases: ["/calculators/integration-method-finder/"],
}];

export const getTopicRecord = (domainSlug: string, slug: string) => topics.find((topic) => topic.domainId === `domain-math-${domainSlug}` && topic.slug === slug);
export const getResourceRecord = (domainSlug: string, topicSlug: string, slug: string) => resources.find((resource) => resource.topicId === `topic-math-${domainSlug}-${topicSlug}` && resource.slug === slug);
export const getResourcesForTopic = (topicId: string) => resources.filter((resource) => resource.topicId === topicId);

export const resourceFormatLabel = (resource: ResourceRecord) => {
  const article = allLibraryArticles.find((item) => item.slug === resource.slug && `topic-math-${item.domainSlug}-${item.topicSlug}` === resource.topicId);
  return article ? archetypes[article.archetype].label : "Resource";
};
