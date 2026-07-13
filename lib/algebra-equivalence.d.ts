type ProbeExpression = {
  readonly unknowns: readonly string[];
  subs(values: Record<string, number>): ProbeExpression;
  N(): ProbeExpression;
  isEqual(other: ProbeExpression): boolean | undefined;
};

export function hasNumericCounterexample(left: ProbeExpression, right: ProbeExpression): boolean;
