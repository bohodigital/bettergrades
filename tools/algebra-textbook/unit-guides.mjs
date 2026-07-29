const guide = ({ principles, definitions, misconception, representation, check }) => ({
  principles,
  definitions,
  misconception,
  representation,
  check,
});

export const UNIT_GUIDES = Object.freeze({
  A3: guide({
    principles: [
      "An equation identifies values that make two expressions equal; an inequality identifies values that place one expression above, below, inside, or outside a boundary. That difference changes the shape of an answer. A linear equation often ends at one value, while a linear inequality usually ends with an interval or union of intervals. The answer must therefore name a set, not merely a boundary number. Test points reveal which side of a boundary belongs to the truth set, and endpoint notation records whether equality is permitted.",
      "Inequality operations preserve order only when the transformation preserves direction. Adding the same value to both sides translates both quantities equally. Multiplying by a positive number rescales without changing which is larger. Multiplying by a negative number also reflects the number line, so the order reverses. The familiar instruction to reverse the symbol is a consequence of that reflection, not an isolated sign rule. A quick numerical comparison before and after scaling makes the reason visible.",
      "Distance statements unify absolute-value equations and inequalities. The expression |x − a| measures the distance from x to the center a. Equality to a nonnegative radius produces two boundary points, a less-than condition produces an interval around the center, and a greater-than condition produces two exterior rays. Literal equations extend the same preservation principle to formulas: isolate the requested quantity without changing the relationship, carry units, and state any nonzero divisor required by the rearrangement.",
    ],
    definitions: [
      ["truth set", "The set of every allowed value that makes a statement true.", "A complete answer includes endpoint inclusion and any domain restrictions."],
      ["equivalent inequality", "An inequality with exactly the same truth set as the original.", "Negative scaling reverses the order symbol because it reverses order."],
      ["boundary value", "A value where the truth of an inequality can change.", "The boundary is included only when equality is part of the condition and the expression is defined there."],
    ],
    misconception: ["Reporting only the boundary value after solving an inequality.", "A boundary separates regions but does not by itself state which region satisfies the condition or whether the endpoint is included.", "Write the solution as an inequality or interval, then test one interior point in the original condition."],
    representation: "Use an inequality, interval notation, and a number-line description; each must show the same endpoints, inclusion, and direction.",
    check: "Test a value inside the proposed set, a value outside it, and every boundary value in the original condition.",
  }),
  A4: guide({
    principles: [
      "Ratios, rates, proportions, slope, and linear equations all describe comparisons between changing quantities. A ratio keeps the order of its quantities; a unit rate rewrites the comparison per one unit; a proportional relationship keeps the same multiplicative constant for every corresponding pair. The units are part of the mathematics. Miles per hour and hours per mile are reciprocals, not interchangeable labels, and percent change must compare the change with the original quantity.",
      "A point (x, y) on a graph is a claim that the two coordinates satisfy the relationship simultaneously. Intercepts are special points where one coordinate is zero. Slope measures the change in output per unit change in input, so it carries units and remains constant on a nonvertical line. Computing slope with a consistent subtraction order prevents an artificial sign error: if the numerator uses second minus first, the denominator must do the same.",
      "Different linear forms expose different information. Slope-intercept form displays rate and vertical intercept, point-slope form preserves a known point and slope, and standard form can emphasize integer coefficients or intercept structure. A model fitted to data is not the same as an exact law. Residuals measure observed minus predicted values, patterns in residuals warn that a linear model misses structure, and extrapolation becomes less trustworthy as it moves beyond the observed input range.",
    ],
    definitions: [
      ["unit rate", "A ratio whose denominator is one unit of the comparison quantity.", "Keep the order and units of the original comparison."],
      ["slope", "The constant ratio of vertical change to horizontal change along a nonvertical line.", "A vertical line has undefined slope because its horizontal change is zero."],
      ["linear model", "An equation used to approximate a relationship with constant average change.", "The model’s domain and accuracy depend on the observed context and residual behavior."],
    ],
    misconception: ["Treating every straight-looking data display as an exact proportional relationship.", "A proportional graph must pass through the origin, while a general line may have a nonzero intercept and fitted data may only be approximately linear.", "Check the intercept, constant rate, residuals, units, and context before naming the relationship."],
    representation: "Coordinate the context, a table of ordered pairs, the graph, and a linear equation with labeled units.",
    check: "Substitute known points, verify the slope units and sign, and compare predicted values with the original data or context.",
  }),
  A5: guide({
    principles: [
      "A system asks for values that satisfy several conditions at the same time. A proposed ordered pair is not a solution because it works in one equation; it must make every equation or inequality true. Graphically, equality systems are solved at intersections and inequality systems are solved on overlapping regions. Algebraically, substitution and elimination preserve the shared solution set while reducing the number of unknowns.",
      "Method choice should respond to structure. Graphing is useful for estimating solution count and interpreting geometry. Substitution is efficient when one variable is already isolated or has coefficient one. Elimination is efficient when coefficients already match or can be matched with small multipliers. Scaling an entire equation preserves its solutions, but scaling only selected terms changes the condition and invalidates the system.",
      "The final algebraic statement classifies the geometry. A unique ordered pair corresponds to intersecting lines. A true identity such as 0 = 0 means the equations describe the same line and therefore share infinitely many points. A contradiction such as 0 = 5 means the lines are parallel and distinct. In applications, define both unknowns and units before writing equations; otherwise two correct equations may answer the wrong question.",
    ],
    definitions: [
      ["system solution", "A value or ordered pair that satisfies every condition in a system simultaneously.", "Checking only one equation is insufficient."],
      ["dependent system", "A system whose equations describe the same solution set.", "For two equivalent lines, every point on the line is a solution."],
      ["inconsistent system", "A system with no shared solution.", "Parallel distinct lines and disjoint feasible regions are common examples."],
    ],
    misconception: ["Stopping after finding values that satisfy only the transformed equation or one original equation.", "A system solution must survive every original condition; an algebraic reduction can hide a copied sign or scaling error.", "Substitute the ordered pair into every original equation and interpret both coordinates with units."],
    representation: "Connect the pair of equations, their graph or feasible regions, and the ordered-pair check.",
    check: "Substitute the proposed values into every original condition and verify the geometric intersection or overlap.",
  }),
  A6: guide({
    principles: [
      "An exponent records repeated multiplication of a base, not repeated multiplication of the exponent. Parentheses determine the base: −3² means the opposite of 3², while (−3)² squares the negative number. Exponent laws are bookkeeping rules for repeated factors. They apply only when their structural conditions hold, such as a common base for product and quotient laws or an exponent acting on an entire grouped product.",
      "Zero and negative exponents are defined so established exponent laws remain consistent. For nonzero a, a⁰ = 1 and a⁻ⁿ = 1/aⁿ. These statements carry the restriction a ≠ 0; a negative exponent does not make a value negative. Scientific notation uses the same powers-of-ten structure with a normalized coefficient whose absolute value is at least one and less than ten.",
      "Roots reverse power questions. The principal square-root symbol names the nonnegative root, while solving x² = k asks for every real value whose square is k and therefore may produce two solutions. Even and odd roots have different real-domain behavior. Tables and function graphs make those differences visible: even powers lose the sign of their input, odd powers preserve it, and a square-root function begins at its domain boundary.",
    ],
    definitions: [
      ["base", "The quantity repeatedly multiplied in a power.", "Grouping determines whether a sign, fraction, or product belongs to the base."],
      ["principal root", "The designated nonnegative even root of a nonnegative real number.", "It is one function value, not automatically every solution of a power equation."],
      ["negative exponent", "Notation for the reciprocal of a positive power.", "The base must be nonzero."],
    ],
    misconception: ["Applying an exponent to only one factor or term when grouping shows that it acts on an entire product or quotient.", "A power acts on the complete base; skipping a factor changes the repeated multiplication.", "Write the grouped base as repeated factors, simplify, and then compress the result with an exponent law."],
    representation: "Use repeated factors, exponent notation, a value table, and a function graph when the lesson concerns a power family.",
    check: "Expand a small instance into repeated factors and substitute the result back into the original power or root statement.",
  }),
  A7: guide({
    principles: [
      "A polynomial is a finite sum of terms with nonnegative whole-number exponents. Standard form orders terms by descending degree, making the leading term and missing powers visible. Polynomial operations follow familiar arithmetic: combine only like powers for addition and subtraction, multiply coefficients and add exponents for monomial products, and distribute every term of one factor to every term of the other.",
      "Organization prevents most polynomial errors. Subtraction must distribute the negative sign to every term in the subtracted polynomial. A multiplication grid or carefully written partial products ensures that no pair is omitted. Special products are consequences of general distribution, not separate magic formulas; recognizing them improves speed only after the exact binomial structure has been confirmed.",
      "Division reverses multiplication. Dividing by a monomial requires every term to be divisible and inherits the nonzero restriction of the divisor. Long division aligns like powers just as whole-number division aligns place values, and the final identity dividend = divisor·quotient + remainder provides a complete check. The remainder must have lower degree than the divisor.",
    ],
    definitions: [
      ["polynomial", "A finite sum of coefficient-variable terms with nonnegative integer exponents.", "Variables may not appear in denominators or under radicals in a polynomial expression."],
      ["like terms", "Terms with exactly the same variable factors raised to the same powers.", "Only their coefficients may be combined by addition or subtraction."],
      ["polynomial identity", "An equality between polynomial expressions that holds for every input.", "Expansion, factoring, and division checks establish identities."],
    ],
    misconception: ["Combining unlike powers or distributing to only the first term of a polynomial.", "Terms with different variable parts represent different quantities, and multiplication must reach every term in the grouped factor.", "Align powers, write every partial product, combine only matching powers, and multiply back to check."],
    representation: "Use standard form, an area or multiplication grid when helpful, and the expanded/factored identity.",
    check: "Reverse the operation: subtract to check addition, expand to check multiplication patterns, or reconstruct dividend = divisor·quotient + remainder.",
  }),
  A8: guide({
    principles: [
      "Factoring rewrites a sum as a product and is therefore reverse distribution. Begin with the greatest common factor because every later factorization depends on removing shared structure first. Different trinomial methods organize the same product-and-sum constraints: simple trinomials use factor pairs directly, while a leading coefficient other than one often uses the ac product and grouping.",
      "Patterns are valid only under exact structural conditions. A difference of squares requires two square terms separated by subtraction; a sum of squares does not factor the same way over the real numbers. A perfect-square trinomial requires square endpoints and a middle term equal to twice their product. Expanding a proposed factorization is the fastest reliable test because it must recover every coefficient and sign.",
      "Quadratic-solving methods begin after the equation is written with zero on one side or an isolated square where appropriate. Factoring uses the zero-product property. The square-root method requires both roots. Completing the square creates a perfect square while preserving equality. The quadratic formula works for every quadratic with nonzero leading coefficient, and its discriminant predicts whether real roots are two distinct values, one repeated value, or absent.",
    ],
    definitions: [
      ["factorization", "An equivalent product whose expansion reproduces the original expression.", "The coefficient system—integers, rationals, reals, or complex numbers—affects whether a polynomial is irreducible."],
      ["zero-product property", "If a product of real or complex factors equals zero, at least one factor equals zero.", "It applies only after one side of the equation is zero."],
      ["discriminant", "The quantity b² − 4ac in the quadratic formula.", "Its sign predicts the number of real roots before the formula is fully evaluated."],
    ],
    misconception: ["Using a factoring pattern or zero-product reasoning before the required structure is present.", "A pattern with the wrong signs or coefficients is not equivalent, and a product equal to a nonzero number does not force a factor to zero.", "Normalize the equation, factor completely, expand to verify, then apply the zero-product property and check each root."],
    representation: "Coordinate expanded, factored, and completed-square forms with zeros, symmetry, and the corresponding parabola.",
    check: "Expand any factorization and substitute every proposed solution into the original quadratic equation.",
  }),
  A9: guide({
    principles: [
      "Standard, factored, and vertex forms describe the same quadratic function while exposing different features. Standard form emphasizes the leading coefficient and vertical intercept. Factored form exposes zeros when real factors exist. Vertex form exposes the axis of symmetry and maximum or minimum. Changing form should answer a question, not become an automatic ritual.",
      "The leading coefficient determines whether a parabola opens upward or downward and controls its vertical scale. The vertex and axis organize symmetry, while intercepts anchor the graph. A careful sketch uses structure before plotting many points. Algebra and graph must agree: real roots are horizontal intercepts, a repeated root touches the axis, and a negative discriminant means the graph has no real horizontal intercept.",
      "Quadratic models are useful when change itself changes at an approximately constant rate. The vertex may represent a maximum height, minimum cost, or optimal area, but its meaning depends on units and the realistic domain. Regression can summarize curved data without proving causation. Residual patterns, sample range, and context determine whether prediction or extrapolation is defensible.",
    ],
    definitions: [
      ["vertex", "The turning point of a parabola and the location of its maximum or minimum output.", "Its contextual meaning depends on the model’s domain and units."],
      ["axis of symmetry", "The vertical line through the vertex that divides a parabola into mirror halves.", "For ax² + bx + c, its equation is x = −b/(2a)."],
      ["quadratic model", "A degree-two function used to describe a relationship with changing rate.", "Model fit does not establish causation or unlimited extrapolation."],
    ],
    misconception: ["Reading a feature from one quadratic form without confirming that the expression is actually in that form.", "The coefficients have different roles in standard, factored, and vertex forms.", "Label the form, identify the feature it exposes, and verify it by expansion, substitution, or the graph."],
    representation: "Use equivalent standard, factored, and vertex forms together with a labeled parabola.",
    check: "Verify the vertex, intercepts, symmetry, opening direction, and any contextual domain against the chosen formula.",
  }),
  A10: guide({
    principles: [
      "A rational expression is a quotient of polynomials and inherits every value excluded by its original denominator. Restrictions are part of the expression’s identity and survive simplification. Cancellation applies to common factors in a product, not to terms separated by addition or subtraction. Factoring first reveals whether a legitimate common factor exists.",
      "Rational operations follow fraction structure. Multiply and divide by factoring and using reciprocals, but add and subtract only after creating a common denominator. The least common denominator contains every irreducible factor at the greatest power required. Complex rational expressions become ordinary rational expressions when numerator and denominator are multiplied by a common LCD, which is multiplication by a carefully chosen form of one.",
      "Clearing denominators in an equation produces candidate solutions because the multiplier can be zero at excluded inputs. Every candidate must be checked in the original equation. Rational inequalities also use zeros and restrictions as critical values, but restrictions are never included. On graphs, a canceled factor can create a hole, while an uncanceled denominator factor can create a vertical asymptote; the algebra explains the distinction.",
    ],
    definitions: [
      ["domain restriction", "An input excluded because it makes an original denominator zero.", "The restriction remains even when the corresponding factor later cancels."],
      ["least common denominator", "A product containing every denominator factor at its greatest required power.", "Each denominator must divide the LCD exactly."],
      ["rational equation candidate", "A value obtained after denominator clearing that may or may not solve the original equation.", "Every candidate must satisfy all original restrictions and the original equality."],
    ],
    misconception: ["Cancelling terms across addition or erasing a restriction after a factor cancels.", "Cancellation divides an entire numerator and denominator by a common nonzero factor; separate terms are not factors.", "Factor completely, state restrictions first, cancel only common factors, and check candidates in the original expression or equation."],
    representation: "Show the original restriction set, factored form, simplified form, and graph features such as holes or asymptotes when relevant.",
    check: "Substitute a permitted test value into original and simplified forms, and test every equation candidate in the original denominators.",
  }),
  A11: guide({
    principles: [
      "Radicals and rational exponents express inverse power relationships. Simplifying a radical extracts perfect-power factors while preserving exact value. Product and quotient properties require valid real-domain conditions, and like radicals can combine only after simplification produces the same index and radicand. Approximation should follow, not replace, exact simplification.",
      "Rationalizing a denominator multiplies by a form of one. A monomial radical denominator uses the missing radical factor; a binomial radical denominator uses its conjugate so the difference-of-squares pattern removes the radicals. The original value and domain must remain unchanged. Rational exponents encode the same operations: the denominator of the exponent names a root and the numerator names a power.",
      "Solving a radical equation requires isolating a radical before raising both sides to a power. Even powers are not reversible over all real numbers and can create extraneous candidates, so every result must be checked in the original equation and against its real domain. Complex numbers extend the system so negative real numbers have square roots, with i² = −1 and conjugates supporting consistent arithmetic.",
    ],
    definitions: [
      ["radicand", "The expression inside a radical symbol.", "For an even real root, the radicand must be nonnegative."],
      ["conjugate", "A binomial formed by changing the sign between the same two terms.", "Multiplying conjugates produces a difference of squares."],
      ["extraneous solution", "A candidate created by a nonreversible step that fails the original equation or domain.", "Powering both sides of a radical equation commonly creates such candidates."],
    ],
    misconception: ["Combining unlike radicals, distributing a root across addition, or accepting every powered-equation result.", "Radical properties apply to products and quotients under stated conditions, not generally to sums, and even powers can enlarge a solution set.", "Simplify first, use only valid properties, isolate before powering, and check every candidate in the original equation."],
    representation: "Coordinate radical form, rational-exponent form, exact value, and the real or complex domain.",
    check: "Raise a simplified radical back to the appropriate power and substitute every equation candidate into the original statement.",
  }),
  A12: guide({
    principles: [
      "A function assigns exactly one output to each allowed input. Function notation records that assignment: f(a) is the output produced when the input is a, not a product of f and a. A function may be represented by a formula, table, graph, mapping, or context; the defining requirement is single-valued output for each input in its domain.",
      "Domain describes allowed inputs and range describes produced outputs. Denominators exclude zero, even roots require nonnegative radicands in the real system, and contexts can impose additional limits such as nonnegative time or whole-number counts. Solving f(x) = k reverses the assignment question and may yield several inputs, one input, or none even though f itself remains a function.",
      "Piecewise functions use different rules on specified input regions, so endpoint conditions decide which formula applies. Arithmetic with functions combines output values and inherits the intersection of relevant domains; division adds the requirement that the divisor function be nonzero. Comparing families means comparing change patterns, domain restrictions, and characteristic graph behavior rather than merely matching visual shapes.",
    ],
    definitions: [
      ["function", "A relation assigning exactly one output to each input in its domain.", "Different inputs may share an output; one input may not have two outputs."],
      ["domain", "The set of allowed input values.", "It reflects algebraic restrictions and contextual constraints."],
      ["range", "The set of output values actually produced by allowed inputs.", "Range depends on both the rule and the domain."],
    ],
    misconception: ["Treating function notation as multiplication or confusing a function with the equation used to represent one branch of it.", "Notation names an input-output assignment, and the domain or piecewise condition determines which rule is active.", "Identify the input, domain, active rule, and output before performing arithmetic or reading the graph."],
    representation: "Use a mapping or table, a formula with domain, and a graph that passes the vertical-line test.",
    check: "Verify every input uses exactly one permitted rule and that computed outputs agree across the available representations.",
  }),
  A13: guide({
    principles: [
      "Linear change adds a constant amount over equal input intervals; exponential change multiplies by a constant factor. In a table, constant differences signal linear structure and constant ratios signal exponential structure. A repeated percent change uses the multiplier 1 + r for growth or 1 − r for decay, so equal percentages compound rather than add.",
      "An exponential function f(x) = abˣ has initial value a and base b, with b positive and not equal to one. The base determines growth or decay, while transformations shift, scale, or reflect the graph and move its horizontal asymptote. Models require a meaningful time unit and domain. Compound interest distinguishes nominal rate from the rate per compounding period, and continuous change uses e as the natural limiting base.",
      "A logarithm answers an exponent question. The statement log_b(y) = x is equivalent to bˣ = y, with b > 0, b ≠ 1, and y > 0. Logarithm laws follow from exponent laws: products become sums, quotients become differences, and powers become coefficients. There is no corresponding rule that splits log(a + b). Solving logarithmic equations requires every final log argument to remain positive.",
    ],
    definitions: [
      ["growth factor", "The constant multiplier applied during each equal input interval.", "For percent rate r, the factor is 1 + r for growth and 1 − r for decay."],
      ["logarithm", "The exponent to which a valid base must be raised to produce a positive argument.", "The base is positive and not one; the argument is positive."],
      ["horizontal asymptote", "A horizontal line approached by a function’s outputs as inputs move in a direction.", "A model may approach the line without reaching it in its theoretical domain."],
    ],
    misconception: ["Adding a percent repeatedly, treating a logarithm as an ordinary factor, or applying a false sum law.", "Exponential change compounds multiplicatively and logarithm laws translate exponent structure, not arbitrary addition.", "Write the multiplier or equivalent exponential equation, preserve base and argument restrictions, and check the result in the original model."],
    representation: "Use a table of differences or ratios, an exponential formula, a graph with asymptote, and the equivalent logarithmic statement.",
    check: "Verify the initial value, per-period multiplier, domain, and any logarithmic candidate in the original exponential or log equation.",
  }),
  A14: guide({
    principles: [
      "Strong Algebra begins by classifying the object and the requested action. An expression may be simplified or evaluated; an equation may be solved; an inequality asks for a truth set; a system asks for simultaneous values; a function question may ask for an output, input, domain, range, or model feature. The visible symbols alone do not determine the task—the verb and context do.",
      "Method selection follows structure. Linear equations invite inverse operations, products equal to zero invite factoring and the zero-product property, isolated powers invite roots, quadratic equations always permit the quadratic formula, rational equations invite restriction analysis and denominator clearing, radical equations invite isolation and powering, and exponential or logarithmic equations may require inverse functions. A disguised form should be rewritten before a method is chosen.",
      "Not every algebraic step is reversible. Adding the same expression, multiplying by a known nonzero value, or applying a one-to-one operation can preserve equivalence under stated conditions. Squaring, clearing a possibly zero denominator, or multiplying by an expression can create candidates. Exact answers preserve structure and should precede decimal approximation. Graphs support solution count and plausibility; algebra supplies exact justification.",
    ],
    definitions: [
      ["equivalence step", "A reversible transformation that preserves exactly the original solution or truth set.", "Any domain or nonzero condition required for reversibility must be stated."],
      ["candidate solution", "A value produced by a method that still requires verification.", "Candidates arise after one-way operations such as squaring or denominator clearing."],
      ["method selection", "Choosing a valid and efficient procedure from the object’s structure and the question asked.", "Classification comes before calculation."],
    ],
    misconception: ["Choosing a method from a superficial symbol or accepting calculator output without structural checks.", "The same symbol can occur in different families, and numerical output can hide domain, precision, or extraneous-solution errors.", "Classify the object, mark restrictions, choose the method, preserve exact form, and cross-check against the original statement and graph."],
    representation: "Use a classification statement, exact algebra, an appropriate graph or table, and a final contextual interpretation.",
    check: "Verify restrictions, substitute candidates, compare exact and approximate forms, and use the graph only as supporting evidence.",
  }),
});

export function getUnitGuide(unitCode) {
  return UNIT_GUIDES[unitCode] ?? null;
}
