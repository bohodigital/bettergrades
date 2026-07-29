"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- canonical course navigation uses document navigation */

import { FormEvent, useState } from "react";
import type { AlgebraAssessmentPrompt, AlgebraCoursePage } from "../lib/algebra/algebra-course.mjs";
import { resources, tools } from "../lib/registry/catalog";
import { AlgebraMathText } from "./AlgebraMathText";
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
    <p className="limits-check-prompt"><AlgebraMathText value={prompt.prompt} display="auto" /></p>
    <form onSubmit={check}>
      <label htmlFor={`${prompt.id}-answer`}>Your method, work, and check</label>
      <textarea id={`${prompt.id}-answer`} value={answer} onChange={(event) => setAnswer(event.target.value)} rows={4} required />
      <button className="button button-ink" type="submit" disabled={busy}>{busy ? "Reviewing…" : "Submit attempt"}</button>
    </form>
    <p className="limits-check-feedback is-uncertain" aria-live="polite">{feedback}</p>
    <details className="limits-disclosure" onToggle={(event) => { if (event.currentTarget.open && attempted && !rubric && !busy) void reveal(); }}>
      <summary>{attempted ? "Compare with the response guide" : "Attempt once to unlock the response guide"}</summary>
      {rubric ? <p><AlgebraMathText value={rubric} /></p> : <p>{attempted ? "Loading the response guide…" : "Complete a substantive attempt to unlock the protected solution and scoring criteria."}</p>}
    </details>
  </section>;
}

function CourseHub({ page }: { page: AlgebraCoursePage }) {
  const legacyGuides = resources.filter((resource) => resource.domainId === "domain-math-algebra");
  const algebraTools = tools.filter((tool) => tool.domainId === "domain-math-algebra");
  return <>
    <section className="limits-unit-map calculus-unit-map algebra-course-map" aria-label="Complete Algebra course map">
      <header className="limits-map-intro"><div><p className="eyebrow">Complete textbook</p><h2>Fifteen connected units</h2></div><p>Expand any unit to see its complete lesson sequence, review, practice, investigation, mastery check, and response guide.</p></header>
      <div className="calculus-chapter-list algebra-course-unit-list">
        {page.units.map((unit) => <details className="calculus-chapter algebra-course-unit" data-unit={unit.code} key={unit.id}>
          <summary>
            <span className="calculus-chapter-number">Unit {unit.code}</span>
            <span className="calculus-chapter-title"><b>{unit.title}</b><small>{unit.role}</small></span>
            <span className="calculus-chapter-course">{unit.lessonCount} lessons</span>
            <span className="calculus-chapter-toggle" aria-hidden="true">+</span>
          </summary>
          <div className="calculus-chapter-units">
            <section className="calculus-chapter-unit algebra-course-unit-card">
              <header>
                <span>{unit.act}</span>
                <h3>{unit.title}</h3>
                <p>{unit.governingQuestion}</p>
                <a href={unit.root}>Open Unit {unit.code} map <span aria-hidden="true">→</span></a>
              </header>
              <nav aria-label={`Unit ${unit.code} lessons`}>
                {unit.lessons.map((lesson) => <a href={lesson.path} key={lesson.id}>
                  <span>{String(lesson.sequence).padStart(2, "0")}</span>
                  <b>{lesson.title}</b>
                  <i aria-hidden="true">→</i>
                </a>)}
              </nav>
              <nav className="algebra-course-support-links" aria-label={`Unit ${unit.code} review and assessment`}>
                <a href={unit.reviewRoute}><b>Review</b><i aria-hidden="true">→</i></a>
                <a href={unit.practiceRoute}><b>Mixed practice</b><i aria-hidden="true">→</i></a>
                <a href={unit.masteryRoute}><b>Mastery check</b><i aria-hidden="true">→</i></a>
                {unit.investigationRoute && <a href={unit.investigationRoute}><b>Investigation</b><i aria-hidden="true">→</i></a>}
                <a href={unit.answerKeyRoute}><b>Response guide</b><i aria-hidden="true">→</i></a>
              </nav>
            </section>
          </div>
        </details>)}
      </div>
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
    <section className="calculus-prerequisites"><div><p className="eyebrow">Governing question</p><h3><AlgebraMathText value={page.unit.governingQuestion} /></h3><p><AlgebraMathText value={page.unit.role} /></p></div><div><p className="eyebrow">Mastery design</p><h3>Know when to continue</h3><p><AlgebraMathText value={page.unit.mastery} /></p></div></section>
    <section className="limits-node limits-node-summary"><header><span>Unit outcomes</span></header><div><ol>{page.unit.outcomes.map((outcome) => <li key={outcome}><AlgebraMathText value={outcome} /></li>)}</ol></div></section>
    <div className="limits-chapter-map"><section className="limits-chapter"><header><div><span>Core sequence</span><h3>Lessons</h3></div><p>Move in order when this material is new; use prerequisites and repair links when entering mid-unit.</p></header><ol>{page.unitLessons.map((lesson) => <li key={lesson.path}><a href={lesson.path}><span>{String(lesson.sequence).padStart(2, "0")}</span><b>{lesson.title}</b><small><AlgebraMathText value={lesson.outcome} /></small></a></li>)}</ol></section></div>
    <header className="limits-map-intro limits-map-support-heading"><div><p className="eyebrow">Practice around the path</p><h2>Review, mixed practice, mastery, and investigation</h2></div><p>Every route contains a fixed set of concrete questions, with detailed solutions available after an attempt.</p></header>
    <div className="limits-support-grid">
      <a href={page.unit.reviewRoute}><span>Review</span><b>Cumulative review</b><small>Revisit this unit with prior-unit retrieval.</small></a>
      <a href={page.unit.practiceRoute}><span>Practice</span><b>Mixed practice</b><small>Classify the structure before choosing a method.</small></a>
      <a href={page.unit.masteryRoute}><span>Mastery</span><b>Mastery check</b><small>Use the supplied grading and cumulative-share contract.</small></a>
      {page.unit.investigationRoute && <a href={page.unit.investigationRoute}><span>Investigation</span><b>Performance task</b><small>{page.unit.investigation}</small></a>}
      <a href={page.unit.answerKeyRoute}><span>Response guide</span><b>Mastery response guide</b><small>Attempt-gated rubric support; no invented canonical answers.</small></a>
    </div>
  </section>;
}

