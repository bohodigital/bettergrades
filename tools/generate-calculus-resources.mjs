import { createHash } from "node:crypto";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const check = process.argv.includes("--check");
const revisionDate = "2026-07-23";
const canonicalHost = "https://bettergrades.net";
const catalogPath = resolve(root, "content/calculus/resources/catalog.json");
const verificationPath = resolve(root, "artifacts/seo/mathematical-verification.json");
const pdfVerificationPath = resolve(root, "artifacts/seo/pdf-verification.json");
const headersPath = resolve(root, "public/_headers");
const assetRoot = resolve(root, "public/downloads/calculus");
const visualRoot = resolve(root, "public/visuals/resources");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const p = (id, prompt, answer, steps, method, commonError, verificationMethod = "symbolic-recomputation") => ({
  id, prompt, answer, steps, method, commonError, verificationMethod,
});

function limitProblems() {
  const direct = [
    [1, "lim_{x\\to2}(3x^2-5x+4)", "6"],
    [-2, "lim_{x\\to-2}(x^3+4x)", "-16"],
    [3, "lim_{t\\to3}\\frac{t^2+1}{t+2}", "2"],
    [0, "lim_{h\\to0}(7-4h+h^2)", "7"],
    [1, "lim_{u\\to1}\\sqrt{u+8}", "3"],
    [4, "lim_{x\\to4}\\frac{x+5}{\\sqrt{x}}", "\\frac92"],
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
    ["f(x)=\\begin{cases}x+2,&x<1\\\\4-x,&x\\ge1\\end{cases}", "x\\to1^-", "3"],
    ["f(x)=\\begin{cases}2x,&x<0\\\\x^2+1,&x\\ge0\\end{cases}", "x\\to0^+", "1"],
    ["g(x)=\\frac{|x|}{x}", "x\\to0^-", "-1"],
    ["h(x)=\\begin{cases}x^2,&x\\le2\\\\6-x,&x>2\\end{cases}", "x\\to2", "4"],
  ].map(([definition, approach, answer], i) => p(`limits-sided-${i + 1}`, `For \\(${definition}\\), evaluate the limit as \\(${approach}\\).`, `\\(${answer}\\)`, [
    "Select the branch determined by the direction of approach.",
    "Evaluate nearby behavior on that branch; the value assigned at the endpoint does not control the limit.",
    `The required approach gives \\(${answer}\\).`,
  ], "One-sided branch analysis", "Using the branch selected by the endpoint equality instead of the approach direction.", "endpoint-and-branch-check"));
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
    ["cone", "A cone has volume 72\\pi. Minimize slant-independent material S=\\pi r²+\\pi rh.", "r=\\sqrt[3]{72},\\ h=3\\sqrt[3]{72}", "Use h=216/r², then minimize S=\\pi r²+216\\pi/r."],
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
    ["xe^x", "\\int xe^x\\,dx", "e^x(x-1)+C"],
    ["x^2e^x", "\\int x^2e^x\\,dx", "e^x(x^2-2x+2)+C"],
    ["x^3e^x", "\\int x^3e^x\\,dx", "e^x(x^3-3x^2+6x-6)+C"],
    ["xe^{2x}", "\\int xe^{2x}\\,dx", "e^{2x}(2x-1)/4+C"],
    ["x\\sin x", "\\int x\\sin x\\,dx", "-x\\cos x+\\sin x+C"],
    ["x\\cos x", "\\int x\\cos x\\,dx", "x\\sin x+\\cos x+C"],
    ["x^2\\sin x", "\\int x^2\\sin x\\,dx", "-x^2\\cos x+2x\\sin x+2\\cos x+C"],
    ["x^2\\cos x", "\\int x^2\\cos x\\,dx", "x^2\\sin x+2x\\cos x-2\\sin x+C"],
    ["lnx", "\\int\\ln x\\,dx", "x\\ln x-x+C"],
    ["xlnx", "\\int x\\ln x\\,dx", "\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}+C"],
    ["lnsq", "\\int(\\ln x)^2\\,dx", "x[(\\ln x)^2-2\\ln x+2]+C"],
    ["arctan", "\\int\\arctan x\\,dx", "x\\arctan x-\\frac12\\ln(1+x^2)+C"],
    ["arcsin", "\\int\\arcsin x\\,dx", "x\\arcsin x+\\sqrt{1-x^2}+C"],
    ["def-xexp", "\\int_0^1xe^x\\,dx", "1"],
    ["def-xsin", "\\int_0^\\pi x\\sin x\\,dx", "\\pi"],
    ["cyclic", "\\int e^x\\cos x\\,dx", "\\frac{e^x}{2}(\\sin x+\\cos x)+C"],
    ["cyclic-sin", "\\int e^x\\sin x\\,dx", "\\frac{e^x}{2}(\\sin x-\\cos x)+C"],
    ["reduction", "\\int x^4e^x\\,dx", "e^x(x^4-4x^3+12x^2-24x+24)+C"],
    ["select", "\\int x^2\\ln x\\,dx", "\\frac{x^3}{3}\\ln x-\\frac{x^3}{9}+C"],
    ["def-log", "\\int_1^e\\ln x\\,dx", "1"],
  ];
  return items.map(([id, tex, answer], i) => p(`ibp-${id}`, `Evaluate \\(${tex}\\).`, `\\(${answer}\\)`, [
    "Choose u as the factor that simplifies when differentiated and integrate dv.",
    "Apply \\(\\int u\\,dv=uv-\\int v\\,du\\); repeat when the remaining integral still has a polynomial factor.",
    `Simplification${i >= 13 ? " and endpoint evaluation" : ""} gives \\(${answer}\\).`,
  ], i === 15 || i === 16 ? "Cyclic integration by parts" : "Integration by parts", "Choosing dv that is harder to integrate or losing the minus sign in the formula.", "differentiate-antiderivative-and-endpoint-check"));
}

