import { resolveLocalPrice } from "@/data/currency";
import type { Metadata } from "next";
import { bodyFont, displayFont } from "@/app/fonts";
import Link from "next/link";
import { Suspense } from "react";
import { BadgeCheck, ChevronRight, Globe2, Ship, WalletCards } from "lucide-react";

import {
  getCurrencyRates,
  getDestinations,
  getVehicleFilters,
  getVehiclePage,
  type ShipmentType,
  type VehicleQuery,
} from "@/data/vehicle-service";
import { chosenCurrency, rememberedDestination } from "@/data/buyer-preferences";
import { VehicleBrowser } from "../components/vehicle-browser";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Japanese Used Vehicles for Export | Japan Car Export",
  description:
    "Search available Japanese used vehicles by make, body type, year, price, mileage, and auction grade.",
};

type SearchValue = string | string[] | undefined;

type VehiclesPageProps = {
  searchParams: Promise<Record<string, SearchValue>>;
};

function firstValue(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

// The API 422s on any sort it doesn't recognise (VehicleCatalogController),
// so a URL a buyer hand-edits or an old bookmark must be validated here
// rather than forwarded as-is.
const SORT_VALUES = new Set([
  "newest",
  "oldest",
  "price_low",
  "price_high",
  "year_new",
  "year_old",
  "mileage_low",
]);

function toSort(value: SearchValue): string {
  const raw = firstValue(value);
  return raw && SORT_VALUES.has(raw) ? raw : "newest";
}

function toPage(value: SearchValue): number {
  const parsed = Number(firstValue(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function toYear(value: SearchValue): number | undefined {
  const parsed = Number(firstValue(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function toPrice(value: SearchValue): number | undefined {
  const parsed = Number(firstValue(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function toGrade(value: SearchValue): number | undefined {
  const parsed = Number(firstValue(value));
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 10 ? parsed : undefined;
}

// make/model/body_type/fuel are comma-separated lists now (VehicleCatalogController
// splits on "," and matches any of them), so a URL is the source of truth for
// "which ones are selected" -- this just turns that string back into a list.
function toList(value: SearchValue): string[] {
  const raw = firstValue(value);
  if (!raw) return [];
  return Array.from(new Set(raw.split(",").map((part) => part.trim()).filter(Boolean)));
}

// Matches the API default (VehicleCatalogController::index paginates at 24
// when per_page is omitted) so the URL's page numbers and the "showing"
// count stay meaningful across a view-mode toggle, which no longer changes
// how many rows are fetched -- it is a display choice now, not a query one.
const PAGE_SIZE = 24;

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const query = await searchParams;

  // The URL wins, because a shared link must quote the port it names. When
  // it says nothing, fall back to what this buyer chose earlier -- being
  // asked for your port again on the next page is the whole reason people
  // stop using a calculator.
  const remembered = await rememberedDestination();
  const destinationPort =
    firstValue(query.destination_port) || remembered.port || undefined;
  const shipmentType =
    firstValue(query.shipment_type) === "RORO"
      ? ("RORO" as ShipmentType)
      : firstValue(query.shipment_type) === "CONTAINER"
        ? ("CONTAINER" as ShipmentType)
        : remembered.shipment;

  // The homepage's brand tiles and hero search still link in as a single
  // `?brand=Toyota` (see app/(main)/page.tsx); every multi-select this page
  // writes itself uses the API's own comma-separated `make` param. Both are
  // read here, and only one applies -- an explicit `make` wins.
  const requestedMakes = toList(query.make).length ? toList(query.make) : toList(query.brand);

  // Filters and destinations depend on listed stock as a whole, not on this
  // particular search, so they're fetched once up front -- both to drive the
  // sidebar's option counts (which must reflect all matching stock, not just
  // this page of it) and to resolve each requested make to its canonical
  // casing before it goes to the API.
  const [filters, destinations, currencyRates] = await Promise.all([
    getVehicleFilters(),
    getDestinations().catch(() => []),
    getCurrencyRates(destinationPort),
  ]);

  const make = requestedMakes
    .map(
      (value) =>
        filters.makes.find((option) => option.name.toLowerCase() === value.toLowerCase())?.name,
    )
    .filter((value): value is string => Boolean(value));

  const vehicleQuery: VehicleQuery = {
    make,
    model: toList(query.model),
    bodyType: toList(query.body_type),
    fuel: toList(query.fuel),
    yearFrom: toYear(query.year_from),
    yearTo: toYear(query.year_to),
    priceMin: toPrice(query.price_min),
    priceMax: toPrice(query.price_max),
    gradeMin: toGrade(query.grade_min),
    search: firstValue(query.search) || undefined,
    sort: toSort(query.sort),
    page: toPage(query.page),
    // Set by the home page's "In stock" / "Available to order" tabs. Anything
    // else is ignored rather than passed through to the API to reject.
    stockKind:
      firstValue(query.stock_kind) === "order"
        ? ("order" as const)
        : firstValue(query.stock_kind) === "stock"
          ? ("stock" as const)
          : undefined,
    limit: PAGE_SIZE,
    destinationPort,
    shipmentType,
  };

  // The listing is the page's job and fails loudly if the ERP is unreachable
  // (see getVehicles' own comment on why there is no fallback stock here).
  const chosen = await chosenCurrency();

  const listing = await getVehiclePage(vehicleQuery);

  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <section className={styles.hero} aria-labelledby="vehicles-title">
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight aria-hidden="true" />
            <span>Vehicles</span>
          </nav>
          <p className={styles.kicker}>Japan-sourced used vehicles</p>
          <h1 id="vehicles-title">
            Find the right vehicle, <em>with the facts upfront.</em>
          </h1>
          <p>
            {/* listing.total is the whole matching inventory, not vehicles.length
                (this page's 24 rows) -- the difference is the entire point of
                this rewrite: see data/vehicle-service.ts and callApiPage. */}
            Search {listing.total} available vehicles with condition details,
            clear FOB pricing, and export support from Japan to your destination.
          </p>
        </div>
      </section>

      <section className={styles.assuranceStrip} aria-label="Vehicle buying assurances">
        <div>
          <span><BadgeCheck aria-hidden="true" /> Condition details</span>
          <span><WalletCards aria-hidden="true" /> Clear FOB pricing</span>
          <span><Ship aria-hidden="true" /> RoRo and container options</span>
          <span><Globe2 aria-hidden="true" /> Worldwide export support</span>
        </div>
      </section>

      {/* VehicleBrowser reads every filter, the sort and the page number via
          useSearchParams and writes changes back to the URL, which is what
          drives this server component to refetch; Next requires that hook to
          sit under a Suspense boundary. */}
      <Suspense fallback={null}>
        <VehicleBrowser
          vehicles={listing.data}
          filters={filters}
          destinations={destinations}
          currencyRates={currencyRates}
          localPrice={resolveLocalPrice(
            currencyRates,
            chosen,
            currencyRates?.local ?? undefined,
          )}
          currencyFromDestination={!chosen}
          pagination={{
            page: listing.page,
            lastPage: listing.lastPage,
            total: listing.total,
            perPage: listing.perPage,
          }}
        />
      </Suspense>
    </main>
  );
}
