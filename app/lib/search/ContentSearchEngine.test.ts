import { describe, expect, it } from "vitest";

import { ContentSearchEngine } from "@/app/lib/search/ContentSearchEngine";
import type {
  SearchDocument,
  SearchDocumentRepository,
} from "@/app/lib/search/SearchDocument";
import type { SearchRequest } from "@/app/lib/search/SearchRequest";

describe("ContentSearchEngine", () => {
  it("returns an empty list for an empty request", () => {
    const engine = new ContentSearchEngine([]);

    expect(engine.search(emptyRequest())).toEqual([]);
  });

  it("ranks exact title phrase matches above description-only matches", () => {
    const engine = new ContentSearchEngine([
      createRepository([
        document({
          title: "Webflow onboarding checklist",
          path: "/artykuly/webflow-onboarding-checklist/",
          type: "article",
          description: "Lista startowa dla nowych projektow.",
        }),
        document({
          title: "Checklista publikacji",
          path: "/artykuly/checklista-publikacji/",
          type: "article",
          description: "Ten material omawia webflow onboarding krok po kroku.",
        }),
      ]),
    ]);

    const results = engine.search(queryRequest("webflow onboarding"));

    expect(results.map((result) => result.path)).toEqual([
      "/artykuly/webflow-onboarding-checklist/",
      "/artykuly/checklista-publikacji/",
    ]);
  });

  it("matches queries without Polish diacritics", () => {
    const engine = new ContentSearchEngine([
      createRepository([
        document({
          title: "Narzędzia do automatyzacji",
          path: "/artykuly/narzedzia-do-automatyzacji/",
          type: "article",
          description: "Porownanie zestawow narzędzi.",
        }),
      ]),
    ]);

    const results = engine.search(queryRequest("narzedzia"));

    expect(results).toHaveLength(1);
    expect(results[0]?.path).toBe("/artykuly/narzedzia-do-automatyzacji/");
  });

  it("filters results by requested type", () => {
    const engine = new ContentSearchEngine([
      createRepository([
        document({
          title: "Webflow tutorial dla poczatkujacych",
          path: "/poradniki/webflow-tutorial/",
          type: "tutorial",
          description: "Wprowadzenie do Webflow.",
        }),
        document({
          title: "Webflow cennik i limity",
          path: "/narzedzia/webflow/cennik/",
          type: "tool",
          description: "Ile kosztuje Webflow.",
        }),
      ]),
    ]);

    const results = engine.search({
      kind: "query",
      query: "webflow",
      type: "tool",
      sort: "relevance",
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.type).toBe("tool");
    expect(results[0]?.path).toBe("/narzedzia/webflow/cennik/");
  });

  it("sorts newer results first when sort=newest", () => {
    const engine = new ContentSearchEngine([
      createRepository([
        document({
          title: "Webflow onboarding dla zespolu",
          path: "/poradniki/webflow-onboarding-starszy/",
          type: "tutorial",
          description: "Plan wdrozenia Webflow.",
          publishedAt: "2024-01-10",
        }),
        document({
          title: "Webflow onboarding dla marketingu",
          path: "/poradniki/webflow-onboarding-nowszy/",
          type: "tutorial",
          description: "Plan wdrozenia Webflow.",
          publishedAt: "2025-03-15",
        }),
      ]),
    ]);

    const results = engine.search({
      kind: "query",
      query: "webflow onboarding",
      type: "all",
      sort: "newest",
    });

    expect(results.map((result) => result.path)).toEqual([
      "/poradniki/webflow-onboarding-nowszy/",
      "/poradniki/webflow-onboarding-starszy/",
    ]);
  });

  it("indexes published hotjar tool pages and skips draft-only routes", () => {
    const engine = new ContentSearchEngine();

    const results = engine.search(queryRequest("hotjar"));
    const paths = results.map((result) => result.path);

    expect(paths).toContain("/narzedzia/hotjar/alternatywy/");
    expect(paths).toContain("/narzedzia/hotjar/cennik/");
    expect(paths).not.toContain("/narzedzia/hotjar/faq/");
    expect(paths).not.toContain("/narzedzia/hotjar/recenzja/");
  });
});

function createRepository(
  documents: SearchDocument[],
): SearchDocumentRepository {
  return {
    listDocuments() {
      return documents;
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

function document(
  overrides: Partial<SearchDocument> &
    Pick<SearchDocument, "title" | "path" | "type">,
): SearchDocument {
  return {
    id: overrides.id ?? `${overrides.type}:${overrides.path}`,
    title: overrides.title,
    description: overrides.description ?? "",
    excerpt: overrides.excerpt ?? overrides.description ?? "",
    path: overrides.path,
    type: overrides.type,
    keywords: overrides.keywords ?? [],
    publishedAt: overrides.publishedAt,
    readingTime: overrides.readingTime,
  };
}
