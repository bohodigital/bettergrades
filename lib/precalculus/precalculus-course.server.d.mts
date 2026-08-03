export type PrecalculusValidationStatus = "correct" | "incorrect" | "uncertain" | "manual_review" | "insufficient" | "invalid";
export function normalizePrecalculusAnswer(value: string): string;
export function getPrecalculusAssessmentRecord(storage: { get(id: string, type: "json"): Promise<unknown> }, id: string): Promise<unknown>;
export function evaluatePrecalculusAssessmentAnswer(record: unknown, attempt: string): Promise<{ status: PrecalculusValidationStatus; revealAllowed: boolean; policy?: string }>;
export function validatePrecalculusAssessmentAnswer(record: unknown, attempt: string): Promise<boolean>;
