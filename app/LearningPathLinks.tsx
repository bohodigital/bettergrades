"use client";

import { trackFindabilityEvent } from "../lib/learning-graph/analytics";
import publicArticleDestinations from "../data/learning-graph/public-article-destinations.json";

type PublicDestination = {
  relationship: { sourceId: string; targetId: string; type: string };
  target: { id: string; canonicalPath: string; pageRole: string; shortTitle: string };
};

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

export function LearningPathLinks({ sourcePath, placement }: { sourcePath: string; placement: string }) {
  const destinations = (publicArticleDestinations[sourcePath as keyof typeof publicArticleDestinations] ?? []) as PublicDestination[];
  if (!destinations.length) return null;
  return (
    <section className="related-library learning-path-links" aria-label="Learning path">
      <div><p className="eyebrow">Continue the path</p><h2>Choose your next learning step</h2></div>
      {destinations.map(({ relationship, target }, index) => (
        <a
          href={target.canonicalPath}
          key={target.id}
          onClick={() => {
            trackFindabilityEvent("learning_relationship_click", {
              source_page_id: relationship.sourceId,
              target_page_id: relationship.targetId,
              target_page_role: target.pageRole,
              relationship_type: relationship.type,
              placement,
              result_rank: index + 1,
            });
            const specific = target.pageRole === "textbook-lesson" ? "article_to_lesson_click" : target.pageRole === "glossary-term" ? "lesson_to_reference_click" : target.pageRole === "worksheet" || target.pageRole === "practice-exam" ? "lesson_to_practice_click" : "";
            if (specific) trackFindabilityEvent(specific, { source_page_id: relationship.sourceId, target_page_id: relationship.targetId, relationship_type: relationship.type, placement });
          }}
        >
          <span>{purposeLabels[relationship.type] ?? "Continue learning"}</span><b>{target.shortTitle}</b><i>→</i>
        </a>
      ))}
    </section>
  );
}
