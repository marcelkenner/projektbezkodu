#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const CONTENT_ROOT = path.join(process.cwd(), "content", "artykuly");
const FRONTMATTER_PATTERN = /^---\s*[\r\n]/;

class ArtykulyPathFixer {
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
          return this.collectMarkdownFiles(entryPath);
        }
        if (!entry.isFile() || !entry.name.endsWith(".md")) {
          return [];
        }
        if (entry.name.toLowerCase() === "agents.md") {
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

    const nextData = this.applyPathDefaults(parsed.data, filePath);
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

    await fs.writeFile(filePath, nextContent);
    this.updatedCount += 1;
  }

  applyPathDefaults(frontmatter, absolutePath) {
    const next = { ...frontmatter };
    const relative = path.relative(CONTENT_ROOT, absolutePath);
    const parsed = path.parse(relative);
    const segments = parsed.dir
      ? parsed.dir.split(path.sep).filter(Boolean)
      : [];
    const fallbackSlug =
      parsed.name === "index" ? (segments.at(-1) ?? "artykul") : parsed.name;
    const isCategoryIndex = parsed.name === "index" && segments.length === 1;
    const legacyCategoryPath = `/${["artykuly", ...segments].join("/")}/`;
    const normalizedLegacyPath = normalizePath(legacyCategoryPath);
    const template = typeof next.template === "string" ? next.template : "";
    const isHubIndex =
      parsed.name === "index" && template !== "article" && template !== "legal";

    next.slug = next.slug || fallbackSlug;

    if (!next.title) {
      next.title = this.formatTitleFromSlug(next.slug);
    }

    const normalizedExistingPath = normalizePath(next.path);
    const hubPath = normalizePath(legacyCategoryPath);
    const shouldRepairLegacyPath =
      parsed.name !== "index" &&
      normalizedExistingPath &&
      normalizedExistingPath === normalizedLegacyPath;

    if (isHubIndex && (!normalizedExistingPath || normalizedExistingPath !== hubPath)) {
      next.path = hubPath;
      return next;
    }

    if (!normalizedExistingPath || shouldRepairLegacyPath) {
      next.path = this.derivePath({
        isIndex: parsed.name === "index",
        isCategoryIndex,
        segments,
        title: next.title,
        fileSlug: fallbackSlug,
      });
    }

    return next;
  }

  derivePath({ isIndex, isCategoryIndex, segments, title, fileSlug }) {
    const safeSegments = Array.isArray(segments) ? segments.filter(Boolean) : [];
    const wrapped = (value) => (value.endsWith("/") ? value : `${value}/`);

    if (isCategoryIndex) {
      return wrapped(`/${["artykuly", ...safeSegments].join("/")}/`);
    }

    const titleSlug = slugify(title);
    const fallback = slugify(fileSlug);
    if (!titleSlug) {
      return wrapped(`/${["artykuly", ...safeSegments].join("/")}/`);
    }

    const last = safeSegments.at(-1);
    const leafSlug = last && titleSlug === last && fallback
      ? `${titleSlug}-${fallback}`
      : titleSlug;
    const nextSegments = isIndex
      ? [...safeSegments.slice(0, -1), leafSlug]
      : [...safeSegments, leafSlug];
    return wrapped(`/${["artykuly", ...nextSegments].join("/")}/`);
  }

  formatTitleFromSlug(value) {
    return value
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  printSummary(totalFiles) {
    const relativeRoot = path.relative(process.cwd(), this.contentRoot) || ".";
    console.log(
      `[fix-artykuly-paths] Scanned ${totalFiles} markdown file(s) under ${relativeRoot}.`,
    );
    console.log(
      `[fix-artykuly-paths] Updated path/slug/title in ${this.updatedCount} file(s).`,
    );
    if (this.failedFiles.length > 0) {
      console.error(
        "[fix-artykuly-paths] Failed to parse front matter for the file(s) below:",
      );
      this.failedFiles.forEach((file) => {
        console.error(`  - ${path.relative(process.cwd(), file)}`);
      });
    }
  }
}

async function main() {
  const fixer = new ArtykulyPathFixer(CONTENT_ROOT);
  await fixer.run();
}

main().catch((error) => {
  console.error("[fix-artykuly-paths] Unexpected error.");
  console.error(error);
  process.exitCode = 1;
});

function slugify(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePath(value) {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  const withLeading = withoutDomain.startsWith("/") ? withoutDomain : `/${withoutDomain}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}
