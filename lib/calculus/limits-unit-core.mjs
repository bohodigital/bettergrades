import { compareAlgebraExpressions } from "../algebra-calculator.mjs";

export const LIMITS_UNIT_PREFIX = "/subjects/math/calculus/limits-continuity/unit/";

const semanticEnvironmentTypes = Object.freeze({
  bgdefinition: "definition", bgtheorem: "theorem", bgconcept: "concept", bgmethod: "method",
  bgexample: "worked-example", bgguided: "guided-walkthrough", bghomework: "problem",
  bghint: "hint", bgsolution: "solution", bgreveal: "solution", bgcheck: "quick-check",
  bgquickcheck: "quick-check", bgmistake: "common-mistake", bgexamnote: "exam-note",
  bgsummary: "summary", bggraphspec: "graph-specification", bgsource: "source",
});
const mathEnvironments = new Set(["align", "align*", "aligned", "cases", "gather", "gather*"]);
const tableEnvironments = new Set(["array", "longtable", "tabular", "tabularx"]);
const graphEnvironments = new Set(["figure", "tikzpicture", "axis", "groupplot"]);
const transparentEnvironments = new Set(["center", "description", "enumerate", "itemize", "quote"]);
const supportedEnvironments = new Set([
  ...mathEnvironments, ...tableEnvironments, ...graphEnvironments, ...transparentEnvironments,
  ...Object.keys(semanticEnvironmentTypes), "bgexercises",
]);

function readBraced(value, start) {
  if (value[start] !== "{") return null;
  let depth = 0;
  for (let index = start; index < value.length; index += 1) {
    const escaped = value[index - 1] === "\\";
    if (value[index] === "{" && !escaped) depth += 1;
    if (value[index] === "}" && !escaped) depth -= 1;
    if (depth === 0) return { value: value.slice(start + 1, index), end: index + 1 };
  }
  return null;
}

function cleanText(value) {
  return String(value).replace(/%[^\n]*/g, " ")
    .replace(/\\(?:webnext|webprev)\{[^}]*\}\{[^}]*\}/g, " ")
    .replace(/\\addcontentsline\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, " ")
    .replace(/\\label\{[^}]*\}/g, " ").replace(/\n[ \t]+/g, "\n").trim();
}

function paragraphNodes(value) {
  return cleanText(value).split(/\n\s*\n+/).map((text) => text.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean).map((text) => ({ type: "paragraph", text }));
}

function findEnvironmentEnd(source, environment, start) {
  const token = /\\(begin|end)\{([^}]+)\}/g;
  token.lastIndex = start;
  let depth = 1;
  let match;
  while ((match = token.exec(source))) {
    if (match[2] !== environment) continue;
    depth += match[1] === "begin" ? 1 : -1;
    if (depth === 0) return { start: match.index, end: token.lastIndex };
  }
  return null;
}

function environmentTitle(source) {
  const option = source.slice(0, 180).match(/^\s*\[(?:[^\]]*?title=)?\{?([^\]}]+)\}?\]/);
  if (option) return cleanText(option[1]);
  const braced = source.match(/^\s*\{([^{}]+)\}/);
  return braced ? cleanText(braced[1]) : undefined;
}

function normalizeMathEnvironment(tex) {
  return tex.replace(/\\begin\{align\*?\}/g, "\\begin{aligned}").replace(/\\end\{align\*?\}/g, "\\end{aligned}")
    .replace(/\\begin\{gather\*?\}/g, "\\begin{gathered}").replace(/\\end\{gather\*?\}/g, "\\end{gathered}")
    .replace(/\\begin\{cases\}/g, "\\left\\{\\matrix{").replace(/\\end\{cases\}/g, "}\\right.");
}

function tableRows(inner) {
  const body = inner.replace(/^\s*\{[^{}]*\}/, "").replace(/\\(?:toprule|midrule|bottomrule|hline|endhead|endfoot)\b/g, " ");
  return body.split(/\\\\(?:\s*\[[^\]]*\])?/).map((row) => row.trim()).filter(Boolean)
    .map((row) => row.split(/(?<!\\)&/).map((cell) => cleanText(cell)
      .replace(/\\multicolumn\{[^}]*\}\{[^}]*\}\{([^{}]*)\}/g, "$1").trim()).filter(Boolean));
}

