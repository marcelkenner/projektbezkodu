import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Safety net: if any client requests assets with a duplicated `_next/_next` prefix,
    // rewrite them back to the correct Next.js static path.
    return [
      {
        source: "/_next/_next/:path*",
        destination: "/_next/:path*",
      },
    ];
  },
};

export default nextConfig;
