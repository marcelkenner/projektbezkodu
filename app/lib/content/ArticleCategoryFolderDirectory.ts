import fs from "fs";
import path from "path";

export class ArticleCategoryFolderDirectory {
  private readonly basePath: string;

  constructor(basePath = path.join(process.cwd(), "content", "artykuly")) {
    this.basePath = basePath;
  }

  listSlugs(): string[] {
    if (!fs.existsSync(this.basePath)) {
      return [];
    }

    return fs
      .readdirSync(this.basePath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && this.isBrowsableDirectory(entry.name))
      .filter((entry) => fs.existsSync(path.join(this.basePath, entry.name, "index.md")))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "pl"));
  }

  private isBrowsableDirectory(name: string): boolean {
    return !name.startsWith(".") && !name.startsWith("_");
  }
}