function structuredDisplayNode(tex) {
  const match = String(tex).match(/^\s*\\begin\{([^}]+)\}([\s\S]*)\\end\{\1\}\s*$/);
  if (!match) return { type: "math", tex: normalizeMathEnvironment(String(tex).trim()) };
  const [, environment, inner] = match;
  if (tableEnvironments.has(environment)) return { type: "table", environment, rows: tableRows(inner) };
  if (graphEnvironments.has(environment)) return { type: "graph-specification", title: environmentTitle(inner), text: cleanText(inner), children: parseSegment(inner) };
  return { type: "math", tex: normalizeMathEnvironment(String(tex).trim()) };
}

function exerciseNodes(source) {
  const nodes = [];
  const matches = [...source.matchAll(/\\item(?:\[[^\]]*\])?\s*/g)];
  for (let index = 0; index < matches.length; index += 1) {
    const start = matches[index].index + matches[index][0].length;
    const end = matches[index + 1]?.index ?? source.length;
    const body = cleanText(source.slice(start, end));
    if (body) nodes.push({ type: "exercise", children: parseSegment(body) });
  }
  return nodes.length ? nodes : [{ type: "exercise", children: paragraphNodes(source) }];
}

function parseSegment(source) {
  const nodes = [];
  const special = /\\(?:section\*?|subsection\*?)\{|\\\[|\\begin\{|\\input\{checks\//g;
  let cursor = 0;
  while (cursor < source.length) {
    special.lastIndex = cursor;
    const match = special.exec(source);
    if (!match) { nodes.push(...paragraphNodes(source.slice(cursor))); break; }
    if (match.index > cursor) nodes.push(...paragraphNodes(source.slice(cursor, match.index)));
    if (/^\\(?:section|subsection)/.test(match[0])) {
      const heading = readBraced(source, source.indexOf("{", match.index));
      if (!heading) { cursor = special.lastIndex; continue; }
      nodes.push({ type: "heading", level: match[0].startsWith("\\subsection") ? 3 : 2, text: cleanText(heading.value) });
      cursor = heading.end; continue;
    }
    if (match[0] === "\\[") {
      const end = source.indexOf("\\]", special.lastIndex);
      if (end === -1) { nodes.push({ type: "math", tex: cleanText(source.slice(special.lastIndex)) }); break; }
      nodes.push(structuredDisplayNode(source.slice(special.lastIndex, end).trim()));
      cursor = end + 2; continue;
    }
    if (match[0].startsWith("\\input")) {
      const idStart = match.index + "\\input{checks/".length;
      const idEnd = source.indexOf("}", idStart);
      if (idEnd === -1) { cursor = special.lastIndex; continue; }
      nodes.push({ type: "quick-check", checkId: source.slice(idStart, idEnd).replace(/\.tex$/, "") });
      cursor = idEnd + 1; continue;
    }
    const begin = source.slice(match.index).match(/^\\begin\{([^}]+)\}/);
    if (!begin) { cursor = special.lastIndex; continue; }
    const environment = begin[1];
    const innerStart = match.index + begin[0].length;
    const closing = findEnvironmentEnd(source, environment, innerStart);
    if (!closing) { nodes.push(...paragraphNodes(source.slice(match.index))); break; }
    const inner = source.slice(innerStart, closing.start);
    if (environment === "bgexercises") nodes.push(...exerciseNodes(inner));
    else if (environment === "bgcheck") {
      const check = inner.match(/^\s*\{([^{}]+)\}\s*\{[^{}]*\}\s*\{[^{}]*\}(?:\s*\[[^\]]*\])?/);
      const body = check ? inner.slice(check[0].length) : inner;
      nodes.push(check ? { type: "quick-check", checkId: cleanText(check[1]), children: parseSegment(body) } : { type: "quick-check", children: parseSegment(body) });
    } else if (mathEnvironments.has(environment)) nodes.push({ type: "math", tex: normalizeMathEnvironment(`\\begin{${environment}}${inner}\\end{${environment}}`) });
    else if (tableEnvironments.has(environment)) nodes.push({ type: "table", environment, rows: tableRows(inner) });
    else if (graphEnvironments.has(environment)) nodes.push({ type: "graph-specification", title: environmentTitle(inner), text: cleanText(inner), children: parseSegment(inner) });
    else if (semanticEnvironmentTypes[environment]) {
      const type = semanticEnvironmentTypes[environment];
      const title = environmentTitle(inner);
      nodes.push({ type, ...(title ? { title } : {}), ...(type === "quick-check" && title ? { checkId: title } : {}), children: parseSegment(inner) });
    } else if (transparentEnvironments.has(environment)) nodes.push(...parseSegment(inner));
    else if (!supportedEnvironments.has(environment)) throw new Error(`Unsupported LaTeX environment: ${environment}`);
    else nodes.push(...parseSegment(inner));
    cursor = closing.end;
  }
  return nodes;
}

export function parseLimitsUnitPage(source) {
  const value = String(source);
  const marker = "\\lessonobjective";
  const objectiveStart = value.indexOf(marker);
  let objective = null;
  let body = value;

  if (objectiveStart >= 0) {
    const braceStart = value.indexOf("{", objectiveStart + marker.length);
    const braced = readBraced(value, braceStart);
    if (braced) {
      objective = braced.value;
      body = value.slice(0, objectiveStart) + value.slice(braced.end);
    }
  }

  const nodes = parseSegment(body);
  if (objective) nodes.unshift({ type: "concept", title: "Learning objectives", children: paragraphNodes(objective) });
  return nodes;
}

export function canonicalLimitsUnitPath(sourceSlug) {
  if (sourceSlug === "calculus/limits-and-continuity") return LIMITS_UNIT_PREFIX;
  const suffix = String(sourceSlug).replace(/^calculus\//, "").replace(/^\/+|\/+$/g, "");
  return `${LIMITS_UNIT_PREFIX}${suffix}/`;
}

function normalizeChoice(value) {
  const normalized = String(value).toLowerCase().trim().replace(/[\s_{}\\]+/g, "").replace(/∞/g, "infinity");
  if (["dne", "doesnotexist", "undefined", "nolimit"].includes(normalized)) return "dne";
  if (["+infinity", "positiveinfinity", "infinity"].includes(normalized)) return "+infinity";
  if (["-infinity", "negativeinfinity"].includes(normalized)) return "-infinity";
  return normalized;
}

function numericValue(value) {
  const normalized = String(value).trim().replace(/[−–—]/g, "-");
  const fraction = normalized.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/);
  if (fraction) { const denominator = Number(fraction[2]); return denominator === 0 ? null : Number(fraction[1]) / denominator; }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const result = Number(normalized); return Number.isFinite(result) ? result : null;
}

function normalizeExpression(value) {
  return String(value).trim().replace(/\\(?:varepsilon|epsilon)|ε/g, "epsilon")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
    .replace(/\\min\s*\{([^{}]+)\}/g, "min($1)").replace(/[{}\s]/g, "").replace(/\(([^()]+)\)/g, "$1").replace(/[−–—]/g, "-");
}

function isSufficientEpsilonDelta(check, answer) {
  if (check.id !== "epsilon-flow-01") return false;
  const [numerator, denominator] = normalizeExpression(answer).split("/");
  const divisor = Number(denominator);
  return numerator === "epsilon" && Number.isFinite(divisor) && divisor >= 2;
}

export async function compareLimitAnswer(check, answer) {
  const attempted = String(answer ?? "").trim();
  if (!attempted) return { status: "empty", feedback: "Enter an answer before checking.", revealAllowed: false };
  let correct = false;
  if (check.answerType === "integer" || check.answerType === "rational") {
    const actual = numericValue(attempted); const expected = numericValue(check.canonicalAnswer);
    correct = actual !== null && expected !== null && Math.abs(actual - expected) <= 1e-12;
  } else if (check.answerType === "choice") correct = normalizeChoice(attempted) === normalizeChoice(check.canonicalAnswer);
  else if (check.answerType === "expression") {
    const actual = normalizeExpression(attempted); const expected = normalizeExpression(check.canonicalAnswer);
    if (actual === expected || isSufficientEpsilonDelta(check, attempted)) correct = true;
    else correct = (await compareAlgebraExpressions(expected, actual)).status === "correct";
  }
  return { status: correct ? "correct" : "incorrect", feedback: correct ? "Correct. Your answer is mathematically equivalent." : "Not yet. Use the hint, check the method, and try again.", revealAllowed: true };
}

export function validateLimitsUnitPayload(payload) {
  const errors = [];
  if (payload.routes?.length !== 71) errors.push("Expected 71 routes.");
  if (payload.pages?.length !== 71) errors.push("Expected 71 page fragments.");
  if (payload.checks?.length !== 38) errors.push("Expected 38 checks.");
  const duplicateValues = (values) => values.filter((value, index) => values.indexOf(value) !== index);
  for (const [label, values] of [["path", payload.routes.map((r) => r.path)], ["title", payload.routes.map((r) => r.title)], ["H1", payload.routes.map((r) => r.h1)], ["description", payload.routes.map((r) => r.description)], ["check id", payload.checks.map((c) => c.id)]]) {
    const duplicates = [...new Set(duplicateValues(values))];
    if (duplicates.length) errors.push(`Duplicate ${label}: ${duplicates.join(", ")}`);
  }
  const routeSlugs = new Set(payload.routes.map((route) => route.sourceSlug));
  const routePaths = new Set(payload.routes.map((route) => route.path));
  const pageFiles = new Set(payload.pages.map((page) => page.sourceFile));
  for (const route of payload.routes) {
    if (!route.path.startsWith(LIMITS_UNIT_PREFIX)) errors.push(`Route outside unit prefix: ${route.path}`);
    if (!route.title || !route.h1 || !route.description || route.breadcrumbs.length < 4) errors.push(`Incomplete metadata: ${route.sourceSlug}`);
    if (!pageFiles.has(route.sourceFile)) errors.push(`Missing page: ${route.sourceFile}`);
    for (const slug of [...route.relatedResources, route.previousCoreSlug, route.nextCoreSlug, route.returnToSequenceSlug].filter(Boolean)) if (!routeSlugs.has(slug)) errors.push(`Broken route link ${slug} from ${route.sourceSlug}`);
  }
  const checkIds = new Set(payload.checks.map((check) => check.id));
  for (const route of payload.routes) {
    const uniqueIds = new Set(route.checkIds);
    if (uniqueIds.size !== route.checkIds.length) errors.push(`Duplicate route check ID: ${route.sourceSlug}`);
    for (const checkId of route.checkIds) if (!checkIds.has(checkId)) errors.push(`Missing check reference ${checkId} from ${route.sourceSlug}`);
  }
  const core = payload.routes.filter((route) => route.isCoreSequence).sort((a, b) => a.coreSequenceIndex - b.coreSequenceIndex);
  if (core.length !== 47) errors.push("Expected 47 core routes.");
  core.forEach((route, index) => {
    if (route.coreSequenceIndex !== index + 1) errors.push(`Invalid core index: ${route.sourceSlug}`);
    if ((route.previousCoreSlug ?? null) !== (core[index - 1]?.sourceSlug ?? null)) errors.push(`Broken previous core link: ${route.sourceSlug}`);
    if ((route.nextCoreSlug ?? null) !== (core[index + 1]?.sourceSlug ?? null)) errors.push(`Broken next core link: ${route.sourceSlug}`);
  });
  for (const check of payload.checks) {
    if (!routeSlugs.has(check.routeSlug)) errors.push(`Missing check route: ${check.id}`);
    if (!["choice", "expression", "integer", "rational"].includes(check.answerType)) errors.push(`Unsupported answer type: ${check.id}`);
    if (!check.hintLatex || !check.workedFeedbackLatex || !check.attemptRequiredBeforeReveal) errors.push(`Incomplete check: ${check.id}`);
  }
  if (payload.source?.provenance?.status !== "bettergrades-original") errors.push("Unit provenance is not rights-separated.");
  if (payload.source?.provenance?.activeCalculusAdaptedMaterial !== false) errors.push("Active Calculus adaptation status is ambiguous.");
  if (!routePaths.has(LIMITS_UNIT_PREFIX)) errors.push("Missing unit landing page.");
  return errors;
}
