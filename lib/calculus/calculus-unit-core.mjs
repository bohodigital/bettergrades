const semanticEnvironmentTypes = Object.freeze({
  bgadvanced: "advanced-note",
  bgapplication: "application",
  bgbridge: "bridge",
  bgcheck: "quick-check",
  bgcheckpoint: "checkpoint",
  bgconcept: "concept",
  bgdecision: "decision",
  bgdefinition: "definition",
  bgeditorialvisual: "visual-reference",
  bgexamnote: "exam-note",
  bgexample: "worked-example",
  bgexposition: "exposition",
  bggraphspec: "visual-reference",
  bgguided: "guided-walkthrough",
  bghint: "hint",
  bghomework: "problem",
  bgmethod: "method",
  bgmistake: "common-mistake",
  bgmodelinglab: "modeling-lab",
  bgproofidea: "proof-idea",
  bgquickcheck: "quick-check",
  bgreveal: "solution",
  bgsolution: "solution",
  bgsource: "source",
  bgsummary: "summary",
  bgtheorem: "theorem",
  bgtranslation: "translation",
});

const mathEnvironments = new Set(["align", "align*", "aligned", "cases", "gather", "gather*"]);
const tableEnvironments = new Set(["array", "longtable", "tabular", "tabularx"]);
const graphEnvironments = new Set(["figure", "tikzpicture", "axis", "groupplot"]);
const transparentEnvironments = new Set(["center", "description", "enumerate", "itemize", "multicols", "quote"]);
const supportedEnvironments = new Set([
  ...mathEnvironments,
  ...tableEnvironments,
  ...graphEnvironments,
  ...transparentEnvironments,
  ...Object.keys(semanticEnvironmentTypes),
  "bgexercises",
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
  return String(value)
    .replace(/(?<!\\)%[^\n]*/g, " ")
    .replace(/\\texorpdfstring\{(\\\([\s\S]*?\\\))\}\{[^}]*\}/g, "$1")
    .replace(/\\(?:webnext|webprev|webexplore)\{[^}]*\}\{[^}]*\}/g, " ")
    .replace(/\\webcomingnext\{[^}]*\}/g, " ")
    .replace(/\\addcontentsline\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, " ")
    .replace(/\\(?:cref|Cref|ref|eqref|pageref)\{[^}]*\}/g, "the referenced section")
    .replace(/\\label\{[^}]*\}/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .trim();
}

function paragraphNodes(value) {
  return cleanText(value)
    .split(/\n\s*\n+/)
    .map((text) => text.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
    .map((text) => ({ type: "paragraph", text }));
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
  const option = source.slice(0, 240).match(/^\s*\[(?:[^\]]*?title=)?\{?([^\]}]+)\}?\]/);
  if (option) return cleanText(option[1]);
  const braced = source.match(/^\s*\{([^{}]+)\}/);
  return braced ? cleanText(braced[1]) : undefined;
}

function commandArgument(source, command) {
  const marker = `\\${command}`;
  const index = source.indexOf(marker);
  if (index < 0) return null;
  let cursor = index + marker.length;
  while (/\s/.test(source[cursor] ?? "")) cursor += 1;
  return readBraced(source, cursor)?.value ?? null;
}

function normalizeMathEnvironment(tex) {
  return tex
    .replace(/\\begin\{align\*?\}/g, "\\begin{aligned}")
    .replace(/\\end\{align\*?\}/g, "\\end{aligned}")
    .replace(/\\begin\{gather\*?\}/g, "\\begin{gathered}")
    .replace(/\\end\{gather\*?\}/g, "\\end{gathered}");
}

function tableBody(inner, environment) {
  let body = String(inner).trimStart();
  if (body.startsWith("[")) {
    const end = body.indexOf("]");
    if (end >= 0) body = body.slice(end + 1).trimStart();
  }
  const argumentCount = environment === "tabularx" ? 2 : 1;
  for (let index = 0; index < argumentCount; index += 1) {
    const argument = readBraced(body, 0);
    if (!argument) break;
    body = body.slice(argument.end).trimStart();
  }
  return body;
}

function tableRows(inner, environment) {
  return tableBody(inner, environment)
    .replace(/\\(?:toprule|midrule|bottomrule|hline|endhead|endfoot)\b/g, " ")
    .split(/\\\\(?:\s*\[[^\]]*\])?/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split(/(?<!\\)&/)
      .map((cell) => cleanText(cell).replace(/\\multicolumn\{[^}]*\}\{[^}]*\}\{([^{}]*)\}/g, "$1").trim())
      .filter(Boolean)
      .map((cell) => environment === "array" ? `\\(${cell}\\)` : cell));
}

function visualReference(state, environment, inner = "") {
  const visualId = state.visualIds[state.visualIndex++];
  const caption = commandArgument(inner, "caption");
  if (!visualId) {
    return {
      type: "graph-specification",
      title: "Graph reading guide",
      text: caption || `A ${environment} visual accompanies the complete printable source.`,
    };
  }
  return {
    type: "visual-reference",
    visualId,
    title: "Visual study",
    ...(caption ? { text: cleanText(caption) } : {}),
  };
}

function exerciseNodes(source, state) {
  const matches = [...source.matchAll(/\\item(?:\[[^\]]*\])?\s*/g)];
  if (!matches.length) return [{ type: "exercise", children: paragraphNodes(source) }];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? source.length;
    return { type: "exercise", children: parseSegment(source.slice(start, end), state) };
  });
}

