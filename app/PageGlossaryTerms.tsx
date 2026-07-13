"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- this route shell uses deliberate document navigation */

import { getPageGlossaryTerms } from "../lib/glossary/page-terms";
import type { PageGlossaryTerm } from "../lib/glossary/math/page-artifact.mjs";
import { Math } from "./Math";

function TermChip({ term }: { term: PageGlossaryTerm }) {
  return (
    <details className="page-term-chip">
      <summary>{term.term}</summary>
      <div className="page-term-popover">
        <span className="page-term-popover-label">Math glossary</span>
        <strong>{term.term}</strong>
        {term.visuals.length > 0 && <div className="page-term-popover-math">{term.visuals.slice(0, 2).map((visual) => <Math tex={visual.tex} display key={`${term.id}-${visual.label}`} label={visual.label} />)}</div>}
        <p>{term.shortDefinition}</p>
        <a href={`/glossary/math/#${term.id}`}>Learn more <span aria-hidden="true">→</span></a>
      </div>
    </details>
  );
}

export function PageGlossaryTerms({ path }: { path: string }) {
  const terms = getPageGlossaryTerms(path);
  return (
    <section className="page-terms" aria-label="Terms on this page">
      <div className="page-terms-inner">
        <span className="page-terms-title">On this page</span>
        <div className="page-term-list">{terms.map((term) => <TermChip term={term} key={term.id} />)}</div>
        <a className="page-terms-all" href="/glossary/math/">Math glossary <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
