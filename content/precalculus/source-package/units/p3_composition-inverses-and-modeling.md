# Unit P3: Composition, Inverses, and Modeling

**Governing question.** How do processes combine, and under what conditions can a process be reversed?

This unit treats functions as ordered processes that can sometimes be reversed.

## Unit lessons

## P3.1. Composition as sequential processing

**Lesson outcome.** Interpret f composed with g as applying g first and then f, and explain why order generally matters.

### Opening

Composition represents an ordered chain in which the inner function acts first.

This matters because the rest of Precalculus will repeatedly use composition as sequential processing to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Trace the original input through the first function, name the intermediate quantity, and feed it to the second function.

The intermediate output must lie in the outer function's domain and have compatible units.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through two-stage machine, order comparison, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is reading f composed with g from left to right as though f acts first.

### Worked examples

#### Foundation example

**Problem.** Coupon d(p)=p-20 and tax t(q)=1.06q at p=100.

**Solution.** t(d(100))=84.80, while d(t(100))=86.

**Interpretation.** A fixed coupon and percentage tax do not commute.

#### Representation example

**Problem.** g(f(3)).

**Solution.** 26.

**Interpretation.** This example expresses composition as sequential processing in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** Which acts first in f(g(x))?

**Solution.** g.

**Interpretation.** The transfer succeeds only when this condition remains visible: The intermediate output must lie in the outer function's domain and have compatible units.

### Figure storyboard

**P3.1-V1 - Two-stage machine.** Depict the foundation problem exactly: Coupon d(p)=p-20 and tax t(q)=1.06q at p=100. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: t(d(100))=84.80, while d(t(100))=86.

*Caption:* Two-stage machine: visual evidence for interpret f composed with g as applying g first and then f, and explain why order generally matters.

*Accessible description:* A text-equivalent account of two-stage machine, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.1-V2 - Order comparison.** Visualize the mechanism explicitly: Trace the original input through the first function, name the intermediate quantity, and feed it to the second function. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Order comparison: visual evidence for interpret f composed with g as applying g first and then f, and explain why order generally matters.

*Accessible description:* A text-equivalent account of order comparison, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.1-V3 - Unit compatibility.** Place the correct structure beside the invalid move described here: A frequent error is reading f composed with g from left to right as though f acts first. Mark the first point where the conclusions diverge.

*Caption:* Unit compatibility: visual evidence for interpret f composed with g as applying g first and then f, and explain why order generally matters.

*Accessible description:* A text-equivalent account of unit compatibility, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

f=x+10,g=2x; f(g(3)).

<details><summary>Check</summary>

16.

</details>

### Practice

1. f=x+10,g=2x; f(g(3)).
2. g(f(3)).
3. Which acts first in f(g(x))?
4. Write h then g then f.
5. State the defining idea of composition as sequential processing in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. 16.
2. 26.
3. g.
4. f(g(h(x))).
5. Composition represents an ordered chain in which the inner function acts first.
6. The intermediate output must lie in the outer function's domain and have compatible units.
7. A frequent error is reading f composed with g from left to right as though f acts first.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Composition from formulas, uses this result as part of a larger structure.

### Lesson close

The next lesson, Composition from formulas, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.2. Composition from formulas

**Lesson outcome.** Evaluate and simplify composite functions symbolically while preserving grouping and domain conditions.

### Opening

Formula composition replaces every occurrence of the outer variable with the complete inner expression.

This matters because the rest of Precalculus will repeatedly use composition from formulas to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Write the substitution with parentheses before simplifying and determine both inner and outer domain conditions.

Simplification may hide restrictions inherited from an intermediate stage.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through substitution slots, expression trees, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is substituting into only one term or dropping grouping symbols.

### Worked examples

#### Foundation example

**Problem.** f=x^2-1,g=3x+2.

**Solution.** f(g(x))=9x^2+12x+3.

**Interpretation.** The entire linear expression is squared.

#### Representation example

**Problem.** g after f.

**Solution.** (2x+3)^2.

**Interpretation.** This example expresses composition from formulas in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** f=1/x,g=x-4; domain.

**Solution.** x≠4.

**Interpretation.** The transfer succeeds only when this condition remains visible: Simplification may hide restrictions inherited from an intermediate stage.

