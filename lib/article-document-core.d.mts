export type LatexInlineNode = { type: "text" | "math" | "strong" | "emphasis"; value: string };
export type LatexDocumentNode =
  | { type: "section"; heading: string }
  | { type: "paragraph"; children: LatexInlineNode[] }
  | { type: "math"; tex: string }
  | { type: "box"; kind: "note" | "example"; title: string; children: LatexDocumentNode[] }
  | { type: "list"; ordered: boolean; items: LatexInlineNode[][] };

export function escapeLatexText(value: string): string;
export function parseLatexInline(source: string): LatexInlineNode[];
export function parseLatexArticle(source: string): LatexDocumentNode[];
export function articleToLatexSource(article: {
  formula?: string;
  immediate?: { label: string; tex?: string; text: string };
  sections: Array<{ heading: string; paragraphs: string[]; tex?: string }>;
  example: { heading: string; prompt: string; steps: Array<{ tex: string; note: string }>; result: string };
  mistakes: string[];
  takeaways: string[];
}): string;
export function markdownToLatexArticle(markdown: string): string;
export function validateLatexArticle(source: string): { valid: boolean; errors: string[] };
export function toStandaloneLatex(input: { title: string; source: string }): string;
