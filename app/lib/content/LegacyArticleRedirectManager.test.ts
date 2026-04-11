import { describe, expect, it } from "vitest";

import { LegacyArticleRedirectManager } from "./LegacyArticleRedirectManager";
import type { ContentSummary } from "./repositories";

class StubSummariesProvider {
  constructor(private readonly summaries: ContentSummary[]) {}

  listSummaries(): ContentSummary[] {
    return this.summaries.map((summary) => ({ ...summary }));
  }
}

class StubRouteProvider {
  constructor(private readonly paths: string[]) {}

  listRoutes(): Array<{ path: string }> {
    return this.paths.map((path) => ({ path }));
  }
}

describe("LegacyArticleRedirectManager", () => {
  it("resolves a unique bare article slug to the canonical article path", () => {
    const manager = new LegacyArticleRedirectManager(
      new StubSummariesProvider([
        {
          slug: "najlepsze-cms-no-code-seo",
          title: "Najlepsze CMS",
          path: "/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/",
          draft: false,
        },
      ]),
      new StubRouteProvider([
        "/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/",
      ]),
    );

    expect(manager.resolve(["najlepsze-cms-no-code-seo"])).toBe(
      "/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/",
    );
  });

  it("resolves category-scoped and category-alias article slugs", () => {
    const canonicalPath =
      "/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/";
    const manager = new LegacyArticleRedirectManager(
      new StubSummariesProvider([
        {
          slug: "najlepsze-cms-no-code-seo",
          title: "Najlepsze CMS",
          path: canonicalPath,
          draft: false,
        },
      ]),
      new StubRouteProvider([canonicalPath]),
    );

    expect(
      manager.resolve([
        "artykuly",
        "cms-bez-kodu",
        "najlepsze-cms-no-code-seo",
      ]),
    ).toBe(canonicalPath);
    expect(manager.resolve(["cms", "najlepsze-cms-no-code-seo"])).toBe(
      canonicalPath,
    );
  });

  it("does not reinterpret canonical article paths as legacy aliases", () => {
    const canonicalPath =
      "/artykuly/cms-bez-kodu/najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage/";
    const manager = new LegacyArticleRedirectManager(
      new StubSummariesProvider([
        {
          slug: "najlepsze-cms-no-code-seo",
          title: "Najlepsze CMS",
          path: canonicalPath,
          draft: false,
        },
      ]),
      new StubRouteProvider([canonicalPath]),
    );

    expect(
      manager.resolve([
        "artykuly",
        "cms-bez-kodu",
        "najlepsze-no-code-cms-pod-seo-na-co-zwrocic-uwage",
      ]),
    ).toBeNull();
  });

  it("returns null for ambiguous bare slugs", () => {
    const manager = new LegacyArticleRedirectManager(
      new StubSummariesProvider([
        {
          slug: "wspolny-slug",
          title: "Pierwszy",
          path: "/artykuly/seo/pierwszy-kanoniczny/",
          draft: false,
        },
        {
          slug: "wspolny-slug",
          title: "Drugi",
          path: "/artykuly/analityka/drugi-kanoniczny/",
          draft: false,
        },
      ]),
      new StubRouteProvider([
        "/artykuly/seo/pierwszy-kanoniczny/",
        "/artykuly/analityka/drugi-kanoniczny/",
      ]),
    );

    expect(manager.resolve(["wspolny-slug"])).toBeNull();
    expect(
      manager.resolve(["artykuly", "seo", "wspolny-slug"]),
    ).toBe("/artykuly/seo/pierwszy-kanoniczny/");
    expect(manager.resolve(["artykuly", "analityka", "wspolny-slug"])).toBe(
      "/artykuly/analityka/drugi-kanoniczny/",
    );
  });

  it("returns null when a generated alias collides with an existing canonical route", () => {
    const manager = new LegacyArticleRedirectManager(
      new StubSummariesProvider([
        {
          slug: "kontakt",
          title: "Kontakt article",
          path: "/artykuly/cms-bez-kodu/kontakt-artykul/",
          draft: false,
        },
      ]),
      new StubRouteProvider([
        "/kontakt/",
        "/artykuly/cms-bez-kodu/kontakt-artykul/",
      ]),
    );

    expect(manager.resolve(["kontakt"])).toBeNull();
  });
});
