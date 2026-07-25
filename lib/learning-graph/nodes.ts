import graph from "../../data/learning-graph/graph.json" with { type: "json" };
import type { LearningNode } from "./schema";

export const learningNodes = graph.nodes as LearningNode[];
export const learningNodeById = new Map(learningNodes.map((node) => [node.id, node]));
export const learningNodeByPath = new Map(learningNodes.map((node) => [node.canonicalPath, node]));
