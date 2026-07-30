# Unit P14: Sequences, Series, and Discrete Models

This unit studies functions of integer inputs and the totals created by adding their outputs. Explicit formulas, recursions, partial sums, and limiting behavior provide a discrete bridge into Calculus. The governing question is: **How do functions of integer inputs describe repeated processes and accumulated change?**

## Unit anchor problem

A medication dose leaves 72% of the previous amount in the body every 6 hours, and 40 mg is added every 12 hours. Build a recurrence and analyze long-run behavior.

The anchor problem should remain visible throughout the unit. Each lesson contributes one part of the language or method needed to solve it completely, and the unit investigation asks the learner to build a related model independently.

## Learning path

- **P14.1. Sequences as discrete functions**
- **P14.2. Explicit and recursive descriptions**
- **P14.3. Arithmetic sequences**
- **P14.4. Geometric sequences**
- **P14.5. Recurrence, iteration, and discrete dynamical models**
- **P14.6. Sigma notation and finite sums**
- **P14.7. Arithmetic series**
- **P14.8. Finite geometric series**
- **P14.9. Infinite geometric series and convergence**
- **P14.10. Mathematical induction**
- **P14.11. Pascal's triangle and binomial coefficients**
- **P14.12. The binomial theorem and discrete-model synthesis**

---

## P14.1. Sequences as discrete functions

**Learning objective.** Interpret a sequence as a function on an integer index set.

### The problem that opens the lesson

The first five terms are 4,7,12,19,28. Plot them as a discrete function and propose a formula.

**Opening solution.** The first five terms are 4,7,12,19,28. Plot them as a discrete function and propose a formula.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. The relevant conditions are not optional bookkeeping: Different indexing conventions shift formulas by one, so the domain must accompany the rule. Following that structure gives **a_n=n^2+3 for n=1,2,...**

**Why this works.** A formula, table, recurrence, graph, or verbal process may describe the same sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A sequence is a function whose domain is an ordered discrete index set, commonly the positive or nonnegative integers.

The index n identifies position; a_n is the term value. A sequence graph consists of isolated points because intermediate indices are not part of the domain unless separately defined.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A formula, table, recurrence, graph, or verbal process may describe the same sequence.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed.

Different indexing conventions shift formulas by one, so the domain must accompany the rule.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is confusing the nth term with n or assuming an observed finite pattern uniquely determines all later terms.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** The first five terms are 4,7,12,19,28. Plot them as a discrete function and propose a formula.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. The relevant conditions are not optional bookkeeping: Different indexing conventions shift formulas by one, so the domain must accompany the rule. Following that structure gives **a_n=n^2+3 for n=1,2,...**

**Why this works.** A formula, table, recurrence, graph, or verbal process may describe the same sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Distinguish term index from term value.

**Worked development.** State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The index n identifies position; a_n is the term value. A sequence graph consists of isolated points because intermediate indices are not part of the domain unless separately defined. Then apply the conditions explicitly: Different indexing conventions shift formulas by one, so the domain must accompany the rule. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Sequences model samples, payments, populations, algorithms, and repeated experiments.

#### Reasoning example

**Problem.** Compare a discrete sequence plot with a connected curve.

**Worked development.** State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The index n identifies position; a_n is the term value. A sequence graph consists of isolated points because intermediate indices are not part of the domain unless separately defined. Then apply the conditions explicitly: Different indexing conventions shift formulas by one, so the domain must accompany the rule. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Sequences model samples, payments, populations, algorithms, and repeated experiments.

**Worked example 4: quick check.** State the domain of a_n=2n+1 for n=0,1,2,...

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. The relevant conditions are not optional bookkeeping: Different indexing conventions shift formulas by one, so the domain must accompany the rule. Following that structure gives **The nonnegative integers.**

**Why this works.** A formula, table, recurrence, graph, or verbal process may describe the same sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.1-V1: Discrete stem plot.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.1-V2: Index-value mapping.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.1-V3: Connected-curve error panel.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Sequences model samples, payments, populations, algorithms, and repeated experiments.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

State the domain of a_n=2n+1 for n=0,1,2,...

<details><summary>Check</summary>

The nonnegative integers.

</details>

### Practice set

1. State the domain of a_n=2n+1 for n=0,1,2,...
2. Distinguish term index from term value.
3. Compare a discrete sequence plot with a connected curve.
4. Choose whether indexing begins at 0 or 1.
5. State the defining idea behind sequences as discrete functions in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. The nonnegative integers.
2. Use the method developed in the lesson: State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: State the starting index, compute terms in order, and avoid connecting points as though every real input were allowed. Verify all conditions and state the final result in the requested representation.
5. A sequence is a function whose domain is an ordered discrete index set, commonly the positive or nonnegative integers.
6. Different indexing conventions shift formulas by one, so the domain must accompany the rule.
7. A common error is confusing the nth term with n or assuming an observed finite pattern uniquely determines all later terms.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson compares explicit and recursive descriptions.

### Lesson summary

A sequence is a function whose domain is an ordered discrete index set, commonly the positive or nonnegative integers.

The central condition to remember is this: Different indexing conventions shift formulas by one, so the domain must accompany the rule.

**Connection forward.** The next lesson compares explicit and recursive descriptions.

The next lesson is **Explicit and recursive descriptions**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.2. Explicit and recursive descriptions

**Learning objective.** Move among term lists, explicit formulas, recursive rules, tables, and plots.

### The problem that opens the lesson

A sequence begins 3,8,18,38,78. Write a recurrence and an explicit formula.

**Opening solution.** A sequence begins 3,8,18,38,78. Write a recurrence and an explicit formula.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. The relevant conditions are not optional bookkeeping: Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule. Following that structure gives **Recurrence a_n=2a_{n-1}+2; explicit a_n=5·2^{n-1}-2 for n≥1.**

**Why this works.** An initial condition is essential because the same recurrence can generate infinitely many sequences from different starting values. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

An explicit rule computes a_n directly from n, while a recursive rule computes a term from earlier terms and initial conditions.

Recursion mirrors repeated processes and can describe patterns without a simple closed form. Explicit rules make distant terms easier to evaluate.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

