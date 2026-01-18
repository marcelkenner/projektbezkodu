import { describe, expect, it } from "vitest";

import nextConfig from "../next.config";

describe("next.config", () => {
  it("limits static generation concurrency for stable CI builds", () => {
    expect(nextConfig.experimental?.staticGenerationMaxConcurrency).toBe(4);
    expect(nextConfig.experimental?.staticGenerationMinPagesPerWorker).toBe(100);
    expect(nextConfig.experimental?.serverSourceMaps).toBe(false);
    expect(nextConfig.productionBrowserSourceMaps).toBe(false);
    expect(nextConfig.enablePrerenderSourceMaps).toBe(false);
  });

  it("keeps _next asset path normalization rewrites", async () => {
    const rewrites = await nextConfig.rewrites?.();
    expect(Array.isArray(rewrites)).toBe(true);

    expect(rewrites).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/_next//_next/:path*",
          destination: "/_next/:path*",
        }),
      ]),
    );
  });
});