### Figure storyboard

**P3.2-V1 - Substitution slots.** Depict the foundation problem exactly: f=x^2-1,g=3x+2. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: f(g(x))=9x^2+12x+3.

*Caption:* Substitution slots: visual evidence for evaluate and simplify composite functions symbolically while preserving grouping and domain conditions.

*Accessible description:* A text-equivalent account of substitution slots, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.2-V2 - Expression trees.** Visualize the mechanism explicitly: Write the substitution with parentheses before simplifying and determine both inner and outer domain conditions. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Expression trees: visual evidence for evaluate and simplify composite functions symbolically while preserving grouping and domain conditions.

*Accessible description:* A text-equivalent account of expression trees, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.2-V3 - Outer restriction preimage.** Place the correct structure beside the invalid move described here: A frequent error is substituting into only one term or dropping grouping symbols. Mark the first point where the conclusions diverge.

*Caption:* Outer restriction preimage: visual evidence for evaluate and simplify composite functions symbolically while preserving grouping and domain conditions.

*Accessible description:* A text-equivalent account of outer restriction preimage, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

f=2x+3,g=x^2; f after g.

<details><summary>Check</summary>

2x^2+3.

</details>

### Practice

1. f=2x+3,g=x^2; f after g.
2. g after f.
3. f=1/x,g=x-4; domain.
4. Why parentheses?
5. State the defining idea of composition from formulas in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. 2x^2+3.
2. (2x+3)^2.
3. x≠4.
4. The full inner output is one input object.
5. Formula composition replaces every occurrence of the outer variable with the complete inner expression.
6. Simplification may hide restrictions inherited from an intermediate stage.
7. A frequent error is substituting into only one term or dropping grouping symbols.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Composition from tables and graphs, uses this result as part of a larger structure.

### Lesson close

The next lesson, Composition from tables and graphs, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.3. Composition from tables and graphs

**Lesson outcome.** Evaluate composite functions when one or both functions are represented numerically or graphically.

### Opening

Composition from tables or graphs uses two successive input-output readings.

This matters because the rest of Precalculus will repeatedly use composition from tables and graphs to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Find the inner output, then use it as the outer input, preserving approximation when a graph is read visually.

A missing table entry is not automatically an excluded domain value; distinguish insufficient data from undefinedness.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through table lookup chain, graph-to-graph trace, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is using the original input in both functions.

### Worked examples

#### Foundation example

**Problem.** g(2)=4 and f(4)=7.

**Solution.** f(g(2))=7.

**Interpretation.** The intermediate value becomes the next input.

#### Representation example

**Problem.** f(-2)=5,g(5)=0.

**Solution.** 0.

**Interpretation.** This example expresses composition from tables and graphs in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** Undefined versus unknown.

**Solution.** Excluded by domain versus missing data.

**Interpretation.** The transfer succeeds only when this condition remains visible: A missing table entry is not automatically an excluded domain value; distinguish insufficient data from undefinedness.

### Figure storyboard

**P3.3-V1 - Table lookup chain.** Depict the foundation problem exactly: g(2)=4 and f(4)=7. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: f(g(2))=7.

*Caption:* Table lookup chain: visual evidence for evaluate composite functions when one or both functions are represented numerically or graphically.

*Accessible description:* A text-equivalent account of table lookup chain, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.3-V2 - Graph-to-graph trace.** Visualize the mechanism explicitly: Find the inner output, then use it as the outer input, preserving approximation when a graph is read visually. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Graph-to-graph trace: visual evidence for evaluate composite functions when one or both functions are represented numerically or graphically.

*Accessible description:* A text-equivalent account of graph-to-graph trace, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.3-V3 - Undefined versus insufficient data.** Place the correct structure beside the invalid move described here: A frequent error is using the original input in both functions. Mark the first point where the conclusions diverge.

*Caption:* Undefined versus insufficient data: visual evidence for evaluate composite functions when one or both functions are represented numerically or graphically.

*Accessible description:* A text-equivalent account of undefined versus insufficient data, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

g(4)=1,f(1)=6.

<details><summary>Check</summary>

6.

</details>

### Practice

