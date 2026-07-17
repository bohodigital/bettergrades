# Cloudflare delivery

## Existing architecture

BVLP preserves the existing BetterGrades Pages/vinext/Workers project and its
source-generated configuration. It does not migrate the application to a
separate Worker, change DNS, or add KV, R2, D1, Durable Objects, Queues, Browser
Rendering, Workers AI, Vectorize, Hyperdrive, or any other persistent binding.

## Static and Worker behavior

Compiled SVG, hashed visual assets, CSS, renderer chunks, and any safe public
scene payload use the existing static asset path and should bypass unnecessary
custom visualization execution. Route rendering resolves only the visuals used
on that page. It must not expose a sitewide registry, unrelated scenes, source
notes, textbook source, or assessment answers.

A visual API is not part of the default architecture. If later evidence proves
page payloads insufficient, a separately reviewed `/api/visuals/:visualId`-like
route may accept only known public IDs, never interpret file paths or arbitrary
expressions, return a real 404 for unknown IDs, enforce a bounded response, omit
private/answer data, and use safe ETag/cache headers. No all-visual response.

Hashed immutable assets may receive long-lived immutable caching. HTML, sitemap,
robots, and mutable route metadata follow the existing project rules. Exact
cache headers, generated paths, and Worker invocation measurements must be
captured from the preview and production build; they are pending.

## Preview and deployment

1. Build the exact reviewed commit with the repository package manager and
   existing Pages build path.
2. Validate the generated configuration instead of manually patching it.
3. Publish the exact source to the existing owner-only Sites project and verify
   one owner, zero groups, source commit/version/deployment, access, and all
   representative routes.
4. Production requires recorded authorization for that exact preview and source.
5. Use the current secret-safe deployment wrapper and existing Cloudflare Pages
   project. Never read or print a raw token. Pages deployment uses its bounded
   credential; primary-management credentials are used only for authorized
   account/DNS/control-plane checks that actually require them.
6. Verify the immutable deployment, pages.dev, apex, and www in real browsers;
   a route-level 200 is not sufficient.

No new project or DNS record is authorized. The current project identifiers,
preview version, immutable URL, production commit, and measured static/Worker
behavior belong in the final verified report, not in this pre-implementation doc.

## Rollback and troubleshooting

Rollback redeploys the prior verified immutable source/deployment or reverts the
release commit; it does not create a parallel renderer architecture. For asset
404s, compare build manifest, hashed asset path, generated Wrangler/vinext
routing, MIME/cache headers, and immutable URL. For wrong caching, inspect the
actual response and existing control-plane rule before proposing a change.
Unknown visual IDs returning 200, static assets traversing unexpected Worker
logic, exposed secrets, or an unmatched production source are release blockers.
