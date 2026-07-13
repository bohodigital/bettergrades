export type Question = {
  prompt: string;
  expression?: string;
  expressionTex?: string;
  choices: string[];
  answer: number;
  explanation: string;
  skill: string;
};

export const methodQuestions: Question[] = [
  { prompt: "Choose the best first method.", expression: "∫ x eˣ dx", choices: ["Integration by parts", "u-substitution", "Partial fractions", "Trig substitution"], answer: 0, explanation: "The product contains x, which becomes simpler when differentiated, and eˣ, which integrates cleanly.", skill: "Parts recognition" },
  { prompt: "Choose the best first method.", expression: "∫ 2x cos(x²) dx", choices: ["u-substitution", "Integration by parts", "Trig identity", "Improper integral"], answer: 0, explanation: "The derivative of x² is sitting beside cos(x²). Let u = x².", skill: "Substitution recognition" },
  { prompt: "Choose the best first method.", expression: "∫ sin²x dx", choices: ["Power-reduction identity", "Integration by parts", "Partial fractions", "Long division"], answer: 0, explanation: "A half-angle identity turns sin²x into an expression you can integrate term by term.", skill: "Trig identities" },
  { prompt: "Choose the best first method.", expression: "∫ 1/(x²−1) dx", choices: ["Partial fractions", "u-substitution", "Integration by parts", "Complete the square"], answer: 0, explanation: "The denominator factors as (x−1)(x+1), so partial fractions separates the rational expression.", skill: "Partial fractions" },
  { prompt: "Choose the best first method.", expression: "∫ √(9−x²) dx", choices: ["Trig substitution", "Integration by parts", "Partial fractions", "Comparison test"], answer: 0, explanation: "The pattern √(a²−x²) points to x = a sin θ.", skill: "Trig substitution" },
  { prompt: "Choose the best first method.", expression: "∫ ln x dx", choices: ["Integration by parts", "u-substitution", "Trig substitution", "Geometric series"], answer: 0, explanation: "Write ln x · 1 and differentiate the logarithm while integrating 1.", skill: "Parts recognition" },
  { prompt: "Choose the best first method.", expression: "∫ (3x+2)/(x²+4x+5) dx", choices: ["Split, then substitute", "Partial fractions only", "Trig identity", "Shell method"], answer: 0, explanation: "Part of the numerator matches the denominator's derivative; split off that part first.", skill: "Algebra before calculus" },
  { prompt: "Choose the best first method.", expression: "∫₀∞ e⁻ˣ dx", choices: ["Improper-integral limit", "Integration by parts", "Partial fractions", "Ratio test"], answer: 0, explanation: "The infinite bound must be replaced by a limit before evaluating.", skill: "Improper integrals" },
  { prompt: "Choose the best first method.", expression: "∫ sec³x dx", choices: ["Integration by parts", "u-substitution", "Long division", "Comparison test"], answer: 0, explanation: "A strategic integration by parts makes the original integral return, which lets you solve for it.", skill: "Canonical trig integral" },
  { prompt: "Choose the best first method.", expression: "∫ x/(x+1) dx", choices: ["Algebraic division", "Trig substitution", "Integration by parts", "Root test"], answer: 0, explanation: "Rewrite x/(x+1) as 1 − 1/(x+1) before integrating.", skill: "Algebra before calculus" },
];

export const readinessQuestions: Question[] = [
  { prompt: "Factor x² − 5x + 6.", choices: ["(x−2)(x−3)", "(x+2)(x+3)", "(x−1)(x−6)", "Prime"], answer: 0, explanation: "Two numbers that multiply to 6 and add to −5 are −2 and −3.", skill: "Algebra" },
  { prompt: "Simplify (x³x²)/x.", choices: ["x⁴", "x⁵", "x⁶", "x²"], answer: 0, explanation: "Add exponents when multiplying, then subtract one when dividing: 3+2−1=4.", skill: "Exponents" },
  { prompt: "What is the domain of 1/(x−4)?", choices: ["All real x except 4", "x > 4", "x ≥ 4", "All real x"], answer: 0, explanation: "The denominator cannot be zero, so x = 4 is excluded.", skill: "Functions" },
  { prompt: "Convert 3π/4 radians to degrees.", choices: ["135°", "90°", "120°", "225°"], answer: 0, explanation: "Multiply by 180°/π to get 135°.", skill: "Trigonometry" },
  { prompt: "If sin θ = 3/5 in quadrant I, what is cos θ?", choices: ["4/5", "3/4", "2/5", "−4/5"], answer: 0, explanation: "A 3–4–5 right triangle gives adjacent/hypotenuse = 4/5.", skill: "Trigonometry" },
  { prompt: "What does f(a+h) represent?", choices: ["The output at input a+h", "f(a)+f(h)", "A derivative", "A product"], answer: 0, explanation: "Function notation means substitute a+h for the input.", skill: "Functions" },
  { prompt: "Solve 2ˣ = 8.", choices: ["x = 3", "x = 4", "x = 6", "x = ½"], answer: 0, explanation: "8 = 2³, so x = 3.", skill: "Exponents" },
  { prompt: "Simplify ln(e⁵).", choices: ["5", "e⁵", "ln 5", "1"], answer: 0, explanation: "Natural log and e are inverse operations.", skill: "Logarithms" },
  { prompt: "The slope between (1,2) and (4,11) is…", choices: ["3", "9", "1/3", "4"], answer: 0, explanation: "(11−2)/(4−1)=9/3=3.", skill: "Coordinate algebra" },
  { prompt: "Which identity is correct?", choices: ["sin²x + cos²x = 1", "sin x + cos x = 1", "tan x = cos x/sin x", "sec x = sin x/cos x"], answer: 0, explanation: "The Pythagorean identity is sin²x + cos²x = 1.", skill: "Trigonometry" },
  { prompt: "As x approaches 2, x² approaches…", choices: ["4", "2", "0", "It does not exist"], answer: 0, explanation: "Polynomials are continuous, so substitute x=2.", skill: "Limits" },
  { prompt: "What does |x−3| < 2 mean?", choices: ["1 < x < 5", "x < 1 or x > 5", "−2 < x < 2", "x > 5"], answer: 0, explanation: "x is within 2 units of 3.", skill: "Inequalities" },
];

