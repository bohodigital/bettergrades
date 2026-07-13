/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { getRedirect, publicRoutes } from "../lib/registry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const SECURITY_HEADERS: Record<string, string> = {
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
};

function withSecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function fixedResponse(request: Request, body: string, contentType: string) {
  return withSecurityHeaders(
    new Response(request.method === "HEAD" ? null : body, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": contentType,
      },
    }),
  );
}

function sitemapXml() {
  const entries = publicRoutes
    .filter((route) => route !== "/search/")
    .map((route) => {
      const priority = route === "/" ? "1.0" : route.includes("integral-of-sec-cubed") ? "0.9" : "0.7";
      const frequency = route === "/" ? "weekly" : "monthly";
      return `<url><loc>https://bettergrades.net${route}</loc><lastmod>2026-07-11</lastmod><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const redirect = getRedirect(url.pathname);
    if (redirect) return withSecurityHeaders(Response.redirect(new URL(redirect.to, url), redirect.status));

    if (url.pathname === "/robots.txt" || url.pathname === "/robots.txt/") {
      return fixedResponse(
        request,
        "User-agent: *\nAllow: /\nDisallow: /search/\nSitemap: https://bettergrades.net/sitemap.xml\nHost: https://bettergrades.net\n",
        "text/plain; charset=utf-8",
      );
    }

    if (url.pathname === "/sitemap.xml" || url.pathname === "/sitemap.xml/") {
      return fixedResponse(request, sitemapXml(), "application/xml; charset=utf-8");
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return withSecurityHeaders(await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths));
    }

    return withSecurityHeaders(await handler.fetch(request, env, ctx));
  },
};

export default worker;
