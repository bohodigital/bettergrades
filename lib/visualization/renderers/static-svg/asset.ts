import { createHash } from "node:crypto";

import { StaticSvgRenderError } from "./errors.ts";

export const STATIC_SVG_TARGET_BYTES = 50 * 1_024;
export const STATIC_SVG_JUSTIFICATION_BYTES = 75 * 1_024;
export const STATIC_SVG_HARD_MAX_BYTES = 512 * 1_024;

export type StaticSvgAssetMetadata = Readonly<{
  byteLength: number;
  sha256: string;
  assetFileName: string;
  assetPath: string;
  meetsTarget: boolean;
  requiresSizeJustification: boolean;
}>;

const FORBIDDEN_OUTPUT: ReadonlyArray<readonly [string, RegExp]> = [
  ["script", /<\s*script\b/i],
  ["event-handler", /<[^>]+\son[a-z][a-z0-9_-]*\s*=/i],
  ["foreign-object", /<\s*foreignObject\b/i],
  ["external-image", /<\s*image\b/i],
  ["external-link", /<[^>]+\s(?:href|src)\s*=\s*["'](?!#)/i],
  ["external-css", /(?:@import|url\(\s*["']?(?:https?:|\/\/|data:))/i],
  ["raw-latex", /\\(?:begin|end|addplot|draw|node|frac|sqrt|left|right|operatorname|mathrm)\b/i],
  ["tikz-pgfplots", /(?:tikzpicture|pgfplots|axis\s+cs\s*:)/i],
];

export function assertStaticSvgSafety(svg: string, sceneId?: string): void {
  if (!svg.startsWith("<svg ") || !svg.endsWith("</svg>\n")) {
    throw new StaticSvgRenderError(
      "invalid-svg-envelope",
      "Static SVG output must be one complete, newline-terminated SVG document.",
      sceneId,
    );
  }
  for (const [code, pattern] of FORBIDDEN_OUTPUT) {
    if (pattern.test(svg)) {
      throw new StaticSvgRenderError(
        `unsafe-${code}`,
        `Static SVG output for ${sceneId ?? "unknown scene"} contains forbidden ${code} content.`,
        sceneId,
      );
    }
  }
}

export function measureStaticSvg(
  sceneId: string,
  svg: string,
  options: Readonly<{ assetPrefix?: string; maxOutputBytes?: number }> = {},
): StaticSvgAssetMetadata {
  assertStaticSvgSafety(svg, sceneId);
  const byteLength = Buffer.byteLength(svg, "utf8");
  const maxOutputBytes = options.maxOutputBytes ?? STATIC_SVG_HARD_MAX_BYTES;
  if (!Number.isSafeInteger(maxOutputBytes) || maxOutputBytes < 1 || maxOutputBytes > STATIC_SVG_HARD_MAX_BYTES) {
    throw new StaticSvgRenderError(
      "invalid-output-budget",
      `Static SVG maxOutputBytes must be an integer from 1 through ${STATIC_SVG_HARD_MAX_BYTES}.`,
      sceneId,
    );
  }
  if (byteLength > maxOutputBytes) {
    throw new StaticSvgRenderError(
      "svg-output-budget",
      `Static SVG for ${sceneId} is ${byteLength} bytes, exceeding the ${maxOutputBytes}-byte hard output budget.`,
      sceneId,
    );
  }
  const sha256 = createHash("sha256").update(svg, "utf8").digest("hex");
  const assetStem = sceneId.replace(/[^A-Za-z0-9_-]/g, "-");
  const assetFileName = `${assetStem}.${sha256.slice(0, 16)}.svg`;
  const rawPrefix = options.assetPrefix ?? "/visuals/v1";
  if (!/^\/[A-Za-z0-9_./-]*[A-Za-z0-9_-]$/.test(rawPrefix) || rawPrefix.includes("..") || rawPrefix.includes("//")) {
    throw new StaticSvgRenderError(
      "invalid-asset-prefix",
      `Static SVG assetPrefix ${JSON.stringify(rawPrefix)} is not a safe absolute public path.`,
      sceneId,
    );
  }
  return Object.freeze({
    byteLength,
    sha256,
    assetFileName,
    assetPath: `${rawPrefix}/${assetFileName}`,
    meetsTarget: byteLength <= STATIC_SVG_TARGET_BYTES,
    requiresSizeJustification: byteLength > STATIC_SVG_JUSTIFICATION_BYTES,
  });
}