1. g(4)=1,f(1)=6.
2. f(-2)=5,g(5)=0.
3. Undefined versus unknown.
4. First lookup in f(g(a)).
5. State the defining idea of composition from tables and graphs in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. 6.
2. 0.
3. Excluded by domain versus missing data.
4. Find g(a).
5. Composition from tables or graphs uses two successive input-output readings.
6. A missing table entry is not automatically an excluded domain value; distinguish insufficient data from undefinedness.
7. A frequent error is using the original input in both functions.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Domains of composite functions, uses this result as part of a larger structure.

### Lesson close

The next lesson, Domains of composite functions, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.4. Domains of composite functions

**Lesson outcome.** Determine the domain of a composite by enforcing both inner-function and outer-input conditions.

### Opening

The domain of f(g(x)) requires x to be allowed by g and g(x) to be allowed by f.

This matters because the rest of Precalculus will repeatedly use domains of composite functions to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Translate outer restrictions into equations or inequalities involving the inner output, then intersect them with the inner domain.

One forbidden outer input can have several original preimages.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through composite-domain pipeline, preimage of forbidden value, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is simply intersecting the written domains of f and g as though they used the same stage variable.

### Worked examples

#### Foundation example

**Problem.** f=sqrt(u),g=x^2-9.

**Solution.** Domain x≤-3 or x≥3.

**Interpretation.** The outer root condition becomes x^2-9≥0.

#### Representation example

**Problem.** Domain 1/(x^2-16).

**Solution.** x≠±4.

**Interpretation.** This example expresses domains of composite functions in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** Domain ln(4-x^2).

**Solution.** (-2,2).

**Interpretation.** The transfer succeeds only when this condition remains visible: One forbidden outer input can have several original preimages.

### Figure storyboard

**P3.4-V1 - Composite-domain pipeline.** Depict the foundation problem exactly: f=sqrt(u),g=x^2-9. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: Domain x≤-3 or x≥3.

*Caption:* Composite-domain pipeline: visual evidence for determine the domain of a composite by enforcing both inner-function and outer-input conditions.

*Accessible description:* A text-equivalent account of composite-domain pipeline, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.4-V2 - Preimage of forbidden value.** Visualize the mechanism explicitly: Translate outer restrictions into equations or inequalities involving the inner output, then intersect them with the inner domain. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Preimage of forbidden value: visual evidence for determine the domain of a composite by enforcing both inner-function and outer-input conditions.

*Accessible description:* A text-equivalent account of preimage of forbidden value, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.4-V3 - Hidden restriction.** Place the correct structure beside the invalid move described here: A frequent error is simply intersecting the written domains of f and g as though they used the same stage variable. Mark the first point where the conclusions diverge.

*Caption:* Hidden restriction: visual evidence for determine the domain of a composite by enforcing both inner-function and outer-input conditions.

*Accessible description:* A text-equivalent account of hidden restriction, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

Domain sqrt(x-5).

<details><summary>Check</summary>

[5,∞).

</details>

### Practice

1. Domain sqrt(x-5).
2. Domain 1/(x^2-16).
3. Domain ln(4-x^2).
4. Two domain questions.
5. State the defining idea of domains of composite functions in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. [5,∞).
2. x≠±4.
3. (-2,2).
4. Is x allowed by g? Is g(x) allowed by f?
5. The domain of f(g(x)) requires x to be allowed by g and g(x) to be allowed by f.
6. One forbidden outer input can have several original preimages.
7. A frequent error is simply intersecting the written domains of f and g as though they used the same stage variable.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, One-to-one functions, uses this result as part of a larger structure.

### Lesson close

The next lesson, One-to-one functions, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.5. One-to-one functions

**Lesson outcome.** Determine whether a function is one-to-one and explain why one-to-one behavior is required for an inverse function.

### Opening

A one-to-one function gives each output at most one input, making reverse assignment possible.

This matters because the rest of Precalculus will repeatedly use one-to-one functions to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Check repeated outputs, use the horizontal-line test, or prove f(a)=f(b) implies a=b.

A function that fails globally may be restricted to a monotonic interval.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through horizontal-line test, reverse mapping failure, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is confusing the ordinary function condition with one-to-one behavior.

### Worked examples

#### Foundation example

**Problem.** Is x^2 one-to-one on all real numbers?

**Solution.** No; x and -x share outputs. Restrict to x≥0 or x≤0.

