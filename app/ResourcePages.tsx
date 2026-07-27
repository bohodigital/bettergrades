"use client";

/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- canonical static routes and versioned instructional assets intentionally use document navigation */

import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import type { MathGlossaryTerm } from "../lib/glossary/math/registry.mjs";
import { trackFindabilityNavigation } from "../lib/learning-graph/analytics";
import type { PublishingResource, ResourceHub, ResourceProblem } from "../lib/resources/catalog.mjs";
import { isPdfHref, pdfLinkAttributes } from "../lib/resources/pdf-links.mjs";
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
export type ResourceCardSummary = Pick<PublishingResource, "id" | "canonicalPath" | "shortTitle" | "resourceType" | "difficulty" | "course" | "unit" | "topics" | "problemCount" | "estimatedTime">;
type AnalyticsResource = Pick<PublishingResource, "id" | "resourceType" | "course" | "unit" | "topics" | "difficulty">;
export type ResourceLibrarySummary = Pick<PublishingResource, "id" | "canonicalPath" | "shortTitle" | "summary" | "resourceType" | "difficulty" | "course" | "unit" | "topics" | "problemCount" | "estimatedTime" | "studentPdf" | "answerKeyPdf" | "primaryVisual">;

const hubLinks = [
  ["/subjects/math/calculus/worksheets/", "Worksheets"],
  ["/subjects/math/calculus/practice-exams/", "Practice Exams"],
  ["/subjects/math/calculus/formula-sheets/", "Formula Sheets"],
  ["/subjects/math/calculus/worked-problems/", "Worked Problems"],
  ["/subjects/math/calculus/visuals/", "Visual Guides"],
] as const;

const libraryGroups = [
  ["worksheet", "Worksheets", "Focused printable practice with complete worked solutions."],
  ["practice-exam", "Practice exams", "Timed cumulative exams, student copies, and complete answer keys."],
  ["formula-sheet", "Formula sheets", "Compact references that explain when each rule applies."],
  ["visual-guide", "Visual guides", "Downloadable diagrams for geometric and conceptual reasoning."],
  ["worked-problem", "Worked problems", "One carefully chosen problem with an explicit method and derivation."],
  ["glossary-term", "Glossary references", "Definitions, notation, examples, and common points of confusion."],
] as const;

function eventDimensions(resource: AnalyticsResource) {
  return {
    resource_id: resource.id,
    resource_type: resource.resourceType,
    course: resource.course,
    unit: resource.unit,
    topic: resource.topics[0] ?? "",
    difficulty: resource.difficulty,
  };
}

