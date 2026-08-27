import "server-only";

import { vehicles as fallbackVehicles, type Vehicle } from "./vehicles";

type FrappeResponse<T> = {
  message: T;
};

type VehicleQuery = {
  featuredOnly?: boolean;
  limit?: number;
};

const frappeOrigin = (
  process.env.FRAPPE_API_URL ||
  process.env.NEXT_PUBLIC_FRAPPE_API_URL ||
  "http://jcexport.localhost:8000"
).replace(/\/+$/, "");

export async function getVehicles(query: VehicleQuery = {}): Promise<Vehicle[]> {
  const params = new URLSearchParams({
    limit: String(query.limit ?? 100),
  });
  if (query.featuredOnly) {
    params.set("featured_only", "1");
  }

  try {
    const result = await fetchFromFrappe<Vehicle[]>(
      "jcexport_erp.api.get_public_vehicles",
      params,
    );
    return result.map(normalizeVehicle);
  } catch {
    // The fallback keeps the public site available while the local ERP is offline.
  }

  const fallback = query.featuredOnly
    ? fallbackVehicles.filter((vehicle) => vehicle.isFeatured !== false)
    : fallbackVehicles;
  return fallback.slice(0, query.limit ?? fallback.length);
}

export async function getVehicle(slug: string): Promise<Vehicle | undefined> {
  const params = new URLSearchParams({ slug });
  try {
    const vehicle = await fetchFromFrappe<Vehicle>(
      "jcexport_erp.api.get_public_vehicle",
      params,
    );
    return normalizeVehicle(vehicle);
  } catch {
    return fallbackVehicles.find((vehicle) => vehicle.slug === slug);
  }
}

async function fetchFromFrappe<T>(method: string, params: URLSearchParams): Promise<T> {
  const response = await fetch(
    `${frappeOrigin}/api/method/${method}?${params.toString()}`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    },
  );

  if (!response.ok) {
    throw new Error(`Frappe request failed with ${response.status}`);
  }

  const payload = (await response.json()) as FrappeResponse<T>;
  return payload.message;
}

function normalizeVehicle(vehicle: Vehicle): Vehicle {
  const images = vehicle.images.map(normalizeMediaUrl);
  return {
    ...vehicle,
    image: normalizeMediaUrl(vehicle.image),
    images,
    damages: vehicle.damages?.map((damage) => ({
      ...damage,
      photo: damage.photo ? normalizeMediaUrl(damage.photo) : undefined,
    })),
    documents: vehicle.documents?.map((document) => ({
      ...document,
      file: normalizeMediaUrl(document.file),
    })),
  };
}

function normalizeMediaUrl(value: string) {
  if (!value || value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  if (value.startsWith("/assets/") || value.startsWith("/files/")) {
    return `${frappeOrigin}${value}`;
  }
  return value;
}
