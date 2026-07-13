export type ArticleArchetype = "answer" | "method" | "concept" | "decision";

export type LibraryTopic = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  sequence: number;
  accent: string;
};

export type LibraryArticle = {
  slug: string;
  topicSlug: string;
  archetype: ArticleArchetype;
  title: string;
  shortTitle: string;
  deck: string;
  course: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  minutes: number;
  formula?: string;
  immediate?: { label: string; tex?: string; text: string };
  sections: Array<{ heading: string; paragraphs: string[]; tex?: string }>;
  example: {
    heading: string;
    prompt: string;
    steps: Array<{ tex: string; note: string }>;
    result: string;
  };
  mistakes: string[];
  takeaways: string[];
  related: string[];
  searchTerms?: string[];
  reviewed: string;
  /** Canonical Better Grades LaTeX body. Legacy structured fields compile to this format when omitted. */
  documentSource?: string;
};

export const archetypes: Record<ArticleArchetype, { label: string; promise: string }> = {
  answer: { label: "Direct answer", promise: "The result first, followed by the reasoning and a clean verification." },
  method: { label: "Method guide", promise: "How to recognize the method, run it, and know when it is the wrong choice." },
  concept: { label: "Concept explainer", promise: "What the idea means, why its conditions matter, and where it connects." },
  decision: { label: "Decision guide", promise: "A practical comparison that turns a vague choice into a repeatable test." },
};

export const libraryTopics: LibraryTopic[] = [
  { slug: "limits-continuity", name: "Limits & Continuity", shortName: "Limits", description: "How functions behave near a point, when substitution is legal, and what continuity actually promises.", sequence: 1, accent: "01" },
  { slug: "derivatives", name: "Derivatives", shortName: "Derivatives", description: "Rules, structure, and the meaning of instantaneous change—from the chain rule to implicit curves.", sequence: 2, accent: "02" },
  { slug: "derivative-applications", name: "Applications of Derivatives", shortName: "Applications", description: "Use derivatives to model motion, optimize quantities, approximate values, and read the shape of a graph.", sequence: 3, accent: "03" },
  { slug: "integration-techniques", name: "Integration Techniques", shortName: "Integration", description: "Choose an antiderivative strategy from the structure of the integrand instead of guessing from a list.", sequence: 4, accent: "04" },
  { slug: "integration-applications", name: "Applications of Integration", shortName: "Accumulation", description: "Translate geometry and physical accumulation into integrals with units, bounds, and meaning intact.", sequence: 5, accent: "05" },
  { slug: "sequences-series", name: "Sequences & Series", shortName: "Series", description: "Decide convergence, work with power series, and understand what finite approximations can guarantee.", sequence: 6, accent: "06" },
];

