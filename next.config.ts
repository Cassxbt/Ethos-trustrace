import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@rainbow-me/rainbowkit'],
  turbopack: {},
};

export default nextConfig;
