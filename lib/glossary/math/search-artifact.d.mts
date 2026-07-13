export type MathGlossarySearchTerm = {
  id: string;
  term: string;
  categoryLabel: string;
  shortDefinition: string;
  aliases: readonly string[];
  keywords: readonly string[];
  visualText: readonly string[];
};
export const mathGlossarySearchTerms: readonly MathGlossarySearchTerm[];
