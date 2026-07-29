export type FoundationMathFragment =
  | { kind: "text"; value: string }
  | { kind: "math"; tex: string; display: boolean; label: string };

export function foundationTextToLatex(value: string): string;
export function foundationMathFragments(value: string): FoundationMathFragment[];
