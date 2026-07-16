import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://bettergrades.net/sitemap.xml",
    host: "https://bettergrades.net",
  };
}
