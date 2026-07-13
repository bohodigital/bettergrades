import { algebraTerms } from "./terms/algebra.mjs";
import { calculusTerms } from "./terms/calculus.mjs";
import { foundationTerms } from "./terms/foundations.mjs";
import { symbolTerms } from "./terms/symbols.mjs";

export const mathGlossaryCategories = Object.freeze([
  { id: "symbols", label: "Symbols & notation", description: "What the marks mean and how their context changes the reading." },
  { id: "foundations", label: "Foundations", description: "The shared language of quantities, functions, sets, graphs, and models." },
  { id: "algebra", label: "Algebra", description: "Equations, functions, factoring, rational expressions, and exponential structure." },
  { id: "calculus", label: "Calculus", description: "Limits, derivatives, integrals, applications, sequences, and series." },
]);

export const mathGlossaryTerms = Object.freeze(
  [...symbolTerms, ...foundationTerms, ...algebraTerms, ...calculusTerms]
    .sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" })),
);

const termById = new Map(mathGlossaryTerms.map((term) => [term.id, term]));

export function getMathGlossaryTerm(id) {
  return termById.get(id);
}

export function glossaryLetter(term) {
  const letter = term.term.normalize("NFKD").replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase();
  return letter || "#";
}

export function normalizeGlossaryText(value) {
  return String(value).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function searchMathGlossary(query, { categoryId = "all", limit = Infinity } = {}) {
  const clean = normalizeGlossaryText(query);
  const words = clean.split(" ").filter(Boolean);
  return mathGlossaryTerms
    .filter((term) => categoryId === "all" || term.categoryId === categoryId)
    .map((term) => {
      const name = normalizeGlossaryText(term.term);
      const aliases = normalizeGlossaryText(term.aliases.join(" "));
      const keywords = normalizeGlossaryText(term.keywords.join(" "));
      const definitions = normalizeGlossaryText(`${term.shortDefinition} ${term.definition}`);
      let score = !clean ? 1 : name === clean ? 100 : name.includes(clean) ? 50 : aliases.includes(clean) ? 35 : 0;
      for (const word of words) {
        if (name.includes(word)) score += 18;
        else if (aliases.includes(word)) score += 12;
        else if (keywords.includes(word)) score += 8;
        else if (definitions.includes(word)) score += 3;
      }
      return { term, score };
    })
    .filter(({ score }) => !clean || score > 0)
    .sort((a, b) => b.score - a.score || a.term.term.localeCompare(b.term.term))
    .slice(0, limit)
    .map(({ term }) => term);
}

export function contextualGlossaryTerms(text, preferredIds = [], limit = 6) {
  const context = normalizeGlossaryText(text);
  const preferred = preferredIds.map(getMathGlossaryTerm).filter(Boolean);
  const ranked = mathGlossaryTerms
    .filter((term) => !preferredIds.includes(term.id))
    .map((term) => {
      const phrases = [term.term, ...term.aliases, ...term.keywords].map(normalizeGlossaryText).filter((value) => value.length >= 2);
      const score = phrases.reduce((total, phrase) => total + (context.includes(phrase) ? (phrase.includes(" ") ? 16 : 5) : 0), 0);
      return { term, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.term.term.localeCompare(b.term.term))
    .map(({ term }) => term);
  return [...new Map([...preferred, ...ranked].map((term) => [term.id, term])).values()].slice(0, limit);
}

export const latexCommandGlossaryMap = Object.freeze({
  approx: "approximately-equal", cdot: "multiplication-dot", times: "multiplication-cross", div: "division-symbol",
  angle: "angle-symbol", cap: "intersection-symbol", cup: "union-symbol", subseteq: "subset-symbol",
  Delta: "delta-symbol", in: "set-membership", notin: "not-in-symbol", infinity: "infinity-symbol", int: "integral-symbol",
  sum: "summation-symbol", prod: "product-symbol", pi: "pi-symbol", pm: "plus-minus-sign", sqrt: "radical-symbol",
  ne: "not-equal-sign", le: "less-than-or-equal", ge: "greater-than-or-equal", mapsto: "maps-to-symbol",
  Rightarrow: "implies-symbol", Longrightarrow: "implies-symbol", Longleftrightarrow: "if-and-only-if", iff: "if-and-only-if",
  longrightarrow: "transition-arrow",
  infty: "infinity-symbol", mathbb: "real-number-symbol", varnothing: "empty-set-symbol", perp: "perpendicular-symbol",
  parallel: "parallel-symbol", circ: "composition-symbol", partial: "partial-symbol", nabla: "nabla-symbol",
  dot: "dot-notation", ddot: "dot-notation", ell: "line", not: "negation-symbol", leftrightarrow: "if-and-only-if",
  theta: "angle-symbol", varepsilon: "limit", frac: "fraction-bar", dfrac: "fraction-bar", lim: "limit",
  ln: "natural-logarithm", log: "logarithm", sin: "function", cos: "function", tan: "function", sec: "function",
  csc: "function", cot: "function", arcsin: "inverse-function", arctan: "inverse-function", deg: "polynomial-degree",
  gcd: "greatest-common-factor", min: "local-minimum", sim: "approximately-equal", exists: "solution-set",
  ldots: "ellipsis", cdots: "ellipsis",
});

export const latexStructuralCommands = Object.freeze(new Set([
  "begin", "end", "section", "text", "textbf", "emph", "boxed", "left", "right", "big", "bigg", "bigl", "bigr",
  "quad", "qquad", "displaystyle", "operatorname", "mathrm", "underbrace", "color", "rm", "xrightarrow", "to",
  "!", ",", ";", " ",
]));

export const uppercaseVariableConventions = Object.freeze({
  A: "Area, amount, a named set, or a traditional standard-form coefficient when the page defines that role.",
  B: "A named set or a traditional standard-form coefficient only when that role is being discussed.",
  C: "The arbitrary constant of integration, a traditional standard-form coefficient, or a named contextual quantity explicitly defined on the page.",
  F: "A named antiderivative, implicit relation, cumulative function, or physical force explicitly defined on the page.",
  I: "A named integral used to collect a cyclic integration equation.",
  L: "A limit value, linearization, arc length, or explicitly named bound.",
  M: "A documented maximum derivative bound in an error estimate.",
  P: "A named proposition in a logic statement.",
  Q: "A named proposition in a logic statement.",
  R: "A Taylor remainder or the outer radius in the washer method.",
  S: "Surface area or a sequence of partial sums.",
  V: "Volume.",
  W: "Work.",
});

function stripNonVariableLatex(source) {
  return String(source)
    .replace(/\\(?:text|mathrm|operatorname)\{[^{}]*\}/g, "")
    .replace(/\\mathbb\{[A-Z]\}/g, "")
    .replace(/\\[A-Za-z]+/g, "")
    .replace(/\\./g, "");
}

export function validateMathNotation(source) {
  const text = String(source);
  const segments = [
    ...[...text.matchAll(/\\\[([\s\S]*?)\\\]/g)].map((match) => match[1]),
    ...[...text.matchAll(/\\\(([\s\S]*?)\\\)/g)].map((match) => match[1]),
  ];
  const mathematicalSource = segments.length ? segments.join("\n") : text;
  const commandSource = mathematicalSource.replaceAll(String.raw`\\`, "");
  const commands = [...commandSource.matchAll(/\\([A-Za-z]+|[,;! ])/g)].map((match) => match[1]);
  const unknownCommands = [...new Set(commands.filter((command) => !latexStructuralCommands.has(command) && !latexCommandGlossaryMap[command]))];
  const variableText = stripNonVariableLatex(commandSource);
  const uppercaseVariables = [...new Set(variableText.match(/\b[A-Z]\b/g) ?? [])];
  const undocumentedUppercase = uppercaseVariables.filter((letter) => !uppercaseVariableConventions[letter]);
  return { unknownCommands, undocumentedUppercase };
}

export function validateMathGlossary() {
  const errors = [];
  if (mathGlossaryTerms.length < 150) errors.push(`Expected at least 150 terms; found ${mathGlossaryTerms.length}.`);
  const ids = mathGlossaryTerms.map((term) => term.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`Duplicate glossary ids: ${[...new Set(duplicateIds)].join(", ")}.`);
  const names = mathGlossaryTerms.map((term) => normalizeGlossaryText(term.term));
  const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicateNames.length) errors.push(`Duplicate glossary terms: ${[...new Set(duplicateNames)].join(", ")}.`);
  for (const term of mathGlossaryTerms) {
    if (!mathGlossaryCategories.some((category) => category.id === term.categoryId)) errors.push(`Unknown category for ${term.id}.`);
    if (!term.shortDefinition.trim() || !term.definition.trim()) errors.push(`Missing definition for ${term.id}.`);
    if (!term.visuals.length || term.visuals.some((visual) => !visual.tex.trim() || !visual.label.trim())) errors.push(`Missing visual for ${term.id}.`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(term.id)) errors.push(`Invalid stable id: ${term.id}.`);
    for (const visual of term.visuals) {
      const notation = validateMathNotation(visual.tex);
      if (notation.unknownCommands.length) errors.push(`Undocumented LaTeX commands for ${term.id}: ${notation.unknownCommands.map((command) => `\\${command}`).join(", ")}.`);
      if (notation.undocumentedUppercase.length) errors.push(`Undocumented uppercase variables for ${term.id}: ${notation.undocumentedUppercase.join(", ")}.`);
    }
  }
  for (const [command, termId] of Object.entries(latexCommandGlossaryMap)) if (!getMathGlossaryTerm(termId)) errors.push(`LaTeX command \\${command} maps to missing ${termId}.`);
  return errors;
}
