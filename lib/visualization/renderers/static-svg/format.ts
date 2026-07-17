type RichText = Readonly<{
  segments: readonly (
    | Readonly<{ kind: "text"; text: string }>
    | Readonly<{ kind: "math"; latex: string; spokenText: string }>
  )[];
}>;

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Static SVG deliberately does not emit authored LaTeX. Math segments use the
 * required spoken alternative so the asset remains plain, safe, portable SVG.
 */
export function richTextToPlainText(value: RichText): string {
  return value.segments
    .map((segment) => segment.kind === "text" ? segment.text : segment.spokenText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) throw new TypeError("SVG coordinates must be finite.");
  const rounded = Math.abs(value) < 0.0005 ? 0 : Math.round(value * 1_000) / 1_000;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

export function formatTick(value: number): string {
  if (Math.abs(value) < 1e-12) return "0";
  const magnitude = Math.abs(value);
  if (magnitude >= 10_000 || magnitude < 0.001) return value.toExponential(1).replace("e+", "e");
  return String(Math.round(value * 1_000_000) / 1_000_000);
}

export function splitText(value: string, maxCharacters = 34, maxLines = 3): string[] {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const words = normalized.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxCharacters || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
    if (lines.length === maxLines - 1) break;
  }
  if (line && lines.length < maxLines) {
    const consumed = lines.join(" ").split(" ").filter(Boolean).length;
    const remaining = words.slice(consumed).join(" ");
    lines.push(remaining.length > maxCharacters ? `${remaining.slice(0, Math.max(1, maxCharacters - 1)).trimEnd()}\u2026` : remaining);
  }
  return lines;
}
