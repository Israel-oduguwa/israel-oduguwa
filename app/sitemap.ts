import type { MetadataRoute } from "next";
import { profile, projects } from "@/lib/portfolio";
import { getAllArticles } from "@/lib/articles";
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  return [
    { url: profile.url, lastModified: "2026-10-09", priority: 1 },
    {
      url: `${profile.url}/articles`,
      lastModified: articles[0]?.updatedAt || articles[0]?.date || "2026-10-09",
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: `${profile.url}/work/${project.slug}`,
      lastModified: "2026-10-09",
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${profile.url}/articles/${article.slug}`,
      lastModified: article.updatedAt || article.date,
      priority: 0.6,
    })),
  ];
}
