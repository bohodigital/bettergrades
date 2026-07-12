"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { beeQuestions, methodQuestions, readinessQuestions, type Question } from "../lib/activities";
import { problems, searchProblems, type Problem } from "../lib/content";
import { getArticle } from "../lib/library";
import { CalculusHubContent, LibraryArticleContent, LibraryHomeSection, LibrarySearchResults, searchLibrary, TopicContent, TopicsHubContent } from "./LibraryPages";
import { Formula, Math, MathOrText } from "./Math";

const nav = [
  ["Topics", "/topics/"], ["Answers", "/answers/"], ["Learn", "/learn/calculus/integration-by-parts/"],
  ["Calculators", "/calculators/"], ["Practice", "/practice/"],
  ["Exams", "/exams/"], ["Integration Bee", "/bee/"],
];

function Link({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className}>{children}</a>;
}

function Icon({ children }: { children: ReactNode }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function SearchBox({ large = false, initial = "", label = "Search answers" }: { large?: boolean; initial?: string; label?: string }) {
  const [query, setQuery] = useState(initial);
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (value) window.location.href = `/search/?q=${encodeURIComponent(value)}`;
  }
  return (
    <form className={`search-box ${large ? "search-box-large" : ""}`} onSubmit={submit} role="search">
      <label className="sr-only" htmlFor={`search-${large ? "large" : "small"}`}>{label}</label>
      <span className="search-symbol" aria-hidden="true">⌕</span>
      <input id={`search-${large ? "large" : "small"}`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a question, topic, or expression" autoComplete="off" />
      <button type="submit" className="button button-ink">Search answers <span aria-hidden="true">→</span></button>
    </form>
  );
}

function ThemeControl() {
  const [choice, setChoice] = useState("auto");
  useEffect(() => {
    const stored = localStorage.getItem("bg-theme") || "auto";
    setChoice(stored);
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = (next: string) => {
      const dark = next === "dark" || (next === "auto" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.dataset.themeChoice = next;
    };
    apply(stored);
    const listener = () => (localStorage.getItem("bg-theme") || "auto") === "auto" && apply("auto");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);
  function choose(next: string) {
    setChoice(next); localStorage.setItem("bg-theme", next);
    const dark = next === "dark" || (next === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.themeChoice = next;
  }
  return (
    <div className="theme-control" aria-label="Color theme">
      {["auto", "light", "dark"].map((item) => <button key={item} className={choice === item ? "active" : ""} onClick={() => choose(item)} aria-pressed={choice === item}>{item === "auto" ? "A" : item === "light" ? "☀" : "☾"}<span>{item}</span></button>)}
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Better Grades home"><span className="brand-mark">≥</span><span>Better Grades</span></Link>
        <nav className="desktop-nav" aria-label="Primary">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="header-actions">
          <Link href="/search/" className="header-search" aria-label="Search"><span>⌕</span><b>Search</b></Link>
          <ThemeControl />
          <details className="mobile-menu"><summary aria-label="Open menu">Menu</summary><nav>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></details>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><Link href="/" className="brand footer-brand"><span className="brand-mark">≥</span><span>Better Grades</span></Link><p>The answer is free.<br />Understanding it is the point.</p></div>
        <div><strong>Explore</strong><Link href="/answers/">Answers</Link><Link href="/calculators/">Calculators</Link><Link href="/practice/">Practice</Link><Link href="/bee/">Integration Bee</Link></div>
        <div><strong>Standards</strong><Link href="/how-we-verify/">How we verify</Link><Link href="/editorial-policy/">Editorial policy</Link><Link href="/source-policy/">Sources & licensing</Link><Link href="/corrections/">Corrections</Link></div>
        <div><strong>About</strong><Link href="/about/">Why Better Grades</Link><Link href="/privacy/">Privacy</Link><Link href="/accessibility/">Accessibility</Link></div>
      </div>
      <div className="footer-bottom"><span>© 2026 BetterGrades.net</span><span>Original problems. Reviewed solutions. Zero answer paywalls.</span></div>
    </footer>
  );
}

function Shell({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return <><Header /><main className={narrow ? "narrow-main" : ""}>{children}</main><Footer /></>;
}

function Eyebrow({ children, warm = false }: { children: ReactNode; warm?: boolean }) {
  return <p className={`eyebrow ${warm ? "warm" : ""}`}>{children}</p>;
}

function Verified() { return <span className="verified"><span aria-hidden="true">✓</span> Verified</span>; }

function HomePage() {
  const [methodAnswer, setMethodAnswer] = useState<number | null>(null);
  return (
    <Shell>
      <section className="hero section-pad">
        <div className="hero-copy">
          <Eyebrow>Free answers. Complete explanations. Better practice.</Eyebrow>
          <h1>Find the answer.<br /><em>Understand the method.</em></h1>
          <p className="hero-lede">Search specific problems, use practical calculators, and practice the skills behind the solution—without an answer paywall.</p>
          <SearchBox large />
          <div className="query-examples"><span>Try:</span><Link href="/search/?q=integral%20of%20sec%20cubed">integral of sec cubed</Link><Link href="/search/?q=differentiate%20x%5Ex">differentiate xˣ</Link><Link href="/search/?q=convergence%20test">choosing a convergence test</Link></div>
          <div className="hero-trust"><span>✓ No account required</span><span>✓ No hidden solution</span><span>✓ Checked by humans</span></div>
        </div>
        <div className="hero-interaction" aria-label="Integration method mini challenge">
          <div className="paper-tab"><span>METHOD CHECK</span><span>01 / 01</span></div>
          <p className="micro-label">Which method should you try first?</p>
          <Math tex={String.raw`\int x e^x\,dx`} display className="hero-equation" label="integral of x e to the x, d x" />
          <div className="method-options">
            {["Integration by parts", "u-substitution", "Trig identity"].map((option, i) => <button key={option} onClick={() => setMethodAnswer(i)} className={methodAnswer === i ? (i === 0 ? "correct" : "incorrect") : ""}><span>{String.fromCharCode(65 + i)}</span>{option}</button>)}
          </div>
          <div className={`method-feedback ${methodAnswer !== null ? "show" : ""}`}>{methodAnswer === 0 ? <><strong>Nice read.</strong> x gets simpler when differentiated; eˣ stays easy.</> : <><strong>Close, but look at the product.</strong> One factor gets simpler when differentiated.</>}</div>
          <Link href="/calculators/integration-method-finder/" className="text-link">Try the full method finder →</Link>
          <span className="scribble">good instinct ↗</span>
        </div>
      </section>

      <section className="paths section-pad">
        <div className="section-heading"><div><Eyebrow>Choose your route</Eyebrow><h2>What are you here to do?</h2></div><p>Start with the thing due soon. We’ll connect it to the thing you actually need to learn.</p></div>
        <div className="path-list">
          {[
            ["01", "Find an answer", "Search a specific question and get the result first—then the full reasoning.", "/answers/", "⌕"],
            ["02", "Use a calculator", "Compute, check, and see exactly where the method applies or breaks.", "/calculators/", "ƒ"],
            ["03", "Learn a method", "Read a sharp explanation built around recognition, not memorizing a ritual.", "/learn/calculus/integration-by-parts/", "∴"],
            ["04", "Practice for a test", "Work on the mistake pattern, not a random pile of lookalike questions.", "/practice/", "↗"],
          ].map(([num, title, copy, href, icon]) => <Link href={href} className="path-row" key={title}><span className="path-num">{num}</span><Icon>{icon}</Icon><span><strong>{title}</strong><small>{copy}</small></span><b aria-hidden="true">→</b></Link>)}
        </div>
        <div className="bee-strip"><span className="mini-bee">∫<i>•</i></span><div><strong>Feeling competitive?</strong><span>Run a timed Integration Bee round. Explanations included; panic optional.</span></div><Link href="/bee/">Enter the Bee →</Link></div>
      </section>

      <LibraryHomeSection />

      <section className="featured-answer section-pad">
        <div className="feature-copy"><Eyebrow>Featured deep dive</Eyebrow><h2>Why the integral of sec³x<br /><em>brings itself back.</em></h2><p>The final formula is useful. The clever part is the loop: integration by parts returns the original integral, turning the problem into an equation you can solve.</p><div className="button-row"><Link className="button button-ink" href="/answers/calculus/integral-of-sec-cubed/">See the full solution</Link><Link className="button button-ghost" href="/practice/calculus/integration-method-selection/">Practice related problems</Link></div></div>
        <div className="answer-paper"><div className="answer-paper-top"><span>ANSWER</span><Verified /></div><Math tex={String.raw`\int \sec^3x\,dx`} display className="featured-equation" label="integral of secant cubed x, d x" /><div className="equals">=</div><Math tex={String.raw`\frac12\sec x\tan x+\frac12\ln\!\left|\sec x+\tan x\right|+C`} display className="result-equation" label="one half secant x tangent x plus one half natural log absolute value secant x plus tangent x, plus C" /><p className="margin-note">Yes, the absolute value matters.</p></div>
      </section>

      <section className="answer-preview section-pad">
        <div className="section-heading"><div><Eyebrow>The answer bank</Eyebrow><h2>Answers that lead somewhere useful.</h2></div><p>Direct answers, original explanations, and a clear next move. No artificial cliffhanger.</p></div>
        <div className="answer-table"><div className="answer-table-head"><span>Question</span><span>Topic</span><span>Depth</span><span>Status</span></div>{problems.map((p) => <Link href={p.href} className="answer-row" key={p.problem_id}><span><b>{p.canonical_statement}</b><small><Formula value={p.canonical_expression} /></small></span><span>{p.subtopic}</span><span>{p.depth}</span><Verified /><b className="row-arrow">↗</b></Link>)}</div>
        <div className="center-action"><Link href="/answers/" className="text-link">Explore the answer bank →</Link></div>
      </section>

      <section className="split-feature section-pad">
        <div className="calculator-tease"><Eyebrow>Tools with a point of view</Eyebrow><h2>Calculate, then understand.</h2><p>Our tools explain the result, connect it to the method, and tell you where they may fail. A mysterious green checkmark is not a lesson.</p><Link href="/calculators/integration-method-finder/" className="finder-preview"><span className="finder-icon">ƒ?</span><span><strong>Integration Method Finder</strong><small>Describe the integral. Get a ranked first move.</small></span><b>Open →</b></Link></div>
        <div className="practice-tease"><Eyebrow>Practice, redesigned</Eyebrow><h2>Built around<br /><em>the mistake.</em></h2><p>Missed the method? Dropped a sign? Skipped an algebra step? Feedback points to the exact weak link.</p><ul className="check-list"><li><span>01</span> Method recognition</li><li><span>02</span> Algebra errors</li><li><span>03</span> Missing prerequisites</li><li><span>04</span> Transfer to unfamiliar forms</li></ul><div className="button-row"><Link href="/practice/calculus/integration-method-selection/" className="button button-ink">Start a 10-question set</Link><Link href="/exams/calculus-readiness/" className="text-link">Check calculus readiness →</Link></div></div>
      </section>

      <section className="trust-band section-pad"><div><Eyebrow>Built for checking</Eyebrow><h2>Answers should survive<br />being checked.</h2></div><div className="trust-links"><Link href="/how-we-verify/"><span>01</span><b>How we verify</b><i>→</i></Link><Link href="/editorial-policy/"><span>02</span><b>Editorial policy</b><i>→</i></Link><Link href="/corrections/"><span>03</span><b>Corrections</b><i>→</i></Link><Link href="/source-policy/"><span>04</span><b>Sources & licensing</b><i>→</i></Link></div></section>
    </Shell>
  );
}

function AnswerResult({ problem }: { problem: Problem }) {
  return <Link href={problem.href} className="answer-result"><div><span className="result-type">{problem.depth}</span><h3>{problem.canonical_statement}</h3><p><Formula value={problem.canonical_expression} /></p></div><div className="result-answer"><small>Answer</small><b><MathOrText value={problem.answer} /></b></div><div className="result-meta"><span>{problem.course}</span><span>{problem.topic}</span><Verified /></div><span className="result-arrow">↗</span></Link>;
}

function AnswersPage() {
  const [query, setQuery] = useState(""); const [depth, setDepth] = useState("All depths");
  const filtered = problems.filter((p) => (!query || searchProblems(query).includes(p)) && (depth === "All depths" || p.depth === depth));
  return <Shell><section className="page-hero compact section-pad"><Eyebrow>Answers & resources</Eyebrow><h1>Search the calculus library.</h1><p>Find specific problems, complete solutions, and organized guides to the method hiding underneath.</p><div className="inline-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “integral of sec cubed”" /></div></section><section className="hub-layout section-pad"><aside className="filters"><strong>Filter answers</strong>{["Subject", "Course", "Topic"].map((x) => <label key={x}>{x}<select><option>{x === "Subject" ? "Mathematics" : x === "Course" ? "All calculus" : "All topics"}</option></select></label>)}<label>Answer depth<select value={depth} onChange={(e) => setDepth(e.target.value)}><option>All depths</option><option>Quick answer</option><option>Full solution</option><option>Deep dive</option></select></label><p>Every published depth is free. “Short” is not a pricing tier.</p><a className="filter-topic-link" href="/topics/">Browse by calculus topic →</a></aside><div className="results"><div className="results-head"><h2>{filtered.length ? `Exact answer${filtered.length === 1 ? "" : "s"}` : "No exact answer yet"}</h2><span>Recently reviewed first</span></div>{filtered.map((p) => <AnswerResult key={p.problem_id} problem={p} />)}<LibrarySearchResults query={query} limit={10} />{!filtered.length && !searchLibrary(query).length && <NoResults query={query} />}</div></section></Shell>;
}

function SearchPage() {
  const [query, setQuery] = useState("");
  useEffect(() => setQuery(new URLSearchParams(window.location.search).get("q") || ""), []);
  const results = useMemo(() => searchProblems(query), [query]);
  const libraryResults = searchLibrary(query);
  return <Shell><section className="page-hero compact section-pad"><Eyebrow>Search</Eyebrow><h1>Ask it like you mean it.</h1><p>Expressions, plain English, course names, method names—we’ll sort exact answers from broader resources.</p><div className="inline-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus placeholder="Enter a question, topic, or expression" /></div></section><section className="search-results section-pad"><div className="results-head"><h2>{query ? `Results for “${query}”` : "Browse reviewed resources"}</h2><span>{results.length + libraryResults.length} found</span></div>{results.length > 0 && <><h3 className="group-label">Exact and related answers</h3>{results.map((p) => <AnswerResult key={p.problem_id} problem={p} />)}</>}<LibrarySearchResults query={query} limit={12} />{(results.length > 0 || libraryResults.length > 0) && <><h3 className="group-label">Useful next moves</h3><div className="next-moves"><Link href="/topics/"><b>Browse by calculus topic</b><span>Follow the organized library →</span></Link><Link href="/practice/calculus/integration-method-selection/"><b>Method-selection practice</b><span>Train recognition →</span></Link></div></>}{!results.length && !libraryResults.length && <NoResults query={query} />}</section></Shell>;
}

function NoResults({ query }: { query: string }) { return <div className="no-results"><span className="big-symbol">∅</span><h3>We don’t have that exact answer yet.</h3><p>That’s a real no—not a coy “sign in to see more.” Try a broader topic, use the method finder, or browse the calculus hub.</p>{query && <code>{query}</code>}<div className="button-row"><Link href="/calculators/integration-method-finder/" className="button button-ink">Try the method finder</Link><Link href="/subjects/math/calculus/" className="button button-ghost">Browse calculus</Link></div></div>; }

function SecCubedPage() {
  return <Shell narrow><article className="article"><nav className="breadcrumbs"><Link href="/answers/">Answers</Link><span>/</span><Link href="/subjects/math/calculus/">Calculus</Link><span>/</span><span>Integral of sec³x</span></nav><header className="article-header"><Eyebrow>Deep dive · Calculus II</Eyebrow><h1>What is the integral of sec³x?</h1><p className="article-kicker">Why the integral brings itself back.</p><div className="metadata"><span>Topic <b>Trig integrals</b></span><span>Difficulty <b>Intermediate</b></span><span>Method <b>Integration by parts</b></span><Verified /><span>Reviewed <b>July 11, 2026</b></span></div></header><section className="immediate-answer"><div className="answer-label"><span>Answer</span><button onClick={() => navigator.clipboard?.writeText("1/2 sec x tan x + 1/2 ln|sec x + tan x| + C")}>Copy</button></div><div className="equation giant-equation"><span>∫ sec<sup>3</sup>x dx =</span><strong>½ sec x tan x + ½ ln|sec x + tan x| + C</strong></div><div className="why"><strong>Why this works</strong><p>Integration by parts produces another copy of the original integral. Move that copy to the left, divide by two, and the antiderivative falls out.</p></div></section><section className="article-body"><h2>Quick explanation</h2><p>Write sec³x as sec x · sec²x. That gives us a factor whose antiderivative is tan x, while the remaining sec x differentiates into sec x tan x. The resulting integral contains sec³x again—not a failure, but the useful trick.</p><h2>Full derivation</h2><p>Let <span className="inline-math">I = ∫ sec³x dx</span>. Choose <span className="inline-math">u = sec x</span> and <span className="inline-math">dv = sec²x dx</span>.</p><div className="derivation"><p>du = sec x tan x dx</p><p>v = tan x</p><hr /><p>I = sec x tan x − ∫ sec x tan²x dx</p><p>= sec x tan x − ∫ sec x(sec²x − 1) dx</p><p>= sec x tan x − I + ∫ sec x dx</p><p>2I = sec x tan x + ln|sec x + tan x|</p><strong>I = ½ sec x tan x + ½ ln|sec x + tan x| + C</strong></div><aside className="callout"><span>THE KEY MOVE</span><h3>The original integral returning is good news.</h3><p>Once I appears on both sides, the calculus problem becomes a small algebra problem. Add I to both sides. That’s the whole magic trick—no smoke machine required.</p></aside><h2>Verification</h2><p>Differentiate the result. The first term contributes ½(sec x tan²x + sec³x). The logarithmic term differentiates to ½ sec x. Using tan²x + 1 = sec²x, everything combines to sec³x.</p><div className="verify-box"><span>Derivative of proposed answer</span><div className="equation">½ sec x tan²x + ½ sec³x + ½ sec x = sec³x</div><Verified /></div><h2>Common mistakes</h2><ol className="mistakes"><li><b>Stopping when the integral returns.</b><span>That is the moment to solve for I, not abandon ship.</span></li><li><b>Forgetting the factor of ½.</b><span>You get 2I before the final division.</span></li><li><b>Dropping | | around sec x + tan x.</b><span>The logarithmic antiderivative needs absolute value on its valid intervals.</span></li></ol><h2>What to do next</h2><div className="related-grid"><Link href="/learn/calculus/integration-by-parts/"><span>LEARN THE METHOD</span><b>Integration by parts</b><small>Recognition, setup, and when not to use it →</small></Link><Link href="/practice/calculus/integration-method-selection/"><span>PRACTICE</span><b>Choose the first move</b><small>10 questions with targeted feedback →</small></Link><Link href="/bee/"><span>COMPETE</span><b>Integration Bee</b><small>Try the integral under a little pressure →</small></Link></div></section></article></Shell>;
}

function LearnPage() {
  return <Shell narrow><article className="article lesson"><nav className="breadcrumbs"><Link href="/">Learn</Link><span>/</span><Link href="/subjects/math/calculus/">Calculus</Link><span>/</span><span>Integration by parts</span></nav><header className="article-header"><Eyebrow>Method guide · Calculus II</Eyebrow><h1>Integration by parts, without the guessing game.</h1><p className="article-kicker">Reverse the product rule. Choose the factor that gets simpler.</p></header><section className="lesson-intro"><div className="formula-card"><span>THE FORMULA</span><div className="equation">∫ u dv = uv − ∫ v du</div></div><p>Integration by parts trades one integral for another. It is useful when a product contains a factor that becomes simpler after differentiation—like x, ln x, or an inverse trig function.</p></section><section className="article-body"><h2>How to recognize it</h2><div className="signal-list"><div><span>01</span><b>A product of unlike functions</b><p>Polynomial × exponential and polynomial × trig are strong signals.</p></div><div><span>02</span><b>A lonely logarithm or inverse trig function</b><p>Rewrite ln x as ln x · 1, then differentiate the awkward factor.</p></div><div><span>03</span><b>Differentiation simplifies one factor</b><p>If it makes the new integral worse, rethink the choice.</p></div></div><h2>A simple example</h2><div className="derivation"><p>∫ x eˣ dx</p><p>u = x &nbsp; → &nbsp; du = dx</p><p>dv = eˣ dx &nbsp; → &nbsp; v = eˣ</p><hr /><strong>∫ x eˣ dx = x eˣ − eˣ + C</strong></div><h2>The canonical loop</h2><p>The integral of sec³x is the memorable case because the original integral returns. That creates an equation you can solve.</p><Link href="/answers/calculus/integral-of-sec-cubed/" className="article-link"><span className="equation">∫ sec³x dx</span><b>See why it brings itself back →</b></Link><h2>When it is the wrong first move</h2><div className="wrong-move"><div className="equation">∫ 2x cos(x²) dx</div><p>Parts is possible, but it is clumsy. Since 2x is the derivative of x², a direct substitution is the clean first move.</p><strong>Better choice: u = x²</strong></div><h2>Common mistakes</h2><ul className="plain-list"><li>Treating LIATE as a law instead of a useful tie-breaker.</li><li>Choosing dv that has no manageable antiderivative.</li><li>Forgetting the minus sign in uv − ∫v du.</li><li>Stopping before checking whether the new integral is actually simpler.</li></ul><div className="lesson-cta"><div><Eyebrow>Ready to test the instinct?</Eyebrow><h2>Choose the method before doing the algebra.</h2></div><Link href="/practice/calculus/integration-method-selection/" className="button button-warm">Start practice →</Link></div></section></article></Shell>;
}

function SecCubedLatexPage() {
  const answerTex = String.raw`\frac12\sec x\tan x+\frac12\ln\!\left|\sec x+\tan x\right|+C`;
  return (
    <Shell narrow>
      <article className="article">
        <nav className="breadcrumbs"><Link href="/answers/">Answers</Link><span>/</span><Link href="/subjects/math/calculus/">Calculus</Link><span>/</span><span>Integral of sec³x</span></nav>
        <header className="article-header">
          <Eyebrow>Deep dive · Calculus II</Eyebrow>
          <h1>What is the integral of sec³x?</h1>
          <p className="article-kicker">Why the integral brings itself back.</p>
          <div className="metadata"><span>Topic <b>Trig integrals</b></span><span>Difficulty <b>Intermediate</b></span><span>Method <b>Integration by parts</b></span><Verified /><span>Reviewed <b>July 11, 2026</b></span></div>
        </header>

        <section className="immediate-answer">
          <div className="answer-label"><span>Answer</span><button onClick={() => navigator.clipboard?.writeText("1/2 sec x tan x + 1/2 ln|sec x + tan x| + C")}>Copy</button></div>
          <div className="giant-equation">
            <Math tex={String.raw`\int \sec^3x\,dx`} display label="integral of secant cubed x, d x" />
            <span className="latex-equals" aria-hidden="true">=</span>
            <Math tex={answerTex} display label="one half secant x tangent x plus one half natural log absolute value secant x plus tangent x, plus C" />
          </div>
          <div className="why"><strong>Why this works</strong><p>Integration by parts produces another copy of the original integral. Move that copy to the left, divide by two, and the antiderivative falls out.</p></div>
        </section>

        <section className="article-body">
          <h2>Quick explanation</h2>
          <p>Write <Math tex={String.raw`\sec^3x`} /> as <Math tex={String.raw`\sec x\cdot\sec^2x`} />. That gives us a factor whose antiderivative is <Math tex={String.raw`\tan x`} />, while the remaining secant differentiates into <Math tex={String.raw`\sec x\tan x`} />. The resulting integral contains <Math tex={String.raw`\int\sec^3x\,dx`} /> again—not a failure, but the useful trick.</p>

          <h2>Full derivation</h2>
          <p>Let <Math tex={String.raw`I=\int\sec^3x\,dx`} />. Choose <Math tex={String.raw`u=\sec x`} /> and <Math tex={String.raw`dv=\sec^2x\,dx`} />.</p>
          <div className="derivation latex-derivation">
            <Math tex={String.raw`du=\sec x\tan x\,dx`} display />
            <Math tex={String.raw`v=\tan x`} display />
            <hr />
            <Math tex={String.raw`I=\sec x\tan x-\int\sec x\tan^2x\,dx`} display />
            <Math tex={String.raw`=\sec x\tan x-\int\sec x(\sec^2x-1)\,dx`} display />
            <Math tex={String.raw`=\sec x\tan x-I+\int\sec x\,dx`} display />
            <Math tex={String.raw`2I=\sec x\tan x+\ln\!\left|\sec x+\tan x\right|`} display />
            <Math tex={String.raw`\boxed{I=${answerTex}}`} display />
          </div>

          <aside className="callout"><span>THE KEY MOVE</span><h3>The original integral returning is good news.</h3><p>Once <Math tex="I" /> appears on both sides, the calculus problem becomes a small algebra problem. Add <Math tex="I" /> to both sides. That’s the whole magic trick—no smoke machine required.</p></aside>

          <h2>Verification</h2>
          <p>Differentiate the result. The first term contributes <Math tex={String.raw`\frac12(\sec x\tan^2x+\sec^3x)`} />. The logarithmic term differentiates to <Math tex={String.raw`\frac12\sec x`} />. Using <Math tex={String.raw`\tan^2x+1=\sec^2x`} />, everything combines to <Math tex={String.raw`\sec^3x`} />.</p>
          <div className="verify-box"><span>Derivative of proposed answer</span><Math tex={String.raw`\frac12\sec x\tan^2x+\frac12\sec^3x+\frac12\sec x=\sec^3x`} display className="verify-equation" /><Verified /></div>

          <h2>Common mistakes</h2>
          <ol className="mistakes">
            <li><b>Stopping when the integral returns.</b><span>That is the moment to solve for <Math tex="I" />, not abandon ship.</span></li>
            <li><b>Forgetting the factor of <Math tex={String.raw`\frac12`} />.</b><span>You get <Math tex="2I" /> before the final division.</span></li>
            <li><b>Dropping the absolute-value bars.</b><span>The logarithmic term is <Math tex={String.raw`\ln\!\left|\sec x+\tan x\right|`} /> on its valid intervals.</span></li>
          </ol>

          <h2>What to do next</h2>
          <div className="related-grid"><Link href="/learn/calculus/integration-by-parts/"><span>LEARN THE METHOD</span><b>Integration by parts</b><small>Recognition, setup, and when not to use it →</small></Link><Link href="/practice/calculus/integration-method-selection/"><span>PRACTICE</span><b>Choose the first move</b><small>10 questions with targeted feedback →</small></Link><Link href="/bee/"><span>COMPETE</span><b>Integration Bee</b><small>Try the integral under a little pressure →</small></Link></div>
        </section>
      </article>
    </Shell>
  );
}

function LearnLatexPage() {
  return (
    <Shell narrow>
      <article className="article lesson">
        <nav className="breadcrumbs"><Link href="/">Learn</Link><span>/</span><Link href="/subjects/math/calculus/">Calculus</Link><span>/</span><span>Integration by parts</span></nav>
        <header className="article-header"><Eyebrow>Method guide · Calculus II</Eyebrow><h1>Integration by parts, without the guessing game.</h1><p className="article-kicker">Reverse the product rule. Choose the factor that gets simpler.</p></header>
        <section className="lesson-intro"><div className="formula-card"><span>THE FORMULA</span><Math tex={String.raw`\int u\,dv=uv-\int v\,du`} display className="formula-card-equation" /></div><p>Integration by parts trades one integral for another. It is useful when a product contains a factor that becomes simpler after differentiation—like <Math tex="x" />, <Math tex={String.raw`\ln x`} />, or an inverse trig function.</p></section>
        <section className="article-body">
          <h2>How to recognize it</h2>
          <div className="signal-list"><div><span>01</span><b>A product of unlike functions</b><p>Polynomial × exponential and polynomial × trig are strong signals.</p></div><div><span>02</span><b>A lonely logarithm or inverse trig function</b><p>Rewrite <Math tex={String.raw`\ln x`} /> as <Math tex={String.raw`\ln x\cdot1`} />, then differentiate the awkward factor.</p></div><div><span>03</span><b>Differentiation simplifies one factor</b><p>If it makes the new integral worse, rethink the choice.</p></div></div>

          <h2>A simple example</h2>
          <div className="derivation latex-derivation">
            <Math tex={String.raw`\int xe^x\,dx`} display />
            <Math tex={String.raw`u=x\quad\Longrightarrow\quad du=dx`} display />
            <Math tex={String.raw`dv=e^x\,dx\quad\Longrightarrow\quad v=e^x`} display />
            <hr />
            <Math tex={String.raw`\boxed{\int xe^x\,dx=xe^x-e^x+C}`} display />
          </div>

          <h2>The canonical loop</h2>
          <p>The integral of <Math tex={String.raw`\sec^3x`} /> is the memorable case because the original integral returns. That creates an equation you can solve.</p>
          <Link href="/answers/calculus/integral-of-sec-cubed/" className="article-link"><Math tex={String.raw`\int\sec^3x\,dx`} display className="article-link-equation" /><b>See why it brings itself back →</b></Link>

          <h2>When it is the wrong first move</h2>
          <div className="wrong-move"><Math tex={String.raw`\int2x\cos(x^2)\,dx`} display className="wrong-move-equation" /><p>Parts is possible, but it is clumsy. Since <Math tex="2x" /> is the derivative of <Math tex={String.raw`x^2`} />, a direct substitution is the clean first move.</p><strong>Better choice: <Math tex={String.raw`u=x^2`} /></strong></div>

          <h2>Common mistakes</h2>
          <ul className="plain-list"><li>Treating LIATE as a law instead of a useful tie-breaker.</li><li>Choosing <Math tex="dv" /> that has no manageable antiderivative.</li><li>Forgetting the minus sign in <Math tex={String.raw`uv-\int v\,du`} />.</li><li>Stopping before checking whether the new integral is actually simpler.</li></ul>
          <div className="lesson-cta"><div><Eyebrow>Ready to test the instinct?</Eyebrow><h2>Choose the method before doing the algebra.</h2></div><Link href="/practice/calculus/integration-method-selection/" className="button button-warm">Start practice →</Link></div>
        </section>
      </article>
    </Shell>
  );
}

function MethodFinder({ standalone = true }: { standalone?: boolean }) {
  const [shape, setShape] = useState("product"); const [detail, setDetail] = useState("polynomial"); const [result, setResult] = useState(false);
  const map: Record<string, { name: string; confidence: string; why: string; steps: string[] }> = {
    product: { name: detail === "derivative" ? "u-substitution" : "Integration by parts", confidence: detail === "derivative" ? "Strong match" : "Best first move", why: detail === "derivative" ? "One factor appears to be the derivative of the inner expression." : "One factor should simplify when differentiated while the other stays easy to integrate.", steps: detail === "derivative" ? ["Choose the inner expression as u.", "Check that du matches the remaining factor.", "Rewrite before integrating."] : ["Choose the simplifying factor as u.", "Put the integrable factor in dv.", "Check that ∫v du is genuinely simpler."] },
    rational: { name: "Algebra, then partial fractions", confidence: "Likely route", why: "A rational function should be simplified or divided before it is decomposed.", steps: ["Compare numerator and denominator degrees.", "Factor the denominator over the reals.", "Decompose and solve for coefficients."] },
    radical: { name: "Trig substitution", confidence: "Pattern match", why: "Radicals involving a²−x², a²+x², or x²−a² pair with standard trig identities.", steps: ["Identify the radical pattern.", "Choose sin, tan, or sec substitution.", "Sketch a triangle for the back-substitution."] },
    trig: { name: "Trig identity first", confidence: "Best simplifier", why: "Powers or products of trig functions often become integrable after an identity.", steps: ["Check parity of sine and cosine powers.", "Save a derivative-matching factor when useful.", "Use Pythagorean or power-reduction identities."] },
  };
  const picked = map[shape];
  const content = <div className="finder-tool"><div className="finder-progress"><span className="active">1</span><i></i><span className={result ? "active" : ""}>2</span><i></i><span className={result ? "active" : ""}>3</span><small>Describe → Refine → Recommendation</small></div><div className="finder-question"><label>What does the integral look like?<select value={shape} onChange={(e) => { setShape(e.target.value); setResult(false); }}><option value="product">A product of different function types</option><option value="rational">A rational function (polynomial / polynomial)</option><option value="radical">A radical with a quadratic expression</option><option value="trig">Powers or products of trig functions</option></select></label>{shape === "product" && <label>What stands out?<select value={detail} onChange={(e) => { setDetail(e.target.value); setResult(false); }}><option value="polynomial">One factor simplifies when differentiated</option><option value="derivative">One factor matches an inner derivative</option></select></label>}<button className="button button-ink" onClick={() => setResult(true)}>Find the first move →</button></div>{result && <div className="finder-result"><div className="result-stamp">{picked.confidence}</div><Eyebrow>Recommended method</Eyebrow><h2>{picked.name}</h2><p>{picked.why}</p><ol>{picked.steps.map((s) => <li key={s}>{s}</li>)}</ol><div className="limitation"><b>Sanity check</b><span>This is a method guide, not a universal symbolic solver. Always check whether the new integral is actually simpler.</span></div><div className="button-row"><Link className="button button-ghost" href="/learn/calculus/integration-by-parts/">Read the method guide</Link><Link className="text-link" href="/practice/calculus/integration-method-selection/">Practice recognition →</Link></div></div>}</div>;
  return standalone ? <Shell><section className="tool-hero section-pad"><Eyebrow>Calculators · Calculus</Eyebrow><h1>Integration Method Finder</h1><p>Describe the shape of an integral. Get a ranked first move—and the reason it fits.</p><div className="tool-badges"><span>No expression parser required</span><span>Clear limitations</span><span>Built for method choice</span></div></section><section className="tool-wrap section-pad">{content}<aside className="tool-aside"><h3>What this tool does</h3><p>It recognizes common structural clues and recommends a method to try first.</p><h3>What it does not do</h3><p>It does not guarantee the entire integral is elementary or replace verification.</p><h3>Try these shapes</h3><button onClick={() => { setShape("product"); setDetail("polynomial"); setResult(false); }}><Math tex={String.raw`x\cdot e^x`} /></button><button onClick={() => { setShape("rational"); setResult(false); }}><Math tex={String.raw`\frac{1}{x^2-1}`} /></button><button onClick={() => { setShape("radical"); setResult(false); }}><Math tex={String.raw`\sqrt{9-x^2}`} /></button></aside></section></Shell> : content;
}

function CalculatorsPage() { return <Shell><section className="page-hero section-pad"><Eyebrow>Calculators</Eyebrow><h1>Useful tools. Visible limits.</h1><p>Compute less blindly. Every tool should explain its recommendation and tell you when to be skeptical.</p></section><section className="single-product section-pad"><Link href="/calculators/integration-method-finder/" className="product-row"><span className="product-mark">ƒ?</span><div><Eyebrow>Calculus · Working tool</Eyebrow><h2>Integration Method Finder</h2><p>Identify the structure of an integral, then get a ranked method and a short decision path.</p><span className="tag">Method recognition</span><span className="tag">No universal-solver claims</span></div><b>Open tool ↗</b></Link><p className="honest-note"><strong>Why only one tool?</strong> Because a working calculator is more useful than a showroom of “coming soon” buttons. The next tools ship when their explanations and limitations are reliable.</p></section></Shell>; }

function Quiz({ questions, storageKey, title, mode = "practice" }: { questions: Question[]; storageKey: string; title: string; mode?: "practice" | "exam" | "bee" }) {
  const [index, setIndex] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [answers, setAnswers] = useState<number[]>([]); const [done, setDone] = useState(false); const [started, setStarted] = useState(mode !== "bee"); const [timed, setTimed] = useState(true); const [seconds, setSeconds] = useState(0);
  useEffect(() => { if (!started || done || !timed) return; const id = setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(id); }, [started, done, timed]);
  const q = questions[index]; const correct = selected === q.answer;
  function next() { const nextAnswers = [...answers, selected === q.answer ? 1 : 0]; setAnswers(nextAnswers); if (index === questions.length - 1) { setDone(true); localStorage.setItem(storageKey, JSON.stringify({ score: nextAnswers.reduce((a, b) => a + b, 0), total: questions.length, completed: new Date().toISOString() })); } else { setIndex(index + 1); setSelected(null); } }
  function reset() { setIndex(0); setSelected(null); setAnswers([]); setDone(false); setSeconds(0); setStarted(mode !== "bee"); }
  if (!started) return <div className="quiz-start"><span className="bee-large">∫<i>•</i></span><Eyebrow warm>Integration Bee</Eyebrow><h1>Twenty integrals.<br />One very honest clock.</h1><p>Pick each antiderivative, then see the explanation. Choose timed for the buzz, untimed for the brain.</p><div className="mode-toggle"><button className={timed ? "active" : ""} onClick={() => setTimed(true)}>Timed</button><button className={!timed ? "active" : ""} onClick={() => setTimed(false)}>Untimed</button></div><button className="button button-warm" onClick={() => setStarted(true)}>Start the round →</button><small>20 fixed, reviewed problems · Progress saved on this device</small></div>;
  if (done) { const score = answers.reduce((a, b) => a + b, 0); const skills = questions.filter((_, i) => !answers[i]).map((x) => x.skill); return <div className="quiz-finish"><Eyebrow>{mode === "exam" ? "Diagnostic complete" : mode === "bee" ? "Round complete" : "Set complete"}</Eyebrow><div className="score-ring"><strong>{score}</strong><span>/ {questions.length}</span></div><h2>{score === questions.length ? "Clean sweep." : score >= questions.length * .75 ? "Strong instincts." : "Good data. Now we know where to work."}</h2><p>{mode === "exam" ? "This is a readiness signal, not a grade. Use the skill breakdown to choose the next review." : "Your result is saved on this device. No account, no leaderboard, no public drama."}</p>{skills.length > 0 && <div className="skill-review"><strong>Review next</strong>{Array.from(new Set(skills)).slice(0, 4).map((s) => <span key={s}>{s}</span>)}</div>}<div className="button-row"><button className="button button-ink" onClick={reset}>Try again</button><Link href="/learn/calculus/integration-by-parts/" className="button button-ghost">Review a method</Link></div></div>; }
  return <div className={`quiz-shell quiz-${mode}`}><div className="quiz-top"><span>{title}</span>{timed && <b>{String(globalThis.Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</b>}<span>{index + 1} / {questions.length}</span></div><div className="quiz-bar"><i style={{ width: `${((index + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }} /></div><div className="quiz-question"><Eyebrow>{q.skill}</Eyebrow><h2>{q.prompt}</h2>{q.expression && <Formula value={q.expression} display className="quiz-equation" />}<div className="quiz-choices">{q.choices.map((choice, i) => <button disabled={selected !== null} key={choice} onClick={() => setSelected(i)} className={selected === null ? "" : i === q.answer ? "correct" : selected === i ? "incorrect" : "muted"}><span>{String.fromCharCode(65 + i)}</span><span className="choice-content"><MathOrText value={choice} /></span>{selected !== null && i === q.answer && <b>✓</b>}</button>)}</div>{selected !== null && <div className={`quiz-feedback ${correct ? "right" : "wrong"}`}><strong>{correct ? "Correct." : "Not this time."}</strong><p>{q.explanation}</p><button onClick={next}>{index === questions.length - 1 ? "See results" : "Next question"} →</button></div>}</div></div>;
}

function PracticePage() { return <Shell><section className="page-hero section-pad"><Eyebrow>Practice</Eyebrow><h1>Practice the decision,<br />not just the derivative.</h1><p>Short, focused sets that diagnose the mistake and send you to the right explanation.</p></section><section className="activity-list section-pad"><Link href="/practice/calculus/integration-method-selection/" className="activity-row"><span>10 Q</span><div><Eyebrow>Calculus II · Method recognition</Eyebrow><h2>Integration method selection</h2><p>Choose the best first move before the algebra begins.</p></div><b>Start set →</b></Link><Link href="/exams/calculus-readiness/" className="activity-row"><span>12 Q</span><div><Eyebrow>Diagnostic · Prerequisites</Eyebrow><h2>Calculus readiness check</h2><p>Find algebra, functions, and trig gaps before calculus makes them louder.</p></div><b>Take diagnostic →</b></Link></section></Shell>; }
function PracticeQuizPage() { return <Shell><section className="quiz-page section-pad"><Quiz questions={methodQuestions} storageKey="bg-practice-methods" title="Integration method selection" /></section></Shell>; }
function ExamsPage() { return <Shell><section className="page-hero section-pad"><Eyebrow>Exams & diagnostics</Eyebrow><h1>Find the missing rung.</h1><p>A percentage is not a diagnosis. We connect missed questions to the prerequisite that needs work.</p></section><section className="single-product section-pad"><Link href="/exams/calculus-readiness/" className="product-row exam-product"><span className="product-mark">12</span><div><Eyebrow>Readiness diagnostic</Eyebrow><h2>Are you ready for calculus?</h2><p>A focused check of algebra, functions, exponents, logs, trigonometry, and early limits.</p><span className="tag">About 8 minutes</span><span className="tag">Device-local progress</span></div><b>Begin ↗</b></Link></section></Shell>; }
function ExamPage() { return <Shell><section className="quiz-page section-pad"><Quiz questions={readinessQuestions} storageKey="bg-exam-readiness" title="Calculus readiness diagnostic" mode="exam" /></section></Shell>; }
function BeePage() { return <Shell><section className="bee-page section-pad"><Quiz questions={beeQuestions} storageKey="bg-bee-round" title="Integration Bee" mode="bee" /></section></Shell>; }

function SubjectPage() { return <Shell><section className="subject-hero section-pad"><div><Eyebrow>Mathematics · Subject hub</Eyebrow><h1>Calculus</h1><p>Rates of change, accumulation, infinite processes—and the algebra that tries to sabotage all three.</p></div><div className="subject-mark">∫<span>dx</span></div></section><section className="subject-sections section-pad"><div><Eyebrow>Start with an answer</Eyebrow><h2>Canonical problems</h2>{problems.slice(0, 3).map((p) => <AnswerResult key={p.problem_id} problem={p} />)}</div><div className="subject-side"><Eyebrow>Connected resources</Eyebrow><Link href="/learn/calculus/integration-by-parts/"><b>Integration by parts</b><span>Method guide →</span></Link><Link href="/calculators/integration-method-finder/"><b>Integration Method Finder</b><span>Working calculator →</span></Link><Link href="/practice/calculus/integration-method-selection/"><b>Method selection</b><span>10-question practice →</span></Link><Link href="/exams/calculus-readiness/"><b>Calculus readiness</b><span>12-question diagnostic →</span></Link></div></section></Shell>; }

const policyContent: Record<string, { eyebrow: string; title: string; intro: string; sections: [string, string][] }> = {
  "/about/": { eyebrow: "About", title: "Built to teach, not tease.", intro: "Better Grades is a free academic answer bank where the final answer is the start of the explanation—not the end of a preview.", sections: [["Why this exists", "Students should not have to decode a cluttered page or reach a payment screen to confirm a mathematical answer. We publish direct results, original reasoning, and a useful next step."], ["What we are building", "Answers, methods, calculators, practice, and diagnostics share one structured problem model. The goal is coverage without duplication and scale without a mess."], ["What we will not do", "No paid answer wall, fake activity counters, scraped solution manuals, unsupported AI tutor claims, or thousands of thin numerical variants."]] },
  "/how-we-verify/": { eyebrow: "Trust standard", title: "Answers should survive being checked.", intro: "Every published solution carries a verification state and a review record. “Looks plausible” is not a status.", sections: [["Mathematical verification", "We differentiate proposed antiderivatives, substitute solutions into original equations, check domains and assumptions, and compare independent methods where useful."], ["Editorial review", "A reviewer checks the problem statement, notation, reasoning, final form, limitations, and whether the page genuinely adds educational value."], ["Visible status", "Published pages identify their review date and verification state. Corrections remain part of the record rather than disappearing quietly."]] },
  "/editorial-policy/": { eyebrow: "Editorial policy", title: "Direct first. Complete second. Honest throughout.", intro: "Readers should know immediately whether they found the right problem and the right answer.", sections: [["Answer before the detour", "We show the final result near the top, followed by a short explanation and then the full derivation."], ["Depth with purpose", "Quick answer, full solution, and deep dive are editorial formats—not access tiers. All published depths are free."], ["No manufactured authority", "We do not invent popularity, testimonials, author credentials, or hidden content. When a tool is limited, the limitation appears beside it."]] },
  "/source-policy/": { eyebrow: "Sources & licensing", title: "Original work, traceable sources.", intro: "A problem being visible online does not make it free to copy. Our content model tracks source, license, attribution, permission, and review status.", sections: [["What we may use", "Original authored problems, canonical mathematical questions, public-domain materials, and appropriately licensed sources."], ["What we do not scrape", "Commercial solution manuals, Chegg, Course Hero, private course portals, current protected exams, or unauthorized test banks."], ["Independent expression", "When a mathematical idea is common but source wording is protected or uncertain, we independently state the question and write an original solution where legally appropriate."]] },
  "/corrections/": { eyebrow: "Corrections", title: "Found something off? Tell us plainly.", intro: "A sign error, unclear step, broken link, or accessibility issue deserves a visible response—not a defensive one.", sections: [["What to include", "Share the page address, the exact step in question, and your reasoning or source when available."], ["What happens next", "We reproduce the issue, verify the correction, update the page, and record a reviewed date. Material mathematical changes receive explicit correction notes."], ["Current contact path", "During this private first release, corrections are handled through the site owner’s existing support channel. A public submission form will ship only with proper privacy and moderation controls."]] },
  "/privacy/": { eyebrow: "Privacy", title: "Learn without becoming a data product.", intro: "Better Grades does not require an account for answers, calculators, practice, diagnostics, or Integration Bee.", sections: [["Device-local progress", "Practice and diagnostic results are stored in your browser on this device. Clear site data to remove them."], ["No student profiles", "This release has no accounts, public results, comments, tracking pixels, ad profiles, or sale of personal information."], ["Future changes", "If a future feature requires data collection, the privacy notice will explain the purpose, fields, retention, and control before collection begins."]] },
  "/accessibility/": { eyebrow: "Accessibility", title: "Math help should not add obstacles.", intro: "We design for keyboard access, readable contrast, comfortable zoom, reduced motion preferences, and mathematical content that survives narrow screens.", sections: [["Interaction", "Controls have visible focus states and meaningful labels. Practice uses one question at a time and never depends on color alone."], ["Reading", "Text remains selectable, equations can scroll without clipping, and light and dark themes use purpose-built surfaces."], ["Improvement", "Accessibility is ongoing editorial work. Report a barrier through the corrections process with the page and task you were trying to complete."]] },
};

function PolicyPage({ path }: { path: string }) { const data = policyContent[path]; return <Shell narrow><article className="policy-page"><Eyebrow>{data.eyebrow}</Eyebrow><h1>{data.title}</h1><p className="policy-intro">{data.intro}</p>{data.sections.map(([title, copy], i) => <section key={title}><span>0{i + 1}</span><div><h2>{title}</h2><p>{copy}</p></div></section>)}</article></Shell>; }

function NotFound() { return <Shell><section className="not-found section-pad"><span>4≥4</span><Eyebrow>That page did not make the grade</Eyebrow><h1>Wrong turn. Useful recovery.</h1><p>The page may have moved, or the expression may need a different phrasing. Search the answer bank or return to calculus.</p><SearchBox large /><div className="button-row"><Link href="/" className="button button-ghost">Back home</Link><Link href="/subjects/math/calculus/" className="text-link">Browse calculus →</Link></div></section></Shell>; }

export function BetterGradesApp({ path }: { path: string }) {
  if (path === "/") return <HomePage />;
  if (path === "/topics/" || path === "/library/") return <Shell><TopicsHubContent /></Shell>;
  const topicMatch = path.match(/^\/topics\/calculus\/([^/]+)\/$/);
  if (topicMatch) return <Shell><TopicContent topicSlug={topicMatch[1]} /></Shell>;
  const articleMatch = path.match(/^\/library\/([^/]+)\/([^/]+)\/$/);
  if (articleMatch) {
    const article = getArticle(articleMatch[1], articleMatch[2]);
    if (article) return <Shell><LibraryArticleContent article={article} /></Shell>;
  }
  if (path === "/answers/") return <AnswersPage />;
  if (path === "/search/") return <SearchPage />;
  if (path === "/answers/calculus/integral-of-sec-cubed/") return <SecCubedLatexPage />;
  if (path === "/learn/calculus/integration-by-parts/") return <LearnLatexPage />;
  if (path === "/calculators/") return <CalculatorsPage />;
  if (path === "/calculators/integration-method-finder/") return <MethodFinder />;
  if (path === "/practice/") return <PracticePage />;
  if (path === "/practice/calculus/integration-method-selection/") return <PracticeQuizPage />;
  if (path === "/exams/") return <ExamsPage />;
  if (path === "/exams/calculus-readiness/") return <ExamPage />;
  if (path === "/bee/") return <BeePage />;
  if (path === "/subjects/math/calculus/") return <Shell><CalculusHubContent /></Shell>;
  if (policyContent[path]) return <PolicyPage path={path} />;
  return <NotFound />;
}
