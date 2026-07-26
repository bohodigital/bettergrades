"use client";

import { trackFindabilityEvent } from "../lib/learning-graph/analytics";
import publicArticleDestinations from "../data/learning-graph/public-article-destinations.json";

type PublicDestination = {
  relationship: { sourceId: string; sourceRole: string; targetId: string; type: string };
  target: { id: string; canonicalPath: string; pageRole: string; shortTitle: string; course: string; unit: string; topic: string };
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

export function LearningPathLinks({ sourcePath, placement, variant = "secondary" }: { sourcePath: string; placement: string; variant?: "primary" | "secondary" }) {
  const available = (publicArticleDestinations[sourcePath as keyof typeof publicArticleDestinations] ?? []) as PublicDestination[];
  const destinations = variant === "primary"
    ? available.filter(({ relationship, target }) => relationship.type === "full_version_of" && target.pageRole === "textbook-lesson").slice(0, 1)
    : available.filter(({ relationship }) => relationship.type !== "full_version_of").slice(0, 3);
  if (!destinations.length) return null;
  return (
    <section className={`related-library learning-path-links learning-path-${variant}`} aria-label={variant === "primary" ? "Full course lesson" : "Learning path"}>
      <div>{variant === "primary" ? <><p className="eyebrow">Learn this in the full course</p><p>The textbook lesson adds ordered instruction, examples, and course context.</p></> : <><p className="eyebrow">Continue</p><h2>Choose your next learning step</h2></>}</div>
      {destinations.map(({ relationship, target }, index) => (
        <a
          href={target.canonicalPath}
          key={target.id}
          onClick={() => {
            const eventData = {
              source_page_id: relationship.sourceId,
              source_page_role: relationship.sourceRole,
              target_page_id: relationship.targetId,
              target_page_role: target.pageRole,
              relationship_type: relationship.type,
              placement,
              result_rank: index + 1,
              course: target.course,
              unit: target.unit,
              topic: target.topic,
            };
            trackFindabilityEvent("learning_relationship_click", eventData);
            const articleRoles = new Set(["quick-answer", "concept-explainer", "method-guide", "decision-guide", "answer"]);
            const specific =
              articleRoles.has(relationship.sourceRole) && target.pageRole === "textbook-lesson" ? "article_to_lesson_click"
              : relationship.sourceRole === "textbook-lesson" && articleRoles.has(target.pageRole) ? "lesson_to_article_click"
              : relationship.sourceRole === "textbook-lesson" && ["worksheet", "practice-exam", "assessment"].includes(target.pageRole) ? "lesson_to_practice_click"
              : relationship.sourceRole === "textbook-lesson" && target.pageRole === "glossary-term" ? "lesson_to_reference_click"
              : relationship.sourceRole === "glossary-term" && target.pageRole === "textbook-lesson" ? "glossary_to_lesson_click"
              : "";
            if (specific) trackFindabilityEvent(specific, eventData);
          }}
        >
          <span>{purposeLabels[relationship.type] ?? "Continue learning"}</span><b>{target.shortTitle}</b><i>→</i>
        </a>
      ))}
    </section>
  );
}
