# Unit 2A assessment mapping

## Inventory

- 34 unique deterministic quick checks.
- 7 structured assessment sets.
- 2 cumulative practice exams.
- 2 separately routed answer keys.
- 14 numbered answers in each answer key.
- 36 cumulative-practice exercises with one server-only, attempt-gated answer apiece.

## Supported grading

The server grader supports integer, numeric, rational, multiple-choice, symbolic-expression, and bounded rubric paths. Numeric and rational answers are normalized deterministically. Symbolic answers use the existing server-only equivalence boundary. Open conceptual prompts do not receive fabricated binary certainty.

## Attempt and reveal rules

- Empty submissions do not grade or reveal.
- Hints can be read before an attempt.
- Complete worked solutions unlock only after a real attempt.
- Ordinary solution bodies are stripped from route payloads and replaced by opaque reveal IDs.
- A reveal request must match the exact unit, route, reveal ID, and attempt.
- Exam keys are intentionally public routes, but they are separated from exam pages and introduced with finish-first guidance.
- Cumulative-practice answers remain server-only and are revealed independently; opening one answer cannot expose the other 35.

## Abuse and failure behavior

Both calculus APIs reject malformed JSON, oversized bodies, unknown units, unknown problem IDs, unknown routes, missing attempts, and mismatched reveal IDs. Errors are actionable but do not echo server answers or source data.

## Tests

Contract tests prove exact counts, ID uniqueness, route order, equivalent rational acceptance, correct multiple-choice normalization, bounded open-response behavior, reveal isolation, one answer for each of the 36 cumulative exercises, and the absence of canonical answers and source paths in public artifacts and client assets.
