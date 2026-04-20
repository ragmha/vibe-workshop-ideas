import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/vibe-workshop-ideas",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
