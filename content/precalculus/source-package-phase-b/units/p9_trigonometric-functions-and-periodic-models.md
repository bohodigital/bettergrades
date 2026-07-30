# Unit P9: Trigonometric Functions and Periodic Models

This unit unwraps circular coordinates into periodic graphs. The emphasis is not on memorizing wave shapes, but on deriving each graph from motion and reading every parameter as a feature of that motion. The governing question is: **How does circular motion become periodic behavior on a graph?**

## Unit anchor problem

A Ferris wheel has radius 18 meters, center height 20 meters, and completes one revolution every 48 seconds. A rider starts at the lowest point. Build a height function and find every time in the first two minutes when the rider is 29 meters above the ground.

The anchor problem should remain visible throughout the unit. Each lesson contributes one part of the language or method needed to solve it completely, and the unit investigation asks the learner to build a related model independently.

## Learning path

- **P9.1. Building the sine graph from circular motion**
- **P9.2. Building the cosine graph from circular motion**
- **P9.3. Amplitude, reflection, and midline**
- **P9.4. Period, frequency, and angular frequency**
- **P9.5. Phase shift and timing**
- **P9.6. The general sinusoidal function**
- **P9.7. Tangent and cotangent graphs**
- **P9.8. Secant and cosecant graphs**
- **P9.9. Symmetry, periodicity, and the six-function family**
- **P9.10. Inverse trigonometric functions and branch restrictions**
- **P9.11. Basic trigonometric equations**
- **P9.12. Sinusoidal modeling and regression**

---

## P9.1. Building the sine graph from circular motion

**Learning objective.** Construct y=sin t from the vertical coordinate of a rotating unit-circle point.

### The problem that opens the lesson

A point starts at (1,0) and rotates counterclockwise one revolution in 8 seconds. Sketch its vertical coordinate against time and label zeros, extrema, and period.

**Opening solution.** A point starts at (1,0) and rotates counterclockwise one revolution in 8 seconds. Sketch its vertical coordinate against time and label zeros, extrema, and period.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. The relevant conditions are not optional bookkeeping: The input axis represents angle or time-scaled angle, not horizontal position on the circle. Following that structure gives **A sine wave with zeros at 0,4,8 seconds; maximum at 2; minimum at 6.**

**Why this works.** The graph is not an arbitrary wave. Every point (t,sin t) is paired with the same input’s position on the circle. The rising and falling portions correspond to the point moving upward or downward. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The sine graph records the vertical coordinate of a unit-circle point as the real input t increases.

At quarter-turn intervals, sine moves through 0,1,0,-1,0. Connecting these values smoothly according to circular motion produces a periodic wave with range [-1,1], period 2pi, zeros at integer multiples of pi, and odd symmetry.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The graph is not an arbitrary wave. Every point (t,sin t) is paired with the same input’s position on the circle. The rising and falling portions correspond to the point moving upward or downward.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease.

The input axis represents angle or time-scaled angle, not horizontal position on the circle.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to plot the circular x-coordinate as sine or to place the first maximum at t=0.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A point starts at (1,0) and rotates counterclockwise one revolution in 8 seconds. Sketch its vertical coordinate against time and label zeros, extrema, and period.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. The relevant conditions are not optional bookkeeping: The input axis represents angle or time-scaled angle, not horizontal position on the circle. Following that structure gives **A sine wave with zeros at 0,4,8 seconds; maximum at 2; minimum at 6.**

**Why this works.** The graph is not an arbitrary wave. Every point (t,sin t) is paired with the same input’s position on the circle. The rising and falling portions correspond to the point moving upward or downward. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Create a quarter-cycle value table.

**Worked development.** Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. At quarter-turn intervals, sine moves through 0,1,0,-1,0. Connecting these values smoothly according to circular motion produces a periodic wave with range [-1,1], period 2pi, zeros at integer multiples of pi, and odd symmetry. Then apply the conditions explicitly: The input axis represents angle or time-scaled angle, not horizontal position on the circle. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Sine models vertical projection, alternating current, sound, tides, and repeated motion.

#### Reasoning example

**Problem.** Explain odd symmetry from unit-circle reflection.

**Worked development.** Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. At quarter-turn intervals, sine moves through 0,1,0,-1,0. Connecting these values smoothly according to circular motion produces a periodic wave with range [-1,1], period 2pi, zeros at integer multiples of pi, and odd symmetry. Then apply the conditions explicitly: The input axis represents angle or time-scaled angle, not horizontal position on the circle. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Sine models vertical projection, alternating current, sound, tides, and repeated motion.

**Worked example 4: quick check.** State the coordinates of the maximum and minimum of sin t on [0,2pi].

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. The relevant conditions are not optional bookkeeping: The input axis represents angle or time-scaled angle, not horizontal position on the circle. Following that structure gives **Maximum (pi/2,1); minimum (3pi/2,-1).**

**Why this works.** The graph is not an arbitrary wave. Every point (t,sin t) is paired with the same input’s position on the circle. The rising and falling portions correspond to the point moving upward or downward. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.1-V1: Linked unit-circle point and sine graph.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.1-V2: Quarter-cycle table-to-curve construction.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.1-V3: Odd-symmetry visual across the origin.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Sine models vertical projection, alternating current, sound, tides, and repeated motion.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

State the coordinates of the maximum and minimum of sin t on [0,2pi].

<details><summary>Check</summary>

Maximum (pi/2,1); minimum (3pi/2,-1).

</details>

### Practice set

1. State the coordinates of the maximum and minimum of sin t on [0,2pi].
2. Create a quarter-cycle value table.
3. Explain odd symmetry from unit-circle reflection.
4. Find all zeros of sine in one revolution.
5. State the defining idea behind building the sine graph from circular motion in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Maximum (pi/2,1); minimum (3pi/2,-1).
2. Use the method developed in the lesson: Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Build a key-point table at multiples of pi/2, plot one cycle, use symmetry and periodicity to extend, and label zeros, extrema, and intervals of increase or decrease. Verify all conditions and state the final result in the requested representation.
5. The sine graph records the vertical coordinate of a unit-circle point as the real input t increases.
6. The input axis represents angle or time-scaled angle, not horizontal position on the circle.
7. A common error is to plot the circular x-coordinate as sine or to place the first maximum at t=0.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson builds cosine from the horizontal coordinate of the same motion.

### Lesson summary

The sine graph records the vertical coordinate of a unit-circle point as the real input t increases.

The central condition to remember is this: The input axis represents angle or time-scaled angle, not horizontal position on the circle.

**Connection forward.** The next lesson builds cosine from the horizontal coordinate of the same motion.

The next lesson is **Building the cosine graph from circular motion**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.2. Building the cosine graph from circular motion

**Learning objective.** Construct y=cos t from the horizontal coordinate of circular motion and compare it with sine.

### The problem that opens the lesson

