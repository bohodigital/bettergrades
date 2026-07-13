import { looksLikeAlgebraExpression } from "./algebra-practice.mjs";

const synonymGroups = [
  ["factor", "factoring", "factorise", "factorization"],
  ["line", "linear", "slope", "rate"],
  ["solve", "solution", "equation"],
  ["fraction", "rational", "denominator"],
  ["root", "radical", "square root"],
  ["derivative", "differentiate", "differentiation"],
  ["integral", "integrate", "antiderivative", "integration"],
  ["series", "sequence", "convergence"],
  ["quiz", "test", "exam", "practice", "review"],
  ["calculator", "checker", "tool", "evaluate", "simplify"],
  ["substitute", "substitution", "plug", "evaluate"],
  ["graph", "plot", "sketch"],
];

const stopWords = new Set(["a", "an", "and", "at", "for", "from", "how", "in", "is", "of", "on", "the", "to", "what", "when", "with"]);

export function normalizeSearchText(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/³/g, "3")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function queryTerms(query) {
  return normalizeSearchText(query).split(" ").filter((term) => term && !stopWords.has(term) && term.length > 1);
}

function variantsFor(term) {
  return synonymGroups.find((group) => group.includes(term)) ?? [term];
}

function containsVariant(value, variants) {
  return variants.some((variant) => value.includes(normalizeSearchText(variant)));
}

export function isExpressionOnlyQuery(query) {
  if (/(?:d\s*\/\s*d[a-z]|d[a-z]\s*\/\s*d[a-z]|[a-z]\s*')/i.test(query)) return false;
  const withoutLatexCommands = query.replace(/\\[a-z]+/gi, "");
  const proseWords = withoutLatexCommands.match(/[a-z]{3,}/gi) ?? [];
  return looksLikeAlgebraExpression(query) && proseWords.length === 0;
}

function scoreRecord(record, clean, terms) {
  const title = normalizeSearchText(record.title);
  const description = normalizeSearchText(record.description);
  const labels = normalizeSearchText(`${record.domainName} ${record.topicName ?? ""} ${record.label}`);
  const keywords = normalizeSearchText(record.keywords.join(" "));
  let score = 0;
  if (title === clean) score += 120;
  else if (title.includes(clean)) score += 55;
  if (keywords.includes(clean)) score += 28;
  let matchedTerms = 0;
  for (const term of terms) {
    const variants = variantsFor(term);
    const matched = containsVariant(title, variants) || containsVariant(labels, variants) || containsVariant(keywords, variants) || containsVariant(description, variants);
    if (!matched) continue;
    matchedTerms += 1;
    if (containsVariant(title, variants)) score += 24;
    if (containsVariant(labels, variants)) score += 12;
    if (containsVariant(keywords, variants)) score += 9;
    if (containsVariant(description, variants)) score += 4;
  }
  if (matchedTerms === terms.length && terms.length > 1) score += 24;
  score += Math.min(record.priority / 10, 10);
  return { score, matchedTerms };
}

export function rankSearchRecords(records, query) {
  const clean = normalizeSearchText(query);
  const terms = queryTerms(query);
  if (!clean) return records.slice().sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title));
  if (isExpressionOnlyQuery(query)) return [];
  return records
    .map((record) => ({ record, ...scoreRecord(record, clean, terms) }))
    .filter((item) => item.matchedTerms > 0 && item.score >= 16)
    .sort((a, b) => b.score - a.score || b.record.priority - a.record.priority || a.record.title.localeCompare(b.record.title))
    .map((item) => item.record);
}
