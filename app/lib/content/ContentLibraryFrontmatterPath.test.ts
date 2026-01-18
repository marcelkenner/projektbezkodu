import { describe, expect, it } from "vitest";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";

describe("ContentLibrary canonical paths", () => {
  it("treats frontmatter.path as canonical and keeps title-slug paths as legacy aliases", () => {
    const library = new ContentLibrary({ excludedDirectories: ["glossary"] });
    const canonical = "/narzedzia/fixture-tool/recenzja/";
    const legacyTitleSlug = "/narzedzia/fixture-tool/fixture-tool-recenzja/";

    const routes = library.listRoutes();
    expect(routes.some((route) => route.path === canonical)).toBe(true);
    expect(routes.some((route) => route.path === legacyTitleSlug)).toBe(false);

    const direct = library.getEntry(["narzedzia", "fixture-tool", "recenzja"]);
    expect(direct?.path).toBe(canonical);

    const legacy = library.getEntry([
      "narzedzia",
      "fixture-tool",
      "fixture-tool-recenzja",
    ]);
    expect(legacy?.path).toBe(canonical);
  });
});

