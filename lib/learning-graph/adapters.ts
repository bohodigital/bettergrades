import auditInventory from "../../data/ia/page-inventory.json" with { type: "json" };
import { algebraCourse } from "../algebra/algebra-course.mjs";
import { algebraCourseRoutes } from "../algebra/algebra-course-index.mjs";
import { calculusUnitRoutes, calculusUnits } from "../calculus/calculus-units-index.mjs";
import { limitsUnitRoutes } from "../calculus/limits-unit-index.mjs";
import { publishedResourcePages, resourceHubs } from "../resources/catalog.mjs";
import { redirects, registryRoutes } from "../registry/routing";
import { siteSearchRecords } from "../site-search";
import { conceptId, semanticToken, skillId } from "./ids";
import type { LearningGraph, LearningNode, LearningNodeType, LearningRelationship, RelationshipType } from "./schema";

type AuditPage = (typeof auditInventory.routes)[number];
const auditByPath = new Map(auditInventory.routes.map((page) => [page.route, page]));
const searchByPath = new Map<string, (typeof siteSearchRecords)[number]>();
for (const record of siteSearchRecords) {
  const current = searchByPath.get(record.path);
  if (!current || record.priority > current.priority) searchByPath.set(record.path, record);
}
const unitRouteByPath = new Map(calculusUnitRoutes.map((route: { path: string }) => [route.path, route]));
const algebraRouteByPath = new Map(algebraCourseRoutes.map((route: { path: string }) => [route.path, route]));
const algebraPageByPath = new Map(algebraCourse.pages.map((page: { route: { path: string } }) => [page.route.path, page]));
const limitsRouteByPath = new Map(limitsUnitRoutes.map((route: { path: string }) => [route.path, route]));
const publishingByPath = new Map(publishedResourcePages.map((resource) => [resource.canonicalPath, resource]));
const hubByPath = new Map(resourceHubs.map((hub) => [hub.path, hub]));
const redirectSources = new Set(redirects.map((redirect) => redirect.from));

const excludedRoles = new Set(["home", "policy", "search", "directory"]);
const roleToType: Record<string, LearningNodeType> = {
  "subject-hub": "subject",
  "course-hub": "course",
  "unit-hub": "unit",
  "topic-hub": "topic",
  "quick-answer": "article",
  "concept-explainer": "article",
  "method-guide": "article",
  "decision-guide": "article",
  answer: "article",
  "textbook-lesson": "textbook-lesson",
  worksheet: "worksheet",
  "practice-exam": "practice-exam",
  "worked-problem": "worked-problem",
  "formula-sheet": "formula-sheet",
  "visual-guide": "visual-guide",
  "glossary-term": "glossary-term",
  "glossary-hub": "resource-hub",
  tool: "tool",
  assessment: "assessment",
  "resource-hub": "resource-hub",
  "resource-library": "resource-hub",
};

function stableNodeId(path: string, role: string): string {
  const fixed: Record<string, string> = {
    "/subjects/": "subject.all",
    "/subjects/math/": "subject.math",
    "/subjects/math/algebra/": "course.math.algebra",
    "/subjects/math/calculus/": "course.math.calculus",
    "/glossary/": "resource-hub.glossaries",
    "/glossary/math/": "resource-hub.glossary.math",
    "/practice/math/": "resource-hub.practice.math",
    "/practice/math/calculus/": "resource-hub.practice.math.calculus",
    "/resources/": "resource-hub.math.resources",
    "/tools/": "resource-hub.math.tools",
  };
  if (fixed[path]) return fixed[path];
  if (role === "unit-hub") {
    const unitId = unitIdFor(path);
    if (unitId) return unitId;
  }
  const publishing = publishingByPath.get(path);
  if (publishing) return `${publishing.resourceType}.${publishing.id}`;
  const hub = hubByPath.get(path);
  if (hub) return `resource-hub.${hub.id}`;
  const unitRoute = unitRouteByPath.get(path) as { id?: string } | undefined;
  if (unitRoute?.id) return `${role === "unit-hub" ? "unit" : "textbook-lesson"}.${semanticToken(unitRoute.id)}`;
  const limitsRoute = limitsRouteByPath.get(path) as { sourceSlug?: string } | undefined;
  if (limitsRoute?.sourceSlug) return `${role === "unit-hub" ? "unit" : "textbook-lesson"}.limits.${semanticToken(limitsRoute.sourceSlug)}`;
  const search = searchByPath.get(path);
  if (search?.id && !String(search.id).startsWith("route:")) return `${roleToType[role] ?? "topic"}.${semanticToken(search.id)}`;
  return `${roleToType[role] ?? "topic"}.legacy.${semanticToken(path)}`;
}