**Interpretation.** A branch restriction restores reverse uniqueness.

#### Representation example

**Problem.** Is x^3 one-to-one?

**Solution.** Yes.

**Interpretation.** This example expresses one-to-one functions in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** Horizontal-line test.

**Solution.** Every horizontal line meets at most once.

**Interpretation.** The transfer succeeds only when this condition remains visible: A function that fails globally may be restricted to a monotonic interval.

### Figure storyboard

**P3.5-V1 - Horizontal-line test.** Depict the foundation problem exactly: Is x^2 one-to-one on all real numbers? Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: No; x and -x share outputs. Restrict to x≥0 or x≤0.

*Caption:* Horizontal-line test: visual evidence for determine whether a function is one-to-one and explain why one-to-one behavior is required for an inverse function.

*Accessible description:* A text-equivalent account of horizontal-line test, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.5-V2 - Reverse mapping failure.** Visualize the mechanism explicitly: Check repeated outputs, use the horizontal-line test, or prove f(a)=f(b) implies a=b. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Reverse mapping failure: visual evidence for determine whether a function is one-to-one and explain why one-to-one behavior is required for an inverse function.

*Accessible description:* A text-equivalent account of reverse mapping failure, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.5-V3 - Quadratic branch restrictions.** Place the correct structure beside the invalid move described here: A frequent error is confusing the ordinary function condition with one-to-one behavior. Mark the first point where the conclusions diverge.

*Caption:* Quadratic branch restrictions: visual evidence for determine whether a function is one-to-one and explain why one-to-one behavior is required for an inverse function.

*Accessible description:* A text-equivalent account of quadratic branch restrictions, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

Is 2x+1 one-to-one?

<details><summary>Check</summary>

Yes.

</details>

### Practice

1. Is 2x+1 one-to-one?
2. Is x^3 one-to-one?
3. Horizontal-line test.
4. Can a constant function be one-to-one on multiple inputs?
5. State the defining idea of one-to-one functions in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. Yes.
2. Yes.
3. Every horizontal line meets at most once.
4. No.
5. A one-to-one function gives each output at most one input, making reverse assignment possible.
6. A function that fails globally may be restricted to a monotonic interval.
7. A frequent error is confusing the ordinary function condition with one-to-one behavior.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Constructing inverse functions, uses this result as part of a larger structure.

### Lesson close

The next lesson, Constructing inverse functions, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.6. Constructing inverse functions

**Lesson outcome.** Construct an inverse function algebraically and state the swapped domain and range.

### Opening

An inverse function reverses input and output roles; it is not the reciprocal 1/f.

This matters because the rest of Precalculus will repeatedly use constructing inverse functions to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Write y=f(x), exchange x and y, solve for y, and state the swapped domain and range.

The original function must be one-to-one on its stated domain, and a restricted branch determines any root sign.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through coordinate reversal, algebraic inversion, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is keeping both plus and minus branches and producing an inverse relation rather than a function.

### Worked examples

#### Foundation example

**Problem.** Find inverse of 3x-7.

**Solution.** f^{-1}(x)=(x+7)/3.

**Interpretation.** The inverse reverses the operations in reverse order.

#### Representation example

**Problem.** Inverse of 4x.

**Solution.** x/4.

**Interpretation.** This example expresses constructing inverse functions in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** Inverse of (x+3)/2.

**Solution.** 2x-3.

**Interpretation.** The transfer succeeds only when this condition remains visible: The original function must be one-to-one on its stated domain, and a restricted branch determines any root sign.

### Figure storyboard

**P3.6-V1 - Coordinate reversal.** Depict the foundation problem exactly: Find inverse of 3x-7. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: f^{-1}(x)=(x+7)/3.

*Caption:* Coordinate reversal: visual evidence for construct an inverse function algebraically and state the swapped domain and range.

*Accessible description:* A text-equivalent account of coordinate reversal, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.6-V2 - Algebraic inversion.** Visualize the mechanism explicitly: Write y=f(x), exchange x and y, solve for y, and state the swapped domain and range. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Algebraic inversion: visual evidence for construct an inverse function algebraically and state the swapped domain and range.

