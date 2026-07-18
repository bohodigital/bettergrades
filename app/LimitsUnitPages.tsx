"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- canonical course navigation uses document navigation */

import { FormEvent, ReactNode, useState } from "react";
import { getLimitsUnitChapter, limitsUnitChapters, limitsUnitRoutes } from "../lib/calculus/limits-unit-index.mjs";
import type { LimitsUnitNode, LimitsUnitPublicCheck, LimitsUnitPublicPage } from "../lib/calculus/limits-unit.mjs";
import { BetterGradesVisual } from "./BetterGradesVisual";
import { LimitsUnitMap } from "./LimitsUnitMap";
import { Math } from "./Math";

const labels: Record<string, string> = {
  concept: "Concept", definition: "Definition", method: "Method", theorem: "Theorem",
  "worked-example": "Worked example", "guided-walkthrough": "Guided walkthrough",
  exercise: "Exercise", problem: "Problem", "quick-check": "Quick check",
  "common-mistake": "Common mistake", "exam-note": "Exam note", summary: "Summary", source: "Source note", table: "Reference table",
  "answer-key": "Answer key",
};

function cleanText(value: string) {
  return value.replace(/^\[(?:title=\{[^}]*\}|[^\]]*)\]\s*/, "")
    .replace(/\\texorpdfstring\{(\\\([\s\S]*?\\\))\}\{[^}]*\}/g, "$1")
    .replace(/\\chapter\*?\{([^}]*)\}/g, "$1").replace(/\\step\{\d+\}\{([^}]*)\}/g, "$1")
    .replace(/\\(?:textbf|emph|textit)\{([^}]*)\}/g, "$1")
    .replace(/\\item(?:\[([^\]]+)\])?/g, (_, label: string | undefined) => label ? ` • ${label} ` : " • ")
    .replace(/``|''/g, '"').replace(/~/g, " ").replace(/\\(?:centering|newpage|clearpage)\b/g, "")
    .replace(/\\(?:cref|Cref|ref|eqref|pageref)\{[^}]*\}/g, "the referenced section")
    .replace(/\\label\{[^}]*\}/g, "")
    .replace(/\bChapters\b/g, "Sections").replace(/\bChapter\b/g, "Section")
    .replace(/\bchapters\b/g, "sections").replace(/\bchapter\b/g, "section")
    .replace(/\s+/g, " ").trim();
}

function normalizeWebTex(value: string) {
  return value.replace(/\\eps(?=[^A-Za-z]|$)/g, String.raw`\varepsilon`).replace(/\\DNE(?=[^A-Za-z]|$)/g, String.raw`\mathrm{DNE}`);
}

const supportedDisplayEnvironments = new Set(["aligned", "array", "cases", "gathered"]);

function safeDisplayTex(tex: string) {
  tex = normalizeWebTex(tex);
  tex = tex.replace(/\\begin\{align\*?\}/g, "\\begin{aligned}").replace(/\\end\{align\*?\}/g, "\\end{aligned}");
  const environment = tex.match(/\\begin\{([^}]+)\}/)?.[1];
  if (environment && !supportedDisplayEnvironments.has(environment)) return null;
  return tex.replace(/\\hline/g, "").trim();
}

function RichText({ value }: { value: string }) {
  const pieces: ReactNode[] = [], cleaned = cleanText(value), expression = /\\\((.+?)\\\)/gs;
  let cursor = 0;
  for (const match of cleaned.matchAll(expression)) {
    const start = match.index ?? 0;
    if (start > cursor) pieces.push(cleaned.slice(cursor, start));
    pieces.push(<Math tex={normalizeWebTex(match[1])} key={`${start}-${match[1]}`} />);
    cursor = start + match[0].length;
  }
  if (cursor < cleaned.length) pieces.push(cleaned.slice(cursor));
  return <>{pieces}</>;
}

function NodeChildren({ nodes, keyPrefix, checks, renderedCheckIds, exerciseAnswers }: { nodes: LimitsUnitNode[]; keyPrefix: string; checks: Map<string, LimitsUnitPublicCheck>; renderedCheckIds: Set<string>; exerciseAnswers: LimitsUnitPublicPage["exerciseAnswers"] }) {
  return <>{nodes.map((node, index) => <SemanticNode node={node} key={`${keyPrefix}-${index}`} keyPrefix={`${keyPrefix}-${index}`} checks={checks} renderedCheckIds={renderedCheckIds} exerciseAnswers={exerciseAnswers} />)}</>;
}