A rotating point begins at (1,0). At what inputs does its horizontal coordinate equal its vertical coordinate during one revolution?

**Opening solution.** A rotating point begins at (1,0). At what inputs does its horizontal coordinate equal its vertical coordinate during one revolution?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. The relevant conditions are not optional bookkeeping: Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function. Following that structure gives **t=pi/4 and 5pi/4.**

**Why this works.** Comparing sine and cosine on the same axes reveals that they describe perpendicular projections of one rotating point rather than unrelated formulas. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The cosine graph records the horizontal coordinate of unit-circle motion.

Cosine begins at 1, moves through 0,-1,0,1, and repeats every 2pi. It is even because the points reached at t and -t have the same horizontal coordinate. Cosine is a phase-shifted sine: cos t=sin(t+pi/2).

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Comparing sine and cosine on the same axes reveals that they describe perpendicular projections of one rotating point rather than unrelated formulas.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation.

Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to assume cosine has a different period or to shift in the wrong direction when rewriting it as sine.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A rotating point begins at (1,0). At what inputs does its horizontal coordinate equal its vertical coordinate during one revolution?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. The relevant conditions are not optional bookkeeping: Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function. Following that structure gives **t=pi/4 and 5pi/4.**

**Why this works.** Comparing sine and cosine on the same axes reveals that they describe perpendicular projections of one rotating point rather than unrelated formulas. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Build the cosine graph from quarter-cycle points.

**Worked development.** Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Cosine begins at 1, moves through 0,-1,0,1, and repeats every 2pi. It is even because the points reached at t and -t have the same horizontal coordinate. Cosine is a phase-shifted sine: cos t=sin(t+pi/2). Then apply the conditions explicitly: Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Cosine naturally models quantities that begin at a maximum or minimum.

#### Reasoning example

**Problem.** Show cos t=sin(t+pi/2).

**Worked development.** Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Cosine begins at 1, moves through 0,-1,0,1, and repeats every 2pi. It is even because the points reached at t and -t have the same horizontal coordinate. Cosine is a phase-shifted sine: cos t=sin(t+pi/2). Then apply the conditions explicitly: Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Cosine naturally models quantities that begin at a maximum or minimum.

**Worked example 4: quick check.** Write cosine as a shifted sine function.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. The relevant conditions are not optional bookkeeping: Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function. Following that structure gives **cos t=sin(t+pi/2).**

**Why this works.** Comparing sine and cosine on the same axes reveals that they describe perpendicular projections of one rotating point rather than unrelated formulas. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.2-V1: Linked unit-circle and cosine graph.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.2-V2: Sine-cosine phase overlay.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.2-V3: Even-symmetry reflection across y-axis.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Cosine naturally models quantities that begin at a maximum or minimum.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Write cosine as a shifted sine function.

<details><summary>Check</summary>

cos t=sin(t+pi/2).

</details>

### Practice set

1. Write cosine as a shifted sine function.
2. Build the cosine graph from quarter-cycle points.
3. Show cos t=sin(t+pi/2).
4. Compare even symmetry of cosine with odd symmetry of sine.
5. State the defining idea behind building the cosine graph from circular motion in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. cos t=sin(t+pi/2).
2. Use the method developed in the lesson: Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Construct cosine from unit-circle key points, identify its extrema and zeros, and compare its graph to sine by horizontal translation. Verify all conditions and state the final result in the requested representation.
5. The cosine graph records the horizontal coordinate of unit-circle motion.
6. Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function.
7. A common error is to assume cosine has a different period or to shift in the wrong direction when rewriting it as sine.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson scales and shifts the vertical range through amplitude and midline.

### Lesson summary

The cosine graph records the horizontal coordinate of unit-circle motion.

The central condition to remember is this: Equivalent phase-shift descriptions are not unique; adding whole periods produces the same function.

**Connection forward.** The next lesson scales and shifts the vertical range through amplitude and midline.

The next lesson is **Amplitude, reflection, and midline**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.3. Amplitude, reflection, and midline

**Learning objective.** Interpret A and D in y=A sin x+D or y=A cos x+D.

### The problem that opens the lesson

An ocean buoy moves between 1.2 and 4.8 meters above a reference level. Find the midline and amplitude.

**Opening solution.** An ocean buoy moves between 1.2 and 4.8 meters above a reference level. Find the midline and amplitude.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. The relevant conditions are not optional bookkeeping: This interpretation assumes a sinusoid with symmetric extrema about a constant midline. Following that structure gives **Midline 3.0 meters; amplitude 1.8 meters.**

**Why this works.** Amplitude is a distance, so it is nonnegative. The midline is the average of the maximum and minimum, and amplitude is half their difference. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

In y=A sin x+D or y=A cos x+D, |A| is the amplitude and y=D is the midline.

The maximum is D+|A| and the minimum is D-|A|. A negative A reflects the wave across its midline without making amplitude negative.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Amplitude is a distance, so it is nonnegative. The midline is the average of the maximum and minimum, and amplitude is half their difference.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase.

This interpretation assumes a sinusoid with symmetric extrema about a constant midline.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to call A the amplitude when A is negative or to confuse the midline with the y-intercept.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** An ocean buoy moves between 1.2 and 4.8 meters above a reference level. Find the midline and amplitude.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. The relevant conditions are not optional bookkeeping: This interpretation assumes a sinusoid with symmetric extrema about a constant midline. Following that structure gives **Midline 3.0 meters; amplitude 1.8 meters.**

**Why this works.** Amplitude is a distance, so it is nonnegative. The midline is the average of the maximum and minimum, and amplitude is half their difference. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Graph -3 sin x+2.

**Worked development.** Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The maximum is D+|A| and the minimum is D-|A|. A negative A reflects the wave across its midline without making amplitude negative. Then apply the conditions explicitly: This interpretation assumes a sinusoid with symmetric extrema about a constant midline. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Amplitude and midline describe tides, temperatures, voltage, vibration, and circular height.

#### Reasoning example

**Problem.** Recover amplitude and midline from maximum and minimum.

**Worked development.** Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The maximum is D+|A| and the minimum is D-|A|. A negative A reflects the wave across its midline without making amplitude negative. Then apply the conditions explicitly: This interpretation assumes a sinusoid with symmetric extrema about a constant midline. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Amplitude and midline describe tides, temperatures, voltage, vibration, and circular height.

**Worked example 4: quick check.** A sinusoid has maximum 11 and minimum -5. Find amplitude and midline.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. The relevant conditions are not optional bookkeeping: This interpretation assumes a sinusoid with symmetric extrema about a constant midline. Following that structure gives **Amplitude 8; midline 3.**

**Why this works.** Amplitude is a distance, so it is nonnegative. The midline is the average of the maximum and minimum, and amplitude is half their difference. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.3-V1: Maximum-minimum-midline diagram.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.3-V2: Positive and negative A comparison.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.3-V3: Vertical transformation coordinate mapping.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Amplitude and midline describe tides, temperatures, voltage, vibration, and circular height.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

