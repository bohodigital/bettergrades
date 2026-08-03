"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- canonical course navigation uses document navigation */

import { FormEvent, useEffect, useState } from "react";
import type { PrecalculusCoursePage, PrecalculusLesson, PrecalculusPrompt, PrecalculusTextbookBlock } from "../lib/precalculus/precalculus-course.mjs";
import { AlgebraMathText } from "./AlgebraMathText";
import { BetterGradesVisual } from "./BetterGradesVisual";

function Breadcrumbs({ page }: { page: PrecalculusCoursePage }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{page.breadcrumbs.map((crumb, index) => <span key={`${crumb.path}-${index}`}>{index > 0 && <i>/</i>}<a href={crumb.path}>{crumb.name}</a></span>)}</nav>;
}

function Sequence({ page }: { page: PrecalculusCoursePage }) {
  if (!page.lesson || !page.unit) return null;
  return <nav className="limits-sequence" aria-label="Precalculus lesson sequence">
    {page.lesson.previous
      ? <a href={page.lesson.previous.path}><small>← Previous lesson</small><b>{page.lesson.previous.title}</b></a>
      : <a href={page.unit.root}><small>← Unit map</small><b>{page.unit.title}</b></a>}
    {page.lesson.next
      ? <a href={page.lesson.next.path}><small>Next lesson →</small><b>{page.lesson.next.title}</b></a>
      : <a href="/subjects/math/precalculus/"><small>Course map →</small><b>Precalculus: Functions, Models, and Change</b></a>}
  </nav>;
}

function AttemptFirstPrompt({
  prompt,
  label,
  compact = false,
}: {
  prompt: PrecalculusPrompt;
  label: string;
  compact?: boolean;
}) {
  const [responseText, setResponseText] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [feedback, setFeedback] = useState("Write a complete attempt before opening the exact answer.");
  const [answer, setAnswer] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  async function check(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/precalculus-course-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: prompt.id, answer: responseText }),
      });
      const result = await response.json() as { status?: string; feedback?: string; error?: string };
      if (!response.ok && response.status !== 422) throw new Error(result.error ?? "The checker could not review this response.");
      setAttempted(result.status === "correct");
      setFeedback(result.feedback ?? "Review your work and try again.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "The checker could not be reached.");
    } finally {
      setBusy(false);
    }
  }

  async function reveal() {
    if (!attempted) {
      setFeedback("Submit a correct answer before opening the response guide.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/precalculus-course-reveal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: prompt.id, attempt: responseText }),
      });
      const result = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !result.answer) throw new Error(result.error ?? "The answer could not be loaded.");
      setAnswer(result.answer);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "The response guide could not be reached.");
    } finally {
      setBusy(false);
    }
  }

  return <section className={`limits-check algebra-attempt precalculus-attempt${compact ? " is-compact" : ""}`} id={prompt.id}>
    <header><span>{label}</span>{prompt.sequence ? <code>{String(prompt.sequence).padStart(2, "0")}</code> : null}</header>
    <p className="limits-check-prompt"><AlgebraMathText value={prompt.prompt} display="auto" /></p>
    {hydrated ? <><form onSubmit={check}>
      <label htmlFor={`${prompt.id}-answer`}>Your answer and supporting work</label>
      <textarea id={`${prompt.id}-answer`} value={responseText} onChange={(event) => setResponseText(event.target.value)} rows={compact ? 3 : 4} required />
      <button className="button button-ink" type="submit" disabled={busy}>{busy ? "Reviewing…" : "Submit attempt"}</button>
    </form>
    <p className="limits-check-feedback is-uncertain" aria-live="polite">{feedback}</p>
    <details className="limits-disclosure" onToggle={(event) => { if (event.currentTarget.open && attempted && !answer && !busy) void reveal(); }}>
      <summary>{attempted ? "Compare with the exact answer" : "Correct answer required to unlock"}</summary>
      {answer
        ? <p><AlgebraMathText value={answer} display="auto" /></p>
        : <p>{attempted ? "Loading the exact answer…" : "Submit a correct answer before revealing the server-held response guide."}</p>}
    </details></> : <p className="honest-note">Answer checking and protected response guides require JavaScript; the complete prompt remains readable and printable.</p>}
  </section>;
}

