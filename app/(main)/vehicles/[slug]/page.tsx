import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fraunces, Lato } from "next/font/google";
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

import { getVehicle, getVehicles } from "@/data/vehicle-service";
import { isRemoteVehicleMedia } from "@/data/vehicles";
import { VehicleGallery } from "../../components/vehicle-gallery";
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

type VehicleDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({ params }: VehicleDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    return { title: "Vehicle not found | JC Export" };
  }

  return {
    title: `${vehicle.year} ${vehicle.brand} ${vehicle.model} | JC Export`,
    description: `${vehicle.condition} ${vehicle.year} ${vehicle.brand} ${vehicle.model}, ${vehicle.mileage}, ${vehicle.engine}, FOB ${formatMoney(vehicle.price, vehicle.currency)}.`,
  };
}

export default async function VehicleDetailsPage({ params }: VehicleDetailsPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    notFound();
  }

  const vehicles = await getVehicles();
  const totalPrice = vehicle.price + vehicle.freight + vehicle.insurance;
  const hasShippingEstimate = vehicle.freight > 0 || vehicle.insurance > 0;
  const relatedVehicles = vehicles
    .filter(
      (item) =>
        item.id !== vehicle.id &&
        (item.brand === vehicle.brand || item.bodyType === vehicle.bodyType),
    )
    .slice(0, 3);
  const whatsappText = encodeURIComponent(
    `Hello JC Export, I am interested in ${vehicle.year} ${vehicle.brand} ${vehicle.model}, stock ${vehicle.stock}.`,
  );

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

        <section className={styles.productLayout} aria-labelledby="vehicle-title">
          <div className={styles.galleryColumn}>
            <VehicleGallery images={vehicle.images} title={vehicle.title} />

            <section className={styles.disclosureBar} aria-label="Vehicle disclosure summary">
              <span><BadgeCheck aria-hidden="true" /> {vehicle.condition} vehicle</span>
              <span><ShieldCheck aria-hidden="true" /> Auction grade {vehicle.auctionGrade}</span>
              <span><FileCheck2 aria-hidden="true" /> Stock verified</span>
            </section>
          </div>

          <aside className={styles.purchasePanel}>
            <div className={styles.statusRow}>
              <span className={styles.availableBadge}>{vehicle.availability || "Available"}</span>
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
                <span>FOB price</span>
                <strong>{formatMoney(vehicle.price, vehicle.currency)}</strong>
              </div>
              <small>Freight and destination charges quoted separately</small>
            </div>

            <div className={styles.primaryActions}>
              <Link
                href={`/quote?vehicle=${vehicle.slug}`}
                className={styles.primaryAction}
              >
                Request export quote <ArrowRight aria-hidden="true" />
              </Link>
              <a
                href={`https://wa.me/923001234567?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className={styles.secondaryAction}
              >
                <MessageCircle aria-hidden="true" /> Ask a question
              </a>
            </div>

            <div className={styles.advisorCard}>
              <span className={styles.advisorAvatar}>JC</span>
              <div>
                <strong>Vehicle export desk</strong>
                <small>Replies with availability, inspection, and shipping details</small>
              </div>
              <BadgeCheck aria-label="Verified JC Export contact" />
            </div>

            {hasShippingEstimate && <div className={styles.estimateCard}>
              <div className={styles.estimateHeader}>
                <div>
                  <span>Example export estimate</span>
                  <strong>FOB + freight + insurance</strong>
                </div>
                <Ship aria-hidden="true" />
              </div>
              <dl>
                <div><dt>Vehicle FOB</dt><dd>{formatMoney(vehicle.price, vehicle.currency)}</dd></div>
                <div><dt>Ocean freight</dt><dd>{formatMoney(vehicle.freight, vehicle.currency)}</dd></div>
                <div><dt>Marine insurance</dt><dd>{formatMoney(vehicle.insurance, vehicle.currency)}</dd></div>
                <div className={styles.estimateTotal}><dt>Estimated CIF</dt><dd>{formatMoney(totalPrice, vehicle.currency)}</dd></div>
              </dl>
              <p>Final freight depends on destination port and sailing availability.</p>
            </div>}
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
            <strong>{vehicle.auctionGradeLabel || vehicle.auctionGrade}</strong>
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
                      src={relatedVehicle.image}
                      alt={relatedVehicle.title}
                      fill
                      sizes="(max-width: 700px) 100vw, 33vw"
                      unoptimized={isRemoteVehicleMedia(relatedVehicle.image)}
                    />
                  </Link>
                  <div>
                    <span>{relatedVehicle.year} / {relatedVehicle.brand}</span>
                    <h3><Link href={`/vehicles/${relatedVehicle.slug}`}>{relatedVehicle.model}</Link></h3>
                    <p>{relatedVehicle.mileage} · Grade {relatedVehicle.auctionGrade}</p>
                    <strong>{formatMoney(relatedVehicle.price, relatedVehicle.currency)} FOB</strong>
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

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
