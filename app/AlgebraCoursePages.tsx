"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- canonical course navigation uses document navigation */

import { FormEvent, useState } from "react";
import type { AlgebraAssessmentPrompt, AlgebraCoursePage } from "../lib/algebra/algebra-course.mjs";
import { resources, tools } from "../lib/registry/catalog";
import { BetterGradesVisual } from "./BetterGradesVisual";

const pageTypeLabel = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function Breadcrumbs({ page }: { page: AlgebraCoursePage }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{page.breadcrumbs.map((crumb, index) => <span key={`${crumb.path}-${index}`}>{index > 0 && <i>/</i>}<a href={crumb.path}>{crumb.name}</a></span>)}</nav>;
}

function Sequence({ page }: { page: AlgebraCoursePage }) {
  if (!page.lesson || !page.unit) return null;
  return <nav className="limits-sequence" aria-label={`Unit ${page.unit.code} lesson sequence`}>
    {page.lesson.previous ? <a href={page.lesson.previous.path}><small>← Previous</small><b>{page.lesson.previous.title}</b></a> : <a href={page.unit.root}><small>← Unit map</small><b>{page.unit.title}</b></a>}
    {page.lesson.next ? <a href={page.lesson.next.path}><small>Next →</small><b>{page.lesson.next.title}</b></a> : <a href={page.unit.root}><small>Complete unit →</small><b>Review and mastery</b></a>}
  </nav>;
}

function AttemptFirstPrompt({ prompt, answerKey = false }: { prompt: AlgebraAssessmentPrompt; answerKey?: boolean }) {
  const [answer, setAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [feedback, setFeedback] = useState("Write a complete attempt before opening the response guide.");
  const [rubric, setRubric] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function check(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/algebra-course-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: prompt.id, answer }),
      });
      const result = await response.json() as { status?: string; feedback?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "The checker could not review this response.");
      setAttempted(result.status !== "empty");
      setFeedback(result.feedback ?? "Use the response guide to compare your reasoning.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "The checker could not be reached.");
    } finally {
      setBusy(false);
    }
  }

  async function reveal() {
    if (!attempted) {
      setFeedback("Submit a real attempt first. A partial setup is enough to unlock the guide.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/algebra-course-reveal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: prompt.id, attempt: answer }),
      });
      const result = await response.json() as { rubric?: string; error?: string };
      if (!response.ok || !result.rubric) throw new Error(result.error ?? "The response guide could not be loaded.");
      setRubric(result.rubric);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "The response guide could not be reached.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="limits-check algebra-attempt" id={prompt.id} data-check-id={prompt.id}>
    <header><span>{answerKey ? "Attempt-gated response guide" : "Open-response check"}</span><code>{prompt.lessonId}</code></header>
    <p className="limits-check-prompt">{prompt.prompt}</p>
    <form onSubmit={check}>
      <label htmlFor={`${prompt.id}-answer`}>Your method, work, and check</label>
      <textarea id={`${prompt.id}-answer`} value={answer} onChange={(event) => setAnswer(event.target.value)} rows={4} required />
      <button className="button button-ink" type="submit" disabled={busy}>{busy ? "Reviewing…" : "Submit attempt"}</button>
    </form>
    <p className="limits-check-feedback is-uncertain" aria-live="polite">{feedback}</p>
    <details className="limits-disclosure" onToggle={(event) => { if (event.currentTarget.open && attempted && !rubric && !busy) void reveal(); }}>
      <summary>{attempted ? "Compare with the response guide" : "Attempt once to unlock the response guide"}</summary>
      {rubric ? <p>{rubric}</p> : <p>{attempted ? "Loading the response guide…" : "The source package supplies editorial decision checks, not canonical numerical answers. This route therefore uses an honest rubric instead of pretending prose can be machine-proved."}</p>}
    </details>
  </section>;
}

function CourseHub({ page }: { page: AlgebraCoursePage }) {
  const legacyGuides = resources.filter((resource) => resource.domainId === "domain-math-algebra");
  const algebraTools = tools.filter((tool) => tool.domainId === "domain-math-algebra");
  return <>
    <section className="limits-unit-map calculus-unit-map algebra-course-map" aria-label="Complete Algebra course map">
      <header className="limits-map-intro"><div><p className="eyebrow">Complete textbook</p><h2>Fifteen connected units</h2></div><p>Start with the readiness diagnostic, follow the ordered spine, or enter at the exact unit that repairs your current gap.</p></header>
      <div className="limits-chapter-map">{page.units.map((unit) => <section className="limits-chapter" key={unit.id}>
        <header><div><span>Unit {unit.code}</span><h3><a href={unit.root}>{unit.title}</a></h3></div><p>{unit.act}</p></header>
        <aside className="limits-reading-lens limits-map-lens"><span>Governing question</span><p>{unit.governingQuestion}</p></aside>
        <p>{unit.role}</p>
        <a className="text-link" href={unit.root}>Open {unit.lessonCount}-lesson unit →</a>
      </section>)}</div>
      <section className="limits-exam-key-callout"><div><p className="eyebrow">Choose a starting point</p><h2>Diagnostic, final exam, and cumulative response guide</h2><p>Checks are attempt-first and deterministic only where the supplied source defines a provable answer. Open explanation prompts return an honest rubric.</p></div><div className="button-row"><a className="button button-ink" href="/subjects/math/algebra/diagnostic/">Take the diagnostic</a><a className="button button-ghost" href="/subjects/math/algebra/final-exam/">Open final exam</a></div></section>
    </section>
    <section className="section-pad algebra-legacy-layer" aria-labelledby="algebra-quick-guides">
      <header className="limits-map-intro"><div><p className="eyebrow">Quick-reference layer preserved</p><h2 id="algebra-quick-guides">All {legacyGuides.length} compact Algebra guides</h2></div><p>The complete textbook adds depth without deleting the fast method guides that were already useful.</p></header>
      <div className="limits-support-grid">{legacyGuides.map((guide) => <a href={guide.path} key={guide.id}><span>Compact guide</span><b>{guide.title}</b><small>{guide.description}</small></a>)}</div>
      <div className="limits-support-grid">{algebraTools.map((tool) => <a href={tool.path} key={tool.id}><span>Interactive tool</span><b>{tool.title}</b><small>{tool.description}</small></a>)}</div>
    </section>
  </>;
}

