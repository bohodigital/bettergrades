import { createHash } from "node:crypto";

export function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:x27|39);/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
}

function balancedElement(html, tagName) {
  const tokenPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  const first = tokenPattern.exec(html);
  if (!first || first[0].startsWith("</")) return "";
  const start = tokenPattern.lastIndex;
  let depth = 1;
  for (let token = tokenPattern.exec(html); token; token = tokenPattern.exec(html)) {
    depth += token[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(start, token.index);
  }
  return "";
}

function stripBalancedElements(html, tagNames) {
  let output = html;
  for (const tagName of tagNames) {
    const pattern = new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "gi");
    let previous;
    do {
      previous = output;
      output = output.replace(pattern, " ");
    } while (output !== previous);
  }
  return output;
}

export function substantiveMainText(html) {
  const main = balancedElement(String(html), "main");
  if (!main) return "";
  return decodeHtmlEntities(
    stripBalancedElements(main, ["script", "style", "template", "noscript", "nav", "header", "footer", "aside", "annotation"])
      .replace(/<[^>]+\b(?:class|data-slot)="[^"]*(?:breadcrumb|site-nav|resource-nav|analytics)[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, " ")
      .replace(/<img\b[^>]*\balt="([^"]+)"[^>]*>/gi, " $1 ")
      .replace(/<[^>]+\baria-label="([^"]+)"[^>]*>/gi, " $1 ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .toLowerCase()
    .replace(/\b(?:reviewed|updated|revision)\s+[a-z]+\s+\d{1,2},?\s+\d{4}\b/g, " ")
    .replace(/[^\p{L}\p{N}+\-=/^().,;:'" ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function contentFingerprint(text) {
  return createHash("sha256").update(text).digest("hex");
}

function shingles(text, size = 5) {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length < size) return new Set(tokens.length ? [tokens.join(" ")] : []);
  return new Set(tokens.slice(0, tokens.length - size + 1).map((_, index) => tokens.slice(index, index + size).join(" ")));
}

export function substantiveSimilarity(left, right) {
  if (!left || !right) return 0;
  const lengthRatio = Math.min(left.length, right.length) / Math.max(left.length, right.length);
  if (lengthRatio < 0.72) return 0;
  const a = shingles(left);
  const b = shingles(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return (2 * intersection) / (a.size + b.size);
}

export function duplicateAnalysis(pages, threshold = 0.92) {
  const exact = [...Map.groupBy(pages.filter((page) => page.mainText), (page) => page.mainTextFingerprint)]
    .filter(([, entries]) => entries.length > 1)
    .map(([fingerprint, entries]) => ({
      fingerprint,
      paths: entries.map((entry) => entry.path),
      reviewed: false,
    }));
  const near = [];
  for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
      const left = pages[leftIndex];
      const right = pages[rightIndex];
      if (!left.mainText || !right.mainText || left.mainTextFingerprint === right.mainTextFingerprint) continue;
      const similarity = substantiveSimilarity(left.mainText, right.mainText);
      if (similarity >= threshold) {
        near.push({
          paths: [left.path, right.path],
          similarity: Number(similarity.toFixed(6)),
          reviewed: false,
        });
      }
    }
  }
  return { exact, near, threshold };
}
