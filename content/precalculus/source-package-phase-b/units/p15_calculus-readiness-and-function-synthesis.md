# Unit P15: Calculus Readiness and Function Synthesis

This unit synthesizes the course around local change, limits, continuity, approximation, and accumulation. The goal is readiness for formal Calculus, not a rushed imitation of it. The governing question is: **How does global function knowledge prepare us to study change locally and accumulation continuously?**

## Unit anchor problem

A model combines a seasonal sinusoid, exponential trend, and measurement discontinuity. Classify every component, determine domain and continuity, estimate local rate at a chosen time, and compare accumulated change with net change.

The anchor problem should remain visible throughout the unit. Each lesson contributes one part of the language or method needed to solve it completely, and the unit investigation asks the learner to build a related model independently.

## Learning path

- **P15.1. Function-family classification**
- **P15.2. Model selection and comparison**
- **P15.3. Average rate of change revisited**
- **P15.4. Difference quotients**
- **P15.5. Secant lines and tangent intuition**
- **P15.6. Local linearity and magnification**
- **P15.7. Intuitive limits**
- **P15.8. Continuity and discontinuity**
- **P15.9. Infinite behavior and asymptotes**
- **P15.10. Numerical approximation and sensitivity**
- **P15.11. Accumulation, finite sums, and area preview**
- **P15.12. Precalculus synthesis capstone**

---

## P15.1. Function-family classification

**Learning objective.** Classify unfamiliar formulas, graphs, tables, and contexts using structural evidence.

### The problem that opens the lesson

A graph is positive, decreasing, concave upward, has domain all reals, and approaches y=2 as x grows. Name plausible families and identify one additional feature needed.

**Opening solution.** A graph is positive, decreasing, concave upward, has domain all reals, and approaches y=2 as x grows. Name plausible families and identify one additional feature needed.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. The relevant conditions are not optional bookkeeping: Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family. Following that structure gives **A shifted exponential decay is plausible; another point or constant ratio evidence would strengthen the classification.**

**Why this works.** A formula may combine families, and a graph may be piecewise, parametric, polar, or discrete rather than one ordinary elementary function. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Function-family classification uses domain, range, transformations, rate patterns, zeros, asymptotes, periodicity, and representation type as evidence.

No single visual feature is always decisive. Several families can share a point, slope, or short-term shape. Strong classification eliminates alternatives by structural invariants.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A formula may combine families, and a graph may be piecewise, parametric, polar, or discrete rather than one ordinary elementary function.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed.

Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is choosing a family from silhouette alone or from the chapter where the problem happens to appear.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A graph is positive, decreasing, concave upward, has domain all reals, and approaches y=2 as x grows. Name plausible families and identify one additional feature needed.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. The relevant conditions are not optional bookkeeping: Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family. Following that structure gives **A shifted exponential decay is plausible; another point or constant ratio evidence would strengthen the classification.**

**Why this works.** A formula may combine families, and a graph may be piecewise, parametric, polar, or discrete rather than one ordinary elementary function. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Classify a rational graph from holes and asymptotes.

**Worked development.** Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. No single visual feature is always decisive. Several families can share a point, slope, or short-term shape. Strong classification eliminates alternatives by structural invariants. Then apply the conditions explicitly: Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Family recognition is the organizing skill behind all of Precalculus and the first step in many Calculus problems.

#### Reasoning example

**Problem.** Classify a periodic table.

**Worked development.** Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. No single visual feature is always decisive. Several families can share a point, slope, or short-term shape. Strong classification eliminates alternatives by structural invariants. Then apply the conditions explicitly: Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Family recognition is the organizing skill behind all of Precalculus and the first step in many Calculus problems.

**Worked example 4: quick check.** Which feature most strongly separates polynomial from exponential end behavior?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. The relevant conditions are not optional bookkeeping: Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family. Following that structure gives **Exponential constant-ratio growth and one-sided horizontal asymptote behavior, rather than power-law end behavior.**

**Why this works.** A formula may combine families, and a graph may be piecewise, parametric, polar, or discrete rather than one ordinary elementary function. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.1-V1: Cross-family feature matrix.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.1-V2: Unknown graph evidence board.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.1-V3: Competing-family elimination tree.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Family recognition is the organizing skill behind all of Precalculus and the first step in many Calculus problems.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Which feature most strongly separates polynomial from exponential end behavior?

<details><summary>Check</summary>

Exponential constant-ratio growth and one-sided horizontal asymptote behavior, rather than power-law end behavior.

</details>

### Practice set

1. Which feature most strongly separates polynomial from exponential end behavior?
2. Classify a rational graph from holes and asymptotes.
3. Classify a periodic table.
4. Distinguish parametric path from ordinary function graph.
5. State the defining idea behind function-family classification in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Exponential constant-ratio growth and one-sided horizontal asymptote behavior, rather than power-law end behavior.
2. Use the method developed in the lesson: Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Inventory domain and restrictions, inspect differences or ratios, identify symmetry and end behavior, and state both the best candidate and the evidence still needed. Verify all conditions and state the final result in the requested representation.
5. Function-family classification uses domain, range, transformations, rate patterns, zeros, asymptotes, periodicity, and representation type as evidence.
6. Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family.
7. A common error is choosing a family from silhouette alone or from the chapter where the problem happens to appear.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson compares candidate models more formally.

### Lesson summary

Function-family classification uses domain, range, transformations, rate patterns, zeros, asymptotes, periodicity, and representation type as evidence.

The central condition to remember is this: Classification is a model-selection claim, not a demand that every data set belong perfectly to one named family.

**Connection forward.** The next lesson compares candidate models more formally.

The next lesson is **Model selection and comparison**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.2. Model selection and comparison

**Learning objective.** Select and compare function models using patterns, residuals, domains, and parameter meanings.

### The problem that opens the lesson

Three models fit the same ten data points: linear, exponential, and logistic. What evidence should decide among them?

**Opening solution.** Three models fit the same ten data points: linear, exponential, and logistic. What evidence should decide among them?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. The relevant conditions are not optional bookkeeping: A more complicated model can overfit noise. A simpler model can miss real structure. Following that structure gives **Residual patterns, parameter plausibility, domain, long-run behavior, and mechanism.**

**Why this works.** Two models can fit the observed interval similarly while producing radically different extrapolations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Model selection compares how well different function families explain data, structure, and context.

