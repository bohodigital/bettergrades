import { algebraArticle } from "./shared";

export const rationalArticles = [
  algebraArticle({
    slug: "rational-domain-restrictions", topicSlug: "rational-expressions", archetype: "concept",
    title: "Domain restrictions in rational expressions", shortTitle: "Rational restrictions",
    deck: "A rational expression has no value wherever its original denominator is zero. Simplifying the formula does not restore an excluded input.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 8,
    formula: String.raw`\frac{x^2-9}{x-3}=x+3,\quad x\ne3`, immediate: { label: "Rule", text: "Find restrictions from the original denominator before canceling factors." },
    sections: [
      ["Division by zero is not defined", "A denominator records a division. Inputs that make it zero are outside the expression's domain, even when the numerator is also zero.", "Factor complicated denominators and set each factor equal to zero to identify all exclusions.", String.raw`\frac1{(x-2)(x+5)}:\quad x\ne2,-5`],
      ["A canceled factor leaves a hole", "Canceling a common nonzero factor produces a simpler expression with the same values everywhere the original was defined. At the canceled zero, the original still has no value.", "Graphically, that missing input appears as a removable discontinuity or hole rather than a vertical asymptote.", String.raw`\frac{(x-3)(x+3)}{x-3}=x+3,\ x\ne3`],
      ["Restrictions travel through algebra", "When solving an equation or combining expressions, record restrictions at the start and compare every candidate solution with them at the end.", "A candidate that violates an original denominator is extraneous, even if it satisfies a cleared equation.", String.raw`x\notin\{\text{denominator zeros}\}`],
    ],
    example: { heading: "Restrict before simplifying", prompt: "Simplify (x² − x − 6)/(x² − 4) and state the domain.", steps: [[String.raw`x^2-x-6=(x-3)(x+2)`, "Factor the numerator."], [String.raw`x^2-4=(x-2)(x+2)`, "Factor the original denominator."], [String.raw`x\ne2,-2`, "Record both original restrictions."], [String.raw`\frac{(x-3)(x+2)}{(x-2)(x+2)}=\frac{x-3}{x-2}`, "Cancel the shared factor, keeping the restrictions."]], result: String.raw`\boxed{\frac{x-3}{x-2},\quad x\ne-2,2}` },
    mistakes: ["Finding restrictions after cancellation.", "Treating 0/0 as zero.", "Reporting only the restriction still visible in the simplified denominator."], takeaways: ["Use the original denominator.", "Cancellation does not restore excluded inputs.", "Check solutions against restrictions."], related: ["simplifying-rational-expressions", "solving-rational-equations", "add-subtract-rational-expressions"],
  }),
  algebraArticle({
    slug: "simplifying-rational-expressions", topicSlug: "rational-expressions", archetype: "method",
    title: "Simplifying rational expressions by factors, not by terms", shortTitle: "Simplify rational expressions",
    deck: "Factor completely, record excluded inputs, and cancel common factors. Individual terms separated by addition cannot be canceled.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`\frac{ab}{ac}=\frac bc,\quad a\ne0`, immediate: { label: "Method", text: "Cancellation is division by a common factor. If the expression is not factored, the shared object may not be visible—or may not exist." },
    sections: [
      ["Terms are not factors", "In (x + 3)/x, the x in the numerator is one term of a sum, not a factor multiplying the entire numerator. It cannot cancel with the denominator.", "Factor bars, not visual symbols. A legal cancellation should be explainable as dividing the full numerator and denominator by the same nonzero expression.", String.raw`\frac{x+3}{x}\ne3`],
      ["Factor every polynomial first", "Use GCF, trinomial, and special-pattern factoring until numerator and denominator are products. Then identify identical factors.", "Signs matter: x − 4 and 4 − x are opposites, so one can be rewritten as −(x − 4).", String.raw`4-x=-(x-4)`],
      ["Keep the domain attached", "The simplified expression and original expression agree only on the original domain. State the canceled restrictions beside the answer.", "This makes later graphing and equation solving honest because holes do not disappear from the mathematics.", String.raw`\frac{x^2-16}{x-4}=x+4,\quad x\ne4`],
    ],
    example: { heading: "Factor, restrict, cancel", prompt: "Simplify (x² + 5x + 6)/(x² − 9).", steps: [[String.raw`x^2+5x+6=(x+2)(x+3)`, "Factor the numerator."], [String.raw`x^2-9=(x-3)(x+3)`, "Factor the denominator and note x ≠ ±3."], [String.raw`\frac{(x+2)(x+3)}{(x-3)(x+3)}=\frac{x+2}{x-3}`, "Cancel the common factor x + 3."]], result: String.raw`\boxed{\frac{x+2}{x-3},\quad x\ne-3,3}` },
    mistakes: ["Canceling terms across addition.", "Factoring only the denominator.", "Dropping a restriction when its factor cancels."], takeaways: ["Factor before canceling.", "Only common factors cancel.", "Carry the original domain."], related: ["rational-domain-restrictions", "factoring-trinomials", "add-subtract-rational-expressions"],
  }),
  algebraArticle({
    slug: "add-subtract-rational-expressions", topicSlug: "rational-expressions", archetype: "method",
    title: "Adding and subtracting rational expressions", shortTitle: "Combine rational expressions",
    deck: "Factor denominators, build the least common denominator, rewrite every numerator, then combine while preserving restrictions.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`\frac ab+\frac cd=\frac{ad+bc}{bd}`, immediate: { label: "Method", text: "Denominators must name the same-sized algebraic pieces before numerators can combine." },
    sections: [
      ["The LCD is built from factors", "Factor each denominator and include every distinct factor at its highest required power. Multiplying full denominators always works but may create avoidable clutter.", "Record all zeros from the original denominators before rewriting anything.", String.raw`x^2-4=(x-2)(x+2)`],
      ["Rewrite with equivalent fractions", "Multiply numerator and denominator by the missing factor. The value does not change because the fraction is multiplied by one.", "Use parentheses around an entire numerator when subtraction is involved so the minus sign reaches every term.", String.raw`\frac1{x-2}=\frac{x+2}{(x-2)(x+2)}`],
      ["Combine, then simplify", "Once denominators match, add or subtract only the numerators and keep the common denominator. Factor the new numerator if possible.", "A factor created after combination may cancel, but original restrictions still remain.", String.raw`\frac a d-\frac b d=\frac{a-b}{d}`],
    ],
    example: { heading: "Build a shared denominator", prompt: "Simplify 2/(x − 1) − 3/(x + 2).", steps: [[String.raw`d=(x-1)(x+2),\quad x\ne1,-2`, "Name the LCD d and record the restrictions."], [String.raw`\frac{2(x+2)}d-\frac{3(x-1)}d`, "Supply each missing factor."], [String.raw`\frac{2x+4-3x+3}{d}`, "Distribute the subtraction through the second numerator."], [String.raw`\frac{7-x}{(x-1)(x+2)}`, "Combine like terms and replace d with its factors."]], result: String.raw`\boxed{\frac{7-x}{(x-1)(x+2)},\quad x\ne1,-2}` },
    mistakes: ["Adding denominators along with numerators.", "Forgetting to multiply a numerator by the missing factor.", "Failing to distribute a subtraction across a grouped numerator."], takeaways: ["Factor denominators first.", "Use the least common denominator.", "Combine numerators only after rewriting."], related: ["simplifying-rational-expressions", "solving-rational-equations", "rational-domain-restrictions"],
  }),
  algebraArticle({
    slug: "solving-rational-equations", topicSlug: "rational-expressions", archetype: "method",
    title: "Solving rational equations without accepting forbidden answers", shortTitle: "Solve rational equations",
    deck: "List restrictions, multiply every term by the least common denominator, solve the resulting equation, and reject candidates outside the original domain.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 11,
    formula: String.raw`\frac{p(x)}{q(x)}=\frac{r(x)}{s(x)}`, immediate: { label: "Workflow", text: "Restrictions first, denominator clearing second, solution check last. Clearing fractions does not erase the original domain." },
    sections: [
      ["Restrictions come before algebra", "Set every original denominator factor unequal to zero. This exclusion list becomes the final filter for candidate solutions.", "If a later operation produces an excluded value, report that it is extraneous rather than quietly keeping it.", String.raw`q(x)s(x)\ne0`],
      ["The LCD must multiply every term", "Multiplying both sides by the least common denominator clears fractions because each denominator divides it. Terms without visible denominators are multiplied too.", "Write the multiplier beside each term before canceling to avoid skipping a constant or distributing incompletely.", String.raw`d\left(\frac a p+q\right)=\frac{da}p+dq`],
      ["Check in the original equation", "A candidate may solve the cleared polynomial but fail the rational equation because a denominator becomes zero. Substitution into the original form catches that.", "Cross-multiplication is a shortcut only for one fraction equal to one fraction; it does not replace the general LCD method.", String.raw`\frac ab=\frac cd\Rightarrow ad=bc`],
    ],
    example: { heading: "Clear denominators safely", prompt: "Solve 2/(x − 1) = 3/(x + 2).", steps: [[String.raw`x\ne1,-2`, "Record original restrictions."], [String.raw`2(x+2)=3(x-1)`, "Multiply by (x − 1)(x + 2)."], [String.raw`2x+4=3x-3\Rightarrow x=7`, "Solve the linear equation."], [String.raw`\frac2{7-1}=\frac3{7+2}=\frac13`, "Check in the original equation."]], result: String.raw`\boxed{x=7}` },
    mistakes: ["Clearing some denominators but not every term.", "Finding restrictions after solving.", "Keeping an excluded candidate."], takeaways: ["State restrictions first.", "Multiply every term by the LCD.", "Check candidates in the original equation."], related: ["rational-domain-restrictions", "add-subtract-rational-expressions", "solving-linear-equations"],
  }),
  algebraArticle({
    slug: "direct-inverse-variation", topicSlug: "rational-expressions", archetype: "decision",
    title: "Direct or inverse variation: which model matches the relationship?", shortTitle: "Direct vs inverse variation",
    deck: "Direct variation keeps a constant ratio y/x; inverse variation keeps a constant product xy. The data pattern decides the model.",
    course: "Algebra II", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`y=kx\qquad y=\frac{k}{x}`, immediate: { label: "Decision", text: "If doubling x doubles y, test direct variation. If doubling x halves y, test inverse variation." },
    sections: [
      ["Direct variation passes through the origin", "In y = kx, the constant k is both the ratio y/x and the slope. When x is zero, y is zero.", "A nonzero starting value belongs to a general linear model y = mx + b, not direct variation.", String.raw`\frac yx=k`],
      ["Inverse variation keeps a product constant", "In y = k/x, increasing one quantity forces the other down so that xy stays equal to k. The graph has two branches and excludes x = 0.", "Travel time for a fixed distance and pressure-volume relationships under controlled conditions are common examples.", String.raw`xy=k`],
      ["Test more than one data pair", "One pair can determine k for either proposed model. Use another pair to test whether the same ratio or product remains constant.", "Real data may only approximate variation, so distinguish an exact algebra exercise from a fitted scientific model.", String.raw`\frac{y_1}{x_1}=\frac{y_2}{x_2}\quad\text{or}\quad x_1y_1=x_2y_2`],
    ],
    example: { heading: "Identify the invariant", prompt: "For (x, y) = (2, 18), (3, 12), and (6, 6), determine the variation model.", steps: [[String.raw`\frac{18}{2}=9,\ \frac{12}{3}=4,\ \frac66=1`, "The ratios are not constant, so it is not direct variation."], [String.raw`2(18)=36,\ 3(12)=36,\ 6(6)=36`, "The products are constant."], [String.raw`y=\frac{36}{x}`, "Use k = 36 in the inverse model."]], result: String.raw`\boxed{y=\frac{36}{x}}` },
    mistakes: ["Calling every line a direct variation.", "Checking only one data pair.", "Forgetting that inverse variation excludes x = 0."], takeaways: ["Direct variation preserves a ratio.", "Inverse variation preserves a product.", "Use multiple data pairs to test the model."], related: ["interpreting-linear-models", "rational-domain-restrictions", "function-notation"],
  }),
];
