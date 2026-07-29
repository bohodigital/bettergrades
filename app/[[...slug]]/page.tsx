import { BetterGradesApp } from "../BetterGradesApp";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getRoute, publicRoutes } from "../../lib/registry";
import { enrichedGlossaryResources, getPublishedResourcePage, getResourceHub, getResourcesForHub, publishedResourcePages } from "../../lib/resources/catalog.mjs";

import { isLimitsUnitPath } from "../../lib/calculus/limits-unit-index.mjs";
import { getPublicLimitsUnitPage } from "../../lib/calculus/limits-unit.mjs";
import { isCalculusUnitPath } from "../../lib/calculus/calculus-units-index.mjs";
import { getPublicCalculusUnitPage } from "../../lib/calculus/calculus-unit.mjs";
import { getPublicAlgebraCoursePage, isAlgebraCoursePath } from "../../lib/algebra/algebra-course.mjs";
import { getPublicPrecalculusCoursePage, isPrecalculusCoursePath } from "../../lib/precalculus/precalculus-course.mjs";
import { GlossaryHubPage, MathConventionsPage, MathGlossaryPage } from "../GlossaryPages";
import { LimitsUnitPageContent } from "../LimitsUnitPages";
import { CalculusUnitPageContent } from "../CalculusUnitPages";
import { AlgebraCoursePageContent } from "../AlgebraCoursePages";
import { PrecalculusCoursePageContent } from "../PrecalculusCoursePages";
import { ResourceHubPage, ResourceLibraryPage, ResourcePage } from "../ResourcePages";
function getPath(slug: string[] = []) {
  return `/${slug.join("/")}${slug.length ? "/" : ""}`;
}

function getCalculusUnitSeo(path: string) {
  if (path.startsWith("/subjects/math/calculus/power-series-and-taylor-series/")) return { code: "4B", name: "Power Series and Taylor Series", topic: "power series and Taylor series", course: "Calculus II" };
  if (path.startsWith("/subjects/math/calculus/sequences-and-series/")) return { code: "4A", name: "Sequences and Infinite Series", topic: "sequences and series", course: "Calculus II" };
  if (path.startsWith("/subjects/math/calculus/integration-applications/")) return { code: "3B", name: "Applications of Integration", topic: "integration applications" };
  if (path.startsWith("/subjects/math/calculus/integrals/")) return { code: "3A", name: "Integral Foundations and Techniques", topic: "integrals" };
  if (path.startsWith("/subjects/math/calculus/derivative-applications/")) return { code: "2B", name: "Applications of Derivatives" };
  if (path.startsWith("/subjects/math/calculus/derivatives/")) return { code: "2A", name: "Derivative Foundations and Techniques" };
  return undefined;
}

function getAlgebraUnitSeo(path: string) {
  const page = getPublicAlgebraCoursePage(path);
  if (!page) return undefined;
  return {
    code: page.unit?.code,
    name: page.unit?.title ?? "Algebra: Quantities, Equations, and Structure",
    topic: page.lesson?.title ?? page.unit?.governingQuestion ?? "complete Algebra course",
  };
}

