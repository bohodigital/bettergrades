const e = (prompt, work, answer, interpretation) => ({
  prompt,
  steps: work.split("|"),
  answer,
  interpretation,
});

export const EXTRA_EXAMPLES_A7_A10 = Object.freeze({
  "A7.1": [
    e("For p(x) = −3x⁴ + 2x² − 7, identify the degree, leading coefficient, constant term, and p(−2).", "Read the highest exponent 4 and its coefficient −3.|The constant term is −7.|Substitute −2 with parentheses and evaluate each power.", "Degree 4, leading coefficient −3, constant −7, and p(−2) = −47.", "Vocabulary describes structure, while evaluation turns the polynomial into a numerical output."),
    e("Write 5 − 2x³ + 7x − x⁵ in standard form and classify it by degree.", "Order terms from greatest exponent to least.|Preserve each coefficient and sign.|Read the highest remaining exponent.", "−x⁵ − 2x³ + 7x + 5; degree 5.", "Standard form makes the leading term and degree immediately visible."),
  ],
  "A7.2": [
    e("Simplify (4x³ − 2x² + 7x − 1) + (−x³ + 5x² − 3).", "Group terms with identical variable parts.|Add their coefficients.|Write the result in descending powers.", "3x³ + 3x² + 7x − 4.", "Only like terms combine because only they represent the same algebraic quantity."),
    e("Subtract (2a² − 5a + 8) − (−3a² + a − 4).", "Distribute the subtraction sign to every term in the second polynomial.|Combine a² terms, a terms, and constants.|Check by adding the second polynomial back to the difference.", "5a² − 6a + 12.", "Polynomial subtraction means adding the opposite of the entire subtracted polynomial."),
  ],
  "A7.3": [
    e("Multiply (−4x³y²)(3x⁵y⁻¹) and use positive exponents.", "Multiply coefficients to obtain −12.|Add exponents of x and of y.|Simplify y²y⁻¹ to y.", "−12x⁸y.", "Monomial multiplication combines numerical factors and repeated factors independently."),
    e("Find the area of a rectangle with side lengths 6a²b and 5ab³.", "Multiply the coefficients 6 and 5.|Add exponents of matching bases.|Attach square units to the product.", "30a³b⁴ square units.", "A geometric product follows the same monomial laws while retaining its dimensional meaning."),
  ],
  "A7.4": [
    e("Expand −3x²(2x³ − 5x + 4).", "Multiply −3x² by each term inside the parentheses.|Multiply coefficients and add exponents of x.|Preserve the signs of all three products.", "−6x⁵ + 15x³ − 12x².", "The distributive property requires the monomial to reach every polynomial term."),
    e("Factor-check the expansion 4ab(3a² − 2ab + b²).", "Distribute 4ab across the three terms.|Obtain 12a³b, −8a²b², and 4ab³.|Factor 4ab back out to verify the original form.", "12a³b − 8a²b² + 4ab³.", "Expansion and common-factor extraction are inverse operations."),
  ],
  "A7.5": [
    e("Multiply (2x − 3)(x² + 4x − 5).", "Distribute 2x across the trinomial.|Distribute −3 across the trinomial.|Combine the like x² and x terms.", "2x³ + 5x² − 22x + 15.", "Organized distribution ensures every term in one factor multiplies every term in the other."),
    e("Multiply (x² + x + 1)(x² − x + 1).", "Distribute each term of the first trinomial.|Collect terms by degree.|Observe cancellation of the cubic and linear terms.", "x⁴ + x² + 1.", "A symmetric factor structure can produce cancellation that is easy to miss without aligned terms."),
  ],
  "A7.6": [
    e("Expand (3x − 5)² without dropping the middle term.", "Use (a − b)² = a² − 2ab + b².|Compute (3x)², −2(3x)(5), and 5².|Combine the three terms.", "9x² − 30x + 25.", "Squaring a binomial includes two equal cross-products."),
    e("Compute (2y + 7)(2y − 7) using structure.", "Recognize conjugate binomials a + b and a − b.|Apply the difference-of-squares identity a² − b².|Square 2y and 7.", "4y² − 49.", "Opposite middle terms cancel in a conjugate product."),
  ],
  "A7.7": [
    e("Divide (18x⁵ − 12x³ + 6x²)/(6x²).", "Divide each numerator term by 6x².|Simplify coefficients and subtract exponents.|Retain the original restriction x ≠ 0.", "3x³ − 2x + 1, with x ≠ 0.", "Division by a monomial distributes across a sum because every term shares that divisor."),
    e("Simplify (−15a⁴b³ + 10a²b⁵)/(5a²b²).", "Divide both terms by 5a²b².|Simplify the first quotient to −3a²b and the second to 2b³.|State original denominator restrictions.", "−3a²b + 2b³, with a ≠ 0 and b ≠ 0.", "Termwise division is valid only because the common monomial divides every term."),
  ],
  "A7.8": [
    e("Divide x³ − 4x² + x + 6 by x − 2.", "Divide x³ by x to get x² and subtract x³ − 2x².|Divide −2x² by x to get −2x and subtract −2x² + 4x.|Divide −3x by x to get −3 and subtract −3x + 6.", "x² − 2x − 3, remainder 0.", "A zero remainder verifies that x − 2 is a polynomial factor."),
    e("Divide 2x³ + x² − 5 by x + 1.", "Insert the missing 0x term before division.|Successive quotient terms are 2x², −x, and x.|Subtract the final product x² + x to obtain remainder −6.", "2x² − x + 1 − 6/(x + 1).", "Missing powers require zero placeholders, and a nonzero remainder is written over the divisor."),
  ],
  "A7.9": [
    e("Simplify (x + 2)(x − 2) + 4x − (x² − 3x).", "Recognize the conjugate product as x² − 4.|Distribute the subtraction across x² − 3x.|Combine like terms.", "7x − 4.", "Structure recognition shortens the work, but ordinary sign rules still control the final combination."),
    e("Determine whether 6x⁴ − 9x³ + 3x² is written most usefully in expanded form or factored form for finding zeros.", "Extract the greatest common factor 3x².|Factor the remaining quadratic 2x² − 3x + 1 as (2x − 1)(x − 1).|Read zeros from the product.", "3x²(2x − 1)(x − 1); zeros 0, 1/2, and 1.", "The useful form depends on the question; factored form exposes zeros hidden in expanded form."),
  ],

  "A8.1": [
    e("Factor 18x⁴y − 24x³y² completely by greatest common factor.", "The coefficient GCF is 6.|The shared variable factor is x³y.|Divide each term by 6x³y to obtain the remaining binomial.", "6x³y(3x − 4y).", "A complete GCF includes the greatest numerical factor and the least exponent of each shared variable."),
    e("Factor 5a(a − 3) + 2(a − 3).", "Identify the shared binomial factor a − 3.|Factor it out as one algebraic object.|Check by distributing.", "(a − 3)(5a + 2).", "A common factor may be an entire expression, not only a monomial."),
  ],
  "A8.2": [
    e("Factor x³ + 4x² + 3x + 12 by grouping.", "Group as (x³ + 4x²) + (3x + 12).|Factor x² from the first group and 3 from the second.|Extract the common binomial x + 4.", "(x + 4)(x² + 3).", "Grouping succeeds when the groups expose the same binomial factor."),
    e("Factor 6a² − 9a + 4ab − 6b by grouping.", "Group (6a² − 9a) + (4ab − 6b).|Factor 3a and 2b to obtain 3a(2a − 3) + 2b(2a − 3).|Extract the common binomial.", "(2a − 3)(3a + 2b).", "The grouping arrangement is chosen to create a repeated factor."),
  ],
  "A8.3": [
    e("Factor x² − 11x + 24.", "Find two integers whose product is 24 and sum is −11.|Choose −3 and −8.|Write the corresponding binomial factors and verify by expansion.", "(x − 3)(x − 8).", "For a monic trinomial, the factor constants multiply to c and add to b."),
    e("Decide whether x² + 4x + 7 factors over the integers.", "Integer factors would require two integers with product 7 and sum 4.|The pairs 1 and 7 or −1 and −7 have sums 8 or −8.|Conclude that no integer binomial factorization exists.", "Irreducible over the integers.", "Failure to find a valid factor pair is a mathematical conclusion when all divisor pairs have been checked."),
  ],
  "A8.4": [
    e("Factor 6x² + 11x + 3.", "Compute ac = 18 and find 9 and 2, whose sum is 11.|Split the middle term: 6x² + 9x + 2x + 3.|Factor by grouping.", "(3x + 1)(2x + 3).", "The ac method rewrites the middle term so grouping can expose two binomial factors."),
    e("Factor 8y² − 14y − 15.", "Compute ac = −120 and choose −20 and 6, whose sum is −14.|Rewrite as 8y² − 20y + 6y − 15.|Factor the two groups.", "(4y + 3)(2y − 5).", "A negative constant requires factor constants of opposite sign."),
  ],
  "A8.5": [
    e("Factor 25x² − 64 completely.", "Recognize squares (5x)² and 8².|Apply a² − b² = (a − b)(a + b).|Check by multiplying conjugates.", "(5x − 8)(5x + 8).", "A difference of squares factors into conjugates."),
    e("Factor 9a² + 30ab + 25b².", "Recognize 9a² = (3a)² and 25b² = (5b)².|Check that the middle term is 2(3a)(5b) = 30ab.|Write the perfect-square binomial.", "(3a + 5b)².", "The middle-term check distinguishes a perfect-square trinomial from a merely square-ended trinomial."),
  ],
  "A8.6": [
    e("Factor 12x³ − 27x completely.", "First extract the GCF 3x.|The remaining 4x² − 9 is a difference of squares.|Factor the difference of squares.", "3x(2x − 3)(2x + 3).", "A general strategy repeats: GCF first, then inspect the reduced expression for a named pattern."),
    e("Factor 2x³ + 8x² + 3x + 12 completely.", "There is no nontrivial GCF.|Group as 2x²(x + 4) + 3(x + 4).|Extract x + 4 and inspect the remaining factor.", "(x + 4)(2x² + 3), irreducible over the integers.", "Complete factoring includes a justified stopping point."),
  ],
  "A8.7": [
    e("Solve (4x + 1)(x − 6) = 0.", "Apply the zero-product property to the two factors.|Solve 4x + 1 = 0 and x − 6 = 0.|Substitute both values into the product.", "x = −1/4 or x = 6.", "A product equals zero exactly when at least one real factor equals zero."),
    e("Explain why the zero-product property cannot be applied directly to (x − 2)(x + 5) = 18, then solve by rewriting.", "The product is not equal to zero, so setting each factor to 18 or 0 is invalid.|Expand and move 18 to obtain x² + 3x − 28 = 0.|Factor as (x + 7)(x − 4) = 0.", "x = −7 or x = 4.", "The zero-product property requires a zero on one side before factors can be set equal to zero."),
  ],
  "A8.8": [
    e("Solve 3x² − 15x = 18 by factoring.", "Move all terms to one side: 3x² − 15x − 18 = 0.|Factor 3(x² − 5x − 6) = 3(x − 6)(x + 1).|Apply the zero-product property and check.", "x = 6 or x = −1.", "Factoring solves a quadratic only after it is written as a zero product."),
    e("A rectangle has area 48 and side lengths x + 2 and x + 6. Find the positive side lengths.", "Write (x + 2)(x + 6) = 48.|Expand and rearrange to x² + 8x − 36 = 0, then factor as (x + 12)(x − 3).|Reject x = −12 because it gives negative lengths.", "x = 3; side lengths 5 and 9.", "Contextual restrictions select the physically meaningful root."),
  ],
  "A8.9": [
    e("Solve 5(x − 3)² = 80 by the square-root method.", "Divide by 5 to isolate (x − 3)² = 16.|Take both square roots: x − 3 = ±4.|Solve the two linear equations and check.", "x = 7 or x = −1.", "The ± symbol is required when solving an even-power equation."),
    e("Solve 2x² + 7 = 25 over the real numbers.", "Subtract 7 and divide by 2 to obtain x² = 9.|Take both real square roots.|Check both candidates.", "x = ±3.", "The square-root method is efficient when the squared expression can be isolated directly."),
  ],
  "A8.10": [
    e("Complete the square for x² + 10x using an area-model interpretation.", "Half the x-coefficient is 5.|Add 5² = 25 to fill the missing corner of the square.|Write the resulting perfect-square trinomial.", "x² + 10x + 25 = (x + 5)².", "The added corner area is the square of half the linear coefficient."),
    e("Rewrite x² − 6x + 2 by completing the square.", "Half of −6 is −3, whose square is 9.|Add and subtract 9 without changing the expression.|Factor the perfect-square trinomial.", "(x − 3)² − 7.", "Adding and subtracting the same quantity preserves value while revealing a square."),
  ],
  "A8.11": [
    e("Solve x² − 6x − 7 = 0 by completing the square.", "Move the constant: x² − 6x = 7.|Add 9 to both sides to obtain (x − 3)² = 16.|Take square roots and solve.", "x = 7 or x = −1.", "Completing the square creates an equivalent isolated-square equation."),
    e("Solve 2x² + 8x + 1 = 0 by completing the square.", "Divide by 2: x² + 4x + 1/2 = 0, then move 1/2.|Add 4 to both sides to obtain (x + 2)² = 7/2.|Take square roots and simplify.", "x = −2 ± √14/2.", "Dividing by the leading coefficient first makes the completing-square term visible."),
  ],
  "A8.12": [
    e("Use the quadratic formula to solve 2x² − 3x − 4 = 0.", "Identify a = 2, b = −3, and c = −4.|Compute the discriminant b² − 4ac = 41.|Substitute into the formula and simplify.", "x = (3 ± √41)/4.", "A positive nonsquare discriminant produces two distinct irrational real roots."),
    e("Classify the roots of 9x² + 12x + 4 = 0 using the discriminant.", "Identify a = 9, b = 12, and c = 4.|Compute Δ = 12² − 4(9)(4) = 0.|Use the formula or perfect-square structure to find the repeated root.", "One repeated real root, x = −2/3.", "A zero discriminant means the parabola touches the horizontal axis once."),
  ],

  "A9.1": [
    e("For f(x) = x² − 6x + 5, write factored and vertex forms.", "Factor to obtain (x − 1)(x − 5).|Complete the square: x² − 6x + 9 − 4.|Write the vertex form.", "f(x) = (x − 1)(x − 5) = (x − 3)² − 4.", "Factored form exposes zeros 1 and 5; vertex form exposes the minimum (3, −4)."),
    e("Expand g(x) = −2(x + 1)² + 8 and identify its three useful forms when possible.", "Expand (x + 1)² and distribute −2.|Obtain −2x² − 4x + 6.|Factor −2(x² + 2x − 3) = −2(x − 1)(x + 3).", "Vertex: −2(x + 1)² + 8; standard: −2x² − 4x + 6; factored: −2(x − 1)(x + 3).", "Each equivalent form foregrounds a different graph feature."),
  ],
  "A9.2": [
    e("Graph y = (x + 2)² − 9 by naming its key features.", "Read the vertex (−2, −9) and axis x = −2.|The positive leading coefficient means the parabola opens upward.|Set y = 0 to obtain x = −5 or x = 1, and evaluate y at x = 0.", "Vertex (−2, −9), axis x = −2, x-intercepts (−5, 0) and (1, 0), y-intercept (0, −5).", "Structural features determine a reliable sketch without plotting arbitrary points."),
    e("Graph y = −x² + 4x + 5 by converting to vertex form.", "Complete the square: −(x² − 4x) + 5 = −(x − 2)² + 9.|Read the vertex and opening direction.|Factor −(x − 5)(x + 1) to find intercepts.", "Vertex (2, 9), axis x = 2, x-intercepts (−1, 0) and (5, 0), y-intercept (0, 5).", "Equivalent forms cross-check the same parabola’s vertex and zeros."),
  ],
  "A9.3": [
    e("For f(x) = 3(x + 4)(x − 2), identify zeros, axis of symmetry, and vertical intercept.", "Set each factor to zero to obtain x = −4 and x = 2.|Average the zeros to find the axis x = −1.|Evaluate f(0).", "Zeros −4 and 2; axis x = −1; y-intercept (0, −24).", "The axis lies midway between the symmetric zeros."),
    e("Build a quadratic with zeros −2 and 5 that passes through (1, −24).", "Start with f(x) = a(x + 2)(x − 5).|Substitute (1, −24): −24 = a(3)(−4).|Solve a = 2.", "f(x) = 2(x + 2)(x − 5).", "Zeros determine the factors, while one additional point determines the vertical scale."),
  ],
  "A9.4": [
    e("Describe the transformations from y = x² to y = 3(x − 4)² − 2.", "The expression x − 4 shifts the graph right 4.|The factor 3 applies a vertical stretch by 3.|The −2 shifts the graph down 2.", "Vertex (4, −2), axis x = 4, opens upward with vertical stretch 3.", "Transformation parameters determine position, direction, and scale."),
    e("Write the equation of a parabola with vertex (−3, 5) that opens downward and passes through (−1, −3).", "Use vertex form y = a(x + 3)² + 5.|Substitute (−1, −3): −3 = 4a + 5.|Solve a = −2.", "y = −2(x + 3)² + 5.", "A vertex and one nonvertex point determine the scale factor."),
  ],
  "A9.5": [
    e("Convert y = 2x² − 12x + 10 to vertex form.", "Factor 2 from the quadratic and linear terms.|Complete the square inside: x² − 6x = (x − 3)² − 9.|Distribute and combine constants.", "y = 2(x − 3)² − 8.", "Vertex form exposes the minimum value −8 at x = 3."),
    e("Convert y = −(x − 4)² + 25 to factored form.", "Set y = 0 to find (x − 4)² = 25.|The zeros are x = −1 and x = 9.|Use the leading coefficient −1 with those factors.", "y = −(x + 1)(x − 9).", "Solving for zeros provides the factors while preserving the original leading coefficient."),
  ],
  "A9.6": [
    e("A projectile’s height is h(t) = −16t² + 64t + 5. Find its maximum height and when it occurs.", "Use t = −b/(2a) = −64/[2(−16)] = 2.|Evaluate h(2).|Interpret the vertex within the time domain.", "Maximum height 69 feet at t = 2 seconds.", "For a downward-opening quadratic, the vertex gives the physical maximum."),
    e("A farmer has 80 meters of fencing for three sides of a rectangle against a wall. Maximize area.", "Let x be each side perpendicular to the wall, so the third fenced side is 80 − 2x.|Write A(x) = x(80 − 2x) = −2x² + 80x.|Find the vertex x = 20 and compute the other dimension and area.", "Dimensions 20 m by 40 m; maximum area 800 m².", "The quadratic vertex solves the constrained optimization model."),
  ],
  "A9.7": [
    e("Solve x² + x − 6 ≤ 0.", "Factor as (x + 3)(x − 2) ≤ 0.|Use boundary points −3 and 2 to divide the number line.|Test one point in each interval and include both zeros.", "[−3, 2].", "An upward-opening quadratic is nonpositive between its real zeros."),
    e("Solve −2(x + 1)(x − 4) > 0.", "The boundary points are −1 and 4.|Because the leading coefficient is negative, the parabola is positive between the zeros.|Use open endpoints for the strict inequality.", "(−1, 4).", "Sign analysis must include both factor signs and the leading coefficient."),
  ],
  "A9.8": [
    e("A quadratic regression gives ŷ = −0.5x² + 4x + 3 for data measured on 0 ≤ x ≤ 7. Find the predicted maximum and state the valid modeling interval.", "Compute the vertex input x = −4/[2(−0.5)] = 4.|Evaluate the model at x = 4.|Keep the interpretation inside the observed input interval.", "Predicted maximum 11 at x = 4; use the model on 0 ≤ x ≤ 7.", "A regression vertex is a model prediction, not an unrestricted law."),
    e("Residuals from a quadratic fit are 0.2, −0.1, 0.0, 0.1, −0.2, while a linear fit has residuals 4, 1, −2, −3, 0. Compare the fits cautiously.", "Compare the magnitudes and patterns of both residual sets.|The quadratic residuals are smaller and centered near zero.|State that residual evidence supports, but does not prove, the quadratic model.", "The quadratic fit is better supported for these observations.", "Model choice considers residual behavior, domain, and context rather than equation complexity alone."),
  ],

  "A10.1": [
    e("State the domain restrictions of (x + 1)/(x² − 5x + 6).", "Factor the denominator as (x − 2)(x − 3).|Set each denominator factor unequal to zero.|State the domain as a set of allowed real numbers.", "x ≠ 2 and x ≠ 3.", "Restrictions come from the original denominator before any simplification."),
    e("Find the restriction and evaluate (2x − 5)/(x + 4) at x = 3.", "The denominator requires x ≠ −4.|Substitute x = 3 into numerator and denominator.|Simplify 1/7.", "Value 1/7; domain excludes x = −4.", "Evaluation is valid only at inputs belonging to the expression’s domain."),
  ],
  "A10.2": [
    e("Simplify (4x² − 25)/(2x² + 9x + 10) and preserve restrictions.", "Factor the numerator as (2x − 5)(2x + 5).|Factor the denominator as (2x + 5)(x + 2).|Cancel the common factor and retain both original denominator zeros.", "(2x − 5)/(x + 2), with x ≠ −5/2 and x ≠ −2.", "A canceled factor creates a hole; its original restriction does not disappear."),
    e("Explain and correct the false cancellation (x + 6)/x = 6.", "Cancellation applies to factors of a product, not terms joined by addition.|Rewrite (x + 6)/x as x/x + 6/x for x ≠ 0.|Simplify the separate quotient.", "1 + 6/x, with x ≠ 0.", "A term cannot be canceled across addition because x is not a factor of the entire numerator."),
  ],
  "A10.3": [
    e("Multiply [x² − 4]/[x² + x − 6] · [x − 3]/[2x].", "Factor x² − 4 = (x − 2)(x + 2) and x² + x − 6 = (x + 3)(x − 2).|Cancel the common factor x − 2.|Multiply the remaining factors and retain all original restrictions.", "(x + 2)(x − 3)/[2x(x + 3)], with x ≠ 2, −3, 0.", "Factoring before multiplication exposes legal common-factor cancellation."),
    e("Multiply [3a/(a² − 9)]·[(a + 3)²/(6a²)] and simplify.", "Factor a² − 9 = (a − 3)(a + 3).|Cancel one a + 3 factor, reduce 3/6, and cancel one a.|Write the result and original restrictions.", "(a + 3)/[2a(a − 3)], with a ≠ −3, 3, 0.", "Restrictions are inherited from every original denominator even when factors later cancel."),
  ],
  "A10.4": [
    e("Divide [x² − 9]/[x² − 4] by [(x − 3)/(x + 2)].", "Factor both quadratics and multiply by the reciprocal of the divisor.|Cancel x − 3 and x + 2 only as factors.|Retain denominator restrictions and exclude x = 3 because the divisor cannot be zero.", "(x + 3)/(x − 2), with x ≠ −2, 2, 3.", "Division requires the divisor to be defined and nonzero."),
    e("Simplify [2a/(a − 1)] ÷ [4a²/(a² − 1)].", "Multiply by (a² − 1)/(4a²).|Factor a² − 1 = (a − 1)(a + 1) and cancel common factors.|State restrictions from both original expressions and the nonzero divisor.", "(a + 1)/(2a), with a ≠ −1, 0, 1.", "Reciprocal multiplication is safe only after all definition and nonzero conditions are recorded."),
  ],
  "A10.5": [
    e("Find the least common denominator of 6x²y and 15xy³.", "Use lcm(6, 15) = 30 for coefficients.|Take the greatest exponent of x, which is x².|Take the greatest exponent of y, which is y³.", "LCD = 30x²y³.", "The least common denominator contains each prime or variable factor to the highest required exponent."),
    e("Find the LCD of x² − 9 and x² + 6x + 9.", "Factor x² − 9 = (x − 3)(x + 3).|Factor x² + 6x + 9 = (x + 3)².|Use each distinct factor at its greatest exponent.", "LCD = (x − 3)(x + 3)².", "Factoring is necessary because expanded denominators hide shared factors."),
  ],
  "A10.6": [
    e("Simplify 3/(x − 2) + 5/(x + 1).", "Use LCD (x − 2)(x + 1).|Rewrite the numerators as 3(x + 1) and 5(x − 2).|Combine and simplify the numerator.", "(8x − 7)/[(x − 2)(x + 1)], with x ≠ 2, −1.", "Only numerators add after equivalent fractions share a common denominator."),
    e("Simplify 2x/(x² − 4) − 1/(x + 2).", "Factor x² − 4 = (x − 2)(x + 2).|Rewrite the second fraction with numerator x − 2 over the common denominator.|Subtract numerators and retain restrictions.", "(x + 2)/[(x − 2)(x + 2)] = 1/(x − 2), with x ≠ −2, 2.", "The simplified value keeps the excluded input x = −2 from the original expression."),
  ],
  "A10.7": [
    e("Simplify [2/x + 3/y]/[1/x − 1/y].", "Use xy as the inner common denominator.|The numerator becomes (2y + 3x)/(xy) and the denominator becomes (y − x)/(xy).|Divide the two fractions and state all restrictions.", "(2y + 3x)/(y − x), with x ≠ 0, y ≠ 0, and x ≠ y.", "The complex denominator must be both defined and nonzero."),
    e("Simplify [2/(x + 1)]/[3/(x − 2) − 1].", "Combine the denominator: 3/(x − 2) − 1 = (5 − x)/(x − 2).|Multiply 2/(x + 1) by the reciprocal (x − 2)/(5 − x).|State original and divisor-nonzero restrictions.", "2(x − 2)/[(x + 1)(5 − x)], with x ≠ −1, 2, 5.", "Simplifying the numerator and denominator separately makes the outer division transparent."),
  ],
  "A10.8": [
    e("Solve 3/x + 2/(x − 1) = 5/[x(x − 1)].", "Record x ≠ 0, 1 and multiply by x(x − 1).|Solve 3(x − 1) + 2x = 5, giving 5x − 3 = 5.|Check the candidate against the original restrictions and equation.", "x = 8/5.", "Clearing denominators produces a candidate that still must satisfy the original rational equation."),
    e("Solve 1/(x − 2) = x/(x² − 4).", "Record x ≠ −2, 2 and factor x² − 4.|Multiply by (x − 2)(x + 2) to obtain x + 2 = x.|The contradiction 2 = 0 means no candidate exists.", "No solution.", "A rational equation can be inconsistent even when its denominators share factors."),
  ],
  "A10.9": [
    e("The distance d varies directly with time t. If d = 150 when t = 3, find the model and d when t = 7.", "Write d = kt.|Use 150 = 3k to find k = 50.|Evaluate d = 50(7).", "d = 50t; d = 350.", "The constant of variation carries the rate units."),
    e("z varies jointly with x and y and inversely with w. If z = 12 when x = 3, y = 8, and w = 4, find z when x = 5, y = 6, and w = 10.", "Write z = kxy/w.|Use 12 = k(3)(8)/4 to obtain k = 2.|Evaluate z = 2(5)(6)/10.", "z = 6.", "A combined-variation model records exactly which quantities multiply and which divide."),
  ],
  "A10.10": [
    e("Solve (x + 1)/(x − 3) ≥ 0.", "The sign can change at numerator zero x = −1 and denominator zero x = 3.|Test intervals (−∞, −1), (−1, 3), and (3, ∞).|Include −1 but exclude 3.", "(−∞, −1] ∪ (3, ∞).", "A rational inequality is solved by sign intervals determined by zeros and undefined points."),
    e("Describe the intercepts and vertical asymptote of f(x) = (2x − 4)/(x + 1).", "The vertical asymptote occurs where the uncanceled denominator is zero: x = −1.|The horizontal intercept occurs where the numerator is zero: x = 2.|Evaluate f(0) for the vertical intercept.", "Vertical asymptote x = −1; x-intercept (2, 0); y-intercept (0, −4).", "Zeros and restrictions organize the introductory graph of a rational function."),
  ],
});
