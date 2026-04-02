import { describe, expect, it } from "vitest";

import { ContentSearchEngine } from "@/app/lib/search/ContentSearchEngine";
import type {
  SearchContentSource,
  SearchRequest,
} from "@/app/lib/search/SearchRequest";
import type { ContentSummary } from "@/app/lib/content/repositories";

describe("ContentSearchEngine", () => {
  it("returns an empty list for an empty request", () => {
    const engine = new ContentSearchEngine([]);

    expect(engine.search(emptyRequest())).toEqual([]);
  });

  it("ranks exact title phrase matches above description-only matches", () => {
    const engine = new ContentSearchEngine([
      createSource("article", [
        summary({
          slug: "title-match",
          title: "Webflow onboarding checklist",
          path: "/artykuly/webflow-onboarding-checklist/",
          description: "Lista startowa dla nowych projektow.",
        }),
        summary({
          slug: "description-match",
          title: "Checklista publikacji",
          path: "/artykuly/checklista-publikacji/",
          description: "Ten material omawia webflow onboarding krok po kroku.",
        }),
      ]),
    ]);

    const results = engine.search(queryRequest("webflow onboarding"));

    expect(results.map((result) => result.id)).toEqual([
      "article-title-match",
      "article-description-match",
    ]);
  });

  it("matches queries without Polish diacritics", () => {
    const engine = new ContentSearchEngine([
      createSource("article", [
        summary({
          slug: "narzedzia",
          title: "Narzędzia do automatyzacji",
          path: "/artykuly/narzedzia-do-automatyzacji/",
          description: "Porownanie zestawow narzędzi.",
        }),
      ]),
    ]);

    const results = engine.search(queryRequest("narzedzia"));

    expect(results).toHaveLength(1);
    expect(results[0]?.path).toBe("/artykuly/narzedzia-do-automatyzacji/");
  });

  it("returns resource results when resources are indexed", () => {
    const engine = new ContentSearchEngine([
      createSource("resource", [
        summary({
          slug: "wydarzenia-meetupy",
          title: "Wydarzenia i meetupy no-code",
          path: "/zasoby/wydarzenia-meetupy/",
          description: "Zestawienie meetupow i wydarzen.",
          meta: {
            format: "Katalog",
            topics: ["spolecznosc"],
          },
        }),
      ]),
    ]);

    const results = engine.search(queryRequest("meetupy"));

    expect(results).toHaveLength(1);
    expect(results[0]?.type).toBe("resource");
    expect(results[0]?.path).toBe("/zasoby/wydarzenia-meetupy/");
  });

  it("filters results by requested type", () => {
    const engine = new ContentSearchEngine([
      createSource("tutorial", [
        summary({
          slug: "tutorial-webflow",
          title: "Webflow tutorial dla poczatkujacych",
          path: "/poradniki/webflow-tutorial/",
          description: "Wprowadzenie do Webflow.",
        }),
      ]),
      createSource("article", [
        summary({
          slug: "article-webflow",
          title: "Webflow w marketingu",
          path: "/artykuly/webflow-w-marketingu/",
          description: "Kiedy warto postawic landing w Webflow.",
        }),
      ]),
    ]);

    const results = engine.search({
      kind: "query",
      query: "webflow",
      type: "tutorial",
      sort: "relevance",
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.type).toBe("tutorial");
  });

  it("sorts newer results first when sort=newest", () => {
    const engine = new ContentSearchEngine([
      createSource("tutorial", [
        summary({
          slug: "older",
          title: "Webflow onboarding dla zespolu",
          path: "/poradniki/webflow-onboarding-starszy/",
          description: "Plan wdrozenia Webflow.",
          date: "2024-01-10",
        }),
        summary({
          slug: "newer",
          title: "Webflow onboarding dla marketingu",
          path: "/poradniki/webflow-onboarding-nowszy/",
          description: "Plan wdrozenia Webflow.",
          date: "2025-03-15",
        }),
      ]),
    ]);

    const results = engine.search({
      kind: "query",
      query: "webflow onboarding",
      type: "all",
      sort: "newest",
    });

    expect(results.map((result) => result.id)).toEqual([
      "tutorial-newer",
      "tutorial-older",
    ]);
  });
});

function createSource(
  type: SearchContentSource["type"],
  summaries: ContentSummary[],
): SearchContentSource {
  return {
    type,
    repository: {
      listSummaries() {
        return summaries;
      },
    },
  };
}

function emptyRequest(): SearchRequest {
  return {
    kind: "empty",
    query: "",
    type: "all",
    sort: "relevance",
  };
}

function queryRequest(query: string): SearchRequest {
  return {
    kind: "query",
    query,
    type: "all",
    sort: "relevance",
  };
}

function summary(
  overrides: Partial<ContentSummary> & Pick<ContentSummary, "slug" | "title" | "path">,
): ContentSummary {
  return {
    slug: overrides.slug,
    title: overrides.title,
    path: overrides.path,
    description: overrides.description ?? "",
    hero: overrides.hero,
    meta: overrides.meta,
    taxonomy: overrides.taxonomy,
    draft: overrides.draft ?? false,
    date: overrides.date,
  };
}
