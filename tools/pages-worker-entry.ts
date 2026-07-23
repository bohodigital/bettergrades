import { POST as algebraPost } from "../app/api/algebra/route";
import { POST as calculusCheckPost } from "../app/api/calculus-check/route";
import { POST as calculusRevealPost } from "../app/api/calculus-reveal/route";
import { POST as limitsCheckPost } from "../app/api/limits-check/route";

type PagesEnvironment = {
  ASSETS: { fetch(request: Request): Promise<Response> };
};

const apiHandlers = new Map<string, (request: Request) => Promise<Response>>([
  ["/api/algebra", algebraPost],
  ["/api/calculus-check", calculusCheckPost],
  ["/api/calculus-reveal", calculusRevealPost],
  ["/api/limits-check", limitsCheckPost],
]);

const securityHeaders = {
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

function secure(response: Response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

const worker = {
  async fetch(request: Request, env: PagesEnvironment) {
    const url = new URL(request.url);
    if (url.pathname === "/_vinext/image") return secure(await env.ASSETS.fetch(request));
    const handler = apiHandlers.get(url.pathname);
    if (!handler) return secure(Response.json({ error: "Not found." }, { status: 404 }));
    if (request.method !== "POST") return secure(Response.json({ error: "Method not allowed." }, { status: 405, headers: { allow: "POST" } }));
    return secure(await handler(request));
  },
};

export default worker;