Residual size matters, but so do residual pattern, parameter meaning, domain behavior, long-run prediction, simplicity, and mechanism.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Two models can fit the observed interval similarly while producing radically different extrapolations.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations.

A more complicated model can overfit noise. A simpler model can miss real structure.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is choosing the highest fit statistic without evaluating plausibility or uncertainty.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Three models fit the same ten data points: linear, exponential, and logistic. What evidence should decide among them?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. The relevant conditions are not optional bookkeeping: A more complicated model can overfit noise. A simpler model can miss real structure. Following that structure gives **Residual patterns, parameter plausibility, domain, long-run behavior, and mechanism.**

**Why this works.** Two models can fit the observed interval similarly while producing radically different extrapolations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Compare sinusoidal and polynomial seasonal fits.

**Worked development.** Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Residual size matters, but so do residual pattern, parameter meaning, domain behavior, long-run prediction, simplicity, and mechanism. Then apply the conditions explicitly: A more complicated model can overfit noise. A simpler model can miss real structure. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Model comparison supports scientific reasoning, economics, engineering, and data analysis.

#### Reasoning example

**Problem.** Reject a rational model with a contextual asymptote.

**Worked development.** Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Residual size matters, but so do residual pattern, parameter meaning, domain behavior, long-run prediction, simplicity, and mechanism. Then apply the conditions explicitly: A more complicated model can overfit noise. A simpler model can miss real structure. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Model comparison supports scientific reasoning, economics, engineering, and data analysis.

**Worked example 4: quick check.** Name two reasons to reject a numerically good fit.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. The relevant conditions are not optional bookkeeping: A more complicated model can overfit noise. A simpler model can miss real structure. Following that structure gives **Implausible parameters, wrong domain behavior, systematic residuals, or unsupported extrapolation.**

**Why this works.** Two models can fit the observed interval similarly while producing radically different extrapolations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.2-V1: Competing fits and extrapolation.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.2-V2: Residual-pattern comparison.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.2-V3: Parameter plausibility checklist.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Model comparison supports scientific reasoning, economics, engineering, and data analysis.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Name two reasons to reject a numerically good fit.

<details><summary>Check</summary>

Implausible parameters, wrong domain behavior, systematic residuals, or unsupported extrapolation.

</details>

### Practice set

1. Name two reasons to reject a numerically good fit.
2. Compare sinusoidal and polynomial seasonal fits.
3. Reject a rational model with a contextual asymptote.
4. Explain why lowest residual sum alone may be insufficient.
5. State the defining idea behind model selection and comparison in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Implausible parameters, wrong domain behavior, systematic residuals, or unsupported extrapolation.
2. Use the method developed in the lesson: Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Define the decision question, fit or derive candidates, inspect residuals, interpret parameters, test domain and limiting behavior, and defend one model with stated limitations. Verify all conditions and state the final result in the requested representation.
5. Model selection compares how well different function families explain data, structure, and context.
6. A more complicated model can overfit noise. A simpler model can miss real structure.
7. A common error is choosing the highest fit statistic without evaluating plausibility or uncertainty.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson revisits average rate of change across function families.

### Lesson summary

Model selection compares how well different function families explain data, structure, and context.

The central condition to remember is this: A more complicated model can overfit noise. A simpler model can miss real structure.

**Connection forward.** The next lesson revisits average rate of change across function families.

The next lesson is **Average rate of change revisited**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.3. Average rate of change revisited

**Learning objective.** Compare average rates across function families and interpret units and interval dependence.

### The problem that opens the lesson

Compare average rate of change of x^2, 2^x, and sin x from x=0 to x=1.

**Opening solution.** Compare average rate of change of x^2, 2^x, and sin x from x=0 to x=1.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. The relevant conditions are not optional bookkeeping: Average rate does not equal average output and does not describe instantaneous behavior. Following that structure gives **x^2:1; 2^x:1; sin x:sin1. Equal endpoint rates can hide different interior behavior.**

**Why this works.** Units are output units per input unit, and the secant line gives the graphical interpretation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Average rate of change measures net output change per input change over a finite interval.

The same average rate can arise from very different interior paths. Comparing intervals reveals whether change is constant, accelerating, decelerating, oscillatory, or irregular.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Units are output units per input unit, and the secant line gives the graphical interpretation.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model.

Average rate does not equal average output and does not describe instantaneous behavior.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is calculating [f(b)-f(a)]/(b-a) correctly but interpreting it as the function’s value or as a constant rate everywhere.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Compare average rate of change of x^2, 2^x, and sin x from x=0 to x=1.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. The relevant conditions are not optional bookkeeping: Average rate does not equal average output and does not describe instantaneous behavior. Following that structure gives **x^2:1; 2^x:1; sin x:sin1. Equal endpoint rates can hide different interior behavior.**

**Why this works.** Units are output units per input unit, and the secant line gives the graphical interpretation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Compare rates over shrinking intervals.

**Worked development.** Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The same average rate can arise from very different interior paths. Comparing intervals reveals whether change is constant, accelerating, decelerating, oscillatory, or irregular. Then apply the conditions explicitly: Average rate does not equal average output and does not describe instantaneous behavior. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Average rates bridge Precalculus models with derivative concepts.

#### Reasoning example

**Problem.** Interpret a negative average rate in context.

**Worked development.** Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The same average rate can arise from very different interior paths. Comparing intervals reveals whether change is constant, accelerating, decelerating, oscillatory, or irregular. Then apply the conditions explicitly: Average rate does not equal average output and does not describe instantaneous behavior. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Average rates bridge Precalculus models with derivative concepts.

**Worked example 4: quick check.** Find average rate of ln x from 1 to e.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. The relevant conditions are not optional bookkeeping: Average rate does not equal average output and does not describe instantaneous behavior. Following that structure gives **1/(e-1).**

**Why this works.** Units are output units per input unit, and the secant line gives the graphical interpretation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.3-V1: Secants across multiple families.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.3-V2: Rate units ladder.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.3-V3: Same average, different interior paths.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Average rates bridge Precalculus models with derivative concepts.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find average rate of ln x from 1 to e.

<details><summary>Check</summary>

1/(e-1).

</details>

### Practice set

