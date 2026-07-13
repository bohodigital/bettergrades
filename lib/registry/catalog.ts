import { archetypes, libraryArticles, libraryTopics } from "../library";
import type { DomainRecord, ResourceRecord, SubjectRecord, TopicRecord, ToolRecord } from "./schema";

export const subjects: SubjectRecord[] = [{
  id: "subject-math",
  slug: "math",
  name: "Mathematics",
  description: "Clear explanations, worked examples, tools, and practice organized by the mathematics you are learning.",
  path: "/subjects/math/",
}];

export const domains: DomainRecord[] = [{
  id: "domain-math-calculus",
  subjectId: "subject-math",
  slug: "calculus",
  name: "Calculus",
  description: "Limits, derivatives, integrals, applications, sequences, and series in one connected course map.",
  path: "/subjects/math/calculus/",
}];

export const topics: TopicRecord[] = libraryTopics.map((topic) => ({
  id: `topic-math-calculus-${topic.slug}`,
  domainId: "domain-math-calculus",
  slug: topic.slug,
  name: topic.name,
  description: topic.description,
  sequence: Number(topic.sequence),
  path: `/subjects/math/calculus/${topic.slug}/`,
}));

export const resources: ResourceRecord[] = [...libraryArticles.map((article) => ({
  id: `resource-math-calculus-${article.topicSlug}-${article.slug}`,
  domainId: "domain-math-calculus",
  topicId: `topic-math-calculus-${article.topicSlug}`,
  slug: article.slug,
  title: article.title,
  description: article.deck,
  kind: article.archetype === "decision" ? "decision-guide" as const : article.archetype,
  path: `/subjects/math/calculus/${article.topicSlug}/${article.slug}/`,
  aliases: [`/library/${article.topicSlug}/${article.slug}/`],
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

export const getTopicRecord = (slug: string) => topics.find((topic) => topic.slug === slug);
export const getResourceRecord = (topicSlug: string, slug: string) => resources.find((resource) => resource.topicId === `topic-math-calculus-${topicSlug}` && resource.slug === slug);
export const getResourcesForTopic = (topicId: string) => resources.filter((resource) => resource.topicId === topicId);

export const resourceFormatLabel = (resource: ResourceRecord) => {
  const article = libraryArticles.find((item) => item.slug === resource.slug && `topic-math-calculus-${item.topicSlug}` === resource.topicId);
  return article ? archetypes[article.archetype].label : "Resource";
};
