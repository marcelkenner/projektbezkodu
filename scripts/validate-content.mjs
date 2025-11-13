#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECT_ROOT = process.cwd();
const CONTENT_DIR = path.join(PROJECT_ROOT, "content");
const IGNORED_DIRECTORIES = new Set([".git", "node_modules"]);

if (!fs.existsSync(CONTENT_DIR)) {
  console.error("[content:lint] Missing content/ directory – aborting.");
  process.exit(1);
}

const errors = [];
let filesScanned = 0;

walkDirectory(CONTENT_DIR);

if (errors.length > 0) {
  console.error(
    `[content:lint] Found ${errors.length} markdown file(s) with invalid front matter:\n`,
  );
  errors.forEach(({ file, message }) => {
    console.error(`- ${file}\n  ↳ ${message}\n`);
  });
  process.exit(1);
}

console.log(
  `[content:lint] Validated ${filesScanned} markdown file(s) – no front matter issues found.`,
);

function walkDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkDirectory(entryPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      validateMarkdown(entryPath);
    }
  }
}

function validateMarkdown(filePath) {
  try {
    const file = fs.readFileSync(filePath, "utf8");
    matter(file);
    filesScanned += 1;
  } catch (error) {
    errors.push({
      file: path.relative(PROJECT_ROOT, filePath),
      message: error.message,
    });
  }
}
