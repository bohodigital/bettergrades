"use client";

/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- canonical static routes and versioned instructional assets intentionally use document navigation */

import { useEffect, useState, type ReactNode } from "react";
import type { MathGlossaryTerm } from "../lib/glossary/math/registry.mjs";
import type { PublishingResource, ResourceHub, ResourceProblem } from "../lib/resources/catalog.mjs";
import { Math } from "./Math";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
    __bgResourceEvents?: Set<string>;
  }
}

const typeLabels: Record<string, string> = {
  worksheet: "Worksheet",
  "practice-exam": "Practice exam",
  "formula-sheet": "Formula sheet",
  "worked-problem": "Worked problem",
  "visual-guide": "Visual guide",
  "glossary-term": "Glossary term",
};

export type ResourceLinkSummary = Pick<PublishingResource, "id" | "canonicalPath" | "shortTitle">;
export type ResourceCardSummary = Pick<PublishingResource, "id" | "canonicalPath" | "shortTitle" | "summary" | "resourceType" | "difficulty" | "course" | "problemCount" | "estimatedTime">;

const hubLinks = [
  ["/subjects/math/calculus/worksheets/", "Worksheets"],
  ["/subjects/math/calculus/practice-exams/", "Practice Exams"],
  ["/subjects/math/calculus/formula-sheets/", "Formula Sheets"],
  ["/subjects/math/calculus/worked-problems/", "Worked Problems"],
  ["/subjects/math/calculus/visuals/", "Visual Guides"],
] as const;

function eventDimensions(resource: PublishingResource) {
  return {
    resource_id: resource.id,
    resource_type: resource.resourceType,
    course: resource.course,
    unit: resource.unit,
    topic: resource.topics[0] ?? "",
    difficulty: resource.difficulty,
  };
}

function trackResource(event: string, resource: PublishingResource, extra: Record<string, string | number> = {}, onceKey?: string) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  if (onceKey) {
    window.__bgResourceEvents ??= new Set();
    if (window.__bgResourceEvents.has(onceKey)) return;
    window.__bgResourceEvents.add(onceKey);
  }
  const data = { ...eventDimensions(resource), ...extra };
  window.gtag?.("event", event, data);
  window.umami?.track(event, data);
}

export function trackPublishingResourceEvent(event: string, resource: PublishingResource, extra: Record<string, string | number> = {}) {
  trackResource(event, resource, extra);
}

function InlineMathText({ value }: { value: string }) {
  const pieces: ReactNode[] = [];
  const expression = /\\\((.+?)\\\)/gs;
  let cursor = 0;
  for (const match of value.matchAll(expression)) {
    const start = match.index ?? 0;
    if (start > cursor) pieces.push(value.slice(cursor, start));
    pieces.push(<Math tex={match[1]} key={`${start}-${match[1]}`} />);
    cursor = start + match[0].length;
  }
  if (cursor < value.length) pieces.push(value.slice(cursor));
  return <>{pieces}</>;
}

function ResourceAnalytics({ resource }: { resource: PublishingResource }) {
  useEffect(() => {
    trackResource("resource_view", resource, {}, `view:${resource.id}`);
    if (resource.resourceType === "worked-problem") trackResource("worked_solution_open", resource, {}, `worked:${resource.id}`);
  }, [resource]);
  return null;
}

function ResourceSchema({ resource }: { resource: PublishingResource }) {
  const url = `https://bettergrades.net${resource.canonicalPath}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": resource.resourceType === "glossary-term" ? "Article" : "LearningResource",
      "@id": `${url}#resource`,
      name: resource.title,
      description: resource.description,
      url,
      educationalLevel: resource.course,
      learningResourceType: typeLabels[resource.resourceType],
      about: resource.topics,
      dateModified: resource.revisionDate,
      isAccessibleForFree: true,
      provider: { "@id": "https://bettergrades.net/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        [1, "Mathematics", "https://bettergrades.net/subjects/math/"],
        [2, "Calculus", "https://bettergrades.net/subjects/math/calculus/"],
        [3, resource.shortTitle, url],
      ].map(([position, name, item]) => ({ "@type": "ListItem", position, name, item })),
    },
  ];
  if (resource.primaryVisual) graph.push({
    "@type": "ImageObject",
    "@id": `${url}#primary-image`,
    contentUrl: `https://bettergrades.net/visuals/resources/${resource.primaryVisual}.png`,
    encodingFormat: "image/png",
    caption: resource.summary,
    width: 1200,
    height: 805,
  });
  return <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>;
}

