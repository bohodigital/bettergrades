import { allLibraryArticles, libraryArticleHref } from "../course-library";
import { pageTermSummaries, type PageGlossaryTerm } from "./math/page-artifact.mjs";
import { exactProfiles, genericProfile, topicTermIds } from "./page-profiles.mjs";

const educationalDetailPaths = new Set([
  "/answers/calculus/integral-of-sec-cubed/",
  "/learn/calculus/integration-by-parts/",
  "/tools/math/algebra/expression-checker/",
  "/tools/math/calculus/integration-method-finder/",
]);

const assessmentDetailPath = /^\/practice\/math\/calculus\/(?:quizzes|diagnostics|exams|challenges)\/[^/]+\/$/;
const assessmentTermIds = ["derivative", "definite-integral", "integrand", "limit", "series"];
const limitsUnitPath = /^\/subjects\/math\/calculus\/limits-continuity\/unit\//;
const limitsUnitTermIds = ["limit", "function", "continuity", "domain"];

function resolveIds(ids: readonly string[]): PageGlossaryTerm[] {
  return ids.map((id) => pageTermSummaries[id]).filter((term): term is PageGlossaryTerm => Boolean(term));
}

export function getPageGlossaryTerms(path: string): PageGlossaryTerm[] {
  const article = allLibraryArticles.find((candidate) => libraryArticleHref(candidate) === path);
  if (article) return resolveIds(topicTermIds[article.topicSlug] ?? genericProfile);

  if (educationalDetailPaths.has(path)) return resolveIds(exactProfiles[path] ?? genericProfile);
  if (assessmentDetailPath.test(path)) return resolveIds(assessmentTermIds);

  if (limitsUnitPath.test(path)) return resolveIds(limitsUnitTermIds);
  return [];
}
