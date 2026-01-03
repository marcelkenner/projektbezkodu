import { describe, expect, it } from "vitest";

import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ToolChildArticlesManager } from "@/app/lib/content/ToolChildArticlesManager";
import { TextNormalizer } from "@/app/lib/text/TextNormalizer";

describe("Tool główny routing", () => {
  it("exposes a /glowny alias route for tool main pages", () => {
    const library = new ContentLibrary();
    const routes = library.listRoutes();

    expect(
      routes.some(
        (route) => route.path === "/narzedzia/adobe-creative-cloud/glowny/",
      ),
    ).toBe(true);
    expect(
      routes.some((route) => route.path === "/narzedzia/adobe-creative-cloud/"),
    ).toBe(true);
  });

  it("lists tool child articles without looping to /narzedzia/[slug]", () => {
    const library = new ContentLibrary();
    const manager = new ToolChildArticlesManager(library);
    const cards = manager.list("adobe-creative-cloud");
    const paths = new Set(cards.map((card) => card.path));
    const routes = library.listRoutes();
    const recenzjaRoute = routes.find(
      (route) =>
        route.path.startsWith("/narzedzia/adobe-creative-cloud/") &&
        route.document.frontmatter.slug === "recenzja",
    );
    const recenzjaTitleSlug = TextNormalizer.slugify(
      recenzjaRoute?.document.frontmatter.title ?? "",
    );

    expect(paths.has("/narzedzia/adobe-creative-cloud/")).toBe(false);
    expect(paths.has("/narzedzia/adobe-creative-cloud/glowny/")).toBe(true);
    expect(recenzjaTitleSlug).not.toBe("");
    expect(
      paths.has(`/narzedzia/adobe-creative-cloud/${recenzjaTitleSlug}/`),
    ).toBe(true);
  });
});
