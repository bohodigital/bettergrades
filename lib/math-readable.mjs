import katex from "katex";

const symbols = new Map(Object.entries({
  "\\alpha": "alpha",
  "\\beta": "beta",
  "\\gamma": "gamma",
  "\\delta": "delta",
  "\\epsilon": "epsilon",
  "\\varepsilon": "epsilon",
  "\\theta": "theta",
  "\\lambda": "lambda",
  "\\mu": "mu",
  "\\pi": "pi",
  "\\sigma": "sigma",
  "\\phi": "phi",
  "\\omega": "omega",
  "\\infty": "infinity",
  "\\to": " approaches ",
  "\\rightarrow": " approaches ",
  "\\Rightarrow": " implies ",
  "\\le": " less than or equal to ",
  "\\leq": " less than or equal to ",
  "\\ge": " greater than or equal to ",
  "\\geq": " greater than or equal to ",
  "\\ne": " not equal to ",
  "\\neq": " not equal to ",
  "\\approx": " approximately ",
  "\\cdot": " times ",
  "\\times": " times ",
  "\\pm": " plus or minus ",
  "\\ldots": "and so on",
  "\\cdots": "and so on",
  "\\@cdots": "and so on",
}));

const operations = new Map(Object.entries({
  "\\sum": "sum",
  "\\prod": "product",
  "\\int": "integral",
  "\\iint": "double integral",
  "\\lim": "limit",
  "\\sin": "sine",
  "\\cos": "cosine",
  "\\tan": "tangent",
  "\\sec": "secant",
  "\\csc": "cosecant",
  "\\cot": "cotangent",
  "\\ln": "natural log",
  "\\log": "log",
  "\\exp": "exponential",
}));

function tidy(value) {
  return value
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+/g, " ")
    .trim();
}

function textValue(value) {
  if (!value) return "";
  if (symbols.has(value)) return symbols.get(value);
  if (operations.has(value)) return operations.get(value);
  if (value === "=") return " equals ";
  if (value === "+") return " plus ";
  if (value === "-") return " minus ";
  if (value === "<") return " less than ";
  if (value === ">") return " greater than ";
  if (value.startsWith("\\")) return value.slice(1).replaceAll("-", " ");
  return value;
}

function serializeRows(rows, context) {
  return rows
    .map((row, rowIndex) => `row ${rowIndex + 1}: ${row.map((cell) => serializeNode(cell, context)).join(", ")}`)
    .join("; ");
}

function serializeNode(node, context = {}) {
  if (!node) return "";
  if (Array.isArray(node)) {
    if (context.textMode) return node.map((item) => serializeNode(item, context)).join("");
    const pieces = [];
    for (let index = 0; index < node.length; index += 1) {
      if (node[index]?.text === "|") {
        const closing = node.findIndex((item, candidate) => candidate > index && item?.text === "|");
        if (closing > index) {
          pieces.push(`the absolute value of (${serializeNode(node.slice(index + 1, closing), context)})`);
          index = closing;
          continue;
        }
      }
      pieces.push(serializeNode(node[index], context));
    }
    return tidy(pieces.filter(Boolean).join(" "));
  }

  if (["mathord", "textord", "atom", "spacing"].includes(node.type)) return textValue(node.text ?? "");
  if (node.type === "text") return serializeNode(node.body, { ...context, textMode: true });
  if (node.type === "ordgroup" || node.type === "styling" || node.type === "color" || node.type === "font") {
    return serializeNode(node.body, context);
  }
  if (node.type === "genfrac") {
    const numeratorValue = serializeNode(node.numer, context);
    const denominatorValue = serializeNode(node.denom, context);
    const numerator = numeratorValue.includes(" over ") ? `(${numeratorValue})` : numeratorValue;
    const denominator = denominatorValue.includes(" over ") ? `(${denominatorValue})` : denominatorValue;
    return `${numerator} over ${denominator}`;
  }
  if (node.type === "sqrt") {
    const index = serializeNode(node.index, context);
    const body = serializeNode(node.body, context);
    return index ? `the ${index} root of (${body})` : `the square root of (${body})`;
  }
  if (node.type === "op") return operations.get(node.name) ?? textValue(node.name ?? serializeNode(node.body, context));
  if (node.type === "operatorname") return serializeNode(node.body, context);
  if (node.type === "supsub") {
    const base = serializeNode(node.base, context);
    const subscript = serializeNode(node.sub, context);
    const superscript = serializeNode(node.sup, context);
    if (["sum", "product"].includes(base)) {
      return `${base}${subscript ? ` from ${subscript}` : ""}${superscript ? ` to ${superscript}` : ""}`;
    }
    if (base.includes("integral")) {
      return `${base}${subscript ? ` from ${subscript}` : ""}${superscript ? ` to ${superscript}` : ""}`;
    }
    if (base === "limit") return `limit${subscript ? ` as ${subscript}` : ""}`;
    if (superscript === "2") return `${base} squared${subscript ? ` subscript (${subscript})` : ""}`;
    if (superscript === "3") return `${base} cubed${subscript ? ` subscript (${subscript})` : ""}`;
    return `${base}${subscript ? ` subscript (${subscript})` : ""}${superscript ? ` to the power (${superscript})` : ""}`;
  }
  if (node.type === "leftright") {
    const inner = serializeNode(node.body, { ...context, left: node.left, right: node.right });
    if (node.left === "|" && node.right === "|") return `the absolute value of (${inner})`;
    return inner;
  }
  if (node.type === "array") {
    const rows = serializeRows(node.body ?? [], context);
    if (context.left === "\\{") return `piecewise function: ${rows}`;
    return `matrix: ${rows}`;
  }
  if (node.type === "accent") return `${textValue(node.label ?? "")} ${serializeNode(node.base, context)}`;
  if (node.type === "kern" || node.type === "rule" || node.type === "cr") return "";
  if (node.body) return serializeNode(node.body, context);
  if (node.base) return serializeNode(node.base, context);
  if (node.text) return textValue(node.text);
  return "";
}

export function readableMath(tex) {
  try {
    const ast = katex.__parse(String(tex), {
      throwOnError: true,
      strict: "ignore",
      trust: false,
      maxExpand: 500,
      maxSize: 10,
    });
    const result = tidy(serializeNode(ast));
    return result || "mathematical expression";
  } catch {
    return "mathematical expression";
  }
}