*Accessible description:* A text-equivalent account of algebraic inversion, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.6-V3 - Inverse versus reciprocal.** Place the correct structure beside the invalid move described here: A frequent error is keeping both plus and minus branches and producing an inverse relation rather than a function. Mark the first point where the conclusions diverge.

*Caption:* Inverse versus reciprocal: visual evidence for construct an inverse function algebraically and state the swapped domain and range.

*Accessible description:* A text-equivalent account of inverse versus reciprocal, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

Inverse of x-9.

<details><summary>Check</summary>

x+9.

</details>

### Practice

1. Inverse of x-9.
2. Inverse of 4x.
3. Inverse of (x+3)/2.
4. Inverse versus reciprocal.
5. State the defining idea of constructing inverse functions in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. x+9.
2. x/4.
3. 2x-3.
4. Reversal versus division into 1.
5. An inverse function reverses input and output roles; it is not the reciprocal 1/f.
6. The original function must be one-to-one on its stated domain, and a restricted branch determines any root sign.
7. A frequent error is keeping both plus and minus branches and producing an inverse relation rather than a function.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Graphs and verification of inverses, uses this result as part of a larger structure.

### Lesson close

The next lesson, Graphs and verification of inverses, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.7. Graphs and verification of inverses

**Lesson outcome.** Verify inverse functions using composition and graph symmetry across y=x.

### Opening

Inverse functions undo each other in both composition orders and reflect across y=x.

This matters because the rest of Precalculus will repeatedly use graphs and verification of inverses to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Compute f(f^{-1}(x)) and f^{-1}(f(x)), preserving their valid domains, and compare graph point pairs.

The two compositions begin on different domains: the original range and original domain.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through inverse reflection, composition loop, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is simplifying sqrt(x^2) to x without the branch restriction.

### Worked examples

#### Foundation example

**Problem.** Verify f=3x-2 and g=(x+2)/3.

**Solution.** Both compositions simplify to x.

**Interpretation.** The functions undo each other.

#### Representation example

**Problem.** Reflect (3,-1) across y=x.

**Solution.** (-1,3).

**Interpretation.** This example expresses graphs and verification of inverses in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** Inverse range if original domain [2,∞).

**Solution.** [2,∞).

**Interpretation.** The transfer succeeds only when this condition remains visible: The two compositions begin on different domains: the original range and original domain.

### Figure storyboard

**P3.7-V1 - Inverse reflection.** Depict the foundation problem exactly: Verify f=3x-2 and g=(x+2)/3. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: Both compositions simplify to x.

*Caption:* Inverse reflection: visual evidence for verify inverse functions using composition and graph symmetry across y=x.

*Accessible description:* A text-equivalent account of inverse reflection, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.7-V2 - Composition loop.** Visualize the mechanism explicitly: Compute f(f^{-1}(x)) and f^{-1}(f(x)), preserving their valid domains, and compare graph point pairs. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Composition loop: visual evidence for verify inverse functions using composition and graph symmetry across y=x.

*Accessible description:* A text-equivalent account of composition loop, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.7-V3 - Domain-range swap.** Place the correct structure beside the invalid move described here: A frequent error is simplifying sqrt(x^2) to x without the branch restriction. Mark the first point where the conclusions diverge.

*Caption:* Domain-range swap: visual evidence for verify inverse functions using composition and graph symmetry across y=x.

*Accessible description:* A text-equivalent account of domain-range swap, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

Verify x+5 and x-5.

<details><summary>Check</summary>

Both compositions equal x.

</details>

### Practice

1. Verify x+5 and x-5.
2. Reflect (3,-1) across y=x.
3. Inverse range if original domain [2,∞).
4. Reflection line.
5. State the defining idea of graphs and verification of inverses in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. Both compositions equal x.
2. (-1,3).
3. [2,∞).
4. y=x.
5. Inverse functions undo each other in both composition orders and reflect across y=x.
6. The two compositions begin on different domains: the original range and original domain.
7. A frequent error is simplifying sqrt(x^2) to x without the branch restriction.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Domain restrictions and radical inverses, uses this result as part of a larger structure.

### Lesson close

The next lesson, Domain restrictions and radical inverses, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.8. Domain restrictions and radical inverses

**Lesson outcome.** Restrict power functions to one-to-one branches and connect those branches to principal radical functions.

### Opening

