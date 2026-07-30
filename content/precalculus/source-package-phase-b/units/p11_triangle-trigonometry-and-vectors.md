# Unit P11: Triangle Trigonometry and Vectors

This unit uses trigonometric functions to recover geometric and directional information. Triangle methods and vector methods are developed together so that learners can select the representation best suited to the data. The governing question is: **How can trigonometric functions recover missing geometric and directional information?**

## Unit anchor problem

An airplane flies at airspeed 220 km/h on heading N30E while wind blows 45 km/h due east. Find ground speed and actual bearing, then determine displacement after 2.5 hours.

The anchor problem should remain visible throughout the unit. Each lesson contributes one part of the language or method needed to solve it completely, and the unit investigation asks the learner to build a related model independently.

## Learning path

- **P11.1. Right triangles and trigonometric ratios**
- **P11.2. Right-triangle applications**
- **P11.3. The Law of Sines**
- **P11.4. The ambiguous SSA case**
- **P11.5. The Law of Cosines**
- **P11.6. Triangle area formulas**
- **P11.7. Bearings and navigation**
- **P11.8. Vectors geometrically and in components**
- **P11.9. Vector operations, magnitude, direction, and unit vectors**
- **P11.10. Dot product, angles, and projection**

---

## P11.1. Right triangles and trigonometric ratios

**Learning objective.** Connect unit-circle trig definitions with ratios in similar right triangles.

### The problem that opens the lesson

A ramp rises 0.84 meter over a horizontal run of 7.2 meters. Find its angle of inclination and length.

**Opening solution.** A ramp rises 0.84 meter over a horizontal run of 7.2 meters. Find its angle of inclination and length.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. The relevant conditions are not optional bookkeeping: Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units. Following that structure gives **Angle arctan(0.84/7.2)≈6.65 degrees; length≈7.249 meters.**

**Why this works.** A triangle problem is determined by enough independent side and angle information, together with the right angle. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Right-triangle trigonometry expresses side ratios as functions of an acute angle.

All right triangles sharing an acute angle are similar, so opposite/hypotenuse, adjacent/hypotenuse, and opposite/adjacent ratios remain constant. These ratios agree with unit-circle sine, cosine, and tangent in the first quadrant.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A triangle problem is determined by enough independent side and angle information, together with the right angle.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes.

Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to label opposite and adjacent globally rather than relative to the chosen acute angle.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A ramp rises 0.84 meter over a horizontal run of 7.2 meters. Find its angle of inclination and length.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. The relevant conditions are not optional bookkeeping: Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units. Following that structure gives **Angle arctan(0.84/7.2)≈6.65 degrees; length≈7.249 meters.**

**Why this works.** A triangle problem is determined by enough independent side and angle information, together with the right angle. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Derive sine ratio from scaled unit-circle coordinates.

**Worked development.** Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. All right triangles sharing an acute angle are similar, so opposite/hypotenuse, adjacent/hypotenuse, and opposite/adjacent ratios remain constant. These ratios agree with unit-circle sine, cosine, and tangent in the first quadrant. Then apply the conditions explicitly: Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Right-triangle ratios support slopes, heights, components, surveying, and geometric proofs.

#### Reasoning example

**Problem.** Solve a triangle from one acute angle and one side.

**Worked development.** Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. All right triangles sharing an acute angle are similar, so opposite/hypotenuse, adjacent/hypotenuse, and opposite/adjacent ratios remain constant. These ratios agree with unit-circle sine, cosine, and tangent in the first quadrant. Then apply the conditions explicitly: Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Right-triangle ratios support slopes, heights, components, surveying, and geometric proofs.

**Worked example 4: quick check.** A right triangle has legs 5 and 12. Find all six trig ratios for the angle opposite side 5.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. The relevant conditions are not optional bookkeeping: Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units. Following that structure gives **sin=5/13, cos=12/13, tan=5/12 and reciprocals.**

**Why this works.** A triangle problem is determined by enough independent side and angle information, together with the right angle. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.1-V1: Similar right triangles with equal acute angle.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.1-V2: Unit-circle triangle scaled by hypotenuse.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.1-V3: Opposite-adjacent-hypotenuse role diagram.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Right-triangle ratios support slopes, heights, components, surveying, and geometric proofs.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

A right triangle has legs 5 and 12. Find all six trig ratios for the angle opposite side 5.

<details><summary>Check</summary>

sin=5/13, cos=12/13, tan=5/12 and reciprocals.

</details>

### Practice set

1. A right triangle has legs 5 and 12. Find all six trig ratios for the angle opposite side 5.
2. Derive sine ratio from scaled unit-circle coordinates.
3. Solve a triangle from one acute angle and one side.
4. Explain why trig ratios are size-invariant.
5. State the defining idea behind right triangles and trigonometric ratios in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. sin=5/13, cos=12/13, tan=5/12 and reciprocals.
2. Use the method developed in the lesson: Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Draw and label the triangle relative to the chosen angle, select the ratio containing the known and unknown quantities, solve algebraically, and check that the side ordering matches the angle sizes. Verify all conditions and state the final result in the requested representation.
5. Right-triangle trigonometry expresses side ratios as functions of an acute angle.
6. Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units.
7. A common error is to label opposite and adjacent globally rather than relative to the chosen acute angle.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson builds full contextual models from elevation, depression, and indirect measurement.

### Lesson summary

Right-triangle trigonometry expresses side ratios as functions of an acute angle.

The central condition to remember is this: Inverse trig functions return acute angles in right-triangle contexts. Measurement data usually require decimal approximations and units.

**Connection forward.** The next lesson builds full contextual models from elevation, depression, and indirect measurement.

The next lesson is **Right-triangle applications**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.2. Right-triangle applications

**Learning objective.** Model heights, distances, slopes, and angles of elevation or depression.

