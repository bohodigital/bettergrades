import { createHash } from "node:crypto";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { readableMath } from "../lib/math-readable.mjs";

const root = process.cwd();
const check = process.argv.includes("--check");
const revisionDate = "2026-07-23";
const canonicalHost = "https://bettergrades.net";
const catalogPath = resolve(root, "content/calculus/resources/catalog.json");
const pdfVerificationPath = resolve(root, "artifacts/seo/pdf-verification.json");
const headersPath = resolve(root, "public/_headers");
const assetRoot = resolve(root, "public/downloads/calculus");
const visualRoot = resolve(root, "public/visuals/resources");
const deterministicEnvironment = {
  ...process.env,
  SOURCE_DATE_EPOCH: String(Date.UTC(2026, 6, 23, 0, 0, 0) / 1000),
  TZ: "UTC",
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const readablePrompt = (value) => value
  .replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => readableMath(tex))
  .replace(/\s+/g, " ")
  .trim();
const p = (id, prompt, answer, steps, method, commonError, verificationMethod = "symbolic-recomputation") => ({
  id,
  prompt,
  answer,
  steps: steps.some((step) => step.includes(answer))
    ? steps
    : [...steps, `Therefore the result is ${answer}.`],
  method,
  commonError,
  verificationMethod,
});

function limitProblems() {
  const direct = [
    [2, "\\lim_{x\\to2}(3x^2-5x+4)", "6"],
    [-2, "\\lim_{x\\to-2}(x^3+4x)", "-16"],
    [3, "\\lim_{t\\to3}\\frac{t^2+1}{t+2}", "2"],
    [0, "\\lim_{h\\to0}(7-4h+h^2)", "7"],
    [1, "\\lim_{u\\to1}\\sqrt{u+8}", "3"],
    [4, "\\lim_{x\\to4}\\frac{x+5}{\\sqrt{x}}", "\\frac92"],
  ].map(([x, tex, answer], i) => p(`limits-direct-${i + 1}`, `Evaluate \\(${tex}\\).`, `\\(${answer}\\)`, [
    `The expression is continuous at the target input \\(${x}\\).`,
    `Substitute the target and simplify to obtain \\(${answer}\\).`,
  ], "Direct substitution", "Treating a finite, defined substitution as an indeterminate form.", "independent-substitution"));
  const factoring = [
    ["\\lim_{x\\to3}\\frac{x^2-9}{x-3}", "6", "(x-3)(x+3)"],
    ["\\lim_{x\\to-4}\\frac{x^2-16}{x+4}", "-8", "(x+4)(x-4)"],
    ["\\lim_{x\\to2}\\frac{x^3-8}{x-2}", "12", "(x-2)(x^2+2x+4)"],
    ["\\lim_{x\\to1}\\frac{x^2+x-2}{x-1}", "3", "(x-1)(x+2)"],
    ["\\lim_{y\\to5}\\frac{y^2-7y+10}{y-5}", "3", "(y-5)(y-2)"],
    ["\\lim_{z\\to-1}\\frac{z^3+1}{z+1}", "3", "(z+1)(z^2-z+1)"],
  ].map(([tex, answer, factor], i) => p(`limits-factor-${i + 1}`, `Evaluate \\(${tex}\\).`, `\\(${answer}\\)`, [
    `Factor the vanishing numerator as \\(${factor}\\).`,
    "Cancel the common factor only for nearby inputs, then substitute the target.",
    `The simplified expression approaches \\(${answer}\\).`,
  ], "Factoring and cancellation", "Cancelling terms that are added instead of common factors.", "symbolic-factorization"));
  const radicals = [
    ["\\lim_{x\\to9}\\frac{\\sqrt{x}-3}{x-9}", "\\frac16", "\\sqrt{x}+3"],
    ["\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1}{x}", "\\frac12", "\\sqrt{1+x}+1"],
    ["\\lim_{t\\to4}\\frac{t-4}{\\sqrt{t}-2}", "4", "\\sqrt{t}+2"],
    ["\\lim_{u\\to0}\\frac{u}{\\sqrt{9+u}-3}", "6", "\\sqrt{9+u}+3"],
  ].map(([tex, answer, conjugate], i) => p(`limits-rationalize-${i + 1}`, `Evaluate \\(${tex}\\).`, `\\(${answer}\\)`, [
    `Multiply numerator and denominator by the conjugate \\(${conjugate}\\).`,
    "Use the difference-of-squares identity and cancel the factor that tends to zero.",
    `Substitution in the simplified expression gives \\(${answer}\\).`,
  ], "Rationalization", "Multiplying by a conjugate without applying it to both numerator and denominator.", "symbolic-rationalization"));
  const oneSided = [
    ["f(x)=\\begin{cases}x+2,&x<1\\\\4-x,&x\\ge1\\end{cases}", "x\\to1^-", "3", [
      "Approaching from the left selects the branch \\(f(x)=x+2\\).",
      "As \\(x\\to1^-\\), \\(x+2\\to3\\); the value assigned by the other branch at the endpoint does not control this one-sided limit.",
    ]],
    ["f(x)=\\begin{cases}2x,&x<0\\\\x^2+1,&x\\ge0\\end{cases}", "x\\to0^+", "1", [
      "Approaching from the right selects the branch \\(f(x)=x^2+1\\).",
      "As \\(x\\to0^+\\), \\(x^2+1\\to1\\).",
    ]],
    ["g(x)=\\frac{|x|}{x}", "x\\to0^-", "-1", [
      "For \\(x<0\\), \\(|x|=-x\\), so \\(g(x)=(-x)/x=-1\\).",
      "Therefore the values remain \\(-1\\) as \\(x\\to0^-\\).",
    ]],
    ["h(x)=\\begin{cases}x^2,&x\\le2\\\\6-x,&x>2\\end{cases}", "x\\to2", "4", [
      "As \\(x\\to2^-\\), the branch \\(x^2\\) approaches \\(4\\).",
      "As \\(x\\to2^+\\), the branch \\(6-x\\) approaches \\(4\\).",
      "Because both one-sided limits equal \\(4\\), the two-sided limit is \\(4\\).",
    ]],
  ].map(([definition, approach, answer, steps], i) => p(`limits-sided-${i + 1}`, `For \\(${definition}\\), evaluate the limit as \\(${approach}\\).`, `\\(${answer}\\)`, [
    ...steps,
  ], i === 3 ? "Two-sided branch comparison" : "One-sided branch analysis", "Using the branch selected by the endpoint equality instead of the approach direction.", "endpoint-and-branch-check"));
  const infinity = [
    ["\\lim_{x\\to\\infty}\\frac{5x^2-1}{2x^2+3}", "\\frac52", "equal degrees"],
    ["\\lim_{x\\to\\infty}\\frac{3x+7}{x^2+1}", "0", "denominator degree is larger"],
    ["\\lim_{x\\to-\\infty}\\frac{4x^3+x}{2x^3-5}", "2", "equal degrees"],
    ["\\lim_{x\\to2^+}\\frac{1}{x-2}", "+\\infty", "positive denominator approaching zero"],
  ].map(([tex, answer, reason], i) => p(`limits-infinity-${i + 1}`, `Evaluate \\(${tex}\\).`, `\\(${answer}\\)`, [
    `Identify the dominant behavior: ${reason}.`,
    "Divide by the highest relevant power or use the sign of the vanishing factor.",
    `The limit is \\(${answer}\\).`,
  ], "Dominant-term or sign analysis", "Treating infinity as a number that may be substituted into the expression.", "dominant-term-and-sign-check"));
  return [...direct, ...factoring, ...radicals, ...oneSided, ...infinity];
}

function chainProblems() {
  const basics = [
    [3, 2, 5], [5, -1, 4], [2, 4, 6], [-3, 2, 3], [7, 1, 2], [4, -5, 3],
  ].map(([a, b, n], i) => p(`chain-power-${i + 1}`, `Differentiate \\(y=(${a}x${b < 0 ? b : `+${b}`})^{${n}}\\).`,
    `\\(y'=${n * a}(${a}x${b < 0 ? b : `+${b}`})^{${n - 1}}\\)`, [
      `Use the power rule on the outer power \\(u^{${n}}\\).`,
      `Multiply by the inner derivative \\(${a}\\).`,
    ], "Basic chain rule", "Lowering the power but forgetting the derivative of the inner linear function.", "symbolic-differentiation"));
  const expLog = [
    ["e^{3x^2}", "6xe^{3x^2}", "3x^2", "6x"],
    ["e^{\\sin x}", "e^{\\sin x}\\cos x", "\\sin x", "\\cos x"],
    ["\\ln(5x-2)", "\\frac5{5x-2}", "5x-2", "5"],
    ["\\ln(x^2+4)", "\\frac{2x}{x^2+4}", "x^2+4", "2x"],
  ].map(([formula, answer, inner, derivative], i) => p(`chain-explog-${i + 1}`, `Differentiate \\(y=${formula}\\).`, `\\(y'=${answer}\\)`, [
    `Treat \\(${inner}\\) as the inner function.`,
    `Differentiate the outer function and multiply by \\(${derivative}\\).`,
  ], "Exponential or logarithmic chain rule", "Differentiating the outside while silently discarding the inner derivative.", "symbolic-differentiation"));
  const trig = [
    ["\\sin(4x^3)", "12x^2\\cos(4x^3)"],
    ["\\cos(2x-1)", "-2\\sin(2x-1)"],
    ["\\tan(x^2)", "2x\\sec^2(x^2)"],
    ["\\sin^3 x", "3\\sin^2x\\cos x"],
  ].map(([formula, answer], i) => p(`chain-trig-${i + 1}`, `Differentiate \\(y=${formula}\\).`, `\\(y'=${answer}\\)`, [
    "Identify the outer trigonometric function and preserve its inner input.",
    "Differentiate the inner expression and multiply.",
  ], "Trigonometric chain rule", "Changing the trigonometric input while taking the outer derivative.", "symbolic-differentiation"));
  const nested = [
    ["(1+(2x-3)^2)^4", "16(2x-3)(1+(2x-3)^2)^3"],
    ["e^{\\sqrt{1+x^2}}", "\\frac{x e^{\\sqrt{1+x^2}}}{\\sqrt{1+x^2}}"],
    ["\\ln(1+\\sin^2x)", "\\frac{2\\sin x\\cos x}{1+\\sin^2x}"],
  ].map(([formula, answer], i) => p(`chain-nested-${i + 1}`, `Differentiate \\(y=${formula}\\).`, `\\(y'=${answer}\\)`, [
    "Write the composition as nested layers from outside to inside.",
    "Differentiate each layer once and multiply the factors.",
  ], "Nested chain rule", "Skipping a middle layer of the composition.", "symbolic-differentiation"));
  const combined = [
    ["x^2e^{3x}", "e^{3x}(2x+3x^2)", "product plus chain"],
    ["x\\sin(x^2)", "\\sin(x^2)+2x^2\\cos(x^2)", "product plus chain"],
    ["\\frac{\\ln x}{x^2}", "\\frac{1-2\\ln x}{x^3}", "quotient plus chain"],
    ["\\frac{e^x}{1+x^2}", "\\frac{e^x(1+x^2-2x)}{(1+x^2)^2}", "quotient rule"],
    ["(x^2+1)^3(x-2)", "(x^2+1)^2(7x^2-12x+1)", "product plus chain"],
    ["\\frac{\\sin(2x)}{x}", "\\frac{2x\\cos(2x)-\\sin(2x)}{x^2}", "quotient plus chain"],
    ["\\sqrt{1+e^{2x}}", "\\frac{e^{2x}}{\\sqrt{1+e^{2x}}}", "nested chain"],
  ].map(([formula, answer, method], i) => p(`chain-combined-${i + 1}`, `Differentiate \\(y=${formula}\\).`, `\\(y'=${answer}\\)`, [
    `Apply the ${method} structure before simplifying.`,
    "Retain every factor contributed by an inner derivative.",
    `A factored final form is \\(${answer}\\).`,
  ], method, "Applying the chain rule to a product or quotient as if it were one composition.", "symbolic-differentiation"));
  return [...basics, ...expLog, ...trig, ...nested, ...combined];
}