Even roots require nonnegative radicands and the principal square root is nonnegative, so sqrt(x^2)=|x|.

This matters because the rest of Precalculus will repeatedly use domain restrictions and radical inverses to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Extract perfect powers, convert between radical and rational-exponent notation, isolate a radical in an equation, raise both sides to a power, and check every candidate.

Negative rational exponents also require a nonzero base. Squaring is not reversible without sign and domain checks.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through principal root versus equation roots, radical-exponent equivalence, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is replacing sqrt(x^2) with x for negative inputs or omitting the final check.

### Worked examples

#### Foundation example

**Problem.** Solve sqrt(x+6)=x.

**Solution.** Candidates are 3 and -2; only x=3 satisfies the original equation.

**Interpretation.** The domain removes the extraneous value.

#### Representation example

**Problem.** Evaluate 16^(3/4).

**Solution.** 8.

**Interpretation.** This example expresses domain restrictions and radical inverses in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** State domain of sqrt(3-x).

**Solution.** x≤3.

**Interpretation.** The transfer succeeds only when this condition remains visible: Negative rational exponents also require a nonzero base. Squaring is not reversible without sign and domain checks.

### Figure storyboard

**P3.8-V1 - Principal root versus equation roots.** Depict the foundation problem exactly: Solve sqrt(x+6)=x. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: Candidates are 3 and -2; only x=3 satisfies the original equation.

*Caption:* Principal root versus equation roots: visual evidence for restrict power functions to one-to-one branches and connect those branches to principal radical functions.

*Accessible description:* A text-equivalent account of principal root versus equation roots, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.8-V2 - Radical-exponent equivalence.** Visualize the mechanism explicitly: Extract perfect powers, convert between radical and rational-exponent notation, isolate a radical in an equation, raise both sides to a power, and check every candidate. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Radical-exponent equivalence: visual evidence for restrict power functions to one-to-one branches and connect those branches to principal radical functions.

*Accessible description:* A text-equivalent account of radical-exponent equivalence, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.8-V3 - Extraneous-solution map.** Place the correct structure beside the invalid move described here: A frequent error is replacing sqrt(x^2) with x for negative inputs or omitting the final check. Mark the first point where the conclusions diverge.

*Caption:* Extraneous-solution map: visual evidence for restrict power functions to one-to-one branches and connect those branches to principal radical functions.

*Accessible description:* A text-equivalent account of extraneous-solution map, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

Simplify sqrt(48).

<details><summary>Check</summary>

4sqrt(3).

</details>

### Practice

1. Simplify sqrt(48).
2. Evaluate 16^(3/4).
3. State domain of sqrt(3-x).
4. Simplify sqrt(x^2).
5. State the defining idea of domain restrictions and radical inverses in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. 4sqrt(3).
2. 8.
3. x≤3.
4. |x|.
5. Even roots require nonnegative radicands and the principal square root is nonnegative, so sqrt(x^2)=|x|.
6. Negative rational exponents also require a nonzero base. Squaring is not reversible without sign and domain checks.
7. A frequent error is replacing sqrt(x^2) with x for negative inputs or omitting the final check.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Model construction and validation, uses this result as part of a larger structure.

### Lesson close

The next lesson, Model construction and validation, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## P3.9. Model construction and validation

**Lesson outcome.** Build a multi-stage function model, state its domain and assumptions, and evaluate whether an inverse interpretation is meaningful.

### Opening

A model is a deliberately simplified function used to answer a question; it is not the real system itself.

This matters because the rest of Precalculus will repeatedly use model construction and validation to decide what a formula means, what a graph can show, and which conclusions remain valid.

### Before you begin

1. Evaluate function notation.
2. Determine domains from formulas.
3. Solve equations for a selected variable.

### Exact learner exposition

Define quantities, choose a family, estimate parameters, state domain and assumptions, inspect residuals, and revise or reject when evidence disagrees.

Interpolation and extrapolation must be distinguished, and causation requires evidence beyond correlation.

A symbolic answer is not complete by itself. In this lesson, the same claim must also be readable through modeling cycle, competing extrapolations, or another equivalent representation.

A complete response states what the result means. When the setting is contextual, include units and a meaningful domain. When the result is numerical, distinguish an exact value from an approximation and state the precision used.

### Common mistake

