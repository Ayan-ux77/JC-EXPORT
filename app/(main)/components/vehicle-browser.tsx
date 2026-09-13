"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CarFront,
  CircleGauge,
  Cog,
  Disc,
  Fuel,
  Gauge,
  Grid2X2,
  List,
  MapPin,
  MessageCircle,
  RotateCcw,
  Search,
  Settings2,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  PRICE_ON_APPLICATION,
  formatCurrency,
  formatVehiclePrice,
  hasPublicPrice,
  isNewArrival,
  mediaSrc,
  type Vehicle,
  whatsappUrl,
} from "@/data/vehicles";
import { SelectField } from "@/app/components/select-field";
import type { Destination, VehicleFilters } from "@/data/vehicle-service";
import { DestinationSelector } from "./destination-selector";
import { Pagination } from "./pagination";
import styles from "../vehicles/page.module.css";

type PaginationMeta = {
  page: number;
  lastPage: number;
  total: number;
  perPage: number;
};

type VehicleBrowserProps = {
  /** Only this page's rows. Every count on this screen must come from `pagination` or `filters`, never from vehicles.length. */
  vehicles: Vehicle[];
  /** Option lists and counts over ALL listed stock -- see getVehicleFilters(). Never recomputed from `vehicles`. */
  filters: VehicleFilters;
  destinations: Destination[];
  pagination: PaginationMeta;
};

// These match the API's `sort` vocabulary (see VehicleCatalogController)
// rather than an ad hoc set of labels, so the option a buyer picks here means
// the same thing it would mean typed directly into the API.
type SortOption =
  | "newest"
  | "oldest"
  | "price_low"
  | "price_high"
  | "year_new"
  | "year_old"
  | "mileage_low";
type ViewMode = "grid" | "list";

const VIEW_MODE_STORAGE_KEY = "jc-export:vehicle-view-mode";

// How long to wait after the last keystroke in a text/number field before
// treating it as a real filter change. Short enough to feel responsive,
// long enough that typing "2015" doesn't fire four separate searches.
const DEBOUNCE_MS = 450;

type FilterDrafts = {
  search: string;
  yearFrom: string;
  yearTo: string;
  priceMin: string;
  priceMax: string;
};

function draftsFromParams(params: { get(key: string): string | null }): FilterDrafts {
  return {
    search: params.get("search") ?? "",
    yearFrom: params.get("year_from") ?? "",
    yearTo: params.get("year_to") ?? "",
    priceMin: params.get("price_min") ?? "",
    priceMax: params.get("price_max") ?? "",
  };
}

// make/body_type/fuel are comma-separated lists on the wire (the API matches
// any of them -- VehicleCatalogController::listOf), so the URL is the only
// state a multi-select checkbox group needs.
function parseList(raw: string | null): string[] {
  if (!raw) return [];
  return Array.from(new Set(raw.split(",").map((part) => part.trim()).filter(Boolean)));
}