An initial condition is essential because the same recurrence can generate infinitely many sequences from different starting values.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices.

Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is writing a recurrence without a starting term or using a_0 and a_1 inconsistently.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A sequence begins 3,8,18,38,78. Write a recurrence and an explicit formula.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. The relevant conditions are not optional bookkeeping: Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule. Following that structure gives **Recurrence a_n=2a_{n-1}+2; explicit a_n=5·2^{n-1}-2 for n≥1.**

**Why this works.** An initial condition is essential because the same recurrence can generate infinitely many sequences from different starting values. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Recover a recursion from an explicit arithmetic formula.

**Worked development.** Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Recursion mirrors repeated processes and can describe patterns without a simple closed form. Explicit rules make distant terms easier to evaluate. Then apply the conditions explicitly: Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Explicit-recursive translation supports algorithms, finance, population models, and discrete dynamics.

#### Reasoning example

**Problem.** Iterate a nonlinear recurrence.

**Worked development.** Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Recursion mirrors repeated processes and can describe patterns without a simple closed form. Explicit rules make distant terms easier to evaluate. Then apply the conditions explicitly: Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Explicit-recursive translation supports algorithms, finance, population models, and discrete dynamics.

**Worked example 4: quick check.** Why is a_{n}=2a_{n-1} incomplete as a sequence definition?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. The relevant conditions are not optional bookkeeping: Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule. Following that structure gives **An initial term is needed.**

**Why this works.** An initial condition is essential because the same recurrence can generate infinitely many sequences from different starting values. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.2-V1: Explicit-recursive conversion flow.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.2-V2: Recurrence iteration tree.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.2-V3: Same sequence in four representations.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Explicit-recursive translation supports algorithms, finance, population models, and discrete dynamics.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Why is a_{n}=2a_{n-1} incomplete as a sequence definition?

<details><summary>Check</summary>

An initial term is needed.

</details>

### Practice set

1. Why is a_{n}=2a_{n-1} incomplete as a sequence definition?
2. Recover a recursion from an explicit arithmetic formula.
3. Iterate a nonlinear recurrence.
4. Explain why an initial condition is required.
5. State the defining idea behind explicit and recursive descriptions in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. An initial term is needed.
2. Use the method developed in the lesson: Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Generate several terms, identify the repeated operation, propose both forms when possible, and verify that they agree on multiple indices. Verify all conditions and state the final result in the requested representation.
5. An explicit rule computes a_n directly from n, while a recursive rule computes a term from earlier terms and initial conditions.
6. Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule.
7. A common error is writing a recurrence without a starting term or using a_0 and a_1 inconsistently.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next two lessons specialize to constant-difference and constant-ratio sequences.

### Lesson summary

An explicit rule computes a_n directly from n, while a recursive rule computes a term from earlier terms and initial conditions.

The central condition to remember is this: Not every recursion has an elementary explicit formula, and not every finite term list determines a unique rule.

**Connection forward.** The next two lessons specialize to constant-difference and constant-ratio sequences.

The next lesson is **Arithmetic sequences**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.3. Arithmetic sequences

**Learning objective.** Derive and use a_n=a_1+(n-1)d and connect arithmetic sequences to sampled linear functions.

### The problem that opens the lesson

An auditorium has 18 seats in row 1 and 4 more seats in each later row. How many seats are in row 35?

**Opening solution.** An auditorium has 18 seats in row 1 and 4 more seats in each later row. How many seats are in row 35?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. The relevant conditions are not optional bookkeeping: Indexing from zero changes the intercept form but not the additive pattern. Following that structure gives **18+34·4=154.**

**Why this works.** Differences, slope, and term index are different representations of the same additive structure. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

An arithmetic sequence has a constant difference d between consecutive terms.

Starting from a_1, reaching term n requires n-1 additions, giving a_n=a_1+(n-1)d. The sequence is a linear function sampled at integer inputs.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Differences, slope, and term index are different representations of the same additive structure.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor.

Indexing from zero changes the intercept form but not the additive pattern.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using nd instead of (n-1)d when a_1 is the first term.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** An auditorium has 18 seats in row 1 and 4 more seats in each later row. How many seats are in row 35?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. The relevant conditions are not optional bookkeeping: Indexing from zero changes the intercept form but not the additive pattern. Following that structure gives **18+34·4=154.**

**Why this works.** Differences, slope, and term index are different representations of the same additive structure. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Find d from two indexed terms.

**Worked development.** Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Starting from a_1, reaching term n requires n-1 additions, giving a_n=a_1+(n-1)d. The sequence is a linear function sampled at integer inputs. Then apply the conditions explicitly: Indexing from zero changes the intercept form but not the additive pattern. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Arithmetic sequences model seating rows, straight-line depreciation, regular deposits, and evenly spaced measurements.

#### Reasoning example

**Problem.** Recover a_1 from a later term.

**Worked development.** Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Starting from a_1, reaching term n requires n-1 additions, giving a_n=a_1+(n-1)d. The sequence is a linear function sampled at integer inputs. Then apply the conditions explicitly: Indexing from zero changes the intercept form but not the additive pattern. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Arithmetic sequences model seating rows, straight-line depreciation, regular deposits, and evenly spaced measurements.

**Worked example 4: quick check.** Find the 50th term of 7,12,17,...

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. The relevant conditions are not optional bookkeeping: Indexing from zero changes the intercept form but not the additive pattern. Following that structure gives **252.**

**Why this works.** Differences, slope, and term index are different representations of the same additive structure. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.3-V1: Equal-spacing number-line terms.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.3-V2: Sampled linear graph.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.3-V3: Index-offset n-1 derivation.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Arithmetic sequences model seating rows, straight-line depreciation, regular deposits, and evenly spaced measurements.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find the 50th term of 7,12,17,...

<details><summary>Check</summary>

252.

</details>

### Practice set

1. Find the 50th term of 7,12,17,...
2. Find d from two indexed terms.
3. Recover a_1 from a later term.
4. Compare arithmetic sequence plot with a line.
5. State the defining idea behind arithmetic sequences in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 252.
2. Use the method developed in the lesson: Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify two indexed terms, divide their value difference by index difference to find d, then recover a_1 or another anchor. Verify all conditions and state the final result in the requested representation.
5. An arithmetic sequence has a constant difference d between consecutive terms.
6. Indexing from zero changes the intercept form but not the additive pattern.
7. A common error is using nd instead of (n-1)d when a_1 is the first term.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson replaces repeated addition with repeated multiplication.

