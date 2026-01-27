import { test, expect } from "vitest";
import { SlugHumanizer } from "./SlugHumanizer";

test("SlugHumanizer humanizes hyphenated slugs and preserves known acronyms", () => {
  const humanizer = new SlugHumanizer();
  expect(humanizer.humanize("cms-bez-kodu")).toBe("CMS Bez Kodu");
  expect(humanizer.humanize("ai")).toBe("AI");
  expect(humanizer.humanize("seo")).toBe("SEO");
});