### The problem that opens the lesson

From a point 80 meters from a building, the angle of elevation to the roof is 37 degrees. The instrument is 1.6 meters high. Find building height.

**Opening solution.** From a point 80 meters from a building, the angle of elevation to the roof is 37 degrees. The instrument is 1.6 meters high. Find building height.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. The relevant conditions are not optional bookkeeping: The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances. Following that structure gives **1.6+80tan37 degrees≈61.9 meters.**

**Why this works.** Instrument height, ground slope, observer position, and line of sight may create offsets that must be added after the triangle calculation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Right-triangle applications convert a physical situation into a geometric model before any trigonometric calculation.

Angles of elevation and depression are measured from horizontal lines. Parallel horizontals often create equal alternate interior angles, but the diagram must show why.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Instrument height, ground slope, observer position, and line of sight may create offsets that must be added after the triangle calculation.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision.

The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to use the full building height as the triangle’s opposite side when the instrument is above ground.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** From a point 80 meters from a building, the angle of elevation to the roof is 37 degrees. The instrument is 1.6 meters high. Find building height.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. The relevant conditions are not optional bookkeeping: The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances. Following that structure gives **1.6+80tan37 degrees≈61.9 meters.**

**Why this works.** Instrument height, ground slope, observer position, and line of sight may create offsets that must be added after the triangle calculation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Solve a depression-angle problem from a cliff.

**Worked development.** Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Angles of elevation and depression are measured from horizontal lines. Parallel horizontals often create equal alternate interior angles, but the diagram must show why. Then apply the conditions explicitly: The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Applications include surveying, ramps, astronomy, construction, and navigation.

#### Reasoning example

**Problem.** Determine ramp length from rise and code angle.

**Worked development.** Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Angles of elevation and depression are measured from horizontal lines. Parallel horizontals often create equal alternate interior angles, but the diagram must show why. Then apply the conditions explicitly: The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Applications include surveying, ramps, astronomy, construction, and navigation.

**Worked example 4: quick check.** A 20-meter cable makes a 58-degree angle with level ground. Find vertical rise.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. The relevant conditions are not optional bookkeeping: The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances. Following that structure gives **20sin58 degrees≈16.96 meters.**

**Why this works.** Instrument height, ground slope, observer position, and line of sight may create offsets that must be added after the triangle calculation. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.2-V1: Accurate angle-of-elevation diagram.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.2-V2: Parallel horizontal lines showing equal alternate angles.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.2-V3: Measurement-error comparison rays.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Applications include surveying, ramps, astronomy, construction, and navigation.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

A 20-meter cable makes a 58-degree angle with level ground. Find vertical rise.

<details><summary>Check</summary>

20sin58 degrees≈16.96 meters.

</details>

### Practice set

1. A 20-meter cable makes a 58-degree angle with level ground. Find vertical rise.
2. Solve a depression-angle problem from a cliff.
3. Determine ramp length from rise and code angle.
4. Assess sensitivity to a one-degree measurement error.
5. State the defining idea behind right-triangle applications in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 20sin58 degrees≈16.96 meters.
2. Use the method developed in the lesson: Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Define the target quantity, draw a scale-independent diagram, label measured versus calculated values, select a trig ratio, solve, and interpret precision. Verify all conditions and state the final result in the requested representation.
5. Right-triangle applications convert a physical situation into a geometric model before any trigonometric calculation.
6. The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances.
7. A common error is to use the full building height as the triangle’s opposite side when the instrument is above ground.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson solves non-right triangles when an opposite side-angle pair is available.

### Lesson summary

Right-triangle applications convert a physical situation into a geometric model before any trigonometric calculation.

The central condition to remember is this: The model commonly assumes straight sight lines, level ground, and accurate angle measurement. Small angle errors can cause large height errors at long distances.

**Connection forward.** The next lesson solves non-right triangles when an opposite side-angle pair is available.

The next lesson is **The Law of Sines**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.3. The Law of Sines

**Learning objective.** Derive and apply the Law of Sines to ASA, AAS, and suitable SSA triangles.

### The problem that opens the lesson

A triangle has A=42 degrees, B=71 degrees, and side a=18. Find sides b and c.

**Opening solution.** A triangle has A=42 degrees, B=71 degrees, and side a=18. Find sides b and c.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. The relevant conditions are not optional bookkeeping: No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles. Following that structure gives **C=67 degrees; b=18sin71/sin42; c=18sin67/sin42.**

**Why this works.** The law is most direct for ASA and AAS data because the third angle is known and an opposite pair is available. SSA requires a separate ambiguity analysis. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The Law of Sines states that side lengths are proportional to the sines of their opposite angles.

An altitude derivation shows that different expressions for the same height lead to a/sin A=b/sin B. The common value also equals the circumcircle diameter 2R.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The law is most direct for ASA and AAS data because the third angle is known and an opposite pair is available. SSA requires a separate ambiguity analysis.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end.

No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is pairing a side with an adjacent rather than opposite angle.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A triangle has A=42 degrees, B=71 degrees, and side a=18. Find sides b and c.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. The relevant conditions are not optional bookkeeping: No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles. Following that structure gives **C=67 degrees; b=18sin71/sin42; c=18sin67/sin42.**

**Why this works.** The law is most direct for ASA and AAS data because the third angle is known and an opposite pair is available. SSA requires a separate ambiguity analysis. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Derive a/sin A=2R using an altitude or circumcircle.

**Worked development.** Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. An altitude derivation shows that different expressions for the same height lead to a/sin A=b/sin B. The common value also equals the circumcircle diameter 2R. Then apply the conditions explicitly: No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The Law of Sines supports triangulation, navigation, astronomy, and surveying.

#### Reasoning example

**Problem.** Solve an AAS triangle.

