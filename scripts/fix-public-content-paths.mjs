#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { pathToFileURL } from "url";

import {
  getExpectedCanonicalPath,
  isExcludedFromContentPathAudit,
  normalizePublicPath,
} from "./content-path-rules.mjs";

const FRONTMATTER_PATTERN = /^---\s*[\r\n]/;

export async function runFixPublicContentPaths({
  projectRoot = process.cwd(),
  contentRoot = path.join(projectRoot, "content"),
} = {}) {
  const fixer = new PublicContentPathFixer(contentRoot);
  await fixer.run();
  return {
    updatedCount: fixer.updatedCount,
    skippedCount: fixer.skippedCount,
    failedFiles: fixer.failedFiles.map((filePath) =>
      path.relative(projectRoot, filePath),
    ),
  };
}

class PublicContentPathFixer {
  constructor(contentRoot) {
    this.contentRoot = contentRoot;
    this.updatedCount = 0;
    this.skippedCount = 0;
    this.failedFiles = [];
  }

  async run() {
    const files = await this.collectMarkdownFiles(this.contentRoot);
    for (const filePath of files) {
      await this.processFile(filePath);
    }
    this.printSummary(files.length);
  }

  async collectMarkdownFiles(startDir) {
    const entries = await fs.readdir(startDir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        if (entry.name.startsWith(".")) {
          return [];
        }

        const entryPath = path.join(startDir, entry.name);
        if (entry.isDirectory()) {
          const relativeEntryPath = path.relative(this.contentRoot, entryPath);
          if (isExcludedFromContentPathAudit(relativeEntryPath)) {
            return [];
          }
          return this.collectMarkdownFiles(entryPath);
        }

        if (!entry.isFile() || !entry.name.endsWith(".md")) {
          return [];
        }

        if (
          entry.name.toLowerCase() === "agents.md" ||
          entry.name.endsWith(".md.bak")
        ) {
          return [];
        }

        return [entryPath];
      }),
    );

    return files.flat();
  }

  async processFile(filePath) {
    const raw = await fs.readFile(filePath, "utf8");
    if (!FRONTMATTER_PATTERN.test(raw)) {
      this.skippedCount += 1;
      return;
    }

    let parsed;
    try {
      parsed = matter(raw);
    } catch {
      this.failedFiles.push(filePath);
      return;
    }

    const relativePath = path.relative(this.contentRoot, filePath);
    const explicitPath = normalizePublicPath(parsed.data?.path);
    const expectedPath = getExpectedCanonicalPath(relativePath, parsed.data ?? {});

    if (!explicitPath || !expectedPath || explicitPath === expectedPath) {
      this.skippedCount += 1;
      return;
    }

    const nextData = { ...parsed.data, path: expectedPath };
    const nextBody = parsed.content.replace(/^\s+/, "").trimEnd();
    const serializedFrontmatter = yaml.dump(nextData, {
      lineWidth: 0,
      noRefs: true,
    });
    const nextContent = `---\n${serializedFrontmatter.trimEnd()}\n---\n\n${nextBody}\n`;

    if (nextContent === raw) {
      this.skippedCount += 1;
      return;
    }

    await fs.writeFile(filePath, nextContent, "utf8");
    this.updatedCount += 1;
  }

  printSummary(totalFiles) {
    const relativeRoot = path.relative(process.cwd(), this.contentRoot) || ".";
    console.log(
      `[fix-public-content-paths] Scanned ${totalFiles} markdown file(s) under ${relativeRoot}.`,
    );
    console.log(
      `[fix-public-content-paths] Updated path in ${this.updatedCount} file(s).`,
    );
    if (this.failedFiles.length > 0) {
      console.error(
        "[fix-public-content-paths] Failed to parse front matter for the file(s) below:",
      );
      this.failedFiles.forEach((file) => {
        console.error(`  - ${path.relative(process.cwd(), file)}`);
      });
    }
  }
}

const isCliInvocation =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliInvocation) {
  runFixPublicContentPaths().catch((error) => {
    console.error("[fix-public-content-paths] Unexpected error.");
    console.error(error);
    process.exitCode = 1;
  });
}
