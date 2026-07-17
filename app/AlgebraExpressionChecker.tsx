"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  compareAlgebraExpressions,
  evaluateAlgebraExpression,
  normalizeCalculatorInput,
  simplifyAlgebraExpression,
  type AlgebraResult,
} from "../lib/algebra-calculator.mjs";
import { algebraPracticeProblems, type AlgebraPracticeProblem } from "../lib/algebra-practice.mjs";
import { Math } from "./Math";

type CheckerMode = "practice" | "simplify" | "compare" | "evaluate";
type InputMode = "keyboard" | "latex";

const modeLabels: Record<CheckerMode, string> = {
  practice: "Practice answer",
  simplify: "Simplify",
  compare: "Compare",
  evaluate: "Evaluate",
};

function ProblemPicker({ active, onPick }: { active: AlgebraPracticeProblem; onPick: (problem: AlgebraPracticeProblem) => void }) {
  return (
    <div className="algebra-problem-list" aria-label="Choose a practice problem">
      {algebraPracticeProblems.map((problem, index) => (
        <button key={problem.id} type="button" className={problem.id === active.id ? "active" : ""} onClick={() => onPick(problem)}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{problem.topic}</b>
          <small>{problem.prompt}</small>
        </button>
      ))}
    </div>
  );
}

function ResultCard({ result, mode, activeProblem }: { result: AlgebraResult; mode: CheckerMode; activeProblem: AlgebraPracticeProblem }) {
  const kicker = result.status === "correct"
    ? "Equivalent"
    : result.status === "incorrect"
      ? "Different"
      : result.status === "simplified"
        ? "Simplified"
        : result.status === "evaluated"
          ? "Calculated"
          : "Checker note";

  return (
    <div className={`checker-result ${result.status}`} role="status" aria-live="polite">
      <span className="result-kicker">{kicker}</span>
      <h2>{result.title}</h2>
      <p>{result.message}</p>
      {result.latex && (
        <div className="result-math-stack">
          <Math tex={result.latex} display className="checker-result-math" />
          {result.secondaryLatex && <><small>Decimal approximation</small><Math tex={result.secondaryLatex} display className="checker-result-math secondary" /></>}
        </div>
      )}
      {mode === "practice" && result.status !== "correct" && (
        <details>
          <summary>Need the stored answer?</summary>
          <Math tex={activeProblem.answerLatex} display />
          <p>{activeProblem.explanation}</p>
        </details>
      )}
      {result.normalizedLatex && <details><summary>Show normalized LaTeX</summary><code>{result.normalizedLatex}</code></details>}
    </div>
  );
}

