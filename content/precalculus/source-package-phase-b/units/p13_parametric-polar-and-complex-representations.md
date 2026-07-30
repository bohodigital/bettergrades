# Unit P13: Parametric, Polar, and Complex Representations

This unit extends the Cartesian viewpoint. Parametric equations preserve motion, polar coordinates encode direction, and complex polar form turns multiplication into rotation and scaling. The governing question is: **What becomes possible when position is controlled by a parameter or direction is built into the coordinate system?**

## Unit anchor problem

A point follows x(t)=3cos t and y(t)=2sin t for 0≤t≤2pi. Describe the path, orientation, speed pattern qualitatively, and every time it passes through (0,2).

The anchor problem should remain visible throughout the unit. Each lesson contributes one part of the language or method needed to solve it completely, and the unit investigation asks the learner to build a related model independently.

## Learning path

- **P13.1. Parametric equations and orientation**
- **P13.2. Eliminating a parameter**
- **P13.3. Parametric motion and vector-valued position**
- **P13.4. Intersections, repeated points, and multiple parameter values**
- **P13.5. Polar coordinates and nonuniqueness**
- **P13.6. Cartesian and polar conversion**
- **P13.7. Graphing polar equations**
- **P13.8. Polar symmetry and repeated tracing**
- **P13.9. Common polar families and polar conics**
- **P13.10. Complex numbers in polar form**
- **P13.11. Complex multiplication, division, and powers**
- **P13.12. Roots of complex numbers**

---

## P13.1. Parametric equations and orientation

**Learning objective.** Interpret x=f(t), y=g(t) as a directed path with a parameter interval.

### The problem that opens the lesson

For x=2t-1 and y=t^2, -2≤t≤3, find endpoints, direction, and the Cartesian curve.

**Opening solution.** For x=2t-1 and y=t^2, -2≤t≤3, find endpoints, direction, and the Cartesian curve.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. The relevant conditions are not optional bookkeeping: The parameter need not be time, though time is a common and useful interpretation. Following that structure gives **Endpoints (-5,4),(5,9); eliminate t=(x+1)/2 to get y=(x+1)^2/4 with restricted segment and direction.**

**Why this works.** A table of t-values reveals ordered positions. Arrows on the curve preserve orientation information that is absent from an ordinary Cartesian equation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Parametric equations describe x and y as coordinated functions of a third variable t.

The parameter determines not only the geometric path but also starting point, direction, timing, and repeated traversal. Two parametrizations can trace the same set of points differently.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A table of t-values reveals ordered positions. Arrows on the curve preserve orientation information that is absent from an ordinary Cartesian equation.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included.

The parameter need not be time, though time is a common and useful interpretation.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to connect points according to increasing x rather than increasing t.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** For x=2t-1 and y=t^2, -2≤t≤3, find endpoints, direction, and the Cartesian curve.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. The relevant conditions are not optional bookkeeping: The parameter need not be time, though time is a common and useful interpretation. Following that structure gives **Endpoints (-5,4),(5,9); eliminate t=(x+1)/2 to get y=(x+1)^2/4 with restricted segment and direction.**

**Why this works.** A table of t-values reveals ordered positions. Arrows on the curve preserve orientation information that is absent from an ordinary Cartesian equation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Trace a circle parametrically.

**Worked development.** State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The parameter determines not only the geometric path but also starting point, direction, timing, and repeated traversal. Two parametrizations can trace the same set of points differently. Then apply the conditions explicitly: The parameter need not be time, though time is a common and useful interpretation. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Parametric equations model motion, closed curves, projectiles, mechanical linkages, and paths that fail the vertical-line test.

#### Reasoning example

**Problem.** Compare the same path with reversed orientation.

**Worked development.** State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The parameter determines not only the geometric path but also starting point, direction, timing, and repeated traversal. Two parametrizations can trace the same set of points differently. Then apply the conditions explicitly: The parameter need not be time, though time is a common and useful interpretation. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Parametric equations model motion, closed curves, projectiles, mechanical linkages, and paths that fail the vertical-line test.

**Worked example 4: quick check.** What changes when t is replaced by -t?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. The relevant conditions are not optional bookkeeping: The parameter need not be time, though time is a common and useful interpretation. Following that structure gives **The path may remain the same while orientation reverses or changes.**

**Why this works.** A table of t-values reveals ordered positions. Arrows on the curve preserve orientation information that is absent from an ordinary Cartesian equation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.1-V1: Parametric tracer with moving point.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.1-V2: Same curve, opposite orientation.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.1-V3: Parameter table linked to coordinates.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Parametric equations model motion, closed curves, projectiles, mechanical linkages, and paths that fail the vertical-line test.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

What changes when t is replaced by -t?

<details><summary>Check</summary>

The path may remain the same while orientation reverses or changes.

</details>

### Practice set

1. What changes when t is replaced by -t?
2. Trace a circle parametrically.
3. Compare the same path with reversed orientation.
4. Interpret t as time versus a generic parameter.
5. State the defining idea behind parametric equations and orientation in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. The path may remain the same while orientation reverses or changes.
2. Use the method developed in the lesson: State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: State the parameter interval, calculate key positions, plot in time order, and describe direction and whether endpoints are included. Verify all conditions and state the final result in the requested representation.
5. Parametric equations describe x and y as coordinated functions of a third variable t.
6. The parameter need not be time, though time is a common and useful interpretation.
7. A common error is to connect points according to increasing x rather than increasing t.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson removes the parameter algebraically while tracking information that may be lost.

### Lesson summary

Parametric equations describe x and y as coordinated functions of a third variable t.

The central condition to remember is this: The parameter need not be time, though time is a common and useful interpretation.

**Connection forward.** The next lesson removes the parameter algebraically while tracking information that may be lost.

The next lesson is **Eliminating a parameter**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.2. Eliminating a parameter

**Learning objective.** Eliminate parameters while preserving interval restrictions and lost orientation information.

### The problem that opens the lesson

Eliminate t from x=t+1, y=t^2-4 for -2≤t≤3.

**Opening solution.** Eliminate t from x=t+1, y=t^2-4 for -2≤t≤3.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. The relevant conditions are not optional bookkeeping: A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form. Following that structure gives **y=(x-1)^2-4 with -1≤x≤4; orientation follows increasing x.**