**Worked development.** Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. An altitude derivation shows that different expressions for the same height lead to a/sin A=b/sin B. The common value also equals the circumcircle diameter 2R. Then apply the conditions explicitly: No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The Law of Sines supports triangulation, navigation, astronomy, and surveying.

**Worked example 4: quick check.** When is the Law of Sines directly useful without ambiguity?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. The relevant conditions are not optional bookkeeping: No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles. Following that structure gives **When an opposite side-angle pair is known and the remaining information is ASA or AAS.**

**Why this works.** The law is most direct for ASA and AAS data because the third angle is known and an opposite pair is available. SSA requires a separate ambiguity analysis. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.3-V1: Altitude derivation in an oblique triangle.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.3-V2: Circumcircle interpretation.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.3-V3: Given-information case sorter.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

The Law of Sines supports triangulation, navigation, astronomy, and surveying.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

When is the Law of Sines directly useful without ambiguity?

<details><summary>Check</summary>

When an opposite side-angle pair is known and the remaining information is ASA or AAS.

</details>

### Practice set

1. When is the Law of Sines directly useful without ambiguity?
2. Derive a/sin A=2R using an altitude or circumcircle.
3. Solve an AAS triangle.
4. Recognize when SSA may require ambiguity analysis.
5. State the defining idea behind the law of sines in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. When an opposite side-angle pair is known and the remaining information is ASA or AAS.
2. Use the method developed in the lesson: Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Match every side with its opposite angle, compute the missing angle sum if appropriate, and delay rounding until the end. Verify all conditions and state the final result in the requested representation.
5. The Law of Sines states that side lengths are proportional to the sines of their opposite angles.
6. No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles.
7. A common error is pairing a side with an adjacent rather than opposite angle.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson examines why SSA information can define zero, one, or two triangles.

### Lesson summary

The Law of Sines states that side lengths are proportional to the sines of their opposite angles.

The central condition to remember is this: No triangle exists if the angle sum or side ordering is impossible. Larger sides must face larger angles.

**Connection forward.** The next lesson examines why SSA information can define zero, one, or two triangles.

The next lesson is **The ambiguous SSA case**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.4. The ambiguous SSA case

**Learning objective.** Determine whether SSA data produce zero, one, or two triangles.

### The problem that opens the lesson

Given A=35 degrees, a=8, and b=12, determine all possible triangles.

**Opening solution.** Given A=35 degrees, a=8, and b=12, determine all possible triangles.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. The relevant conditions are not optional bookkeeping: When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle. Following that structure gives **Compute h=b sin A≈6.883; since h<a<b, two triangles exist.**

**Why this works.** Inverse sine returns only one principal angle. A second candidate 180 degrees-B may also satisfy the same sine value, but only if the full angle sum remains below 180 degrees. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The ambiguous SSA case occurs because a given side can swing into two positions while preserving its length and an acute angle.

For acute A with known opposite side a and adjacent-known side b, the altitude h=b sin A classifies possibilities: a<h gives no triangle, a=h one right triangle, h<a<b two triangles, and a>=b one triangle.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Inverse sine returns only one principal angle. A second candidate 180 degrees-B may also satisfy the same sine value, but only if the full angle sum remains below 180 degrees.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle.

When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is to accept only the calculator’s acute arcsine value or to accept a supplementary angle that makes the angle sum impossible.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Given A=35 degrees, a=8, and b=12, determine all possible triangles.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. The relevant conditions are not optional bookkeeping: When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle. Following that structure gives **Compute h=b sin A≈6.883; since h<a<b, two triangles exist.**

**Why this works.** Inverse sine returns only one principal angle. A second candidate 180 degrees-B may also satisfy the same sine value, but only if the full angle sum remains below 180 degrees. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Use altitude comparison for acute A.

**Worked development.** Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. For acute A with known opposite side a and adjacent-known side b, the altitude h=b sin A classifies possibilities: a<h gives no triangle, a=h one right triangle, h<a<b two triangles, and a>=b one triangle. Then apply the conditions explicitly: When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The ambiguity matters in surveying and navigation when measurements do not uniquely locate a point.

#### Reasoning example

**Problem.** Use inverse sine and supplementary angle branches.

**Worked development.** Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. For acute A with known opposite side a and adjacent-known side b, the altitude h=b sin A classifies possibilities: a<h gives no triangle, a=h one right triangle, h<a<b two triangles, and a>=b one triangle. Then apply the conditions explicitly: When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The ambiguity matters in surveying and navigation when measurements do not uniquely locate a point.

**Worked example 4: quick check.** For acute A, state the two-triangle condition in terms of h, a, and b.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. The relevant conditions are not optional bookkeeping: When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle. Following that structure gives **h<a<b.**

**Why this works.** Inverse sine returns only one principal angle. A second candidate 180 degrees-B may also satisfy the same sine value, but only if the full angle sum remains below 180 degrees. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.4-V1: SSA altitude-case explorer.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.4-V2: Two possible triangles sharing data.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.4-V3: Inverse-sine branch and angle-sum filter.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

The ambiguity matters in surveying and navigation when measurements do not uniquely locate a point.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

For acute A, state the two-triangle condition in terms of h, a, and b.

<details><summary>Check</summary>

h<a<b.

</details>

### Practice set

1. For acute A, state the two-triangle condition in terms of h, a, and b.
2. Use altitude comparison for acute A.
3. Use inverse sine and supplementary angle branches.
4. Explain why an obtuse given angle changes the cases.
5. State the defining idea behind the ambiguous ssa case in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. h<a<b.
2. Use the method developed in the lesson: Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Use a geometric altitude check before computing, then test both inverse-sine branches and complete each valid triangle. Verify all conditions and state the final result in the requested representation.
5. The ambiguous SSA case occurs because a given side can swing into two positions while preserving its length and an acute angle.
6. When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle.
7. A common error is to accept only the calculator’s acute arcsine value or to accept a supplementary angle that makes the angle sum impossible.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson uses the Law of Cosines for SAS and SSS data.

