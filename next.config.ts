import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", 
  images: {
    unoptimized: true,
  },
  basePath: "/uds26_team3",
  assetPrefix: "/uds26_team3/",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/uds26_team3",
  },
};

export default nextConfig;