**Why this works.** The Cartesian equation may describe more points than the chosen parameter interval traces, and it usually loses orientation and timing. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Eliminating a parameter produces a Cartesian relation containing the parametric path.

Solving one equation for t and substituting into the other is the usual method. Trigonometric parametrizations often eliminate through identities such as sin^2 t+cos^2 t=1.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The Cartesian equation may describe more points than the chosen parameter interval traces, and it usually loses orientation and timing.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately.

A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is reporting the full Cartesian curve while ignoring the restricted segment or repeated traversal.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Eliminate t from x=t+1, y=t^2-4 for -2≤t≤3.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. The relevant conditions are not optional bookkeeping: A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form. Following that structure gives **y=(x-1)^2-4 with -1≤x≤4; orientation follows increasing x.**

**Why this works.** The Cartesian equation may describe more points than the chosen parameter interval traces, and it usually loses orientation and timing. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Eliminate trig parameters from x=3cos t,y=3sin t.

**Worked development.** Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Solving one equation for t and substituting into the other is the usual method. Trigonometric parametrizations often eliminate through identities such as sin^2 t+cos^2 t=1. Then apply the conditions explicitly: A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Elimination helps compare parametric and implicit representations and solve intersections.

#### Reasoning example

**Problem.** Identify a Cartesian equation that includes more than the parametric path.

**Worked development.** Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Solving one equation for t and substituting into the other is the usual method. Trigonometric parametrizations often eliminate through identities such as sin^2 t+cos^2 t=1. Then apply the conditions explicitly: A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Elimination helps compare parametric and implicit representations and solve intersections.

**Worked example 4: quick check.** Eliminate t from x=t^2,y=t for -1≤t≤2.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. The relevant conditions are not optional bookkeeping: A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form. Following that structure gives **x=y^2 with -1≤y≤2.**

**Why this works.** The Cartesian equation may describe more points than the chosen parameter interval traces, and it usually loses orientation and timing. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.2-V1: Elimination workflow.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.2-V2: Restricted parametric segment versus full Cartesian curve.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.2-V3: Orientation information lost after elimination.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Elimination helps compare parametric and implicit representations and solve intersections.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Eliminate t from x=t^2,y=t for -1≤t≤2.

<details><summary>Check</summary>

x=y^2 with -1≤y≤2.

</details>

### Practice set

1. Eliminate t from x=t^2,y=t for -1≤t≤2.
2. Eliminate trig parameters from x=3cos t,y=3sin t.
3. Identify a Cartesian equation that includes more than the parametric path.
4. Recover parameter values for a given point.
5. State the defining idea behind eliminating a parameter in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. x=y^2 with -1≤y≤2.
2. Use the method developed in the lesson: Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Eliminate t, translate the parameter interval into restrictions on x or y, and record direction separately. Verify all conditions and state the final result in the requested representation.
5. Eliminating a parameter produces a Cartesian relation containing the parametric path.
6. A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form.
7. A common error is reporting the full Cartesian curve while ignoring the restricted segment or repeated traversal.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson keeps the parameter to study motion and average velocity.

### Lesson summary

Eliminating a parameter produces a Cartesian relation containing the parametric path.

The central condition to remember is this: A parameter may not be globally solvable as one expression, so elimination can require cases or may not produce a simple Cartesian form.

**Connection forward.** The next lesson keeps the parameter to study motion and average velocity.

The next lesson is **Parametric motion and vector-valued position**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.3. Parametric motion and vector-valued position

**Learning objective.** Use r(t)=<x(t),y(t)> to describe position, displacement, and average velocity.

### The problem that opens the lesson

A particle has r(t)=<t^2-1,3t>. Find displacement and average velocity from t=1 to t=4.

**Opening solution.** A particle has r(t)=<t^2-1,3t>. Find displacement and average velocity from t=1 to t=4.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. The relevant conditions are not optional bookkeeping: Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance. Following that structure gives **Displacement <15,9>; average velocity <5,3>.**

**Why this works.** Component changes can be interpreted separately, but the vector preserves direction and combined magnitude. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A vector-valued position function r(t)=<x(t),y(t)> records planar motion.

Displacement over [a,b] is r(b)-r(a), while average velocity is displacement divided by b-a. These quantities differ from path length and average speed.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Component changes can be interpreted separately, but the vector preserves direction and combined magnitude.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units.

Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is adding endpoint positions or confusing displacement with total distance traveled.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A particle has r(t)=<t^2-1,3t>. Find displacement and average velocity from t=1 to t=4.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. The relevant conditions are not optional bookkeeping: Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance. Following that structure gives **Displacement <15,9>; average velocity <5,3>.**

**Why this works.** Component changes can be interpreted separately, but the vector preserves direction and combined magnitude. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Compare path with time schedule.

**Worked development.** Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Displacement over [a,b] is r(b)-r(a), while average velocity is displacement divided by b-a. These quantities differ from path length and average speed. Then apply the conditions explicitly: Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Vector-valued motion supports navigation, robotics, projectiles, and the later calculus of parametric curves.

#### Reasoning example

**Problem.** Find equal-position times.

**Worked development.** Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Displacement over [a,b] is r(b)-r(a), while average velocity is displacement divided by b-a. These quantities differ from path length and average speed. Then apply the conditions explicitly: Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Vector-valued motion supports navigation, robotics, projectiles, and the later calculus of parametric curves.

**Worked example 4: quick check.** Find average velocity for r(t)=<cos t,sin t> from 0 to pi.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. The relevant conditions are not optional bookkeeping: Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance. Following that structure gives **<-2/pi,0>.**

**Why this works.** Component changes can be interpreted separately, but the vector preserves direction and combined magnitude. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.3-V1: Position-vector motion plot.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.3-V2: Displacement chord versus traveled path.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.3-V3: Time-stamped coordinate table.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Vector-valued motion supports navigation, robotics, projectiles, and the later calculus of parametric curves.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find average velocity for r(t)=<cos t,sin t> from 0 to pi.

<details><summary>Check</summary>

<-2/pi,0>.

</details>

### Practice set

