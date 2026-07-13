import type { LibraryTopic } from "../library";
import { equationsArticles } from "./equations";
import { linearArticles } from "./linear";
import { systemsArticles } from "./systems";
import { polynomialsArticles } from "./polynomials";
import { rationalArticles } from "./rational";
import { powersFunctionsArticles } from "./powers-functions";

export const algebraTopics: LibraryTopic[] = [
  { slug: "expressions-equations", name: "Expressions & Equations", shortName: "Equations", description: "Translate algebraic structure, simplify without changing value, and solve equations with a reliable sequence of reversible moves.", sequence: 1, accent: "01" },
  { slug: "linear-relationships", name: "Linear Relationships", shortName: "Linear", description: "Read slope as a rate, build equations from data, and connect tables, graphs, and formulas without treating them as separate topics.", sequence: 2, accent: "02" },
  { slug: "systems-inequalities", name: "Systems & Inequalities", shortName: "Systems", description: "Solve simultaneous conditions, choose an efficient method, and describe whole solution regions instead of isolated numbers.", sequence: 3, accent: "03" },
  { slug: "polynomials-factoring", name: "Polynomials & Factoring", shortName: "Polynomials", description: "Control exponents, multiply cleanly, and recognize the factor patterns that make higher-degree algebra manageable.", sequence: 4, accent: "04" },
  { slug: "rational-expressions", name: "Rational Expressions", shortName: "Rational", description: "Track restrictions, simplify factors legally, combine fractions, and solve equations without losing excluded values.", sequence: 5, accent: "05" },
  { slug: "radicals-exponents-functions", name: "Radicals, Exponents & Functions", shortName: "Functions", description: "Move between radical and exponent notation, solve carefully, and use function language to describe inputs, outputs, and inverses.", sequence: 6, accent: "06" },
];

export const algebraArticles = [
  ...equationsArticles,
  ...linearArticles,
  ...systemsArticles,
  ...polynomialsArticles,
  ...rationalArticles,
  ...powersFunctionsArticles,
];
