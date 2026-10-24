import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Required for next-mdx-remote under Turbopack until upstream resolves.
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
