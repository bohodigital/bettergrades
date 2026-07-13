export const topicTermIds = Object.freeze({
  "expressions-equations": ["variable", "expression", "equation", "solution", "inverse-operation"],
  "linear-relationships": ["linear-function", "slope", "rate-of-change", "slope-intercept-form", "x-intercept"],
  "systems-inequalities": ["system-of-equations", "substitution-method", "elimination-method", "inequality", "solution-set"],
  "polynomials-factoring": ["polynomial", "factoring", "factor", "quadratic", "zero-product-property"],
  "rational-expressions": ["rational-expression", "denominator", "domain", "rational-equation", "extraneous-solution"],
  "radicals-exponents-functions": ["radical", "rational-exponent", "function", "inverse-function", "domain"],
  "limits-continuity": ["limit", "one-sided-limit", "continuity", "indeterminate-form", "squeeze-theorem"],
  derivatives: ["derivative", "derivative-notations", "chain-rule", "product-rule", "tangent-line"],
  "derivative-applications": ["mean-value-theorem", "critical-number", "local-maximum", "concavity", "linearization"],
  "integration-techniques": ["indefinite-integral", "antiderivative", "u-substitution", "integration-by-parts", "partial-fractions"],
  "integration-applications": ["definite-integral", "area-between-curves", "volume-of-revolution", "arc-length", "work-integral"],
  "sequences-series": ["sequence", "series", "convergence", "power-series", "taylor-series"],
});

export const exactProfiles = Object.freeze({
  "/": ["function", "equation", "derivative", "definite-integral", "variable"],
  "/subjects/": ["variable", "function", "equation", "mathematical-model", "units"],
  "/subjects/math/": ["variable", "function", "expression", "derivative", "definite-integral"],
  "/answers/": ["solution", "equation", "equivalent-expressions", "derivative", "antiderivative"],
  "/search/": ["variable", "expression", "equation", "function", "derivative-notations"],
  "/tools/": ["expression", "equivalent-expressions", "function", "derivative-operator", "integral-symbol"],
  "/tools/math/algebra/expression-checker/": ["expression", "equivalent-expressions", "variable", "domain", "factor"],
  "/tools/math/calculus/integration-method-finder/": ["integrand", "indefinite-integral", "u-substitution", "integration-by-parts", "partial-fractions"],
  "/practice/": ["solution", "equation", "function", "derivative", "definite-integral"],
  "/practice/math/": ["variable", "function", "equation", "derivative", "integral-symbol"],
  "/practice/math/calculus/": ["limit", "derivative", "mean-value-theorem", "definite-integral", "series"],
  "/answers/calculus/integral-of-sec-cubed/": ["indefinite-integral", "integration-by-parts", "antiderivative", "constant-of-integration", "derivative"],
  "/learn/calculus/integration-by-parts/": ["integration-by-parts", "integrand", "differential", "antiderivative", "constant-of-integration"],
  "/glossary/": ["variable", "function", "equals-sign", "derivative-notations", "integral-symbol"],
  "/glossary/math/": ["variable", "function", "equals-sign", "derivative-notations", "integral-symbol"],
  "/glossary/math/conventions/": ["variable", "parameter", "index", "independent-variable", "constant-of-integration"],
});

export const policyProfile = Object.freeze(["variable", "function", "equation", "solution", "mathematical-model"]);
export const genericProfile = Object.freeze(["variable", "expression", "equation", "function", "solution"]);

export const allPageTermIds = Object.freeze([...new Set([
  ...Object.values(topicTermIds).flat(),
  ...Object.values(exactProfiles).flat(),
  ...policyProfile,
  ...genericProfile,
])].sort());
