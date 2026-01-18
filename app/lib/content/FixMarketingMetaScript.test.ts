import { describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import matter from "gray-matter";

async function createTempProject() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "pbk-meta-"));
  const contentRoot = path.join(root, "content");
  await fs.mkdir(contentRoot, { recursive: true });
  return { root, contentRoot };
}

async function writeMarkdown(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents);
}

async function readFrontmatter(
  filePath: string,
): Promise<Record<string, unknown>> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  return (parsed.data ?? {}) as Record<string, unknown>;
}

describe("scripts/fix-marketing-meta.mjs", () => {
  it("fills missing meta.summaryBullets + meta.primaryCta for marketing templates", async () => {
    const { root, contentRoot } = await createTempProject();

    const comparisonPath = path.join(
      contentRoot,
      "porownania",
      "example",
      "index.md",
    );
    await writeMarkdown(
      comparisonPath,
      [
        "---",
        "title: Example comparison",
        "slug: example",
        "path: /porownania/example/",
        "draft: false",
        "template: comparison",
        "meta:",
        "  summaryBullets:",
        "    - One",
        "    - Two",
        "---",
        "",
        "# Example",
        "",
        "Content.",
        "",
      ].join("\n"),
    );

    const resourcePath = path.join(
      contentRoot,
      "zasoby",
      "example-resource",
      "index.md",
    );
    await writeMarkdown(
      resourcePath,
      [
        "---",
        "title: Example resource",
        "slug: example-resource",
        "path: /zasoby/example-resource/",
        "draft: false",
        "template: resource",
        "meta:",
        "  downloadHref: https://files.example.com/resource.zip",
        "---",
        "",
        "# Example resource",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(
      __dirname,
      "../../../scripts/fix-marketing-meta.mjs",
    );
    const { runFixMarketingMeta } = (await import(modulePath)) as {
      runFixMarketingMeta: (options: {
        projectRoot: string;
        contentRoot: string;
      }) => Promise<void>;
    };
    await runFixMarketingMeta({ projectRoot: root, contentRoot });

    const comparisonFrontmatter = await readFrontmatter(comparisonPath);
    const comparisonMeta = (comparisonFrontmatter.meta ?? {}) as Record<
      string,
      unknown
    >;
    expect(comparisonMeta.summaryBullets).toHaveLength(3);
    expect(comparisonMeta.primaryCta).toBeTruthy();

    const resourceFrontmatter = await readFrontmatter(resourcePath);
    const resourceMeta = (resourceFrontmatter.meta ?? {}) as Record<
      string,
      unknown
    >;
    expect(resourceMeta.summaryBullets).toHaveLength(3);
    expect((resourceMeta.primaryCta as { href?: string } | undefined)?.href).toBe(
      "https://files.example.com/resource.zip",
    );
  });
});
