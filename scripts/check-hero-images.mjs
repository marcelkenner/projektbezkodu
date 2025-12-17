#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECT_ROOT = process.cwd();
const CONTENT_DIR = path.join(PROJECT_ROOT, "content");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const IGNORED_DIRECTORIES = new Set([".git", "node_modules"]);

const BROKEN_SUFFIXES = [".webp.jpeg", ".webp.webp"];
const BROKEN_PATHS = new Set(["/img/article_image.jpeg"]);

const DEFAULT_HERO_BY_KIND = {
  article: "/img/articles_hero_image.webp",
  tutorial: "/img/tutorials_hero_image.webp",
  comparison: "/img/comparisons_hero_image.webp",
  template: "/img/templates_hero_image.webp",
  tool: "/img/tools_hero_image.webp",
};

const warnOnly =
  process.argv.includes("--warn-only") ||
  process.env.CONTENT_HERO_IMAGES_WARN_ONLY === "true";

if (!fs.existsSync(CONTENT_DIR)) {
  console.error("[content:hero:check] Missing content/ directory – aborting.");
  process.exit(1);
}

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error("[content:hero:check] Missing public/ directory – aborting.");
  process.exit(1);
}

const issues = [];
let filesScanned = 0;
walkDirectory(CONTENT_DIR);

if (issues.length === 0) {
  console.log(
    `[content:hero:check] Checked ${filesScanned} markdown file(s) – no resolved hero image issues found.`,
  );
  process.exit(0);
}

console.warn(
  `[content:hero:check] Checked ${filesScanned} markdown file(s) – ${issues.length} issue(s) found.\n`,
);
issues.slice(0, 200).forEach(({ file, message }) => {
  console.warn(`- ${file}\n  ↳ ${message}`);
});
if (issues.length > 200) {
  console.warn(`...and ${issues.length - 200} more`);
}
console.warn("");

process.exitCode = warnOnly ? 0 : 1;

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

    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    if (entry.name.toLowerCase() === "agents.md") {
      continue;
    }

    validateMarkdown(entryPath);
  }
}

function validateMarkdown(filePath) {
  let parsed;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    parsed = matter(raw);
  } catch (error) {
    issues.push({
      file: path.relative(PROJECT_ROOT, filePath),
      message: `Unable to parse markdown/front matter: ${error.message}`,
    });
    return;
  }

  filesScanned += 1;
  const frontmatter = parsed.data ?? {};
  const documentPath = resolveDocumentPath(filePath, frontmatter);
  const heroSrc = normalizeSrc(frontmatter?.hero?.image?.src);
  const metaSrc = normalizeSrc(frontmatter?.meta?.heroImageSrc);
  const resolved = resolveResolvedHeroSrc({ documentPath, heroSrc, metaSrc });

  const relativeFile = path.relative(PROJECT_ROOT, filePath);
  if (isRemoteSrc(resolved.src)) {
    issues.push({
      file: relativeFile,
      message: `resolved(${resolved.source}): remote URL (not allowed by next/image without config): ${resolved.src}`,
    });
    return;
  }

  if (!resolved.src.startsWith("/")) {
    issues.push({
      file: relativeFile,
      message: `resolved(${resolved.source}): invalid (expected leading "/"): ${resolved.src}`,
    });
    return;
  }

  const publicPath = path.join(PUBLIC_DIR, resolved.src.replace(/^\//, ""));
  if (!fs.existsSync(publicPath)) {
    issues.push({
      file: relativeFile,
      message: `resolved(${resolved.source}): missing ${path.relative(PROJECT_ROOT, publicPath)}`,
    });
  }
}

function resolveResolvedHeroSrc({ documentPath, heroSrc, metaSrc }) {
  if (heroSrc && !isBrokenSrc(heroSrc)) {
    return { src: heroSrc, source: "hero" };
  }
  if (metaSrc && !isBrokenSrc(metaSrc)) {
    return { src: metaSrc, source: "meta" };
  }
  const kind = heroKindFromPath(documentPath);
  return {
    src: DEFAULT_HERO_BY_KIND[kind] ?? DEFAULT_HERO_BY_KIND.article,
    source: "fallback",
  };
}

function resolveDocumentPath(filePath, frontmatter) {
  const frontmatterPath = normalizePath(frontmatter?.path);
  if (frontmatterPath) {
    return frontmatterPath;
  }

  const normalized = filePath.replace(/\\/g, "/");
  const contentIndex = normalized.lastIndexOf("/content/");
  if (contentIndex === -1) {
    return undefined;
  }

  const relativeToContent = normalized.slice(contentIndex + "/content/".length);
  const parsed = path.posix.parse(relativeToContent);
  const segments = parsed.dir.split("/").filter(Boolean);

  if (parsed.name === "index" && segments.at(-1) === "glowny") {
    segments.pop();
  }
  if (parsed.name !== "index") {
    segments.push(parsed.name);
  }
  if (!segments.length) {
    return undefined;
  }
  return ensureWrappedSlashes(segments.join("/"));
}

function heroKindFromPath(documentPath) {
  if (!documentPath) return "article";
  if (documentPath.startsWith("/poradniki/")) return "tutorial";
  if (documentPath.startsWith("/porownania/")) return "comparison";
  if (documentPath.startsWith("/szablony/")) return "template";
  if (documentPath.startsWith("/narzedzia/")) return "tool";
  return "article";
}

function normalizeSrc(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function normalizePath(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? ensureWrappedSlashes(trimmed) : undefined;
}

function ensureWrappedSlashes(value) {
  let next = value;
  if (!next.startsWith("/")) next = `/${next}`;
  if (!next.endsWith("/")) next = `${next}/`;
  return next;
}

function isRemoteSrc(src) {
  return /^https?:\/\//i.test(src);
}

function isBrokenSrc(src) {
  if (!src) return true;
  if (BROKEN_PATHS.has(src)) return true;
  return BROKEN_SUFFIXES.some((suffix) => src.endsWith(suffix));
}

