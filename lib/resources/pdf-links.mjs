const CANONICAL_ORIGIN = "https://bettergrades.net";

export function isPdfHref(href) {
  if (typeof href !== "string" || !href.trim()) return false;
  try {
    return new URL(href, CANONICAL_ORIGIN).pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

export function pdfLinkAttributes(href) {
  if (!isPdfHref(href)) return {};
  const url = new URL(href, CANONICAL_ORIGIN);
  const sameOrigin = href.startsWith("/") || url.origin === CANONICAL_ORIGIN;
  return {
    target: "_blank",
    rel: sameOrigin ? "noopener" : "noopener noreferrer",
  };
}