export const libraryArticles: LibraryArticle[] = [
  {
    slug: "limit-of-sin-x-over-x", topicSlug: "limits-continuity", archetype: "answer",
    title: "Why is the limit of sin x over x equal to 1?", shortTitle: "Limit of sin x / x",
    deck: "A foundational limit whose real proof comes from geometry, not from plugging in zero and hoping.",
    course: "Calculus I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`\lim_{x\to0}\frac{\sin x}{x}=1`,
    immediate: { label: "Answer", tex: String.raw`\boxed{\displaystyle\lim_{x\to0}\frac{\sin x}{x}=1}`, text: "Near zero, sine and its input shrink at the same first-order rate when angles are measured in radians." },
    sections: [
      { heading: "Why direct substitution does not answer it", paragraphs: ["Substituting zero produces 0/0. That expression is not the value of the limit; it is a warning that two quantities are approaching zero and their relative rates still need to be compared.", "The limit asks about nearby nonzero inputs. The function can be undefined at zero and still approach a perfectly definite value there."] },
      { heading: "The geometric squeeze", paragraphs: ["On the unit circle, for a small positive angle x in radians, the vertical segment has length sin x, the arc has length x, and the tangent segment has length tan x. Their areas give sin x < x < tan x.", "After dividing carefully and using symmetry for negative x, cos x is less than sin x divided by x, which is less than 1. Both outside expressions approach 1."], tex: String.raw`\cos x\le \frac{\sin x}{x}\le1` },
      { heading: "Why radians matter", paragraphs: ["The arc length on the unit circle equals the angle only in radians. In degrees, the limit would carry a conversion factor. Calculus formulas look clean because radians build that factor into the definition of angle."] },
    ],
    example: { heading: "Use the canonical limit", prompt: "Evaluate the limit of sin(5x) divided by x as x approaches zero.", steps: [
      { tex: String.raw`\frac{\sin(5x)}{x}=5\frac{\sin(5x)}{5x}`, note: "Create the exact sin u / u pattern." },
      { tex: String.raw`u=5x\longrightarrow0`, note: "The inner quantity also approaches zero." },
      { tex: String.raw`5\lim_{u\to0}\frac{\sin u}{u}=5`, note: "Apply the canonical limit." },
    ], result: String.raw`\boxed{5}` },
    mistakes: ["Treating 0/0 as an answer instead of an indeterminate form.", "Using degrees without the conversion factor.", "Applying the fact when the inner expression does not approach zero."],
    takeaways: ["A missing function value does not prevent a limit.", "The proof is a squeeze built from unit-circle geometry.", "Recognize and manufacture the sin u / u pattern."],
    related: ["evaluating-indeterminate-limits", "squeeze-theorem", "continuity-at-a-point"], reviewed: "July 11, 2026",
  },
  {
    slug: "evaluating-indeterminate-limits", topicSlug: "limits-continuity", archetype: "method",
    title: "How to evaluate an indeterminate limit", shortTitle: "Indeterminate limits",
    deck: "A decision process for 0/0 and ∞/∞ that starts with algebra before reaching for a theorem.",
    course: "Calculus I", difficulty: "Foundational", minutes: 10,
    formula: String.raw`\frac00\quad\text{or}\quad\frac{\infty}{\infty}`,
    immediate: { label: "First move", text: "Substitute once. If the form is indeterminate, simplify the expression or expose a known limit; do not perform arithmetic with the symbols 0/0 or ∞/∞." },
    sections: [
      { heading: "Indeterminate does not mean nonexistent", paragraphs: ["The same form can hide many outcomes. A 0/0 limit may be zero, finite and nonzero, infinite, or nonexistent. The form tells you the current expression has not revealed enough information.", "Write the form beside your work, then change the expression while preserving equality for nearby inputs."] },
      { heading: "A reliable order of operations", paragraphs: ["For rational expressions, factor and cancel. For radicals, multiply by a conjugate. For trigonometric expressions, look for sin u / u or 1 minus cos u patterns. For growth at infinity, divide by the dominant power.", "L’Hôpital’s rule is useful only after its hypotheses are met. It should confirm structure, not replace basic algebra automatically."] },
      { heading: "Know when to stop", paragraphs: ["After simplification, substitute again. If the new expression is continuous at the target, the limit is finished. Repeated manipulation after the obstruction is gone creates mistakes rather than rigor."] },
    ],
    example: { heading: "Factor before differentiating", prompt: "Evaluate (x² − 9)/(x − 3) as x approaches 3.", steps: [
      { tex: String.raw`\frac{x^2-9}{x-3}\longrightarrow\frac00`, note: "Direct substitution identifies the obstruction." },
      { tex: String.raw`\frac{(x-3)(x+3)}{x-3}=x+3\quad(x\ne3)`, note: "Cancel for nearby inputs, which is exactly where a limit lives." },
      { tex: String.raw`\lim_{x\to3}(x+3)=6`, note: "Now substitution is legal." },
    ], result: String.raw`\boxed{6}` },
    mistakes: ["Writing 0/0 = 0 or 1.", "Canceling terms across addition instead of common factors.", "Using L’Hôpital’s rule before checking the form and hypotheses."],
    takeaways: ["The form diagnoses a problem; it does not determine the answer.", "Preserve equality for nearby nonzero inputs.", "Simplify, then substitute again."],
    related: ["limit-of-sin-x-over-x", "infinite-limits-and-asymptotes", "squeeze-theorem"], reviewed: "July 11, 2026",
  },
  {
    slug: "continuity-at-a-point", topicSlug: "limits-continuity", archetype: "concept",
    title: "What continuity at a point really requires", shortTitle: "Continuity at a point",
    deck: "Three conditions, one precise promise: nearby inputs produce nearby outputs without a break at the point.",
    course: "Calculus I", difficulty: "Foundational", minutes: 7,
    formula: String.raw`\lim_{x\to a}f(x)=f(a)`,
    immediate: { label: "Definition", tex: String.raw`\boxed{\lim_{x\to a}f(x)=f(a)}`, text: "The function must be defined at a, its two-sided limit must exist, and that limit must equal the assigned value." },
    sections: [
      { heading: "The three-condition checklist", paragraphs: ["First, f(a) must exist. Second, the left- and right-hand limits must agree. Third, the shared limit must equal f(a). Missing any one condition produces a discontinuity.", "This separates holes, jumps, and vertical blowups instead of calling every visual break the same thing."] },
      { heading: "Continuity is local", paragraphs: ["A function can be continuous at one point and fail nearby. The definition makes a claim only about inputs sufficiently close to a and the value at a itself.", "For familiar elementary functions, continuity lets you evaluate limits by substitution wherever the expression is defined."] },
      { heading: "Repairing a removable discontinuity", paragraphs: ["If the limit exists but the function value is missing or wrong, assigning the limiting value repairs the point. This changes one output without changing the nearby rule."] },
    ],
    example: { heading: "Choose the value that closes the hole", prompt: "Define f(2) so that (x² − 4)/(x − 2) becomes continuous at x = 2.", steps: [
      { tex: String.raw`\frac{x^2-4}{x-2}=x+2\quad(x\ne2)`, note: "Factor and simplify the nearby behavior." },
      { tex: String.raw`\lim_{x\to2}f(x)=4`, note: "The limit exists even before the missing value is assigned." },
      { tex: String.raw`f(2)=4`, note: "Match the point value to the limit." },
    ], result: String.raw`\boxed{f(2)=4}` },
    mistakes: ["Checking only that f(a) exists.", "Assuming a graph is continuous because the pieces touch visually.", "Using a two-sided limit when the domain naturally ends at the point."],
    takeaways: ["Defined, limit exists, and values match.", "Continuity turns many limits into substitution.", "A removable hole can be repaired with one value."],
    related: ["evaluating-indeterminate-limits", "squeeze-theorem", "mean-value-theorem"], reviewed: "July 11, 2026",
  },
  {
    slug: "squeeze-theorem", topicSlug: "limits-continuity", archetype: "method",
    title: "How and when to use the Squeeze Theorem", shortTitle: "Squeeze Theorem",
    deck: "Trap a difficult function between two easier functions that are forced to meet at the same limit.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 8,
    formula: String.raw`g(x)\le f(x)\le h(x)`,
    immediate: { label: "Use it when", text: "Use the Squeeze Theorem when the target oscillates or resists direct algebra, but its size can be bounded by expressions with the same limit." },
    sections: [
      { heading: "The theorem", paragraphs: ["If g(x) is less than or equal to f(x), and f(x) is less than or equal to h(x) near a, and both outer functions approach L, then f(x) must also approach L.", "The inequalities need to hold in a deleted neighborhood of the point, not necessarily at the point itself."], tex: String.raw`\lim_{x\to a}g(x)=\lim_{x\to a}h(x)=L\Longrightarrow\lim_{x\to a}f(x)=L` },
      { heading: "Look for a bounded factor", paragraphs: ["Sine and cosine always stay between −1 and 1. If an oscillating factor is multiplied by something approaching zero, absolute values often create the two useful bounds immediately.", "The method is less about finding two magical functions than about controlling magnitude."] },
      { heading: "Why matching outer limits matter", paragraphs: ["If the bounds approach different numbers, the target still has room to move. The theorem becomes decisive only when the interval between the bounds collapses to a single value."] },
    ],
    example: { heading: "Control an oscillating function", prompt: "Evaluate x² sin(1/x) as x approaches zero.", steps: [
      { tex: String.raw`-1\le\sin(1/x)\le1`, note: "Bound the oscillating factor." },
      { tex: String.raw`-x^2\le x^2\sin(1/x)\le x^2`, note: "Multiply by the nonnegative shrinking factor." },
      { tex: String.raw`\lim_{x\to0}(-x^2)=\lim_{x\to0}x^2=0`, note: "The outside functions meet." },
    ], result: String.raw`\boxed{0}` },
    mistakes: ["Using bounds that do not hold on both sides of the point.", "Choosing outer functions with different limits.", "Multiplying an inequality by a quantity of unknown sign without checking direction."],
    takeaways: ["Control magnitude when exact simplification is impossible.", "Absolute values make oscillation easier to bound.", "Both outer limits must meet."],
    related: ["limit-of-sin-x-over-x", "evaluating-indeterminate-limits", "continuity-at-a-point"], reviewed: "July 11, 2026",
  },
  {
    slug: "infinite-limits-and-asymptotes", topicSlug: "limits-continuity", archetype: "concept",
    title: "Infinite limits and vertical asymptotes", shortTitle: "Infinite limits",
    deck: "Infinity describes unbounded behavior, not a number a function eventually reaches.",
    course: "Calculus I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`\lim_{x\to a^+}f(x)=\infty`,
    immediate: { label: "Meaning", text: "An infinite limit says outputs can be made arbitrarily large in magnitude by taking inputs sufficiently close to the target from the stated side." },
    sections: [
      { heading: "Infinity is behavior", paragraphs: ["The notation does not claim the limit exists as a real number. It records that the function grows without bound. That distinction matters when applying limit laws and interpreting graphs.", "One-sided notation is essential because the two sides of a vertical asymptote may head in opposite directions."] },
      { heading: "Finding the sign on each side", paragraphs: ["Factor the denominator and use a sign chart near the suspect point. A tiny positive denominator and a positive numerator produce positive infinity; a tiny negative denominator reverses the direction.", "Do not rely on a calculator snapshot, which can hide behavior behind scale or sampling."] },
      { heading: "Vertical versus horizontal asymptotes", paragraphs: ["Vertical asymptotes come from inputs approaching a finite boundary. Horizontal asymptotes describe outputs as inputs head to positive or negative infinity. A function may cross a horizontal asymptote; the statement concerns end behavior."] },
    ],
    example: { heading: "Read both sides", prompt: "Analyze 1/(x − 2) near x = 2.", steps: [
      { tex: String.raw`x\to2^-\Longrightarrow x-2<0`, note: "The denominator is a tiny negative number." },
      { tex: String.raw`\lim_{x\to2^-}\frac1{x-2}=-\infty`, note: "The left side decreases without bound." },
      { tex: String.raw`\lim_{x\to2^+}\frac1{x-2}=+\infty`, note: "The right side increases without bound." },
    ], result: String.raw`\boxed{x=2\text{ is a vertical asymptote}}` },
    mistakes: ["Treating infinity as a number that can be substituted.", "Reporting a two-sided infinite limit when the sides disagree.", "Assuming every denominator zero creates an asymptote without checking cancellation."],
    takeaways: ["Use one-sided limits near vertical asymptotes.", "Sign analysis determines positive or negative infinity.", "Check for removable cancellation first."],
    related: ["evaluating-indeterminate-limits", "continuity-at-a-point", "curve-sketching-from-derivatives"], reviewed: "July 11, 2026",
  },

  {
    slug: "derivative-of-x-to-the-x", topicSlug: "derivatives", archetype: "answer",
    title: "What is the derivative of x to the x?", shortTitle: "Derivative of xˣ",
    deck: "The base and exponent both vary, so neither the ordinary power rule nor the simple exponential rule works alone.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 7,
    formula: String.raw`\frac{d}{dx}x^x=x^x(\ln x+1)`,
    immediate: { label: "Answer", tex: String.raw`\boxed{\frac{d}{dx}x^x=x^x(\ln x+1)}\qquad(x>0)`, text: "Take logarithms first so the variable exponent becomes a product." },
    sections: [
      { heading: "Why the usual rules do not fit", paragraphs: ["The power rule assumes a constant exponent. The derivative of a to the x assumes a constant base. In x to the x, both move, so applying either rule by itself drops part of the change.", "Logarithmic differentiation turns the exponent into multiplication, where the product rule can see both contributions."] },
      { heading: "The logarithmic step", paragraphs: ["Set y equal to x to the x and take natural logs: ln y = x ln x. Differentiate implicitly, remembering that y is a function of x.", "Multiplying by y at the end restores the original exponential expression."], tex: String.raw`\frac{y'}y=\ln x+1` },
      { heading: "Domain note", paragraphs: ["The real-valued logarithmic derivation is cleanest for x greater than zero. Extensions to selected negative rational inputs require more careful domain analysis and do not define one smooth real function on all negative x."] },
    ],
    example: { heading: "Differentiate and evaluate", prompt: "Find the slope of y = xˣ at x = e.", steps: [
      { tex: String.raw`y'=x^x(\ln x+1)`, note: "Use logarithmic differentiation." },
      { tex: String.raw`y'(e)=e^e(\ln e+1)`, note: "Substitute x = e." },
      { tex: String.raw`\ln e=1`, note: "Simplify the logarithm." },
    ], result: String.raw`\boxed{2e^e}` },
    mistakes: ["Writing x·x^(x−1) and treating the exponent as constant.", "Forgetting the chain-rule factor y′/y after differentiating ln y.", "Omitting the positive-domain assumption."],
    takeaways: ["Variable exponents suggest logarithms.", "Differentiate x ln x with the product rule.", "Substitute y = xˣ back only at the end."],
    related: ["logarithmic-differentiation", "chain-rule", "implicit-differentiation"], reviewed: "July 11, 2026",
  },
  {
    slug: "chain-rule", topicSlug: "derivatives", archetype: "method",
    title: "The Chain Rule as a structure-reading skill", shortTitle: "Chain Rule",
    deck: "Differentiate the outside function, keep the inside intact, then multiply by the inside rate.",
    course: "Calculus I", difficulty: "Foundational", minutes: 9,
    formula: String.raw`\frac{d}{dx}f(g(x))=f'(g(x))g'(x)`,
    immediate: { label: "Pattern", tex: String.raw`\boxed{\bigl(f(g(x))\bigr)'=f'(g(x))g'(x)}`, text: "Use the Chain Rule whenever one varying expression has been substituted inside another function." },
    sections: [
      { heading: "See layers, not symbols", paragraphs: ["Ask what the last operation performed is. In sin(x²), squaring happens first and sine happens last, so sine is the outside layer and x² is the inside layer.", "Peel one layer at a time. Deep compositions may require the rule repeatedly."] },
      { heading: "Why the inner derivative appears", paragraphs: ["The outer output changes according to its own slope, but its input is moving at the rate g′(x). Multiplying the rates accounts for both parts of the dependency.", "Units tell the same story: output per inner unit times inner units per x-unit gives output per x-unit."] },
      { heading: "A dependable notation", paragraphs: ["Temporarily name the inside u when the structure is crowded. Differentiate with respect to u, then multiply by du/dx. The substitution is organizational, not a separate theorem."] },
    ],
    example: { heading: "Differentiate three layers", prompt: "Differentiate (1 + e^(3x))⁵.", steps: [
      { tex: String.raw`5(1+e^{3x})^4`, note: "Differentiate the fifth-power layer." },
      { tex: String.raw`\cdot e^{3x}`, note: "Differentiate the 1 + exponential layer." },
      { tex: String.raw`\cdot3`, note: "Differentiate the exponent 3x." },
    ], result: String.raw`\boxed{15e^{3x}(1+e^{3x})^4}` },
    mistakes: ["Differentiating the inside but forgetting the outside derivative.", "Replacing the inside with its derivative instead of multiplying.", "Stopping after one layer in a nested composition."],
    takeaways: ["Identify the last operation first.", "Keep the inside intact while differentiating the outside.", "Multiply by every inner rate encountered."],
    related: ["implicit-differentiation", "logarithmic-differentiation", "linear-approximation"], reviewed: "July 11, 2026",
  },
  {
    slug: "implicit-differentiation", topicSlug: "derivatives", archetype: "method",
    title: "Implicit differentiation without losing dy/dx", shortTitle: "Implicit differentiation",
    deck: "Differentiate an equation whose y-values are not isolated, treating y as a function of x every time it appears.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`\frac{d}{dx}f(x,y)=0`,
    immediate: { label: "Core move", text: "Differentiate both sides with respect to x, attach y′ whenever a y-expression is differentiated, then solve algebraically for y′." },
    sections: [
      { heading: "Why y′ appears", paragraphs: ["Even when the equation does not solve explicitly for y, the curve still makes y depend on x locally. Differentiating y² therefore requires the Chain Rule and produces 2y y′.", "The extra factor records how quickly y changes as x changes along the curve."] },
      { heading: "A practical workflow", paragraphs: ["Differentiate term by term, marking each y-dependent term. Move every term containing y′ to one side, factor y′, and divide by the remaining coefficient.", "Keep x and y in the final derivative unless the problem asks for a slope at a specific point."] },
      { heading: "When the derivative fails", paragraphs: ["If the coefficient of y′ becomes zero, the curve may have a vertical tangent or the local function description may fail. The algebra is revealing geometry, not merely causing a denominator problem."] },
    ],
    example: { heading: "Slope on a circle", prompt: "Find dy/dx for x² + y² = 25.", steps: [
      { tex: String.raw`2x+2y\,y'=0`, note: "Differentiate both variables; y² needs the Chain Rule." },
      { tex: String.raw`2y\,y'=-2x`, note: "Collect the derivative term." },
      { tex: String.raw`y'=-\frac{x}{y}`, note: "Solve for y′." },
    ], result: String.raw`\boxed{\dfrac{dy}{dx}=-\dfrac{x}{y}}` },
    mistakes: ["Writing the derivative of y² as 2y without y′.", "Substituting point coordinates before solving for the derivative.", "Assuming one equation always describes y as a single global function of x."],
    takeaways: ["Every differentiated y-term gets a chain factor y′.", "Solve for y′ after differentiating the whole equation.", "A zero denominator often signals a vertical tangent."],
    related: ["chain-rule", "related-rates", "logarithmic-differentiation"], reviewed: "July 11, 2026",
  },
  {
    slug: "logarithmic-differentiation", topicSlug: "derivatives", archetype: "method",
    title: "When logarithmic differentiation is the clean move", shortTitle: "Logarithmic differentiation",
    deck: "Use logarithms to untangle variable exponents and products or quotients with many factors.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`\ln y=\ln(f(x))`,
    immediate: { label: "Use it when", text: "Choose logarithmic differentiation for variable powers such as f(x)^g(x), or when expanding a product with ordinary rules would create avoidable clutter." },
    sections: [
      { heading: "What logarithms simplify", paragraphs: ["Logarithms move exponents down as factors, turn products into sums, and turn quotients into differences. Those transformations align directly with familiar derivative rules.", "The method does not change the function; it rewrites the relationship in a derivative-friendly form."] },
      { heading: "The hidden implicit step", paragraphs: ["After taking ln y, differentiation produces y′/y on the left. This is implicit differentiation, so forgetting the inner derivative y′ loses the quantity being solved for.", "Multiply by y after differentiating, then replace y with the original expression."] },
      { heading: "Absolute values and domains", paragraphs: ["For products that may change sign, ln|y| gives the same derivative y′/y wherever y is nonzero. Domain conditions should be stated instead of silently discarded."] },
    ],
    example: { heading: "Differentiate a variable power", prompt: "Differentiate y = (x² + 1)^x.", steps: [
      { tex: String.raw`\ln y=x\ln(x^2+1)`, note: "Bring the variable exponent down." },
      { tex: String.raw`\frac{y'}y=\ln(x^2+1)+\frac{2x^2}{x^2+1}`, note: "Use the product and Chain Rules." },
      { tex: String.raw`y'=(x^2+1)^x\left[\ln(x^2+1)+\frac{2x^2}{x^2+1}\right]`, note: "Multiply by y and substitute back." },
    ], result: String.raw`\boxed{(x^2+1)^x\left[\ln(x^2+1)+\dfrac{2x^2}{x^2+1}\right]}` },
    mistakes: ["Forgetting y′ when differentiating ln y.", "Applying log properties to sums, such as ln(a+b) = ln a + ln b.", "Failing to substitute the original y back into the result."],
    takeaways: ["Logs turn powers into products.", "The left side differentiates to y′/y.", "State domain restrictions when logarithms are introduced."],
    related: ["derivative-of-x-to-the-x", "implicit-differentiation", "product-rule-vs-quotient-rule"], reviewed: "July 11, 2026",
  },
  {
    slug: "product-rule-vs-quotient-rule", topicSlug: "derivatives", archetype: "decision",
    title: "Product Rule or Quotient Rule?", shortTitle: "Product vs. quotient",
    deck: "Choose the derivative rule from the top-level operation—and simplify first when algebra can remove the choice entirely.",
    course: "Calculus I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`(fg)'=f'g+fg'`,
    immediate: { label: "Decision", text: "Use the Product Rule when two varying factors are multiplied. Use the Quotient Rule for a genuine ratio, unless rewriting with powers makes the Chain and Product Rules cleaner." },
    sections: [
      { heading: "Read the top-level operation", paragraphs: ["Parentheses matter. In x² sin x, multiplication is the final operation, so use the Product Rule. In sin(x²), sine is the final operation, so use the Chain Rule instead.", "A quotient can be rewritten as multiplication by a negative power, but that is only helpful when the rewritten structure is simpler."] },
      { heading: "Simplify before differentiating", paragraphs: ["Cancel common factors, split simple fractions, and combine powers before committing to a rule. A shorter equivalent expression usually produces a shorter derivative and fewer sign errors.", "Do not cancel terms across addition; simplification must remain algebraically valid."] },
      { heading: "Why both terms are necessary", paragraphs: ["In a product, each factor changes while the other provides scale. The derivative includes one contribution from f changing and another from g changing. Keeping only f′g misses half the motion."] },
    ],
    example: { heading: "Rewrite the quotient", prompt: "Differentiate (x² + 1)/x.", steps: [
      { tex: String.raw`\frac{x^2+1}{x}=x+x^{-1}`, note: "Split the quotient before choosing a rule." },
      { tex: String.raw`\frac{d}{dx}(x+x^{-1})=1-x^{-2}`, note: "Differentiate term by term." },
      { tex: String.raw`1-\frac1{x^2}`, note: "Return to a conventional form." },
    ], result: String.raw`\boxed{1-\dfrac1{x^2}}` },
    mistakes: ["Using f′g′ for the derivative of a product.", "Reversing the numerator order in the Quotient Rule.", "Using a large rule before checking for a simple algebraic rewrite."],
    takeaways: ["Identify the final operation.", "Simplify first whenever possible.", "Products need two derivative contributions."],
    related: ["chain-rule", "logarithmic-differentiation", "curve-sketching-from-derivatives"], reviewed: "July 11, 2026",
  },

  {
    slug: "related-rates", topicSlug: "derivative-applications", archetype: "method",
    title: "Related rates: translate the geometry before differentiating", shortTitle: "Related rates",
    deck: "Connect changing quantities with one equation, differentiate with respect to time, and substitute only after the rates appear.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`\frac{d}{dt}f(x(t),y(t))=0`,
    immediate: { label: "Workflow", text: "Draw the situation, name time-dependent quantities, write one equation, differentiate implicitly with respect to time, then substitute the instant’s values." },
    sections: [
      { heading: "Rates belong to a moment", paragraphs: ["A related-rates problem supplies values at a particular instant, not constants valid for all time. Substituting them before differentiating can erase the dependency that creates the requested rate.", "Keep every changing quantity as a function of time until the derivative equation is formed."] },
      { heading: "Choose the connecting equation", paragraphs: ["The geometry or physical constraint is the bridge between known and unknown rates. For a circle use area or circumference; for a right triangle use the Pythagorean theorem; for a cone use similar triangles when dimensions co-vary.", "Use the equation with the fewest unneeded variables."] },
      { heading: "Signs and units are part of the answer", paragraphs: ["A decreasing length has a negative rate. A positive computed rate may contradict a draining or shrinking description if signs were assigned carelessly.", "Track units through every derivative: area changes in square units per time, while length changes in units per time."] },
    ],
    example: { heading: "A growing circular ripple", prompt: "A circle’s radius grows at 3 cm/s. How fast is its area growing when r = 4 cm?", steps: [
      { tex: String.raw`A=\pi r^2`, note: "Connect area and radius." },
      { tex: String.raw`\frac{dA}{dt}=2\pi r\frac{dr}{dt}`, note: "Differentiate with respect to time." },
      { tex: String.raw`\frac{dA}{dt}=2\pi(4)(3)`, note: "Substitute the instant’s radius and known rate." },
    ], result: String.raw`\boxed{24\pi\ \text{cm}^2/\text{s}}` },
    mistakes: ["Substituting the snapshot values before differentiating.", "Forgetting a chain factor such as dr/dt.", "Reporting a magnitude without the sign or units."],
    takeaways: ["Model first, differentiate second, substitute last.", "Every changing variable contributes a time derivative.", "Check whether the sign matches the story."],
    related: ["implicit-differentiation", "optimization", "linear-approximation"], reviewed: "July 11, 2026",
  },
  {
    slug: "optimization", topicSlug: "derivative-applications", archetype: "method",
    title: "A calculus optimization workflow that does not skip the model", shortTitle: "Optimization",
    deck: "Turn a word problem into one objective function, then use calculus and endpoint checks to justify the best feasible value.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 12,
    formula: String.raw`f'(x)=0`,
    immediate: { label: "Workflow", text: "Identify the quantity to maximize or minimize, use constraints to write it in one variable, determine the feasible interval, then compare critical points and endpoints." },
    sections: [
      { heading: "Objective versus constraint", paragraphs: ["The objective is the quantity being optimized: area, cost, distance, or time. Constraints describe what combinations are allowed. Mixing them produces an equation with too many variables and no clear target.", "Use the constraint to eliminate variables from the objective before differentiating."] },
      { heading: "The feasible domain matters", paragraphs: ["Physical lengths cannot be negative, capacities may be bounded, and denominators may exclude values. The domain is part of the model and determines which critical points are candidates.", "On a closed interval, endpoints must be compared with interior critical points."] },
      { heading: "Justify the optimum", paragraphs: ["A zero derivative identifies a stationary candidate, not automatically a maximum. Use sign changes, the second derivative, or direct value comparison to justify the conclusion.", "State the requested quantity in context rather than ending with an unexplained variable value."] },
    ],
    example: { heading: "Maximum area with fixed perimeter", prompt: "A rectangle has perimeter 40. Which dimensions maximize its area?", steps: [
      { tex: String.raw`2x+2y=40\Longrightarrow y=20-x`, note: "Use the perimeter constraint." },
      { tex: String.raw`A(x)=x(20-x)=20x-x^2`, note: "Write area in one variable." },
      { tex: String.raw`A'(x)=20-2x=0\Longrightarrow x=10`, note: "Find the interior critical point." },
    ], result: String.raw`\boxed{10\times10\text{ square; maximum area }100}` },
    mistakes: ["Differentiating the constraint instead of the objective.", "Keeping two independent variables after a constraint is available.", "Ignoring endpoints or feasibility."],
    takeaways: ["Name the objective explicitly.", "Reduce to one variable before differentiating.", "A critical point needs a maximum or minimum justification."],
    related: ["related-rates", "curve-sketching-from-derivatives", "mean-value-theorem"], reviewed: "July 11, 2026",
  },
  {
    slug: "linear-approximation", topicSlug: "derivative-applications", archetype: "concept",
    title: "Linear approximation: use the tangent line as a local calculator", shortTitle: "Linear approximation",
    deck: "Near a known input, a smooth function behaves like its tangent line—and the derivative measures the approximation’s sensitivity.",
    course: "Calculus I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`L(x)=f(a)+f'(a)(x-a)`,
    immediate: { label: "Approximation", tex: String.raw`\boxed{f(x)\approx f(a)+f'(a)(x-a)}`, text: "Choose a nearby input a where both the function and derivative are easy to evaluate." },
    sections: [
      { heading: "Why the tangent line works", paragraphs: ["Differentiability means the error between the function and its best linear model becomes small compared with the input change. The tangent line matches both the value and first-order rate at a.", "The approximation is local. Moving far from a lets curvature accumulate and weakens the estimate."] },
      { heading: "Choose the center strategically", paragraphs: ["Pick a close value with simple arithmetic: a perfect square for square roots, a familiar angle for trig, or zero for exponentials and logarithms when allowed.", "A closer center usually improves accuracy, but simplicity and distance should be balanced."] },
      { heading: "Differentials and error estimates", paragraphs: ["Writing dy = f′(a) dx expresses the predicted output change. It is useful for sensitivity and measurement error: a small input uncertainty is scaled by the local derivative."] },
    ],
    example: { heading: "Estimate a square root", prompt: "Approximate √4.1 without a calculator.", steps: [
      { tex: String.raw`f(x)=\sqrt{x},\qquad a=4`, note: "Center at the nearby perfect square." },
      { tex: String.raw`f(4)=2,\qquad f'(4)=\frac14`, note: "Compute the known value and local slope." },
      { tex: String.raw`L(4.1)=2+\frac14(0.1)`, note: "Apply the linear model." },
    ], result: String.raw`\boxed{\sqrt{4.1}\approx2.025}` },
    mistakes: ["Using x instead of x−a in the tangent formula.", "Choosing a center that is easy but not close.", "Treating a local approximation as exact."],
    takeaways: ["Match value and slope at a convenient nearby point.", "The derivative predicts small output changes.", "Curvature controls how quickly the approximation degrades."],
    related: ["mean-value-theorem", "chain-rule", "taylor-series-remainder"], reviewed: "July 11, 2026",
  },
  {
    slug: "mean-value-theorem", topicSlug: "derivative-applications", archetype: "concept",
    title: "What the Mean Value Theorem actually guarantees", shortTitle: "Mean Value Theorem",
    deck: "Some instantaneous rate must match the average rate—provided continuity and differentiability hold where required.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 8,
    formula: String.raw`f'(c)=\frac{f(b)-f(a)}{b-a}`,
    immediate: { label: "Guarantee", tex: String.raw`\boxed{\exists c\in(a,b):\ f'(c)=\frac{f(b)-f(a)}{b-a}}`, text: "The function must be continuous on the closed interval and differentiable on its interior." },
    sections: [
      { heading: "Average slope meets tangent slope", paragraphs: ["The secant line from a to b records total change divided by total input change. The theorem says a smooth graph has at least one interior tangent parallel to that secant.", "It guarantees existence, not uniqueness, and it may not tell you where c is without solving an equation."] },
      { heading: "Why the hypotheses are not decoration", paragraphs: ["A jump can avoid intermediate behavior, and a sharp corner can prevent the required derivative. Continuity on the closed interval and differentiability inside rule out those escape routes.", "Always state the hypotheses before invoking the conclusion."] },
      { heading: "The theorem as a proof engine", paragraphs: ["If a derivative is zero everywhere, the Mean Value Theorem proves the function is constant. Bounds on a derivative also produce bounds on total change, connecting local rates to global behavior."] },
    ],
    example: { heading: "Find the guaranteed point", prompt: "For f(x) = x² on [1, 3], find c from the Mean Value Theorem.", steps: [
      { tex: String.raw`\frac{f(3)-f(1)}{3-1}=\frac{9-1}{2}=4`, note: "Compute the average slope." },
      { tex: String.raw`f'(x)=2x`, note: "Find the instantaneous slope." },
      { tex: String.raw`2c=4\Longrightarrow c=2`, note: "Match the two rates." },
    ], result: String.raw`\boxed{c=2}` },
    mistakes: ["Checking differentiability at the endpoints instead of on the open interval.", "Assuming c must be the midpoint.", "Using the theorem when the function has a discontinuity or corner inside."],
    takeaways: ["Check hypotheses first.", "Match derivative to secant slope.", "The theorem guarantees at least one point, not exactly one."],
    related: ["continuity-at-a-point", "linear-approximation", "curve-sketching-from-derivatives"], reviewed: "July 11, 2026",
  },
  {
    slug: "curve-sketching-from-derivatives", topicSlug: "derivative-applications", archetype: "method",
    title: "Curve sketching from first and second derivatives", shortTitle: "Curve sketching",
    deck: "Build a graph from domain, intercepts, asymptotes, monotonicity, extrema, concavity, and end behavior—in that order.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 12,
    formula: String.raw`f'\text{ controls direction},\qquad f''\text{ controls bending}`,
    immediate: { label: "Reading rule", text: "Use the sign of f′ to determine increasing and decreasing intervals; use the sign of f″ to determine concavity. Critical numbers and inflection candidates organize the sign chart." },
    sections: [
      { heading: "Start before the derivatives", paragraphs: ["Record the domain, symmetry, intercepts, and asymptotes first. These facts create the canvas on which derivative information must fit.", "A sign chart cannot repair a graph that ignores a domain break or vertical asymptote."] },
      { heading: "First derivative: direction", paragraphs: ["Critical numbers occur where f′ is zero or undefined while f remains defined. Test intervals between them. A positive-to-negative sign change gives a local maximum; negative-to-positive gives a local minimum.", "A zero derivative without a sign change is a stationary point, not an extremum."] },
      { heading: "Second derivative: shape", paragraphs: ["Positive f″ means slopes are increasing and the graph is concave up. Negative f″ means slopes are decreasing and the graph is concave down.", "An inflection point requires a change in concavity. Solving f″ = 0 only produces candidates."] },
    ],
    example: { heading: "Read a cubic", prompt: "Analyze f(x) = x³ − 3x.", steps: [
      { tex: String.raw`f'(x)=3x^2-3=3(x-1)(x+1)`, note: "Critical numbers are −1 and 1." },
      { tex: String.raw`f''(x)=6x`, note: "Concavity changes at zero." },
      { tex: String.raw`f(-1)=2,\quad f(1)=-2,\quad f(0)=0`, note: "Anchor extrema and the inflection point." },
    ], result: String.raw`\boxed{\text{max }(-1,2),\ \text{min }(1,-2),\ \text{inflection }(0,0)}` },
    mistakes: ["Calling every f′ = 0 point an extremum.", "Calling every f″ = 0 point an inflection point.", "Skipping domain and asymptote analysis."],
    takeaways: ["Domain and end behavior frame the graph.", "Sign changes matter more than zeros alone.", "Combine first- and second-derivative information in one coherent sketch."],
    related: ["optimization", "mean-value-theorem", "infinite-limits-and-asymptotes"], reviewed: "July 11, 2026",
  },

  {
    slug: "u-substitution", topicSlug: "integration-techniques", archetype: "method",
    title: "u-substitution as the reverse Chain Rule", shortTitle: "u-substitution",
    deck: "Replace a repeated inner expression and its derivative with one variable so the antiderivative’s structure becomes visible.",
    course: "Calculus I", difficulty: "Foundational", minutes: 9,
    formula: String.raw`u=g(x),\qquad du=g'(x)\,dx`,
    immediate: { label: "Recognition test", text: "Look for a composite expression g(x) together with a constant multiple of g′(x). If both are present, substitution is usually the clean first move." },
    sections: [
      { heading: "What the substitution accomplishes", paragraphs: ["The method is not a letter swap. It packages an inside function and its differential so the integral becomes a familiar basic form.", "A successful substitution removes every x. If x remains, either rewrite it using u or choose a different substitution."] },
      { heading: "Constant multiples are harmless", paragraphs: ["The derivative does not need to appear exactly. If it differs by a nonzero constant, factor that constant in or out. What matters is structural proportionality.", "Do not invent a missing variable factor; constants can be adjusted, variable expressions cannot."] },
      { heading: "Definite integrals have two clean options", paragraphs: ["Either find an antiderivative in u and return to x before using the original bounds, or convert the bounds to u and stay in u. Mixing x-bounds with a u-integrand is inconsistent."] },
    ],
    example: { heading: "Reverse the Chain Rule", prompt: "Evaluate ∫ 2x cos(x² + 1) dx.", steps: [
      { tex: String.raw`u=x^2+1`, note: "Choose the repeated inner expression." },
      { tex: String.raw`du=2x\,dx`, note: "Its differential matches the remaining factor." },
      { tex: String.raw`\int\cos u\,du=\sin u+C`, note: "Integrate the basic form." },
    ], result: String.raw`\boxed{\sin(x^2+1)+C}` },
    mistakes: ["Changing part of the integrand to u while leaving unexplained x-terms.", "Forgetting to substitute back in an indefinite integral.", "Using original x-bounds after converting the integrand to u."],
    takeaways: ["Find an inside function and its derivative.", "Adjust constants, not variable factors.", "A complete substitution uses one variable at a time."],
    related: ["trigonometric-integrals", "improper-integrals", "chain-rule"], reviewed: "July 11, 2026",
  },
  {
    slug: "trigonometric-integrals", topicSlug: "integration-techniques", archetype: "decision",
    title: "How to choose an identity for a trigonometric integral", shortTitle: "Trig integrals",
    deck: "The parity of sine, cosine, secant, and tangent powers tells you what to save and what to convert.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`\int\sin^m x\cos^n x\,dx`,
    immediate: { label: "Decision", text: "For sine and cosine, save one factor when a power is odd; use power-reduction identities when both are even. For secant and tangent, save sec² for tangent substitution or sec·tan for secant substitution." },
    sections: [
      { heading: "Sine and cosine powers", paragraphs: ["An odd sine power lets you save one sin x and convert the remaining even power with sin²x = 1 − cos²x. Then u = cos x matches the saved differential.", "If both powers are even, neither derivative is available directly, so half-angle identities reduce the powers."] },
      { heading: "Secant and tangent powers", paragraphs: ["An even secant power suggests saving sec²x and converting the rest with sec²x = 1 + tan²x. An odd tangent power often pairs with a saved sec x tan x after converting tangent squares.", "Exceptional canonical integrals, especially sec³x, need their own integration-by-parts argument."] },
      { heading: "Identities should create a derivative", paragraphs: ["Do not expand trig expressions at random. The goal is to expose a factor that becomes du while expressing the rest in the matching variable."] },
    ],
    example: { heading: "Use an odd sine power", prompt: "Evaluate ∫ sin³x cos²x dx.", steps: [
      { tex: String.raw`\sin^3x=\sin x(1-\cos^2x)`, note: "Save one sine and convert the even remainder." },
      { tex: String.raw`u=\cos x,\qquad du=-\sin x\,dx`, note: "The saved factor becomes the differential." },
      { tex: String.raw`-\int(1-u^2)u^2\,du`, note: "Integrate a polynomial in u." },
    ], result: String.raw`\boxed{-\frac{\cos^3x}{3}+\frac{\cos^5x}{5}+C}` },
    mistakes: ["Using a half-angle identity when an odd power already provides a substitution.", "Saving a factor but failing to convert every remaining trig function.", "Assuming all secant powers follow the same pattern as tangent powers."],
    takeaways: ["Parity drives the first choice.", "Save a factor that becomes du.", "Use identities to convert the remaining expression to one trig function."],
    related: ["u-substitution", "trigonometric-substitution", "improper-integrals"], reviewed: "July 11, 2026",
  },
  {
    slug: "partial-fractions", topicSlug: "integration-techniques", archetype: "method",
    title: "Partial fractions: decompose before integrating", shortTitle: "Partial fractions",
    deck: "Turn a proper rational function into simpler fractions whose antiderivatives are logarithmic or inverse-trigonometric.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 12,
    formula: String.raw`\frac{p(x)}{q(x)}=\sum\text{ simpler rational terms}`,
    immediate: { label: "Prerequisites", text: "First make the fraction proper by long division, then factor the denominator completely over the real numbers before choosing decomposition terms." },
    sections: [
      { heading: "The denominator determines the template", paragraphs: ["Distinct linear factors receive constants over each factor. Repeated linear factors require every power through the repetition. Irreducible quadratic factors receive linear numerators.", "The template is structural; missing a repeated term makes the coefficient system impossible or misleading."] },
      { heading: "Solve coefficients efficiently", paragraphs: ["After multiplying through by the common denominator, strategic substitutions can isolate coefficients for distinct linear factors. Coefficient comparison handles the remaining terms systematically.", "Check the decomposition by recombining before integrating."] },
      { heading: "Recognize the final antiderivatives", paragraphs: ["Linear denominators produce logarithms. Repeated powers use the power rule after substitution. Irreducible quadratics may require completing the square and an arctangent form."] },
    ],
    example: { heading: "Two distinct linear factors", prompt: "Evaluate ∫ 1/(x² − 1) dx.", steps: [
      { tex: String.raw`\frac1{(x-1)(x+1)}=\frac{a}{x-1}+\frac{b}{x+1}`, note: "Use one lowercase constant for each distinct linear factor." },
      { tex: String.raw`a=\frac12,\qquad b=-\frac12`, note: "Solve by substituting x = 1 and x = −1." },
      { tex: String.raw`\frac12\int\frac{dx}{x-1}-\frac12\int\frac{dx}{x+1}`, note: "Integrate the decomposed terms." },
    ], result: String.raw`\boxed{\frac12\ln\left|\frac{x-1}{x+1}\right|+C}` },
    mistakes: ["Skipping long division when the numerator degree is too large.", "Forgetting intermediate powers for repeated factors.", "Using a constant numerator over an irreducible quadratic."],
    takeaways: ["Proper fraction first, full factorization second.", "The factor type determines each numerator.", "Verify the algebra before integrating."],
    related: ["u-substitution", "trigonometric-substitution", "improper-integrals"], reviewed: "July 11, 2026",
  },
  {
    slug: "trigonometric-substitution", topicSlug: "integration-techniques", archetype: "decision",
    title: "Choosing the right trigonometric substitution", shortTitle: "Trig substitution",
    deck: "Match a quadratic radical to a Pythagorean identity so the square root simplifies instead of becoming worse.",
    course: "Calculus II", difficulty: "Advanced", minutes: 12,
    formula: String.raw`a^2-x^2,\quad a^2+x^2,\quad x^2-a^2`,
    immediate: { label: "Pattern map", tex: String.raw`\sqrt{a^2-x^2}:x=a\sin\theta\quad \sqrt{a^2+x^2}:x=a\tan\theta\quad \sqrt{x^2-a^2}:x=a\sec\theta`, text: "Choose the substitution whose Pythagorean identity collapses the radical to one trig function." },
    sections: [
      { heading: "The three structural patterns", paragraphs: ["For a² − x², sine creates 1 − sin²θ = cos²θ. For a² + x², tangent creates 1 + tan²θ = sec²θ. For x² − a², secant creates sec²θ − 1 = tan²θ.", "Complete the square first when the quadratic is shifted or scaled."] },
      { heading: "Track the differential and domain", paragraphs: ["Every substitution changes dx as well as the radical. Choose a θ-interval that makes the square-root simplification consistent with a nonnegative radical.", "A reference triangle gives a reliable back-substitution without memorizing inverse identities."] },
      { heading: "Know when a simpler substitution exists", paragraphs: ["A radical alone does not force trig substitution. If the derivative of the expression under the root is already present, ordinary u-substitution is shorter and clearer."] },
    ],
    example: { heading: "Use the a² − x² pattern", prompt: "Evaluate ∫ dx/√(9 − x²).", steps: [
      { tex: String.raw`x=3\sin\theta,\qquad dx=3\cos\theta\,d\theta`, note: "Match a = 3." },
      { tex: String.raw`\sqrt{9-9\sin^2\theta}=3\cos\theta`, note: "Use the Pythagorean identity on a suitable interval." },
      { tex: String.raw`\int d\theta=\theta+C`, note: "The factors cancel completely." },
    ], result: String.raw`\boxed{\arcsin(x/3)+C}` },
    mistakes: ["Choosing tangent for the a² − x² pattern.", "Forgetting to transform dx.", "Back-substituting without a triangle or a valid inverse relation."],
    takeaways: ["Match the sign pattern to a Pythagorean identity.", "Complete the square before classifying.", "Check whether u-substitution is simpler first."],
    related: ["trigonometric-integrals", "u-substitution", "arc-length"], reviewed: "July 11, 2026",
  },
  {
    slug: "improper-integrals", topicSlug: "integration-techniques", archetype: "concept",
    title: "Improper integrals are limits, not unusual notation", shortTitle: "Improper integrals",
    deck: "Replace infinite bounds or unbounded integrands with limits before evaluating, then decide whether the result converges.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 10,
    formula: String.raw`\int_a^\infty f(x)\,dx=\lim_{b\to\infty}\int_a^b f(x)\,dx`,
    immediate: { label: "Definition", text: "An improper integral converges only when every required defining limit exists and is finite. Otherwise it diverges, even if symbolic antiderivatives can be written." },
    sections: [
      { heading: "Two sources of impropriety", paragraphs: ["An interval may extend to infinity, or the integrand may become unbounded at an endpoint or inside the interval. Each issue must be replaced by a one-sided limit.", "If a singularity lies inside the interval, split the integral there and require both pieces to converge independently."] },
      { heading: "Antiderivatives do not settle convergence", paragraphs: ["The Fundamental Theorem applies first on finite intervals where the integrand behaves appropriately. Only after evaluation do you take the defining limit.", "An expression such as infinity minus infinity is not a cancellation; the pieces must be analyzed separately."] },
      { heading: "Comparison can avoid hard antiderivatives", paragraphs: ["For nonnegative functions, comparison with a known p-integral or another benchmark can prove convergence or divergence without an exact formula."] },
    ],
    example: { heading: "An infinite interval", prompt: "Evaluate ∫₁∞ 1/x² dx.", steps: [
      { tex: String.raw`\int_1^\infty\frac1{x^2}\,dx=\lim_{b\to\infty}\int_1^b x^{-2}\,dx`, note: "Replace the infinite bound." },
      { tex: String.raw`\lim_{b\to\infty}\left[-\frac1x\right]_1^b`, note: "Evaluate on a finite interval." },
      { tex: String.raw`\lim_{b\to\infty}\left(1-\frac1b\right)=1`, note: "Now take the limit." },
    ], result: String.raw`\boxed{1\text{; the integral converges}}` },
    mistakes: ["Plugging infinity into an antiderivative as if it were a number.", "Failing to split at an interior singularity.", "Declaring convergence because the integrand approaches zero."],
    takeaways: ["Rewrite first as one or more limits.", "Every improper piece must converge.", "Comparison is often more useful than exact integration."],
    related: ["u-substitution", "choosing-convergence-test", "harmonic-series-diverges"], reviewed: "July 11, 2026",
  },

  {
    slug: "washer-vs-shell", topicSlug: "integration-applications", archetype: "decision",
    title: "Washer method or shell method?", shortTitle: "Washers vs. shells",
    deck: "Choose slices by geometry: perpendicular slices create washers, parallel slices create cylindrical shells.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`V=\pi\int(R^2-r^2)\,d\!x\quad\text{or}\quad V=2\pi\int(\text{radius})(\text{height})\,d\!x`,
    immediate: { label: "Decision", text: "Use the setup that keeps the region in one piece and expresses its dimensions with the least algebra. The axis orientation determines whether dx or dy is natural." },
    sections: [
      { heading: "What each slice becomes", paragraphs: ["A slice perpendicular to the axis sweeps out a disk or washer, so its cross-sectional area is π(R² − r²). A slice parallel to the axis sweeps out a thin shell with circumference, height, and thickness.", "Both methods compute the same volume from different decompositions."] },
      { heading: "Predict the easier variable", paragraphs: ["Sketch a representative slice before writing any formula. If vertical slices force you to solve for x in several branches, horizontal shells or washers may be cleaner.", "Avoid a method that requires splitting the region unless the alternative is worse."] },
      { heading: "Radii are distances", paragraphs: ["A radius is the distance from the slice to the axis of rotation, not automatically x or y. Shifted axes require expressions such as x + 2 or 5 − y."] },
    ],
    example: { heading: "Shells avoid an inverse", prompt: "Rotate the region under y = x² from x = 0 to 1 about the y-axis.", steps: [
      { tex: String.raw`r=x,\qquad h=x^2`, note: "A vertical slice is parallel to the y-axis and forms a shell." },
      { tex: String.raw`V=2\pi\int_0^1x(x^2)\,dx`, note: "Circumference times height times thickness." },
      { tex: String.raw`V=2\pi\left[\frac{x^4}{4}\right]_0^1`, note: "Evaluate the simple polynomial integral." },
    ], result: String.raw`\boxed{V=\frac\pi2}` },
    mistakes: ["Using x as the radius when the axis is shifted.", "Mixing dx with dimensions written as functions of y.", "Forgetting the inner radius in a washer."],
    takeaways: ["Draw the slice and its rotated shape.", "Perpendicular means washer; parallel means shell.", "Choose the method that avoids splitting or inverses."],
    related: ["area-between-curves", "arc-length", "work-and-fluid-force"], reviewed: "July 11, 2026",
  },
  {
    slug: "area-between-curves", topicSlug: "integration-applications", archetype: "method",
    title: "Area between curves without guessing top and bottom", shortTitle: "Area between curves",
    deck: "Find intersections, choose a slice direction, and integrate the positive geometric difference across each interval.",
    course: "Calculus I", difficulty: "Foundational", minutes: 9,
    formula: String.raw`A=\int_a^b(\text{top}-\text{bottom})\,dx`,
    immediate: { label: "Setup", text: "Sketch or compare function values after finding intersections. If the ordering changes, split the integral where the curves cross." },
    sections: [
      { heading: "Bounds come from intersections", paragraphs: ["Solve f(x) = g(x) to locate the region’s horizontal extent. A picture alone may hide an intersection or suggest an inaccurate bound.", "Use test points between intersections to determine which curve is above."] },
      { heading: "Vertical or horizontal slices", paragraphs: ["Vertical slices use top minus bottom and dx. Horizontal slices use right minus left and dy. Choose the direction that describes the region with fewer pieces.", "The integral adds thin rectangle areas, so every factor should have a geometric role."] },
      { heading: "Geometric area stays nonnegative", paragraphs: ["A signed integral can be negative when the order is reversed. Area requires a nonnegative difference on each subinterval, or an absolute value handled by splitting at crossings."] },
    ],
    example: { heading: "Parabola and line", prompt: "Find the area between y = x and y = x² on [0, 1].", steps: [
      { tex: String.raw`x=x^2\Longrightarrow x=0,1`, note: "Confirm the intersections." },
      { tex: String.raw`x\ge x^2\quad\text{on }[0,1]`, note: "The line is the top function." },
      { tex: String.raw`A=\int_0^1(x-x^2)\,dx`, note: "Integrate top minus bottom." },
    ], result: String.raw`\boxed{A=\frac16}` },
    mistakes: ["Choosing bounds from the drawing without solving intersections.", "Using bottom minus top and reporting a negative area.", "Failing to split where the curve order changes."],
    takeaways: ["Intersections determine natural bounds.", "Slice direction determines top/bottom or right/left.", "Area is geometric and nonnegative."],
    related: ["washer-vs-shell", "average-value-of-a-function", "arc-length"], reviewed: "July 11, 2026",
  },
  {
    slug: "arc-length", topicSlug: "integration-applications", archetype: "concept",
    title: "Where the arc-length formula comes from", shortTitle: "Arc length",
    deck: "Approximate a smooth curve by tiny line segments, then let the partition refine until the polygonal lengths converge.",
    course: "Calculus II", difficulty: "Advanced", minutes: 10,
    formula: String.raw`L=\int_a^b\sqrt{1+(f'(x))^2}\,dx`,
    immediate: { label: "Formula", tex: String.raw`\boxed{L=\int_a^b\sqrt{1+\left(f'(x)\right)^2}\,dx}`, text: "Use this form for y = f(x); for x = g(y), swap the roles and integrate with respect to y." },
    sections: [
      { heading: "From distance formula to integral", paragraphs: ["A small change along the graph has horizontal component Δx and vertical component approximately f′(x)Δx. The Pythagorean theorem gives a segment length near √(1 + f′(x)²)Δx.", "Adding these pieces and taking a limit produces the integral."] },
      { heading: "Why arc-length integrals are often hard", paragraphs: ["The derivative is squared and placed inside a square root. Only specially structured functions simplify cleanly, so some exact-looking problems still require numerical approximation.", "Simplify the radicand before choosing a method; it may become a perfect square."] },
      { heading: "Smoothness and parametrization", paragraphs: ["Corners can be handled piecewise, but the standard derivation assumes sufficient smoothness. Parametric curves use the same distance idea with both coordinate rates."] },
    ],
    example: { heading: "A line segment check", prompt: "Find the length of y = 2x from x = 0 to 3.", steps: [
      { tex: String.raw`f'(x)=2`, note: "The slope is constant." },
      { tex: String.raw`L=\int_0^3\sqrt{1+2^2}\,dx`, note: "Apply the graph formula." },
      { tex: String.raw`L=\sqrt5\,[x]_0^3`, note: "The integrand is constant." },
    ], result: String.raw`\boxed{3\sqrt5}` },
    mistakes: ["Forgetting to square the derivative.", "Using f(x) instead of f′(x) inside the radical.", "Assuming every arc-length integral has an elementary antiderivative."],
    takeaways: ["The formula is a continuous distance sum.", "Simplify the radical before integrating.", "Numerical answers are legitimate when no elementary antiderivative exists."],
    related: ["trigonometric-substitution", "area-between-curves", "washer-vs-shell"], reviewed: "July 11, 2026",
  },
  {
    slug: "average-value-of-a-function", topicSlug: "integration-applications", archetype: "concept",
    title: "Average value of a function on an interval", shortTitle: "Average value",
    deck: "Total accumulated output divided by interval length—the continuous counterpart of an arithmetic mean.",
    course: "Calculus I", difficulty: "Foundational", minutes: 7,
    formula: String.raw`f_{\mathrm{avg}}=\frac1{b-a}\int_a^bf(x)\,dx`,
    immediate: { label: "Formula", tex: String.raw`\boxed{f_{\mathrm{avg}}=\frac1{b-a}\int_a^bf(x)\,dx}`, text: "The integral supplies total signed accumulation; dividing by interval length converts it into a representative function value." },
    sections: [
      { heading: "Why divide by interval length", paragraphs: ["A longer interval naturally accumulates more area even when the function’s typical height is unchanged. Dividing by b − a removes that duration or width effect.", "Units confirm the formula: output-units times input-units, divided by input-units, returns output-units."] },
      { heading: "Geometric interpretation", paragraphs: ["The average value is the height of a rectangle with the same signed area as the region under the function over the interval.", "If the function is continuous, the Integral Mean Value Theorem guarantees at least one point where the function actually equals its average."] },
      { heading: "Signed versus physical averages", paragraphs: ["For velocity, the average value gives average velocity, not average speed. If direction changes and speed is requested, average the absolute value of velocity instead."] },
    ],
    example: { heading: "Average a quadratic", prompt: "Find the average value of x² on [0, 3].", steps: [
      { tex: String.raw`f_{\mathrm{avg}}=\frac1{3-0}\int_0^3x^2\,dx`, note: "Divide by interval length." },
      { tex: String.raw`=\frac13\left[\frac{x^3}{3}\right]_0^3`, note: "Evaluate the accumulation." },
      { tex: String.raw`=\frac13\cdot9`, note: "Normalize the total area." },
    ], result: String.raw`\boxed{3}` },
    mistakes: ["Forgetting the factor 1/(b−a).", "Using endpoint average instead of function average.", "Confusing average velocity with average speed."],
    takeaways: ["Average equals accumulation divided by interval length.", "The result has the same units as the function.", "Interpret signs according to the modeled quantity."],
    related: ["area-between-curves", "work-and-fluid-force", "mean-value-theorem"], reviewed: "July 11, 2026",
  },
  {
    slug: "work-and-fluid-force", topicSlug: "integration-applications", archetype: "method",
    title: "Setting up work and fluid-force integrals", shortTitle: "Work & fluid force",
    deck: "Slice the changing force into small contributions, express every dimension in one variable, and integrate with units attached.",
    course: "Calculus II", difficulty: "Advanced", minutes: 12,
    formula: String.raw`W=\int F(x)\,dx`,
    immediate: { label: "Model", text: "Write one thin contribution as force times distance, or pressure times area. Then express density, depth, slice size, and travel distance in the same variable." },
    sections: [
      { heading: "Work with a changing force", paragraphs: ["For constant force, work is force times distance. When force varies, partition the motion, approximate force on each small interval, and integrate the products.", "Springs use Hooke’s law F = kx, while lifting chains or liquids also requires tracking how much material moves how far."] },
      { heading: "Fluid force varies with depth", paragraphs: ["Pressure equals weight density times depth. A horizontal strip at one depth has nearly constant pressure, so its force is pressure times strip area.", "The depth is measured from the fluid surface, not automatically from the coordinate origin."] },
      { heading: "Draw and label one representative slice", paragraphs: ["The slice is the model. Label its width, thickness, depth, and movement distance before writing the integral. Most setup errors are visible immediately on that diagram."] },
    ],
    example: { heading: "Stretch a spring", prompt: "A spring with k = 8 N/m is stretched from 0.1 m to 0.3 m beyond equilibrium. Find the work.", steps: [
      { tex: String.raw`F(x)=kx=8x`, note: "Use Hooke’s law with displacement from equilibrium." },
      { tex: String.raw`W=\int_{0.1}^{0.3}8x\,dx`, note: "Force changes throughout the motion." },
      { tex: String.raw`W=\left[4x^2\right]_{0.1}^{0.3}`, note: "Evaluate with meter-based bounds." },
    ], result: String.raw`\boxed{0.32\ \text{J}}` },
    mistakes: ["Using the spring’s total length instead of displacement from equilibrium.", "Treating fluid pressure as constant across changing depth.", "Mixing centimeters and meters inside one setup."],
    takeaways: ["Build one differential contribution first.", "Depth and distance must be measured from the correct reference.", "Units are a powerful setup check."],
    related: ["average-value-of-a-function", "washer-vs-shell", "related-rates"], reviewed: "July 11, 2026",
  },

  {
    slug: "harmonic-series-diverges", topicSlug: "sequences-series", archetype: "answer",
    title: "Why does the harmonic series diverge?", shortTitle: "Harmonic series",
    deck: "Its terms approach zero, but they do so too slowly for the accumulated sum to settle.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`\sum_{n=1}^{\infty}\frac1n=\infty`,
    immediate: { label: "Answer", text: "The harmonic series diverges because its partial sums can be grouped into infinitely many blocks, each contributing at least one half." },
    sections: [
      { heading: "Why the nth-term test is one-way", paragraphs: ["A convergent series must have terms approaching zero, so a nonzero term limit proves divergence. But zero is only necessary, not sufficient. The harmonic series is the canonical counterexample.", "Series convergence depends on accumulated tail mass, not on individual terms alone."] },
      { heading: "The grouping proof", paragraphs: ["Group terms after the first into blocks whose lengths double: two terms, four terms, eight terms, and so on. In each block, every term is at least as large as the block’s last term.", "Each block therefore contributes at least 1/2. Infinitely many half-units force the partial sums beyond every finite bound."] },
      { heading: "Comparison perspective", paragraphs: ["The integral of 1/x from 1 to infinity also diverges, giving an independent integral-test proof. Both arguments show the reciprocal decay is exactly too slow."] },
    ],
    example: { heading: "See the block lower bound", prompt: "Bound the block from n = 9 through n = 16.", steps: [
      { tex: String.raw`\frac19+\frac1{10}+\cdots+\frac1{16}`, note: "The block contains eight terms." },
      { tex: String.raw`\frac1n\ge\frac1{16}\quad(9\le n\le16)`, note: "Every term is at least the smallest term in the block." },
      { tex: String.raw`8\cdot\frac1{16}=\frac12`, note: "The entire block contributes at least one half." },
    ], result: String.raw`\boxed{\text{Every doubled block adds at least }\frac12}` },
    mistakes: ["Claiming the series converges because 1/n approaches zero.", "Confusing a sequence of terms with the sequence of partial sums.", "Treating slow divergence as numerical convergence after a finite computation."],
    takeaways: ["Term limits can prove divergence but not convergence.", "Grouping exposes persistent tail mass.", "Partial sums, not terms, determine series convergence."],
    related: ["geometric-series", "choosing-convergence-test", "improper-integrals"], reviewed: "July 11, 2026",
  },
  {
    slug: "geometric-series", topicSlug: "sequences-series", archetype: "concept",
    title: "Geometric series: convergence, sum, and structure", shortTitle: "Geometric series",
    deck: "A constant ratio makes an infinite sum exactly solvable when repeated scaling shrinks toward zero.",
    course: "Calculus II", difficulty: "Foundational", minutes: 8,
    formula: String.raw`\sum_{n=0}^{\infty}ar^n=\frac{a}{1-r}\quad(|r|<1)`,
    immediate: { label: "Result", tex: String.raw`\boxed{\sum_{n=0}^{\infty}ar^n=\frac{a}{1-r}\ \text{for }|r|<1}`, text: "If |r| is at least 1, the terms do not shrink in the required way and the geometric series diverges." },
    sections: [
      { heading: "The partial-sum formula", paragraphs: ["For a finite geometric sum, multiplying by r and subtracting makes almost every term cancel. The remaining expression gives S_N = a(1 − r^(N+1))/(1 − r).", "The infinite sum is the limit of these partial sums, not a separate arithmetic operation."] },
      { heading: "Why the ratio condition is exact", paragraphs: ["When |r| < 1, the remaining power r^(N+1) approaches zero. When |r| is 1 or larger, the terms fail to approach zero or grow in magnitude, so convergence is impossible."] },
      { heading: "Recognize shifted indexing", paragraphs: ["A series may begin at n = 1 or use a shifted exponent. Identify the first actual term a and the common ratio r from consecutive terms instead of forcing a memorized index pattern."] },
    ],
    example: { heading: "Sum a repeating decimal", prompt: "Write 0.272727… as a fraction.", steps: [
      { tex: String.raw`0.272727\ldots=\frac{27}{100}+\frac{27}{100^2}+\cdots`, note: "Each repeating block moves two decimal places." },
      { tex: String.raw`a=\frac{27}{100},\qquad r=\frac1{100}`, note: "Identify the first term and ratio." },
      { tex: String.raw`\frac{a}{1-r}=\frac{27/100}{99/100}`, note: "Apply the geometric sum." },
    ], result: String.raw`\boxed{\frac3{11}}` },
    mistakes: ["Using a/(1−r) when |r| ≥ 1.", "Confusing the coefficient in a formula with the first actual term.", "Ignoring an index shift that changes a."],
    takeaways: ["A constant ratio is the defining signal.", "Infinite sums are limits of partial sums.", "Find a and r from the written terms."],
    related: ["harmonic-series-diverges", "choosing-convergence-test", "power-series-interval-of-convergence"], reviewed: "July 11, 2026",
  },
  {
    slug: "choosing-convergence-test", topicSlug: "sequences-series", archetype: "decision",
    title: "How to choose a convergence test", shortTitle: "Choose a convergence test",
    deck: "Match the series’ structure to a test instead of cycling through tests in chapter order.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 13,
    formula: String.raw`\sum a_n\quad\longrightarrow\quad\text{structure first}`,
    immediate: { label: "Decision", text: "Start with the nth-term check, then identify geometric, p-series, telescoping, alternating, factorial/exponential, or power-series structure before choosing a comparison, ratio, root, or integral test." },
    sections: [
      { heading: "Run the fast checks", paragraphs: ["If a_n does not approach zero, stop: the series diverges. Next look for an exact geometric ratio, a p-series, or cancellation in partial sums.", "These direct recognitions produce stronger and shorter conclusions than a general-purpose test."] },
      { heading: "Compare positive-term series by dominant behavior", paragraphs: ["Rational expressions in n behave like the ratio of their leading powers. Factorials and exponentials usually favor the Ratio Test. Expressions raised to the nth power often favor the Root Test.", "Choose a benchmark with known behavior and a meaningful asymptotic relationship."] },
      { heading: "Conditional versus absolute convergence", paragraphs: ["For alternating series, first test absolute values. Absolute convergence settles the question strongly. If the absolute series diverges, the Alternating Series Test may still establish conditional convergence when magnitudes decrease to zero."] },
    ],
    example: { heading: "Choose by dominant powers", prompt: "Test Σ (3n + 1)/(n³ + 2).", steps: [
      { tex: String.raw`\frac{3n+1}{n^3+2}\sim\frac{3n}{n^3}=\frac3{n^2}`, note: "Identify the dominant behavior." },
      { tex: String.raw`\sum\frac1{n^2}\ \text{converges}`, note: "Use the p-series benchmark p = 2." },
      { tex: String.raw`\lim_{n\to\infty}\frac{(3n+1)/(n^3+2)}{1/n^2}=3`, note: "A positive finite limit validates limit comparison." },
    ], result: String.raw`\boxed{\text{The series converges by limit comparison.}}` },
    mistakes: ["Skipping the nth-term divergence check.", "Using the Ratio Test on rational powers where its limit is inconclusive.", "Claiming an alternating series converges without checking decreasing magnitudes and zero limit."],
    takeaways: ["Recognize special forms before general tests.", "Dominant behavior suggests the comparison target.", "Distinguish absolute from conditional convergence."],
    related: ["harmonic-series-diverges", "geometric-series", "power-series-interval-of-convergence"], reviewed: "July 11, 2026",
  },
  {
    slug: "power-series-interval-of-convergence", topicSlug: "sequences-series", archetype: "method",
    title: "Finding a power series interval of convergence", shortTitle: "Power-series intervals",
    deck: "Find the radius with the Ratio or Root Test, then test both endpoints separately because the general test goes silent there.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`\sum_{n=0}^{\infty}c_n(x-a)^n`,
    immediate: { label: "Workflow", text: "Solve the ratio or root inequality for |x − a| < R. Then substitute each endpoint into the original series and apply an ordinary convergence test." },
    sections: [
      { heading: "Center and radius", paragraphs: ["A power series is organized around its center a. Inside a radius R it converges absolutely; outside it diverges. This all-or-nothing interior behavior is a special strength of power series.", "The radius may be zero or infinite, though many course examples produce a finite positive value."] },
      { heading: "Why endpoints are separate problems", paragraphs: ["At |x − a| = R, the Ratio Test commonly returns 1 and gives no conclusion. Substitution may produce a p-series, alternating series, or another familiar form.", "The two endpoints can behave differently, so test both and record brackets or parentheses accordingly."] },
      { heading: "Interval notation carries information", paragraphs: ["Parentheses mean divergence at an endpoint; brackets mean convergence. The center and radius alone do not capture endpoint behavior."] },
    ],
    example: { heading: "Radius first, endpoints second", prompt: "Find the interval for Σ (x−2)ⁿ/n.", steps: [
      { tex: String.raw`\left|\frac{a_{n+1}}{a_n}\right|\longrightarrow|x-2|<1`, note: "The Ratio Test gives radius 1." },
      { tex: String.raw`x=3:\ \sum\frac1n\ \text{diverges}`, note: "The right endpoint is harmonic." },
      { tex: String.raw`x=1:\ \sum\frac{(-1)^n}{n}\ \text{converges}`, note: "The left endpoint is alternating harmonic." },
    ], result: String.raw`\boxed{[1,3)}` },
    mistakes: ["Including both endpoints automatically after finding a radius.", "Testing endpoints in the ratio inequality instead of the original series.", "Forgetting that each endpoint can behave differently."],
    takeaways: ["Ratio or root test finds the open interior.", "Endpoint tests are independent.", "Report the final answer as an interval, not only a radius."],
    related: ["choosing-convergence-test", "geometric-series", "taylor-series-remainder"], reviewed: "July 11, 2026",
  },
  {
    slug: "taylor-series-remainder", topicSlug: "sequences-series", archetype: "concept",
    title: "Taylor remainder: how accurate is the polynomial?", shortTitle: "Taylor remainder",
    deck: "A Taylor polynomial is useful only with a way to control what was left out.",
    course: "Calculus II", difficulty: "Advanced", minutes: 11,
    formula: String.raw`|R_n(x)|\le\frac{M|x-a|^{n+1}}{(n+1)!}`,
    immediate: { label: "Error bound", tex: String.raw`\boxed{|R_n(x)|\le\frac{M|x-a|^{n+1}}{(n+1)!}}`, text: "Choose M as an upper bound for the absolute value of the (n+1)st derivative between the center and x." },
    sections: [
      { heading: "The polynomial and the remainder", paragraphs: ["The degree-n Taylor polynomial matches a function’s derivatives through order n at the center. The remainder R_n(x) is the exact difference between the function and that polynomial.", "Matching many derivatives does not by itself guarantee global accuracy; distance from the center and derivative growth matter."] },
      { heading: "Using the Lagrange bound", paragraphs: ["Find a bound M for the next derivative on the interval connecting a and x. Insert M, the distance |x − a|, and the factorial denominator.", "The estimate may be conservative, but it is rigorous and does not require knowing the unknown intermediate point in the exact remainder formula."] },
      { heading: "Alternating-series error can be sharper", paragraphs: ["When a Taylor series alternates with decreasing term magnitudes, the first omitted term bounds the error. Use that simpler result when its hypotheses are clearly satisfied."] },
    ],
    example: { heading: "Bound an exponential approximation", prompt: "Bound the error when e^0.2 is approximated by 1 + x + x²/2 at x = 0.2.", steps: [
      { tex: String.raw`R_2(0.2)\le\frac{M(0.2)^3}{3!}`, note: "The next derivative order is three." },
      { tex: String.raw`M=e^{0.2}`, note: "Every derivative of e^x is e^x, maximized at 0.2 on [0, 0.2]." },
      { tex: String.raw`|R_2(0.2)|\le\frac{e^{0.2}(0.008)}6`, note: "Insert the derivative bound and distance." },
    ], result: String.raw`\boxed{|R_2(0.2)|<0.00163}` },
    mistakes: ["Bounding the nth derivative instead of the (n+1)st.", "Choosing M only at the center rather than across the whole interval.", "Assuming a Taylor series equals the function without checking convergence or remainder."],
    takeaways: ["The remainder is the approximation error.", "Bound the next derivative on the full interval.", "Accuracy improves rapidly when factorial growth dominates."],
    related: ["power-series-interval-of-convergence", "linear-approximation", "geometric-series"], reviewed: "July 11, 2026",
  },
];

export const libraryArticleRoutes = libraryArticles.map((article) => `/library/${article.topicSlug}/${article.slug}/`);
export const topicRoutes = libraryTopics.map((topic) => `/topics/calculus/${topic.slug}/`);

export function getArticle(topicSlug: string, articleSlug: string) {
  return libraryArticles.find((article) => article.topicSlug === topicSlug && article.slug === articleSlug);
}

export function getTopic(topicSlug: string) {
  return libraryTopics.find((topic) => topic.slug === topicSlug);
}

export function getTopicArticles(topicSlug: string) {
  return libraryArticles.filter((article) => article.topicSlug === topicSlug);
}
