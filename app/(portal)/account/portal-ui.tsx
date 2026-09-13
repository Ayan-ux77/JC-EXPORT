import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, Download, MapPin } from "lucide-react";

import type { PortalInquiry, PortalInvoice, PortalShipment } from "@/data/customer-session";

import styles from "./portal.module.css";

export function StatusBadge({ value }: { value: string }) {
  const tone =
    /cancel|reject|overdue|lost/i.test(value)
      ? styles.statusDanger
      : /paid|verified|arrived|deliver|release|won/i.test(value)
        ? styles.statusSuccess
        : /draft|new|pending|await|planning|request|progress|quoted|booked|sailed|yard|issued/i.test(value)
          ? styles.statusWarning
          : styles.statusNeutral;
  return <span className={`${styles.status} ${tone}`}>{value}</span>;
}

/**
 * The seven-stage journey comes from the API as `progress` -- CustomerJourney
 * on the ERP side -- so this reads its label and completion straight off
 * that array instead of keeping a second copy here that could drift from it.
 */
export function InquiryRow({ inquiry }: { inquiry: PortalInquiry }) {
  return (
    <article className={styles.inquiryRow}>
      <div className={styles.vehicleThumb}>
        <CarFront aria-hidden="true" />
      </div>
      <div className={styles.inquiryIdentity}>
        <div>
          <span>{inquiry.reference}</span>
          <StatusBadge value={inquiry.status} />
        </div>
        <h2>{inquiry.car?.title || "Vehicle sourcing request"}</h2>
        <p>
          {inquiry.car?.stock
            ? `Stock ${inquiry.car.stock}`
            : inquiry.message || "Our export team is reviewing your request."}
        </p>
      </div>
      <div className={styles.inquiryProgress}>
        {inquiry.progress.map((stage) => (
          <ProgressItem key={stage.key} label={stage.label} complete={stage.complete} />
        ))}
      </div>
      <Link
        href={`/account/inquiries/${encodeURIComponent(inquiry.reference)}`}
        className={styles.rowAction}
        aria-label={`Open inquiry ${inquiry.reference}`}
        title="Open inquiry"
      >
        <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}

export function EmptySection({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <section className={styles.emptySection}>
      <CarFront aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <Link href={action.href}>{action.label}</Link>}
    </section>
  );
}

/**
 * A shipping leg for one car, not one inquiry -- several cars can ride on the
 * same invoice, and each still gets its own vessel. There is no reference to
 * link back to an inquiry from here, so the chassis is what identifies it and
 * there is nowhere for this card to link on to.
 */
export function ShipmentSummary({ shipment }: { shipment: PortalShipment }) {
  return (
    <article className={styles.shipmentRow}>
      <div>
        <span>{shipment.car.chassis || shipment.car.stock || "Shipment"}</span>
        <h2>{shipment.car.title || "Vehicle shipment"}</h2>
        <p>
          <MapPin aria-hidden="true" />{" "}
          {[shipment.pol, shipment.pod].filter(Boolean).join(" → ") || "Route to be confirmed"}
        </p>
      </div>
      <div className={styles.shipmentSchedule}>
        <span><CalendarDays aria-hidden="true" /> ETD {formatDate(shipment.etd)}</span>
        <span><CalendarDays aria-hidden="true" /> ETA {formatDate(shipment.eta)}</span>
      </div>
      <StatusBadge value={shipment.status} />
    </article>
  );
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "To be confirmed";
  }
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

/**
 * One control, reused everywhere an invoice appears (Payments, the
 * dashboard, an enquiry's detail page), so a customer sees the same download
 * button rather than three different-looking ones for the same action.
 */
export function InvoiceDownloadLink({
  invoice,
}: {
  invoice: { id: number; invoice_number: string };
}) {
  return (
    <a
      href={`/api/account/documents/invoice/${invoice.id}`}
      className={styles.tableDownload}
      aria-label={`Download invoice ${invoice.invoice_number}`}
      title="Download invoice PDF"
    >
      <Download aria-hidden="true" />
    </a>
  );
}

/** Invoice lines carry the car, not the invoice header, in this API. */
export function invoiceVehicleSummary(invoice: PortalInvoice) {
  return invoice.lines
    .map((line) => line.chassis_number || line.description)
    .filter(Boolean)
    .join(", ");
}

export function formatMoney(value: string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return `${currency} ${value}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function ProgressItem({
  label,
  complete = false,
}: {
  label: string;
  complete?: boolean;
}) {
  return (
    <span className={complete ? styles.progressComplete : undefined}>
      <i />
      {label}
    </span>
  );
}
