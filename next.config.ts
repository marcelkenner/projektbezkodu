import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    // Normalize any malformed asset URLs that include double slashes or a duplicated `_next` segment.
    return [
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