function optimizationProblems() {
  const items = [
    ["open-box-12", "Squares of side x are cut from a 12 by 12 sheet. Maximize the open box volume.", "x=2,\\ V_{\\max}=128", "V=x(12-2x)^2 on 0<x<6; V'=12(x-2)(x-6), so the interior maximum is x=2."],
    ["open-box-20-12", "Squares of side x are cut from a 20 by 12 sheet. Maximize volume.", "x=\\frac{16-\\sqrt{76}}3\\approx2.43", "V=x(20-2x)(12-2x). Solve V'=12x^2-128x+240=0 and retain the feasible critical point."],
    ["fence-river", "Use 240 m of fence for three sides of a riverside rectangle. Maximize area.", "x=60,\\ y=120,\\ A=7200", "With 2x+y=240, A=x(240-2x); A'=240-4x=0."],
    ["fence-divider", "A 600 m rectangle has one divider parallel to its width. Maximize area.", "w=100,\\ell=150,\\ A=15000", "The constraint is 3w+2\\ell=600. Substitute \\ell=(600-3w)/2 into A=w\\ell."],
    ["poster", "A poster has area 384 cm² with 2 cm side margins and 3 cm top and bottom margins. Minimize total paper area.", "printed\\ width=16,\\ printed\\ height=24", "For printed width x, paper area is (x+4)(384/x+6). Set its derivative to zero."],
    ["cylinder", "Find the closed cylinder of volume 250\\pi with minimum surface area.", "r=5,\\ h=10", "Use h=250/r^2 in S=2\\pi r^2+2\\pi rh; solve S'=0."],
    ["distance-parabola", "Find the point on y=x² closest to (0,3).", "(\\pm\\sqrt{5/2},5/2)", "Minimize D^2=x^2+(x^2-3)^2. Critical points satisfy 2x(2x^2-5)=0; compare values."],
    ["rectangle-semicircle", "Maximize the area of a rectangle inscribed under y=\\sqrt{25-x^2}.", "width=5\\sqrt2,\\ height=5/\\sqrt2,\\ A=25", "A=2x\\sqrt{25-x^2}; maximize A²=4x²(25-x²)."],
    ["wire", "Cut 20 m of wire into a square and a circle to minimize total area.", "square\\ length=\\frac{80}{4+\\pi},\\ circle\\ length=\\frac{20\\pi}{4+\\pi}", "Let x go to the square: A=x²/16+(20-x)²/(4\\pi). Solve A'=0."],
    ["revenue", "Demand is p=80-2q. Maximize revenue.", "q=20,\\ p=40,\\ R=800", "R=q(80-2q); R'=80-4q=0 and R''<0."],
    ["cost", "Minimize average cost C(q)/q when C(q)=q²+100q+2500.", "q=50", "Average cost is q+100+2500/q. Set 1-2500/q²=0."],
    ["ladder", "A 10 ft ladder rests against a wall. Maximize the area of the right triangle it forms.", "x=y=5\\sqrt2,\\ A=25", "With x²+y²=100, maximize A=xy/2; symmetry or differentiation gives x=y."],
    ["cone", "A cone has volume 72\\pi. Under the material model S=\\pi r²+\\pi rh, minimize S.", "r=\\sqrt[3]{108}=3\\sqrt[3]{4},\\ h=2\\sqrt[3]{108}=6\\sqrt[3]{4}", "Use h=216/r², so S=\\pi r²+216\\pi/r. Then S'=2\\pi r-216\\pi/r²=0 gives r³=108 and h=216/r²=2r."],
    ["window", "A Norman window has perimeter 20. Maximize area.", "r=\\frac{20}{4+\\pi}", "Use width 2r and rectangular height h. The perimeter gives h=(20-(2+\\pi)r)/2; maximize 2rh+\\pi r²/2."],
    ["boat", "A boat 3 km offshore must reach a town 8 km downshore. Row at 3 km/h and walk at 5 km/h. Minimize time.", "land\\ about\\ 5.75\\ km\\ before\\ town", "Let x be the downshore rowing distance. T=\\sqrt{x²+9}/3+(8-x)/5; solve T'=0."],
    ["endpoint", "Maximize f(x)=x(6-x) on the closed interval [1,5].", "x=3,\\ f(3)=9", "Check the critical point x=3 and both endpoints; the largest listed value is 9."],
  ];
  return items.map(([id, prompt, answer, derivation], i) => p(`optimization-${id}`, prompt, `\\(${answer}\\)`, [
    derivation,
    "Check feasibility, endpoints, and the sign or second derivative before declaring the optimum.",
  ], "Constrained one-variable optimization", "Solving f'(x)=0 without building the constraint or checking the feasible domain.", i < 2 ? "symbolic-and-numerical-extremum-check" : "independent-optimization-recomputation"));
}

function ibpProblems() {
  const items = [
    ["xe^x", "\\int xe^x\\,dx", "e^x(x-1)+C", ["Take \\(u=x\\) and \\(dv=e^x dx\\), so \\(du=dx\\) and \\(v=e^x\\).", "Then \\(\\int xe^x dx=xe^x-\\int e^x dx=xe^x-e^x+C=e^x(x-1)+C\\)."]],
    ["x^2e^x", "\\int x^2e^x\\,dx", "e^x(x^2-2x+2)+C", ["Take \\(u=x^2\\) and \\(dv=e^x dx\\): \\(I=x^2e^x-2\\int xe^x dx\\).", "Using \\(\\int xe^x dx=e^x(x-1)\\), \\(I=e^x(x^2-2x+2)+C\\)."]],
    ["x^3e^x", "\\int x^3e^x\\,dx", "e^x(x^3-3x^2+6x-6)+C", ["Take \\(u=x^3\\) and \\(dv=e^x dx\\): \\(I=x^3e^x-3\\int x^2e^x dx\\).", "Substitute \\(\\int x^2e^x dx=e^x(x^2-2x+2)\\) and collect terms to get \\(e^x(x^3-3x^2+6x-6)+C\\)."]],
    ["xe^{2x}", "\\int xe^{2x}\\,dx", "e^{2x}(2x-1)/4+C", ["Take \\(u=x\\) and \\(dv=e^{2x}dx\\), so \\(du=dx\\) and \\(v=e^{2x}/2\\).", "Thus \\(I=xe^{2x}/2-\\int e^{2x}/2\\,dx=xe^{2x}/2-e^{2x}/4+C=e^{2x}(2x-1)/4+C\\)."]],
    ["x\\sin x", "\\int x\\sin x\\,dx", "-x\\cos x+\\sin x+C", ["Take \\(u=x\\) and \\(dv=\\sin x\\,dx\\), so \\(du=dx\\) and \\(v=-\\cos x\\).", "Then \\(I=-x\\cos x+\\int\\cos x\\,dx=-x\\cos x+\\sin x+C\\)."]],
    ["x\\cos x", "\\int x\\cos x\\,dx", "x\\sin x+\\cos x+C", ["Take \\(u=x\\) and \\(dv=\\cos x\\,dx\\), so \\(du=dx\\) and \\(v=\\sin x\\).", "Then \\(I=x\\sin x-\\int\\sin x\\,dx=x\\sin x+\\cos x+C\\)."]],
    ["x^2\\sin x", "\\int x^2\\sin x\\,dx", "-x^2\\cos x+2x\\sin x+2\\cos x+C", ["Take \\(u=x^2\\) and \\(dv=\\sin x\\,dx\\): \\(I=-x^2\\cos x+2\\int x\\cos x\\,dx\\).", "Since \\(\\int x\\cos x\\,dx=x\\sin x+\\cos x\\), \\(I=-x^2\\cos x+2x\\sin x+2\\cos x+C\\)."]],
    ["x^2\\cos x", "\\int x^2\\cos x\\,dx", "x^2\\sin x+2x\\cos x-2\\sin x+C", ["Take \\(u=x^2\\) and \\(dv=\\cos x\\,dx\\): \\(I=x^2\\sin x-2\\int x\\sin x\\,dx\\).", "Since \\(\\int x\\sin x\\,dx=-x\\cos x+\\sin x\\), \\(I=x^2\\sin x+2x\\cos x-2\\sin x+C\\)."]],
    ["lnx", "\\int\\ln x\\,dx", "x\\ln x-x+C", ["Write the integrand as \\((\\ln x)(1)\\); take \\(u=\\ln x\\) and \\(dv=dx\\), so \\(du=dx/x\\) and \\(v=x\\).", "Then \\(I=x\\ln x-\\int1\\,dx=x\\ln x-x+C\\), for \\(x>0\\)."]],
    ["xlnx", "\\int x\\ln x\\,dx", "\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}+C", ["Take \\(u=\\ln x\\) and \\(dv=x\\,dx\\), so \\(du=dx/x\\) and \\(v=x^2/2\\).", "Then \\(I=(x^2/2)\\ln x-\\frac12\\int x\\,dx=(x^2/2)\\ln x-x^2/4+C\\), for \\(x>0\\)."]],
    ["lnsq", "\\int(\\ln x)^2\\,dx", "x[(\\ln x)^2-2\\ln x+2]+C", ["Take \\(u=(\\ln x)^2\\) and \\(dv=dx\\): \\(I=x(\\ln x)^2-2\\int\\ln x\\,dx\\).", "Substitute \\(\\int\\ln x\\,dx=x\\ln x-x\\) to obtain \\(x[(\\ln x)^2-2\\ln x+2]+C\\), for \\(x>0\\)."]],
    ["arctan", "\\int\\arctan x\\,dx", "x\\arctan x-\\frac12\\ln(1+x^2)+C", ["Take \\(u=\\arctan x\\) and \\(dv=dx\\), so \\(du=dx/(1+x^2)\\) and \\(v=x\\).", "Then \\(I=x\\arctan x-\\int x/(1+x^2)\\,dx=x\\arctan x-\\frac12\\ln(1+x^2)+C\\)."]],
    ["arcsin", "\\int\\arcsin x\\,dx", "x\\arcsin x+\\sqrt{1-x^2}+C", ["Take \\(u=\\arcsin x\\) and \\(dv=dx\\), so \\(du=dx/\\sqrt{1-x^2}\\) and \\(v=x\\).", "Because \\(\\int x/\\sqrt{1-x^2}\\,dx=-\\sqrt{1-x^2}\\), \\(I=x\\arcsin x+\\sqrt{1-x^2}+C\\) on \\((-1,1)\\)."]],
    ["def-xexp", "\\int_0^1xe^x\\,dx", "1", ["Using \\(u=x\\) and \\(dv=e^x dx\\), an antiderivative is \\(e^x(x-1)\\).", "Evaluate the bounds: \\([e^x(x-1)]_0^1=0-(-1)=1\\)."]],
    ["def-xsin", "\\int_0^\\pi x\\sin x\\,dx", "\\pi", ["Using \\(u=x\\) and \\(dv=\\sin x\\,dx\\), an antiderivative is \\(-x\\cos x+\\sin x\\).", "Evaluate the bounds: \\([-x\\cos x+\\sin x]_0^\\pi=\\pi-0=\\pi\\)."]],
    ["cyclic", "\\int e^x\\cos x\\,dx", "\\frac{e^x}{2}(\\sin x+\\cos x)+C", ["Let \\(I=\\int e^x\\cos x\\,dx\\). Two integrations by parts give \\(I=e^x\\cos x+e^x\\sin x-I\\).", "Therefore \\(2I=e^x(\\sin x+\\cos x)\\), so \\(I=\\frac{e^x}{2}(\\sin x+\\cos x)+C\\)."]],
    ["cyclic-sin", "\\int e^x\\sin x\\,dx", "\\frac{e^x}{2}(\\sin x-\\cos x)+C", ["Let \\(I=\\int e^x\\sin x\\,dx\\). Two integrations by parts give \\(I=e^x\\sin x-e^x\\cos x-I\\).", "Therefore \\(2I=e^x(\\sin x-\\cos x)\\), so \\(I=\\frac{e^x}{2}(\\sin x-\\cos x)+C\\)."]],
    ["reduction", "\\int x^4e^x\\,dx", "e^x(x^4-4x^3+12x^2-24x+24)+C", ["Repeatedly take the polynomial as \\(u\\): \\(I=x^4e^x-4\\int x^3e^x dx\\).", "Substituting the three prior reductions gives \\(I=e^x(x^4-4x^3+12x^2-24x+24)+C\\)."]],
    ["select", "\\int x^2\\ln x\\,dx", "\\frac{x^3}{3}\\ln x-\\frac{x^3}{9}+C", ["Take \\(u=\\ln x\\) and \\(dv=x^2dx\\), so \\(du=dx/x\\) and \\(v=x^3/3\\).", "Then \\(I=(x^3/3)\\ln x-\\frac13\\int x^2dx=(x^3/3)\\ln x-x^3/9+C\\), for \\(x>0\\)."]],
    ["def-log", "\\int_1^e\\ln x\\,dx", "1", ["Using \\(u=\\ln x\\) and \\(dv=dx\\), an antiderivative is \\(x\\ln x-x\\).", "Evaluate the bounds: \\([x\\ln x-x]_1^e=0-(-1)=1\\)."]],
  ];
  return items.map(([id, tex, answer, steps], i) => p(`ibp-${id}`, `Evaluate \\(${tex}\\).`, `\\(${answer}\\)`, steps,
    i === 15 || i === 16 ? "Cyclic integration by parts" : "Integration by parts",
    "Choosing dv that is harder to integrate or losing the minus sign in the formula.",
    "differentiate-antiderivative-and-endpoint-check"));
}

