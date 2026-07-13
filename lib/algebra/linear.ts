import { algebraArticle } from "./shared";

export const linearArticles = [
  algebraArticle({
    slug: "slope-as-rate-of-change", topicSlug: "linear-relationships", archetype: "concept",
    title: "Slope is a rate of change, not just rise over run", shortTitle: "Slope as a rate",
    deck: "Slope measures how much the output changes for each one-unit change in the input. Its sign, size, and units all carry meaning.",
    course: "Algebra I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`m=\frac{y_2-y_1}{x_2-x_1}`, immediate: { label: "Meaning", tex: String.raw`m=\frac{\Delta y}{\Delta x}`, text: "For every one unit of horizontal change, the vertical quantity changes by m units." },
    sections: [
      ["The ratio compares two changes", "Rise over run is useful shorthand, but the numerator and denominator are not anonymous distances. They are changes in named quantities with units.", "A slope of 4 dollars per hour and a slope of 4 miles per hour are numerically equal but describe entirely different relationships.", String.raw`m=4\ \frac{\text{dollars}}{\text{hour}}`],
      ["Order must stay consistent", "Either point can come first, provided the subtraction order matches in numerator and denominator. Reversing only one difference changes the sign incorrectly.", "A zero run produces an undefined slope and a vertical line. A zero rise produces slope zero and a horizontal line.", String.raw`\frac{y_2-y_1}{x_2-x_1}=\frac{y_1-y_2}{x_1-x_2}`],
      ["Sign and magnitude tell a story", "Positive slope means the output increases as the input increases; negative slope means it decreases. A larger absolute value means a steeper rate on equally scaled axes.", "Graph scales can make lines look steeper or flatter, so compute the ratio rather than trusting the picture alone.", String.raw`m<0\Rightarrow\text{decreasing linear relationship}`],
    ],
    example: { heading: "Compute and interpret", prompt: "A tank contains 18 liters at 2 minutes and 42 liters at 8 minutes. Find the slope.", steps: [[String.raw`m=\frac{42-18}{8-2}`, "Use output change over input change."], [String.raw`m=\frac{24}{6}=4`, "Simplify the ratio."], [String.raw`m=4\ \frac{\text{liters}}{\text{minute}}`, "Attach the units and interpret the rate."]], result: String.raw`\boxed{4\ \text{liters per minute}}` },
    mistakes: ["Mixing the subtraction order between numerator and denominator.", "Dropping the units from a contextual slope.", "Judging steepness from a stretched graph."], takeaways: ["Slope is output change per input change.", "Keep point order consistent.", "Interpret sign, magnitude, and units."], related: ["equation-from-two-points", "interpreting-linear-models", "parallel-perpendicular-lines"],
  }),
  algebraArticle({
    slug: "equation-from-two-points", topicSlug: "linear-relationships", archetype: "method",
    title: "How to write a line equation from two points", shortTitle: "Line through two points",
    deck: "Find the slope first, anchor it to either point, then convert forms only if the problem needs a different presentation.",
    course: "Algebra I", difficulty: "Foundational", minutes: 9,
    formula: String.raw`y-y_1=m(x-x_1)`, immediate: { label: "Route", tex: String.raw`(x_1,y_1),(x_2,y_2)\to m\to y-y_1=m(x-x_1)`, text: "Point-slope form uses the information you already have, so it is usually the least error-prone starting point." },
    sections: [
      ["Check for a vertical line first", "If the x-coordinates are equal, the slope denominator is zero and the line is vertical. Its equation is x equal to that shared coordinate.", "Otherwise compute the slope with consistent subtraction order and simplify before substituting.", String.raw`x_1=x_2\quad\Longrightarrow\quad x=x_1`],
      ["Either point gives the same line", "Once the slope is known, substitute either given point into point-slope form. The two resulting equations look different before simplification but describe the same set of points.", "Using the point with smaller or simpler coordinates often makes expansion easier.", String.raw`y-y_1=m(x-x_1)`],
      ["Verify with both points", "A correct equation must make a true statement for each original point. Testing both catches a wrong slope and a wrong intercept quickly.", "If slope-intercept form is requested, isolate y only after the point-slope equation is secure.", String.raw`y=mx+b`],
    ],
    example: { heading: "Build the line", prompt: "Find the equation through (−2, 5) and (4, −1).", steps: [[String.raw`m=\frac{-1-5}{4-(-2)}=\frac{-6}{6}=-1`, "Compute the slope."], [String.raw`y-5=-1(x+2)`, "Use the point (−2, 5)."], [String.raw`y=-x+3`, "Distribute and isolate y."], [String.raw`-1=-4+3`, "Verify the second point."]], result: String.raw`\boxed{y=-x+3}` },
    mistakes: ["Dividing y-change by x-change with inconsistent order.", "Substituting a point as (y, x).", "Stopping without checking the second point."], takeaways: ["Handle vertical lines separately.", "Point-slope form is the natural starting form.", "Both points must satisfy the result."], related: ["slope-as-rate-of-change", "point-slope-vs-slope-intercept", "parallel-perpendicular-lines"],
  }),
  algebraArticle({
    slug: "point-slope-vs-slope-intercept", topicSlug: "linear-relationships", archetype: "decision",
    title: "Point-slope or slope-intercept form: which should you use?", shortTitle: "Choose a line form",
    deck: "Use point-slope form when a point and slope are given; use slope-intercept form when the intercept or a quick graph is the main goal.",
    course: "Algebra I", difficulty: "Foundational", minutes: 8,
    formula: String.raw`y-y_1=m(x-x_1)\qquad y=mx+b`, immediate: { label: "Decision", text: "Start with the form that matches the available information. Convert only when the requested answer or interpretation benefits from it." },
    sections: [
      ["Point-slope preserves the given point", "If a problem hands you a slope and any point, point-slope form accepts them directly. No separate intercept calculation is required.", "It is also convenient for parallel and perpendicular lines, where the new slope is known but the y-intercept usually is not.", String.raw`m=3,(2,-4)\Rightarrow y+4=3(x-2)`],
      ["Slope-intercept makes reading and graphing fast", "In y = mx + b, the slope and vertical intercept are visible immediately. This form is useful for comparing rates and starting values across models.", "It is less convenient when b is unknown because an extra substitution step is needed to find it.", String.raw`y=-2x+7\Rightarrow m=-2,\ b=7`],
      ["Standard form has its own job", "Ax + By = C can avoid fractions and makes intercept calculations or integer comparisons tidy. It is not automatically more standard in every context.", "Forms are translations of the same relationship. Choose based on the information you need to expose.", String.raw`2x+3y=12`],
    ],
    example: { heading: "Match form to purpose", prompt: "Write the line with slope 2/3 through (6, 1), then show its intercept.", steps: [[String.raw`y-1=\frac23(x-6)`, "Point-slope form uses the given information directly."], [String.raw`y-1=\frac23x-4`, "Distribute to prepare for conversion."], [String.raw`y=\frac23x-3`, "Add one; the y-intercept is now visible."]], result: String.raw`\boxed{y=\frac23x-3}` },
    mistakes: ["Forcing slope-intercept form before finding a reliable equation.", "Treating b as an x-intercept.", "Assuming different forms describe different lines."], takeaways: ["Match the form to the given information.", "Convert when a feature needs to be visible.", "All valid forms describe the same point set."], related: ["equation-from-two-points", "parallel-perpendicular-lines", "interpreting-linear-models"],
  }),
  algebraArticle({
    slug: "parallel-perpendicular-lines", topicSlug: "linear-relationships", archetype: "concept",
    title: "Parallel and perpendicular slopes, with the vertical-line exception", shortTitle: "Parallel and perpendicular",
    deck: "Parallel nonvertical lines share a slope. Perpendicular nonvertical lines have slopes whose product is −1—but vertical and horizontal lines need separate language.",
    course: "Algebra I", difficulty: "Intermediate", minutes: 9,
    formula: String.raw`m_{\parallel}=m\qquad m_{\perp}=-\frac1m`, immediate: { label: "Relationship", tex: String.raw`m_1m_2=-1`, text: "The negative-reciprocal rule applies when both slopes are defined and nonzero." },
    sections: [
      ["Parallel means equal direction", "Distinct parallel lines rise and run at the same rate, so their slopes match. Their intercepts differ, which keeps the lines from being identical.", "Two vertical lines are also parallel even though neither has a numerical slope.", String.raw`y=3x+1\quad\parallel\quad y=3x-8`],
      ["Perpendicular means a quarter turn", "For ordinary nonvertical lines, rotating the direction by ninety degrees swaps rise and run and reverses one sign. That creates the negative reciprocal.", "Do not merely change the sign or merely take the reciprocal; both changes matter.", String.raw`m=\frac25\Rightarrow m_\perp=-\frac52`],
      ["Handle zero and undefined slopes directly", "A horizontal line has slope zero, so its perpendicular partner is vertical and has undefined slope. The reciprocal formula cannot divide by zero.", "Likewise, a vertical line is perpendicular to a horizontal line. State the equation x = constant or y = constant instead of inventing an infinite slope.", String.raw`y=4\quad\perp\quad x=-2`],
    ],
    example: { heading: "Build a perpendicular line", prompt: "Find the line perpendicular to y = −3x + 7 through (6, 2).", steps: [[String.raw`m=-3\Rightarrow m_\perp=\frac13`, "Take the negative reciprocal."], [String.raw`y-2=\frac13(x-6)`, "Use point-slope form through the new point."], [String.raw`y=\frac13x`, "Simplify."], [String.raw`(-3)\left(\frac13\right)=-1`, "Verify perpendicular slopes."]], result: String.raw`\boxed{y=\frac13x}` },
    mistakes: ["Changing only the sign of the slope.", "Applying the reciprocal rule to slope zero.", "Using the original line's intercept for the new line."], takeaways: ["Parallel lines share direction.", "Perpendicular slopes are negative reciprocals when defined.", "Horizontal and vertical lines are a special pair."], related: ["slope-as-rate-of-change", "equation-from-two-points", "point-slope-vs-slope-intercept"],
  }),
  algebraArticle({
    slug: "interpreting-linear-models", topicSlug: "linear-relationships", archetype: "answer",
    title: "What do slope and intercept mean in a linear model?", shortTitle: "Interpret linear models",
    deck: "The intercept is the modeled output at input zero; the slope is the predicted change in output per unit of input. Context decides whether either interpretation is sensible.",
    course: "Algebra I", difficulty: "Intermediate", minutes: 8,
    formula: String.raw`y=mx+b`, immediate: { label: "Answer", tex: String.raw`m=\frac{\text{output change}}{\text{input change}},\qquad b=y\text{ when }x=0`, text: "Always attach units and ask whether x = 0 lies inside the meaningful domain." },
    sections: [
      ["Slope carries two units", "If x is measured in hours and y in dollars, the slope is dollars per hour. A positive value predicts growth; a negative value predicts decline.", "A model's slope describes its average linear pattern, not necessarily the exact change in every individual observation.", String.raw`m=12.5\ \frac{\text{dollars}}{\text{hour}}`],
      ["The intercept may be meaningful—or merely algebraic", "The y-intercept predicts the output at x = 0. In a cost model it may be a fixed starting fee; in a model of adult height versus age, age zero may be outside the data's useful range.", "Do not force a story onto b when the input zero is impossible or far beyond the observed data.", String.raw`C(h)=25+18h\Rightarrow C(0)=25`],
      ["Prediction needs a domain", "Interpolation predicts within the observed input range and is usually safer than extrapolation beyond it. Real relationships may curve or change after the data ends.", "State units, input range, and practical constraints alongside the equation so the model is not mistaken for a universal law.", String.raw`2\le x\le10`],
    ],
    example: { heading: "Read the equation in context", prompt: "A bike rental costs C(h) = 12h + 8 dollars for h hours. Interpret 12 and 8.", steps: [[String.raw`m=12\ \frac{\text{dollars}}{\text{hour}}`, "Each additional hour adds twelve dollars."], [String.raw`C(0)=8\ \text{dollars}`, "Eight dollars is the modeled starting fee."], [String.raw`C(5)=12(5)+8=68`, "Use the model for a five-hour rental."]], result: String.raw`\boxed{\$12/\text{hour with an }\$8\text{ starting fee}}` },
    mistakes: ["Giving the slope without units.", "Calling the intercept meaningful without checking x = 0.", "Extrapolating far beyond the data without a warning."], takeaways: ["Slope is a contextual rate.", "The intercept is the output at zero.", "A model needs a sensible domain."], related: ["slope-as-rate-of-change", "function-notation", "direct-inverse-variation"],
  }),
];
