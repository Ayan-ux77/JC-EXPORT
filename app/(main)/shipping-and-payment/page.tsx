import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Lato } from "next/font/google";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Check,
  Container,
  FileCheck2,
  Landmark,
  ReceiptText,
  ShieldAlert,
  Ship,
} from "lucide-react";

import { PublicPageHero } from "../components/public-page-hero";
import styles from "../components/public-pages.module.css";

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
  title: "Shipping and Payment Guide | JC Export",
  description:
    "Understand Japanese used-vehicle export pricing, payment, RoRo and container shipping, documents, and destination costs.",
};

const costLayers = [
  {
    icon: ReceiptText,
    title: "Vehicle & Japan charges",
    text: "Vehicle price plus the Japan-side services listed in your quote, such as inland movement, export handling, or inspection.",
  },
  {
    icon: Ship,
    title: "Ocean freight & insurance",
    text: "Freight depends on vehicle size, route, port, shipping method, and current carrier pricing. Insurance is shown when included.",
  },
  {
    icon: Building2,
    title: "Destination charges",
    text: "Customs duty, local tax, port fees, clearance, registration, and inland delivery are usually paid locally by the buyer.",
  },
];

const paymentSteps = [
  ["Confirm the vehicle", "Review stock identity, condition information, quote basis, destination, and requested services."],
  ["Verify the invoice", "Check the beneficiary and bank details through an established JC Export contact before transferring funds."],
  ["Send payment", "Use the invoice reference and share transfer evidence so the payment can be matched efficiently."],
  ["Receive confirmation", "We confirm cleared funds and communicate the next vehicle, booking, and document milestones."],
];

const documents = [
  "Commercial invoice",
  "Export certificate and translation",
  "Bill of lading or carrier release details",
  "Inspection certificate when ordered",
  "Other destination documents stated in the quote",
  "Booking and shipment information when available",
];

export default function ShippingAndPaymentPage() {
  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <PublicPageHero
        current="Shipping & payment"
        kicker="Export guide"
        title={<>Know what happens between <em>invoice and arrival.</em></>}
        description="A practical guide to export cost layers, secure payment, shipping methods, document milestones, and the destination responsibilities every buyer should confirm."
        actions={
          <>
            <Link href="/quote" className={styles.heroPrimary}>
              Get a destination quote <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/faq" className={styles.heroSecondary}>Read buyer FAQ</Link>
          </>
        }
      />

      <section className={styles.guideIntro} aria-labelledby="cost-title">
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionKicker}>The complete cost</p>
            <h2 id="cost-title">Separate the price into <em>three clear layers.</em></h2>
          </div>
          <p>An attractive vehicle price is only useful when you understand what is included and what will still be payable at destination.</p>
        </div>
        <div className={styles.costGrid}>
          {costLayers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <article key={layer.title} className={styles.costCard}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /></div>
                <h3>{layer.title}</h3>
                <p>{layer.text}</p>
              </article>
            );
          })}
        </div>
        <div className={styles.guideNotice}>
          <ShieldAlert aria-hidden="true" />
          <p><strong>Confirm locally before purchase.</strong> Import age limits, taxes, inspections, emissions rules, registration, and port charges vary by country and can change independently of JC Export.</p>
        </div>
      </section>

      <section className={styles.paymentSection} aria-labelledby="payment-title">
        <div className={styles.paymentHeading}>
          <BadgeDollarSign aria-hidden="true" />
          <p className={styles.sectionKicker}>Payment flow</p>
          <h2 id="payment-title">A controlled payment process, <em>step by step.</em></h2>
          <p>Vehicle preparation and booking begin according to the payment terms shown on your invoice.</p>
        </div>
        <ol className={styles.paymentTimeline}>
          {paymentSteps.map(([title, text], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
        <div className={styles.paymentWarning}>
          <Landmark aria-hidden="true" />
          <p>Banking details should never be accepted from an unexpected message alone. Verify any change using a trusted contact method before sending money.</p>
        </div>
      </section>

      <section className={styles.guideShipping} aria-labelledby="shipping-title">
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionKicker}>Shipping method</p>
            <h2 id="shipping-title">Choose the method that fits <em>the vehicle and route.</em></h2>
          </div>
          <p>Final availability and price depend on the carrier, origin port, destination, vehicle dimensions, and sailing schedule.</p>
        </div>
        <div className={styles.guideComparison}>
          <article>
            <Ship aria-hidden="true" />
            <span>RoRo</span>
            <h3>Drive-on, drive-off shipping</h3>
            <p>Often the most direct option for a running vehicle where a suitable RoRo route is available.</p>
            <ul>
              <li><Check aria-hidden="true" /> Commonly economical for one vehicle</li>
              <li><Check aria-hidden="true" /> Vehicle must meet carrier acceptance rules</li>
              <li><Check aria-hidden="true" /> Personal cargo is generally restricted</li>
            </ul>
          </article>
          <article>
            <Container aria-hidden="true" />
            <span>Container</span>
            <h3>Containerized vehicle shipping</h3>
            <p>Useful for multiple units, selected non-running vehicles, parts, or routes better served by containers.</p>
            <ul>
              <li><Check aria-hidden="true" /> Flexible for consolidated shipments</li>
              <li><Check aria-hidden="true" /> Loading and destination handling add cost</li>
              <li><Check aria-hidden="true" /> Container and port rules still apply</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.documentSection} aria-labelledby="documents-title">
        <div>
          <FileCheck2 aria-hidden="true" />
          <p className={styles.sectionKicker}>Document handover</p>
          <h2 id="documents-title">Your shipment needs <em>the right paper trail.</em></h2>
          <p>The exact document set follows the quote, shipping method, carrier process, and destination requirements.</p>
        </div>
        <ul className={styles.documentGrid}>
          {documents.map((document) => <li key={document}><Check aria-hidden="true" /> {document}</li>)}
        </ul>
      </section>

      <section className={styles.ctaBand}>
        <div>
          <p>Need an exact figure?</p>
          <h2>Request the vehicle cost for <em>your destination port.</em></h2>
        </div>
        <Link href="/quote" className={styles.redButton}>Request a quote <ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
