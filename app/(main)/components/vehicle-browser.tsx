"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  Fuel,
  Gauge,
  Grid2X2,
  List,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  formatVehiclePrice,
  isRemoteVehicleMedia,
  type Vehicle,
} from "@/data/vehicles";
import { Pagination } from "./pagination";
import styles from "../vehicles/page.module.css";

type InitialFilters = {
  make?: string;
  bodyType?: string;
  minYear?: number;
  maxPrice?: number;
};

type VehicleBrowserProps = {
  vehicles: Vehicle[];
  initialFilters?: InitialFilters;
};

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "mileage";
type ViewMode = "grid" | "list";

export function VehicleBrowser({ vehicles, initialFilters = {} }: VehicleBrowserProps) {
  const lowestYear = Math.min(...vehicles.map((vehicle) => vehicle.year));
  const highestYear = Math.max(...vehicles.map((vehicle) => vehicle.year));
  const highestPrice = Math.max(...vehicles.map((vehicle) => vehicle.price));

  const initialMake = vehicles.find(
    (vehicle) => vehicle.brand.toLowerCase() === initialFilters.make?.toLowerCase(),
  )?.brand;
  const initialBodyType = vehicles.find(
    (vehicle) =>
      vehicle.bodyType.toLowerCase() === initialFilters.bodyType?.toLowerCase(),
  )?.bodyType;

  const [query, setQuery] = useState("");
  const [selectedMakes, setSelectedMakes] = useState<string[]>(
    initialMake ? [initialMake] : [],
  );
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(
    initialBodyType ? [initialBodyType] : [],
  );
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [minYear, setMinYear] = useState(initialFilters.minYear ?? lowestYear);
  const [maxYear, setMaxYear] = useState(highestYear);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? highestPrice);
  const [minimumGrade, setMinimumGrade] = useState(0);
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const makes = useMemo(() => countValues(vehicles.map((vehicle) => vehicle.brand)), [vehicles]);
  const bodyTypes = useMemo(
    () => countValues(vehicles.map((vehicle) => vehicle.bodyType)),
    [vehicles],
  );
  const fuels = useMemo(() => countValues(vehicles.map((vehicle) => vehicle.fuel)), [vehicles]);

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchingVehicles = vehicles.filter((vehicle) => {
      const searchableText = [
        vehicle.brand,
        vehicle.model,
        vehicle.title,
        vehicle.stock,
        vehicle.location,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (!selectedMakes.length || selectedMakes.includes(vehicle.brand)) &&
        (!selectedBodyTypes.length || selectedBodyTypes.includes(vehicle.bodyType)) &&
        (!selectedFuels.length || selectedFuels.includes(vehicle.fuel)) &&
        vehicle.year >= minYear &&
        vehicle.year <= maxYear &&
        vehicle.price >= minPrice &&
        vehicle.price <= maxPrice &&
        vehicle.auctionGrade >= minimumGrade
      );
    });

    return [...matchingVehicles].sort((a, b) => {
      if (sort === "oldest") return a.year - b.year;
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "mileage") return a.mileageKm - b.mileageKm;
      return b.year - a.year;
    });
  }, [
    maxPrice,
    maxYear,
    minPrice,
    minYear,
    minimumGrade,
    query,
    selectedBodyTypes,
    selectedFuels,
    selectedMakes,
    sort,
    vehicles,
  ]);

  const itemsPerPage = viewMode === "grid" ? 9 : 8;
  const pageCount = Math.ceil(filteredVehicles.length / itemsPerPage);
  const filterKey = JSON.stringify({
    maxPrice,
    maxYear,
    minPrice,
    minYear,
    minimumGrade,
    query,
    selectedBodyTypes,
    selectedFuels,
    selectedMakes,
    sort,
    viewMode,
  });
  const [pagination, setPagination] = useState({ key: filterKey, page: 0 });
  const currentPage = pagination.key === filterKey ? pagination.page : 0;
  const startIndex = currentPage * itemsPerPage;
  const visibleVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

  const activeFilterCount =
    selectedMakes.length +
    selectedBodyTypes.length +
    selectedFuels.length +
    Number(minYear !== lowestYear || maxYear !== highestYear) +
    Number(minPrice !== 0 || maxPrice !== highestPrice) +
    Number(minimumGrade > 0);

  function clearFilters() {
    setQuery("");
    setSelectedMakes([]);
    setSelectedBodyTypes([]);
    setSelectedFuels([]);
    setMinYear(lowestYear);
    setMaxYear(highestYear);
    setMinPrice(0);
    setMaxPrice(highestPrice);
    setMinimumGrade(0);
  }

  return (
    <section className={styles.browserSection} aria-label="Browse used vehicles">
      <div className={styles.browserToolbar}>
        <label className={styles.searchField}>
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
          <label className={styles.sortField}>
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
              <option value="newest">Newest year</option>
              <option value="oldest">Oldest year</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="mileage">Lowest mileage</option>
            </select>
          </label>
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
            {makes.map(({ value, count }) => (
              <CheckboxRow
                key={value}
                value={value}
                count={count}
                checked={selectedMakes.includes(value)}
                onChange={(checked) =>
                  setSelectedMakes((current) => toggleValue(current, value, checked))
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Body type">
            {bodyTypes.map(({ value, count }) => (
              <CheckboxRow
                key={value}
                value={value}
                count={count}
                checked={selectedBodyTypes.includes(value)}
                onChange={(checked) =>
                  setSelectedBodyTypes((current) => toggleValue(current, value, checked))
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Fuel">
            {fuels.map(({ value, count }) => (
              <CheckboxRow
                key={value}
                value={value}
                count={count}
                checked={selectedFuels.includes(value)}
                onChange={(checked) =>
                  setSelectedFuels((current) => toggleValue(current, value, checked))
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Year">
            <div className={styles.rangeFields}>
              <label>
                <span>From</span>
                <input
                  type="number"
                  min={lowestYear}
                  max={maxYear}
                  value={minYear}
                  onChange={(event) => setMinYear(Number(event.target.value) || lowestYear)}
                />
              </label>
              <label>
                <span>To</span>
                <input
                  type="number"
                  min={minYear}
                  max={highestYear}
                  value={maxYear}
                  onChange={(event) => setMaxYear(Number(event.target.value) || highestYear)}
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
                  max={maxPrice}
                  step={500}
                  value={minPrice}
                  onChange={(event) => setMinPrice(Number(event.target.value) || 0)}
                />
              </label>
              <label>
                <span>Max</span>
                <input
                  type="number"
                  min={minPrice}
                  max={highestPrice}
                  step={500}
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value) || highestPrice)}
                />
              </label>
            </div>
          </FilterGroup>

          <FilterGroup title="Auction grade">
            <label className={styles.gradeSelect}>
              <span>Minimum grade</span>
              <select
                value={minimumGrade}
                onChange={(event) => setMinimumGrade(Number(event.target.value))}
              >
                <option value={0}>Any grade</option>
                <option value={4}>Grade 4.0+</option>
                <option value={4.5}>Grade 4.5+</option>
                <option value={4.8}>Grade 4.8+</option>
              </select>
            </label>
          </FilterGroup>

          <button
            type="button"
            className={styles.applyFiltersButton}
            onClick={() => setFiltersOpen(false)}
          >
            Show {filteredVehicles.length} vehicles
          </button>
        </aside>

        <div className={styles.resultsArea}>
          <div className={styles.resultsSummary}>
            <p>
              <strong>{filteredVehicles.length}</strong> vehicles match your search
            </p>
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters}>
                Reset filters
              </button>
            )}
          </div>

          {visibleVehicles.length > 0 ? (
            <div className={`${styles.vehicleGrid} ${viewMode === "list" ? styles.vehicleList : ""}`}>
              {visibleVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search aria-hidden="true" />
              <h2>No matching vehicles</h2>
              <p>Try removing a filter or searching with a broader model name.</p>
              <button type="button" onClick={clearFilters}>Clear all filters</button>
            </div>
          )}

          {pageCount > 1 && (
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={({ selected }) =>
                setPagination({ key: filterKey, page: selected })
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ vehicle, viewMode }: { vehicle: Vehicle; viewMode: ViewMode }) {
  return (
    <article className={styles.vehicleCard} data-view={viewMode}>
      <Link
        href={`/vehicles/${vehicle.slug}`}
        className={styles.vehicleImageLink}
        aria-label={`View ${vehicle.title}`}
      >
        <Image
          src={vehicle.image}
          alt={vehicle.title}
          fill
          sizes={
            viewMode === "list"
              ? "(max-width: 760px) 100vw, 360px"
              : "(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 33vw"
          }
          className={styles.vehicleImage}
          unoptimized={isRemoteVehicleMedia(vehicle.image)}
        />
        <span className={styles.conditionBadge}>
          <BadgeCheck aria-hidden="true" /> {vehicle.condition}
        </span>
        <span className={styles.gradeBadge}>Grade {vehicle.auctionGrade}</span>
      </Link>

      <div className={styles.vehicleCardBody}>
        <div className={styles.vehicleMeta}>
          <span>{vehicle.brand}</span>
          <span>{vehicle.year}</span>
        </div>
        <h2>
          <Link href={`/vehicles/${vehicle.slug}`}>{vehicle.title}</Link>
        </h2>
        <div className={styles.stockMeta}>
          <span>Stock {vehicle.stock}</span>
          <span><MapPin aria-hidden="true" /> {vehicle.location}</span>
        </div>

        <div className={styles.vehicleSpecs}>
          <span><Gauge aria-hidden="true" /> {vehicle.mileage}</span>
          <span><Fuel aria-hidden="true" /> {vehicle.engine}</span>
          <span><Check aria-hidden="true" /> {vehicle.transmission}</span>
        </div>

        <p className={styles.cardDescription}>{vehicle.description}</p>

        <div className={styles.vehicleFooter}>
          <div>
            <small>FOB price</small>
            <strong>{formatVehiclePrice(vehicle)}</strong>
          </div>
          <Link href={`/vehicles/${vehicle.slug}`}>
            View vehicle <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className={styles.filterGroup}>
      <legend>{title}</legend>
      {children}
    </fieldset>
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

function toggleValue(current: string[], value: string, checked: boolean) {
  return checked ? Array.from(new Set([...current, value])) : current.filter((item) => item !== value);
}

function countValues(values: string[]) {
  const counts = values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}
