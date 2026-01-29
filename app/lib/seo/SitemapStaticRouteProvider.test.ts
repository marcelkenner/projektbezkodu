import path from "path";
import { describe, expect, it } from "vitest";

import { AppRouteFileIndex } from "@/app/lib/seo/AppRouteFileIndex";
import { AppRoutePathResolver } from "@/app/lib/seo/AppRoutePathResolver";
import { SitemapStaticRouteProvider } from "@/app/lib/seo/SitemapStaticRouteProvider";

describe("SitemapStaticRouteProvider", () => {
  it("collects static routes and skips dynamic segments", () => {
    const projectRoot = path.join(process.cwd(), "test/fixtures/app-routes");
    const fileIndex = new AppRouteFileIndex({ projectRoot });
    const pathResolver = new AppRoutePathResolver({ projectRoot });
    const provider = new SitemapStaticRouteProvider(fileIndex, pathResolver);

    const routes = provider.buildLinks().map((link) => link.href);

    expect(routes).toContain("/");
    expect(routes).toContain("/faq/");
    expect(routes).toContain("/tag/");
    expect(routes).toContain("/polityka-prywatnosci/");
    expect(routes).not.toContain("/tag/[slug]/");
    expect(routes).not.toContain("/[...segments]/");
  });
});