1. Find average rate of ln x from 1 to e.
2. Compare rates over shrinking intervals.
3. Interpret a negative average rate in context.
4. Relate a secant slope to a table difference quotient.
5. State the defining idea behind average rate of change revisited in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 1/(e-1).
2. Use the method developed in the lesson: Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Compute endpoint values exactly when possible, form a consistent difference quotient, interpret sign and units, and compare with another interval or model. Verify all conditions and state the final result in the requested representation.
5. Average rate of change measures net output change per input change over a finite interval.
6. Average rate does not equal average output and does not describe instantaneous behavior.
7. A common error is calculating [f(b)-f(a)]/(b-a) correctly but interpreting it as the function’s value or as a constant rate everywhere.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson lets the interval begin at a variable input and have width h.

### Lesson summary

Average rate of change measures net output change per input change over a finite interval.

The central condition to remember is this: Average rate does not equal average output and does not describe instantaneous behavior.

**Connection forward.** The next lesson lets the interval begin at a variable input and have width h.

The next lesson is **Difference quotients**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.4. Difference quotients

**Learning objective.** Construct and simplify [f(x+h)-f(x)]/h and interpret its components.

### The problem that opens the lesson

Simplify the difference quotient for f(x)=x^2-3x.

**Opening solution.** Simplify the difference quotient for f(x)=x^2-3x.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. The relevant conditions are not optional bookkeeping: Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0. Following that structure gives **2x+h-3, for h≠0.**

**Why this works.** Polynomial quotients use expansion and factoring; rational quotients use common denominators; radical quotients often use conjugates. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The difference quotient [f(x+h)-f(x)]/h is the average rate of change over an interval of width h beginning at x.

Algebraic simplification often cancels h, revealing how the secant slope depends on x and interval width. The original quotient still requires h≠0.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Polynomial quotients use expansion and factoring; rational quotients use common denominators; radical quotients often use conjugates.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0.

Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is expanding f(x+h) as f(x)+f(h) or failing to distribute the subtraction.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Simplify the difference quotient for f(x)=x^2-3x.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. The relevant conditions are not optional bookkeeping: Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0. Following that structure gives **2x+h-3, for h≠0.**

**Why this works.** Polynomial quotients use expansion and factoring; rational quotients use common denominators; radical quotients often use conjugates. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Difference quotient for 1/x.

**Worked development.** Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Algebraic simplification often cancels h, revealing how the secant slope depends on x and interval width. The original quotient still requires h≠0. Then apply the conditions explicitly: Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Difference quotients are the algebraic raw material of derivatives.

#### Reasoning example

**Problem.** Difference quotient for sqrt(x) using conjugates.

**Worked development.** Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Algebraic simplification often cancels h, revealing how the secant slope depends on x and interval width. The original quotient still requires h≠0. Then apply the conditions explicitly: Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Difference quotients are the algebraic raw material of derivatives.

**Worked example 4: quick check.** Simplify the difference quotient for f(x)=3x+5.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. The relevant conditions are not optional bookkeeping: Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0. Following that structure gives **3.**

**Why this works.** Polynomial quotients use expansion and factoring; rational quotients use common denominators; radical quotients often use conjugates. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.4-V1: Two-point secant geometry.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.4-V2: Algebraic cancellation mechanism.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.4-V3: h approaching zero without equaling zero.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Difference quotients are the algebraic raw material of derivatives.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Simplify the difference quotient for f(x)=3x+5.

<details><summary>Check</summary>

3.

</details>

### Practice set

1. Simplify the difference quotient for f(x)=3x+5.
2. Difference quotient for 1/x.
3. Difference quotient for sqrt(x) using conjugates.
4. Interpret h as interval width.
5. State the defining idea behind difference quotients in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 3.
2. Use the method developed in the lesson: Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Write f(x+h) with full grouping, subtract the entire f(x), factor or rationalize, cancel only common factors, and retain h≠0. Verify all conditions and state the final result in the requested representation.
5. The difference quotient [f(x+h)-f(x)]/h is the average rate of change over an interval of width h beginning at x.
6. Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0.
7. A common error is expanding f(x+h) as f(x)+f(h) or failing to distribute the subtraction.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson examines their behavior as h approaches zero.

### Lesson summary

The difference quotient [f(x+h)-f(x)]/h is the average rate of change over an interval of width h beginning at x.

The central condition to remember is this: Cancellation creates a simplified formula for nonzero h; it does not define the original secant at h=0.

**Connection forward.** The next lesson examines their behavior as h approaches zero.

The next lesson is **Secant lines and tangent intuition**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.5. Secant lines and tangent intuition

**Learning objective.** Interpret tangent slope as a limiting value of secant slopes.

### The problem that opens the lesson

For f(x)=x^2 at x=2, calculate secant slopes using h=1,0.5,0.1,0.01 and predict the tangent slope.

**Opening solution.** For f(x)=x^2 at x=2, calculate secant slopes using h=1,0.5,0.1,0.01 and predict the tangent slope.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. The relevant conditions are not optional bookkeeping: Approaching zero is not the same as substituting h=0 into the original quotient. Following that structure gives **Slopes 5,4.5,4.1,4.01 approach 4.**

**Why this works.** Left and right approaches can disagree at corners, while slopes can grow without bound near vertical tangents. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A secant line passes through two graph points; a tangent line describes local direction at one point.

As the second point approaches the first, secant slopes may approach a limiting value. That value becomes the tangent slope in Calculus.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Left and right approaches can disagree at corners, while slopes can grow without bound near vertical tangents.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph.

Approaching zero is not the same as substituting h=0 into the original quotient.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is drawing any line that touches the graph once and calling it tangent, even when it crosses nearby or lacks the correct local slope.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** For f(x)=x^2 at x=2, calculate secant slopes using h=1,0.5,0.1,0.01 and predict the tangent slope.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. The relevant conditions are not optional bookkeeping: Approaching zero is not the same as substituting h=0 into the original quotient. Following that structure gives **Slopes 5,4.5,4.1,4.01 approach 4.**

**Why this works.** Left and right approaches can disagree at corners, while slopes can grow without bound near vertical tangents. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Compare left and right secants at |x| near 0.

**Worked development.** Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. As the second point approaches the first, secant slopes may approach a limiting value. That value becomes the tangent slope in Calculus. Then apply the conditions explicitly: Approaching zero is not the same as substituting h=0 into the original quotient. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Secant-to-tangent reasoning motivates derivatives, velocity, and local approximation.

#### Reasoning example

**Problem.** Identify a vertical tangent candidate.

