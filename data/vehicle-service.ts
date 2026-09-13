import "server-only";

import { callApi, callApiPage, JcApiError, type Paginated } from "./jc-api";
import type { Vehicle } from "./vehicles";

export type ShipmentType = "RORO" | "CONTAINER";

// make/model/bodyType/fuel/transmission each accept either one value or a
// list -- the API takes them as a comma-separated string and matches any of
// them (VehicleCatalogController::listOf), so "Toyota or Nissan" is one
// request, not one request per make.
export type VehicleQuery = {
  featuredOnly?: boolean;
  limit?: number;
  page?: number;
  make?: string | string[];
  model?: string | string[];
  bodyType?: string | string[];
  fuel?: string | string[];
  transmission?: string | string[];
  steering?: string;
  drive?: string;
  yearFrom?: number;
  yearTo?: number;
  priceMin?: number;
  priceMax?: number;
  /** Minimum auction grade, 0-10. Letter grades (R, RA -- repaired) cast to 0 server-side and so are excluded by any positive value, which is the point. */
  gradeMin?: number;
  search?: string;
  sort?: string;
  /** Buyer's port. Every vehicle comes back with a `landed` breakdown to it. */
  destinationPort?: string;
  shipmentType?: ShipmentType;
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

/** A port JC can actually quote a landed price to -- see getDestinations(). */
export type Destination = {
  name: string;
  country: string | null;
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

/**
 * A single page of the catalogue, with the total the page cannot see on its
 * own. The listing page paginates, filters and sorts through this -- doing
 * any of that in the browser instead only ever operates on whichever page
 * happened to be fetched, which is how the old listing capped itself at 24
 * cars no matter how much stock JC actually had.
 */
export async function getVehiclePage(query: VehicleQuery = {}): Promise<Paginated<Vehicle>> {
  return callApiPage<Vehicle>(`vehicles?${toParams(query)}`, { revalidate: 60 });
}

export async function getVehicle(
  slug: string,
  query: { destinationPort?: string; shipmentType?: ShipmentType } = {},
): Promise<Vehicle | undefined> {
  const params = new URLSearchParams();
  if (query.destinationPort) params.set("destination_port", query.destinationPort);
  if (query.shipmentType) params.set("shipment_type", query.shipmentType);
  const qs = params.toString();

  try {
    return await callApi<Vehicle>(
      `vehicles/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`,
      { revalidate: 60 },
    );
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

/**
 * Ports JC can actually quote a landed price to. Driven off the freight
 * matrix on the API side, so this never offers a route that would come back
 * "ask us" for every single car -- that teaches buyers the selector is
 * decorative. Cached for an hour: the quotable port list changes about as
 * often as JC signs a new freight contract.
 */
export async function getDestinations(): Promise<Destination[]> {
  return callApi<Destination[]>("destinations", { revalidate: 3600 });
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
    ["drive", "drive"],
    ["yearFrom", "year_from"],
    ["yearTo", "year_to"],
    ["priceMin", "price_min"],
    ["priceMax", "price_max"],
    ["gradeMin", "grade_min"],
    ["search", "search"],
    ["sort", "sort"],
    ["page", "page"],
    ["destinationPort", "destination_port"],
    ["shipmentType", "shipment_type"],
  ];

  for (const [key, param] of mapping) {
    const value = query[key];
    if (Array.isArray(value)) {
      // A list of one is just a value -- but an empty list must drop the
      // param entirely rather than send an empty `make=`, which the API
      // would otherwise have to specially ignore.
      if (value.length > 0) {
        params.set(param, value.join(","));
      }
      continue;
    }
    if (value !== undefined && value !== null && value !== "") {
      params.set(param, String(value));
    }
  }

  if (query.limit) {
    params.set("per_page", String(query.limit));
  }

  return params.toString();
}

/**
 * What a customer said about a car they bought.
 *
 * Only reviews a human at JC has approved come back from this endpoint --
 * jc-portal moderates them, and a pending review (including an unhappy one)
 * must never reach the website by accident.
 */
export type CustomerReview = {
  id: number;
  name: string;
  country: string | null;
  vehicle: string | null;
  rating: number;
  review: string;
  date: string | null;
  /** Attached to a real customer record -- somebody who actually bought a car. */
  verified: boolean;
};

export async function getReviews(limit = 6): Promise<CustomerReview[]> {
  // An unreachable ERP means "no reviews to show", not a broken home page:
  // the section hides itself and everything around it still renders.
  return callApi<CustomerReview[]>(`reviews?limit=${limit}`, { revalidate: 300 }).catch(() => []);
}
