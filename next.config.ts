import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uploaded images are served from a local route; skip the optimizer.
  images: { unoptimized: true },
  // Allow larger image uploads through server actions.
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
