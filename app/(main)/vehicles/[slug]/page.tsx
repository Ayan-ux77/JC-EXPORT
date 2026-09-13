import type { Metadata } from "next";
import { bodyFont, displayFont } from "@/app/fonts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleGauge,
  FileCheck2,
  Fuel,
  Gauge,
  MapPin,
  MessageCircle,
  Route,
  Settings2,
  ShieldCheck,
  Ship,
  Users,
} from "lucide-react";

import { getDestinations, getVehicle, getVehicles, type ShipmentType } from "@/data/vehicle-service";
import { formatCurrency, mediaSrc, whatsappUrl } from "@/data/vehicles";
import { DestinationSelector } from "../../components/destination-selector";
import { VehicleGallery } from "../../components/vehicle-gallery";
import styles from "./page.module.css";

type SearchValue = string | string[] | undefined;

type VehicleDetailsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, SearchValue>>;
};

function firstValue(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({ params }: VehicleDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    return { title: "Vehicle not found | Japan Car Export" };
  }

  return {
    title: `${vehicle.year} ${vehicle.brand} ${vehicle.model} | Japan Car Export`,
    description: `${vehicle.condition} ${vehicle.year} ${vehicle.brand} ${vehicle.model}, ${vehicle.mileage}, ${vehicle.engine}, FOB ${formatCurrency(vehicle.price, vehicle.currency)}.`,
  };
}

