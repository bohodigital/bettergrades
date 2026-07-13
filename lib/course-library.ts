import { algebraArticles, algebraTopics } from "./algebra";
import { calculusExpansionArticles } from "./calculus/expansion";
import { archetypes, libraryArticles, libraryTopics, type LibraryArticle, type LibraryTopic } from "./library";

export type CourseArticle = LibraryArticle & { domainSlug: string; domainName: string };

export type CourseLibrary = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  promise: string;
  mark: string;
  level: string;
  topics: LibraryTopic[];
  articles: CourseArticle[];
};

function withCourse(articles: LibraryArticle[], domainSlug: string, domainName: string): CourseArticle[] {
  return articles.map((article) => ({ ...article, domainSlug, domainName }));
}

export const courseLibraries: CourseLibrary[] = [
  {
    slug: "algebra",
    name: "Algebra",
    eyebrow: "Mathematics · Foundations",
    description: "Equations, linear relationships, systems, polynomials, rational expressions, radicals, and functions—built as one connected toolkit.",
    promise: "Start with the structure, make one legal move at a time, and check the result in the original problem.",
    mark: "x",
    level: "Algebra I & II",
    topics: algebraTopics,
    articles: withCourse(algebraArticles, "algebra", "Algebra"),
  },
  {
    slug: "calculus",
    name: "Calculus",
    eyebrow: "Mathematics · Change & accumulation",
    description: "Limits, derivatives, integrals, applications, sequences, and series in one connected course map.",
    promise: "Recognize the mathematical structure before reaching for a memorized procedure.",
    mark: "∫",
    level: "Calculus I & II",
    topics: libraryTopics,
    articles: withCourse([...libraryArticles, ...calculusExpansionArticles], "calculus", "Calculus"),
  },
];

export const allLibraryArticles = courseLibraries.flatMap((course) => course.articles);
export const libraryCounts = {
  courses: courseLibraries.length,
  topics: courseLibraries.reduce((sum, course) => sum + course.topics.length, 0),
  articles: allLibraryArticles.length,
};

export const getCourseLibrary = (domainSlug: string) => courseLibraries.find((course) => course.slug === domainSlug);
export const getCourseTopic = (domainSlug: string, topicSlug: string) => getCourseLibrary(domainSlug)?.topics.find((topic) => topic.slug === topicSlug);
export const getCourseTopicArticles = (domainSlug: string, topicSlug: string) => getCourseLibrary(domainSlug)?.articles.filter((article) => article.topicSlug === topicSlug) ?? [];
export const getCourseArticle = (domainSlug: string, topicSlug: string, articleSlug: string) => getCourseTopicArticles(domainSlug, topicSlug).find((article) => article.slug === articleSlug);
export const libraryArticleHref = (article: CourseArticle) => `/subjects/math/${article.domainSlug}/${article.topicSlug}/${article.slug}/`;

const synonymGroups = [
  ["factor", "factoring", "factorise", "factorization"],
  ["line", "linear", "slope", "rate"],
  ["solve", "solution", "equation"],
  ["fraction", "rational", "denominator"],
  ["root", "radical", "square-root"],
  ["derivative", "differentiate", "differentiation"],
  ["integral", "integrate", "antiderivative", "integration"],
  ["series", "sequence", "convergence"],
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[−–—]/g, "-").replace(/[^a-z0-9+*/^=.-]+/g, " ").replace(/\s+/g, " ").trim();
}

function expandedTerms(query: string) {
  const base = normalize(query).split(" ").filter(Boolean);
  return Array.from(new Set(base.flatMap((term) => synonymGroups.find((group) => group.includes(term)) ?? [term])));
}

export function searchCourseLibrary(query: string) {
  const clean = normalize(query);
  const terms = expandedTerms(query);
  if (!terms.length) return allLibraryArticles;
  return allLibraryArticles
    .map((article) => {
      const course = getCourseLibrary(article.domainSlug)!;
      const topic = getCourseTopic(article.domainSlug, article.topicSlug)!;
      const title = normalize(`${article.title} ${article.shortTitle}`);
      const labels = normalize(`${article.domainName} ${topic.name} ${archetypes[article.archetype].label} ${article.course}`);
      const body = normalize(`${article.deck} ${article.sections.flatMap((section) => section.paragraphs).join(" ")} ${article.mistakes.join(" ")} ${article.takeaways.join(" ")}`);
      let score = title.includes(clean) ? 30 : 0;
      score += terms.reduce((sum, term) => sum + (title.includes(term) ? 8 : 0) + (labels.includes(term) ? 4 : 0) + (body.includes(term) ? 2 : 0), 0);
      if (normalize(course.name).includes(clean) || normalize(topic.name).includes(clean)) score += 12;
      return { article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title))
    .map((item) => item.article);
}
