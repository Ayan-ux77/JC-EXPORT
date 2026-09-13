import type { Metadata } from "next";
import { bodyFont, displayFont } from "@/app/fonts";
import Link from "next/link";
import { BadgeCheck, Check, Clock3, FileCheck2, ShieldCheck, Ship } from "lucide-react";

import { getVehicle } from "@/data/vehicle-service";
import { PublicPageHero } from "../components/public-page-hero";
import { QuoteRequestForm } from "../components/quote-request-form";
import styles from "../components/public-pages.module.css";

export const metadata: Metadata = {
  title: "Request a Japanese Vehicle Export Quote | Japan Car Export",
  description:
    "Request a clear vehicle, freight, insurance, and export-document quote for a Japanese used vehicle.",
};

type QuotePageProps = {
  searchParams: Promise<{ vehicle?: string | string[] }>;
};

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const query = await searchParams;
  const vehicleSlug = Array.isArray(query.vehicle) ? query.vehicle[0] : query.vehicle;
  const selectedVehicle = vehicleSlug ? await getVehicle(vehicleSlug) : undefined;
  const initialVehicle = selectedVehicle
    ? `${selectedVehicle.stock} — ${selectedVehicle.year} ${selectedVehicle.brand} ${selectedVehicle.model}`
    : "";

  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <PublicPageHero
        current="Request a quote"
        kicker="Vehicle and shipping estimate"
        title={<>A clearer export quote, <em>from the start.</em></>}
        description="Tell us the vehicle, destination, and budget. We will prepare a practical quote covering vehicle cost, freight options, insurance, and required export documents."
      />

      <section className={styles.quotePage} aria-labelledby="quote-form-title">
        <div className={styles.quoteIntro}>
          <p className={styles.sectionKicker}>Build your request</p>
          <h2 id="quote-form-title">Three details make a <em>useful quote.</em></h2>
          <p>
            Vehicle choice, destination, and contact information. You can start
            with a stock number or ask us to source a vehicle from Japan.
          </p>
        </div>

        <div className={styles.quoteLayout}>
          <QuoteRequestForm
            initialVehicle={initialVehicle}
            initialVehicleId={selectedVehicle?.slug}
          />

          <aside className={styles.quoteAside}>
            <div className={styles.responseCard}>
              <Clock3 aria-hidden="true" />
              <div>
                <span>Typical first response</span>
                <strong>During the same business day</strong>
                <p>Complex sourcing requests may need auction availability checks.</p>
              </div>
            </div>

            <div className={styles.quoteIncludes}>
              <span>What your quote can include</span>
              <ul>
                <li><Check aria-hidden="true" /> Vehicle FOB price</li>
                <li><Check aria-hidden="true" /> Freight to destination port</li>
                <li><Check aria-hidden="true" /> Marine insurance</li>
                <li><Check aria-hidden="true" /> Inspection options</li>
                <li><Check aria-hidden="true" /> Export documentation</li>
                <li><Check aria-hidden="true" /> Estimated sailing availability</li>
              </ul>
            </div>

            <div className={styles.quoteTrustGrid}>
              <span><BadgeCheck aria-hidden="true" /><strong>Actual stock</strong><small>Reference the exact unit</small></span>
              <span><Ship aria-hidden="true" /><strong>Route options</strong><small>RoRo or container</small></span>
              <span><ShieldCheck aria-hidden="true" /><strong>Condition first</strong><small>Evidence before payment</small></span>
              <span><FileCheck2 aria-hidden="true" /><strong>Documents</strong><small>Prepared for export</small></span>
            </div>

            <p className={styles.quoteAsideLink}>
              Need general help instead? <Link href="/contact">Contact the export desk</Link>.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
