#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { pathToFileURL } from "url";

const FRONTMATTER_PATTERN = /^---\s*[\r\n]/;

export async function runFixArtykulyPaths({
  projectRoot = process.cwd(),
  contentRoot = path.join(projectRoot, "content", "artykuly"),
} = {}) {
  const fixer = new ArtykulyPathFixer(contentRoot);
  await fixer.run();
  return {
    updatedCount: fixer.updatedCount,
    skippedCount: fixer.skippedCount,
    failedFiles: fixer.failedFiles.map((filePath) =>
      path.relative(projectRoot, filePath),
    ),
  };
}

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

    await fs.writeFile(filePath, nextContent, "utf8");
    this.updatedCount += 1;
  }

  applyPathDefaults(frontmatter, absolutePath) {
    const next = { ...frontmatter };
    const relative = path.relative(this.contentRoot, absolutePath);
    const parsed = path.parse(relative);
    const segments = parsed.dir
      ? parsed.dir.split(path.sep).filter(Boolean)
      : [];
    const fallbackSlug =
      parsed.name === "index" ? (segments.at(-1) ?? "artykul") : parsed.name;
    const normalizedExistingPath = normalizePath(next.path);
    const isHubType =
      typeof next.type === "string" && next.type.trim().toLowerCase() === "hub";
    const isIndex = parsed.name === "index";
    const isCategoryIndex = isIndex && segments.length === 1;
    const hubPath = normalizePath(`/${["artykuly", ...segments].join("/")}/`);
    const categoryPrefix = segments.length
      ? normalizePath(`/artykuly/${segments[0]}/`)
      : "";
    const hasExpectedCategoryPrefix =
      !categoryPrefix || normalizedExistingPath.startsWith(categoryPrefix);
    const shouldDeriveHubPath = isHubType && isIndex;
    const shouldNormalizeLeafPath =
      !shouldDeriveHubPath &&
      (!normalizedExistingPath ||
        !normalizedExistingPath.startsWith("/artykuly/") ||
        !hasExpectedCategoryPrefix);
    const shouldRepairLegacyPath =
      !shouldDeriveHubPath &&
      normalizedExistingPath === normalizePath(`/${["artykuly", ...segments].join("/")}/`);

    next.slug = next.slug || fallbackSlug;

    if (!next.title) {
      next.title = this.formatTitleFromSlug(next.slug);
    }

    if (shouldDeriveHubPath && normalizedExistingPath !== hubPath) {
      next.path = hubPath;
      return next;
    }

    if (isCategoryIndex && !isHubType) {
      next.path = this.deriveLeafPath({
        isIndex,
        segments,
        title: next.title,
        fileSlug: next.slug,
      });
      return next;
    }

    if (shouldNormalizeLeafPath || shouldRepairLegacyPath) {
      next.path = this.deriveLeafPath({
        isIndex,
        segments,
        title: next.title,
        fileSlug: next.slug,
      });
    }

    return next;
  }

  deriveLeafPath({ isIndex, segments, title, fileSlug }) {
    const safeSegments = Array.isArray(segments) ? segments.filter(Boolean) : [];
    const fallback = slugify(fileSlug);
    const titleSlug = slugify(title);
    const leafSlug = fallback || titleSlug;

    if (!leafSlug) {
      return normalizePath(`/${["artykuly", ...safeSegments].join("/")}/`);
    }

    const nextSegments = isIndex
      ? [...safeSegments.slice(0, -1), leafSlug]
      : [...safeSegments, leafSlug];

    return normalizePath(`/${["artykuly", ...nextSegments].join("/")}/`);
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

const isCliInvocation =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliInvocation) {
  runFixArtykulyPaths().catch((error) => {
    console.error("[fix-artykuly-paths] Unexpected error.");
    console.error(error);
    process.exitCode = 1;
  });
}