function LessonList({ title, label, items }: { title: string; label: string; items: string[] }) {
  return <section className="limits-node limits-node-exposition"><header><span>{label}</span><h2>{title}</h2></header><div><ol>{items.map((item, index) => <li key={`${index}-${item}`}><AlgebraMathText value={item} /></li>)}</ol></div></section>;
}

function LessonPractice({ lesson }: { lesson: NonNullable<AlgebraCoursePage["lesson"]> }) {
  const authoredFoundation = lesson.foundationEdition?.startsWith("authored-");
  if (!authoredFoundation) {
    return <section className="limits-node limits-node-exercise"><header><span>Practice</span><h2>{lesson.practiceQuestions.length} concrete questions</h2></header><div><div className="algebra-exercise-families">{lesson.practiceQuestions.map((question) => <article key={question.id}><code>{question.id}</code><h3><AlgebraMathText value={question.prompt} display="auto" /></h3><p><AlgebraMathText value={question.hint} /></p><small>{pageTypeLabel(question.purpose ?? "practice")} · {pageTypeLabel(question.difficulty ?? "standard")}</small></article>)}</div></div></section>;
  }

  const groups = [
    { title: "Warm-up", label: "Recall and read the structure", questions: lesson.practiceQuestions.slice(0, 4) },
    { title: "Core practice", label: "Build accuracy one step at a time", questions: lesson.practiceQuestions.slice(4, 12) },
    { title: "Represent and reason", label: "Explain, compare, and diagnose", questions: lesson.practiceQuestions.slice(12, 16) },
    { title: "Finish strong", label: "Model, transfer, and verify", questions: lesson.practiceQuestions.slice(16) },
  ];

  return <section className="limits-node limits-node-exercise algebra-foundation-practice">
    <header><span>Practice</span><h2>{lesson.practiceQuestions.length} practice questions</h2></header>
    <div className="algebra-practice-groups">
      {groups.map((group) => <section className="algebra-practice-group" key={group.title} aria-labelledby={`${lesson.id}-${group.title.replaceAll(" ", "-")}`}>
        <header><p className="eyebrow">{group.label}</p><h3 id={`${lesson.id}-${group.title.replaceAll(" ", "-")}`}>{group.title}</h3></header>
        <div className="algebra-exercise-families">
          {group.questions.map((question) => {
            const number = lesson.practiceQuestions.indexOf(question) + 1;
            return <article key={question.id}>
              <div className="algebra-question-meta"><span>Question {number}</span><small>{pageTypeLabel(question.purpose ?? "practice")} · {pageTypeLabel(question.difficulty ?? "standard")}</small></div>
              <h4><AlgebraMathText value={question.prompt} display="auto" /></h4>
              <details className="algebra-question-hint"><summary>Need a hint?</summary><p><AlgebraMathText value={question.hint} /></p></details>
            </article>;
          })}
        </div>
      </section>)}
    </div>
  </section>;
}

