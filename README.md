# Better Grades

Private-preview landing page for `bettergrades.net`.

The site is intentionally marked `noindex, nofollow` and contains no forms,
analytics, tracking, testimonials, performance claims, accounts, or student
data collection. It is a static site with no runtime dependencies.

## Validate

```bash
npm test
```

The checks verify the private-preview guardrails, accessible page structure,
security headers, and absence of forms, scripts, tracking, and mojibake.

## Hosting

- Repository: `bohodigital/bettergrades`
- Cloudflare Pages project: `bettergrades`
- Build command: none
- Output directory: `public`
- Production branch: `main`

Production is deployed from the exact validated GitHub commit by the Pi's
fixed-reference Cloudflare Pages wrapper. The Pages API token remains in the
Pi's encrypted local broker.
