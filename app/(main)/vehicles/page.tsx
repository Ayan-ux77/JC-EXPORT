import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Lato } from "next/font/google";
import { BadgeCheck, ChevronRight, Globe2, Ship, WalletCards } from "lucide-react";

import { vehicles } from "@/data/vehicles";
import { VehicleBrowser } from "../components/vehicle-browser";
import styles from "./page.module.css";

const bodyFont = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-body",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Japanese Used Vehicles for Export | JC Export",
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

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const query = await searchParams;
  const initialMake = firstValue(query.make) ?? firstValue(query.brand) ?? "";

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
            Search {vehicles.length} available vehicles with condition details,
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

      <VehicleBrowser
        vehicles={vehicles}
        initialFilters={{
          make: initialMake,
          bodyType: firstValue(query.bodyType) ?? "",
          minYear: Number(firstValue(query.year)) || undefined,
          maxPrice: Number(firstValue(query.maxPrice)) || undefined,
        }}
      />
    </main>
  );
}
