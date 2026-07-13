"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- registry pages intentionally use document navigation for canonical routes */

import {
  courseLibraries,
  getCourseArticle,
  getCourseLibrary,
  getCourseTopic,
  getCourseTopicArticles,
  libraryCounts,
  libraryArticleHref,
  searchCourseLibrary,
  type CourseArticle,
} from "../lib/course-library";
import { archetypes } from "../lib/library";
import { getResourceRecord, tools } from "../lib/registry/catalog";
import { assessments } from "../lib/registry/practice";
import { LatexArticleDocument } from "./LatexArticle";

export { libraryArticleHref, libraryCounts };

const resourceGroups = [
  { id: "understand", title: "Understand the idea", description: "Direct answers and concept explanations that make the structure visible.", archetypes: ["answer", "concept"] },
  { id: "methods", title: "Work the method", description: "Repeatable procedures with worked examples and checks.", archetypes: ["method"] },
  { id: "decisions", title: "Choose a strategy", description: "Comparisons for the moments when several methods look possible.", archetypes: ["decision"] },
] as const;

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
  const freshGuides = courseLibraries
    .flatMap((course) => course.articles)
    .filter((article) => article.reviewed === "July 13, 2026")
    .slice(0, 6);
  return (
    <section className="topic-home-section section-pad">
      <div className="section-heading">
        <div><p className="eyebrow">Learn by course</p><h2>Pick the math you are actually doing.</h2></div>
        <p>Every course is organized by topic, then by the kind of help: direct answer, method, concept, or decision guide.</p>
      </div>
      <div className="course-home-grid">
        {courseLibraries.map((course) => <a href={`/subjects/math/${course.slug}/`} className="course-home-card" key={course.slug}><span>{course.mark}</span><div><small>{course.eyebrow}</small><h3>{course.name}</h3><p>{course.description}</p><em>{course.articles.length} full guides · {course.topics.length} topics</em></div><b>Browse {course.name.toLowerCase()} →</b></a>)}
      </div>
      <div className="fresh-guides-head"><div><p className="eyebrow">New in the library</p><h3>Fresh explanations, ready to use.</h3></div><p>Full lessons with rendered math, worked examples, mistakes to avoid, and a clear next move.</p></div>
      <div className="fresh-guides-list">{freshGuides.map((article, index) => <ArticleRow article={article} index={index} key={`${article.domainSlug}-${article.slug}`} />)}</div>
      <div className="topic-home-action"><a className="button button-ink" href="/subjects/math/">Browse all mathematics →</a><span>{libraryCounts.articles} worked guides · No account required</span></div>
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
  const topicResources = articles.map((article) => getResourceRecord(domainSlug, topicSlug, article.slug)).filter(Boolean);
  const relatedToolIds = Array.from(new Set(topicResources.flatMap((resource) => resource?.relatedToolIds ?? [])));
  const relatedAssessmentIds = Array.from(new Set(topicResources.flatMap((resource) => resource?.relatedAssessmentIds ?? [])));
  const topicTools = relatedToolIds.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean);
  const topicAssessments = relatedAssessmentIds.map((id) => assessments.find((assessment) => assessment.id === id)).filter(Boolean);
  return (
    <>
      <section className="topic-page-hero section-pad">
        <nav className="breadcrumbs"><a href="/subjects/">Subjects</a><span>/</span><a href="/subjects/math/">Mathematics</a><span>/</span><a href={`/subjects/math/${course.slug}/`}>{course.name}</a><span>/</span><span>{topic.name}</span></nav>
        <div className="topic-hero-grid"><div><p className="eyebrow">Topic {topic.sequence} of {course.topics.length}</p><h1>{topic.name}</h1><p>{topic.description}</p></div><span className="topic-big-number">{topic.accent}</span></div>
      </section>
      <section className="topic-page-body section-pad">
        <aside><strong>Inside this topic</strong><span>{articles.length} full resources</span><p>Start with the idea, work a method, then use a decision guide when the route is not obvious.</p><a href={`/subjects/math/${course.slug}/`}>All {course.name.toLowerCase()} topics →</a>{topicTools.map((tool) => <a href={tool!.path} key={tool!.id}>Use {tool!.title} →</a>)}{topicAssessments.slice(0, 1).map((assessment) => <a href={assessment!.path} key={assessment!.id}>Practice this topic →</a>)}</aside>
        <div className="topic-resource-groups">{resourceGroups.map((group) => { const groupArticles = articles.filter((article) => (group.archetypes as readonly string[]).includes(article.archetype)); if (!groupArticles.length) return null; return <section className="topic-resource-group" key={group.id}><header><span>{group.title}</span><p>{group.description}</p></header><div className="topic-article-list">{groupArticles.map((article) => <ArticleRow article={article} index={articles.indexOf(article)} key={article.slug} />)}</div></section>; })}</div>
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
  const resource = getResourceRecord(article.domainSlug, article.topicSlug, article.slug);
  const articleTools = (resource?.relatedToolIds ?? []).map((id) => tools.find((tool) => tool.id === id)).filter(Boolean);
  const articleAssessments = (resource?.relatedAssessmentIds ?? []).map((id) => assessments.find((assessment) => assessment.id === id)).filter(Boolean);

  return (
    <article className="library-article">
      <header className="library-article-header">
        <nav className="breadcrumbs"><a href="/subjects/">Subjects</a><span>/</span><a href="/subjects/math/">Mathematics</a><span>/</span><a href={`/subjects/math/${course.slug}/`}>{course.name}</a><span>/</span><a href={`/subjects/math/${course.slug}/${topic.slug}/`}>{topic.shortName}</a><span>/</span><span>{article.shortTitle}</span></nav>
        <p className="article-meta-line"><span>{archetype.label}</span><span>{article.course}</span><span>{article.difficulty}</span><span>{article.minutes} min</span></p>
        <h1>{article.title}</h1>
        <p>{article.deck}</p>
        <p className="article-source-line">LaTeX article <span aria-hidden="true">·</span> Updated {article.reviewed}</p>
      </header>

      <div className="latex-article-layout">
        <aside className="latex-article-rail">
          <strong>On this page</strong>
          {article.document.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</a>)}
          <div className="latex-article-links">
            <span>Put it to work</span>
            <a href={`/subjects/math/${course.slug}/${topic.slug}/`}><small>Topic map</small><b>{topic.name}</b></a>
            {articleTools.slice(0, 1).map((tool) => <a href={tool!.path} key={tool!.id}><small>Tool</small><b>{tool!.title}</b></a>)}
            {articleAssessments.slice(0, 1).map((assessment) => <a href={assessment!.path} key={assessment!.id}><small>Practice</small><b>{assessment!.title}</b></a>)}
          </div>
        </aside>

        <div className="latex-article-column">
          <LatexArticleDocument document={article.document} />
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
  const domainId = `domain-math-${domainSlug}`;
  const courseTools = tools.filter((tool) => tool.domainId === domainId);
  const courseAssessments = assessments.filter((assessment) => assessment.domainId === domainId);
  const startArticle = course.articles[0];
  return (
    <>
      <section className="subject-hero section-pad"><div><p className="eyebrow">{course.eyebrow}</p><h1>{course.name}</h1><p>{course.description}</p><small className="course-count-line">{course.articles.length} full guides · {course.topics.length} organized topics</small><div className="subject-hero-actions"><a className="button button-ink" href={`/search/?q=${course.slug}`}>Search {course.name.toLowerCase()}</a><a className="button button-ghost" href="/practice/">Open practice</a></div></div><div className="subject-mark">{course.mark}<span>{course.slug}</span></div></section>
      <section className="calculus-map section-pad">
        <div className="section-heading"><div><p className="eyebrow">The course map</p><h2>{course.topics.length} topics. One connected path.</h2></div><p>{course.promise}</p></div>
        <div className="calculus-map-list">{course.topics.map((topic) => <a href={`/subjects/math/${course.slug}/${topic.slug}/`} key={topic.slug}><span>{topic.accent}</span><div><b>{topic.name}</b><small>{topic.description}</small></div><em>{getCourseTopicArticles(course.slug, topic.slug).length} resources</em><i>→</i></a>)}</div>
      </section>
      <section className="calculus-tools section-pad"><div><p className="eyebrow">Put it to work</p><h2>Learn, calculate, practice.</h2></div>{startArticle && <a href={libraryArticleHref(startArticle)}><span>Start here</span><b>{startArticle.shortTitle}</b><small>Open the first guide →</small></a>}{courseTools.slice(0, 1).map((tool) => <a href={tool.path} key={tool.id}><span>Tool</span><b>{tool.title}</b><small>Open the interactive tool →</small></a>)}{courseAssessments.length ? courseAssessments.slice(0, 1).map((assessment) => <a href={assessment.path} key={assessment.id}><span>Practice</span><b>{assessment.title}</b><small>{assessment.questions.length} explained questions →</small></a>) : <a href={`/search/?q=${course.slug}`}><span>All content</span><b>{course.articles.length} complete guides</b><small>Search this course →</small></a>}</section>
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
