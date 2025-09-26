import type { NextConfig } from "next";

// Configure Next.js to allow loading images from localhost and 127.0.0.1
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "127.0.0.1", "via.placeholder.com", "example.com"],
  },
};

export default nextConfig;
