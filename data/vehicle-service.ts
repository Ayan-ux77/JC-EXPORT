import "server-only";

import { callApi, JcApiError } from "./jc-api";
import type { Vehicle } from "./vehicles";

export type VehicleQuery = {
  featuredOnly?: boolean;
  limit?: number;
  page?: number;
  make?: string;
  model?: string;
  bodyType?: string;
  fuel?: string;
  transmission?: string;
  steering?: string;
  yearFrom?: number;
  yearTo?: number;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort?: string;
};

export type FilterOption = { name: string; count: number };

export type VehicleFilters = {
  makes: FilterOption[];
  bodyTypes: FilterOption[];
  fuels: FilterOption[];
  transmissions: FilterOption[];
  steerings: FilterOption[];
  years: { min: number | null; max: number | null };
};

/**
 * There is deliberately no fallback list here.
 *
 * The previous version answered an unreachable ERP with a hardcoded set of
 * demo cars, so the catalogue stayed up by advertising stock JC does not own.
 * An empty result and a visible error is the honest answer: a buyer who
 * enquires about a car that does not exist costs a real conversation.
 */
export async function getVehicles(query: VehicleQuery = {}): Promise<Vehicle[]> {
  const path = query.featuredOnly
    ? `vehicles/featured?limit=${query.limit ?? 8}`
    : `vehicles?${toParams(query)}`;

  return callApi<Vehicle[]>(path, { revalidate: 60 });
}

export async function getVehicle(slug: string): Promise<Vehicle | undefined> {
  try {
    return await callApi<Vehicle>(`vehicles/${encodeURIComponent(slug)}`, { revalidate: 60 });
  } catch (reason) {
    // A car that has sold is genuinely gone, and the page should 404 rather
    // than error. Anything else is a fault and must not be swallowed.
    if (reason instanceof JcApiError && reason.status === 404) {
      return undefined;
    }
    throw reason;
  }
}

export async function getSimilarVehicles(slug: string): Promise<Vehicle[]> {
  return callApi<Vehicle[]>(`vehicles/${encodeURIComponent(slug)}/similar`, { revalidate: 300 });
}

/**
 * Filter options come from listed stock, so the sidebar never offers a make
 * JC has none of. Cached longer than the listing: the set of makes in stock
 * changes far more slowly than the stock itself.
 */
export async function getVehicleFilters(): Promise<VehicleFilters> {
  return callApi<VehicleFilters>("vehicles/filters", { revalidate: 300 });
}

export async function getModelsForMake(make: string): Promise<string[]> {
  return callApi<string[]>(`vehicles/models?make=${encodeURIComponent(make)}`, {
    revalidate: 300,
  });
}

function toParams(query: VehicleQuery) {
  const params = new URLSearchParams();

  const mapping: Array<[keyof VehicleQuery, string]> = [
    ["make", "make"],
    ["model", "model"],
    ["bodyType", "body_type"],
    ["fuel", "fuel"],
    ["transmission", "transmission"],
    ["steering", "steering"],
    ["yearFrom", "year_from"],
    ["yearTo", "year_to"],
    ["priceMin", "price_min"],
    ["priceMax", "price_max"],
    ["search", "search"],
    ["sort", "sort"],
    ["page", "page"],
  ];

  for (const [key, param] of mapping) {
    const value = query[key];
    if (value !== undefined && value !== null && value !== "") {
      params.set(param, String(value));
    }
  }

  if (query.limit) {
    params.set("per_page", String(query.limit));
  }

  return params.toString();
}