1. Find average velocity for r(t)=<cos t,sin t> from 0 to pi.
2. Compare path with time schedule.
3. Find equal-position times.
4. Interpret component changes and units.
5. State the defining idea behind parametric motion and vector-valued position in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. <-2/pi,0>.
2. Use the method developed in the lesson: Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Evaluate endpoint positions, subtract componentwise, divide by elapsed time, and attach units. Verify all conditions and state the final result in the requested representation.
5. A vector-valued position function r(t)=<x(t),y(t)> records planar motion.
6. Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance.
7. A common error is adding endpoint positions or confusing displacement with total distance traveled.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson studies repeated points and the distinction between path intersection and collision.

### Lesson summary

A vector-valued position function r(t)=<x(t),y(t)> records planar motion.

The central condition to remember is this: Average velocity does not describe the exact velocity at every time. A closed path can have zero displacement and average velocity while traveling a positive distance.

**Connection forward.** The next lesson studies repeated points and the distinction between path intersection and collision.

The next lesson is **Intersections, repeated points, and multiple parameter values**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.4. Intersections, repeated points, and multiple parameter values

**Learning objective.** Distinguish curve intersections from self-intersections and repeated positions.

### The problem that opens the lesson

For x=t^2-1,y=t^3-t, find all parameter values that produce (0,0).

**Opening solution.** For x=t^2-1,y=t^3-t, find all parameter values that produce (0,0).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. The relevant conditions are not optional bookkeeping: Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once. Following that structure gives **t=±1 both produce (0,0), so the curve passes through the point twice.**

**Why this works.** Finding repeated points requires solving x(t1)=x(t2) and y(t1)=y(t2), or solving the coordinate equations for all parameter values that produce a given point. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A parametric curve can pass through the same point at different parameter values, creating a self-intersection or repeated trace.

Two moving objects collide only if their positions are equal at the same time; their geometric paths may cross at different times without collision.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Finding repeated points requires solving x(t1)=x(t2) and y(t1)=y(t2), or solving the coordinate equations for all parameter values that produce a given point.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event.

Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is interpreting any graph intersection as a collision.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** For x=t^2-1,y=t^3-t, find all parameter values that produce (0,0).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. The relevant conditions are not optional bookkeeping: Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once. Following that structure gives **t=±1 both produce (0,0), so the curve passes through the point twice.**

**Why this works.** Finding repeated points requires solving x(t1)=x(t2) and y(t1)=y(t2), or solving the coordinate equations for all parameter values that produce a given point. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Find intersections of two parametric curves.

**Worked development.** Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Two moving objects collide only if their positions are equal at the same time; their geometric paths may cross at different times without collision. Then apply the conditions explicitly: Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Repeated points matter in motion planning, curve design, and polar tracing.

#### Reasoning example

**Problem.** Distinguish same point at different times from one simultaneous collision.

**Worked development.** Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Two moving objects collide only if their positions are equal at the same time; their geometric paths may cross at different times without collision. Then apply the conditions explicitly: Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Repeated points matter in motion planning, curve design, and polar tracing.

**Worked example 4: quick check.** Can two particles' paths intersect without the particles colliding?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. The relevant conditions are not optional bookkeeping: Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once. Following that structure gives **Yes; they may reach the common point at different times.**

**Why this works.** Finding repeated points requires solving x(t1)=x(t2) and y(t1)=y(t2), or solving the coordinate equations for all parameter values that produce a given point. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.4-V1: Self-intersection tracer.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.4-V2: Two moving curves with time labels.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.4-V3: Repeated parameter-to-point mapping.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Repeated points matter in motion planning, curve design, and polar tracing.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Can two particles' paths intersect without the particles colliding?

<details><summary>Check</summary>

Yes; they may reach the common point at different times.

</details>

### Practice set

1. Can two particles' paths intersect without the particles colliding?
2. Find intersections of two parametric curves.
3. Distinguish same point at different times from one simultaneous collision.
4. Identify repeated tracing over a parameter interval.
5. State the defining idea behind intersections, repeated points, and multiple parameter values in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Yes; they may reach the common point at different times.
2. Use the method developed in the lesson: Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Preserve parameter labels when comparing curves and distinguish a common spatial point from a simultaneous event. Verify all conditions and state the final result in the requested representation.
5. A parametric curve can pass through the same point at different parameter values, creating a self-intersection or repeated trace.
6. Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once.
7. A common error is interpreting any graph intersection as a collision.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson introduces coordinates built directly from radius and direction.

### Lesson summary

A parametric curve can pass through the same point at different parameter values, creating a self-intersection or repeated trace.

The central condition to remember is this: Periodic parametrizations can retrace a curve indefinitely. A restricted interval may be needed to trace it once.

**Connection forward.** The next lesson introduces coordinates built directly from radius and direction.

The next lesson is **Polar coordinates and nonuniqueness**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.5. Polar coordinates and nonuniqueness

**Learning objective.** Represent points as (r,theta), use negative radius, and generate equivalent polar coordinates.

### The problem that opens the lesson

Plot (-4,5pi/6) and give two equivalent representations with positive radius.

**Opening solution.** Plot (-4,5pi/6) and give two equivalent representations with positive radius.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. The relevant conditions are not optional bookkeeping: The pole r=0 has every angle representation, so its angle is indeterminate. Following that structure gives **The point equals (4,11pi/6); also (4,-pi/6).**

**Why this works.** Polar coordinates are therefore nonunique. The same point has infinitely many representations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A polar coordinate pair (r,theta) locates a point by signed distance from the pole and direction from the polar axis.

Positive r moves along the ray theta; negative r moves |r| units along the opposite ray. Adding 2pi k to theta gives equivalent coordinates, and changing the sign of r can be offset by adding pi.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Polar coordinates are therefore nonunique. The same point has infinitely many representations.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess.

The pole r=0 has every angle representation, so its angle is indeterminate.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is plotting negative radius on the same ray instead of the opposite ray.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Plot (-4,5pi/6) and give two equivalent representations with positive radius.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. The relevant conditions are not optional bookkeeping: The pole r=0 has every angle representation, so its angle is indeterminate. Following that structure gives **The point equals (4,11pi/6); also (4,-pi/6).**

**Why this works.** Polar coordinates are therefore nonunique. The same point has infinitely many representations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Convert a point from Cartesian by geometry.

