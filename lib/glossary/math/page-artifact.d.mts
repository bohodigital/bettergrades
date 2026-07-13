export type PageGlossaryTerm = {
  id: string;
  term: string;
  shortDefinition: string;
  visuals: readonly { tex: string; label: string }[];
};
export const pageTermSummaries: Readonly<Record<string, PageGlossaryTerm>>;