function parseSegment(source, state) {
  const nodes = [];
  const special = /\\(?:section\*?|subsection\*?|chapter\*?)\{|\\\[|\\begin\{|\\input\{checks\/|\\BGV[A-Za-z0-9]+/g;
  let cursor = 0;
  while (cursor < source.length) {
    special.lastIndex = cursor;
    let match;
    while ((match = special.exec(source))) {
      const preceding = source.slice(cursor, match.index);
      if (preceding.lastIndexOf("\\(") > preceding.lastIndexOf("\\)")) continue;
      break;
    }
    if (!match) {
      nodes.push(...paragraphNodes(source.slice(cursor)));
      break;
    }
    if (match.index > cursor) nodes.push(...paragraphNodes(source.slice(cursor, match.index)));
    if (/^\\(?:section|subsection|chapter)/.test(match[0])) {
      const heading = readBraced(source, source.indexOf("{", match.index));
      if (!heading) { cursor = special.lastIndex; continue; }
      const level = match[0].startsWith("\\subsection") ? 3 : 2;
      nodes.push({ type: "heading", level, text: cleanText(heading.value) });
      cursor = heading.end;
      continue;
    }
    if (match[0] === "\\[") {
      const end = source.indexOf("\\]", special.lastIndex);
      if (end < 0) throw new Error("Unclosed display-math delimiter.");
      nodes.push({ type: "math", tex: normalizeMathEnvironment(source.slice(special.lastIndex, end).trim()) });
      cursor = end + 2;
      continue;
    }
    if (match[0].startsWith("\\input")) {
      const idStart = match.index + "\\input{checks/".length;
      const idEnd = source.indexOf("}", idStart);
      if (idEnd < 0) throw new Error("Unclosed quick-check import.");
      nodes.push({ type: "quick-check", checkId: source.slice(idStart, idEnd).replace(/\.tex$/, "") });
      cursor = idEnd + 1;
      continue;
    }
    if (match[0].startsWith("\\BGV")) {
      nodes.push(visualReference(state, "authoring macro"));
      cursor = special.lastIndex;
      continue;
    }
    const begin = source.slice(match.index).match(/^\\begin\{([^}]+)\}/);
    if (!begin) { cursor = special.lastIndex; continue; }
    const environment = begin[1];
    if (!supportedEnvironments.has(environment)) throw new Error(`Unsupported LaTeX environment: ${environment}`);
    const innerStart = match.index + begin[0].length;
    const closing = findEnvironmentEnd(source, environment, innerStart);
    if (!closing) throw new Error(`Unclosed LaTeX environment: ${environment}`);
    const inner = source.slice(innerStart, closing.start);
    if (environment === "bgexercises") nodes.push(...exerciseNodes(inner, state));
    else if (environment === "bgcheck") {
      const check = inner.match(/^\s*\{([^{}]+)\}\s*\{[^{}]*\}\s*\{[^{}]*\}(?:\s*\[[^\]]*\])?/);
      const body = check ? inner.slice(check[0].length) : inner;
      nodes.push({
        type: "quick-check",
        ...(check ? { checkId: cleanText(check[1]) } : {}),
        children: parseSegment(body, state),
      });
    } else if (mathEnvironments.has(environment)) {
      nodes.push({ type: "math", tex: normalizeMathEnvironment(`\\begin{${environment}}${inner}\\end{${environment}}`) });
    } else if (tableEnvironments.has(environment)) {
      nodes.push({ type: "table", environment, rows: tableRows(inner, environment) });
    } else if (graphEnvironments.has(environment)) {
      nodes.push(visualReference(state, environment, inner));
    } else if (environment === "enumerate" && state.enumerateAsExercises) {
      nodes.push(...exerciseNodes(inner, state));
    } else if (transparentEnvironments.has(environment)) {
      nodes.push(...parseSegment(inner, state));
    } else {
      const type = semanticEnvironmentTypes[environment];
      if (type === "visual-reference") nodes.push(visualReference(state, environment, inner));
      else {
        const title = environmentTitle(inner);
        nodes.push({
          type,
          ...(title ? { title } : {}),
          ...(type === "quick-check" && title ? { checkId: title } : {}),
          children: parseSegment(inner, state),
        });
      }
    }
    cursor = closing.end;
  }
  return nodes;
}

export function parseCalculusUnitPage(source, { visualIds = [], enumerateAsExercises = false } = {}) {
  const value = String(source);
  const marker = "\\lessonobjective";
  const objectiveStart = value.indexOf(marker);
  let objective = null;
  let body = value;
  if (objectiveStart >= 0) {
    const braceStart = value.indexOf("{", objectiveStart + marker.length);
    const braced = readBraced(value, braceStart);
    if (!braced) throw new Error("Unclosed lesson objective.");
    objective = braced.value;
    body = value.slice(0, objectiveStart) + value.slice(braced.end);
  }
  const state = { visualIds: [...visualIds], visualIndex: 0, enumerateAsExercises };
  const nodes = parseSegment(body, state);
  if (objective) nodes.unshift({ type: "concept", title: "Learning objectives", children: paragraphNodes(objective) });
  while (state.visualIndex < state.visualIds.length) nodes.push(visualReference(state, "registered visual"));
  return nodes;
}