A sinusoid has maximum 11 and minimum -5. Find amplitude and midline.

<details><summary>Check</summary>

Amplitude 8; midline 3.

</details>

### Practice set

1. A sinusoid has maximum 11 and minimum -5. Find amplitude and midline.
2. Graph -3 sin x+2.
3. Recover amplitude and midline from maximum and minimum.
4. Explain why amplitude is |A| rather than A.
5. State the defining idea behind amplitude, reflection, and midline in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Amplitude 8; midline 3.
2. Use the method developed in the lesson: Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Read extrema from a graph or context, compute D=(max+min)/2 and |A|=(max-min)/2, then use the sign of A to match the starting direction or phase. Verify all conditions and state the final result in the requested representation.
5. In y=A sin x+D or y=A cos x+D, |A| is the amplitude and y=D is the midline.
6. This interpretation assumes a sinusoid with symmetric extrema about a constant midline.
7. A common error is to call A the amplitude when A is negative or to confuse the midline with the y-intercept.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson changes horizontal scale through period and frequency.

### Lesson summary

In y=A sin x+D or y=A cos x+D, |A| is the amplitude and y=D is the midline.

The central condition to remember is this: This interpretation assumes a sinusoid with symmetric extrema about a constant midline.

**Connection forward.** The next lesson changes horizontal scale through period and frequency.

The next lesson is **Period, frequency, and angular frequency**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.4. Period, frequency, and angular frequency

**Learning objective.** Relate inside scale B to period, ordinary frequency, and angular frequency.

### The problem that opens the lesson

A piston completes 15 cycles in 6 seconds. Find frequency, period, and angular frequency.

**Opening solution.** A piston completes 15 cycles in 6 seconds. Find frequency, period, and angular frequency.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. The relevant conditions are not optional bookkeeping: A model must state the input unit. A period of 12 could mean seconds, months, or meters. Following that structure gives **Frequency 2.5 Hz; period 0.4 s; angular frequency 5pi rad/s.**

**Why this works.** For a time model, angular frequency omega=2pi f=2pi/T. The units distinguish cycles per second, seconds per cycle, and radians per second. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

For sin(Bx) or cos(Bx), the period is 2pi/|B|. Ordinary frequency is the reciprocal of period, while angular frequency measures radians per unit time.

The inside multiplier changes how quickly the input completes a full 2pi cycle. If B is larger, the graph completes more cycles in the same horizontal distance.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

For a time model, angular frequency omega=2pi f=2pi/T. The units distinguish cycles per second, seconds per cycle, and radians per second.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested.

A model must state the input unit. A period of 12 could mean seconds, months, or meters.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to use 2pi B as the period rather than dividing by |B|.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A piston completes 15 cycles in 6 seconds. Find frequency, period, and angular frequency.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. The relevant conditions are not optional bookkeeping: A model must state the input unit. A period of 12 could mean seconds, months, or meters. Following that structure gives **Frequency 2.5 Hz; period 0.4 s; angular frequency 5pi rad/s.**

**Why this works.** For a time model, angular frequency omega=2pi f=2pi/T. The units distinguish cycles per second, seconds per cycle, and radians per second. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Find the period of sin(3x).

**Worked development.** Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The inside multiplier changes how quickly the input completes a full 2pi cycle. If B is larger, the graph completes more cycles in the same horizontal distance. Then apply the conditions explicitly: A model must state the input unit. A period of 12 could mean seconds, months, or meters. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Frequency parameters model music, rotation, seasonal cycles, waves, and machinery.

#### Reasoning example

**Problem.** Build B from a known period of 10.

**Worked development.** Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The inside multiplier changes how quickly the input completes a full 2pi cycle. If B is larger, the graph completes more cycles in the same horizontal distance. Then apply the conditions explicitly: A model must state the input unit. A period of 12 could mean seconds, months, or meters. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Frequency parameters model music, rotation, seasonal cycles, waves, and machinery.

**Worked example 4: quick check.** Find the period and frequency of y=cos(pi t/6).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. The relevant conditions are not optional bookkeeping: A model must state the input unit. A period of 12 could mean seconds, months, or meters. Following that structure gives **Period 12; frequency 1/12 per time unit.**

**Why this works.** For a time model, angular frequency omega=2pi f=2pi/T. The units distinguish cycles per second, seconds per cycle, and radians per second. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.4-V1: Cycle-length graph with one period marked.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.4-V2: Frequency-period reciprocal diagram.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.4-V3: Ordinary versus angular frequency unit chart.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Frequency parameters model music, rotation, seasonal cycles, waves, and machinery.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find the period and frequency of y=cos(pi t/6).

<details><summary>Check</summary>

Period 12; frequency 1/12 per time unit.

</details>

### Practice set

1. Find the period and frequency of y=cos(pi t/6).
2. Find the period of sin(3x).
3. Build B from a known period of 10.
4. Convert rotations per minute to angular frequency.
5. State the defining idea behind period, frequency, and angular frequency in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Period 12; frequency 1/12 per time unit.
2. Use the method developed in the lesson: Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify the coefficient of the entire input, compute period, then convert to frequency or angular frequency as requested. Verify all conditions and state the final result in the requested representation.
5. For sin(Bx) or cos(Bx), the period is 2pi/|B|. Ordinary frequency is the reciprocal of period, while angular frequency measures radians per unit time.
6. A model must state the input unit. A period of 12 could mean seconds, months, or meters.
7. A common error is to use 2pi B as the period rather than dividing by |B|.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson shifts the cycle horizontally to match event timing.

### Lesson summary

For sin(Bx) or cos(Bx), the period is 2pi/|B|. Ordinary frequency is the reciprocal of period, while angular frequency measures radians per unit time.

The central condition to remember is this: A model must state the input unit. A period of 12 could mean seconds, months, or meters.

**Connection forward.** The next lesson shifts the cycle horizontally to match event timing.

The next lesson is **Phase shift and timing**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.5. Phase shift and timing

**Learning objective.** Interpret B(x-C) as a horizontal timing shift and recover C from graph or context.

### The problem that opens the lesson

A seasonal temperature reaches its maximum on day 205 of a 365-day cycle. Write a cosine model phase term with the maximum at day 205.

**Opening solution.** A seasonal temperature reaches its maximum on day 205 of a 365-day cycle. Write a cosine model phase term with the maximum at day 205.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. The relevant conditions are not optional bookkeeping: Phase shift is defined modulo a full period. Many values of C describe the same function. Following that structure gives **Use cos[2pi(t-205)/365].**

**Why this works.** Sine and cosine forms can model the same cycle with different phase choices. The best form often places a known maximum, minimum, or midline crossing at a simple input. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A phase shift relocates the timing of every feature of a periodic graph.

