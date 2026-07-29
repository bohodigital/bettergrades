const e = (prompt, work, answer, interpretation) => ({
  prompt,
  steps: work.split("|"),
  answer,
  interpretation,
});

export const EXTRA_EXAMPLES_A11_A14 = Object.freeze({
  "A11.1": [
    e("Evaluate the principal fourth root of 81 and solve x⁴ = 81 over the real numbers.", "The principal fourth root is the nonnegative number whose fourth power is 81.|Because 3⁴ = 81, the principal fourth root is 3.|The equation includes both real numbers whose fourth power is 81.", "Principal fourth root 3; x = ±3.", "Principal even roots are nonnegative, while even-power equations may have two real solutions."),
    e("Determine whether the real sixth root of −64 and the cube root ∛(−64) exist.", "An even power of a real number cannot be negative, so the sixth root is not real.|An odd power preserves sign.|Since (−4)³ = −64, evaluate the cube root.", "The sixth root is not real; ∛(−64) = −4.", "Root parity determines whether a negative radicand has a real root."),
  ],
  "A11.2": [
    e("Simplify √180.", "Factor 180 as 36·5.|Use √(36·5) = √36·√5.|Evaluate the perfect-square factor.", "6√5.", "Radical simplification extracts complete square factors while leaving a square-free radicand."),
    e("Simplify ∛(54a⁷b⁴).", "Factor 54a⁷b⁴ as 27·2·a⁶·a·b³·b.|Extract cube factors 27, a⁶, and b³.|Leave the unmatched factors under the cube root.", "3a²b∛(2ab).", "For an odd root, complete cube factors leave the radical without absolute-value complications."),
  ],
  "A11.3": [
    e("Simplify √12·√15.", "Combine nonnegative radicands to obtain √180.|Factor 180 as 36·5.|Extract √36.", "6√5.", "The product rule can expose a perfect-square factor not visible in either original radical."),
    e("Simplify √(98x⁵)/√(2x) for x > 0.", "Combine the quotient inside one radical: √(49x⁴).|Evaluate √49 and √(x⁴).|Use the stated positive domain.", "7x².", "The quotient rule is valid here because the denominator radicand is positive."),
  ],
  "A11.4": [
    e("Simplify 5√12 − 2√27 + √75.", "Rewrite √12 = 2√3, √27 = 3√3, and √75 = 5√3.|Multiply the outside coefficients.|Combine the like radical terms.", "9√3.", "Radical terms combine only after their indices and simplified radicands match."),
    e("Simplify 3∛16 + 2∛54 − ∛2.", "Rewrite ∛16 = 2∛2 and ∛54 = 3∛2.|Multiply the outside coefficients.|Combine 6∛2 + 6∛2 − ∛2.", "11∛2.", "Like cube-root terms behave like like algebraic terms after simplification."),
  ],
  "A11.5": [
    e("Rationalize 7/√5.", "Multiply numerator and denominator by √5.|The denominator becomes 5.|Simplify the fraction.", "7√5/5.", "Multiplying by √5/√5 preserves value while removing the radical denominator."),
    e("Rationalize 3/∛(2x) by creating a perfect cube in the denominator.", "The denominator contains 2x, so multiply by ∛(4x²).|The denominator becomes ∛(8x³) = 2x.|Write the resulting quotient and restriction.", "3∛(4x²)/(2x), with x ≠ 0.", "For cube roots, the rationalizing factor supplies exponents needed to reach multiples of three."),
  ],
  "A11.6": [
    e("Rationalize 5/(2 + √3).", "Multiply by the conjugate (2 − √3)/(2 − √3).|The denominator is 4 − 3 = 1.|Distribute the numerator.", "10 − 5√3.", "Conjugates remove a binomial radical denominator through a difference of squares."),
    e("Simplify 1/(√7 − √5).", "Multiply by the conjugate √7 + √5.|The denominator becomes 7 − 5 = 2.|Write the simplified quotient.", "(√7 + √5)/2.", "The conjugate preserves the radical numerator while producing a rational denominator."),
  ],
  "A11.7": [
    e("Evaluate 27^(2/3).", "Interpret the denominator 3 as a cube root and the numerator 2 as a square.|Compute ∛27 = 3.|Square the result.", "27^(2/3) = 9.", "A rational exponent records a root and a power in one notation."),
    e("Rewrite x^(−3/4) using a positive rational exponent for x > 0.", "The negative exponent moves the expression to the denominator.|Retain the magnitude 3/4 as a positive exponent.|Write the reciprocal form.", "1/(x³)^(1/4).", "Domain and reciprocal structure remain visible in positive-exponent form."),
  ],
  "A11.8": [
    e("Solve √(2x + 3) = x.", "The radical requires x ≥ 0.|Square to obtain 2x + 3 = x², or x² − 2x − 3 = 0.|Factor and test both candidates in the original equation.", "x = 3; x = −1 is extraneous.", "Squaring produces candidates, so the original radical equation decides the final solution set."),
    e("Solve ∛(x − 1) + 2 = 5.", "Isolate the cube root: ∛(x − 1) = 3.|Cube both sides to obtain x − 1 = 27.|Solve and check.", "x = 28.", "Cubing is one-to-one over the reals, so it does not create a sign-based extraneous root here."),
  ],
  "A11.9": [
    e("A learner squares √(x + 6) = x and reports x = −2 and x = 3. Determine the valid solutions.", "The original equation requires x ≥ 0.|Squaring gives x + 6 = x², or (x − 3)(x + 2) = 0.|Test both candidates in the original equation.", "Only x = 3 is valid.", "The domain restriction rejects −2 before substitution, and direct checking confirms the surviving candidate."),
    e("Solve √(x − 1) = x − 5 with explicit domain control.", "Both sides require x ≥ 5 because the radical is nonnegative.|Square to get x − 1 = x² − 10x + 25, or x² − 11x + 26 = 0.|Solve x = (11 ± √17)/2 and retain only the candidate at least 5 after checking.", "x = (11 + √17)/2.", "A sign restriction on the unsquared side can eliminate a candidate created by squaring."),
  ],
  "A11.10": [
    e("Simplify (4 − 3i) + (−2 + 7i) and (4 − 3i)(−2 + 7i).", "Add real and imaginary parts separately for the sum.|Distribute the product and use i² = −1.|Combine real and imaginary terms.", "Sum 2 + 4i; product 13 + 34i.", "Complex arithmetic preserves separate real and imaginary components until i² is replaced."),
    e("Divide (5 + i)/(2 − i) and write the result in a + bi form.", "Multiply numerator and denominator by the conjugate 2 + i.|The denominator becomes 2² + 1² = 5.|Expand the numerator 9 + 7i and divide each term by 5.", "9/5 + (7/5)i.", "Multiplying by the denominator’s conjugate produces a real denominator."),
  ],

  "A12.1": [
    e("Determine whether {(1, 4), (2, 5), (1, 7), (3, 5)} defines y as a function of x.", "List outputs attached to each input.|Input 1 is paired with both 4 and 7.|Apply the one-output-per-input definition.", "Not a function.", "Repeated outputs are allowed, but one input cannot have two different outputs."),
    e("The relation is defined by x = y². Does it define y as a function of x over all real points?", "Choose x = 4.|Both y = 2 and y = −2 satisfy x = y².|Conclude that one input has two outputs.", "No; it fails the vertical-line test.", "An equation can define a relation without defining y as a function of x."),
  ],
  "A12.2": [
    e("For f(x) = 3x² − 2x + 1, find f(−2) and f(a + 1).", "Substitute −2 with parentheses and simplify.|Replace every x by a + 1 for the symbolic input.|Expand and combine like terms.", "f(−2) = 17; f(a + 1) = 3a² + 4a + 2.", "Function notation evaluates the same rule at numerical or algebraic inputs."),
    e("If g(t) = (t − 4)/(t + 2), evaluate g(0) and state why g(−2) is undefined.", "Substitute 0 to obtain −4/2.|At t = −2, the denominator becomes zero.|State both the value and domain restriction.", "g(0) = −2; g(−2) is undefined.", "An input must belong to the function’s domain before evaluation is meaningful."),
  ],
  "A12.3": [
    e("For f(x) = x² − 4x − 5, solve f(x) = 7.", "Set x² − 4x − 5 = 7.|Rearrange to x² − 4x − 12 = 0.|Factor and solve.", "x = −2 or x = 6.", "Solving f(x) = k finds every input whose output equals the target level."),
    e("For g(x) = 3/(x − 1), solve g(x) = −2.", "Set 3/(x − 1) = −2 with x ≠ 1.|Multiply by x − 1 and solve 3 = −2x + 2.|Check the resulting input in the original function.", "x = −1/2.", "An input solution must respect the function’s original domain."),
  ],
  "A12.4": [
    e("Find the real domain of f(x) = √(5 − 2x)/(x + 3).", "Require the radicand 5 − 2x ≥ 0, giving x ≤ 5/2.|Require the denominator x + 3 ≠ 0.|Combine the two conditions.", "(−∞, −3) ∪ (−3, 5/2].", "Domain is the intersection of every operation-specific condition."),
    e("Find the domain of h(x) = 1/√(x² − 9).", "A square root in a denominator must be strictly positive.|Solve x² − 9 > 0.|Use the factored sign intervals of (x − 3)(x + 3).", "(−∞, −3) ∪ (3, ∞).", "Denominator placement changes the radical condition from nonnegative to positive."),
  ],
  "A12.5": [
    e("For f(x) = |x − 3| − 2 on −1 ≤ x ≤ 6, find the range and intervals of decrease and increase.", "The vertex occurs at x = 3 with output −2.|Evaluate endpoints: f(−1) = 2 and f(6) = 1.|Use the V-shape to describe monotonic intervals.", "Range [−2, 2]; decreasing on [−1, 3] and increasing on [3, 6].", "Range and behavior depend on both the graph family and the stated domain."),
    e("For g(x) = x³ − 1, describe domain, range, intercepts, and end behavior.", "A polynomial has all real inputs.|An odd cubic takes all real output values and is increasing.|Solve g(x) = 0 and evaluate g(0).", "Domain ℝ, range ℝ, x-intercept (1, 0), y-intercept (0, −1); g(x)→±∞ with x.", "A cubic’s global behavior differs fundamentally from a bounded-domain quadratic example."),
  ],
  "A12.6": [
    e("Evaluate p(−1), p(2), and p(5) when p(x) = 2x + 1 for x < 0, p(x) = x² for 0 ≤ x ≤ 3, and p(x) = 10 − x for x > 3.", "Match −1 to the first interval, 2 to the middle interval, and 5 to the final interval.|Evaluate the corresponding rule for each input.|Check endpoint inclusion before assigning any rule.", "p(−1) = −1, p(2) = 4, and p(5) = 5.", "Piecewise evaluation chooses a rule from the input condition before doing arithmetic."),
    e("Choose constants a and b so q(x) = ax + 1 for x < 2 and q(x) = bx − 3 for x ≥ 2 has q(2) = 5 and matching one-sided values at x = 2.", "The included second rule gives 2b − 3 = 5, so b = 4.|Matching the first-rule approach value requires 2a + 1 = 5, so a = 2.|Check both expressions at the boundary.", "a = 2 and b = 4.", "Boundary conditions can determine parameters that make a piecewise rule join continuously."),
  ],
  "A12.7": [
    e("Let f(x) = x² − 1 and g(x) = 2x + 3. Find (f + g)(x), (fg)(x), and (f/g)(x) with its domain.", "Add the formulas and combine like terms.|Multiply the formulas by distribution.|Form the quotient and exclude the zero of g.", "(f + g)(x) = x² + 2x + 2; (fg)(x) = 2x³ + 3x² − 2x − 3; (f/g)(x) = (x² − 1)/(2x + 3), x ≠ −3/2.", "Function arithmetic applies ordinary algebra while intersecting the relevant domains."),
    e("For f(x) = √x and g(x) = x − 4, find the domain of f + g and f/g.", "The square root requires x ≥ 0.|The sum uses the intersection, still x ≥ 0.|The quotient also requires x − 4 ≠ 0.", "Domain of f + g is [0, ∞); domain of f/g is [0, 4) ∪ (4, ∞).", "A quotient inherits every input restriction and adds a nonzero-denominator condition."),
  ],
  "A12.8": [
    e("Classify the functions f(x) = 4x − 1, g(x) = 3(1.2)ˣ, and h(x) = x² − 5 by their defining change pattern.", "For f, equal input steps add the constant amount 4.|For g, equal input steps multiply outputs by 1.2.|For h, first differences vary while second differences are constant.", "f is linear, g is exponential, and h is quadratic.", "Family classification relies on change structure, not just the visible presence of x."),
    e("Compare long-run behavior of L(x) = 100 + 20x and E(x) = 100(1.08)ˣ for x ≥ 0.", "Both begin at 100.|The linear function adds 20 per step; the exponential function multiplies by 1.08.|Evaluate representative large inputs or use growth structure to compare eventually.", "L grows by constant differences; E grows by constant ratios and eventually exceeds L.", "A smaller early exponential increase can dominate a linear model over a sufficiently long domain."),
  ],

  "A13.1": [
    e("Classify the table (x, y) = (0, 5), (1, 15), (2, 45), (3, 135).", "Compute successive differences: 10, 30, and 90.|Compute successive ratios: 3, 3, and 3.|Use the constant-ratio criterion.", "Exponential; y = 5·3ˣ.", "Equal input steps multiply outputs by the same factor."),
    e("Compare a quantity starting at 80 that adds 12 per period with one starting at 80 that grows 12% per period.", "Write L(n) = 80 + 12n.|Write E(n) = 80(1.12)ⁿ.|Evaluate both at n = 3.", "L(3) = 116; E(3) ≈ 112.39.", "Equal numerical and percentage changes are different processes; one is additive and one compounds."),
  ],
  "A13.2": [
    e("A geometric sequence has a₁ = 7 and common ratio 3. Find a₆ and an explicit formula.", "Use aₙ = a₁r^(n−1).|Substitute n = 6 to obtain 7·3⁵.|Evaluate the power and product.", "aₙ = 7·3^(n−1); a₆ = 1701.", "The exponent counts the number of multiplicative steps from the first term."),
    e("A laptop worth $1,600 loses 18% of its value each year. Find its value after 4 years.", "Use the decay factor 1 − 0.18 = 0.82.|Write V(t) = 1600(0.82)ᵗ.|Evaluate at t = 4 and round currency at the end.", "V(4) ≈ $723.39.", "Repeated percent loss applies to the current value, so depreciation compounds."),
  ],
  "A13.3": [
    e("For f(x) = 2·3ˣ − 4, identify the initial value, horizontal asymptote, and whether the function grows or decays.", "Evaluate f(0) = 2(1) − 4.|The base 3 > 1 indicates growth.|The vertical shift −4 gives the horizontal asymptote.", "Initial output −2; horizontal asymptote y = −4; exponential growth.", "The coefficient and shift change output placement while the base controls multiplicative direction."),
    e("Build an exponential function with initial value 12 that halves every 5 time units.", "A five-unit step multiplies by 1/2.|Use t/5 to count five-unit intervals.|Multiply by the initial value.", "f(t) = 12(1/2)^(t/5).", "The exponent must measure the number of compounding intervals, not merely raw time."),
  ],
  "A13.4": [
    e("Describe the graph of g(x) = −2^(x−3) + 5 from y = 2ˣ.", "The x − 3 shifts right 3.|The leading negative reflects across the x-axis.|The +5 shifts up and moves the asymptote to y = 5.", "Decreasing graph with asymptote y = 5; domain ℝ; range (−∞, 5).", "Transformations alter position and range while preserving the exponential domain."),
    e("Find the horizontal asymptote and intercepts of h(x) = 3(1/2)ˣ − 6.", "The vertical shift gives asymptote y = −6.|Evaluate h(0) = 3 − 6 = −3.|Solve 3(1/2)ˣ − 6 = 0, so (1/2)ˣ = 2.", "Asymptote y = −6; y-intercept (0, −3); x-intercept (−1, 0).", "Exact intercept solving cross-checks the transformed graph."),
  ],
  "A13.5": [
    e("A culture begins with 500 cells and grows 9% per hour. Write the model and predict the count after 12 hours.", "Use growth factor 1.09.|Write N(t) = 500(1.09)ᵗ.|Evaluate at t = 12.", "N(12) ≈ 1406 cells.", "The discrete model assumes the same proportional change each hour."),
    e("A medication amount is 240 mg and has a half-life of 6 hours. When will 30 mg remain?", "Write A(t) = 240(1/2)^(t/6).|Set 30/240 = 1/8 = (1/2)³.|Equate t/6 = 3.", "t = 18 hours.", "Three half-lives reduce the amount by a factor of eight."),
  ],
  "A13.6": [
    e("Find the balance on $5,000 invested at 4.8% annual interest compounded monthly for 7 years.", "Use A = P(1 + r/n)^(nt) with P = 5000, r = 0.048, n = 12, and t = 7.|Compute the monthly factor and 84 compounding periods.|Round to the nearest cent.", "A ≈ $6,992.01.", "Nominal annual rate is divided among compounding periods, while the exponent counts those periods."),
    e("How long does $2,000 take to reach $3,000 at 6% compounded quarterly?", "Write 3000 = 2000(1 + 0.06/4)^(4t).|Divide by 2000 and take logarithms.|Solve t = ln(1.5)/[4ln(1.015)].", "t ≈ 6.81 years.", "A logarithm isolates time from an exponent in the compound-interest model."),
  ],
  "A13.7": [
    e("A population follows P(t) = 1200e^(0.035t). Find P(10) and the continuous growth rate.", "The coefficient 0.035 is the continuous rate per time unit.|Evaluate 1200e^0.35.|Round only the final population.", "P(10) ≈ 1703; continuous rate 3.5% per time unit.", "The parameter in e^(kt) is a continuous rate, not directly the discrete percent multiplier."),
    e("Solve 900e^(−0.12t) = 300 for t.", "Divide by 900 to obtain e^(−0.12t) = 1/3.|Take natural logarithms.|Solve t = ln(3)/0.12.", "t ≈ 9.16 time units.", "Natural logarithms undo base-e exponential change."),
  ],
  "A13.8": [
    e("Rewrite log₄(64) = 3 in exponential form and evaluate log₅(1/125).", "Use log_b(y) = x exactly when bˣ = y.|The first statement becomes 4³ = 64.|For the second, write 1/125 = 5⁻³.", "log₄(64) = 3 and log₅(1/125) = −3.", "A logarithm names the exponent required to produce its argument."),
    e("Solve log₂(x − 1) = 5.", "Rewrite the logarithmic equation as x − 1 = 2⁵.|Solve x = 33.|Check the required argument x − 1 > 0.", "x = 33.", "Exponential form makes the inverse relationship explicit while the log domain remains binding."),
  ],
  "A13.9": [
    e("Expand log₃[9x²/(y√z)] for positive x, y, and z.", "Use the quotient law to separate numerator and denominator.|Use the product law on 9x² and y√z.|Apply the power law and evaluate log₃9.", "2 + 2log₃x − log₃y − (1/2)log₃z.", "Logarithm laws translate multiplication, division, and powers into additive structure."),
    e("Condense 2ln x − (1/3)ln y + ln 5 into one logarithm for positive x and y.", "Move coefficients to exponents.|Combine positive terms as a product.|Place the subtracted term in the denominator.", "ln(5x²/y^(1/3)).", "Condensing reverses logarithm laws without inventing a false rule for sums."),
  ],
  "A13.10": [
    e("Solve 7·3^(2x−1) = 50 exactly and approximately.", "Divide by 7.|Take logarithms: (2x − 1)ln3 = ln(50/7).|Solve for x.", "x = [1 + ln(50/7)/ln3]/2 ≈ 1.395.", "Logarithms isolate a variable that appears in an exponent."),
    e("Solve 4^(x+1) = 8^(2x−1) by using a common base.", "Rewrite 4 = 2² and 8 = 2³.|Equate exponents: 2(x + 1) = 3(2x − 1).|Solve the linear equation.", "x = 5/4.", "A common base avoids decimal logarithms and preserves an exact rational result."),
  ],
  "A13.11": [
    e("Solve log₃(x + 1) + log₃(x − 1) = 2.", "Require x > 1.|Combine logs: log₃[(x + 1)(x − 1)] = 2.|Rewrite exponentially, solve x² − 1 = 9, and keep the domain-valid root.", "x = √10.", "Log-domain restrictions remove the negative algebraic root because it does not make every argument positive."),
    e("The pH model is pH = −log₁₀[H⁺]. Find [H⁺] when pH = 4.7.", "Write 4.7 = −log₁₀[H⁺].|Convert to exponential form: [H⁺] = 10⁻⁴⋅⁷.|Approximate with units.", "[H⁺] ≈ 2.00×10⁻⁵ mol/L.", "A logarithmic model compresses multiplicative concentration scales into additive pH values."),
  ],

  "A14.1": [
    e("Classify 3x² − 5x + 2, 3x² − 5x + 2 = 0, and 3x² − 5x + 2 > 0, and state the valid task for each.", "The first has no relation symbol, so it is an expression.|The second asserts equality, so it is an equation.|The third asserts order, so it is an inequality.", "Simplify or evaluate the expression; solve the equation; find the truth set of the inequality.", "The mathematical object and requested verb determine what an answer must contain."),
    e("Classify f(x) = (x + 1)/(x − 2) and the request f(5).", "The assignment f(x) defines a function rule with domain x ≠ 2.|The notation f(5) requests evaluation, not equation solving.|Substitute 5 into the rule.", "A rational function; f(5) = 2.", "Classification prevents treating an evaluation request like an unknown-value equation."),
  ],
  "A14.2": [
    e("Classify and solve 2x⁴ − 7x² + 3 = 0.", "Recognize a quadratic form in u = x².|Solve 2u² − 7u + 3 = (2u − 1)(u − 3) = 0.|Return to x² = 1/2 or x² = 3 and take both square roots.", "x = ±√2/2 or x = ±√3.", "A disguised quadratic is classified by its repeated power structure."),
    e("Classify 3^(x−2) = 11 and explain why ordinary polynomial factoring does not apply.", "The variable appears in an exponent, so the equation is exponential.|The bases cannot be matched by simple rewriting.|Use logarithms to isolate the exponent.", "x = 2 + ln11/ln3.", "Classification selects inverse logarithms rather than polynomial operations."),
  ],
  "A14.3": [
    e("Choose an efficient method and solve x² − 10x + 25 = 14.", "Recognize the perfect square (x − 5)² = 14.|Use the square-root method rather than expanding or applying the full quadratic formula.|Take both roots.", "x = 5 ± √14.", "Visible structure can make a general-purpose method unnecessary."),
    e("Choose an efficient method and solve 2/(x − 1) + 3/(x + 2) = 0.", "Classify the equation as rational and record x ≠ 1, −2.|Clear the LCD (x − 1)(x + 2).|Solve 2(x + 2) + 3(x − 1) = 0 and check.", "x = −1/5.", "Method selection follows denominator structure and retains original restrictions."),
  ],
  "A14.4": [
    e("Solve √(x + 2) = x and label every candidate before verification.", "The domain requires x ≥ 0.|Squaring yields x + 2 = x², so x = 2 or x = −1.|Test both in the original equation.", "Candidate 2 is valid; candidate −1 is invalid.", "A one-way operation changes verified solutions into candidates until the original condition is checked."),
    e("Solve (x² − 1)/(x − 1) = 0 without erasing restrictions.", "Record x ≠ 1 from the original denominator.|Factor and simplify to x + 1 for allowed inputs.|Set the numerator-equivalent expression equal to zero and verify.", "x = −1.", "The canceled input x = 1 remains excluded and is not a zero of the original rational expression."),
  ],
  "A14.5": [
    e("Solve x³ − 2 = 0 exactly and approximate to four decimal places.", "Isolate x³ = 2.|Take the real cube root for the exact value.|Use technology only for the requested decimal.", "x = ∛2 ≈ 1.2599.", "The exact radical preserves mathematical structure; the decimal reports finite precision."),
    e("A calculator reports roots 0.3333333333 and 1.414213562. Identify plausible exact forms and verify them for 3x² − x = 0 and x² − 2 = 0.", "Factor the first equation as x(3x − 1) = 0.|Recognize the nonzero root as 1/3.|Recognize the positive root of the second equation as √2 and substitute both exact forms.", "1/3 and √2 are the exact forms of the reported positive roots.", "Technology suggests approximations; algebra establishes exact identity."),
  ],
  "A14.6": [
    e("Cross-check the solutions of x² − x − 6 = 0 algebraically and graphically.", "Factor to obtain (x − 3)(x + 2) = 0.|The algebraic zeros are 3 and −2.|On the graph y = x² − x − 6, verify horizontal intercepts at those inputs.", "x = −2 or x = 3; graph intercepts (−2, 0) and (3, 0).", "Agreement between exact factorization and graph intercepts increases confidence without replacing proof."),
    e("A graph suggests that 2ˣ = 5 has a solution near 2.3. Find the exact form and verify the approximation.", "Take logarithms to obtain x = ln5/ln2.|Evaluate the quotient to get approximately 2.3219.|Check that 2^2.3219 is approximately 5.", "x = ln5/ln2 ≈ 2.3219.", "The graph supplies location and uniqueness; logarithms supply the exact solution."),
  ],
  "A14.7": [
    e("A ball’s height is h(t) = −16t² + 48t + 64. Find its maximum height and when it hits the ground.", "Find the vertex time t = −48/[2(−16)] = 1.5 and evaluate h(1.5).|Solve −16t² + 48t + 64 = 0 by dividing by −16 and factoring.|Keep the nonnegative time root.", "Maximum 100 ft at 1.5 s; the ball hits the ground at t = 4 s.", "A complete model uses the vertex for the extremum and a zero for the terminal event."),
    e("A quantity follows y = (x² − 9)/(x − 3). Analyze its domain, simplified rule, graph feature, and value at x = 5.", "Record x ≠ 3 before simplifying.|Factor and cancel to obtain y = x + 3 for allowed inputs.|Evaluate at x = 5 and describe the missing graph point.", "y = x + 3 for x ≠ 3; hole at (3, 6); y(5) = 8.", "The capstone combines factoring, rational restrictions, function evaluation, and graph interpretation."),
  ],
});