**Worked development.** Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. As the second point approaches the first, secant slopes may approach a limiting value. That value becomes the tangent slope in Calculus. Then apply the conditions explicitly: Approaching zero is not the same as substituting h=0 into the original quotient. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Secant-to-tangent reasoning motivates derivatives, velocity, and local approximation.

**Worked example 4: quick check.** What do left and right secant slopes suggest for f(x)=|x| at 0?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. The relevant conditions are not optional bookkeeping: Approaching zero is not the same as substituting h=0 into the original quotient. Following that structure gives **They approach -1 and 1, so no single tangent slope exists.**

**Why this works.** Left and right approaches can disagree at corners, while slopes can grow without bound near vertical tangents. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.5-V1: Dynamic secant approaching tangent.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.5-V2: Left/right slope table.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.5-V3: Corner and vertical tangent comparison.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Secant-to-tangent reasoning motivates derivatives, velocity, and local approximation.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

What do left and right secant slopes suggest for f(x)=|x| at 0?

<details><summary>Check</summary>

They approach -1 and 1, so no single tangent slope exists.

</details>

### Practice set

1. What do left and right secant slopes suggest for f(x)=|x| at 0?
2. Compare left and right secants at |x| near 0.
3. Identify a vertical tangent candidate.
4. Explain why h cannot equal zero in a secant quotient.
5. State the defining idea behind secant lines and tangent intuition in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. They approach -1 and 1, so no single tangent slope exists.
2. Use the method developed in the lesson: Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Compute a table of secant slopes for positive and negative h, compare the trends, and support the numerical evidence with a graph. Verify all conditions and state the final result in the requested representation.
5. A secant line passes through two graph points; a tangent line describes local direction at one point.
6. Approaching zero is not the same as substituting h=0 into the original quotient.
7. A common error is drawing any line that touches the graph once and calling it tangent, even when it crosses nearby or lacks the correct local slope.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson explains why smooth curves often look linear under magnification.

### Lesson summary

A secant line passes through two graph points; a tangent line describes local direction at one point.

The central condition to remember is this: Approaching zero is not the same as substituting h=0 into the original quotient.

**Connection forward.** The next lesson explains why smooth curves often look linear under magnification.

The next lesson is **Local linearity and magnification**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.6. Local linearity and magnification

**Learning objective.** Recognize when a smooth graph appears linear under magnification and identify failures of local linearity.

### The problem that opens the lesson

Zoom around x=1 on y=x^2 and build the tangent-line approximation from the predicted slope 2.

**Opening solution.** Zoom around x=1 on y=x^2 and build the tangent-line approximation from the predicted slope 2.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. The relevant conditions are not optional bookkeeping: A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability. Following that structure gives **L(x)=1+2(x-1)=2x-1.**

**Why this works.** Corners, cusps, discontinuities, and violent oscillation can defeat a single local line. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Local linearity is the tendency of a smooth function to resemble its tangent line over a sufficiently small interval.

A linear approximation uses a known value and local slope: L(x)=f(a)+m(x-a). The approximation error usually shrinks as x moves closer to a for differentiable functions.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Corners, cusps, discontinuities, and violent oscillation can defeat a single local line.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend.

A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using the secant slope from a large interval as though it were a local tangent slope.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Zoom around x=1 on y=x^2 and build the tangent-line approximation from the predicted slope 2.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. The relevant conditions are not optional bookkeeping: A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability. Following that structure gives **L(x)=1+2(x-1)=2x-1.**

**Why this works.** Corners, cusps, discontinuities, and violent oscillation can defeat a single local line. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Compare approximation errors at x=1.1 and 1.01.

**Worked development.** Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. A linear approximation uses a known value and local slope: L(x)=f(a)+m(x-a). The approximation error usually shrinks as x moves closer to a for differentiable functions. Then apply the conditions explicitly: A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Local linearity supports estimation, measurement error analysis, and the conceptual meaning of derivatives.

#### Reasoning example

**Problem.** Analyze a corner at |x|.

**Worked development.** Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. A linear approximation uses a known value and local slope: L(x)=f(a)+m(x-a). The approximation error usually shrinks as x moves closer to a for differentiable functions. Then apply the conditions explicitly: A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Local linearity supports estimation, measurement error analysis, and the conceptual meaning of derivatives.

**Worked example 4: quick check.** Use local linearity for sqrt(x) near x=9 with slope about 1/6 to estimate sqrt(9.3).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. The relevant conditions are not optional bookkeeping: A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability. Following that structure gives **Approximately 3+0.3/6=3.05.**

**Why this works.** Corners, cusps, discontinuities, and violent oscillation can defeat a single local line. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.6-V1: Progressive graph zoom.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.6-V2: Function and local line overlay.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.6-V3: Smooth versus corner/cusp/discontinuity gallery.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Local linearity supports estimation, measurement error analysis, and the conceptual meaning of derivatives.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Use local linearity for sqrt(x) near x=9 with slope about 1/6 to estimate sqrt(9.3).

<details><summary>Check</summary>

Approximately 3+0.3/6=3.05.

</details>

### Practice set

1. Use local linearity for sqrt(x) near x=9 with slope about 1/6 to estimate sqrt(9.3).
2. Compare approximation errors at x=1.1 and 1.01.
3. Analyze a corner at |x|.
4. Analyze oscillation of x sin(1/x) near zero conceptually.
5. State the defining idea behind local linearity and magnification in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Approximately 3+0.3/6=3.05.
2. Use the method developed in the lesson: Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify the anchor point and slope, write the line, compare exact and approximate values at several distances, and describe the error trend. Verify all conditions and state the final result in the requested representation.
5. Local linearity is the tendency of a smooth function to resemble its tangent line over a sufficiently small interval.
6. A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability.
7. A common error is using the secant slope from a large interval as though it were a local tangent slope.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson formalizes the idea of values approached near an input.

### Lesson summary

Local linearity is the tendency of a smooth function to resemble its tangent line over a sufficiently small interval.

The central condition to remember is this: A graph appearing linear at one screen resolution is visual evidence, not a proof of differentiability.

**Connection forward.** The next lesson formalizes the idea of values approached near an input.

The next lesson is **Intuitive limits**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.7. Intuitive limits

**Learning objective.** Estimate limits from tables, graphs, and algebra while distinguishing approached value from function value.

### The problem that opens the lesson

Evaluate the limiting value of (x^2-1)/(x-1) as x approaches 1, and compare with the function value at 1.

