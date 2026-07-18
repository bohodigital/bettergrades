export const UNIT_2A_ROOT = "/subjects/math/calculus/derivatives/";
export const UNIT_2B_ROOT = "/subjects/math/calculus/derivative-applications/";

export function CalculusUnitNavigation({ currentUnit, compact = false }: { currentUnit: "2A" | "2B"; compact?: boolean }) {
  const unit2aCurrent = currentUnit === "2A";
  return <nav className={`calculus-unit-switcher${compact ? " is-compact" : ""}`} aria-label="Calculus Unit 2 course navigation">
    <div className="calculus-unit-switcher-intro">
      <span>Calculus I</span>
      <strong>Unit 2 · Derivatives</strong>
      <p>Build the derivative toolkit in 2A, then use it to analyze and model in 2B.</p>
    </div>
    <div className="calculus-unit-switcher-links">
      <a href={UNIT_2A_ROOT} className={unit2aCurrent ? "is-current" : undefined} aria-current={unit2aCurrent ? "location" : undefined}>
        <small>Unit 2A</small>
        <b>Derivative foundations</b>
        <span>{unit2aCurrent ? "You are here · Open the unit map" : "Review meaning, rules, and techniques"}</span>
      </a>
      <a href={UNIT_2B_ROOT} className={!unit2aCurrent ? "is-current" : undefined} aria-current={!unit2aCurrent ? "location" : undefined}>
        <small>Unit 2B</small>
        <b>Derivative applications</b>
        <span>{unit2aCurrent ? "Continue to applications and modeling" : "You are here · Open the unit map"}</span>
      </a>
    </div>
  </nav>;
}
