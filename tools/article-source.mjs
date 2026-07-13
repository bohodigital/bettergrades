#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { markdownToLatexArticle, toStandaloneLatex, validateLatexArticle } from "../lib/article-document-core.mjs";

const args = process.argv.slice(2);
const standalone = args.includes("--standalone");
const positional = args.filter((arg) => !arg.startsWith("--"));
const titleFlag = args.find((arg) => arg.startsWith("--title="));
const [inputPath, outputPath] = positional;

if (!inputPath) {
  console.error("Usage: pnpm article:compile <article.md> [article.tex] [--standalone] [--title=\"Article title\"]");
  process.exitCode = 1;
} else {
  const markdown = await readFile(resolve(inputPath), "utf8");
  const source = markdownToLatexArticle(markdown);
  const validation = validateLatexArticle(source);
  if (!validation.valid) throw new Error(validation.errors.join("\n"));
  const defaultTitle = basename(inputPath).replace(/\.md$/i, "").replace(/[-_]+/g, " ");
  const output = standalone ? toStandaloneLatex({ title: titleFlag?.slice(8) || defaultTitle, source }) : `${source}\n`;
  if (outputPath) {
    await writeFile(resolve(outputPath), output, "utf8");
    console.log(`Wrote ${standalone ? "standalone" : "canonical"} LaTeX to ${resolve(outputPath)}`);
  } else process.stdout.write(output);
}