**Opening solution.** Evaluate the limiting value of (x^2-1)/(x-1) as x approaches 1, and compare with the function value at 1.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). The relevant conditions are not optional bookkeeping: A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus. Following that structure gives **Expression simplifies to x+1 for x≠1, so limit 2; original function undefined at 1.**

**Why this works.** Factoring and cancellation can reveal the behavior near a removable hole, while conjugates or common denominators can remove other indeterminate forms. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A limit describes the value a function approaches as the input approaches a target, regardless of whether the function equals that value at the target.

Graphs, tables, and algebra provide complementary evidence. One-sided limits must agree for a finite two-sided limit to exist.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Factoring and cancellation can reveal the behavior near a removable hole, while conjugates or common denominators can remove other indeterminate forms.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c).

A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is substituting immediately, obtaining 0/0, and declaring the limit zero or nonexistent.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Evaluate the limiting value of (x^2-1)/(x-1) as x approaches 1, and compare with the function value at 1.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). The relevant conditions are not optional bookkeeping: A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus. Following that structure gives **Expression simplifies to x+1 for x≠1, so limit 2; original function undefined at 1.**

**Why this works.** Factoring and cancellation can reveal the behavior near a removable hole, while conjugates or common denominators can remove other indeterminate forms. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Estimate a one-sided limit at a jump.

**Worked development.** Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Graphs, tables, and algebra provide complementary evidence. One-sided limits must agree for a finite two-sided limit to exist. Then apply the conditions explicitly: A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Limits organize continuity, derivatives, asymptotes, and infinite processes.

#### Reasoning example

**Problem.** Analyze a limit from a value table.

**Worked development.** Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Graphs, tables, and algebra provide complementary evidence. One-sided limits must agree for a finite two-sided limit to exist. Then apply the conditions explicitly: A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Limits organize continuity, derivatives, asymptotes, and infinite processes.

**Worked example 4: quick check.** Can a limit exist when the function is undefined at the point?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). The relevant conditions are not optional bookkeeping: A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus. Following that structure gives **Yes.**

**Why this works.** Factoring and cancellation can reveal the behavior near a removable hole, while conjugates or common denominators can remove other indeterminate forms. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.7-V1: Approach arrows toward a hole.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.7-V2: One-sided jump comparison.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.7-V3: Table values approaching a target.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Limits organize continuity, derivatives, asymptotes, and infinite processes.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Can a limit exist when the function is undefined at the point?

<details><summary>Check</summary>

Yes.

</details>

### Practice set

1. Can a limit exist when the function is undefined at the point?
2. Estimate a one-sided limit at a jump.
3. Analyze a limit from a value table.
4. Use conjugate rationalization for a radical limit.
5. State the defining idea behind intuitive limits in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Yes.
2. Use the method developed in the lesson: Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Inspect left and right behavior, simplify only on a punctured neighborhood, and distinguish the limit from f(c). Verify all conditions and state the final result in the requested representation.
5. A limit describes the value a function approaches as the input approaches a target, regardless of whether the function equals that value at the target.
6. A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus.
7. A common error is substituting immediately, obtaining 0/0, and declaring the limit zero or nonexistent.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson uses limits and function values to classify continuity.

### Lesson summary

A limit describes the value a function approaches as the input approaches a target, regardless of whether the function equals that value at the target.

The central condition to remember is this: A table can suggest a limit but finite decimal evidence cannot prove it. Formal definitions come in Calculus.

**Connection forward.** The next lesson uses limits and function values to classify continuity.

The next lesson is **Continuity and discontinuity**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.8. Continuity and discontinuity

**Learning objective.** Classify removable, jump, infinite, and endpoint discontinuities using function values and limiting behavior.

### The problem that opens the lesson

Choose k so that f(x)=(x^2-4)/(x-2) for x≠2 and f(2)=k is continuous.

**Opening solution.** Choose k so that f(x)=(x^2-4)/(x-2) for x≠2 and f(2)=k is continuous.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. The relevant conditions are not optional bookkeeping: Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain. Following that structure gives **k=4.**

**Why this works.** At domain endpoints, one-sided continuity is the relevant concept. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A function is continuous at an interior point c when f(c) exists, the two-sided limit exists, and the limit equals f(c).

Removable discontinuities have a common approached value but a missing or incorrect point. Jump discontinuities have unequal one-sided limits. Infinite discontinuities involve unbounded behavior.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

At domain endpoints, one-sided continuity is the relevant concept.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it.

Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is calling a graph discontinuous merely because it has a sharp corner; corners can be continuous.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Choose k so that f(x)=(x^2-4)/(x-2) for x≠2 and f(2)=k is continuous.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. The relevant conditions are not optional bookkeeping: Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain. Following that structure gives **k=4.**

**Why this works.** At domain endpoints, one-sided continuity is the relevant concept. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Classify a piecewise jump.

**Worked development.** Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Removable discontinuities have a common approached value but a missing or incorrect point. Jump discontinuities have unequal one-sided limits. Infinite discontinuities involve unbounded behavior. Then apply the conditions explicitly: Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Continuity supports existence arguments, model reliability, and later theorems of Calculus.

#### Reasoning example

**Problem.** Classify a rational vertical asymptote.

**Worked development.** Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Removable discontinuities have a common approached value but a missing or incorrect point. Jump discontinuities have unequal one-sided limits. Infinite discontinuities involve unbounded behavior. Then apply the conditions explicitly: Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Continuity supports existence arguments, model reliability, and later theorems of Calculus.

**Worked example 4: quick check.** What three conditions are needed for continuity at an interior point c?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. The relevant conditions are not optional bookkeeping: Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain. Following that structure gives **f(c) exists, the limit exists, and the limit equals f(c).**

**Why this works.** At domain endpoints, one-sided continuity is the relevant concept. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.8-V1: Continuity three-condition checklist.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.8-V2: Discontinuity gallery.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.8-V3: Piecewise boundary repair.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Continuity supports existence arguments, model reliability, and later theorems of Calculus.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

What three conditions are needed for continuity at an interior point c?

<details><summary>Check</summary>

f(c) exists, the limit exists, and the limit equals f(c).

</details>

### Practice set

