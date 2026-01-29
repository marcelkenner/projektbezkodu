import fs from "fs";
import path from "path";

interface AppRouteFileIndexOptions {
  projectRoot?: string;
  appDirName?: string;
  pageFileNames?: string[];
}

export class AppRouteFileIndex {
  private readonly appRoot: string;
  private readonly pageFileNames: Set<string>;

  constructor(options: AppRouteFileIndexOptions = {}) {
    const projectRoot = options.projectRoot ?? process.cwd();
    const appDirName = options.appDirName ?? "app";
    this.appRoot = path.join(projectRoot, appDirName);
    this.pageFileNames = new Set(
      options.pageFileNames ?? ["page.tsx", "page.ts", "page.jsx", "page.js"],
    );
  }

  listPageFiles(): string[] {
    if (!fs.existsSync(this.appRoot)) {
      return [];
    }
    return this.collectFromDirectory(this.appRoot);
  }

  private collectFromDirectory(currentPath: string): string[] {
    const resolved: string[] = [];
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    entries.forEach((entry) => {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        if (this.shouldSkipDirectory(entry.name)) {
          return;
        }
        resolved.push(...this.collectFromDirectory(entryPath));
        return;
      }
      if (entry.isFile() && this.pageFileNames.has(entry.name)) {
        resolved.push(entryPath);
      }
    });

    return resolved;
  }

  private shouldSkipDirectory(name: string): boolean {
    return name.startsWith(".");
  }
}
