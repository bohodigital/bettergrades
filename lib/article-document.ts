import {
  articleToLatexSource,
  parseLatexArticle,
  toStandaloneLatex,
  validateLatexArticle,
  type LatexDocumentNode,
} from "./article-document-core.mjs";
import type { LibraryArticle } from "./library";

export type ArticleDocument = {
  format: "latex";
  source: string;
  nodes: LatexDocumentNode[];
  sections: Array<{ heading: string; id: string }>;
};

function sectionId(heading: string, index: number) {
  const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `section-${index + 1}-${slug || "article"}`;
}

export function compileArticleDocument(article: LibraryArticle): ArticleDocument {
  const source = article.documentSource?.trim() || articleToLatexSource(article);
  const validation = validateLatexArticle(source);
  if (!validation.valid) throw new Error(`Invalid LaTeX article ${article.slug}: ${validation.errors.join(" ")}`);
  const nodes = parseLatexArticle(source);
  const sections = nodes
    .filter((node): node is Extract<LatexDocumentNode, { type: "section" }> => node.type === "section")
    .map((node, index) => ({ heading: node.heading, id: sectionId(node.heading, index) }));
  return { format: "latex", source, nodes, sections };
}

export function exportArticleLatex(article: LibraryArticle) {
  const document = compileArticleDocument(article);
  return toStandaloneLatex({ title: article.title, source: document.source });
}