### Lesson summary

An arithmetic sequence has a constant difference d between consecutive terms.

The central condition to remember is this: Indexing from zero changes the intercept form but not the additive pattern.

**Connection forward.** The next lesson replaces repeated addition with repeated multiplication.

The next lesson is **Geometric sequences**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.4. Geometric sequences

**Learning objective.** Derive and use a_n=a_1r^{n-1} and connect geometric sequences to sampled exponential functions.

### The problem that opens the lesson

A bacteria count is 600 at hour 1 and triples every 2 hours. Write a sequence for counts at odd-numbered hours.

**Opening solution.** A bacteria count is 600 at hour 1 and triples every 2 hours. Write a sequence for counts at odd-numbered hours.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. The relevant conditions are not optional bookkeeping: A zero term can make ratio-based recovery impossible or indicate a special sequence. Following that structure gives **a_n=600·3^{n-1} for hours 2n-1.**

**Why this works.** Ratios may be positive, negative, fractional, or greater than one, creating growth, decay, or alternating signs. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A geometric sequence has a constant ratio r between consecutive nonzero terms.

From a_1, reaching term n requires n-1 multiplications, so a_n=a_1 r^{n-1}. This is an exponential function sampled at integer inputs.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Ratios may be positive, negative, fractional, or greater than one, creating growth, decay, or alternating signs.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern.

A zero term can make ratio-based recovery impossible or indicate a special sequence.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is dividing terms separated by several indices and treating the result as the one-step ratio.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A bacteria count is 600 at hour 1 and triples every 2 hours. Write a sequence for counts at odd-numbered hours.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. The relevant conditions are not optional bookkeeping: A zero term can make ratio-based recovery impossible or indicate a special sequence. Following that structure gives **a_n=600·3^{n-1} for hours 2n-1.**

**Why this works.** Ratios may be positive, negative, fractional, or greater than one, creating growth, decay, or alternating signs. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Find r from two consecutive terms.

**Worked development.** Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. From a_1, reaching term n requires n-1 multiplications, so a_n=a_1 r^{n-1}. This is an exponential function sampled at integer inputs. Then apply the conditions explicitly: A zero term can make ratio-based recovery impossible or indicate a special sequence. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Geometric sequences model compound growth, decay, rebounds, dilution, and repeated scaling.

#### Reasoning example

**Problem.** Find r across a multi-step index gap.

**Worked development.** Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. From a_1, reaching term n requires n-1 multiplications, so a_n=a_1 r^{n-1}. This is an exponential function sampled at integer inputs. Then apply the conditions explicitly: A zero term can make ratio-based recovery impossible or indicate a special sequence. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Geometric sequences model compound growth, decay, rebounds, dilution, and repeated scaling.

**Worked example 4: quick check.** Find a_8 for 5,-10,20,...

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. The relevant conditions are not optional bookkeeping: A zero term can make ratio-based recovery impossible or indicate a special sequence. Following that structure gives **-640.**

**Why this works.** Ratios may be positive, negative, fractional, or greater than one, creating growth, decay, or alternating signs. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.4-V1: Multiplicative term bars.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.4-V2: Sampled exponential graph.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.4-V3: Alternating-sign geometric sequence.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Geometric sequences model compound growth, decay, rebounds, dilution, and repeated scaling.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find a_8 for 5,-10,20,...

<details><summary>Check</summary>

-640.

</details>

### Practice set

1. Find a_8 for 5,-10,20,...
2. Find r from two consecutive terms.
3. Find r across a multi-step index gap.
4. Analyze negative and fractional ratios.
5. State the defining idea behind geometric sequences in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. -640.
2. Use the method developed in the lesson: Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Use indexed terms to form r^{difference in indices}, solve for r, and verify sign and magnitude against the term pattern. Verify all conditions and state the final result in the requested representation.
5. A geometric sequence has a constant ratio r between consecutive nonzero terms.
6. A zero term can make ratio-based recovery impossible or indicate a special sequence.
7. A common error is dividing terms separated by several indices and treating the result as the one-step ratio.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson studies general iteration and long-run behavior of recurrences.

### Lesson summary

A geometric sequence has a constant ratio r between consecutive nonzero terms.

The central condition to remember is this: A zero term can make ratio-based recovery impossible or indicate a special sequence.

**Connection forward.** The next lesson studies general iteration and long-run behavior of recurrences.

The next lesson is **Recurrence, iteration, and discrete dynamical models**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.5. Recurrence, iteration, and discrete dynamical models

**Learning objective.** Analyze repeated function application, fixed points, cycles, and qualitative long-run behavior.

### The problem that opens the lesson

A population follows P_{n+1}=0.6P_n+80 with P_0=50. Compute six terms and predict the limiting value.

**Opening solution.** A population follows P_{n+1}=0.6P_n+80 with P_0=50. Compute six terms and predict the limiting value.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. The relevant conditions are not optional bookkeeping: A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis. Following that structure gives **Terms approach 200, the fixed point solving P=0.6P+80.**

**Why this works.** Some recurrences converge, diverge, oscillate, or enter cycles. The term graph and a cobweb diagram reveal different aspects of the process. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A recurrence x_{n+1}=f(x_n) repeatedly applies one function to the current state.

A fixed point L satisfies L=f(L). Whether nearby terms approach or move away from L depends on how the iteration changes deviations, a concept explored qualitatively here.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Some recurrences converge, diverge, oscillate, or enter cycles. The term graph and a cobweb diagram reveal different aspects of the process.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior.

A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is confusing the recurrence function’s graph with the sequence’s term plot.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A population follows P_{n+1}=0.6P_n+80 with P_0=50. Compute six terms and predict the limiting value.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. The relevant conditions are not optional bookkeeping: A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis. Following that structure gives **Terms approach 200, the fixed point solving P=0.6P+80.**

