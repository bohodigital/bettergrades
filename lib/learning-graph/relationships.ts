import graph from "../../data/learning-graph/graph.json" with { type: "json" };
import type { LearningRelationship } from "./schema";

export const learningRelationships = graph.relationships as LearningRelationship[];
export const publicLearningRelationships = learningRelationships.filter((relationship) => relationship.editorialStatus === "approved" || relationship.editorialStatus === "existing");
