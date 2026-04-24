import { test, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "fs";
import os from "os";
import path from "path";

import { ArticleCategoryFolderDirectory } from "./ArticleCategoryFolderDirectory";

class TempDirectoryBuilder {
  private readonly root: string;

  constructor() {
    this.root = mkdtempSync(path.join(os.tmpdir(), "pbk-categories-"));
  }

  addCategory(
    slug: string,
    options: { frontmatter?: string; withIndex?: boolean } = {},
  ) {
    const { frontmatter = "type: hub\ndraft: false", withIndex = true } =
      options;
    const directory = path.join(this.root, slug);
    mkdirSync(directory, { recursive: true });
    if (withIndex) {
      writeFileSync(
        path.join(directory, "index.md"),
        `---\n${frontmatter}\n---\n`,
        "utf8",
      );
    }
    return this;
  }

  build() {
    return this.root;
  }
}

test("ArticleCategoryFolderDirectory lists only published hub category slugs", () => {
  const basePath = new TempDirectoryBuilder()
    .addCategory("beta")
    .addCategory("alpha")
    .addCategory("draft-hub", { frontmatter: "type: hub\ndraft: true" })
    .addCategory("article", { frontmatter: "type: article\ndraft: false" })
    .addCategory("_private")
    .addCategory(".hidden")
    .addCategory("no-index", { withIndex: false })
    .build();

  const directory = new ArticleCategoryFolderDirectory(basePath);
  expect(directory.listSlugs()).toEqual(["alpha", "beta"]);
});
