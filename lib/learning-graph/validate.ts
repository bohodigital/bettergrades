import type { LearningGraph } from "./schema";
import { learningNodeTypes, relationshipTypes } from "./schema";

export function validateLearningGraph(graph: LearningGraph) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const node of graph.nodes) {
    if (ids.has(node.id)) errors.push(`Duplicate graph id: ${node.id}`);
    if (paths.has(node.canonicalPath)) errors.push(`Duplicate graph path: ${node.canonicalPath}`);
    if (!learningNodeTypes.includes(node.nodeType)) errors.push(`Invalid node type: ${node.id}`);
    ids.add(node.id);
    paths.add(node.canonicalPath);
  }
  for (const relationship of graph.relationships) {
    if (!ids.has(relationship.sourceId)) errors.push(`Missing relationship source: ${relationship.sourceId}`);
    if (!ids.has(relationship.targetId)) errors.push(`Missing relationship target: ${relationship.targetId}`);
    if (!relationshipTypes.includes(relationship.type)) errors.push(`Invalid relationship type: ${relationship.type}`);
    if (relationship.editorialStatus === "provisional" && relationship.placement !== "editorial-queue") errors.push(`Provisional relationship has public placement: ${relationship.sourceId}`);
  }
  return errors;
}