function labelForPath(path: string) {
  const segment = path.split("/").filter(Boolean).at(-1) ?? "Calculus";
  return segment.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Breadcrumbs({ resource }: { resource?: PublishingResource }) {
  return (
    <nav className="resource-breadcrumbs" aria-label="Breadcrumb">
      <a href="/subjects/">Subjects</a><span>/</span>
      <a href="/subjects/math/">Mathematics</a><span>/</span>
      <a href="/subjects/math/calculus/">Calculus</a><span>/</span>
      {resource ? <><a href={`/subjects/math/calculus/${resource.resourceType === "worked-problem" ? "worked-problems" : resource.resourceType === "visual-guide" ? "visuals" : resource.resourceType === "practice-exam" ? "practice-exams" : resource.resourceType === "formula-sheet" ? "formula-sheets" : "worksheets"}/`}>{typeLabels[resource.resourceType]}</a><span>/</span><span aria-current="page">{resource.shortTitle}</span></> : <span aria-current="page">Resource library</span>}
    </nav>
  );
}

function RelatedLinks({ resource, relatedResources, enrichedGlossaryTermIds }: { resource: PublishingResource; relatedResources: readonly ResourceLinkSummary[]; enrichedGlossaryTermIds: readonly string[] }) {
  return (
    <section className="resource-related" aria-labelledby="related-learning">
      <h2 id="related-learning">Continue learning</h2>
      <div className="resource-related-grid">
        <div><h3>Lessons and articles</h3><ul>{[...resource.relatedLessons, ...resource.relatedArticles].map((path) => <li key={path}><a href={path} onClick={() => trackResource(resource.resourceType === "glossary-term" ? "glossary_to_lesson_click" : "resource_to_lesson_click", resource, { source_lesson: path })}>{labelForPath(path)}</a></li>)}</ul></div>
        <div><h3>Related resources</h3><ul>{relatedResources.map((item) => <li key={item.id}><a href={item.canonicalPath}>{item.shortTitle}</a></li>)}</ul></div>
        <div><h3>Glossary</h3><ul>{resource.relatedGlossaryTerms.map((term) => <li key={term}><a href={enrichedGlossaryTermIds.includes(term) ? `/glossary/math/${term}/` : `/glossary/math/#${term}`}>{term.replaceAll("-", " ")}</a></li>)}</ul></div>
      </div>
    </section>
  );
}

function DownloadPanel({ resource }: { resource: PublishingResource }) {
  if (!resource.studentPdf && !resource.answerKeyPdf && !resource.primaryVisual) return null;
  const download = (event: string, fileType: string) => {
    trackResource("resource_download", resource, { file_type: fileType });
    trackResource(event, resource, { file_type: fileType });
  };
  return (
    <section className="resource-downloads" aria-labelledby="downloads-title">
      <div><span>Printable and accessible</span><h2 id="downloads-title">Download this resource</h2><p>No email address or account is required.</p></div>
      <div className="resource-download-actions">
        {resource.studentPdf && <a className="button button-ink" href={resource.studentPdf} onClick={() => download(resource.resourceType === "practice-exam" ? "practice_exam_download" : resource.resourceType === "formula-sheet" ? "formula_sheet_download" : "worksheet_download", "pdf")}>Student PDF</a>}
        {resource.answerKeyPdf && <a className="button button-ghost" href={resource.answerKeyPdf} onClick={() => download("answer_key_download", "pdf")}>Worked answer key PDF</a>}
        {resource.primaryVisual && <><a className="button button-ghost" href={`/visuals/resources/${resource.primaryVisual}.svg`} onClick={() => download("visual_download", "svg")}>SVG</a><a className="button button-ghost" href={`/visuals/resources/${resource.primaryVisual}.png`} onClick={() => download("visual_download", "png")}>PNG</a></>}
        {resource.resourceType === "worksheet" && <button className="button button-ghost" type="button" onClick={() => { trackResource("worksheet_print", resource); window.print(); }}>Print HTML</button>}
      </div>
    </section>
  );
}

function PracticeProgress({ resource }: { resource: PublishingResource }) {
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  if (!["worksheet", "practice-exam"].includes(resource.resourceType)) return null;
  return (
    <section className="practice-progress" aria-labelledby="practice-progress-title">
      <div><span>Device-only study control</span><h2 id="practice-progress-title">{complete ? "Practice marked complete" : started ? "Practice in progress" : "Ready for an honest first attempt?"}</h2><p>This control sends only the resource id and type—never your answers or identity.</p></div>
      {!started ? <button className="button button-ink" type="button" onClick={() => { setStarted(true); trackResource(resource.resourceType === "practice-exam" ? "exam_start" : "practice_start", resource, {}, `start:${resource.id}`); }}>Start practice</button> : !complete ? <button className="button button-ink" type="button" onClick={() => { setComplete(true); trackResource(resource.resourceType === "practice-exam" ? "exam_complete" : "practice_complete", resource, {}, `complete:${resource.id}`); }}>Mark complete</button> : <span className="tag">Completed on this page</span>}
    </section>
  );
}

function ProblemSolution({ problem, index }: { problem: ResourceProblem; index: number }) {
  return (
    <article className="worked-solution" id={problem.id}>
      <div className="worked-solution-number">{String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3><span className="sr-only">Problem {index + 1}: </span><InlineMathText value={problem.prompt} /></h3>
        <p className="worked-answer"><strong>Answer:</strong> <Math tex={problem.answer.replace(/^\\\(|\\\)$/g, "")} /></p>
        <p><strong>Why this method:</strong> {problem.method} matches the mathematical structure before any algebraic cleanup.</p>
        <ol>{problem.steps.map((step) => <li key={step}><InlineMathText value={step} /></li>)}</ol>
        <aside><strong>Common wrong approach</strong><p>{problem.commonError}</p></aside>
      </div>
    </article>
  );
}

function VisualPanel({ resource }: { resource: PublishingResource }) {
  if (!resource.primaryVisual) return null;
  return (
    <figure className="resource-visual">
      <img src={`/visuals/resources/${resource.primaryVisual}.svg`} width="1200" height="805" alt={`${resource.shortTitle} instructional sequence`} />
      <figcaption>{resource.summary} The numbered labels and written sequence preserve meaning without relying on color.</figcaption>
      <details><summary>Long description</summary><p>Read the diagram from top to bottom. Each numbered box names one decision or mathematical operation. Arrows show the required order; the text labels remain the complete interpretation in print, dark mode, and nonvisual reading.</p></details>
    </figure>
  );
}

function GlossaryResource({ resource, term, relatedResources, enrichedGlossaryTermIds }: { resource: PublishingResource; term?: MathGlossaryTerm; relatedResources: readonly ResourceLinkSummary[]; enrichedGlossaryTermIds: readonly string[] }) {
  return (
    <article className="resource-page resource-glossary">
      <ResourceAnalytics resource={resource} />
      <ResourceSchema resource={resource} />
      <Breadcrumbs resource={resource} />
      <header className="resource-hero">
        <span>{typeLabels[resource.resourceType]} · Calculus reference</span>
        <h1>{resource.title}</h1>
        <p>{term?.shortDefinition ?? resource.summary}</p>
      </header>
      <section className="resource-explanation">
        <h2>Definition and meaning</h2>
        <p>{term?.definition ?? resource.explanation}</p>
        <p>{resource.explanation}</p>
      </section>
      <section className="resource-notation">
        <h2>Notation</h2>
        <Math tex={term?.visuals[0]?.tex ?? resource.notation ?? ""} display />
        <p>Read every symbol with its domain and hypotheses; notation compresses an argument but does not remove its conditions.</p>
      </section>
      <VisualPanel resource={resource} />
      <section><h2>Worked example</h2><p>{resource.workedExample}</p><h3>Common confusion</h3><p>{resource.commonConfusion}</p></section>
      <RelatedLinks resource={resource} relatedResources={relatedResources} enrichedGlossaryTermIds={enrichedGlossaryTermIds} />
      <footer className="resource-license">Revised {resource.revisionDate}. {resource.license}</footer>
    </article>
  );
}

export function ResourcePage({ resource, glossaryTerms = [], relatedResources = [], enrichedGlossaryTermIds = [] }: { resource: PublishingResource; glossaryTerms?: readonly MathGlossaryTerm[]; relatedResources?: readonly ResourceLinkSummary[]; enrichedGlossaryTermIds?: readonly string[] }) {
  if (resource.resourceType === "glossary-term") {
    return <GlossaryResource resource={resource} term={glossaryTerms.find((term) => term.id === resource.glossaryTermId)} relatedResources={relatedResources} enrichedGlossaryTermIds={enrichedGlossaryTermIds} />;
  }
  const problems = resource.problems ?? (resource.problem ? [resource.problem] : []);
  return (
    <article className="resource-page">
      <ResourceAnalytics resource={resource} />
      <ResourceSchema resource={resource} />
      <Breadcrumbs resource={resource} />
      <header className="resource-hero">
        <span>{typeLabels[resource.resourceType]} · {resource.course} · {resource.unit}</span>
        <h1>{resource.title}</h1>
        <p>{resource.summary}</p>
        <div className="resource-facts">
          <span><b>{resource.problemCount || "Reference"}</b> {resource.problemCount === 1 ? "problem" : resource.problemCount ? "problems" : "format"}</span>
          <span><b>{resource.estimatedTime} min</b> estimated time</span>
          <span><b>{resource.difficulty}</b> progression</span>
        </div>
      </header>
      <section className="resource-includes">
        <div><h2>What is included</h2><p>{resource.description}</p></div>
        <div><h3>Skills assessed</h3><ul>{resource.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
        <div><h3>Prerequisites</h3><ul>{resource.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      {resource.resourceType === "practice-exam" && <section className="exam-conditions"><h2>Exam conditions</h2><p><strong>Suggested time:</strong> {resource.suggestedTime} minutes</p><p><strong>Points:</strong> {resource.pointValues}</p><p><strong>Calculator:</strong> {resource.calculatorAssumptions}</p><p>This is an original BetterGrades practice exam, not a released institutional exam.</p></section>}
      <VisualPanel resource={resource} />
      <DownloadPanel resource={resource} />
      <PracticeProgress resource={resource} />
      {resource.formulaGroups && <section className="formula-groups"><h2>Reference formulas</h2>{resource.formulaGroups.map(([title, formulas]) => <article key={title}><h3>{title}</h3>{formulas.map((formula) => <Math key={formula} tex={formula} display />)}</article>)}</section>}
      {problems.length > 0 && <section className="resource-preview"><h2>Printable preview</h2><ol>{problems.map((problem) => <li key={problem.id}><InlineMathText value={problem.prompt} /></li>)}</ol></section>}
      {problems.length > 0 && <section className="resource-solutions" aria-labelledby="solutions-title"><h2 id="solutions-title">Complete worked solutions</h2><p>Every problem has a source-matched answer and independently reviewed derivation.</p>{problems.map((problem, index) => <ProblemSolution problem={problem} index={index} key={problem.id} />)}</section>}
      <section className="resource-errors"><h2>Common errors</h2><ul>{(resource.commonErrors ?? problems.map((item) => item.commonError).slice(0, 3)).map((error) => <li key={error}>{error}</li>)}</ul></section>
      <RelatedLinks resource={resource} relatedResources={relatedResources} enrichedGlossaryTermIds={enrichedGlossaryTermIds} />
      <footer className="resource-license">Revised {resource.revisionDate}. {resource.license}</footer>
    </article>
  );
}

export function ResourceHubPage({ hub, resources }: { hub: ResourceHub; resources: readonly ResourceCardSummary[] }) {
  const groups = ["Calculus I", "Calculus II"].map((course) => ({
    course,
    resources: resources.filter((resource) => resource.course.includes(course)),
  })).filter((group) => group.resources.length);
  return (
    <div className="resource-hub">
      <Breadcrumbs />
      <header className="resource-hero"><span>Practice and reference library</span><h1>{hub.title}</h1><p>{hub.description}</p><div className="resource-facts"><span><b>{resources.length}</b> published resources</span><span><b>Free</b> no sign-in</span><span><b>Verified</b> mathematics</span></div></header>
      <nav className="resource-hub-nav" aria-label="Calculus resource libraries">{hubLinks.map(([path, title]) => <a href={path} aria-current={path === hub.path ? "page" : undefined} key={path}>{title}</a>)}</nav>
      <section className="resource-hub-intro"><h2>Choose by course and purpose</h2><p>The sequential calculus course remains the best path for first learning. Use this library for focused practice, exam preparation, printable reference, or a second explanation of one method.</p></section>
      {groups.map((group) => <section className="resource-hub-group" key={group.course}><h2>{group.course}</h2><div className="resource-card-grid">{group.resources.map((resource) => <a href={resource.canonicalPath} className="resource-card" key={resource.id}><span>{typeLabels[resource.resourceType]} · {resource.difficulty}</span><h3>{resource.shortTitle}</h3><p>{resource.summary}</p><b>{resource.problemCount ? `${resource.problemCount} problems` : `${resource.estimatedTime}-minute guide`} →</b></a>)}</div></section>)}
      <section className="resource-course-return"><h2>Following the full course?</h2><p>Return to the calculus course map for the complete sequence of lessons, concept checks, practice, and exams.</p><a className="button button-ink" href="/subjects/math/calculus/">Open the calculus course map</a></section>
    </div>
  );
}
