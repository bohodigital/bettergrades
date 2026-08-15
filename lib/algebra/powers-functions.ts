import { algebraArticle } from "./shared";

export const powersFunctionsArticles = [
  algebraArticle({
    slug: "simplifying-radicals", topicSlug: "radicals-exponents-functions", archetype: "method",
    title: "How to find perfect-power factors when simplifying radicals", shortTitle: "Find perfect-power factors",
    deck: "Factor the radicand into a perfect power times what remains. Pull only complete groups through the radical bar.",
    course: "Algebra I", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`\sqrt{ab}=\sqrt a\sqrt b\quad(a,b\ge0)`, immediate: { label: "Method", text: "For square roots, every pair of equal factors contributes one factor outside." },
    sections: [
      ["Look for the largest useful perfect square", "A radicand can be split into a perfect-square factor and a leftover factor. Using the largest square usually reaches simplest form in one move.", "Prime factorization is slower but dependable when the square factor is not obvious.", String.raw`\sqrt{72}=\sqrt{36\cdot2}=6\sqrt2`],
      ["Variables need domain awareness", "For real variables, √(x²) equals |x|, not automatically x, because the principal square root is nonnegative.", "Many introductory exercises quietly assume variables are nonnegative. State that assumption or keep the absolute value when it matters.", String.raw`\sqrt{x^2}=|x|`],
      ["Only like radicals combine", "After simplification, radicals combine like algebraic terms when their indices and radicands match. Coefficients add; radicands do not.", "Do not split a sum inside a radical: √(a + b) is generally not √a + √b.", String.raw`3\sqrt5-\sqrt5=2\sqrt5`],
    ],
    example: { heading: "Extract complete pairs", prompt: "Simplify √(200x⁵), assuming x ≥ 0.", steps: [[String.raw`200x^5=100x^4\cdot2x`, "Separate the largest perfect-square factor."], [String.raw`\sqrt{200x^5}=\sqrt{100x^4}\sqrt{2x}`, "Use the product property."], [String.raw`\sqrt{100x^4}=10x^2`, "Take the principal square root under the nonnegative assumption."], [String.raw`10x^2\sqrt{2x}`, "Keep the unpaired factors inside."]], result: String.raw`\boxed{10x^2\sqrt{2x}}` },
    mistakes: ["Pulling out a factor that is not a complete square.", "Writing √(x²) = x without a domain assumption.", "Adding unlike radicands."], takeaways: ["Extract perfect powers.", "Principal roots are nonnegative.", "Combine only matching radicals."], related: ["rational-exponents", "solving-radical-equations", "exponent-rules"],
  }),
  algebraArticle({
    slug: "solving-radical-equations", topicSlug: "radicals-exponents-functions", archetype: "method",
    title: "Why radical equations create extraneous solutions—and how to check them", shortTitle: "Check radical equations",
    deck: "Isolate one radical, raise both sides to the matching power, solve, and check every candidate in the original equation.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`\sqrt{f(x)}=g(x)\Rightarrow f(x)=g(x)^2`, immediate: { label: "Warning", text: "Squaring is not a reversible step over all real expressions, so it can introduce answers the original equation never had." },
    sections: [
      ["Isolate before raising powers", "Move other terms away so one radical stands alone. Squaring a sum that contains a radical creates a cross term and more algebra than necessary.", "If multiple radicals remain, isolate and square in stages rather than trying to eliminate everything at once.", String.raw`\sqrt{x+4}-2=x\Rightarrow\sqrt{x+4}=x+2`],
      ["Domain conditions predict trouble", "An even-index radicand must be nonnegative, and an isolated principal square root is also nonnegative. Therefore the other side must be nonnegative too.", "These conditions can eliminate candidates early, but the original-equation check is still required.", String.raw`f(x)\ge0,\quad g(x)\ge0`],
      ["Why extraneous roots appear", "If a = b then a² = b², but the reverse allows a = −b as well. Squaring loses sign information.", "Substituting into the original equation restores that information and separates genuine solutions from artifacts.", String.raw`a^2=b^2\Rightarrow a=\pm b`],
    ],
    example: { heading: "Square, solve, verify", prompt: "Solve √(x + 6) = x.", steps: [[String.raw`x\ge0`, "The isolated square root is nonnegative."], [String.raw`x+6=x^2`, "Square both sides."], [String.raw`x^2-x-6=0=(x-3)(x+2)`, "Move all terms and factor."], [String.raw`x=3\ \text{or}\ x=-2`, "List algebraic candidates."], [String.raw`\sqrt9=3\quad\text{but}\quad\sqrt4\ne-2`, "Check in the original equation."]], result: String.raw`\boxed{x=3}` },
    mistakes: ["Squaring before isolating the radical.", "Forgetting domain conditions.", "Keeping every root of the squared equation."], takeaways: ["Isolate first.", "Even roots impose nonnegative conditions.", "Check every candidate in the original equation."], related: ["simplifying-radicals", "rational-exponents", "compound-inequalities"],
  }),
  algebraArticle({
    slug: "rational-exponents", topicSlug: "radicals-exponents-functions", archetype: "concept",
    title: "Why fractional exponents mean roots", shortTitle: "Fractional exponents and roots",
    deck: "The denominator names the root and the numerator names the power. This notation lets radical expressions use the ordinary exponent rules.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`a^{m/n}=\sqrt[n]{a^m}=\left(\sqrt[n]{a}\right)^m`, immediate: { label: "Translation", tex: String.raw`a^{1/n}=\sqrt[n]{a}`, text: "For real-number work, even roots require a nonnegative base unless the expression's domain is restricted differently." },
    sections: [
      ["The definition preserves exponent multiplication", "We want (a^(1/n))^n to equal a, so a^(1/n) must mean the nth root of a. The numerator then repeats that root as a power.", "Either power-first or root-first can work; choose the route that keeps numbers small.", String.raw`64^{2/3}=(\sqrt[3]{64})^2=4^2=16`],
      ["Negative rational exponents add a reciprocal", "The negative sign has the same meaning it has for integer exponents: take the reciprocal. It does not make the base or result automatically negative.", "Rewrite the reciprocal early when it makes the structure easier to read.", String.raw`x^{-3/2}=\frac1{x^{3/2}}`],
      ["Reduced fractions matter for real domains", "Equivalent rational exponents can hide domain subtleties when negative bases are involved. Odd roots of negative numbers are real; even roots are not.", "In introductory algebra, simplify the exponent fraction and state real-domain restrictions rather than manipulating symbols beyond their domain.", String.raw`(-8)^{1/3}=-2\qquad(-8)^{1/2}\notin\mathbb R`],
    ],
    example: { heading: "Choose the smaller route", prompt: "Evaluate 81^(3/4).", steps: [[String.raw`81^{3/4}=(\sqrt[4]{81})^3`, "The denominator four names the fourth root."], [String.raw`\sqrt[4]{81}=3`, "Use 81 = 3⁴."], [String.raw`3^3=27`, "Apply the numerator as a power."]], result: String.raw`\boxed{27}` },
    mistakes: ["Swapping the roles of numerator and denominator.", "Treating a negative exponent as a negative number.", "Ignoring real-domain limits for even roots."], takeaways: ["Denominator means root.", "Numerator means power.", "Negative exponents mean reciprocal."], related: ["simplifying-radicals", "exponent-rules", "solving-radical-equations"],
  }),
  algebraArticle({
    slug: "function-notation", topicSlug: "radicals-exponents-functions", archetype: "concept",
    title: "Function notation: inputs, outputs, and what f(x) does not mean", shortTitle: "Function notation",
    deck: "f(x) names the output of function f at input x. The parentheses indicate evaluation, not multiplication.",
    course: "Algebra I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`f:x\mapsto f(x)`, immediate: { label: "Meaning", tex: String.raw`f(3)=\text{the output when the input is }3`, text: "Replace every occurrence of the input variable with the supplied expression, using parentheses." },
    sections: [
      ["A function pairs each allowed input with one output", "The function name identifies the rule or relationship; the value inside parentheses identifies the input. f(x) is a single output expression.", "Writing f times x would require a separately defined number or variable f. Function notation uses the same visual parentheses for a different job.", String.raw`f(x)=2x^2-1`],
      ["Inputs can be expressions", "Evaluating f(a + h) means replacing x everywhere with the entire expression a + h. Parentheses keep powers and signs attached correctly.", "This skill becomes essential in difference quotients, composition, and transformations.", String.raw`f(a+h)=2(a+h)^2-1`],
      ["Domain belongs to the function", "A formula may exclude inputs because of denominators, even roots, logarithms, or contextual constraints. Function notation does not override those restrictions.", "When a table or graph defines the function, read the output from that representation instead of inventing an algebraic rule.", String.raw`f(x)=\frac1{x-4}\Rightarrow x\ne4`],
    ],
    example: { heading: "Substitute the whole input", prompt: "If f(x) = 2x² − 3x + 1, find f(a + 1).", steps: [[String.raw`f(a+1)=2(a+1)^2-3(a+1)+1`, "Replace every x with a + 1."], [String.raw`=2(a^2+2a+1)-3a-3+1`, "Expand the square and distribute."], [String.raw`=2a^2+a`, "Combine like terms."]], result: String.raw`\boxed{f(a+1)=2a^2+a}` },
    mistakes: ["Reading f(x) as f multiplied by x.", "Replacing only one occurrence of x.", "Dropping parentheses around an expression input."], takeaways: ["f(x) is an output.", "Substitute the entire input everywhere.", "Respect the function's domain."], related: ["inverse-functions-vs-reciprocals", "interpreting-linear-models", "order-of-operations-with-variables"],
  }),
  algebraArticle({
    slug: "inverse-functions-vs-reciprocals", topicSlug: "radicals-exponents-functions", archetype: "decision",
    title: "Inverse function or reciprocal? The −1 notation has two different jobs", shortTitle: "Inverse vs reciprocal",
    deck: "f⁻¹ reverses a function's input-output pairing; 1/f takes reciprocal outputs. They are generally different operations.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 10,
    formula: String.raw`f^{-1}(x)\ne\frac1{f(x)}`, immediate: { label: "Distinction", tex: String.raw`f^{-1}(f(x))=x`, text: "The superscript −1 on a function name means inverse function, not a negative exponent applied to the output." },
    sections: [
      ["An inverse reverses the mapping", "If f sends input a to output b, then f⁻¹ sends b back to a. The domain and range exchange roles.", "A function needs to be one-to-one on the chosen domain to have an inverse function. The horizontal-line test checks this on a graph.", String.raw`f(a)=b\Longleftrightarrow f^{-1}(b)=a`],
      ["A reciprocal changes output values", "The reciprocal function 1/f(x) keeps the same input but replaces each nonzero output with its multiplicative reciprocal.", "Its domain excludes zeros of f. It does not undo the original function.", String.raw`g(x)=\frac1{f(x)}`],
      ["Solve for the inverse carefully", "Write y = f(x), exchange x and y, and solve for y. Then verify both compositions where domains allow.", "Domain restrictions may need to be added, especially when reversing squares, roots, or rational functions.", String.raw`f^{-1}(f(x))=x,\quad f(f^{-1}(x))=x`],
    ],
    example: { heading: "Compare the two meanings", prompt: "For f(x) = 3x − 6, find f⁻¹(x) and 1/f(x).", steps: [[String.raw`y=3x-6`, "Start with the original rule."], [String.raw`x=3y-6\Rightarrow y=\frac{x+6}{3}`, "Exchange x and y, then solve for y."], [String.raw`f^{-1}(x)=\frac{x+6}{3}`, "State the inverse function."], [String.raw`\frac1{f(x)}=\frac1{3x-6},\quad x\ne2`, "Take the reciprocal separately and state its restriction."]], result: String.raw`\boxed{f^{-1}(x)=\frac{x+6}{3}\ne\frac1{3x-6}}` },
    mistakes: ["Replacing f⁻¹(x) with 1/f(x).", "Swapping x and y without solving for y.", "Ignoring one-to-one or domain requirements."], takeaways: ["Inverse functions undo mappings.", "Reciprocals invert output values.", "Verify inverses by composition."], related: ["function-notation", "rational-domain-restrictions", "direct-inverse-variation"],
  }),
];
