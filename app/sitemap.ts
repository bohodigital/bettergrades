import type { MetadataRoute } from "next";
import { routes } from "../lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes
    .filter((route) => route !== "/search/")
    .map((route) => ({
      url: `https://bettergrades.net${route}`,
      lastModified: new Date("2026-07-11"),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : route.includes("integral-of-sec-cubed") ? 0.9 : 0.7,
    }));
}