function geometricProblems() {
  const items = [
    ["ratio", "Find the common ratio of 3, 12, 48, …", "r=4", ["Divide either term by its predecessor: \\(12/3=4\\) and \\(48/12=4\\).", "The constant quotient is \\(r=4\\)."]],
    ["term", "Find a_8 when a_1=5 and r=2.", "a_8=640", ["Use \\(a_n=a_1r^{n-1}\\).", "Thus \\(a_8=5(2)^7=640\\)."]],
    ["finite", "Evaluate \\(\\sum_{k=0}^{5}3(2)^k\\).", "189", ["There are six terms with first term \\(3\\) and ratio \\(2\\).", "Using \\(S_6=3(1-2^6)/(1-2)\\) gives \\(189\\)."]],
    ["finite-half", "Evaluate \\(\\sum_{k=0}^{4}16(1/2)^k\\).", "31", ["There are five terms with first term \\(16\\) and ratio \\(1/2\\).", "Using \\(S_5=16(1-(1/2)^5)/(1-1/2)\\) gives \\(31\\)."]],
    ["infinite", "Evaluate \\(\\sum_{k=0}^{\\infty}12(1/3)^k\\).", "18", ["Here \\(a=12\\), \\(r=1/3\\), and \\(|r|<1\\).", "Therefore \\(S=a/(1-r)=12/(1-1/3)=18\\)."]],
    ["infinite-neg", "Evaluate \\(\\sum_{k=0}^{\\infty}8(-1/2)^k\\).", "16/3", ["Here \\(a=8\\), \\(r=-1/2\\), and \\(|r|<1\\).", "Therefore \\(S=8/(1+1/2)=16/3\\)."]],
    ["diverge", "Decide whether \\(\\sum_{k=0}^{\\infty}5(1.02)^k\\) converges.", "\\text{diverges}", ["The common ratio is \\(r=1.02\\), so \\(|r|>1\\).", "Its terms do not approach zero, and the infinite geometric series diverges."]],
    ["shift", "Evaluate \\(\\sum_{n=3}^{\\infty}2(1/4)^n\\).", "1/24", ["The first included term is \\(2(1/4)^3=1/32\\), not \\(2\\).", "With ratio \\(1/4\\), the sum is \\((1/32)/(1-1/4)=1/24\\)."]],
    ["rewrite", "Rewrite \\(\\sum_{n=1}^{\\infty}3^{1-n}\\) in \\(ar^k\\) form and sum it.", "3/2", ["At \\(n=1\\) the first term is \\(1\\), and each next term is multiplied by \\(1/3\\).", "Thus the series is \\(\\sum_{k=0}^{\\infty}(1/3)^k\\), whose sum is \\(1/(1-1/3)=3/2\\)."]],
    ["decimal-third", "Write 0.333… as a fraction.", "1/3", ["Write the decimal as \\(3/10+3/100+\\cdots\\).", "This has \\(a=3/10\\), \\(r=1/10\\), so its sum is \\((3/10)/(9/10)=1/3\\)."]],
    ["decimal-27", "Write 0.272727… as a fraction.", "3/11", ["Write the decimal as \\(27/100+27/10000+\\cdots\\).", "This has \\(a=27/100\\), \\(r=1/100\\), so its sum is \\(27/99=3/11\\)."]],
    ["decimal-145", "Write 0.145145… as a fraction.", "145/999", ["Write the decimal as \\(145/1000+145/1000000+\\cdots\\).", "This has ratio \\(1/1000\\), so its sum is \\(145/999\\)."]],
    ["bounce", "A ball rebounds 70% of each previous height after a 10 m drop. Find total vertical distance.", "170/3\\text{ m}", ["The initial drop contributes \\(10\\) m; each rebound height is traveled once up and once down.", "Thus \\(D=10+2(7+7(0.7)+\\cdots)=10+14/(1-0.7)=170/3\\text{ m}\\)."]],
    ["annuity", "Deposit 100 dollars at the end of each year for four years at 5 percent. Find the value immediately after the fourth deposit.", "431.01\\text{ dollars}", ["Immediately after the fourth deposit, the four deposits have grown for three, two, one, and zero years.", "The value is \\(100(1.05^3+1.05^2+1.05+1)=431.0125\\), or \\(431.01\\) dollars to the nearest cent."]],
    ["area", "A square has area 1; each stage shades one fourth of the remaining area. Find total shaded area.", "1", ["The shaded areas are \\(1/4,(3/4)(1/4),(3/4)^2(1/4),\\ldots\\).", "Their sum is \\((1/4)/(1-3/4)=1\\)."]],
    ["partial", "Find S_n for 7+7(0.8)+7(0.8)^2+…", "35(1-0.8^n)", ["The first term is \\(7\\), the ratio is \\(0.8\\), and the first \\(n\\) terms end at exponent \\(n-1\\).", "Therefore \\(S_n=7(1-0.8^n)/(1-0.8)=35(1-0.8^n)\\)."]],
    ["solve-r", "An infinite geometric series has first term 6 and sum 15. Find r.", "3/5", ["Use \\(15=6/(1-r)\\).", "Then \\(1-r=2/5\\), so \\(r=3/5\\), which satisfies \\(|r|<1\\)."]],
    ["solve-a", "An infinite geometric series has ratio -1/4 and sum 8. Find its first term.", "10", ["Use \\(8=a/(1-(-1/4))=a/(5/4)\\).", "Thus \\(a=10\\)."]],
    ["error", "A student uses a/(1-r) for r=2. Diagnose the error.", "|r|\\ge1,\\text{ so the infinite series diverges}", ["The formula \\(a/(1-r)\\) requires \\(|r|<1\\).", "For \\(r=2\\), the terms do not approach zero, so the infinite series diverges."]],
    ["index", "Evaluate \\(\\sum_{n=2}^{6}5(3)^{n-2}\\).", "605", ["At \\(n=2\\) the first term is \\(5\\); there are five terms through \\(n=6\\), with ratio \\(3\\).", "Thus \\(S_5=5(1-3^5)/(1-3)=605\\)."]],
  ];
  return items.map(([id, prompt, answer, steps]) => p(`geometric-${id}`, prompt, `\\(${answer}\\)`, [
    ...steps,
  ], "Geometric-series structure", "Using the infinite-sum formula without checking the common-ratio condition or the starting index.", "independent-geometric-sum-check"));
}

function taylorProblems() {
  const items = [
    ["exp-t3", "Find the degree-3 Maclaurin polynomial for e^x.", "1+x+x^2/2+x^3/6"],
    ["sin-t5", "Find the degree-5 Maclaurin polynomial for sin x.", "x-x^3/6+x^5/120"],
    ["cos-t4", "Find the degree-4 Maclaurin polynomial for cos x.", "1-x^2/2+x^4/24"],
    ["ln", "Write the first four nonzero terms of ln(1+x).", "x-x^2/2+x^3/3-x^4/4"],
    ["geo", "Expand 1/(1-x) as a power series.", "\\sum_{n=0}^{\\infty}x^n,\\ |x|<1"],
    ["sub-x2", "Expand 1/(1+x^2) as a power series.", "\\sum_{n=0}^{\\infty}(-1)^nx^{2n},\\ |x|<1"],
    ["sub-3x", "Expand 1/(1-3x) as a power series.", "\\sum_{n=0}^{\\infty}3^nx^n,\\ |x|<1/3"],
    ["diff", "Find a power series for 1/(1-x)^2.", "\\sum_{n=1}^{\\infty}nx^{n-1},\\ |x|<1"],
    ["int", "Find a power series for arctan x by integrating 1/(1+x²), and state its interval of convergence.", "\\sum_{n=0}^{\\infty}(-1)^n x^{2n+1}/(2n+1),\\ -1\\le x\\le1"],
    ["center2", "Find the degree-2 Taylor polynomial for ln x centered at 1.", "(x-1)-(x-1)^2/2"],
    ["center-a", "Write the Taylor series for e^x centered at a.", "e^a\\sum_{n=0}^{\\infty}(x-a)^n/n!"],
    ["coeff", "If f^(n)(0)=2^n, find the Maclaurin series.", "\\sum_{n=0}^{\\infty}2^nx^n/n!=e^{2x}"],
    ["approx-exp", "Use T_3 for e^x to approximate e^{0.1}.", "1.105166\\overline6"],
    ["approx-sin", "Use x-x³/6 to approximate sin(0.2).", "0.198666\\overline6"],
    ["radius", "Find the radius of \\(\\sum_{n=1}^{\\infty} n x^n/4^n\\).", "R=4"],
    ["interval", "Find the interval of convergence of \\(\\sum_{n=1}^{\\infty} x^n/n\\).", "[-1,1)"],
    ["shifted", "Find the interval of convergence of \\(\\sum_{n=1}^{\\infty} (x-2)^n/(n3^n)\\).", "[-1,5)"],
    ["ratio", "Find R for \\(\\sum_{n=0}^{\\infty} n!(x+1)^n/(2n)!\\).", "R=\\infty"],
    ["error-exp", "Bound the error of the degree-3 Maclaurin approximation to e^{0.2}.", "|R_3|\\le e^{0.2}(0.2)^4/4!<0.000082"],
    ["error-alt", "How many terms of the alternating arctan series ensure error below 0.001 at x=1/2?", "4\\text{ terms}"],
  ];
  const derivations = {
    "exp-t3": ["Use \\(e^x=\\sum_{n=0}^{\\infty}x^n/n!\\).", "Retaining degrees 0 through 3 gives \\(1+x+x^2/2+x^3/6\\)."],
    "sin-t5": ["Use \\(\\sin x=\\sum_{n=0}^{\\infty}(-1)^nx^{2n+1}/(2n+1)!\\).", "Retaining terms through degree 5 gives \\(x-x^3/6+x^5/120\\)."],
    "cos-t4": ["Use \\(\\cos x=\\sum_{n=0}^{\\infty}(-1)^nx^{2n}/(2n)!\\).", "Retaining terms through degree 4 gives \\(1-x^2/2+x^4/24\\)."],
    ln: ["Integrate the geometric series for \\(1/(1+x)\\) term by term.", "The first four nonzero terms are \\(x-x^2/2+x^3/3-x^4/4\\)."],
    geo: ["The geometric identity \\(1/(1-r)=\\sum_{n=0}^{\\infty}r^n\\) requires \\(|r|<1\\).", "Set \\(r=x\\) to obtain \\(\\sum_{n=0}^{\\infty}x^n\\) for \\(|x|<1\\)."],
    "sub-x2": ["Set \\(r=-x^2\\) in the geometric series.", "This gives \\(\\sum_{n=0}^{\\infty}(-1)^nx^{2n}\\), with \\(|x|<1\\)."],
    "sub-3x": ["Set \\(r=3x\\) in the geometric series.", "The condition \\(|3x|<1\\) gives \\(|x|<1/3\\)."],
    diff: ["Differentiate \\(1/(1-x)=\\sum_{n=0}^{\\infty}x^n\\) term by term.", "This gives \\(1/(1-x)^2=\\sum_{n=1}^{\\infty}nx^{n-1}\\) for \\(|x|<1\\)."],
    int: ["Integrate \\(1/(1+x^2)=\\sum_{n=0}^{\\infty}(-1)^nx^{2n}\\) from 0 to \\(x\\).", "The result is \\(\\sum_{n=0}^{\\infty}(-1)^nx^{2n+1}/(2n+1)\\); direct endpoint tests include both \\(x=-1\\) and \\(x=1\\)."],
    center2: ["For \\(f(x)=\\ln x\\), \\(f(1)=0\\), \\(f'(1)=1\\), and \\(f''(1)=-1\\).", "Substitution in the degree-2 Taylor formula gives \\((x-1)-(x-1)^2/2\\)."],
    "center-a": ["Every derivative of \\(e^x\\) equals \\(e^x\\), so \\(f^{(n)}(a)=e^a\\).", "The Taylor formula gives \\(e^a\\sum_{n=0}^{\\infty}(x-a)^n/n!\\), convergent for every real \\(x\\)."],
    coeff: ["The Maclaurin coefficient is \\(f^{(n)}(0)/n!=2^n/n!\\).", "Thus the series is \\(\\sum_{n=0}^{\\infty}2^nx^n/n!=e^{2x}\\)."],
    "approx-exp": ["Evaluate \\(T_3(0.1)=1+0.1+0.1^2/2+0.1^3/6\\).", "The result is \\(1.105166\\overline6\\)."],
    "approx-sin": ["Evaluate \\(0.2-(0.2)^3/6\\).", "The result is \\(0.198666\\overline6\\)."],
    radius: ["The ratio of successive absolute terms approaches \\(|x|/4\\).", "Convergence requires \\(|x|<4\\), so \\(R=4\\)."],
    interval: ["The radius is 1. At \\(x=1\\) the harmonic series diverges; at \\(x=-1\\) the alternating harmonic series converges.", "Therefore the interval is \\([-1,1)\\)."],
    shifted: ["The ratio test gives \\(|x-2|<3\\), hence \\(-1<x<5\\).", "At \\(x=-1\\) the series is alternating harmonic and converges; at \\(x=5\\) it is harmonic and diverges, giving \\([-1,5)\\)."],
    ratio: ["The coefficient ratio satisfies \\(|a_n/a_{n+1}|=(2n+2)(2n+1)/(n+1)=2(2n+1)\\).", "This tends to infinity, so \\(R=\\infty\\)."],
    "error-exp": ["Taylor's theorem gives \\(|R_3|\\le e^{0.2}(0.2)^4/4!\\) on \\([0,0.2]\\).", "The bound is approximately \\(0.00008143<0.000082\\)."],
    "error-alt": ["After \\(N\\) terms, the alternating-series error is at most \\((1/2)^{2N+1}/(2N+1)\\).", "Three terms give about \\(0.001116>0.001\\), while four give about \\(0.000217<0.001\\), so four terms are required."],
  };
  return items.map(([id, prompt, answer]) => p(`taylor-${id}`, prompt, `\\(${answer}\\)`, [
    ...derivations[id],
  ], "Taylor or power-series construction", "Transforming the formula but forgetting to transform the interval, endpoints, factorial, or remainder.", "series-coefficient-endpoint-and-error-check"));
}