In B(x-C), the parent input is zero when x=C, so the graph’s anchor feature occurs at C. Factoring B from an expanded inside expression is necessary before reading the shift.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Sine and cosine forms can model the same cycle with different phase choices. The best form often places a known maximum, minimum, or midline crossing at a simple input.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away.

Phase shift is defined modulo a full period. Many values of C describe the same function.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to read x+3 as a right shift or to ignore an inside scale, as in sin(2x-6).

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A seasonal temperature reaches its maximum on day 205 of a 365-day cycle. Write a cosine model phase term with the maximum at day 205.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. The relevant conditions are not optional bookkeeping: Phase shift is defined modulo a full period. Many values of C describe the same function. Following that structure gives **Use cos[2pi(t-205)/365].**

**Why this works.** Sine and cosine forms can model the same cycle with different phase choices. The best form often places a known maximum, minimum, or midline crossing at a simple input. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Graph sin(x-pi/3).

**Worked development.** Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. In B(x-C), the parent input is zero when x=C, so the graph’s anchor feature occurs at C. Factoring B from an expanded inside expression is necessary before reading the shift. Then apply the conditions explicitly: Phase shift is defined modulo a full period. Many values of C describe the same function. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Phase aligns a periodic model with calendar dates, starting positions, or delayed signals.

#### Reasoning example

**Problem.** Recover phase shift from a midline crossing.

**Worked development.** Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. In B(x-C), the parent input is zero when x=C, so the graph’s anchor feature occurs at C. Factoring B from an expanded inside expression is necessary before reading the shift. Then apply the conditions explicitly: Phase shift is defined modulo a full period. Many values of C describe the same function. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Phase aligns a periodic model with calendar dates, starting positions, or delayed signals.

**Worked example 4: quick check.** A cosine graph has period 8 and maximum at x=3. Write its inside expression.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. The relevant conditions are not optional bookkeeping: Phase shift is defined modulo a full period. Many values of C describe the same function. Following that structure gives **(pi/4)(x-3).**

**Why this works.** Sine and cosine forms can model the same cycle with different phase choices. The best form often places a known maximum, minimum, or midline crossing at a simple input. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.5-V1: Feature timing map for maxima and crossings.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.5-V2: Coordinate-mapping derivation of C.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.5-V3: Equivalent sine and cosine timing forms.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Phase aligns a periodic model with calendar dates, starting positions, or delayed signals.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

A cosine graph has period 8 and maximum at x=3. Write its inside expression.

<details><summary>Check</summary>

(pi/4)(x-3).

</details>

### Practice set

1. A cosine graph has period 8 and maximum at x=3. Write its inside expression.
2. Graph sin(x-pi/3).
3. Recover phase shift from a midline crossing.
4. Distinguish phase shift from a vertical shift.
5. State the defining idea behind phase shift and timing in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. (pi/4)(x-3).
2. Use the method developed in the lesson: Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Determine the period first, choose an anchor feature, write B(x-C), and verify at least one additional feature a quarter-period away. Verify all conditions and state the final result in the requested representation.
5. A phase shift relocates the timing of every feature of a periodic graph.
6. Phase shift is defined modulo a full period. Many values of C describe the same function.
7. A common error is to read x+3 as a right shift or to ignore an inside scale, as in sin(2x-6).
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson combines amplitude, period, phase, and midline in a complete sinusoidal model.

### Lesson summary

A phase shift relocates the timing of every feature of a periodic graph.

The central condition to remember is this: Phase shift is defined modulo a full period. Many values of C describe the same function.

**Connection forward.** The next lesson combines amplitude, period, phase, and midline in a complete sinusoidal model.

The next lesson is **The general sinusoidal function**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.6. The general sinusoidal function

**Learning objective.** Build and analyze y=A sin(B(x-C))+D and equivalent cosine forms.

### The problem that opens the lesson

A Ferris wheel ranges from 2 to 38 meters, has period 60 seconds, and begins at its lowest point. Write a height model.

**Opening solution.** A Ferris wheel ranges from 2 to 38 meters, has period 60 seconds, and begins at its lowest point. Write a height model.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. The relevant conditions are not optional bookkeeping: Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion. Following that structure gives **H(t)=20-18 cos(pi t/30).**

**Why this works.** The same sinusoid has infinitely many equivalent sine and cosine forms. Equivalence can be checked by graph features or identities. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The general sinusoidal model y=A sin(B(x-C))+D or its cosine equivalent combines vertical range, horizontal cycle, and timing.

The parameters encode amplitude |A|, period 2pi/|B|, phase anchor C, and midline D. A complete model also needs a meaningful domain and units.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The same sinusoid has infinitely many equivalent sine and cosine forms. Equivalence can be checked by graph features or identities.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point.

Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to use the period itself as B or to set C equal to the first data point without matching the chosen parent feature.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A Ferris wheel ranges from 2 to 38 meters, has period 60 seconds, and begins at its lowest point. Write a height model.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. The relevant conditions are not optional bookkeeping: Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion. Following that structure gives **H(t)=20-18 cos(pi t/30).**

**Why this works.** The same sinusoid has infinitely many equivalent sine and cosine forms. Equivalence can be checked by graph features or identities. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Write a model from maximum, minimum, period, and first maximum.

**Worked development.** Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The parameters encode amplitude |A|, period 2pi/|B|, phase anchor C, and midline D. A complete model also needs a meaningful domain and units. Then apply the conditions explicitly: Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** General sinusoidal models describe Ferris wheels, daylight, tides, seasons, and rotating sensors.

#### Reasoning example

**Problem.** Convert a sine model to an equivalent cosine model.

**Worked development.** Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The parameters encode amplitude |A|, period 2pi/|B|, phase anchor C, and midline D. A complete model also needs a meaningful domain and units. Then apply the conditions explicitly: Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** General sinusoidal models describe Ferris wheels, daylight, tides, seasons, and rotating sensors.

**Worked example 4: quick check.** Write a sinusoid with amplitude 4, midline -1, period 6, and maximum at x=2.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. The relevant conditions are not optional bookkeeping: Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion. Following that structure gives **y=4 cos[(pi/3)(x-2)]-1.**

**Why this works.** The same sinusoid has infinitely many equivalent sine and cosine forms. Equivalence can be checked by graph features or identities. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.6-V1: Five-parameter sinusoid dashboard.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.6-V2: Feature-to-parameter construction diagram.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.6-V3: Equivalent sine/cosine overlay.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

General sinusoidal models describe Ferris wheels, daylight, tides, seasons, and rotating sensors.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Write a sinusoid with amplitude 4, midline -1, period 6, and maximum at x=2.

<details><summary>Check</summary>

y=4 cos[(pi/3)(x-2)]-1.

</details>

### Practice set

