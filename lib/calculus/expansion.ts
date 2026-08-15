import type { ArticleArchetype, LibraryArticle } from "../library";

type CalculusArticleInput = {
  slug: string;
  topicSlug: string;
  archetype: ArticleArchetype;
  title: string;
  shortTitle: string;
  deck: string;
  course: "Calculus I" | "Calculus II";
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  minutes: number;
  formula?: string;
  immediate?: { label: string; tex?: string; text: string };
  sections: Array<[heading: string, first: string, second: string, tex?: string]>;
  example: { heading: string; prompt: string; steps: Array<[tex: string, note: string]>; result: string };
  mistakes: string[];
  takeaways: string[];
  related: string[];
  searchTerms?: string[];
};

function calculusArticle(input: CalculusArticleInput): LibraryArticle {
  return {
    ...input,
    sections: input.sections.map(([heading, first, second, tex]) => ({ heading, paragraphs: [first, second], tex })),
    example: { ...input.example, steps: input.example.steps.map(([tex, note]) => ({ tex, note })) },
    reviewed: "July 13, 2026",
  };
}

export const calculusExpansionArticles = [
  calculusArticle({
    slug: "one-sided-limits-and-jump-discontinuities", topicSlug: "limits-continuity", archetype: "concept",
    title: "One-sided limits and jump discontinuities", shortTitle: "One-sided limits",
    deck: "A two-sided limit exists only when the function approaches the same value from the left and from the right.",
    course: "Calculus I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`\lim_{x\to a}f(x)=L\iff\lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)=L`,
    searchTerms: ["left hand limit", "right hand limit", "jump discontinuity", "piecewise limit"],
    immediate: { label: "Existence test", tex: String.raw`L_-\ne L_+\quad\Rightarrow\quad\lim_{x\to a}f(x)\text{ does not exist}`, text: "The function's actual value at a does not settle a disagreement between the two sides." },
    sections: [
      ["Direction belongs to the input", "The notation x → a⁻ means x approaches a through values smaller than a. The plus sign means values larger than a.", "A one-sided limit reads the behavior on only one branch of a piecewise graph, so it can exist even when the full two-sided limit does not.", String.raw`\lim_{x\to a^-}f(x)=L_-\qquad\lim_{x\to a^+}f(x)=L_+`],
      ["The two sides must agree", "A two-sided limit is a single claimed destination. If the left and right approaches disagree, no single number describes the nearby behavior.", "Do not average the two values. The limit is about agreement, not finding a compromise between branches.", String.raw`L_-=2,\ L_+=5\quad\Rightarrow\quad\lim_{x\to a}f(x)\text{ DNE}`],
      ["Function value and limit answer different questions", "The point f(a) may equal one side, the other side, or neither. Changing a single plotted point does not change the nearby approach.", "Continuity requires all three pieces: the function is defined, the two-sided limit exists, and that limit equals the function value.", String.raw`f(a)\text{ exists},\quad\lim_{x\to a}f(x)\text{ exists},\quad\lim_{x\to a}f(x)=f(a)`],
    ],
    example: { heading: "Read a piecewise boundary", prompt: "Let f(x) = x + 1 for x < 2 and f(x) = 5 − x for x ≥ 2. Find the one-sided and two-sided limits at 2.", steps: [[String.raw`\lim_{x\to2^-}(x+1)=3`, "Use the branch defined to the left of 2."], [String.raw`\lim_{x\to2^+}(5-x)=3`, "Use the branch defined to the right of 2."], [String.raw`3=3`, "The one-sided values agree."]], result: String.raw`\boxed{\lim_{x\to2}f(x)=3}` },
    mistakes: ["Using the branch's endpoint symbol to choose a limit side.", "Averaging unequal one-sided limits.", "Assuming f(a) determines the nearby limit."],
    takeaways: ["Minus approaches from smaller inputs.", "Both sides must approach one value.", "Continuity also checks the actual function value."],
    related: ["continuity-at-a-point", "evaluating-indeterminate-limits", "infinite-limits-and-asymptotes"],
  }),
  calculusArticle({
    slug: "derivatives-of-inverse-trig-functions", topicSlug: "derivatives", archetype: "method",
    title: "Derivatives of inverse trigonometric functions", shortTitle: "Inverse trig derivatives",
    deck: "Recognize the inverse-trig outer function, differentiate its input, and keep the domain restrictions visible.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 10,
    formula: String.raw`\frac{d}{dx}\arctan u=\frac{u'}{1+u^2}`,
    searchTerms: ["derivative arcsin", "derivative arctan", "inverse trig derivative"],
    immediate: { label: "Chain-rule pattern", tex: String.raw`\frac{d}{dx}\arcsin u=\frac{u'}{\sqrt{1-u^2}},\qquad\frac{d}{dx}\arctan u=\frac{u'}{1+u^2}`, text: "The numerator is the derivative of the inside function. The denominator belongs to the chosen inverse-trig function." },
    sections: [
      ["Inverse trig is not reciprocal trig", "The notation sin⁻¹x means arcsin x, the inverse function on a restricted domain. It does not mean csc x.", "The derivative formulas follow from implicit differentiation of identities such as sin(arcsin x) = x.", String.raw`\sin(\arcsin x)=x`],
      ["The chain rule supplies the numerator", "When the input is u(x), the base inverse-trig derivative is multiplied by u′(x). Missing that factor is the same chain-rule error that appears with powers and exponentials.", "Write u and u′ separately when the inside expression is complicated. That keeps the denominator and numerator from becoming tangled.", String.raw`\frac{d}{dx}\arctan(3x^2)=\frac{6x}{1+9x^4}`],
      ["Domains explain the square root", "For real-valued arcsin and arccos, the input must stay between −1 and 1. Their derivatives become undefined at the endpoints because the square-root denominator is zero.", "Arctan accepts every real input, and 1 + u² is always positive for real u. The formula therefore has no real denominator zeros.", String.raw`|u|<1\text{ for a finite }\frac{d}{dx}\arcsin u`],
    ],
    example: { heading: "Differentiate an arcsine composition", prompt: "Differentiate y = arcsin(2x).", steps: [[String.raw`u=2x,\qquad u'=2`, "Identify the inside function and its derivative."], [String.raw`y'=\frac{u'}{\sqrt{1-u^2}}`, "Use the arcsine derivative pattern."], [String.raw`y'=\frac{2}{\sqrt{1-4x^2}}`, "Substitute u and simplify."]], result: String.raw`\boxed{\frac{2}{\sqrt{1-4x^2}}}` },
    mistakes: ["Reading arcsin x as 1/sin x.", "Forgetting the derivative of the inside function.", "Ignoring where a square-root denominator becomes zero."],
    takeaways: ["Inverse and reciprocal functions are different.", "Every composition needs the chain rule.", "The formula's denominator records domain behavior."],
    related: ["chain-rule", "implicit-differentiation", "logarithmic-differentiation"],
  }),
  calculusArticle({
    slug: "newtons-method", topicSlug: "derivative-applications", archetype: "method",
    title: "Newton's method: approximating roots with tangent lines", shortTitle: "Newton's method",
    deck: "Use the tangent line at a current guess to generate a better root estimate, then monitor whether the iteration is actually improving.",
    course: "Calculus I", difficulty: "Intermediate", minutes: 10,
    formula: String.raw`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`,
    searchTerms: ["newton raphson", "approximate root", "tangent line iteration"],
    immediate: { label: "Iteration", tex: String.raw`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`, text: "Start near a root, evaluate the function and derivative, and repeat until successive estimates stabilize to the required accuracy." },
    sections: [
      ["A tangent line predicts where the graph reaches zero", "At xₙ, the tangent line approximates the graph. Solving that line for its x-intercept produces the next estimate xₙ₊₁.", "The formula is therefore a geometric construction, not an unexplained numerical trick. Its quality depends on how well the tangent represents the function nearby.", String.raw`0\approx f(x_n)+f'(x_n)(x_{n+1}-x_n)`],
      ["A starting value can decide success", "A guess close to a simple root often converges quickly. A poor guess can jump to another root, cycle, or move into a region where the derivative vanishes.", "A graph or sign-changing interval helps select a sensible start. Newton's method should not be treated as guaranteed for every differentiable-looking formula.", String.raw`f'(x_n)=0\quad\Rightarrow\quad\text{the Newton step is undefined}`],
      ["Stop with a stated accuracy rule", "Common stopping rules compare successive estimates or check the residual |f(xₙ)|. State the tolerance instead of stopping because a decimal display looks stable.", "Round only the reported result. Carry extra digits during iteration so rounding error does not steer later steps.", String.raw`|x_{n+1}-x_n|<\varepsilon\quad\text{or}\quad|f(x_n)|<\varepsilon`],
    ],
    example: { heading: "Approximate a square root", prompt: "Use Newton's method on f(x) = x² − 2 with x₀ = 1.5.", steps: [[String.raw`x_1=1.5-\frac{1.5^2-2}{2(1.5)}=1.416666\ldots`, "Apply one tangent-line correction."], [String.raw`x_2=1.416666\ldots-\frac{1.416666^2-2}{2(1.416666)}=1.414215\ldots`, "Repeat with the improved estimate."], [String.raw`x_3\approx1.414213562`, "The estimates have stabilized to several decimal places."]], result: String.raw`\boxed{\sqrt2\approx1.414214}` },
    mistakes: ["Using f(xₙ) where f′(xₙ) belongs.", "Starting where the derivative is zero or nearly zero.", "Rounding every intermediate estimate aggressively."],
    takeaways: ["Each step is a tangent-line x-intercept.", "Convergence depends on the starting point.", "Use an explicit stopping rule."],
    related: ["linear-approximation", "optimization", "curve-sketching-from-derivatives"],
  }),
  calculusArticle({
    slug: "integration-by-parts-strategy", topicSlug: "integration-techniques", archetype: "method",
    title: "Repeated, tabular, and cyclic integration by parts", shortTitle: "Repeated integration by parts",
    deck: "Recognize when integration by parts should repeat, when tabular bookkeeping helps, and when a cyclic integral should be solved algebraically.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`\int u\,dv=uv-\int v\,du`,
    searchTerms: ["repeated integration by parts", "cyclic integration by parts", "tabular integration"],
    immediate: { label: "Structural clue", tex: String.raw`\text{polynomial}\times\text{exponential or trig}`, text: "Choose u so differentiation simplifies it, and choose dv so its antiderivative is available. The mnemonic is a guide, not a substitute for checking both jobs." },
    sections: [
      ["The product rule runs backward", "Differentiating uv produces u dv + v du in differential notation. Rearranging and integrating gives the by-parts identity.", "The method trades one integral for another. It succeeds only when the new integral is simpler or creates an equation involving the original integral.", String.raw`d(uv)=u\,dv+v\,du`],
      ["Choose u and dv as a pair", "A good u becomes simpler when differentiated. A good dv includes the remaining factors and can be integrated without creating a worse problem.", "LIATE—logarithmic, inverse trig, algebraic, trig, exponential—often suggests u, but always verify that the resulting v and remaining integral improve the structure.", String.raw`\int x e^x\,dx:\quad u=x,\ dv=e^x\,dx`],
      ["Repeated use should have a destination", "Polynomial factors may require repeated integration by parts until differentiation reaches zero. Tabular bookkeeping can shorten that repetition.", "Cyclic integrals can return the original unknown integral. Collect it algebraically instead of continuing forever, as in the classic sec³x calculation.", String.raw`I=\int e^x\cos x\,dx\quad\Rightarrow\quad I=\text{known terms}-I`],
    ],
    example: { heading: "A product that simplifies", prompt: "Evaluate ∫x eˣ dx.", steps: [[String.raw`u=x,\quad dv=e^x\,dx`, "Differentiate the polynomial and integrate the exponential."], [String.raw`du=dx,\quad v=e^x`, "Compute the paired differentials."], [String.raw`\int xe^x\,dx=xe^x-\int e^x\,dx`, "Apply the formula."], [String.raw`xe^x-e^x+C`, "Finish the simpler remaining integral."]], result: String.raw`\boxed{e^x(x-1)+C}` },
    mistakes: ["Choosing dv that cannot be integrated cleanly.", "Forgetting the minus sign in the formula.", "Stopping with a remaining integral that is not actually simpler."],
    takeaways: ["By parts reverses the product rule.", "Choose u and dv together.", "Repeated use needs a simplifying pattern."],
    related: ["u-substitution", "trigonometric-integrals", "improper-integrals"],
  }),
  calculusArticle({
    slug: "surface-area-of-revolution", topicSlug: "integration-applications", archetype: "method",
    title: "Surface area of revolution: radius times arc length", shortTitle: "Surface area of revolution",
    deck: "Build the integral from the distance to the axis and the differential arc length, then check that the chosen function stays nonnegative where required.",
    course: "Calculus II", difficulty: "Advanced", minutes: 11,
    formula: String.raw`S=2\pi\int_a^b r(x)\sqrt{1+[f'(x)]^2}\,dx`,
    searchTerms: ["surface of revolution", "surface area integral", "rotate curve around axis"],
    immediate: { label: "Geometry", tex: String.raw`dS=2\pi(\text{radius})\,ds`, text: "A thin curve segment sweeps out a narrow band. Its circumference is 2π times the radius, and its slanted width is the arc-length element ds." },
    sections: [
      ["The radius is distance to the axis", "Rotating around the x-axis uses radius |y|, while rotating around the y-axis uses radius |x|. On a nonnegative interval those absolute values may simplify.", "State the axis before writing the integral. Reusing the wrong radius is the surface-area version of mixing up shell and washer geometry.", String.raw`\text{x-axis: }r=|f(x)|\qquad\text{y-axis: }r=|x|`],
      ["Arc length supplies the slanted width", "For y = f(x), a differential curve segment has length ds = √(1 + [f′(x)]²) dx. Surface area uses that slanted segment, not merely dx.", "If x is naturally a function of y, the corresponding element is √(1 + [g′(y)]²) dy. Choose the orientation that keeps both radius and derivative manageable.", String.raw`ds=\sqrt{1+[f'(x)]^2}\,dx`],
      ["The result has square units", "Circumference has units of length and ds has units of length, so their product has area units. This dimensional check catches missing radius or arc-length factors.", "Surface area integrals are often algebraically difficult. Setting up the correct exact integral is meaningful even when numerical evaluation is required.", String.raw`[2\pi r\,ds]=L\cdot L=L^2`],
    ],
    example: { heading: "Rotate a line segment", prompt: "Find the surface area formed by rotating y = x on 0 ≤ x ≤ 1 around the x-axis.", steps: [[String.raw`r=x,\qquad f'(x)=1`, "The radius is y and the slope is constant."], [String.raw`S=2\pi\int_0^1x\sqrt{1+1^2}\,dx`, "Insert radius and arc-length factor."], [String.raw`S=2\pi\sqrt2\left[\frac{x^2}{2}\right]_0^1`, "Integrate the remaining polynomial factor."]], result: String.raw`\boxed{S=\pi\sqrt2}` },
    mistakes: ["Using dx instead of the arc-length element.", "Measuring radius from the wrong axis.", "Reporting cubic units for a surface area."],
    takeaways: ["Surface area is circumference times slanted width.", "Radius means distance to the rotation axis.", "The result must have square units."],
    related: ["arc-length", "washer-vs-shell", "area-between-curves"],
  }),
  calculusArticle({
    slug: "ratio-test-vs-root-test", topicSlug: "sequences-series", archetype: "decision",
    title: "Ratio test or root test? Choose from the series structure", shortTitle: "Ratio test vs root test",
    deck: "Use ratios for factorial and product growth, roots for whole expressions raised to n, and recognize when either test returns no decision.",
    course: "Calculus II", difficulty: "Intermediate", minutes: 10,
    formula: String.raw`L=\lim_{n\to\infty}\left|\frac{a_{n+1}}{a_n}\right|\quad\text{or}\quad L=\lim_{n\to\infty}\sqrt[n]{|a_n|}`,
    searchTerms: ["ratio test", "root test", "absolute convergence test", "which convergence test"],
    immediate: { label: "Decision rule", tex: String.raw`L<1:\text{ converges}\qquad L>1:\text{ diverges}\qquad L=1:\text{ inconclusive}`, text: "Both tests share the same conclusion rule. The difference is which algebra makes L easiest to compute." },
    sections: [
      ["Ratios cancel factorial and product structure", "The ratio aₙ₊₁/aₙ is efficient when shifting n to n + 1 creates large cancellations, especially with factorials, exponentials, and consecutive products.", "Write the shifted term carefully before dividing. Most ratio-test errors come from an incorrect (n + 1)! or exponent.", String.raw`\frac{(n+1)!}{n!}=n+1`],
      ["Nth roots expose repeated powers", "The root test is natural when the entire term has the form [bₙ]ⁿ or contains several factors raised to n. The nth root removes that outer exponent immediately.", "Absolute values are built into both tests. A conclusion L < 1 therefore proves absolute convergence, which is stronger than conditional convergence.", String.raw`\sqrt[n]{\left|\left(\frac{2n}{3n+1}\right)^n\right|}=\left|\frac{2n}{3n+1}\right|`],
      ["A limit of one means change methods", "When L = 1, neither test says the series converges or diverges. Harmonic and p-series examples show why no universal conclusion is possible.", "Move to comparison, integral, alternating-series, or another structure-appropriate test rather than repeating the same inconclusive calculation.", String.raw`\sum\frac1n:\ L=1\text{ and diverges}\qquad\sum\frac1{n^2}:\ L=1\text{ and converges}`],
    ],
    example: { heading: "Choose the root test", prompt: "Determine whether Σ[(2n)/(3n + 1)]ⁿ converges.", steps: [[String.raw`a_n=\left(\frac{2n}{3n+1}\right)^n`, "The whole expression is raised to n, favoring the root test."], [String.raw`\sqrt[n]{|a_n|}=\frac{2n}{3n+1}`, "The nth root removes the outer power."], [String.raw`L=\lim_{n\to\infty}\frac{2n}{3n+1}=\frac23<1`, "Apply the common conclusion rule."]], result: String.raw`\boxed{\text{The series converges absolutely.}}` },
    mistakes: ["Declaring convergence when L = 1.", "Forgetting absolute values around a sign-changing term.", "Using the ratio test when an nth root would remove the main complexity at once."],
    takeaways: ["Factorials favor ratios.", "Whole nth powers favor roots.", "L = 1 requires a different test."],
    related: ["choosing-convergence-test", "geometric-series", "power-series-interval-of-convergence"],
  }),
];