1. What three conditions are needed for continuity at an interior point c?
2. Classify a piecewise jump.
3. Classify a rational vertical asymptote.
4. Check continuity at a domain endpoint.
5. State the defining idea behind continuity and discontinuity in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. f(c) exists, the limit exists, and the limit equals f(c).
2. Use the method developed in the lesson: Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Check the function value, left limit, and right limit separately, then classify the first failed condition and determine whether a redefinition can repair it. Verify all conditions and state the final result in the requested representation.
5. A function is continuous at an interior point c when f(c) exists, the two-sided limit exists, and the limit equals f(c).
6. Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain.
7. A common error is calling a graph discontinuous merely because it has a sharp corner; corners can be continuous.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson compares different forms of infinite and asymptotic behavior.

### Lesson summary

A function is continuous at an interior point c when f(c) exists, the two-sided limit exists, and the limit equals f(c).

The central condition to remember is this: Continuity depends on the declared domain. A function can be continuous everywhere in its domain while having excluded endpoints or asymptotes outside that domain.

**Connection forward.** The next lesson compares different forms of infinite and asymptotic behavior.

The next lesson is **Infinite behavior and asymptotes**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.9. Infinite behavior and asymptotes

**Learning objective.** Synthesize finite and infinite input behavior across polynomial, rational, exponential, logarithmic, and trigonometric families.

### The problem that opens the lesson

Compare x^3, 2^x, ln x, and sin x as x approaches infinity.

**Opening solution.** Compare x^3, 2^x, ln x, and sin x as x approaches infinity.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. The relevant conditions are not optional bookkeeping: Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input. Following that structure gives **x^3 and 2^x grow unbounded with exponential eventually faster; ln x grows slowly; sin x oscillates and has no limit.**

**Why this works.** Vertical asymptotes concern input approaching a finite excluded value; horizontal or polynomial asymptotes concern large input behavior. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Infinite behavior distinguishes large input from large output and separates divergence, asymptotic approach, and oscillation.

Polynomial powers, exponentials, logarithms, rationals, and trig functions exhibit different growth and limiting patterns. A function can fail to have a limit while remaining bounded, as sine does at infinity.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Vertical asymptotes concern input approaching a finite excluded value; horizontal or polynomial asymptotes concern large input behavior.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number.

Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is saying a graph “has a limit of infinity” without identifying direction or whether the behavior oscillates.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Compare x^3, 2^x, ln x, and sin x as x approaches infinity.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. The relevant conditions are not optional bookkeeping: Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input. Following that structure gives **x^3 and 2^x grow unbounded with exponential eventually faster; ln x grows slowly; sin x oscillates and has no limit.**

**Why this works.** Vertical asymptotes concern input approaching a finite excluded value; horizontal or polynomial asymptotes concern large input behavior. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Compare vertical asymptote and output-to-infinity statements.

**Worked development.** State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Polynomial powers, exponentials, logarithms, rationals, and trig functions exhibit different growth and limiting patterns. A function can fail to have a limit while remaining bounded, as sine does at infinity. Then apply the conditions explicitly: Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Infinite behavior prepares students for limits, improper processes, and asymptotic model comparison.

#### Reasoning example

**Problem.** Analyze rational end behavior.

**Worked development.** State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Polynomial powers, exponentials, logarithms, rationals, and trig functions exhibit different growth and limiting patterns. A function can fail to have a limit while remaining bounded, as sine does at infinity. Then apply the conditions explicitly: Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Infinite behavior prepares students for limits, improper processes, and asymptotic model comparison.

**Worked example 4: quick check.** Does sin x have a limit as x approaches infinity?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. The relevant conditions are not optional bookkeeping: Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input. Following that structure gives **No; it continues oscillating.**

**Why this works.** Vertical asymptotes concern input approaching a finite excluded value; horizontal or polynomial asymptotes concern large input behavior. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.9-V1: Cross-family end-behavior chart.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.9-V2: Vertical versus horizontal approach.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.9-V3: Oscillation-without-limit panel.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Infinite behavior prepares students for limits, improper processes, and asymptotic model comparison.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Does sin x have a limit as x approaches infinity?

<details><summary>Check</summary>

No; it continues oscillating.

</details>

### Practice set

1. Does sin x have a limit as x approaches infinity?
2. Compare vertical asymptote and output-to-infinity statements.
3. Analyze rational end behavior.
4. Explain why oscillation can prevent a limit without unboundedness.
5. State the defining idea behind infinite behavior and asymptotes in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. No; it continues oscillating.
2. Use the method developed in the lesson: State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: State the input direction and output behavior explicitly, compare leading structures, and avoid using the infinity symbol as though it were an ordinary number. Verify all conditions and state the final result in the requested representation.
5. Infinite behavior distinguishes large input from large output and separates divergence, asymptotic approach, and oscillation.
6. Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input.
7. A common error is saying a graph “has a limit of infinity” without identifying direction or whether the behavior oscillates.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson studies numerical approximation and sensitivity when exact analysis is unavailable.

### Lesson summary

Infinite behavior distinguishes large input from large output and separates divergence, asymptotic approach, and oscillation.

The central condition to remember is this: Growth-rate comparisons depend on the direction and domain. Exponential growth eventually dominates polynomial growth for positive large input.

**Connection forward.** The next lesson studies numerical approximation and sensitivity when exact analysis is unavailable.

The next lesson is **Numerical approximation and sensitivity**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.10. Numerical approximation and sensitivity

**Learning objective.** Use bracketing, iteration, finite differences, and residuals while evaluating sensitivity to rounding and parameter error.

### The problem that opens the lesson

A model predicts y=1000e^{0.08t}. Compare the time to reach 2000 when the rate is 0.08 versus 0.081.

**Opening solution.** A model predicts y=1000e^{0.08t}. Compare the time to reach 2000 when the rate is 0.08 versus 0.081.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. The relevant conditions are not optional bookkeeping: A rounded display does not reveal the algorithm or guarantee that all solutions were found. Following that structure gives **t=ln2/r; the small parameter change produces a measurable time difference.**

**Why this works.** Sensitivity asks how input, parameter, or rounding changes affect the output. Some models amplify small errors dramatically. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Numerical approximation replaces an exact unknown with a controlled estimate and evidence about its error.

Bracketing methods guarantee a root interval when continuity and a sign change apply. Iterative methods can converge quickly but depend on starting values and stability.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Sensitivity asks how input, parameter, or rounding changes affect the output. Some models amplify small errors dramatically.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity.