**Worked development.** Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Positive r moves along the ray theta; negative r moves |r| units along the opposite ray. Adding 2pi k to theta gives equivalent coordinates, and changing the sign of r can be offset by adding pi. Then apply the conditions explicitly: The pole r=0 has every angle representation, so its angle is indeterminate. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar coordinates naturally describe rotation, radial symmetry, spirals, roses, and conics with a focus at the pole.

#### Reasoning example

**Problem.** Explain why (r,theta+2pi k) is equivalent.

**Worked development.** Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Positive r moves along the ray theta; negative r moves |r| units along the opposite ray. Adding 2pi k to theta gives equivalent coordinates, and changing the sign of r can be offset by adding pi. Then apply the conditions explicitly: The pole r=0 has every angle representation, so its angle is indeterminate. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar coordinates naturally describe rotation, radial symmetry, spirals, roses, and conics with a focus at the pole.

**Worked example 4: quick check.** Give a positive-radius form equivalent to (-3,pi/4).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. The relevant conditions are not optional bookkeeping: The pole r=0 has every angle representation, so its angle is indeterminate. Following that structure gives **(3,5pi/4).**

**Why this works.** Polar coordinates are therefore nonunique. The same point has infinitely many representations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.5-V1: Polar ray and signed radius.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.5-V2: Multiple coordinate labels on one point.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.5-V3: Cartesian-polar overlay.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Polar coordinates naturally describe rotation, radial symmetry, spirals, roses, and conics with a focus at the pole.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Give a positive-radius form equivalent to (-3,pi/4).

<details><summary>Check</summary>

(3,5pi/4).

</details>

### Practice set

1. Give a positive-radius form equivalent to (-3,pi/4).
2. Convert a point from Cartesian by geometry.
3. Explain why (r,theta+2pi k) is equivalent.
4. Interpret negative radius as reversing direction.
5. State the defining idea behind polar coordinates and nonuniqueness in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. (3,5pi/4).
2. Use the method developed in the lesson: Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Draw the direction ray, apply the sign of r, and generate equivalent forms systematically rather than by visual guess. Verify all conditions and state the final result in the requested representation.
5. A polar coordinate pair (r,theta) locates a point by signed distance from the pole and direction from the polar axis.
6. The pole r=0 has every angle representation, so its angle is indeterminate.
7. A common error is plotting negative radius on the same ray instead of the opposite ray.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson converts between polar and Cartesian coordinates and equations.

### Lesson summary

A polar coordinate pair (r,theta) locates a point by signed distance from the pole and direction from the polar axis.

The central condition to remember is this: The pole r=0 has every angle representation, so its angle is indeterminate.

**Connection forward.** The next lesson converts between polar and Cartesian coordinates and equations.

The next lesson is **Cartesian and polar conversion**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.6. Cartesian and polar conversion

**Learning objective.** Convert points and equations using x=r cos theta, y=r sin theta, and r^2=x^2+y^2.

### The problem that opens the lesson

Convert the line x=4 to a polar equation and state where the formula is undefined.

**Opening solution.** Convert the line x=4 to a polar equation and state where the formula is undefined.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. The relevant conditions are not optional bookkeeping: Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0. Following that structure gives **r cos theta=4, so r=4sec theta where cos theta≠0.**

**Why this works.** For points, compute r as nonnegative distance and choose theta with the correct quadrant. For equations, substitute identities and simplify without dividing by a variable unless its zero case is handled. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Cartesian and polar coordinates are connected by x=r cos theta, y=r sin theta, r^2=x^2+y^2, and tan theta=y/x with quadrant care.

The first two formulas are coordinate projections. Squaring and adding gives the radial relationship, while division gives tangent where x is nonzero.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

For points, compute r as nonnegative distance and choose theta with the correct quadrant. For equations, substitute identities and simplify without dividing by a variable unless its zero case is handled.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

An equation may have multiple equivalent polar forms because of coordinate nonuniqueness.

Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is converting r=constant into a line rather than a circle centered at the pole.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Convert the line x=4 to a polar equation and state where the formula is undefined.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. The relevant conditions are not optional bookkeeping: Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0. Following that structure gives **r cos theta=4, so r=4sec theta where cos theta≠0.**

**Why this works.** For points, compute r as nonnegative distance and choose theta with the correct quadrant. For equations, substitute identities and simplify without dividing by a variable unless its zero case is handled. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Convert a circle through the pole.

**Worked development.** An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The first two formulas are coordinate projections. Squaring and adding gives the radial relationship, while division gives tangent where x is nonzero. Then apply the conditions explicitly: Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Conversion lets us choose whichever coordinate system exposes the structure most clearly.

#### Reasoning example

**Problem.** Use atan2-style quadrant reasoning for a Cartesian point.

**Worked development.** An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The first two formulas are coordinate projections. Squaring and adding gives the radial relationship, while division gives tangent where x is nonzero. Then apply the conditions explicitly: Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Conversion lets us choose whichever coordinate system exposes the structure most clearly.

**Worked example 4: quick check.** Convert r=4sin theta to Cartesian form.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. The relevant conditions are not optional bookkeeping: Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0. Following that structure gives **x^2+y^2=4y, or x^2+(y-2)^2=4.**

**Why this works.** For points, compute r as nonnegative distance and choose theta with the correct quadrant. For equations, substitute identities and simplify without dividing by a variable unless its zero case is handled. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.6-V1: Conversion triangle.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.6-V2: Quadrant-aware angle selection.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.6-V3: Equation conversion map.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Conversion lets us choose whichever coordinate system exposes the structure most clearly.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Convert r=4sin theta to Cartesian form.

<details><summary>Check</summary>

x^2+y^2=4y, or x^2+(y-2)^2=4.

</details>

### Practice set

1. Convert r=4sin theta to Cartesian form.
2. Convert a circle through the pole.
3. Use atan2-style quadrant reasoning for a Cartesian point.
4. Convert r=6cos theta to Cartesian form.
5. State the defining idea behind cartesian and polar conversion in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. x^2+y^2=4y, or x^2+(y-2)^2=4.
2. Use the method developed in the lesson: An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: An equation may have multiple equivalent polar forms because of coordinate nonuniqueness. Verify all conditions and state the final result in the requested representation.
5. Cartesian and polar coordinates are connected by x=r cos theta, y=r sin theta, r^2=x^2+y^2, and tan theta=y/x with quadrant care.
6. Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0.
7. A common error is converting r=constant into a line rather than a circle centered at the pole.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson develops a reliable method for tracing polar equations.

