import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Lato } from "next/font/google";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileSearch,
  Globe2,
  Handshake,
  MapPin,
  MessageCircle,
  ShieldCheck,
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
  title: "About Japan Car Export | Japanese Used Vehicle Export",
  description:
    "Learn how Japan Car Export sources, verifies, documents, and ships Japanese used vehicles for buyers worldwide.",
};

const principles = [
  {
    icon: FileSearch,
    title: "Evidence before enthusiasm",
    description: "Condition details, stock identity, and available inspection evidence come before the sales pitch.",
  },
  {
    icon: ShieldCheck,
    title: "Costs made understandable",
    description: "Vehicle, freight, insurance, and destination charges are explained as separate parts of the deal.",
  },
  {
    icon: Handshake,
    title: "One accountable contact",
    description: "The buyer should know who is handling the request, shipment, and document follow-up.",
  },
  {
    icon: Globe2,
    title: "Built for cross-border buying",
    description: "We organize the information international buyers need when they cannot inspect a vehicle in person.",
  },
];

export default function AboutPage() {
  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <PublicPageHero
        current="About"
        kicker="About Japan Car Export"
        title={<>Used-vehicle exporting, <em>made more transparent.</em></>}
        description="Japan Car Export helps buyers source Japanese used vehicles with clearer condition evidence, practical shipping support, and documentation organized for international delivery."
        image="/home-hero.webp"
        imageAlt="Japanese used vehicles prepared for export at a port"
        actions={
          <>
            <Link href="/vehicles" className={styles.heroPrimary}>Browse vehicles <ArrowRight aria-hidden="true" /></Link>
            <Link href="/contact" className={styles.heroSecondary}>Talk to our team</Link>
          </>
        }
      />

      <section className={styles.splitSection} aria-labelledby="about-story-title">
        <div className={styles.mediaMosaic}>
          <div className={styles.mediaLarge}>
            <Image src="/cards/4.png" alt="Used vehicle photographed in Japan" fill sizes="(max-width: 900px) 100vw, 46vw" />
          </div>
          <div className={styles.mediaSmall}>
            <Image src="/cards/1.png" alt="White used hatchback available for export" fill sizes="(max-width: 900px) 50vw, 23vw" />
          </div>
          <div className={styles.mediaSmall}>
            <Image src="/cards/5.png" alt="Black used sedan in a Japanese vehicle yard" fill sizes="(max-width: 900px) 50vw, 23vw" />
          </div>
          <div className={styles.mediaCaption}>
            <BadgeCheck aria-hidden="true" /> Actual vehicle media matters
          </div>
        </div>

        <div className={styles.splitContent}>
          <p className={styles.sectionKicker}>Our role</p>
          <h2 id="about-story-title">Reduce uncertainty between <em>Japan and arrival.</em></h2>
          <p className={styles.leadText}>
            Buying a used vehicle across borders is not difficult because of the car alone. It is difficult because the buyer must judge condition, cost, shipping, and paperwork from a distance.
          </p>
          <p className={styles.bodyText}>
            Japan Car Export brings those moving parts into one clear process. We support vehicle selection, condition review, export preparation, shipping coordination, and document handover while keeping the buyer informed.
          </p>
          <ul className={styles.checkList}>
            <li><Check aria-hidden="true" /> Japan-sourced stock and sourcing requests</li>
            <li><Check aria-hidden="true" /> Auction and condition information</li>
            <li><Check aria-hidden="true" /> RoRo and container coordination</li>
            <li><Check aria-hidden="true" /> Export and shipping documents</li>
          </ul>
          <Link href="/services" className={styles.blueButton}>Explore our services <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="values-title">
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionKicker}>How we work</p>
            <h2 id="values-title">Four principles behind <em>every export.</em></h2>
          </div>
          <p>Good service is not a collection of promises. It is a repeatable way of handling information, cost, and communication.</p>
        </div>
        <div className={styles.valueGrid}>
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <article key={principle.title} className={styles.valueCard}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /></div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.operationsBand} aria-label="Japan Car Export operating model">
        <div className={styles.operationsGrid}>
          <span><strong>Japan</strong><small>Vehicle sourcing and export preparation</small></span>
          <span><strong>Worldwide</strong><small>RoRo and container delivery support</small></span>
          <span><strong>Buyer first</strong><small>Condition and cost communication</small></span>
          <span><strong>One process</strong><small>From request to document handover</small></span>
        </div>
      </section>

      <section className={styles.locationSection} aria-labelledby="locations-title">
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.sectionKicker}>Connected operations</p>
            <h2 id="locations-title">Sourcing in Japan, <em>support where buyers are.</em></h2>
          </div>
          <p>Vehicle activity and customer support may happen in different places, but the buyer should experience one coordinated export process.</p>
        </div>
        <div className={styles.locationGrid}>
          <article className={styles.locationCard}>
            <MapPin aria-hidden="true" />
            <span>Vehicle operations</span>
            <h3>Japan sourcing network</h3>
            <p>Used-vehicle sourcing, stock coordination, yard information, and export preparation through Japanese market channels.</p>
          </article>
          <article className={styles.locationCard}>
            <MessageCircle aria-hidden="true" />
            <span>Client support</span>
            <h3>International buyer desk</h3>
            <p>Quote preparation, documentation follow-up, shipping communication, and multilingual buyer assistance.</p>
          </article>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div>
          <p>Ready to start?</p>
          <h2>Tell us the vehicle and destination. <em>We will organize the rest.</em></h2>
        </div>
        <Link href="/quote" className={styles.redButton}>Request a quote <ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