A rounded display does not reveal the algorithm or guarantee that all solutions were found.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is reporting many decimal digits unsupported by data or method accuracy.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A model predicts y=1000e^{0.08t}. Compare the time to reach 2000 when the rate is 0.08 versus 0.081.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. The relevant conditions are not optional bookkeeping: A rounded display does not reveal the algorithm or guarantee that all solutions were found. Following that structure gives **t=ln2/r; the small parameter change produces a measurable time difference.**

**Why this works.** Sensitivity asks how input, parameter, or rounding changes affect the output. Some models amplify small errors dramatically. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Bracket a root with bisection.

**Worked development.** State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Bracketing methods guarantee a root interval when continuity and a sign change apply. Iterative methods can converge quickly but depend on starting values and stability. Then apply the conditions explicitly: A rounded display does not reveal the algorithm or guarantee that all solutions were found. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Numerical reasoning supports roots, regression, inverse models, engineering tolerances, and computational Calculus.

#### Reasoning example

**Problem.** Use one iteration rule and inspect convergence.

**Worked development.** State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Bracketing methods guarantee a root interval when continuity and a sign change apply. Iterative methods can converge quickly but depend on starting values and stability. Then apply the conditions explicitly: A rounded display does not reveal the algorithm or guarantee that all solutions were found. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Numerical reasoning supports roots, regression, inverse models, engineering tolerances, and computational Calculus.

**Worked example 4: quick check.** Why should exact values be retained until late in a calculation?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. The relevant conditions are not optional bookkeeping: A rounded display does not reveal the algorithm or guarantee that all solutions were found. Following that structure gives **To avoid compounding rounding error and preserve structure.**

**Why this works.** Sensitivity asks how input, parameter, or rounding changes affect the output. Some models amplify small errors dramatically. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.10-V1: Bisection interval tree.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.10-V2: Parameter sensitivity curves.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.10-V3: Rounding-error accumulation table.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Numerical reasoning supports roots, regression, inverse models, engineering tolerances, and computational Calculus.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Why should exact values be retained until late in a calculation?

<details><summary>Check</summary>

To avoid compounding rounding error and preserve structure.

</details>

### Practice set

1. Why should exact values be retained until late in a calculation?
2. Bracket a root with bisection.
3. Use one iteration rule and inspect convergence.
4. Propagate rounding through a multistep model.
5. State the defining idea behind numerical approximation and sensitivity in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. To avoid compounding rounding error and preserve structure.
2. Use the method developed in the lesson: State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: State the method, interval or starting value, stopping criterion, precision, and residual. Compare nearby parameter values to quantify sensitivity. Verify all conditions and state the final result in the requested representation.
5. Numerical approximation replaces an exact unknown with a controlled estimate and evidence about its error.
6. A rounded display does not reveal the algorithm or guarantee that all solutions were found.
7. A common error is reporting many decimal digits unsupported by data or method accuracy.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson interprets finite sums as accumulation from a rate.

### Lesson summary

Numerical approximation replaces an exact unknown with a controlled estimate and evidence about its error.

The central condition to remember is this: A rounded display does not reveal the algorithm or guarantee that all solutions were found.

**Connection forward.** The next lesson interprets finite sums as accumulation from a rate.

The next lesson is **Accumulation, finite sums, and area preview**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.11. Accumulation, finite sums, and area preview

**Learning objective.** Connect rates, rectangles, finite sums, net change, and area under a rate graph.

### The problem that opens the lesson

A pump's rate is 4,6,9,7 liters per minute over four one-minute intervals. Estimate total volume added using left-endpoint rectangles.

**Opening solution.** A pump's rate is 4,6,9,7 liters per minute over four one-minute intervals. Estimate total volume added using left-endpoint rectangles.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. The relevant conditions are not optional bookkeeping: A graph’s geometric area and a signed accumulation differ below the input axis. Following that structure gives **4+6+9+7=26 liters.**

**Why this works.** Narrower intervals can improve an estimate when the rate varies, motivating the limiting process behind the definite integral. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Accumulation combines many local contributions into a total. When a rate is approximately constant over short intervals, rate times interval width estimates the contribution.

Adding rectangle areas under a rate graph produces a finite sum. Positive and negative rates contribute signed net change, while total distance or total amount may require absolute values.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Narrower intervals can improve an estimate when the rate varies, motivating the limiting process behind the definite integral.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation.

A graph’s geometric area and a signed accumulation differ below the input axis.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is adding rate values without multiplying by time or another input width.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A pump's rate is 4,6,9,7 liters per minute over four one-minute intervals. Estimate total volume added using left-endpoint rectangles.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. The relevant conditions are not optional bookkeeping: A graph’s geometric area and a signed accumulation differ below the input axis. Following that structure gives **4+6+9+7=26 liters.**

**Why this works.** Narrower intervals can improve an estimate when the rate varies, motivating the limiting process behind the definite integral. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Compare left, right, and midpoint estimates.

**Worked development.** Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Adding rectangle areas under a rate graph produces a finite sum. Positive and negative rates contribute signed net change, while total distance or total amount may require absolute values. Then apply the conditions explicitly: A graph’s geometric area and a signed accumulation differ below the input axis. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Accumulation connects velocity to displacement, flow to volume, density to mass, and rates to totals.

#### Reasoning example

**Problem.** Interpret negative rate as removal.

**Worked development.** Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Adding rectangle areas under a rate graph produces a finite sum. Positive and negative rates contribute signed net change, while total distance or total amount may require absolute values. Then apply the conditions explicitly: A graph’s geometric area and a signed accumulation differ below the input axis. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Accumulation connects velocity to displacement, flow to volume, density to mass, and rates to totals.

**Worked example 4: quick check.** If velocity is negative over an interval, what does signed accumulation represent?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. The relevant conditions are not optional bookkeeping: A graph’s geometric area and a signed accumulation differ below the input axis. Following that structure gives **Negative displacement contribution, not negative distance traveled.**

**Why this works.** Narrower intervals can improve an estimate when the rate varies, motivating the limiting process behind the definite integral. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.11-V1: Rate graph with rectangles.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.11-V2: Signed area and net change.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.11-V3: Refinement with narrower intervals.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Accumulation connects velocity to displacement, flow to volume, density to mass, and rates to totals.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

If velocity is negative over an interval, what does signed accumulation represent?

<details><summary>Check</summary>

Negative displacement contribution, not negative distance traveled.

</details>

### Practice set