function SemanticNode({ node, keyPrefix, checks, renderedCheckIds, exerciseAnswers }: { node: LimitsUnitNode; keyPrefix: string; checks: Map<string, LimitsUnitPublicCheck>; renderedCheckIds: Set<string>; exerciseAnswers: LimitsUnitPublicPage["exerciseAnswers"] }) {
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
    return tex ? <Math tex={tex} display className="limits-equation" /> : <p className="limits-render-note">This structured mathematical display is available in the printable edition.</p>;
  }
  if (node.type === "table") return <div className="limits-table-wrap"><table><caption className="sr-only">Reference table</caption><tbody>{(node.rows ?? []).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => rowIndex === 0 ? <th scope="col" key={cellIndex}><RichText value={cell} /></th> : <td key={cellIndex}><RichText value={cell} /></td>)}</tr>)}</tbody></table></div>;
  if (node.type === "graph-specification") return <figure className={`limits-graph${node.graphId ? " limits-graph-visual" : " limits-graph-note"}`}>
    {node.graphId ? node.visual
      ? <BetterGradesVisual visual={node.visual} />
      : <p role="alert">This graph could not be loaded. Its complete reading guide remains below.</p>
      : null}
    <figcaption><strong>{node.title ? <RichText value={node.title} /> : "Graph reading guide"}</strong>{node.text && <p><RichText value={node.text} /></p>}{node.children?.length ? <div className="limits-graph-exposition"><NodeChildren nodes={node.children} keyPrefix={keyPrefix} checks={checks} renderedCheckIds={renderedCheckIds} exerciseAnswers={exerciseAnswers} /></div> : null}</figcaption>
  </figure>;
  if (node.type === "quick-check") {
    const check = node.checkId ? checks.get(node.checkId) : undefined;
    if (!check) return <section className="limits-node limits-node-quick-check"><header><span>Quick check</span></header><div><NodeChildren nodes={node.children ?? []} keyPrefix={keyPrefix} checks={checks} renderedCheckIds={renderedCheckIds} exerciseAnswers={exerciseAnswers} /></div></section>;
    if (renderedCheckIds.has(check.id)) return null;
    renderedCheckIds.add(check.id);
    return <InteractiveCheck check={check} />;
  }
  if (node.type === "hint" || node.type === "solution") return <details className={`limits-disclosure limits-${node.type}`}><summary>{node.type === "hint" ? "Show hint" : "Show worked solution"}</summary><div><NodeChildren nodes={node.children ?? []} keyPrefix={keyPrefix} checks={checks} renderedCheckIds={renderedCheckIds} exerciseAnswers={exerciseAnswers} /></div></details>;
  const label = labels[node.type] ?? node.type.replaceAll("-", " ");
  const exerciseNumber = node.exerciseNumber;
  const answer = exerciseNumber ? exerciseAnswers?.answers[exerciseNumber - 1] : undefined;
  return <section className={`limits-node limits-node-${node.type}`} {...(exerciseNumber ? { "data-exercise-number": exerciseNumber } : {})}><header><span>{exerciseNumber ? `${label} ${exerciseNumber}` : label}</span>{node.title && <h3><RichText value={node.title} /></h3>}</header><div>
    <NodeChildren nodes={node.children ?? []} keyPrefix={keyPrefix} checks={checks} renderedCheckIds={renderedCheckIds} exerciseAnswers={exerciseAnswers} />
    {answer && <details className="limits-exercise-answer"><summary>Show answer</summary><div><p><RichText value={answer.content} /></p><small>Answer {answer.number} from the source-traced unit appendix.</small></div></details>}
  </div></section>;
}

