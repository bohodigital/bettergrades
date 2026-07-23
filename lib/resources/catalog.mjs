import catalog from "../../content/calculus/resources/catalog.json" with { type: "json" };

export const resourceHubs = Object.freeze([
  {
    id: "resource-hub-worksheets",
    resourceType: "worksheet",
    title: "Free Calculus Worksheets with Answers",
    description: "Printable Calculus I and II worksheets with complete accessible solutions and separate student and answer-key PDFs.",
    path: "/subjects/math/calculus/worksheets/",
  },
  {
    id: "resource-hub-practice-exams",
    resourceType: "practice-exam",
    title: "Calculus Practice Exams with Complete Solutions",
    description: "Timed cumulative Calculus I and Calculus II practice finals with study maps, point values, and printable keys.",
    path: "/subjects/math/calculus/practice-exams/",
  },
  {
    id: "resource-hub-formula-sheets",
    resourceType: "formula-sheet",
    title: "Calculus Formula Sheets and Reference Guides",
    description: "Compact printable calculus references that explain when a formula applies and which errors to avoid.",
    path: "/subjects/math/calculus/formula-sheets/",
  },
  {
    id: "resource-hub-worked-problems",
    resourceType: "worked-problem",
    title: "Curated Calculus Worked Problems",
    description: "Editorially selected calculus problems with concise answers, complete derivations, method choice, and common wrong approaches.",
    path: "/subjects/math/calculus/worked-problems/",
  },
  {
    id: "resource-hub-visuals",
    resourceType: "visual-guide",
    title: "Calculus Visual Guides and Downloadable Diagrams",
    description: "Accessible SVG, PNG, and printable visual guides for derivative, integral, convergence, and Taylor-series reasoning.",
    path: "/subjects/math/calculus/visuals/",
  },
]);

export const flagshipResources = Object.freeze(catalog.resources);
export const promotedVisualPages = Object.freeze(catalog.promotedVisualPages);
export const workedProblemResources = Object.freeze(catalog.workedProblems);
export const enrichedGlossaryResources = Object.freeze(catalog.glossaryEnrichments);
export const publishedResourcePages = Object.freeze([
  ...flagshipResources,
  ...promotedVisualPages,
  ...workedProblemResources,
  ...enrichedGlossaryResources,
]);

export function getPublishedResourcePage(path) {
  return publishedResourcePages.find((resource) => resource.canonicalPath === path);
}

export function getResourceHub(path) {
  return resourceHubs.find((hub) => hub.path === path);
}

export function getResourcesForHub(resourceType) {
  return publishedResourcePages.filter((resource) => resource.resourceType === resourceType && resource.indexPolicy === "index");
}
