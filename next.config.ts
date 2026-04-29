import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", 
  images: {
    unoptimized: true,
  },
  basePath: "/uds26_team3",
  assetPrefix: "/uds26_team3/",
};

export default nextConfig;