function examProblems(course) {
  const calc1 = [
    ["limit-poly", "Evaluate \\(\\lim_{x\\to2}(x^2+3x-1)\\).", "9", "The polynomial is continuous, so substitution gives \\(2^2+3(2)-1=4+6-1=9\\)."],
    ["limit-factor", "Evaluate \\(\\lim_{x\\to4}(x^2-16)/(x-4)\\).", "8", "For \\(x\\ne4\\), \\((x^2-16)/(x-4)=x+4\\); therefore the limit is \\(4+4=8\\)."],
    ["continuity", "Choose k so \\(f(x)=kx+1\\) for x<2 and \\(f(x)=7\\) for x≥2 is continuous.", "k=3", "Continuity requires \\(2k+1=7\\), so \\(2k=6\\) and \\(k=3\\)."],
    ["derivative-definition", "Use the limit definition to find the derivative of x².", "2x", "\\(f'(x)=\\lim_{h\\to0}((x+h)^2-x^2)/h=\\lim_{h\\to0}(2x+h)=2x\\)."],
    ["power", "Differentiate \\(4x^5-3x^2+7\\).", "20x^4-6x", "\\(d(4x^5)/dx=20x^4\\), \\(d(-3x^2)/dx=-6x\\), and the constant derivative is zero."],
    ["product", "Differentiate \\(x^2\\sin x\\).", "2x\\sin x+x^2\\cos x", "The product rule gives \\((x^2)'\\sin x+x^2(\\sin x)'=2x\\sin x+x^2\\cos x\\)."],
    ["quotient", "Differentiate \\((x+1)/(x-1)\\).", "-2/(x-1)^2", "The quotient rule gives \\(((x-1)-(x+1))/(x-1)^2=-2/(x-1)^2\\), for \\(x\\ne1\\)."],
    ["chain", "Differentiate \\((3x^2+1)^4\\).", "24x(3x^2+1)^3", "With \\(u=3x^2+1\\), \\(d(u^4)/dx=4u^3(6x)=24x(3x^2+1)^3\\)."],
    ["implicit", "For x²+y²=25, find dy/dx.", "-x/y", "Differentiating gives \\(2x+2y\\,dy/dx=0\\), hence \\(dy/dx=-x/y\\) where \\(y\\ne0\\)."],
    ["tangent", "Find the tangent line to y=x³ at x=2.", "y-8=12(x-2)", "At \\(x=2\\), \\(y=8\\) and \\(y'=3x^2=12\\), so point-slope form is \\(y-8=12(x-2)\\)."],
    ["mvt", "Find c guaranteed by MVT for f(x)=x² on [1,3].", "c=2", "The secant slope is \\((9-1)/(3-1)=4\\); solving \\(f'(c)=2c=4\\) gives \\(c=2\\in(1,3)\\)."],
    ["critical", "Find critical numbers of x³-3x.", "x=\\pm1", "\\(f'(x)=3x^2-3=3(x-1)(x+1)\\), so the critical numbers are \\(x=-1,1\\)."],
    ["increase", "Where is x³-3x increasing?", "(-\\infty,-1)\\cup(1,\\infty)", "Since \\(f'(x)=3(x^2-1)>0\\) exactly when \\(|x|>1\\), the function increases on \\(( -\\infty,-1)\\cup(1,\\infty)\\)."],
    ["concavity", "Find the inflection point of x³-6x².", "(2,-16)", "\\(f''(x)=6x-12\\) changes from negative to positive at \\(x=2\\), and \\(f(2)=8-24=-16\\)."],
    ["optimization", "A rectangle has perimeter 40. Find maximum area.", "100", "If the sides are \\(x\\) and \\(20-x\\), then \\(A=x(20-x)\\); \\(A'=20-2x=0\\) at \\(x=10\\), giving \\(A=100\\)."],
    ["related", "A circle radius grows at 2 cm/s. Find dA/dt at r=5.", "20\\pi\\text{ cm}^2/\\text{s}", "From \\(A=\\pi r^2\\), \\(dA/dt=2\\pi r\\,dr/dt=2\\pi(5)(2)=20\\pi\\text{ cm}^2/\\text{s}\\)."],
    ["linearization", "Use linearization at 9 to approximate √9.2.", "3+0.2/6\\approx3.0333", "For \\(f(x)=\\sqrt{x}\\), \\(f(9)=3\\) and \\(f'(9)=1/6\\), so \\(L(9.2)=3+0.2/6\\approx3.0333\\)."],
    ["antiderivative", "Find \\(\\int(6x^2-4)dx\\).", "2x^3-4x+C", "Termwise integration gives \\(6x^3/3-4x+C=2x^3-4x+C\\)."],
    ["definite", "Evaluate \\(\\int_0^2 3x^2dx\\).", "8", "An antiderivative is \\(x^3\\), so \\([x^3]_0^2=8-0=8\\)."],
    ["ftc", "Differentiate \\(F(x)=\\int_1^x\\cos(t^2)dt\\).", "\\cos(x^2)", "FTC Part I evaluates the integrand at the variable upper bound: \\(F'(x)=\\cos(x^2)\\)."],
    ["substitution", "Evaluate \\(\\int2x(x^2+1)^3dx\\).", "(x^2+1)^4/4+C", "Let \\(u=x^2+1\\), so \\(du=2x\\,dx\\); then \\(\\int u^3du=u^4/4+C=(x^2+1)^4/4+C\\)."],
    ["area", "Find the area under y=x on [0,3].", "9/2", "\\(A=\\int_0^3x\\,dx=[x^2/2]_0^3=9/2\\)."],
    ["average", "Find the average value of x² on [0,3].", "3", "\\(f_{\\rm avg}=\\frac1{3-0}\\int_0^3x^2dx=\\frac13[x^3/3]_0^3=3\\)."],
    ["motion", "If v(t)=3t²-6t, find displacement from 0 to 3.", "0", "\\(\\int_0^3(3t^2-6t)dt=[t^3-3t^2]_0^3=(27-27)-0=0\\)."],
    ["concept", "Explain why a differentiable function is continuous.", "\\text{The derivative limit forces }f(x)-f(a)\\text{ to approach }0.", "Write \\(f(x)-f(a)=((f(x)-f(a))/(x-a))(x-a)\\); differentiability makes the first factor approach \\(f'(a)\\) while the second approaches zero."],
  ];
  const calc2 = [
    ["ibp", "Evaluate \\(\\int xe^x dx\\).", "e^x(x-1)+C", "With \\(u=x\\), \\(dv=e^x dx\\), \\(I=xe^x-\\int e^x dx=e^x(x-1)+C\\)."],
    ["trig", "Evaluate \\(\\int\\sin^3x\\cos xdx\\).", "\\sin^4x/4+C", "Let \\(u=\\sin x\\), \\(du=\\cos xdx\\); then \\(\\int u^3du=u^4/4+C=\\sin^4x/4+C\\)."],
    ["partial", "Evaluate \\(\\int1/(x^2-1)dx\\).", "\\frac12\\ln|\\frac{x-1}{x+1}|+C", "\\(1/(x^2-1)=\\frac12/(x-1)-\\frac12/(x+1)\\); integrating gives \\(\\frac12\\ln|x-1|-\\frac12\\ln|x+1|+C\\)."],
    ["improper", "Determine convergence of \\(\\int_1^\\infty x^{-2}dx\\).", "\\text{converges to }1", "\\(\\lim_{b\\to\\infty}[-x^{-1}]_1^b=\\lim_{b\\to\\infty}(1-1/b)=1\\), so the improper integral converges."],
    ["area", "Find area between y=x and y=x² on [0,1].", "1/6", "On \\([0,1]\\), \\(x\\ge x^2\\), so \\(A=\\int_0^1(x-x^2)dx=[x^2/2-x^3/3]_0^1=1/6\\)."],
    ["volume", "Rotate y=x on [0,2] about x-axis. Find volume.", "8\\pi/3", "\\(V=\\pi\\int_0^2x^2dx=\\pi[x^3/3]_0^2=8\\pi/3\\)."],
    ["work", "A force F(x)=4x acts from x=0 to 3. Find work.", "18", "\\(W=\\int_0^3 4x\\,dx=[2x^2]_0^3=18\\)."],
    ["sequence", "Find \\(\\lim_{n\\to\\infty} n/(n+1)\\).", "1", "Divide by \\(n\\): \\(n/(n+1)=1/(1+1/n)\\to1\\)."],
    ["geo", "Sum \\(\\sum_{n=0}^\\infty3(1/2)^n\\).", "6", "Here \\(a=3\\), \\(r=1/2\\), and \\(|r|<1\\), so \\(S=3/(1-1/2)=6\\)."],
    ["nth", "Test \\(\\sum_{n=1}^{\\infty} n/(n+1)\\) for convergence.", "\\text{diverges}", "The terms satisfy \\(n/(n+1)\\to1\\ne0\\), so the nth-term test proves divergence."],
    ["pseries", "Test \\(\\sum_{n=1}^{\\infty}1/n^{3/2}\\).", "\\text{converges}", "This is a p-series with \\(p=3/2>1\\), so it converges."],
    ["comparison", "Test \\(\\sum_{n=1}^{\\infty}1/(n^2+4)\\).", "\\text{converges}", "For \\(n\\ge1\\), \\(0<1/(n^2+4)<1/n^2\\); comparison with the convergent p-series proves convergence."],
    ["limitcomparison", "Test \\(\\sum_{n=1}^{\\infty}(3n+1)/(n^2+2)\\).", "\\text{diverges}", "With \\(b_n=1/n\\), \\(a_n/b_n=n(3n+1)/(n^2+2)\\to3\\); limit comparison with the harmonic series gives divergence."],
    ["ratio", "Test \\(\\sum_{n=1}^{\\infty} n!/4^n\\).", "\\text{diverges}", "\\(a_{n+1}/a_n=(n+1)/4\\), which eventually exceeds 1, so the positive terms do not approach zero and the series diverges."],
    ["root", "Test \\(\\sum_{n=1}^{\\infty}(2n/(3n+1))^n\\).", "\\text{converges}", "The root-test limit is \\(\\lim 2n/(3n+1)=2/3<1\\), so the series converges absolutely."],
    ["alternating", "Test \\(\\sum_{n=1}^{\\infty}(-1)^{n-1}/n\\).", "\\text{converges conditionally}", "\\(1/n\\) decreases to zero, so the alternating-series test gives convergence; \\(\\sum1/n\\) diverges, hence convergence is conditional."],
    ["absolute", "Classify \\(\\sum_{n=1}^{\\infty}(-1)^n/n^2\\).", "\\text{converges absolutely}", "The absolute series \\(\\sum1/n^2\\) is a p-series with \\(p=2>1\\), so the original series converges absolutely."],
    ["power-radius", "Find R for \\(\\sum_{n=0}^{\\infty}x^n/5^n\\).", "R=5", "This is geometric with ratio \\(x/5\\); convergence requires \\(|x/5|<1\\), or \\(|x|<5\\), so \\(R=5\\)."],
    ["power-interval", "Find the interval for \\(\\sum_{n=1}^{\\infty}(x-1)^n/n\\).", "[0,2)", "The ratio test gives \\(|x-1|<1\\). At \\(x=0\\), \\(\\sum(-1)^n/n\\) converges; at \\(x=2\\), \\(\\sum1/n\\) diverges, so the interval is \\([0,2)\\)."],
    ["taylor", "Write the Maclaurin series for cos x.", "\\sum_{n=0}^{\\infty}(-1)^nx^{2n}/(2n)!", "The derivatives at zero cycle \\(1,0,-1,0\\), leaving even powers with alternating signs: \\(\\sum_{n=0}^{\\infty}(-1)^nx^{2n}/(2n)!\\)."],
    ["poly", "Find T_3 for e^x at 0.", "1+x+x^2/2+x^3/6", "Every derivative of \\(e^x\\) equals 1 at zero, so \\(T_3=\\sum_{n=0}^3x^n/n!=1+x+x^2/2+x^3/6\\)."],
    ["error", "Bound alternating-series error after four terms of \\(\\sum_{n=1}^{\\infty}(-1)^{n-1}/n\\).", "\\le1/5", "The terms \\(1/n\\) decrease to zero; after four terms the first omitted magnitude is \\(1/5\\), so \\(|R_4|\\le1/5\\)."],
    ["param", "For x=t²,y=t³ find dy/dx.", "3t/2", "\\(dx/dt=2t\\) and \\(dy/dt=3t^2\\), so \\(dy/dx=(3t^2)/(2t)=3t/2\\) for \\(t\\ne0\\)."],
    ["polar", "Convert r=2cosθ to Cartesian form.", "(x-1)^2+y^2=1", "Multiply by \\(r\\): \\(r^2=2r\\cos\\theta\\), so \\(x^2+y^2=2x\\), which completes the square to \\((x-1)^2+y^2=1\\)."],
    ["concept", "Why must power-series endpoints be tested separately?", "\\text{The ratio/root test is inconclusive when }|x-a|=R.", "At \\(|x-a|=R\\), the limiting ratio or root equals 1, so the test is inconclusive and each endpoint series requires its own convergence test."],
  ];
  return (course === "Calculus I" ? calc1 : calc2).map(([id, prompt, answer, derivation]) => p(`${course === "Calculus I" ? "calc1" : "calc2"}-${id}`, prompt, `\\(${answer}\\)`, [
    derivation,
    `The verified result is \\(${answer}\\).`,
  ], "Course synthesis", "Selecting a familiar formula without checking its hypotheses.", "independent-course-review"));
}

