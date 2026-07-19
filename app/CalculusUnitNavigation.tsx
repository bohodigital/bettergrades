export const UNIT_2A_ROOT = "/subjects/math/calculus/derivatives/";
export const UNIT_2B_ROOT = "/subjects/math/calculus/derivative-applications/";
export const UNIT_3A_ROOT = "/subjects/math/calculus/integrals/";
export const UNIT_3B_ROOT = "/subjects/math/calculus/integration-applications/";

type UnitCode = "2A" | "2B" | "3A" | "3B";

const groups: Record<UnitCode, {
  label: string;
  title: string;
  description: string;
  links: { code: UnitCode; root: string; title: string; current: string; other: string }[];
}> = {
  "2A": {
    label: "Unit 2 · Derivatives",
    title: "Calculus I",
    description: "Build the derivative toolkit in 2A, then use it to analyze and model in 2B.",
    links: [
      { code: "2A", root: UNIT_2A_ROOT, title: "Derivative foundations", current: "You are here · Open the unit map", other: "Review meaning, rules, and techniques" },
      { code: "2B", root: UNIT_2B_ROOT, title: "Derivative applications", current: "You are here · Open the unit map", other: "Continue to applications and modeling" },
    ],
  },
  "2B": undefined as never,
  "3A": {
    label: "Unit 3 · Integrals",
    title: "Calculus I",
    description: "Build integral foundations in 3A, then use them for geometric and physical modeling in 3B.",
    links: [
      { code: "3A", root: UNIT_3A_ROOT, title: "Integral foundations", current: "You are here · Open the unit map", other: "Build accumulation and integration technique" },
      { code: "3B", root: UNIT_3B_ROOT, title: "Integration applications", current: "You are here · Open the unit map", other: "Continue to geometry and modeling" },
    ],
  },
  "3B": undefined as never,
};
groups["2B"] = groups["2A"];
groups["3B"] = {
  label: "Unit 3 · Integrals",
  title: "Calculus I",
  description: "Build integral foundations in 3A, then turn slices and accumulated contributions into geometric and physical models in 3B.",
  links: [
    { code: "3A", root: UNIT_3A_ROOT, title: "Integral foundations", current: "You are here · Open the unit map", other: "Review accumulation and techniques" },
    { code: "3B", root: UNIT_3B_ROOT, title: "Integration applications", current: "You are here · Open the unit map", other: "Continue to geometry and modeling" },
  ],
};

export function CalculusUnitNavigation({ currentUnit, compact = false }: { currentUnit: UnitCode; compact?: boolean }) {
  const group = groups[currentUnit];
  const family = currentUnit.startsWith("2") ? "2" : "3";
  return <nav className={`calculus-unit-switcher${compact ? " is-compact" : ""}`} aria-label={`Calculus Unit ${family} course navigation`}>
    <div className="calculus-unit-switcher-intro">
      <span>{group.title}</span>
      <strong>{group.label}</strong>
      <p>{group.description}</p>
    </div>
    <div className="calculus-unit-switcher-links">
      {group.links.map((link) => {
        const current = link.code === currentUnit;
        return <a href={link.root} className={current ? "is-current" : undefined} aria-current={current ? "location" : undefined} key={link.code}>
          <small>Unit {link.code}</small>
          <b>{link.title}</b>
          <span>{current ? link.current : link.other}</span>
        </a>;
      })}
    </div>
  </nav>;
}