### Lesson summary

Cartesian and polar coordinates are connected by x=r cos theta, y=r sin theta, r^2=x^2+y^2, and tan theta=y/x with quadrant care.

The central condition to remember is this: Using arctan(y/x) alone can choose the wrong quadrant or fail when x=0.

**Connection forward.** The next lesson develops a reliable method for tracing polar equations.

The next lesson is **Graphing polar equations**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.7. Graphing polar equations

**Learning objective.** Trace r=f(theta) using tables, signed radius, and interval selection.

### The problem that opens the lesson

Trace r=2+2cos theta over 0≤theta≤2pi and identify intercepts and maximum radius.

**Opening solution.** Trace r=2+2cos theta over 0≤theta≤2pi and identify intercepts and maximum radius.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. The relevant conditions are not optional bookkeeping: A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values. Following that structure gives **A cardioid with max r=4 at theta=0 and pole at theta=pi.**

**Why this works.** Key angles, zeros, maxima, minima, and symmetry provide the skeleton of the curve. Arrows indicate tracing order. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A polar graph r=f(theta) assigns a signed radius to each direction input.

As theta changes, both the ray and radius change. Negative radii reverse the plotted direction, so a simple table must include sign interpretation rather than only numerical magnitude.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Key angles, zeros, maxima, minima, and symmetry provide the skeleton of the curve. Arrows indicate tracing order.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats.

A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is plotting negative r at angle theta instead of theta+pi.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Trace r=2+2cos theta over 0≤theta≤2pi and identify intercepts and maximum radius.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. The relevant conditions are not optional bookkeeping: A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values. Following that structure gives **A cardioid with max r=4 at theta=0 and pole at theta=pi.**

**Why this works.** Key angles, zeros, maxima, minima, and symmetry provide the skeleton of the curve. Arrows indicate tracing order. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Graph a polar circle.

**Worked development.** Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. As theta changes, both the ray and radius change. Negative radii reverse the plotted direction, so a simple table must include sign interpretation rather than only numerical magnitude. Then apply the conditions explicitly: A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar tracing represents antennas, orbital shapes, petals, spirals, and directional measurements.

#### Reasoning example

**Problem.** Trace a rose curve point by point.

**Worked development.** Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. As theta changes, both the ray and radius change. Negative radii reverse the plotted direction, so a simple table must include sign interpretation rather than only numerical magnitude. Then apply the conditions explicitly: A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar tracing represents antennas, orbital shapes, petals, spirals, and directional measurements.

**Worked example 4: quick check.** Where does r=3cos theta pass through the pole?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. The relevant conditions are not optional bookkeeping: A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values. Following that structure gives **When cos theta=0: theta=pi/2 and 3pi/2.**

**Why this works.** Key angles, zeros, maxima, minima, and symmetry provide the skeleton of the curve. Arrows indicate tracing order. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.7-V1: Polar table linked to plot.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.7-V2: Signed-radius animation.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.7-V3: One-cycle tracing arrows.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Polar tracing represents antennas, orbital shapes, petals, spirals, and directional measurements.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Where does r=3cos theta pass through the pole?

<details><summary>Check</summary>

When cos theta=0: theta=pi/2 and 3pi/2.

</details>

### Practice set

1. Where does r=3cos theta pass through the pole?
2. Graph a polar circle.
3. Trace a rose curve point by point.
4. Explain how negative r changes plotted direction.
5. State the defining idea behind graphing polar equations in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. When cos theta=0: theta=pi/2 and 3pi/2.
2. Use the method developed in the lesson: Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Choose an interval, build a table at meaningful angles, plot signed points, connect in increasing theta order, and check whether the curve repeats. Verify all conditions and state the final result in the requested representation.
5. A polar graph r=f(theta) assigns a signed radius to each direction input.
6. A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values.
7. A common error is plotting negative r at angle theta instead of theta+pi.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson uses algebraic tests and periodicity to reduce repeated tracing.

### Lesson summary

A polar graph r=f(theta) assigns a signed radius to each direction input.

The central condition to remember is this: A polar graph may pass through the pole many times, and one geometric point can correspond to several theta-values.

**Connection forward.** The next lesson uses algebraic tests and periodicity to reduce repeated tracing.

The next lesson is **Polar symmetry and repeated tracing**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.8. Polar symmetry and repeated tracing

**Learning objective.** Test symmetry and choose intervals that trace a polar curve exactly once.

### The problem that opens the lesson

Determine all standard polar symmetries of r=2cos(3theta) and an interval that traces it once.

**Opening solution.** Determine all standard polar symmetries of r=2cos(3theta) and an interval that traces it once.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. The relevant conditions are not optional bookkeeping: Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points. Following that structure gives **Rose symmetry; one complete trace can use an interval of length pi for odd petal count, with careful endpoint checking.**

**Why this works.** Because polar representations are nonunique, an equation can be symmetric even when a substituted form does not simplify literally to the original. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Polar symmetry can be tested by substitutions that leave an equivalent equation.

Replacing theta with -theta tests symmetry about the polar axis; replacing theta with pi-theta tests symmetry about the vertical line; replacing r with -r or theta with theta+pi tests symmetry about the pole.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Because polar representations are nonunique, an equation can be symmetric even when a substituted form does not simplify literally to the original.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once.

Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is concluding “no symmetry” after one substitution fails.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Determine all standard polar symmetries of r=2cos(3theta) and an interval that traces it once.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. The relevant conditions are not optional bookkeeping: Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points. Following that structure gives **Rose symmetry; one complete trace can use an interval of length pi for odd petal count, with careful endpoint checking.**

**Why this works.** Because polar representations are nonunique, an equation can be symmetric even when a substituted form does not simplify literally to the original. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Test r(-theta), r(pi-theta), and r(theta+pi).

**Worked development.** Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Replacing theta with -theta tests symmetry about the polar axis; replacing theta with pi-theta tests symmetry about the vertical line; replacing r with -r or theta with theta+pi tests symmetry about the pole. Then apply the conditions explicitly: Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Symmetry reduces graphing work and reveals parameter structure.

#### Reasoning example

**Problem.** Detect repeated tracing from periodicity.

