import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/scrapDictionary/:path*',
        destination: 'http://localhost:3030/:path*'
      }
    ]
  }
};

export default nextConfig;
