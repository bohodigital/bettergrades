import rubrics from "../../content/algebra/assessment-rubrics.server.json" with { type: "json" };

const rubricsById = new Map(rubrics.rubrics.map((record) => [
  record.id,
  `${record.rubric}\n\nWorked solution: ${record.completeSolution}`,
]));

export function getAlgebraAssessmentRubric(id) {
  return rubricsById.get(id);
}