**Worked development.** Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Replacing theta with -theta tests symmetry about the polar axis; replacing theta with pi-theta tests symmetry about the vertical line; replacing r with -r or theta with theta+pi tests symmetry about the pole. Then apply the conditions explicitly: Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Symmetry reduces graphing work and reveals parameter structure.

**Worked example 4: quick check.** Which substitution tests symmetry about the polar axis?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. The relevant conditions are not optional bookkeeping: Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points. Following that structure gives **Replace theta with -theta and check for an equivalent equation.**

**Why this works.** Because polar representations are nonunique, an equation can be symmetric even when a substituted form does not simplify literally to the original. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.8-V1: Symmetry substitution checklist.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.8-V2: Repeated-trace overlay.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.8-V3: Minimal-interval number line.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Symmetry reduces graphing work and reveals parameter structure.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Which substitution tests symmetry about the polar axis?

<details><summary>Check</summary>

Replace theta with -theta and check for an equivalent equation.

</details>

### Practice set

1. Which substitution tests symmetry about the polar axis?
2. Test r(-theta), r(pi-theta), and r(theta+pi).
3. Detect repeated tracing from periodicity.
4. Find a minimal tracing interval for a circle.
5. State the defining idea behind polar symmetry and repeated tracing in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Replace theta with -theta and check for an equivalent equation.
2. Use the method developed in the lesson: Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Combine algebraic tests with a tracing table and determine a minimal interval that covers the curve once. Verify all conditions and state the final result in the requested representation.
5. Polar symmetry can be tested by substitutions that leave an equivalent equation.
6. Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points.
7. A common error is concluding “no symmetry” after one substitution fails.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson compares major polar families and conic forms.

### Lesson summary

Polar symmetry can be tested by substitutions that leave an equivalent equation.

The central condition to remember is this: Period of the radial function does not always equal the minimal tracing interval because negative radii can repeat geometric points.

**Connection forward.** The next lesson compares major polar families and conic forms.

The next lesson is **Common polar families and polar conics**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.9. Common polar families and polar conics

**Learning objective.** Analyze parameter effects in circles, cardioids, limacons, roses, lemniscates, spirals, and conics.

### The problem that opens the lesson

Predict how the graph of r=1+2cos theta differs from r=2+cos theta.

**Opening solution.** Predict how the graph of r=1+2cos theta differs from r=2+cos theta.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. The relevant conditions are not optional bookkeeping: Some curves are traced more than once over 0 to 2pi. Following that structure gives **The first has an inner loop; the second is a dimpled or convex limacon depending on ratio.**

**Why this works.** Polar conics with a focus at the pole can be written using eccentricity and a directrix parameter. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Common polar families arise from simple radial relationships involving theta.

Equations a+b cos theta or a+b sin theta produce circles, cardioids, and limacons depending on the ratio |a/b|. Equations a cos(n theta) or a sin(n theta) produce roses whose petal counts depend on n parity. Other forms generate lemniscates and spirals.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Polar conics with a focus at the pole can be written using eccentricity and a directrix parameter.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names.

Some curves are traced more than once over 0 to 2pi.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using the odd-n petal count rule for even n or ignoring an inner loop caused by negative radius.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Predict how the graph of r=1+2cos theta differs from r=2+cos theta.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. The relevant conditions are not optional bookkeeping: Some curves are traced more than once over 0 to 2pi. Following that structure gives **The first has an inner loop; the second is a dimpled or convex limacon depending on ratio.**

**Why this works.** Polar conics with a focus at the pole can be written using eccentricity and a directrix parameter. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Count petals of r=cos(n theta).

**Worked development.** Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Equations a+b cos theta or a+b sin theta produce circles, cardioids, and limacons depending on the ratio |a/b|. Equations a cos(n theta) or a sin(n theta) produce roses whose petal counts depend on n parity. Other forms generate lemniscates and spirals. Then apply the conditions explicitly: Some curves are traced more than once over 0 to 2pi. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar families appear in optics, antenna patterns, planetary models, and decorative geometry.

#### Reasoning example

**Problem.** Analyze a lemniscate.

**Worked development.** Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Equations a+b cos theta or a+b sin theta produce circles, cardioids, and limacons depending on the ratio |a/b|. Equations a cos(n theta) or a sin(n theta) produce roses whose petal counts depend on n parity. Other forms generate lemniscates and spirals. Then apply the conditions explicitly: Some curves are traced more than once over 0 to 2pi. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar families appear in optics, antenna patterns, planetary models, and decorative geometry.

**Worked example 4: quick check.** How many petals does r=sin(4theta) have?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. The relevant conditions are not optional bookkeeping: Some curves are traced more than once over 0 to 2pi. Following that structure gives **8 petals.**

**Why this works.** Polar conics with a focus at the pole can be written using eccentricity and a directrix parameter. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.9-V1: Parameter-family gallery.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.9-V2: Rose petal count mechanism.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.9-V3: Polar conic focus-directrix diagram.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Polar families appear in optics, antenna patterns, planetary models, and decorative geometry.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

How many petals does r=sin(4theta) have?

<details><summary>Check</summary>

8 petals.

</details>

### Practice set

1. How many petals does r=sin(4theta) have?
2. Count petals of r=cos(n theta).
3. Analyze a lemniscate.
4. Interpret a polar conic r=ed/(1+e cos theta).
5. State the defining idea behind common polar families and polar conics in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 8 petals.
2. Use the method developed in the lesson: Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify symmetry, key zeros, maximum radius, sign changes, and period before sketching. Interpret parameters structurally rather than memorizing curve names. Verify all conditions and state the final result in the requested representation.
5. Common polar families arise from simple radial relationships involving theta.
6. Some curves are traced more than once over 0 to 2pi.
7. A common error is using the odd-n petal count rule for even n or ignoring an inner loop caused by negative radius.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson uses polar magnitude and angle to represent complex numbers.

### Lesson summary

Common polar families arise from simple radial relationships involving theta.

The central condition to remember is this: Some curves are traced more than once over 0 to 2pi.

**Connection forward.** The next lesson uses polar magnitude and angle to represent complex numbers.

The next lesson is **Complex numbers in polar form**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.10. Complex numbers in polar form

**Learning objective.** Represent complex numbers by modulus and argument and convert between rectangular and polar forms.

### The problem that opens the lesson

Write z=-3+3sqrt(3)i in polar form using a principal argument.

