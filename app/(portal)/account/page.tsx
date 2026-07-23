import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  FileText,
  MessageSquareText,
  Ship,
} from "lucide-react";

import { getPortalOverview } from "@/data/customer-session";

import { EmptySection, InquiryRow, ShipmentSummary } from "./portal-ui";
import styles from "./portal.module.css";

export default async function AccountPage() {
  const overview = await getPortalOverview();
  const recent = overview.inquiries.slice(0, 3);
  const shipments = overview.inquiries.filter((item) => item.shipment).slice(0, 2);

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Account overview</p>
          <h1>Welcome, {overview.profile.full_name.split(" ")[0]}</h1>
          <span>
            Track every step from inquiry to vehicle delivery.
          </span>
        </div>
        <Link href="/vehicles" className={styles.primaryAction}>
          Find a vehicle <ArrowRight aria-hidden="true" />
        </Link>
      </header>

      <section className={styles.metrics} aria-label="Account summary">
        <Metric icon={MessageSquareText} label="Inquiries" value={overview.summary.inquiries} />
        <Metric icon={FileText} label="Quotations" value={overview.summary.quotations} />
        <Metric icon={CircleDollarSign} label="Reservations" value={overview.summary.reservations} />
        <Metric icon={Ship} label="Shipments" value={overview.summary.shipments} />
      </section>

      <section className={styles.pageSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p>Recent activity</p>
            <h2>Your vehicle requests</h2>
          </div>
          <Link href="/account/inquiries">View all <ArrowRight aria-hidden="true" /></Link>
        </div>
        {recent.length ? (
          <div className={styles.rowList}>
            {recent.map((inquiry) => <InquiryRow key={inquiry.reference} inquiry={inquiry} />)}
          </div>
        ) : (
          <EmptySection
            title="No inquiries yet"
            description="Choose a listed vehicle or tell us what you want us to source from Japan."
            action={{ href: "/vehicles", label: "Browse vehicles" }}
          />
        )}
      </section>

      {shipments.length > 0 && (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div>
              <p>Logistics</p>
              <h2>Active shipments</h2>
            </div>
            <Link href="/account/shipments">All shipments <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.rowList}>
            {shipments.map((inquiry) => (
              <ShipmentSummary key={inquiry.reference} inquiry={inquiry} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageSquareText;
  label: string;
  value: number;
}) {
  return (
    <article>
      <Icon aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
