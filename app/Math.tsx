"use client";

import katex from "katex";

const exact: Record<string, string> = {
  "∫ sec³(x) dx": String.raw`\int \sec^3(x)\,dx`,
  "∫ sec³x dx": String.raw`\int \sec^3 x\,dx`,
  "∫ x eˣ dx": String.raw`\int x e^x\,dx`,
  "∫u dv = uv − ∫v du": String.raw`\int u\,dv = uv - \int v\,du`,
  "∫ u dv = uv − ∫ v du": String.raw`\int u\,dv = uv - \int v\,du`,
  "d/dx (xˣ)": String.raw`\frac{d}{dx}\!\left(x^x\right)`,
  "Σ 1/n": String.raw`\sum_{n=1}^{\infty}\frac{1}{n}`,
  "V = π∫(R²−r²)dx or 2π∫rh dx": String.raw`V=\pi\!\int(R^2-r^2)\,dx \quad\text{or}\quad V=2\pi\!\int rh\,dx`,
  "½ sec x tan x + ½ ln|sec x + tan x| + C": String.raw`\frac12\sec x\tan x+\frac12\ln\!\left|\sec x+\tan x\right|+C`,
  "xˣ(ln x + 1), for x > 0": String.raw`x^x(\ln x+1),\qquad x>0`,
  "∫ 2x cos(x²) dx": String.raw`\int 2x\cos(x^2)\,dx`,
  "∫ sin²x dx": String.raw`\int \sin^2 x\,dx`,
  "∫ 1/(x²−1) dx": String.raw`\int \frac{1}{x^2-1}\,dx`,
  "∫ √(9−x²) dx": String.raw`\int \sqrt{9-x^2}\,dx`,
  "∫ ln x dx": String.raw`\int \ln x\,dx`,
  "∫ (3x+2)/(x²+4x+5) dx": String.raw`\int \frac{3x+2}{x^2+4x+5}\,dx`,
  "∫₀∞ e⁻ˣ dx": String.raw`\int_0^{\infty}e^{-x}\,dx`,
  "∫ x/(x+1) dx": String.raw`\int \frac{x}{x+1}\,dx`,
  "∫ x² dx": String.raw`\int x^2\,dx`,
  "∫ cos x dx": String.raw`\int \cos x\,dx`,
  "∫ e²ˣ dx": String.raw`\int e^{2x}\,dx`,
  "∫ 1/x dx": String.raw`\int \frac1x\,dx`,
  "∫ sec²x dx": String.raw`\int \sec^2 x\,dx`,
  "∫ 2x(x²+1)⁴ dx": String.raw`\int 2x(x^2+1)^4\,dx`,
  "∫ x sin x dx": String.raw`\int x\sin x\,dx`,
  "∫ tan x dx": String.raw`\int \tan x\,dx`,
  "∫₀¹ 3x² dx": String.raw`\int_0^1 3x^2\,dx`,
  "∫ 1/(1+x²) dx": String.raw`\int \frac{1}{1+x^2}\,dx`,
  "∫ csc x cot x dx": String.raw`\int \csc x\cot x\,dx`,
  "∫ sin(3x) dx": String.raw`\int \sin(3x)\,dx`,
  "∫ (x+1)/(x²+2x+4) dx": String.raw`\int \frac{x+1}{x^2+2x+4}\,dx`,
  "∫ sinh x dx": String.raw`\int \sinh x\,dx`,
  "∫ x/√(x²+4) dx": String.raw`\int \frac{x}{\sqrt{x^2+4}}\,dx`,
  "∫₁ᵉ 1/x dx": String.raw`\int_1^e \frac1x\,dx`,
  "∫ cos²x dx": String.raw`\int \cos^2 x\,dx`,
};

const superscripts: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "ˣ": "x",
};

export function toLatex(value: string) {
  if (exact[value]) return exact[value];
  const tex = value
    .replace(/−/g, "-")
    .replace(/∞/g, String.raw`\infty`)
    .replace(/π/g, String.raw`\pi `)
    .replace(/½/g, String.raw`\frac12`)
    .replace(/√\(([^)]+)\)/g, String.raw`\sqrt{$1}`)
    .replace(/√([a-zA-Z0-9]+)/g, String.raw`\sqrt{$1}`)
    .replace(/∫/g, String.raw`\int `)
    .replace(/Σ/g, String.raw`\sum `)
    .replace(/→/g, String.raw`\longrightarrow `)
    .replace(/⁻ˣ/g, "^{-x}")
    .replace(/([a-zA-Z0-9)])([⁰¹²³⁴⁵⁶⁷⁸⁹ˣ]+)/g, (_, base, sequence) => `${base}^{${[...sequence].map((sup) => superscripts[sup]).join("")}}`)
    .replace(/arctan/g, String.raw`\arctan`)
    .replace(/arcsin/g, String.raw`\arcsin`)
    .replace(/\b(sinh|cosh|tanh|sech|sin|cos|tan|sec|csc|cot|ln)\b/g, String.raw`\$1`)
    .replace(/\bdx\b/g, String.raw`\,dx`)
    .replace(/\bdu\b/g, String.raw`\,du`)
    .replace(/\bdv\b/g, String.raw`\,dv`);
  return tex;
}

export function looksLikeMath(value: string) {
  return /^[\s(\d∫Σ√π½]|[=²³⁴⁵ˣ]|\bd\/dx\b|\b(sin|cos|tan|sec|csc|cot|ln|arctan|arcsin|sinh|cosh)\b|\bdx\b/.test(value);
}

const cache = new Map<string, string>();

export function Math({
  tex,
  display = false,
  className = "",
  label,
}: {
  tex: string;
  display?: boolean;
  className?: string;
  label?: string;
}) {
  const normalizedTex = tex.replace(/\\eps(?=[^A-Za-z]|$)/g, String.raw`\varepsilon`).replace(/\\DNE(?=[^A-Za-z]|$)/g, String.raw`\mathrm{DNE}`);
  const key = `${display}:${normalizedTex}`;
  let html = cache.get(key);
  if (!html) {
    html = katex.renderToString(normalizedTex, {
      displayMode: display,
      throwOnError: false,
      strict: "ignore",
      trust: false,
      maxExpand: 500,
      maxSize: 10,
      output: "htmlAndMathml",
    });
    cache.set(key, html);
  }
  return (
    <span
      className={`latex ${display ? "latex-display" : "latex-inline"} ${className}`}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Formula({ value, display = false, className = "" }: { value: string; display?: boolean; className?: string }) {
  return <Math tex={toLatex(value)} display={display} className={className} label={value} />;
}

export function MathOrText({ value }: { value: string }) {
  return looksLikeMath(value) ? <Formula value={value} /> : <>{value}</>;
}
