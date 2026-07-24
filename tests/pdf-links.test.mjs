import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { isPdfHref, pdfLinkAttributes } from "../lib/resources/pdf-links.mjs";

const root = resolve(import.meta.dirname, "..");

test("PDF URL recognition and safe attributes cover future link variants", () => {
  for (const href of [
    "/downloads/worksheet.pdf",
    "/downloads/worksheet.PDF",
    "/downloads/worksheet.pdf?variant=student",
    "/downloads/worksheet.PDF#page=2",
  ]) {
    assert.equal(isPdfHref(href), true, href);
    assert.deepEqual(pdfLinkAttributes(href), { target: "_blank", rel: "noopener" }, href);
  }

  assert.deepEqual(
    pdfLinkAttributes("https://example.edu/reference.PDF?edition=2#page=3"),
    { target: "_blank", rel: "noopener noreferrer" },
  );
  for (const href of ["/resources/", "/guides/pdf-accessibility/", "/download?format=pdf", "not a url"]) {
    assert.equal(isPdfHref(href), false, href);
    assert.deepEqual(pdfLinkAttributes(href), {}, href);
  }
});

async function walkHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walkHtml(path) : path.endsWith(".html") ? [path] : [];
  }))).flat();
}

test("every generated public PDF anchor is native, accessible, isolated, and never forced to download", async () => {
  const files = await walkHtml(resolve(root, "dist", "pages"));
  const links = [];
  for (const file of files) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/gi)) {
      if (isPdfHref(match[1])) links.push({ file, href: match[1], html: match[0] });
    }
  }

  assert.ok(links.length >= 42, `expected resource-library and detail-page PDF links, found ${links.length}`);
  assert.equal(new Set(links.map(({ href }) => href)).size, 21);
  for (const link of links) {
    assert.match(link.html, /\btarget="_blank"/i, `${link.file}: ${link.href}`);
    assert.match(link.html, /\brel="noopener"/i, `${link.file}: ${link.href}`);
    assert.doesNotMatch(link.html, /\bdownload(?:\s|=|>)/i, `${link.file}: ${link.href}`);
    assert.match(link.html, /class="sr-only"[^>]*> \(opens in a new tab\)<\/span>/i, `${link.file}: ${link.href}`);
  }
});
