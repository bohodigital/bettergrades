import { limitsUnitRoutes } from "../calculus/limits-unit-index.mjs";
import { calculusUnitRoutes, supersededCalculusPaths } from "../calculus/calculus-units-index.mjs";
import { algebraCourseRoutes } from "../algebra/algebra-course.mjs";
import { domains, resources, subjects, tools, topics } from "./catalog";
import { assessments } from "./practice";
import type { RedirectRecord, RegistryRoute } from "./schema";
import { publishedResourcePages, resourceHubs } from "../resources/catalog.mjs";

const fixedRoutes: RegistryRoute[] = [
  { path: "/", title: "Better Grades — Free answers, full explanations", description: "Find free academic answers, complete explanations, practical tools, and focused practice.", indexable: true },
  { path: "/subjects/", title: "Browse subjects", description: "Explore Better Grades resources by subject and course.", indexable: true },
  { path: "/resources/", title: "Free Math Resources | Worksheets, Practice Exams, Guides, and More", description: "Browse every published Better Grades worksheet, practice exam, formula sheet, visual guide, worked problem, and glossary reference.", indexable: true },
  { path: "/practice/", title: "Free quizzes and practice exams", description: "Use focused quizzes, diagnostics, practice exams, and challenges with explanations.", indexable: true },
  { path: "/practice/math/", title: "Mathematics practice", description: "Browse free mathematics quizzes, diagnostics, practice exams, and challenges.", indexable: true },
  { path: "/practice/math/calculus/", title: "Calculus practice", description: "Choose a calculus quiz, diagnostic, practice exam, or challenge.", indexable: true },
  { path: "/answers/", title: "Search the answer bank", description: "Find specific problems, immediate answers, complete solutions, and related practice.", indexable: true },
  { path: "/answers/calculus/integral-of-sec-cubed/", title: "What is the integral of sec³x?", description: "See the full integration-by-parts derivation, verification, and common mistakes.", indexable: true },
  { path: "/tools/", title: "Math tools with visible limits", description: "Use practical academic tools that explain what they do and where they may fail.", indexable: true },
  { path: "/glossary/", title: "Better Grades glossaries", description: "Browse subject-specific definitions, symbols, and notation conventions.", indexable: true },
  { path: "/glossary/math/", title: "Mathematics glossary", description: "Look up mathematics terms and symbols with visual notation and concise definitions.", indexable: true },
  { path: "/glossary/math/conventions/", title: "Mathematics variable and notation conventions", description: "See the variable, naming, and notation rules used throughout Better Grades mathematics content.", indexable: true },
  { path: "/search/", title: "Search Better Grades", description: "Search free answers, complete topic guides, practice, tools, and visual mathematics definitions.", indexable: true },
  ...["about", "how-we-verify", "editorial-policy", "source-policy", "corrections", "privacy", "accessibility"].map((slug) => ({ path: `/${slug}/`, title: "Better Grades", description: "Better Grades publishing and product standards.", indexable: true })),
];
const calculusUnitRoutePaths = new Set(calculusUnitRoutes.map((route) => route.path));
const algebraCourseRoutePaths = new Set(algebraCourseRoutes.map((route) => route.path));
const supersededCalculusRoutePaths = new Set(supersededCalculusPaths);
const supersededCalculusTargets = new Map([
  ["/subjects/math/calculus/sequences-series/", "/subjects/math/calculus/sequences-and-series/"],
  ["/subjects/math/calculus/sequences-series/geometric-series/", "/subjects/math/calculus/sequences-and-series/geometric-series/"],
  ["/subjects/math/calculus/sequences-series/choosing-convergence-test/", "/subjects/math/calculus/sequences-and-series/choosing-a-convergence-test/"],
  ["/subjects/math/calculus/sequences-series/power-series-interval-of-convergence/", "/subjects/math/calculus/power-series-and-taylor-series/radius-and-interval-of-convergence/"],
  ["/subjects/math/calculus/sequences-series/taylor-series-remainder/", "/subjects/math/calculus/power-series-and-taylor-series/taylor-remainder-theorem/"],
]);

