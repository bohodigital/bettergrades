"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- this route shell uses deliberate document navigation */

import { useMemo, useState } from "react";
import type { MathGlossaryTerm } from "../lib/glossary/math/registry.mjs";
import { enrichedGlossaryResources } from "../lib/resources/catalog.mjs";
import { Math } from "./Math";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
type MathGlossaryCategory = { id: MathGlossaryTerm["categoryId"]; label: string; description: string };

function glossaryLetter(term: MathGlossaryTerm) {
  return term.term.normalize("NFKD").replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase() || "#";
}

function normalizeGlossaryText(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function filterGlossary(terms: readonly MathGlossaryTerm[], query: string, categoryId: string) {
  const clean = normalizeGlossaryText(query);
  const words = clean.split(" ").filter(Boolean);
  return terms
    .filter((term) => categoryId === "all" || term.categoryId === categoryId)
    .map((term) => {
      const name = normalizeGlossaryText(term.term);
      const aliases = normalizeGlossaryText(term.aliases.join(" "));
      const keywords = normalizeGlossaryText(term.keywords.join(" "));
      const definitions = normalizeGlossaryText(`${term.shortDefinition} ${term.definition}`);
      let score = !clean ? 1 : name === clean ? 100 : name.includes(clean) ? 50 : aliases.includes(clean) ? 35 : 0;
      for (const word of words) score += name.includes(word) ? 18 : aliases.includes(word) ? 12 : keywords.includes(word) ? 8 : definitions.includes(word) ? 3 : 0;
      return { term, score };
    })
    .filter(({ score }) => !clean || score > 0)
    .sort((a, b) => b.score - a.score || a.term.term.localeCompare(b.term.term))
    .map(({ term }) => term);
}

export function GlossaryHubPage({ terms }: { terms: readonly MathGlossaryTerm[] }) {
  return <><section className="glossary-hero section-pad"><p className="eyebrow">Glossaries</p><h1>Find the definition.</h1><p>Look up a mathematical term, symbol, or notation and move directly to its meaning and example.</p></section><section className="glossary-hub-list section-pad"><a href="/glossary/math/"><span className="product-mark">∑</span><div><p className="eyebrow">Mathematics glossary</p><h2>{terms.length} definitions and notations</h2><small>Alphabetized terms · Visual notation · Calculus and algebra</small></div><b>Open glossary →</b></a></section></>;
}

export function MathGlossaryPage({ terms: allTerms, categories }: { terms: readonly MathGlossaryTerm[]; categories: readonly MathGlossaryCategory[] }) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const terms = useMemo(() => filterGlossary(allTerms, query, categoryId), [allTerms, categoryId, query]);
  const letters = new Set(terms.map(glossaryLetter));
  return (
    <>
      <section className="glossary-hero section-pad">
        <nav className="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/glossary/">Glossaries</a><span>/</span><span>Mathematics</span></nav>
        <p className="eyebrow">Mathematics glossary</p>
        <h1>Read the symbol.<br /><em>Understand the idea.</em></h1>
        <p>{allTerms.length} terms and notations, organized for quick lookup now and a much larger library later.</p>
        <div className="glossary-hero-actions"><a className="button button-ink" href="/glossary/math/conventions/">Our notation conventions</a><span>Stable anchors · Visual notation · Sitewide definitions</span></div>
      </section>
      <section className="glossary-controls section-pad" aria-label="Filter the math glossary">
        <label><span>Search terms and symbols</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try derivative, d/dx, denominator, or MVT" /></label>
        <div className="glossary-category-filter"><span>Category</span><div>{[{id:"all",label:"All"}, ...categories].map((category) => <button type="button" className={categoryId === category.id ? "active" : ""} onClick={() => setCategoryId(category.id)} key={category.id}>{category.label}</button>)}</div></div>
        <nav className="glossary-alphabet" aria-label="Glossary alphabet">{alphabet.map((letter) => letters.has(letter) && !query ? <a href={`#letter-${letter}`} key={letter}>{letter}</a> : <span key={letter}>{letter}</span>)}</nav>
      </section>
      <section className="glossary-index section-pad">
        <div className="glossary-index-status"><strong>{terms.length} entries</strong><span>{query ? `Matching “${query}”` : categoryId === "all" ? "Alphabetized A–Z" : categories.find((category) => category.id === categoryId)?.label}</span></div>
        {terms.length ? alphabet.map((letter) => {
          const group = terms.filter((term) => glossaryLetter(term) === letter);
          if (!group.length) return null;
          return <section className="glossary-letter-group" id={`letter-${letter}`} key={letter}><header><span>{letter}</span><small>{group.length}</small></header><div>{group.map((term) => <article className="glossary-entry" id={term.id} key={term.id}><div className="glossary-entry-name"><h2>{term.term}</h2>{term.aliases.length > 0 && <p>Also: {term.aliases.slice(0, 4).join(" · ")}</p>}</div><div className="glossary-entry-visuals">{term.visuals.map((visual) => <figure key={`${term.id}-${visual.label}`}><Math tex={visual.tex} display label={visual.label} /><figcaption>{visual.label}</figcaption></figure>)}</div><div className="glossary-entry-definition"><p>{term.definition}</p>{enrichedGlossaryResources.some((resource) => resource.glossaryTermId === term.id) && <a className="glossary-enriched-link" href={`/glossary/math/${term.id}/`}>Full explanation, notation, and worked example →</a>}{term.externalLinks.length > 0 && <div>{term.externalLinks.map((link) => <a href={link.url} key={link.url} rel="noreferrer">{link.label} ↗</a>)}</div>}</div></article>)}</div></section>;
        }) : <div className="glossary-empty"><span>∅</span><h2>No glossary match yet.</h2><p>Try the ordinary name, a symbol, or a related phrase.</p></div>}
      </section>
    </>
  );
}

