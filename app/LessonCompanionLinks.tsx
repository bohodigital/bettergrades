"use client";

import { trackFindabilityEvent } from "../lib/learning-graph/analytics";
import publicLessonDestinations from "../data/learning-graph/public-lesson-destinations.json";

type LessonDestination = {
  relationship: { sourceId: string; sourceRole: string; targetId: string; type: string; placement: string };
  target: { id: string; canonicalPath: string; pageRole: string; shortTitle: string; course: string; unit: string; topic: string };
};

const purposeLabels: Record<string, string> = {
  practices: "Practice this skill",
  explains: "Quick explanation",
  references: "Reference",
  visualizes: "Visual guide",
  uses_tool: "Tool",
};

export function LessonCompanionLinks({ sourcePath, variant }: { sourcePath: string; variant: "primary" | "secondary" }) {
  const available = (publicLessonDestinations[sourcePath as keyof typeof publicLessonDestinations] ?? []) as LessonDestination[];
  const destinations = variant === "primary"
    ? available.filter(({ relationship }) => relationship.type === "practices" && relationship.placement === "lesson-intro").slice(0, 1)
    : available.filter(({ relationship }) => relationship.type !== "practices" && relationship.placement === "lesson-footer").slice(0, 3);
  if (!destinations.length) return null;
  return <section className={`lesson-companions lesson-companions-${variant}`} aria-label={variant === "primary" ? "Practice this skill" : "Continue with a companion resource"}>
    <header><p className="eyebrow">{variant === "primary" ? "Practice this skill" : "Continue"}</p>{variant === "secondary" && <h2>Use one focused companion</h2>}</header>
    <div>{destinations.map(({ relationship, target }, index) => <a href={target.canonicalPath} key={target.id} onClick={() => {
      const data = {
        source_page_id: relationship.sourceId,
        source_page_role: relationship.sourceRole,
        target_page_id: relationship.targetId,
        target_page_role: target.pageRole,
        relationship_type: relationship.type,
        placement: relationship.placement,
        result_rank: index + 1,
        course: target.course,
        unit: target.unit,
        topic: target.topic,
      };
      trackFindabilityEvent("learning_relationship_click", data);
      trackFindabilityEvent(
        relationship.type === "practices"
          ? "lesson_to_practice_click"
          : relationship.type === "references"
            ? "lesson_to_reference_click"
            : "lesson_to_article_click",
        data,
      );
    }}><span>{purposeLabels[relationship.type] ?? "Continue"}</span><b>{target.shortTitle}</b><i aria-hidden="true">→</i></a>)}</div>
  </section>;
}
