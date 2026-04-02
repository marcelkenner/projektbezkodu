import { describe, expect, it } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

async function createTempProject() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "pbk-content-lint-"));
  const contentRoot = path.join(root, "content");
  await fs.mkdir(contentRoot, { recursive: true });
  return { root, contentRoot };
}

async function writeMarkdown(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, "utf8");
}

describe("scripts/validate-content.mjs", () => {
  it("rejects published category root index.md files that are not hubs", async () => {
    const { root, contentRoot } = await createTempProject();
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "architektura", "index.md"),
      [
        "---",
        "title: Architektura",
        "slug: architektura-no-code",
        "path: /artykuly/architektura/",
        "template: default",
        "draft: false",
        "---",
        "",
        "# Article",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
        warnings: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: "content/artykuly/architektura/index.md",
          message: expect.stringContaining("Category root pages"),
        }),
      ]),
    );
    expect(
      result.errors.some((entry) => entry.message.includes("type: hub")),
    ).toBe(true);
  });

  it("rejects subcategory index.md files without type: hub when published descendants exist", async () => {
    const { root, contentRoot } = await createTempProject();
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
      path.join(contentRoot, "artykuly", "seo", "audyty", "index.md"),
      [
        "---",
        "title: Audyty",
        "slug: audyty-seo",
        "path: /artykuly/seo/audyty/",
        "template: default",
        "draft: false",
        "---",
        "",
        "# Leaf",
        "",
      ].join("\n"),
    );
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "seo", "audyty", "checklista.md"),
      [
        "---",
        "title: Checklista",
        "slug: checklista-audytu",
        "path: /artykuly/seo/audyty/checklista-audytu/",
        "template: default",
        "draft: false",
        "meta:",
        "  summaryBullets:",
        "    - One",
        "    - Two",
        "    - Three",
        "  primaryCta:",
        "    label: Start",
        "    href: /kontakt/",
        "---",
        "",
        "# Child article",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(
      result.errors.some(
        (entry) =>
          entry.file === "content/artykuly/seo/audyty/checklista.md" &&
          entry.message.includes("Subcategory hub pages"),
      ),
    ).toBe(true);
  });

  it("rejects hub pages whose canonical path does not match the category route", async () => {
    const { root, contentRoot } = await createTempProject();
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "ai", "index.md"),
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

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(
      result.errors.some(
        (entry) =>
          entry.file === "content/artykuly/ai/index.md" &&
          entry.message.includes("must use canonical path /artykuly/ai/"),
      ),
    ).toBe(true);
  });

  it("rejects published leaf articles under content/artykuly when their canonical path leaves /artykuly", async () => {
    const { root, contentRoot } = await createTempProject();
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
      path.join(contentRoot, "artykuly", "seo", "plan.md"),
      [
        "---",
        "title: Plan SEO",
        "slug: plan-seo",
        "path: /plan-seo/",
        "template: default",
        "draft: false",
        "meta:",
        "  summaryBullets:",
        "    - One",
        "    - Two",
        "    - Three",
        "  primaryCta:",
        "    label: Start",
        "    href: /kontakt/",
        "---",
        "",
        "# Leaf article",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(
      result.errors.some(
        (entry) =>
          entry.file === "content/artykuly/seo/plan.md" &&
          entry.message.includes("must use a canonical path under /artykuly/"),
      ),
    ).toBe(true);
  });

  it("rejects published leaf articles when they keep the wrong /artykuly category prefix", async () => {
    const { root, contentRoot } = await createTempProject();
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
      path.join(contentRoot, "artykuly", "automation", "lead.md"),
      [
        "---",
        "title: Lead automation",
        "slug: lead-automation",
        "path: /artykuly/ai/lead-automation/",
        "template: default",
        "draft: false",
        "meta:",
        "  summaryBullets:",
        "    - One",
        "    - Two",
        "    - Three",
        "  primaryCta:",
        "    label: Start",
        "    href: /kontakt/",
        "---",
        "",
        "# Leaf article",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(
      result.errors.some(
        (entry) =>
          entry.file === "content/artykuly/automation/lead.md" &&
          entry.message.includes("must stay under /artykuly/automation/"),
      ),
    ).toBe(true);
  });

  it("allows direct category article folders when they do not act as subcategory hubs", async () => {
    const { root, contentRoot } = await createTempProject();
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "biblioteka-komponentow", "index.md"),
      [
        "---",
        "title: Biblioteka",
        "slug: biblioteka-komponentow",
        "path: /artykuly/biblioteka-komponentow/",
        "template: default",
        "type: hub",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "biblioteka-komponentow", "blog-list", "index.md"),
      [
        "---",
        "title: Blog list",
        "slug: sekcje-lista-wpisow",
        "path: /artykuly/biblioteka-komponentow/sekcje-lista-wpisow/",
        "template: template",
        "draft: false",
        "meta:",
        "  summaryBullets:",
        "    - One",
        "    - Two",
        "    - Three",
        "  primaryCta:",
        "    label: Start",
        "    href: /kontakt/",
        "---",
        "",
        "# Leaf article",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(result.errors).toEqual([]);
  });

  it("rejects placeholder slug values like index2 inside /artykuly content", async () => {
    const { root, contentRoot } = await createTempProject();
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "regulamin", "index.md"),
      [
        "---",
        "title: Regulamin",
        "slug: regulamin",
        "path: /artykuly/regulamin/",
        "template: default",
        "type: hub",
        "draft: false",
        "---",
        "",
      ].join("\n"),
    );
    await writeMarkdown(
      path.join(contentRoot, "artykuly", "regulamin", "aplikacja.md"),
      [
        "---",
        "title: Regulamin aplikacji",
        "slug: index2",
        "path: /artykuly/regulamin/regulamin-aplikacji/",
        "template: default",
        "draft: false",
        "meta:",
        "  summaryBullets:",
        "    - One",
        "    - Two",
        "    - Three",
        "  primaryCta:",
        "    label: Start",
        "    href: /kontakt/",
        "---",
        "",
        "# Leaf article",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(
      result.errors.some(
        (entry) =>
          entry.file === "content/artykuly/regulamin/aplikacja.md" &&
          entry.message.includes('descriptive slug instead of placeholder value "index2"'),
      ),
    ).toBe(true);
  });

  it("rejects markdown fenced blocks declared as ```markdown inside content files", async () => {
    const { root, contentRoot } = await createTempProject();
    await writeMarkdown(
      path.join(contentRoot, "narzedzia-no-code", "hotjar", "cennik", "index.md"),
      [
        "---",
        "title: Hotjar Cennik",
        "slug: cennik",
        "path: /narzedzia/hotjar/cennik/",
        "template: default",
        "draft: false",
        "---",
        "",
        "```markdown",
        "To nie powinno przejsc.",
        "```",
        "",
      ].join("\n"),
    );

    const modulePath = path.resolve(__dirname, "../../../scripts/validate-content.mjs");
    const { runContentValidation } = (await import(modulePath)) as {
      runContentValidation: (options: {
        projectRoot: string;
        strictMode?: boolean;
      }) => {
        errors: Array<{ file: string; message: string }>;
      };
    };

    const result = runContentValidation({ projectRoot: root });
    expect(
      result.errors.some(
        (entry) =>
          entry.file === "content/narzedzia-no-code/hotjar/cennik/index.md" &&
          entry.message.includes("Do not use ```markdown fenced blocks"),
      ),
    ).toBe(true);
  });
});
