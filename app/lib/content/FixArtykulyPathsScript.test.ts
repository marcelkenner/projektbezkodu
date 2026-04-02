import { describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import matter from "gray-matter";

async function createTempProject() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "pbk-artykuly-paths-"));
  const contentRoot = path.join(root, "content");
  await fs.mkdir(contentRoot, { recursive: true });
  return { root, contentRoot };
}

async function writeMarkdown(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, "utf8");
}

async function readFrontmatter(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  return matter(raw).data ?? {};
}

describe("scripts/fix-artykuly-paths.mjs", () => {
  it("normalizes root hubs to /artykuly/<category>/", async () => {
    const { root, contentRoot } = await createTempProject();
    const hubPath = path.join(contentRoot, "artykuly", "ai", "index.md");
    await writeMarkdown(
      hubPath,
      [
        "---",
        "title: AI",
        "slug: ai",
        "path: /ai-zly-path/",
        "template: default",
        "type: hub",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/fix-artykuly-paths.mjs");
    const { runFixArtykulyPaths } = (await import(modulePath)) as {
      runFixArtykulyPaths: (options: {
        projectRoot: string;
        contentRoot?: string;
      }) => Promise<void>;
    };
    await runFixArtykulyPaths({
      projectRoot: root,
      contentRoot: path.join(contentRoot, "artykuly"),
    });

    const frontmatter = await readFrontmatter(hubPath);
    expect(frontmatter.path).toBe("/artykuly/ai/");
  });

  it("moves published leaf canonicals under /artykuly while preserving curated slugs already there", async () => {
    const { root, contentRoot } = await createTempProject();
    const externalLeafPath = path.join(contentRoot, "artykuly", "seo", "plan.md");
    const alreadyGoodLeafPath = path.join(
      contentRoot,
      "artykuly",
      "seo",
      "good.md",
    );
    const wrongPrefixLeafPath = path.join(
      contentRoot,
      "artykuly",
      "automation",
      "lead.md",
    );
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "seo", "index.md"),
      [
        "---",
        "title: SEO",
        "slug: seo",
        "path: /artykuly/seo/",
        "template: default",
        "type: hub",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );
    await writeMarkdown(
      externalLeafPath,
      [
        "---",
        "title: Plan SEO",
        "slug: plan-seo",
        "path: /plan-seo/",
        "template: default",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );
    await writeMarkdown(
      alreadyGoodLeafPath,
      [
        "---",
        "title: Existing good slug",
        "slug: custom-slug",
        "path: /artykuly/seo/niestandardowy-slug/",
        "template: default",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "automation", "index.md"),
      [
        "---",
        "title: Automation",
        "slug: automation",
        "path: /artykuly/automation/",
        "template: default",
        "type: hub",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );
    await writeMarkdown(
      wrongPrefixLeafPath,
      [
        "---",
        "title: Lead automation",
        "slug: lead-automation",
        "path: /artykuly/ai/lead-automation/",
        "template: default",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/fix-artykuly-paths.mjs");
    const { runFixArtykulyPaths } = (await import(modulePath)) as {
      runFixArtykulyPaths: (options: {
        projectRoot: string;
        contentRoot?: string;
      }) => Promise<void>;
    };
    await runFixArtykulyPaths({
      projectRoot: root,
      contentRoot: path.join(contentRoot, "artykuly"),
    });

    const normalizedLeaf = await readFrontmatter(externalLeafPath);
    expect(normalizedLeaf.path).toBe("/artykuly/seo/plan-seo/");

    const preservedLeaf = await readFrontmatter(alreadyGoodLeafPath);
    expect(preservedLeaf.path).toBe("/artykuly/seo/niestandardowy-slug/");

    const fixedPrefixLeaf = await readFrontmatter(wrongPrefixLeafPath);
    expect(fixedPrefixLeaf.path).toBe("/artykuly/automation/lead-automation/");
  });
});
