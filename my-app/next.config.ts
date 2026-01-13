import type { NextConfig } from "next";
import { serverEnv } from "./env";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/scrapDictionary/:source/:target/:word",
        destination: `http://${serverEnv.env.SCRAP_DICTIONARY_URL}/:source/:target/:word`,
      },
    ];
  },
};

export default nextConfig;
