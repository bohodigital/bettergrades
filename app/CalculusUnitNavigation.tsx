/* eslint-disable @next/next/no-html-link-for-pages -- canonical course navigation uses document navigation */

import { getCalculusUnitCollection } from "../lib/calculus/calculus-units-index.mjs";

export const UNIT_2A_ROOT = "/subjects/math/calculus/derivatives/";
export const UNIT_2B_ROOT = "/subjects/math/calculus/derivative-applications/";
export const UNIT_3A_ROOT = "/subjects/math/calculus/integrals/";
export const UNIT_3B_ROOT = "/subjects/math/calculus/integration-applications/";

type UnitCode = "2A" | "2B" | "3A" | "3B";

const unitIds: Record<UnitCode, string> = {
  "2A": "calc-1-unit-2a-derivative-foundations-techniques",
  "2B": "calc-1-unit-2b-derivative-applications",
  "3A": "calc-1-unit-3a-integral-foundations-techniques",
  "3B": "calc-1-unit-3b-integration-applications",
};

function sectionLinks(code: UnitCode) {
  const collection = getCalculusUnitCollection(unitIds[code]);
  if (!collection) return [];
  const seen = new Set<string>();
  return collection.routes.flatMap((route: { sectionId: string; sectionTitle: string; path: string }) => {
    if (seen.has(route.sectionId)) return [];
    seen.add(route.sectionId);
    return [{ id: route.sectionId, title: route.sectionTitle, href: route.path }];
  });
}

const groups: Record<UnitCode, {
  label: string;
  title: string;
  description: string;
  links: { code: UnitCode; root: string; title: string; current: string; other: string }[];
}> = {
  "2A": {
    label: "Calculus I · Chapter 2",
    title: "Derivatives",
    description: "One coherent chapter in two labeled units: build the derivative toolkit in 2A, then analyze and model with it in 2B.",
    links: [
      { code: "2A", root: UNIT_2A_ROOT, title: "Derivative foundations", current: "You are here · Open the unit map", other: "Review meaning, rules, and techniques" },
      { code: "2B", root: UNIT_2B_ROOT, title: "Derivative applications", current: "You are here · Open the unit map", other: "Continue to applications and modeling" },
    ],
  },
  "2B": undefined as never,
  "3A": {
    label: "Calculus I · Chapter 3",
    title: "Integrals",
    description: "One coherent chapter in two labeled units: build integral foundations in 3A, then use them for geometric and physical modeling in 3B.",
    links: [
      { code: "3A", root: UNIT_3A_ROOT, title: "Integral foundations", current: "You are here · Open the unit map", other: "Build accumulation and integration technique" },
      { code: "3B", root: UNIT_3B_ROOT, title: "Integration applications", current: "You are here · Open the unit map", other: "Continue to geometry and modeling" },
    ],
  },
  "3B": undefined as never,
};
groups["2B"] = groups["2A"];
groups["3B"] = {
  label: "Calculus I · Chapter 3",
  title: "Integrals",
  description: "One coherent chapter in two labeled units: build integral foundations in 3A, then turn accumulated contributions into models in 3B.",
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
      <span>{group.label}</span>
      <strong>{group.title}</strong>
      <p>{group.description}</p>
      <a href="/subjects/math/calculus/">All calculus chapters <span aria-hidden="true">→</span></a>
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
    <details className="calculus-unit-switcher-sections">
      <summary>Browse Chapter {family} sections <span aria-hidden="true">+</span></summary>
      <div>
        {group.links.map((unit) => <section key={unit.code}>
          <header><small>Unit {unit.code}</small><a href={unit.root}>{unit.title} <span aria-hidden="true">→</span></a></header>
          <nav aria-label={`Unit ${unit.code} sections`}>{sectionLinks(unit.code).map((section) => <a href={section.href} key={section.id}>{section.title}<span aria-hidden="true">→</span></a>)}</nav>
        </section>)}
      </div>
    </details>
  </nav>;
}
