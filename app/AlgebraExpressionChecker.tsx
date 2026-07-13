"use client";

import type { ComputeEngine as ComputeEngineType } from "@cortex-js/compute-engine";
import { FormEvent, useEffect, useRef, useState } from "react";
import { hasNumericCounterexample } from "../lib/algebra-equivalence.mjs";
import { algebraPracticeProblems, type AlgebraPracticeProblem } from "../lib/algebra-practice.mjs";
import { Math } from "./Math";

type CheckerMode = "practice" | "simplify";
type InputMode = "math" | "latex";
type ResultStatus = "correct" | "incorrect" | "uncertain" | "simplified" | "error";
type CheckResult = {
  status: ResultStatus;
  title: string;
  message: string;
  latex?: string;
  normalizedLatex?: string;
};

type LiveMathfield = HTMLElement & {
  value: string;
  smartFence: boolean;
  mathVirtualKeyboardPolicy: "auto" | "manual" | "sandboxed";
};

let engine: ComputeEngineType | null = null;

async function getEngine() {
  if (engine) return engine;
  const { ComputeEngine } = await import("@cortex-js/compute-engine");
  engine = new ComputeEngine();
  engine.precision = "machine";
  return engine;
}

async function inspectExpression(inputLatex: string, expectedLatex?: string): Promise<CheckResult> {
  const value = inputLatex.trim();
  if (!value) return { status: "error", title: "Nothing to check yet", message: "Type an expression first." };
  if (value.length > 240) return { status: "error", title: "Keep this one smaller", message: "This first release accepts expressions up to 240 characters." };

  try {
    const ce = await getEngine();
    const submitted = ce.parse(value);
    if (submitted.errors.length) return { status: "error", title: "We could not read that", message: "Check the parentheses, fraction bars, and exponents, then try again." };
    if (submitted.unknowns.length > 3) return { status: "error", title: "Too many variables for this pass", message: "Use no more than three variables while the checker is in its algebra-only release." };
    if (JSON.stringify(submitted.json).length > 5000) return { status: "error", title: "That expression is too complex for this pass", message: "Break it into a smaller algebra step and check that first." };

    const normalizedLatex = submitted.latex;
    if (!expectedLatex) {
      return {
        status: "simplified",
        title: "Here is the simplified form",
        message: "This runs entirely in your browser. Check domain restrictions separately when denominators or even roots are involved.",
        latex: submitted.simplify().latex,
        normalizedLatex,
      };
    }

    const expected = ce.parse(expectedLatex);
    const equality = submitted.isEqual(expected);
    if (equality === true) {
      return { status: "correct", title: "That works", message: "Your expression is mathematically equivalent to the stored answer.", latex: expected.latex, normalizedLatex };
    }
    if (equality === false || hasNumericCounterexample(submitted, expected)) {
      return { status: "incorrect", title: "These are clearly different", message: "The checker found a mathematical difference, not just a formatting difference. Rework one step and try again.", normalizedLatex };
    }
    return { status: "uncertain", title: "We could not prove this one", message: "Your form may still be valid. This first checker refuses to mark an answer wrong when equivalence is uncertain.", latex: expected.latex, normalizedLatex };
  } catch {
    return { status: "error", title: "The checker hit a limit", message: "Try a shorter algebraic expression. Equations, inequalities, and domain-sensitive answers are not graded yet." };
  }
}

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

