const MAX_ID_LENGTH = 160;

export function normalizePrecalculusAnswer(value) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[\u2212\u2012-\u2015]/g, "-")
    .replace(/[\s.,;:!?]+/g, "")
    .replace(/\*|\u00b7/g, "")
    .replace(/\^\{([^{}]+)\}/g, "^$1")
    .replace(/\\left|\\right/g, "");
}

export function validatePrecalculusAssessmentAnswer(record, attempt) {
  if (!record || typeof record.answer !== "string" || typeof attempt !== "string") return false;
  return normalizePrecalculusAnswer(attempt) === normalizePrecalculusAnswer(record.answer);
}

export async function getPrecalculusAssessmentRecord(storage, id) {
  if (!storage || typeof storage.get !== "function" || typeof id !== "string" || !id || id.length > MAX_ID_LENGTH) return undefined;
  const stored = await storage.get(id, "json");
  if (!stored || typeof stored !== "object" || stored.id !== id || typeof stored.answer !== "string") return undefined;
  return stored;
}