export function VehicleBrowser({ vehicles, filters, destinations, pagination }: VehicleBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // A filter change is now a real round trip to the server component above
  // (it refetches the page with the new query string), so the UI needs a
  // pending state -- useTransition keeps the current results on screen,
  // dimmed, rather than flashing to empty while the new page loads.
  const [isPending, startTransition] = useTransition();

  const destinationPort = searchParams.get("destination_port") ?? "";
  // The homepage's brand tiles link in as a single `?brand=Toyota`; every
  // filter this component writes itself uses the API's own comma-separated
  // `make` key, so both are read here for as long as an old link might still
  // point at the legacy one.
  const makeList = parseList(searchParams.get("make") || searchParams.get("brand"));
  const bodyTypeList = parseList(searchParams.get("body_type"));
  const fuelList = parseList(searchParams.get("fuel"));
  const gradeMin = Number(searchParams.get("grade_min")) || 0;
  const sort = (searchParams.get("sort") as SortOption | null) || "newest";

  const [viewMode, setViewModeState] = useState<ViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The grid/list choice is a personal browsing preference, not something
  // worth round-tripping through the URL or the server -- localStorage is
  // exactly the "remembered per-viewer setting" case it's meant for. This
  // has to run after mount rather than in a lazy useState initializer: the
  // server always renders "grid" (it has no localStorage to read), and
  // reading a stored "list" during the client's first render would mismatch
  // that server HTML and trigger a hydration error across every card.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (stored === "grid" || stored === "list") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate one-time hydration of a per-viewer preference the server cannot see; see comment above.
        setViewModeState(stored);
      }
    } catch {
      // Private browsing or a locked-down browser: fall back to the default.
    }
  }, []);

  function setViewMode(mode: ViewMode) {
    setViewModeState(mode);
    try {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // Not fatal -- the choice just won't be remembered next visit.
    }
  }

  // Free-text and range inputs get a local draft so typing feels instant;
  // the draft is pushed to the URL (and so to the server) only after the
  // buyer pauses, and re-synced from the URL on the way back (cleared
  // filters, browser back/forward, a shared link).
  const [drafts, setDrafts] = useState<FilterDrafts>(() => draftsFromParams(searchParams));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local drafts to the URL (the source of truth) after navigation, not deriving state from props/state React already has.
    setDrafts(draftsFromParams(searchParams));
    // Re-sync whenever the URL's own filter values change, not on every
    // render -- searchParams.toString() is the stable primitive to key on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    const id = setTimeout(() => {
      const onUrl = draftsFromParams(searchParams);
      const trimmedSearch = drafts.search.trim();
      if (
        onUrl.search === trimmedSearch &&
        onUrl.yearFrom === drafts.yearFrom &&
        onUrl.yearTo === drafts.yearTo &&
        onUrl.priceMin === drafts.priceMin &&
        onUrl.priceMax === drafts.priceMax
      ) {
        return; // Nothing actually changed -- skip a no-op navigation.
      }

      pushParams({
        search: trimmedSearch || undefined,
        year_from: drafts.yearFrom || undefined,
        year_to: drafts.yearTo || undefined,
        price_min: drafts.priceMin || undefined,
        price_max: drafts.priceMax || undefined,
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts.search, drafts.yearFrom, drafts.yearTo, drafts.priceMin, drafts.priceMax]);

  /**
   * Writes `changes` into the query string and lets the server component
   * refetch -- this is the only place vehicle data changes now. Every call
   * resets `page` unless told not to: a filter change makes whatever page
   * the buyer was on meaningless (page 7 of a two-result search is a dead
   * end), while an actual page click is the one change that must not reset
   * itself.
   */
  function pushParams(changes: Record<string, string | undefined>, keepPage = false) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    }
    if (!keepPage) {
      next.delete("page");
    }
    const qs = next.toString();
    startTransition(() => {
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  // make/body_type/fuel are multi-select: the API takes each as a
  // comma-separated list and matches any value in it, so toggling a checkbox
  // just adds or removes its value from the list already on the URL.
  function toggleListValue(key: "make" | "body_type" | "fuel", list: string[], value: string) {
    const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
    const changes: Record<string, string | undefined> = {
      [key]: next.length ? next.join(",") : undefined,
    };
    if (key === "make") {
      // Replaces the legacy "brand" param too, so a URL never carries both a
      // stale single brand and a freshly-picked make list at once.
      changes.brand = undefined;
    }
    pushParams(changes);
  }

  function setSort(value: SortOption) {
    pushParams({ sort: value === "newest" ? undefined : value });
  }

  // A single value, not a list -- "grade 4 and up" is how buyers think about
  // condition, not "grade 4 or grade 4.5 or grade 5", so this stays a
  // minimum-grade select rather than a checkbox group.
  function setGradeMin(value: number) {
    pushParams({ grade_min: value > 0 ? String(value) : undefined });
  }

  function setPage(page: number) {
    pushParams({ page: page > 1 ? String(page) : undefined }, true);
  }

  function clearFilters() {
    setDrafts({ search: "", yearFrom: "", yearTo: "", priceMin: "", priceMax: "" });
    // Destination and shipment type are pricing context, not a filter --
    // clearing filters to start a fresh search must not also throw away the
    // landed price the buyer came here to see.
    const kept = new URLSearchParams();
    const port = searchParams.get("destination_port");
    const shipment = searchParams.get("shipment_type");
    if (port) kept.set("destination_port", port);
    if (shipment) kept.set("shipment_type", shipment);
    const qs = kept.toString();
    startTransition(() => {
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  const activeFilterCount =
    Number(makeList.length > 0) +
    Number(bodyTypeList.length > 0) +
    Number(fuelList.length > 0) +
    Number(Boolean(drafts.search)) +
    Number(Boolean(drafts.yearFrom || drafts.yearTo)) +
    Number(Boolean(drafts.priceMin || drafts.priceMax)) +
    Number(gradeMin > 0);

  const { page, lastPage, total, perPage } = pagination;
  const rangeStart = total === 0 ? 0 : (page - 1) * perPage + 1;
  const rangeEnd = Math.min(page * perPage, total);

  return (
    <section className={styles.browserSection} aria-label="Browse used vehicles">
      <DestinationSelector destinations={destinations} />

      <div className={styles.browserToolbar}>
        <label className={styles.searchField}>
          <Search aria-hidden="true" />
          <input
            type="search"
            value={drafts.search}
            onChange={(event) =>
              setDrafts((current) => ({ ...current, search: event.target.value }))
            }
            placeholder="Search make, model, stock number..."
          />
        </label>

        <button
          type="button"
          className={styles.mobileFilterButton}
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal aria-hidden="true" /> Filters
          {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
        </button>

        <div className={styles.toolbarEnd}>
          <div className={styles.sortField}>
            <span>Sort</span>
            <SelectField
              ariaLabel="Sort"
              value={sort}
              onChange={(next) => setSort(next as SortOption)}
              placeholder="Recently listed"
              options={SORT_OPTIONS}
              searchable={false}
            />
          </div>
          <div className={styles.viewControl} aria-label="Vehicle view">
            <button
              type="button"
              aria-label="Grid view"
              title="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="List view"
              title="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
            >
              <List aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.browserLayout}>
        {filtersOpen && (
          <button
            type="button"
            className={styles.filterBackdrop}
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
        )}

        <aside className={`${styles.filterPanel} ${filtersOpen ? styles.filterPanelOpen : ""}`}>
          <div className={styles.filterHeader}>
            <div>
              <SlidersHorizontal aria-hidden="true" />
              <strong>Refine vehicles</strong>
              {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
            </div>
            <button
              type="button"
              className={styles.closeFilters}
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              title="Close filters"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button type="button" className={styles.clearButton} onClick={clearFilters}>
              <RotateCcw aria-hidden="true" /> Clear all filters
            </button>
          )}

          <FilterGroup title="Make">
            {filters.makes.map((option) => (
              <CheckboxRow
                key={option.name}
                value={option.name}
                count={option.count}
                checked={makeList.includes(option.name)}
                onChange={() => toggleListValue("make", makeList, option.name)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Body type">
            {filters.bodyTypes.map((option) => (
              <CheckboxRow
                key={option.name}
                value={option.name}
                count={option.count}
                checked={bodyTypeList.includes(option.name)}
                onChange={() => toggleListValue("body_type", bodyTypeList, option.name)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Fuel">
            {filters.fuels.map((option) => (
              <CheckboxRow
                key={option.name}
                value={option.name}
                count={option.count}
                checked={fuelList.includes(option.name)}
                onChange={() => toggleListValue("fuel", fuelList, option.name)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Year">
            <div className={styles.rangeFields}>
              <label>
                <span>From</span>
                <input
                  type="number"
                  min={filters.years.min ?? undefined}
                  max={filters.years.max ?? undefined}
                  placeholder={filters.years.min != null ? String(filters.years.min) : "Any"}
                  value={drafts.yearFrom}
                  onChange={(event) =>
                    setDrafts((current) => ({ ...current, yearFrom: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>To</span>
                <input
                  type="number"
                  min={filters.years.min ?? undefined}
                  max={filters.years.max ?? undefined}
                  placeholder={filters.years.max != null ? String(filters.years.max) : "Any"}
                  value={drafts.yearTo}
                  onChange={(event) =>
                    setDrafts((current) => ({ ...current, yearTo: event.target.value }))
                  }
                />
              </label>
            </div>
          </FilterGroup>

          <FilterGroup title="FOB price">
            <div className={styles.rangeFields}>
              <label>
                <span>Min</span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  placeholder="No min"
                  value={drafts.priceMin}
                  onChange={(event) =>
                    setDrafts((current) => ({ ...current, priceMin: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Max</span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  placeholder="No max"
                  value={drafts.priceMax}
                  onChange={(event) =>
                    setDrafts((current) => ({ ...current, priceMax: event.target.value }))
                  }
                />
              </label>
            </div>
          </FilterGroup>

          <FilterGroup title="Auction grade">
            <div className={styles.gradeSelect}>
              <span>Minimum grade</span>
              <SelectField
                ariaLabel="Minimum auction grade"
                value={String(gradeMin)}
                onChange={(next) => setGradeMin(Number(next))}
                placeholder="Any grade"
                options={GRADE_FLOORS}
                searchable={false}
              />
            </div>
          </FilterGroup>

          <button
            type="button"
            className={styles.applyFiltersButton}
            onClick={() => setFiltersOpen(false)}
          >
            Show {total} vehicles
          </button>
        </aside>

        <div className={styles.resultsArea} data-pending={isPending ? "true" : undefined}>
          <div className={styles.resultsSummary}>
            <p aria-live="polite">
              {total > 0 ? (
                <>
                  <strong>{rangeStart}</strong>&ndash;<strong>{rangeEnd}</strong> of{" "}
                  <strong>{total}</strong> vehicle{total === 1 ? "" : "s"}
                </>
              ) : (
                <strong>0 vehicles</strong>
              )}
              {destinationPort ? ` · landed prices to ${destinationPort}` : ""}
            </p>
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters}>
                Reset filters
              </button>
            )}
          </div>

          {vehicles.length > 0 ? (
            <div className={`${styles.vehicleGrid} ${viewMode === "list" ? styles.vehicleList : ""}`}>
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search aria-hidden="true" />
              <h2>No matching vehicles</h2>
              <p>Try removing a filter or searching with a broader term.</p>
              <button type="button" onClick={clearFilters}>Clear all filters</button>
            </div>
          )}

          {lastPage > 1 && (
            <nav aria-label="Vehicle results pages">
              <Pagination
                pageCount={lastPage}
                currentPage={page - 1}
                onPageChange={({ selected }) => setPage(selected + 1)}
              />
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ vehicle, viewMode }: { vehicle: Vehicle; viewMode: ViewMode }) {
  const newArrival = isNewArrival(vehicle.listedAt);
  const reserved = vehicle.availability === "Reserved";
  const whatsapp = whatsappUrl(vehicle);

  return (
    <article className={styles.vehicleCard} data-view={viewMode}>
      <Link
        href={`/vehicles/${vehicle.slug}`}
        className={styles.vehicleImageLink}
        aria-label={`View ${vehicle.title}`}
      >
        <Image
          src={mediaSrc(vehicle.image)}
          alt={vehicle.title}
          fill
          sizes={
            viewMode === "list"
              ? "(max-width: 760px) 100vw, 240px"
              : "(max-width: 700px) 100vw, (max-width: 900px) 50vw, (max-width: 1180px) 33vw, 25vw"
          }
          className={styles.vehicleImage}
        />
        <div className={styles.badgeStackLeft}>
          {newArrival && <span className={styles.newBadge}>New arrival</span>}
          {vehicle.auctionGrade != null && (
            <span className={styles.gradeBadge}>Grade {vehicle.auctionGrade}</span>
          )}
        </div>
        {reserved && <span className={styles.reservedBadge}>Reserved</span>}
      </Link>

      <div className={styles.vehicleCardBody}>
        <div className={styles.vehicleMeta}>
          <span>{vehicle.brand}</span>
          <span className={styles.stockCode}>Stock {vehicle.stock}</span>
        </div>
        <h2>
          <Link href={`/vehicles/${vehicle.slug}`}>{vehicle.title}</Link>
        </h2>
        <div className={styles.stockMeta}>
          <span><MapPin aria-hidden="true" /> {vehicle.location}</span>
        </div>

        {/* A labelled grid rather than a run-on line of values. "2019 ·
            42,000 km · 2700cc · Automatic · 4WD" makes a buyer work out what
            each figure is; the label says it. Grid view hides the labels and
            the last few rows through CSS, so both views share one markup. */}
        <dl className={styles.vehicleSpecs}>
          {[
            { icon: CalendarDays, label: "Year", value: vehicle.year },
            { icon: Gauge, label: "Mileage", value: vehicle.mileage },
            { icon: CircleGauge, label: "Engine", value: vehicle.engine },
            { icon: Fuel, label: "Fuel", value: vehicle.fuel },
            { icon: Settings2, label: "Trans.", value: vehicle.transmission },
            { icon: Disc, label: "Steering", value: vehicle.steering },
            { icon: Cog, label: "Drive", value: vehicle.drivetrain },
            { icon: CarFront, label: "Body", value: vehicle.bodyType },
          ]
            .filter((spec) => spec.value !== null && spec.value !== undefined && spec.value !== "")
            .map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <dt>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>

        <p className={styles.cardDescription}>{vehicle.description}</p>

        <div className={styles.vehicleFooter}>
          <PriceDisplay vehicle={vehicle} />
          <div className={styles.footerActions}>
            {viewMode === "list" && whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className={styles.whatsappButton}
                aria-label={`WhatsApp us about stock ${vehicle.stock}`}
              >
                <MessageCircle aria-hidden="true" /> WhatsApp
              </a>
            )}
            <Link href={`/vehicles/${vehicle.slug}`}>
              View vehicle <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * The headline figure changes meaning depending on what JC can quote:
 * a landed total when the route is priced, FOB with an explicit "ask us"
 * when it is not, and plain FOB when no destination was chosen at all.
 * Whichever figure leads, it is always labelled -- a number on a used-car
 * listing with no label reads as a price, and this one might only be a part
 * of one.
 */
/* The sort menu's own options. "newest" is the placeholder rather than an
   entry, so the list never offers the reader what they already have. */
const SORT_OPTIONS = [
  { value: "oldest", label: "Oldest listed" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
  { value: "year_new", label: "Year: newest first" },
  { value: "year_old", label: "Year: oldest first" },
  { value: "mileage_low", label: "Lowest mileage" },
];

const GRADE_FLOORS = [
  { value: "4.5", label: "Grade 4.5+" },
  { value: "4", label: "Grade 4.0+" },
  { value: "3.5", label: "Grade 3.5+" },
];

function PriceDisplay({ vehicle }: { vehicle: Vehicle }) {
  const landed = vehicle.landed;

  if (landed && landed.priced && landed.total != null) {
    return (
      <div>
        <small>Est. landed &middot; {landed.port}</small>
        <strong>{formatCurrency(landed.total, landed.currency)}</strong>
        <span className={styles.fobSecondary}>FOB {formatVehiclePrice(vehicle)}</span>
      </div>
    );
  }

  if (landed && !landed.priced) {
    return (
      <div>
        <small>FOB price</small>
        <strong>{formatVehiclePrice(vehicle)}</strong>
        <span className={styles.freightNote}>Ask us for a freight quote to {landed.port}</span>
      </div>
    );
  }

  if (!hasPublicPrice(vehicle)) {
    // Not every unit carries a published asking price. Showing "$0" or an
    // empty slot would both read as a mistake, so the card says plainly that
    // the number comes from a person.
    return (
      <div>
        <small>FOB price</small>
        <strong className={styles.poaPrice}>{PRICE_ON_APPLICATION}</strong>
      </div>
    );
  }

  return (
    <div>
      <small>FOB price</small>
      <strong>{formatVehiclePrice(vehicle)}</strong>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  // A div with role="group", not a fieldset. A <legend> is laid out inside the
  // fieldset's border rather than as a normal block, so its margin is ignored
  // and browsers reserve their own space above the first control -- which is
  // the gap that made every filter heading float away from its options.
  // role + aria-label keeps the grouping for screen readers without it.
  return (
    <div className={styles.filterGroup} role="group" aria-label={title}>
      <p className={styles.filterGroupTitle}>{title}</p>
      {children}
    </div>
  );
}

function CheckboxRow({
  value,
  count,
  checked,
  onChange,
}: {
  value: string;
  count: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={styles.checkboxRow}>
      <span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        {value}
      </span>
      <small>{count}</small>
    </label>
  );
}
