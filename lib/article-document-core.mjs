const KNOWN_ENVIRONMENTS = new Set(["bgarticle", "bgbox", "bgexample", "itemize", "enumerate", "aligned", "cases"]);

function readBraced(value, start) {
  if (value[start] !== "{") return null;
  let depth = 0;
  for (let index = start; index < value.length; index += 1) {
    if (value[index] === "{" && value[index - 1] !== "\\") depth += 1;
    if (value[index] === "}" && value[index - 1] !== "\\") depth -= 1;
    if (depth === 0) return { value: value.slice(start + 1, index), end: index + 1 };
  }
  return null;
}

export function escapeLatexText(value) {
  const replacements = {
    "\\": String.raw`\textbackslash{}`,
    "&": String.raw`\&`, "%": String.raw`\%`, "$": String.raw`\$`, "#": String.raw`\#`,
    "_": String.raw`\_`, "{": String.raw`\{`, "}": String.raw`\}`,
    "~": String.raw`\textasciitilde{}`, "^": String.raw`\textasciicircum{}`,
  };
  return [...String(value)].map((character) => replacements[character] ?? character).join("");
}

function unescapeLatexText(value, trim = true) {
  const normalized = value
    .replace(/\\textbackslash\{\}/g, "\\")
    .replace(/\\textasciitilde\{\}/g, "~")
    .replace(/\\textasciicircum\{\}/g, "^")
    .replace(/\\([&%$#_{}])/g, "$1")
    .replace(/\s+/g, " ");
  return trim ? normalized.trim() : normalized;
}

export function parseLatexInline(source) {
  const nodes = [];
  let cursor = 0;
  let textStart = 0;

  const pushText = (end) => {
    const value = unescapeLatexText(source.slice(textStart, end), false);
    if (value.trim()) nodes.push({ type: "text", value });
  };

  while (cursor < source.length) {
    if (source.startsWith(String.raw`\(`, cursor)) {
      const end = source.indexOf(String.raw`\)`, cursor + 2);
      if (end !== -1) {
        pushText(cursor);
        nodes.push({ type: "math", value: source.slice(cursor + 2, end).trim() });
        cursor = end + 2;
        textStart = cursor;
        continue;
      }
    }

    const command = source.startsWith(String.raw`\textbf{`, cursor)
      ? { type: "strong", offset: 7 }
      : source.startsWith(String.raw`\emph{`, cursor)
        ? { type: "emphasis", offset: 5 }
        : null;
    if (command) {
      const braced = readBraced(source, cursor + command.offset);
      if (braced) {
        pushText(cursor);
        nodes.push({ type: command.type, value: unescapeLatexText(braced.value) });
        cursor = braced.end;
        textStart = cursor;
        continue;
      }
    }
    cursor += 1;
  }
  pushText(source.length);
  return nodes;
}

function parseTitle(line, command) {
  const prefix = `\\${command}{`;
  if (!line.startsWith(prefix)) return null;
  const braced = readBraced(line, prefix.length - 1);
  return braced ? unescapeLatexText(braced.value) : null;
}

function collectParagraph(lines, start, stop) {
  const parts = [];
  let index = start;
  while (index < lines.length && !stop(lines[index].trim())) {
    const line = lines[index].trim();
    if (!line) break;
    parts.push(line);
    index += 1;
  }
  return { value: parts.join(" "), next: index };
}

function parseNodes(lines, start = 0, endEnvironment = null) {
  const nodes = [];
  let index = start;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line || line.startsWith("%")) {
      index += 1;
      continue;
    }
    if (endEnvironment && line === `\\end{${endEnvironment}}`) return { nodes, next: index + 1 };
    if (line === String.raw`\begin{bgarticle}` || line === String.raw`\end{bgarticle}`) {
      index += 1;
      continue;
    }

    const section = parseTitle(line, "section") ?? parseTitle(line, "section*");
    if (section) {
      nodes.push({ type: "section", heading: section });
      index += 1;
      continue;
    }

    const boxMatch = line.match(/^\\begin\{(bgbox|bgexample)\}\{(.*)\}$/);
    if (boxMatch) {
      const nested = parseNodes(lines, index + 1, boxMatch[1]);
      nodes.push({
        type: "box",
        kind: boxMatch[1] === "bgexample" ? "example" : "note",
        title: unescapeLatexText(boxMatch[2]),
        children: nested.nodes,
      });
      index = nested.next;
      continue;
    }

    const listMatch = line.match(/^\\begin\{(itemize|enumerate)\}$/);
    if (listMatch) {
      const items = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== `\\end{${listMatch[1]}}`) {
        const item = lines[index].trim().match(/^\\item\s+(.+)$/);
        if (item) items.push(parseLatexInline(item[1]));
        index += 1;
      }
      nodes.push({ type: "list", ordered: listMatch[1] === "enumerate", items });
      index += 1;
      continue;
    }

    if (line === String.raw`\[`) {
      const math = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== String.raw`\]`) {
        math.push(lines[index]);
        index += 1;
      }
      nodes.push({ type: "math", tex: math.join("\n").trim() });
      index += 1;
      continue;
    }

    const paragraph = collectParagraph(lines, index, (next) =>
      !next ||
      next === String.raw`\[` ||
      next.startsWith(String.raw`\section{`) ||
      next.startsWith(String.raw`\section*{`) ||
      next.startsWith(String.raw`\begin{`) ||
      next.startsWith(String.raw`\end{`),
    );
    if (paragraph.value) nodes.push({ type: "paragraph", children: parseLatexInline(paragraph.value) });
    index = paragraph.next === index ? index + 1 : paragraph.next;
  }
  return { nodes, next: index };
}