**Opening solution.** Write z=-3+3sqrt(3)i in polar form using a principal argument.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. The relevant conditions are not optional bookkeeping: The zero complex number has modulus zero but no unique argument. Following that structure gives **r=6, theta=2pi/3; z=6(cos 2pi/3+i sin 2pi/3).**

**Why this works.** Rectangular form is best for addition, while polar form reveals multiplication, division, powers, and roots. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A nonzero complex number z=a+bi can be represented by modulus r=sqrt(a^2+b^2) and argument theta, giving z=r(cos theta+i sin theta).

This is the polar coordinate representation of the point (a,b) in the complex plane. The argument is nonunique modulo 2pi; a principal argument is chosen from a stated interval.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Rectangular form is best for addition, while polar form reveals multiplication, division, powers, and roots.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine.

The zero complex number has modulus zero but no unique argument.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using arctan(b/a) without quadrant correction or giving a negative modulus.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Write z=-3+3sqrt(3)i in polar form using a principal argument.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. The relevant conditions are not optional bookkeeping: The zero complex number has modulus zero but no unique argument. Following that structure gives **r=6, theta=2pi/3; z=6(cos 2pi/3+i sin 2pi/3).**

**Why this works.** Rectangular form is best for addition, while polar form reveals multiplication, division, powers, and roots. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Convert a polar complex number to a+bi.

**Worked development.** Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. This is the polar coordinate representation of the point (a,b) in the complex plane. The argument is nonunique modulo 2pi; a principal argument is chosen from a stated interval. Then apply the conditions explicitly: The zero complex number has modulus zero but no unique argument. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar complex form connects algebra with rotations and scaling.

#### Reasoning example

**Problem.** Find all arguments of a nonzero complex number.

**Worked development.** Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. This is the polar coordinate representation of the point (a,b) in the complex plane. The argument is nonunique modulo 2pi; a principal argument is chosen from a stated interval. Then apply the conditions explicitly: The zero complex number has modulus zero but no unique argument. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Polar complex form connects algebra with rotations and scaling.

**Worked example 4: quick check.** Write 4-4i in polar form.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. The relevant conditions are not optional bookkeeping: The zero complex number has modulus zero but no unique argument. Following that structure gives **4sqrt(2)[cos(-pi/4)+i sin(-pi/4)].**

**Why this works.** Rectangular form is best for addition, while polar form reveals multiplication, division, powers, and roots. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.10-V1: Complex plane with modulus and argument.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.10-V2: Rectangular-polar conversion triangle.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.10-V3: Conjugate reflection across real axis.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Polar complex form connects algebra with rotations and scaling.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Write 4-4i in polar form.

<details><summary>Check</summary>

4sqrt(2)[cos(-pi/4)+i sin(-pi/4)].

</details>

### Practice set

1. Write 4-4i in polar form.
2. Convert a polar complex number to a+bi.
3. Find all arguments of a nonzero complex number.
4. Interpret conjugation in polar form.
5. State the defining idea behind complex numbers in polar form in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 4sqrt(2)[cos(-pi/4)+i sin(-pi/4)].
2. Use the method developed in the lesson: Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Compute the modulus, choose a quadrant-correct argument, and verify by converting back with cosine and sine. Verify all conditions and state the final result in the requested representation.
5. A nonzero complex number z=a+bi can be represented by modulus r=sqrt(a^2+b^2) and argument theta, giving z=r(cos theta+i sin theta).
6. The zero complex number has modulus zero but no unique argument.
7. A common error is using arctan(b/a) without quadrant correction or giving a negative modulus.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson makes that connection explicit through multiplication and De Moivre’s theorem.

### Lesson summary

A nonzero complex number z=a+bi can be represented by modulus r=sqrt(a^2+b^2) and argument theta, giving z=r(cos theta+i sin theta).

The central condition to remember is this: The zero complex number has modulus zero but no unique argument.

**Connection forward.** The next lesson makes that connection explicit through multiplication and De Moivre’s theorem.

The next lesson is **Complex multiplication, division, and powers**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.11. Complex multiplication, division, and powers

**Learning objective.** Multiply moduli, add arguments, divide moduli, subtract arguments, and apply De Moivre's theorem.

### The problem that opens the lesson

Compute [2cis(30 degrees)][3cis(80 degrees)] and interpret geometrically.

**Opening solution.** Compute [2cis(30 degrees)][3cis(80 degrees)] and interpret geometrically.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. The relevant conditions are not optional bookkeeping: Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number. Following that structure gives **6cis(110 degrees); scale by 6 and rotate 110 degrees.**

**Why this works.** De Moivre’s theorem raises the modulus to a power and multiplies the argument by that power. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Multiplying complex numbers in polar form multiplies moduli and adds arguments; division divides moduli and subtracts arguments.

The rule follows from angle-sum identities. Geometrically, multiplication by a fixed complex number scales every vector by its modulus and rotates every argument by its angle.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

De Moivre’s theorem raises the modulus to a power and multiplies the argument by that power.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed.

Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is adding moduli or multiplying arguments.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Compute [2cis(30 degrees)][3cis(80 degrees)] and interpret geometrically.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. The relevant conditions are not optional bookkeeping: Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number. Following that structure gives **6cis(110 degrees); scale by 6 and rotate 110 degrees.**

**Why this works.** De Moivre’s theorem raises the modulus to a power and multiplies the argument by that power. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Divide two polar complex numbers.

**Worked development.** Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The rule follows from angle-sum identities. Geometrically, multiplication by a fixed complex number scales every vector by its modulus and rotates every argument by its angle. Then apply the conditions explicitly: Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Complex multiplication models rotations, oscillations, roots of polynomials, and electrical phasors.

#### Reasoning example

**Problem.** Compute (1+i)^8.

**Worked development.** Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The rule follows from angle-sum identities. Geometrically, multiplication by a fixed complex number scales every vector by its modulus and rotates every argument by its angle. Then apply the conditions explicitly: Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Complex multiplication models rotations, oscillations, roots of polynomials, and electrical phasors.

**Worked example 4: quick check.** Compute (sqrt(3)+i)^6.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. The relevant conditions are not optional bookkeeping: Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number. Following that structure gives **2cis(pi/6) raised to 6 gives 64cis(pi)=-64.**