### Lesson summary

The ambiguous SSA case occurs because a given side can swing into two positions while preserving its length and an acute angle.

The central condition to remember is this: When the given angle is obtuse, the opposite side must be the longest; this usually allows at most one triangle.

**Connection forward.** The next lesson uses the Law of Cosines for SAS and SSS data.

The next lesson is **The Law of Cosines**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.5. The Law of Cosines

**Learning objective.** Use the Law of Cosines for SAS and SSS data and connect it to the Pythagorean theorem.

### The problem that opens the lesson

Two sides of a triangle are 11 and 16 with included angle 124 degrees. Find the third side.

**Opening solution.** Two sides of a triangle are 11 and 16 with included angle 124 degrees. Find the third side.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. The relevant conditions are not optional bookkeeping: When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles. Following that structure gives **c=sqrt(11^2+16^2-2(11)(16)cos124 degrees)≈22.41.**

**Why this works.** SAS data determine the opposite side; SSS data determine angles. For SSS, finding the largest angle first provides a useful validity and rounding check. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The Law of Cosines generalizes the Pythagorean theorem to any triangle.

In c^2=a^2+b^2-2ab cos C, the correction term accounts for the included angle. At C=90 degrees, cosine is zero and the Pythagorean theorem returns.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

SAS data determine the opposite side; SSS data determine angles. For SSS, finding the largest angle first provides a useful validity and rounding check.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering.

When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is pairing the included angle with the wrong opposite side or omitting the factor 2ab.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Two sides of a triangle are 11 and 16 with included angle 124 degrees. Find the third side.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. The relevant conditions are not optional bookkeeping: When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles. Following that structure gives **c=sqrt(11^2+16^2-2(11)(16)cos124 degrees)≈22.41.**

**Why this works.** SAS data determine the opposite side; SSS data determine angles. For SSS, finding the largest angle first provides a useful validity and rounding check. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Derive the formula from coordinate geometry.

**Worked development.** Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. In c^2=a^2+b^2-2ab cos C, the correction term accounts for the included angle. At C=90 degrees, cosine is zero and the Pythagorean theorem returns. Then apply the conditions explicitly: When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The law supports distance, structural geometry, navigation, and vector magnitude calculations.

#### Reasoning example

**Problem.** Solve an SSS triangle for its largest angle first.

**Worked development.** Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. In c^2=a^2+b^2-2ab cos C, the correction term accounts for the included angle. At C=90 degrees, cosine is zero and the Pythagorean theorem returns. Then apply the conditions explicitly: When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** The law supports distance, structural geometry, navigation, and vector magnitude calculations.

**Worked example 4: quick check.** Which angle should be found first in an SSS triangle and why?

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. The relevant conditions are not optional bookkeeping: When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles. Following that structure gives **The largest angle, opposite the largest side, to reduce ambiguity and check plausibility.**

**Why this works.** SAS data determine the opposite side; SSS data determine angles. For SSS, finding the largest angle first provides a useful validity and rounding check. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.5-V1: Coordinate derivation.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.5-V2: SAS and SSS case diagrams.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.5-V3: Pythagorean special-case overlay.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

The law supports distance, structural geometry, navigation, and vector magnitude calculations.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Which angle should be found first in an SSS triangle and why?

<details><summary>Check</summary>

The largest angle, opposite the largest side, to reduce ambiguity and check plausibility.

</details>

### Practice set

1. Which angle should be found first in an SSS triangle and why?
2. Derive the formula from coordinate geometry.
3. Solve an SSS triangle for its largest angle first.
4. Show the right-angle case becomes a^2+b^2=c^2.
5. State the defining idea behind the law of cosines in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. The largest angle, opposite the largest side, to reduce ambiguity and check plausibility.
2. Use the method developed in the lesson: Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Identify the included angle or opposite side correctly, substitute with grouped products, solve, and check side-angle ordering. Verify all conditions and state the final result in the requested representation.
5. The Law of Cosines generalizes the Pythagorean theorem to any triangle.
6. When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles.
7. A common error is pairing the included angle with the wrong opposite side or omitting the factor 2ab.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson derives area formulas from an included angle or three sides.

### Lesson summary

The Law of Cosines generalizes the Pythagorean theorem to any triangle.

The central condition to remember is this: When solving for an angle, the computed cosine must lie in [-1,1]. Rounding intermediate side values may distort later angles.

**Connection forward.** The next lesson derives area formulas from an included angle or three sides.

The next lesson is **Triangle area formulas**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.6. Triangle area formulas

**Learning objective.** Use K=(1/2)ab sin C and compare with base-height and Heron forms.

### The problem that opens the lesson

Find the area of a triangle with sides 9 and 14 enclosing 52 degrees.

**Opening solution.** Find the area of a triangle with sides 9 and 14 enclosing 52 degrees.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose the area formula matching the available information, retain exact trig values where possible, and report square units. The relevant conditions are not optional bookkeeping: Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work. Following that structure gives **K=(1/2)(9)(14)sin52 degrees≈49.65 square units.**

**Why this works.** The sine formula reveals that two different included angles with the same sine can produce the same area, subject to triangle validity. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The area formula K=(1/2)ab sin C uses two sides and their included angle.

Dropping an altitude gives height b sin C, so ordinary one-half base times height becomes the sine-area formula. Heron’s formula uses all three sides through the semiperimeter.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