export function AlgebraExpressionChecker() {
  const [mode, setMode] = useState<CheckerMode>("practice");
  const [inputMode, setInputMode] = useState<InputMode>("math");
  const [activeProblem, setActiveProblem] = useState(algebraPracticeProblems[0]);
  const [latex, setLatex] = useState("");
  const [mathfieldReady, setMathfieldReady] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const mathfieldHost = useRef<HTMLDivElement>(null);
  const mathfield = useRef<LiveMathfield | null>(null);
  const latestLatex = useRef("");

  function updateLatex(value: string, updateField = true) {
    latestLatex.current = value;
    setLatex(value);
    setResult(null);
    if (updateField && mathfield.current && mathfield.current.value !== value) mathfield.current.value = value;
  }

  useEffect(() => {
    const expression = new URLSearchParams(window.location.search).get("expression")?.slice(0, 240) ?? "";
    if (!expression) return;
    const frame = requestAnimationFrame(() => {
      setMode("simplify");
      latestLatex.current = expression;
      setLatex(expression);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;
    let field: LiveMathfield | null = null;
    import("mathlive").then(({ MathfieldElement }) => {
      if (!active || !mathfieldHost.current) return;
      field = new MathfieldElement() as LiveMathfield;
      field.className = "expression-mathfield";
      field.setAttribute("aria-label", "Enter an algebraic expression");
      field.smartFence = true;
      field.mathVirtualKeyboardPolicy = "auto";
      field.value = latestLatex.current;
      field.addEventListener("input", () => updateLatex(field?.value ?? "", false));
      mathfieldHost.current.replaceChildren(field);
      mathfield.current = field;
      setMathfieldReady(true);
    }).catch(() => setMathfieldReady(false));
    return () => {
      active = false;
      field?.remove();
      mathfield.current = null;
    };
  }, []);

  function chooseProblem(problem: AlgebraPracticeProblem) {
    setActiveProblem(problem);
    setMode("practice");
    updateLatex("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setChecking(true);
    const next = await inspectExpression(latex, mode === "practice" ? activeProblem.answerLatex : undefined);
    setResult(next);
    setChecking(false);
  }

  return (
    <>
      <section className="tool-hero algebra-tool-hero section-pad">
        <p className="eyebrow">Tools · Mathematics · Algebra</p>
        <h1>Type it messy.<br /><em>See it clearly.</em></h1>
        <p>Use ordinary keyboard math or raw LaTeX. Check an algebra answer, or simplify an expression without sending the work to a server.</p>
        <div className="tool-badges"><span>Runs in your browser</span><span>No account</span><span>Equivalent forms accepted</span><span>Algebra-only first release</span></div>
      </section>

      <section className="algebra-checker-layout section-pad">
        <div className="algebra-checker-main">
          <div className="checker-mode-tabs" aria-label="Choose checker mode">
            <button type="button" className={mode === "practice" ? "active" : ""} onClick={() => { setMode("practice"); setResult(null); }}>Check a stored answer</button>
            <button type="button" className={mode === "simplify" ? "active" : ""} onClick={() => { setMode("simplify"); setResult(null); }}>Simplify my expression</button>
          </div>

          {mode === "practice" ? (
            <div className="checker-prompt">
              <div><span>{activeProblem.topic}</span><b>{activeProblem.prompt}</b></div>
              <Math tex={activeProblem.promptLatex} display label={activeProblem.prompt} />
            </div>
          ) : (
            <div className="checker-prompt checker-prompt-copy">
              <div><span>Calculator seed</span><b>Enter a basic algebraic expression</b></div>
              <p>Try <button type="button" onClick={() => updateLatex(String.raw`(2x-3)(x+5)`)}>(2x − 3)(x + 5)</button> or <button type="button" onClick={() => updateLatex(String.raw`4x^2-3x+5x^2+2x`)}>combine like terms</button>.</p>
            </div>
          )}

          <form className="expression-entry" onSubmit={submit}>
            <div className="entry-toolbar">
              <label>Your {mode === "practice" ? "answer" : "expression"}</label>
              <div className="input-mode-toggle" aria-label="Input format">
                <button type="button" className={inputMode === "math" ? "active" : ""} onClick={() => setInputMode("math")}>Keyboard math</button>
                <button type="button" className={inputMode === "latex" ? "active" : ""} onClick={() => setInputMode("latex")}>Raw LaTeX</button>
              </div>
            </div>
            <div ref={mathfieldHost} className={`mathfield-host ${inputMode === "latex" ? "hidden" : ""}`}>
              {!mathfieldReady && <span>Loading the math keyboard…</span>}
            </div>
            {inputMode === "latex" && <textarea value={latex} onChange={(event) => updateLatex(event.target.value)} maxLength={240} spellCheck={false} aria-label="Raw LaTeX expression" placeholder={String.raw`2x^2+7x-15`} />}
            <div className="interpreted-line">
              <span>We read that as</span>
              <div>{latex ? <Math tex={latex} display label={latex} /> : <small>Your rendered expression will appear here.</small>}</div>
            </div>
            <div className="checker-actions">
              <button className="button button-ink" type="submit" disabled={checking || !mathfieldReady}>{checking ? "Checking…" : mode === "practice" ? "Check my answer →" : "Simplify it →"}</button>
              <button className="text-button" type="button" onClick={() => updateLatex("")}>Clear</button>
            </div>
          </form>

          {result && (
            <div className={`checker-result ${result.status}`} role="status" aria-live="polite">
              <span className="result-kicker">{result.status === "correct" ? "Equivalent" : result.status === "incorrect" ? "Different" : result.status === "simplified" ? "Calculated locally" : "Checker note"}</span>
              <h2>{result.title}</h2>
              <p>{result.message}</p>
              {result.latex && <Math tex={result.latex} display className="checker-result-math" />}
              {mode === "practice" && result.status !== "correct" && <details><summary>Need the stored answer?</summary><Math tex={activeProblem.answerLatex} display /><p>{activeProblem.explanation}</p></details>}
              {result.normalizedLatex && <details><summary>Show normalized LaTeX</summary><code>{result.normalizedLatex}</code></details>}
            </div>
          )}
        </div>

        <aside className="algebra-checker-aside">
          <div className="scope-card"><span>What it checks now</span><p>Equivalent algebraic expressions: distributing, combining like terms, polynomial expansion, factoring, and exponent laws.</p></div>
          <div className="scope-card warning"><span>What it does not grade yet</span><p>Equations, inequalities, solution sets, units, domain restrictions, or answers that require a particular form.</p></div>
          {mode === "practice" && <><h2>Pick a problem</h2><ProblemPicker active={activeProblem} onPick={chooseProblem} /><div className="hint-card"><span>Hint</span><p>{activeProblem.hint}</p></div></>}
          <p className="local-note"><b>Private by design:</b> parsing and comparison happen on this device. Nothing you type is sent to a grading API.</p>
        </aside>
      </section>
    </>
  );
}
