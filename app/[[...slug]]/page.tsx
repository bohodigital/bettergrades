import { BetterGradesApp } from "../BetterGradesApp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoute, publicRoutes } from "../../lib/registry";

import { isLimitsUnitPath } from "../../lib/calculus/limits-unit-index.mjs";
import { getPublicLimitsUnitPage } from "../../lib/calculus/limits-unit.mjs";
import { isCalculusUnitPath } from "../../lib/calculus/calculus-units-index.mjs";
import { getPublicCalculusUnitPage } from "../../lib/calculus/calculus-unit.mjs";
function getPath(slug: string[] = []) {
  return `/${slug.join("/")}${slug.length ? "/" : ""}`;
}

function getCalculusUnitSeo(path: string) {
  if (path.startsWith("/subjects/math/calculus/integration-applications/")) return { code: "3B", name: "Applications of Integration", topic: "integration applications" };
  if (path.startsWith("/subjects/math/calculus/integrals/")) return { code: "3A", name: "Integral Foundations and Techniques", topic: "integrals" };
  if (path.startsWith("/subjects/math/calculus/derivative-applications/")) return { code: "2B", name: "Applications of Derivatives" };
  if (path.startsWith("/subjects/math/calculus/derivatives/")) return { code: "2A", name: "Derivative Foundations and Techniques" };
  return undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = getPath(slug);
  const meta = getRoute(path) || { title: "Better Grades", description: "Free academic answers, complete explanations, useful tools, and better practice.", indexable: true };
  const unit = getCalculusUnitSeo(path);
  const title = unit && !new RegExp(`\\bUnit ${unit.code}\\b`).test(meta.title) ? `${meta.title} | Unit ${unit.code}` : meta.title;
  const description = unit && !new RegExp(`\\bUnit ${unit.code}\\b`).test(meta.description) ? `${meta.description} Part of Calculus I Unit ${unit.code}: ${unit.name}.` : meta.description;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...(unit ? {
      keywords: [`Calculus Unit ${unit.code}`, unit.name, unit.topic ?? "derivatives", "Calculus I"],
      openGraph: { type: "article" as const, title, description, url: path, siteName: "Better Grades" },
      twitter: { card: "summary_large_image" as const, title, description },
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
  return <BetterGradesApp path={path} glossaryData={glossaryData} limitsUnitPage={limitsUnitPage} calculusUnitPage={calculusUnitPage} />;
}
