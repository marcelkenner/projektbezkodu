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
const warnings = [];
let filesScanned = 0;
const isStrictMode =
  process.argv.includes("--strict") ||
  process.env.CONTENT_LINT_STRICT === "true";
const derivedPathIndex = new Map();
const ARTICLE_EXPERIENCE_SEGMENTS = new Set([
  "artykuly",
  "narzedzia",
  "porownania",
  "poradniki",
  "przypadki-uzycia",
  "zasoby",
  "szablony",
]);
const MARKETING_META_TEMPLATES = new Set([
  "article",
  "comparison",
  "resource",
  "tutorial",
  "template",
]);
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

if (warnings.length > 0) {
  console.warn(`[content:lint] Front matter warnings (${warnings.length}):\n`);
  warnings.forEach(({ file, message }) => {
    console.warn(`- ${file}\n  ↳ ${message}\n`);
  });
  if (isStrictMode) {
    process.exit(1);
  }
}

const summaryMessage =
  warnings.length === 0
    ? `[content:lint] Validated ${filesScanned} markdown file(s) – no front matter issues found.`
    : `[content:lint] Validated ${filesScanned} markdown file(s) – ${warnings.length} warning(s) reported.`;
console.log(summaryMessage);

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
    const parsed = matter(file);
    filesScanned += 1;
    applyFrontmatterRules(parsed.data ?? {}, filePath);
  } catch (error) {
    errors.push({
      file: path.relative(PROJECT_ROOT, filePath),
      message: error.message,
    });
  }
}

function applyFrontmatterRules(frontmatter, filePath) {
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const [segment] = relativePath.split(path.sep);
  if (!segment || !ARTICLE_EXPERIENCE_SEGMENTS.has(segment)) {
    return;
  }
  if (isDraft(frontmatter) && !isStrictMode) {
    return;
  }
  const template =
    typeof frontmatter?.template === "string" ? frontmatter.template : "";
  validateDerivedPath(frontmatter, filePath);
  if (isDraft(frontmatter)) {
    return;
  }
  if (!MARKETING_META_TEMPLATES.has(template)) {
    return;
  }
  validateSummaryBullets(frontmatter, filePath);
  validatePrimaryCta(frontmatter, filePath);
}

function isDraft(frontmatter) {
  const value = frontmatter?.draft;
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

function validateSummaryBullets(frontmatter, filePath) {
  const summaryBullets = frontmatter?.meta?.summaryBullets;
  if (!Array.isArray(summaryBullets)) {
    registerWarning(
      filePath,
      "Missing meta.summaryBullets (min 3 bullet points) for shared ArticleSummaryBullets component.",
    );
    return;
  }
  const meaningful = summaryBullets.filter(isNonEmptyString);
  if (meaningful.length < 3) {
    registerWarning(
      filePath,
      "meta.summaryBullets should contain at least 3 non-empty entries.",
    );
  }
}

function validatePrimaryCta(frontmatter, filePath) {
  const primaryCta = frontmatter?.meta?.primaryCta;
  if (
    !primaryCta ||
    !isNonEmptyString(primaryCta.label) ||
    !isNonEmptyString(primaryCta.href)
  ) {
    registerWarning(
      filePath,
      "meta.primaryCta.label and meta.primaryCta.href are required for CTA group rendering.",
    );
  }
}

function registerWarning(filePath, message) {
  warnings.push({
    file: path.relative(PROJECT_ROOT, filePath),
    message,
  });
}

function registerError(filePath, message) {
  errors.push({
    file: path.relative(PROJECT_ROOT, filePath),
    message,
  });
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateDerivedPath(frontmatter, filePath) {
  const derivedPath = deriveNormalizedPath(frontmatter, filePath);
  if (!derivedPath) {
    return;
  }
  const relativeFile = path.relative(PROJECT_ROOT, filePath);
  const existing = derivedPathIndex.get(derivedPath);
  if (existing && existing !== relativeFile) {
    registerError(
      filePath,
      `Derived route path collision for ${derivedPath} (also used by ${existing}). Ensure each markdown page has a unique path/title.`,
    );
    return;
  }
  derivedPathIndex.set(derivedPath, relativeFile);
}

function deriveNormalizedPath(frontmatter, filePath) {
  const explicit = normalizeFrontmatterPath(frontmatter?.path);
  const sourcePath = path
    .relative(PROJECT_ROOT, filePath)
    .split(path.sep)
    .join("/");
  const derived = explicit ?? derivePathFromSource(sourcePath);
  if (!derived) {
    return null;
  }
  const title = typeof frontmatter?.title === "string" ? frontmatter.title : "";
  return ensureTitleSlug(derived, title);
}

function normalizeFrontmatterPath(rawPath) {
  if (typeof rawPath !== "string") {
    return null;
  }
  const trimmed = rawPath.trim();
  if (!trimmed) {
    return null;
  }
  const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  return ensureWrappedSlashes(withoutDomain);
}

function derivePathFromSource(sourcePath) {
  const normalized = sourcePath.replace(/\\/g, "/");
  if (!normalized.startsWith("content/")) {
    return null;
  }
  const relative = normalized.replace(/^content\//, "");
  if (!relative) {
    return null;
  }
  const parsed = path.posix.parse(relative);
  const segments = parsed.dir.split("/").filter(Boolean);
  if (parsed.name === "index" && segments.at(-1) === "glowny") {
    segments.pop();
  }
  if (parsed.name !== "index") {
    segments.push(parsed.name);
  }
  if (!segments.length) {
    return null;
  }
  return ensureWrappedSlashes(segments.join("/"));
}

function ensureTitleSlug(normalizedPath, title) {
  const slug = slugify(title);
  if (!slug) {
    return normalizedPath;
  }
  const segments = normalizedPath.split("/").filter(Boolean);
  if (!segments.length) {
    return ensureWrappedSlashes(slug);
  }
  const nextSegments = [...segments];
  nextSegments[nextSegments.length - 1] = slug;
  return ensureWrappedSlashes(nextSegments.join("/"));
}

function ensureWrappedSlashes(value) {
  const withLeading = value.startsWith("/") ? value : `/${value}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
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
