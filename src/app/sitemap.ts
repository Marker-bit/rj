import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/privacy-policy",
    "/terms-of-service",
    "/faq",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "always" : "monthly",
    priority: route === "/" ? 1 : 0.5,
  }));
}