1. Write a sinusoid with amplitude 4, midline -1, period 6, and maximum at x=2.
2. Write a model from maximum, minimum, period, and first maximum.
3. Convert a sine model to an equivalent cosine model.
4. Solve for times when a model crosses its midline.
5. State the defining idea behind the general sinusoidal function in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. y=4 cos[(pi/3)(x-2)]-1.
2. Use the method developed in the lesson: Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Extract maximum, minimum, period, and a timed feature. Compute A,D,B, select sine or cosine based on the anchor, and verify against another point. Verify all conditions and state the final result in the requested representation.
5. The general sinusoidal model y=A sin(B(x-C))+D or its cosine equivalent combines vertical range, horizontal cycle, and timing.
6. Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion.
7. A common error is to use the period itself as B or to set C equal to the first data point without matching the chosen parent feature.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson builds tangent and cotangent from quotient structure and asymptotes.

### Lesson summary

The general sinusoidal model y=A sin(B(x-C))+D or its cosine equivalent combines vertical range, horizontal cycle, and timing.

The central condition to remember is this: Real periodic data may drift, damp, or contain noise; the model is an approximation unless derived from ideal circular motion.

**Connection forward.** The next lesson builds tangent and cotangent from quotient structure and asymptotes.

The next lesson is **Tangent and cotangent graphs**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.7. Tangent and cotangent graphs

**Learning objective.** Derive tangent and cotangent graphs from quotient definitions, zeros, asymptotes, and period pi.

### The problem that opens the lesson

Sketch tan x on (-pi/2,3pi/2) using sine and cosine signs rather than memory.

**Opening solution.** Sketch tan x on (-pi/2,3pi/2) using sine and cosine signs rather than memory.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. The relevant conditions are not optional bookkeeping: A transformed tangent’s vertical shift is a center line, not a horizontal asymptote. Following that structure gives **Zeros at 0 and pi; asymptotes at -pi/2, pi/2, 3pi/2; increasing branches.**

**Why this works.** The half-turn period follows because both sine and cosine change sign after pi, leaving their ratio unchanged. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Tangent is sin x/cos x and therefore records the slope of the terminal ray when cosine is nonzero. Cotangent is its reciprocal ratio.

Tangent has zeros where sine is zero, vertical asymptotes where cosine is zero, range all real numbers, and period pi. Each branch increases from negative infinity to positive infinity.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The half-turn period follows because both sine and cosine change sign after pi, leaving their ratio unchanged.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure.

A transformed tangent’s vertical shift is a center line, not a horizontal asymptote.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to connect branches across an asymptote or to give tangent the 2pi period of sine.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Sketch tan x on (-pi/2,3pi/2) using sine and cosine signs rather than memory.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. The relevant conditions are not optional bookkeeping: A transformed tangent’s vertical shift is a center line, not a horizontal asymptote. Following that structure gives **Zeros at 0 and pi; asymptotes at -pi/2, pi/2, 3pi/2; increasing branches.**

**Why this works.** The half-turn period follows because both sine and cosine change sign after pi, leaving their ratio unchanged. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Derive tangent period pi.

**Worked development.** Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Tangent has zeros where sine is zero, vertical asymptotes where cosine is zero, range all real numbers, and period pi. Each branch increases from negative infinity to positive infinity. Then apply the conditions explicitly: A transformed tangent’s vertical shift is a center line, not a horizontal asymptote. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Tangent models slopes, perspective, periodic blow-up behavior, and phase response.

#### Reasoning example

**Problem.** Graph 2tan(3(x-pi/6))+1.

**Worked development.** Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Tangent has zeros where sine is zero, vertical asymptotes where cosine is zero, range all real numbers, and period pi. Each branch increases from negative infinity to positive infinity. Then apply the conditions explicitly: A transformed tangent’s vertical shift is a center line, not a horizontal asymptote. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Tangent models slopes, perspective, periodic blow-up behavior, and phase response.

**Worked example 4: quick check.** Find the period and vertical asymptotes of tan(2x).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. The relevant conditions are not optional bookkeeping: A transformed tangent’s vertical shift is a center line, not a horizontal asymptote. Following that structure gives **Period pi/2; asymptotes x=pi/4+kpi/2.**

**Why this works.** The half-turn period follows because both sine and cosine change sign after pi, leaving their ratio unchanged. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.7-V1: Sine/cosine quotient sign chart aligned to tangent graph.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.7-V2: Terminal-ray slope interpretation.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.7-V3: Transformed tangent branch with asymptotes.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Tangent models slopes, perspective, periodic blow-up behavior, and phase response.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find the period and vertical asymptotes of tan(2x).

<details><summary>Check</summary>

Period pi/2; asymptotes x=pi/4+kpi/2.

</details>

### Practice set

1. Find the period and vertical asymptotes of tan(2x).
2. Derive tangent period pi.
3. Graph 2tan(3(x-pi/6))+1.
4. Connect tangent to slope of a terminal ray.
5. State the defining idea behind tangent and cotangent graphs in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Period pi/2; asymptotes x=pi/4+kpi/2.
2. Use the method developed in the lesson: Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Mark asymptotes first, place zeros midway between them, use exact values at pi/4 offsets, and apply transformations to the branch structure. Verify all conditions and state the final result in the requested representation.
5. Tangent is sin x/cos x and therefore records the slope of the terminal ray when cosine is nonzero. Cotangent is its reciprocal ratio.
6. A transformed tangent’s vertical shift is a center line, not a horizontal asymptote.
7. A common error is to connect branches across an asymptote or to give tangent the 2pi period of sine.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson constructs secant and cosecant from reciprocal relationships.

### Lesson summary

Tangent is sin x/cos x and therefore records the slope of the terminal ray when cosine is nonzero. Cotangent is its reciprocal ratio.

The central condition to remember is this: A transformed tangent’s vertical shift is a center line, not a horizontal asymptote.

**Connection forward.** The next lesson constructs secant and cosecant from reciprocal relationships.

The next lesson is **Secant and cosecant graphs**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.8. Secant and cosecant graphs

**Learning objective.** Construct secant and cosecant graphs as reciprocals of cosine and sine.

### The problem that opens the lesson

Use the graph of cos x to sketch sec x on [0,2pi], marking all vertices and asymptotes.

**Opening solution.** Use the graph of cos x to sketch sec x on [0,2pi], marking all vertices and asymptotes.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. The relevant conditions are not optional bookkeeping: Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range. Following that structure gives **Vertices at (0,1),(pi,-1),(2pi,1); asymptotes at pi/2 and 3pi/2.**

**Why this works.** The reciprocal graph cannot cross the interval (-1,1), so its range is (-infinity,-1] union [1,infinity) before transformations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Secant and cosecant are the reciprocals of cosine and sine.

