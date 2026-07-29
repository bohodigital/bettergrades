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

function replaceSimpleFractions(tex) {
  let previous = "";
  let current = tex;
  const parenthesized = /\(([^()]+)\)\/([A-Za-z0-9.]+)/g;
  const simple = /(?<![\\A-Za-z])([A-Za-z0-9.]+)\/([A-Za-z0-9.]+)(?![A-Za-z])/g;
  while (current !== previous) {
    previous = current;
    current = current
      .replace(parenthesized, String.raw`\frac{$1}{$2}`)
      .replace(simple, String.raw`\frac{$1}{$2}`);
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
  tex = replaceSimpleFractions(tex);
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

  const lexemes = source.match(/\s+|\S+/g) ?? [];
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
    if (isMathCore(core)) {
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
