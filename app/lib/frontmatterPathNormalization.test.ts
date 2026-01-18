import { describe, expect, it } from "vitest";

import { readMarkdownFile } from "@/app/lib/frontmatter";

describe("frontmatter path normalization", () => {
  it("strips domain, collapses slashes, enforces trailing slash, and preserves query/hash suffix", () => {
    const entry = readMarkdownFile(
      "test/fixtures/frontmatter/domain-and-slashes.md",
    );

    expect(entry.frontmatter.path).toBe("/artykuly/analityka/?x=1");
  });

  it("defaults path to /{slug}/ when path is missing", () => {
    const entry = readMarkdownFile("test/fixtures/frontmatter/no-path.md");

    expect(entry.frontmatter.slug).toBe("no-path");
    expect(entry.frontmatter.path).toBe("/no-path/");
  });

  it("adds leading and trailing slash when path omits them", () => {
    const entry = readMarkdownFile(
      "test/fixtures/frontmatter/no-leading-or-trailing.md",
    );

    expect(entry.frontmatter.path).toBe("/poradniki/test/");
  });
});

