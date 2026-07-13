import type { ArticleArchetype, LibraryArticle } from "../library";

type AlgebraArticleInput = {
  slug: string;
  topicSlug: string;
  archetype: ArticleArchetype;
  title: string;
  shortTitle: string;
  deck: string;
  course: "Algebra I" | "Algebra II";
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  minutes: number;
  formula?: string;
  immediate?: { label: string; tex?: string; text: string };
  sections: Array<[heading: string, first: string, second: string, tex?: string]>;
  example: {
    heading: string;
    prompt: string;
    steps: Array<[tex: string, note: string]>;
    result: string;
  };
  mistakes: string[];
  takeaways: string[];
  related: string[];
  searchTerms?: string[];
};

export function algebraArticle(input: AlgebraArticleInput): LibraryArticle {
  return {
    ...input,
    sections: input.sections.map(([heading, first, second, tex]) => ({ heading, paragraphs: [first, second], tex })),
    example: { ...input.example, steps: input.example.steps.map(([tex, note]) => ({ tex, note })) },
    reviewed: "July 13, 2026",
  };
}