function getPrecalculusSeo(path: string) {
  const page = getPublicPrecalculusCoursePage(path);
  if (!page) return undefined;
  return {
    name: page.unit?.title ?? "Precalculus: Functions, Models, and Change",
    topic: page.lesson?.title ?? page.unit?.title ?? "Precalculus course",
    routeRole: page.route.pageType,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = getPath(slug);
  const meta = getRoute(path) || { title: "Better Grades", description: "Free academic answers, complete explanations, useful tools, and better practice.", indexable: true };
  const resource = getPublishedResourcePage(path);
  const unit = getCalculusUnitSeo(path);
  const algebra = getAlgebraUnitSeo(path);
  const precalculus = getPrecalculusSeo(path);
  const title = algebra?.code && !new RegExp(`\\bUnit ${algebra.code}\\b`).test(meta.title)
    ? `${meta.title} | Unit ${algebra.code}`
    : unit && !new RegExp(`\\bUnit ${unit.code}\\b`).test(meta.title) ? `${meta.title} | Unit ${unit.code}` : meta.title;
  const course = unit?.code?.startsWith("4") ? "Calculus II" : "Calculus I";
  const description = algebra?.code && !new RegExp(`\\bUnit ${algebra.code}\\b`).test(meta.description)
    ? `${meta.description} Part of BetterGrades Algebra Unit ${algebra.code}: ${algebra.name}.`
    : unit && !new RegExp(`\\bUnit ${unit.code}\\b`).test(meta.description) ? `${meta.description} Part of ${course} Unit ${unit.code}: ${unit.name}.` : meta.description;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...(resource ? {
      openGraph: {
        type: "article" as const,
        title,
        description,
        url: path,
        siteName: "Better Grades",
        images: resource.primaryVisual ? [{ url: `/visuals/resources/${resource.primaryVisual}.png`, width: 1200, height: 805, alt: `${resource.shortTitle} visual guide` }] : undefined,
      },
      twitter: { card: "summary_large_image" as const, title, description },
      other: { "resource-revision-date": resource.revisionDate, "resource-type": resource.resourceType },
    } : {}),
    ...(unit ? {
      keywords: [`Calculus Unit ${unit.code}`, unit.name, unit.topic ?? "derivatives", course],
      openGraph: { type: "article" as const, title, description, url: path, siteName: "Better Grades" },
      twitter: { card: "summary_large_image" as const, title, description },
    } : {}),
    ...(algebra ? {
      keywords: [algebra.code ? `Algebra Unit ${algebra.code}` : "complete Algebra course", algebra.name, algebra.topic, "Algebra textbook"],
      openGraph: {
        type: "article" as const,
        title,
        description,
        url: path,
        siteName: "Better Grades",
        images: [{ url: "/og-algebra.png", width: 1731, height: 909, alt: "BetterGrades Algebra: Quantities, Equations, and Structure" }],
      },
      twitter: { card: "summary_large_image" as const, title, description, images: ["/og-algebra.png"] },
      other: { "course-revision-date": "2026-07-28", "course-route-role": getPublicAlgebraCoursePage(path)?.route.pageType ?? "course" },
    } : {}),
    ...(precalculus ? {
      keywords: [precalculus.name, precalculus.topic, "Precalculus functions", "Precalculus models", "Precalculus textbook"],
      openGraph: {
        type: "article" as const,
        title,
        description,
        url: path,
        siteName: "Better Grades",
        images: [{
          url: "/og-precalculus.png",
          width: 1731,
          height: 909,
          alt: "Better Grades Precalculus: Functions, Models, and Change",
        }],
      },
      twitter: { card: "summary_large_image" as const, title, description, images: ["/og-precalculus.png"] },
      other: { "course-revision-date": "2026-07-29", "course-route-role": precalculus.routeRole },
    } : {}),
  };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const path = getPath(slug);
  if (!publicRoutes.includes(path)) notFound();
  const glossaryData = path.startsWith("/glossary/")
    ? await import("../../lib/glossary/math/registry.mjs").then((registry) => ({
      terms: registry.mathGlossaryTerms,
      categories: registry.mathGlossaryCategories,
      uppercaseConventions: registry.uppercaseVariableConventions,
    }))
    : undefined;
  const limitsUnitPage = isLimitsUnitPath(path) ? getPublicLimitsUnitPage(path) : undefined;
  const calculusUnitPage = isCalculusUnitPath(path) ? getPublicCalculusUnitPage(path) : undefined;
  const algebraCoursePage = isAlgebraCoursePath(path) ? getPublicAlgebraCoursePage(path) : undefined;
  const precalculusCoursePage = isPrecalculusCoursePath(path) ? getPublicPrecalculusCoursePage(path) : undefined;
  const resourcePage = getPublishedResourcePage(path);
  const resourceHub = getResourceHub(path);
  const libraryResources = path === "/resources/"
    ? publishedResourcePages
      .filter((resource) => resource.status === "published" && resource.indexPolicy === "index")
      .map(({ id, canonicalPath, shortTitle, summary, resourceType, difficulty, course, unit, topics, problemCount, estimatedTime, studentPdf, answerKeyPdf, primaryVisual }) => ({
        id, canonicalPath, shortTitle, summary, resourceType, difficulty, course, unit, topics, problemCount, estimatedTime, studentPdf, answerKeyPdf, primaryVisual,
      }))
    : undefined;
  const hubResources = resourceHub
    ? getResourcesForHub(resourceHub.resourceType).map(({ id, canonicalPath, shortTitle, resourceType, difficulty, course, unit, topics, problemCount, estimatedTime }) => ({ id, canonicalPath, shortTitle, resourceType, difficulty, course, unit, topics, problemCount, estimatedTime }))
    : undefined;
  const relatedResources = resourcePage
    ? resourcePage.relatedResources.map((id) => publishedResourcePages.find((resource) => resource.id === id)).filter((resource) => resource !== undefined).map(({ id, canonicalPath, shortTitle }) => ({ id, canonicalPath, shortTitle }))
    : undefined;
  const enrichedGlossaryTermIds = resourcePage
    ? resourcePage.relatedGlossaryTerms.filter((id) => enrichedGlossaryResources.some((resource) => resource.glossaryTermId === id))
    : undefined;
  let routeContent: ReactNode;
  if (precalculusCoursePage) routeContent = <PrecalculusCoursePageContent page={precalculusCoursePage} />;
  else if (algebraCoursePage) routeContent = <AlgebraCoursePageContent page={algebraCoursePage} />;
  else if (libraryResources) routeContent = <ResourceLibraryPage resources={libraryResources} />;
  else if (resourceHub) routeContent = <ResourceHubPage hub={resourceHub} resources={hubResources ?? []} />;
  else if (resourcePage) routeContent = <ResourcePage resource={resourcePage} glossaryTerms={glossaryData?.terms} relatedResources={relatedResources ?? []} enrichedGlossaryTermIds={enrichedGlossaryTermIds ?? []} />;
  else if (calculusUnitPage) routeContent = <CalculusUnitPageContent page={calculusUnitPage} />;
  else if (limitsUnitPage) routeContent = <LimitsUnitPageContent page={limitsUnitPage} />;
  else if (path === "/glossary/" && glossaryData) routeContent = <GlossaryHubPage terms={glossaryData.terms} />;
  else if (path === "/glossary/math/" && glossaryData) routeContent = <MathGlossaryPage terms={glossaryData.terms} categories={glossaryData.categories} />;
  else if (path === "/glossary/math/conventions/" && glossaryData) routeContent = <MathConventionsPage uppercaseConventions={glossaryData.uppercaseConventions} />;
  return <BetterGradesApp
    path={path}
    routeContent={routeContent}
  />;
}
