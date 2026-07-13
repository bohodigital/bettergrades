import { problems } from "./content";
import { domains, resourceFormatLabel, resources, tools, topics } from "./registry/catalog";
import { assessments } from "./registry/practice";
import { isExpressionOnlyQuery, normalizeSearchText, rankSearchRecords } from "./site-search-core.mjs";

export { isExpressionOnlyQuery, normalizeSearchText };

export type SearchKind = "guide" | "topic" | "tool" | "practice" | "answer";

export type SiteSearchRecord = {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  path: string;
  domainSlug: string;
  domainName: string;
  topicName?: string;
  label: string;
  keywords: string[];
  priority: number;
};

export type SiteSearchOptions = {
  domain?: "all" | string;
  kind?: "all" | SearchKind;
};

export const searchKindLabels: Record<SearchKind, string> = {
  guide: "Guide",
  topic: "Topic map",
  tool: "Interactive tool",
  practice: "Practice",
  answer: "Direct answer",
};

const domainFor = (domainId: string) => domains.find((domain) => domain.id === domainId);
const topicFor = (topicId: string) => topics.find((topic) => topic.id === topicId);

const guideRecords: SiteSearchRecord[] = resources.map((resource) => {
  const domain = domainFor(resource.domainId)!;
  const topic = topicFor(resource.topicId)!;
  return {
    id: resource.id,
    kind: "guide",
    title: resource.title,
    description: resource.description,
    path: resource.path,
    domainSlug: domain.slug,
    domainName: domain.name,
    topicName: topic.name,
    label: resourceFormatLabel(resource),
    keywords: [topic.name, topic.description, resource.slug.replaceAll("-", " "), ...resource.searchTerms],
    priority: 70,
  };
});

const topicRecords: SiteSearchRecord[] = [
  ...domains.map((domain) => ({
    id: domain.id,
    kind: "topic" as const,
    title: `${domain.name} course map`,
    description: domain.description,
    path: domain.path,
    domainSlug: domain.slug,
    domainName: domain.name,
    label: "Course map",
    keywords: [domain.name, "course", "syllabus", "topics", "learn"],
    priority: 82,
  })),
  ...topics.map((topic) => {
    const domain = domainFor(topic.domainId)!;
    return {
      id: topic.id,
      kind: "topic" as const,
      title: topic.name,
      description: topic.description,
      path: topic.path,
      domainSlug: domain.slug,
      domainName: domain.name,
      topicName: topic.name,
      label: "Topic map",
      keywords: [domain.name, topic.slug.replaceAll("-", " "), "learn", "topic"],
      priority: 80,
    };
  }),
];

const toolRecords: SiteSearchRecord[] = tools.map((tool) => {
  const domain = domainFor(tool.domainId)!;
  return {
    id: tool.id,
    kind: "tool",
    title: tool.title,
    description: tool.description,
    path: tool.path,
    domainSlug: domain.slug,
    domainName: domain.name,
    label: "Interactive tool",
    keywords: [...tool.aliases, "calculator", "checker", "solve", "simplify", "evaluate"],
    priority: 95,
  };
});

const practiceRecords: SiteSearchRecord[] = assessments.map((assessment) => {
  const domain = domainFor(assessment.domainId)!;
  const assessmentTopics = assessment.topicIds.map((id) => topicFor(id)?.name ?? "");
  return {
    id: assessment.id,
    kind: "practice",
    title: assessment.title,
    description: assessment.description,
    path: assessment.path,
    domainSlug: domain.slug,
    domainName: domain.name,
    topicName: assessmentTopics.filter(Boolean).join(" · "),
    label: assessment.kind === "practice-exam" ? "Practice exam" : assessment.kind === "diagnostic" ? "Diagnostic" : assessment.kind === "challenge" ? "Challenge" : "Quiz",
    keywords: [...assessment.aliases, ...assessmentTopics, assessment.kind.replaceAll("-", " "), "questions", "test", "review"],
    priority: 90,
  };
});

const answerRecords: SiteSearchRecord[] = problems.map((problem) => ({
  id: `answer-${problem.problem_id}`,
  kind: "answer",
  title: problem.canonical_statement,
  description: problem.answer || problem.answer_tex || `${problem.depth} with a reviewed solution.`,
  path: problem.href,
  domainSlug: "calculus",
  domainName: "Calculus",
  topicName: problem.subtopic,
  label: problem.depth,
  keywords: [problem.canonical_expression, problem.course, problem.topic, problem.subtopic, problem.method, ...problem.alternate_phrasings],
  priority: 88,
}));

export const siteSearchRecords: SiteSearchRecord[] = [
  ...guideRecords,
  ...topicRecords,
  ...toolRecords,
  ...practiceRecords,
  ...answerRecords,
];

export function searchSite(query: string, options: SiteSearchOptions = {}) {
  const domain = options.domain ?? "all";
  const kind = options.kind ?? "all";
  const available = siteSearchRecords.filter((record) => (domain === "all" || record.domainSlug === domain) && (kind === "all" || record.kind === kind));
  return rankSearchRecords(available, query);
}

export const searchIndexCounts = siteSearchRecords.reduce<Record<SearchKind, number>>((counts, record) => {
  counts[record.kind] += 1;
  return counts;
}, { guide: 0, topic: 0, tool: 0, practice: 0, answer: 0 });
