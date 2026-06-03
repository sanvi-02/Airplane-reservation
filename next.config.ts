import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
  },
  turbopack: {
    root: projectRoot,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("bufferutil", "utf-8-validate");
    }
    return config;
  },
};

export default nextConfig;
