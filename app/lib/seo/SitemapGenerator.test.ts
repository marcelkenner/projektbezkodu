import { describe, expect, it } from "vitest";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { GlossaryRepository } from "@/app/lib/content/repositories";
import { SitemapGenerator, type SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";
import { SitemapLastModifiedIndex } from "@/app/lib/seo/SitemapLastModifiedIndex";
import { SiteUrlFactory } from "@/app/lib/url/SiteUrlFactory";

class StubLinkProvider implements SitemapLinkProvider {
  buildLinks() {
    return [
      { label: "Tool review", href: "/narzedzia/fixture-tool/recenzja/" },
      { label: "Tools listing", href: "/narzedzia/" },
      { label: "External", href: "https://example.com/not-our-site" },
    ];
  }
}

describe("SitemapGenerator", () => {
  it("returns canonical site URLs and sets lastModified from markdown content", () => {
    const library = new ContentLibrary({ excludedDirectories: ["glossary"] });
    const index = new SitemapLastModifiedIndex(library, new GlossaryRepository());
    const generator = new SitemapGenerator(
      new StubLinkProvider(),
      new SiteUrlFactory("https://sitemap.test"),
      index,
    );

    const entries = generator.build();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://sitemap.test/narzedzia/fixture-tool/recenzja/");
    expect(urls).toContain("https://sitemap.test/narzedzia/");
    expect(urls.some((url) => url.startsWith("https://example.com/"))).toBe(false);

    const recenzja = entries.find(
      (entry) => entry.url === "https://sitemap.test/narzedzia/fixture-tool/recenzja/",
    );
    expect(recenzja?.lastModified).toBe("2026-01-14");

    const listing = entries.find(
      (entry) => entry.url === "https://sitemap.test/narzedzia/",
    );
    expect(typeof listing?.lastModified).toBe("string");
    expect(Date.parse(listing?.lastModified ?? "")).not.toBeNaN();
    expect(Date.parse(listing?.lastModified ?? "")).toBeGreaterThanOrEqual(
      Date.parse("2026-01-14"),
    );
  });
});
