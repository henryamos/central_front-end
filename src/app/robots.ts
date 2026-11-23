import type { MetadataRoute } from "next";
// Keep the foundation out of search until approved content is published.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