1. If velocity is negative over an interval, what does signed accumulation represent?
2. Compare left, right, and midpoint estimates.
3. Interpret negative rate as removal.
4. Distinguish total accumulation from final rate.
5. State the defining idea behind accumulation, finite sums, and area preview in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Negative displacement contribution, not negative distance traveled.
2. Use the method developed in the lesson: Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Choose left, right, or midpoint sample values, multiply each by interval width, sum with units, and state whether the result is signed net change or total accumulation. Verify all conditions and state the final result in the requested representation.
5. Accumulation combines many local contributions into a total. When a rate is approximately constant over short intervals, rate times interval width estimates the contribution.
6. A graph’s geometric area and a signed accumulation differ below the input axis.
7. A common error is adding rate values without multiplying by time or another input width.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The final lesson combines the full course in an unlabeled synthesis problem.

### Lesson summary

Accumulation combines many local contributions into a total. When a rate is approximately constant over short intervals, rate times interval width estimates the contribution.

The central condition to remember is this: A graph’s geometric area and a signed accumulation differ below the input axis.

**Connection forward.** The final lesson combines the full course in an unlabeled synthesis problem.

The next lesson is **Precalculus synthesis capstone**.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## P15.12. Precalculus synthesis capstone

**Learning objective.** Analyze an unfamiliar multirepresentation problem by selecting and combining methods from the entire course.

### The problem that opens the lesson

A rotating sensor has position r(t)=<5cos t,5sin t>, signal strength S(t)=12e^{-0.1t}[1+0.2cos(3t)], and readings sampled every pi/6 time units. Determine domains, periods, decay behavior, selected positions, average signal change, and one appropriate limit question.

**Opening solution.** A rotating sensor has position r(t)=<5cos t,5sin t>, signal strength S(t)=12e^{-0.1t}[1+0.2cos(3t)], and readings sampled every pi/6 time units. Determine domains, periods, decay behavior, selected positions, average signal change, and one appropriate limit question.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. The relevant conditions are not optional bookkeeping: Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics. Following that structure gives **Requires parametric, trig, exponential, sequence, rate, and limit reasoning; no single chapter label supplies the method.**

**Why this works.** A complete analysis includes classification, domain, representations, exact and numerical methods, validation, interpretation, and limitations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A synthesis problem requires identifying structure before choosing methods.

Unfamiliar models may combine function families, coordinate representations, discrete sampling, and contextual restrictions. The solution should be organized around quantities and questions rather than chapter names.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A complete analysis includes classification, domain, representations, exact and numerical methods, validation, interpretation, and limitations.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions.

Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is beginning calculations before defining variables or understanding what each component represents.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A rotating sensor has position r(t)=<5cos t,5sin t>, signal strength S(t)=12e^{-0.1t}[1+0.2cos(3t)], and readings sampled every pi/6 time units. Determine domains, periods, decay behavior, selected positions, average signal change, and one appropriate limit question.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. The relevant conditions are not optional bookkeeping: Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics. Following that structure gives **Requires parametric, trig, exponential, sequence, rate, and limit reasoning; no single chapter label supplies the method.**

**Why this works.** A complete analysis includes classification, domain, representations, exact and numerical methods, validation, interpretation, and limitations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Classify each component family.

**Worked development.** Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Unfamiliar models may combine function families, coordinate representations, discrete sampling, and contextual restrictions. The solution should be organized around quantities and questions rather than chapter names. Then apply the conditions explicitly: Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The capstone demonstrates readiness to enter Calculus as a connected study of change and accumulation rather than a collection of new formulas.

#### Reasoning example

**Problem.** Build a solution plan before calculating.

**Worked development.** Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Unfamiliar models may combine function families, coordinate representations, discrete sampling, and contextual restrictions. The solution should be organized around quantities and questions rather than chapter names. Then apply the conditions explicitly: Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The capstone demonstrates readiness to enter Calculus as a connected study of change and accumulation rather than a collection of new formulas.

**Worked example 4: quick check.** What is the first step in an unlabeled synthesis problem?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. The relevant conditions are not optional bookkeeping: Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics. Following that structure gives **Define the quantities and identify the structural features before choosing methods.**

**Why this works.** A complete analysis includes classification, domain, representations, exact and numerical methods, validation, interpretation, and limitations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P15.12-V1: Course concept dependency map.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.12-V2: Multirepresentation data dashboard.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P15.12-V3: Method-selection and verification checklist.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

The capstone demonstrates readiness to enter Calculus as a connected study of change and accumulation rather than a collection of new formulas.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

What is the first step in an unlabeled synthesis problem?

<details><summary>Check</summary>

Define the quantities and identify the structural features before choosing methods.

</details>

### Practice set

1. What is the first step in an unlabeled synthesis problem?
2. Classify each component family.
3. Build a solution plan before calculating.
4. Write a limitations paragraph after results.
5. State the defining idea behind precalculus synthesis capstone in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Define the quantities and identify the structural features before choosing methods.
2. Use the method developed in the lesson: Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Build a method plan, solve in dependency order, cross-check using another representation, and write a final explanation separating mathematical conclusions from model assumptions. Verify all conditions and state the final result in the requested representation.
5. A synthesis problem requires identifying structure before choosing methods.
6. Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics.
7. A common error is beginning calculations before defining variables or understanding what each component represents.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next public course begins formal work with limits, continuity, and derivatives.

### Lesson summary

A synthesis problem requires identifying structure before choosing methods.

The central condition to remember is this: Not every requested quantity has a closed exact form. Choosing an appropriate approximation is part of the mathematics.

**Connection forward.** The next public course begins formal work with limits, continuity, and derivatives.

This is the final lesson of the course. Its ideas lead directly into formal Calculus.

### Source guidance

AP Precalculus mathematical practices; Lippman & Rasmussen, rates of change and function behavior; BetterGrades Calculus Limits and Continuity course; Stitz & Zeager, function synthesis and numerical methods


---

## Unit investigation

Complete a multirepresentation capstone involving periodic measurement, exponential damping, parametric position, discrete sampling, rates of change, and an intuitive limit or continuity question.

A complete investigation submission must define variables and units, show the mathematical model, include at least two coordinated representations, justify method choices, verify results, and state limitations. A worked instructor solution should include one alternate valid approach and a note identifying the most likely prerequisite failure points.

## Unit review design

The cumulative review should contain 40-55 concrete items: approximately 55 percent current-unit material, 25 percent retrieval from the preceding two units, and 20 percent older course material. At least one cluster must combine symbolic, graphical, and contextual representations without naming the method in the prompt.