**Why this works.** Some recurrences converge, diverge, oscillate, or enter cycles. The term graph and a cobweb diagram reveal different aspects of the process. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Find a fixed point of a recurrence.

**Worked development.** Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. A fixed point L satisfies L=f(L). Whether nearby terms approach or move away from L depends on how the iteration changes deviations, a concept explored qualitatively here. Then apply the conditions explicitly: A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Discrete dynamics model populations, loans, feedback, algorithms, and control systems.

#### Reasoning example

**Problem.** Compare stable and unstable fixed points qualitatively.

**Worked development.** Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. A fixed point L satisfies L=f(L). Whether nearby terms approach or move away from L depends on how the iteration changes deviations, a concept explored qualitatively here. Then apply the conditions explicitly: A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Discrete dynamics model populations, loans, feedback, algorithms, and control systems.

**Worked example 4: quick check.** Find the fixed point of x_{n+1}=0.75x_n+12.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. The relevant conditions are not optional bookkeeping: A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis. Following that structure gives **48.**

**Why this works.** Some recurrences converge, diverge, oscillate, or enter cycles. The term graph and a cobweb diagram reveal different aspects of the process. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.5-V1: Cobweb-style iteration diagram.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.5-V2: Term plot approaching a fixed point.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.5-V3: Stable versus unstable recurrence comparison.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Discrete dynamics model populations, loans, feedback, algorithms, and control systems.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find the fixed point of x_{n+1}=0.75x_n+12.

<details><summary>Check</summary>

48.

</details>

### Practice set

1. Find the fixed point of x_{n+1}=0.75x_n+12.
2. Find a fixed point of a recurrence.
3. Compare stable and unstable fixed points qualitatively.
4. Analyze a two-cycle in a simple recurrence.
5. State the defining idea behind recurrence, iteration, and discrete dynamical models in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 48.
2. Use the method developed in the lesson: Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Compute terms with full precision, solve fixed-point equations, compare initial values, and describe observed rather than assumed long-run behavior. Verify all conditions and state the final result in the requested representation.
5. A recurrence x_{n+1}=f(x_n) repeatedly applies one function to the current state.
6. A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis.
7. A common error is confusing the recurrence function’s graph with the sequence’s term plot.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson introduces notation for accumulating many sequence terms.

### Lesson summary

A recurrence x_{n+1}=f(x_n) repeatedly applies one function to the current state.

The central condition to remember is this: A numerical pattern over a few terms does not prove convergence. Formal proofs belong to later analysis.

**Connection forward.** The next lesson introduces notation for accumulating many sequence terms.

The next lesson is **Sigma notation and finite sums**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.6. Sigma notation and finite sums

**Learning objective.** Interpret summation notation, index bounds, summands, and term counts.

### The problem that opens the lesson

Expand and evaluate sum from k=2 to 6 of (3k-1).

**Opening solution.** Expand and evaluate sum from k=2 to 6 of (3k-1).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. The relevant conditions are not optional bookkeeping: An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined. Following that structure gives **5+8+11+14+17=55.**

**Why this works.** Inclusive integer bounds produce upper-lower+1 terms. Index shifts can align a sum with a known formula or sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Sigma notation compactly represents a finite sum by naming an index, lower and upper bounds, and a summand.

The index is a local placeholder. Renaming it does not change the sum, provided the bounds and summand are changed consistently.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Inclusive integer bounds produce upper-lower+1 terms. Index shifts can align a sum with a known formula or sequence.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables.

An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using the upper bound as the number of terms regardless of the lower bound.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Expand and evaluate sum from k=2 to 6 of (3k-1).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. The relevant conditions are not optional bookkeeping: An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined. Following that structure gives **5+8+11+14+17=55.**

**Why this works.** Inclusive integer bounds produce upper-lower+1 terms. Index shifts can align a sum with a known formula or sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Rewrite an expanded sum in sigma notation.

**Worked development.** Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The index is a local placeholder. Renaming it does not change the sum, provided the bounds and summand are changed consistently. Then apply the conditions explicitly: An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Sigma notation supports series formulas, probability, polynomial expansions, and numerical accumulation.

#### Reasoning example

**Problem.** Change index without changing the sum.

**Worked development.** Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The index is a local placeholder. Renaming it does not change the sum, provided the bounds and summand are changed consistently. Then apply the conditions explicitly: An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Sigma notation supports series formulas, probability, polynomial expansions, and numerical accumulation.

**Worked example 4: quick check.** How many terms are in sum k=4 to 19?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. The relevant conditions are not optional bookkeeping: An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined. Following that structure gives **16.**

**Why this works.** Inclusive integer bounds produce upper-lower+1 terms. Index shifts can align a sum with a known formula or sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.6-V1: Sigma anatomy diagram.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.6-V2: Index-shift alignment.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.6-V3: Term-count number line.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Sigma notation supports series formulas, probability, polynomial expansions, and numerical accumulation.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

How many terms are in sum k=4 to 19?

<details><summary>Check</summary>

16.

</details>

### Practice set

1. How many terms are in sum k=4 to 19?
2. Rewrite an expanded sum in sigma notation.
3. Change index without changing the sum.
4. Count terms from inclusive bounds.
5. State the defining idea behind sigma notation and finite sums in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 16.
2. Use the method developed in the lesson: Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Expand a few terms to verify notation, count the terms, evaluate systematically, and distinguish the summation index from outside variables. Verify all conditions and state the final result in the requested representation.
5. Sigma notation compactly represents a finite sum by naming an index, lower and upper bounds, and a summand.
6. An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined.
7. A common error is using the upper bound as the number of terms regardless of the lower bound.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson derives a closed form for arithmetic sums.

### Lesson summary

Sigma notation compactly represents a finite sum by naming an index, lower and upper bounds, and a summand.

The central condition to remember is this: An empty or reversed-bound convention depends on context and should not be assumed at this level unless defined.

**Connection forward.** The next lesson derives a closed form for arithmetic sums.

The next lesson is **Arithmetic series**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.7. Arithmetic series

**Learning objective.** Derive and use S_n=n(a_1+a_n)/2.

### The problem that opens the lesson

Find the total number of seats in 35 auditorium rows when the first has 18 and each adds 4.

