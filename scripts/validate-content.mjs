#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { pathToFileURL } from "url";

const IGNORED_DIRECTORIES = new Set([".git", "node_modules"]);
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
const PLACEHOLDER_SLUG_PATTERN = /^index\d*$/i;
const MARKDOWN_INFO_FENCE_PATTERN = /```markdown\b/i;

export function runContentValidation({
  projectRoot = process.cwd(),
  strictMode = false,
} = {}) {
  const contentRoot = path.join(projectRoot, "content");
  if (!fs.existsSync(contentRoot)) {
    return {
      errors: [
        {
          file: "content",
          message: "Missing content/ directory – aborting.",
        },
      ],
      warnings: [],
      filesScanned: 0,
      summaryMessage: "",
    };
  }

  const errors = [];
  const warnings = [];
  let filesScanned = 0;
  const derivedPathIndex = new Map();
  const publishedMarkdownCache = new Map();

  walkDirectory(contentRoot);

  const summaryMessage =
    warnings.length === 0
      ? `[content:lint] Validated ${filesScanned} markdown file(s) – no front matter issues found.`
      : `[content:lint] Validated ${filesScanned} markdown file(s) – ${warnings.length} warning(s) reported.`;

  return {
    errors,
    warnings,
    filesScanned,
    summaryMessage,
  };

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
      validateMarkdownInfoFence(file, filePath);
      const parsed = matter(file);
      filesScanned += 1;
      applyFrontmatterRules(parsed.data ?? {}, filePath);
    } catch (error) {
      errors.push({
        file: path.relative(projectRoot, filePath),
        message: error.message,
      });
    }
  }

  function applyFrontmatterRules(frontmatter, filePath) {
    const relativePath = path.relative(contentRoot, filePath);
    const [segment] = relativePath.split(path.sep);
    if (!segment || !ARTICLE_EXPERIENCE_SEGMENTS.has(segment)) {
      return;
    }

    if (segment === "artykuly") {
      validateArtykulyCanonicalPath(frontmatter, filePath);
      validateArticleIndexContracts(frontmatter, filePath);
      validateArticleSlug(frontmatter, filePath);
    }

    if (isDraft(frontmatter) && !strictMode) {
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

  function validateArticleIndexContracts(frontmatter, filePath) {
    if (path.basename(filePath) !== "index.md") {
      return;
    }
    if (isDraft(frontmatter)) {
      return;
    }

    const relativeSegments = path
      .relative(contentRoot, filePath)
      .split(path.sep)
      .filter(Boolean);
    if (relativeSegments[0] !== "artykuly") {
      return;
    }

    if (relativeSegments.length === 3) {
      const category = relativeSegments[1];
      validateArticleHubFrontmatter(
        frontmatter,
        filePath,
        `/artykuly/${category}/`,
        "Category root pages",
      );
      return;
    }

    if (relativeSegments.length !== 4) {
      return;
    }

    const [, category, subcategory] = relativeSegments;
    const directory = path.dirname(filePath);
    if (!hasPublishedMarkdownDescendants(directory, filePath)) {
      return;
    }
    validateArticleHubFrontmatter(
      frontmatter,
      filePath,
      `/artykuly/${category}/${subcategory}/`,
      "Subcategory hub pages",
    );
  }

  function validateArtykulyCanonicalPath(frontmatter, filePath) {
    if (isDraft(frontmatter)) {
      return;
    }
    const normalizedPath = deriveNormalizedPath(frontmatter, filePath);
    if (!normalizedPath) {
      return;
    }
    if (normalizedPath.startsWith("/artykuly/")) {
      const relativeSegments = path
        .relative(contentRoot, filePath)
        .split(path.sep)
        .filter(Boolean);
      const category = relativeSegments[1];
      const categoryPrefix = `/artykuly/${category}/`;
      if (normalizedPath.startsWith(categoryPrefix)) {
        return;
      }
      registerError(
        filePath,
        `Published markdown under content/artykuly/${category} must stay under ${categoryPrefix} (found ${normalizedPath}).`,
      );
      return;
    }
    registerError(
      filePath,
      `Published markdown under content/artykuly must use a canonical path under /artykuly/ (found ${normalizedPath}).`,
    );
  }

  function validateArticleSlug(frontmatter, filePath) {
    if (typeof frontmatter?.slug !== "string") {
      return;
    }

    const slug = frontmatter.slug.trim();
    if (!slug || !PLACEHOLDER_SLUG_PATTERN.test(slug)) {
      return;
    }

    registerError(
      filePath,
      `Markdown under content/artykuly must use a descriptive slug instead of placeholder value "${slug}".`,
    );
  }

  function validateMarkdownInfoFence(fileContents, filePath) {
    if (!MARKDOWN_INFO_FENCE_PATTERN.test(fileContents)) {
      return;
    }

    registerError(
      filePath,
      "Do not use ```markdown fenced blocks in content markdown. Remove the markdown info string or use a real code language.",
    );
  }

  function hasPublishedMarkdownDescendants(directory, currentIndexPath) {
    const cached = publishedMarkdownCache.get(directory);
    if (typeof cached === "boolean") {
      return cached;
    }

    const stack = [directory];
    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) {
        continue;
      }
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          if (!entry.name.startsWith(".") && !entry.name.startsWith("_")) {
            stack.push(entryPath);
          }
          continue;
        }
        if (!entry.isFile() || !entry.name.endsWith(".md")) {
          continue;
        }
        if (entryPath === currentIndexPath) {
          continue;
        }
        const parsed = readFrontmatter(entryPath, currentIndexPath);
        if (parsed && !isDraft(parsed)) {
          publishedMarkdownCache.set(directory, true);
          return true;
        }
      }
    }

    publishedMarkdownCache.set(directory, false);
    return false;
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
      file: path.relative(projectRoot, filePath),
      message,
    });
  }

  function registerError(filePath, message) {
    errors.push({
      file: path.relative(projectRoot, filePath),
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
    const relativeFile = path.relative(projectRoot, filePath);
    const existing = derivedPathIndex.get(derivedPath);
    if (existing && existing !== relativeFile) {
      registerError(
        filePath,
        `Derived route path collision for ${derivedPath} (also used by ${existing}). Ensure each markdown page has a unique path.`,
      );
      return;
    }
    derivedPathIndex.set(derivedPath, relativeFile);

    validateArticleHubHierarchy(derivedPath, filePath);
  }

  function deriveNormalizedPath(frontmatter, filePath) {
    const explicit = normalizeFrontmatterPath(frontmatter?.path);
    const sourcePath = path
      .relative(projectRoot, filePath)
      .split(path.sep)
      .join("/");
    const derived = explicit ?? derivePathFromSource(sourcePath);
    if (!derived) {
      return null;
    }
    return derived;
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

  function ensureWrappedSlashes(value) {
    const withLeading = value.startsWith("/") ? value : `/${value}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }

  function validateArticleHubHierarchy(derivedPath, filePath) {
    if (!derivedPath.startsWith("/artykuly/")) {
      return;
    }
    const segments = derivedPath.split("/").filter(Boolean);
    if (segments.length < 3) {
      return;
    }

    const category = segments[1];
    const categoryIndex = path.join(contentRoot, "artykuly", category, "index.md");
    if (!fs.existsSync(categoryIndex)) {
      registerWarning(
        filePath,
        `Missing hub page for /artykuly/${category}/ (expected ${path.relative(projectRoot, categoryIndex)}).`,
      );
    } else {
      const parsed = readFrontmatter(categoryIndex, filePath);
      if (parsed) {
        validateArticleHubFrontmatter(
          parsed,
          categoryIndex,
          `/artykuly/${category}/`,
          "Category root pages",
          filePath,
        );
      }
    }

    if (segments.length < 4) {
      return;
    }
    const subcategory = segments[2];
    const subcategoryIndex = path.join(
      contentRoot,
      "artykuly",
      category,
      subcategory,
      "index.md",
    );
    if (!fs.existsSync(subcategoryIndex)) {
      registerWarning(
        filePath,
        `Missing hub page for /artykuly/${category}/${subcategory}/ (expected ${path.relative(projectRoot, subcategoryIndex)}).`,
      );
      return;
    }

    const parsed = readFrontmatter(subcategoryIndex, filePath);
    if (parsed) {
      validateArticleHubFrontmatter(
        parsed,
        subcategoryIndex,
        `/artykuly/${category}/${subcategory}/`,
        "Subcategory hub pages",
        filePath,
      );
    }
  }

  function validateArticleHubFrontmatter(
    frontmatter,
    indexPath,
    expectedPath,
    contextLabel,
    reporterPath = indexPath,
  ) {
    if (isDraft(frontmatter)) {
      registerError(
        reporterPath,
        `${contextLabel} at ${path.relative(projectRoot, indexPath)} is marked as draft, but published pages depend on ${expectedPath}.`,
      );
      return;
    }
    const type =
      typeof frontmatter?.type === "string" ? frontmatter.type.trim().toLowerCase() : "";
    if (type !== "hub") {
      registerError(
        reporterPath,
        `${contextLabel} at ${path.relative(projectRoot, indexPath)} must define front matter type: hub for routing (${expectedPath}).`,
      );
    }

    const normalizedPath = normalizeFrontmatterPath(frontmatter?.path);
    if (normalizedPath !== expectedPath) {
      registerError(
        reporterPath,
        `${contextLabel} at ${path.relative(projectRoot, indexPath)} must use canonical path ${expectedPath} (found ${normalizedPath ?? "missing"}).`,
      );
    }
  }

  function readFrontmatter(indexPath, reporterPath) {
    try {
      const file = fs.readFileSync(indexPath, "utf8");
      const parsed = matter(file);
      return parsed.data ?? {};
    } catch (error) {
      registerError(
        reporterPath,
        `Failed to read hub page front matter at ${path.relative(projectRoot, indexPath)}: ${error.message}`,
      );
      return null;
    }
  }
}

function printResults(result, strictMode) {
  if (result.errors.length > 0) {
    console.error(
      `[content:lint] Found ${result.errors.length} markdown file(s) with invalid front matter:\n`,
    );
    result.errors.forEach(({ file, message }) => {
      console.error(`- ${file}\n  ↳ ${message}\n`);
    });
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn(
      `[content:lint] Front matter warnings (${result.warnings.length}):\n`,
    );
    result.warnings.forEach(({ file, message }) => {
      console.warn(`- ${file}\n  ↳ ${message}\n`);
    });
    if (strictMode) {
      process.exit(1);
    }
  }

  console.log(result.summaryMessage);
}

const isCliInvocation =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliInvocation) {
  const strictMode =
    process.argv.includes("--strict") ||
    process.env.CONTENT_LINT_STRICT === "true";
  const result = runContentValidation({
    projectRoot: process.cwd(),
    strictMode,
  });
  if (
    result.errors.length === 1 &&
    result.errors[0]?.file === "content" &&
    result.errors[0]?.message === "Missing content/ directory – aborting."
  ) {
    console.error("[content:lint] Missing content/ directory – aborting.");
    process.exit(1);
  }
  printResults(result, strictMode);
}