function CourseHub({ page }: { page: PrecalculusCoursePage }) {
  return <section className="limits-unit-map calculus-unit-map algebra-course-map precalculus-course-map" aria-label="Precalculus course map">
    <header className="limits-map-intro precalculus-map-intro">
      <img src="/og-precalculus.png" alt="Precalculus: Functions, Models, and Change, illustrated with a function curve and coordinate grid" />
      <div><p className="eyebrow">Continuous course</p><h2>Functions, models, and change</h2><p>Open a unit to follow its lesson sequence. Each lesson now combines a conceptual reading, a reusable method, worked reasoning, mathematical figures, and practice that asks for more than recall.</p></div>
    </header>
    <div className="calculus-chapter-list algebra-course-unit-list">
      {page.units.map((unit) => <details className="calculus-chapter algebra-course-unit" key={unit.id}>
        <summary>
          <span className="calculus-chapter-number">Unit {unit.sequence}</span>
          <span className="calculus-chapter-title"><b>{unit.title}</b><small>{unit.description}</small></span>
          <span className="calculus-chapter-course">{unit.lessonCount} lessons</span>
          <span className="calculus-chapter-toggle" aria-hidden="true">+</span>
        </summary>
        <div className="calculus-chapter-units">
          <section className="calculus-chapter-unit algebra-course-unit-card">
            <header><span>Precalculus</span><h3>{unit.title}</h3><p>{unit.description}</p><a href={unit.root}>Open the unit map <span aria-hidden="true">→</span></a></header>
            <nav aria-label={`${unit.title} lessons`}>
              {unit.lessons.map((lesson) => <a href={lesson.path} key={lesson.id}><span>{String(lesson.sequence).padStart(2, "0")}</span><b>{lesson.title}</b><i aria-hidden="true">→</i></a>)}
            </nav>
          </section>
        </div>
      </details>)}
    </div>
  </section>;
}

function UnitHub({ page }: { page: PrecalculusCoursePage }) {
  if (!page.unit) return null;
  return <section className="limits-unit-map calculus-unit-map algebra-unit-map precalculus-unit-map" aria-label={`${page.unit.title} map`}>
    <header className="limits-map-intro"><div><p className="eyebrow">Precalculus · Unit {page.unit.sequence}</p><h2>The lesson path</h2></div><p>{page.unit.description}</p></header>
    <div className="limits-chapter-map"><section className="limits-chapter"><header><div><span>Core sequence</span><h3>{page.unit.title}</h3></div><p>Move in order when the material is new, or enter at the exact skill you need.</p></header><ol>{page.unit.lessons.map((lesson) => <li key={lesson.path}><a href={lesson.path}><span>{String(lesson.sequence).padStart(2, "0")}</span><b>{lesson.title}</b><small><AlgebraMathText value={lesson.outcome} /></small></a></li>)}</ol></section></div>
    <section className="limits-node limits-node-summary"><header><span>Source record</span><h2>References used for this unit</h2></header><div><ul>{page.unit.sources.map((source) => <li key={source}>{source}</li>)}</ul><p>The learner copy is original BetterGrades material informed by these rights-separated references; no long source passage is reproduced.</p></div></section>
  </section>;
}

function PhaseBBlocks({ blocks }: { blocks: PrecalculusTextbookBlock[] }) {
  return <div className="precalculus-manuscript-blocks">{blocks.map((block, index) => {
    const key = `${block.type}-${index}`;
    if (block.type === "subheading") return <h3 key={key}><AlgebraMathText value={block.text} /></h3>;
    if (block.type === "callout") return <article className="precalculus-manuscript-callout" key={key}>
      <p className="eyebrow">{block.label}</p>
      <p><AlgebraMathText value={block.text} display="auto" /></p>
    </article>;
    if (block.type === "list") return <ol key={key}>{block.items.map((item) => <li key={item}><AlgebraMathText value={item} /></li>)}</ol>;
    return <p key={key}><AlgebraMathText value={block.text} /></p>;
  })}</div>;
}

function PhaseBFigures({ lesson }: { lesson: PrecalculusLesson }) {
  return <section className="algebra-figure-sequence precalculus-textbook-figures" aria-label={`${lesson.title} mathematical figures`}>{lesson.figures.map((figure) => <figure className="limits-graph limits-graph-visual calculus-unit-visual" key={figure.id}>
    {figure.visual ? <BetterGradesVisual visual={figure.visual} /> : <p role="alert">This compiled figure is temporarily unavailable.</p>}
    <figcaption><strong>{figure.role} · {figure.title}</strong><p><AlgebraMathText value={figure.caption} /></p></figcaption>
  </figure>)}</section>;
}

function PhaseBPractice({ lesson }: { lesson: PrecalculusLesson }) {
  return <section className="limits-node limits-node-exercise algebra-foundation-practice precalculus-practice"><header><span>Practice</span><h2>Ten concrete questions</h2></header><div className="algebra-practice-groups">
    {lesson.practice.map((prompt) => <AttemptFirstPrompt prompt={prompt} label={`Practice ${prompt.sequence}`} compact key={prompt.id} />)}
  </div></section>;
}