const lowercaseConventions = [
  [String.raw`x,y,z`, "ordinary scalar variables", "Use lowercase italic letters unless the context gives a stronger convention."],
  [String.raw`t`, "time", "Use t as the independent variable for time-dependent quantities."],
  [String.raw`n,k,i,j`, "integer indices", "State the starting index; do not rely on whether natural numbers include zero."],
  [String.raw`a,b,c`, "parameters or interval endpoints", "Define their role locally; keep them lowercase for generic scalars."],
  [String.raw`f,g,h`, "functions", "Use lowercase names for ordinary functions and always show the input when ambiguity is possible."],
  [String.raw`m,b`, "slope and vertical intercept", "Reserve this pair for a linear model when using y=mx+b."],
  [String.raw`u,v`, "substitution or helper functions", "Define them before using du, dv, or integration by parts."],
  [String.raw`r`, "radius or common ratio", "Use lowercase r for an ordinary radius; R is reserved for an outer radius or Taylor remainder."],
  [String.raw`A,B,S`, "named sets", "Capital letters may name sets when membership or set operations make that role explicit."],
  [String.raw`A,B,C`, "named geometry points", "Capital letters name points; the middle letter in an angle name identifies its vertex."],
];

export function MathConventionsPage({ uppercaseConventions }: { uppercaseConventions: Readonly<Record<string, string>> }) {
  return (
    <>
      <section className="conventions-hero section-pad">
        <nav className="breadcrumbs"><a href="/subjects/">Subjects</a><span>/</span><a href="/subjects/math/">Mathematics</a><span>/</span><a href="/glossary/math/">Glossary</a><span>/</span><span>Conventions</span></nav>
        <p className="eyebrow">Better Grades math standard</p><h1>Letters should carry meaning,<br /><em>not decorative noise.</em></h1>
        <p>Our default is simple: lowercase italic variables, named inputs, explicit units, and capital letters only when a standard mathematical role justifies them.</p>
      </section>
      <section className="conventions-body section-pad">
        <aside><strong>Non-negotiable</strong><p>A new capital letter, LaTeX command, or visible symbol must be documented before it ships in an article.</p><a href="/glossary/math/">Open the full glossary →</a></aside>
        <div>
          <section className="convention-section"><p className="eyebrow">Default alphabet</p><h2>Lowercase is the rule.</h2><div className="convention-table">{lowercaseConventions.map(([tex, role, rule]) => <div key={tex}><Math tex={tex} display /><b>{role}</b><p>{rule}</p></div>)}</div></section>
          <section className="convention-section"><p className="eyebrow">Reserved capitals</p><h2>Every capital needs a job.</h2><div className="convention-table">{Object.entries(uppercaseConventions).map(([letter, rule]) => <div key={letter}><Math tex={letter} display /><b>Reserved use</b><p>{rule}</p></div>)}</div></section>
          <section className="convention-section"><p className="eyebrow">Derivative notation</p><h2>Similar marks, different information.</h2><div className="notation-comparison"><div><Math tex={String.raw`\frac d{dx}`} display /><b>Operator</b><p>An instruction to differentiate the expression that follows with respect to x.</p></div><div><Math tex={String.raw`\frac{dy}{dx}`} display /><b>Named dependency</b><p>The derivative of dependent variable y with respect to independent variable x.</p></div><div><Math tex={String.raw`f'(x)`} display /><b>Function derivative</b><p>The first derivative of f, evaluated at x.</p></div><div><Math tex={String.raw`\dot y=\frac{dy}{dt}`} display /><b>Time derivative</b><p>Dot notation is reserved for differentiation with respect to time.</p></div></div></section>
          <section className="convention-section"><p className="eyebrow">Editorial enforcement</p><h2>What the build rejects.</h2><ul className="convention-rules"><li>Glossary IDs, names, or anchors that collide.</li><li>Glossary entries without a visual mathematical example.</li><li>Undocumented LaTeX commands used by canonical articles.</li><li>Standalone capital variables without a reserved convention.</li><li>Public routes without contextual glossary terms.</li></ul></section>
        </div>
      </section>
    </>
  );
}
