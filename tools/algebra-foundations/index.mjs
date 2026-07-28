import { A0_PROFILES } from "./a0.mjs";
import { A1_PROFILES } from "./a1.mjs";
import { A2_PROFILES } from "./a2.mjs";

export const FOUNDATION_PROFILES = Object.freeze({
  ...A0_PROFILES,
  ...A1_PROFILES,
  ...A2_PROFILES,
});

const expectedIds = [
  ...Array.from({ length: 10 }, (_, index) => `A0.${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `A1.${index + 1}`),
  ...Array.from({ length: 10 }, (_, index) => `A2.${index + 1}`),
];

const assertArrayLength = (lessonId, field, value, length) => {
  if (!Array.isArray(value) || value.length !== length) {
    throw new Error(`${lessonId}.${field} must contain exactly ${length} entries.`);
  }
};

for (const lessonId of expectedIds) {
  const profile = FOUNDATION_PROFILES[lessonId];
  if (!profile) throw new Error(`Missing authored foundation profile for ${lessonId}.`);
  assertArrayLength(lessonId, "prerequisites", profile.prerequisites, 3);
  assertArrayLength(lessonId, "exposition", profile.exposition, 3);
  assertArrayLength(lessonId, "examples", profile.examples, 3);
  assertArrayLength(lessonId, "questions", profile.questions, 16);
  if (!Array.isArray(profile.definitions) || profile.definitions.length < 3) {
    throw new Error(`${lessonId}.definitions must contain at least 3 entries.`);
  }
  if (!Array.isArray(profile.takeaway) || profile.takeaway.length < 2) {
    throw new Error(`${lessonId}.takeaway must contain at least 2 entries.`);
  }

  const prompts = new Set(profile.questions.map((question) => question.prompt));
  if (prompts.size !== 16) {
    throw new Error(`${lessonId}.questions must contain 16 distinct prompts.`);
  }
}

if (Object.keys(FOUNDATION_PROFILES).length !== expectedIds.length) {
  throw new Error("Foundation profiles contain an unexpected lesson id.");
}

export const getFoundationProfile = (lessonId) => FOUNDATION_PROFILES[lessonId] ?? null;