function UnitHub({ page }: { page: AlgebraCoursePage }) {
  if (!page.unit) return null;
  return <section className="limits-unit-map calculus-unit-map algebra-unit-map" aria-label={`Unit ${page.unit.code} map`}>
    <header className="limits-map-intro"><div><p className="eyebrow">{page.unit.act}</p><h2>The {page.unit.lessonCount}-lesson path</h2></div><p>{page.unit.storyArc}</p></header>
    <section className="calculus-prerequisites"><div><p className="eyebrow">Governing question</p><h3>{page.unit.governingQuestion}</h3><p>{page.unit.role}</p></div><div><p className="eyebrow">Mastery design</p><h3>Know when to continue</h3><p>{page.unit.mastery}</p></div></section>
    <section className="limits-node limits-node-summary"><header><span>Unit outcomes</span></header><div><ol>{page.unit.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ol></div></section>
    <div className="limits-chapter-map"><section className="limits-chapter"><header><div><span>Core sequence</span><h3>Lessons</h3></div><p>Move in order when this material is new; use prerequisites and repair links when entering mid-unit.</p></header><ol>{page.unitLessons.map((lesson) => <li key={lesson.path}><a href={lesson.path}><span>{String(lesson.sequence).padStart(2, "0")}</span><b>{lesson.title}</b><small>{lesson.outcome}</small></a></li>)}</ol></section></div>
    <header className="limits-map-intro limits-map-support-heading"><div><p className="eyebrow">Practice around the path</p><h2>Review, mixed practice, mastery, and investigation</h2></div><p>Every route states the supplied item-range blueprint and keeps response guidance behind an attempt.</p></header>
    <div className="limits-support-grid">
      <a href={page.unit.reviewRoute}><span>Review</span><b>Cumulative review</b><small>Revisit this unit with prior-unit retrieval.</small></a>
      <a href={page.unit.practiceRoute}><span>Practice</span><b>Mixed practice</b><small>Classify the structure before choosing a method.</small></a>
      <a href={page.unit.masteryRoute}><span>Mastery</span><b>Mastery check</b><small>Use the supplied grading and cumulative-share contract.</small></a>
      {page.unit.investigationRoute && <a href={page.unit.investigationRoute}><span>Investigation</span><b>Performance task</b><small>{page.unit.investigation}</small></a>}
      <a href={page.unit.answerKeyRoute}><span>Response guide</span><b>Mastery response guide</b><small>Attempt-gated rubric support; no invented canonical answers.</small></a>
    </div>
  </section>;
}

function StoryboardList({ title, label, items }: { title: string; label: string; items: string[] }) {
  return <section className="limits-node limits-node-exposition"><header><span>{label}</span><h2>{title}</h2></header><div><ol>{items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ol></div></section>;
}

function LessonPage({ page }: { page: AlgebraCoursePage }) {
  const lesson = page.lesson;
  if (!lesson || !page.unit) return null;
  return <>
    <aside className="lesson-objective" aria-label="Lesson objective"><span>Lesson {lesson.id} objective</span><p>{lesson.outcome}</p></aside>
    <section className="limits-node limits-node-application"><header><span>Opening situation</span><h2>Begin with a quantity and a question</h2></header><div><p>{lesson.opening}</p><p>{lesson.storyBeat}</p></div></section>
    <StoryboardList title="Build the mechanism without skipping the meaning" label="Explanation sequence" items={lesson.expositionBeats} />
    <section className="algebra-figure-sequence" aria-label={`${lesson.title} figures`}>{lesson.figures.map((figure) => <figure className="limits-graph limits-graph-visual calculus-unit-visual" key={figure.id}>
      {figure.visual ? <BetterGradesVisual visual={figure.visual} /> : <p role="alert">This compiled figure is temporarily unavailable.</p>}
      <figcaption><strong>{figure.role} · {figure.id}</strong><p>{figure.description}</p>{figure.interactive && <small>Bounded interaction with a deterministic SVG fallback.</small>}</figcaption>
    </figure>)}</section>
    <StoryboardList title="Worked-example ladder" label="Three levels" items={lesson.examples} />
    <section className="limits-node limits-node-exercise"><header><span>Practice architecture</span><h2>{lesson.exerciseCount}</h2></header><div><div className="algebra-exercise-families">{lesson.exerciseFamilies.map((family) => <article key={family.id}><code>{family.id}</code><h3>{family.purpose}</h3><p>{family.recommendedCount} recommended items</p></article>)}</div></div></section>
    <StoryboardList title="Misconceptions to surface and repair" label="Error analysis" items={lesson.misconceptions} />
    <AttemptFirstPrompt prompt={{ id: `lesson-${lesson.id.toLowerCase().replace(".", "-")}-checkpoint`, lessonId: lesson.id, prompt: lesson.checkpoint }} />
    <StoryboardList title="Two-item exit check" label="Before continuing" items={lesson.exitCheck} />
    <section className="limits-node limits-node-bridge"><header><span>Bridge forward</span><h2>Keep the story connected</h2></header><div><p>{lesson.bridgeForward}</p></div></section>
  </>;
}

function AssessmentPage({ page }: { page: AlgebraCoursePage }) {
  const isKey = page.route.pageType === "answer-key";
  return <section className="algebra-assessment-page">
    <section className="limits-node limits-node-method"><header><span>{isKey ? "Response-guide contract" : "Assessment blueprint"}</span><h2>{page.assessment?.questionCount ?? "Attempt-gated guidance"}</h2></header><div>
      <p><strong>Suggested time:</strong> {page.assessment?.durationMinutes ?? "Work deliberately; no fixed timer supplied."} minutes.</p>
      <p><strong>Grading boundary:</strong> {page.assessment?.grading ?? "Open responses use a supplied rubric after an attempt."}</p>
      <p><strong>Cumulative share:</strong> {page.assessment?.cumulativeShare ?? "Connected to the matching assessment route."}</p>
      <p>The source package specifies counts, purposes, and decision checks rather than authored numerical items. These prompts therefore preserve the exact lesson outcomes and never fabricate a canonical answer.</p>
    </div></section>
    <div className="algebra-assessment-prompts">{page.assessmentPrompts.map((prompt) => <AttemptFirstPrompt prompt={prompt} answerKey={isKey} key={prompt.id} />)}</div>
    {page.assessmentPrompts.length === 0 && <p className="honest-note">No public model response is exposed on this route. Open the linked assessment and submit an attempt to retrieve its server-held rubric.</p>}
  </section>;
}

export function AlgebraCoursePageContent({ page }: { page: AlgebraCoursePage }) {
  const routeUrl = `https://bettergrades.net${page.route.path}`;
  const courseUrl = "https://bettergrades.net/subjects/math/algebra/";
  const schema = { "@context": "https://schema.org", "@graph": [
    {
      "@type": ["diagnostic", "exam", "mastery-check", "practice", "review"].includes(page.route.pageType) ? "Quiz" : "LearningResource",
      "@id": `${routeUrl}#learning-resource`,
      name: page.route.title,
      description: page.route.description,
      url: routeUrl,
      educationalLevel: "Algebra",
      learningResourceType: pageTypeLabel(page.route.pageType),
      isPartOf: { "@type": "Course", "@id": `${courseUrl}#course`, name: "Algebra: Quantities, Equations, and Structure", courseCode: "BetterGrades Algebra", url: courseUrl },
    },
    { "@type": "BreadcrumbList", "@id": `${routeUrl}#breadcrumbs`, itemListElement: page.breadcrumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: `https://bettergrades.net${crumb.path}` })) },
  ] };
  return <article className="limits-unit-page calculus-unit-page algebra-course-page" data-page-type={page.route.pageType} data-unit-id={page.unit?.id ?? "algebra-course"}>
    <header className="limits-unit-hero section-pad"><Breadcrumbs page={page} /><p className="eyebrow">BetterGrades Algebra {page.unit ? `· Unit ${page.unit.code}` : "· Complete course"} · {pageTypeLabel(page.route.pageType)}</p><h1>{page.route.title}</h1><p>{page.route.description}</p>{page.lesson && <nav className="lesson-position"><a href={page.unit?.root}>Unit {page.unit?.code} map</a><span>Lesson {page.lesson.sequence} of {page.unit?.lessonCount}</span></nav>}</header>
    <div className="limits-unit-layout section-pad"><div className="limits-unit-content">
      {page.route.pageType === "course-hub" ? <CourseHub page={page} />
        : page.route.pageType === "unit-hub" ? <UnitHub page={page} />
          : page.route.pageType === "lesson" ? <LessonPage page={page} />
            : <AssessmentPage page={page} />}
      <section className="limits-rights"><p className="eyebrow">Source &amp; rights</p><h2>Original storyboard, rights-separated references.</h2><p>Public page content comes from the BetterGrades Algebra editorial storyboard supplied by the owner. Reference books named in provenance remain separate and are not copied into the application.</p></section>
    </div></div>
    <Sequence page={page} />
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </article>;
}