export default async function VehicleDetailsPage({ params, searchParams }: VehicleDetailsPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const destinationPort = firstValue(query.destination_port) || undefined;
  const shipmentType =
    firstValue(query.shipment_type) === "CONTAINER" ? ("CONTAINER" as ShipmentType) : undefined;

  // As on the listing page: the vehicle itself must fetch cleanly or the
  // page 404s/errors honestly, but a destinations outage should only cost
  // the selector, not the whole product page.
  const [vehicle, destinations] = await Promise.all([
    getVehicle(slug, { destinationPort, shipmentType }),
    getDestinations().catch(() => []),
  ]);

  if (!vehicle) {
    notFound();
  }

  const landed = vehicle.landed;
  const vehicles = await getVehicles();
  const relatedVehicles = vehicles
    .filter(
      (item) =>
        item.id !== vehicle.id &&
        (item.brand === vehicle.brand || item.bodyType === vehicle.bodyType),
    )
    .slice(0, 3);
  const whatsapp = whatsappUrl(vehicle);

  const specifications = [
    { label: "Year", value: vehicle.year, icon: CalendarDays },
    { label: "Mileage", value: vehicle.mileage, icon: Gauge },
    { label: "Engine", value: vehicle.engine, icon: CircleGauge },
    { label: "Transmission", value: vehicle.transmission, icon: Settings2 },
    { label: "Drivetrain", value: vehicle.drivetrain, icon: Route },
    { label: "Fuel", value: vehicle.fuel, icon: Fuel },
    { label: "Body type", value: vehicle.bodyType, icon: BadgeCheck },
    { label: "Steering", value: vehicle.steering, icon: Route },
    { label: "Exterior", value: vehicle.color, icon: BadgeCheck },
    { label: "Interior", value: vehicle.interior, icon: BadgeCheck },
    { label: "Doors", value: vehicle.doors, icon: Settings2 },
    { label: "Seats", value: vehicle.seats, icon: Users },
  ];

  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight aria-hidden="true" />
          <Link href="/vehicles">Vehicles</Link>
          <ChevronRight aria-hidden="true" />
          <span>{vehicle.brand}</span>
          <ChevronRight aria-hidden="true" />
          <strong>{vehicle.model}</strong>
        </nav>

        <Link href="/vehicles" className={styles.backLink}>
          <ArrowLeft aria-hidden="true" /> Back to all vehicles
        </Link>

        {/* Same selector as the listing, same URL params -- a buyer who
            picked Mombasa on the listing and clicked into a car should not
            have to say so twice. */}
        <Suspense fallback={null}>
          <div className={styles.destinationRow}>
            <DestinationSelector destinations={destinations} />
          </div>
        </Suspense>

        <section className={styles.productLayout} aria-labelledby="vehicle-title">
          <div className={styles.galleryColumn}>
            <VehicleGallery images={vehicle.images} title={vehicle.title} />

            <section className={styles.disclosureBar} aria-label="Vehicle disclosure summary">
              <span><BadgeCheck aria-hidden="true" /> {vehicle.condition} vehicle</span>
              {vehicle.auctionGrade != null && (
                <span><ShieldCheck aria-hidden="true" /> Auction grade {vehicle.auctionGrade}</span>
              )}
              <span><FileCheck2 aria-hidden="true" /> Stock verified</span>
            </section>
          </div>

          <aside className={styles.purchasePanel}>
            <div className={styles.statusRow}>
              <span className={vehicle.availability === "Reserved" ? styles.reservedBadge : styles.availableBadge}>
                {vehicle.availability || "Available"}
              </span>
              <span>{vehicle.condition}</span>
            </div>

            <p className={styles.vehicleEyebrow}>
              {vehicle.brand} / {vehicle.bodyType}
            </p>
            <h1 id="vehicle-title">
              {vehicle.year} {vehicle.brand} <em>{vehicle.model}</em>
            </h1>

            <div className={styles.stockRow}>
              <span>Stock {vehicle.stock}</span>
              <span><MapPin aria-hidden="true" /> {vehicle.location}</span>
            </div>

            <div className={styles.quickSpecs}>
              <span><Gauge aria-hidden="true" /><strong>{vehicle.mileage}</strong><small>Mileage</small></span>
              <span><CircleGauge aria-hidden="true" /><strong>{vehicle.engine}</strong><small>Engine</small></span>
              <span><Fuel aria-hidden="true" /><strong>{vehicle.fuel}</strong><small>Fuel</small></span>
            </div>

            <div className={styles.priceBox}>
              <div>
                <span>{landed?.priced && landed.total != null ? `Est. landed · ${landed.port}` : "FOB price"}</span>
                <strong>
                  {landed?.priced && landed.total != null
                    ? formatCurrency(landed.total, landed.currency)
                    : formatCurrency(vehicle.price, vehicle.currency)}
                </strong>
              </div>
              <small>
                {landed?.priced && landed.total != null
                  ? `FOB ${formatCurrency(vehicle.price, vehicle.currency)} · estimate, confirmed at booking`
                  : landed && !landed.priced
                    ? `We do not have a freight rate to ${landed.port} yet -- ask us for a quote`
                    : vehicle.price == null
                      ? "This unit is priced on request -- send us your destination and we will come back with a figure"
                      : "Freight and destination charges quoted separately"}
              </small>
            </div>

            <div className={`${styles.primaryActions} ${!whatsapp ? styles.primaryActionsSingle : ""}`}>
              <Link
                href={`/quote?vehicle=${vehicle.slug}`}
                className={styles.primaryAction}
              >
                Request export quote <ArrowRight aria-hidden="true" />
              </Link>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.secondaryAction}
                >
                  <MessageCircle aria-hidden="true" /> WhatsApp us
                </a>
              )}
            </div>

            <div className={styles.advisorCard}>
              <span className={styles.advisorAvatar}>JC</span>
              <div>
                <strong>Vehicle export desk</strong>
                <small>Replies with availability, inspection, and shipping details</small>
              </div>
              <BadgeCheck aria-label="Verified Japan Car Export contact" />
            </div>

            {landed && landed.priced && landed.total != null && (
              <div className={styles.estimateCard}>
                <div className={styles.estimateHeader}>
                  <div>
                    <span>Estimated landed cost</span>
                    <strong>FOB + freight + insurance to {landed.port}</strong>
                  </div>
                  <Ship aria-hidden="true" />
                </div>
                <dl>
                  <div>
                    <dt>Vehicle FOB</dt>
                    <dd>{formatCurrency(landed.fob, landed.currency)}</dd>
                  </div>
                  <div>
                    <dt>Ocean freight ({landed.shipment_type === "CONTAINER" ? "Container" : "RoRo"})</dt>
                    <dd>{formatCurrency(landed.freight ?? 0, landed.currency)}</dd>
                  </div>
                  <div>
                    <dt>Marine insurance</dt>
                    <dd>{formatCurrency(landed.insurance ?? 0, landed.currency)}</dd>
                  </div>
                  <div className={styles.estimateTotal}>
                    <dt>Estimated total landed</dt>
                    <dd>{formatCurrency(landed.total, landed.currency)}</dd>
                  </div>
                </dl>
                <p>Estimate only -- freight moves with sailing schedules and fuel prices. Final cost is confirmed at booking.</p>
              </div>
            )}

            {landed && !landed.priced && (
              <div className={styles.estimateCard}>
                <div className={styles.estimateHeader}>
                  <div>
                    <span>Landed cost</span>
                    <strong>No standing freight rate to {landed.port}</strong>
                  </div>
                  <Ship aria-hidden="true" />
                </div>
                <p>
                  {whatsapp
                    ? "Message us on WhatsApp with this stock number and we will quote freight to your port directly."
                    : "Request an export quote and we will price freight to your port directly."}
                </p>
              </div>
            )}
          </aside>
        </section>

        <section className={styles.detailsSection} aria-labelledby="specifications-title">
          <div className={styles.sectionHeading}>
            <p>Vehicle facts</p>
            <h2 id="specifications-title">Full <em>specification.</em></h2>
          </div>

          <div className={styles.specGrid}>
            {specifications.map((specification) => {
              const Icon = specification.icon;
              return (
                <div key={specification.label} className={styles.specItem}>
                  <Icon aria-hidden="true" />
                  <span>{specification.label}</span>
                  <strong>{specification.value}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.conditionSection} aria-labelledby="condition-title">
          <div className={styles.conditionSummary}>
            <p className={styles.sectionKicker}>Condition disclosure</p>
            <h2 id="condition-title">Inspection details, <em>before commitment.</em></h2>
            <p>{vehicle.description}</p>
            <ul>
              {(vehicle.features?.length
                ? vehicle.features.slice(0, 4).map((feature) => feature.name)
                : [
                    "Auction grade recorded",
                    "Mileage shown in listing",
                    "Chassis and stock reference available",
                    "Additional inspection can be requested",
                  ]
              ).map((item) => (
                <li key={item}><Check aria-hidden="true" /> {item}</li>
              ))}
              {vehicle.damages?.map((damage) => (
                <li key={`${damage.area}-${damage.description}`}>
                  <Check aria-hidden="true" /> {damage.area}: {damage.description}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.gradeCard}>
            <span>Auction grade</span>
            <strong>{vehicle.auctionGradeLabel || vehicle.auctionGrade || "Not graded"}</strong>
            <small>Condition: {vehicle.condition}</small>
            <div>
              <ShieldCheck aria-hidden="true" />
              <p><strong>Need more evidence?</strong><span>Ask for additional photos, a walkaround video, or an independent inspection.</span></p>
            </div>
          </div>
        </section>

        {relatedVehicles.length > 0 && (
          <section className={styles.relatedSection} aria-labelledby="related-title">
            <div className={styles.relatedHeading}>
              <div>
                <p className={styles.sectionKicker}>Similar options</p>
                <h2 id="related-title">Related <em>vehicles.</em></h2>
              </div>
              <Link href="/vehicles">View all vehicles <ArrowRight aria-hidden="true" /></Link>
            </div>

            <div className={styles.relatedGrid}>
              {relatedVehicles.map((relatedVehicle) => (
                <article key={relatedVehicle.id} className={styles.relatedCard}>
                  <Link href={`/vehicles/${relatedVehicle.slug}`} className={styles.relatedImage}>
                    <Image
                      src={mediaSrc(relatedVehicle.image)}
                      alt={relatedVehicle.title}
                      fill
                      sizes="(max-width: 700px) 100vw, 33vw"
                    />
                  </Link>
                  <div>
                    <span>{relatedVehicle.year} / {relatedVehicle.brand}</span>
                    <h3><Link href={`/vehicles/${relatedVehicle.slug}`}>{relatedVehicle.model}</Link></h3>
                    <p>
                      {relatedVehicle.mileage}
                      {relatedVehicle.auctionGrade != null ? ` · Grade ${relatedVehicle.auctionGrade}` : ""}
                    </p>
                    <strong>{formatCurrency(relatedVehicle.price, relatedVehicle.currency)} FOB</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
