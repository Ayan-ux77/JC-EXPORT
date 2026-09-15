import "server-only";

import { callApi, callApiPage, JcApiError, type Paginated } from "./jc-api";
import type { CurrencyRates } from "./currency";
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
  /** "stock" is what JC owns and can ship; "order" the auction catalogue it buys in to order. */
  stockKind?: "stock" | "order";
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
  /** ISO 4217 for the country this port is in, when staff have recorded one. */
  currency?: string | null;
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
  // The featured path used to carry nothing but the limit, so a buyer who
  // had chosen their port got landed prices everywhere except the row they
  // meet first. Destination and shipment type travel with it now; the rest
  // of the filters do not apply to a hand-picked row.
  const path = query.featuredOnly
    ? `vehicles/featured?limit=${query.limit ?? 8}&${toParams({
        destinationPort: query.destinationPort,
        shipmentType: query.shipmentType,
      })}`
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

/**
 * Every listed car, a page at a time, for the sitemap.
 *
 * Deliberately not "fetch them all": the catalogue can run to tens of
 * thousands of rows, and asking the ERP for all of them in one request to
 * build an XML file is how a sitemap becomes the slowest page on the site.
 * The caller walks it in chunks and Next caches each one.
 */
/**
 * Every currency JC quotes in, in one call.
 *
 * Cached for an hour: a rate that moved four minutes ago does not change what
 * a car costs, and re-fetching per page would put the ERP on the critical
 * path of every render for no gain. Null on failure, so a rates outage costs
 * the local figure and not the page.
 */
/**
 * The short list of currencies to offer this buyer.
 *
 * The port goes with the request because the ERP holds thirty-odd market
 * currencies and returns only the few JC transacts in plus the one spoken
 * where this car is going. Without the port, a buyer shipping to Mombasa
 * would be offered euros and pounds and no shillings.
 */
export async function getCurrencyRates(
  destinationPort?: string,
): Promise<CurrencyRates | null> {
  const query = destinationPort
    ? `?destination_port=${encodeURIComponent(destinationPort)}`
    : "";

  // Fifteen minutes, not an hour. The rates themselves only change once a
  // day, so this is not about freshness of the numbers -- it is that adding a
  // market in the panel should show up on the site while the person who added
  // it is still looking at it. The call is to JC's own API, not the metered
  // one, so a shorter window costs nothing.
  return callApi<CurrencyRates>(`currency-rates${query}`, {
    revalidate: 900,
  }).catch(() => null);
}

export async function getVehicleSlugPage(
  page: number,
  perPage: number,
): Promise<{ slugs: Array<{ slug: string; listedAt?: string }>; total: number }> {
  const result = await callApiPage<Vehicle>(
    `vehicles?page=${page}&per_page=${perPage}&sort=newest`,
    { revalidate: 3600 },
  );

  return {
    slugs: result.data
      .filter((vehicle) => Boolean(vehicle.slug))
      .map((vehicle) => ({ slug: vehicle.slug, listedAt: vehicle.listedAt })),
    total: result.total ?? result.data.length,
  };
}

/**
 * How many cars match, without fetching any of them.
 *
 * per_page=1 so the ERP returns one row and a total rather than a page of
 * twenty-four that nothing reads. Cached for five minutes: the home page asks
 * this twice on every render, and a count that is a few minutes stale is
 * worth more than two round trips on the critical path.
 */
export async function getVehicleCount(query: VehicleQuery = {}): Promise<number> {
  const page = await callApiPage<Vehicle>(
    `vehicles?${toParams({ ...query, page: 1 })}&per_page=1`,
    { revalidate: 300 },
  );

  return page.total ?? 0;
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
    ["stockKind", "stock_kind"],
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
