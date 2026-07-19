"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- canonical course navigation uses document navigation */

import { FormEvent, ReactNode, useState } from "react";
import { getCalculusUnitCollection, getCalculusUnitSectionGuidance } from "../lib/calculus/calculus-units-index.mjs";
import type { CalculusPublicProblem, CalculusUnitNode, CalculusUnitPublicPage } from "../lib/calculus/calculus-unit.mjs";
import { BetterGradesVisual } from "./BetterGradesVisual";
import { CalculusUnitNavigation, UNIT_2A_ROOT, UNIT_2B_ROOT, UNIT_3A_ROOT, UNIT_3B_ROOT } from "./CalculusUnitNavigation";
import { Math } from "./Math";

const labels: Record<string, string> = {
  "advanced-note": "Optional advanced note",
  application: "Application",
  "answer-key-item": "Answer",
  bridge: "Bridge",
  checkpoint: "Checkpoint",
  concept: "Concept",
  decision: "Decision",
  definition: "Definition",
  "exam-note": "Exam note",
  exercise: "Exercise",
  exposition: "Explanation",
  "guided-walkthrough": "Guided walkthrough",
  hint: "Hint",
  "modeling-lab": "Modeling lab",
  method: "Method",
  "common-mistake": "Common mistake",
  problem: "Problem",
  "proof-idea": "Proof idea",
  source: "Source note",
  summary: "Summary",
  theorem: "Theorem",
  translation: "In ordinary language",
  "worked-example": "Worked example",
};

function cleanText(value: string) {
  return String(value)
    .replace(/^\[(?:title=\{[^}]*\}|[^\]]*)\]\s*/, "")
    .replace(/\\texorpdfstring\{(\\\([\s\S]*?\\\))\}\{[^}]*\}/g, "$1")
    .replace(/\\(?:chapter|section|subsection)\*?\{([^}]*)\}/g, "$1")
    .replace(/\\step\{\d+\}\{([^}]*)\}/g, "$1")
    .replace(/\\(?:textbf|emph|textit|small)\{([^}]*)\}/g, "$1")
    .replace(/\\begin\{(?:enumerate|itemize|description)\}(?:\[[^\]]*\])?/g, " ")
    .replace(/\\end\{(?:enumerate|itemize|description)\}/g, " ")
    .replace(/\\item(?:\[([^\]]+)\])?/g, (_, label: string | undefined) => label ? ` • ${label} ` : " • ")
    .replace(/``|''/g, '"')
    .replace(/~/g, " ")
    .replace(/\\(?:centering|newpage|clearpage)\b/g, "")
    .replace(/\\(?:cref|Cref|ref|eqref|pageref)\{[^}]*\}/g, "the referenced section")
    .replace(/\\label\{[^}]*\}/g, "")
    .replace(/\bChapters\b/g, "Units")
    .replace(/\bChapter\b/g, "Unit")
    .replace(/\bchapters\b/g, "units")
    .replace(/\bchapter\b/g, "unit")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeWebTex(value: string) {
  return String(value)
    .replace(/\$(.*?)\$/gs, "$1")
    .replace(/\\eps(?=[^A-Za-z]|$)/g, String.raw`\varepsilon`)
    .replace(/\\DNE(?=[^A-Za-z]|$)/g, String.raw`\mathrm{DNE}`)
    .replace(/\\tfrac/g, String.raw`\frac`);
}

const supportedDisplayEnvironments = new Set(["aligned", "array", "cases", "gathered"]);
function safeDisplayTex(tex: string) {
  const normalized = normalizeWebTex(tex)
    .replace(/\\begin\{align\*?\}/g, "\\begin{aligned}")
    .replace(/\\end\{align\*?\}/g, "\\end{aligned}");
  const environment = normalized.match(/\\begin\{([^}]+)\}/)?.[1];
  return environment && !supportedDisplayEnvironments.has(environment) ? null : normalized.replace(/\\hline/g, "").trim();
}