function PhaseBSources({ lesson }: { lesson: PrecalculusLesson }) {
  return <section className="limits-rights"><p className="eyebrow">Source record</p><h2>Original BetterGrades manuscript, rights-separated references.</h2><ul>{lesson.sources.map((source) => <li key={source}>{source}</li>)}</ul><p>No long source passage is reproduced.</p></section>;
}

function FullTextbookLesson({ lesson }: { lesson: PrecalculusLesson }) {
  return <div className="algebra-textbook-lesson precalculus-textbook-lesson precalculus-full-manuscript">
    {lesson.textbookSections?.map((section, index) => {
      if (section.kind === "figures") return <PhaseBFigures lesson={lesson} key={`${section.kind}-${index}`} />;
      if (section.kind === "checkpoint") return <AttemptFirstPrompt prompt={lesson.checkpoint} label="Check yourself" key={`${section.kind}-${index}`} />;
      if (section.kind === "practice") return <PhaseBPractice lesson={lesson} key={`${section.kind}-${index}`} />;
      if (section.kind === "sources") return <PhaseBSources lesson={lesson} key={`${section.kind}-${index}`} />;
      return <section className="limits-node limits-node-exposition precalculus-manuscript-section" key={`${section.kind}-${section.heading}`}>
        <header><span>Textbook reading</span><h2>{section.heading}</h2></header>
        <PhaseBBlocks blocks={section.blocks} />
      </section>;
    })}
  </div>;
}

function LessonPage({ page }: { page: PrecalculusCoursePage }) {
  if (!page.lesson) return null;
  const lesson = page.lesson;
  if (lesson.textbookSections?.length) return <FullTextbookLesson lesson={lesson} />;
  return <div className="algebra-textbook-lesson precalculus-textbook-lesson">
    <section className="limits-node limits-node-application algebra-lesson-opening"><header><span>Opening</span><h2>Start with the situation</h2></header><div>
      <p><AlgebraMathText value={lesson.opening[0]} /></p>
      <p><AlgebraMathText value={lesson.guide.application} /></p>
    </div></section>
    <section className="limits-node limits-node-exposition"><header><span>Before you begin</span><h2>Prerequisite check</h2></header><div><ul>{lesson.prerequisites.map((item) => <li key={item}><AlgebraMathText value={item} /></li>)}</ul></div></section>
    <section className="limits-node limits-node-exposition algebra-lesson-exposition"><header><span>Core explanation</span><h2>Explanation</h2></header><div>{lesson.exposition.map((paragraph) => <p key={paragraph}><AlgebraMathText value={paragraph} /></p>)}</div></section>
    <section className="limits-node limits-node-exposition precalculus-concept-reading"><header><span>Conceptual reading</span><h2>What the idea is really doing</h2></header><div>
      {lesson.guide.bigIdea.map((paragraph) => <p key={paragraph}><AlgebraMathText value={paragraph} /></p>)}
      <aside><strong>Questions to keep in view</strong><ul>{lesson.guide.questions.map((question) => <li key={question}>{question}</li>)}</ul></aside>
    </div></section>
    <section className="limits-node algebra-authored-method precalculus-lesson-method"><header><span>Reusable method</span><h2>A reliable route through the problem</h2></header><div>
      <ol>{lesson.guide.method.map((step) => <li key={step}><AlgebraMathText value={step.replace(/^\d+\.\s*/, "")} /></li>)}</ol>
      <p><strong>Verification:</strong> <AlgebraMathText value={lesson.guide.verification} /></p>
    </div></section>
    <section className="limits-node limits-node-example precalculus-foundation-walkthrough"><header><span>Foundation walkthrough</span><h2>Plan before calculating</h2></header><div>
      <p className="eyebrow">Problem</p><h3><AlgebraMathText value={lesson.guide.foundationWalkthrough.problem} display="auto" /></h3>
      <dl>
        <div><dt>Plan</dt><dd><AlgebraMathText value={lesson.guide.foundationWalkthrough.plan} /></dd></div>
        <div><dt>Conclusion</dt><dd><AlgebraMathText value={lesson.guide.foundationWalkthrough.conclusion} display="auto" /></dd></div>
        <div><dt>Why the check works</dt><dd><AlgebraMathText value={lesson.guide.foundationWalkthrough.check} /></dd></div>
      </dl>
    </div></section>
    <section className="limits-node limits-node-example algebra-lesson-examples"><header><span>Worked examples</span><h2>See the idea in three forms</h2></header><div className="algebra-worked-examples">{lesson.examples.map((example) => <article key={example.type}>
      <p className="eyebrow">{example.type} example</p>
      <h3><AlgebraMathText value={example.problem} display="auto" /></h3>
      <p className="algebra-example-answer"><strong>Solution</strong><AlgebraMathText value={example.solution} display="auto" /></p>
      <p><AlgebraMathText value={example.interpretation} /></p>
    </article>)}</div></section>
    <section className="algebra-figure-sequence" aria-label={`${lesson.title} semantic figures`}>{lesson.figures.map((figure) => <figure className="limits-graph limits-graph-visual calculus-unit-visual" key={figure.id}>
      {figure.visual ? <BetterGradesVisual visual={figure.visual} /> : <p role="alert">This compiled figure is temporarily unavailable.</p>}
      <figcaption><strong>{figure.role} · {figure.title}</strong><p><AlgebraMathText value={figure.caption} /></p></figcaption>
    </figure>)}</section>
    <section className="limits-node limits-node-caution algebra-lesson-caution"><header><span>Common mistake</span><h2>Find the first invalid move</h2></header><div><p><AlgebraMathText value={lesson.commonMistake} /></p></div></section>
    <AttemptFirstPrompt prompt={lesson.checkpoint} label="Check yourself" />
    <section className="limits-node limits-node-exercise algebra-foundation-practice precalculus-practice"><header><span>Practice</span><h2>Ten concrete questions</h2></header><div className="algebra-practice-groups">
      {lesson.practice.map((prompt) => <AttemptFirstPrompt prompt={prompt} label={`Practice ${prompt.sequence}`} compact key={prompt.id} />)}
    </div></section>
    <section className="limits-node limits-node-bridge algebra-lesson-takeaway"><header><span>Lesson close</span><h2>Connect forward</h2></header><div><p><AlgebraMathText value={lesson.close} /></p></div></section>
    <section className="limits-rights"><p className="eyebrow">Source record</p><h2>Original BetterGrades manuscript, rights-separated references.</h2><ul>{lesson.sources.map((source) => <li key={source}>{source}</li>)}</ul><p>No long source passage is reproduced.</p></section>
  </div>;
}

