"use client";

import { archetypes, getTopic, getTopicArticles, libraryArticles, libraryTopics, type LibraryArticle } from "../lib/library";
import { Math } from "./Math";

function articleHref(article: LibraryArticle) {
  return `/library/${article.topicSlug}/${article.slug}/`;
}

function ArticleRow({ article, index }: { article: LibraryArticle; index: number }) {
  const archetype = archetypes[article.archetype];
  return (
    <a className="library-row" href={articleHref(article)}>
      <span className="library-row-number">{String(index + 1).padStart(2, "0")}</span>
      <span className="library-row-main"><small>{archetype.label}</small><b>{article.title}</b><em>{article.deck}</em></span>
      <span className="library-row-meta"><small>{article.course}</small><small>{article.minutes} min</small></span>
      <span className="library-row-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export function LibraryHomeSection() {
  return (
    <section className="topic-home-section section-pad">
      <div className="section-heading">
        <div><p className="eyebrow">The calculus library</p><h2>Organized by idea,<br /><em>not by accident.</em></h2></div>
        <p>Six topic paths, thirty full resources, and four consistent reading formats. Start with the chapter you’re in—or the gap that keeps showing up.</p>
      </div>
      <div className="topic-home-grid">
        {libraryTopics.map((topic) => {
          const articles = getTopicArticles(topic.slug);
          return <a href={`/topics/calculus/${topic.slug}/`} className="topic-home-row" key={topic.slug}><span>{topic.accent}</span><div><b>{topic.name}</b><small>{topic.description}</small></div><em>{articles.length} guides</em><i>→</i></a>;
        })}
      </div>
      <div className="topic-home-action"><a className="button button-ink" href="/topics/">Browse all calculus topics →</a><span>30 reviewed resources · No account required</span></div>
    </section>
  );
}

export function TopicsHubContent() {
  return (
    <>
      <section className="library-hero section-pad">
        <p className="eyebrow">Calculus library</p>
        <h1>Choose the topic.<br /><em>Then choose the kind of help.</em></h1>
        <p>Move through calculus in a coherent order, or jump directly to the method, concept, decision, or exact answer you need.</p>
        <div className="library-count"><strong>30</strong><span>full resources across<br />six connected topics</span></div>
      </section>
      <section className="archetype-strip section-pad" aria-label="Article formats">
        {(Object.entries(archetypes) as Array<[keyof typeof archetypes, (typeof archetypes)[keyof typeof archetypes]]>).map(([key, item], index) => <div key={key}><span>0{index + 1}</span><b>{item.label}</b><p>{item.promise}</p></div>)}
      </section>
      <section className="topic-directory section-pad">
        {libraryTopics.map((topic) => {
          const articles = getTopicArticles(topic.slug);
          return (
            <section className="topic-directory-block" key={topic.slug}>
              <header><span>{topic.accent}</span><div><p className="eyebrow">Topic {topic.sequence}</p><h2>{topic.name}</h2><p>{topic.description}</p></div><a href={`/topics/calculus/${topic.slug}/`}>Open topic →</a></header>
              <div>{articles.map((article, index) => <ArticleRow article={article} index={index} key={article.slug} />)}</div>
            </section>
          );
        })}
      </section>
    </>
  );
}

export function TopicContent({ topicSlug }: { topicSlug: string }) {
  const topic = getTopic(topicSlug);
  if (!topic) return null;
  const articles = getTopicArticles(topicSlug);
  const index = libraryTopics.findIndex((item) => item.slug === topicSlug);
  const previous = libraryTopics[index - 1];
  const next = libraryTopics[index + 1];
  return (
    <>
      <section className="topic-page-hero section-pad">
        <nav className="breadcrumbs"><a href="/topics/">Topics</a><span>/</span><a href="/subjects/math/calculus/">Calculus</a><span>/</span><span>{topic.name}</span></nav>
        <div className="topic-hero-grid"><div><p className="eyebrow">Topic {topic.sequence} of {libraryTopics.length}</p><h1>{topic.name}</h1><p>{topic.description}</p></div><span className="topic-big-number">{topic.accent}</span></div>
      </section>
      <section className="topic-page-body section-pad">
        <aside><strong>Inside this topic</strong><span>{articles.length} full resources</span><p>Read in sequence for a guided path, or use the format labels to choose the kind of explanation you need.</p><a href="/topics/">All calculus topics →</a></aside>
        <div className="topic-article-list">{articles.map((article, articleIndex) => <ArticleRow article={article} index={articleIndex} key={article.slug} />)}</div>
      </section>
      <nav className="topic-sequence section-pad" aria-label="Adjacent topics">
        {previous ? <a href={`/topics/calculus/${previous.slug}/`}><small>← Previous topic</small><b>{previous.name}</b></a> : <span />}
        {next ? <a href={`/topics/calculus/${next.slug}/`}><small>Next topic →</small><b>{next.name}</b></a> : <a href="/topics/"><small>Library overview →</small><b>All calculus topics</b></a>}
      </nav>
    </>
  );
}

export function LibraryArticleContent({ article }: { article: LibraryArticle }) {
  const topic = getTopic(article.topicSlug)!;
  const topicArticles = getTopicArticles(article.topicSlug);
  const currentIndex = topicArticles.findIndex((item) => item.slug === article.slug);
  const previous = topicArticles[currentIndex - 1];
  const next = topicArticles[currentIndex + 1];
  const topicIndex = libraryTopics.findIndex((item) => item.slug === article.topicSlug);
  const nextTopic = libraryTopics[topicIndex + 1];
  const archetype = archetypes[article.archetype];
  const related = article.related.map((slug) => libraryArticles.find((item) => item.slug === slug)).filter(Boolean) as LibraryArticle[];

  return (
    <article className="library-article">
      <header className="library-article-header">
        <nav className="breadcrumbs"><a href="/topics/">Topics</a><span>/</span><a href={`/topics/calculus/${topic.slug}/`}>{topic.name}</a><span>/</span><span>{article.shortTitle}</span></nav>
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
            <div className="worked-steps">{article.example.steps.map((step, index) => <div key={step.tex}><span>{index + 1}</span><Math tex={step.tex} display /><p>{step.note}</p></div>)}</div>
            <div className="worked-result"><span>Result</span><Math tex={article.example.result} display /></div>
          </section>

          <section className="mistake-takeaway-grid" id="mistakes">
            <div><span>Watch for</span><h2>Common mistakes</h2><ol>{article.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ol></div>
            <div><span>Keep</span><h2>Three takeaways</h2><ol>{article.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ol></div>
          </section>

          <section className="related-library"><div><p className="eyebrow">Continue the path</p><h2>Related resources</h2></div>{related.map((item) => <a href={articleHref(item)} key={item.slug}><span>{archetypes[item.archetype].label}</span><b>{item.title}</b><i>→</i></a>)}</section>
        </div>
      </div>

      <nav className="article-sequence" aria-label="Adjacent articles">
        {previous ? <a href={articleHref(previous)}><small>← Previous in {topic.shortName}</small><b>{previous.shortTitle}</b></a> : <a href={`/topics/calculus/${topic.slug}/`}><small>← Topic overview</small><b>{topic.name}</b></a>}
        {next ? <a href={articleHref(next)}><small>Next in {topic.shortName} →</small><b>{next.shortTitle}</b></a> : nextTopic ? <a href={`/topics/calculus/${nextTopic.slug}/`}><small>Next topic →</small><b>{nextTopic.name}</b></a> : <a href="/topics/"><small>Library overview →</small><b>All calculus topics</b></a>}
      </nav>
    </article>
  );
}

export function CalculusHubContent() {
  return (
    <>
      <section className="subject-hero section-pad"><div><p className="eyebrow">Mathematics · Subject hub</p><h1>Calculus</h1><p>Rates of change, accumulation, infinite processes—and a library organized well enough to show how they connect.</p><div className="subject-hero-actions"><a className="button button-ink" href="/topics/">Browse all topics</a><a className="button button-ghost" href="/search/">Search the library</a></div></div><div className="subject-mark">∫<span>dx</span></div></section>
      <section className="calculus-map section-pad">
        <div className="section-heading"><div><p className="eyebrow">The course map</p><h2>Six topics.<br /><em>One connected path.</em></h2></div><p>Read in sequence from limits through series, or open the topic that matches your course today.</p></div>
        <div className="calculus-map-list">{libraryTopics.map((topic) => <a href={`/topics/calculus/${topic.slug}/`} key={topic.slug}><span>{topic.accent}</span><div><b>{topic.name}</b><small>{topic.description}</small></div><em>{getTopicArticles(topic.slug).length} resources</em><i>→</i></a>)}</div>
      </section>
      <section className="calculus-tools section-pad"><div><p className="eyebrow">Put it to work</p><h2>Learn, calculate, practice.</h2></div><a href="/calculators/integration-method-finder/"><span>Tool</span><b>Integration Method Finder</b><small>Choose a first move →</small></a><a href="/practice/calculus/integration-method-selection/"><span>Practice</span><b>Method selection</b><small>10 focused questions →</small></a><a href="/exams/calculus-readiness/"><span>Diagnostic</span><b>Calculus readiness</b><small>Find prerequisite gaps →</small></a></section>
    </>
  );
}

export function searchLibrary(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return libraryArticles;
  return libraryArticles
    .map((article) => {
      const topic = getTopic(article.topicSlug)!;
      const haystack = `${article.title} ${article.shortTitle} ${article.deck} ${topic.name} ${archetypes[article.archetype].label}`.toLowerCase();
      return { article, score: terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.article);
}

export function LibrarySearchResults({ query, limit = 8 }: { query: string; limit?: number }) {
  const results = searchLibrary(query).slice(0, limit);
  if (!results.length) return null;
  return <div className="library-search-group"><div className="results-head"><h2>Guides and explanations</h2><span>{results.length} useful matches</span></div>{results.map((article, index) => <ArticleRow article={article} index={index} key={article.slug} />)}</div>;
}
