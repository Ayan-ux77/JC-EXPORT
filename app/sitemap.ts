import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { getVehicleSlugPage } from "@/data/vehicle-service";

/**
 * Every vehicle page is a landing page.
 *
 * Buyers search "toyota hiace for sale japan", not "japan car export". Each
 * car on this site answers one of those searches, and until now none of them
 * were being offered to a crawler at all -- Google would have had to find
 * them by following links from the listing, which paginates.
 *
 * Chunked rather than one enormous file: the catalogue runs to thousands of
 * cars, a sitemap is capped at 50,000 URLs, and fetching them all in one
 * request to build XML makes the sitemap the slowest thing on the site.
 */
const PER_SITEMAP = 1000;

/** Pages that exist whatever the stock looks like. */
const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/vehicles", priority: 0.9, changeFrequency: "daily" },
  { path: "/quote", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services", priority: 0.6, changeFrequency: "monthly" },
  { path: "/shipping-and-payment", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export async function generateSitemaps() {
  // One request to learn how many chunks there are. If the ERP is down the
  // site still publishes its static pages rather than no sitemap at all.
  const { total } = await getVehicleSlugPage(1, 1).catch(() => ({ total: 0, slugs: [] }));

  return Array.from(
    { length: Math.max(1, Math.ceil(total / PER_SITEMAP)) },
    (_, index) => ({ id: index }),
  );
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const { slugs } = await getVehicleSlugPage(id + 1, PER_SITEMAP).catch(() => ({
    slugs: [] as Array<{ slug: string; listedAt?: string }>,
    total: 0,
  }));

  const vehicles = slugs.map((vehicle) => ({
    url: `${site.url}/vehicles/${vehicle.slug}`,
    lastModified: vehicle.listedAt ? new Date(vehicle.listedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // The static pages ride on the first chunk only, or they would be repeated
  // in every file and their priority would mean nothing.
  if (id !== 0) {
    return vehicles;
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...vehicles,
  ];
}
