import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://israeloduguwa.com",
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
