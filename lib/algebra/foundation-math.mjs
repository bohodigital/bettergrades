const superscripts = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-", "ⁿ": "n", "ᵐ": "m",
};

const vulgarFractions = {
  "¼": ["1", "4"], "½": ["1", "2"], "¾": ["3", "4"],
  "⅕": ["1", "5"], "⅖": ["2", "5"], "⅗": ["3", "5"], "⅘": ["4", "5"],
  "⅙": ["1", "6"], "⅚": ["5", "6"],
  "⅛": ["1", "8"], "⅜": ["3", "8"], "⅝": ["5", "8"], "⅞": ["7", "8"],
  "⅓": ["1", "3"], "⅔": ["2", "3"],
};

const mathSignal = /[=<>≤≥≠≈±+−×÷·/^²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐ¼½¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅓⅔√∛πρ∅ℝ%$°←→✓]|\d/;
const isolatedVariable = /^[a-z](?:[²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐ])?$/;
const mathPunctuation = /^[()[\]{}|,:]+$/;

function splitToken(raw) {
  const match = raw.match(/^([“‘"']*)(.*?)([.;:!?…”’"']*)$/u);
  return {
    prefix: match?.[1] ?? "",
    core: match?.[2] ?? raw,
    suffix: match?.[3] ?? "",
  };
}

function isMathCore(value) {
  if (!value) return false;
  if (isolatedVariable.test(value) || mathPunctuation.test(value)) return true;
  if (mathSignal.test(value)) return true;
  return /^(?:f|g|h)\([a-z0-9+\-−]+\)$/i.test(value);
}

function nextCore(lexemes, start) {
  for (let index = start + 1; index < lexemes.length; index += 1) {
    if (!/^\s+$/.test(lexemes[index])) return splitToken(lexemes[index]).core;
  }
  return "";
}

function isLikelyArticleA(core, lexemes, index) {
  if (core !== "a") return false;
  const following = nextCore(lexemes, index).replace(/,+$/u, "");
  return /^[A-Za-z][A-Za-z’'-]+$/u.test(following) && !isMathCore(following);
}

function isGroupedMathStart(core, lexemes, index) {
  if (!/^(?:[a-z]\([a-z]|\([a-z][a-z]*)$/i.test(core)) return false;
  return isMathCore(nextCore(lexemes, index));
}

const openingDelimiters = new Set(["(", "[", "{"]);
const closingDelimiters = new Set([")", "]", "}"]);
const matchingDelimiter = { "(": ")", "[": "]", "{": "}" };

function matchingCloseIndex(value, start) {
  const opener = value[start];
  const closer = matchingDelimiter[opener];
  if (!closer) return -1;
  let depth = 0;
  for (let index = start; index < value.length; index += 1) {
    if (value[index] === opener) depth += 1;
    else if (value[index] === closer) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function fractionContainer(value, slashIndex) {
  const stack = [];
  for (let index = 0; index < slashIndex; index += 1) {
    const character = value[index];
    if (openingDelimiters.has(character)) stack.push({ character, index });
    else if (closingDelimiters.has(character) && stack.length) stack.pop();
  }
  const container = stack.at(-1);
  if (!container) return { start: 0, end: value.length };
  const close = matchingCloseIndex(value, container.index);
  return {
    start: container.index + 1,
    end: close < 0 ? value.length : close,
  };
}

function leftFractionBoundary(value, start, slashIndex) {
  const stack = [];
  let boundary = start;
  for (let index = start; index < slashIndex; index += 1) {
    const character = value[index];
    if (openingDelimiters.has(character)) stack.push(character);
    else if (closingDelimiters.has(character) && stack.length) stack.pop();
    else if (!stack.length && /[+=<>,;:]/.test(character)) boundary = index + 1;
    else if (!stack.length && character === "-") boundary = index + 1;
  }
  while (boundary < slashIndex && /\s/.test(value[boundary])) boundary += 1;
  return boundary;
}

function commandEnd(value, start) {
  if (value[start] !== "\\") return start;
  if (!/[A-Za-z]/.test(value[start + 1] ?? "")) return Math.min(value.length, start + 2);
  let end = start + 2;
  while (end < value.length && /[A-Za-z]/.test(value[end])) end += 1;
  return end;
}

function appendScriptGroups(value, start, limit) {
  let end = start;
  while (end < limit) {
    const whitespace = value.slice(end).match(/^\s*/)?.[0].length ?? 0;
    const marker = end + whitespace;
    if (!/[\^_]/.test(value[marker] ?? "") || value[marker + 1] !== "{") break;
    const close = matchingCloseIndex(value, marker + 1);
    if (close < 0 || close >= limit) break;
    end = close + 1;
  }
  return end;
}

function rightFractionBoundary(value, slashIndex, limit) {
  let start = slashIndex + 1;
  while (start < limit && /\s/.test(value[start])) start += 1;
  if (value[start] === "-") {
    start += 1;
    while (start < limit && /\s/.test(value[start])) start += 1;
  }

  if (openingDelimiters.has(value[start])) {
    const close = matchingCloseIndex(value, start);
    return close < 0 || close >= limit ? limit : close + 1;
  }

  let end = start;
  if (value[end] === "\\") {
    end = commandEnd(value, end);
    const command = value.slice(start, end);
    const requiredGroups = command === String.raw`\frac` ? 2 : command === String.raw`\sqrt` ? 1 : 0;
    if (command === String.raw`\sqrt` && value[end] === "[") {
      const close = matchingCloseIndex(value, end);
      if (close > -1 && close < limit) end = close + 1;
    }
    for (let count = 0; count < requiredGroups && value[end] === "{"; count += 1) {
      const close = matchingCloseIndex(value, end);
      if (close < 0 || close >= limit) break;
      end = close + 1;
    }
    if (command === String.raw`\$`) {
      while (end < limit && /[\d,.]/.test(value[end])) end += 1;
    }
  } else if (/\d/.test(value[end] ?? "")) {
    while (end < limit && /[\d,.]/.test(value[end])) end += 1;
  } else if (/[A-Za-z]/.test(value[end] ?? "")) {
    while (end < limit && /[A-Za-z]/.test(value[end])) end += 1;
  } else {
    while (end < limit && !/\s|[+\-=<>,;:]/.test(value[end])) end += 1;
  }
  return appendScriptGroups(value, end, limit);
}

function unwrapFractionGroup(value) {
  const trimmed = value.trim();
  const opener = trimmed[0];
  if (!openingDelimiters.has(opener)) return trimmed;
  const close = matchingCloseIndex(trimmed, 0);
  return close === trimmed.length - 1 ? trimmed.slice(1, -1).trim() : trimmed;
}

function replaceFractions(tex) {
  let current = tex;
  let guard = 0;
  while (current.includes("/") && guard < 100) {
    guard += 1;
    const slashIndex = current.indexOf("/");
    const container = fractionContainer(current, slashIndex);
    const leftStart = leftFractionBoundary(current, container.start, slashIndex);
    const rightEnd = rightFractionBoundary(current, slashIndex, container.end);
    const numerator = unwrapFractionGroup(current.slice(leftStart, slashIndex));
    const denominator = unwrapFractionGroup(current.slice(slashIndex + 1, rightEnd));
    if (!numerator || !denominator) break;
    current = `${current.slice(0, leftStart)}\\frac{${numerator}}{${denominator}}${current.slice(rightEnd)}`;
  }
  return current;
}

export function foundationTextToLatex(value) {
  let tex = String(value)
    .replaceAll("\\", String.raw`\backslash `)
    .replace(/−/g, "-")
    .replace(/×/g, String.raw`\times `)
    .replace(/÷/g, String.raw`\div `)
    .replace(/·/g, String.raw`\cdot `)
    .replace(/≤/g, String.raw`\le `)
    .replace(/≥/g, String.raw`\ge `)
    .replace(/≠/g, String.raw`\ne `)
    .replace(/≈/g, String.raw`\approx `)
    .replace(/±/g, String.raw`\pm `)
    .replace(/→/g, String.raw`\longrightarrow `)
    .replace(/←/g, String.raw`\longleftarrow `)
    .replace(/∅/g, String.raw`\varnothing `)
    .replace(/ℝ/g, String.raw`\mathbb{R}`)
    .replace(/π/g, String.raw`\pi `)
    .replace(/ρ/g, String.raw`\rho `)
    .replace(/✓/g, String.raw`\checkmark `)
    .replace(/%/g, String.raw`\%`)
    .replace(/\$/g, String.raw`\$`)
    .replace(/°([CF])?/g, (_, unit) => `^\\circ${unit ? `\\mathrm{${unit}}` : ""}`)
    .replace(/([A-Za-z0-9)])([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐ]+)/g, (_, base, sequence) => `${base}^{${[...sequence].map((symbol) => superscripts[symbol]).join("")}}`)
    .replace(/([¼½¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅓⅔])/g, (glyph) => {
      const [numerator, denominator] = vulgarFractions[glyph];
      return String.raw`\frac{${numerator}}{${denominator}}`;
    })
    .replace(/∛\(([^()]+)\)/g, String.raw`\sqrt[3]{$1}`)
    .replace(/∛([A-Za-z0-9.]+)/g, String.raw`\sqrt[3]{$1}`)
    .replace(/√\(([^()]+)\)/g, String.raw`\sqrt{$1}`)
    .replace(/√([A-Za-z0-9.]+)/g, String.raw`\sqrt{$1}`);
  tex = replaceFractions(tex);
  if (/^\{.*\}$/.test(tex)) tex = `\\${tex.slice(0, 1)}${tex.slice(1, -1)}\\}`;
  return tex.trim();
}

export function foundationMathFragments(value) {
  const source = String(value ?? "");
  const explicit = /\\\((.+?)\\\)|\\\[([\s\S]*?)\\\]/gs;
  if (explicit.test(source)) {
    explicit.lastIndex = 0;
    const fragments = [];
    let cursor = 0;
    for (const match of source.matchAll(explicit)) {
      const start = match.index ?? 0;
      if (start > cursor) fragments.push({ kind: "text", value: source.slice(cursor, start) });
      fragments.push({ kind: "math", tex: match[1] ?? match[2], display: Boolean(match[2]), label: match[1] ?? match[2] });
      cursor = start + match[0].length;
    }
    if (cursor < source.length) fragments.push({ kind: "text", value: source.slice(cursor) });
    return fragments;
  }

  const lexemes = source.match(/\s+|[—–]|[^\s—–]+/g) ?? [];
  const fragments = [];
  let mathBuffer = "";
  const flushMath = () => {
    if (!mathBuffer) return;
    const trailingSpace = mathBuffer.match(/\s+$/)?.[0] ?? "";
    const mathValue = mathBuffer.slice(0, mathBuffer.length - trailingSpace.length);
    if (mathValue) fragments.push({ kind: "math", tex: foundationTextToLatex(mathValue), display: false, label: mathValue });
    if (trailingSpace) fragments.push({ kind: "text", value: trailingSpace });
    mathBuffer = "";
  };

  for (let index = 0; index < lexemes.length; index += 1) {
    const lexeme = lexemes[index];
    if (/^\s+$/.test(lexeme)) {
      if (mathBuffer) mathBuffer += lexeme;
      else fragments.push({ kind: "text", value: lexeme });
      continue;
    }
    const { prefix, core, suffix } = splitToken(lexeme);
    if ((isMathCore(core) || isGroupedMathStart(core, lexemes, index)) && !isLikelyArticleA(core, lexemes, index)) {
      if (prefix) {
        flushMath();
        fragments.push({ kind: "text", value: prefix });
      }
      mathBuffer += core;
      if (suffix) {
        flushMath();
        fragments.push({ kind: "text", value: suffix });
      }
    } else {
      flushMath();
      fragments.push({ kind: "text", value: lexeme });
    }
  }
  flushMath();

  return fragments
    .filter((fragment) => fragment.kind === "math" || fragment.value)
    .reduce((merged, fragment) => {
      const previous = merged.at(-1);
      if (fragment.kind === "text" && previous?.kind === "text") previous.value += fragment.value;
      else merged.push(fragment);
      return merged;
    }, []);
}
