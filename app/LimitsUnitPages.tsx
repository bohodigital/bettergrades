"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- canonical course navigation uses document navigation */

import { FormEvent, ReactNode, useState } from "react";
import { getLimitsUnitPage, limitsUnitCoreRoutes, limitsUnitPayload, limitsUnitRoutes, type LimitsUnitCheck, type LimitsUnitNode, type LimitsUnitPage } from "../lib/calculus/limits-unit.mjs";
import { Math } from "./Math";

const labels: Record<string, string> = {
  concept: "Concept", definition: "Definition", method: "Method", theorem: "Theorem",
  "worked-example": "Worked example", "guided-walkthrough": "Guided walkthrough",
  exercise: "Exercise", problem: "Problem", "quick-check": "Quick check",
  "common-mistake": "Common mistake", "exam-note": "Exam note", summary: "Summary", source: "Source note",
};

function cleanText(value: string) {
  return value.replace(/^\[(?:title=\{[^}]*\}|[^\]]*)\]\s*/, "")
    .replace(/\\chapter\*?\{([^}]*)\}/g, "$1").replace(/\\step\{\d+\}\{([^}]*)\}/g, "$1")
    .replace(/\\(?:textbf|emph|textit)\{([^}]*)\}/g, "$1")
    .replace(/\\item(?:\[([^\]]+)\])?/g, (_, label: string | undefined) => label ? ` • ${label} ` : " • ")
    .replace(/``|''/g, '"').replace(/~/g, " ").replace(/\\(?:centering|newpage|clearpage)\b/g, "")
    .replace(/\s+/g, " ").trim();
}

const supportedDisplayEnvironments = new Set(["aligned", "array", "cases", "gathered"]);

function safeDisplayTex(tex: string) {
  const environment = tex.match(/\\begin\{([^}]+)\}/)?.[1];
  if (environment && !supportedDisplayEnvironments.has(environment)) return null;
  return tex.replace(/\\begin\{(?:aligned|array|cases|gathered)\}/g, "").replace(/\\end\{(?:aligned|array|cases|gathered)\}/g, "")
    .replace(/^\s*\{[^}]*\}/, "").replace(/\\hline/g, "").replace(/&/g, String.raw`\quad `).replace(/\\\\/g, String.raw`\quad `).trim();
}

function RichText({ value }: { value: string }) {
  const pieces: ReactNode[] = [], cleaned = cleanText(value), expression = /\\\((.+?)\\\)/gs;
  let cursor = 0;
  for (const match of cleaned.matchAll(expression)) {
    const start = match.index ?? 0;
    if (start > cursor) pieces.push(cleaned.slice(cursor, start));
    pieces.push(<Math tex={match[1]} key={`${start}-${match[1]}`} />);
    cursor = start + match[0].length;
  }
  if (cursor < cleaned.length) pieces.push(cleaned.slice(cursor));
  return <>{pieces}</>;
}

function NodeChildren({ nodes, keyPrefix, checks, renderedCheckIds }: { nodes: LimitsUnitNode[]; keyPrefix: string; checks: Map<string, LimitsUnitCheck>; renderedCheckIds: Set<string> }) {
  return <>{nodes.map((node, index) => <SemanticNode node={node} key={`${keyPrefix}-${index}`} keyPrefix={`${keyPrefix}-${index}`} checks={checks} renderedCheckIds={renderedCheckIds} />)}</>;
}

