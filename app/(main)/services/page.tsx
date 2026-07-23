import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Lato } from "next/font/google";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  FileCheck2,
  Search,
  ShieldCheck,
  Ship,
} from "lucide-react";

import { PublicPageHero } from "../components/public-page-hero";
import styles from "../components/public-pages.module.css";

const bodyFont = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-body" });
const displayFont = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], weight: ["500", "600", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Japanese Used Vehicle Export Services | JC Export",
  description: "Vehicle sourcing, condition review, inspection, international shipping, and export-document support for Japanese used vehicles.",
};

const services = [
  {
    id: "sourcing",
    number: "01",
    icon: Search,
    title: "Vehicle sourcing",
    lead: "Start with current stock or a specific request.",
    description: "We help buyers define the make, model, year, mileage, body type, and budget, then review matching stock or sourcing opportunities in Japan.",
    deliverables: ["Current-stock matching", "Make and model sourcing", "Budget and year guidance", "Stock identity confirmation"],
    image: "/cards/1.png",
  },
  {
    id: "inspection",
    number: "02",
    icon: ClipboardCheck,
    title: "Condition and inspection",
    lead: "Decide with evidence, not assumptions.",
    description: "Available auction information, mileage, chassis references, photos, videos, and additional inspection options are organized before commitment.",
    deliverables: ["Auction-grade context", "Condition photo review", "Walkaround video requests", "Independent inspection options"],
    image: "/cards/4.png",
  },
  {
    id: "shipping",
    number: "03",
    icon: Ship,
    title: "International shipping",
    lead: "Use the route that fits the vehicle and destination.",
    description: "We coordinate RoRo, full-container, or shared-container options based on port access, vehicle size, sailing availability, and buyer priorities.",
    deliverables: ["RoRo and container options", "Freight quotation", "Sailing coordination", "Marine insurance support"],
    image: "/home-hero.webp",
  },
  {
    id: "documents",
    number: "04",
    icon: FileCheck2,
    title: "Export documentation",
    lead: "Paperwork prepared for the vehicle and route.",
    description: "Commercial and shipping documents are organized for export and destination clearance, with country-specific requirements confirmed where possible.",
    deliverables: ["Commercial invoice", "Export certificate", "Bill of lading", "Supporting shipping documents"],
    image: "/cards/5.png",
  },
];

export default function ServicesPage() {
  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <PublicPageHero
        current="Services"
        kicker="End-to-end export support"
        title={<>From vehicle search to <em>shipping documents.</em></>}
        description="Choose only the support you need or let one team coordinate sourcing, condition review, shipping, insurance, and export documentation."
        image="/home-hero.webp"
        imageAlt="Used Japanese vehicles at an export port"
        actions={
          <>
            <Link href="/quote" className={styles.heroPrimary}>Request a quote <ArrowRight aria-hidden="true" /></Link>
            <Link href="/shipping-and-payment" className={styles.heroSecondary}>Shipping and payment guide</Link>
          </>
        }
      />

      <nav className={styles.serviceNav} aria-label="Service sections">
        {services.map((service) => (
          <a key={service.id} href={`#${service.id}`}><span>{service.number}</span>{service.title}</a>
        ))}
      </nav>

      <section className={styles.servicesIntro}>
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionKicker}>What we handle</p>
            <h2>One export journey, <em>four accountable stages.</em></h2>
          </div>
          <p>Every service is organized around a buyer decision: what to buy, whether the condition is acceptable, how it should ship, and which documents must arrive with it.</p>
        </div>
      </section>

      <div className={styles.serviceDetails}>
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <section key={service.id} id={service.id} className={styles.serviceDetail} data-reverse={index % 2 === 1}>
              <div className={styles.serviceImage}>
                <Image src={service.image} alt="" fill sizes="(max-width: 900px) 100vw, 48vw" />
                <span>{service.number} / 04</span>
              </div>
              <div className={styles.serviceContent}>
                <Icon aria-hidden="true" />
                <p>{service.title}</p>
                <h2>{service.lead}</h2>
                <span>{service.description}</span>
                <ul>
                  {service.deliverables.map((deliverable) => <li key={deliverable}><Check aria-hidden="true" />{deliverable}</li>)}
                </ul>
                <Link href="/quote">Discuss this service <ArrowRight aria-hidden="true" /></Link>
              </div>
            </section>
          );
        })}
      </div>

      <section className={styles.shippingComparison} aria-labelledby="shipping-options-title">
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionKicker}>Shipping options</p>
            <h2 id="shipping-options-title">RoRo or container, <em>chosen for the route.</em></h2>
          </div>
          <p>Neither method is universally better. The right choice depends on port access, vehicle type, protection needs, and schedule.</p>
        </div>
        <div className={styles.comparisonGrid}>
          <article><Ship aria-hidden="true" /><span>RoRo</span><h3>Efficient for running vehicles</h3><p>The vehicle is driven on and off the vessel. It is often practical where regular RoRo sailings serve the destination.</p><ul><li><Check aria-hidden="true" />Usually simpler loading</li><li><Check aria-hidden="true" />Good for individual vehicles</li><li><Check aria-hidden="true" />Port availability required</li></ul></article>
          <article><ShieldCheck aria-hidden="true" /><span>Container</span><h3>More enclosed transport</h3><p>The vehicle is secured inside a container, with full or shared-container options depending on route and availability.</p><ul><li><Check aria-hidden="true" />Enclosed shipping environment</li><li><Check aria-hidden="true" />Useful for multiple units or parts</li><li><Check aria-hidden="true" />Loading costs may be higher</li></ul></article>
        </div>
        <div className={styles.comparisonNote}><BadgeCheck aria-hidden="true" /><p><strong>We quote the practical option.</strong><span>Final recommendations depend on the vehicle, destination port, carrier schedule, and current freight conditions.</span></p></div>
      </section>

      <section className={styles.ctaBand}>
        <div><p>Need a complete export plan?</p><h2>Share the vehicle and destination. <em>We will map the route.</em></h2></div>
        <Link href="/quote" className={styles.redButton}>Start a quote <ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