Where the parent sine or cosine equals zero, the reciprocal is undefined and has a vertical asymptote. Where the parent reaches 1 or -1, the reciprocal reaches corresponding vertices 1 or -1.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The reciprocal graph cannot cross the interval (-1,1), so its range is (-infinity,-1] union [1,infinity) before transformations.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band.

Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to draw U-shaped branches through asymptotes or to place vertices at parent zeros.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Use the graph of cos x to sketch sec x on [0,2pi], marking all vertices and asymptotes.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. The relevant conditions are not optional bookkeeping: Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range. Following that structure gives **Vertices at (0,1),(pi,-1),(2pi,1); asymptotes at pi/2 and 3pi/2.**

**Why this works.** The reciprocal graph cannot cross the interval (-1,1), so its range is (-infinity,-1] union [1,infinity) before transformations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Construct csc x from sin x.

**Worked development.** Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Where the parent sine or cosine equals zero, the reciprocal is undefined and has a vertical asymptote. Where the parent reaches 1 or -1, the reciprocal reaches corresponding vertices 1 or -1. Then apply the conditions explicitly: Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Reciprocal trig graphs appear in optics, wave geometry, and analytic identities.

#### Reasoning example

**Problem.** Graph -2sec(x-pi/3)+1.

**Worked development.** Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Where the parent sine or cosine equals zero, the reciprocal is undefined and has a vertical asymptote. Where the parent reaches 1 or -1, the reciprocal reaches corresponding vertices 1 or -1. Then apply the conditions explicitly: Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Reciprocal trig graphs appear in optics, wave geometry, and analytic identities.

**Worked example 4: quick check.** State the range of y=3sec x-2.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. The relevant conditions are not optional bookkeeping: Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range. Following that structure gives **(-infinity,-5] union [1,infinity).**

**Why this works.** The reciprocal graph cannot cross the interval (-1,1), so its range is (-infinity,-1] union [1,infinity) before transformations. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.8-V1: Cosine and secant overlay with reciprocal points.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.8-V2: Sine and cosecant overlay.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.8-V3: Error panel preventing branch connections across asymptotes.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Reciprocal trig graphs appear in optics, wave geometry, and analytic identities.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

State the range of y=3sec x-2.

<details><summary>Check</summary>

(-infinity,-5] union [1,infinity).

</details>

### Practice set

1. State the range of y=3sec x-2.
2. Construct csc x from sin x.
3. Graph -2sec(x-pi/3)+1.
4. Explain why reciprocal graphs have no x-intercepts.
5. State the defining idea behind secant and cosecant graphs in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. (-infinity,-5] union [1,infinity).
2. Use the method developed in the lesson: Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Graph the underlying sine or cosine lightly, draw asymptotes at its zeros, plot reciprocal vertices at extrema, and sketch branches away from the forbidden band. Verify all conditions and state the final result in the requested representation.
5. Secant and cosecant are the reciprocals of cosine and sine.
6. Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range.
7. A common error is to draw U-shaped branches through asymptotes or to place vertices at parent zeros.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson compares all six functions in one structural family.

### Lesson summary

Secant and cosecant are the reciprocals of cosine and sine.

The central condition to remember is this: Transformations change the forbidden band and vertex levels. Solve inequalities carefully to state the range.

**Connection forward.** The next lesson compares all six functions in one structural family.

The next lesson is **Symmetry, periodicity, and the six-function family**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.9. Symmetry, periodicity, and the six-function family

**Learning objective.** Compare domains, ranges, parity, periods, zeros, and asymptotes of all six trig functions.

### The problem that opens the lesson

Without graphing, decide which trig functions satisfy f(-x)=-f(x) and which satisfy f(-x)=f(x).

**Opening solution.** Without graphing, decide which trig functions satisfy f(-x)=-f(x) and which satisfy f(-x)=f(x).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. The relevant conditions are not optional bookkeeping: Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference. Following that structure gives **Cosine and secant are even; sine, tangent, cotangent, and cosecant are odd.**

**Why this works.** A comparison table makes reciprocal and quotient relationships visible and supports rapid graph identification. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The six trigonometric functions share a unit-circle origin but differ in domain, range, parity, period, zeros, and asymptotes.

Sine and cosine have period 2pi; tangent and cotangent have period pi; secant and cosecant inherit 2pi. Cosine and secant are even; the other four are odd.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A comparison table makes reciprocal and quotient relationships visible and supports rapid graph identification.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists.

Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to transfer one function’s domain or period to its reciprocal or quotient partner without checking.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Without graphing, decide which trig functions satisfy f(-x)=-f(x) and which satisfy f(-x)=f(x).

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. The relevant conditions are not optional bookkeeping: Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference. Following that structure gives **Cosine and secant are even; sine, tangent, cotangent, and cosecant are odd.**

**Why this works.** A comparison table makes reciprocal and quotient relationships visible and supports rapid graph identification. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Build a six-function feature table.

**Worked development.** Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Sine and cosine have period 2pi; tangent and cotangent have period pi; secant and cosecant inherit 2pi. Cosine and secant are even; the other four are odd. Then apply the conditions explicitly: Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The family comparison is essential for identities and equation solving.

#### Reasoning example

**Problem.** Compare periods 2pi and pi.

**Worked development.** Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Sine and cosine have period 2pi; tangent and cotangent have period pi; secant and cosecant inherit 2pi. Cosine and secant are even; the other four are odd. Then apply the conditions explicitly: Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The family comparison is essential for identities and equation solving.

**Worked example 4: quick check.** Which functions are undefined at integer multiples of pi?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. The relevant conditions are not optional bookkeeping: Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference. Following that structure gives **csc x and cot x.**

**Why this works.** A comparison table makes reciprocal and quotient relationships visible and supports rapid graph identification. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.9-V1: Six-function comparison matrix.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.9-V2: Even/odd graph overlays.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.9-V3: Period tiles showing repeated intervals.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

The family comparison is essential for identities and equation solving.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Which functions are undefined at integer multiples of pi?

<details><summary>Check</summary>

csc x and cot x.

</details>

### Practice set

1. Which functions are undefined at integer multiples of pi?
2. Build a six-function feature table.
3. Compare periods 2pi and pi.
4. Determine sign patterns by quadrant.
5. State the defining idea behind symmetry, periodicity, and the six-function family in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. csc x and cot x.
2. Use the method developed in the lesson: Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Classify a function by its defining ratio, then derive features rather than memorizing six unrelated lists. Verify all conditions and state the final result in the requested representation.
5. The six trigonometric functions share a unit-circle origin but differ in domain, range, parity, period, zeros, and asymptotes.
6. Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference.
7. A common error is to transfer one function’s domain or period to its reciprocal or quotient partner without checking.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson restricts periodic functions so their inverse relations become functions.

### Lesson summary

The six trigonometric functions share a unit-circle origin but differ in domain, range, parity, period, zeros, and asymptotes.

The central condition to remember is this: Transformations can alter visible symmetry about the coordinate axes even though the parent parity remains a reference.

**Connection forward.** The next lesson restricts periodic functions so their inverse relations become functions.

The next lesson is **Inverse trigonometric functions and branch restrictions**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.10. Inverse trigonometric functions and branch restrictions