The sine formula reveals that two different included angles with the same sine can produce the same area, subject to triangle validity.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Choose the area formula matching the available information, retain exact trig values where possible, and report square units.

Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using a non-included angle with the chosen two sides.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Find the area of a triangle with sides 9 and 14 enclosing 52 degrees.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose the area formula matching the available information, retain exact trig values where possible, and report square units. The relevant conditions are not optional bookkeeping: Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work. Following that structure gives **K=(1/2)(9)(14)sin52 degrees≈49.65 square units.**

**Why this works.** The sine formula reveals that two different included angles with the same sine can produce the same area, subject to triangle validity. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Derive the sine-area formula using altitude.

**Worked development.** Choose the area formula matching the available information, retain exact trig values where possible, and report square units. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Dropping an altitude gives height b sin C, so ordinary one-half base times height becomes the sine-area formula. Heron’s formula uses all three sides through the semiperimeter. Then apply the conditions explicitly: Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Triangle area supports surveying, design, force geometry, and coordinate calculations.

#### Reasoning example

**Problem.** Compute area from three sides using Heron's formula.

**Worked development.** Choose the area formula matching the available information, retain exact trig values where possible, and report square units. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Dropping an altitude gives height b sin C, so ordinary one-half base times height becomes the sine-area formula. Heron’s formula uses all three sides through the semiperimeter. Then apply the conditions explicitly: Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Triangle area supports surveying, design, force geometry, and coordinate calculations.

**Worked example 4: quick check.** A triangle has area 30, sides 8 and 10 enclosing angle C. Find possible C values.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Choose the area formula matching the available information, retain exact trig values where possible, and report square units. The relevant conditions are not optional bookkeeping: Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work. Following that structure gives **sin C=3/4, so C≈48.59 degrees or 131.41 degrees.**

**Why this works.** The sine formula reveals that two different included angles with the same sine can produce the same area, subject to triangle validity. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.6-V1: Altitude derivation.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.6-V2: Area-formula selection chart.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.6-V3: Thin-triangle numerical sensitivity diagram.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Triangle area supports surveying, design, force geometry, and coordinate calculations.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

A triangle has area 30, sides 8 and 10 enclosing angle C. Find possible C values.

<details><summary>Check</summary>

sin C=3/4, so C≈48.59 degrees or 131.41 degrees.

</details>

### Practice set

1. A triangle has area 30, sides 8 and 10 enclosing angle C. Find possible C values.
2. Derive the sine-area formula using altitude.
3. Compute area from three sides using Heron's formula.
4. Compare numerical stability in a very thin triangle.
5. State the defining idea behind triangle area formulas in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. sin C=3/4, so C≈48.59 degrees or 131.41 degrees.
2. Use the method developed in the lesson: Choose the area formula matching the available information, retain exact trig values where possible, and report square units. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Choose the area formula matching the available information, retain exact trig values where possible, and report square units. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Choose the area formula matching the available information, retain exact trig values where possible, and report square units. Verify all conditions and state the final result in the requested representation.
5. The area formula K=(1/2)ab sin C uses two sides and their included angle.
6. Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work.
7. A common error is using a non-included angle with the chosen two sides.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson organizes direction information through bearings and navigation conventions.

### Lesson summary

The area formula K=(1/2)ab sin C uses two sides and their included angle.

The central condition to remember is this: Heron’s formula can be numerically sensitive for very thin triangles; an equivalent stable form or higher precision may be needed in technical work.

**Connection forward.** The next lesson organizes direction information through bearings and navigation conventions.

The next lesson is **Bearings and navigation**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.7. Bearings and navigation

**Learning objective.** Translate among standard angles, quadrant bearings, headings, and triangle or component models.

### The problem that opens the lesson

A boat travels 18 km on bearing N35E, then 25 km on bearing S70E. Find its displacement magnitude and bearing.

**Opening solution.** A boat travels 18 km on bearing N35E, then 25 km on bearing S70E. Find its displacement magnitude and bearing.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. The relevant conditions are not optional bookkeeping: Wind, current, and vehicle velocity must be identified as vectors relative to the same frame. Following that structure gives **Resolve components, add, then compute magnitude and quadrant-aware bearing.**

**Why this works.** Quadrant bearings such as N35E specify an acute angle measured from a named north-south ray toward east or west. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Bearings encode direction relative to north-south or as clockwise headings from north, while standard mathematical angles begin east and increase counterclockwise.

A navigation path can be solved with triangle laws or vector components. Components are often more reliable for several legs because they preserve signed east-west and north-south contributions.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Quadrant bearings such as N35E specify an acute angle measured from a named north-south ray toward east or west.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention.

Wind, current, and vehicle velocity must be identified as vectors relative to the same frame.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is measuring a bearing from east or assigning the wrong sign to a westward or southward component.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A boat travels 18 km on bearing N35E, then 25 km on bearing S70E. Find its displacement magnitude and bearing.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. The relevant conditions are not optional bookkeeping: Wind, current, and vehicle velocity must be identified as vectors relative to the same frame. Following that structure gives **Resolve components, add, then compute magnitude and quadrant-aware bearing.**

**Why this works.** Quadrant bearings such as N35E specify an acute angle measured from a named north-south ray toward east or west. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Convert N28W to a standard angle.

**Worked development.** Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. A navigation path can be solved with triangle laws or vector components. Components are often more reliable for several legs because they preserve signed east-west and north-south contributions. Then apply the conditions explicitly: Wind, current, and vehicle velocity must be identified as vectors relative to the same frame. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Bearings support aviation, maritime navigation, surveying, and search planning.

#### Reasoning example

**Problem.** Solve a two-leg navigation triangle.

**Worked development.** Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. A navigation path can be solved with triangle laws or vector components. Components are often more reliable for several legs because they preserve signed east-west and north-south contributions. Then apply the conditions explicitly: Wind, current, and vehicle velocity must be identified as vectors relative to the same frame. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Bearings support aviation, maritime navigation, surveying, and search planning.

