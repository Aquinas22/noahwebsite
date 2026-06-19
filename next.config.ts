import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uploaded images are served from a local route; skip the optimizer.
  images: { unoptimized: true },
  // Allow larger image uploads through server actions.
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
      // Saving uses Server Actions, which Next.js blocks unless the request's
      // Origin matches the server host. Behind the Cloudflare tunnel the public
      // domain differs from localhost, so list it here or every save is rejected.
      allowedOrigins: ["noahroe.site", "www.noahroe.site"],
    },
  },
  // Same hosts, for dev-server resources (HMR) served through the tunnel.
  allowedDevOrigins: ["noahroe.site", "www.noahroe.site"],
};

export default nextConfig;
