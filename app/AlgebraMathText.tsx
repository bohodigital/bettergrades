"use client";

import { foundationMathFragments } from "../lib/algebra/foundation-math.mjs";
import { Math } from "./Math";

type MathFragment = ReturnType<typeof foundationMathFragments>[number];

function isMathFragment(fragment: MathFragment): fragment is Extract<MathFragment, { kind: "math" }> {
  return fragment.kind === "math";
}

function isSubstantialMath(tex: string) {
  return /\\frac|[=<>]|\\(?:le|ge|ne|approx|div|times|cdot)\b|[+\-]/.test(tex);
}

function displayPlan(value: string) {
  const fragments = foundationMathFragments(value);
  const math = fragments.filter(isMathFragment);
  if (math.length === 0) return null;

  const punctuationOnly = (text: string) => /^[\s.,;:!?]*$/.test(text);
  const actionLead = (text: string) => /^(?:solve|simplify|compute|evaluate|rewrite|convert(?:\s+to)?|obtain|check|compare|find|factor|expand|graph|substitute|verify|distribute(?:\s+and\s+combine\s+to\s+get)?|calculate|determine)\b/i.test(text.trim());

  if (math.length === 1) {
    const mathIndex = fragments.indexOf(math[0]);
    const before = fragments.slice(0, mathIndex).map((fragment) => fragment.kind === "text" ? fragment.value : "").join("");
    const after = fragments.slice(mathIndex + 1).map((fragment) => fragment.kind === "text" ? fragment.value : "").join("");
    if (punctuationOnly(before) && punctuationOnly(after)) {
      return { lead: "", tex: math[0].tex, label: value };
    }
    if (actionLead(before) && (punctuationOnly(after) || /^\s+and\s+check[.!?]?\s*$/i.test(after))) {
      const check = /^\s+and\s+check/i.test(after) ? ", then check" : "";
      return { lead: `${before.trim().replace(/[:.]$/, "")}${check}`, tex: math[0].tex, label: value };
    }
    return null;
  }

  if (math.length === 2 && isSubstantialMath(`${math[0].tex}${math[1].tex}`)) {
    const firstIndex = fragments.indexOf(math[0]);
    const secondIndex = fragments.indexOf(math[1]);
    const before = fragments.slice(0, firstIndex).map((fragment) => fragment.kind === "text" ? fragment.value : "").join("");
    const between = fragments.slice(firstIndex + 1, secondIndex).map((fragment) => fragment.kind === "text" ? fragment.value : "").join("").trim().toLowerCase();
    const after = fragments.slice(secondIndex + 1).map((fragment) => fragment.kind === "text" ? fragment.value : "").join("");
    if (actionLead(before) && punctuationOnly(after) && ["as", "to", "and"].includes(between)) {
      const tex = between === "and"
        ? `${math[0].tex} \\qquad ${math[1].tex}`
        : `${math[0].tex} = ${math[1].tex}`;
      return { lead: before.trim().replace(/[:.]$/, ""), tex, label: value };
    }
  }
  return null;
}

export function AlgebraMathText({ value, display = false }: { value: string; display?: boolean | "auto" }) {
  const plan = display === true || display === "auto" ? displayPlan(value) : null;
  if (plan) {
    return <span className="algebra-equation-statement">
      {plan.lead && <span className="algebra-equation-lead">{plan.lead}</span>}
      <Math tex={plan.tex} display className="algebra-textbook-equation" label={plan.label} />
    </span>;
  }
  return <>{foundationMathFragments(value).map((fragment, index) => fragment.kind === "math"
    ? <Math tex={fragment.tex} display={fragment.display} label={fragment.label} key={`math-${index}-${fragment.tex}`} />
    : <span key={`text-${index}`}>{fragment.value}</span>)}</>;
}
