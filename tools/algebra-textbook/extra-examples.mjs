import { EXTRA_EXAMPLES_A3_A6 } from "./extra-examples-a3-a6.mjs";
import { EXTRA_EXAMPLES_A7_A10 } from "./extra-examples-a7-a10.mjs";
import { EXTRA_EXAMPLES_A11_A14 } from "./extra-examples-a11-a14.mjs";

export const EXTRA_EXAMPLES = Object.freeze({
  ...EXTRA_EXAMPLES_A3_A6,
  ...EXTRA_EXAMPLES_A7_A10,
  ...EXTRA_EXAMPLES_A11_A14,
});

export function getExtraExamples(lessonId) {
  return EXTRA_EXAMPLES[lessonId] ?? null;
}
