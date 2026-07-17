"use client";

import { limitsUnitChapters, limitsUnitRoutes } from "../lib/calculus/limits-unit-index.mjs";

const routeLabels: Record<string, string> = {
  diagnostic: "Diagnostic",
  "answer-key": "Answer key",
  exam: "Practice exam",
  extension: "Extension",
  hub: "Overview",
  lesson: "Lesson",
  practice: "Practice set",
  quiz: "Concept quiz",
  reference: "Reference",
  review: "Review",
  study: "Study guide",
};

export function LimitsUnitMap({ showSupporting = true, topicPage = false }: { showSupporting?: boolean; topicPage?: boolean }) {
  const supporting = limitsUnitRoutes.filter((route) => !route.isCoreSequence && route.pageType !== "answer-key");
  const answerKeys = limitsUnitRoutes.filter((route) => route.pageType === "answer-key");
  return (
    <section className={`limits-unit-map${topicPage ? " limits-topic-map" : ""}`} aria-label="Limits and Continuity textbook map">
      <header className="limits-map-intro">
        <div>
          <p className="eyebrow">Core textbook</p>
          <h2>The complete textbook path</h2>
        </div>
        <p>Follow 47 core pages in order, from the first neighborhood idea to formal epsilon-delta reasoning. Each section mixes explanation, guided examples, short checks, and deliberate review.</p>
      </header>
      <div className="limits-map-stats" aria-label="Unit size">
        <span><b>47</b> core pages</span>
        <span><b>7</b> connected sections</span>
        <span><b>38</b> interactive checks</span>
        <span><b>24</b> practice and reference extras</span>
      </div>
      <div className="limits-chapter-map">
        {limitsUnitChapters.map((chapter) => (
          <section className="limits-chapter" id={`unit-${chapter.id}`} key={chapter.id}>
            <header>
              <div><span>{String(chapter.from).padStart(2, "0")}–{String(chapter.to).padStart(2, "0")}</span><h3>{chapter.title}</h3></div>
              <p>{chapter.description}</p>
            </header>
            <aside className="limits-reading-lens limits-map-lens" aria-label={`${chapter.title} reading lens`}>
              <span>Reading lens</span>
              <p>{chapter.lens}</p>
            </aside>
            <ol>
              {chapter.routes.map((route) => (
                <li key={route.path}>
                  <a href={route.path}>
                    <span>{String(route.coreSequenceIndex).padStart(2, "0")}</span>
                    <b>{route.h1}</b>
                    <small>{routeLabels[route.pageType] ?? route.pageType.replaceAll("-", " ")}</small>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      {showSupporting && <>
        <header className="limits-map-intro limits-map-support-heading">
          <div><p className="eyebrow">Practice around the path</p><h2>Reviews, quizzes, references, and exams</h2></div>
          <p>Use these between sections, after a confusing lesson, or as a mixed rehearsal before an exam. They support the sequence without interrupting it.</p>
        </header>
        <div className="limits-support-grid">{supporting.map((route) => <a href={route.path} key={route.path}><span>{routeLabels[route.pageType] ?? route.pageType.replaceAll("-", " ")}</span><b>{route.h1}</b><small>{route.description}</small></a>)}</div>
      </>}
      <section className="limits-answer-key-map" aria-labelledby="limits-answer-key-heading">
        <div><p className="eyebrow">Check your work</p><h2 id="limits-answer-key-heading">Exam answer keys</h2><p>Finish an honest attempt, then compare one problem at a time. Every supplied exam answer is published and source-traced.</p></div>
        <div>{answerKeys.map((route) => <a href={route.path} key={route.path}><span>Complete key</span><b>{route.h1}</b><small>{route.description}</small><strong>Open answer key {"\u2192"}</strong></a>)}</div>
      </section>
    </section>
  );
}