export const registryRoutes: RegistryRoute[] = [
  ...fixedRoutes,
  ...algebraCourseRoutes.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: item.indexable })),
  ...subjects.filter((item) => !algebraCourseRoutePaths.has(item.path)).map((item) => ({ path: item.path, title: item.name, description: item.description, indexable: true })),
  ...domains.filter((item) => !algebraCourseRoutePaths.has(item.path)).map((item) => ({ path: item.path, title: `${item.name} resources`, description: item.description, indexable: true })),
  ...calculusUnitRoutes.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: item.indexable })),
  ...topics.filter((item) => !algebraCourseRoutePaths.has(item.path) && !calculusUnitRoutePaths.has(item.path) && !supersededCalculusRoutePaths.has(item.path)).map((item) => ({ path: item.path, title: `${item.name} ${domains.find((domain) => domain.id === item.domainId)?.name ?? "mathematics"} resources`, description: item.description, indexable: true })),
  ...resources.filter((item) => !algebraCourseRoutePaths.has(item.path) && !calculusUnitRoutePaths.has(item.path) && !supersededCalculusRoutePaths.has(item.path)).map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: true })),
  ...limitsUnitRoutes.map((item) => ({ path: item.path, title: item.metadataTitle, description: item.description, indexable: item.indexable })),
  ...assessments.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: true })),
  ...tools.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: true })),
  ...resourceHubs.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: true })),
  ...publishedResourcePages.map((item) => ({
    path: item.canonicalPath,
    title: item.title,
    description: item.description,
    indexable: item.status === "published" && item.indexPolicy === "index",
  })),
];

export const publicRoutes = Array.from(new Set(registryRoutes.map((route) => route.path)));

export const redirects: RedirectRecord[] = [
  { from: "/subjects/math/calculus/sequences-series/", to: "/subjects/math/calculus/sequences-and-series/", status: 308 },
  { from: "/subjects/math/calculus/sequences-series/geometric-series/", to: "/subjects/math/calculus/sequences-and-series/geometric-series/", status: 308 },
  { from: "/subjects/math/calculus/sequences-series/choosing-convergence-test/", to: "/subjects/math/calculus/sequences-and-series/choosing-a-convergence-test/", status: 308 },
  { from: "/subjects/math/calculus/sequences-series/power-series-interval-of-convergence/", to: "/subjects/math/calculus/power-series-and-taylor-series/radius-and-interval-of-convergence/", status: 308 },
  { from: "/subjects/math/calculus/sequences-series/taylor-series-remainder/", to: "/subjects/math/calculus/power-series-and-taylor-series/taylor-remainder-theorem/", status: 308 },
  { from: "/topics/", to: "/subjects/", status: 308 },
  { from: "/library/", to: "/subjects/", status: 308 },
  { from: "/exams/", to: "/practice/", status: 308 },
  { from: "/calculators/", to: "/tools/", status: 308 },
  ...topics.map((item) => ({ from: `/topics/calculus/${item.slug}/`, to: supersededCalculusTargets.get(item.path) ?? item.path, status: 308 as const })),
  ...limitsUnitRoutes.map((item) => ({ from: item.sourceCanonicalPath, to: item.path, status: 308 as const })),
  ...resources.flatMap((item) => item.aliases.map((from) => ({ from, to: supersededCalculusTargets.get(item.path) ?? item.path, status: 308 as const }))),
  ...assessments.flatMap((item) => item.aliases.map((from) => ({ from, to: item.path, status: 308 as const }))),
  ...tools.flatMap((item) => item.aliases.map((from) => ({ from, to: item.path, status: 308 as const }))),
];

export const getRoute = (path: string) => registryRoutes.find((route) => route.path === path);
export const getRedirect = (path: string) => redirects.find((redirect) => redirect.from === path);