**Why this works.** De Moivre’s theorem raises the modulus to a power and multiplies the argument by that power. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.11-V1: Complex multiplication as rotation and dilation.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.11-V2: Argument addition on the complex plane.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.11-V3: De Moivre power polygon.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Complex multiplication models rotations, oscillations, roots of polynomials, and electrical phasors.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Compute (sqrt(3)+i)^6.

<details><summary>Check</summary>

2cis(pi/6) raised to 6 gives 64cis(pi)=-64.

</details>

### Practice set

1. Compute (sqrt(3)+i)^6.
2. Divide two polar complex numbers.
3. Compute (1+i)^8.
4. Explain why multiplication rotates and scales.
5. State the defining idea behind complex multiplication, division, and powers in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 2cis(pi/6) raised to 6 gives 64cis(pi)=-64.
2. Use the method developed in the lesson: Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Convert to polar form, perform modulus-angle operations, normalize the argument if requested, and convert back only when needed. Verify all conditions and state the final result in the requested representation.
5. Multiplying complex numbers in polar form multiplies moduli and adds arguments; division divides moduli and subtracts arguments.
6. Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number.
7. A common error is adding moduli or multiplying arguments.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson reverses powers to find all complex roots.

### Lesson summary

Multiplying complex numbers in polar form multiplies moduli and adds arguments; division divides moduli and subtracts arguments.

The central condition to remember is this: Division requires a nonzero divisor. Principal arguments can jump by 2pi without changing the number.

**Connection forward.** The next lesson reverses powers to find all complex roots.

The next lesson is **Roots of complex numbers**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## P13.12. Roots of complex numbers

**Learning objective.** Find all nth roots of a complex number and interpret their equal angular spacing.

### The problem that opens the lesson

Find all cube roots of 8i.

**Opening solution.** Find all cube roots of 8i.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. The relevant conditions are not optional bookkeeping: The zero number has one nth root, zero, rather than n distinct roots. Following that structure gives **8i=8cis(pi/2); roots have modulus 2 and arguments pi/6+2kpi/3 for k=0,1,2.**

**Why this works.** The 2pi k term is essential because the same target number has infinitely many arguments before division by n. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The nth roots of a nonzero complex number are equally spaced around a circle.

If w=R cis phi, then each root has modulus R^{1/n} and argument (phi+2pi k)/n for k=0,...,n-1. Adding n to k repeats the first root.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The 2pi k term is essential because the same target number has infinitely many arguments before division by n.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power.

The zero number has one nth root, zero, rather than n distinct roots.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using only the principal argument and finding one root.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Find all cube roots of 8i.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. The relevant conditions are not optional bookkeeping: The zero number has one nth root, zero, rather than n distinct roots. Following that structure gives **8i=8cis(pi/2); roots have modulus 2 and arguments pi/6+2kpi/3 for k=0,1,2.**

**Why this works.** The 2pi k term is essential because the same target number has infinitely many arguments before division by n. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Find fourth roots of 16.

**Worked development.** Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. If w=R cis phi, then each root has modulus R^{1/n} and argument (phi+2pi k)/n for k=0,...,n-1. Adding n to k repeats the first root. Then apply the conditions explicitly: The zero number has one nth root, zero, rather than n distinct roots. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Complex roots complete polynomial solution sets and create regular polygons in the complex plane.

#### Reasoning example

**Problem.** Solve z^5=-1.

**Worked development.** Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. If w=R cis phi, then each root has modulus R^{1/n} and argument (phi+2pi k)/n for k=0,...,n-1. Adding n to k repeats the first root. Then apply the conditions explicitly: The zero number has one nth root, zero, rather than n distinct roots. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Complex roots complete polynomial solution sets and create regular polygons in the complex plane.

**Worked example 4: quick check.** How many distinct seventh roots does a nonzero complex number have?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. The relevant conditions are not optional bookkeeping: The zero number has one nth root, zero, rather than n distinct roots. Following that structure gives **Seven.**

**Why this works.** The 2pi k term is essential because the same target number has infinitely many arguments before division by n. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P13.12-V1: Root circle with equally spaced points.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.12-V2: Argument-division and 2pi k mechanism.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P13.12-V3: Root verification by De Moivre.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Complex roots complete polynomial solution sets and create regular polygons in the complex plane.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

How many distinct seventh roots does a nonzero complex number have?

<details><summary>Check</summary>

Seven.

</details>

### Practice set

1. How many distinct seventh roots does a nonzero complex number have?
2. Find fourth roots of 16.
3. Solve z^5=-1.
4. Verify roots by powering.
5. State the defining idea behind roots of complex numbers in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Seven.
2. Use the method developed in the lesson: Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Write the target in polar form, apply the root formula, list exactly n distinct roots, and verify by raising one or all roots to the nth power. Verify all conditions and state the final result in the requested representation.
5. The nth roots of a nonzero complex number are equally spaced around a circle.
6. The zero number has one nth root, zero, rather than n distinct roots.
7. A common error is using only the principal argument and finding one root.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next unit turns from continuous paths to functions indexed by integers.

### Lesson summary

The nth roots of a nonzero complex number are equally spaced around a circle.

The central condition to remember is this: The zero number has one nth root, zero, rather than n distinct roots.

**Connection forward.** The next unit turns from continuous paths to functions indexed by integers.

The next lesson is **Sequences as discrete functions**.

### Source guidance

Lippman & Rasmussen, Precalculus Vol. 2, 8.2, 8.3, 8.6, 9.4; Sundstrom & Schlicker, Trigonometry, Chapter 5; Yoshiwara, Trigonometry, Chapter 10; Corral, Trigonometry, 6.3-6.4


---

## Unit investigation

Design and trace a parametric or polar path, identify orientation and repeated tracing, convert selected points, and justify why the representation is superior to ordinary y=f(x).

A complete investigation submission must define variables and units, show the mathematical model, include at least two coordinated representations, justify method choices, verify results, and state limitations. A worked instructor solution should include one alternate valid approach and a note identifying the most likely prerequisite failure points.

## Unit review design

The cumulative review should contain 40-55 concrete items: approximately 55 percent current-unit material, 25 percent retrieval from the preceding two units, and 20 percent older course material. At least one cluster must combine symbolic, graphical, and contextual representations without naming the method in the prompt.