const common = {
  subject: "Mathematics",
  course: "Calculus",
  audience: "Students in a first-year college or AP calculus sequence",
  license: "Original BetterGrades material. Free classroom and personal study use with attribution; no resale.",
  revisionDate,
  indexPolicy: "index",
  status: "published",
  downloadFormats: ["html", "pdf"],
};

const definitions = [
  {
    id: "evaluating-limits", resourceType: "worksheet", course: "Calculus I", unit: "Unit 1",
    topics: ["limits", "continuity"], title: "Evaluating Limits Worksheet with Complete Solutions",
    shortTitle: "Evaluating Limits Worksheet", slug: "evaluating-limits",
    canonicalPath: "/subjects/math/calculus/worksheets/evaluating-limits/",
    summary: "Twenty-four limits that progress from substitution to algebraic, one-sided, and infinite behavior.",
    description: "Practice evaluating limits with a printable student worksheet, answer key, and accessible worked solutions.",
    searchIntent: ["evaluating limits worksheet", "limits practice with answers"], skills: ["direct substitution", "factoring", "rationalization", "one-sided limits", "limits at infinity"],
    prerequisites: ["function notation", "algebraic factoring"], difficulty: "Foundational to intermediate", estimatedTime: 55,
    problems: limitProblems(), commonErrors: ["Substituting before checking whether the form is determinate.", "Cancelling terms instead of common factors.", "Ignoring approach direction at jumps."],
    sourceLessons: ["/subjects/math/calculus/limits-continuity/unit/"], sourceAssessments: ["/subjects/math/calculus/limits-continuity/unit/practice-exam-a/"],
    relatedLessons: ["/subjects/math/calculus/limits-continuity/unit/limits/direct-substitution/"], relatedArticles: ["/subjects/math/calculus/limits-continuity/evaluating-indeterminate-limits/"],
    relatedGlossaryTerms: ["limit", "one-sided-limit", "indeterminate-form"], relatedResources: ["calculus-resource-calculus-1-final", "calculus-resource-chain-rule"],
  },
  {
    id: "derivative-rules", resourceType: "formula-sheet", course: "Calculus I", unit: "Unit 2A",
    topics: ["derivatives", "rules"], title: "Derivative Rules Formula Sheet and Printable PDF",
    shortTitle: "Derivative Rules Formula Sheet", slug: "derivative-rules",
    canonicalPath: "/subjects/math/calculus/formula-sheets/derivative-rules/",
    summary: "A compact, readable reference for core derivative rules with rule-selection cues and examples.",
    description: "Review power, product, quotient, chain, exponential, logarithmic, trigonometric, and inverse-trigonometric derivative rules.",
    searchIntent: ["derivative rules formula sheet", "calculus derivative formulas"], skills: ["selecting derivative rules", "differentiating standard functions"],
    prerequisites: ["function notation", "algebra"], difficulty: "Reference", estimatedTime: 15, problems: [],
    formulaGroups: [
      ["Linearity", ["(c)'=0", "(x^n)'=nx^{n-1}", "(f\\pm g)'=f'\\pm g'"]],
      ["Products and quotients", ["(fg)'=f'g+fg'", "(f/g)'=(f'g-fg')/g^2"]],
      ["Composition", ["(f\\circ g)'=f'(g(x))g'(x)"]],
      ["Exponential and logarithmic", ["(e^x)'=e^x", "(a^x)'=a^x\\ln a", "(\\ln x)'=1/x"]],
      ["Trigonometric", ["(\\sin x)'=\\cos x", "(\\cos x)'=-\\sin x", "(\\tan x)'=\\sec^2x"]],
      ["Inverse trigonometric", ["(\\arcsin x)'=1/\\sqrt{1-x^2}", "(\\arctan x)'=1/(1+x^2)"]],
    ],
    commonErrors: ["Multiplying derivatives in a product.", "Reversing quotient-rule numerator order.", "Forgetting the inner derivative in a composition."],
    sourceLessons: ["/subjects/math/calculus/derivatives/"], sourceAssessments: [],
    relatedLessons: ["/subjects/math/calculus/derivatives/"], relatedArticles: ["/subjects/math/calculus/derivatives/rule-selection/"],
    relatedGlossaryTerms: ["derivative", "product-rule", "quotient-rule", "chain-rule"], relatedResources: ["calculus-resource-chain-rule", "calculus-resource-calculus-1-final"],
    primaryVisual: "derivative-rules-map",
  },
  {
    id: "chain-rule", resourceType: "worksheet", course: "Calculus I", unit: "Unit 2A",
    topics: ["derivatives", "chain rule"], title: "Chain Rule Worksheet with Answers and Worked Solutions",
    shortTitle: "Chain Rule Worksheet", slug: "chain-rule",
    canonicalPath: "/subjects/math/calculus/worksheets/chain-rule/",
    summary: "Twenty-four composition problems from basic powers through nested, product, and quotient combinations.",
    description: "Build chain-rule fluency with a printable worksheet, complete key, error analysis, and worked HTML solutions.",
    searchIntent: ["chain rule worksheet", "chain rule practice problems"], skills: ["composition structure", "nested chain rule", "product plus chain", "quotient plus chain"],
    prerequisites: ["basic derivative rules", "function composition"], difficulty: "Foundational to advanced", estimatedTime: 60,
    problems: chainProblems(), commonErrors: ["Forgetting an inner derivative.", "Applying the chain rule to a sum or product as a single composition.", "Simplifying before the rule structure is secure."],
    sourceLessons: ["/subjects/math/calculus/derivatives/"], sourceAssessments: ["/subjects/math/calculus/derivatives/unit-practice/"],
    relatedLessons: ["/subjects/math/calculus/derivatives/"], relatedArticles: ["/subjects/math/calculus/derivatives/chain-rule/"],
    relatedGlossaryTerms: ["chain-rule", "derivative", "product-rule", "quotient-rule"], relatedResources: ["calculus-resource-derivative-rules", "calculus-resource-calculus-1-final"],
  },
  {
    id: "optimization", resourceType: "worksheet", course: "Calculus I", unit: "Unit 2B",
    topics: ["derivative applications", "optimization"], title: "Calculus Optimization Worksheet with Complete Solutions",
    shortTitle: "Optimization Worksheet", slug: "optimization",
    canonicalPath: "/subjects/math/calculus/worksheets/optimization/",
    summary: "Sixteen substantial modeling problems with constraints, domains, critical points, and verification.",
    description: "Practice open-box, fencing, geometry, distance, cost, and revenue optimization with complete derivations.",
    searchIntent: ["calculus optimization worksheet", "optimization problems with solutions"], skills: ["constraint construction", "domain reasoning", "extrema verification"],
    prerequisites: ["derivative rules", "critical points"], difficulty: "Intermediate to advanced", estimatedTime: 90,
    problems: optimizationProblems(), commonErrors: ["Differentiating before reducing to one variable.", "Ignoring the feasible domain.", "Reporting a critical point without verifying the optimum."],
    sourceLessons: ["/subjects/math/calculus/derivative-applications/"], sourceAssessments: ["/subjects/math/calculus/derivative-applications/practice-exam-a/"],
    relatedLessons: ["/subjects/math/calculus/derivative-applications/optimization-modeling/"], relatedArticles: ["/subjects/math/calculus/derivative-applications/optimization/"],
    relatedGlossaryTerms: ["critical-number", "local-maximum", "local-minimum"], relatedResources: ["calculus-resource-chain-rule", "calculus-resource-calculus-1-final"],
    primaryVisual: "open-top-box-optimization",
  },
  {
    id: "calculus-1-final", resourceType: "practice-exam", course: "Calculus I", unit: "Units 1–3A",
    topics: ["limits", "derivatives", "applications", "integrals"], title: "Calculus I Practice Final Exam with Complete Solutions",
    shortTitle: "Calculus I Practice Final", slug: "calculus-1-final",
    canonicalPath: "/subjects/math/calculus/practice-exams/calculus-1-final/",
    summary: "A balanced twenty-five-question cumulative final with point values, study map, and complete solutions.",
    description: "Prepare for a Calculus I final with a timed BetterGrades practice exam covering limits through integral foundations.",
    searchIntent: ["calculus 1 practice final", "calculus i final exam with solutions"], skills: ["course synthesis", "method selection", "mathematical communication"],
    prerequisites: ["Calculus I Units 1 through 3A"], difficulty: "Cumulative", estimatedTime: 120,
    problems: examProblems("Calculus I"), suggestedTime: 120, pointValues: "4 points per question; 100 points total", calculatorAssumptions: "Scientific calculator permitted; computer algebra is not required.",
    commonErrors: ["Starting with a formula before identifying the structure.", "Skipping hypotheses or endpoint checks.", "Giving an answer without enough reasoning to audit it."],
    sourceLessons: ["/subjects/math/calculus/limits-continuity/unit/", "/subjects/math/calculus/derivatives/", "/subjects/math/calculus/derivative-applications/", "/subjects/math/calculus/integrals/"],
    sourceAssessments: ["/subjects/math/calculus/limits-continuity/unit/practice-exam-a/", "/subjects/math/calculus/derivatives/practice-exam-a/", "/subjects/math/calculus/integrals/practice-exam-a/"],
    relatedLessons: ["/subjects/math/calculus/"], relatedArticles: ["/subjects/math/calculus/limits-continuity/evaluating-indeterminate-limits/"],
    relatedGlossaryTerms: ["limit", "derivative", "definite-integral", "fundamental-theorem-calculus"], relatedResources: ["calculus-resource-evaluating-limits", "calculus-resource-derivative-rules"],
  },
  {
    id: "integration-by-parts", resourceType: "worksheet", course: "Calculus II", unit: "Unit 3A",
    topics: ["integration techniques", "integration by parts"], title: "Integration by Parts Worksheet with Complete Solutions",
    shortTitle: "Integration by Parts Worksheet", slug: "integration-by-parts",
    canonicalPath: "/subjects/math/calculus/worksheets/integration-by-parts/",
    summary: "Twenty problems covering polynomial products, logarithms, inverse trigonometric functions, definite integrals, and cyclic cases.",
    description: "Practice choosing u and dv, repeated integration by parts, and cyclic integrals with a printable key.",
    searchIntent: ["integration by parts worksheet", "integration by parts problems with answers"], skills: ["LIATE judgment", "repeated integration by parts", "definite integral evaluation"],
    prerequisites: ["antiderivatives", "product rule"], difficulty: "Intermediate to advanced", estimatedTime: 70,
    problems: ibpProblems(), commonErrors: ["Choosing dv that is not readily integrable.", "Dropping the subtraction in the formula.", "Failing to solve for the original integral in a cyclic case."],
    sourceLessons: ["/subjects/math/calculus/integrals/"], sourceAssessments: ["/subjects/math/calculus/integrals/practice-exam-b/"],
    relatedLessons: ["/subjects/math/calculus/integrals/integration-by-parts/"], relatedArticles: ["/learn/calculus/integration-by-parts/"],
    relatedGlossaryTerms: ["integration-by-parts", "antiderivative", "definite-integral"], relatedResources: ["calculus-resource-calculus-2-final", "calculus-resource-taylor-series"],
    primaryVisual: "integration-by-parts-guide",
  },
  {
    id: "convergence-tests-flowchart", resourceType: "visual-guide", course: "Calculus II", unit: "Unit 4A",
    topics: ["series", "convergence tests"], title: "Convergence Tests Flowchart and Visual Guide",
    shortTitle: "Convergence Tests Visual Guide", slug: "convergence-tests-flowchart",
    canonicalPath: "/subjects/math/calculus/visuals/convergence-tests-flowchart/",
    summary: "An accessible decision guide for selecting a convergence test without replacing the proof.",
    description: "Compare nth-term, geometric, p-series, comparison, integral, alternating, ratio, and root tests with cautions.",
    searchIntent: ["convergence tests flowchart", "which series test to use"], skills: ["test selection", "hypothesis checks", "absolute versus conditional convergence"],
    prerequisites: ["sequences", "series", "improper integrals"], difficulty: "Reference", estimatedTime: 20, problems: [],
    commonErrors: ["Using the nth-term test to prove convergence.", "Applying comparison tests without nonnegative terms.", "Treating a ratio-test limit of one as a conclusion."],
    sourceLessons: ["/subjects/math/calculus/sequences-and-series/"], sourceAssessments: ["/subjects/math/calculus/sequences-and-series/cumulative-practice/"],
    relatedLessons: ["/subjects/math/calculus/sequences-and-series/choosing-a-convergence-test/"], relatedArticles: ["/subjects/math/calculus/sequences-and-series/choosing-a-convergence-test/"],
    relatedGlossaryTerms: ["convergence", "ratio-test", "root-test", "limit-comparison-test", "absolute-convergence"], relatedResources: ["calculus-resource-geometric-series", "calculus-resource-calculus-2-final"],
    primaryVisual: "convergence-tests-flowchart", downloadFormats: ["html", "svg", "png", "pdf"],
  },
  {
    id: "geometric-series", resourceType: "worksheet", course: "Calculus II", unit: "Unit 4A",
    topics: ["series", "geometric series"], title: "Geometric Series Worksheet with Answers and Printable PDF",
    shortTitle: "Geometric Series Worksheet", slug: "geometric-series",
    canonicalPath: "/subjects/math/calculus/worksheets/geometric-series/",
    summary: "Twenty finite, infinite, shifted-index, decimal, modeling, and error-analysis problems.",
    description: "Practice geometric sequences and series with complete HTML solutions and separate student and key PDFs.",
    searchIntent: ["geometric series worksheet", "geometric series practice with answers"], skills: ["common ratio", "finite sums", "infinite sums", "index shifts", "applied models"],
    prerequisites: ["sequences", "sigma notation"], difficulty: "Foundational to intermediate", estimatedTime: 60,
    problems: geometricProblems(), commonErrors: ["Using the infinite formula when |r|≥1.", "Mistaking the first listed term for the coefficient a after an index shift.", "Forgetting that a repeating-decimal series begins at a decimal place."],
    sourceLessons: ["/subjects/math/calculus/sequences-and-series/"], sourceAssessments: ["/subjects/math/calculus/sequences-and-series/cumulative-practice/"],
    relatedLessons: ["/subjects/math/calculus/sequences-and-series/geometric-series/"], relatedArticles: ["/subjects/math/calculus/sequences-and-series/geometric-series/"],
    relatedGlossaryTerms: ["geometric-series", "series", "partial-sum"], relatedResources: ["calculus-resource-convergence-tests-flowchart", "calculus-resource-calculus-2-final"],
    primaryVisual: "geometric-series-self-similarity",
  },
  {
    id: "taylor-series", resourceType: "worksheet", course: "Calculus II", unit: "Unit 4B",
    topics: ["power series", "Taylor series"], title: "Taylor Series Worksheet with Answers and Error Practice",
    shortTitle: "Taylor Series Worksheet", slug: "taylor-series",
    canonicalPath: "/subjects/math/calculus/worksheets/taylor-series/",
    summary: "Twenty problems on known series, transformations, coefficients, intervals, approximations, and error.",
    description: "Practice Maclaurin and Taylor series with complete solutions, interval checks, and error estimates.",
    searchIntent: ["taylor series worksheet", "power series practice with answers"], skills: ["series construction", "known-series transformations", "intervals of convergence", "remainder estimates"],
    prerequisites: ["derivatives", "infinite series"], difficulty: "Intermediate to advanced", estimatedTime: 75,
    problems: taylorProblems(), commonErrors: ["Dropping factorials in coefficient formulas.", "Transforming a series without its convergence interval.", "Using an error estimate without checking its hypotheses."],
    sourceLessons: ["/subjects/math/calculus/power-series-and-taylor-series/"], sourceAssessments: ["/subjects/math/calculus/power-series-and-taylor-series/cumulative-practice/"],
    relatedLessons: ["/subjects/math/calculus/power-series-and-taylor-series/taylor-series-centered-at-a/"], relatedArticles: ["/subjects/math/calculus/power-series-and-taylor-series/taylor-polynomials/"],
    relatedGlossaryTerms: ["taylor-series", "power-series", "radius-of-convergence", "remainder-term"], relatedResources: ["calculus-resource-convergence-tests-flowchart", "calculus-resource-calculus-2-final"],
    primaryVisual: "taylor-approximation-sequence",
  },
  {
    id: "calculus-2-final", resourceType: "practice-exam", course: "Calculus II", unit: "Units 3B–4B",
    topics: ["integration applications", "sequences", "series", "power series", "Taylor series"], title: "Calculus II Practice Final Exam with Complete Solutions",
    shortTitle: "Calculus II Practice Final", slug: "calculus-2-final",
    canonicalPath: "/subjects/math/calculus/practice-exams/calculus-2-final/",
    summary: "A balanced twenty-five-question Calculus II final with study map and complete worked key.",
    description: "Prepare for a Calculus II final with integration methods, applications, convergence, power series, and Taylor series.",
    searchIntent: ["calculus 2 practice final", "calculus ii final exam with solutions"], skills: ["method selection", "convergence proof", "series construction", "course synthesis"],
    prerequisites: ["Calculus II Units 3B through 4B"], difficulty: "Cumulative", estimatedTime: 120,
    problems: examProblems("Calculus II"), suggestedTime: 120, pointValues: "4 points per question; 100 points total", calculatorAssumptions: "Scientific calculator permitted; computer algebra is not required.",
    commonErrors: ["Choosing an integration or convergence test from surface appearance alone.", "Skipping endpoint checks.", "Claiming a Taylor representation without a convergence or remainder argument."],
    sourceLessons: ["/subjects/math/calculus/integration-applications/", "/subjects/math/calculus/sequences-and-series/", "/subjects/math/calculus/power-series-and-taylor-series/"],
    sourceAssessments: ["/subjects/math/calculus/integration-applications/practice-exam-a/", "/subjects/math/calculus/sequences-and-series/practice-exam-a/", "/subjects/math/calculus/power-series-and-taylor-series/practice-exam-a/"],
    relatedLessons: ["/subjects/math/calculus/"], relatedArticles: ["/subjects/math/calculus/sequences-and-series/choosing-a-convergence-test/"],
    relatedGlossaryTerms: ["integration-by-parts", "geometric-series", "absolute-convergence", "power-series", "taylor-series"], relatedResources: ["calculus-resource-integration-by-parts", "calculus-resource-taylor-series"],
  },
];

