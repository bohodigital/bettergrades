import { allLibraryArticles, libraryArticleHref } from "../course-library";
import { pageTermSummaries, type PageGlossaryTerm } from "./math/page-artifact.mjs";
import { exactProfiles, genericProfile, policyProfile, topicTermIds } from "./page-profiles.mjs";

const policyPaths = new Set(["/about/", "/how-we-verify/", "/editorial-policy/", "/source-policy/", "/corrections/", "/privacy/", "/accessibility/"]);

function resolveIds(ids: readonly string[]): PageGlossaryTerm[] {
  return ids.map((id) => pageTermSummaries[id]).filter((term): term is PageGlossaryTerm => Boolean(term));
}

export function getPageGlossaryTerms(path: string): PageGlossaryTerm[] {
  if (exactProfiles[path]) return resolveIds(exactProfiles[path]);

  const article = allLibraryArticles.find((candidate) => libraryArticleHref(candidate) === path);
  if (article) return resolveIds(topicTermIds[article.topicSlug] ?? genericProfile);

  const topicMatch = path.match(/^\/subjects\/math\/[^/]+\/([^/]+)\/$/);
  if (topicMatch) return resolveIds(topicTermIds[topicMatch[1]] ?? genericProfile);
  if (path === "/subjects/math/algebra/") return resolveIds(["variable", "equation", "function", "polynomial", "factoring"]);
  if (path === "/subjects/math/calculus/") return resolveIds(["limit", "derivative", "mean-value-theorem", "definite-integral", "series"]);
  if (path.startsWith("/practice/math/calculus/")) return resolveIds(["derivative", "definite-integral", "integrand", "limit", "series"]);
  if (policyPaths.has(path)) return resolveIds(policyProfile);
  return resolveIds(genericProfile);
}