**Worked example 4: quick check.** Convert bearing S20W to a standard mathematical angle.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. The relevant conditions are not optional bookkeeping: Wind, current, and vehicle velocity must be identified as vectors relative to the same frame. Following that structure gives **250 degrees.**

**Why this works.** Quadrant bearings such as N35E specify an acute angle measured from a named north-south ray toward east or west. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.7-V1: Bearing compass with all conventions.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.7-V2: Two-leg route and resultant.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.7-V3: Component table with east/north signs.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Bearings support aviation, maritime navigation, surveying, and search planning.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Convert bearing S20W to a standard mathematical angle.

<details><summary>Check</summary>

250 degrees.

</details>

### Practice set

1. Convert bearing S20W to a standard mathematical angle.
2. Convert N28W to a standard angle.
3. Solve a two-leg navigation triangle.
4. Compare bearing notation with heading degrees clockwise from north.
5. State the defining idea behind bearings and navigation in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. 250 degrees.
2. Use the method developed in the lesson: Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Draw a compass, convert each direction consistently, resolve components, sum, and convert the resultant back to the requested convention. Verify all conditions and state the final result in the requested representation.
5. Bearings encode direction relative to north-south or as clockwise headings from north, while standard mathematical angles begin east and increase counterclockwise.
6. Wind, current, and vehicle velocity must be identified as vectors relative to the same frame.
7. A common error is measuring a bearing from east or assigning the wrong sign to a westward or southward component.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson formalizes directed magnitudes as vectors.

### Lesson summary

Bearings encode direction relative to north-south or as clockwise headings from north, while standard mathematical angles begin east and increase counterclockwise.

The central condition to remember is this: Wind, current, and vehicle velocity must be identified as vectors relative to the same frame.

**Connection forward.** The next lesson formalizes directed magnitudes as vectors.

The next lesson is **Vectors geometrically and in components**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.8. Vectors geometrically and in components

**Learning objective.** Represent vectors by magnitude and direction, add them geometrically, and convert to components.

### The problem that opens the lesson

A force of 80 N acts at 135 degrees. Write its component vector.

**Opening solution.** A force of 80 N acts at 135 degrees. Write its component vector.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. The relevant conditions are not optional bookkeeping: The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention. Following that structure gives **<80cos135,80sin135>=<-40sqrt(2),40sqrt(2)> N.**

**Why this works.** A vector of magnitude M at standard angle theta has components <M cos theta,M sin theta>. Recover magnitude with the distance formula and direction with quadrant-aware inverse tangent. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

A vector has magnitude and direction but no fixed location. Component form records horizontal and vertical contributions.

Vector addition combines displacements or effects. The head-to-tail and parallelogram constructions are geometric versions of componentwise addition.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

A vector of magnitude M at standard angle theta has components <M cos theta,M sin theta>. Recover magnitude with the distance formula and direction with quadrant-aware inverse tangent.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant.

The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is using arctan(y/x) without correcting the quadrant.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A force of 80 N acts at 135 degrees. Write its component vector.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. The relevant conditions are not optional bookkeeping: The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention. Following that structure gives **<80cos135,80sin135>=<-40sqrt(2),40sqrt(2)> N.**

**Why this works.** A vector of magnitude M at standard angle theta has components <M cos theta,M sin theta>. Recover magnitude with the distance formula and direction with quadrant-aware inverse tangent. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Add vectors by head-to-tail construction.

**Worked development.** Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Vector addition combines displacements or effects. The head-to-tail and parallelogram constructions are geometric versions of componentwise addition. Then apply the conditions explicitly: The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Vectors model displacement, velocity, acceleration, force, and data transformations.

#### Reasoning example

**Problem.** Convert magnitude-direction to components.

**Worked development.** Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Vector addition combines displacements or effects. The head-to-tail and parallelogram constructions are geometric versions of componentwise addition. Then apply the conditions explicitly: The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Vectors model displacement, velocity, acceleration, force, and data transformations.

**Worked example 4: quick check.** Find magnitude and direction of <3,-3>.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. The relevant conditions are not optional bookkeeping: The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention. Following that structure gives **Magnitude 3sqrt(2); direction 315 degrees or -45 degrees.**

**Why this works.** A vector of magnitude M at standard angle theta has components <M cos theta,M sin theta>. Recover magnitude with the distance formula and direction with quadrant-aware inverse tangent. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.8-V1: Head-to-tail and parallelogram addition.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.8-V2: Component projections.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.8-V3: Point-versus-vector distinction.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Vectors model displacement, velocity, acceleration, force, and data transformations.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find magnitude and direction of <3,-3>.

<details><summary>Check</summary>

Magnitude 3sqrt(2); direction 315 degrees or -45 degrees.

</details>

### Practice set

1. Find magnitude and direction of <3,-3>.
2. Add vectors by head-to-tail construction.
3. Convert magnitude-direction to components.
4. Recover magnitude and direction from components.
5. State the defining idea behind vectors geometrically and in components in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Magnitude 3sqrt(2); direction 315 degrees or -45 degrees.
2. Use the method developed in the lesson: Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Distinguish points from vectors, choose a consistent coordinate frame, add components, and interpret the resultant. Verify all conditions and state the final result in the requested representation.
5. A vector has magnitude and direction but no fixed location. Component form records horizontal and vertical contributions.
6. The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention.
7. A common error is using arctan(y/x) without correcting the quadrant.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson develops normalization and component resolution.

### Lesson summary

A vector has magnitude and direction but no fixed location. Component form records horizontal and vertical contributions.

The central condition to remember is this: The zero vector has no unique direction. Direction angles should be normalized to the requested interval or bearing convention.

**Connection forward.** The next lesson develops normalization and component resolution.