**Opening solution.** Find the total number of seats in 35 auditorium rows when the first has 18 and each adds 4.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. The relevant conditions are not optional bookkeeping: When n is odd, the middle term pairs with itself conceptually; the formula remains valid. Following that structure gives **a_35=154; S_35=35(18+154)/2=3010.**

**Why this works.** The formula is also n times the average of the endpoints, which matches the average value of a linear sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

An arithmetic series is the finite sum of an arithmetic sequence.

Writing the sum forward and backward pairs the first and last terms, the second and next-to-last, and so on. Every pair has sum a_1+a_n, producing S_n=n(a_1+a_n)/2.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The formula is also n times the average of the endpoints, which matches the average value of a linear sequence.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units.

When n is odd, the middle term pairs with itself conceptually; the formula remains valid.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using the final index as n when the sequence begins at another index.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Find the total number of seats in 35 auditorium rows when the first has 18 and each adds 4.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. The relevant conditions are not optional bookkeeping: When n is odd, the middle term pairs with itself conceptually; the formula remains valid. Following that structure gives **a_35=154; S_35=35(18+154)/2=3010.**

**Why this works.** The formula is also n times the average of the endpoints, which matches the average value of a linear sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Derive the formula by reversing and pairing.

**Worked development.** Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Writing the sum forward and backward pairs the first and last terms, the second and next-to-last, and so on. Every pair has sum a_1+a_n, producing S_n=n(a_1+a_n)/2. Then apply the conditions explicitly: When n is odd, the middle term pairs with itself conceptually; the formula remains valid. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Arithmetic sums model total seating, regular payments, stacked objects, and cumulative linear change.

#### Reasoning example

**Problem.** Find n from a total.

**Worked development.** Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Writing the sum forward and backward pairs the first and last terms, the second and next-to-last, and so on. Every pair has sum a_1+a_n, producing S_n=n(a_1+a_n)/2. Then apply the conditions explicitly: When n is odd, the middle term pairs with itself conceptually; the formula remains valid. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Arithmetic sums model total seating, regular payments, stacked objects, and cumulative linear change.

**Worked example 4: quick check.** Find 1+2+...+100.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. The relevant conditions are not optional bookkeeping: When n is odd, the middle term pairs with itself conceptually; the formula remains valid. Following that structure gives **5050.**

**Why this works.** The formula is also n times the average of the endpoints, which matches the average value of a linear sequence. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.7-V1: Forward-reverse pairing.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.7-V2: Constant pair-sum rectangles.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.7-V3: Arithmetic sequence and accumulated-sum graph.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Arithmetic sums model total seating, regular payments, stacked objects, and cumulative linear change.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find 1+2+...+100.

<details><summary>Check</summary>

5050.

</details>

### Practice set

1. Find 1+2+...+100.
2. Derive the formula by reversing and pairing.
3. Find n from a total.
4. Apply to consecutive integers and linear costs.
5. State the defining idea behind arithmetic series in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 5050.
2. Use the method developed in the lesson: Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Find a_n if necessary, identify the number of terms from indexing, apply the formula, and attach units. Verify all conditions and state the final result in the requested representation.
5. An arithmetic series is the finite sum of an arithmetic sequence.
6. When n is odd, the middle term pairs with itself conceptually; the formula remains valid.
7. A common error is using the final index as n when the sequence begins at another index.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson derives the finite geometric sum formula.

### Lesson summary

An arithmetic series is the finite sum of an arithmetic sequence.

The central condition to remember is this: When n is odd, the middle term pairs with itself conceptually; the formula remains valid.

**Connection forward.** The next lesson derives the finite geometric sum formula.

The next lesson is **Finite geometric series**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.8. Finite geometric series

**Learning objective.** Derive and use S_n=a_1(1-r^n)/(1-r).

### The problem that opens the lesson

A ball rebounds to 70% of its previous height. Starting from 10 meters, find the total upward distance over the first 8 rebounds.

**Opening solution.** A ball rebounds to 70% of its previous height. Starting from 10 meters, find the total upward distance over the first 8 rebounds.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. The relevant conditions are not optional bookkeeping: The case r=1 must be handled separately as n a_1. Following that structure gives **10(0.7)(1-0.7^8)/(1-0.7) meters.**

**Why this works.** The alternative form a_1(r^n-1)/(r-1) is algebraically equivalent and may avoid nested negatives when r>1. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A finite geometric series sums terms with a constant ratio.

Multiplying S_n by r shifts every term one position. Subtracting cancels the interior terms and leaves a_1 and a_1 r^n, giving S_n=a_1(1-r^n)/(1-r) for r≠1.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The alternative form a_1(r^n-1)/(r-1) is algebraically equivalent and may avoid nested negatives when r>1.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum.

The case r=1 must be handled separately as n a_1.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using exponent n-1 in the sum formula because the nth term uses n-1.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A ball rebounds to 70% of its previous height. Starting from 10 meters, find the total upward distance over the first 8 rebounds.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. The relevant conditions are not optional bookkeeping: The case r=1 must be handled separately as n a_1. Following that structure gives **10(0.7)(1-0.7^8)/(1-0.7) meters.**

**Why this works.** The alternative form a_1(r^n-1)/(r-1) is algebraically equivalent and may avoid nested negatives when r>1. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Derive formula by multiplying by r and subtracting.

**Worked development.** Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Multiplying S_n by r shifts every term one position. Subtracting cancels the interior terms and leaves a_1 and a_1 r^n, giving S_n=a_1(1-r^n)/(1-r) for r≠1. Then apply the conditions explicitly: The case r=1 must be handled separately as n a_1. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Finite geometric sums model total rebounds, payments, repeated discounts, and digital scaling.

#### Reasoning example

**Problem.** Handle r=1 separately.

**Worked development.** Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Multiplying S_n by r shifts every term one position. Subtracting cancels the interior terms and leaves a_1 and a_1 r^n, giving S_n=a_1(1-r^n)/(1-r) for r≠1. Then apply the conditions explicitly: The case r=1 must be handled separately as n a_1. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Finite geometric sums model total rebounds, payments, repeated discounts, and digital scaling.

