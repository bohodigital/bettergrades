const probeValues = Object.freeze([0, 1, -1, 2, -2, 3, 5]);

export function hasNumericCounterexample(left, right) {
  const symbols = Array.from(new Set([...left.unknowns, ...right.unknowns])).sort();
  if (symbols.length > 3) return false;

  for (let index = 0; index < probeValues.length; index += 1) {
    const substitutions = Object.fromEntries(symbols.map((symbol, offset) => [symbol, probeValues[(index + offset) % probeValues.length]]));
    try {
      const leftValue = left.subs(substitutions).N();
      const rightValue = right.subs(substitutions).N();
      if (leftValue.isEqual(rightValue) === false) return true;
    } catch {
      // Undefined points are skipped. Stored first-pass problems are polynomials,
      // so valid probes remain available without making domain assumptions.
    }
  }
  return false;
}
