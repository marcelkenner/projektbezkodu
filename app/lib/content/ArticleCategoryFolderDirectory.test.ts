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

  addCategory(slug: string, withIndex = true) {
    const directory = path.join(this.root, slug);
    mkdirSync(directory, { recursive: true });
    if (withIndex) {
      writeFileSync(path.join(directory, "index.md"), "---\n---\n", "utf8");
    }
    return this;
  }

  build() {
    return this.root;
  }
}

test("ArticleCategoryFolderDirectory lists category folder names with index.md", () => {
  const basePath = new TempDirectoryBuilder()
    .addCategory("beta")
    .addCategory("alpha")
    .addCategory("_private")
    .addCategory(".hidden")
    .addCategory("no-index", false)
    .build();

  const directory = new ArticleCategoryFolderDirectory(basePath);
  expect(directory.listSlugs()).toEqual(["alpha", "beta"]);
});

