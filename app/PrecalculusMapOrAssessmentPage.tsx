"use client";

import { FormEvent, useEffect, useState } from "react";
import type { PrecalculusCoursePage, PrecalculusPrompt } from "../lib/precalculus/precalculus-course.mjs";
import { AlgebraMathText } from "./AlgebraMathText";

function Attempt({ prompt, label }: { prompt: PrecalculusPrompt; label: string }) {
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState("Write a complete attempt before opening the response guide.");
  const [answer, setAnswer] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  async function check(event: FormEvent) {
    event.preventDefault(); setBusy(true);
    try {
      const response = await fetch("/api/precalculus-course-check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: prompt.id, answer: text }) });
      const result = await response.json() as { revealAllowed?: boolean; feedback?: string; error?: string };
      if (!response.ok && response.status !== 422) throw new Error(result.error ?? "The checker could not review this response.");
      setReady(result.revealAllowed === true); setFeedback(result.feedback ?? "Review your work and try again.");
    } catch (error) { setFeedback(error instanceof Error ? error.message : "The checker could not be reached."); } finally { setBusy(false); }
  }
  async function reveal() {
    if (!ready || busy || answer) return;
    setBusy(true);
    try {
      const response = await fetch("/api/precalculus-course-reveal", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: prompt.id, attempt: text }) });
      const result = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !result.answer) throw new Error(result.error ?? "The guide could not be loaded.");
      setAnswer(result.answer);
    } catch (error) { setFeedback(error instanceof Error ? error.message : "The guide could not be reached."); } finally { setBusy(false); }
  }
  return <section className="limits-check algebra-attempt precalculus-attempt is-compact" id={prompt.id}><header><span>{label}</span><code>{String(prompt.sequence).padStart(2, "0")}</code></header><p className="limits-check-prompt"><AlgebraMathText value={prompt.prompt} display="auto" /></p>{hydrated ? <><form onSubmit={check}><label htmlFor={`${prompt.id}-answer`}>Your answer and supporting work</label><textarea id={`${prompt.id}-answer`} value={text} onChange={(event) => setText(event.target.value)} rows={3} required /><button className="button button-ink" type="submit" disabled={busy}>{busy ? "Reviewing…" : "Submit attempt"}</button></form><p className="limits-check-feedback is-uncertain" aria-live="polite">{feedback}</p><details className="limits-disclosure" onToggle={(event) => { if (event.currentTarget.open) void reveal(); }}><summary>{ready ? "Compare with the response guide" : "Validated attempt required to unlock"}</summary>{answer ? <p><AlgebraMathText value={answer} display="auto" /></p> : <p>{ready ? "Loading the response guide…" : "Submit work that satisfies the declared policy first."}</p>}</details></> : <p className="honest-note">The complete prompt remains readable and printable without JavaScript.</p>}</section>;
}

function CourseHub({ page }: { page: PrecalculusCoursePage }) {
  return <section className="limits-unit-map calculus-unit-map algebra-course-map precalculus-course-map" aria-label="Precalculus course map"><header className="limits-map-intro precalculus-map-intro"><img src="/og-precalculus.png" alt="Precalculus course function curve and coordinate grid" /><div><p className="eyebrow">Continuous course</p><h2>Functions, models, and change</h2><p>Open a unit to follow its lesson and assessment sequence.</p></div></header><p><a className="button button-ink" href="/subjects/math/precalculus/final-assessment/">Open the 64-item final assessment</a></p><div className="calculus-chapter-list algebra-course-unit-list">{page.units.map((unit) => <details className="calculus-chapter algebra-course-unit" key={unit.id}><summary><span className="calculus-chapter-number">Unit {unit.sequence}</span><span className="calculus-chapter-title"><b>{unit.title}</b><small>{unit.description}</small></span><span className="calculus-chapter-course">{unit.lessonCount} lessons</span><span className="calculus-chapter-toggle" aria-hidden="true">+</span></summary><div className="calculus-chapter-units"><section className="calculus-chapter-unit algebra-course-unit-card"><header><span>Precalculus</span><h3>{unit.title}</h3><p>{unit.description}</p><a href={unit.root}>Open the unit map <span aria-hidden="true">→</span></a></header><nav aria-label={`${unit.title} lessons`}>{unit.lessons.map((lesson) => <a href={lesson.path} key={lesson.id}><span>{String(lesson.sequence).padStart(2, "0")}</span><b>{lesson.title}</b><i aria-hidden="true">→</i></a>)}</nav></section></div></details>)}</div></section>;
}

