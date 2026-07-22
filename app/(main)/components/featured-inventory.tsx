"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BadgeCheck, Fuel, Gauge } from "lucide-react";

import type { Vehicle } from "@/data/vehicles";
import styles from "../page.module.css";

type FeaturedInventoryProps = {
  vehicles: Vehicle[];
};

const filters = [
  { label: "All stock", match: () => true },
  { label: "Sedans", match: (vehicle: Vehicle) => vehicle.bodyType === "Sedan" },
  {
    label: "Hatchbacks",
    match: (vehicle: Vehicle) => vehicle.bodyType === "Hatchback",
  },
  { label: "Hybrids", match: (vehicle: Vehicle) => vehicle.fuel === "Hybrid" },
  {
    label: "Under 80,000 km",
    match: (vehicle: Vehicle) => vehicle.mileageKm < 80000,
  },
];

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function FeaturedInventory({ vehicles }: FeaturedInventoryProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0].label);

  const visibleVehicles = useMemo(() => {
    const selectedFilter = filters.find((filter) => filter.label === activeFilter);
    return selectedFilter ? vehicles.filter(selectedFilter.match) : vehicles;
  }, [activeFilter, vehicles]);

  return (
    <div className={styles.inventoryBrowser}>
      <div className={styles.filterBar} aria-label="Filter featured vehicles">
        {filters.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className={activeFilter === filter.label ? styles.filterActive : ""}
            aria-pressed={activeFilter === filter.label}
            onClick={() => setActiveFilter(filter.label)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.vehicleGrid} aria-live="polite">
        {visibleVehicles.map((vehicle) => (
          <article key={vehicle.id} className={styles.vehicleCard}>
            <Link
              href={`/inventory/${vehicle.slug}`}
              className={styles.vehicleImageLink}
              aria-label={`View ${vehicle.title}`}
            >
              <Image
                src={vehicle.image}
                alt={vehicle.title}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className={styles.vehicleImage}
              />
              <span className={styles.usedBadge}>
                <BadgeCheck aria-hidden="true" /> Verified used
              </span>
            </Link>

            <div className={styles.vehicleCardBody}>
              <div className={styles.vehicleMeta}>
                <span>{vehicle.brand}</span>
                <span>{vehicle.year}</span>
              </div>
              <h3>
                <Link href={`/inventory/${vehicle.slug}`}>{vehicle.title}</Link>
              </h3>

              <div className={styles.vehicleSpecs}>
                <span>
                  <Gauge aria-hidden="true" /> {vehicle.mileage}
                </span>
                <span>
                  <Fuel aria-hidden="true" /> {vehicle.engine} {vehicle.fuel}
                </span>
              </div>

              <div className={styles.vehicleFooter}>
                <div>
                  <small>FOB price</small>
                  <strong>{priceFormatter.format(vehicle.price)}</strong>
                </div>
                <Link
                  href={`/inventory/${vehicle.slug}`}
                  aria-label={`View details for ${vehicle.title}`}
                  title="View vehicle details"
                >
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visibleVehicles.length === 0 && (
        <div className={styles.emptyState}>
          <strong>No featured vehicles in this category today.</strong>
          <Link href="/inventory">Browse the complete inventory</Link>
        </div>
      )}
    </div>
  );
}
