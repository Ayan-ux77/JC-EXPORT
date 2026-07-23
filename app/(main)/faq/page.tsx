import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Lato } from "next/font/google";
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  FileCheck2,
  MessageCircle,
  ReceiptText,
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
  title: "Frequently Asked Questions | JC Export",
  description:
    "Answers about Japanese used vehicles, auction grades, export pricing, payment, shipping, and documents.",
};

const faqGroups = [
  {
    id: "vehicles",
    label: "Vehicles & condition",
    icon: CircleHelp,
    questions: [
      {
        question: "Are JC Export vehicles new or used?",
        answer:
          "JC Export specializes in used vehicles from Japan. Age, mileage, repair history, auction information, and visible condition differ from vehicle to vehicle, so each purchase should be judged from its own listing and supporting evidence.",
      },
      {
        question: "What does an auction grade mean?",
        answer:
          "An auction grade is a useful summary assigned at a Japanese vehicle auction, but it is not a warranty. The auction sheet, inspector notes, interior grade, mileage, photos, and any translation should be reviewed together.",
      },
      {
        question: "Can I request more photos or an inspection?",
        answer:
          "Yes, when the vehicle and yard access allow it. Tell us what you need checked before payment. Additional third-party inspection services may carry a separate fee and can affect the shipment timeline.",
      },
      {
        question: "Can JC Export source a vehicle that is not listed?",
        answer:
          "Yes. Share the make, model, year range, transmission, fuel type, budget, and destination. We can use those requirements to look through available stock and Japanese auction channels.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & payment",
    icon: ReceiptText,
    questions: [
      {
        question: "What is the difference between FOB and CIF?",
        answer:
          "FOB generally covers the vehicle and export handling up to loading at the Japanese port. CIF generally adds ocean freight and marine insurance to the named destination port. Your written quote is the controlling document and will show exactly what is included.",
      },
      {
        question: "Which costs are usually not included in an export quote?",
        answer:
          "Destination customs duty, local tax, port handling, clearing-agent fees, registration, inspection, storage, and inland transport are normally controlled at destination and may be excluded. We identify known exclusions on the quote so you can confirm them locally.",
      },
      {
        question: "How do I pay?",
        answer:
          "Payment instructions are issued with the invoice and should be verified directly with JC Export before transfer. Do not send funds to an account introduced only through a forwarded message or an unexpected change of banking details.",
      },
      {
        question: "Can a vehicle be reserved without payment?",
        answer:
          "Availability is not guaranteed until the reservation or payment terms shown on the invoice are satisfied. Used-vehicle stock can sell quickly, so any hold period must be confirmed in writing.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Ship,
    questions: [
      {
        question: "Should I choose RoRo or container shipping?",
        answer:
          "RoRo is often the simpler and more economical choice for a running vehicle on an available route. A container may suit multiple vehicles, non-running units, parts, or destinations where container service is more practical. Route, port rules, cost, and sailing availability decide the best method.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Timing depends on vehicle readiness, export documentation, vessel space, port schedule, route, transshipment, and destination clearance. We provide an estimate, but vessel dates and arrival dates can change.",
      },
      {
        question: "Can you ship to my country?",
        answer:
          "We support many international destinations, subject to vessel service and local import rules. Before purchase, the buyer should confirm vehicle-age limits, steering-side rules, emissions requirements, duties, and registration eligibility in the destination country.",
      },
      {
        question: "How will I receive shipment updates?",
        answer:
          "Updates are shared as the booking and documents become available. Depending on the carrier, this may include vessel name, voyage, departure estimate, arrival estimate, and bill-of-lading details.",
      },
    ],
  },
  {
    id: "documents",
    label: "Documents & arrival",
    icon: FileCheck2,
    questions: [
      {
        question: "Which documents are supplied?",
        answer:
          "The document set depends on the sale and destination. It may include the commercial invoice, export certificate and translation, bill of lading or release details, inspection certificate when ordered, and other documents stated in the quote.",
      },
      {
        question: "Does JC Export pay my import duty or clear the vehicle?",
        answer:
          "Not unless that service is specifically included in writing. Import duty, local tax, port clearance, registration, and destination compliance are normally the buyer's responsibility or handled by the buyer's local clearing agent.",
      },
      {
        question: "What information must I provide for the documents?",
        answer:
          "Provide the consignee's exact legal name, address, phone number, identification or company details, and any destination-specific information requested. Incorrect details can delay document correction and port clearance.",
      },
      {
        question: "What should I do if there is a problem at arrival?",
        answer:
          "Photograph the vehicle and issue immediately, preserve port or carrier records, and contact us before repairs or disposal. Carrier and insurance claims have deadlines, so prompt evidence is important.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <PublicPageHero
        current="FAQ"
        kicker="Buyer knowledge"
        title={<>Clear answers before you <em>commit to a vehicle.</em></>}
        description="Used-vehicle exports involve condition evidence, shipping terms, destination rules, and paperwork. Start here, then ask us about the details specific to your vehicle and country."
        actions={
          <>
            <Link href="/quote" className={styles.heroPrimary}>
              Request a quote <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/contact" className={styles.heroSecondary}>Ask a question</Link>
          </>
        }
      />

      <div className={styles.faqPage}>
        <nav className={styles.faqCategoryNav} aria-label="FAQ categories">
          {faqGroups.map((group) => {
            const Icon = group.icon;
            return (
              <a key={group.id} href={`#${group.id}`}>
                <Icon aria-hidden="true" />
                <span>{group.label}</span>
              </a>
            );
          })}
        </nav>

        <div className={styles.faqLayout}>
          <div className={styles.faqMain}>
            {faqGroups.map((group, groupIndex) => (
              <section key={group.id} id={group.id} className={styles.faqGroup}>
                <div className={styles.faqGroupHeading}>
                  <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <p className={styles.sectionKicker}>Frequently asked</p>
                    <h2>{group.label}</h2>
                  </div>
                </div>
                <div className={styles.faqList}>
                  {group.questions.map((item) => (
                    <details key={item.question}>
                      <summary>
                        {item.question}
                        <ChevronDown aria-hidden="true" />
                      </summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className={styles.faqSupport}>
            <MessageCircle aria-hidden="true" />
            <p>Still deciding?</p>
            <h2>Ask about your exact vehicle and destination.</h2>
            <span>We can clarify the stock, quote basis, route, and documents before you proceed.</span>
            <Link href="/contact" className={styles.blueButton}>
              Contact JC Export <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
