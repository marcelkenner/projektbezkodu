import { describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import matter from "gray-matter";

async function createTempProject() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "pbk-public-paths-"));
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

describe("scripts/fix-public-content-paths.mjs", () => {
  it("prefixes tutorial canonicals with /poradniki/ while preserving the frontmatter slug", async () => {
    const { root, contentRoot } = await createTempProject();
    const tutorialPath = path.join(
      contentRoot,
      "poradniki",
      "old-folder",
      "index.md",
    );

    await writeMarkdown(
      tutorialPath,
      [
        "---",
        "title: Tutorial",
        "slug: custom-tutorial",
        "path: /custom-tutorial/",
        "template: tutorial",
        "draft: false",
        "---",
        "",
        "# Tutorial",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(
      __dirname,
      "../../../scripts/fix-public-content-paths.mjs",
    );
    const { runFixPublicContentPaths } = (await import(modulePath)) as {
      runFixPublicContentPaths: (options: {
        projectRoot: string;
        contentRoot?: string;
      }) => Promise<void>;
    };

    await runFixPublicContentPaths({
      projectRoot: root,
      contentRoot,
    });

    const frontmatter = await readFrontmatter(tutorialPath);
    expect(frontmatter.path).toBe("/poradniki/custom-tutorial/");
  });

  it("normalizes top-level tool canonicals into /narzedzia/<tool>/...", async () => {
    const { root, contentRoot } = await createTempProject();
    const reviewPath = path.join(
      contentRoot,
      "hostinger-link-in-bio",
      "recenzja",
      "index.md",
    );
    const mainPath = path.join(
      contentRoot,
      "hostinger-link-in-bio",
      "glowny",
      "index.md",
    );

    await writeMarkdown(
      reviewPath,
      [
        "---",
        "title: Review",
        "slug: recenzja",
        "path: /recenzja/",
        "template: article",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );

    await writeMarkdown(
      mainPath,
      [
        "---",
        "title: Main guide",
        "slug: glowny",
        "path: /glowny/",
        "template: article",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(
      __dirname,
      "../../../scripts/fix-public-content-paths.mjs",
    );
    const { runFixPublicContentPaths } = (await import(modulePath)) as {
      runFixPublicContentPaths: (options: {
        projectRoot: string;
        contentRoot?: string;
      }) => Promise<void>;
    };

    await runFixPublicContentPaths({
      projectRoot: root,
      contentRoot,
    });

    const reviewFrontmatter = await readFrontmatter(reviewPath);
    expect(reviewFrontmatter.path).toBe(
      "/narzedzia/hostinger-link-in-bio/recenzja/",
    );

    const mainFrontmatter = await readFrontmatter(mainPath);
    expect(mainFrontmatter.path).toBe("/narzedzia/hostinger-link-in-bio/");
  });

  it("normalizes nested tool content stored under content/narzedzia-no-code", async () => {
    const { root, contentRoot } = await createTempProject();
    const faqPath = path.join(
      contentRoot,
      "narzedzia-no-code",
      "beacons",
      "faq",
      "index.md",
    );

    await writeMarkdown(
      faqPath,
      [
        "---",
        "title: FAQ",
        "slug: faq",
        "path: /faq/",
        "template: article",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(
      __dirname,
      "../../../scripts/fix-public-content-paths.mjs",
    );
    const { runFixPublicContentPaths } = (await import(modulePath)) as {
      runFixPublicContentPaths: (options: {
        projectRoot: string;
        contentRoot?: string;
      }) => Promise<void>;
    };

    await runFixPublicContentPaths({
      projectRoot: root,
      contentRoot,
    });

    const frontmatter = await readFrontmatter(faqPath);
    expect(frontmatter.path).toBe("/narzedzia/beacons/faq/");
  });
});
