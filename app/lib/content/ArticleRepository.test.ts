import { describe, expect, it } from "vitest";

import { ArticleRepository } from "./repositories";

describe("ArticleRepository", () => {
  it("includes leaf pages under /artykuly and excludes hubs", () => {
    const repository = new ArticleRepository();
    const summaries = repository.listSummaries();

    expect(
      summaries.some(
        (entry) =>
          entry.path === "/artykuly/biblioteka-komponentow/sekcje-stopka/",
      ),
    ).toBe(true);

    expect(summaries.some((entry) => entry.path === "/artykuly/analityka/")).toBe(
      false,
    );
    expect(
      summaries.some((entry) => entry.path === "/artykuly/architektura/"),
    ).toBe(false);
    expect(
      summaries.some(
        (entry) =>
          entry.path === "/artykuly/architektura/architektura-no-code-stabilnosc/",
      ),
    ).toBe(true);
  });
});