A frequent error is choosing the smoothest graph or highest fit statistic without checking meaning.

### Worked examples

#### Foundation example

**Problem.** Costs 65,90,115,140 for 1-4 hours.

**Solution.** C(h)=40+25h.

**Interpretation.** The fixed fee and hourly rate are interpretable.

#### Representation example

**Problem.** Why inspect residual patterns?

**Solution.** They reveal systematic model failure.

**Interpretation.** This example expresses model construction and validation in a second form and should agree with the defining relationship stated above.

#### Transfer example

**Problem.** Give interpolation example.

**Solution.** Estimate within observed range.

**Interpretation.** The transfer succeeds only when this condition remains visible: Interpolation and extrapolation must be distinguished, and causation requires evidence beyond correlation.

### Figure storyboard

**P3.9-V1 - Modeling cycle.** Depict the foundation problem exactly: Costs 65,90,115,140 for 1-4 hours. Show the quantities, axes, intervals, or algebraic objects needed to reach this conclusion: C(h)=40+25h.

*Caption:* Modeling cycle: visual evidence for build a multi-stage function model, state its domain and assumptions, and evaluate whether an inverse interpretation is meaningful.

*Accessible description:* A text-equivalent account of modeling cycle, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.9-V2 - Competing extrapolations.** Visualize the mechanism explicitly: Define quantities, choose a family, estimate parameters, state domain and assumptions, inspect residuals, and revise or reject when evidence disagrees. The figure must show intermediate states or mappings, not merely the final formula.

*Caption:* Competing extrapolations: visual evidence for build a multi-stage function model, state its domain and assumptions, and evaluate whether an inverse interpretation is meaningful.

*Accessible description:* A text-equivalent account of competing extrapolations, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

**P3.9-V3 - Residual plot.** Place the correct structure beside the invalid move described here: A frequent error is choosing the smoothest graph or highest fit statistic without checking meaning. Mark the first point where the conclusions diverge.

*Caption:* Residual plot: visual evidence for build a multi-stage function model, state its domain and assumptions, and evaluate whether an inverse interpretation is meaningful.

*Accessible description:* A text-equivalent account of residual plot, including every marked point, interval, equation, direction, asymptote, transformation, and excluded case used to support the conclusion.

### Check yourself

Define residual.

<details><summary>Check</summary>

Observed minus predicted.

</details>

### Practice

1. Define residual.
2. Why inspect residual patterns?
3. Give interpolation example.
4. Give extrapolation example.
5. State the defining idea of model construction and validation in one precise sentence.
6. State the condition that must be checked before using the method.
7. Describe the first invalid step in the common error.
8. Explain how the result should be checked in another representation.
9. Write one exact conclusion and one corresponding approximate conclusion.
10. State how this lesson connects forward.

### Practice answers

1. Observed minus predicted.
2. They reveal systematic model failure.
3. Estimate within observed range.
4. Predict beyond observed range.
5. A model is a deliberately simplified function used to answer a question; it is not the real system itself.
6. Interpolation and extrapolation must be distinguished, and causation requires evidence beyond correlation.
7. A frequent error is choosing the smoothest graph or highest fit statistic without checking meaning.
8. Translate the answer into a graph, table, interval, mapping, equation, or context and verify that the same inputs, outputs, and restrictions appear.
9. Keep the symbolic form exact, then report a rounded value with its stated precision only when numerical comparison is needed.
10. The next lesson, Power functions and dominant behavior, uses this result as part of a larger structure.

### Lesson close

The next lesson, Power functions and dominant behavior, uses this result as part of a larger structure.

Before continuing, the learner should be able to explain the definition, complete the representative calculation, interpret the main figure, and identify the common error without consulting a template.

### Source guidance

Lippman and Rasmussen, Precalculus Volume 1; Utah College Algebra; AP Precalculus framework


---

## Unit investigation

The investigation for Composition, Inverses, and Modeling combines the unit methods in one multistage problem. It requires a structured entry version, a less-scaffolded version, a complete worked solution, an alternate valid strategy, and an extension that tests a model limitation.

## Unit review and mastery

The review mixes current-unit questions with retrieval from earlier units. The mastery assessment balances symbolic fluency, graph and table interpretation, explanation, error analysis, and modeling transfer.