function SemanticNode({ node, keyPrefix, checks, renderedCheckIds }: { node: LimitsUnitNode; keyPrefix: string; checks: Map<string, LimitsUnitCheck>; renderedCheckIds: Set<string> }) {
  if (node.type === "paragraph") {
    const text = cleanText(node.text ?? "");
    if (!text) return null;
    if ((node.text ?? "").includes("\\chapter")) return <h2><RichText value={node.text ?? ""} /></h2>;
    return <p className={text.startsWith("•") ? "limits-list-line" : undefined}><RichText value={node.text ?? ""} /></p>;
  }
  if (node.type === "heading") {
    const Heading = node.level === 3 ? "h3" : "h2";
    return <Heading><RichText value={node.text ?? ""} /></Heading>;
  }
  if (node.type === "math") {
    const tex = safeDisplayTex(node.tex ?? "");
    return tex ? <Math tex={tex} display className="limits-equation" /> : <p className="limits-render-note">A structured table or source diagram is available in the printable edition.</p>;
  }
  if (node.type === "graph-specification") return <figure className="limits-graph"><div aria-hidden="true">↗︎</div><figcaption><strong>{node.title && node.title !== "htbp" ? cleanText(node.title) : "Graph specification"}</strong><span>This source-defined graph is preserved for print; use the surrounding values and explanation as its accessible web description.</span>{node.text && <p>{cleanText(node.text)}</p>}</figcaption>{node.children?.length ? <details className="limits-disclosure"><summary>Accessible graph specification</summary><NodeChildren nodes={node.children} keyPrefix={keyPrefix} checks={checks} renderedCheckIds={renderedCheckIds} /></details> : null}</figure>;
  if (node.type === "quick-check") {
    const check = node.checkId ? checks.get(node.checkId) : undefined;
    if (!check || renderedCheckIds.has(check.id)) return null;
    renderedCheckIds.add(check.id);
    return <InteractiveCheck check={check} />;
  }
  if (node.type === "hint" || node.type === "solution") return <details className={`limits-disclosure limits-${node.type}`}><summary>{node.type === "hint" ? "Show hint" : "Show worked solution"}</summary><div><NodeChildren nodes={node.children ?? []} keyPrefix={keyPrefix} checks={checks} renderedCheckIds={renderedCheckIds} /></div></details>;
  const label = labels[node.type] ?? node.type.replaceAll("-", " ");
  return <section className={`limits-node limits-node-${node.type}`}><header><span>{label}</span>{node.title && <h3>{cleanText(node.title)}</h3>}</header><div><NodeChildren nodes={node.children ?? []} keyPrefix={keyPrefix} checks={checks} renderedCheckIds={renderedCheckIds} /></div></section>;
}

function InteractiveCheck({ check }: { check: LimitsUnitCheck }) {
  const [answer, setAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "invalid">("idle");
  const [solution, setSolution] = useState<string | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/limits-check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: check.id, answer, action: "grade" }) });
    const result = await response.json() as { status?: "correct" | "incorrect" | "empty" };
    setAttempted(true); setStatus(result.status === "empty" ? "invalid" : result.status ?? "invalid");
  }
  async function revealSolution() {
    if (!attempted || solution) return;
    const response = await fetch("/api/limits-check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: check.id, answer, action: "reveal" }) });
    const result = await response.json() as { solutionLatex?: string };
    setSolution(result.solutionLatex ?? "");
  }
  return <section className="limits-check" id={check.id} data-check-id={check.id}>
    <header><span>Interactive check</span><code>{check.id}</code></header>
    <p className="limits-check-prompt"><RichText value={check.promptLatex} /></p>
    <form onSubmit={submit}><label htmlFor={`${check.id}-answer`}>Your answer <small>{check.answerType}</small></label><div><input id={`${check.id}-answer`} value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" inputMode={check.answerType === "integer" || check.answerType === "rational" ? "decimal" : "text"} required /><button className="button button-ink" type="submit">Check answer</button></div></form>
    <p className={`limits-check-feedback is-${status}`} aria-live="polite">{status === "correct" ? "Correct. Your answer is equivalent to the expected result." : status === "incorrect" ? "Not yet. Use the hint, then try again." : status === "invalid" ? "Enter a complete answer, then try again." : "Your work stays on this device. No account or AI grader is used."}</p>
    <details className="limits-disclosure"><summary>Show hint</summary><p><RichText value={check.hintLatex} /></p></details>
    <details className="limits-disclosure" aria-disabled={!attempted} onToggle={(event) => { if ((event.currentTarget as HTMLDetailsElement).open) void revealSolution(); }}><summary>{attempted ? "Show complete worked solution" : "Attempt once to unlock the solution"}</summary>{attempted ? solution ? <p><RichText value={solution} /></p> : <p aria-live="polite">Loading the worked solution…</p> : <p>Submit an answer first. The hint is available now.</p>}</details>
  </section>;
}