The next lesson is **Vector operations, magnitude, direction, and unit vectors**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.9. Vector operations, magnitude, direction, and unit vectors

**Learning objective.** Use scalar multiplication, normalization, and component resolution.

### The problem that opens the lesson

A cable pulls with force <120,160> N. Find force magnitude and the unit vector in its direction.

**Opening solution.** A cable pulls with force <120,160> N. Find force magnitude and the unit vector in its direction.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. The relevant conditions are not optional bookkeeping: Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading. Following that structure gives **Magnitude 200 N; unit vector <3/5,4/5>.**

**Why this works.** Resolving a vector along chosen directions decomposes one effect into components that sum to the original vector. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

Scalar multiplication changes vector magnitude and may reverse direction. A unit vector has magnitude one and records direction alone.

Normalize a nonzero vector v by dividing by ||v||. Multiplying that unit vector by a desired magnitude constructs a vector in the same direction.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Resolving a vector along chosen directions decomposes one effect into components that sum to the original vector.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one.

Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is dividing by the squared magnitude or attempting to normalize the zero vector.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** A cable pulls with force <120,160> N. Find force magnitude and the unit vector in its direction.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. The relevant conditions are not optional bookkeeping: Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading. Following that structure gives **Magnitude 200 N; unit vector <3/5,4/5>.**

**Why this works.** Resolving a vector along chosen directions decomposes one effect into components that sum to the original vector. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Normalize a nonzero vector.

**Worked development.** Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Normalize a nonzero vector v by dividing by ||v||. Multiplying that unit vector by a desired magnitude constructs a vector in the same direction. Then apply the conditions explicitly: Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Unit vectors support navigation, force decomposition, coordinate bases, and matrix transformations.

#### Reasoning example

**Problem.** Resolve a vector into directions parallel and perpendicular to a slope.

**Worked development.** Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. Normalize a nonzero vector v by dividing by ||v||. Multiplying that unit vector by a desired magnitude constructs a vector in the same direction. Then apply the conditions explicitly: Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Unit vectors support navigation, force decomposition, coordinate bases, and matrix transformations.

**Worked example 4: quick check.** Find a vector of magnitude 10 in the direction of <1,2>.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. The relevant conditions are not optional bookkeeping: Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading. Following that structure gives **<2sqrt(5),4sqrt(5)>.**

**Why this works.** Resolving a vector along chosen directions decomposes one effect into components that sum to the original vector. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.9-V1: Vector scaling gallery.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.9-V2: Normalization to unit circle.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.9-V3: Parallel/perpendicular component decomposition.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Unit vectors support navigation, force decomposition, coordinate bases, and matrix transformations.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Find a vector of magnitude 10 in the direction of <1,2>.

<details><summary>Check</summary>

<2sqrt(5),4sqrt(5)>.

</details>

### Practice set

1. Find a vector of magnitude 10 in the direction of <1,2>.
2. Normalize a nonzero vector.
3. Resolve a vector into directions parallel and perpendicular to a slope.
4. Interpret scalar multiplication including negative scalars.
5. State the defining idea behind vector operations, magnitude, direction, and unit vectors in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. <2sqrt(5),4sqrt(5)>.
2. Use the method developed in the lesson: Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Compute magnitude first, verify it is nonzero, divide components, and check that the resulting unit vector has magnitude one. Verify all conditions and state the final result in the requested representation.
5. Scalar multiplication changes vector magnitude and may reverse direction. A unit vector has magnitude one and records direction alone.
6. Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading.
7. A common error is dividing by the squared magnitude or attempting to normalize the zero vector.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next lesson uses the dot product to measure directional alignment and projection.

### Lesson summary

Scalar multiplication changes vector magnitude and may reverse direction. A unit vector has magnitude one and records direction alone.

The central condition to remember is this: Perpendicular or nonstandard component directions require projection or a system rather than simple x-y reading.

**Connection forward.** The next lesson uses the dot product to measure directional alignment and projection.

The next lesson is **Dot product, angles, and projection**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## P11.10. Dot product, angles, and projection

**Learning objective.** Use the dot product to find angles, test orthogonality, and calculate projections.

### The problem that opens the lesson

Find the angle between u=<2,5> and v=<4,-1>.

**Opening solution.** Find the angle between u=<2,5> and v=<4,-1>.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. The relevant conditions are not optional bookkeeping: The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care. Following that structure gives **u·v=3; cos theta=3/(sqrt29 sqrt17), so theta≈82.3 degrees.**

**Why this works.** Projection measures the part of one vector aligned with another. The scalar projection is u·v/||v||, and the vector projection is (u·v/||v||^2)v. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### What this lesson is really about

The dot product u·v equals the sum of component products and also equals ||u||||v||cos theta.

The two forms connect algebra with geometry. A positive dot product indicates an acute angle, zero indicates perpendicular vectors, and a negative value indicates an obtuse angle.

The point is not merely to reproduce a formula. A learner should be able to identify the quantities or geometric objects involved, explain why the relationship has its stated form, and recognize when the same idea appears in a graph, table, diagram, or model.

### Why the relationship works

Projection measures the part of one vector aligned with another. The scalar projection is u·v/||v||, and the vector projection is (u·v/||v||^2)v.

This mechanism should be visible in the lesson's main figure. The visual must show the intermediate relationship that produces the formula or conclusion. A decorative curve beside finished algebra is not an explanation, no matter how pleasantly rounded the corners are.

### A reliable way to work

Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested.

The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care.

After the symbolic work is complete, check the result. Depending on the lesson, this may mean substituting into an original equation, comparing coordinates, examining a graph, checking units, testing an interval, or confirming that every branch of a periodic solution has been included.

### What commonly goes wrong

A common error is dividing the vector projection by ||v|| instead of ||v|| squared.