**Learning objective.** Define inverse sine, cosine, and tangent using one-to-one branches and principal-value ranges.

### The problem that opens the lesson

Why can sin x not have an inverse on all real numbers, and why is [-pi/2,pi/2] a useful restricted domain?

**Opening solution.** Why can sin x not have an inverse on all real numbers, and why is [-pi/2,pi/2] a useful restricted domain?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. The relevant conditions are not optional bookkeeping: The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x. Following that structure gives **Sine repeats outputs globally; on [-pi/2,pi/2] it is one-to-one and covers [-1,1].**

**Why this works.** The inverse domains are the original ranges: arcsin and arccos accept [-1,1], while arctan accepts all real inputs. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Inverse trigonometric functions reverse restricted one-to-one branches of sine, cosine, and tangent.

Arcsine uses sine on [-pi/2,pi/2], arccosine uses cosine on [0,pi], and arctangent uses tangent on (-pi/2,pi/2). These ranges are principal-value conventions chosen to make each restricted function one-to-one while covering its natural range.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The inverse domains are the original ranges: arcsin and arccos accept [-1,1], while arctan accepts all real inputs.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range.

The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to return a coterminal angle outside the principal inverse range.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Why can sin x not have an inverse on all real numbers, and why is [-pi/2,pi/2] a useful restricted domain?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. The relevant conditions are not optional bookkeeping: The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x. Following that structure gives **Sine repeats outputs globally; on [-pi/2,pi/2] it is one-to-one and covers [-1,1].**

**Why this works.** The inverse domains are the original ranges: arcsin and arccos accept [-1,1], while arctan accepts all real inputs. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Evaluate arcsin(-sqrt(3)/2).

**Worked development.** Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Arcsine uses sine on [-pi/2,pi/2], arccosine uses cosine on [0,pi], and arctangent uses tangent on (-pi/2,pi/2). These ranges are principal-value conventions chosen to make each restricted function one-to-one while covering its natural range. Then apply the conditions explicitly: The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Inverse trig functions recover angles in triangles, equations, vectors, and numerical models.

#### Reasoning example

**Problem.** Evaluate arccos(-1/2).

**Worked development.** Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Arcsine uses sine on [-pi/2,pi/2], arccosine uses cosine on [0,pi], and arctangent uses tangent on (-pi/2,pi/2). These ranges are principal-value conventions chosen to make each restricted function one-to-one while covering its natural range. Then apply the conditions explicitly: The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Inverse trig functions recover angles in triangles, equations, vectors, and numerical models.

**Worked example 4: quick check.** Evaluate arctan(-1) in its principal range.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. The relevant conditions are not optional bookkeeping: The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x. Following that structure gives **-pi/4.**

**Why this works.** The inverse domains are the original ranges: arcsin and arccos accept [-1,1], while arctan accepts all real inputs. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.10-V1: Restricted sine/cosine/tangent branches.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.10-V2: Inverse reflection across y=x.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.10-V3: Inverse-versus-reciprocal comparison.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Inverse trig functions recover angles in triangles, equations, vectors, and numerical models.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Evaluate arctan(-1) in its principal range.

<details><summary>Check</summary>

-pi/4.

</details>

### Practice set

1. Evaluate arctan(-1) in its principal range.
2. Evaluate arcsin(-sqrt(3)/2).
3. Evaluate arccos(-1/2).
4. Simplify sin(arccos(3/5)) using a triangle.
5. State the defining idea behind inverse trigonometric functions and branch restrictions in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. -pi/4.
2. Use the method developed in the lesson: Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Evaluate exact values by finding the principal angle in the required range. For compositions such as sin(arccos u), draw a right triangle or use identities with sign determined by the principal range. Verify all conditions and state the final result in the requested representation.
5. Inverse trigonometric functions reverse restricted one-to-one branches of sine, cosine, and tangent.
6. The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x.
7. A common error is to return a coterminal angle outside the principal inverse range.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson uses inverse values and periodicity to solve basic trigonometric equations.

### Lesson summary

Inverse trigonometric functions reverse restricted one-to-one branches of sine, cosine, and tangent.

The central condition to remember is this: The notation sin^{-1} x means inverse sine, not reciprocal sine. The reciprocal is csc x.

**Connection forward.** The next lesson uses inverse values and periodicity to solve basic trigonometric equations.

The next lesson is **Basic trigonometric equations**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.11. Basic trigonometric equations

**Learning objective.** Solve sin x=k, cos x=k, and tan x=k using exact values, inverse functions, periodicity, and interval restrictions.

### The problem that opens the lesson

Solve sin x=1/2 for all real x and then list solutions on [-pi,3pi].

**Opening solution.** Solve sin x=1/2 for all real x and then list solutions on [-pi,3pi].

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. The relevant conditions are not optional bookkeeping: Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions. Following that structure gives **x=pi/6+2kpi or 5pi/6+2kpi; interval solutions follow from those families.**

**Why this works.** Exact unit-circle values should be used when possible. Otherwise find a principal inverse angle and use graph symmetry to generate the remaining branch before adding periods. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A basic trigonometric equation asks for every input whose function value equals a given constant.

On one period, a horizontal line may meet sine or cosine twice and tangent once. Periodicity then generates all real solutions.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Exact unit-circle values should be used when possible. Otherwise find a principal inverse angle and use graph symmetry to generate the remaining branch before adding periods.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent.

Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to report only the calculator’s principal inverse value.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Solve sin x=1/2 for all real x and then list solutions on [-pi,3pi].

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. The relevant conditions are not optional bookkeeping: Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions. Following that structure gives **x=pi/6+2kpi or 5pi/6+2kpi; interval solutions follow from those families.**

**Why this works.** Exact unit-circle values should be used when possible. Otherwise find a principal inverse angle and use graph symmetry to generate the remaining branch before adding periods. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Solve cos x=-sqrt(2)/2.

**Worked development.** State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. On one period, a horizontal line may meet sine or cosine twice and tangent once. Periodicity then generates all real solutions. Then apply the conditions explicitly: Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Basic equations locate times, angles, phases, and intersections in periodic models.

#### Reasoning example

**Problem.** Solve tan x=3 numerically.

**Worked development.** State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. On one period, a horizontal line may meet sine or cosine twice and tangent once. Periodicity then generates all real solutions. Then apply the conditions explicitly: Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Basic equations locate times, angles, phases, and intersections in periodic models.

**Worked example 4: quick check.** Solve cos x=0 on [0,2pi].

**Solution.** Begin by identifying the mathematical object and the information that fixes it. State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. The relevant conditions are not optional bookkeeping: Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions. Following that structure gives **x=pi/2 and 3pi/2.**

