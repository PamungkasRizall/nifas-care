import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { articles } from "@/lib/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_CONFIG.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_CONFIG.url}/artikel`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_CONFIG.url}/skrining`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_CONFIG.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_CONFIG.url}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_CONFIG.url}/artikel/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
