import { describe, expect, it } from "vitest";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";

describe("ContentLibrary title slug routing", () => {
  it("uses the frontmatter title as the last path segment even when path is explicit", () => {
    const library = new ContentLibrary();
    const routes = library.listRoutes();

    expect(routes.some((route) => route.path === "/artykuly/editorial/repurposing/")).toBe(
      false,
    );
    expect(
      routes.some(
        (route) =>
          route.path ===
          "/artykuly/editorial/recykling-tresci-jak-madrze-przerabiac-blog-na-ig-pinterest-i-shorts/",
      ),
    ).toBe(true);
  });

  it("resolves legacy segments to the canonical title-slug route", () => {
    const library = new ContentLibrary();
    const entry = library.getEntry(["artykuly", "editorial", "repurposing"]);

    expect(entry?.path).toBe(
      "/artykuly/editorial/recykling-tresci-jak-madrze-przerabiac-blog-na-ig-pinterest-i-shorts/",
    );
  });
});