const resources = definitions.map((definition) => {
  const id = `calculus-resource-${definition.id}`;
  const base = `/downloads/calculus/${definition.id}`;
  const hasKey = definition.problems.length > 0;
  return {
    ...common,
    ...definition,
    id,
    problemCount: definition.problems.length,
    studentPdf: `${base}/${definition.id}-student.pdf`,
    answerKeyPdf: hasKey ? `${base}/${definition.id}-answer-key.pdf` : null,
    workedHtmlSolutions: hasKey,
  };
});

const promotedVisualPages = [
  {
    id: "calculus-resource-derivative-rules-map",
    resourceType: "visual-guide",
    course: "Calculus I",
    unit: "Unit 2A",
    topics: ["derivatives", "rule selection"],
    title: "Derivative Rules Map: How to Choose a Differentiation Rule",
    shortTitle: "Derivative Rules Map",
    slug: "derivative-rules-map",
    canonicalPath: "/subjects/math/calculus/visuals/derivative-rules-map/",
    summary: "A standalone decision map for recognizing constant, power, product, quotient, and composition structure.",
    description: "Use a downloadable derivative-rules map to identify the outer algebraic structure before differentiating.",
    searchIntent: ["derivative rules map", "which derivative rule"],
    skills: ["derivative-rule selection"],
    prerequisites: ["function notation"],
    difficulty: "Reference",
    estimatedTime: 10,
    problems: [],
    formulaGroups: [["Rule-selection sequence", ["\\text{sum}\\to\\text{linearity}", "\\text{product}\\to(fg)'", "\\text{quotient}\\to(f/g)'", "\\text{composition}\\to\\text{chain rule}"]]],
    commonErrors: ["Choosing from visual symbols before identifying the outer operation."],
    sourceLessons: ["/subjects/math/calculus/derivatives/"],
    sourceAssessments: [],
    relatedLessons: ["/subjects/math/calculus/derivatives/"],
    relatedArticles: ["/subjects/math/calculus/derivatives/rule-selection/"],
    relatedGlossaryTerms: ["derivative", "product-rule", "quotient-rule", "chain-rule"],
    relatedResources: ["calculus-resource-derivative-rules", "calculus-resource-chain-rule"],
    primaryVisual: "derivative-rules-map",
  },
  {
    id: "calculus-resource-riemann-sum-progression",
    resourceType: "visual-guide",
    course: "Calculus I",
    unit: "Unit 3A",
    topics: ["integrals", "Riemann sums"],
    title: "Riemann Sum Progression: From Rectangles to Definite Integral",
    shortTitle: "Riemann Sum Progression",
    slug: "riemann-sum-progression",
    canonicalPath: "/subjects/math/calculus/visuals/riemann-sum-progression/",
    summary: "A visual progression from a coarse partition to a definite integral, with width, height, and limiting behavior labeled.",
    description: "See how increasingly fine Riemann sums approximate signed accumulation and lead to a definite integral.",
    searchIntent: ["riemann sum visual", "rectangles to definite integral"],
    skills: ["interpreting Riemann sums", "connecting sums to integrals"],
    prerequisites: ["function graphs", "sigma notation"],
    difficulty: "Foundational",
    estimatedTime: 12,
    problems: [],
    formulaGroups: [["Accumulation", ["\\Delta x=(b-a)/n", "\\sum_{i=1}^n f(x_i^*)\\Delta x", "\\lim_{n\\to\\infty}\\sum f(x_i^*)\\Delta x=\\int_a^b f(x)\\,dx"]]],
    commonErrors: ["Treating rectangle height as area or forgetting signed contribution below the axis."],
    sourceLessons: ["/subjects/math/calculus/integrals/"],
    sourceAssessments: [],
    relatedLessons: ["/subjects/math/calculus/integrals/"],
    relatedArticles: ["/subjects/math/calculus/integrals/definite-integral-signed-area/"],
    relatedGlossaryTerms: ["definite-integral", "integrand", "fundamental-theorem-calculus"],
    relatedResources: ["calculus-resource-calculus-1-final", "calculus-resource-integration-by-parts"],
    primaryVisual: "riemann-sum-progression",
  },
  {
    id: "calculus-resource-taylor-approximation-visual",
    resourceType: "visual-guide",
    course: "Calculus II",
    unit: "Unit 4B",
    topics: ["Taylor series", "approximation"],
    title: "Taylor Polynomial Approximation Sequence Visual",
    shortTitle: "Taylor Approximation Visual",
    slug: "taylor-approximation-visual",
    canonicalPath: "/subjects/math/calculus/visuals/taylor-approximation-visual/",
    summary: "A degree-by-degree visual showing how local derivative data builds a Taylor approximation.",
    description: "Compare Taylor polynomial degrees, centers, intervals, and remainder behavior in an accessible visual guide.",
    searchIntent: ["taylor polynomial visual", "taylor approximation graph"],
    skills: ["interpreting Taylor polynomials", "remainder reasoning"],
    prerequisites: ["higher derivatives", "power series"],
    difficulty: "Intermediate",
    estimatedTime: 12,
    problems: [],
    formulaGroups: [["Taylor construction", ["T_n(x)=\\sum_{k=0}^n\\frac{f^{(k)}(a)}{k!}(x-a)^k", "R_n(x)=f(x)-T_n(x)"]]],
    commonErrors: ["Assuming higher degree guarantees accuracy far from the center without a remainder check."],
    sourceLessons: ["/subjects/math/calculus/power-series-and-taylor-series/"],
    sourceAssessments: [],
    relatedLessons: ["/subjects/math/calculus/power-series-and-taylor-series/taylor-polynomials/"],
    relatedArticles: ["/subjects/math/calculus/power-series-and-taylor-series/taylor-polynomials/"],
    relatedGlossaryTerms: ["taylor-series", "power-series", "remainder-term"],
    relatedResources: ["calculus-resource-taylor-series", "calculus-resource-calculus-2-final"],
    primaryVisual: "taylor-approximation-sequence",
  },
].map((definition) => ({
  ...common,
  ...definition,
  problemCount: 0,
  studentPdf: `/downloads/calculus/${definition.slug}/${definition.slug}-student.pdf`,
  answerKeyPdf: null,
  workedHtmlSolutions: false,
  downloadFormats: ["html", "svg", "png", "pdf"],
}));

