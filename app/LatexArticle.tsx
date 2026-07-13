"use client";

import type { ArticleDocument } from "../lib/article-document";
import type { LatexDocumentNode, LatexInlineNode } from "../lib/article-document-core.mjs";
import { Math } from "./Math";

function InlineLatex({ nodes }: { nodes: LatexInlineNode[] }) {
  return nodes.map((node, index) => {
    const key = `${node.type}-${index}-${node.value}`;
    if (node.type === "math") return <Math tex={node.value} key={key} />;
    if (node.type === "strong") return <strong key={key}>{node.value}</strong>;
    if (node.type === "emphasis") return <em key={key}>{node.value}</em>;
    return <span key={key}>{node.value}</span>;
  });
}

function LatexNodes({ nodes }: { nodes: LatexDocumentNode[] }) {
  return nodes.map((node, index) => {
    if (node.type === "paragraph") return <p key={`paragraph-${index}`}><InlineLatex nodes={node.children} /></p>;
    if (node.type === "math") return <Math tex={node.tex} display className="latex-document-math" key={`math-${index}`} />;
    if (node.type === "box") {
      return (
        <aside className={`latex-document-box latex-document-box-${node.kind}`} key={`box-${index}`}>
          <span>{node.kind === "example" ? "Worked example" : "Note"}</span>
          <h3>{node.title}</h3>
          <LatexNodes nodes={node.children} />
        </aside>
      );
    }
    if (node.type === "list") {
      const items = node.items.map((item, itemIndex) => <li key={`item-${itemIndex}`}><InlineLatex nodes={item} /></li>);
      return node.ordered
        ? <ol className="latex-document-list" key={`list-${index}`}>{items}</ol>
        : <ul className="latex-document-list" key={`list-${index}`}>{items}</ul>;
    }
    return null;
  });
}

type SectionGroup = { heading: string; id: string; nodes: LatexDocumentNode[] };

function groupDocument(document: ArticleDocument) {
  const lead: LatexDocumentNode[] = [];
  const sections: SectionGroup[] = [];
  let current: SectionGroup | null = null;
  let sectionIndex = 0;
  for (const node of document.nodes) {
    if (node.type === "section") {
      current = { heading: node.heading, id: document.sections[sectionIndex]?.id ?? `section-${sectionIndex + 1}`, nodes: [] };
      sections.push(current);
      sectionIndex += 1;
    } else if (current) current.nodes.push(node);
    else lead.push(node);
  }
  return { lead, sections };
}

export function LatexArticleDocument({ document }: { document: ArticleDocument }) {
  const grouped = groupDocument(document);
  return (
    <div className="latex-article-document" data-article-format="latex-document">
      {grouped.lead.length > 0 && <div className="latex-document-lead"><LatexNodes nodes={grouped.lead} /></div>}
      {grouped.sections.map((section) => (
        <section className="latex-document-section" id={section.id} key={section.id}>
          <h2>{section.heading}</h2>
          <LatexNodes nodes={section.nodes} />
        </section>
      ))}
    </div>
  );
}
