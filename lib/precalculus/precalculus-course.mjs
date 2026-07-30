import course from "../../content/precalculus/course.public.json" with { type: "json" };
import visuals1 from "../../content/precalculus/units/unit-1/public-runtime-scenes.server.json" with { type: "json" };
import visuals2 from "../../content/precalculus/units/unit-2/public-runtime-scenes.server.json" with { type: "json" };
import visuals3 from "../../content/precalculus/units/unit-3/public-runtime-scenes.server.json" with { type: "json" };
import visuals4 from "../../content/precalculus/units/unit-4/public-runtime-scenes.server.json" with { type: "json" };
import visuals5 from "../../content/precalculus/units/unit-5/public-runtime-scenes.server.json" with { type: "json" };
import visuals6 from "../../content/precalculus/units/unit-6/public-runtime-scenes.server.json" with { type: "json" };
import visuals7 from "../../content/precalculus/units/unit-7/public-runtime-scenes.server.json" with { type: "json" };
import visuals8 from "../../content/precalculus/units/unit-8/public-runtime-scenes.server.json" with { type: "json" };
import visuals9 from "../../content/precalculus/units/unit-9/public-runtime-scenes.server.json" with { type: "json" };
import visuals10 from "../../content/precalculus/units/unit-10/public-runtime-scenes.server.json" with { type: "json" };
import visuals11 from "../../content/precalculus/units/unit-11/public-runtime-scenes.server.json" with { type: "json" };
import visuals12 from "../../content/precalculus/units/unit-12/public-runtime-scenes.server.json" with { type: "json" };
import visuals13 from "../../content/precalculus/units/unit-13/public-runtime-scenes.server.json" with { type: "json" };
import visuals14 from "../../content/precalculus/units/unit-14/public-runtime-scenes.server.json" with { type: "json" };
import visuals15 from "../../content/precalculus/units/unit-15/public-runtime-scenes.server.json" with { type: "json" };
import visuals16 from "../../content/precalculus/units/unit-16/public-runtime-scenes.server.json" with { type: "json" };

export const precalculusCourse = Object.freeze(course);
export const precalculusUnits = Object.freeze(course.units);
export { precalculusCourseRoutes } from "./precalculus-course-index.mjs";
export { precalculusCourseSearchRecords } from "./precalculus-course-search.mjs";

const routesByPath = new Map(course.routes.map((route) => [route.path, route]));
const unitsById = new Map(course.units.map((unit) => [unit.id, unit]));
const lessonsById = new Map(course.lessons.map((lesson) => [lesson.id, lesson]));
const visualsById = new Map(
  [
    visuals1, visuals2, visuals3, visuals4,
    visuals5, visuals6, visuals7, visuals8,
    visuals9, visuals10, visuals11, visuals12,
    visuals13, visuals14, visuals15, visuals16,
  ]
    .flatMap((collection) => collection.scenes)
    .map((visual) => [visual.id, visual]),
);

export function isPrecalculusCoursePath(path) {
  return routesByPath.has(path);
}

export function getPrecalculusCourseRoute(path) {
  return routesByPath.get(path);
}

export function getPublicPrecalculusCoursePage(path) {
  const route = routesByPath.get(path);
  if (!route) return undefined;
  const unit = route.unitId ? unitsById.get(route.unitId) ?? null : null;
  const sourceLesson = route.lessonId ? lessonsById.get(route.lessonId) ?? null : null;
  const lesson = sourceLesson ? {
    ...sourceLesson,
    figures: sourceLesson.figures.map((figure) => ({
      ...figure,
      visual: visualsById.get(figure.id),
    })),
  } : null;
  const breadcrumbs = [
    { name: "Learn", path: "/subjects/" },
    { name: "Precalculus", path: course.root },
    ...(unit && route.pageType !== "course-hub" ? [{ name: unit.title, path: unit.root }] : []),
    ...(lesson ? [{ name: lesson.title, path: lesson.path }] : []),
  ];
  return {
    route,
    unit,
    lesson,
    unitLessons: unit ? course.lessons.filter((candidate) => candidate.unitId === unit.id) : [],
    units: course.units,
    breadcrumbs,
  };
}