**Worked example 4: quick check.** Find 3+6+12+...+3·2^9.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. The relevant conditions are not optional bookkeeping: The case r=1 must be handled separately as n a_1. Following that structure gives **3(2^10-1)=3069.**

**Why this works.** The alternative form a_1(r^n-1)/(r-1) is algebraically equivalent and may avoid nested negatives when r>1. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.8-V1: Shift-and-subtract derivation.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.8-V2: Geometric block bars.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.8-V3: Term versus partial-sum plots.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Finite geometric sums model total rebounds, payments, repeated discounts, and digital scaling.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find 3+6+12+...+3·2^9.

<details><summary>Check</summary>

3(2^10-1)=3069.

</details>

### Practice set

1. Find 3+6+12+...+3·2^9.
2. Derive formula by multiplying by r and subtracting.
3. Handle r=1 separately.
4. Use finite series in finance and repeated measurement.
5. State the defining idea behind finite geometric series in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 3(2^10-1)=3069.
2. Use the method developed in the lesson: Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify the first term, ratio, and number of terms, choose a stable form, and check the result against the largest term or a direct short sum. Verify all conditions and state the final result in the requested representation.
5. A finite geometric series sums terms with a constant ratio.
6. The case r=1 must be handled separately as n a_1.
7. A common error is using exponent n-1 in the sum formula because the nth term uses n-1.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson lets the number of terms grow without bound.

### Lesson summary

A finite geometric series sums terms with a constant ratio.

The central condition to remember is this: The case r=1 must be handled separately as n a_1.

**Connection forward.** The next lesson lets the number of terms grow without bound.

The next lesson is **Infinite geometric series and convergence**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.9. Infinite geometric series and convergence

**Learning objective.** Determine convergence and evaluate infinite geometric sums when |r|<1.

### The problem that opens the lesson

A ball is dropped from 12 meters and rebounds to 3/4 of each previous height. Find its total vertical travel.

**Opening solution.** A ball is dropped from 12 meters and rebounds to 3/4 of each previous height. Find its total vertical travel.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. The relevant conditions are not optional bookkeeping: Negative r can produce oscillatory convergence. The sum may lie between successive partial sums. Following that structure gives **12+2[12(3/4)/(1-3/4)]=84 meters.**

**Why this works.** The term sequence and partial-sum sequence are different objects. Terms may approach zero without guaranteeing convergence for a general series, though the geometric case is completely classified by r. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

An infinite series is defined through the limit of its sequence of partial sums.

For a geometric series, r^n approaches zero exactly when |r|<1, so the partial sums approach a/(1-r). If |r|≥1, the terms fail to shrink appropriately or the partial sums diverge.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The term sequence and partial-sum sequence are different objects. Terms may approach zero without guaranteeing convergence for a general series, though the geometric case is completely classified by r.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications.

Negative r can produce oscillatory convergence. The sum may lie between successive partial sums.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is applying the infinite formula to |r|≥1 or treating the sum as one of the individual terms.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A ball is dropped from 12 meters and rebounds to 3/4 of each previous height. Find its total vertical travel.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. The relevant conditions are not optional bookkeeping: Negative r can produce oscillatory convergence. The sum may lie between successive partial sums. Following that structure gives **12+2[12(3/4)/(1-3/4)]=84 meters.**

**Why this works.** The term sequence and partial-sum sequence are different objects. Terms may approach zero without guaranteeing convergence for a general series, though the geometric case is completely classified by r. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Distinguish terms from partial sums.

**Worked development.** Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. For a geometric series, r^n approaches zero exactly when |r|<1, so the partial sums approach a/(1-r). If |r|≥1, the terms fail to shrink appropriately or the partial sums diverge. Then apply the conditions explicitly: Negative r can produce oscillatory convergence. The sum may lie between successive partial sums. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Infinite geometric series model recurring decimals, rebounds, annuities, and self-similar constructions.

#### Reasoning example

**Problem.** Analyze oscillatory convergence for negative r.

**Worked development.** Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. For a geometric series, r^n approaches zero exactly when |r|<1, so the partial sums approach a/(1-r). If |r|≥1, the terms fail to shrink appropriately or the partial sums diverge. Then apply the conditions explicitly: Negative r can produce oscillatory convergence. The sum may lie between successive partial sums. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Infinite geometric series model recurring decimals, rebounds, annuities, and self-similar constructions.

**Worked example 4: quick check.** Evaluate 5-2.5+1.25-... .

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. The relevant conditions are not optional bookkeeping: Negative r can produce oscillatory convergence. The sum may lie between successive partial sums. Following that structure gives **5/(1+0.5)=10/3.**

**Why this works.** The term sequence and partial-sum sequence are different objects. Terms may approach zero without guaranteeing convergence for a general series, though the geometric case is completely classified by r. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.9-V1: Term bars and partial-sum line.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.9-V2: Convergent-limit asymptote.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.9-V3: Positive, negative, and divergent ratio comparison.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Infinite geometric series model recurring decimals, rebounds, annuities, and self-similar constructions.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Evaluate 5-2.5+1.25-... .

<details><summary>Check</summary>

5/(1+0.5)=10/3.

</details>

### Practice set

1. Evaluate 5-2.5+1.25-... .
2. Distinguish terms from partial sums.
3. Analyze oscillatory convergence for negative r.
4. Explain divergence when |r|≥1.
5. State the defining idea behind infinite geometric series and convergence in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 5/(1+0.5)=10/3.
2. Use the method developed in the lesson: Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify a and r, test |r|<1 before using the formula, and distinguish total path length from signed displacement in applications. Verify all conditions and state the final result in the requested representation.
5. An infinite series is defined through the limit of its sequence of partial sums.
6. Negative r can produce oscillatory convergence. The sum may lie between successive partial sums.
7. A common error is applying the infinite formula to |r|≥1 or treating the sum as one of the individual terms.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson introduces induction as a proof method for integer-indexed claims.

### Lesson summary

An infinite series is defined through the limit of its sequence of partial sums.

The central condition to remember is this: Negative r can produce oscillatory convergence. The sum may lie between successive partial sums.

**Connection forward.** The next lesson introduces induction as a proof method for integer-indexed claims.

