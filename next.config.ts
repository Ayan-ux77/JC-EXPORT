import type { NextConfig } from "next";

const frappeUrl = new URL(
  process.env.FRAPPE_API_URL ||
    process.env.NEXT_PUBLIC_FRAPPE_API_URL ||
    "http://jcexport.localhost:8000",
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: frappeUrl.protocol === "https:" ? "https" : "http",
        hostname: frappeUrl.hostname,
        port: frappeUrl.port,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
