import { A0_PROFILES } from "./a0.mjs";
import { A1_PROFILES } from "./a1.mjs";
import { A2_PROFILES } from "./a2.mjs";
import { FOUNDATION_DEPTH } from "./depth.mjs";
import { FOUNDATION_EXTENSIONS } from "./extensions.mjs";

const FOUNDATION_BASE_PROFILES = {
  ...A0_PROFILES,
  ...A1_PROFILES,
  ...A2_PROFILES,
};

export const FOUNDATION_PROFILES = Object.freeze(Object.fromEntries(
  Object.entries(FOUNDATION_BASE_PROFILES).map(([lessonId, profile]) => {
    const depth = FOUNDATION_DEPTH[lessonId];
    const extensions = FOUNDATION_EXTENSIONS[lessonId];
    if (!depth) throw new Error(`Missing depth expansion for ${lessonId}.`);
    if (!extensions || extensions.length < 2) {
      throw new Error(`Missing extended teaching paragraphs for ${lessonId}.`);
    }
    return [lessonId, {
      ...profile,
      exposition: [...profile.exposition, ...depth.exposition, ...extensions],
      method: depth.method,
      definitions: [...profile.definitions, ...depth.definitions],
      examples: profile.examples.map((example, index) => ({
        ...example,
        interpretation: `${example.interpretation} ${depth.exampleNotes[index]}`,
      })),
      questions: [...profile.questions, ...depth.questions],
    }];
  }),
));

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
  if (!Array.isArray(profile.exposition) || profile.exposition.length < 10) {
    throw new Error(`${lessonId}.exposition must contain at least 10 authored paragraphs.`);
  }
  assertArrayLength(lessonId, "examples", profile.examples, 3);
  assertArrayLength(lessonId, "questions", profile.questions, 20);
  if (!Array.isArray(profile.definitions) || profile.definitions.length < 5) {
    throw new Error(`${lessonId}.definitions must contain at least 5 entries.`);
  }
  if (!Array.isArray(profile.takeaway) || profile.takeaway.length < 2) {
    throw new Error(`${lessonId}.takeaway must contain at least 2 entries.`);
  }

  if (!profile.method?.title || profile.method.steps?.length !== 4 || !profile.method.check) {
    throw new Error(`${lessonId}.method must contain a title, four steps, and a check.`);
  }
  const expositionWords = profile.exposition.join(" ").match(/\b[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*\b/gu)?.length ?? 0;
  if (expositionWords < 650) {
    throw new Error(`${lessonId}.exposition must contain at least 650 words; found ${expositionWords}.`);
  }

  const prompts = new Set(profile.questions.map((question) => question.prompt));
  if (prompts.size !== 20) {
    throw new Error(`${lessonId}.questions must contain 20 distinct prompts.`);
  }
}

if (Object.keys(FOUNDATION_PROFILES).length !== expectedIds.length) {
  throw new Error("Foundation profiles contain an unexpected lesson id.");
}

export const getFoundationProfile = (lessonId) => FOUNDATION_PROFILES[lessonId] ?? null;
