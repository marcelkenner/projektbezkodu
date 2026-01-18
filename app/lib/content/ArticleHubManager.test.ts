import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it } from "vitest";

import { ArticleHubManager, type ArticleSummariesProvider } from "./ArticleHubManager";
import type { ContentSummary } from "./repositories";

class StubSummariesProvider implements ArticleSummariesProvider {
  constructor(private readonly summaries: ContentSummary[]) {}

  listSummaries(): ContentSummary[] {
    return this.summaries.map((entry) => ({ ...entry }));
  }
}

function writeFile(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

describe("ArticleHubManager", () => {
  it("treats only type: hub index.md as a hub and exposes its markdown body", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pbk-hubs-"));
    const hubIndex = path.join(tmpDir, "category", "index.md");
    const leafIndex = path.join(tmpDir, "category", "stopka", "index.md");

    writeFile(
      hubIndex,
      [
        "---",
        'title: "Category hub"',
        "slug: category",
        "path: /artykuly/category/",
        "template: default",
        "type: hub",
        "draft: false",
        "---",
        "",
        "# Intro",
        "",
        "Hub body content.",
        "",
      ].join("\n"),
    );

    writeFile(
      leafIndex,
      [
        "---",
        'title: "Stopka"',
        "slug: stopka",
        "path: /artykuly/category/stopka/",
        "template: default",
        "type: template",
        "draft: false",
        "---",
        "",
        "# Leaf page",
        "",
        "Leaf body content.",
        "",
      ].join("\n"),
    );

    const summariesProvider = new StubSummariesProvider([
      {
        slug: "stopka",
        title: "Stopka",
        path: "/artykuly/category/stopka/",
        description: "Leaf",
        draft: false,
      },
    ]);

    const manager = new ArticleHubManager(summariesProvider, tmpDir);
    const hub = manager.getHub(["category"]);
    expect(hub).not.toBeNull();
    expect(hub?.hub.href).toBe("/artykuly/category/");
    expect(hub?.hub.body).toContain("Hub body content.");
    expect(hub?.articles.map((entry) => entry.path)).toEqual([
      "/artykuly/category/stopka/",
    ]);

    expect(manager.getHub(["category", "stopka"])).toBeNull();
  });

  it("skips invalid index.md files without throwing", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pbk-hubs-"));
    const validHubIndex = path.join(tmpDir, "valid", "index.md");
    const invalidHubIndex = path.join(tmpDir, "invalid", "index.md");

    writeFile(
      validHubIndex,
      [
        "---",
        'title: "Valid hub"',
        "slug: valid",
        "path: /artykuly/valid/",
        "template: default",
        "type: hub",
        "draft: false",
        "---",
        "",
        "Valid hub content.",
        "",
      ].join("\n"),
    );

    writeFile(invalidHubIndex, "# Missing frontmatter\n");

    const manager = new ArticleHubManager(new StubSummariesProvider([]), tmpDir);
    const hubs = manager.listHubs(2);
    expect(hubs.map((hub) => hub.href)).toEqual(["/artykuly/valid/"]);
  });
});