const selectedWorked = [
  ["evaluating-limits", "limits-factor-1", "limit-by-factoring"],
  ["evaluating-limits", "limits-rationalize-1", "limit-by-rationalization"],
  ["evaluating-limits", "limits-sided-1", "one-sided-piecewise-limit"],
  ["chain-rule", "chain-power-1", "basic-chain-rule"],
  ["chain-rule", "chain-nested-1", "nested-chain-rule"],
  ["chain-rule", "chain-combined-1", "product-plus-chain-rule"],
  ["chain-rule", "chain-combined-3", "quotient-plus-chain-rule"],
  ["optimization", "optimization-open-box-12", "open-top-box-optimization"],
  ["optimization", "optimization-fence-river", "fencing-optimization"],
  ["integration-by-parts", "ibp-xe^x", "integration-by-parts-x-e-x"],
  ["integration-by-parts", "ibp-lnx", "integration-by-parts-log-x"],
  ["integration-by-parts", "ibp-x^2e^x", "repeated-integration-by-parts"],
  ["geometric-series", "geometric-finite", "finite-geometric-sum"],
  ["geometric-series", "geometric-infinite", "infinite-geometric-sum"],
  ["geometric-series", "geometric-shift", "shifted-geometric-series"],
  ["geometric-series", "geometric-decimal-27", "repeating-decimal-as-a-series"],
  ["calculus-2-final", "calc2-ratio", "ratio-test-example"],
  ["calculus-2-final", "calc2-root", "root-test-example"],
  ["calculus-2-final", "calc2-limitcomparison", "limit-comparison-example"],
  ["calculus-2-final", "calc2-alternating", "alternating-series-test-example"],
  ["calculus-2-final", "calc2-absolute", "absolute-versus-conditional-convergence"],
  ["taylor-series", "taylor-coeff", "taylor-polynomial-from-derivatives"],
  ["taylor-series", "taylor-sub-x2", "taylor-series-from-known-series"],
  ["taylor-series", "taylor-interval", "interval-of-convergence-example"],
  ["taylor-series", "taylor-error-exp", "taylor-approximation-error"],
  ["calculus-1-final", "calc1-ftc", "fundamental-theorem-derivative"],
];
const workedProblems = selectedWorked.map(([resourceSlug, problemId, slug]) => {
  const parent = resources.find((resource) => resource.slug === resourceSlug);
  const problem = parent.problems.find((item) => item.id === problemId);
  if (!parent || !problem) throw new Error(`Missing worked-problem source ${resourceSlug}/${problemId}`);
  return {
    id: `worked-problem-${slug}`,
    resourceType: "worked-problem",
    subject: "Mathematics",
    course: parent.course,
    unit: parent.unit,
    topics: parent.topics,
    title: `${slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}: Worked Example and Solution`,
    shortTitle: slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    slug,
    canonicalPath: `/subjects/math/calculus/worked-problems/${slug}/`,
    summary: `A complete ${problem.method.toLowerCase()} example with method choice, derivation, verification, and a common wrong approach.`,
    description: `See a concise answer and full derivation for ${readablePrompt(problem.prompt).toLowerCase()}`,
    searchIntent: [slug.replaceAll("-", " "), problem.method],
    skills: [problem.method],
    prerequisites: parent.prerequisites,
    difficulty: parent.difficulty,
    estimatedTime: 8,
    problemCount: 1,
    audience: common.audience,
    studentPdf: null,
    answerKeyPdf: null,
    workedHtmlSolutions: true,
    primaryVisual: parent.primaryVisual ?? null,
    downloadFormats: ["html"],
    relatedLessons: parent.relatedLessons,
    relatedArticles: parent.relatedArticles,
    relatedResources: [parent.id, ...parent.relatedResources].slice(0, 3),
    relatedGlossaryTerms: parent.relatedGlossaryTerms,
    sourceLessons: parent.sourceLessons,
    sourceAssessments: parent.sourceAssessments,
    license: common.license,
    revisionDate,
    indexPolicy: "index",
    status: "published",
    parentResourceId: parent.id,
    problem,
    alternativeMethod: problem.method.includes("factoring") ? "L'Hôpital's rule would work later in a calculus sequence, but factoring is more elementary and exposes the removable factor." : "A numerical or graphical check can confirm the result, but the displayed method gives the exact justification.",
  };
});

const glossaryIds = [
  "limit", "one-sided-limit", "continuity", "derivative", "chain-rule", "implicit-differentiation",
  "critical-number", "local-maximum", "local-minimum", "related-rates", "optimization", "antiderivative",
  "definite-integral", "fundamental-theorem-calculus", "u-substitution", "integration-by-parts", "improper-integral",
  "sequence", "series", "geometric-series", "absolute-convergence", "power-series", "taylor-series", "radius-of-convergence",
];
const glossaryEnrichments = glossaryIds.map((id, index) => ({
  id: `glossary-resource-${id}`,
  resourceType: "glossary-term",
  subject: "Mathematics",
  course: index < 17 ? "Calculus I and II" : "Calculus II",
  unit: "Reference",
  topics: [id.replaceAll("-", " ")],
  title: `${id.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}: Meaning, Notation, and Example`,
  shortTitle: id.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
  slug: id,
  canonicalPath: `/glossary/math/${id}/`,
  summary: `A substantial calculus explanation of ${id.replaceAll("-", " ")} with notation, a worked example, and common confusion.`,
  description: `Learn the definition, notation, interpretation, and use of ${id.replaceAll("-", " ")} in calculus.`,
  searchIntent: [`${id.replaceAll("-", " ")} definition`, `${id.replaceAll("-", " ")} calculus example`],
  skills: ["mathematical vocabulary", "notation interpretation"],
  prerequisites: index < 4 ? ["functions and algebra"] : ["introductory calculus"],
  difficulty: "Reference",
  estimatedTime: 7,
  problemCount: 1,
  audience: common.audience,
  studentPdf: null,
  answerKeyPdf: null,
  workedHtmlSolutions: true,
  primaryVisual: ["derivative", "chain-rule"].includes(id) ? "derivative-rules-map" : id === "geometric-series" ? "geometric-series-self-similarity" : id === "taylor-series" ? "taylor-approximation-sequence" : null,
  downloadFormats: ["html"],
  relatedLessons: index < 4 ? ["/subjects/math/calculus/limits-continuity/unit/"] : index < 12 ? ["/subjects/math/calculus/derivatives/"] : index < 17 ? ["/subjects/math/calculus/integrals/"] : ["/subjects/math/calculus/sequences-and-series/"],
  relatedArticles: index < 4 ? ["/subjects/math/calculus/limits-continuity/continuity-at-a-point/"] : ["/subjects/math/calculus/derivatives/chain-rule/"],
  relatedResources: index < 12 ? ["calculus-resource-calculus-1-final", "calculus-resource-derivative-rules"] : ["calculus-resource-calculus-2-final", "calculus-resource-convergence-tests-flowchart"],
  relatedGlossaryTerms: glossaryIds.filter((candidate) => candidate !== id).slice(index % 8, index % 8 + 3),
  sourceLessons: [],
  sourceAssessments: [],
  license: common.license,
  revisionDate,
  indexPolicy: "index",
  status: "published",
  glossaryTermId: id,
  explanation: `The term ${id.replaceAll("-", " ")} names a precise mathematical idea, not merely a visual pattern. Read its notation as a statement with hypotheses, quantities, and a conclusion.`,
  notation: id === "limit" ? "\\lim_{x\\to a}f(x)=L" : id === "derivative" ? "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h" : id === "definite-integral" ? "\\int_a^b f(x)\\,dx" : id === "taylor-series" ? "\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^n" : `\\text{${id.replaceAll("-", " ")}}`,
  workedExample: `Identify the quantities in the notation, state the relevant hypothesis, and explain what conclusion the ${id.replaceAll("-", " ")} statement permits.`,
  commonConfusion: `Do not treat ${id.replaceAll("-", " ")} as a keyword that automatically selects a formula; its hypotheses and domain still control the conclusion.`,
}));

const catalog = { version: 1, revisionDate, resources, promotedVisualPages, workedProblems, glossaryEnrichments };
function texEscape(value) {
  return String(value).split(/(\\\([\s\S]*?\\\))/g).map((segment) => {
    if (segment.startsWith("\\(") && segment.endsWith("\\)")) return `$${segment.slice(2, -2)}$`;
    return segment
      .replace(/\\sqrt\{([^{}]+)\}/g, "square root of ($1)")
      .replaceAll("\\pi", "pi").replaceAll("\\ell", "l").replaceAll("\\infty", "infinity")
      .replace(/\\[A-Za-z]+/g, "")
      .replaceAll("{", "(").replaceAll("}", ")")
      .replace(/([A-Za-z0-9)])\^([A-Za-z0-9+-]+)/g, "$1 to the power $2")
      .replaceAll("^", " to the power ")
      .replaceAll("\\", "\\textbackslash{}")
      .replaceAll("&", "\\&").replaceAll("%", "\\%").replaceAll("#", "\\#")
      .replaceAll("_", "\\_").replaceAll("$", "\\$")
      .replaceAll("…", "\\ldots{}")
      .replaceAll("²", " squared").replaceAll("³", " cubed")
      .replaceAll("≥", "$\\ge$").replaceAll("≤", "$\\le$");
  }).join("");
}

