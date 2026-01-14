import { test, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const FRONTMATTER_PATTERN = /^---\s*[\r\n]/;

class MarkdownFileCollector {
  constructor(private readonly contentRoot: string) {}

  async collect(): Promise<string[]> {
    return this.collectUnder(this.contentRoot);
  }

  private async collectUnder(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        if (entry.name.startsWith(".")) {
          return [];
        }
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          return this.collectUnder(entryPath);
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
}

class FrontmatterParseReport {
  private readonly failures: { file: string; error: string }[] = [];

  addFailure(file: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    this.failures.push({ file, error: message });
  }

  assertNoFailures() {
    if (this.failures.length === 0) {
      return;
    }
    const firstTen = this.failures.slice(0, 10);
    const summary = firstTen
      .map(({ file, error }) => `- ${file}\n  ↳ ${error}`)
      .join("\n");
    const remainder =
      this.failures.length > firstTen.length
        ? `\n...and ${this.failures.length - firstTen.length} more`
        : "";

    throw new Error(`Invalid YAML front matter detected:\n${summary}${remainder}`);
  }
}

class FrontmatterValidator {
  constructor(
    private readonly collector: MarkdownFileCollector,
    private readonly projectRoot: string,
  ) {}

  async validateAll(): Promise<void> {
    const report = new FrontmatterParseReport();
    const files = await this.collector.collect();

    await Promise.all(
      files.map(async (filePath) => {
        const raw = await fs.readFile(filePath, "utf8");
        if (!FRONTMATTER_PATTERN.test(raw)) {
          return;
        }
        try {
          matter(raw);
        } catch (error) {
          report.addFailure(path.relative(this.projectRoot, filePath), error);
        }
      }),
    );

    report.assertNoFailures();
  }
}

test(
  "content markdown files have parseable YAML front matter",
  async () => {
    const projectRoot = process.cwd();
    const contentRoot = path.join(projectRoot, "content");
    const collector = new MarkdownFileCollector(contentRoot);
    const validator = new FrontmatterValidator(collector, projectRoot);
    await validator.validateAll();
    expect(true).toBe(true);
  },
  60_000,
);