The next lesson is **Mathematical induction**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.10. Mathematical induction

**Learning objective.** Prove statements for all integers in a domain using base case and inductive step.

### The problem that opens the lesson

Prove 1+3+5+...+(2n-1)=n^2.

**Opening solution.** Prove 1+3+5+...+(2n-1)=n^2.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. The relevant conditions are not optional bookkeeping: Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here. Following that structure gives **Verify n=1; assume sum to k is k^2; add 2k+1 to obtain (k+1)^2.**

**Why this works.** The method does not verify examples one by one; it proves a mechanism that carries truth forward indefinitely. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Mathematical induction proves a statement for every integer in a sequence of allowed values.

The base case establishes the first link. The inductive hypothesis assumes one arbitrary case k only for the purpose of proving the next case k+1. Together, these create an unbroken logical chain.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The method does not verify examples one by one; it proves a mechanism that carries truth forward indefinitely.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers.

Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is assuming the k+1 statement or failing to use the inductive hypothesis.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Prove 1+3+5+...+(2n-1)=n^2.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. The relevant conditions are not optional bookkeeping: Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here. Following that structure gives **Verify n=1; assume sum to k is k^2; add 2k+1 to obtain (k+1)^2.**

**Why this works.** The method does not verify examples one by one; it proves a mechanism that carries truth forward indefinitely. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Prove an arithmetic-series identity.

**Worked development.** State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The base case establishes the first link. The inductive hypothesis assumes one arbitrary case k only for the purpose of proving the next case k+1. Together, these create an unbroken logical chain. Then apply the conditions explicitly: Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Induction proves sum formulas, divisibility, inequalities, and recursive identities.

#### Reasoning example

**Problem.** Prove divisibility by induction.

**Worked development.** State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The base case establishes the first link. The inductive hypothesis assumes one arbitrary case k only for the purpose of proving the next case k+1. Together, these create an unbroken logical chain. Then apply the conditions explicitly: Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Induction proves sum formulas, divisibility, inequalities, and recursive identities.

**Worked example 4: quick check.** What does the inductive hypothesis allow you to assume?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. The relevant conditions are not optional bookkeeping: Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here. Following that structure gives **The statement is true for one arbitrary allowed integer k, solely to prove the k+1 case.**

**Why this works.** The method does not verify examples one by one; it proves a mechanism that carries truth forward indefinitely. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.10-V1: Domino-chain logic.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.10-V2: Base-hypothesis-step template.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.10-V3: Invalid circular induction comparison.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Induction proves sum formulas, divisibility, inequalities, and recursive identities.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

What does the inductive hypothesis allow you to assume?

<details><summary>Check</summary>

The statement is true for one arbitrary allowed integer k, solely to prove the k+1 case.

</details>

### Practice set

1. What does the inductive hypothesis allow you to assume?
2. Prove an arithmetic-series identity.
3. Prove divisibility by induction.
4. Diagnose a proof that assumes the k+1 case.
5. State the defining idea behind mathematical induction in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. The statement is true for one arbitrary allowed integer k, solely to prove the k+1 case.
2. Use the method developed in the lesson: State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: State the proposition clearly, prove the base case, write the hypothesis, transform the k+1 case using that hypothesis, and conclude for all permitted integers. Verify all conditions and state the final result in the requested representation.
5. Mathematical induction proves a statement for every integer in a sequence of allowed values.
6. Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here.
7. A common error is assuming the k+1 statement or failing to use the inductive hypothesis.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson studies binomial coefficients and their recursive pattern.

### Lesson summary

Mathematical induction proves a statement for every integer in a sequence of allowed values.

The central condition to remember is this: Strong induction and multiple base cases are useful when a step depends on several earlier cases, but ordinary induction is the main spine here.

**Connection forward.** The next lesson studies binomial coefficients and their recursive pattern.

The next lesson is **Pascal's triangle and binomial coefficients**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.11. Pascal's triangle and binomial coefficients

**Learning objective.** Connect combinations, recursive construction, symmetry, and polynomial coefficients.

### The problem that opens the lesson

Find the coefficient of x^4 in (2+x)^7 without expanding the whole polynomial.

**Opening solution.** Find the coefficient of x^4 in (2+x)^7 without expanding the whole polynomial.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. The relevant conditions are not optional bookkeeping: Row numbering may begin at zero or one in different sources, so always state the convention. Following that structure gives **C(7,4)2^3=35·8=280.**

**Why this works.** Symmetry C(n,k)=C(n,n-k) follows from choosing a subset or choosing its complement. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Pascal’s triangle organizes binomial coefficients, with each interior entry equal to the sum of the two entries above it.

The entry C(n,k) counts selections of k objects from n and also appears as the coefficient of a^{n-k}b^k in (a+b)^n.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Symmetry C(n,k)=C(n,n-k) follows from choosing a subset or choosing its complement.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate.

Row numbering may begin at zero or one in different sources, so always state the convention.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is reversing the powers of a and b or using row n+1 under a row-zero convention.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Find the coefficient of x^4 in (2+x)^7 without expanding the whole polynomial.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. The relevant conditions are not optional bookkeeping: Row numbering may begin at zero or one in different sources, so always state the convention. Following that structure gives **C(7,4)2^3=35·8=280.**

**Why this works.** Symmetry C(n,k)=C(n,n-k) follows from choosing a subset or choosing its complement. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Build Pascal's triangle recursively.

**Worked development.** Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The entry C(n,k) counts selections of k objects from n and also appears as the coefficient of a^{n-k}b^k in (a+b)^n. Then apply the conditions explicitly: Row numbering may begin at zero or one in different sources, so always state the convention. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Binomial coefficients connect algebra, probability, combinatorics, and discrete models.

#### Reasoning example

**Problem.** Interpret C(n,k) combinatorially.

**Worked development.** Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The entry C(n,k) counts selections of k objects from n and also appears as the coefficient of a^{n-k}b^k in (a+b)^n. Then apply the conditions explicitly: Row numbering may begin at zero or one in different sources, so always state the convention. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Binomial coefficients connect algebra, probability, combinatorics, and discrete models.