**Why this works.** Exact unit-circle values should be used when possible. Otherwise find a principal inverse angle and use graph symmetry to generate the remaining branch before adding periods. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.11-V1: Horizontal-line intersections with periodic graphs.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.11-V2: Unit-circle solution families.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.11-V3: General-solution number line.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Basic equations locate times, angles, phases, and intersections in periodic models.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Solve cos x=0 on [0,2pi].

<details><summary>Check</summary>

x=pi/2 and 3pi/2.

</details>

### Practice set

1. Solve cos x=0 on [0,2pi].
2. Solve cos x=-sqrt(2)/2.
3. Solve tan x=3 numerically.
4. Solve 2sin x-1=0 on [0,2pi).
5. State the defining idea behind basic trigonometric equations in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. x=pi/2 and 3pi/2.
2. Use the method developed in the lesson: State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: State general solutions with an integer parameter, then filter them into a requested interval. Keep degree or radian mode consistent. Verify all conditions and state the final result in the requested representation.
5. A basic trigonometric equation asks for every input whose function value equals a given constant.
6. Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions.
7. A common error is to report only the calculator’s principal inverse value.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson fits sinusoidal functions to real data and studies residuals and limitations.

### Lesson summary

A basic trigonometric equation asks for every input whose function value equals a given constant.

The central condition to remember is this: Sine and cosine have no real solution when |k|>1. Reciprocal functions impose additional domain exclusions.

**Connection forward.** The next lesson fits sinusoidal functions to real data and studies residuals and limitations.

The next lesson is **Sinusoidal modeling and regression**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## P9.12. Sinusoidal modeling and regression

**Learning objective.** Fit and critique sinusoidal models using amplitude, midline, period, phase, residuals, and domain.

### The problem that opens the lesson

Monthly daylight hours range from 9.1 to 15.3, with a maximum near day 172. Build a first sinusoidal model with period 365.

**Opening solution.** Monthly daylight hours range from 9.1 to 15.3, with a maximum near day 172. Build a first sinusoidal model with period 365.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. The relevant conditions are not optional bookkeeping: Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time. Following that structure gives **D(t)=12.2+3.1 cos[2pi(t-172)/365].**

**Why this works.** Residuals should be small and patternless if the sinusoidal form captures the main structure. Changing amplitude, drifting midline, multiple frequencies, or irregular timing produce systematic residuals. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Sinusoidal modeling estimates a periodic relationship from observed extrema, timing, or regression.

Amplitude, midline, period, and phase carry direct contextual meanings. Regression selects parameters that best fit noisy data but does not prove exact periodicity.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Residuals should be small and patternless if the sinusoidal form captures the main structure. Changing amplitude, drifting midline, multiple frequencies, or irregular timing produce systematic residuals.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals.

Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to fit a sinusoid merely because data rise and fall once.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Monthly daylight hours range from 9.1 to 15.3, with a maximum near day 172. Build a first sinusoidal model with period 365.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. The relevant conditions are not optional bookkeeping: Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time. Following that structure gives **D(t)=12.2+3.1 cos[2pi(t-172)/365].**

**Why this works.** Residuals should be small and patternless if the sinusoidal form captures the main structure. Changing amplitude, drifting midline, multiple frequencies, or irregular timing produce systematic residuals. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Fit a sinusoid from a table of maxima and minima.

**Worked development.** Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Amplitude, midline, period, and phase carry direct contextual meanings. Regression selects parameters that best fit noisy data but does not prove exact periodicity. Then apply the conditions explicitly: Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Periodic regression supports climate, tides, daylight, acoustics, and mechanical monitoring.

#### Reasoning example

**Problem.** Interpret a residual of -0.6 hour.

**Worked development.** Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Amplitude, midline, period, and phase carry direct contextual meanings. Regression selects parameters that best fit noisy data but does not prove exact periodicity. Then apply the conditions explicitly: Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Periodic regression supports climate, tides, daylight, acoustics, and mechanical monitoring.

**Worked example 4: quick check.** A sinusoidal model has period 24 and minimum at t=5. Give a cosine phase that places the minimum correctly.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. The relevant conditions are not optional bookkeeping: Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time. Following that structure gives **-cos[pi(t-5)/12] or an equivalent shifted form.**

**Why this works.** Residuals should be small and patternless if the sinusoidal form captures the main structure. Changing amplitude, drifting midline, multiple frequencies, or irregular timing produce systematic residuals. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P9.12-V1: Data scatter with fitted sinusoid and residuals.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.12-V2: Parameter meanings on one annual cycle.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P9.12-V3: Damped or modulated waveform comparison.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Periodic regression supports climate, tides, daylight, acoustics, and mechanical monitoring.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

A sinusoidal model has period 24 and minimum at t=5. Give a cosine phase that places the minimum correctly.

<details><summary>Check</summary>

-cos[pi(t-5)/12] or an equivalent shifted form.

</details>

### Practice set

1. A sinusoidal model has period 24 and minimum at t=5. Give a cosine phase that places the minimum correctly.
2. Fit a sinusoid from a table of maxima and minima.
3. Interpret a residual of -0.6 hour.
4. Compare strict sinusoidal and changing-amplitude models.
5. State the defining idea behind sinusoidal modeling and regression in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. -cos[pi(t-5)/12] or an equivalent shifted form.
2. Use the method developed in the lesson: Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Estimate parameters from the graph or use regression, interpret units, state the evidence-supported domain, compare sine and cosine forms, and inspect residuals. Verify all conditions and state the final result in the requested representation.
5. Sinusoidal modeling estimates a periodic relationship from observed extrema, timing, or regression.
6. Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time.
7. A common error is to fit a sinusoid merely because data rise and fall once.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next unit develops algebraic identities and complete solution methods for more complicated trigonometric equations.

### Lesson summary

Sinusoidal modeling estimates a periodic relationship from observed extrema, timing, or regression.

The central condition to remember is this: Extrapolation assumes the cycle remains stable. Seasonal and biological systems may change over time.

**Connection forward.** The next unit develops algebraic identities and complete solution methods for more complicated trigonometric equations.

The next lesson is **Identities, equations, and proof strategy**.

### Source guidance

Sundstrom & Schlicker, Trigonometry 2.1-2.6; Lippman & Rasmussen, Precalculus Vol. 2, Chapter 6; Yoshiwara, Trigonometry, Chapters 4, 6, and 7; AP Precalculus framework, Trigonometric and Polar Functions


---

## Unit investigation

Fit a sinusoidal model to one year of daylight or tidal data, interpret all parameters, compare sine and cosine forms, inspect residuals, and identify model limitations.

A complete investigation submission must define variables and units, show the mathematical model, include at least two coordinated representations, justify method choices, verify results, and state limitations. A worked instructor solution should include one alternate valid approach and a note identifying the most likely prerequisite failure points.

## Unit review design

The cumulative review should contain 40-55 concrete items: approximately 55 percent current-unit material, 25 percent retrieval from the preceding two units, and 20 percent older course material. At least one cluster must combine symbolic, graphical, and contextual representations without naming the method in the prompt.