function trackResource(event: string, resource: AnalyticsResource, extra: Record<string, string | number> = {}, onceKey?: string) {
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

type ResourceFileLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "resource"> & {
  href: string;
  resource: AnalyticsResource;
  event: string;
  fileType: string;
  variant: string;
};

function ResourceFileLink({ href, resource, event, fileType, variant, children, onClick, ...props }: ResourceFileLinkProps) {
  const pdf = isPdfHref(href);
  return (
    <a
      {...props}
      {...pdfLinkAttributes(href)}
      href={href}
      onClick={(clickEvent) => {
        trackResource("resource_download", resource, { file_type: fileType, variant });
        trackResource(event, resource, { file_type: fileType, variant });
        onClick?.(clickEvent);
      }}
    >
      {children}
      {pdf && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

function primaryPdfEvent(resource: AnalyticsResource) {
  if (resource.resourceType === "practice-exam") return "practice_exam_download";
  if (resource.resourceType === "formula-sheet") return "formula_sheet_download";
  if (resource.resourceType === "visual-guide") return "visual_download";
  return "worksheet_download";
}

function primaryPdfVariant(resource: AnalyticsResource) {
  if (resource.resourceType === "formula-sheet") return "reference";
  if (resource.resourceType === "visual-guide") return "visual";
  return "student";
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
  const practice = resource && ["worksheet", "practice-exam", "worked-problem"].includes(resource.resourceType);
  return (
    <nav className="resource-breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a><span>/</span>
      <a href={practice ? "/practice/" : "/resources/"}>{practice ? "Practice" : "Resources"}</a><span>/</span>
      <a href="/subjects/math/calculus/">Calculus</a><span>/</span>
      {resource ? <><a href={`/subjects/math/calculus/${resource.resourceType === "worked-problem" ? "worked-problems" : resource.resourceType === "visual-guide" ? "visuals" : resource.resourceType === "practice-exam" ? "practice-exams" : resource.resourceType === "formula-sheet" ? "formula-sheets" : "worksheets"}/`}>{typeLabels[resource.resourceType]}</a><span>/</span><span aria-current="page">{resource.shortTitle}</span></> : <span aria-current="page">Resource library</span>}
    </nav>
  );
}

function LibraryDownloads({ resource }: { resource: ResourceLibrarySummary }) {
  if (!resource.studentPdf && !resource.answerKeyPdf && !resource.primaryVisual) return null;
  return <div className="resource-library-downloads" aria-label={`${resource.shortTitle} downloads`}>
    {resource.studentPdf && <ResourceFileLink href={resource.studentPdf} resource={resource} event={primaryPdfEvent(resource)} fileType="pdf" variant={primaryPdfVariant(resource)}>Student PDF</ResourceFileLink>}
    {resource.answerKeyPdf && <ResourceFileLink href={resource.answerKeyPdf} resource={resource} event="answer_key_download" fileType="pdf" variant="answer-key">Answer key</ResourceFileLink>}
    {resource.primaryVisual && <ResourceFileLink href={`/visuals/resources/${resource.primaryVisual}.svg`} resource={resource} event="visual_download" fileType="svg" variant="visual">SVG</ResourceFileLink>}
    {resource.primaryVisual && <ResourceFileLink href={`/visuals/resources/${resource.primaryVisual}.png`} resource={resource} event="visual_download" fileType="png" variant="visual">PNG</ResourceFileLink>}
  </div>;
}

function RelatedLinks({ resource, relatedResources, enrichedGlossaryTermIds }: { resource: PublishingResource; relatedResources: readonly ResourceLinkSummary[]; enrichedGlossaryTermIds: readonly string[] }) {
  const lesson = [...resource.relatedLessons, ...resource.relatedArticles][0];
  const supporting = [
    ...relatedResources.slice(0, 2).map((item) => ({ key: item.id, href: item.canonicalPath, role: "Related resource", label: item.shortTitle })),
    ...resource.relatedGlossaryTerms.slice(0, 1).map((term) => ({ key: term, href: enrichedGlossaryTermIds.includes(term) ? `/glossary/math/${term}/` : `/glossary/math/#${term}`, role: "Review the definition", label: term.replaceAll("-", " ") })),
  ].slice(0, 3);
  return (
    <section className="resource-related" aria-labelledby="related-learning">
      <h2 id="related-learning">Continue learning</h2>
      <div className="resource-related-grid">
        {lesson && <div><h3>Learn fully</h3><ul><li><a href={lesson} onClick={(event) => trackFindabilityNavigation(
          event,
          resource.resourceType === "glossary-term"
            ? "glossary_to_lesson_click"
            : resource.resourceType === "worked-problem"
              ? "worked_problem_to_lesson_click"
              : "resource_to_lesson_click",
          resource.canonicalPath,
          lesson,
          {
            relationship_type: "full_version_of",
            placement: "resource-footer",
            navigation_surface: resource.resourceType,
            course: resource.course || "not-applicable",
            unit: resource.unit || "not-applicable",
            topic: resource.topics[0] || "not-applicable",
          },
        )}>{labelForPath(lesson)}</a></li></ul></div>}
        {supporting.length > 0 && <div><h3>Supporting steps</h3><ul>{supporting.map((item) => <li key={item.key}><small>{item.role}</small><a href={item.href}>{item.label}</a></li>)}</ul></div>}
      </div>
    </section>
  );
}

function DownloadPanel({ resource }: { resource: PublishingResource }) {
  if (!resource.studentPdf && !resource.answerKeyPdf && !resource.primaryVisual) return null;
  return (
    <section className="resource-downloads" aria-labelledby="downloads-title">
      <div><span>Printable and accessible</span><h2 id="downloads-title">Download this resource</h2><p>No email address or account is required.</p></div>
      <div className="resource-download-actions">
        {resource.studentPdf && <ResourceFileLink className="button button-ink" href={resource.studentPdf} resource={resource} event={primaryPdfEvent(resource)} fileType="pdf" variant={primaryPdfVariant(resource)}>Student PDF</ResourceFileLink>}
        {resource.answerKeyPdf && <ResourceFileLink className="button button-ghost" href={resource.answerKeyPdf} resource={resource} event="answer_key_download" fileType="pdf" variant="answer-key">Worked answer key PDF</ResourceFileLink>}
        {resource.primaryVisual && <><ResourceFileLink className="button button-ghost" href={`/visuals/resources/${resource.primaryVisual}.svg`} resource={resource} event="visual_download" fileType="svg" variant="visual">SVG</ResourceFileLink><ResourceFileLink className="button button-ghost" href={`/visuals/resources/${resource.primaryVisual}.png`} resource={resource} event="visual_download" fileType="png" variant="visual">PNG</ResourceFileLink></>}
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
  const problemFirst = resource.resourceType === "worked-problem";
  const problemPreview = problems.length > 0 && <section className="resource-preview"><h2>{problemFirst ? "Problem" : "Printable preview"}</h2><ol>{problems.map((problem) => <li key={problem.id}><InlineMathText value={problem.prompt} /></li>)}</ol></section>;
  const workedSolutions = problems.length > 0 && <section className="resource-solutions" aria-labelledby="solutions-title"><h2 id="solutions-title">Complete worked solutions</h2><p>Every problem has a source-matched answer and independently reviewed derivation.</p>{problems.map((problem, index) => <ProblemSolution problem={problem} index={index} key={problem.id} />)}</section>;
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
      {problemFirst && problemPreview}
      {problemFirst && workedSolutions}
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
      {!problemFirst && problemPreview}
      {!problemFirst && workedSolutions}
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
      {groups.map((group) => <section className="resource-hub-group" key={group.course}><h2>{group.course}</h2><div className="resource-card-grid">{group.resources.map((resource) => <a href={resource.canonicalPath} className="resource-card" key={resource.id}><span>{typeLabels[resource.resourceType]} · {resource.difficulty}</span><h3>{resource.shortTitle}</h3><small>{resource.unit} · {resource.topics[0]}</small><b>{resource.problemCount ? `${resource.problemCount} problems` : `${resource.estimatedTime}-minute guide`} →</b></a>)}</div></section>)}
      <section className="resource-course-return"><h2>Following the full course?</h2><p>Return to the calculus course map for the complete sequence of lessons, concept checks, practice, and exams.</p><a className="button button-ink" href="/subjects/math/calculus/">Open the calculus course map</a></section>
    </div>
  );
}

export function ResourceLibraryPage({ resources }: { resources: readonly ResourceLibrarySummary[] }) {
  const [course, setCourse] = useState("all");
  const [unit, setUnit] = useState("all");
  const [topic, setTopic] = useState("all");
  const [resourceType, setResourceType] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const downloadableCount = resources.reduce((count, resource) => count + Number(Boolean(resource.studentPdf)) + Number(Boolean(resource.answerKeyPdf)) + (resource.primaryVisual ? 2 : 0), 0);
  const options = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort();
  const filteredResources = resources.filter((resource) =>
    (course === "all" || resource.course === course)
    && (unit === "all" || resource.unit === unit)
    && (topic === "all" || resource.topics.includes(topic))
    && (resourceType === "all" || resource.resourceType === resourceType)
    && (difficulty === "all" || resource.difficulty === difficulty)
  );
  return (
    <div className="resource-hub resource-library">
      <nav className="resource-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Resources</span></nav>
      <header className="resource-hero">
        <span>Better Grades resource library</span>
        <h1>Everything printable, visual, and worked through.</h1>
        <p>Browse every published worksheet, practice exam, formula sheet, visual guide, worked problem, and glossary reference. Open the web version or go straight to the available document download.</p>
        <div className="resource-facts"><span><b>{resources.length}</b> published resources</span><span><b>{downloadableCount}</b> direct downloads</span><span><b>Free</b> complete access</span></div>
      </header>
      <nav className="resource-library-categories" aria-label="Resource categories">
        {libraryGroups.map(([type, title]) => <a href={`#${type}`} key={type}>{title}<span>{resources.filter((resource) => resource.resourceType === type).length}</span></a>)}
      </nav>
      <nav className="resource-hub-nav" aria-label="Browse dedicated calculus resource hubs">
        {hubLinks.map(([path, title]) => <a href={path} key={path}>{title}</a>)}
      </nav>
      <section className="resource-hub-intro"><h2>Choose the format that fits the job</h2><p>Use worksheets and exams when you need practice, formula sheets and visuals when you need a reference, and worked problems or glossary entries when one specific idea is slowing you down.</p></section>
      <section className="resource-library-filters" aria-label="Filter resources">
        <div><span>Filter the library</span><strong>{filteredResources.length} of {resources.length} resources</strong></div>
        <label>Course<select value={course} onChange={(event) => setCourse(event.target.value)}><option value="all">All courses</option>{options(resources.map((resource) => resource.course)).map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        <label>Unit<select value={unit} onChange={(event) => setUnit(event.target.value)}><option value="all">All units</option>{options(resources.map((resource) => resource.unit)).map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        <label>Topic<select value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">All topics</option>{options(resources.flatMap((resource) => resource.topics)).map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        <label>Resource type<select value={resourceType} onChange={(event) => setResourceType(event.target.value)}><option value="all">All types</option>{libraryGroups.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label>Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="all">All levels</option>{options(resources.map((resource) => resource.difficulty)).map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        <button type="button" onClick={() => { setCourse("all"); setUnit("all"); setTopic("all"); setResourceType("all"); setDifficulty("all"); }}>Clear filters</button>
      </section>
      {libraryGroups.map(([type, title, description]) => {
        const group = filteredResources.filter((resource) => resource.resourceType === type);
        if (!group.length) return null;
        return <section className="resource-library-group" id={type} key={type}>
          <header><div><span>{String(group.length).padStart(2, "0")} resources</span><h2>{title}</h2></div><p>{description}</p></header>
          <div className="resource-library-grid">
            {group.map((resource) => <article className="resource-library-card" key={resource.id}>
              <div><span>{resource.course} · {resource.unit}</span><h3><a href={resource.canonicalPath}>{resource.shortTitle}</a></h3><p>{resource.topics[0]} · {typeLabels[resource.resourceType]} · {resource.difficulty}</p></div>
              <div className="resource-library-card-footer">
                <small>{resource.problemCount ? `${resource.problemCount} problems` : `${resource.estimatedTime}-minute reference`} · {resource.difficulty}</small>
                <LibraryDownloads resource={resource} />
              </div>
            </article>)}
          </div>
        </section>;
      })}
      <section className="resource-course-return"><h2>Learning calculus in order?</h2><p>The resource library is organized by format. The calculus course map remains the better route when you want a complete lesson sequence.</p><a className="button button-ink" href="/subjects/math/calculus/">Open the calculus course map</a></section>
    </div>
  );
}
