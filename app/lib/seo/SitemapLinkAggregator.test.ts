import { describe, expect, it } from "vitest";

import type { SitemapLinkProvider } from "@/app/lib/seo/SitemapGenerator";
import { SitemapLinkAggregator } from "@/app/lib/seo/SitemapLinkAggregator";

class StubProviderA implements SitemapLinkProvider {
  buildLinks() {
    return [{ label: "FAQ", href: "/faq" }];
  }
}

class StubProviderB implements SitemapLinkProvider {
  buildLinks() {
    return [
      { label: "FAQ Slash", href: "/faq/" },
      { label: "Kontakt", href: "/kontakt/" },
    ];
  }
}

describe("SitemapLinkAggregator", () => {
  it("deduplicates normalized routes across providers", () => {
    const aggregator = new SitemapLinkAggregator([
      new StubProviderA(),
      new StubProviderB(),
    ]);

    const routes = aggregator.buildLinks().map((link) => link.href);

    expect(routes.filter((route) => route.startsWith("/faq"))).toHaveLength(1);
    expect(routes).toContain("/kontakt/");
  });
});
