import { describe, expect, it } from "vitest";

import { SitemapRedirectCoordinator } from "@/app/lib/navigation/SitemapRedirectCoordinator";

describe("SitemapRedirectCoordinator", () => {
  it("returns the sitemap XML path", () => {
    const coordinator = new SitemapRedirectCoordinator();

    expect(coordinator.resolveRedirectPath()).toBe("/sitemap.xml");
  });
});