function unitIdFor(path: string) {
  const algebraRoute = algebraRouteByPath.get(path) as { unitCode?: string | null } | undefined;
  if (algebraRoute?.unitCode) return `unit.math.algebra.${semanticToken(algebraRoute.unitCode)}`;
  const route = unitRouteByPath.get(path) as { unitId?: string } | undefined;
  if (route?.unitId) {
    const unit = (calculusUnits as readonly Record<string, unknown>[]).find((candidate) => candidate.id === route.unitId);
    return unit ? `unit.calculus.${semanticToken(String(unit.code))}` : `unit.${semanticToken(route.unitId)}`;
  }
  if (path.includes("/limits-continuity/")) return "unit.calculus.1";
  return null;
}

function algebraNodeId(route: { id: string; pageType: string; unitCode?: string | null; lessonId?: string | null }) {
  if (route.pageType === "course-hub") return "course.math.algebra";
  if (route.pageType === "unit-hub") return `unit.math.algebra.${semanticToken(route.unitCode ?? route.id)}`;
  if (route.pageType === "lesson") return `textbook-lesson.math.algebra.${semanticToken(route.lessonId ?? route.id)}`;
  return `assessment.math.algebra.${semanticToken(route.id.replace(/^algebra-/, ""))}`;
}

function buildAlgebraNode(route: {
  id: string;
  path: string;
  title: string;
  pageType: string;
  unitCode?: string | null;
  lessonId?: string | null;
  description: string;
  searchTerms: string[];
  indexable: boolean;
}): LearningNode {
  const page = algebraPageByPath.get(route.path) as {
    unit?: { title?: string; governingQuestion?: string } | null;
    lesson?: { outcome?: string } | null;
  } | undefined;
  const pageRole = route.pageType === "course-hub"
    ? "course-hub"
    : route.pageType === "unit-hub"
      ? "unit-hub"
      : route.pageType === "lesson"
        ? "textbook-lesson"
        : "assessment";
  const topic = page?.lesson?.outcome ?? page?.unit?.title ?? "Algebra";
  return {
    id: algebraNodeId(route),
    nodeType: roleToType[pageRole],
    pageRole,
    title: route.title,
    shortTitle: route.title,
    canonicalPath: route.path,
    subjectId: "subject.math",
    courseId: "course.math.algebra",
    unitId: route.unitCode ? `unit.math.algebra.${semanticToken(route.unitCode)}` : null,
    topicIds: route.unitCode ? [`topic.math.algebra.${semanticToken(route.unitCode)}`] : [],
    primaryConceptId: conceptId(topic),
    secondaryConceptIds: [],
    skillIds: Array.from(new Set(route.searchTerms.slice(0, 12).map(skillId).filter((value): value is string => Boolean(value)))),
    indexPolicy: route.indexable ? "index" : "noindex",
    status: "review",
    searchAliases: Array.from(new Set(route.searchTerms)),
    formerPaths: [],
  };
}

function algebraSeedId(route: { id: string; pageType: string; unitCode?: string | null }) {
  if (route.pageType === "course-hub") return "course-math-algebra-full";
  if (route.pageType === "unit-hub") return `unit-math-algebra-${String(route.unitCode).toLowerCase()}`;
  if (route.pageType === "lesson") return `lesson-math-${route.id}`;
  return `assessment-${route.id.replace(/^algebra-/, "")}`;
}

function buildNode(route: { path: string; title: string; indexable: boolean }, page: AuditPage): LearningNode {
  const record = searchByPath.get(route.path);
  const publishing = publishingByPath.get(route.path);
  const topic = page.topic || record?.topicName || "";
  const primaryConceptId = conceptId(topic);
  const aliases = Array.from(new Set([
    ...(record?.keywords ?? []),
    route.path.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? "",
  ].filter(Boolean)));
  const skills = aliases
    .filter((value) => value.split(/\s+/).length <= 7)
    .slice(0, 12)
    .map(skillId)
    .filter((value): value is string => Boolean(value));
  return {
    id: stableNodeId(route.path, page.page_role),
    nodeType: roleToType[page.page_role],
    pageRole: page.page_role,
    title: record?.title ?? route.title.replace(/\s*\|\s*Better\s*Grades.*$/i, ""),
    shortTitle: page.short_title || record?.title || route.title,
    canonicalPath: route.path,
    subjectId: page.subject === "math" || route.path.includes("/math/") ? "subject.math" : null,
    courseId: page.course === "calculus" || route.path.includes("/calculus/") ? "course.math.calculus" : page.course === "algebra" || route.path.includes("/algebra/") ? "course.math.algebra" : null,
    unitId: unitIdFor(route.path),
    topicIds: topic && topic !== "general" ? [`topic.math.${semanticToken(topic)}`] : [],
    primaryConceptId,
    secondaryConceptIds: [],
    skillIds: Array.from(new Set(skills)),
    indexPolicy: route.indexable ? "index" : "noindex",
    status: publishing?.status ?? "published",
    searchAliases: aliases,
    formerPaths: redirects.filter((redirect) => redirect.to === route.path).map((redirect) => redirect.from),
    ...(publishing ? {
      difficulty: publishing.difficulty,
      estimatedTime: publishing.estimatedTime,
      problemCount: publishing.problemCount,
      sourceLessonIds: publishing.sourceLessons,
      sourceAssessmentIds: publishing.sourceAssessments,
    } : {}),
  };
}

