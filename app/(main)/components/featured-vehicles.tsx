"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CircleGauge,
  Cog,
  Fuel,
  Gauge,
  MessageCircle,
  Settings2,
} from "lucide-react";

import {
  formatCurrency,
  formatVehiclePrice,
  mediaSrc,
  whatsappUrl,
  type Vehicle,
} from "@/data/vehicles";
import { SaveButton } from "@/app/components/save-button";
import { formatLocal, type LocalPrice } from "@/data/currency";
import styles from "../page.module.css";

/**
 * Each tab carries its own row of cars, fetched for that tab.
 *
 * The first version filtered one row of six client-side, which read as "JC
 * has one car in stock" when it only meant one of the six newest happened to
 * be stock. A shelf per tab cannot lie that way.
 */
export type FeaturedTab = {
  label: string;
  vehicles: Vehicle[];
  /** Where "browse all" leads, filtered to match the tab. */
  href: string;
  /** How many match across the whole catalogue, not just this row. */
  total?: number;
};

type FeaturedVehiclesProps = {
  tabs: FeaturedTab[];
  /** Null when the buyer is looking at USD, which is most of the time. */
  localPrice?: LocalPrice | null;
};

export function FeaturedVehicles({ tabs, localPrice }: FeaturedVehiclesProps) {
  // A tab leading to an empty shelf is worse than no tab: the buyer reads it
  // as "none anywhere", when it only means none right now.
  const availableTabs = useMemo(
    () => tabs.filter((tab) => tab.vehicles.length > 0),
    [tabs],
  );

  const [activeTab, setActiveTab] = useState(tabs[0]?.label ?? "");

  const selected = useMemo(
    () =>
      availableTabs.find((tab) => tab.label === activeTab) ??
      availableTabs[0] ??
      tabs[0],
    [activeTab, availableTabs, tabs],
  );

  const visibleVehicles = selected?.vehicles ?? [];

  const total = selected?.total;

  // The line under the button says what is on the other side of it, which
  // differs by tab: a car JC holds ships now, one from the catalogue is
  // bought in first.
  const blurb =
    selected?.label === "Available to order"
      ? "Cars JC will buy at auction for you. Prices are a guide until the car is secured."
      : selected?.label === "In stock"
        ? "Cars JC owns today, ready to invoice and ship."
        : "Full stock with filters, auction grades and landed-cost estimates.";

  const browseLabel =
    selected === undefined
      ? "Browse all vehicles"
      : total === undefined
        ? `Browse ${selected.label.toLowerCase()}`
        : selected.label === "All stock"
          ? `Browse all ${total} vehicles`
          : `Browse all ${total} ${selected.label.toLowerCase()}`;

  return (
    <div className={styles.vehiclesBrowser}>
      <div className={styles.filterBar} aria-label="Filter featured vehicles">
        {availableTabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={selected?.label === tab.label ? styles.filterActive : ""}
            aria-pressed={selected?.label === tab.label}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
            {tab.total === undefined ? null : <small> {tab.total}</small>}
          </button>
        ))}
      </div>

      <div className={styles.vehicleGrid} aria-live="polite">
        {visibleVehicles.map((vehicle) => (
          <article key={vehicle.id} className={styles.vehicleCard}>
            <Link
              href={`/vehicles/${vehicle.slug}`}
              className={styles.vehicleImageLink}
              aria-label={`View ${vehicle.title}`}
            >
              <Image
                src={mediaSrc(vehicle.image)}
                alt={vehicle.title}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className={styles.vehicleImage}
              />
              <span className={styles.usedBadge}>
                <BadgeCheck aria-hidden="true" /> Verified used
              </span>
              {/* The auction grade is the trust evidence this trade actually
                  runs on -- a dealer reads "4" before he reads anything else
                  on the card. It was on the listing and missing here. */}
              {vehicle.auctionGrade != null && (
                <span className={styles.gradeBadge}>
                  Grade {vehicle.auctionGrade}
                </span>
              )}
            </Link>

            <div className={styles.saveCorner}>
              <SaveButton slug={vehicle.slug} title={vehicle.title} />
            </div>

            <div className={styles.vehicleCardBody}>
              <div className={styles.vehicleMeta}>
                <span>{vehicle.brand}</span>
                {/* Buyers quote the stock number in every message they send,
                    so it belongs on the card and not only on the listing.
                    The year used to sit here too, beside a title that already
                    begins with it -- the same four digits twice. */}
                <span>{vehicle.stock}</span>
              </div>
              <h3>
                <Link href={`/vehicles/${vehicle.slug}`}>{vehicle.title}</Link>
              </h3>

              {/* Six facts, labelled, instead of two run together. The card
                  had room for exactly this and was spending it on white --
                  and "2500cc Petrol" on one line asked the reader to work out
                  which half was the engine. */}
              <dl className={styles.vehicleSpecs}>
                {[
                  { icon: CalendarDays, label: "Year", value: vehicle.year },
                  { icon: Gauge, label: "Mileage", value: vehicle.mileage },
                  { icon: CircleGauge, label: "Engine", value: vehicle.engine },
                  { icon: Fuel, label: "Fuel", value: vehicle.fuel },
                  { icon: Settings2, label: "Trans.", value: vehicle.transmission },
                  { icon: Cog, label: "Drive", value: vehicle.drivetrain },
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

              <div className={styles.vehicleFooter}>
                <CardPrice vehicle={vehicle} localPrice={localPrice} />
                <div className={styles.footerActions}>
                  {/* WhatsApp is the channel in most of JC's markets -- a
                      buyer in Mombasa or Karachi will message before they
                      ever fill in a form. It was on the listing card and the
                      vehicle page but not here, which is the row most people
                      see first. Hidden when no number is configured. */}
                  {whatsappUrl(vehicle) && (
                    <a
                      href={whatsappUrl(vehicle) as string}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.whatsappButton}
                      aria-label={`WhatsApp us about stock ${vehicle.stock}`}
                    >
                      <MessageCircle aria-hidden="true" /> WhatsApp
                    </a>
                  )}

                  {/* A catalogue car is not something to "view and buy" --
                      JC has to go and win it at auction first. Saying so on
                      the button is the difference between an enquiry and a
                      buyer who thinks the car is sitting in a yard. */}
                  <Link
                    href={`/vehicles/${vehicle.slug}`}
                    aria-label={
                      vehicle.stockKind === "order"
                        ? `Ask us to buy ${vehicle.title}`
                        : `View details for ${vehicle.title}`
                    }
                  >
                    {vehicle.stockKind === "order" ? "Ask us to buy" : "View"}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visibleVehicles.length === 0 && (
        <div className={styles.emptyState}>
          <strong>No featured vehicles in this category today.</strong>
          <Link href="/vehicles">Browse all vehicles</Link>
        </div>
      )}

      {/* The way out of the row and into the rest. It sits below the grid
          because that is where the eye is once six cars have been scanned,
          and it follows the tab: "browse all" under a tab called Available to
          order must not drop the buyer into unfiltered stock. */}
      <div className={styles.vehiclesFooter}>
        <Link
          href={selected?.href ?? "/vehicles"}
          className={styles.browseAllButton}
          prefetch
        >
          {browseLabel} <ArrowRight aria-hidden="true" />
        </Link>
        <p>{blurb}</p>
      </div>
    </div>
  );
}

/**
 * What a car costs, in the terms the buyer is thinking in.
 *
 * A dealer in Mombasa is comparing landed cost, not FOB: FOB is the number
 * JC thinks in, and the one every competitor quotes because it is the one
 * that needs no work. When a destination is known the delivered total leads
 * and FOB drops to a secondary line; when JC has no freight rate for that
 * route it says so rather than inventing a figure the buyer would hold JC to.
 *
 * Mirrors PriceDisplay on the listing deliberately -- the same car quoting
 * two different ways on two pages is how trust goes.
 */
function CardPrice({
  vehicle,
  localPrice,
}: {
  vehicle: Vehicle;
  localPrice?: LocalPrice | null;
}) {
  const landed = vehicle.landed;

  // The headline stays USD -- that is what JC invoices in and what the buyer
  // will actually be asked for. The local figure sits under it as a rough
  // translation, which is what a buyer wants for budgeting and nothing more.
  const local = formatLocal(
    landed?.priced && landed.total != null ? landed.total : vehicle.price,
    localPrice ?? null,
  );

  if (landed?.priced && landed.total != null) {
    return (
      <div>
        <small>Est. landed &middot; {landed.port}</small>
        <strong>
          {vehicle.priceIsEstimate ? "from " : ""}
          {formatCurrency(landed.total, landed.currency)}
        </strong>
        {local && <span className={styles.localPrice}>&asymp; {local}</span>}
        <span className={styles.fobSecondary}>FOB {formatVehiclePrice(vehicle)}</span>
      </div>
    );
  }

  if (landed && !landed.priced) {
    return (
      <div>
        <small>FOB price</small>
        <strong>{formatVehiclePrice(vehicle)}</strong>
        {local && <span className={styles.localPrice}>&asymp; {local}</span>}
        <span className={styles.freightNote}>
          Ask us for a freight quote to {landed.port}
        </span>
      </div>
    );
  }

  return (
    <div>
      <small>{vehicle.priceIsEstimate ? "Guide price" : "FOB price"}</small>
      <strong>
        {vehicle.priceIsEstimate ? "from " : ""}
        {formatVehiclePrice(vehicle)}
      </strong>
      {local && <span className={styles.localPrice}>&asymp; {local}</span>}
    </div>
  );
}