function UnitMap() {
  const support = limitsUnitRoutes.filter((route) => !route.isCoreSequence);
  return <section className="limits-unit-map" aria-label="Limits and Continuity course map">
    <div><p className="eyebrow">Sequential core</p><h2>47 pages from prerequisites to formal limits.</h2></div>
    <ol>{limitsUnitCoreRoutes.map((route) => <li key={route.path}><a href={route.path}><span>{String(route.coreSequenceIndex).padStart(2, "0")}</span><b>{route.h1}</b><small>{route.description}</small></a></li>)}</ol>
    <div><p className="eyebrow">Supporting work</p><h2>Reviews, quizzes, references, and exams.</h2></div>
    <div className="limits-support-grid">{support.map((route) => <a href={route.path} key={route.path}><span>{labels[route.pageType] ?? route.pageType.replaceAll("-", " ")}</span><b>{route.h1}</b><small>{route.description}</small></a>)}</div>
  </section>;
}

function CourseNavigation({ page }: { page: LimitsUnitPage }) {
  return <nav className="limits-sequence" aria-label="Limits and Continuity sequence">
    {page.previous ? <a href={page.previous.path}><small>← Previous · {page.previous.coreSequenceIndex} of 47</small><b>{page.previous.h1}</b></a> : <span />}
    {page.next ? <a href={page.next.path}><small>Next · {page.next.coreSequenceIndex} of 47 →</small><b>{page.next.h1}</b></a> : page.returnRoute && page.returnRoute.path !== page.route.path ? <a href={page.returnRoute.path}><small>Return to sequence →</small><b>{page.returnRoute.h1}</b></a> : <a href={limitsUnitRoutes[0].path}><small>Unit overview →</small><b>Limits and Continuity</b></a>}
  </nav>;
}

export function LimitsUnitPageContent({ path }: { path: string }) {
  const page = getLimitsUnitPage(path);
  if (!page) return null;
  const { route } = page;
  const checks = new Map(page.checks.map((check) => [check.id, check]));
  const renderedCheckIds = new Set<string>();
  const schema = { "@context": "https://schema.org", "@type": route.pageType === "quiz" || route.pageType === "exam" ? "Quiz" : "LearningResource", name: route.h1, description: route.description, url: `https://bettergrades.net${route.path}`, isPartOf: { "@type": "Course", name: "Calculus I: Limits and Continuity" } };
  return <article className="limits-unit-page" data-page-type={route.pageType}>
    <header className="limits-unit-hero section-pad">
      <nav className="breadcrumbs"><a href="/subjects/">Subjects</a><span>/</span><a href="/subjects/math/">Mathematics</a><span>/</span><a href="/subjects/math/calculus/">Calculus</a><span>/</span><a href="/subjects/math/calculus/limits-continuity/">Limits &amp; Continuity</a><span>/</span><span>{route.h1}</span></nav>
      <p className="eyebrow">Calculus I · Limits and Continuity · {labels[route.pageType] ?? route.pageType}</p>
      <h1>{route.h1}</h1><p>{route.description}</p>
      <div className="limits-progress"><strong>Course progress</strong>{route.isCoreSequence ? <><span>{route.coreSequenceIndex} of 47 core pages</span><progress value={route.coreSequenceIndex ?? 0} max="47">{route.coreSequenceIndex} of 47</progress></> : <><span>Supporting resource</span><a href={page.returnRoute?.path ?? limitsUnitRoutes[0].path}>Return to the core path →</a></>}</div>
    </header>
    <div className="limits-unit-layout section-pad"><aside><strong>On this page</strong><span>{page.checks.length} interactive {page.checks.length === 1 ? "check" : "checks"}</span><a href={limitsUnitRoutes[0].path}>Complete unit map →</a><a href="/subjects/math/calculus/limits-continuity/">Limits topic page →</a><a href="/practice/math/calculus/">Calculus practice →</a></aside><div className="limits-unit-content">
      {route.pageType === "hub" && <UnitMap />}
      <NodeChildren nodes={page.page.nodes} keyPrefix={route.sourceSlug} checks={checks} renderedCheckIds={renderedCheckIds} />
      {page.related.length > 0 && <section className="limits-related"><p className="eyebrow">Keep working</p><h2>Related resources</h2>{page.related.map((related) => <a href={related.path} key={related.path}><span>{labels[related.pageType] ?? related.pageType}</span><b>{related.h1}</b></a>)}</section>}
      <section className="limits-rights"><p className="eyebrow">Source &amp; rights</p><h2>Original instruction with traceable references.</h2><p>{limitsUnitPayload.source.provenance.note}</p><p>BetterGrades-original material remains separate from public-domain references. This page contains no Active Calculus adaptation and no source textbook PDF.</p></section>
    </div></div>
    <CourseNavigation page={page} />
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </article>;
}
