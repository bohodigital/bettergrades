import { BetterGradesApp } from "../BetterGradesApp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routes } from "../../lib/content";
import { archetypes, getArticle, getTopic } from "../../lib/library";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": { title: "Better Grades — Free answers, full explanations", description: "Find free academic answers, complete calculus explanations, practical calculators, and focused practice." },
  "/answers/": { title: "Search the answer bank", description: "Find specific calculus problems, immediate answers, complete solutions, and related practice." },
  "/answers/calculus/integral-of-sec-cubed/": { title: "What is the integral of sec³x?", description: "Get the answer to the integral of sec cubed x, then see the full integration-by-parts derivation, verification, and common mistakes." },
  "/learn/calculus/integration-by-parts/": { title: "Integration by parts: recognition, setup, and examples", description: "Learn how to recognize integration by parts, choose u and dv, avoid common mistakes, and know when another method is better." },
  "/calculators/": { title: "Calculus calculators that explain the method", description: "Use practical calculus tools with explanations, assumptions, and clear limitations." },
  "/calculators/integration-method-finder/": { title: "Integration Method Finder", description: "Describe the structure of an integral and get a ranked first method with a clear explanation." },
  "/practice/": { title: "Calculus practice built around the mistake", description: "Practice method recognition, prerequisite skills, and transfer to unfamiliar calculus problems." },
  "/practice/calculus/integration-method-selection/": { title: "Integration method selection practice", description: "Choose the best first integration method in a focused ten-question practice set with feedback." },
  "/exams/": { title: "Calculus exams and readiness diagnostics", description: "Find prerequisite gaps with diagnostics that explain what to review next." },
  "/exams/calculus-readiness/": { title: "Calculus readiness diagnostic", description: "Check twelve algebra, function, logarithm, trigonometry, and limit prerequisites for calculus." },
  "/bee/": { title: "Integration Bee", description: "Try twenty reviewed integration problems in timed or untimed mode, with explanations after every answer." },
  "/subjects/math/calculus/": { title: "Calculus answers, methods, calculators, and practice", description: "Explore connected calculus answers, method guides, calculators, practice sets, and readiness checks." },
};

function getPath(slug: string[] = []) {
  return `/${slug.join("/")}${slug.length ? "/" : ""}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = getPath(slug);
  if (slug[0] === "library" && slug.length === 3) {
    const article = getArticle(slug[1], slug[2]);
    if (article) return {
      title: article.title,
      description: article.deck,
      alternates: { canonical: path },
      keywords: [article.shortTitle, getTopic(article.topicSlug)?.name || "calculus", archetypes[article.archetype].label, "calculus help"],
    };
  }
  if (slug[0] === "topics" && slug[1] === "calculus" && slug[2]) {
    const topic = getTopic(slug[2]);
    if (topic) return { title: `${topic.name} calculus resources`, description: topic.description, alternates: { canonical: path } };
  }
  if (path === "/topics/" || path === "/library/") return { title: "Calculus topics and resource library", description: "Browse thirty full calculus answers, method guides, concept explainers, and decision guides organized across six connected topics.", alternates: { canonical: "/topics/" } };
  const meta = pageMeta[path] || { title: "Better Grades", description: "Free academic answers, complete explanations, useful calculators, and better practice." };
  return {
    title: path === "/" ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical: path === "/search/" ? undefined : path },
    robots: path === "/search/" ? { index: false, follow: true } : undefined,
  };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const path = getPath(slug);
  if (!routes.includes(path)) notFound();
  return <BetterGradesApp path={path} />;
}