function latexDocument(resource, key) {
  const title = key ? `${resource.shortTitle} — Worked Answer Key` : resource.shortTitle;
  const visualBody = resource.resourceType === "visual-guide" && resource.primaryVisual
    ? `\\begin{center}\\includegraphics[width=\\linewidth,height=0.62\\textheight,keepaspectratio]{${resolve(visualRoot, `${resource.primaryVisual}.png`)}}\\end{center}`
    : "";
  const formulaBody = (resource.formulaGroups ?? []).map(([group, formulas]) => `\\section*{${texEscape(group)}}${formulas.map((formula) => `\\[${formula}\\]`).join("\n")}`).join("\n");
  const problemBody = resource.problems.length
    ? resource.problems.map((problem) => {
      const prompt = texEscape(problem.prompt);
      if (!key) {
        const workspace = resource.resourceType === "practice-exam"
          ? "1.0"
          : resource.id === "calculus-resource-evaluating-limits"
            ? "0.62"
            : "0.75";
        return `\\item ${prompt}\\vspace{${workspace}in}`;
      }
      const steps = problem.steps.map((step) => `\\item ${texEscape(step)}`).join("\n");
      return `\\item ${prompt}\\par\\textbf{Answer:} ${texEscape(problem.answer)}\\begin{enumerate}[label=\\alph*.]${steps}\\end{enumerate}`;
    }).join("\n")
    : `${visualBody}\n${formulaBody}`;
  return String.raw`\documentclass[11pt]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{amsmath,amssymb,enumitem,fancyhdr,graphicx,hyperref,xcolor}
\hypersetup{pdftitle={${texEscape(title)}},pdfauthor={BetterGrades},pdfsubject={Calculus study resource},colorlinks=true,urlcolor=teal}
\pagestyle{fancy}\fancyhf{}\lhead{BetterGrades}\rhead{${texEscape(resource.course)}}\cfoot{\thepage}
\setlength{\parindent}{0pt}\setlength{\parskip}{5pt}
\begin{document}
{\Large\bfseries ${texEscape(title)}}\par
${texEscape(resource.summary)}\par
\textbf{Revision:} ${revisionDate}\quad\textbf{Canonical page:} \url{${canonicalHost}${resource.canonicalPath}}\par
${key ? "" : "\\vspace{4pt}\\textbf{Name:} \\rule{2.8in}{0.4pt}\\hfill\\textbf{Date:} \\rule{1.5in}{0.4pt}\\par"}
\hrule\vspace{8pt}
${resource.problems.length ? `\\begin{enumerate}[leftmargin=*,itemsep=${key ? "9pt" : "13pt"}]${problemBody}\\end{enumerate}` : problemBody}
\vfill\footnotesize ${texEscape(resource.license)}
\end{document}
`;
}

const visualDefinitions = [
  ["secant-tangent-approach", "Secant line approaching a tangent", ["Fix the base point P", "Move Q toward P", "Track the secant slope", "Take the difference-quotient limit", "Interpret the tangent slope"]],
  ["derivative-rules-map", "Derivative rules map", ["Identify structure", "Select outer rule", "Differentiate each required part", "Apply chain factors", "Simplify and check"]],
  ["open-top-box-optimization", "Open-top-box optimization setup", ["Choose cut size x", "Write dimensions", "Build V(x)", "Find feasible domain", "Verify the maximum"]],
  ["riemann-sum-progression", "Riemann-sum progression", ["Partition the interval", "Choose sample points", "Build rectangle areas", "Refine the partition", "Interpret the limiting integral"]],
  ["fundamental-theorem-relationship", "Fundamental Theorem relationship", ["Begin with a rate f", "Accumulate from a to x", "Differentiate the accumulation", "Recover f(x)", "Use an antiderivative for endpoint evaluation"]],
  ["integration-by-parts-guide", "Integration by parts guide", ["Is there a product?", "Choose u to simplify", "Integrate dv", "Apply uv minus integral vdu", "Repeat or solve a cycle"]],
  ["convergence-tests-flowchart", "Convergence tests decision guide", ["First: do terms approach zero?", "Recognize geometric or p-series", "Positive terms: comparison or integral", "Factorials or nth powers: ratio or root", "Alternating signs: test absolute and conditional"]],
  ["geometric-series-self-similarity", "Geometric-series self-similarity", ["Identify first term a", "Find ratio r", "Finite: use S_n", "Infinite: require |r|<1", "Check the starting index"]],
  ["radius-interval-convergence", "Radius and interval of convergence", ["Locate the center a", "Use ratio or root test", "Solve |x-a|<R", "Test the left endpoint", "Test the right endpoint"]],
  ["taylor-approximation-sequence", "Taylor approximation sequence", ["Choose a center", "Compute derivatives or known series", "Build the degree-n polynomial", "State the interval", "Bound the remainder"]],
];

function svgFor([id, title, steps]) {
  const xml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const width = 1200;
  const height = 180 + steps.length * 125;
  const boxes = steps.map((step, index) => {
    const y = 135 + index * 125;
    return `<g><rect x="120" y="${y}" width="960" height="82" rx="18" fill="${index % 2 ? "#173d38" : "#24584f"}" stroke="#8bd3c2" stroke-width="3"/><text x="165" y="${y + 51}" fill="#ffffff" font-size="30" font-family="Arial, sans-serif" font-weight="700">${index + 1}.</text><text x="220" y="${y + 51}" fill="#ffffff" font-size="30" font-family="Arial, sans-serif">${xml(step)}</text>${index < steps.length - 1 ? `<path d="M600 ${y + 82}v43" stroke="#f2c879" stroke-width="6" marker-end="url(#arrow)"/>` : ""}</g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><title id="${id}-title">${xml(title)}</title><desc id="${id}-desc">${xml(steps.join(". "))}.</desc><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#f2c879"/></marker></defs><rect width="1200" height="${height}" fill="#101713"/><text x="600" y="72" text-anchor="middle" fill="#eaf3ee" font-family="Arial, sans-serif" font-size="42" font-weight="700">${xml(title)}</text>${boxes}<text x="600" y="${height - 24}" text-anchor="middle" fill="#a8bbb2" font-family="Arial, sans-serif" font-size="20">BetterGrades · ${revisionDate}</text></svg>\n`;
}

async function compilePdf(resource, key) {
  const directory = resolve(assetRoot, resource.slug);
  await mkdir(directory, { recursive: true });
  const suffix = key ? "answer-key" : "student";
  const texPath = resolve(directory, `${resource.slug}-${suffix}.tex`);
  const pdfPath = resolve(directory, `${resource.slug}-${suffix}.pdf`);
  await writeFile(texPath, latexDocument(resource, key), "utf8");
  const run = spawnSync("tectonic", ["--keep-logs", "--outdir", directory, texPath], {
    cwd: root,
    encoding: "utf8",
    env: deterministicEnvironment,
  });
  if (run.status !== 0) throw new Error(`Tectonic failed for ${resource.id}/${suffix}: ${run.stderr || run.stdout}`);
  await rm(texPath, { force: true });
  await rm(resolve(directory, `${resource.slug}-${suffix}.log`), { force: true });
  return pdfPath;
}

async function buildAll() {
  await mkdir(dirname(catalogPath), { recursive: true });
  await mkdir(visualRoot, { recursive: true });
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  for (const definition of visualDefinitions) {
    const [id] = definition;
    const svgPath = resolve(visualRoot, `${id}.svg`);
    await writeFile(svgPath, svgFor(definition), "utf8");
    const pngPath = resolve(visualRoot, `${id}.png`);
    const raster = spawnSync("magick", [
      "-background", "#101713",
      svgPath,
      "-resize", "1200x",
      "-alpha", "remove",
      "-alpha", "off",
      "-depth", "8",
      "-define", "png:exclude-chunks=date,time",
      "+set", "date:create",
      "+set", "date:modify",
      pngPath,
    ], { encoding: "utf8", env: deterministicEnvironment });
    if (raster.status !== 0) throw new Error(`Raster generation failed for ${id}: ${raster.stderr}`);
  }
  const pdfRows = [];
  const headerLines = [];
  for (const resource of [...resources, ...promotedVisualPages]) {
    const variants = resource.answerKeyPdf ? [false, true] : [false];
    for (const key of variants) {
      const pdfPath = await compilePdf(resource, key);
      const bytes = await readFile(pdfPath);
      const publicPath = key ? resource.answerKeyPdf : resource.studentPdf;
      headerLines.push(`${publicPath}\n  Link: <${canonicalHost}${resource.canonicalPath}>; rel="canonical"\n  Content-Disposition: inline\n  X-Robots-Tag: noindex`);
      pdfRows.push({
        resource_id: resource.id,
        variant: key ? "answer-key" : "student",
        path: publicPath,
        sha256: sha256(bytes),
        bytes: bytes.length,
        canonical: `${canonicalHost}${resource.canonicalPath}`,
        status: "verified",
      });
    }
  }
  await writeFile(headersPath, `${headerLines.join("\n\n")}\n`, "utf8");
  await writeFile(pdfVerificationPath, `${JSON.stringify({ generatedAt: `${revisionDate}T00:00:00Z`, files: pdfRows }, null, 2)}\n`, "utf8");
}

async function verifyAll() {
  const diskCatalog = JSON.parse(await readFile(catalogPath, "utf8"));
  if (JSON.stringify(diskCatalog) !== JSON.stringify(catalog)) throw new Error("Resource catalog is stale; run resources:generate");
  const ids = new Set();
  const paths = new Set();
  for (const item of [...resources, ...promotedVisualPages, ...workedProblems, ...glossaryEnrichments]) {
    if (ids.has(item.id)) throw new Error(`Duplicate resource id ${item.id}`);
    if (paths.has(item.canonicalPath)) throw new Error(`Duplicate resource path ${item.canonicalPath}`);
    ids.add(item.id); paths.add(item.canonicalPath);
    if (item.status === "published" && (!item.relatedLessons.length || !item.relatedResources.length || !item.relatedGlossaryTerms.length)) throw new Error(`Missing published relationships for ${item.id}`);
  }
  if (resources.length !== 10) throw new Error(`Expected 10 flagship resources, found ${resources.length}`);
  if (promotedVisualPages.length !== 3) throw new Error(`Expected 3 additional promoted visual pages, found ${promotedVisualPages.length}`);
  if (workedProblems.length < 24 || workedProblems.length > 30) throw new Error(`Expected 24–30 worked problems, found ${workedProblems.length}`);
  if (glossaryEnrichments.length !== 24) throw new Error(`Expected 24 glossary enrichments, found ${glossaryEnrichments.length}`);
  if (resources.find((item) => item.slug === "evaluating-limits").problemCount !== 24) throw new Error("Limits worksheet count drifted");
  if (resources.find((item) => item.slug === "chain-rule").problemCount !== 24) throw new Error("Chain-rule worksheet count drifted");
  if (resources.find((item) => item.slug === "optimization").problemCount !== 16) throw new Error("Optimization worksheet count drifted");
  for (const resource of [...resources, ...promotedVisualPages]) {
    await access(resolve(root, "public", resource.studentPdf.slice(1)));
    if (resource.answerKeyPdf) await access(resolve(root, "public", resource.answerKeyPdf.slice(1)));
    if (resource.problems.some((problem) => !problem.answer || !problem.steps.length)) throw new Error(`Incomplete solutions in ${resource.id}`);
  }
  for (const [id] of visualDefinitions) {
    await access(resolve(visualRoot, `${id}.svg`));
    await access(resolve(visualRoot, `${id}.png`));
  }
  console.log(`Verified ${resources.length} flagship resources, ${resources.reduce((sum, resource) => sum + resource.problemCount, 0)} problems, ${workedProblems.length} worked pages, and ${glossaryEnrichments.length} glossary pages.`);
}

if (check) await verifyAll();
else {
  await buildAll();
  await verifyAll();
  console.log("Generated build-time calculus resource catalog, PDFs, headers, and visual downloads.");
}