The repair is to return to the definition and identify the first step where the invalid solution stops describing the original mathematical object. Later algebra cannot rescue a first step that changed the domain, orientation, branch, or meaning of the problem.

### Worked examples

**Worked example 1.** Find the angle between u=<2,5> and v=<4,-1>.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. The relevant conditions are not optional bookkeeping: The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care. Following that structure gives **u·v=3; cos theta=3/(sqrt29 sqrt17), so theta≈82.3 degrees.**

**Why this works.** Projection measures the part of one vector aligned with another. The scalar projection is u·v/||v||, and the vector projection is (u·v/||v||^2)v. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

#### Transfer example

**Problem.** Test whether two vectors are perpendicular.

**Worked development.** Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The two forms connect algebra with geometry. A positive dot product indicates an acute angle, zero indicates perpendicular vectors, and a negative value indicates an obtuse angle. Then apply the conditions explicitly: The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Dot products model work, lighting, similarity, orthogonality, and directional influence.

#### Reasoning example

**Problem.** Find scalar and vector projection.

**Worked development.** Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. In this example, the first useful move is to make the defining structure visible rather than to search for a memorized answer. The two forms connect algebra with geometry. A positive dot product indicates an acute angle, zero indicates perpendicular vectors, and a negative value indicates an obtuse angle. Then apply the conditions explicitly: The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care. Finish by checking the result in a second representation and explaining what the result means.

**Interpretation.** Dot products model work, lighting, similarity, orthogonality, and directional influence.

**Worked example 4: quick check.** Project <6,2> onto <1,1>.

**Solution.** Begin by identifying the mathematical object and the information that fixes it. Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. The relevant conditions are not optional bookkeeping: The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care. Following that structure gives **Vector projection <4,4>.**

**Why this works.** Projection measures the part of one vector aligned with another. The scalar projection is u·v/||v||, and the vector projection is (u·v/||v||^2)v. The calculation and the representation should agree, so a graph, diagram, table, or substitution check should support the same conclusion.

### Required visual sequence

**P11.10-V1: Dot product as aligned component sum.** Anchor visual. Establish the quantities, coordinate system, interval, or geometric condition used in the opening problem.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.10-V2: Projection shadow diagram.** Mechanism visual. Show the derivation, mapping, or changing parameter that makes the central relationship true.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

**P11.10-V3: Angle and orthogonality comparison.** Comparison visual. Place the valid structure beside the common misconception and mark the first point where they diverge.

*Accessible description requirement:* State every relevant point, line, angle, interval, orientation, equation, asymptote, direction, and excluded case in reading order. The description must allow a learner who cannot see the figure to follow the mathematical claim.

### Application and interpretation

Dot products model work, lighting, similarity, orthogonality, and directional influence.

A contextual answer must include units, a meaningful domain, and the assumptions that make the model plausible. An exact mathematical relationship should not be diluted into a decimal unless a measurement or comparison requires it.

### Check yourself

Project <6,2> onto <1,1>.

<details><summary>Check</summary>

Vector projection <4,4>.

</details>

### Practice set

1. Project <6,2> onto <1,1>.
2. Test whether two vectors are perpendicular.
3. Find scalar and vector projection.
4. Interpret work as force projected along displacement.
5. State the defining idea behind dot product, angles, and projection in one precise sentence.
6. What condition or domain restriction must remain visible in the solution?
7. Describe the most likely incorrect first step and explain why it fails.
8. Translate the main result into a second representation: graph, diagram, table, equation, or context.
9. Write one exact conclusion and one corresponding numerical approximation or verbal interpretation.
10. Explain how this lesson's idea will be used later in the course.

### Practice answers and guidance

1. Vector projection <4,4>.
2. Use the method developed in the lesson: Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. Verify all conditions and state the final result in the requested representation.
3. Use the method developed in the lesson: Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. Verify all conditions and state the final result in the requested representation.
4. Use the method developed in the lesson: Compute the dot product and magnitudes, solve for the angle with a clamped cosine ratio when using numerical data, and state whether a scalar or vector projection is requested. Verify all conditions and state the final result in the requested representation.
5. The dot product u·v equals the sum of component products and also equals ||u||||v||cos theta.
6. The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care.
7. A common error is dividing the vector projection by ||v|| instead of ||v|| squared.
8. The second representation must preserve the same inputs, outputs, restrictions, orientation, and units as the original result.
9. Retain the exact symbolic form first; round only when the context requires a numerical comparison, and state the precision.
10. The next unit studies conic curves defined by distance relationships in the plane.

### Lesson summary

The dot product u·v equals the sum of component products and also equals ||u||||v||cos theta.

The central condition to remember is this: The angle formula requires nonzero vectors. Rounding can push a computed cosine slightly outside [-1,1], requiring numerical care.

**Connection forward.** The next unit studies conic curves defined by distance relationships in the plane.

The next lesson is **Conics as loci and the circle foundation**.

### Source guidance

Sundstrom & Schlicker, Trigonometry, Chapter 3; Lippman & Rasmussen, Precalculus Vol. 2, 5.5, 8.1, 8.4, 8.5; Yoshiwara, Trigonometry, Chapters 2, 3, and 9; Corral, Trigonometry, Chapters 1 and 2


---

## Unit investigation

Solve a navigation problem under wind or current by both triangle and vector-component methods, compare assumptions, and evaluate sensitivity to measurement error.

A complete investigation submission must define variables and units, show the mathematical model, include at least two coordinated representations, justify method choices, verify results, and state limitations. A worked instructor solution should include one alternate valid approach and a note identifying the most likely prerequisite failure points.

## Unit review design

The cumulative review should contain 40-55 concrete items: approximately 55 percent current-unit material, 25 percent retrieval from the preceding two units, and 20 percent older course material. At least one cluster must combine symbolic, graphical, and contextual representations without naming the method in the prompt.
