import { limitsUnitSearchRecords } from "./calculus/limits-unit-index.mjs";
import { calculusUnitRoutes, calculusUnitSearchRecords, supersededCalculusPaths } from "./calculus/calculus-units-index.mjs";
import { algebraCourseSearchRecords } from "./algebra/algebra-course-search.mjs";
import { precalculusCourseSearchRecords } from "./precalculus/precalculus-course-search.mjs";
import { problems } from "./content";
import { domains, resourceFormatLabel, resources, tools, topics } from "./registry/catalog";
import { assessments } from "./registry/practice";
import { isExpressionOnlyQuery, normalizeSearchText, rankSearchRecords } from "./site-search-core.mjs";
import { mathGlossarySearchTerms } from "./glossary/math/search-artifact.mjs";
import { enrichedGlossaryResources, publishedResourcePages } from "./resources/catalog.mjs";

export { isExpressionOnlyQuery, normalizeSearchText };

export type SearchKind = "guide" | "topic" | "tool" | "practice" | "answer" | "glossary";

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
  shortTitle?: string;
  aliases?: string[];
  formerPaths?: string[];
  concepts?: string[];
  skills?: string[];
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
  glossary: "Glossary term",
};

const domainFor = (domainId: string) => domains.find((domain) => domain.id === domainId);
const topicFor = (topicId: string) => topics.find((topic) => topic.id === topicId);

const calculusUnitPaths = new Set(calculusUnitRoutes.map((route) => route.path));
const algebraCoursePaths = new Set((algebraCourseSearchRecords as SiteSearchRecord[]).map((record) => record.path));
const precalculusCoursePaths = new Set((precalculusCourseSearchRecords as SiteSearchRecord[]).map((record) => record.path));
const supersededCalculusRoutePaths = new Set(supersededCalculusPaths);
const guideRecords: SiteSearchRecord[] = resources.filter((resource) => !algebraCoursePaths.has(resource.path) && !precalculusCoursePaths.has(resource.path) && !calculusUnitPaths.has(resource.path) && !supersededCalculusRoutePaths.has(resource.path)).map((resource) => {
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
  ...domains.filter((domain) => !algebraCoursePaths.has(domain.path) && !precalculusCoursePaths.has(domain.path)).map((domain) => ({
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
  ...topics.filter((topic) => !algebraCoursePaths.has(topic.path) && !precalculusCoursePaths.has(topic.path) && !calculusUnitPaths.has(topic.path) && !supersededCalculusRoutePaths.has(topic.path)).map((topic) => {
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

const glossaryRecords: SiteSearchRecord[] = mathGlossarySearchTerms.map((term) => ({
  id: `glossary-math-${term.id}`,
  kind: "glossary",
  title: term.term,
  description: term.shortDefinition,
  path: enrichedGlossaryResources.find((resource) => resource.glossaryTermId === term.id)?.canonicalPath ?? `/glossary/math/#${term.id}`,
  domainSlug: "math",
  domainName: "Mathematics",
  topicName: term.categoryLabel,
  label: "Visual definition",
  keywords: [...term.aliases, ...term.keywords, ...term.visualText],
  priority: 68,
}));

const publishingRecords: SiteSearchRecord[] = publishedResourcePages
  .filter((resource) => resource.resourceType !== "glossary-term")
  .map((resource) => ({
    id: resource.id,
    kind: resource.resourceType === "practice-exam" || resource.resourceType === "worksheet"
      ? "practice" as const
      : resource.resourceType === "worked-problem"
        ? "answer" as const
        : "guide" as const,
    title: resource.title,
    description: resource.description,
    path: resource.canonicalPath,
    domainSlug: "calculus",
    domainName: "Calculus",
    topicName: resource.topics.join(" · "),
    label: resource.resourceType.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    keywords: [...resource.searchIntent, ...resource.skills, ...resource.topics, resource.course, resource.unit],
    priority: resource.resourceType === "practice-exam" ? 96 : resource.resourceType === "worksheet" ? 92 : 86,
    shortTitle: resource.shortTitle,
    aliases: resource.searchIntent,
    concepts: resource.topics,
    skills: resource.skills,
  }));

const criticalFindabilityRecords: SiteSearchRecord[] = [
  {
    id: "glossary-math-conventions", kind: "glossary",
    title: "Mathematics variable and notation conventions", shortTitle: "Math conventions",
    description: "See the variable, naming, and notation rules used throughout Better Grades mathematics content.",
    path: "/glossary/math/conventions/", domainSlug: "math", domainName: "Mathematics", topicName: "Notation",
    label: "Glossary term", keywords: ["conventions", "glossary term conventions", "math notation conventions"],
    aliases: ["conventions", "math conventions"], concepts: ["conventions"], skills: ["glossary term conventions"], priority: 88,
  },
  {
    id: "practice-math-hub", kind: "practice", title: "Mathematics practice", shortTitle: "Math practice",
    description: "Browse free mathematics quizzes, diagnostics, practice exams, and challenges.",
    path: "/practice/math/", domainSlug: "math", domainName: "Mathematics", label: "Practice hub",
    keywords: ["math", "assessment math", "mathematics practice"], aliases: ["math practice"],
    concepts: ["mathematics"], skills: ["assessment math"], priority: 93,
  },
  {
    id: "practice-calculus-hub", kind: "practice", title: "Calculus practice", shortTitle: "Calculus practice",
    description: "Choose a calculus quiz, diagnostic, practice exam, or challenge.",
    path: "/practice/math/calculus/", domainSlug: "calculus", domainName: "Calculus", label: "Practice hub",
    keywords: ["calculus", "assessment calculus", "calculus practice"], aliases: ["calculus practice"],
    concepts: ["calculus"], skills: ["assessment calculus"], priority: 94,
  },
];

export const siteSearchRecords: SiteSearchRecord[] = [
  ...criticalFindabilityRecords,
  ...(algebraCourseSearchRecords as SiteSearchRecord[]),
  ...(precalculusCourseSearchRecords as SiteSearchRecord[]),
  ...limitsUnitSearchRecords,
  ...(calculusUnitSearchRecords as SiteSearchRecord[]),
  ...guideRecords,
  ...topicRecords,
  ...toolRecords,
  ...practiceRecords,
  ...answerRecords,
  ...glossaryRecords,
  ...publishingRecords,
];

export function searchSite(query: string, options: SiteSearchOptions = {}): SiteSearchRecord[] {
  const domain = options.domain ?? "all";
  const kind = options.kind ?? "all";
  const available = siteSearchRecords.filter((record) => (domain === "all" || record.domainSlug === domain) && (kind === "all" || record.kind === kind));
  return rankSearchRecords(available, query);
}

export const searchIndexCounts = siteSearchRecords.reduce<Record<SearchKind, number>>((counts, record) => {
  counts[record.kind] += 1;
  return counts;
}, { guide: 0, topic: 0, tool: 0, practice: 0, answer: 0, glossary: 0 });
