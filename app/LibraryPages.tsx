"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- registry pages intentionally use document navigation for canonical routes */

import { LIMITS_UNIT_PREFIX } from "../lib/calculus/limits-unit-index.mjs";
import {
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
import { trackFindabilityNavigation } from "../lib/learning-graph/analytics";
import { getResourceRecord, tools } from "../lib/registry/catalog";
import { assessments } from "../lib/registry/practice";
import { LatexArticleDocument } from "./LatexArticle";
import { CalculusCourseNavigation } from "./CalculusCourseNavigation";
import { CalculusUnitNavigation, UNIT_3A_ROOT } from "./CalculusUnitNavigation";
import { LimitsUnitMap } from "./LimitsUnitMap";
import { LearningPathLinks } from "./LearningPathLinks";

export { libraryArticleHref };

const resourceGroups = [
  { id: "understand", title: "Understand the idea", description: "Direct answers and concept explanations that make the structure visible.", archetypes: ["answer", "concept"] },
  { id: "methods", title: "Work the method", description: "Repeatable procedures with worked examples and checks.", archetypes: ["method"] },
  { id: "decisions", title: "Choose a strategy", description: "Comparisons for the moments when several methods look possible.", archetypes: ["decision"] },
] as const;

export function ArticleRow({ article, index, topicHubSourcePath }: { article: CourseArticle; index: number; topicHubSourcePath?: string }) {
  const archetype = archetypes[article.archetype];
  const destination = libraryArticleHref(article);
  return (
    <a
      className="library-row"
      href={destination}
      data-domain={article.domainSlug}
      onClick={topicHubSourcePath ? (event) => trackFindabilityNavigation(
        event,
        "topic_hub_destination_click",
        topicHubSourcePath,
        destination,
        {
          relationship_type: "hub_destination",
          placement: "topic-hub-listing",
          navigation_surface: "topic-hub",
          course: `course.math.${article.domainSlug}`,
          unit: "not-applicable",
          topic: `topic.math.${article.topicSlug}`,
        },
      ) : undefined}
    >
      <span className="library-row-number">{String(index + 1).padStart(2, "0")}</span>
      <span className="library-row-main"><small>{article.domainName} · {archetype.label}</small><b>{article.title}</b><em>{article.deck}</em></span>
      <span className="library-row-meta"><small>{article.course}</small><small>{archetypes[article.archetype].label}</small></span>
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
        {courseLibraries.map((course) => <a href={`/subjects/math/${course.slug}/`} className="course-home-card" key={course.slug}><span>{course.mark}</span><div><small>{course.eyebrow}</small><h3>{course.name}</h3><p>{course.description}</p><em>Connected guides and course maps</em></div><b>Browse {course.name.toLowerCase()} →</b></a>)}
      </div>
      <div className="fresh-guides-head"><div><p className="eyebrow">New in the library</p><h3>Fresh explanations, ready to use.</h3></div><p>Full lessons with rendered math, worked examples, mistakes to avoid, and a clear next move.</p></div>
      <div className="fresh-guides-list">{freshGuides.map((article, index) => <ArticleRow article={article} index={index} key={`${article.domainSlug}-${article.slug}`} />)}</div>
      <div className="topic-home-action"><a className="button button-ink" href="/subjects/math/">Browse all mathematics →</a><span>Worked guides · No account required</span></div>
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
  const isLimitsTopic = domainSlug === "calculus" && topicSlug === "limits-continuity";
  const isUnit3aTopic = domainSlug === "calculus" && topicSlug === "integration-techniques";
  return (
    <>
      <section className="topic-page-hero section-pad">
        <nav className="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/subjects/math/">Math</a><span>/</span><a href={`/subjects/math/${course.slug}/`}>{course.name}</a><span>/</span><span>{topic.name}</span></nav>
        <div className="topic-hero-grid"><div><p className="eyebrow">{course.name} course topic</p><h1>{topic.name}</h1><p>{topic.description}</p></div><span className="topic-big-number" aria-hidden="true">{course.mark}</span></div>
      </section>
      {isLimitsTopic && <LimitsUnitMap showSupporting topicPage />}
      {isUnit3aTopic && <section className="limits-unit-map section-pad" aria-label="Unit 3A textbook map connection"><CalculusUnitNavigation currentUnit="3A" compact /><section className="limits-exam-key-callout"><div><p className="eyebrow">Core textbook</p><h2>Begin with the complete Unit 3A map</h2><p>Follow antiderivatives, signed accumulation, Riemann sums, the Fundamental Theorem, integration methods, numerical integration, improper integrals, review, exams, and published answer keys as one connected sequence.</p></div><a className="button button-ink" href={UNIT_3A_ROOT}>Open Unit 3A: Integrals →</a></section></section>}
      <section className="topic-page-body section-pad">
        <aside><strong>{isLimitsTopic || isUnit3aTopic ? "Beyond the textbook" : "Inside this topic"}</strong><span>{isLimitsTopic || isUnit3aTopic ? "Focused deep-dive articles" : "Guides, examples, and decision support"}</span><p>{isLimitsTopic || isUnit3aTopic ? "Use these focused explorations after the core map when one idea deserves a slower, closer look." : "Start with the idea, work a method, then use a decision guide when the route is not obvious."}</p>{isLimitsTopic && <a className="limits-unit-topic-link" href={LIMITS_UNIT_PREFIX}>Open every unit resource →</a>}{isUnit3aTopic && <a className="limits-unit-topic-link" href={UNIT_3A_ROOT}>Open the Unit 3A map →</a>}<a href={`/subjects/math/${course.slug}/`}>All {course.name.toLowerCase()} topics →</a>{topicTools.map((tool) => <a href={tool!.path} key={tool!.id}>Use {tool!.title} →</a>)}{topicAssessments.slice(0, 1).map((assessment) => <a href={assessment!.path} key={assessment!.id}>Practice this topic →</a>)}</aside>
        <div className="topic-resource-groups">{(isLimitsTopic || isUnit3aTopic) && <header className="topic-explorations-intro"><p className="eyebrow">Further exploration</p><h2>Deep dives and extra articles</h2><p>The core map above is the textbook. These articles are side trails: close readings of one method, a single integral, or a conceptual distinction that rewards more time and more examples.</p></header>}{resourceGroups.map((group) => { const groupArticles = articles.filter((article) => (group.archetypes as readonly string[]).includes(article.archetype)); if (!groupArticles.length) return null; return <section className="topic-resource-group" key={group.id}><header><span>{group.title}</span><p>{group.description}</p></header><div className="topic-article-list">{groupArticles.map((article) => <ArticleRow article={article} index={articles.indexOf(article)} topicHubSourcePath={`/subjects/math/${course.slug}/${topic.slug}/`} key={article.slug} />)}</div></section>; })}</div>
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
  const resource = getResourceRecord(article.domainSlug, article.topicSlug, article.slug);
  const articleTools = (resource?.relatedToolIds ?? []).map((id) => tools.find((tool) => tool.id === id)).filter(Boolean);
  const articleAssessments = (resource?.relatedAssessmentIds ?? []).map((id) => assessments.find((assessment) => assessment.id === id)).filter(Boolean);
  const isUnit2aArticle = article.domainSlug === "calculus" && article.topicSlug === "derivatives";
  const isUnit2bArticle = article.domainSlug === "calculus" && article.topicSlug === "derivative-applications";
  const isUnit3aArticle = article.domainSlug === "calculus" && article.topicSlug === "integration-techniques";
  const isUnit3bArticle = article.domainSlug === "calculus" && article.topicSlug === "integration-applications";
  const articleUnit = isUnit2aArticle ? "2A" : isUnit2bArticle ? "2B" : isUnit3aArticle ? "3A" : isUnit3bArticle ? "3B" : undefined;
  const legacySeriesTargets: Record<string, string> = {
    "/subjects/math/calculus/sequences-series/geometric-series/": "/subjects/math/calculus/sequences-and-series/geometric-series/",
    "/subjects/math/calculus/sequences-series/choosing-convergence-test/": "/subjects/math/calculus/sequences-and-series/choosing-a-convergence-test/",
    "/subjects/math/calculus/sequences-series/power-series-interval-of-convergence/": "/subjects/math/calculus/power-series-and-taylor-series/radius-and-interval-of-convergence/",
    "/subjects/math/calculus/sequences-series/taylor-series-remainder/": "/subjects/math/calculus/power-series-and-taylor-series/taylor-remainder-theorem/",
  };
  const articleHref = (candidate: CourseArticle) => legacySeriesTargets[libraryArticleHref(candidate)] ?? libraryArticleHref(candidate);
  const topicHref = article.domainSlug === "calculus" && article.topicSlug === "sequences-series"
    ? "/subjects/math/calculus/sequences-and-series/"
    : `/subjects/math/${course.slug}/${topic.slug}/`;

  return (
    <article className="library-article">
      <header className="library-article-header">
        <nav className="breadcrumbs" aria-label="Article location"><a href={`/subjects/math/${course.slug}/`}>{course.name}</a><span>/</span><a href={topicHref}>{topic.shortName}</a></nav>
        <p className="article-meta-line"><span>{archetype.label}</span><span>Calculus I · {articleUnit ? `Unit ${articleUnit}` : article.course}</span><span>{article.difficulty}</span></p>
        <h1>{article.title}</h1>
        <p>{article.deck}</p>
        <p className="article-source-line">LaTeX article <span aria-hidden="true">·</span> Updated {article.reviewed}</p>
      </header>

      <div className="latex-article-layout">
        <div className="latex-article-column">
          <LatexArticleDocument document={article.document} />
          <LearningPathLinks sourcePath={libraryArticleHref(article)} placement="article-intro" variant="primary" />
          <LearningPathLinks sourcePath={libraryArticleHref(article)} placement="article-footer" variant="secondary" />
        </div>
        <aside className="latex-article-rail">
          <details>
            <summary>Article outline</summary>
            {article.document.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</a>)}
          </details>
          <div className="latex-article-links">
            <span>Put it to work</span>
            <a href={topicHref}><small>Topic map</small><b>{topic.name}</b></a>
            {articleTools.slice(0, 1).map((tool) => <a href={tool!.path} key={tool!.id}><small>Tool</small><b>{tool!.title}</b></a>)}
            {articleAssessments.slice(0, 1).map((assessment) => <a href={assessment!.path} key={assessment!.id}><small>Practice</small><b>{assessment!.title}</b></a>)}
          </div>
        </aside>
      </div>

      <nav className="article-sequence" aria-label="Adjacent articles">
        {previous ? <a href={articleHref(previous)}><small>← Previous in {topic.shortName}</small><b>{previous.shortTitle}</b></a> : <a href={topicHref}><small>← Topic overview</small><b>{topic.name}</b></a>}
        {next ? <a href={articleHref(next)}><small>Next in {topic.shortName} →</small><b>{next.shortTitle}</b></a> : nextTopic ? <a href={`/subjects/math/${course.slug}/${nextTopic.slug}/`}><small>Next topic →</small><b>{nextTopic.name}</b></a> : <a href={`/subjects/math/${course.slug}/`}><small>Course overview →</small><b>All {course.name.toLowerCase()} topics</b></a>}
      </nav>
    </article>
  );
}

export function OwnedLibraryArticleContent({ domainSlug, topicSlug, articleSlug, ownerHref }: { domainSlug: string; topicSlug: string; articleSlug: string; ownerHref: string }) {
  const article = getCourseArticle(domainSlug, topicSlug, articleSlug);
  if (!article) return null;
  return <><LibraryArticleContent article={article} /><aside className="callout seo-ownership-links" aria-label="Related complete lesson"><span>RELATED LEARNING PATH</span><h2>Choose the depth that matches your goal.</h2><a href={ownerHref}>Study the complete textbook lesson →</a></aside></>;
}

export function CourseHubContent({ domainSlug }: { domainSlug: string }) {
  const course = getCourseLibrary(domainSlug);
  if (!course) return null;
  const domainId = `domain-math-${domainSlug}`;
  const courseTools = tools.filter((tool) => tool.domainId === domainId);
  const courseAssessments = assessments.filter((assessment) => assessment.domainId === domainId);
  const startArticle = course.articles[0];
  const startPath = domainSlug === "calculus" ? "/subjects/math/calculus/limits-continuity/" : startArticle ? libraryArticleHref(startArticle) : `/subjects/math/${course.slug}/`;
  return (
    <>
      <section className="subject-hero section-pad"><div><p className="eyebrow">{course.eyebrow}</p><h1>{course.name}</h1><p>{course.description}</p><div className="subject-hero-actions"><a className="button button-ink" href={startPath}>{domainSlug === "calculus" ? "Start Calculus" : `Start ${course.name}`}</a><a className="button button-ghost" href={domainSlug === "calculus" ? "/practice/math/calculus/" : `/search/?q=${course.slug}`}>{domainSlug === "calculus" ? "Practice the course" : `Search ${course.name.toLowerCase()}`}</a></div></div><div className="subject-mark">{course.mark}<span>{course.slug}</span></div></section>
      {domainSlug === "calculus" ? <CalculusCourseNavigation currentPath="/subjects/math/calculus/" /> : <section className="calculus-map section-pad">
        <div className="section-heading"><div><p className="eyebrow">The course map</p><h2>One connected path.</h2></div><p>{course.promise}</p></div>
        <div className="calculus-map-list">{course.topics.map((topic) => <a href={`/subjects/math/${course.slug}/${topic.slug}/`} key={topic.slug}><span aria-hidden="true">{course.mark}</span><div><b>{topic.name}</b><small>{topic.description}</small></div><em>Open topic</em><i>→</i></a>)}</div>
      </section>}
      {domainSlug === "calculus" && <section className="calculus-resource-paths section-pad" aria-labelledby="calculus-supporting-paths"><div><p className="eyebrow">Practice and reference</p><h2 id="calculus-supporting-paths">Support the course without losing the sequence.</h2><p>Chapters and lessons stay primary. Choose a supporting destination for the exact job you need next.</p></div><div>
        <a href="/subjects/math/calculus/worksheets/"><span>Practice</span><b>Calculus worksheets</b><small>Focused practice with complete solutions →</small></a>
        <a href="/subjects/math/calculus/practice-exams/"><span>Practice</span><b>Practice exams</b><small>Cumulative preparation and answer keys →</small></a>
        <a href="/subjects/math/calculus/formula-sheets/"><span>Reference</span><b>Formula sheets</b><small>Rules, conditions, and compact reminders →</small></a>
        <a href="/subjects/math/calculus/worked-problems/"><span>Worked examples</span><b>Worked problems</b><small>Complete solutions organized by skill →</small></a>
        <a href="/subjects/math/calculus/integration-techniques/"><span>Quick explanations</span><b>Calculus articles</b><small>Focused explanations with distinct search purposes →</small></a>
      </div></section>}
      <section className="calculus-tools section-pad"><div><p className="eyebrow">{domainSlug === "calculus" ? "References and tools" : "Supporting paths"}</p><h2>{domainSlug === "calculus" ? "Check a definition, method, or result." : "Practice and look things up."}</h2></div>{domainSlug !== "calculus" && startArticle && <a href={libraryArticleHref(startArticle)}><span>Quick explanation</span><b>{startArticle.shortTitle}</b><small>Open the first published guide →</small></a>}{courseTools.slice(0, 1).map((tool) => <a href={tool.path} key={tool.id}><span>Tool</span><b>{tool.title}</b><small>Open the interactive tool →</small></a>)}{courseAssessments.length ? courseAssessments.slice(0, 1).map((assessment) => <a href={assessment.path} key={assessment.id}><span>Practice</span><b>{assessment.title}</b><small>Open explained practice →</small></a>) : <a href={`/search/?q=${course.slug}`}><span>Reference</span><b>Search {course.name}</b><small>Find a definition or example →</small></a>}</section>
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
  return <div className="library-search-group"><div className="results-head"><h2>Guides and explanations</h2><span>Best matches for this search</span></div>{results.map((article, index) => <ArticleRow article={article} index={index} key={`${article.domainSlug}-${article.slug}`} />)}</div>;
}
