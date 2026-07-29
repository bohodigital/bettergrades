const e = (prompt, work, answer, interpretation) => ({
  prompt,
  steps: work.split("|"),
  answer,
  interpretation,
});

export const EXTRA_EXAMPLES_A3_A6 = Object.freeze({
  "A3.1": [
    e("Find the truth set of 2x − 5 ≥ 9 among {−3, 0, 7, 10}.", "Substitute each candidate into 2x − 5.|The resulting left sides are −11, −5, 9, and 15.|Keep exactly the candidates whose left side is at least 9.", "{7, 10}.", "A finite truth set is determined by testing the complete statement for every allowed candidate."),
    e("Describe all real numbers that make x² < 9 true.", "The boundary equation x² = 9 has solutions −3 and 3.|Between the boundaries, squaring produces a value below 9; outside them it produces a value above 9.|Use open endpoints because the inequality is strict.", "−3 < x < 3, or (−3, 3).", "Boundary analysis turns an inequality into a complete real-number truth set."),
  ],
  "A3.2": [
    e("Solve (2x − 1)/3 > 5 and graph the solution set.", "Multiply both sides by positive 3, so the order remains unchanged: 2x − 1 > 15.|Add 1 and divide by 2 to obtain x > 8.|Check x = 9 in the original inequality and exclude the boundary x = 8.", "x > 8, or (8, ∞).", "Positive scaling preserves order, and the strict boundary is shown with an open endpoint."),
    e("A delivery company charges $18 plus $4 per mile. For what distances d is the charge at most $50?", "Model the limit by 18 + 4d ≤ 50 with d ≥ 0.|Subtract 18 and divide by 4 to obtain d ≤ 8.|Intersect the algebraic result with the contextual domain d ≥ 0.", "0 ≤ d ≤ 8 miles.", "The contextual domain removes negative distances from the algebraic truth set."),
  ],
  "A3.3": [
    e("Start with −4 < 2. Multiply by −5 and justify the new comparison.", "The products are 20 and −10.|On a number line, 20 lies to the right of −10.|Write the reversed order relation.", "20 > −10.", "Multiplication by a negative reflects both values across zero and reverses their order."),
    e("Explain why dividing 6 > −3 by −3 gives −2 < 1.", "Division by −3 is multiplication by the negative reciprocal −1/3.|The scale changes 6 to −2 and −3 to 1.|A negative scale reverses the original greater-than relation.", "−2 < 1.", "The reversal follows from an order-reflecting transformation, not from an arbitrary symbol rule."),
  ],
  "A3.4": [
    e("Write x ≤ −1 or x > 4 in interval notation and describe the endpoints.", "The first ray contains −1, so use a bracket there.|The second ray excludes 4, so use a parenthesis there.|Join the disjoint rays with a union symbol.", "(−∞, −1] ∪ (4, ∞).", "A union records values satisfying either condition, with endpoint marks preserving equality information."),
    e("Translate [−2, 5) ∩ (1, 8] into a compound inequality.", "The overlap begins just above 1 because (1, 8] excludes 1.|It ends just below 5 because [−2, 5) excludes 5.|Write both conditions as one and-statement.", "1 < x < 5.", "Intersection keeps only values belonging to both intervals."),
  ],
  "A3.5": [
    e("Solve 3x − 2 ≤ 7 or 2x + 5 > 13.", "Solve the first inequality to obtain x ≤ 3.|Solve the second inequality to obtain x > 4.|Use a union because the connector is or.", "x ≤ 3 or x > 4; (−∞, 3] ∪ (4, ∞).", "An or-compound inequality combines both truth sets rather than keeping only their overlap."),
    e("Solve −4 < 2 − 3x ≤ 11.", "Subtract 2 throughout: −6 < −3x ≤ 9.|Divide all three parts by −3 and reverse both order relations.|Rewrite the ordered result from least to greatest.", "−3 ≤ x < 2; [−3, 2).", "Every part of a compound inequality must undergo the same operation, including both reversals under negative division."),
  ],
  "A3.6": [
    e("Solve |x + 2| = 5 by using distance from a center.", "Rewrite x + 2 as x − (−2), so the center is −2.|Move 5 units left and right from −2.|Check both points in the original absolute-value equation.", "x = −7 or x = 3.", "A positive fixed distance produces two points symmetric about the center."),
    e("A machine part is acceptable when its length t is within 1.5 mm of 10 mm. Write and solve an absolute-value inequality.", "Translate within 1.5 of 10 as |t − 10| ≤ 1.5.|Rewrite it as −1.5 ≤ t − 10 ≤ 1.5.|Add 10 throughout.", "8.5 ≤ t ≤ 11.5 mm.", "A tolerance condition is a closed interval centered at the target measurement."),
  ],
  "A3.7": [
    e("Solve |3x + 2| ≥ 8.", "Split the exterior-distance condition into 3x + 2 ≥ 8 or 3x + 2 ≤ −8.|Solve the two linear inequalities.|Check one value from each exterior ray in the original inequality.", "x ≥ 2 or x ≤ −10/3.", "A greater-than absolute-value inequality describes values outside a central interval."),
    e("Solve |2x − 7| = −4.", "Recognize that every absolute value is nonnegative.|A nonnegative expression cannot equal −4.|State the empty solution set without creating two false linear equations.", "No solution; ∅.", "Checking the possible range of absolute value prevents an invalid algebraic split."),
  ],
  "A3.8": [
    e("Solve the perimeter formula P = 2l + 2w for w.", "Subtract 2l from both sides: P − 2l = 2w.|Divide by 2.|Check by substituting the result back into the perimeter formula.", "w = (P − 2l)/2 = P/2 − l.", "Both equivalent forms isolate width while preserving the length units."),
    e("Solve v = u + at for t and state the restriction.", "Subtract u from both sides to obtain v − u = at.|Divide by a.|State the nonzero condition required by that division.", "t = (v − u)/a, provided a ≠ 0.", "A literal-equation solution must retain the condition under which the isolating division is legal."),
  ],

  "A4.1": [
    e("Reduce the ratio 18:24 and produce an equivalent ratio whose first term is 45.", "Divide both terms by their greatest common factor 6 to obtain 3:4.|Scale 3 to 45 by multiplying by 15.|Multiply the second term by the same factor.", "18:24 = 3:4 = 45:60.", "Equivalent ratios preserve order and multiply both entries by the same nonzero factor."),
    e("Red and black tiles are in the ratio 2:7, with 36 tiles total. Find each count.", "The ratio contains 2 + 7 = 9 equal parts.|Each part represents 36/9 = 4 tiles.|Multiply 2 and 7 by 4.", "8 red tiles and 28 black tiles.", "Part-to-part ratios can determine actual counts once the total fixes the size of one ratio part."),
  ],
  "A4.2": [
    e("A train travels 156 miles in 3 hours at a constant rate. Find the unit rate and the distance in 4.5 hours.", "Divide 156 miles by 3 hours to obtain 52 miles per hour.|Multiply 52 miles per hour by 4.5 hours.|Cancel hours and retain miles.", "52 mph and 234 miles.", "The unit rate converts elapsed time directly into distance when the rate is constant."),
    e("A 1.5-kilogram bag costs $6.90. Find the price per kilogram.", "Write the ordered rate $6.90/1.5 kg.|Divide 6.90 by 1.5.|Attach dollars per kilogram to the quotient.", "$4.60 per kilogram.", "A unit price keeps cost in the numerator and quantity in the denominator."),
  ],
  "A4.3": [
    e("Determine whether (x, y) = (3, 12), (5, 20), and (8, 32) form a proportional relationship.", "Compute y/x for each pair: 12/3, 20/5, and 32/8.|All three ratios equal 4.|Write the proportional equation and include the origin.", "Yes; y = 4x.", "A constant output-to-input ratio produces a line through the origin."),
    e("A tank fills with 18 liters every 3 minutes and begins empty. Write the proportional model and find the volume after 11 minutes.", "Compute the unit rate 18/3 = 6 liters per minute.|Because the tank begins empty, use V = 6t.|Evaluate V(11).", "V = 6t; V(11) = 66 liters.", "The zero initial value distinguishes a proportional model from a general linear model."),
  ],
  "A4.4": [
    e("A population of 250 increases by 12%. Find the new population using a multiplier.", "Convert 12% to 0.12.|Use the growth multiplier 1 + 0.12 = 1.12.|Multiply 250 by 1.12.", "280.", "The multiplier includes both the original 100% and the additional 12%."),
    e("After a 20% discount, a jacket costs $92. Find its original price.", "Let p be the original price.|A 20% discount leaves 80%, so 0.80p = 92.|Divide by 0.80.", "$115.", "Reverse-percent problems divide by the remaining multiplier rather than subtracting the percent from the final price."),
  ],
  "A4.5": [
    e("Which of (2, 7), (−1, −2), and (4, 10) satisfy y = 3x + 1?", "Evaluate 3x + 1 at x = 2, −1, and 4.|The predicted outputs are 7, −2, and 13.|Compare each predicted output with the stated y-coordinate.", "(2, 7) and (−1, −2) satisfy the equation; (4, 10) does not.", "A graph is the set of every ordered pair that makes its equation true."),
    e("Find the missing coordinate k if (k, 14) lies on 2x + y = 22.", "Substitute y = 14 and x = k.|Solve 2k + 14 = 22.|Check the resulting ordered pair in the original equation.", "k = 4, so the point is (4, 14).", "A missing coordinate is found by enforcing the equation that every point on the graph must satisfy."),
  ],
  "A4.6": [
    e("Find both intercepts of 4x − 5y = 20.", "Set y = 0 and solve 4x = 20.|Set x = 0 and solve −5y = 20.|Verify both ordered pairs in the original equation.", "x-intercept (5, 0); y-intercept (0, −4).", "Intercepts are equation solutions where one coordinate is zero."),
    e("A subscription cost is C = 12m + 35, where m is the number of months. Interpret the vertical intercept and determine whether a horizontal intercept is meaningful.", "Set m = 0 to obtain C = 35.|Solve 0 = 12m + 35 to obtain m = −35/12.|Compare the algebraic intercept with the contextual domain m ≥ 0.", "The vertical intercept is a $35 initial fee; the horizontal intercept is outside the meaningful domain.", "An algebraic intercept need not be meaningful in the modeled context."),
  ],
  "A4.7": [
    e("A table gives (x, y) = (0, 7), (2, 13), (5, 22), and (9, 34). Find the slope.", "Compute (13 − 7)/(2 − 0) = 3.|Check another interval: (22 − 13)/(5 − 2) = 3.|Confirm the final interval has the same rate.", "m = 3.", "Equal slopes across unequal input intervals establish a constant linear rate."),
    e("A table gives (0, 1), (1, 3), (2, 7), and (3, 13). Decide whether the relationship is linear.", "Compute successive output differences: 2, 4, and 6.|The input differences are all 1, but the output differences are not constant.|Conclude that no single slope fits the table.", "The relationship is not linear.", "A straight-line pattern requires constant average change over equal input intervals."),
  ],
  "A4.8": [
    e("Find the slope through (−3, 4) and (5, −2).", "Use the same order in both differences.|Compute (−2 − 4)/(5 − (−3)) = −6/8.|Reduce the fraction.", "m = −3/4.", "The negative slope agrees with output decreasing as input increases."),
    e("Find the slope through (6, −1) and (6, 8) and identify the line.", "Compute the horizontal change 6 − 6 = 0.|The slope quotient would divide by zero.|Use the shared x-coordinate to name the line.", "Slope is undefined; the line is x = 6.", "Vertical lines have zero horizontal change and therefore no real-number slope."),
  ],
  "A4.9": [
    e("Write the line through (−1, 2) and (3, 10) in slope-intercept form.", "Compute the slope (10 − 2)/(3 − (−1)) = 2.|Use y − 2 = 2(x + 1).|Expand and isolate y.", "y = 2x + 4.", "Two points determine the constant rate and then the intercept."),
    e("Rewrite 3x − 2y = 8 in slope-intercept form and identify its slope and vertical intercept.", "Subtract 3x to obtain −2y = −3x + 8.|Divide every term by −2.|Read the coefficients from y = mx + b.", "y = (3/2)x − 4; slope 3/2 and y-intercept (0, −4).", "Equivalent line forms expose different features without changing the solution set."),
  ],
  "A4.10": [
    e("Find the line parallel to 4x + 2y = 7 through (3, −1).", "Rewrite the given line as y = −2x + 7/2, so its slope is −2.|Use the same slope through the new point: y + 1 = −2(x − 3).|Simplify.", "y = −2x + 5.", "Distinct parallel lines have equal slopes and different intercepts."),
    e("Find the line perpendicular to 3x − y = 9 through (−2, 4).", "Rewrite the given line as y = 3x − 9, so its slope is 3.|Use the negative reciprocal slope −1/3.|Write y − 4 = −(1/3)(x + 2).", "y = −x/3 + 10/3.", "The product of the two nonvertical slopes is −1."),
  ],
  "A4.11": [
    e("For the model ŷ = 1.8x + 4, find the residual when x = 5 and the observed value is 14.", "Compute the prediction ŷ = 1.8(5) + 4 = 13.|Use residual = observed − predicted.|Interpret the positive sign.", "Residual = 14 − 13 = 1.", "The model underpredicts this observation by 1 unit."),
    e("Residuals for increasing x-values are −3, −1, 1, 3, and 5. Assess the linear fit.", "Inspect the residuals in input order.|They rise systematically instead of scattering around zero.|Conclude that the model misses a trend in the data.", "The linear model is not adequate without qualification.", "A visible residual pattern is evidence of structure left unexplained by the fitted line."),
  ],

  "A5.1": [
    e("Determine whether (2, −1) solves 3x + y = 5 and x − 2y = 4.", "Substitute into the first equation: 3(2) + (−1) = 5.|Substitute into the second: 2 − 2(−1) = 4.|Accept the pair only because both equations are true.", "Yes, (2, −1) solves the system.", "Simultaneous satisfaction, not success in one equation, defines a system solution."),
    e("Find the value of k for which (3, 2) solves 2x + ky = 14 and verify it.", "Substitute x = 3 and y = 2.|Solve 6 + 2k = 14 to obtain k = 4.|Check 2(3) + 4(2) = 14.", "k = 4.", "A parameter can be determined by requiring a specified pair to satisfy the condition."),
  ],
  "A5.2": [
    e("Find the intersection of y = −2x + 9 and y = x − 3.", "At an intersection the y-values are equal, so solve −2x + 9 = x − 3.|Obtain 3x = 12 and x = 4.|Substitute to find y = 1 and check both equations.", "(4, 1).", "The graphical intersection and algebraic system solution are the same ordered pair."),
    e("Classify the graphical solution of y = 3x + 2 and 6x − 2y = −4.", "Rewrite the second equation as y = 3x + 2.|Both equations name the same line.|State the complete shared solution set.", "Infinitely many solutions: every point on y = 3x + 2.", "Coincident graphs represent dependent equations with the same solution set."),
  ],
  "A5.3": [
    e("Solve x = 2y + 1 and 3x − y = 13 by substitution.", "Replace x in the second equation with 2y + 1.|Solve 3(2y + 1) − y = 13, giving 5y = 10.|Use x = 2y + 1 and check both equations.", "(5, 2).", "Replacing a variable by an equal expression preserves all common solutions."),
    e("Solve 4x + 2y = 6 and y = −x + 5 by substitution.", "Insert −x + 5 for y in the first equation.|Solve 4x + 2(−x + 5) = 6 to obtain x = −2.|Evaluate y = −(−2) + 5 and verify.", "(−2, 7).", "Substitution is efficient when one equation already isolates a variable."),
  ],
  "A5.4": [
    e("Solve 3x + 2y = 16 and 5x − 2y = 8 by elimination.", "Add the equations to eliminate y.|Solve 8x = 24, so x = 3.|Substitute to obtain y = 7/2 and verify both equations.", "(3, 7/2).", "Opposite coefficients allow elimination by direct addition."),
    e("Solve 2x + 3y = 7 and 5x + 2y = 8 by elimination.", "Multiply the first equation by 2 and the second by −3.|Add 4x + 6y = 14 and −15x − 6y = −24 to obtain −11x = −10.|Find x = 10/11, then substitute to obtain y = 19/11.", "(10/11, 19/11).", "Scaling whole equations creates opposite coefficients without changing their solution sets."),
  ],
  "A5.5": [
    e("Classify 3x + 6y = 12 and x + 2y = 4.", "Multiply the second equation by 3.|It becomes exactly 3x + 6y = 12.|State the geometric and algebraic conclusion.", "Infinitely many solutions; the equations describe the same line.", "Equivalent equations form a dependent system."),
    e("Classify 2x − 5y = 1 and 4x − 10y = 7.", "Double the first equation to obtain 4x − 10y = 2.|The left sides then match while the constants conflict.|Connect the contradiction 2 = 7 to parallel lines.", "No solution.", "Proportional coefficients with nonproportional constants form an inconsistent system."),
  ],
  "A5.6": [
    e("A theater sold 220 tickets. Adult tickets cost $15, student tickets cost $9, and revenue was $2,700. Find each count.", "Let a and s be the adult and student counts.|Write a + s = 220 and 15a + 9s = 2700.|Eliminate s to obtain 6a = 720, then find s and verify revenue.", "120 adult tickets and 100 student tickets.", "The solution must satisfy both the total-count and total-revenue conditions."),
    e("A mixture contains 30 liters of 40% solution made from 25% and 55% solutions. Find the amount of each.", "Let x be liters of 25% solution and y be liters of 55% solution.|Write x + y = 30 and 0.25x + 0.55y = 12.|Solve the system and check the solute total.", "15 liters of each solution.", "The concentration equation tracks amount of solute, not merely total liquid."),
  ],
  "A5.7": [
    e("Determine whether (2, 3) belongs to the feasible region x + y ≤ 6, x ≥ 0, and y > 1.", "Substitute the point into all three inequalities.|The statements 5 ≤ 6, 2 ≥ 0, and 3 > 1 are all true.|Accept the point only because every constraint holds.", "Yes, (2, 3) is feasible.", "Feasibility means simultaneous membership in every half-plane."),
    e("Find the vertices of the closed feasible region x ≥ 0, y ≥ 0, x + y ≤ 5, and 2x + y ≤ 8.", "Use the axes and boundary lines x + y = 5 and 2x + y = 8.|Their intersection is (3, 2); the relevant axis intercepts are (4, 0) and (0, 5).|Include the origin and verify every vertex against all constraints.", "(0, 0), (4, 0), (3, 2), and (0, 5).", "Vertices occur where active boundary conditions intersect within the shared feasible region."),
  ],
  "A5.8": [
    e("Choose a method and solve 7x − 3y = 11 and 2x + 3y = 7.", "Choose elimination because the y-coefficients are opposites.|Add the equations to obtain 9x = 18.|Find x = 2, then y = 1, and check both equations.", "(2, 1).", "Method choice should exploit coefficients already arranged for cancellation."),
    e("Choose a method and classify y = 2x − 5 and 4x − 2y = 10.", "Choose substitution because y is isolated.|Replace y in the second equation: 4x − 2(2x − 5) = 10.|The identity 10 = 10 shows that both equations describe the same line.", "Infinitely many solutions.", "A strategy studio includes classification; not every system ends in one ordered pair."),
  ],

  "A6.1": [
    e("Write (−2)⁵ as repeated multiplication and evaluate.", "Use five factors of the grouped base −2.|Pair four negative factors to obtain a positive product, leaving one negative factor.|Multiply to obtain the value.", "(−2)⁵ = −32.", "An odd number of negative factors produces a negative product."),
    e("A square array has 12 rows of 12 objects. Write the count with an exponent and evaluate.", "The same factor 12 appears twice.|Write the product as 12².|Evaluate 12·12.", "12² = 144 objects.", "Exponent notation compresses repeated multiplication of one base."),
  ],
  "A6.2": [
    e("Compare −2⁴, (−2)⁴, and (−2)³.", "In −2⁴, exponentiation occurs before the leading negation.|In (−2)⁴ and (−2)³, the negative is part of the base.|Evaluate each expression.", "−2⁴ = −16, (−2)⁴ = 16, and (−2)³ = −8.", "Grouping and exponent parity jointly determine the sign."),
    e("Evaluate −(−3)² and [−(−3)]².", "For the first expression, square −3 and then apply the outside negative.|For the second, simplify the entire bracket to 3 before squaring.|Compare the results.", "−(−3)² = −9; [−(−3)]² = 9.", "Parentheses determine which operations belong to the base."),
  ],
  "A6.3": [
    e("Simplify (m⁹n³)(m⁻⁴n⁵) using positive exponents.", "Add exponents of the common base m: 9 + (−4) = 5.|Add exponents of n: 3 + 5 = 8.|Write the product.", "m⁵n⁸.", "Product laws combine exponents only for matching bases."),
    e("Simplify 18a⁷b⁴/(6a²b⁶) and state restrictions.", "Divide coefficients to obtain 3.|Subtract exponents of a and b.|Rewrite b⁻² as a reciprocal and retain denominator restrictions.", "3a⁵/b², with a ≠ 0 and b ≠ 0 in the original expression.", "A negative exponent in the quotient becomes reciprocal structure, while original restrictions remain."),
  ],
  "A6.4": [
    e("Simplify (3x²y⁻¹)³ using positive exponents.", "Cube the coefficient and multiply each inner exponent by 3.|Obtain 27x⁶y⁻³.|Move y³ to the denominator.", "27x⁶/y³, with y ≠ 0.", "A power applied to a product acts on every factor."),
    e("Simplify [(a²b³)/(2c)]².", "Square the numerator factors and the denominator.|Compute (a²)² = a⁴ and (b³)² = b⁶.|State the denominator restriction.", "a⁴b⁶/(4c²), with c ≠ 0.", "The quotient power law applies to the entire grouped fraction."),
  ],
  "A6.5": [
    e("Simplify (4a⁰b⁻³)/(2b⁻¹) using positive exponents.", "Use a⁰ = 1 for a ≠ 0 and simplify the coefficient to 2.|Subtract b-exponents: −3 − (−1) = −2.|Rewrite with a positive exponent.", "2/b², with a ≠ 0 and b ≠ 0 in the original expression.", "Zero exponents remove factors numerically but do not erase restrictions inherited from the original form."),
    e("Rewrite 1/(x⁻²y³) using positive exponents.", "Use x⁻² = 1/x².|Dividing by (y³/x²) multiplies by its reciprocal.|Simplify the resulting fraction.", "x²/y³, with x ≠ 0 and y ≠ 0.", "A negative exponent changes factor location; it does not make the factor negative."),
  ],
  "A6.6": [
    e("Compute (6.0×10⁷)(3.5×10⁻⁴) in scientific notation.", "Multiply coefficients: 6.0·3.5 = 21.0.|Add exponents: 7 + (−4) = 3.|Normalize 21.0×10³ to a coefficient between 1 and 10.", "2.10×10⁴.", "Normalization moves one decimal place and compensates by increasing the power of ten."),
    e("Compute (8.4×10⁻³)/(2.0×10⁵).", "Divide coefficients: 8.4/2.0 = 4.2.|Subtract exponents: −3 − 5 = −8.|Confirm that the coefficient is normalized.", "4.2×10⁻⁸.", "Division in scientific notation divides coefficients and subtracts powers of ten."),
  ],
  "A6.7": [
    e("Evaluate ∛(−216) and explain why the result is real.", "Seek a real number whose cube is −216.|Because 6³ = 216 and odd powers preserve sign, use −6.|Check (−6)³.", "∛(−216) = −6.", "Odd roots are defined for negative real radicands."),
    e("Simplify √196 and compare it with the solutions of x² = 196.", "The radical symbol requests the principal nonnegative square root.|Compute √196 = 14.|For the equation, include both real numbers whose square is 196.", "√196 = 14; x = ±14.", "A principal radical is one value, while an even-power equation may have two solutions."),
  ],
  "A6.8": [
    e("Solve 3x³ = −192 over the real numbers.", "Divide by 3 to obtain x³ = −64.|Take the real cube root.|Substitute the result into the original equation.", "x = −4.", "An odd-power equation has one real solution for every real target."),
    e("Solve (x − 2)⁴ = 16 over the real numbers.", "Take the fourth-root condition x − 2 = ±2.|Solve the two linear equations.|Check both values in the original equation.", "x = 0 or x = 4.", "Even powers require both positive and negative real roots after isolation."),
  ],
  "A6.9": [
    e("For f(x) = x⁴, compute f(−2), f(−1), f(0), f(1), and f(2), then describe symmetry.", "Evaluate the fourth power at each input.|The outputs are 16, 1, 0, 1, and 16.|Compare outputs at opposite inputs.", "f is even and symmetric about the y-axis.", "Even powers give equal outputs for x and −x."),
    e("Compare the end behavior of g(x) = −2x³ and h(x) = 3x⁴.", "Use the leading coefficient and exponent parity.|For g, opposite input directions produce opposite output directions, reversed by the negative coefficient.|For h, both ends rise because the degree is even and the coefficient is positive.", "g(x)→∞ as x→−∞ and g(x)→−∞ as x→∞; h(x)→∞ in both directions.", "Degree parity and leading-coefficient sign determine polynomial power-function end behavior."),
  ],
});
