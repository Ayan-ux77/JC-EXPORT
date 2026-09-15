import type { MetadataRoute } from "next";

import { site } from "@/data/site";

/**
 * What a crawler may read.
 *
 * The catalogue is the point of the site, so it is wide open. The customer
 * portal is not: those pages are a signed-in buyer's own invoices, payments
 * and shipping documents, and while they are already behind authentication
 * there is no reason to invite a crawler to knock. /api is the site's own
 * proxy to the ERP, which serves JSON nobody should be indexing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/account/", "/api/", "/sign-in", "/sign-up", "/reset-password", "/new-password", "/verify-otp", "/forgot-password"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
