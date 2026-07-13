import { BetterGradesApp } from "../BetterGradesApp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoute, publicRoutes } from "../../lib/registry";

function getPath(slug: string[] = []) {
  return `/${slug.join("/")}${slug.length ? "/" : ""}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = getPath(slug);
  const meta = getRoute(path) || { title: "Better Grades", description: "Free academic answers, complete explanations, useful tools, and better practice.", indexable: true };
  return {
    title: path === "/" ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical: meta.indexable ? path : undefined },
    robots: meta.indexable ? undefined : { index: false, follow: true },
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
  return <BetterGradesApp path={path} glossaryData={glossaryData} />;
}