function LessonPage({ page }: { page: AlgebraCoursePage }) {
  const lesson = page.lesson;
  if (!lesson || !page.unit) return null;
  return <div className="algebra-textbook-lesson">
    <section className="limits-node limits-node-application algebra-lesson-opening"><header><span>Opening situation</span><h2>Start here</h2></header><div><p><AlgebraMathText value={lesson.opening.prompt} /></p><p><AlgebraMathText value={lesson.opening.purpose} /></p></div></section>
    <LessonList title="Prerequisite check" label="Before this lesson" items={lesson.prerequisiteChecks} />
    <section className="limits-node limits-node-exposition algebra-lesson-exposition"><header><span>Lesson text</span><h2>Explanation</h2></header><div>{lesson.exposition.map((paragraph) => <p key={paragraph}><AlgebraMathText value={paragraph} /></p>)}</div></section>
    {lesson.method && <section className="limits-node limits-node-method algebra-authored-method"><header><span>Method</span><h2><AlgebraMathText value={lesson.method.title} /></h2></header><div><ol>{lesson.method.steps.map((step) => <li key={step}><AlgebraMathText value={step} display="auto" /></li>)}</ol><p><strong>Check:</strong> <AlgebraMathText value={lesson.method.check} display="auto" /></p></div></section>}
    <section className="limits-node limits-node-method algebra-lesson-definitions"><header><span>Reference</span><h2>Definitions and conditions</h2></header><div><dl>{lesson.definitions.map((definition) => <div key={definition.term}><dt><strong><AlgebraMathText value={definition.term} /></strong></dt><dd><AlgebraMathText value={definition.definition} />{definition.conditions && <small><AlgebraMathText value={definition.conditions} /></small>}</dd></div>)}</dl></div></section>
    {lesson.figures.length > 0 && <section className="algebra-figure-sequence" aria-label={`${lesson.title} function graphs`}>{lesson.figures.map((figure) => <figure className="limits-graph limits-graph-visual calculus-unit-visual" key={figure.id}>
      {figure.visual ? <BetterGradesVisual visual={figure.visual} /> : <p role="alert">This compiled figure is temporarily unavailable.</p>}
      <figcaption><strong>{lesson.title} · Figure {figure.id}</strong><p><AlgebraMathText value={figure.description} /></p>{figure.interactive && <small>Use the bounded control to compare states; the initial state remains available as a complete static figure.</small>}</figcaption>
    </figure>)}</section>}
    <section className="limits-node limits-node-example algebra-lesson-examples"><header><span>Examples</span><h2>Worked examples</h2></header><div className="algebra-worked-examples">{lesson.examples.map((example) => <article key={example.kind}><p className="eyebrow">{pageTypeLabel(example.kind)}</p><h3><AlgebraMathText value={example.prompt} display="auto" /></h3><ol>{example.steps.map((step) => <li key={step}><AlgebraMathText value={step} display="auto" /></li>)}</ol><p className="algebra-example-answer"><strong>Answer</strong><AlgebraMathText value={example.answer} display="auto" /></p><p><AlgebraMathText value={example.interpretation} /></p></article>)}</div></section>
    <LessonPractice lesson={lesson} />
    <section className="limits-node limits-node-caution algebra-lesson-caution"><header><span>Common mistakes</span><h2>Error analysis</h2></header><div>{lesson.misconceptions.map((item) => <article key={item.wrongMove}><p><strong>Wrong move:</strong> <AlgebraMathText value={item.wrongMove} display="auto" /></p><p><strong>Why it fails:</strong> <AlgebraMathText value={item.whyItFails} /></p><p><strong>Repair:</strong> <AlgebraMathText value={item.repair} display="auto" /></p></article>)}</div></section>
    <AttemptFirstPrompt prompt={{ id: lesson.checkpoint.id, lessonId: lesson.id, prompt: lesson.checkpoint.prompt, responseType: lesson.checkpoint.responseType }} />
    <LessonList title="Exit check" label="Before continuing" items={lesson.exitCheck.map((id) => lesson.practiceQuestions.find((question) => question.id === id)?.prompt ?? `Complete question ${id} from this lesson’s practice bank.`)} />
    <section className="limits-node limits-node-bridge algebra-lesson-takeaway"><header><span>Summary</span><h2>What to remember</h2></header><div><p><AlgebraMathText value={lesson.takeaway.summary} /></p><ul>{lesson.takeaway.conditions.map((condition) => <li key={condition}><AlgebraMathText value={condition} /></li>)}</ul><p><a href={lesson.navigation.practice}>Continue to unit practice →</a></p></div></section>
  </div>;
}

function AssessmentPage({ page }: { page: AlgebraCoursePage }) {
  const isKey = page.route.pageType === "answer-key";
  return <section className="algebra-assessment-page">
    <section className="limits-node limits-node-method"><header><span>{isKey ? "Response guide" : "Assessment"}</span><h2>{page.assessment?.questionCount ?? page.assessmentPrompts.length} concrete questions</h2></header><div>
      <p><strong>Suggested time:</strong> {page.assessment?.durationMinutes ?? "Work deliberately; no fixed timer supplied."} minutes.</p>
      <p><strong>Grading boundary:</strong> {page.assessment?.grading ?? "Open responses use a supplied rubric after an attempt."}</p>
      <p><strong>Cumulative share:</strong> {page.assessment?.cumulativeShare ?? "Connected to the matching assessment route."}</p>
      <p>Each question is fully authored and linked to a lesson skill. Detailed scoring criteria and worked solutions stay protected until a substantive attempt is submitted.</p>
      {page.assessment && <p><a className="button button-ghost" href={isKey ? page.assessment.path : page.assessment.answerRoute}>{isKey ? "Return to the assessment" : "Open the protected response guide"}</a></p>}
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
