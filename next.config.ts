import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  enablePrerenderSourceMaps: false,
  experimental: {
    // Avoid build instability (e.g. OOM / canceled build context) on high-core CI builders by
    // limiting how many pages are generated in parallel during `next build`.
    staticGenerationMaxConcurrency: 4,
    staticGenerationMinPagesPerWorker: 100,
    serverSourceMaps: false,
  },
  async rewrites() {
    // Normalize any malformed asset URLs that include double slashes or a duplicated `_next` segment.
    return [
      // Handle the most common malformed form in a single pass (e.g., /_next//_next/static/...)
      {
        source: "/_next//_next/:path*",
        destination: "/_next/:path*",
      },
      // Collapse duplicated `_next` segment (e.g., /_next/_next/static/...)
      {
        source: "/_next/:maybeSlash(_next)?/:path*",
        destination: "/_next/:path*",
      },
      // Collapse double slashes that may come from malformed basePath
      {
        source: "/_next//:path*",
        destination: "/_next/:path*",
      },
      // Absolute-url style requests that accidentally repeat the prefix
      {
        source: "/_next/_next/:path*",
        destination: "/_next/:path*",
      },
    ];
  },
};

export default nextConfig;