export function parseLatexArticle(source) {
  return parseNodes(String(source).replace(/\r\n?/g, "\n").split("\n")).nodes;
}

export function articleToLatexSource(article) {
  const output = [String.raw`\begin{bgarticle}`, ""];
  if (article.formula) output.push(String.raw`\[`, article.formula, String.raw`\]`, "");
  if (article.immediate) {
    output.push(`\\begin{bgbox}{${escapeLatexText(`Start here: ${article.immediate.label}`)}}`);
    if (article.immediate.tex) output.push(String.raw`\[`, article.immediate.tex, String.raw`\]`, "");
    output.push(escapeLatexText(article.immediate.text), String.raw`\end{bgbox}`, "");
  }
  for (const section of article.sections) {
    output.push(`\\section{${escapeLatexText(section.heading)}}`);
    for (const paragraph of section.paragraphs) output.push(escapeLatexText(paragraph), "");
    if (section.tex) output.push(String.raw`\[`, section.tex, String.raw`\]`, "");
  }

  output.push(String.raw`\section{Worked example}`);
  output.push(`\\begin{bgexample}{${escapeLatexText(article.example.heading)}}`);
  output.push(`${String.raw`\textbf{Prompt:}`} ${escapeLatexText(article.example.prompt)}`, "");
  for (const step of article.example.steps) {
    output.push(String.raw`\[`, step.tex, String.raw`\]`);
    output.push(`\\emph{${escapeLatexText(step.note)}}`, "");
  }
  output.push(String.raw`\textbf{Result}`, String.raw`\[`, article.example.result, String.raw`\]`);
  output.push(String.raw`\end{bgexample}`, "");

  output.push(String.raw`\section{Common mistakes}`, String.raw`\begin{itemize}`);
  for (const mistake of article.mistakes) output.push(`\\item ${escapeLatexText(mistake)}`);
  output.push(String.raw`\end{itemize}`, "");
  output.push(String.raw`\section{Keep these ideas}`, String.raw`\begin{itemize}`);
  for (const takeaway of article.takeaways) output.push(`\\item ${escapeLatexText(takeaway)}`);
  output.push(String.raw`\end{itemize}`, "", String.raw`\end{bgarticle}`);
  return output.join("\n");
}

function markdownInline(value) {
  const math = [];
  const protectedValue = value.replace(/\$([^$\n]+)\$/g, (_, tex) => {
    const token = `BGMATHTOKEN${math.length}ZZ`;
    math.push(tex);
    return token;
  });
  return escapeLatexText(protectedValue)
    .replace(/\*\*([^*]+)\*\*/g, String.raw`\textbf{$1}`)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, String.raw`\emph{$1}`)
    .replace(/BGMATHTOKEN(\d+)ZZ/g, (_, index) => `${String.raw`\(`}${math[Number(index)]}${String.raw`\)`}`);
}