function relationshipType(page: AuditPage, target: AuditPage): RelationshipType {
  if (target.page_role === "tool") return "uses_tool";
  if (["worksheet", "practice-exam", "assessment"].includes(target.page_role)) return page.page_role === "textbook-lesson" ? "practices" : "assesses";
  if (target.page_role === "glossary-term") return "references";
  if (target.page_role === "visual-guide") return "visualizes";
  // A rendered link proves an existing connection, not that editorial review
  // selected it as the page's one primary full-learning destination. The
  // dedicated candidate queue owns that stronger (provisional) assertion.
  if (target.page_role === "textbook-lesson" && page.page_role !== "textbook-lesson") return "explains";
  return "explains";
}

export function adaptCurrentRegistries(sourceCommit: string, sourceTree: string): LearningGraph {
  const exclusions: LearningGraph["exclusions"] = [];
  const nodes: LearningNode[] = [];
  for (const route of registryRoutes.filter((candidate) => candidate.indexable && !redirectSources.has(candidate.path))) {
    const algebraRoute = algebraRouteByPath.get(route.path) as Parameters<typeof buildAlgebraNode>[0] | undefined;
    if (algebraRoute) {
      nodes.push(buildAlgebraNode(algebraRoute));
      continue;
    }
    const page = auditByPath.get(route.path);
    if (!page) {
      exclusions.push({ canonicalPath: route.path, pageRole: "unknown", reason: "Route added after the immutable audit; classify before publishing graph relationships." });
      continue;
    }
    if (excludedRoles.has(page.page_role)) {
      exclusions.push({ canonicalPath: route.path, pageRole: page.page_role, reason: "Non-instructional shell or policy route; no educational concept is assigned." });
      continue;
    }
    const nodeType = roleToType[page.page_role];
    if (!nodeType) {
      exclusions.push({ canonicalPath: route.path, pageRole: page.page_role, reason: "Non-instructional route outside the learning graph contract." });
      continue;
    }
    nodes.push(buildNode(route, page));
  }
  const nodeByPath = new Map(nodes.map((node) => [node.canonicalPath, node]));
  const relationships: LearningRelationship[] = [];
  const seen = new Set<string>();
  for (const page of auditInventory.routes) {
    const source = nodeByPath.get(page.route);
    if (!source) continue;
    for (const targetPath of page.current_related_pages) {
      const target = nodeByPath.get(targetPath);
      if (!target || target.id === source.id) continue;
      const key = `${source.id}\0${target.id}\0${relationshipType(page, auditByPath.get(targetPath) ?? page)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      relationships.push({
        sourceId: source.id,
        targetId: target.id,
        type: relationshipType(page, auditByPath.get(targetPath) ?? page),
        confidence: "high",
        source: "existing-rendered-link",
        editorialStatus: "existing",
        placement: "existing-content",
        anchorText: target.shortTitle,
        reciprocalRequired: false,
      });
    }
  }
  const algebraNodeBySeedId = new Map<string, LearningNode>();
  for (const route of algebraCourseRoutes as ReadonlyArray<{ id: string; pageType: string; unitCode?: string | null; path: string }>) {
    const node = nodeByPath.get(route.path);
    if (node) algebraNodeBySeedId.set(algebraSeedId(route), node);
  }
  const algebraRelationshipTypes: Record<string, RelationshipType> = {
    part_of: "belongs_to",
    precedes: "prerequisite_for",
    practices: "practices",
    uses_tool: "uses_tool",
  };
  for (const seed of algebraCourse.learningGraph as ReadonlyArray<{
    sourceId: string;
    targetId: string;
    relationship: string;
    public: boolean;
    purpose: string;
  }>) {
    const source = algebraNodeBySeedId.get(seed.sourceId);
    const target = algebraNodeBySeedId.get(seed.targetId);
    const type = algebraRelationshipTypes[seed.relationship];
    if (!source || !target || !type) continue;
    const key = `${source.id}\0${target.id}\0${type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    relationships.push({
      sourceId: source.id,
      targetId: target.id,
      type,
      confidence: "high",
      source: "content/algebra/storyboard-v2/learning_graph_seed.csv",
      editorialStatus: seed.public ? "approved" : "provisional",
      placement: "algebra-course-navigation",
      anchorText: target.shortTitle,
      reciprocalRequired: false,
    });
  }
  return {
    schemaVersion: 1,
    generatedAt: "deterministic-at-commit",
    sourceCommit,
    sourceTree,
    auditCommit: "12e9983d429c4b6411ecf55591298fffb7874f03",
    nodes: nodes.sort((a, b) => a.id.localeCompare(b.id)),
    relationships: relationships.sort((a, b) => `${a.sourceId}:${a.targetId}:${a.type}`.localeCompare(`${b.sourceId}:${b.targetId}:${b.type}`)),
    exclusions: exclusions.sort((a, b) => a.canonicalPath.localeCompare(b.canonicalPath)),
  };
}