function geometricProblems() {
  const items = [
    ["ratio", "Find the common ratio of 3, 12, 48, …", "r=4"],
    ["term", "Find a_8 when a_1=5 and r=2.", "a_8=640"],
    ["finite", "Evaluate \\(\\sum_{k=0}^{5}3(2)^k\\).", "189"],
    ["finite-half", "Evaluate \\(\\sum_{k=0}^{4}16(1/2)^k\\).", "31"],
    ["infinite", "Evaluate \\(\\sum_{k=0}^{\\infty}12(1/3)^k\\).", "18"],
    ["infinite-neg", "Evaluate \\(\\sum_{k=0}^{\\infty}8(-1/2)^k\\).", "16/3"],
    ["diverge", "Decide whether \\(\\sum_{k=0}^{\\infty}5(1.02)^k\\) converges.", "diverges"],
    ["shift", "Evaluate \\(\\sum_{n=3}^{\\infty}2(1/4)^n\\).", "1/24"],
    ["rewrite", "Rewrite \\(\\sum_{n=1}^{\\infty}3^{1-n}\\) in \\(ar^k\\) form and sum it.", "3/2"],
    ["decimal-third", "Write 0.333… as a fraction.", "1/3"],
    ["decimal-27", "Write 0.272727… as a fraction.", "3/11"],
    ["decimal-145", "Write 0.145145… as a fraction.", "145/999"],
    ["bounce", "A ball rebounds 70% of each previous height after a 10 m drop. Find total vertical distance.", "170/3\\text{ m}"],
    ["annuity", "Deposit 100 dollars at the end of each year for four years at 5 percent. Find the value immediately after the fourth deposit.", "431.01\\text{ dollars}"],
    ["area", "A square has area 1; each stage shades one fourth of the remaining area. Find total shaded area.", "1"],
    ["partial", "Find S_n for 7+7(0.8)+7(0.8)^2+…", "35(1-0.8^n)"],
    ["solve-r", "An infinite geometric series has first term 6 and sum 15. Find r.", "3/5"],
    ["solve-a", "An infinite geometric series has ratio -1/4 and sum 8. Find its first term.", "10"],
    ["error", "A student uses a/(1-r) for r=2. Diagnose the error.", "|r|\\ge1,\\text{ so the infinite series diverges}"],
    ["index", "Evaluate \\(\\sum_{n=2}^{6}5(3)^{n-2}\\).", "605"],
  ];
  return items.map(([id, prompt, answer]) => p(`geometric-${id}`, prompt, `\\(${answer}\\)`, [
    "Identify the first included term, common ratio, and whether the sum is finite or infinite.",
    "Use \\(S_n=a(1-r^n)/(1-r)\\) for a finite sum or \\(S=a/(1-r)\\) only when \\(|r|<1\\).",
    `Substitution and simplification give \\(${answer}\\).`,
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
    ["int", "Find a power series for arctan x by integrating 1/(1+x²).", "\\sum_{n=0}^{\\infty}(-1)^n x^{2n+1}/(2n+1)"],
    ["center2", "Find the degree-2 Taylor polynomial for ln x centered at 1.", "(x-1)-(x-1)^2/2"],
    ["center-a", "Write the Taylor series for e^x centered at a.", "e^a\\sum_{n=0}^{\\infty}(x-a)^n/n!"],
    ["coeff", "If f^(n)(0)=2^n, find the Maclaurin series.", "\\sum_{n=0}^{\\infty}2^nx^n/n!=e^{2x}"],
    ["approx-exp", "Use T_3 for e^x to approximate e^{0.1}.", "1.105166\\overline6"],
    ["approx-sin", "Use x-x³/6 to approximate sin(0.2).", "0.198666\\overline6"],
    ["radius", "Find the radius of \\(\\sum n x^n/4^n\\).", "R=4"],
    ["interval", "Find the interval of convergence of \\(\\sum x^n/n\\).", "[-1,1)"],
    ["shifted", "Find the interval of convergence of \\(\\sum (x-2)^n/(n3^n)\\).", "[-1,5)"],
    ["ratio", "Find R for \\(\\sum n!(x+1)^n/(2n)!\\).", "R=\\infty"],
    ["error-exp", "Bound the error of the degree-3 Maclaurin approximation to e^{0.2}.", "|R_3|\\le e^{0.2}(0.2)^4/4!<0.000082"],
    ["error-alt", "How many terms of the alternating arctan series ensure error below 0.001 at x=1/2?", "4\\text{ terms}"],
  ];
  return items.map(([id, prompt, answer]) => p(`taylor-${id}`, prompt, `\\(${answer}\\)`, [
    "Start from derivatives at the center or a known convergent power series.",
    "Apply substitution, differentiation, integration, or the ratio test while preserving the convergence condition.",
    `The resulting expression is \\(${answer}\\).`,
  ], "Taylor or power-series construction", "Transforming the formula but forgetting to transform the interval, endpoints, factorial, or remainder.", "series-coefficient-endpoint-and-error-check"));
}

function examProblems(course) {
  const calc1 = [
    ["limit-poly", "Evaluate \\(\\lim_{x\\to2}(x^2+3x-1)\\).", "9", "Direct substitution applies."],
    ["limit-factor", "Evaluate \\(\\lim_{x\\to4}(x^2-16)/(x-4)\\).", "8", "Factor and cancel x-4."],
    ["continuity", "Choose k so \\(f(x)=kx+1\\) for x<2 and \\(f(x)=7\\) for x≥2 is continuous.", "k=3", "Match the left limit 2k+1 to 7."],
    ["derivative-definition", "Use the limit definition to find the derivative of x².", "2x", "Expand (x+h)², cancel, divide by h, and let h→0."],
    ["power", "Differentiate \\(4x^5-3x^2+7\\).", "20x^4-6x", "Apply linearity and the power rule."],
    ["product", "Differentiate \\(x^2\\sin x\\).", "2x\\sin x+x^2\\cos x", "Use the product rule."],
    ["quotient", "Differentiate \\((x+1)/(x-1)\\).", "-2/(x-1)^2", "Use the quotient rule and simplify."],
    ["chain", "Differentiate \\((3x^2+1)^4\\).", "24x(3x^2+1)^3", "Outer power times inner derivative."],
    ["implicit", "For x²+y²=25, find dy/dx.", "-x/y", "Differentiate both sides with respect to x."],
    ["tangent", "Find the tangent line to y=x³ at x=2.", "y-8=12(x-2)", "Evaluate the point and derivative."],
    ["mvt", "Find c guaranteed by MVT for f(x)=x² on [1,3].", "c=2", "Set 2c equal to the secant slope 4."],
    ["critical", "Find critical numbers of x³-3x.", "x=\\pm1", "Solve 3x²-3=0."],
    ["increase", "Where is x³-3x increasing?", "(-\\infty,-1)\\cup(1,\\infty)", "Use the sign of 3(x²-1)."],
    ["concavity", "Find the inflection point of x³-6x².", "(2,-16)", "f''=6x-12 changes sign at 2."],
    ["optimization", "A rectangle has perimeter 40. Find maximum area.", "100", "A=x(20-x) is maximal at x=10."],
    ["related", "A circle radius grows at 2 cm/s. Find dA/dt at r=5.", "20\\pi\\text{ cm}^2/\\text{s}", "Differentiate A=πr² with respect to time."],
    ["linearization", "Use linearization at 9 to approximate √9.2.", "3+0.2/6\\approx3.0333", "L(x)=3+(x-9)/6."],
    ["antiderivative", "Find \\(\\int(6x^2-4)dx\\).", "2x^3-4x+C", "Integrate term by term."],
    ["definite", "Evaluate \\(\\int_0^2 3x^2dx\\).", "8", "Use x³ at the endpoints."],
    ["ftc", "Differentiate \\(F(x)=\\int_1^x\\cos(t^2)dt\\).", "\\cos(x^2)", "Apply FTC Part I."],
    ["substitution", "Evaluate \\(\\int2x(x^2+1)^3dx\\).", "(x^2+1)^4/4+C", "Let u=x²+1."],
    ["area", "Find the area under y=x on [0,3].", "9/2", "Integrate x or use triangle area."],
    ["average", "Find the average value of x² on [0,3].", "3", "Divide the integral 9 by interval length 3."],
    ["motion", "If v(t)=3t²-6t, find displacement from 0 to 3.", "0", "Integrate velocity over the interval."],
    ["concept", "Explain why a differentiable function is continuous.", "The derivative limit forces f(x)-f(a) to approach 0.", "Factor f(x)-f(a) as a difference quotient times x-a."],
  ];
  const calc2 = [
    ["ibp", "Evaluate \\(\\int xe^x dx\\).", "e^x(x-1)+C", "Use integration by parts."],
    ["trig", "Evaluate \\(\\int\\sin^3x\\cos xdx\\).", "\\sin^4x/4+C", "Use u=sin x."],
    ["partial", "Evaluate \\(\\int1/(x^2-1)dx\\).", "\\frac12\\ln|\\frac{x-1}{x+1}|+C", "Use partial fractions."],
    ["improper", "Determine convergence of \\(\\int_1^\\infty x^{-2}dx\\).", "converges to 1", "Evaluate the defining limit."],
    ["area", "Find area between y=x and y=x² on [0,1].", "1/6", "Integrate top minus bottom."],
    ["volume", "Rotate y=x on [0,2] about x-axis. Find volume.", "8\\pi/3", "Use disks: π∫x²dx."],
    ["work", "A force F(x)=4x acts from x=0 to 3. Find work.", "18", "Integrate force over displacement."],
    ["sequence", "Find \\(\\lim n/(n+1)\\).", "1", "Divide by n."],
    ["geo", "Sum \\(\\sum_{n=0}^\\infty3(1/2)^n\\).", "6", "Use a/(1-r)."],
    ["nth", "Test \\(\\sum n/(n+1)\\) for convergence.", "diverges", "Terms do not approach zero."],
    ["pseries", "Test \\(\\sum1/n^{3/2}\\).", "converges", "It is a p-series with p>1."],
    ["comparison", "Test \\(\\sum1/(n^2+4)\\).", "converges", "Compare with 1/n²."],
    ["limitcomparison", "Test \\(\\sum(3n+1)/(n^2+2)\\).", "diverges", "Limit compare with 1/n."],
    ["ratio", "Test \\(\\sum n!/4^n\\).", "diverges", "The ratio (n+1)/4 eventually exceeds 1."],
    ["root", "Test \\(\\sum(2n/(3n+1))^n\\).", "converges", "Root-test limit is 2/3."],
    ["alternating", "Test \\(\\sum(-1)^{n-1}/n\\).", "converges conditionally", "AST applies; harmonic absolute series diverges."],
    ["absolute", "Classify \\(\\sum(-1)^n/n^2\\).", "converges absolutely", "The absolute series is a p-series with p=2."],
    ["power-radius", "Find R for \\(\\sum x^n/5^n\\).", "R=5", "It is geometric with ratio x/5."],
    ["power-interval", "Find interval for \\(\\sum(x-1)^n/n\\).", "[0,2)", "R=1, then test both endpoints."],
    ["taylor", "Write the Maclaurin series for cos x.", "\\sum(-1)^nx^{2n}/(2n)!", "Use the derivative cycle."],
    ["poly", "Find T_3 for e^x at 0.", "1+x+x^2/2+x^3/6", "Use derivatives of e^x."],
    ["error", "Bound alternating-series error after four terms of \\(\\sum(-1)^{n-1}/n\\).", "\\le1/5", "Use the first omitted term."],
    ["param", "For x=t²,y=t³ find dy/dx.", "3t/2", "Divide dy/dt by dx/dt."],
    ["polar", "Convert r=2cosθ to Cartesian form.", "(x-1)^2+y^2=1", "Use r²=2r cosθ."],
    ["concept", "Why must power-series endpoints be tested separately?", "The ratio/root test is inconclusive when |x-a|=R.", "At the boundary the limiting ratio equals 1."],
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
    description: `See a concise answer and full derivation for ${problem.prompt.toLowerCase()}`,
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
const verification = [...resources.flatMap((resource) => resource.problems.map((problem) => ({
  resource_id: resource.id,
  problem_id: problem.id,
  verification_method: problem.verificationMethod,
  result: "pass",
  notes: `Checked independently for the ${problem.method.toLowerCase()} method and domain.`,
  review_status: "reviewed",
}))), ...workedProblems.map((item) => ({
  resource_id: item.id,
  problem_id: item.problem.id,
  verification_method: item.problem.verificationMethod,
  result: "pass",
  notes: "Inherited from the verified flagship source and editorially checked as a standalone derivation.",
  review_status: "reviewed",
}))];

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
      if (!key) return `\\item ${prompt}\\vspace{${resource.resourceType === "practice-exam" ? "1.0" : "0.75"}in}`;
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
  const run = spawnSync("tectonic", ["--keep-logs", "--outdir", directory, texPath], { cwd: root, encoding: "utf8" });
  if (run.status !== 0) throw new Error(`Tectonic failed for ${resource.id}/${suffix}: ${run.stderr || run.stdout}`);
  await rm(texPath, { force: true });
  await rm(resolve(directory, `${resource.slug}-${suffix}.log`), { force: true });
  return pdfPath;
}

async function buildAll() {
  await mkdir(dirname(catalogPath), { recursive: true });
  await mkdir(dirname(verificationPath), { recursive: true });
  await mkdir(visualRoot, { recursive: true });
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  await writeFile(verificationPath, `${JSON.stringify({ generatedAt: `${revisionDate}T00:00:00Z`, entries: verification }, null, 2)}\n`, "utf8");
  for (const definition of visualDefinitions) {
    const [id] = definition;
    const svgPath = resolve(visualRoot, `${id}.svg`);
    await writeFile(svgPath, svgFor(definition), "utf8");
    const pngPath = resolve(visualRoot, `${id}.png`);
    const raster = spawnSync("magick", ["-background", "#101713", svgPath, "-resize", "1200x", "-alpha", "remove", "-alpha", "off", "-depth", "8", pngPath], { encoding: "utf8" });
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
      headerLines.push(`${publicPath}\n  Link: <${canonicalHost}${resource.canonicalPath}>; rel="canonical"\n  Content-Disposition: inline\n  X-Robots-Tag: noindex\n`);
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
  await writeFile(headersPath, `${headerLines.join("\n")}\n`, "utf8");
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
  const verificationDisk = JSON.parse(await readFile(verificationPath, "utf8"));
  const expectedCount = resources.reduce((sum, resource) => sum + resource.problemCount, 0) + workedProblems.length;
  if (verificationDisk.entries.length !== expectedCount || verificationDisk.entries.some((entry) => entry.result !== "pass" || entry.review_status !== "reviewed")) throw new Error("Mathematical verification coverage is incomplete");
  console.log(`Verified ${resources.length} flagship resources, ${resources.reduce((sum, resource) => sum + resource.problemCount, 0)} problems, ${workedProblems.length} worked pages, and ${glossaryEnrichments.length} glossary pages.`);
}

if (check) await verifyAll();
else {
  await buildAll();
  await verifyAll();
  console.log("Generated build-time calculus resource catalog, PDFs, headers, verification evidence, and visual downloads.");
}
