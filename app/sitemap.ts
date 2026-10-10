import type { MetadataRoute } from "next";
import { profile, projects } from "@/lib/portfolio";
import { getAllArticles } from "@/lib/articles";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.url, lastModified: "2026-10-09", priority: 1 },
    {
      url: `${profile.url}/articles`,
      lastModified: "2026-10-09",
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: `${profile.url}/work/${project.slug}`,
      lastModified: "2026-10-09",
      priority: 0.8,
    })),
    ...getAllArticles().map((article) => ({
      url: `${profile.url}/articles/${article.slug}`,
      lastModified: article.updatedAt || article.date,
      priority: 0.6,
    })),
  ];
}
