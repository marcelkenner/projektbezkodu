import { describe, expect, it } from "vitest";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";

describe("ContentLibrary title slug routing", () => {
  it("uses the explicit frontmatter path as canonical when provided", () => {
    const library = new ContentLibrary({ excludedDirectories: ["glossary"] });
    const routes = library.listRoutes();

    expect(
      routes.some(
        (route) =>
          route.path ===
          "/artykuly/editorial/recykling-tresci-jak-madrze-przerabiac-blog-na-ig-pinterest-i-shorts/",
      ),
    ).toBe(false);
    expect(
      routes.some(
        (route) =>
          route.path === "/artykuly/editorial/repurposing/",
      ),
    ).toBe(true);
  });

  it("resolves legacy title-slug segments to the canonical frontmatter path", () => {
    const library = new ContentLibrary({ excludedDirectories: ["glossary"] });
    const entry = library.getEntry([
      "artykuly",
      "editorial",
      "recykling-tresci-jak-madrze-przerabiac-blog-na-ig-pinterest-i-shorts",
    ]);

    expect(entry?.path).toBe(
      "/artykuly/editorial/repurposing/",
    );
  });
});
