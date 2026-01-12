import type { NextConfig } from "next";
import { env } from "./env/server";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/scrapDictionary/:source/:target/:word",
        destination: `${env.SCRAP_DICTIONARY_URL}/:source/:target/:word`,
      },
    ];
  },
};

export default nextConfig;
