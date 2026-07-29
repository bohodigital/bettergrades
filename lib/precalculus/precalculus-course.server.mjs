import solutions from "../../content/precalculus/solutions.server.json" with { type: "json" };

const solutionsById = new Map(solutions.solutions.map((record) => [
  record.id,
  `Answer: ${record.answer}`,
]));

export function getPrecalculusAssessmentAnswer(id) {
  return solutionsById.get(id);
}
