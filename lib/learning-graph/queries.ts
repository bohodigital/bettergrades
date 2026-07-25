import { learningNodeById, learningNodeByPath } from "./nodes";
import { publicLearningRelationships } from "./relationships";

const purposeLabels: Record<string, string> = {
  full_version_of: "Learn this fully",
  practices: "Practice this skill",
  assesses: "Practice this skill",
  explains: "See a clear explanation",
  references: "Review the definition",
  visualizes: "See the visual guide",
  uses_tool: "Use the tool",
  follows: "Continue to the next lesson",
};

export function learningDestinationsForPath(path: string, limit = 4) {
  const source = learningNodeByPath.get(path);
  if (!source) return [];
  const seen = new Set<string>();
  return publicLearningRelationships
    .filter((relationship) => relationship.sourceId === source.id)
    .flatMap((relationship) => {
      const target = learningNodeById.get(relationship.targetId);
      if (!target || seen.has(target.id)) return [];
      seen.add(target.id);
      return [{ relationship, target, purposeLabel: purposeLabels[relationship.type] ?? "Continue learning" }];
    })
    .slice(0, Math.max(0, Math.min(limit, 4)));
}
