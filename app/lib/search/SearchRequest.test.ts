import { describe, expect, it } from "vitest";

import { SearchParamParser } from "@/app/lib/url/SearchParamParser";
import { parseSearchRequest } from "@/app/lib/search/SearchRequest";

describe("parseSearchRequest", () => {
  it("returns an empty request when q is missing", () => {
    const request = parseSearchRequest(new SearchParamParser(undefined));

    expect(request).toEqual({
      kind: "empty",
      query: "",
      type: "all",
      sort: "relevance",
    });
  });

  it("trims the query and keeps valid filters", () => {
    const request = parseSearchRequest(
      new SearchParamParser({
        q: "  webflow onboarding  ",
        typ: "tutorial",
        sort: "newest",
      }),
    );

    expect(request).toEqual({
      kind: "query",
      query: "webflow onboarding",
      type: "tutorial",
      sort: "newest",
    });
  });

  it("falls back to safe defaults for invalid filters", () => {
    const request = parseSearchRequest(
      new SearchParamParser({
        q: "api",
        typ: "something-else",
        sort: "ranked",
      }),
    );

    expect(request).toEqual({
      kind: "query",
      query: "api",
      type: "all",
      sort: "relevance",
    });
  });
});
