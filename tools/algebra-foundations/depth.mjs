const q = (prompt, answer, solution) => ({ prompt, answer, solution });

const lesson = ({ exposition, method, definitions, questions, exampleNotes }) => ({
  exposition,
  method,
  definitions,
  questions,
  exampleNotes,
});

export const FOUNDATION_DEPTH = {
  "A0.1": lesson({
    exposition: [
      "Signed arithmetic becomes much easier when a number and an operation are kept separate. In −7, the minus sign belongs to the number and locates it seven units left of zero. In 4 − 7, subtraction is the operation being performed. Parentheses make the distinction visible: 4 + (−7) means start at 4 and apply a change of negative 7. This language works for temperature, elevation, debt, direction, and any other quantity with a meaningful zero. Before calculating, name what zero means and what the positive direction means; otherwise a numerically correct result can still be interpreted backward.",
      "To add signed numbers, first ask whether the changes point in the same direction. If both are positive, or both are negative, combine their distances and keep the common direction. If the signs differ, the movements compete: subtract the smaller absolute value from the larger absolute value and keep the direction of the movement with greater magnitude. This is not a separate collection of sign tricks. It is exactly what happens on a number line. For −9 + 4, the four-unit rightward movement cancels four of the nine leftward units, leaving a position of −5.",
      "Subtraction can describe removal, comparison, or change, but all three meanings agree with adding an opposite. The expression a − b asks for the signed difference that carries b to a; rewriting it as a + (−b) turns that difference into a direction. This explains the easily memorized but often misunderstood statement that subtracting a negative becomes addition. The opposite of −6 is +6, so 2 − (−6) = 2 + 6. The two adjacent minus signs are not magically multiplying; one names subtraction and the other belongs to the number being subtracted.",
      "Absolute value is useful for distance because distance ignores direction. The distance between a and b is |a − b|, not |a| − |b|. For points −4 and 7, the distance is |7 − (−4)| = |11| = 11. Order, however, does depend on direction: a point farther right is greater. This is why −3 > −10 even though |−10| > |−3|. When a comparison feels uncertain, draw a short number line, mark zero, and place the two values. The picture prevents absolute magnitude from being mistaken for numerical order.",
      "A reliable signed-number check uses the story as well as the arithmetic. Predict the direction before calculating: a withdrawal should lower a balance, an upward movement should raise elevation, and a fall larger than the starting positive temperature should cross zero. After calculating, reverse the change. If a balance of −$18 receives a $25 deposit and becomes $7, subtracting the deposit should recover −$18. This reverse-operation check catches copied signs and direction errors. It also builds the habit used later when equations are checked by substituting a proposed solution into the original statement.",
    ],
    method: {
      title: "Read direction before combining magnitude",
      steps: [
        "Define the zero point and the positive direction in the situation.",
        "Rewrite every subtraction a − b as addition a + (−b).",
        "Combine movements: add magnitudes for a shared direction, or subtract magnitudes for opposing directions.",
        "Interpret the sign of the result in the original context.",
      ],
      check: "Reverse the final signed change or place the result on a number line and confirm that its direction and distance are plausible.",
    },
    definitions: [
      ["signed number", "A number whose sign records a direction relative to a chosen zero.", "The meaning of positive and negative must be defined by the context."],
      ["signed difference", "The change from an initial value to a final value, calculated as final minus initial.", "Its sign records the direction of change; its absolute value records the amount of change."],
    ],
    questions: [
      q("A diver is at −18 m and rises 7 m, then descends 4 m. Find and interpret the final position.", "−15 m", "Compute −18 + 7 + (−4) = −15. The negative sign means the diver remains 15 m below the reference level."),
      q("Without calculating first, predict the sign of −23 + 17. Then evaluate and explain.", "Negative; −6", "The leftward magnitude 23 is larger than the rightward magnitude 17, so the result is negative. Their magnitude difference is 6."),
      q("Find the distance between −12 and −3, and distinguish that distance from the signed change from −12 to −3.", "Distance 9; signed change +9", "The signed change is −3 − (−12) = 9. Its absolute value, 9, is the distance."),
      q("A student writes −4 − (−9) = −13. Identify the first wrong idea and repair the calculation.", "−4 − (−9) = −4 + 9 = 5", "The opposite of −9 is +9, so subtraction must be rewritten before the signed values are combined."),
    ],
    exampleNotes: [
      "The ordering method scales to any real numbers: compare their locations, then use absolute value only when the question asks for distance.",
      "The context supplies a useful prediction. A fall larger than the starting positive temperature must cross zero and end negative.",
      "The inverse-operation check explains the sign change and is stronger evidence than remembering a slogan about two minus signs.",
    ],
  }),
  "A0.2": lesson({
    exposition: [
      "Place value is a multiplicative system. Each position is worth ten times the position to its right, so a numeral is a compact sum of digit-place products. The number 52,407 means 5·10,000 + 2·1,000 + 4·100 + 0·10 + 7. Decimal places continue the same pattern to the right with tenths, hundredths, and thousandths. Regrouping never changes the total; it only exchanges equivalent bundles such as 1 hundred for 10 tens. Writing one expanded form before using an algorithm can reveal why a borrowed or carried digit has the value it does.",
      "Estimation should happen before exact computation, because it creates an independent expectation rather than an excuse for the answer already obtained. Choose friendly numbers that preserve scale: 612·49 is near 600·50 = 30,000, while 15,960 ÷ 32 is near 16,000 ÷ 32 = 500. A useful estimate does not need to be extremely close. It needs to distinguish a plausible answer from one that is ten, one hundred, or one thousand times too large or too small.",
      "Mental decomposition often exposes more structure than a long algorithm. Multiplying 249·16 can be viewed as (250 − 1)·16 = 4,000 − 16. Dividing 7,344 by 24 can be checked by reconstructing 306·24. These rewrites depend on the distributive property and inverse operations, ideas that later become central in Algebra. The goal is not to avoid standard algorithms; it is to understand enough structure to choose an efficient method and to notice when a copied digit or calculator entry cannot be right.",
      "Rounding decisions depend on the purpose of the result. A grocery estimate may round each item upward to protect a budget, while a scientific measurement may retain specified significant digits. In a multistep calculation, rounding intermediate values can accumulate error, so keep exact values until the final step unless the problem explicitly calls for staged estimation. State the place to which you round. Writing “about 4,000” communicates more mathematical information than silently replacing 3,984 with 4,000.",
      "Three checks work together: sign, size, and inverse operation. A count of objects should not become negative; the digit count should match the estimate; and the inverse operation should reconstruct the starting value. Units add another safeguard: a dollar total cannot be reported as 52,000 dollars when the item prices were each near ten dollars. Calculators are valuable for speed, but the person using the calculator remains responsible for entering the intended expression and deciding whether the output describes the original problem.",
    ],
    method: {
      title: "Estimate, compute, and verify",
      steps: [
        "Round the inputs to friendly values that preserve their order of magnitude.",
        "Predict the sign, digit count, and approximate interval of the result.",
        "Compute exactly with place-value regrouping, decomposition, or a calculator.",
        "Compare the exact result with the estimate and verify it with the inverse operation.",
      ],
      check: "Reject any result whose sign, number of digits, units, or inverse-operation check conflicts with the original quantities.",
    },
    definitions: [
      ["compatible estimate", "An approximation that preserves the scale and operation of the original problem while using friendlier values.", "The estimate should be independent of the exact answer."],
      ["inverse-operation check", "A verification that reverses a computation, such as multiplying a quotient by the divisor.", "Allow for any stated remainder or rounding when reconstructing the original value."],
    ],
    questions: [
      q("Estimate and then calculate 3,986 + 7,041 − 2,975.", "Estimate 8,000; exact 8,052", "Use 4,000 + 7,000 − 3,000 = 8,000. Exact computation gives 11,027 − 2,975 = 8,052."),
      q("A calculator displays 608·72 = 4,377.6. Explain why the display is impossible and give the correct product.", "43,776", "600·70 is about 42,000, so 4,377.6 is ten times too small. Compute 608(70 + 2) = 42,560 + 1,216."),
      q("Compute 99·347 mentally using structure, and name the property used.", "34,353; distributive property", "Rewrite 99 as 100 − 1: 347(100 − 1) = 34,700 − 347 = 34,353."),
      q("A school orders 48 boxes with 24 notebooks each. Give an estimate, exact total, and inverse-operation check.", "Estimate about 1,200; exact 1,152", "Use 50·24 ≈ 1,200. Exact: (40 + 8)24 = 960 + 192 = 1,152. Check 1,152 ÷ 48 = 24."),
    ],
    exampleNotes: [
      "The estimate is deliberately computed first, so it can detect rather than merely echo the exact multiplication.",
      "Regrouping is an equality-preserving exchange of place-value units; adding the subtrahend back tests every exchange at once.",
      "An answer that differs from the estimate by a factor of ten almost always signals a place-value or decimal-entry error.",
    ],
  }),
  "A0.3": lesson({
    exposition: [
      "Prime factorization turns a whole number into an inventory of indivisible multiplicative building blocks. A factor tree may branch in different ways, but every complete tree ends with the same prime factors apart from order. For 360, starting with 36·10 or 45·8 eventually produces 2³·3²·5. This uniqueness is why prime exponents can be used reliably to compare divisibility, simplify fractions, build common denominators, and later factor algebraic expressions. A factorization is complete only when every remaining factor is prime.",
      "The greatest common factor is constructed by asking what every number can supply. If 84 = 2²·3·7 and 126 = 2·3²·7, both numbers contain at least one 2, one 3, and one 7. They do not both contain a second 2 or a second 3. Taking the smaller exponent of each shared prime gives 2·3·7 = 42. In a grouping context, this means 42 is the largest number of identical groups that can be formed without leftovers.",
      "The least common multiple asks the opposite inventory question: what is the smallest product large enough to contain each input’s complete prime factorization? Use every prime that appears and the largest exponent required by any input. For 12 = 2²·3 and 18 = 2·3², the smallest shared multiple needs 2² and 3², so it is 36. In a timing context, 36 is the first positive point at which cycles of 12 and 18 align.",
      "Context determines whether a problem calls for a divisor or a multiple. Words such as “largest identical groups,” “greatest equal side,” or “cut with no waste” suggest a GCF. Words such as “first time together,” “smallest common denominator,” or “repeat on the same day” suggest an LCM. A quick size check helps: the GCF cannot exceed the smallest positive input, while the LCM cannot be smaller than the largest positive input.",
      "Prime exponents also make divisibility arguments transparent. A number is divisible by 72 = 2³·3² only if its factorization contains at least three factors of 2 and two factors of 3. This same minimum-versus-maximum reasoning will reappear when rational expressions are simplified and when polynomial factors are compared. Keep the factorization beside the original numbers and multiply it back at the end; reconstructing the input catches missing or duplicated primes.",
    ],
    method: {
      title: "Use prime inventories to choose GCF or LCM",
      steps: [
        "Translate the context: shared pieces indicate GCF; first alignment indicates LCM.",
        "Write each positive whole number as a product of prime powers.",
        "For GCF, keep shared primes with minimum exponents; for LCM, keep all primes with maximum exponents.",
        "Multiply the selected prime powers and interpret the result in the context.",
      ],
      check: "Verify that the GCF divides every input or that every input divides the LCM, and confirm the result has the expected size.",
    },
    definitions: [
      ["common divisor", "A positive whole number that divides each number in a collection with no remainder.", "The GCF is the largest such divisor."],
      ["common multiple", "A positive whole number divisible by each number in a collection.", "The LCM is the smallest positive such multiple."],
    ],
    questions: [
      q("Use prime exponents to find GCF(180, 252) and LCM(180, 252).", "GCF 36; LCM 1,260", "180 = 2²·3²·5 and 252 = 2²·3²·7. Minimum shared powers give 36; maximum powers give 2²·3²·5·7 = 1,260."),
      q("A rectangular floor is 168 cm by 216 cm. Find the largest square tile side that fits exactly.", "24 cm", "The side must divide both dimensions. GCF(168,216) = 24."),
      q("Three alarms repeat every 8, 12, and 30 minutes. If they sound together now, when do they next align?", "120 minutes", "LCM(8,12,30) = 2³·3·5 = 120."),
      q("A student finds LCM(12,18) = 6 by keeping only shared prime factors. Diagnose the choice, not just the arithmetic.", "The student computed the GCF; LCM is 36", "Keeping shared minimum powers answers a divisor question. Alignment requires all maximum powers: 2²·3² = 36."),
    ],
    exampleNotes: [
      "A factor tree is finished only when every leaf is prime; multiplying the leaves back verifies the inventory.",
      "Minimum exponents describe what both inputs share and therefore justify the greatest common factor.",
      "Maximum exponents build the smallest number that contains every cycle’s requirements.",
    ],
  }),
  "A0.4": lesson({
    exposition: [
      "A fraction is first a number, not merely two whole numbers separated by a bar. The denominator chooses the unit size 1/b, and the numerator counts how many of those units are present. On a number line, 7/4 means seven steps of length 1/4 from zero, which lands at 1¾. This location does not depend on how a picture is shaded or how the fraction was produced. Treating fractions as points makes improper fractions, negative fractions, and operations on fractions part of the same number system.",
      "The fraction bar also acts as grouping and division. In a/b, the entire numerator is divided by the entire denominator. This matters later in expressions such as (x + 3)/(2x − 1), where ignoring the grouping changes the value. A denominator of zero is forbidden because there is no number of equal groups of size zero that reconstructs a nonzero quantity, and 0/0 cannot identify one unique quotient. The restriction b ≠ 0 belongs to the fraction from the moment it is written.",
      "Equivalent fractions rename the same point using a different partition. Multiplying by n/n, where n ≠ 0, is multiplication by 1, so it preserves value: 3/5 = 3/5·4/4 = 12/20. Simplifying reverses this process by dividing numerator and denominator by a common nonzero factor. The goal is not to make the numbers smaller at any cost; it is to expose the same value with fewer shared factors while preserving the denominator restriction.",
      "Several comparison methods are valid because each creates a shared basis. Common denominators compare counts of equal-sized parts. Common numerators compare the sizes of the parts. Benchmarks such as 0, 1/2, and 1 give quick estimates. Cross-products compare ad and bc for a/b and c/d when the denominators have known positive signs. A comparison method should be chosen for clarity: 7/8 > 3/4 is immediate from eighths, while 11/20 < 3/5 is immediate from decimals or hundredths.",
      "Context changes the role of a fraction without changing its value. Three-fourths can locate 0.75 on a line, record 3 ÷ 4, compare 3 red objects with 4 blue objects, or operate on a quantity as 3/4 of it. Always identify the whole and the units. Three-fourths of a meter is not the same quantity as three-fourths of a class, even though both use the same numerical multiplier. Clear units and a labeled whole prevent many fraction errors before computation begins.",
    ],
    method: {
      title: "Name the whole, partition, and fraction role",
      steps: [
        "Identify the whole quantity and confirm that the denominator is nonzero.",
        "Interpret the denominator as the unit size and the numerator as the count of those units.",
        "Choose an equivalent form suited to the task: number-line point, quotient, decimal, common denominator, or operator.",
        "Preserve value by multiplying or dividing numerator and denominator by the same nonzero factor.",
      ],
      check: "Locate the original and rewritten fractions on the same number line or convert both to a common exact form and confirm they coincide.",
    },
    definitions: [
      ["unit fraction", "A fraction with numerator 1 that names one equal part of a whole.", "The denominator must be a nonzero whole number in a partition context."],
      ["improper fraction", "A fraction whose numerator has magnitude at least as large as its denominator.", "It is an ordinary number and may be rewritten as a mixed number without changing its value."],
    ],
    questions: [
      q("Place −7/4, −1/2, and 5/4 in increasing order and justify the order with locations.", "−7/4 < −1/2 < 5/4", "Their decimal locations are −1.75, −0.5, and 1.25, so left-to-right order gives the result."),
      q("Explain why multiplying 5/12 by 3/3 changes its name but not its value.", "5/12 = 15/36", "The factor 3/3 equals 1, so the product remains at the same number-line point."),
      q("Compare 17/24 and 5/7 without using a calculator.", "17/24 < 5/7", "Cross-products are 17·7 = 119 and 5·24 = 120. Positive denominators preserve the comparison."),
      q("A recipe uses 3/4 cup per batch. Interpret 3/4 as a number, quotient, ratio, and operator in this context.", "0.75; 3÷4; 3 cups to 4 batches at the same scale; multiply batch count by 3/4 cup", "Each interpretation preserves the same per-batch quantity while emphasizing a different role."),
    ],
    exampleNotes: [
      "The mixed-number form and improper-fraction form are two names for the same number-line point.",
      "The common denominator is useful because it turns both fractions into counts of the same-sized unit.",
      "Acting on 40 exposes the operator meaning: divide by the denominator, then take the numerator’s count of groups.",
    ],
  }),
  "A0.5": lesson({
    exposition: [
      "Fraction multiplication is scaling. Multiplying a positive quantity by 3/4 asks for three of four equal parts, so the result is smaller than the original. Multiplying by 5/3 asks for five parts when three parts make one whole, so the result is larger. Predicting enlargement or shrinkage before multiplying is a powerful reasonableness check. The rule (a/b)(c/d) = ac/bd is not an arbitrary instruction: taking a/b of c/d partitions c/d into b equal shares and selects a of them.",
      "Cancellation is division by a common factor, not deletion of matching digits or terms. In (14/15)(25/28), the factor 14 shares 14 with 28 and 25 shares 5 with 15. Replacing 14/28 with 1/2 and 25/15 with 5/3 preserves the product because numerator and denominator of the complete fraction are divided by equal nonzero factors. Writing prime factors makes this visible and prevents illegal cancellation across addition.",
      "Fraction division asks how many groups of the divisor fit in the dividend. The reciprocal rule follows from turning the divisor into 1. To compute a/b ÷ c/d, multiply both quantities in the division by d/c, which is allowed only when c/d ≠ 0. The divisor becomes 1, and the dividend becomes (a/b)(d/c). This derivation explains both the reciprocal and the restriction: division by a zero fraction is impossible.",
      "A picture or measurement interpretation keeps the operation meaningful. If 3½ cups are available and each batch uses 2/3 cup, the expression 7/2 ÷ 2/3 counts batch-size groups. The answer 21/4 = 5¼ means five complete batches plus one quarter of another batch, not five and one quarter cups. Units help distinguish the amount available, the size of each group, and the number of groups.",
      "Signs obey the same multiplication and division rules as for integers because direction is carried by the sign while scale is carried by the absolute values. An odd number of negative factors gives a negative product; an even number gives a positive product. Check the result in three ways: predict its sign, predict whether its magnitude should grow or shrink, and reverse a division by multiplying the quotient by the original nonzero divisor.",
    ],
    method: {
      title: "Treat products as scaling and quotients as group counts",
      steps: [
        "Predict the sign and whether the magnitude should enlarge or shrink.",
        "Convert mixed numbers to improper fractions and factor numerators and denominators.",
        "For multiplication, cancel common factors; for division, multiply by the reciprocal of a nonzero divisor.",
        "Multiply the remaining factors and interpret the units of the result.",
      ],
      check: "For division, multiply the quotient by the original divisor; for multiplication, compare the product’s size with the scaling prediction.",
    },
    definitions: [
      ["scaling factor", "A multiplier that changes a quantity by a specified ratio.", "For positive quantities, factors between 0 and 1 shrink and factors greater than 1 enlarge."],
      ["reciprocal", "For a nonzero number a/b, the number b/a whose product with a/b is 1.", "Zero has no reciprocal."],
    ],
    questions: [
      q("Predict and compute (−7/9)(27/14).", "−3/2", "One negative factor makes the product negative. Cancel 7 with 14 and 27 with 9 to obtain −(1·3)/(2·1) = −3/2."),
      q("A 12-mile trail is 5/8 complete. How many miles are complete and how many remain?", "7.5 miles complete; 4.5 miles remain", "Compute (5/8)12 = 15/2 = 7.5, then subtract from 12."),
      q("How many 3/8-meter pieces can be cut from 6 meters? Explain the unit cancellation.", "16 pieces", "Compute 6 m ÷ (3/8 m per piece) = 6·8/3 pieces = 16 pieces; meters cancel."),
      q("A student cancels the 3s in (3 + 5)/3 and writes 1 + 5. Repair the reasoning.", "The value is 8/3", "Cancellation applies to common factors of the entire numerator and denominator. In 3 + 5, 3 is a term, not a factor of the whole sum."),
    ],
    exampleNotes: [
      "The product’s size agrees with the prediction because multiplying by 2/3 and 3/5 both shrink a positive quantity.",
      "The reciprocal appears because it turns the nonzero divisor into 1, leaving an equivalent multiplication problem.",
      "The quotient’s units are batches: available cups divided by cups per batch counts how many batch-size groups fit.",
    ],
  }),
  "A0.6": lesson({
    exposition: [
      "Fractions can be added or subtracted only after their parts name the same unit. Three fifths and one fifth are both counts of fifth-size parts, so 3/5 + 1/5 = 4/5. Three fifths and one fourth cannot be combined as 4/9 because fifths and fourths are different sizes. A common denominator repartitions both fractions into equal-sized pieces without changing either value. The least common denominator is efficient, but any nonzero common multiple of the denominators can produce a correct result.",
      "The common-denominator algorithm follows from equivalence. To add a/b + c/d, rewrite a/b as ad/bd and c/d as bc/bd. The numerator sum ad + bc counts pieces of common size 1/(bd). Using the LCM instead of bd often reduces arithmetic. Keep the denominator fixed while adding the numerator counts, then simplify only after the operation. Adding denominators would change the size of the unit at the same time the count changes, so it cannot preserve either original fraction.",
      "Mixed numbers can be handled by combining whole and fractional parts or by converting to improper fractions. The best choice depends on the operation. For 2⅓ + 1¾, improper fractions and a common denominator produce 7/3 + 7/4 = 49/12 = 4 1/12. For subtraction requiring regrouping, converting to improper fractions often makes the borrowing step clearer. Estimate with benchmarks first so an answer outside the expected interval is caught.",
      "A complex fraction is one quotient whose numerator, denominator, or both contain fractions. The main fraction bar is a grouping symbol. One method is to simplify the complete numerator and complete denominator separately, then divide. Another is to multiply every term in both by the least common denominator of the small fractions. The multiplier must reach every term above and below the main bar; clearing only one part changes the value.",
      "Restrictions and signs remain active throughout. Every denominator in the original expression must be nonzero, even if a later simplification removes its visible factor. With numerical fractions, check by converting to decimals or by estimating against 0, 1/2, and 1. With complex fractions, substitute the simplified result back into the original numerical structure. These checks prepare the exact habits needed later for rational expressions.",
    ],
    method: {
      title: "Create common-sized parts before combining counts",
      steps: [
        "Estimate the result with benchmarks and record every denominator restriction.",
        "Find a useful common denominator and rewrite each fraction equivalently.",
        "Combine numerator counts while keeping the common unit unchanged.",
        "Simplify the result and interpret any mixed number or complex quotient.",
      ],
      check: "Convert the original and final values to a second exact or decimal form and confirm the result lies near the benchmark estimate.",
    },
    definitions: [
      ["least common denominator", "The least common multiple of the denominators used to create the smallest convenient common-sized unit.", "All original denominators must be nonzero."],
      ["main fraction bar", "The fraction bar that divides the complete numerator by the complete denominator in a complex fraction.", "It groups every term above and below it."],
    ],
    questions: [
      q("Compute 5/12 + 7/18 and explain the choice of denominator.", "29/36", "LCM(12,18) = 36. Rewrite 5/12 = 15/36 and 7/18 = 14/36, then add."),
      q("Compute 6⅓ − 2⅚ and check with a decimal estimate.", "3½", "Convert to sixths: 6 2/6 − 2 5/6 = 5 8/6 − 2 5/6 = 3 3/6 = 3½. The decimal difference 6.33… − 2.83… is 3.5."),
      q("Simplify (1/2 + 1/3)/(5/6 − 1/4).", "20/14 = 10/7", "The numerator is 5/6 and denominator is 7/12. Divide: (5/6)(12/7) = 10/7."),
      q("A student adds 2/5 + 3/7 as 5/12. Use unit fractions to explain the error and repair it.", "29/35", "Fifths and sevenths are different units. Rewrite as 14/35 + 15/35 = 29/35."),
    ],
    exampleNotes: [
      "The denominator records the part size; only numerator counts are combined after those sizes match.",
      "Improper fractions turn regrouping into ordinary integer arithmetic over one shared denominator.",
      "Treating the main fraction bar as grouping prevents terms in the numerator or denominator from being dropped.",
    ],
  }),
  "A0.7": lesson({
    exposition: [
      "Fractions, decimals, and percents are coordinate systems for the same value. A fraction emphasizes exact part-whole structure, a decimal emphasizes base-ten place value, and a percent compares with a standard whole of 100. Converting notation should not change the number. For example, 3/8 = 0.375 = 37.5%. A number-line check is useful: all three representations must land at the same point between 0 and 1.",
      "To convert a fraction to a decimal, divide numerator by denominator. A terminating decimal occurs when the simplified denominator contains only factors 2 and 5, because powers of ten contain only those primes. Other rational numbers produce repeating decimals. The bar or repeated block matters: 0.3 is not equal to 1/3, but 0.333… is. When an exact fraction is available, retain it through calculations and round only when the context requests an approximation.",
      "Percent means “per hundred.” Converting a decimal to a percent multiplies by 100 and attaches the percent unit; converting a percent to a decimal divides by 100. The movement of a decimal point is a consequence of this scaling, not a rule detached from meaning. A value may exceed 100% or be negative: 125% represents 1.25 times the reference amount, and −8% can represent an eight-percent change in the negative direction.",
      "Percent-of problems contain three roles: part, whole, and rate. The relationship part = rate·whole can be rearranged only after the roles are identified. In “18 is what percent of 60,” 18 is the part and 60 is the whole, so rate = 18/60 = 0.30 = 30%. In “45% of what number is 27,” 27 is the part and the whole is unknown. Labelling the roles prevents the common mistake of dividing in the wrong order.",
      "Choose a representation for the work it supports. Fractions preserve exact ratios and simplify multiplicative structure. Decimals align with money, measurement, and calculator input. Percents make comparisons with different-sized wholes easier. A final answer should name the reference whole and any rounding. Saying “the rate is 20%” is incomplete if it is unclear whether 20% describes a discount, tax, growth, or a share of which total.",
    ],
    method: {
      title: "Convert without changing the reference whole",
      steps: [
        "Identify the value and, for a percent, the reference whole.",
        "Use division for fraction-to-decimal, multiply by 100 for decimal-to-percent, and divide by 100 for percent-to-decimal.",
        "Keep exact fractions through intermediate work unless approximation is requested.",
        "Place the converted forms on one number line or substitute them into the same part-whole relationship.",
      ],
      check: "All representations must describe the same magnitude; for values between 0 and 1, the corresponding percent must lie between 0% and 100%.",
    },
    definitions: [
      ["terminating decimal", "A decimal representation with finitely many nonzero places.", "A simplified rational denominator terminates exactly when it has no prime factors other than 2 and 5."],
      ["repeating decimal", "A decimal with a digit block that repeats forever.", "It represents an exact rational number when the repeating pattern is indicated."],
    ],
    questions: [
      q("Convert 13/40 to a decimal and percent without rounding.", "0.325 and 32.5%", "Because 40·25 = 1,000, 13/40 = 325/1,000 = 0.325; multiply by 100 for 32.5%."),
      q("Explain why 5/12 repeats while 7/20 terminates.", "12 contains factor 3; 20 contains only factors 2 and 5", "In simplest form, a denominator must divide some power of 10 to terminate."),
      q("A jacket costs $72 after a 20% discount. Find the original price.", "$90", "The sale price is 80% of the original: 0.80w = 72, so w = 90."),
      q("A student converts 0.045 to 4.5% and then claims it is greater than 0.45. Diagnose the comparison.", "0.045 = 4.5% and 0.45 = 45%; therefore 0.045 < 0.45", "The percent conversion is correct, but the values must be compared in the same representation."),
    ],
    exampleNotes: [
      "The conversion is exact, so no rounding symbol is needed; the three forms name one point.",
      "The repeating block is part of the number’s notation and distinguishes an exact rational value from a rounded decimal.",
      "Identifying part, whole, and rate before calculating determines which quantity belongs in the denominator.",
    ],
  }),
  "A0.8": lesson({
    exposition: [
      "A ratio compares quantities multiplicatively. The ratio 3:5 says the first quantity is 3/5 of the second, not that their difference is 2. Equivalent ratios arise by scaling both quantities by the same nonzero factor, so they preserve a constant multiplicative relationship. A ratio table makes the scale factor visible and helps distinguish proportional change from a fixed additive change.",
      "A rate is a ratio of quantities with different units. Dividing by the second quantity creates a unit rate, such as 180 miles/3 hours = 60 miles per hour. The compound unit is part of the answer and determines how the rate can be used. Multiplying 60 miles/hour by 5 hours leaves miles; multiplying by 5 miles would not model time. Unit cancellation therefore acts as a structural check on proportional calculations.",
      "A proportion is an equation stating that two ratios are equal. Cross multiplication follows from multiplying both sides of a/b = c/d by the nonzero product bd, producing ad = bc. It is not a free-standing trick and is invalid when a denominator is zero. Often a scale-factor or unit-rate method is clearer than cross multiplication because it preserves the meaning of the quantities instead of compressing them immediately.",
      "Percent change compares a change with the original amount: (new − original)/original. The original value is the reference whole, even when the new value is more convenient. An increase from 80 to 100 is 20/80 = 25%, while a decrease from 100 back to 80 is −20/100 = −20%. The percentages differ because the reference wholes differ. A percentage-point change instead subtracts two percent rates directly.",
      "Proportional models must pass a constant-ratio test. If a table includes (2, 7), (4, 14), and (6, 20), the first two rows have output/input ratio 3.5 but the third does not, so the relationship is not proportional. A graph of a proportional relationship is a straight line through the origin. These tests prepare the transition from arithmetic rates to Algebra’s equations, tables, and graphs of linear relationships.",
    ],
    method: {
      title: "Preserve a constant multiplicative relationship",
      steps: [
        "Label both quantities and their units, then decide which comparison order the problem requests.",
        "Compute a unit rate or identify the scale factor connecting corresponding quantities.",
        "Write an equivalent ratio or proportion with matching quantity order.",
        "Solve and verify that the ratio and units remain constant.",
      ],
      check: "Divide corresponding quantities to confirm a constant ratio, and ensure the graph would pass through the origin when the relationship is proportional.",
    },
    definitions: [
      ["scale factor", "The multiplier that enlarges or shrinks corresponding quantities in equivalent ratios.", "The same nonzero factor must apply to both parts of the ratio."],
      ["percentage point", "The arithmetic difference between two rates already expressed as percents.", "It is not the same as percent change unless the reference rate is explicitly used."],
    ],
    questions: [
      q("A map uses 1.5 cm for 12 km. Find the unit scale in kilometers per centimeter and the map length for 50 km.", "8 km/cm; 6.25 cm", "12 ÷ 1.5 = 8 km/cm. Then 50 km ÷ 8 km/cm = 6.25 cm."),
      q("Determine whether (3, 7.5), (8, 20), and (12, 30) form a proportional relationship.", "Yes; constant ratio 2.5", "Each output divided by input equals 2.5."),
      q("A price rises from $64 to $80 and later falls to $64. Find both percent changes and explain why they differ.", "+25%; −20%", "The increase is 16/64 = 25%; the decrease is −16/80 = −20%. The reference originals differ."),
      q("Approval rises from 42% to 48%. State the percentage-point change and the percent change.", "6 percentage points; about 14.3% increase", "Subtract rates for 6 points. Relative change is (48 − 42)/42 ≈ 0.1429."),
    ],
    exampleNotes: [
      "Equivalent rows are produced by one scale factor, which is why both components must change together.",
      "The unit rate tells what one unit of input produces and makes prediction a multiplication rather than a guessing exercise.",
      "Percent change is asymmetric because the original amount—not the numerical difference—defines the reference whole.",
    ],
  }),
  "A0.9": lesson({
    exposition: [
      "A measurement is a number attached to a unit. The number 12 alone does not say whether a length is 12 centimeters, 12 meters, or 12 miles. Units behave like algebraic factors in multiplication and division. A conversion factor such as 100 cm/1 m equals 1 because 100 cm and 1 m name the same length. Multiplying by that form of 1 changes the unit label without changing the physical quantity.",
      "Dimensional analysis organizes conversions so unwanted units cancel. To convert 2.4 hours to seconds, write 2.4 h·60 min/1 h·60 s/1 min. Hours and minutes cancel, leaving 8,640 seconds. The orientation of each factor is chosen by cancellation, not memorized direction. If the unwanted unit remains or the desired unit cancels, the factor is upside down.",
      "Compound units reveal the operation a model requires. Speed measured in miles/hour multiplied by hours produces miles. Density measured in grams/cm³ multiplied by volume in cm³ produces grams. Adding quantities requires compatible dimensions: 3 meters + 40 centimeters is valid after conversion, but 3 meters + 40 seconds has no single physical meaning. An equation with incompatible dimensions cannot be repaired by arithmetic alone.",
      "Area and volume conversions require scaling every dimension. Since 1 m = 100 cm, one square meter is (100 cm)² = 10,000 cm², not 100 cm². One cubic meter is (100 cm)³. This is a frequent source of plausible-looking but severe scale errors. Write the unit power inside the conversion factor and raise the entire factor to the required power.",
      "Precision belongs to the measurement process. Exact conversion factors such as 1 foot = 12 inches do not add measurement certainty; measured inputs still limit reasonable reporting. Keep exact factors through the calculation and round once at the end according to the requested precision. A complete answer includes the unit, the rounding statement when applicable, and a magnitude check: converting meters to centimeters should increase the numerical count because centimeters are smaller units.",
    ],
    method: {
      title: "Build a conversion chain that proves its own units",
      steps: [
        "Write the starting value with its unit and the required ending unit.",
        "Multiply by conversion factors equal to 1, oriented so unwanted units cancel.",
        "Raise conversion factors to the same power as area or volume units.",
        "Multiply the numbers, retain the surviving unit, and round only at the requested stage.",
      ],
      check: "Read the uncancelled units before trusting the number, then predict whether the numerical magnitude should grow or shrink when the unit size changes.",
    },
    definitions: [
      ["dimension", "The physical kind of a quantity, such as length, time, mass, area, or volume.", "Only compatible dimensions may be added or equated."],
      ["conversion factor", "A ratio of equivalent measurements that equals 1 and changes unit representation.", "Its orientation must cancel the unwanted unit."],
    ],
    questions: [
      q("Convert 72 kilometers per hour to meters per second.", "20 m/s", "72 km/h·1,000 m/1 km·1 h/3,600 s = 20 m/s."),
      q("Convert 2.5 m² to cm² and explain why the factor is squared.", "25,000 cm²", "Use 2.5 m²(100 cm/1 m)² = 2.5·10,000 cm²."),
      q("A material has density 7.8 g/cm³ and volume 25 cm³. Find its mass and show the unit cancellation.", "195 g", "Multiply 7.8 g/cm³·25 cm³; cubic centimeters cancel, leaving 195 g."),
      q("A student converts 3 m³ to 300 cm³. Diagnose the scale error.", "3 m³ = 3,000,000 cm³", "The length factor 100 must be cubed: 3(100³) cm³."),
    ],
    exampleNotes: [
      "Each conversion factor equals 1, so the chain changes representation while preserving the measured quantity.",
      "The compound unit determines the multiplication: hours cancel and miles remain.",
      "The missing exponent on a unit conversion is a dimensional error, not merely an arithmetic slip.",
    ],
  }),
  "A0.10": lesson({
    exposition: [
      "An exponent records repeated multiplication of a base. For positive whole n, aⁿ contains n factors of a. This definition explains the product rule aᵐaⁿ = aᵐ⁺ⁿ: concatenating m factors with n factors produces m + n factors. It also explains (aᵐ)ⁿ = aᵐⁿ because n groups each contain m factors. Exponent rules apply to products with matching bases; they do not turn addition into multiplication, so 2³ + 2⁴ must be evaluated or factored rather than rewritten as 2⁷.",
      "Zero and negative exponents extend the same quotient pattern. For a ≠ 0, a³/a³ = 1, while the quotient rule gives a³⁻³ = a⁰, so a⁰ = 1. Continuing downward, a⁻² = 1/a². The nonzero restriction is essential because negative exponents require reciprocals and 0⁰ does not receive a universal elementary-algebra value. Write the restriction before simplifying expressions that may place a variable in a denominator.",
      "A square root reverses squaring, but the radical symbol √x names the principal nonnegative root. Thus √49 = 7, not ±7. The equation x² = 49 has two solutions, x = ±7, because both 7 and −7 square to 49. Keeping the radical expression and the equation separate prevents the common error of attaching ± to every radical or forgetting it when solving an even-power equation.",
      "Scientific notation writes a nonzero quantity as a·10ⁿ with 1 ≤ |a| < 10. The exponent records order of magnitude and the coefficient records significant leading digits. When multiplying, multiply coefficients and add powers of ten, then renormalize if the coefficient leaves the required interval. When adding, first express both values with the same power of ten; exponent rules do not combine unlike place-value units across addition.",
      "Reasonableness checks connect all three topics. A positive base greater than 1 grows with positive exponent and shrinks with negative exponent. A square root of a positive number lies between roots of nearby perfect squares. A scientific-notation product should have an exponent close to the sum of the input exponents, adjusted by at most the renormalization. These predictions catch misplaced exponents and misplaced decimal points before they propagate into later algebra.",
    ],
    method: {
      title: "Expose repeated-factor structure before using a rule",
      steps: [
        "Identify the base, exponent, and operation joining the powered expressions.",
        "Choose an exponent law only when its product, quotient, or power structure matches.",
        "Apply nonzero restrictions for zero or negative exponents and distinguish radicals from equations.",
        "Normalize scientific notation so the coefficient has magnitude at least 1 and less than 10.",
      ],
      check: "Expand a small case, estimate the order of magnitude, or raise the proposed root to the original power.",
    },
    definitions: [
      ["principal square root", "The nonnegative number whose square equals a given nonnegative radicand.", "The radical symbol √x denotes this single value."],
      ["order of magnitude", "The power of ten that describes a quantity’s approximate scale.", "Scientific notation separates this scale from the leading coefficient."],
    ],
    questions: [
      q("Simplify (3x²y⁻¹)² for nonzero y.", "9x⁴/y²", "Square each factor: 3²x⁴y⁻² = 9x⁴/y²."),
      q("Solve z² = 81 and explain why the answer differs from √81.", "z = ±9; √81 = 9", "An equation asks for every value whose square is 81, while the radical denotes the principal nonnegative root."),
      q("Compute (6.4·10⁻³)(2.5·10⁷) and write normalized scientific notation.", "1.6·10⁵", "Multiply coefficients to get 16 and add exponents to get 10⁴; renormalize 16·10⁴ as 1.6·10⁵."),
      q("A student simplifies 5² + 5³ as 5⁵. Factor the original sum to show the correct structure.", "5²(1 + 5) = 150", "Exponent addition applies to multiplication. Factoring the shared 5² gives 25·6."),
    ],
    exampleNotes: [
      "Expanding a small power shows exactly why exponents multiply when a power is raised to another power.",
      "The principal-root convention gives one value; the equation creates two candidates because both signs square to the radicand.",
      "Renormalization moves one factor of 10 from the coefficient into the exponent without changing the quantity.",
    ],
  }),
  "A1.1": lesson({
    exposition: [
      "A variable is a symbol assigned to a quantity, and the assignment is what gives the symbol meaning. The letter itself does not determine whether the quantity is fixed, changing, measured, counted, or chosen. In a taxi model C = 3 + 2m, C represents total cost in dollars and m represents miles traveled. The roles and units should be declared before any calculation. Without that declaration, the same equation could be manipulated correctly but interpreted as a claim about entirely different quantities.",
      "Some symbols vary while others act as parameters or constants. In A = lw, both l and w may vary from one rectangle to another. In y = mx + b, x and y are the changing input and output, while m and b may be fixed for one particular line. These roles are local to a model: m can be a fixed parameter in one problem and a variable in another. A quantity map or table helps by naming each symbol, its units, its allowed values, and what changes when another quantity changes.",
      "Independent and dependent variables describe a modeling choice, not an absolute property of a letter. If elapsed time is chosen and distance is observed, time is the input and distance depends on it. If a distance is chosen and the required travel time is calculated, the roles reverse. State the relationship in words before drawing arrows or axes. The phrase “cost depends on miles” supports C as output and m as input and places those variables consistently in a table or graph.",
      "A variable’s domain comes from both mathematics and context. A denominator cannot be zero, a square-root radicand may require nonnegative inputs in a real-number model, and a count of tickets may require whole numbers. A formula can be algebraically meaningful for more values than the situation allows. For a parking fee P = 5 + 3h, negative h may be valid as a symbolic input but invalid as elapsed parking time. Record contextual restrictions beside the formula rather than discovering them after an unreasonable answer appears.",
      "The central habit is to translate back and forth among words, tables, diagrams, and symbols. If the symbols disappear and the relationship cannot be stated in a sentence, the model is not yet understood. If the words are clear but no quantities have been defined, the model is not ready to calculate. A strong representation names inputs, outputs, units, and restrictions, then checks whether changing the input produces a sensible change in the output. This becomes the foundation for functions and formulas throughout the course.",
    ],
    method: {
      title: "Define every symbol before operating on it",
      steps: [
        "List the quantities in the situation and assign each symbol one meaning and unit.",
        "Identify which quantities are fixed, which may vary, and which depend on others.",
        "State the allowed values from mathematical and contextual restrictions.",
        "Represent the relationship in words, symbols, and at least one table, diagram, or graph.",
      ],
      check: "Replace every symbol with its declared phrase and confirm that the resulting sentence is meaningful, dimensionally consistent, and plausible.",
    },
    definitions: [
      ["parameter", "A quantity held fixed while a particular relationship or family member is studied.", "Its role can change when the modeling question changes."],
      ["domain", "The set of input values allowed by the mathematical expression and the context.", "Context may narrow a mathematically valid domain."],
    ],
    questions: [
      q("In V = 12 + 4t, V is water volume in liters and t is time in minutes. Identify the input, output, initial value, rate, units, and contextual domain.", "Input t; output V; initial 12 L; rate 4 L/min; t ≥ 0", "The model says volume begins at 12 liters and increases by 4 liters for each nonnegative minute."),
      q("A student says x is always independent because it is usually on the horizontal axis. Give a counterexample.", "For example, t = d/60 makes travel time t depend on chosen distance d", "Variable roles come from the modeled dependency, not from the letter used."),
      q("Create a four-row table for C = 3 + 2m using m = 0, 1, 2.5, 4, then describe what stays constant.", "C = 3, 5, 8, 11; the rate is $2 per mile and initial cost is $3", "Substitute each mileage. Equal mileage increases produce twice-as-large cost increases."),
      q("A theater model R = 18n gives revenue R from n tickets. Explain why n = 2.5 may be algebraically evaluable but contextually invalid.", "Tickets are counted, so n must be a nonnegative whole number", "The expression accepts real inputs, but the modeled object restricts the domain."),
    ],
    exampleNotes: [
      "The symbols become useful only after their quantity roles and units are declared.",
      "A table makes the dependency observable: equal input changes produce a consistent output pattern.",
      "Contextual restrictions remain part of the model even when the symbolic expression can accept more inputs.",
    ],
  }),
  "A1.2": lesson({
    exposition: [
      "Expressions, equations, and inequalities are different mathematical objects and therefore invite different questions. An expression such as 3x + 5 names a value that depends on x; it is not true or false by itself. An equation such as 3x + 5 = 20 claims that two expressions have equal values for certain inputs. An inequality such as 3x + 5 < 20 claims an order relationship. Classifying the object before calculating prevents the common mistake of trying to “solve” an expression or merely “evaluate” an equation without finding its truth set.",
      "Evaluation replaces variables with specified values and computes one resulting value. Simplification rewrites an expression into an equivalent form that agrees for every allowed input. Solving finds all inputs that make an equation or inequality true. These operations can appear together, but they are not interchangeable. For 2(x + 3), substituting x = 4 evaluates to 14; distributing gives the equivalent expression 2x + 6; solving 2(x + 3) = 14 produces x = 4.",
      "The equality sign means that the complete expression on the left has the same value as the complete expression on the right. It is not a signal that an answer comes next. Chains such as 3 + 4 = 7 = 5 + 2 are valid because every expression has value 7, while 3 + 4 = 7 + 5 = 12 is not: the middle equality makes a false claim. Read each equality as a complete sentence before extending a calculation.",
      "An inequality may have many solutions, and its direction records order. A value can be tested by substitution just as in an equation. The set of inputs satisfying x < 3 includes infinitely many real numbers, not just 2. When an inequality is transformed, operations that reverse order—most importantly multiplying or dividing by a negative number—require the symbol to reverse. This lesson focuses first on classification so later procedures are connected to the claim being preserved.",
      "Good mathematical writing announces the task. “Evaluate at x = −2,” “simplify,” “solve,” and “determine whether the statement is true” require different outputs. A complete answer preserves the object type: a simplified expression remains an expression, an equation solution is reported as a value or solution set, and an inequality solution is reported as a set or number-line region. If the final line changes object type without explanation, inspect where the mathematical question was lost.",
    ],
    method: {
      title: "Classify the object and the requested action",
      steps: [
        "Look for relation symbols such as =, <, >, ≤, or ≥ outside all grouping.",
        "Name the object as an expression, equation, or inequality.",
        "Identify whether the instruction asks for evaluation, simplification, solving, or truth testing.",
        "Produce an answer of the appropriate type and check it against the original object.",
      ],
      check: "Read the original and final lines as mathematical sentences and confirm that the requested action—not a different familiar action—was completed.",
    },
    definitions: [
      ["truth value", "Whether a mathematical statement is true or false for a specified input.", "Expressions alone do not have truth values."],
      ["solution set", "The complete set of inputs that make an equation or inequality true.", "A solution set may contain no values, one value, finitely many values, or infinitely many values."],
    ],
    questions: [
      q("For each object, name its type and a valid action: 4x − 9; 4x − 9 = 7; 4x − 9 ≥ 7.", "Expression—evaluate or simplify; equation—solve or test; inequality—solve or test", "The presence and kind of relation symbol determine the object."),
      q("Evaluate 2a² − 3a + 1 at a = −2, then distinguish this from solving 2a² − 3a + 1 = 15.", "Evaluation gives 15; solving asks for every a making the equation true", "Substitution at one supplied input is evaluation; an equation requires a complete solution set."),
      q("Explain why 5 + 7 = 12 + 3 = 15 is not a valid equality chain, then rewrite the work correctly.", "12 ≠ 15; write 5 + 7 + 3 = 12 + 3 = 15", "Every expression in an equality chain must have the same value."),
      q("A learner ‘solves’ 3x + 2 by writing x = −2/3. Identify the missing information.", "There is no relation or target value, so the expression cannot be solved", "3x + 2 can be evaluated or simplified, but a solution requires an equation or inequality."),
    ],
    exampleNotes: [
      "Classification determines the output: an expression is rewritten, while a statement is tested or solved.",
      "The same symbols support different actions only when the instruction and object make those actions meaningful.",
      "A correct final line answers the requested question and preserves the mathematical object’s role.",
    ],
  }),
  "A1.3": lesson({
    exposition: [
      "Algebraic structure is easiest to read from the outermost operation. In 4x² − 7x + 3, subtraction and addition separate three terms. Inside the term 4x², multiplication joins factors 4 and x². The number 4 is the coefficient, and 2 is the exponent on x. A symbol can play several descriptive roles at once, but the vocabulary depends on the operation being discussed: terms belong to sums, while factors belong to products.",
      "Grouping changes which operation is outermost. In 3(x + 5), the outer operation is multiplication by 3 and the grouped sum x + 5 is one factor. In 3x + 5, the outer operation is addition and the terms are 3x and 5. These expressions are not equivalent. Reading from the outside inward prevents accidental distribution, cancellation, or combination across a grouping boundary.",
      "A coefficient is the numerical factor multiplying a variable part. The coefficient of −x is −1, not 0 or an invisible minus instruction. Like terms have identical variable factors, including matching exponents. Thus 3x² and −5x² are like terms, while 3x² and 3x are not. Coefficients can be combined only because the distributive property gives 3x² − 5x² = (3 − 5)x².",
      "Factor structure matters in fractions. Cancellation is shorthand for dividing a complete numerator and denominator by a common nonzero factor. In x(x + 2)/x, x can cancel when x ≠ 0 because it multiplies the whole numerator. In (x + 2)/x, no x factor spans the sum x + 2. Mark terms and factors before cancelling; otherwise addition is silently changed into multiplication.",
      "A useful structural annotation is a small operation tree: write the outer operation at the top, then split into its operands, continuing until individual numbers and variables remain. This representation makes order of operations and equivalent rewrites visible. Later, factoring will reverse distribution by replacing a sum with a product, and solving will undo outer operations in reverse order. Learning to see the structure now reduces reliance on surface-level pattern matching.",
    ],
    method: {
      title: "Read every expression from the outside inward",
      steps: [
        "Identify the outermost operation not enclosed by grouping symbols.",
        "Use addition or subtraction to separate terms and multiplication or division to identify factors.",
        "Record coefficients, variable factors, exponents, and grouping boundaries.",
        "Choose a rewrite only when the complete structural unit required by the property is present.",
      ],
      check: "Build or describe an operation tree and verify that recombining its branches reproduces the original expression exactly.",
    },
    definitions: [
      ["variable factor", "The complete variable-and-exponent part of a term after its numerical coefficient is separated.", "Like terms must have identical variable factors."],
      ["outermost operation", "The final operation used to assemble an expression when grouping is respected.", "It determines the expression’s top-level structure."],
    ],
    questions: [
      q("Describe the terms, factors, coefficients, and outermost operation in −2x³ + 5x − 9.", "Terms −2x³, 5x, −9; coefficients −2 and 5; outermost structure is a sum", "Addition and subtraction separate terms; multiplication joins each coefficient to its variable factor."),
      q("Compare 4(x − 3)² and (4x − 3)² by describing their operation trees.", "They differ: the first squares x−3 then multiplies by 4; the second subtracts 3 from 4x then squares", "Grouping changes the branches below the outer operation."),
      q("Which pairs are like terms: 6ab², −3a²b, 5ab², 8ba²?", "6ab² and 5ab²; −3a²b and 8ba²", "Commutative order of factors does not matter, but the exponent attached to each variable must match."),
      q("Explain why x cannot be cancelled in (x + 7)/x, but can be cancelled in x(x + 7)/x for x ≠ 0.", "Cancellation requires a common factor of the complete numerator and denominator", "In the first numerator x is only one term; in the second it multiplies the entire numerator."),
    ],
    exampleNotes: [
      "Naming the outer operation first reveals the terms and prevents coefficients from being confused with exponents.",
      "Grouping changes the structure even when the same numbers and letters appear.",
      "Cancellation is justified by common factors, so term-factor vocabulary directly protects later rational work.",
    ],
  }),
  "A1.4": lesson({
    exposition: [
      "Substitution replaces one complete object with an equal object. If x = −3, every occurrence of x must be replaced by the grouped value (−3). Parentheses are especially important for negative or compound inputs: x² at x = −3 becomes (−3)² = 9, while −3² means −(3²) = −9 under standard precedence. The replacement does not change the expression’s structure; it supplies a value for a placeholder.",
      "Evaluation proceeds after all substitutions are visible. In 2x² − 5x + 1 at x = −3, write 2(−3)² − 5(−3) + 1 before computing. Then follow grouping and precedence: square, multiply, and combine. Skipping directly from the original expression to a number makes sign errors hard to locate. A clean substitution line acts as both reasoning and an audit trail.",
      "More than one variable requires a complete assignment. For A = lw, knowing l = 5 is not enough to produce a numerical area unless w is also known. Units travel with substituted values: if l = 5 cm and w = 3 cm, then A = (5 cm)(3 cm) = 15 cm². Carrying the units reveals whether a formula combines quantities in the intended way and whether the resulting dimension is correct.",
      "Function notation is another substitution instruction. f(4) means replace the input variable in the rule for f with 4; it does not mean f multiplied by 4. If f(x) = 3x − 2, then f(a + 1) = 3(a + 1) − 2, because the complete input a + 1 replaces x. Parentheses around a compound input preserve its grouping until distribution or another justified rewrite is performed.",
      "A reasonableness check uses the expression’s behavior. If 2x² is the dominant term and |x| is large, the output should usually be positive and large. If a formula represents area, the result should have square units and be nonnegative in its geometric domain. Re-evaluating with an alternate form of an equivalent expression offers a strong check: both forms must give the same value for every allowed input.",
    ],
    method: {
      title: "Replace, group, then evaluate",
      steps: [
        "Write the value assigned to every variable, including units and restrictions.",
        "Replace each variable occurrence with the complete assigned value in parentheses.",
        "Evaluate grouping, exponents, multiplication or division, then addition or subtraction.",
        "State the result with appropriate units and compare it with a structural estimate.",
      ],
      check: "Evaluate an equivalent form or repeat the substitution line-by-line and confirm that every variable occurrence was replaced exactly once.",
    },
    definitions: [
      ["input", "The value or complete expression substituted into a rule, formula, or function.", "Compound and negative inputs should be grouped with parentheses."],
      ["evaluation", "The process of finding an expression’s value for specified variable assignments.", "It does not change which assignments solve a separate equation."],
    ],
    questions: [
      q("Evaluate 3x² − 4x − 2 at x = −2, showing the substitution line.", "18", "Write 3(−2)² − 4(−2) − 2 = 12 + 8 − 2 = 18."),
      q("If g(t) = t² − 3t, find g(a + 2) and simplify.", "a² + a − 2", "Substitute the complete input: (a + 2)² − 3(a + 2) = a² + 4a + 4 − 3a − 6."),
      q("Use A = 1/2bh with b = 7.2 cm and h = 5 cm. Report the value and dimension.", "18 cm²", "A = 1/2(7.2 cm)(5 cm) = 18 cm²."),
      q("A student evaluates −x² at x = −4 as 16. Repair the substitution and explain the grouping.", "−16", "Write −(−4)². The exponent applies to the grouped input, then the leading negative is applied."),
    ],
    exampleNotes: [
      "Parentheses preserve a negative input as one object before the exponent is evaluated.",
      "A compound input replaces every occurrence of the original variable, not only the first visible symbol.",
      "Carrying units through substitution verifies both the number and the physical dimension.",
    ],
  }),
  "A1.5": lesson({
    exposition: [
      "Order of operations is a reading convention for expressions whose grouping is not fully written. Explicit grouping—parentheses, brackets, fraction bars, radicals, and exponent boundaries—comes first because it identifies complete objects. After grouping and exponents, multiplication and division are handled from left to right, followed by addition and subtraction from left to right. Multiplication is not universally before division, and addition is not universally before subtraction; each pair has equal precedence.",
      "The fraction bar groups its entire numerator and denominator. The expression (8 + 4)/(3 − 1) requires both grouped calculations before division. A radical bar similarly groups its radicand. Complex notation is safer when it is rewritten with visible parentheses before numerical work. This is also why calculator entry requires care: typing a numerator without grouping can ask the machine to evaluate a different expression.",
      "Exponents apply to the base immediately attached to them. In −3², the base is 3 and the leading negative is applied afterward, giving −9. In (−3)², the grouped base is −3, giving 9. In 2x², only x is squared; in (2x)² both factors are squared. Mark the base before calculating so the exponent does not spread across addition or an ungrouped coefficient.",
      "Equivalent rewrites can reduce complexity without violating precedence. The distributive property may replace 7(20 − 3) with 140 − 21, and fraction structure may permit simplification before multiplication. Each rewrite must preserve the complete grouped units. A good solution does not merely arrive at the correct number; it shows enough structure that another reader can distinguish a justified regrouping from an accidental reordering.",
      "A strong check compares two valid evaluation paths. Compute 6 + 3(8 − 5) directly, then distribute to obtain 6 + 24 − 15. Both should equal 15. If different paths disagree, locate the first line where grouping or precedence changed. This habit turns order of operations from a mnemonic into a consistency rule and prepares the same careful reading needed for nested algebraic expressions.",
    ],
    method: {
      title: "Make hidden grouping visible",
      steps: [
        "Mark parentheses, fraction bars, radical bars, and exponent bases as complete groups.",
        "Evaluate innermost groups and exponents.",
        "Perform multiplication and division from left to right.",
        "Perform addition and subtraction from left to right, recording each line.",
      ],
      check: "Evaluate an equivalent distributed or regrouped form and confirm that both valid paths produce the same value.",
    },
    definitions: [
      ["precedence", "The shared convention determining which ungrouped operations are evaluated first.", "Operations at the same level are performed from left to right."],
      ["exponent base", "The complete factor immediately raised to a power.", "Parentheses determine whether a sign, coefficient, or sum belongs to the base."],
    ],
    questions: [
      q("Evaluate 18 ÷ 3·2 + 4.", "16", "Division and multiplication share precedence and proceed left to right: 18 ÷ 3 = 6, 6·2 = 12, then add 4."),
      q("Evaluate [5 + 3(4 − 1)]²/7.", "28", "Inside: 4 − 1 = 3, then 5 + 9 = 14. Square to 196 and divide by 7."),
      q("Compare −2⁴, (−2)⁴, and −(2⁴).", "−16, 16, −16", "Only the parenthesized negative belongs to the base in (−2)⁴."),
      q("A calculator entry for (12 + 6)/(5 − 2) is typed as 12 + 6/5 − 2. Explain the changed structure and give both values.", "Intended 6; typed 11.2", "The missing grouping changes both the numerator and denominator into separate ungrouped terms."),
    ],
    exampleNotes: [
      "Equal-precedence operations are read left to right; the mnemonic must not reorder division and multiplication.",
      "The fraction bar groups two complete expressions, so numerator and denominator are evaluated separately first.",
      "A second valid evaluation path is an independent check on grouping and precedence.",
    ],
  }),
  "A1.6": lesson({
    exposition: [
      "Properties of operations are permissions for rewriting expressions without changing their values. The commutative property changes order in addition or multiplication, the associative property changes grouping within repeated addition or repeated multiplication, and the distributive property connects multiplication with a sum or difference. These are not vague statements that “anything can move.” Each property has a specific structural pattern and does not automatically apply to subtraction, division, or exponents.",
      "Commutativity says a + b = b + a and ab = ba. It allows factors or addends to be reordered, which is useful for placing coefficients together. Subtraction is not commutative because 8 − 3 ≠ 3 − 8, and division is not commutative because 8/4 ≠ 4/8. A minus sign can be handled by rewriting subtraction as addition of an opposite; then the addends may be reordered while their signs stay attached.",
      "Associativity says (a + b) + c = a + (b + c) and (ab)c = a(bc). It changes grouping, not order. This supports efficient mental work such as 25·(4·17) = (25·4)·17. Mixed operations are not associative: (12 ÷ 3) ÷ 2 and 12 ÷ (3 ÷ 2) differ. Keep the operation uniform before regrouping.",
      "Distribution states a(b + c) = ab + ac and reverses as ab + ac = a(b + c). Every term inside the group must receive the outside factor, including signs. The property explains mental arithmetic, combining like terms, factoring, and equation solving. It does not permit a power to distribute over addition: (a + b)² is generally not a² + b² because squaring means multiplying the entire sum by itself.",
      "Identity and inverse properties describe values that preserve or undo operations. Adding 0 and multiplying by 1 preserve a number. Adding −a gives 0, and multiplying a nonzero a by 1/a gives 1. A useful check names the property and reverses the rewrite. If distribution changes 4(x − 3) to 4x − 12, factoring 4 back out should recover the original grouped expression.",
    ],
    method: {
      title: "Match the exact structural pattern before rewriting",
      steps: [
        "Identify the operation and the complete operands or groups involved.",
        "Name the property whose pattern matches the expression.",
        "Apply the rewrite while keeping signs, terms, and factors attached.",
        "Reverse the property or substitute a simple value to confirm equivalence.",
      ],
      check: "If the named property cannot reproduce the original expression in reverse, the rewrite probably changed structure rather than merely its form.",
    },
    definitions: [
      ["identity element", "A value that leaves every allowed input unchanged under an operation.", "Zero is additive identity; one is multiplicative identity."],
      ["inverse element", "A value that combines with an input to produce the relevant identity.", "The multiplicative inverse 1/a exists only for a ≠ 0."],
    ],
    questions: [
      q("Rewrite 7 + (−12) + 3 efficiently and name each property used.", "−2", "Use commutativity to order 7 + 3 + (−12), then associativity to combine 10 − 12."),
      q("Use distribution to compute 98·37 mentally.", "3,626", "Rewrite 98 as 100 − 2: 37(100 − 2) = 3,700 − 74."),
      q("Explain why (x + 4)² ≠ x² + 16 in general by expanding the product.", "(x + 4)² = x² + 8x + 16", "The square is (x + 4)(x + 4); distribution produces two middle products."),
      q("A student changes 5(2x − 3) to 10x − 3. Name and repair the incomplete property use.", "10x − 15", "Distribution must multiply every term in the group by 5."),
    ],
    exampleNotes: [
      "Property names are useful because they state exactly why the value is preserved.",
      "Subtraction and division become safer when rewritten in terms of addition, multiplication, and explicit inverses.",
      "Reversing distribution by factoring provides a direct equivalence check.",
    ],
  }),
  "A1.7": lesson({
    exposition: [
      "Equivalent expressions produce the same value for every input in their shared domain. They may look different because one form emphasizes addition, another multiplication, and another a particular computational advantage. The claim 3(x + 2) = 3x + 6 is an identity: distribution proves the expressions agree for all real x. Testing a few values can disprove equivalence, but examples alone do not prove a universal claim.",
      "Like terms can be combined because they count identical algebraic units. Seven x² units minus three x² units leave four x² units: 7x² − 3x² = (7 − 3)x². Terms with different variable factors are different units and cannot be merged. The expression 4x + 4x² is like four meters plus four square meters; sharing a letter does not make the dimensions or factors identical.",
      "Simplification should expose structure, not automatically make an expression shorter. Distribution may be useful for combining terms, while factoring may be useful for revealing a common multiplier. For 5(x − 2) + 3x, distributing gives 5x − 10 + 3x = 8x − 10. In a different problem, 8x − 10 may be more useful as 2(4x − 5). Both are equivalent, and the goal determines the preferred form.",
      "Domain restrictions belong to equivalence. The expressions x/x and 1 agree only where x ≠ 0 because the original expression has no value at zero. Cancelling a factor does not restore excluded inputs. This distinction becomes essential with rational expressions, but it begins with the general rule that equivalent forms must be compared on their common allowed domain.",
      "There are three strong ways to justify equivalence: apply named reversible properties, compare both forms to a shared third form, or evaluate their difference and show it is identically zero. Numerical testing is a useful error detector. If two proposed forms disagree at even one allowed input, they are not equivalent. A clean simplification records distribution, sign handling, and term combination in separate steps so the first defect is easy to locate.",
    ],
    method: {
      title: "Preserve value while choosing a useful form",
      steps: [
        "Record the domain and identify grouped products and like-term families.",
        "Distribute only when it exposes terms that can be combined.",
        "Combine numerical coefficients only for identical variable factors.",
        "Factor or reorder when that form better supports the next mathematical task.",
      ],
      check: "Reverse the properties or test several allowed inputs, including 0, 1, and a negative value; any disagreement disproves equivalence.",
    },
    definitions: [
      ["identity", "An equation asserting that two expressions are equal for every input in their common domain.", "It differs from an equation true only for particular solutions."],
      ["simplified form", "An equivalent representation chosen to make a relevant structure or computation clearer.", "There is not always one uniquely simplest form."],
    ],
    questions: [
      q("Simplify 4(2x − 3) − 5(x + 1) + 2.", "3x − 15", "Distribute to get 8x − 12 − 5x − 5 + 2, then combine like terms."),
      q("Determine whether 2(x² + 3x) and 2x(x + 3) are equivalent and justify.", "Yes", "Factoring or distributing shows both equal 2x² + 6x for every real x."),
      q("Explain the domain qualification in (x² − 9)/(x − 3) = x + 3.", "They agree only for x ≠ 3", "Factoring gives (x−3)(x+3)/(x−3), but the original denominator excludes x = 3."),
      q("A student combines 5a²b + 3ab² as 8a²b². Use variable factors to repair the claim.", "The terms are unlike and cannot be combined", "a²b and ab² are different multiplicative units; no distributive combination of coefficients applies."),
    ],
    exampleNotes: [
      "Distribution and coefficient combination are separate justifications, which makes the simplification auditable.",
      "Equivalent forms can emphasize different structures; the best form depends on the next question.",
      "A single counterexample can reject equivalence, while a property-based derivation proves it over the shared domain.",
    ],
  }),
  "A1.8": lesson({
    exposition: [
      "A formula compresses a relationship among named quantities. Before substituting or rearranging, write what each symbol means, its unit, and any restriction. In d = rt, distance d, rate r, and time t are related by multiplication; the formula is not merely three slots. Reading the units—distance = distance/time·time—confirms the relationship and helps identify which operation will isolate an unknown.",
      "Solving a formula for a quantity uses the same equality-preserving operations as solving a numerical equation. To isolate t in d = rt, divide both sides by nonzero r to obtain t = d/r. The restriction r ≠ 0 is part of the rearrangement. When several terms contain the desired variable, factor it or combine terms before dividing. Every operation must apply to the complete side, not only to the nearest visible term.",
      "Units can detect a structurally wrong rearrangement. From A = 1/2bh, solving for h gives h = 2A/b. Area divided by length produces length, which matches height. The incorrect h = A/(2b) also has length units, so dimensions are necessary but not sufficient; substitution into the original formula supplies the final check. Good mathematical communication uses both the algebra and the unit analysis.",
      "Formulas often have contextual domains. In C = 2πr, radius r is positive in an ordinary circle model. In simple interest I = Prt, time and rate conventions must be stated, and a percent rate must be converted to a decimal before multiplication. A symbolic result may be algebraically valid while an input violates the situation. Record those restrictions in words rather than assuming the reader will infer them.",
      "A complete formula solution follows a readable narrative: define the unknown, write the relationship, rearrange symbolically, substitute values with units, compute, and interpret. Rearranging before substituting usually keeps structure visible and reduces repeated arithmetic. The closing statement should answer the context, not merely display a number. This disciplined sequence will carry directly into linear models, systems, geometry formulas, and scientific applications.",
    ],
    method: {
      title: "Treat a formula as a relationship, not a template",
      steps: [
        "Declare every quantity, unit, and contextual restriction.",
        "Identify the desired variable and the operations currently acting on it.",
        "Use equality-preserving operations to isolate it, recording nonzero divisors.",
        "Substitute grouped values, carry units, and interpret the result.",
      ],
      check: "Substitute the result into the original formula and verify both numerical equality and dimensional consistency.",
    },
    definitions: [
      ["literal equation", "An equation involving two or more named quantities, often used as a formula.", "Solving for one symbol expresses it in terms of the others."],
      ["dimensional consistency", "Agreement of physical dimensions on both sides of an equation.", "It can reject impossible formulas but cannot by itself prove a formula correct."],
    ],
    questions: [
      q("Solve V = πr²h for h and state the restrictions.", "h = V/(πr²), with r ≠ 0", "Divide both sides by πr². The divisor requires nonzero radius for this rearrangement."),
      q("Solve P = 2l + 2w for w, then find w when P = 34 cm and l = 6 cm.", "w = (P − 2l)/2; w = 11 cm", "Subtract 2l from both sides, divide by 2, then substitute the measured values."),
      q("Simple interest is I = Prt. Find r when I = $180, P = $1,500, and t = 3 years.", "r = 0.04 = 4% per year", "Rearrange r = I/(Pt), then compute 180/(1,500·3) = 0.04."),
      q("A student solves d = rt for r as r = t/d. Use units and substitution to repair the inversion.", "r = d/t", "Rate units are distance/time, not time/distance. Dividing both sides by t gives r = d/t."),
    ],
    exampleNotes: [
      "Symbolic rearrangement exposes the inverse operations before numerical values obscure the relationship.",
      "Units support the algebra by showing what kind of quantity the isolated expression must produce.",
      "Substitution into the original formula is the decisive check on both rearrangement and arithmetic.",
    ],
  }),
  "A2.1": lesson({
    exposition: [
      "A solution to an equation is an input that makes the original equality true. It is not simply the number appearing after the last algebraic step. To test x = 4 in 3x − 2 = 10, substitute into both sides: 3(4) − 2 = 10 and 10 = 10. The equality verifies the candidate. If the two sides differ, the candidate is not a solution, even if it emerged from familiar-looking manipulation.",
      "The solution set records every solution, not merely one example. An equation can have no solutions, one solution, several solutions, or infinitely many solutions. The equation x² = 9 has solution set {−3, 3}; x + 1 = x + 4 has the empty set; and 2(x + 1) = 2x + 2 is true for every real x. Reporting a complete set forces the solver to consider whether the method found all candidates and whether any candidate was invalid.",
      "Checking belongs in the original equation because transformations can change visible structure and some operations can create extra candidates. Squaring both sides, multiplying by an expression that may be zero, or clearing denominators can enlarge the candidate set. Even equality-preserving linear steps are vulnerable to copied signs or arithmetic errors. Substituting into the original statement tests both the algebra and every original restriction at once.",
      "An equation can also be understood as an intersection question. The solutions to f(x) = g(x) are the inputs where the graphs y = f(x) and y = g(x) have equal outputs. A table shows the same idea row by row. These representations do not replace symbolic proof, but they can predict the number and approximate location of solutions and reveal when a reported answer contradicts the visible relationship.",
      "A solution must answer the domain of the problem. If x counts students, a negative or fractional algebraic candidate may fail the context even if it satisfies a related symbolic equation. Distinguish equation restrictions from context restrictions: both matter, but they arise for different reasons. A complete check states the substitution, shows equality, confirms original-domain restrictions, and interprets the value in the situation.",
    ],
    method: {
      title: "Treat every final value as a candidate until checked",
      steps: [
        "Record the original equation and its mathematical and contextual domain.",
        "Find or test candidate values using symbolic, numerical, tabular, or graphical evidence.",
        "Substitute each candidate into both sides of the original equation.",
        "Report the complete solution set and interpret it within the context.",
      ],
      check: "A candidate is accepted only when both sides of the original equation evaluate to the same value and all original restrictions are satisfied.",
    },
    definitions: [
      ["candidate solution", "A value produced or suggested by a solving process before original-equation verification.", "Candidates may be rejected by substitution or domain restrictions."],
      ["extraneous solution", "A candidate introduced by a transformation that does not satisfy the original equation.", "It must be excluded from the final solution set."],
    ],
    questions: [
      q("Test x = −2 and x = 4 in x² − 2x = 8. Report the complete conclusion.", "Both are solutions; solution set {−2, 4}", "For −2, 4 + 4 = 8. For 4, 16 − 8 = 8."),
      q("Use a table of x = 0, 1, 2, 3 to identify which value solves 2x + 1 = 7.", "x = 3", "The left-side outputs are 1, 3, 5, 7; equality occurs at x = 3."),
      q("Explain why checking only the final equation x = 5 does not verify a multistep solution.", "It tests no original relationship", "The value must be substituted into the original equation, where copied signs, restrictions, and transformed structure are still present."),
      q("A model gives n = −3 for the number of packages. Separate the algebraic and contextual conclusions.", "It may solve the equation but is invalid as a package count", "Substitution determines algebraic validity; the nonnegative whole-number domain determines contextual validity."),
    ],
    exampleNotes: [
      "The substitution check converts a proposed value into a true-or-false statement in the original equation.",
      "A set notation answer communicates completeness, especially when more than one candidate is possible.",
      "Graphical intersection and symbolic substitution describe the same equality from different representations.",
    ],
  }),
  "A2.2": lesson({
    exposition: [
      "Solving an addition or subtraction equation means isolating the variable while preserving equality. The balance principle says that applying the same operation to both complete sides keeps equal quantities equal. In x + 7 = 19, subtracting 7 from both sides gives x = 12. The subtraction is chosen because it is the inverse of adding 7, not because a term ‘moves’ and changes sign. Writing both operations protects the meaning that every line has the same solution set.",
      "Subtraction attached to a variable can be rewritten as addition of an opposite. In x − 5 = 11, add 5 to both sides. In 8 − x = 3, the variable term is −x, not x. Subtracting 8 gives −x = −5, and multiplying both sides by −1 gives x = 5. Treating the coefficient of x as −1 prevents the common but unreliable habit of moving x across the equality sign without recording an operation.",
      "Variables may represent signed quantities, so the inverse operation must be applied accurately with negatives. For x + (−6) = −14, adding 6 to both sides gives x = −8. A number line can verify the result: starting at −8 and applying a change of −6 reaches −14. The visual and symbolic methods agree because both preserve the same signed relationship.",
      "Efficient solving does not mean skipping justification. Some equations can be read as missing-addend questions, while others are clearer with balance operations. A mental solution is acceptable when the equality check is shown. The important evidence is that the same value replaces x on both sides and makes the original statement true. Long notation is unnecessary, but invisible transformations are difficult to audit and easy to reverse incorrectly.",
      "A one-step equation is the smallest model of the full solving process: identify the operation acting on the variable, use its inverse on both sides, simplify, and check. Later equations add distribution, like terms, and variables on both sides, but the equality principle does not change. Building a precise one-step habit now prevents ‘sign teleportation’ from becoming a source of errors in longer work.",
    ],
    method: {
      title: "Undo one additive change on both sides",
      steps: [
        "Rewrite subtraction as addition of an opposite when that makes the variable term clearer.",
        "Identify the number added to the variable term.",
        "Add its opposite to both complete sides of the equation.",
        "Simplify and substitute the result into the original equation.",
      ],
      check: "The left and right sides of the original equation must evaluate to the same number after substitution.",
    },
    definitions: [
      ["additive inverse", "The number that combines with a value to produce 0.", "The additive inverse of a is −a."],
      ["balance operation", "An operation applied to both sides of an equation to preserve equality.", "It must be defined for the quantities involved."],
    ],
    questions: [
      q("Solve x − 18 = −27 and verify.", "x = −9", "Add 18 to both sides: x = −9. Check −9 − 18 = −27."),
      q("Solve 14 − y = −5 without moving terms across the equality sign.", "y = 19", "Subtract 14 from both sides to get −y = −19, then multiply both sides by −1."),
      q("A temperature T plus a change of −11°C equals −4°C. Find the starting temperature and interpret.", "T = 7°C", "T − 11 = −4; add 11 to both sides to obtain 7."),
      q("A student solves x + 9 = 2 by adding 9 to both sides. Explain the inverse-operation error.", "x = −7", "Adding 9 is undone by subtracting 9, so x = 2 − 9 = −7."),
    ],
    exampleNotes: [
      "The balance step is visible on both sides, so the sign change is justified rather than memorized.",
      "Recognizing −x as a term with coefficient −1 keeps subtraction structure intact.",
      "The original-equation check turns the final value back into a true equality.",
    ],
  }),
  "A2.3": lesson({
    exposition: [
      "In ax = b, multiplication by coefficient a is undone by division by a, provided a ≠ 0. Dividing both sides by the same nonzero number preserves equality and gives x = b/a. The nonzero condition is not optional: division by zero has no real-number value. Write the coefficient, including its sign, as part of the variable term. For −4x = 20, divide by −4 to obtain x = −5.",
      "A fraction coefficient can be undone by multiplying by its reciprocal. In (3/5)x = 12, multiply both sides by 5/3 to produce x = 20. This is the same operation as dividing by 3/5, expressed in a form that cancels visibly. The coefficient must be nonzero, and the reciprocal must multiply the entire side. Estimating the scale helps: if three-fifths of x is 12, x should be larger than 12.",
      "Division equations can be rewritten as multiplication equations. In x/7 = −3, multiply both sides by 7 to obtain x = −21. In 7/x = −3, however, x is in the denominator and the equation is not a one-step linear equation of the same form; multiplying by x creates a restriction x ≠ 0 and requires later checking. Reading factor and denominator structure prevents different equation types from being treated as identical.",
      "The coefficient zero creates a classification problem rather than a division step. The equation 0x = 0 is true for every real x, while 0x = 5 is false for every real x. Dividing by zero would hide this distinction. Before dividing, inspect the coefficient. This early habit prepares the learner to classify equations whose variables later cancel.",
      "Units can clarify multiplicative equations. If 6 tickets cost $54 at a constant price p, then 6p = $54 and p = $9 per ticket. Dividing dollars by tickets produces dollars per ticket. Substitute the result into the original model and confirm both number and units. A coefficient is often a count, rate, or scale factor, and interpreting it makes the inverse operation more than symbol movement.",
    ],
    method: {
      title: "Undo a nonzero scale factor",
      steps: [
        "Identify the complete coefficient multiplying the variable, including sign and units.",
        "Confirm the coefficient is nonzero.",
        "Divide both sides by the coefficient or multiply by its reciprocal.",
        "Simplify, interpret units, and check in the original equation.",
      ],
      check: "Multiply the proposed value by the original coefficient and confirm that it reproduces the original right side exactly.",
    },
    definitions: [
      ["coefficient equation", "An equation of the form ax = b in which a scales the unknown.", "When a ≠ 0, the unique solution is x = b/a."],
      ["zero coefficient", "A coefficient equal to 0, making the variable term 0 for every input.", "The equation must be classified as always true or always false rather than divided by zero."],
    ],
    questions: [
      q("Solve −7x = 35 and check the sign before calculating.", "x = −5", "A negative coefficient times a positive x would be negative, so x must be negative. Divide both sides by −7."),
      q("Solve (−4/9)y = 14.", "y = −63/2", "Multiply both sides by the reciprocal −9/4: y = 14(−9/4) = −63/2."),
      q("Classify 0z = 0 and 0z = −8.", "All real z; no solution", "The left side is always 0. It equals 0 for every input and never equals −8."),
      q("Five equal containers hold 17.5 liters total. Write and solve a coefficient equation with units.", "5v = 17.5 L; v = 3.5 L per container", "Divide total volume by five containers and verify 5·3.5 = 17.5."),
    ],
    exampleNotes: [
      "Dividing by the full signed coefficient isolates the variable in one equality-preserving step.",
      "The reciprocal is justified because its product with a nonzero fraction coefficient is 1.",
      "Inspecting a zero coefficient prevents a forbidden division from erasing the equation’s true classification.",
    ],
  }),
  "A2.4": lesson({
    exposition: [
      "An equation may contain unnecessary complexity on one or both sides. Simplifying each side first can expose the actual balance structure. Distribution removes grouped multiplication, and like terms combine repeated algebraic units. In 3(x + 4) − 2x = 17, distribution gives 3x + 12 − 2x = 17, then like terms give x + 12 = 17. Only after the sides are simplified does the one-step balance become obvious.",
      "Distribution must reach every term in a group, and a negative factor changes every sign. The expression −2(3x − 5) becomes −6x + 10. A common error changes only the first term or forgets that subtracting a group multiplies the entire group by −1. Rewriting −(x − 4) as (−1)(x − 4) makes the operation visible.",
      "Like terms are combined within a side, not across the equality sign. The equation 4x + 3 + 2x = 21 becomes 6x + 3 = 21 because 4x and 2x are like terms. The constant 3 remains separate. Moving 3 to the other side is shorthand for subtracting 3 from both sides; keeping simplification and balance operations on separate lines makes each justification clear.",
      "Different valid simplification orders should agree. One solver may distribute first, while another may divide a common factor from both sides. Efficiency is welcome when the operation applies to every term. For 6x + 12 = 30, dividing both sides by 6 gives x + 2 = 5. Dividing only 6x by 6 would change the left side. A horizontal fraction bar around the entire side can make term-by-term division explicit.",
      "The original equation remains the final authority. A simplification error can produce a value that correctly solves the wrong simplified equation. Substitution into the original grouped form tests distribution, signs, term combination, and balance operations together. Estimate where possible: if 3(x + 4) − 2x = x + 12, a right side of 17 suggests x near 5 before formal solving begins.",
    ],
    method: {
      title: "Simplify each side, then solve the exposed equation",
      steps: [
        "Distribute every outside factor across every term in its group.",
        "Combine like terms separately on the left and right sides.",
        "Use balance operations to isolate the remaining variable term.",
        "Substitute into the original grouped equation, not only the simplified form.",
      ],
      check: "Simplify the original equation by a second valid route or substitute the result into its unsimplified sides and compare exact values.",
    },
    definitions: [
      ["simplify within a side", "Use equivalent-expression properties without changing which quantities are on each side of an equation.", "It is distinct from applying a balance operation to both sides."],
      ["equivalent equation", "An equation with exactly the same solution set as another equation.", "Every reversible balance step preserves equivalence."],
    ],
    questions: [
      q("Solve 5(2x − 3) − 4x = 27.", "x = 7", "Distribute: 10x − 15 − 4x = 27. Combine: 6x − 15 = 27. Add 15 and divide by 6."),
      q("Solve −3(2y + 1) + 5y = 9.", "y = −12", "Distribute to −6y − 3 + 5y = 9, so −y − 3 = 9 and y = −12."),
      q("Solve 4(3x + 6) = 8x + 40 using an efficient first move.", "x = 4", "Divide both sides by 4 to get 3x + 6 = 2x + 10, then subtract 2x and 6."),
      q("A student simplifies 2(x + 5) − 3x as −x + 5. Locate and repair the first error.", "−x + 10", "Distribution gives 2x + 10 − 3x; the constant 5 must also be multiplied by 2."),
    ],
    exampleNotes: [
      "Simplification reveals the one-step equation hidden inside the original grouped form.",
      "Separating distribution, like-term collection, and balance operations makes every justification inspectable.",
      "Checking in the original form detects mistakes that a transformed equation can no longer reveal.",
    ],
  }),
  "A2.5": lesson({
    exposition: [
      "A multistep linear equation is solved by reversing its construction while preserving equality. Before acting, scan the equation for grouping, like terms, fractions, and variables on both sides. Simplify within each side, then choose balance operations that reduce complexity. A fixed slogan such as “always move constants first” is less reliable than reading the actual structure.",
      "The order of inverse operations is usually the reverse of the operations building the variable expression. In 4x − 7 = 29, x is multiplied by 4 and then 7 is subtracted, so add 7 before dividing by 4. In 4(x − 7) = 28, the grouped expression is multiplied by 4, so dividing by 4 first exposes x − 7. The same numbers require different first moves because their grouping differs.",
      "Fractions can sometimes be cleared early, and common factors can sometimes be divided out. Efficiency is valid only when the chosen operation reaches every term on both sides. In 6x + 12 = 30, division by 6 is efficient because each term is divisible by 6. In 6x + 11 = 30, dividing only selected terms would not preserve equality, so additive isolation is clearer.",
      "Every line should be an equivalent equation. This creates an operation history that can be read forward as solving and backward as checking. If 5x + 8 = 3x + 26 becomes 2x + 8 = 26 after subtracting 3x from both sides, the solution set is unchanged. Recording the operation beside the line prevents sign changes from appearing without mathematical cause.",
      "The final answer is not complete until it is checked in the original equation and interpreted when units or context are present. Estimate the likely scale before solving, especially in models. If five identical monthly payments plus an $8 fee total $38, the payment must be somewhat less than $8. A result of $46 should be rejected before substitution because it conflicts with the relationship’s scale.",
    ],
    method: {
      title: "Scan, simplify, isolate, and verify",
      steps: [
        "Scan for grouping, like terms, denominators, and variables on both sides.",
        "Simplify within each side without changing the balance.",
        "Use efficient inverse operations on both sides to isolate the variable term.",
        "Undo the final nonzero coefficient and check the original equation.",
      ],
      check: "Keep an operation history, then substitute the result into the original unsimplified equation and verify equal side values.",
    },
    definitions: [
      ["operation history", "A sequence recording the equality-preserving operation used to create each equivalent equation.", "It should be reversible line by line."],
      ["isolation", "Rewriting an equation so the target variable appears alone on one side.", "The resulting equation must preserve the original solution set."],
    ],
    questions: [
      q("Solve 7x − 9 = 4x + 24 and verify.", "x = 11", "Subtract 4x, add 9, and divide by 3. Check 77 − 9 = 44 + 24 = 68."),
      q("Solve 3(2x − 5) + 4 = 25.", "x = 6", "Distribute and simplify: 6x − 15 + 4 = 25, so 6x − 11 = 25, 6x = 36."),
      q("Solve 8(x + 3) = 4(3x − 1) by choosing an efficient simplification path.", "x = 7", "Expand to 8x + 24 = 12x − 4, then collect terms to get 28 = 4x."),
      q("A service charges $14 plus $6 per month. The total is $68. Define the variable, solve, and interpret.", "9 months", "Let m be months. Solve 14 + 6m = 68: 6m = 54, so m = 9."),
    ],
    exampleNotes: [
      "The first move is chosen from the equation’s structure, not from a universal sign-moving rule.",
      "Each line preserves the same solution set, so the operation history is a proof rather than a recipe.",
      "A contextual estimate narrows the plausible result before exact solving begins.",
    ],
  }),
  "A2.6": lesson({
    exposition: [
      "Fractions and decimals do not change the logic of a linear equation, but they can hide its structure. A common first move is to multiply every term on both sides by a useful nonzero factor. For fractional coefficients, the least common denominator clears all denominators. For terminating decimals, a power of ten can produce whole-number coefficients. This is an equality-preserving scale operation, not a deletion of fraction bars or decimal points.",
      "The multiplier must reach every term. In x/3 + 1/4 = 5/6, multiplying by 12 gives 4x + 3 = 10. Omitting the 1/4 term would change the equation. Writing parentheses around each side—12(x/3 + 1/4) = 12(5/6)—makes distribution explicit. Original denominator restrictions remain active even after the visible denominators disappear.",
      "Decimals can be kept exactly. Multiplying 0.4x − 1.25 = 2.75 by 100 produces 40x − 125 = 275, but multiplying by 20 would also work and may create smaller numbers. Alternatively, solving directly with decimals is valid if place value is handled accurately. Choose the path that minimizes arithmetic risk and keep full precision until the end.",
      "A fraction in a model often carries units. If 3/4 hour at rate r produces 42 miles, then (3/4 h)r = 42 mi and r has units miles/hour. Multiplying both sides by 4/3 isolates r and cancels hours appropriately. Unit analysis helps distinguish a coefficient from a constant and catches inverted rates.",
      "Check in the original fractional or decimal equation, not only the cleared version. Clearing denominators can magnify an arithmetic slip, and rounded intermediate values can make a false equality appear close. Use exact fractions whenever possible, show the common multiplier, retain original restrictions, and substitute the exact result back before converting to a requested decimal approximation.",
    ],
    method: {
      title: "Clear number formats without changing the equation",
      steps: [
        "Record denominator restrictions and identify the least useful common multiplier.",
        "Multiply every term on both sides by that nonzero factor.",
        "Solve the resulting equivalent equation with visible balance steps.",
        "Check the exact result in the original fractional or decimal equation.",
      ],
      check: "Substitution into the original form must produce exact equality before any requested rounding is applied.",
    },
    definitions: [
      ["clear denominators", "Multiply every term in an equation by a common nonzero multiple of its denominators.", "Original denominator restrictions remain in force."],
      ["exact decimal", "A terminating decimal used as its precise base-ten rational value rather than a rounded approximation.", "Avoid unnecessary rounding during solving."],
    ],
    questions: [
      q("Solve x/4 − x/6 = 5/3.", "x = 20", "Multiply every term by 12: 3x − 2x = 20."),
      q("Solve 0.35x + 1.2 = 4.7 using a whole-number equivalent equation.", "x = 10", "Multiply by 100: 35x + 120 = 470, so 35x = 350."),
      q("Solve (2/5)(x − 3) = 6 and compare clearing fractions with using a reciprocal.", "x = 18", "Multiply by 5/2 to get x − 3 = 15, then add 3. Multiplying first by 5 also leads to 2(x−3)=30."),
      q("A student multiplies x/3 + 2 = 7/6 by 6 and writes 2x + 2 = 7. Repair the distribution.", "2x + 12 = 7, so x = −5/2", "The factor 6 multiplies the whole-number term 2 as well as the fractions."),
    ],
    exampleNotes: [
      "The least common denominator removes every fraction in one reversible scaling step.",
      "A power of ten is a convenience; the decimal equation remains exact before and after scaling.",
      "Checking the original form verifies the multiplier distribution and any denominator restrictions.",
    ],
  }),
  "A2.7": lesson({
    exposition: [
      "When a variable appears on both sides, the goal is to collect all variable terms on one side and constants on the other. Subtracting the same variable term from both sides preserves equality just as subtracting a number does. In 5x + 4 = 2x + 19, subtract 2x from both sides to obtain 3x + 4 = 19. The variable has not ‘moved’; equal variable quantities were removed from both sides.",
      "Either side may be chosen, but collecting the variable where its coefficient becomes positive often reduces sign errors. For 3x − 7 = 8x + 13, subtracting 3x gives −7 = 5x + 13 and then −20 = 5x. Subtracting 8x instead is also valid but produces −5x − 7 = 13. Both paths must lead to x = −4. Comparing them demonstrates that method choice affects convenience, not the solution set.",
      "Simplify each side before collecting across the equation. Distribution and like terms can reveal that apparent variable terms cancel. For 2(x + 3) = 2x + 6, simplification gives 2x + 6 = 2x + 6. Subtracting 2x leaves 6 = 6, a true statement indicating infinitely many solutions. If the remaining statement were false, there would be no solution.",
      "Coefficient comparison can predict the likely classification. In ax + b = cx + d, unequal coefficients a and c usually produce one solution because a − c remains nonzero. Equal variable coefficients cause the variable to cancel, leaving a comparison of constants. Equal constants yield an identity; unequal constants yield a contradiction. This prediction helps a solver interpret cancellation rather than panic when x disappears.",
      "The original-equation check remains important. Substitute a one-solution result into both original sides. For identity or contradiction cases, explain why the simplified statement is always true or always false across the domain. A complete answer reports {x}, ∅, or the appropriate full domain—not merely the last constant statement.",
    ],
    method: {
      title: "Collect variable quantities with visible balance steps",
      steps: [
        "Distribute and combine like terms separately within each side.",
        "Subtract one variable term from both sides, preferably leaving a convenient coefficient.",
        "Collect constants with an additive inverse and isolate the variable.",
        "If the variable cancels, classify the remaining statement as true or false.",
      ],
      check: "Substitute a unique solution into both original sides, or justify why the original equation is always true or always false.",
    },
    definitions: [
      ["variable cancellation", "Removal of equal variable terms from both sides through a balance operation.", "It signals that classification depends on the remaining constant statement."],
      ["contradiction", "A statement such as 4 = 9 that is false for every input.", "An equation simplifying to a contradiction has no solution."],
    ],
    questions: [
      q("Solve 9x − 14 = 5x + 18.", "x = 8", "Subtract 5x, add 14, and divide by 4."),
      q("Solve 4 − 3x = 7x + 24 using a path that leaves a positive coefficient.", "x = −2", "Add 3x to both sides: 4 = 10x + 24. Subtract 24 and divide by 10."),
      q("Classify 6(x − 2) + 5 = 6x − 7.", "Infinitely many solutions", "The left simplifies to 6x − 12 + 5 = 6x − 7, identical to the right."),
      q("A student reaches 0x = 12 and divides by 0 to get x = 0. Repair the classification.", "No solution", "0x is always 0, so 0 = 12 is a contradiction; division by zero is not permitted."),
    ],
    exampleNotes: [
      "Subtracting equal variable quantities from both sides preserves the balance and explains the apparent movement.",
      "Choosing the subtraction direction can keep the remaining coefficient positive without changing correctness.",
      "When the variable cancels, the constant statement—not a guessed value—determines the solution classification.",
    ],
  }),
  "A2.8": lesson({
    exposition: [
      "A linear equation’s solution count is determined by what remains after equivalent simplification. If a nonzero variable coefficient remains, the equation has one solution. If variable terms cancel and leave a false constant statement, there is no solution. If they cancel and leave a true statement, every value in the original domain is a solution. These are not three unrelated cases; they are the possible outcomes of comparing two linear expressions.",
      "For ax + b = cx + d, subtracting cx and b gives (a − c)x = d − b. When a − c ≠ 0, division gives one solution. When a = c, the left coefficient is zero. Then b = d produces a true identity and b ≠ d produces a contradiction. This coefficient view allows the classification to be predicted before carrying out every line.",
      "Graphically, one solution corresponds to two distinct nonparallel lines intersecting once. No solution corresponds to distinct parallel lines with equal slopes and different intercepts. Infinitely many solutions correspond to the same line written in equivalent forms. This visual model is useful, but the equation’s domain still matters: restrictions can remove points even when simplified expressions appear identical.",
      "The phrase “x cancels” is not an answer. Cancellation is an event that tells the solver to inspect the remaining statement. From 4x + 7 = 4x + 7, subtraction leaves 7 = 7, so all real values work. From 4x + 7 = 4x − 2, it leaves 7 = −2, so none work. Inventing x = 0 or stopping at the constant statement fails to report the solution set.",
      "Parameters can change classification. The equation kx + 3 = 5x + 3 has infinitely many solutions when k = 5 and one solution when k ≠ 5. There is no parameter value giving no solution because the constants match. Reasoning about coefficients develops a flexible understanding that later supports systems, function intersections, and identity verification.",
    ],
    method: {
      title: "Let the remaining statement classify the equation",
      steps: [
        "Simplify both sides completely and compare variable coefficients.",
        "Collect variable terms with a balance operation.",
        "If a nonzero coefficient remains, solve for the unique value.",
        "If the variable disappears, classify the constant statement as true or false and report the full set.",
      ],
      check: "Verify one-solution candidates by substitution; verify identity or contradiction claims from the simplified forms and original domain.",
    },
    definitions: [
      ["identity equation", "An equation true for every value in its stated domain.", "Equivalent expressions on both sides produce infinitely many solutions."],
      ["conditional equation", "An equation true only for particular values of its variable.", "A nonzero remaining linear coefficient produces one solution."],
    ],
    questions: [
      q("Classify 3(2x + 5) − x = 5x + 15.", "Infinitely many solutions", "The left simplifies to 6x + 15 − x = 5x + 15, identical to the right."),
      q("Classify 7(x − 2) + 4 = 7x − 6.", "No solution", "The left is 7x − 10, so cancellation leaves −10 = −6, a contradiction."),
      q("Find p so px + 8 = 4x + 8 has infinitely many solutions, and describe other p.", "p = 4; for p ≠ 4 there is one solution x = 0", "Matching both coefficient and constant creates an identity; otherwise (p−4)x = 0 has x = 0."),
      q("A student says parallel lines mean an equation has no solution. State the missing qualification.", "Distinct parallel lines have no intersection; coincident lines have infinitely many", "Equal slopes alone are not enough—the intercepts determine whether the lines are distinct or identical."),
    ],
    exampleNotes: [
      "The variable coefficient outcome predicts whether isolation, contradiction, or identity will remain.",
      "The graph interpretation matches the symbolic classification through line intersections.",
      "Parameter reasoning shows that solution count is a structural feature, not a label attached after calculation.",
    ],
  }),
  "A2.9": lesson({
    exposition: [
      "Translating a one-variable model begins with quantities, not keywords. Define the unknown in a complete sentence with units, identify known values, and state the relationship in ordinary language. Then write an equation whose units agree. In a taxi model with a $4 starting charge and $2.50 per mile totaling $21.50, let m be miles and write 4 + 2.50m = 21.50. The constant and rate have different roles even though both are dollar amounts after multiplication.",
      "Additive relationships describe a starting amount plus or minus change. Multiplicative relationships describe equal groups, scaling, or a rate applied to an input. Words such as “more than” and “less than” are unreliable when isolated from sentence structure. “Five less than x” is x − 5, while “x is five less than y” becomes x = y − 5. Reading the complete relationship prevents reversal errors.",
      "Consecutive-number models use structure rather than separate unknowns. If n is the first consecutive integer, the next is n + 1; consecutive odd integers differ by 2. Geometry models require formulas and unit restrictions. A rectangle with width w and length w + 3 has perimeter 2w + 2(w + 3). Drawing and labeling the shape before writing the equation often exposes missing doubled sides.",
      "A model’s domain can reject an algebraic solution. Counts may require nonnegative whole numbers, lengths must be positive, and elapsed time is usually nonnegative. Rounding must match the question: a bus count may need rounding up even if the equation produces 4.2, while a measured length may be reported to a requested decimal place. State the domain before solving so the interpretation is not improvised afterward.",
      "Validation uses both substitution and the original story. Substitute into the equation, then reconstruct the quantities described. If m = 7 miles in the taxi model, the variable charge is $17.50 and the total is $21.50. This narrative check catches equations that were solved correctly but translated backward. A final answer includes the value, units, and a sentence answering the original question.",
    ],
    method: {
      title: "Define, relate, solve, and interpret",
      steps: [
        "Define one unknown quantity with its units and contextual domain.",
        "Express every other quantity in terms of that unknown.",
        "Write an equation from the complete relationship and verify its units.",
        "Solve, substitute into the model, and answer the original question in a sentence.",
      ],
      check: "Reconstruct every quantity in the story from the proposed value and confirm the totals, units, and domain all agree.",
    },
    definitions: [
      ["variable definition", "A sentence assigning a symbol to one unknown quantity with units.", "It should be written before the equation."],
      ["contextual domain", "The set of values meaningful for the modeled quantity.", "It may require positivity, whole numbers, or other real-world conditions."],
    ],
    questions: [
      q("A gym charges $35 to join and $18 per month. The total paid is $197. Define a variable and find the number of months.", "9 months", "Let m be months. Solve 35 + 18m = 197: 18m = 162, so m = 9."),
      q("The length of a rectangle is 5 cm more than its width and its perimeter is 46 cm. Find both dimensions.", "Width 9 cm; length 14 cm", "Let width be w. Solve 2w + 2(w + 5) = 46, so 4w = 36."),
      q("Three consecutive odd integers have sum 93. Find them.", "29, 31, 33", "Let the first be n. Solve n + (n + 2) + (n + 4) = 93, giving n = 29."),
      q("A van holds 12 people. An equation gives 4.25 vans for 51 people. Interpret the domain and rounding.", "5 vans are required", "A fractional van is not usable, and capacity requires rounding up to cover all people."),
    ],
    exampleNotes: [
      "Defining the variable first fixes the meaning of the coefficient and constant in the model.",
      "A labeled diagram or quantity list protects against reversed comparisons and missing repeated dimensions.",
      "The contextual check is independent of symbolic correctness and can reject an otherwise valid algebraic value.",
    ],
  }),
  "A2.10": lesson({
    exposition: [
      "A strategy studio is about choosing, not merely executing, a method. Begin by scanning the equation’s architecture: grouping, denominators, decimals, like terms, variables on both sides, and contextual restrictions. The most efficient first step reduces complexity while preserving equality. Two equations containing the same symbols can require different choices because grouping and coefficient structure differ.",
      "Simplify before balancing when distribution or like terms obscure the variable terms. Clear fractions when one common multiplier removes several denominators cleanly. Divide a common nonzero factor from both sides when every term shares it. Collect variables where the remaining coefficient is convenient. These are options, not a mandatory order. The governing question is: which reversible step makes the equation easier to read without losing a term or restriction?",
      "Classification should be anticipated. Compare variable coefficients after simplification. If they are equal, expect the variable to cancel and prepare to inspect the constants. If they differ, expect one solution. In contextual equations, also predict sign, magnitude, and domain. A price, time, or length model often supplies a narrow plausibility range before any algebra is done.",
      "A polished solution has a visible logic chain. It states restrictions, shows the selected transformation applied to both sides, separates equivalent-expression simplification from balance operations, and reports the solution set. It does not need maximum line count; it needs enough evidence that a reader can identify why each line is equivalent to the one before it.",
      "The final verification should be chosen independently of the solving path. Substitute into the original equation, compare both sides numerically, inspect units, and interpret the result in context. For identity and contradiction cases, explain the complete domain conclusion. Strategy improves through error analysis: when a method fails, locate whether the defect came from reading structure, choosing an invalid operation, executing arithmetic, or interpreting the result.",
    ],
    method: {
      title: "Choose the first move from the equation’s structure",
      steps: [
        "Scan and annotate grouping, formats, variable locations, and restrictions.",
        "Predict whether the equation should yield one, no, or infinitely many solutions.",
        "Choose the reversible step that removes the most complexity with the least arithmetic risk.",
        "Record a concise operation history and perform an independent original-equation check.",
      ],
      check: "Explain why the chosen first move preserves the solution set and why a plausible alternative would be less efficient or more error-prone.",
    },
    definitions: [
      ["strategy choice", "Selection of a valid first move based on an equation’s structure and goal.", "Different valid choices may produce different-length paths to the same solution set."],
      ["independent verification", "A check that does not merely repeat the same sequence used to solve.", "Original-equation substitution, graph intersection, or contextual reconstruction can provide independent evidence."],
    ],
    questions: [
      q("Solve 0.25(8x − 12) = 3x + 5, and justify the first move you choose.", "x = −8", "Distribute 0.25 or multiply by 4. Multiplying by 4 gives 8x − 12 = 12x + 20, so −32 = 4x."),
      q("Classify 3(2x − 1) + 7 = 2(3x + 2) without unnecessary isolation steps.", "Infinitely many solutions", "Both sides simplify to 6x + 4, so the equation is an identity."),
      q("Solve (x − 2)/3 + (x + 1)/2 = 7 and explain why clearing denominators is efficient.", "x = 43/5", "Multiply every term by 6: 2(x − 2) + 3(x + 1) = 42, so 5x − 1 = 42 and x = 43/5."),
      q("Compare two first moves for 6(x + 4) = 18: distribute first or divide by 6 first. Solve and evaluate efficiency.", "x = −1; dividing by 6 is shorter", "Division gives x + 4 = 3 immediately. Distribution also works but creates 6x + 24 = 18 before reducing."),
    ],
    exampleNotes: [
      "The strategy begins with a structural scan, so the selected move is explained rather than imitated.",
      "Predicting solution count prepares the solver to interpret variable cancellation correctly.",
      "Independent checking separates a correct conclusion from a repeated version of the same possible error.",
    ],
  }),
};
