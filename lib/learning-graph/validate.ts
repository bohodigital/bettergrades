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
  const publicStatuses = new Set(["approved", "existing"]);
  const relationshipKeys = new Set<string>();
  const primaryBySource = new Map<string, number>();
  const prerequisiteEdges = new Map<string, string[]>();
  for (const relationship of graph.relationships) {
    if (!ids.has(relationship.sourceId)) errors.push(`Missing relationship source: ${relationship.sourceId}`);
    if (!ids.has(relationship.targetId)) errors.push(`Missing relationship target: ${relationship.targetId}`);
    if (!relationshipTypes.includes(relationship.type)) errors.push(`Invalid relationship type: ${relationship.type}`);
    if (relationship.editorialStatus === "provisional" && relationship.placement !== "editorial-queue") errors.push(`Provisional relationship has public placement: ${relationship.sourceId}`);
    const key = `${relationship.sourceId}\0${relationship.targetId}\0${relationship.type}\0${relationship.editorialStatus}`;
    if (relationshipKeys.has(key)) errors.push(`Duplicate relationship: ${relationship.sourceId} -> ${relationship.targetId} (${relationship.type})`);
    relationshipKeys.add(key);
    const target = graph.nodes.find((node) => node.id === relationship.targetId);
    if (publicStatuses.has(relationship.editorialStatus) && target && (target.indexPolicy !== "index" || target.status === "retired")) {
      errors.push(`Public relationship targets unavailable node: ${relationship.targetId}`);
    }
    if (publicStatuses.has(relationship.editorialStatus) && relationship.type === "full_version_of") {
      primaryBySource.set(relationship.sourceId, (primaryBySource.get(relationship.sourceId) ?? 0) + 1);
    }
    if (publicStatuses.has(relationship.editorialStatus) && relationship.type === "prerequisite_for") {
      prerequisiteEdges.set(relationship.sourceId, [...(prerequisiteEdges.get(relationship.sourceId) ?? []), relationship.targetId]);
    }
  }
  for (const [sourceId, count] of primaryBySource) {
    if (count > 1) errors.push(`Multiple public primary learning destinations: ${sourceId} (${count})`);
  }
  for (const node of graph.nodes) {
    for (const [field, reference] of [["subjectId", node.subjectId], ["courseId", node.courseId], ["unitId", node.unitId]] as const) {
      if (reference && !ids.has(reference)) errors.push(`Missing ${field} reference on ${node.id}: ${reference}`);
    }
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visitPrerequisite(nodeId: string) {
    if (visiting.has(nodeId)) {
      errors.push(`Strict prerequisite cycle includes: ${nodeId}`);
      return;
    }
    if (visited.has(nodeId)) return;
    visiting.add(nodeId);
    for (const targetId of prerequisiteEdges.get(nodeId) ?? []) visitPrerequisite(targetId);
    visiting.delete(nodeId);
    visited.add(nodeId);
  }
  for (const nodeId of prerequisiteEdges.keys()) visitPrerequisite(nodeId);
  return errors;
}