function InteractiveCheck({ check }: { check: LimitsUnitPublicCheck }) {
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

const orientationExcludedTypes = new Set(["answer-key", "hub"]);

const pageModeGuidance: Record<string, string> = {
  diagnostic: "Answer from memory first, then use each reveal to decide exactly which prerequisite deserves a short review.",
  exam: "Complete a timed first pass without reveals. On correction, open one answer at a time and name the first line where your reasoning changed course.",
  extension: "Follow the central idea before collecting techniques; the point is to deepen the model, not merely add another formula.",
  lesson: "Read the explanation, predict the next move in each example, and then compare your prediction with the written reasoning.",
  practice: "Work in short groups, commit to a complete answer, and use the reveal as feedback rather than as the first step.",
  quiz: "Commit to each response before opening support, then return to the exact lesson if the explanation exposes a concept gap.",
  reference: "Use this page to organize ideas you have already met, and turn each entry into a question you can answer without looking.",
  review: "Diagnose the method before calculating; mixed review is valuable because the section label no longer tells you what to do.",
  study: "Translate the advice into a concrete routine you can repeat on your own work, not a checklist you merely read once.",
};

const supportSectionIds: Record<string, string> = {
  meaning: "meaning",
  finite: "finite",
  trig: "trigonometric",
  infinite: "infinite",
  continuity: "continuity",
  epsilon: "formal",
};

function sectionForPage(page: LimitsUnitPublicPage) {
  if (page.route.coreSequenceIndex) return getLimitsUnitChapter(page.route.coreSequenceIndex);
  const supportSectionId = page.route.supportCluster ? supportSectionIds[page.route.supportCluster] : undefined;
  if (supportSectionId) return limitsUnitChapters.find(({ id }) => id === supportSectionId);
  if (page.route.sourceSlug === "calculus/limits/formal-infinite-limits") return limitsUnitChapters.find(({ id }) => id === "infinite");
  if (/common-exam-errors|correct-practice-test|cumulative-practice|practice-exam-[ab]$/.test(page.route.sourceSlug)) {
    return limitsUnitChapters.find(({ id }) => id === "synthesis");
  }
  return getLimitsUnitChapter(page.returnRoute?.coreSequenceIndex);
}

function TextbookOrientation({ page }: { page: LimitsUnitPublicPage }) {
  if (orientationExcludedTypes.has(page.route.pageType)) return null;
  const section = sectionForPage(page);
  if (!section) return null;
  const previous = page.previous?.h1;
  const next = page.next?.h1;
  const modeGuidance = pageModeGuidance[page.route.pageType] ?? pageModeGuidance.lesson;
  return <section className="limits-editorial-intro" aria-labelledby="limits-section-overview-title">
    <header className="limits-overview-header">
      <div><p className="eyebrow">Section overview</p><span>{section.from === section.to ? `Core page ${section.from}` : `Core pages ${section.from}-${section.to}`}</span></div>
      <h2 id="limits-section-overview-title">{section.title}</h2>
      <p className="limits-overview-lede">{section.description}</p>
    </header>
    <aside className="limits-reading-lens" aria-label="Reading lens">
      <span>Reading lens</span>
      <p>{section.lens}</p>
    </aside>
    <div className="limits-overview-guides">
      <article><span>Notice</span><p>{section.mentalModel}</p></article>
      <article><span>Decide</span><p>{section.decision}</p></article>
      <article><span>Avoid</span><p>{section.commonTrap}</p></article>
    </div>
    <footer className="limits-overview-footer">
      <div><span>Use this page</span><p>{modeGuidance}</p></div>
      <div><span>Check yourself</span><p>{section.checkpoint}</p></div>
      <p className="limits-overview-connection">{previous && next ? <>This page connects <strong>{previous}</strong> to <strong>{next}</strong>, so keep both the incoming idea and the next decision in view.</> : <>Use <strong>{page.route.h1}</strong> to connect the section&apos;s central idea to notation, graphs, and a defensible next move.</>}</p>
    </footer>
  </section>;
}

function CompanionVisuals({ page }: { page: LimitsUnitPublicPage }) {
  if (!page.companionVisuals.length) return null;
  return <section className="limits-visual-study" aria-labelledby="limits-visual-study-title">
    <header><p className="eyebrow">Visual study stop</p><h2 id="limits-visual-study-title">Read the picture before the symbols</h2><p>Pause at each graph long enough to say what the input is doing, what the output is doing, and which feature supports the next mathematical decision.</p></header>
    <div>{page.companionVisuals.map(({ id, heading, explanation, visual }) => <figure className="limits-graph limits-graph-visual limits-companion-visual" key={id}>
      <BetterGradesVisual visual={visual} />
      <figcaption><strong>{heading}</strong><p>{explanation}</p></figcaption>
    </figure>)}</div>
  </section>;
}

function ExamAnswerKey({ page }: { page: LimitsUnitPublicPage }) {
  if (!page.answerKey) return null;
  return <section className="limits-answer-key" aria-labelledby="limits-answer-key-title">
    <header><p className="eyebrow">Complete published key</p><h2 id="limits-answer-key-title">Practice Exam {page.answerKey.exam} answers</h2><p>Use the numbering from the exam. If your answer differs, identify the method or condition you missed before moving to the next item.</p></header>
    <ol>{page.answerKey.answers.map((answer) => <li id={`${page.answerKey?.exam.toLowerCase()}${answer.number}`} data-answer-number={`${page.answerKey?.exam}${answer.number}`} key={answer.number}><strong>{page.answerKey?.exam}{answer.number}</strong><p><RichText value={answer.content} /></p></li>)}</ol>
    <footer><strong>Source trace</strong><span>{page.answerKey.sourceFile}</span><code>{page.answerKey.sourceSha256}</code></footer>
  </section>;
}

function CourseNavigation({ page }: { page: LimitsUnitPublicPage }) {
  return <nav className="limits-sequence" aria-label="Limits and Continuity sequence">
    {page.previous ? <a href={page.previous.path}><small>← Previous in the textbook</small><b>{page.previous.h1}</b></a> : <span />}
    {page.next ? <a href={page.next.path}><small>Next in the textbook →</small><b>{page.next.h1}</b></a> : page.returnRoute && page.returnRoute.path !== page.route.path ? <a href={page.returnRoute.path}><small>Return to sequence →</small><b>{page.returnRoute.h1}</b></a> : <a href={limitsUnitRoutes[0].path}><small>Unit overview →</small><b>Limits and Continuity</b></a>}
  </nav>;
}

export function LimitsUnitPageContent({ page }: { page: LimitsUnitPublicPage }) {
  const { route } = page;
  const checks = new Map(page.checks.map((check) => [check.id, check]));
  const renderedCheckIds = new Set<string>();
  const answerKeyRoute = page.related.find((related) => related.pageType === "answer-key");
  const schema = { "@context": "https://schema.org", "@type": route.pageType === "quiz" || route.pageType === "exam" ? "Quiz" : "LearningResource", name: route.h1, description: route.description, url: `https://bettergrades.net${route.path}`, isPartOf: { "@type": "Course", name: "Calculus I: Limits and Continuity" } };
  return <article className="limits-unit-page" data-page-type={route.pageType}>
    <header className="limits-unit-hero section-pad">
      <nav className="breadcrumbs"><a href="/subjects/">Subjects</a><span>/</span><a href="/subjects/math/">Mathematics</a><span>/</span><a href="/subjects/math/calculus/">Calculus</a><span>/</span><a href="/subjects/math/calculus/limits-continuity/">Limits &amp; Continuity</a><span>/</span><span>{route.h1}</span></nav>
      <p className="eyebrow">Calculus I · Limits and Continuity · {labels[route.pageType] ?? route.pageType}</p>
      <h1>{route.h1}</h1><p>{route.description}</p>
      <div className="limits-progress"><strong>{route.isCoreSequence ? "Core textbook path" : "Supporting resource"}</strong><span>{route.isCoreSequence ? "Follow the sequence or choose a destination from the main unit map." : "Use this page when the main sequence reveals a specific question or skill gap."}</span>{route.pageType !== "hub" && <a href={page.returnRoute?.path ?? limitsUnitRoutes[0].path}>Return to the core path →</a>}</div>
    </header>
    <div className="limits-unit-layout section-pad"><aside><strong>On this page</strong><span>Explanation and interactive practice</span>{page.exerciseAnswers && <span>Attempt-gated answer reveals</span>}{answerKeyRoute && <a className="limits-key-aside" href={answerKeyRoute.path}>Exam answer key →</a>}<a href="/subjects/math/calculus/limits-continuity/">Main unit map →</a><a href={limitsUnitRoutes[0].path}>Full unit overview →</a><a href="/practice/math/calculus/">Calculus practice →</a></aside><div className="limits-unit-content">
      {route.pageType === "hub" ? <LimitsUnitMap /> : <TextbookOrientation page={page} />}
      <CompanionVisuals page={page} />
      {route.pageType === "exam" && answerKeyRoute && <section className="limits-exam-key-callout"><div><p className="eyebrow">Answer key published</p><h2>Finish first. Then check every answer.</h2><p>The complete key is online, numbered to match this exam, and linked to the verified source appendix.</p></div><a className="button button-ink" href={answerKeyRoute.path}>View the complete answer key →</a></section>}
      <NodeChildren nodes={page.page.nodes} keyPrefix={route.sourceSlug} checks={checks} renderedCheckIds={renderedCheckIds} exerciseAnswers={page.exerciseAnswers} />
      <ExamAnswerKey page={page} />
      {page.related.length > 0 && <section className="limits-related"><p className="eyebrow">Keep working</p><h2>Related resources</h2>{page.related.map((related) => <a href={related.path} key={related.path}><span>{labels[related.pageType] ?? related.pageType}</span><b>{related.h1}</b></a>)}</section>}
      <section className="limits-rights"><p className="eyebrow">Source &amp; rights</p><h2>Original instruction with traceable references.</h2><p>{page.provenanceNote}</p><p>The verified handoff declares original composition and requires owner provenance review. BetterGrades-original material remains separate from public-domain references; no source textbook PDF is published here.</p></section>
    </div></div>
    <CourseNavigation page={page} />
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </article>;
}
