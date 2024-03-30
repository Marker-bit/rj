import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const DOMAIN = "https://rjrj.ru";
  return [
    {
      url: `${DOMAIN}/`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
  ];
}
