import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverComponentsExternalPackages: ['@google/genai'],
    middlewareClientMaxBodySize: '50mb',
  },
};

export default nextConfig;
