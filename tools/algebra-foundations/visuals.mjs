const v = (layout, labels, note) => ({ layout, labels, note });

const LESSON_VISUALS = {
  "A0.1": [
    v("number-line", ["−5", "0", "5"], "Sign gives direction; distance from zero gives absolute value."),
    v("number-line", ["−8°C", "−2°C", "6°C"], "The signed change from −2°C to 6°C is +8°C."),
    v("flow", ["5 − (−4)", "5 + 4", "9"], "Subtracting a number means adding its opposite."),
  ],
  "A0.2": [
    v("table", ["48,762", "49,000", "nearest thousand"], "Place value determines the rounding decision."),
    v("flow", ["198 × 31", "200 × 30 ≈ 6,000", "exact: 6,138"], "Estimate first; use the exact result only if its scale is plausible."),
    v("table", ["24,816 ÷ 8", "estimate ≈ 3,000", "exact: 3,102"], "An order-of-magnitude check catches a misplaced digit."),
  ],
  "A0.3": [
    v("factor-tree", ["60", "2² · 3 · 5", "prime factorization"], "A factor tree ends only at prime factors."),
    v("table", ["18 = 2·3²", "24 = 2³·3", "GCF = 2·3 = 6"], "The GCF uses only shared prime factors with the smaller exponent."),
    v("flow", ["6-min cycle", "8-min cycle", "LCM = 24 min"], "The LCM is the first positive time both cycles meet."),
  ],
  "A0.4": [
    v("flow", ["1 whole", "8 equal parts", "3 shaded = 3/8"], "The denominator names equal parts; the numerator counts selected parts."),
    v("number-line", ["0", "3/4", "1"], "A fraction is a number with a fixed position, not only a piece of a picture."),
    v("flow", ["6/8", "÷2/÷2", "3/4"], "Equivalent fractions scale numerator and denominator by the same nonzero factor."),
  ],
  "A0.5": [
    v("flow", ["3/4 of 2/5", "3·2 / 4·5", "3/10"], "Multiplication finds a fraction of a fraction."),
    v("flow", ["2/3 ÷ 4/5", "2/3 · 5/4", "5/6"], "Dividing by a nonzero fraction means multiplying by its reciprocal."),
    v("table", ["2/3 ÷ 1/6", "How many sixths?", "4"], "A quotative interpretation asks how many groups fit."),
  ],
  "A0.6": [
    v("flow", ["2/3 + 1/4", "8/12 + 3/12", "11/12"], "Addition requires equal-sized parts, so use a common denominator."),
    v("flow", ["5/6 − 1/4", "10/12 − 3/12", "7/12"], "Rename both fractions before subtracting numerators."),
    v("flow", ["(3/4)/(2/5)", "3/4 · 5/2", "15/8"], "Treat the main fraction bar as division before simplifying."),
  ],
  "A0.7": [
    v("flow", ["3/8", "3 ÷ 8", "0.375 = 37.5%"], "Fractions, decimals, and percents can name the same number."),
    v("number-line", ["0.25", "1/2 = 0.50", "75% = 0.75"], "Compare all forms on one common scale."),
    v("table", ["0.45", "45/100", "9/20"], "Convert through place value, then simplify the fraction."),
  ],
  "A0.8": [
    v("table", ["3 cups / 5 cups", "constant ratio", "12 cups / 20 cups"], "A proportion preserves the order and scale of corresponding quantities."),
    v("flow", ["150 miles / 3 h", "÷3", "50 miles per hour"], "A unit rate has a denominator of one unit."),
    v("flow", ["80 → 92", "change = 12", "12/80 = 15%"], "Percent change compares the change with the original amount."),
  ],
  "A0.9": [
    v("flow", ["180 miles / 3 h", "60 miles/hour", "×5 h = 300 miles"], "Units multiply and cancel with the numbers."),
    v("table", ["1 ft = 12 in", "5 ft · 12 in/ft", "60 in"], "A conversion factor equals one and changes only the unit name."),
    v("flow", ["length × width", "cm · cm", "cm²"], "Dimensional reasoning predicts the unit of a result."),
  ],
  "A0.10": [
    v("flow", ["2³ · 2²", "2⁵", "32"], "Equal bases combine repeated factors by adding exponents."),
    v("flow", ["√81", "positive number with square 81", "9"], "The radical symbol names the principal nonnegative square root."),
    v("table", ["0.00042", "4.2 × 10⁻⁴", "coefficient 1 ≤ 4.2 < 10"], "Scientific notation separates significant digits from scale."),
  ],
  "A1.1": [
    v("table", ["x: independent input", "y: dependent output", "y = 2x + 1"], "A symbol's role comes from the relationship and the question."),
    v("flow", ["fixed fee 4", "miles m vary", "fare = 4 + 2.5m"], "Constants stay fixed while variables describe changing quantities."),
    v("table", ["unknown x", "parameter a", "ax + b = c"], "The same letter can play different roles in different models."),
  ],
  "A1.2": [
    v("table", ["3x + 5", "3x + 5 = 20", "3x + 5 > 20"], "An expression names a value; equations and inequalities make claims."),
    v("flow", ["equation", "true at x = 5", "solution set {5}"], "A solution makes an equation true."),
    v("number-line", ["−2", "open endpoint", "x < −2"], "An inequality usually describes a set of values."),
  ],
  "A1.3": [
    v("flow", ["−4x²", "coefficient −4", "variable part x²"], "A term is a product; its coefficient includes its sign."),
    v("table", ["3x²", "−5x", "7"], "Terms are separated by top-level addition or subtraction."),
    v("flow", ["2(x + 3)", "factor 2 × factor (x+3)", "not three terms"], "Grouping symbols reveal multiplicative structure."),
  ],
  "A1.4": [
    v("flow", ["f(x)=2x²−3", "x = −2", "2(−2)²−3 = 5"], "Replace every occurrence and preserve grouping."),
    v("table", ["x = 3", "2x+1 = 7", "x²−1 = 8"], "A value table records the outputs produced by one input."),
    v("flow", ["a=2, b=−3", "a−2b", "2−2(−3)=8"], "Parentheses keep a negative substituted value intact."),
  ],
  "A1.5": [
    v("flow", ["3 + 2·5", "multiplication first", "13"], "Grouping and operation priority determine structure."),
    v("flow", ["(3 + 2)·5", "grouping first", "25"], "Parentheses change which operation acts first."),
    v("table", ["−3² = −9", "(−3)² = 9", "different bases"], "Parentheses decide whether the sign is part of the squared base."),
  ],
  "A1.6": [
    v("flow", ["3(x + 4)", "3x + 12", "distributive property"], "Distribution connects a product with an equivalent sum."),
    v("table", ["a+b=b+a", "(a+b)+c=a+(b+c)", "commutative vs associative"], "One property changes order; the other changes grouping."),
    v("flow", ["x + 0 = x", "x · 1 = x", "identity elements"], "Identity operations leave a value unchanged."),
  ],
  "A1.7": [
    v("flow", ["3x + 5x", "(3+5)x", "8x"], "Like terms combine because they share the same variable factor."),
    v("table", ["2x + 3", "5x − 1", "not equivalent"], "Equivalent expressions agree for every allowed input."),
    v("flow", ["4(x−2)+3x", "4x−8+3x", "7x−8"], "Distribute before combining like terms."),
  ],
  "A1.8": [
    v("table", ["d: distance", "r: distance/time", "t: time"], "A quantity dictionary gives every symbol a meaning and unit."),
    v("flow", ["d = rt", "divide by r", "t = d/r, r ≠ 0"], "Rearranging a formula isolates the quantity the problem asks for."),
    v("flow", ["A = lw", "length · length", "area unit²"], "Dimensional consistency is a fast formula check."),
  ],
  "A2.1": [
    v("flow", ["3x − 5 = 7", "x = 4", "3(4)−5 = 7 ✓"], "A solution survives substitution into the original equation."),
    v("table", ["x = −2", "x²+x", "4−2 = 2"], "Simplify each side independently when checking a candidate."),
    v("table", ["x+0=x", "true for every x", "solution set: all reals"], "A solution set may contain one, none, or every allowed value."),
  ],
  "A2.2": [
    v("flow", ["x + 14 = 31", "subtract 14 on both sides", "x = 17"], "Inverse operations preserve a balanced equation."),
    v("flow", ["x − 8 = −3", "add 8 on both sides", "x = 5"], "The same operation must act on both sides."),
    v("flow", ["6 − x = 10", "−x = 4", "x = −4"], "A subtracted variable has coefficient −1."),
  ],
  "A2.3": [
    v("flow", ["−6x = 27", "divide both sides by −6", "x = −9/2"], "Division undoes a nonzero coefficient."),
    v("flow", ["x/−4 = 7", "multiply both sides by −4", "x = −28"], "Multiplication by the denominator clears division."),
    v("table", ["0x = 5 → none", "0x = 0 → all", "never divide by zero"], "A zero coefficient requires classification, not division."),
  ],
  "A2.4": [
    v("flow", ["4x + 3x − 5", "7x − 5", "combine like terms"], "Simplify within a side before applying balance operations."),
    v("flow", ["3(x + 4)", "3x + 12", "distribution"], "A factor multiplies every term in the group."),
    v("flow", ["2(x−3)+4=12", "2x−2=12", "x=7"], "Simplification exposes the equation's solvable structure."),
  ],
  "A2.5": [
    v("flow", ["5x − 7 = 28", "5x = 35", "x = 7"], "Undo addition, then undo multiplication."),
    v("flow", ["4 − 3x = 19", "−3x = 15", "x = −5"], "Keep the negative coefficient visible."),
    v("flow", ["2(3x−1)+5=27", "6x+3=27", "x=4"], "Simplify first, then use balance operations."),
  ],
  "A2.6": [
    v("flow", ["x/3 + 1/4 = 5/6", "×12 every term", "4x+3=10"], "The least common denominator clears every fraction term."),
    v("flow", ["0.3x−1.2=2.4", "×10 every term", "3x−12=24"], "A power of ten clears terminating decimals exactly."),
    v("flow", ["(2x−1)/5=(x+4)/3", "×15", "3(2x−1)=5(x+4)"], "Clear denominators before expanding."),
  ],
  "A2.7": [
    v("flow", ["7x+2=4x+20", "subtract 4x", "3x+2=20"], "Collecting the smaller variable term keeps a positive coefficient."),
    v("flow", ["5−2x=3x−15", "add 2x and 15", "20=5x"], "Collect variables and constants with explicit balance operations."),
    v("flow", ["3(x+2)=2x+11", "3x+6=2x+11", "x=5"], "Simplify before collecting variable terms."),
  ],
  "A2.8": [
    v("flow", ["3x+4=x+12", "2x=8", "one solution: x=4"], "A remaining nonzero variable coefficient gives one solution."),
    v("flow", ["2(x+3)=2x+9", "6=9", "no solution"], "A false constant statement gives an empty solution set."),
    v("flow", ["5(x−2)+3=5x−7", "−7=−7", "all real numbers"], "A true constant statement means the original expressions are identical."),
  ],
  "A2.9": [
    v("flow", ["$4 fixed + $2.50m", "4+2.50m=19", "m=6 miles"], "Define the variable and units before solving the model."),
    v("flow", ["width w", "length w+3", "2w+2(w+3)=30"], "Translate the relationship before calculating."),
    v("flow", ["original p", "80% remains", "0.80p=64 → p=$80"], "A discount equation uses the remaining percent of the original."),
  ],
  "A2.10": [
    v("table", ["scan structure", "choose a valid first move", "solve and verify"], "A strategy responds to the equation's structure."),
    v("flow", ["x/4+(x−2)/6=3", "×12", "3x+2(x−2)=36"], "Clear fractions when doing so makes the equation simpler."),
    v("table", ["x=a → one", "true statement → all", "false statement → none"], "The final form determines the solution-set classification."),
  ],
};

export const FOUNDATION_VISUAL_PROFILES = Object.freeze(Object.fromEntries(
  Object.entries(LESSON_VISUALS).flatMap(([lessonId, profiles]) => {
    if (profiles.length !== 3) throw new Error(`${lessonId} must define exactly 3 visual profiles.`);
    return profiles.map((profile, index) => [`${lessonId}-V${index + 1}`, profile]);
  }),
));

if (Object.keys(FOUNDATION_VISUAL_PROFILES).length !== 84) {
  throw new Error("A0–A2 must define exactly 84 authored visual profiles.");
}

export const getFoundationVisualProfile = (visualId) => FOUNDATION_VISUAL_PROFILES[visualId] ?? null;
