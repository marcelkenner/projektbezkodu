#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

class MarketingMetaRuleSet {
  static ARTICLE_EXPERIENCE_SEGMENTS = new Set([
    "artykuly",
    "narzedzia",
    "porownania",
    "poradniki",
    "przypadki-uzycia",
    "zasoby",
    "szablony",
  ]);

  static MARKETING_META_TEMPLATES = new Set([
    "article",
    "comparison",
    "resource",
    "tutorial",
    "template",
  ]);

  isDraft(frontmatter) {
    const value = frontmatter?.draft;
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return false;
  }

  isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  normalizeSummaryBullet(value) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return undefined;
    }
    const entries = Object.entries(value);
    if (entries.length !== 1) {
      return undefined;
    }
    const [key, rawValue] = entries[0];
    const valueString =
      typeof rawValue === "string"
        ? rawValue
        : rawValue == null
          ? ""
          : String(rawValue);
    const combined = valueString ? `${key}: ${valueString}` : key;
    const trimmed = combined.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  ensureWrappedSlashes(value) {
    const withLeading = value.startsWith("/") ? value : `/${value}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }

  derivePathFromSource(sourcePath) {
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
    return this.ensureWrappedSlashes(segments.join("/"));
  }
}

class MarketingMetaDefaults {
  static forTemplate(template) {
    switch (template) {
      case "comparison":
        return [
          "Werdykt: szybkie porównanie kluczowych różnic.",
          "Dla kogo: osoby wybierające narzędzie pod konkretny scenariusz.",
          "Start: sprawdź tabelę i rekomendację na końcu.",
        ];
      case "tutorial":
        return [
          "Zbudujesz: praktyczny proces krok po kroku.",
          "Nauczysz się: konfiguracji, testów i wdrożenia.",
          "Start: zacznij od sekcji „Jak zacząć”.",
        ];
      case "resource":
        return [
          "Zawiera: kuratowane linki i materiały w jednym miejscu.",
          "Dla kogo: osoby szukające sprawdzonych zasobów.",
          "Start: pobierz plik i wybierz 1–2 pozycje na początek.",
        ];
      default:
        return [
          "Werdykt: najważniejsze punkty w pigułce.",
          "Dla kogo: kiedy to ma sens.",
          "Start: co zrobić jako pierwsze.",
        ];
    }
  }

  static labelForTemplate(template) {
    switch (template) {
      case "comparison":
        return "Zobacz porównanie";
      case "tutorial":
        return "Przejdź do poradnika";
      case "resource":
        return "Pobierz zasób";
      default:
        return "Czytaj dalej";
    }
  }
}

class MarketingMetaFixer {
  constructor({ ruleSet, projectRoot, contentRoot }) {
    this.ruleSet = ruleSet;
    this.projectRoot = projectRoot;
    this.contentRoot = contentRoot;
  }

  shouldProcess(frontmatter, filePath) {
    if (!frontmatter || typeof frontmatter !== "object") {
      return false;
    }
    if (this.ruleSet.isDraft(frontmatter)) {
      return false;
    }
    const template =
      typeof frontmatter.template === "string" ? frontmatter.template : "";
    if (!MarketingMetaRuleSet.MARKETING_META_TEMPLATES.has(template)) {
      return false;
    }
    const relativeToContent = path.relative(this.contentRoot, filePath);
    const [segment] = relativeToContent.split(path.sep);
    return Boolean(segment && MarketingMetaRuleSet.ARTICLE_EXPERIENCE_SEGMENTS.has(segment));
  }

  ensureSummaryBullets(frontmatter) {
    const template =
      typeof frontmatter.template === "string" ? frontmatter.template : "";
    const defaults = MarketingMetaDefaults.forTemplate(template);
    frontmatter.meta ??= {};

    const raw = frontmatter.meta.summaryBullets;
    const normalized = Array.isArray(raw)
      ? raw
          .map((value) => this.ruleSet.normalizeSummaryBullet(value))
          .filter((value) => Boolean(value))
      : [];

    const unique = Array.from(new Set(normalized));
    const needed = Math.max(0, 3 - unique.length);
    if (needed === 0) {
      frontmatter.meta.summaryBullets = unique;
      return false;
    }

    const next = [...unique];
    for (const suggestion of defaults) {
      if (next.length >= 3) {
        break;
      }
      if (!next.includes(suggestion)) {
        next.push(suggestion);
      }
    }

    while (next.length < 3) {
      next.push(`Start: ${MarketingMetaDefaults.labelForTemplate(template)}.`);
    }

    frontmatter.meta.summaryBullets = next;
    return true;
  }

  ensurePrimaryCta(frontmatter, markdownBody, filePath) {
    frontmatter.meta ??= {};
    const existing = frontmatter.meta.primaryCta;
    if (
      existing &&
      this.ruleSet.isNonEmptyString(existing.label) &&
      this.ruleSet.isNonEmptyString(existing.href)
    ) {
      return false;
    }

    const template =
      typeof frontmatter.template === "string" ? frontmatter.template : "";
    const metaDownloadHref = frontmatter.meta?.downloadHref;
    const heroPrimaryCta = frontmatter.hero?.primaryCta;
    const fallbackPath =
      typeof frontmatter.path === "string"
        ? this.ruleSet.ensureWrappedSlashes(frontmatter.path.trim())
        : this.ruleSet.derivePathFromSource(
            path
              .relative(this.projectRoot, filePath)
              .split(path.sep)
              .join("/"),
          ) ?? "/";

    const downloadHref =
      typeof metaDownloadHref === "string" && metaDownloadHref.trim()
        ? metaDownloadHref.trim()
        : null;
    const heroHref =
      heroPrimaryCta && this.ruleSet.isNonEmptyString(heroPrimaryCta.href)
        ? heroPrimaryCta.href.trim()
        : null;
    const heroLabel =
      heroPrimaryCta && this.ruleSet.isNonEmptyString(heroPrimaryCta.label)
        ? heroPrimaryCta.label.trim()
        : null;

    const href = downloadHref ?? heroHref ?? fallbackPath;

    const label =
      downloadHref && template === "resource"
        ? MarketingMetaDefaults.labelForTemplate(template)
        : heroLabel ?? MarketingMetaDefaults.labelForTemplate(template);

    frontmatter.meta.primaryCta = {
      label,
      href,
    };
    return true;
  }
}

class MarkdownDirectoryWalker {
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
}

class MarkdownFrontmatterWriter {
  write(parsed) {
    const normalizedBody = parsed.content.replace(/^\s+/, "").trimEnd();
    const serializedFrontmatter = yaml.dump(parsed.data, {
      lineWidth: 0,
      noRefs: true,
    });
    return `---\n${serializedFrontmatter.trimEnd()}\n---\n\n${normalizedBody}\n`;
  }
}

export async function runFixMarketingMeta({
  projectRoot = process.cwd(),
  contentRoot = path.join(process.cwd(), "content"),
} = {}) {
  const walker = new MarkdownDirectoryWalker();
  const files = await walker.collectMarkdownFiles(contentRoot);
  const fixer = new MarketingMetaFixer({
    ruleSet: new MarketingMetaRuleSet(),
    projectRoot,
    contentRoot,
  });
  const writer = new MarkdownFrontmatterWriter();

  let updatedCount = 0;
  const touched = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    if (!fixer.shouldProcess(parsed.data, filePath)) {
      continue;
    }

    const summaryUpdated = fixer.ensureSummaryBullets(parsed.data);
    const ctaUpdated = fixer.ensurePrimaryCta(
      parsed.data,
      parsed.content,
      filePath,
    );
    if (!summaryUpdated && !ctaUpdated) {
      continue;
    }

    const nextContent = writer.write(parsed);
    if (nextContent !== raw) {
      await fs.writeFile(filePath, nextContent);
      updatedCount += 1;
      touched.push(path.relative(projectRoot, filePath));
    }
  }

  console.log(`[content:fix:marketing-meta] Updated ${updatedCount} file(s).`);
  if (touched.length) {
    touched.forEach((file) => console.log(`  - ${file}`));
  }
}

function isEntryPoint() {
  const entryPath = process.argv[1];
  if (!entryPath) {
    return false;
  }
  const currentFilePath = fileURLToPath(import.meta.url);
  return path.resolve(entryPath) === path.resolve(currentFilePath);
}

if (isEntryPoint()) {
  runFixMarketingMeta().catch((error) => {
    console.error("[content:fix:marketing-meta] Failed.");
    console.error(error);
    process.exitCode = 1;
  });
}