function RichText({ value }: { value: string }) {
  const pieces: ReactNode[] = [];
  const cleaned = cleanText(value);
  const expression = /\\\((.+?)\\\)|\\\[([\s\S]*?)\\\]|(?<!\\)\$(?!\$)(.+?)(?<!\\)\$/gs;
  let cursor = 0;
  for (const match of cleaned.matchAll(expression)) {
    const start = match.index ?? 0;
    if (start > cursor) pieces.push(cleaned.slice(cursor, start));
    const tex = match[1] ?? match[2] ?? match[3];
    pieces.push(<Math tex={normalizeWebTex(tex)} display={Boolean(match[2])} key={`${start}-${tex}`} />);
    cursor = start + match[0].length;
  }
  if (cursor < cleaned.length) pieces.push(cleaned.slice(cursor));
  return <>{pieces}</>;
}

function parseJson<T>(response: Response): Promise<T | null> {
  return response.json().then((value) => value as T).catch(() => null);
}

function InteractiveProblem({ problem }: { problem: CalculusPublicProblem }) {
  const [answer, setAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "uncertain" | "invalid">("idle");
  const [feedback, setFeedback] = useState("Your work stays on this device. No account or AI grader is used.");
  const [solution, setSolution] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function request(action: "grade" | "reveal") {
    setBusy(true);
    try {
      const response = await fetch("/api/calculus-check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ unitId: problem.unitId, id: problem.id, answer, action }) });
      const result = await parseJson<{ status?: string; feedback?: string; solutionLatex?: string; error?: string }>(response);
      if (!response.ok || !result) throw new Error(result?.error ?? "The checker returned an unreadable response.");
      if (action === "reveal") setSolution(result.solutionLatex ?? "No model response was supplied.");
      else {
        setAttempted(true);
        const nextStatus = result.status === "empty" ? "invalid" : result.status;
        setStatus(nextStatus === "correct" || nextStatus === "incorrect" || nextStatus === "uncertain" ? nextStatus : "invalid");
        setFeedback(result.feedback ?? "Review your answer and try again.");
      }
    } catch (error) {
      setStatus("invalid");
      setFeedback(error instanceof Error ? error.message : "The checker could not be reached. Your answer was not lost.");
    } finally { setBusy(false); }
  }

  function submit(event: FormEvent) { event.preventDefault(); void request("grade"); }
  const inputId = `${problem.id}-answer`;
  return <section className="limits-check" id={problem.id} data-check-id={problem.id}>
    <header><span>Interactive check</span><code>{problem.id}</code></header>
    <p className="limits-check-prompt"><RichText value={problem.promptLatex} /></p>
    <form onSubmit={submit}>
      <label htmlFor={inputId}>Your answer <small>{problem.answerType.replaceAll("_", " ")}</small></label>
      {problem.choices.length ? <div className="calculus-choice-list">{problem.choices.map((choice) => <label key={choice}><input type="radio" name={inputId} value={choice} checked={answer === choice} onChange={() => setAnswer(choice)} /><span><RichText value={choice} /></span></label>)}</div>
        : <div><input id={inputId} value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" inputMode={["integer", "numeric", "rational"].includes(problem.answerType) ? "decimal" : "text"} required /><button className="button button-ink" type="submit" disabled={busy}>{busy ? "Checking…" : "Check answer"}</button></div>}
      {problem.choices.length ? <button className="button button-ink" type="submit" disabled={busy || !answer}>{busy ? "Checking…" : "Check answer"}</button> : null}
    </form>
    <p className={`limits-check-feedback is-${status}`} aria-live="polite">{feedback}</p>
    {problem.hints.length > 0 && <details className="limits-disclosure"><summary>Show hint</summary>{problem.hints.map((hint) => <p key={hint}><RichText value={hint} /></p>)}</details>}
    <details className="limits-disclosure" aria-disabled={!attempted} onToggle={(event) => { if (event.currentTarget.open && attempted && !solution && !busy) void request("reveal"); }}>
      <summary>{attempted ? "Show complete worked solution" : "Attempt once to unlock the solution"}</summary>
      {attempted ? solution ? <p><RichText value={solution} /></p> : <p aria-live="polite">Loading the worked solution…</p> : <p>Submit an answer first. The hint is available now.</p>}
    </details>
  </section>;
}

function SolutionReveal({ unitId, routeId, node }: { unitId: string; routeId: string; node: CalculusUnitNode }) {
  const [attempt, setAttempt] = useState("");
  const [nodes, setNodes] = useState<CalculusUnitNode[]>();
  const [message, setMessage] = useState("Write a real attempt before opening the supplied answer.");
  const [busy, setBusy] = useState(false);
  async function reveal() {
    if (!attempt.trim()) { setMessage("Write an attempt first; even a partial setup is useful."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/calculus-reveal", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ unitId, routeId, revealId: node.revealId, attempt }) });
      const result = await parseJson<{ nodes?: CalculusUnitNode[]; error?: string }>(response);
      if (!response.ok || !result?.nodes) throw new Error(result?.error ?? "The answer reveal returned an unreadable response.");
      setNodes(result.nodes);
      setMessage("Compare the first line where your work differs, then retry the problem without looking.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "The answer could not be loaded."); }
    finally { setBusy(false); }
  }
  return <section className="limits-node limits-node-solution calculus-attempt-reveal">
    <header><span>Answer reveal</span>{node.title && <h3>{node.title}</h3>}</header>
    <div>{nodes ? <NodeChildren nodes={nodes} keyPrefix={node.revealId ?? "reveal"} unitId={unitId} routeId={routeId} checks={new Map()} renderedChecks={new Set()} /> : <>
      <label htmlFor={`${node.revealId}-attempt`}>Your setup or answer</label>
      <textarea id={`${node.revealId}-attempt`} value={attempt} onChange={(event) => setAttempt(event.target.value)} rows={3} />
      <button className="button button-ink" type="button" onClick={() => void reveal()} disabled={busy}>{busy ? "Loading…" : "Show supplied answer"}</button>
    </>}</div>
    <p aria-live="polite">{message}</p>
  </section>;
}

type NodeProps = { node: CalculusUnitNode; keyPrefix: string; unitId: string; routeId: string; checks: Map<string, CalculusPublicProblem>; renderedChecks: Set<string> };
function NodeChildren({ nodes, keyPrefix, unitId, routeId, checks, renderedChecks }: { nodes: CalculusUnitNode[]; keyPrefix: string; unitId: string; routeId: string; checks: Map<string, CalculusPublicProblem>; renderedChecks: Set<string> }) {
  return <>{nodes.map((node, index) => <SemanticNode node={node} key={`${keyPrefix}-${index}`} keyPrefix={`${keyPrefix}-${index}`} unitId={unitId} routeId={routeId} checks={checks} renderedChecks={renderedChecks} />)}</>;
}

function collectEmbeddedCheckIds(nodes: CalculusUnitNode[], ids = new Set<string>()) {
  for (const node of nodes) {
    if (node.type === "quick-check" && node.checkId) ids.add(node.checkId);
    if (node.children) collectEmbeddedCheckIds(node.children, ids);
  }
  return ids;
}

function SemanticNode({ node, keyPrefix, unitId, routeId, checks, renderedChecks }: NodeProps) {
  if (node.type === "paragraph") {
    const cleaned = cleanText(node.text ?? "");
    if (!cleaned) return null;
    return <p className={cleaned.startsWith("•") ? "limits-list-line" : undefined}><RichText value={node.text ?? ""} /></p>;
  }
  if (node.type === "heading") {
    const Heading = node.level === 3 ? "h3" : "h2";
    return <Heading><RichText value={node.text ?? ""} /></Heading>;
  }
  if (node.type === "math") {
    const tex = safeDisplayTex(node.tex ?? "");
    return tex ? <Math tex={tex} display className="limits-equation" /> : <p role="alert">This equation could not be rendered safely.</p>;
  }
  if (node.type === "table") return <div className="limits-table-wrap"><table><caption className="sr-only">Calculus reference table</caption><tbody>{(node.rows ?? []).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => rowIndex === 0 ? <th scope="col" key={cellIndex}><RichText value={cell} /></th> : <td key={cellIndex}><RichText value={cell} /></td>)}</tr>)}</tbody></table></div>;
  if (node.type === "visual-reference") return <figure className="limits-graph limits-graph-visual calculus-unit-visual">{node.visual ? <BetterGradesVisual visual={node.visual} /> : <p role="alert">This visual is temporarily unavailable.</p>}<figcaption><strong>{node.title ?? "Visual study"}</strong>{node.text && <p><RichText value={node.text} /></p>}{node.visual && <p>{node.visual.caption.segments.map((segment) => segment.kind === "text" ? segment.text : segment.spokenText).join(" ")}</p>}</figcaption></figure>;
  if (node.type === "graph-specification" && /accompanies the complete printable source/i.test(node.text ?? "")) return null;
  if (node.type === "quick-check") {
    const check = node.checkId ? checks.get(node.checkId) : undefined;
    if (check && !renderedChecks.has(check.id)) { renderedChecks.add(check.id); return <InteractiveProblem problem={check} />; }
    return node.children?.length ? <section className="limits-node limits-node-quick-check"><header><span>Quick check</span></header><div><NodeChildren nodes={node.children} keyPrefix={keyPrefix} unitId={unitId} routeId={routeId} checks={checks} renderedChecks={renderedChecks} /></div></section> : null;
  }
  if (node.type === "solution-reveal") return <SolutionReveal unitId={unitId} routeId={routeId} node={node} />;
  if (node.type === "hint") return <details className="limits-disclosure limits-hint"><summary>Show hint</summary><div><NodeChildren nodes={node.children ?? []} keyPrefix={keyPrefix} unitId={unitId} routeId={routeId} checks={checks} renderedChecks={renderedChecks} /></div></details>;
  const label = labels[node.type] ?? node.type.replaceAll("-", " ");
  return <section className={`limits-node limits-node-${node.type}`} {...(node.answerNumber ? { "data-answer-number": node.answerNumber } : {})}><header><span>{node.answerNumber ? `Answer ${node.answerNumber}` : label}</span>{node.title && <h3><RichText value={node.title} /></h3>}</header><div><NodeChildren nodes={node.children ?? []} keyPrefix={keyPrefix} unitId={unitId} routeId={routeId} checks={checks} renderedChecks={renderedChecks} /></div></section>;
}

function TextbookOrientation({ page }: { page: CalculusUnitPublicPage }) {
  const guidance = getCalculusUnitSectionGuidance(page.unit.id, page.page.sectionId);
  return <section className="limits-editorial-intro" aria-labelledby="calculus-section-overview-title">
    <header className="limits-overview-header"><div><p className="eyebrow">Section overview</p><span>{page.page.sectionTitle}</span></div><h2 id="calculus-section-overview-title">What this section is building</h2><p className="limits-overview-lede">{page.route.description}</p></header>
    <aside className="limits-reading-lens" aria-label="Reading lens"><span>Reading lens</span><p>{guidance.lens}</p></aside>
    <div className="limits-overview-guides"><article><span>Notice</span><p>{guidance.mentalModel}</p></article><article><span>Decide</span><p>{guidance.decision}</p></article><article><span>Avoid</span><p>{guidance.commonTrap}</p></article></div>
    <footer className="limits-overview-footer"><div><span>Use this page</span><p>Read the explanation first, predict each next move, and use the checks as feedback on your reasoning—not just your final expression.</p></div><div><span>Check yourself</span><p>{guidance.checkpoint}</p></div></footer>
  </section>;
}

const derivativeDeepDives = [
  ["/subjects/math/calculus/derivatives/derivative-of-x-to-the-x/", "Why x to the x needs logarithmic differentiation"],
  ["/subjects/math/calculus/derivatives/chain-rule/", "The Chain Rule as a structure-reading skill"],
  ["/subjects/math/calculus/derivatives/product-rule-vs-quotient-rule/", "Product Rule or Quotient Rule?"],
  ["/subjects/math/calculus/derivatives/derivatives-of-inverse-trig-functions/", "Inverse-trigonometric derivative patterns"],
];

const integralDeepDives = [
  ["/subjects/math/calculus/integration-techniques/", "Integration techniques: the in-depth article collection"],
  ["/subjects/math/calculus/integration-techniques/u-substitution/", "u-Substitution as a structure-reading method"],
  ["/learn/calculus/integration-by-parts/", "Integration by parts: recognition, setup, and examples"],
  ["/answers/calculus/integral-of-sec-cubed/", "Why the integral of sec³x brings itself back"],
  ["/subjects/math/calculus/integration-techniques/trigonometric-integrals/", "Choosing a trigonometric-integral identity"],
  ["/subjects/math/calculus/integration-techniques/partial-fractions/", "Partial fractions as an integration method"],
  ["/subjects/math/calculus/integration-techniques/improper-integrals/", "Improper integrals and convergence"],
];

const integrationApplicationDeepDives = [
  ["/subjects/math/calculus/integration-applications/horizontal-slices/", "When horizontal slices describe the region more cleanly"],
  ["/subjects/math/calculus/integration-applications/choosing-a-volume-method/", "A decision guide for washers, shells, and known cross-sections"],
  ["/subjects/math/calculus/integration-applications/physics-application-studio/", "A physics studio for mass, work, pumping, and pressure"],
  ["/subjects/math/calculus/integration-applications/common-errors/", "Why plausible integration models fail"],
];

const unitMapProfiles = {
  "calc-1-unit-2a-derivative-foundations-techniques": {
    pathIntro: "Start with meaning, build the differentiation toolkit in sequence, and use reviews to make rule selection independent of page labels.",
    teachesTitle: "Turn local change into a dependable derivative toolkit.",
    teaches: "Connect limits, tangent slopes, formulas, graphs, tables, and units; then differentiate powers, products, quotients, special functions, compositions, implicit equations, inverses, and variable exponents.",
    prerequisitesTitle: "Algebra, functions, and Unit 1 limits.",
    prerequisites: "You should be comfortable with factoring, exponents, function notation, slopes, and finite limits. Use the diagnostic when you are unsure.",
    focus: "one derivative pattern, proof idea, or decision",
  },
  "calc-1-unit-2b-derivative-applications": {
    pathIntro: "Begin with interpretation, move through approximation and modeling, and finish by defending conclusions with units, domains, assumptions, and reasonableness checks.",
    teachesTitle: "Turn derivatives into explanations, estimates, and decisions.",
    teaches: "Interpret motion and sensitivity; build linear and Newton approximations; connect related quantities; analyze complete graphs; optimize feasible designs; evaluate indeterminate limits; and test models against their assumptions.",
    prerequisitesTitle: "Unit 2A derivative foundations and fluent algebra.",
    prerequisites: "You should be able to compute common derivatives, solve equations, read graphs, and track units. Use the bridge diagnostic and linked Unit 2A refreshers when a calculation skill needs repair.",
    focus: "one modeling choice, theorem, or interpretation",
  },
  "calc-1-unit-3a-integral-foundations-techniques": {
    pathIntro: "Begin with antiderivatives and accumulated change, build the definite integral from sums, connect both parts of the Fundamental Theorem, and choose integration methods from structure before finishing with numerical and improper integrals.",
    teachesTitle: "Turn local contributions into exact and approximate accumulated totals.",
    teaches: "Recover functions from derivatives; construct signed totals from rates and areas; use Riemann sums and the Fundamental Theorem; choose substitution, parts, trigonometric, and partial-fraction methods; and justify numerical or improper results.",
    prerequisitesTitle: "Units 2A and 2B derivative fluency, algebra, and trigonometry.",
    prerequisites: "You should recognize common derivatives, manipulate functions and fractions, use identities, read graphs and tables, and keep units attached to rates. Return to the derivative maps whenever verification exposes a gap.",
    focus: "one integration method, famous integral, or conceptual distinction",
  },
  "calc-1-unit-3b-integration-applications": {
    pathIntro: "Begin with one-dimensional area, build three-dimensional volume from slices and rotations, then carry the same contribution-times-width architecture into length, mass, work, fluids, economics, and probability.",
    teachesTitle: "Turn integrals into geometric, physical, and quantitative models.",
    teaches: "Choose vertical or horizontal slices; model areas, solids, arc and surface length, density and balance, variable-force work, pumping, hydrostatic force, marginal totals, and probability; then defend each setup with units and geometry.",
    prerequisitesTitle: "Unit 3A integration foundations and a dependable derivative toolkit.",
    prerequisites: "You should interpret definite integrals, find antiderivatives, use substitution when needed, solve intersections, sketch basic curves, and track units. Every Unit 3B page links back to Unit 3A when technique—not modeling—is the obstacle.",
    focus: "one modeling choice, slice geometry, or real-world interpretation",
  },
} as const;

function UnitMap({ page }: { page: CalculusUnitPublicPage }) {
  const applicationsUnit = page.unit.id === "calc-1-unit-2b-derivative-applications";
  const integralFoundationsUnit = page.unit.id === "calc-1-unit-3a-integral-foundations-techniques";
  const integrationApplicationsUnit = page.unit.id === "calc-1-unit-3b-integration-applications";
  const profile = unitMapProfiles[page.unit.id as keyof typeof unitMapProfiles] ?? unitMapProfiles["calc-1-unit-2a-derivative-foundations-techniques"];
  const unitRoutes = getCalculusUnitCollection(page.route.unitId)?.routes ?? [];
  const core = unitRoutes.filter((route) => route.isCore).sort((a, b) => (a.coreSequenceIndex ?? 0) - (b.coreSequenceIndex ?? 0));
  const sections = [...new Map(core.map((route) => [route.sectionId, { id: route.sectionId, title: route.sectionTitle }])).values()];
  const assessments = unitRoutes.filter((route) => ["diagnostic", "review", "quiz", "practice", "exam", "reference"].includes(route.pageType));
  const answerKeys = unitRoutes.filter((route) => route.pageType === "answer-key");
  const explorations = unitRoutes.filter((route) => route.pageType === "exploration");
  const focusedArticles = integralFoundationsUnit ? integralDeepDives : integrationApplicationsUnit ? integrationApplicationDeepDives : applicationsUnit ? [] : derivativeDeepDives;
  return <section className="limits-unit-map calculus-unit-map" aria-label={`${page.unit.shortTitle} textbook map`}>
    <header className="limits-map-intro"><div><p className="eyebrow">Core textbook</p><h2>The complete Unit {page.unit.code} path</h2></div><p>{profile.pathIntro}</p></header>
    <section className="calculus-prerequisites"><div><p className="eyebrow">What this unit teaches</p><h3>{profile.teachesTitle}</h3><p>{profile.teaches}</p></div><div><p className="eyebrow">Prerequisites</p><h3>{profile.prerequisitesTitle}</h3><p>{profile.prerequisites}</p></div></section>
    <div className="limits-chapter-map">{sections.map((section) => { const guidance = getCalculusUnitSectionGuidance(page.unit.id, section.id); return <section className="limits-chapter" id={`unit-${section.id}`} key={section.id}><header><div><span>Section</span><h3>{section.title}</h3></div><p>{guidance.lens}</p></header><aside className="limits-reading-lens limits-map-lens" aria-label={`${section.title} reading lens`}><span>Reading lens</span><p>{guidance.mentalModel}</p></aside><ol>{core.filter((route) => route.sectionId === section.id).map((route) => <li key={route.path}><a href={route.path}><span>{String(route.coreSequenceIndex).padStart(2, "0")}</span><b>{route.title}</b><small>{labels[route.pageType] ?? route.pageType.replaceAll("-", " ")}</small></a></li>)}</ol></section>; })}</div>
    <header className="limits-map-intro limits-map-support-heading"><div><p className="eyebrow">Practice around the path</p><h2>Reviews, quizzes, diagnostics, and exams</h2></div><p>Use these after a section or whenever a worked example reveals a specific gap. The answer keys are separated so an honest first attempt stays easy.</p></header>
    <div className="limits-support-grid">{assessments.map((route) => <a href={route.path} key={route.path}><span>{route.pageType.replaceAll("-", " ")}</span><b>{route.title}</b><small>{route.description}</small></a>)}</div>
    <section className="limits-answer-key-map" aria-labelledby="calculus-answer-key-heading"><div><p className="eyebrow">Check your work</p><h2 id="calculus-answer-key-heading">Published exam answer keys</h2><p>Every exam has a separately routed, numbered key. Finish the exam first, then compare one item at a time.</p></div><div>{answerKeys.map((route) => <a href={route.path} key={route.path}><span>Complete key</span><b>{route.title}</b><small>{route.description}</small><strong>Open answer key →</strong></a>)}</div></section>
    <header className="limits-map-intro limits-map-support-heading"><div><p className="eyebrow">Go deeper</p><h2>Focused integral explorations</h2></div><p>These articles zoom in on {profile.focus}. They are enrichment around the textbook path, not a replacement for it.</p></header>
    <div className="limits-support-grid">{explorations.map((route) => <a href={route.path} key={route.path}><span>Advanced exploration</span><b>{route.title}</b><small>{route.description}</small></a>)}{focusedArticles.map(([href, title]) => <a href={href} key={href}><span>Focused article</span><b>{title}</b><small>A concise in-depth exploration connected to the main unit.</small></a>)}</div>
    {applicationsUnit ? <section className="limits-exam-key-callout"><div><p className="eyebrow">Finish the derivative sequence</p><h2>Connect applications back to derivative foundations</h2><p>Use Unit 2A whenever an application reveals a differentiation gap, then return here and complete the model with units, assumptions, interpretation, and a reasonableness check.</p></div><a className="button button-ink" href={UNIT_2A_ROOT}>Review Unit 2A foundations →</a></section> : integralFoundationsUnit ? <section className="limits-exam-key-callout"><div><p className="eyebrow">Continue the integral story</p><h2>Unit 3B: Applications of Integration</h2><p>Carry accumulated contributions into area, volume, length, mass, work, fluid force, marginal quantities, and probability in the complete published applications unit.</p></div><a className="button button-ink" href={UNIT_3B_ROOT}>Continue to Unit 3B →</a></section> : integrationApplicationsUnit ? <section className="limits-exam-key-callout"><div><p className="eyebrow">Repair the integration toolkit</p><h2>Return easily to Unit 3A foundations</h2><p>When the model is clear but the antiderivative or numerical method is not, review the matching Unit 3A technique, then return here to finish the setup, units, and interpretation.</p></div><a className="button button-ink" href={UNIT_3A_ROOT}>Review Unit 3A foundations →</a></section> : <section className="limits-exam-key-callout"><div><p className="eyebrow">Next in the textbook</p><h2>Unit 2B: Applications of Derivatives</h2><p>Put derivative calculations to work in motion, approximation, related rates, curve analysis, optimization, indeterminate limits, and applied modeling.</p></div><a className="button button-ink" href={UNIT_2B_ROOT}>Continue to Unit 2B →</a></section>}
  </section>;
}

function CourseNavigation({ page }: { page: CalculusUnitPublicPage }) {
  return <nav className="limits-sequence" aria-label={`${page.unit.shortTitle} sequence`}>{page.previous ? <a href={page.previous.path}><small>← Previous</small><b>{page.previous.title}</b></a> : <span />}{page.next ? <a href={page.next.path}><small>Next →</small><b>{page.next.title}</b></a> : <a href={page.unit.root}><small>Unit overview →</small><b>{page.unit.shortTitle}</b></a>}</nav>;
}

export function CalculusUnitPageContent({ page }: { page: CalculusUnitPublicPage }) {
  const checks = new Map(page.checks.map((check) => [check.id, check]));
  const renderedChecks = new Set<string>();
  const embeddedCheckIds = collectEmbeddedCheckIds(page.page.nodes);
  const answerKey = page.related.find((route) => route.pageType === "answer-key");
  const currentUnit = page.unit.code === "2B" ? "2B" : page.unit.code === "3A" ? "3A" : page.unit.code === "3B" ? "3B" : "2A";
  const companion = currentUnit === "2A"
    ? { root: UNIT_2B_ROOT, label: "Continue to Unit 2B →" }
    : currentUnit === "2B"
      ? { root: UNIT_2A_ROOT, label: "Review Unit 2A foundations →" }
      : currentUnit === "3A"
        ? { root: UNIT_3B_ROOT, label: "Continue to Unit 3B applications →" }
        : { root: UNIT_3A_ROOT, label: "Review Unit 3A foundations →" };
  const integralUnit = currentUnit.startsWith("3");
  const routeUrl = `https://bettergrades.net${page.route.path}`;
  const courseUrl = `https://bettergrades.net${page.unit.root}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": page.route.pageType === "quiz" || page.route.pageType === "exam" ? "Quiz" : "LearningResource", "@id": `${routeUrl}#learning-resource`, name: page.route.title, description: page.route.description, url: routeUrl, educationalLevel: "Calculus I", learningResourceType: labels[page.route.pageType] ?? page.route.pageType.replaceAll("-", " "), about: [`Calculus Unit ${page.unit.code}`, page.unit.shortTitle, integralUnit ? "integrals" : "derivatives"], isPartOf: { "@type": "Course", "@id": `${courseUrl}#course`, name: page.unit.title, courseCode: `Calculus I Unit ${page.unit.code}`, url: courseUrl, provider: { "@id": "https://bettergrades.net/#organization" } } },
    { "@type": "BreadcrumbList", "@id": `${routeUrl}#breadcrumbs`, itemListElement: page.route.breadcrumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: `https://bettergrades.net${crumb.path}` })) },
  ] };
  return <article className="limits-unit-page calculus-unit-page" data-page-type={page.route.pageType} data-unit-id={page.unit.id}>
    <header className="limits-unit-hero section-pad"><nav className="breadcrumbs">{page.route.breadcrumbs.map((crumb, index) => <span key={`${crumb.path}-${index}`}>{index > 0 && <i>/</i>}<a href={crumb.path}>{crumb.name}</a></span>)}</nav><CalculusUnitNavigation currentUnit={currentUnit} /><p className="eyebrow">Calculus I · Unit {page.unit.code} · {labels[page.route.pageType] ?? page.route.pageType.replaceAll("-", " ")}</p><h1>{page.route.title}</h1><p>{page.route.description}</p><div className="limits-progress"><strong>{page.route.isCore ? "Core textbook path" : "Supporting resource"}</strong><span>{page.route.isCore ? "Follow the sequence or choose a destination from the unit map." : "Use this page when the main sequence reveals a specific gap or question."}</span>{page.route.pageType !== "hub" && <a href={page.unit.root}>Open the Unit {page.unit.code} map →</a>}</div></header>
    <div className="limits-unit-layout section-pad"><aside><strong>On this page</strong><span>Explanation and interactive practice</span>{answerKey && <a className="limits-key-aside" href={answerKey.path}>Exam answer key →</a>}<a href={page.unit.root}>Unit {page.unit.code} map →</a><a className="limits-unit-topic-link" href={companion.root}>{companion.label}</a><a href="/practice/math/calculus/">Calculus practice →</a></aside><div className="limits-unit-content">
      {page.route.pageType === "hub" ? <UnitMap page={page} /> : <TextbookOrientation page={page} />}
      {page.route.pageType === "practice" && <section className="limits-node limits-node-method calculus-practice-method"><header><span>Practice method</span><h2>Work in three passes</h2></header><div><p><strong>First, classify.</strong> Name the {integralUnit ? "integral output and structural method" : "derivative idea or rule"} before writing algebra. This separates a recognition error from a calculation error.</p><p><strong>Second, solve without the key.</strong> Record a complete attempt, including bounds, constants, domains, units, or interpretation when the prompt asks for them.</p><p><strong>Third, reveal one answer at a time.</strong> Compare the first line where your work differs, close the answer, and redo that item from a blank start.</p></div></section>}
      {page.route.pageType === "exam" && answerKey && <section className="limits-exam-key-callout"><div><p className="eyebrow">Answer key published</p><h2>Finish first. Then check every answer.</h2><p>The complete numbered key is online as its own easy-to-find route.</p></div><a className="button button-ink" href={answerKey.path}>View the complete answer key →</a></section>}
      <NodeChildren nodes={page.page.nodes} keyPrefix={page.route.id} unitId={page.unit.id} routeId={page.route.id} checks={checks} renderedChecks={renderedChecks} />
      {page.assessmentSet && <section className="calculus-assessment-set"><header><p className="eyebrow">Structured concept quiz</p><h2>{page.assessmentSet.title}</h2><p>Write a response before revealing the model. These conceptual items use an honest attempt-and-reveal rubric rather than pretending an open response has one machine-provable wording.</p></header>{page.assessmentSet.items.map((item) => <InteractiveProblem key={item.id} problem={{ id: item.id, unitId: page.unit.id, pageSlug: page.route.slug, promptLatex: item.promptLatex, answerType: item.answerType, choices: [], hints: [], difficulty: "conceptual", topics: [], skills: [], attemptRequiredBeforeReveal: true }} />)}</section>}
      {[...checks.values()].filter((check) => !embeddedCheckIds.has(check.id)).map((check) => <InteractiveProblem problem={check} key={check.id} />)}
      {page.related.length > 0 && <section className="limits-related"><p className="eyebrow">Keep working</p><h2>Related resources</h2>{page.related.map((route) => <a href={route.path} key={route.path}><span>{route.pageType.replaceAll("-", " ")}</span><b>{route.title}</b></a>)}</section>}
      <section className="limits-rights"><p className="eyebrow">Source &amp; rights</p><h2>Original instruction with traceable references.</h2><p>{page.page.compositionStatus}</p><p>Reference textbooks remain rights-separated and are not published as application assets. Any direct adaptation requires separate identification and attribution.</p></section>
    </div></div>
    <CourseNavigation page={page} />
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </article>;
}
