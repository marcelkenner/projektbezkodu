import { describe, expect, it } from "vitest";

import { ArticleListingIndexingPolicy } from "@/app/lib/seo/ArticleListingIndexingPolicy";

describe("ArticleListingIndexingPolicy", () => {
  const policy = new ArticleListingIndexingPolicy();

  it("allows indexing on the base listing without filters", () => {
    expect(policy.resolveRobots({ page: "1" })).toBeUndefined();
  });

  it("sets noindex,follow for paginated listings", () => {
    expect(policy.resolveRobots({ page: "2" })).toEqual({
      index: false,
      follow: true,
    });
  });

  it("sets noindex,follow for filtered listings", () => {
    expect(policy.resolveRobots({ query: "seo" })).toEqual({
      index: false,
      follow: true,
    });
    expect(policy.resolveRobots({ category: "content-marketing" })).toEqual({
      index: false,
      follow: true,
    });
    expect(policy.resolveRobots({ readingTime: "5-10" })).toEqual({
      index: false,
      follow: true,
    });
    expect(policy.resolveRobots({ tags: ["ai"] })).toEqual({
      index: false,
      follow: true,
    });
  });
});
