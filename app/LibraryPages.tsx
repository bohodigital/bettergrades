"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- registry pages intentionally use document navigation for canonical routes */

import {
  allLibraryArticles,
  courseLibraries,
  getCourseArticle,
  getCourseLibrary,
  getCourseTopic,
  getCourseTopicArticles,
  libraryArticleHref,
  searchCourseLibrary,
  type CourseArticle,
} from "../lib/course-library";
import { archetypes } from "../lib/library";
import { Math } from "./Math";

export { libraryArticleHref };

export function ArticleRow({ article, index }: { article: CourseArticle; index: number }) {
  const archetype = archetypes[article.archetype];
  return (
    <a className="library-row" href={libraryArticleHref(article)} data-domain={article.domainSlug}>
      <span className="library-row-number">{String(index + 1).padStart(2, "0")}</span>
      <span className="library-row-main"><small>{article.domainName} · {archetype.label}</small><b>{article.title}</b><em>{article.deck}</em></span>
      <span className="library-row-meta"><small>{article.course}</small><small>{article.minutes} min</small></span>
      <span className="library-row-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export function LibraryHomeSection() {
  return (
    <section className="topic-home-section section-pad">
      <div className="section-heading">
        <div><p className="eyebrow">Learn by course</p><h2>Pick the math you are actually doing.</h2></div>
        <p>Every course is organized by topic, then by the kind of help: direct answer, method, concept, or decision guide.</p>
      </div>
      <div className="course-home-grid">
        {courseLibraries.map((course) => <a href={`/subjects/math/${course.slug}/`} className="course-home-card" key={course.slug}><span>{course.mark}</span><div><small>{course.eyebrow}</small><h3>{course.name}</h3><p>{course.description}</p><em>{course.articles.length} full guides · {course.topics.length} topics</em></div><b>Browse {course.name.toLowerCase()} →</b></a>)}
      </div>
      <div className="topic-home-action"><a className="button button-ink" href="/subjects/math/">Browse all mathematics →</a><span>60 reviewed guides · No account required</span></div>
    </section>
  );
}

export function TopicsHubContent() {
  return <CourseHubContent domainSlug="calculus" />;
}

export function TopicContent({ domainSlug, topicSlug }: { domainSlug: string; topicSlug: string }) {
  const course = getCourseLibrary(domainSlug);
  const topic = getCourseTopic(domainSlug, topicSlug);
  if (!course || !topic) return null;
  const articles = getCourseTopicArticles(domainSlug, topicSlug);
  const index = course.topics.findIndex((item) => item.slug === topicSlug);
  const previous = course.topics[index - 1];
  const next = course.topics[index + 1];
  return (
    <>
      <section className="topic-page-hero section-pad">
        <nav className="breadcrumbs"><a href="/subjects/">Subjects</a><span>/</span><a href="/subjects/math/">Mathematics</a><span>/</span><a href={`/subjects/math/${course.slug}/`}>{course.name}</a><span>/</span><span>{topic.name}</span></nav>
        <div className="topic-hero-grid"><div><p className="eyebrow">Topic {topic.sequence} of {course.topics.length}</p><h1>{topic.name}</h1><p>{topic.description}</p></div><span className="topic-big-number">{topic.accent}</span></div>
      </section>
      <section className="topic-page-body section-pad">
        <aside><strong>Inside this topic</strong><span>{articles.length} full resources</span><p>Read in sequence, or use the format labels to choose the kind of explanation you need.</p><a href={`/subjects/math/${course.slug}/`}>All {course.name.toLowerCase()} topics →</a></aside>
        <div className="topic-article-list">{articles.map((article, articleIndex) => <ArticleRow article={article} index={articleIndex} key={article.slug} />)}</div>
      </section>
      <nav className="topic-sequence section-pad" aria-label="Adjacent topics">
        {previous ? <a href={`/subjects/math/${course.slug}/${previous.slug}/`}><small>← Previous topic</small><b>{previous.name}</b></a> : <span />}
        {next ? <a href={`/subjects/math/${course.slug}/${next.slug}/`}><small>Next topic →</small><b>{next.name}</b></a> : <a href={`/subjects/math/${course.slug}/`}><small>Course overview →</small><b>All {course.name.toLowerCase()} topics</b></a>}
      </nav>
    </>
  );
}

export function LibraryArticleContent({ article }: { article: CourseArticle }) {
  const course = getCourseLibrary(article.domainSlug)!;
  const topic = getCourseTopic(article.domainSlug, article.topicSlug)!;
  const topicArticles = getCourseTopicArticles(article.domainSlug, article.topicSlug);
  const currentIndex = topicArticles.findIndex((item) => item.slug === article.slug);
  const previous = topicArticles[currentIndex - 1];
  const next = topicArticles[currentIndex + 1];
  const topicIndex = course.topics.findIndex((item) => item.slug === article.topicSlug);
  const nextTopic = course.topics[topicIndex + 1];
  const archetype = archetypes[article.archetype];
  const related = article.related.map((slug) => course.articles.find((item) => item.slug === slug)).filter(Boolean) as CourseArticle[];

  return (
    <article className="library-article">
      <header className="library-article-header">
        <nav className="breadcrumbs"><a href="/subjects/">Subjects</a><span>/</span><a href="/subjects/math/">Mathematics</a><span>/</span><a href={`/subjects/math/${course.slug}/`}>{course.name}</a><span>/</span><a href={`/subjects/math/${course.slug}/${topic.slug}/`}>{topic.shortName}</a><span>/</span><span>{article.shortTitle}</span></nav>
        <div className="article-format-line"><span>{archetype.label}</span><span>{article.course}</span><span>{article.difficulty}</span><span>{article.minutes} min read</span></div>
        <h1>{article.title}</h1>
        <p>{article.deck}</p>
        {article.formula && <Math tex={article.formula} display className="library-header-formula" />}
      </header>

      <div className="archetype-note"><span>{archetype.label}</span><p>{archetype.promise}</p><b>Reviewed {article.reviewed}</b></div>

      {article.immediate && <section className="library-immediate"><div><span>{article.immediate.label}</span><b>Start here</b></div><div>{article.immediate.tex && <Math tex={article.immediate.tex} display className="library-immediate-formula" />}<p>{article.immediate.text}</p></div></section>}

      <div className="library-reading-layout">
        <aside className="article-toc">
          <strong>On this page</strong>
          {article.sections.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`}><span>0{index + 1}</span>{section.heading}</a>)}
          <a href="#worked-example"><span>0{article.sections.length + 1}</span>Worked example</a>
          <a href="#mistakes"><span>0{article.sections.length + 2}</span>Common mistakes</a>
        </aside>

        <div className="library-reading-column">
          {article.sections.map((section, index) => <section id={`section-${index + 1}`} className="library-prose-section" key={section.heading}><span className="section-index">0{index + 1}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.tex && <Math tex={section.tex} display className="section-formula" />}</section>)}

          <section className="worked-example" id="worked-example">
            <div className="worked-example-head"><span>Worked example</span><b>{article.example.heading}</b></div>
            <h2>{article.example.prompt}</h2>
            <div className="worked-steps">{article.example.steps.map((step, index) => <div key={`${step.tex}-${index}`}><span>{index + 1}</span><Math tex={step.tex} display /><p>{step.note}</p></div>)}</div>
            <div className="worked-result"><span>Result</span><Math tex={article.example.result} display /></div>
          </section>

          <section className="mistake-takeaway-grid" id="mistakes">
            <div><span>Watch for</span><h2>Common mistakes</h2><ol>{article.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ol></div>
            <div><span>Keep</span><h2>Three takeaways</h2><ol>{article.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ol></div>
          </section>

          <section className="related-library"><div><p className="eyebrow">Continue the path</p><h2>Related resources</h2></div>{related.map((item) => <a href={libraryArticleHref(item)} key={item.slug}><span>{archetypes[item.archetype].label}</span><b>{item.title}</b><i>→</i></a>)}</section>
        </div>
      </div>

      <nav className="article-sequence" aria-label="Adjacent articles">
        {previous ? <a href={libraryArticleHref(previous)}><small>← Previous in {topic.shortName}</small><b>{previous.shortTitle}</b></a> : <a href={`/subjects/math/${course.slug}/${topic.slug}/`}><small>← Topic overview</small><b>{topic.name}</b></a>}
        {next ? <a href={libraryArticleHref(next)}><small>Next in {topic.shortName} →</small><b>{next.shortTitle}</b></a> : nextTopic ? <a href={`/subjects/math/${course.slug}/${nextTopic.slug}/`}><small>Next topic →</small><b>{nextTopic.name}</b></a> : <a href={`/subjects/math/${course.slug}/`}><small>Course overview →</small><b>All {course.name.toLowerCase()} topics</b></a>}
      </nav>
    </article>
  );
}

export function CourseHubContent({ domainSlug }: { domainSlug: string }) {
  const course = getCourseLibrary(domainSlug);
  if (!course) return null;
  return (
    <>
      <section className="subject-hero section-pad"><div><p className="eyebrow">{course.eyebrow}</p><h1>{course.name}</h1><p>{course.description}</p><small className="course-count-line">{course.articles.length} full guides · {course.topics.length} organized topics</small><div className="subject-hero-actions"><a className="button button-ink" href={`/search/?q=${course.slug}`}>Search {course.name.toLowerCase()}</a><a className="button button-ghost" href="/practice/">Open practice</a></div></div><div className="subject-mark">{course.mark}<span>{course.slug}</span></div></section>
      <section className="calculus-map section-pad">
        <div className="section-heading"><div><p className="eyebrow">The course map</p><h2>{course.topics.length} topics. One connected path.</h2></div><p>{course.promise}</p></div>
        <div className="calculus-map-list">{course.topics.map((topic) => <a href={`/subjects/math/${course.slug}/${topic.slug}/`} key={topic.slug}><span>{topic.accent}</span><div><b>{topic.name}</b><small>{topic.description}</small></div><em>{getCourseTopicArticles(course.slug, topic.slug).length} resources</em><i>→</i></a>)}</div>
      </section>
      {course.slug === "calculus" && <section className="calculus-tools section-pad"><div><p className="eyebrow">Put it to work</p><h2>Learn, calculate, practice.</h2></div><a href="/tools/math/calculus/integration-method-finder/"><span>Tool</span><b>Integration Method Finder</b><small>Choose a first move →</small></a><a href="/practice/math/calculus/quizzes/integration-method-selection/"><span>Quiz</span><b>Method selection</b><small>10 focused questions →</small></a><a href="/practice/math/calculus/diagnostics/calculus-readiness/"><span>Diagnostic</span><b>Calculus readiness</b><small>Find prerequisite gaps →</small></a></section>}
    </>
  );
}

export function CalculusHubContent() { return <CourseHubContent domainSlug="calculus" />; }
export function AlgebraHubContent() { return <CourseHubContent domainSlug="algebra" />; }
export function getArticle(domainSlug: string, topicSlug: string, articleSlug: string) { return getCourseArticle(domainSlug, topicSlug, articleSlug); }
export function searchLibrary(query: string) { return searchCourseLibrary(query); }

export function LibrarySearchResults({ query, limit = 8, domain = "all" }: { query: string; limit?: number; domain?: string }) {
  const results = searchLibrary(query).filter((article) => domain === "all" || article.domainSlug === domain).slice(0, limit);
  if (!results.length) return null;
  return <div className="library-search-group"><div className="results-head"><h2>Guides and explanations</h2><span>{results.length} useful matches</span></div>{results.map((article, index) => <ArticleRow article={article} index={index} key={`${article.domainSlug}-${article.slug}`} />)}</div>;
}

export const libraryCounts = { courses: courseLibraries.length, topics: courseLibraries.reduce((sum, course) => sum + course.topics.length, 0), articles: allLibraryArticles.length };
