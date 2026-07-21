/* eslint-disable @next/next/no-img-element -- immutable BVLP SVGs are the no-script fallback assets */

import katex from "katex";
import Link from "next/link";
import type { ReactNode } from "react";

type UnknownRecord = Record<string, unknown>;

const blockLabels: Record<string, string> = {
  "advanced-note": "Optional advanced note",
  application: "Application",
  "answer-key-item": "Answer",
  bridge: "Bridge",
  checkpoint: "Checkpoint",
  "common-mistake": "Common mistake",
  concept: "Concept",
  decision: "Decision",
  definition: "Definition",
  "exam-note": "Exam note",
  exercise: "Exercise",
  exposition: "Explanation",
  "guided-walkthrough": "Guided walkthrough",
  hint: "Hint",
  method: "Method",
  "modeling-lab": "Modeling lab",
  problem: "Problem",
  "proof-idea": "Proof idea",
  "quick-check": "Quick check",
  source: "Source note",
  summary: "Summary",
  theorem: "Theorem",
  translation: "In ordinary language",
  "visual-reading": "How to read the visual",
  "worked-example": "Worked example",
};

function asRecord(value: unknown): UnknownRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : undefined;
}

function records(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.map(asRecord).filter((item): item is UnknownRecord => Boolean(item)) : [];
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function cleanText(value: string): string {
  return value
    .replace(/^\[(?:title=\{[^}]*\}|[^\]]*)\]\s*/, "")
    .replace(/\\texorpdfstring\{(\\\([\s\S]*?\\\))\}\{[^}]*\}/g, "$1")
    .replace(/\\(?:chapter|section|subsection)\*?\{([^}]*)\}/g, "$1")
    .replace(/\\step\{\d+\}\{([^}]*)\}/g, "$1")
    .replace(/\\(?:textbf|emph|textit|small)\{([^}]*)\}/g, "$1")
    .replace(/\\begin\{(?:enumerate|itemize|description)\}(?:\[[^\]]*\])?/g, " ")
    .replace(/\\end\{(?:enumerate|itemize|description)\}/g, " ")
    .replace(/\\item(?:\[([^\]]+)\])?/g, (_, label: string | undefined) => label ? ` - ${label} ` : " - ")
    .replace(/``|''/g, '"')
    .replace(/~/g, " ")
    .replace(/\\(?:centering|newpage|clearpage)\b/g, "")
    .replace(/\\(?:cref|Cref|ref|eqref|pageref)\{[^}]*\}/g, "the referenced section")
    .replace(/\\label\{[^}]*\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTex(value: string): string {
  return value
    .replace(/^\$|\$$/g, "")
    .replace(/\\eps(?=[^A-Za-z]|$)/g, String.raw`\varepsilon`)
    .replace(/\\DNE(?=[^A-Za-z]|$)/g, String.raw`\mathrm{DNE}`)
    .replace(/\\tfrac/g, String.raw`\frac`)
    .replace(/\\begin\{align\*?\}/g, String.raw`\begin{aligned}`)
    .replace(/\\end\{align\*?\}/g, String.raw`\end{aligned}`)
    .replace(/\\hline/g, "")
    .trim();
}

function StaticMath({ value, display = false }: { value: string; display?: boolean }) {
  let rendered: string | undefined;
  try {
    rendered = katex.renderToString(normalizeTex(value), { displayMode: display, throwOnError: true, strict: "error", trust: false });
  } catch {
    rendered = undefined;
  }
  return rendered
    ? <span className={display ? "latex latex-display" : "latex latex-inline"} dangerouslySetInnerHTML={{ __html: rendered }} />
    : <span className="no-script-math-text">{cleanText(value).replace(/\\[A-Za-z]+/g, "").replace(/[{}]/g, "")}</span>;
}

function RichText({ value }: { value: string }) {
  const cleaned = cleanText(value);
  const pieces: ReactNode[] = [];
  const expression = /\\\((.+?)\\\)/gs;
  let cursor = 0;
  for (const match of cleaned.matchAll(expression)) {
    const start = match.index ?? 0;
    if (start > cursor) pieces.push(cleaned.slice(cursor, start));
    pieces.push(<StaticMath value={match[1]} key={`${start}-${match[1]}`} />);
    cursor = start + match[0].length;
  }
  if (cursor < cleaned.length) pieces.push(cleaned.slice(cursor));
  return <>{pieces}</>;
}

function segmentText(value: unknown): string {
  const object = asRecord(value);
  return records(object?.segments).map((segment) => text(segment.text) || text(segment.spokenText)).filter(Boolean).join(" ");
}

function visualFigure(node: UnknownRecord, key: string): ReactNode {
  const visual = asRecord(node.visual);
  const asset = asRecord(visual?.staticAsset);
  const accessibility = asRecord(visual?.accessibility);
  const path = text(asset?.path);
  if (!path) return null;
  const title = text(node.title) || segmentText(visual?.title) || "Mathematical visual";
  const caption = segmentText(visual?.caption) || text(node.text) || title;
  return <figure className="no-script-visual" data-noscript-visual={text(visual?.id) || title} key={key}>
    <img
      src={path}
      width={typeof asset?.width === "number" ? asset.width : 960}
      height={typeof asset?.height === "number" ? asset.height : 558}
      alt={text(accessibility?.ariaLabel) || caption}
    />
    <figcaption><strong><RichText value={title} /></strong><span><RichText value={caption} /></span></figcaption>
    {text(visual?.longDescription) ? <details><summary>Read this visual as text</summary><p>{text(visual?.longDescription)}</p></details> : null}
  </figure>;
}

function StaticNode({ node, keyPath, checks }: { node: UnknownRecord; keyPath: string; checks: Map<string, UnknownRecord> }): ReactNode {
  const type = text(node.type);
  const title = cleanText(text(node.title));
  const children = records(node.children);

  if (type === "paragraph") return <p key={keyPath}><RichText value={text(node.text)} /></p>;
  if (type === "math") return <div className="no-script-equation" key={keyPath}><StaticMath value={text(node.tex)} display /></div>;
  if (type === "heading") {
    const heading = <RichText value={text(node.text)} />;
    return Number(node.level) >= 3 ? <h3 key={keyPath}>{heading}</h3> : <h2 key={keyPath}>{heading}</h2>;
  }
  if (type === "table") {
    const rows = Array.isArray(node.rows) ? node.rows : [];
    return <div className="no-script-table-wrap" key={keyPath}><table><tbody>{rows.map((row, rowIndex) => <tr key={`${keyPath}-r${rowIndex}`}>{(Array.isArray(row) ? row : [row]).map((cell, cellIndex) => <td key={`${keyPath}-r${rowIndex}-c${cellIndex}`}><RichText value={text(cell)} /></td>)}</tr>)}</tbody></table></div>;
  }
  if (type === "visual-reference" || type === "graph-specification") {
    const figure = visualFigure(node, keyPath);
    if (figure) return figure;
    return text(node.text) ? <aside className="no-script-card" key={keyPath}><strong><RichText value={title || "Visual explanation"} /></strong><p><RichText value={text(node.text)} /></p></aside> : null;
  }
  if (type === "quick-check") {
    const check = checks.get(text(node.checkId));
    const prompt = text(check?.promptLatex);
    return <section className="no-script-card no-script-check" key={keyPath}><span>Quick check</span>{prompt ? <p><RichText value={prompt} /></p> : null}<p className="no-script-note">Interactive grading requires JavaScript. Work the problem on paper, then return with scripting enabled to check your answer.</p></section>;
  }
  if (type === "solution-reveal") return <aside className="no-script-card" key={keyPath}><strong><RichText value={title || "Worked solution"} /></strong><p>The complete worked solution is attempt-gated and available when JavaScript is enabled.</p></aside>;

  if (children.length || title) {
    const label = blockLabels[type] || type.replaceAll("-", " ");
    return <section className={`no-script-card no-script-${type || "section"}`} key={keyPath}>
      {label ? <span>{label}</span> : null}
      {title ? <h3><RichText value={title} /></h3> : null}
      {children.map((child, index) => <StaticNode node={child} checks={checks} keyPath={`${keyPath}-${index}`} key={`${keyPath}-${index}`} />)}
    </section>;
  }
  return null;
}

export function NoScriptCalculusFallback({ publicPage }: { publicPage: unknown }) {
  const root = asRecord(publicPage);
  const route = asRecord(root?.route);
  const unit = asRecord(root?.unit);
  const page = asRecord(root?.page);
  if (!root || !route || !page) return null;
  const checks = new Map(records(root.checks).map((check) => [text(check.id), check]));
  const assessment = asRecord(root.assessmentSet);
  const assessmentItems = records(assessment?.items);
  const previous = asRecord(root.previousCore) ?? asRecord(root.previous);
  const next = asRecord(root.nextCore) ?? asRecord(root.next);
  const unitTitle = text(unit?.title) || "Limits and Continuity";
  const routeTitle = text(route.title) || unitTitle;
  const routeDescription = text(route.description);

  return <div className="no-script-calculus" data-noscript-calculus-fallback={text(route.path)}>
    <header className="no-script-header"><Link href="/" className="brand"><span className="brand-mark">≥</span><span>Better Grades</span></Link><span>Static textbook view</span></header>
    <main className="no-script-main">
      <nav aria-label="Breadcrumb"><Link href="/subjects/math/">Mathematics</Link><span>/</span><Link href="/subjects/math/calculus/">Calculus</Link><span>/</span><Link href={text(unit?.root) || "/subjects/math/calculus/limits-continuity/"}>{unitTitle}</Link></nav>
      <p className="eyebrow">Calculus textbook</p>
      <h1>{routeTitle}</h1>
      {routeDescription ? <p className="no-script-lede">{routeDescription}</p> : null}
      <aside className="no-script-status"><strong>JavaScript is off.</strong><span>The complete lesson and static mathematical visuals remain available. Interactive grading and graph controls require JavaScript.</span></aside>
      <article className="no-script-lesson">
        {records(page.nodes).map((node, index) => <StaticNode node={node} checks={checks} keyPath={`node-${index}`} key={`node-${index}`} />)}
        {assessmentItems.length ? <section className="no-script-card"><span>Assessment</span><h2>{text(assessment?.title) || "Practice"}</h2>{assessmentItems.map((item, index) => <div className="no-script-problem" key={text(item.id) || index}><strong>{index + 1}</strong><p><RichText value={text(item.promptLatex)} /></p></div>)}</section> : null}
      </article>
      <nav className="no-script-sequence" aria-label="Lesson sequence">
        {previous ? <Link href={text(previous.path)}>← {text(previous.title) || "Previous"}</Link> : <span />}
        {next ? <Link href={text(next.path)}>{text(next.title) || "Next"} →</Link> : <span />}
      </nav>
    </main>
  </div>;
}