export const beeQuestions: Question[] = [
  ["∫ x² dx", ["x³/3 + C", "2x + C", "x³ + C", "x²/2 + C"], 0, "Power rule: raise the exponent and divide by the new exponent.", "Power rule"],
  ["∫ cos x dx", ["sin x + C", "−sin x + C", "tan x + C", "sec²x + C"], 0, "The derivative of sin x is cos x.", "Core antiderivatives"],
  ["∫ e²ˣ dx", ["½e²ˣ + C", "2e²ˣ + C", "e²ˣ + C", "eˣ² + C"], 0, "Reverse the chain rule by dividing by 2.", "Substitution"],
  ["∫ 1/x dx", ["ln|x| + C", "−1/x² + C", "x ln x + C", "eˣ + C"], 0, "This is the logarithmic antiderivative; absolute values preserve both sides of zero.", "Core antiderivatives"],
  ["∫ sec²x dx", ["tan x + C", "sec x + C", "cot x + C", "ln|sec x| + C"], 0, "The derivative of tan x is sec²x.", "Core antiderivatives"],
  ["∫ 2x(x²+1)⁴ dx", ["(x²+1)⁵/5 + C", "2(x²+1)⁵ + C", "(x²+1)⁴ + C", "x²(x²+1)⁵ + C"], 0, "Let u=x²+1, so du=2x dx.", "Substitution"],
  ["∫ x sin x dx", ["−x cos x + sin x + C", "x cos x − sin x + C", "−cos x + C", "x² cos x + C"], 0, "Use parts with u=x and dv=sin x dx.", "Integration by parts"],
  ["∫ tan x dx", ["−ln|cos x| + C", "ln|sin x| + C", "sec²x + C", "−cot x + C"], 0, "Write tan x as sin x/cos x and substitute u=cos x.", "Trig integrals"],
  ["∫₀¹ 3x² dx", ["1", "3", "1/3", "0"], 0, "An antiderivative is x³; evaluate from 0 to 1.", "Definite integrals"],
  ["∫ 1/(1+x²) dx", ["arctan x + C", "arcsin x + C", "ln(1+x²)+C", "−1/(1+x)+C"], 0, "This is the standard arctangent form.", "Inverse trig forms"],
  ["∫ csc x cot x dx", ["−csc x + C", "csc x + C", "cot x + C", "ln|csc x| + C"], 0, "The derivative of csc x is −csc x cot x.", "Core antiderivatives"],
  ["∫ ln x dx", ["x ln x − x + C", "1/x + C", "x ln x + C", "(ln x)²/2 + C"], 0, "Use parts with u=ln x and dv=dx.", "Integration by parts"],
  ["∫ sin(3x) dx", ["−cos(3x)/3 + C", "−3cos(3x)+C", "cos(3x)/3+C", "sin(3x)/3+C"], 0, "Reverse the chain rule and divide by 3.", "Substitution"],
  ["∫ (x+1)/(x²+2x+4) dx", ["½ln(x²+2x+4)+C", "ln(x+1)+C", "1/(x²+2x+4)+C", "arctan x+C"], 0, "The numerator is half the denominator's derivative.", "Substitution"],
  ["∫ sinh x dx", ["cosh x + C", "−cosh x + C", "tanh x + C", "sech²x + C"], 0, "The derivative of cosh x is sinh x.", "Hyperbolic functions"],
  ["∫ x/√(x²+4) dx", ["√(x²+4) + C", "2√(x²+4)+C", "ln|x²+4|+C", "x²/√(x²+4)+C"], 0, "Let u=x²+4; the factors of 2 cancel to produce √u.", "Substitution"],
  ["∫₁ᵉ 1/x dx", ["1", "e−1", "ln(e−1)", "0"], 0, "ln e − ln 1 = 1 − 0.", "Definite integrals"],
  ["∫ cos²x dx", ["x/2 + sin(2x)/4 + C", "sin²x/2+C", "x/2−sin(2x)/4+C", "tan x+C"], 0, "Use cos²x=(1+cos2x)/2.", "Trig identities"],
  ["∫ 1/(x²−1) dx", ["½ln|(x−1)/(x+1)|+C", "ln|x²−1|+C", "arctan x+C", "1/(2x)+C"], 0, "Partial fractions give ½/(x−1) − ½/(x+1).", "Partial fractions"],
  ["∫ sec³x dx", ["½sec x tan x + ½ln|sec x+tan x|+C", "sec x tan x+C", "tan²x/2+C", "ln|sec x|+C"], 0, "Integration by parts makes the original integral return; solve the resulting equation.", "Canonical trig integral"],
].map(([expression, choices, answer, explanation, skill]) => ({
  prompt: "Pick the antiderivative.", expression: expression as string,
  choices: choices as string[], answer: answer as number,
  explanation: explanation as string, skill: skill as string,
}));
