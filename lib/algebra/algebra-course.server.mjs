import rubrics from "../../content/algebra/assessment-rubrics.server.json" with { type: "json" };

const rubricsById = new Map(rubrics.rubrics.map((rubric) => [rubric.id, rubric.rubric]));

export function getAlgebraAssessmentRubric(id) {
  return rubricsById.get(id);
}
