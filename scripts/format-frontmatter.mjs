#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const FRONTMATTER_PATTERN = /^---\s*[\r\n]/;

async function main() {
  const files = await collectMarkdownFiles(CONTENT_ROOT);
  let updatedCount = 0;
  const failedFiles = [];

  for (const filePath of files) {
    const result = await formatFrontmatter(filePath);
    if (result === "updated") {
      updatedCount += 1;
    }
    if (result === "failed") {
      failedFiles.push(filePath);
    }
  }

  const relativeRoot = path.relative(process.cwd(), CONTENT_ROOT) || ".";
  console.log(
    `[content:format] Checked ${files.length} markdown file(s) under ${relativeRoot}.`,
  );
  console.log(
    `[content:format] ${updatedCount} file(s) updated with normalized front matter.`,
  );

  if (failedFiles.length > 0) {
    console.error(
      "[content:format] Unable to parse front matter in the file(s) below. Please fix the YAML indentation or duplicated keys manually:",
    );
    failedFiles.forEach((file) => {
      console.error(`  - ${path.relative(process.cwd(), file)}`);
    });
    process.exitCode = 1;
  }
}

async function collectMarkdownFiles(startDir) {
  const entries = await fs.readdir(startDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      if (entry.name.startsWith(".")) {
        return [];
      }
      const entryPath = path.join(startDir, entry.name);
      if (entry.isDirectory()) {
        return collectMarkdownFiles(entryPath);
      }
      if (!entry.isFile()) {
        return [];
      }
      if (!entry.name.endsWith(".md")) {
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

async function formatFrontmatter(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  if (!FRONTMATTER_PATTERN.test(raw)) {
    return "skipped";
  }

  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    console.error(`[content:format] Failed to parse ${filePath}:`);
    console.error(error.message);
    return "failed";
  }
  if (!parsed.data || typeof parsed.data !== "object") {
    return "skipped";
  }

  const normalizedBody = parsed.content.replace(/^\s+/, "").trimEnd();
  const serializedFrontmatter = yaml.dump(parsed.data, {
    lineWidth: 0,
    noRefs: true,
  });
  const nextContent = `---\n${serializedFrontmatter.trimEnd()}\n---\n\n${normalizedBody}\n`;

  if (raw === nextContent) {
    return "skipped";
  }

  await fs.writeFile(filePath, nextContent);
  return "updated";
}

main().catch((error) => {
  console.error("[content:format] Failed to normalize front matter.");
  console.error(error);
  process.exitCode = 1;
});
