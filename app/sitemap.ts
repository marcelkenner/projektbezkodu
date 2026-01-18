import type { MetadataRoute } from "next";

import { SitemapGenerator } from "@/app/lib/seo/SitemapGenerator";

export default function sitemap(): MetadataRoute.Sitemap {
  return new SitemapGenerator().build();
}