export function markdownToLatexArticle(markdown) {
  const normalized = String(markdown).replace(/\r\n?/g, "\n").replace(/^---\n[\s\S]*?\n---\n?/, "");
  const lines = normalized.split("\n");
  const output = [String.raw`\begin{bgarticle}`, ""];
  let list = null;
  let callout = null;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) output.push(markdownInline(paragraph.join(" ")), "");
    paragraph = [];
  };
  const closeList = () => {
    if (list) output.push(`\\end{${list}}`, "");
    list = null;
  };
  const closeCallout = () => {
    if (callout) output.push(`\\end{${callout}}`, "");
    callout = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    const calloutStart = trimmed.match(/^>\s*\[!(NOTE|TIP|EXAMPLE)\]\s*(.*)$/i);
    if (calloutStart) {
      flushParagraph(); closeList(); closeCallout();
      callout = calloutStart[1].toUpperCase() === "EXAMPLE" ? "bgexample" : "bgbox";
      output.push(`\\begin{${callout}}{${escapeLatexText(calloutStart[2] || "Note")}}`);
      continue;
    }
    if (callout && /^>/.test(trimmed)) {
      const value = trimmed.replace(/^>\s?/, "");
      if (value) output.push(markdownInline(value), "");
      continue;
    }
    if (callout) closeCallout();

    const displayStart = trimmed === "$$";
    if (displayStart) {
      flushParagraph(); closeList();
      const math = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== "$$") {
        math.push(lines[index]);
        index += 1;
      }
      output.push(String.raw`\[`, math.join("\n").trim(), String.raw`\]`, "");
      continue;
    }
    const oneLineMath = trimmed.match(/^\$\$(.+)\$\$$/);
    if (oneLineMath) {
      flushParagraph(); closeList();
      output.push(String.raw`\[`, oneLineMath[1].trim(), String.raw`\]`, "");
      continue;
    }
    const heading = trimmed.match(/^##\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeList();
      output.push(`\\section{${escapeLatexText(heading[1])}}`, "");
      continue;
    }
    if (/^#\s+/.test(trimmed)) continue;

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const requested = ordered ? "enumerate" : "itemize";
      if (list !== requested) { closeList(); list = requested; output.push(`\\begin{${list}}`); }
      output.push(`\\item ${markdownInline((unordered ?? ordered)[1])}`);
      continue;
    }
    if (!trimmed) {
      flushParagraph(); closeList();
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph(); closeList(); closeCallout();
  output.push(String.raw`\end{bgarticle}`);
  return output.join("\n");
}

export function validateLatexArticle(source) {
  const errors = [];
  const value = String(source);
  if (!/^\s*\\begin\{bgarticle\}/.test(value)) errors.push("Document must start with \\begin{bgarticle}.");
  if (!/\\end\{bgarticle\}\s*$/.test(value)) errors.push("Document must end with \\end{bgarticle}.");
  for (const match of value.matchAll(/\\(?:begin|end)\{([^}]+)\}/g)) {
    if (!KNOWN_ENVIRONMENTS.has(match[1])) errors.push(`Unsupported environment: ${match[1]}.`);
  }
  for (const environment of KNOWN_ENVIRONMENTS) {
    const begins = [...value.matchAll(new RegExp(`\\\\begin\\{${environment}\\}`, "g"))].length;
    const ends = [...value.matchAll(new RegExp(`\\\\end\\{${environment}\\}`, "g"))].length;
    if (begins !== ends) errors.push(`Unbalanced ${environment} environment.`);
  }
  if ((value.match(/\\\[/g) ?? []).length !== (value.match(/\\\]/g) ?? []).length) errors.push("Unbalanced display-math delimiters.");
  if (!/\\section\*?\{/.test(value)) errors.push("Document must contain at least one section.");
  if (!/\\\[[\s\S]*?\\\]/.test(value)) errors.push("Document must contain at least one display equation.");
  return { valid: errors.length === 0, errors };
}

export function toStandaloneLatex({ title, source }) {
  return String.raw`\documentclass[11pt]{article}
\usepackage{fontspec}
\usepackage{amsmath,amssymb}
\usepackage[margin=1in]{geometry}
\usepackage{microtype}
\usepackage{enumitem}
\usepackage[most]{tcolorbox}
\usepackage[hidelinks]{hyperref}
\setmainfont{TeX Gyre Pagella}
\newenvironment{bgarticle}{}{}
\newtcolorbox{bgbox}[1]{breakable,colback=blue!3,colframe=blue!45!black,title={#1}}
\newtcolorbox{bgexample}[1]{breakable,colback=black!2,colframe=black!65,title={#1}}
\setlist{itemsep=.35em,topsep=.5em}
\title{${escapeLatexText(title)}}
\author{Better Grades}
\date{}
\begin{document}
\maketitle
${source}
\end{document}
`;
}
