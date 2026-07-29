"use client";

import { foundationMathFragments } from "../lib/algebra/foundation-math.mjs";
import { Math } from "./Math";

export function AlgebraMathText({ value }: { value: string }) {
  return <>{foundationMathFragments(value).map((fragment, index) => fragment.kind === "math"
    ? <Math tex={fragment.tex} display={fragment.display} label={fragment.label} key={`math-${index}-${fragment.tex}`} />
    : <span key={`text-${index}`}>{fragment.value}</span>)}</>;
}
