import path from "path";

import { ArticleCategoryDirectory } from "./articleCategoryDirectory";

export class ArticleCategoryFolderDirectory {
  private readonly basePath: string;

  constructor(basePath = path.join(process.cwd(), "content", "artykuly")) {
    this.basePath = basePath;
  }

  listSlugs(): string[] {
    return new ArticleCategoryDirectory(this.basePath)
      .listCategories()
      .map((category) => category.slug);
  }
}