export function PrecalculusCoursePageContent({ page }: { page: PrecalculusCoursePage }) {
  const routeUrl = `https://bettergrades.net${page.route.path}`;
  const courseUrl = "https://bettergrades.net/subjects/math/precalculus/";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      page.route.pageType === "course-hub"
        ? { "@type": "Course", "@id": `${courseUrl}#course`, name: "Precalculus: Functions, Models, and Change", description: page.route.description, url: courseUrl, provider: { "@type": "Organization", name: "Better Grades", url: "https://bettergrades.net/" } }
        : { "@type": "LearningResource", "@id": `${routeUrl}#learning-resource`, name: page.route.title, description: page.route.description, url: routeUrl, educationalLevel: "Precalculus", learningResourceType: page.route.pageType === "unit-hub" ? "Unit map" : "Lesson", isPartOf: { "@type": "Course", "@id": `${courseUrl}#course`, name: "Precalculus: Functions, Models, and Change", url: courseUrl } },
      { "@type": "BreadcrumbList", "@id": `${routeUrl}#breadcrumbs`, itemListElement: page.breadcrumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: `https://bettergrades.net${crumb.path}` })) },
    ],
  };
  return <article className="limits-unit-page calculus-unit-page algebra-course-page precalculus-course-page" data-page-type={page.route.pageType}>
    <header className="limits-unit-hero section-pad"><Breadcrumbs page={page} /><p className="eyebrow">BetterGrades Precalculus{page.unit ? ` · Unit ${page.unit.sequence}` : ""} · {page.route.pageType === "course-hub" ? "Course map" : page.route.pageType === "unit-hub" ? "Unit map" : "Lesson"}</p><h1>{page.route.title}</h1><p>{page.route.description}</p>{page.lesson && <nav className="lesson-position"><a href={page.unit?.root}>Unit {page.unit?.sequence} map</a><span>Lesson {page.lesson.sequence}</span></nav>}</header>
    <div className="limits-unit-layout section-pad"><div className="limits-unit-content">
      {page.route.pageType === "course-hub" ? <CourseHub page={page} /> : page.route.pageType === "unit-hub" ? <UnitHub page={page} /> : <LessonPage page={page} />}
    </div></div>
    <Sequence page={page} />
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </article>;
}
