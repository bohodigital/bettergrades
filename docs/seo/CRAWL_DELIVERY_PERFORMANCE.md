# Crawl delivery performance

## Architecture

Release A prerenders every canonical educational route into `dist/pages/<route>/index.html`. Cloudflare Pages serves those immutable documents directly. `_routes.json` invokes the Worker only for `/api/*` and `/_vinext/image`; the Worker remains packaged for API behavior and rollback compatibility. The canonical registry still generates routes, sitemap, redirects, and content, so this is one publishing system rather than a parallel site.

## Before and after

| Run | Before | After | Change |
| --- | ---: | ---: | ---: |
| 440 routes, serial | 2,146.68 ms | 1,582.34 ms | -26.3% |
| 440 routes, concurrency 5 | 2,014.84 ms | 1,509.79 ms | -25.1% |
| 200 routes, concurrency 10 | 896.88 ms | 672.17 ms | -25.1% |
| 80 routes, concurrency 20, five bursts | 355.23–363.04 ms | 261.69–277.41 ms | lower in every repeat |

Both sets produced zero unexpected `5xx`, resource-limit markers, soft-200 errors, and crawl failures. Final results also have zero canonical mismatches and exactly one main/H1 on every sitemap route.

The final Worker is 12,837,293 bytes uncompressed and 2,717,303 bytes gzip, below the existing 2.75 MB gzip gate and slightly smaller than the 12,892,008-byte baseline. The principal production improvement is more substantial than the local timing delta: ordinary educational requests no longer invoke the Worker.

Heavy tests are local. Private-preview testing uses the same bounded profile. Production verification is deliberately conservative and limited to representative routes and headers.

## Evidence and rollback

Detailed results are in `crawl-load-before.json`, `crawl-load-after.json`, `sitemap-verification.json`, and `redirect-verification.json`. Rollback restores the previous deployment and previous `_routes.json` behavior; no content database or irreversible migration is involved.
