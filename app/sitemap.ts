import type { MetadataRoute } from "next";
import { publicRoutes } from "../lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
      url: `https://bettergrades.net${route}`,
      lastModified: new Date("2026-07-16"),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : route.includes("integral-of-sec-cubed") ? 0.9 : 0.7,
    }));
}
