import type { MetadataRoute } from "next";

const DOMAIN = "https://rjrj.ru";

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
    url: `${DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "always" : "monthly",
    priority: route === "/" ? 1 : 0.5,
  }));
}
