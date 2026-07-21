import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ndsoft.dev/",
      lastModified: new Date("2026-07-20"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
