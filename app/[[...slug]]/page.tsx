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

function getUnit2Seo(path: string) {
  if (path.startsWith("/subjects/math/calculus/derivative-applications/")) return { code: "2B", name: "Applications of Derivatives" };
  if (path.startsWith("/subjects/math/calculus/derivatives/")) return { code: "2A", name: "Derivative Foundations and Techniques" };
  return undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = getPath(slug);
  const meta = getRoute(path) || { title: "Better Grades", description: "Free academic answers, complete explanations, useful tools, and better practice.", indexable: true };
  const unit2 = getUnit2Seo(path);
  const title = unit2 && !new RegExp(`\\bUnit ${unit2.code}\\b`).test(meta.title) ? `${meta.title} | Unit ${unit2.code}` : meta.title;
  const description = unit2 && !new RegExp(`\\bUnit ${unit2.code}\\b`).test(meta.description) ? `${meta.description} Part of Calculus I Unit ${unit2.code}: ${unit2.name}.` : meta.description;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...(unit2 ? {
      keywords: [`Calculus Unit ${unit2.code}`, unit2.name, "derivatives", "Calculus I"],
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
