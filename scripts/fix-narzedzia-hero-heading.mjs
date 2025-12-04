#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const TARGET_IMAGE_SRC = "/img/article_image.jpeg";
const TARGET_IMAGE_ALT =
  "Abstrakcyjna wizualizacja danych i dashboardów na tle jeziora";
const DEFAULT_HEADING_FALLBACK = "Narzędzie – opis w przygotowaniu";
const DEFAULT_SUBHEADING =
  "Wpis roboczy w katalogu narzędzi; pełną treść dodamy przed publikacją.";
const CONTENT_ROOT = path.join(process.cwd(), "content");
const FRONTMATTER_PATTERN = /^---\s*[\r\n]/;

class NarzedziaHeroHeadingFixer {
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

    if (!this.shouldProcess(parsed.data)) {
      this.skippedCount += 1;
      return;
    }

    const nextData = this.applyHeroDefaults(parsed.data);
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

  shouldProcess(frontmatter) {
    if (!frontmatter || typeof frontmatter !== "object") {
      return false;
    }
    return (
      typeof frontmatter.path === "string" &&
      frontmatter.path.startsWith("/narzedzia/")
    );
  }

  applyHeroDefaults(frontmatter) {
    const next = { ...frontmatter };
    const hero = this.normalizeHero(next.hero);

    const heading = hero.heading || next.title || DEFAULT_HEADING_FALLBACK;

    const subheading = hero.subheading || DEFAULT_SUBHEADING;

    next.hero = {
      ...hero,
      heading,
      subheading,
      image: {
        src: TARGET_IMAGE_SRC,
        alt: TARGET_IMAGE_ALT,
      },
    };

    return next;
  }

  normalizeHero(hero) {
    if (!hero || typeof hero !== "object" || Array.isArray(hero)) {
      return {};
    }
    return hero;
  }

  printSummary(totalFiles) {
    const relativeRoot = path.relative(process.cwd(), this.contentRoot) || ".";
    console.log(
      `[fix-narzedzia-hero-heading] Scanned ${totalFiles} markdown file(s) under ${relativeRoot}.`,
    );
    console.log(
      `[fix-narzedzia-hero-heading] Updated hero heading/subheading in ${this.updatedCount} file(s).`,
    );
    if (this.failedFiles.length > 0) {
      console.error(
        "[fix-narzedzia-hero-heading] Failed to parse front matter for the file(s) below:",
      );
      this.failedFiles.forEach((file) => {
        console.error(`  - ${path.relative(process.cwd(), file)}`);
      });
    }
  }
}

async function main() {
  const fixer = new NarzedziaHeroHeadingFixer(CONTENT_ROOT);
  await fixer.run();
}

main().catch((error) => {
  console.error("[fix-narzedzia-hero-heading] Unexpected error.");
  console.error(error);
  process.exitCode = 1;
});
