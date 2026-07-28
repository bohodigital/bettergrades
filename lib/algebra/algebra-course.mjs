import course from "../../content/algebra/course.public.json" with { type: "json" };
import visualsA0 from "../../content/algebra/units/unit-a0/public-runtime-scenes.server.json" with { type: "json" };
import visualsA1 from "../../content/algebra/units/unit-a1/public-runtime-scenes.server.json" with { type: "json" };
import visualsA2 from "../../content/algebra/units/unit-a2/public-runtime-scenes.server.json" with { type: "json" };
import visualsA3 from "../../content/algebra/units/unit-a3/public-runtime-scenes.server.json" with { type: "json" };
import visualsA4 from "../../content/algebra/units/unit-a4/public-runtime-scenes.server.json" with { type: "json" };
import visualsA5 from "../../content/algebra/units/unit-a5/public-runtime-scenes.server.json" with { type: "json" };
import visualsA6 from "../../content/algebra/units/unit-a6/public-runtime-scenes.server.json" with { type: "json" };
import visualsA7 from "../../content/algebra/units/unit-a7/public-runtime-scenes.server.json" with { type: "json" };
import visualsA8 from "../../content/algebra/units/unit-a8/public-runtime-scenes.server.json" with { type: "json" };
import visualsA9 from "../../content/algebra/units/unit-a9/public-runtime-scenes.server.json" with { type: "json" };
import visualsA10 from "../../content/algebra/units/unit-a10/public-runtime-scenes.server.json" with { type: "json" };
import visualsA11 from "../../content/algebra/units/unit-a11/public-runtime-scenes.server.json" with { type: "json" };
import visualsA12 from "../../content/algebra/units/unit-a12/public-runtime-scenes.server.json" with { type: "json" };
import visualsA13 from "../../content/algebra/units/unit-a13/public-runtime-scenes.server.json" with { type: "json" };
import visualsA14 from "../../content/algebra/units/unit-a14/public-runtime-scenes.server.json" with { type: "json" };

export const algebraCourse = Object.freeze(course);
export const algebraCourseRoutes = Object.freeze(course.routes);
export const algebraUnits = Object.freeze(course.units);
export const supersededAlgebraPaths = Object.freeze([]);

const pagesByPath = new Map(course.pages.map((page) => [page.route.path, page]));
const visualCollections = [
  visualsA0, visualsA1, visualsA2, visualsA3, visualsA4,
  visualsA5, visualsA6, visualsA7, visualsA8, visualsA9,
  visualsA10, visualsA11, visualsA12, visualsA13, visualsA14,
];
const visualsById = new Map(visualCollections.flatMap((collection) => collection.scenes).map((visual) => [visual.id, visual]));

const practiceTypes = new Set(["answer-key", "diagnostic", "exam", "investigation", "mastery-check", "practice", "review"]);
const routeLabel = (pageType) => {
  if (pageType === "course-hub") return "Complete course";
  if (pageType === "unit-hub") return "Unit map";
  if (pageType === "answer-key") return "Response guide";
  if (pageType === "mastery-check") return "Mastery check";
  return pageType.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const algebraCourseSearchRecords = course.routes.map((route) => ({
  id: route.id,
  kind: practiceTypes.has(route.pageType) ? "practice" : route.pageType.endsWith("hub") ? "topic" : "guide",
  title: route.title,
  description: route.description,
  path: route.path,
  domainSlug: "algebra",
  domainName: "Algebra",
  topicName: route.unitCode ? `Unit ${route.unitCode}` : "Complete Algebra course",
  label: routeLabel(route.pageType),
  keywords: route.searchTerms,
  priority: route.pageType === "course-hub" ? 99 : route.pageType === "unit-hub" ? 96 : practiceTypes.has(route.pageType) ? 92 : 84,
}));

export function isAlgebraCoursePath(path) {
  return pagesByPath.has(path);
}

export function getAlgebraCourseRoute(path) {
  return course.routes.find((route) => route.path === path);
}

export function getPublicAlgebraCoursePage(path) {
  const page = pagesByPath.get(path);
  if (!page) return undefined;
  if (!page.lesson) return page;
  return {
    ...page,
    lesson: {
      ...page.lesson,
      figures: page.lesson.figures.map((figure) => ({
        ...figure,
        visual: visualsById.get(`algebra-${figure.id.toLowerCase().replaceAll(".", "-")}`),
      })),
    },
  };
}
