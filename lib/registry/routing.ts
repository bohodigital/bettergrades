import { limitsUnitRoutes } from "../calculus/limits-unit.mjs";
import { domains, resources, subjects, tools, topics } from "./catalog";
import { assessments } from "./practice";
import type { RedirectRecord, RegistryRoute } from "./schema";

const fixedRoutes: RegistryRoute[] = [
  { path: "/", title: "Better Grades — Free answers, full explanations", description: "Find free academic answers, complete explanations, practical tools, and focused practice.", indexable: true },
  { path: "/subjects/", title: "Browse subjects", description: "Explore Better Grades resources by subject and course.", indexable: true },
  { path: "/practice/", title: "Free quizzes and practice exams", description: "Use focused quizzes, diagnostics, practice exams, and challenges with explanations.", indexable: true },
  { path: "/practice/math/", title: "Mathematics practice", description: "Browse free mathematics quizzes, diagnostics, practice exams, and challenges.", indexable: true },
  { path: "/practice/math/calculus/", title: "Calculus practice", description: "Choose a calculus quiz, diagnostic, practice exam, or challenge.", indexable: true },
  { path: "/answers/", title: "Search the answer bank", description: "Find specific problems, immediate answers, complete solutions, and related practice.", indexable: true },
  { path: "/answers/calculus/integral-of-sec-cubed/", title: "What is the integral of sec³x?", description: "See the full integration-by-parts derivation, verification, and common mistakes.", indexable: true },
  { path: "/tools/", title: "Math tools with visible limits", description: "Use practical academic tools that explain what they do and where they may fail.", indexable: true },
  { path: "/glossary/", title: "Better Grades glossaries", description: "Browse subject-specific definitions, symbols, and notation conventions.", indexable: true },
  { path: "/glossary/math/", title: "Mathematics glossary", description: "Look up mathematics terms and symbols with visual notation and concise definitions.", indexable: true },
  { path: "/glossary/math/conventions/", title: "Mathematics variable and notation conventions", description: "See the variable, naming, and notation rules used throughout Better Grades mathematics content.", indexable: true },
  { path: "/search/", title: "Search Better Grades", description: "Search answers, topics, and resources.", indexable: false },
  ...["about", "how-we-verify", "editorial-policy", "source-policy", "corrections", "privacy", "accessibility"].map((slug) => ({ path: `/${slug}/`, title: "Better Grades", description: "Better Grades publishing and product standards.", indexable: true })),
];

export const registryRoutes: RegistryRoute[] = [
  ...fixedRoutes,
  ...subjects.map((item) => ({ path: item.path, title: item.name, description: item.description, indexable: true })),
  ...domains.map((item) => ({ path: item.path, title: `${item.name} resources`, description: item.description, indexable: true })),
  ...topics.map((item) => ({ path: item.path, title: `${item.name} ${domains.find((domain) => domain.id === item.domainId)?.name ?? "mathematics"} resources`, description: item.description, indexable: true })),
  ...resources.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: true })),
  ...limitsUnitRoutes.map((item) => ({ path: item.path, title: item.metadataTitle, description: item.description, indexable: item.indexable })),
  ...assessments.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: true })),
  ...tools.map((item) => ({ path: item.path, title: item.title, description: item.description, indexable: true })),
];

export const publicRoutes = Array.from(new Set(registryRoutes.map((route) => route.path)));

export const redirects: RedirectRecord[] = [
  { from: "/topics/", to: "/subjects/math/calculus/", status: 308 },
  { from: "/library/", to: "/subjects/math/calculus/", status: 308 },
  { from: "/exams/", to: "/practice/", status: 308 },
  { from: "/calculators/", to: "/tools/", status: 308 },
  ...topics.map((item) => ({ from: `/topics/calculus/${item.slug}/`, to: item.path, status: 308 as const })),
  ...limitsUnitRoutes.map((item) => ({ from: item.sourceCanonicalPath, to: item.path, status: 308 as const })),
  ...resources.flatMap((item) => item.aliases.map((from) => ({ from, to: item.path, status: 308 as const }))),
  ...assessments.flatMap((item) => item.aliases.map((from) => ({ from, to: item.path, status: 308 as const }))),
  ...tools.flatMap((item) => item.aliases.map((from) => ({ from, to: item.path, status: 308 as const }))),
];

export const getRoute = (path: string) => registryRoutes.find((route) => route.path === path);
export const getRedirect = (path: string) => redirects.find((redirect) => redirect.from === path);
