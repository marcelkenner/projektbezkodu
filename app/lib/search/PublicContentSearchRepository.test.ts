import { describe, expect, it } from "vitest";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { GlossaryRepository } from "@/app/lib/content/repositories";
import { PublicContentSearchRepository } from "@/app/lib/search/PublicContentSearchRepository";

describe("PublicContentSearchRepository", () => {
  it("indexes every public content route and glossary path exactly once", () => {
    const library = new ContentLibrary();
    const glossaryRepository = new GlossaryRepository();
    const repository = new PublicContentSearchRepository(
      library,
      glossaryRepository,
    );

    const documents = repository.listDocuments();
    const actualPaths = new Set(documents.map((document) => document.path));
    const expectedPaths = new Set([
      ...library.listRoutes().map((route) => route.path),
      ...glossaryRepository.listSummaries().map((summary) => summary.path),
    ]);

    expect(actualPaths).toEqual(expectedPaths);
    expect(documents).toHaveLength(actualPaths.size);
  });

  it("classifies representative public routes by search type", () => {
    const repository = new PublicContentSearchRepository();
    const documents = new Map(
      repository
        .listDocuments()
        .map((document) => [document.path, document] as const),
    );

    expect(documents.get("/artykuly/analityka/")?.type).toBe("page");
    expect(documents.get("/narzedzia/hotjar/cennik/")?.type).toBe("tool");
    expect(documents.get("/zasoby/wydarzenia-meetupy/")?.type).toBe("resource");
    expect(
      documents.get(
        "/artykuly/analityka/heatmapy-i-nagrania-sesji-hotjar-vs-microsoft-clarity-ktory-wybrac/",
      )?.type,
    ).toBe("article");
  });
});
