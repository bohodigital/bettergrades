export const algebraPracticeProblems = Object.freeze([
  {
    id: "expand-two-binomials",
    topic: "Expanding",
    prompt: "Expand and simplify.",
    promptLatex: String.raw`(2x-3)(x+5)`,
    answerLatex: String.raw`2x^2+7x-15`,
    hint: "Distribute both terms in the first binomial, then combine the x-terms.",
    explanation: "The four products are 2x², 10x, −3x, and −15. The middle terms combine to 7x.",
  },
  {
    id: "combine-like-terms",
    topic: "Like terms",
    prompt: "Combine like terms.",
    promptLatex: String.raw`4x^2-3x+7+5x^2+2x-1`,
    answerLatex: String.raw`9x^2-x+6`,
    hint: "Group the x² terms, the x-terms, and the constants separately.",
    explanation: "The coefficients combine as 4 + 5, −3 + 2, and 7 − 1.",
  },
  {
    id: "distribute-and-simplify",
    topic: "Distributive property",
    prompt: "Distribute and simplify.",
    promptLatex: String.raw`3(2x-5)-2(x+4)`,
    answerLatex: String.raw`4x-23`,
    hint: "The negative two multiplies both terms in the second parentheses.",
    explanation: "Distributing gives 6x − 15 − 2x − 8, which combines to 4x − 23.",
  },
  {
    id: "factor-trinomial",
    topic: "Factoring",
    prompt: "Factor completely.",
    promptLatex: String.raw`6x^2+11x+3`,
    answerLatex: String.raw`(3x+1)(2x+3)`,
    hint: "Look for two numbers whose product is 18 and whose sum is 11.",
    explanation: "Splitting 11x into 9x + 2x and factoring by grouping produces (3x + 1)(2x + 3).",
  },
  {
    id: "multiply-powers",
    topic: "Exponent laws",
    prompt: "Simplify.",
    promptLatex: String.raw`(3x^2)^2x^3`,
    answerLatex: String.raw`9x^7`,
    hint: "Apply the outer power first, then add exponents on matching bases.",
    explanation: "Squaring 3x² gives 9x⁴. Multiplying by x³ adds the exponents, giving 9x⁷.",
  },
  {
    id: "expand-perfect-square",
    topic: "Special products",
    prompt: "Expand the perfect square.",
    promptLatex: String.raw`(x+4)^2`,
    answerLatex: String.raw`x^2+8x+16`,
    hint: "Use (a + b)² = a² + 2ab + b².",
    explanation: "The middle term is twice the product x · 4, so it is 8x.",
  },
]);

export function looksLikeAlgebraExpression(query) {
  const value = query.trim();
  if (!value || value.length > 180) return false;
  if (/\b(simplify|expand|factor|evaluate|equivalent|check (?:my )?answer)\b/i.test(value)) return true;
  return /[a-z0-9)]\s*(?:\^|\*|\/|\+|-|=)|(?:\^|\*|\/|\+|-|=)\s*[a-z0-9(]/i.test(value);
}

export function algebraCheckerHref(query = "") {
  const value = query.trim();
  return value
    ? `/tools/math/algebra/expression-checker/?expression=${encodeURIComponent(value)}`
    : "/tools/math/algebra/expression-checker/";
}
