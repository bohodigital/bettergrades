# Unit 2A content mapping

## Complete core path

The 49 core routes form one continuous sequence:

| Section | Core pages | Instructional purpose |
| --- | ---: | --- |
| Orientation and prerequisites | 2 | Establish amount-versus-rate language and readiness. |
| Derivative meaning and foundations | 9 | Build the limit, tangent, function, units, data, and differentiability models. |
| Core differentiation rules | 8 | Connect rule choice to expression structure. |
| Trigonometric, exponential, and logarithmic functions | 8 | Explain special-function patterns rather than listing formulas. |
| Chain rule and compositions | 8 | Follow local rates through nested structures. |
| Implicit, inverse, and logarithmic differentiation | 9 | Track dependence, reciprocal slopes, and logarithmic structure. |
| Higher derivatives and complete strategy | 3 | Interpret repeated change and consolidate computation strategy. |
| Review, practice, exams, and reference | 2 | Diagnose and repair mixed-rule errors. |

## Supporting routes

The remaining 18 routes supply diagnostics, reference, concept quizzes, cumulative practice, two exams, two answer keys, and optional advanced explorations. These resources surround the core path; they do not replace or precede it on the landing page.

## Exposition policy

Every instructional page begins with a section-specific orientation containing:

- the current reading lens;
- the mental model to notice;
- the decision the learner must make;
- the common trap to avoid;
- a concrete self-check.

Typed content nodes preserve exposition, definitions, theorems, methods, applications, modeling labs, proof ideas, mistakes, walkthroughs, examples, tables, math, visuals, hints, and attempt-gated solutions. The importer rejects unsupported environments instead of flattening them into an unreviewable text dump.

## Rendering cleanup learned from Limits

- Inline `\(...\)`, dollar math, and display `\[...\]` are all recognized.
- List environments become semantic learner text and choices.
- Numbered diagnostic, practice, and exam lists become individual semantic exercise cards; the cumulative-practice route pairs each card with an independent attempt gate.
- Escaped percent signs survive TeX comment removal.
- Raw drawing programs never enter learner-visible text.
- All 67 routes are server-rendered in tests and scanned after HTML generation, not just at the JSON layer.