**Worked example 4: quick check.** What is the sum of entries in row n using row 0 indexing?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. The relevant conditions are not optional bookkeeping: Row numbering may begin at zero or one in different sources, so always state the convention. Following that structure gives **2^n.**

**Why this works.** Symmetry C(n,k)=C(n,n-k) follows from choosing a subset or choosing its complement. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.11-V1: Pascal triangle construction.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.11-V2: Combination-selection interpretation.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.11-V3: Row-to-binomial coefficient mapping.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Binomial coefficients connect algebra, probability, combinatorics, and discrete models.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

What is the sum of entries in row n using row 0 indexing?

<details><summary>Check</summary>

2^n.

</details>

### Practice set

1. What is the sum of entries in row n using row 0 indexing?
2. Build Pascal's triangle recursively.
3. Interpret C(n,k) combinatorially.
4. Use coefficient symmetry C(n,k)=C(n,n-k).
5. State the defining idea behind pascal's triangle and binomial coefficients in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 2^n.
2. Use the method developed in the lesson: Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Use row indexing consistently, connect each entry to a combination, and exploit recursion or factorial formulas as appropriate. Verify all conditions and state the final result in the requested representation.
5. Pascal’s triangle organizes binomial coefficients, with each interior entry equal to the sum of the two entries above it.
6. Row numbering may begin at zero or one in different sources, so always state the convention.
7. A common error is reversing the powers of a and b or using row n+1 under a row-zero convention.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson assembles these coefficients into the binomial theorem.

### Lesson summary

Pascal’s triangle organizes binomial coefficients, with each interior entry equal to the sum of the two entries above it.

The central condition to remember is this: Row numbering may begin at zero or one in different sources, so always state the convention.

**Connection forward.** The next lesson assembles these coefficients into the binomial theorem.

The next lesson is **The binomial theorem and discrete-model synthesis**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## P14.12. The binomial theorem and discrete-model synthesis

**Learning objective.** Expand binomial powers and compare arithmetic, geometric, recursive, and accumulated models.

### The problem that opens the lesson

Find the first four nonzero terms of (1-2x)^8.

**Opening solution.** Find the first four nonzero terms of (1-2x)^8.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. The relevant conditions are not optional bookkeeping: The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later. Following that structure gives **1-16x+112x^2-448x^3+... .**

**Why this works.** A specified term can be found directly without expanding the entire polynomial. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The binomial theorem expands (a+b)^n as a sum of terms C(n,k)a^{n-k}b^k.

As k increases, the exponent of a decreases while the exponent of b increases, and the total degree remains n. Signs alternate automatically when b is negative.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A specified term can be found directly without expanding the entire polynomial.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms.

The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using the target exponent as k without checking whether it belongs to a or b.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Find the first four nonzero terms of (1-2x)^8.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. The relevant conditions are not optional bookkeeping: The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later. Following that structure gives **1-16x+112x^2-448x^3+... .**

**Why this works.** A specified term can be found directly without expanding the entire polynomial. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Use sigma notation for the binomial theorem.

**Worked development.** Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. As k increases, the exponent of a decreases while the exponent of b increases, and the total degree remains n. Signs alternate automatically when b is negative. Then apply the conditions explicitly: The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The binomial theorem supports probability, approximation, combinatorial identities, and polynomial structure.

#### Reasoning example

**Problem.** Find a specified term without full expansion.

**Worked development.** Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. As k increases, the exponent of a decreases while the exponent of b increases, and the total degree remains n. Signs alternate automatically when b is negative. Then apply the conditions explicitly: The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The binomial theorem supports probability, approximation, combinatorial identities, and polynomial structure.

**Worked example 4: quick check.** Find the x^3 coefficient in (3+x)^6.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. The relevant conditions are not optional bookkeeping: The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later. Following that structure gives **C(6,3)3^3=540.**

**Why this works.** A specified term can be found directly without expanding the entire polynomial. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P14.12-V1: Binomial term anatomy.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.12-V2: Coefficient-power balance diagram.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P14.12-V3: Discrete model classification map.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

The binomial theorem supports probability, approximation, combinatorial identities, and polynomial structure.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find the x^3 coefficient in (3+x)^6.

<details><summary>Check</summary>

C(6,3)3^3=540.

</details>

### Practice set

1. Find the x^3 coefficient in (3+x)^6.
2. Use sigma notation for the binomial theorem.
3. Find a specified term without full expansion.
4. Classify a mixed discrete model by differences, ratios, or recurrence.
5. State the defining idea behind the binomial theorem and discrete-model synthesis in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. C(6,3)3^3=540.
2. Use the method developed in the lesson: Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify n, choose k from the requested power, compute the coefficient and powers carefully, and verify symmetry or endpoint terms. Verify all conditions and state the final result in the requested representation.
5. The binomial theorem expands (a+b)^n as a sum of terms C(n,k)a^{n-k}b^k.
6. The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later.
7. A common error is using the target exponent as k without checking whether it belongs to a or b.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next unit synthesizes the course and builds an explicit bridge into Calculus.

### Lesson summary

The binomial theorem expands (a+b)^n as a sum of terms C(n,k)a^{n-k}b^k.

The central condition to remember is this: The theorem assumes nonnegative integer n in this course. Infinite generalized binomial series belong later.

**Connection forward.** The next unit synthesizes the course and builds an explicit bridge into Calculus.

The next lesson is **Function-family classification**.

### Source guidance

Stitz & Zeager, Precalculus, Chapter 9; University of Washington Precalculus, discrete-model problems; AP Precalculus framework, sequence and model connections


---

## Unit investigation

Model a repeated financial, population, medication, or resource process recursively and explicitly where possible. Compare term behavior with accumulated total and determine whether a limiting value exists.

A complete investigation submission must define variables and units, show the mathematical model, include at least two coordinated representations, justify method choices, verify results, and state limitations. A worked instructor solution should include one alternate valid approach and a note identifying the most likely prerequisite failure points.

## Unit review design

The cumulative review should contain 40-55 concrete items: approximately 55 percent current-unit material, 25 percent retrieval from the preceding two units, and 20 percent older course material. At least one cluster must combine symbolic, graphical, and contextual representations without naming the method in the prompt.
