import { libraryArticleRoutes, topicRoutes } from "./library";

export type Depth = "Quick answer" | "Full solution" | "Deep dive";

export type Problem = {
  problem_id: string;
  canonical_statement: string;
  canonical_expression: string;
  alternate_phrasings: string[];
  subject: "Mathematics";
  course: string;
  topic: string;
  subtopic: string;
  difficulty: "Intro" | "Intermediate" | "Advanced";
  answer: string;
  accepted_forms: string[];
  method: string;
  skills_required: string[];
  common_mistakes: string[];
  source_status: "Original" | "Canonical";
  license_status: "Original solution" | "Public domain concept";
  verification_status: "Verified";
  review_status: "Reviewed";
  publication_status: "Published" | "Collection only";
  related_problem_ids: string[];
  related_concept_ids: string[];
  depth: Depth;
  href: string;
  reviewed: string;
};

export const problems: Problem[] = [
  {
    problem_id: "cal-int-sec3",
    canonical_statement: "What is the integral of sec³x?",
    canonical_expression: "∫ sec³(x) dx",
    alternate_phrasings: ["integral of sec cubed", "antiderivative of sec^3 x", "integrate sec3x"],
    subject: "Mathematics",
    course: "Calculus II",
    topic: "Integration",
    subtopic: "Trigonometric integrals",
    difficulty: "Intermediate",
    answer: "½ sec x tan x + ½ ln|sec x + tan x| + C",
    accepted_forms: ["(sec(x)tan(x)+ln|sec(x)+tan(x)|)/2+C"],
    method: "Integration by parts",
    skills_required: ["Trigonometric identities", "Integration by parts"],
    common_mistakes: ["Dropping the returned integral", "Forgetting the factor ½", "Omitting absolute values"],
    source_status: "Canonical",
    license_status: "Original solution",
    verification_status: "Verified",
    review_status: "Reviewed",
    publication_status: "Published",
    related_problem_ids: ["cal-der-xpowx", "cal-int-lnx"],
    related_concept_ids: ["integration-by-parts"],
    depth: "Deep dive",
    href: "/answers/calculus/integral-of-sec-cubed/",
    reviewed: "July 11, 2026",
  },
  {
    problem_id: "cal-der-xpowx",
    canonical_statement: "How do you differentiate xˣ?",
    canonical_expression: "d/dx (xˣ)",
    alternate_phrasings: ["derivative of x to the x", "differentiate x^x"],
    subject: "Mathematics",
    course: "Calculus I",
    topic: "Differentiation",
    subtopic: "Logarithmic differentiation",
    difficulty: "Intermediate",
    answer: "xˣ(ln x + 1), for x > 0",
    accepted_forms: ["x^x(1+ln(x))"],
    method: "Logarithmic differentiation",
    skills_required: ["Chain rule", "Logarithms"],
    common_mistakes: ["Using only the power rule", "Forgetting the domain"],
    source_status: "Canonical",
    license_status: "Original solution",
    verification_status: "Verified",
    review_status: "Reviewed",
    publication_status: "Collection only",
    related_problem_ids: ["cal-int-sec3"],
    related_concept_ids: ["log-differentiation"],
    depth: "Full solution",
    href: "/answers/",
    reviewed: "July 9, 2026",
  },
  {
    problem_id: "cal-harmonic",
    canonical_statement: "Why does the harmonic series diverge?",
    canonical_expression: "Σ 1/n",
    alternate_phrasings: ["harmonic series proof", "does sum 1/n converge"],
    subject: "Mathematics",
    course: "Calculus II",
    topic: "Infinite series",
    subtopic: "Convergence",
    difficulty: "Intermediate",
    answer: "Its partial sums grow without bound; grouping terms gives infinitely many blocks worth at least ½.",
    accepted_forms: ["diverges"],
    method: "Grouping argument",
    skills_required: ["Series", "Inequalities"],
    common_mistakes: ["Assuming terms approaching zero guarantee convergence"],
    source_status: "Canonical",
    license_status: "Public domain concept",
    verification_status: "Verified",
    review_status: "Reviewed",
    publication_status: "Collection only",
    related_problem_ids: [],
    related_concept_ids: ["series-convergence"],
    depth: "Deep dive",
    href: "/answers/",
    reviewed: "July 8, 2026",
  },
  {
    problem_id: "cal-parts-when",
    canonical_statement: "When should integration by parts be used?",
    canonical_expression: "∫u dv = uv − ∫v du",
    alternate_phrasings: ["when to use integration by parts", "choosing u and dv", "LIATE"],
    subject: "Mathematics",
    course: "Calculus II",
    topic: "Integration",
    subtopic: "Method selection",
    difficulty: "Intro",
    answer: "Use it when differentiating one factor simplifies it and the other factor can be integrated reliably.",
    accepted_forms: ["products with a simplifying factor"],
    method: "Integration by parts",
    skills_required: ["Antiderivatives", "Product rule"],
    common_mistakes: ["Treating LIATE as a law", "Choosing a dv you cannot integrate"],
    source_status: "Original",
    license_status: "Original solution",
    verification_status: "Verified",
    review_status: "Reviewed",
    publication_status: "Published",
    related_problem_ids: ["cal-int-sec3"],
    related_concept_ids: ["integration-by-parts"],
    depth: "Full solution",
    href: "/learn/calculus/integration-by-parts/",
    reviewed: "July 10, 2026",
  },
  {
    problem_id: "cal-washer-shell",
    canonical_statement: "Washer method or shell method?",
    canonical_expression: "V = π∫(R²−r²)dx or 2π∫rh dx",
    alternate_phrasings: ["shells vs washers", "which volume method"],
    subject: "Mathematics",
    course: "Calculus II",
    topic: "Applications of integration",
    subtopic: "Volumes of revolution",
    difficulty: "Intro",
    answer: "Choose the setup that avoids splitting the region and keeps the radius and height easiest to express.",
    accepted_forms: ["simplest setup"],
    method: "Geometric setup",
    skills_required: ["Graphing", "Definite integrals"],
    common_mistakes: ["Mixing horizontal and vertical dimensions"],
    source_status: "Original",
    license_status: "Original solution",
    verification_status: "Verified",
    review_status: "Reviewed",
    publication_status: "Collection only",
    related_problem_ids: [],
    related_concept_ids: ["volumes-of-revolution"],
    depth: "Quick answer",
    href: "/answers/",
    reviewed: "July 7, 2026",
  },
];

export const routes = [
  "/", "/answers/", "/answers/calculus/integral-of-sec-cubed/",
  "/learn/calculus/integration-by-parts/", "/calculators/",
  "/calculators/integration-method-finder/", "/practice/",
  "/practice/calculus/integration-method-selection/", "/exams/",
  "/exams/calculus-readiness/", "/bee/", "/subjects/math/calculus/",
  "/about/", "/how-we-verify/", "/editorial-policy/", "/source-policy/",
  "/corrections/", "/privacy/", "/accessibility/", "/search/", "/topics/", "/library/",
  ...topicRoutes,
  ...libraryArticleRoutes,
];

export function normalizeQuery(value: string) {
  return value.toLowerCase().replace(/[³^()|+]/g, " ").replace(/\s+/g, " ").trim();
}

export function searchProblems(query: string) {
  const terms = normalizeQuery(query).split(" ").filter(Boolean);
  if (!terms.length) return problems;
  return problems
    .map((problem) => {
      const haystack = normalizeQuery([
        problem.canonical_statement,
        problem.canonical_expression,
        problem.answer,
        problem.course,
        problem.topic,
        problem.subtopic,
        problem.method,
        ...problem.alternate_phrasings,
      ].join(" "));
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      return { problem, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.problem);
}
