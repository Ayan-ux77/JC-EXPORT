import type { NextConfig } from "next";

/**
 * Where vehicle photos actually live.
 *
 * jc-portal builds its media URLs from its own APP_URL, which is usually the
 * address this site calls the API on -- but not always: behind a private
 * network the API can be reachable as an internal host while the photos are
 * served from the public one. JC_MEDIA_URL is the override for that case.
 *
 * This was once derived from FRAPPE_API_URL, a service this site no longer
 * talks to, so it named a host no image URL has ever used.
 */
const mediaOrigin = new URL(
  process.env.JC_MEDIA_URL || process.env.JC_API_URL || "http://localhost:8000",
);

const nextConfig: NextConfig = {
  /**
   * Vehicle photos are served through this site rather than linked straight to
   * the ERP.
   *
   * Two reasons, and the first one is not cosmetic: Next refuses to optimise an
   * upstream image whose host resolves to a private address -- an SSRF guard --
   * so every photo failed with "resolved to private ip" the moment the ERP ran
   * anywhere but the public internet, which in development is always. Proxying
   * makes the photo a local path, which the optimiser is happy to resize.
   *
   * The second is that one origin means one thing for a browser to trust: no
   * cross-origin image requests to a second port, which some environments block
   * outright, and no CORS or CDN story to get right later.
   */
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${mediaOrigin.origin}/storage/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Kept as a fallback for any media URL that is not under /storage and so
      // does not go through the proxy above.
      {
        protocol: mediaOrigin.protocol === "https:" ? "https" : "http",
        hostname: mediaOrigin.hostname,
        port: mediaOrigin.port,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