export function AlgebraExpressionChecker() {
  const [mode, setMode] = useState<CheckerMode>("practice");
  const [inputMode, setInputMode] = useState<InputMode>("keyboard");
  const [activeProblem, setActiveProblem] = useState(algebraPracticeProblems[0]);
  const [expression, setExpression] = useState("");
  const [comparison, setComparison] = useState("");
  const [assignments, setAssignments] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<AlgebraResult | null>(null);

  useEffect(() => {
    const queryExpression = new URLSearchParams(window.location.search).get("expression")?.slice(0, 240) ?? "";
    if (!queryExpression) return;
    const frame = requestAnimationFrame(() => {
      setMode("simplify");
      setExpression(queryExpression);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function updateExpression(value: string) {
    setExpression(value);
    setResult(null);
  }

  function chooseMode(nextMode: CheckerMode) {
    setMode(nextMode);
    setResult(null);
  }

  function chooseProblem(problem: AlgebraPracticeProblem) {
    setActiveProblem(problem);
    setMode("practice");
    setExpression("");
    setResult(null);
  }

  function clearAll() {
    setExpression("");
    setComparison("");
    setAssignments("");
    setResult(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setChecking(true);
    setResult(null);
    const next = mode === "practice"
      ? await compareAlgebraExpressions(expression, activeProblem.answerLatex)
      : mode === "simplify"
        ? await simplifyAlgebraExpression(expression)
        : mode === "compare"
          ? await compareAlgebraExpressions(expression, comparison)
          : await evaluateAlgebraExpression(expression, assignments);
    setResult(next);
    setChecking(false);
  }

  const normalizedPreview = normalizeCalculatorInput(expression);
  const missingRequiredInput = !expression.trim() || (mode === "compare" && !comparison.trim());
  const submitLabel = checking
    ? "Working securely…"
    : mode === "practice"
      ? "Check my answer →"
      : mode === "simplify"
        ? "Simplify it →"
        : mode === "compare"
          ? "Compare them →"
          : "Evaluate it →";

  return (
    <>
      <section className="tool-hero algebra-tool-hero section-pad">
        <p className="eyebrow">Tools · Mathematics · Algebra</p>
        <h1>Type it messy.<br /><em>See it clearly.</em></h1>
        <p>Check an answer, simplify an expression, compare two forms, or substitute values. A bounded request goes to the Better Grades calculator service only when you submit your work.</p>
        <div className="tool-badges"><span>Bounded first-party request</span><span>No account</span><span>Keyboard or LaTeX</span><span>Conservative equivalence checks</span></div>
      </section>

      <section className="algebra-checker-layout section-pad">
        <div className="algebra-checker-main">
          <div className="checker-mode-tabs" aria-label="Choose calculator mode">
            {(Object.keys(modeLabels) as CheckerMode[]).map((item) => (
              <button key={item} type="button" className={mode === item ? "active" : ""} aria-pressed={mode === item} onClick={() => chooseMode(item)}>
                {modeLabels[item]}
              </button>
            ))}
          </div>

          {mode === "practice" && (
            <div className="checker-prompt">
              <div><span>{activeProblem.topic}</span><b>{activeProblem.prompt}</b></div>
              <Math tex={activeProblem.promptLatex} display label={activeProblem.prompt} />
            </div>
          )}
          {mode === "simplify" && (
            <div className="checker-prompt checker-prompt-copy">
              <div><span>Symbolic calculator</span><b>Clean up an algebraic expression</b></div>
              <p>Try <button type="button" onClick={() => updateExpression(String.raw`(2x-3)(x+5)`)}>(2x − 3)(x + 5)</button> or <button type="button" onClick={() => updateExpression(String.raw`4x^2-3x+5x^2+2x`)}>combine like terms</button>.</p>
            </div>
          )}
          {mode === "compare" && (
            <div className="checker-prompt checker-prompt-copy">
              <div><span>Equivalence checker</span><b>Do these expressions mean the same thing?</b></div>
              <p>Different-looking forms are fine. We report “different” only when the engine establishes a mismatch or finds a counterexample.</p>
            </div>
          )}
          {mode === "evaluate" && (
            <div className="checker-prompt checker-prompt-copy">
              <div><span>Substitution calculator</span><b>Evaluate an expression at chosen values</b></div>
              <p>Enter an expression such as <button type="button" onClick={() => { updateExpression("x^2+2x-3"); setAssignments("x=4"); }}>x² + 2x − 3 at x = 4</button>.</p>
            </div>
          )}

          <form className="expression-entry" onSubmit={submit}>
            <div className="entry-toolbar">
              <label htmlFor="algebra-expression">Your {mode === "practice" ? "answer" : "expression"}</label>
              <div className="input-mode-toggle" aria-label="Input format">
                <button type="button" className={inputMode === "keyboard" ? "active" : ""} aria-pressed={inputMode === "keyboard"} onClick={() => setInputMode("keyboard")}>Keyboard</button>
                <button type="button" className={inputMode === "latex" ? "active" : ""} aria-pressed={inputMode === "latex"} onClick={() => setInputMode("latex")}>LaTeX</button>
              </div>
            </div>
            <textarea
              id="algebra-expression"
              value={expression}
              onChange={(event) => updateExpression(event.target.value)}
              maxLength={240}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              inputMode="text"
              aria-describedby="algebra-entry-help"
              placeholder={inputMode === "latex" ? String.raw`\frac{x^2-1}{x-1}` : `(x+5)(2x-3) or 4x^2 + 2x`}
            />
            <p className="entry-help" id="algebra-entry-help">
              {inputMode === "latex" ? "Paste raw LaTeX. Backslashes and braces are preserved." : "Use ordinary characters: ^ for powers, * when multiplication is ambiguous, / for division, and parentheses for grouping."}
            </p>

            {mode === "compare" && (
              <div className="secondary-entry">
                <label htmlFor="algebra-comparison">Compare with</label>
                <textarea
                  id="algebra-comparison"
                  value={comparison}
                  onChange={(event) => { setComparison(event.target.value); setResult(null); }}
                  maxLength={240}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  placeholder={inputMode === "latex" ? String.raw`x^2+7x-15` : "2x^2 + 7x - 15"}
                />
              </div>
            )}

            {mode === "evaluate" && (
              <div className="value-assignment">
                <label htmlFor="algebra-values">Variable values</label>
                <input
                  id="algebra-values"
                  value={assignments}
                  onChange={(event) => { setAssignments(event.target.value); setResult(null); }}
                  maxLength={80}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  placeholder="x=2, y=-3.5"
                />
                <small>Use finite integers or decimals. Separate multiple values with commas.</small>
              </div>
            )}

            <div className="interpreted-line">
              <span>We read that as</span>
              <div>{normalizedPreview ? <Math tex={normalizedPreview} display label={normalizedPreview} /> : <small>Your rendered expression will appear here.</small>}</div>
            </div>
            <div className="checker-actions">
              <button className="button button-ink" type="submit" disabled={checking || missingRequiredInput}>{submitLabel}</button>
              <button className="text-button" type="button" onClick={clearAll}>Clear</button>
            </div>
          </form>

          {result && <ResultCard result={result} mode={mode} activeProblem={activeProblem} />}
        </div>

        <aside className="algebra-checker-aside">
          <div className="scope-card"><span>What works now</span><p>Polynomial arithmetic, distributing, combining like terms, expansion, factoring checks, expression comparison, and numeric substitution.</p></div>
          <div className="scope-card warning"><span>Deliberate boundary</span><p>It does not grade equations, inequalities, solution sets, units, domain restrictions, or answers that require a particular form.</p></div>
          {mode === "practice" && <><h2>Pick a problem</h2><ProblemPicker active={activeProblem} onPick={chooseProblem} /><div className="hint-card"><span>Hint</span><p>{activeProblem.hint}</p></div></>}
          <p className="local-note"><b>Private by design:</b> your entry is sent only to the same-origin Better Grades calculator for transient processing. This feature does not log or store the expression.</p>
        </aside>
      </section>
    </>
  );
}