function UnitHub({ page }: { page: PrecalculusCoursePage }) {
  if (!page.unit) return null;
  return <section className="limits-unit-map calculus-unit-map algebra-unit-map precalculus-unit-map" aria-label={`${page.unit.title} map`}><header className="limits-map-intro"><div><p className="eyebrow">Precalculus · Unit {page.unit.sequence}</p><h2>The lesson path</h2></div><p>{page.unit.description}</p></header><div className="limits-chapter-map"><section className="limits-chapter"><header><div><span>Core sequence</span><h3>{page.unit.title}</h3></div><p>Move in order or enter at the exact skill you need.</p></header><ol>{page.unit.lessons.map((lesson) => <li key={lesson.path}><a href={lesson.path}><span>{String(lesson.sequence).padStart(2, "0")}</span><b>{lesson.title}</b><small><AlgebraMathText value={lesson.outcome} /></small></a></li>)}</ol></section></div><section className="limits-node limits-node-exercise"><header><span>Assessment path</span><h2>Review, practice, demonstrate, investigate</h2></header><div><nav className="resource-download-grid" aria-label={`${page.unit.title} assessments`}>{page.unit.assessments.map((assessment) => <a href={assessment.path} key={assessment.id}><strong>{assessment.title}</strong><span>{assessment.itemCount} concrete items</span></a>)}</nav></div></section><section className="limits-node limits-node-summary"><header><span>Source record</span><h2>References used for this unit</h2></header><div><ul>{page.unit.sources.map((source) => <li key={source}>{source}</li>)}</ul></div></section></section>;
}

function Assessment({ page }: { page: PrecalculusCoursePage }) {
  if (!page.assessment) return null;
  const assessment = page.assessment;
  return <div className="algebra-textbook-lesson precalculus-textbook-lesson precalculus-assessment-page"><section className="limits-node limits-node-application"><header><span>{assessment.type.replaceAll("-", " ")}</span><h2>{assessment.items.length} concrete {assessment.type === "investigation" ? "stages" : "items"}</h2></header><div><p>{assessment.description}</p>{assessment.rubric ? <><h3>Investigation rubric</h3><ol>{assessment.rubric.stages.map((stage) => <li key={stage}>{stage}</li>)}</ol></> : null}</div></section><section className="limits-node limits-node-exercise algebra-foundation-practice precalculus-practice"><header><span>Assessment</span><h2>Complete every required response</h2></header><div className="algebra-practice-groups">{assessment.items.map((prompt) => <div key={`${assessment.id}-${prompt.id}`}><Attempt prompt={prompt} label={`Item ${prompt.sequence}`} /><p className="honest-note"><a href={prompt.remediationTarget}>Repair this skill</a> · Policy: {prompt.expectedAnswerPolicy.replaceAll("_", " ")}</p></div>)}</div></section><nav className="lesson-position" aria-label="Assessment course progress"><a href={assessment.navigation.parent.path}>{assessment.navigation.parent.title}</a><a href={assessment.navigation.courseProgress.path}>{assessment.navigation.courseProgress.title}</a></nav></div>;
}

export default function PrecalculusMapOrAssessmentPage({ page }: { page: PrecalculusCoursePage }) {
  if (page.route.pageType === "course-hub") return <CourseHub page={page} />;
  if (page.route.pageType === "unit-hub") return <UnitHub page={page} />;
  return <Assessment page={page} />;
}
