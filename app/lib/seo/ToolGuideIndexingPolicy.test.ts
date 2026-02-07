import { describe, expect, it } from "vitest";

import { ToolGuideIndexingPolicy } from "@/app/lib/seo/ToolGuideIndexingPolicy";

describe("ToolGuideIndexingPolicy", () => {
  const policy = new ToolGuideIndexingPolicy();

  it("marks /glowny/ tool guides as indexable", () => {
    expect(policy.resolveRobots(["glowny"])).toEqual({
      index: true,
      follow: true,
    });
  });

  it("does not override robots on non-glowny tool pages", () => {
    expect(policy.resolveRobots(["recenzja"])).toBeUndefined();
  });
});
