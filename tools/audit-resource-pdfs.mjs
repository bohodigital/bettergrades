import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const downloadsRoot = resolve(root, "public", "downloads", "calculus");
const artifactPath = resolve(root, "artifacts", "seo", "pdf-visual-audit.json");
const renderRoot = await mkdtemp(join(tmpdir(), "bettergrades-pdf-audit-"));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? walk(join(directory, entry.name))
    : [join(directory, entry.name)]));
  return files.flat();
}

function run(command, args) {
  return execFileSync(command, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).trim();
}

const pdfs = (await walk(downloadsRoot)).filter((path) => path.endsWith(".pdf")).sort();
const reports = [];
try {
  for (const [pdfIndex, pdf] of pdfs.entries()) {
    const info = run("pdfinfo", [pdf]);
    const pageCount = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] ?? 0);
    const pageSize = info.match(/^Page size:\s+(.+)$/m)?.[1] ?? "";
    const fonts = run("pdffonts", [pdf]).split(/\r?\n/).slice(2).filter(Boolean);
    const renderPrefix = join(renderRoot, `pdf-${pdfIndex}`, "page");
    await mkdir(dirname(renderPrefix), { recursive: true });
    run("pdftoppm", ["-png", "-r", "110", pdf, renderPrefix]);
    const rendered = (await readdir(dirname(renderPrefix))).filter((name) => name.endsWith(".png")).sort();
    const pages = [];
    for (let page = 1; page <= pageCount; page += 1) {
      const image = join(dirname(renderPrefix), rendered[page - 1] ?? "");
      const text = run("pdftotext", ["-f", String(page), "-l", String(page), "-layout", pdf, "-"]);
      const geometry = run("magick", [image, "-format", "%wx%h", "info:"]);
      const mean = Number(run("magick", [image, "-colorspace", "Gray", "-format", "%[fx:mean]", "info:"]));
      const bytes = (await stat(image)).size;
      pages.push({
        page,
        textLength: text.replace(/\s+/g, " ").trim().length,
        renderedBytes: bytes,
        geometry,
        grayscaleMean: Number(mean.toFixed(6)),
        blank: mean > 0.998 && text.replace(/\s+/g, "").length < 20,
      });
    }
    reports.push({
      path: relative(root, pdf),
      sha256: createHash("sha256").update(await readFile(pdf)).digest("hex"),
      bytes: (await stat(pdf)).size,
      pageCount,
      renderedPageCount: rendered.length,
      pageSize,
      embeddedFontCount: fonts.length,
      pages,
      failures: [
        ...(pageCount === 0 ? ["no-pages"] : []),
        ...(rendered.length !== pageCount ? [`rendered-${rendered.length}-of-${pageCount}`] : []),
        ...(fonts.length === 0 ? ["no-embedded-fonts"] : []),
        ...pages.filter((page) => page.blank).map((page) => `blank-page-${page.page}`),
        ...pages.filter((page) => page.renderedBytes < 5_000).map((page) => `undersized-render-page-${page.page}`),
      ],
    });
  }
  const failures = reports.flatMap((pdf) => pdf.failures.map((failure) => ({ path: pdf.path, failure })));
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    environment: "local-candidate",
    sourceCommit: run("git", ["-C", root, "rev-parse", "HEAD"]),
    sourceTree: run("git", ["-C", root, "rev-parse", "HEAD^{tree}"]),
    pdfCount: reports.length,
    renderedPageCount: reports.reduce((sum, pdf) => sum + pdf.renderedPageCount, 0),
    failureCount: failures.length,
    failures,
    pdfs: reports,
    pass: failures.length === 0,
  };
  await mkdir(dirname(artifactPath), { recursive: true });
  await writeFile(artifactPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({
    pdfCount: report.pdfCount,
    renderedPageCount: report.renderedPageCount,
    failureCount: report.failureCount,
    pass: report.pass,
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await rm(renderRoot, { recursive: true, force: true });
}
