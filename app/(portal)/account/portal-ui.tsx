import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, Download, MapPin } from "lucide-react";

import type {
  PortalInquiry,
  PortalInvoice,
  PortalJourneyStage,
  PortalShipment,
} from "@/data/customer-session";

import { mediaSrc } from "@/data/vehicles";
import styles from "./portal.module.css";

export function StatusBadge({ value }: { value: string }) {
  const tone =
    /cancel|reject|overdue|lost/i.test(value)
      ? styles.statusDanger
      // "Partially paid" has to be tested before "paid", or it matches the
      // success branch and a half-settled invoice wears the same green badge
      // as one that is fully paid -- with a balance still owing beside it.
      : /partial/i.test(value)
        ? styles.statusWarning
        : /paid|verified|arrived|deliver|release|won/i.test(value)
          ? styles.statusSuccess
          : /draft|new|pending|await|planning|request|progress|quoted|booked|sailed|yard|issued/i.test(value)
            ? styles.statusWarning
            : styles.statusNeutral;

  // The API sends the enum's own value. PARTIALLY_PAID reaching a customer
  // with the underscore still in it reads as a leaked database field.
  const label = value.replace(/[_-]+/g, " ").trim();

  return <span className={`${styles.status} ${tone}`}>{label}</span>;
}

/**
 * The seven-stage journey comes from the API as `progress` -- CustomerJourney
 * on the ERP side -- so this reads its label and completion straight off
 * that array instead of keeping a second copy here that could drift from it.
 */
/**
 * The car's own photo where there is one, the generic outline where there is
 * not. The portal used to draw the outline unconditionally, so a customer's
 * own vehicle looked like a placeholder on the very page tracking it.
 *
 * Served through Next's image pipeline, so the bytes come from this site's own
 * origin rather than the ERP's -- one origin for the browser to trust, and the
 * photos get resized on the way out, which matters for buyers on the kind of
 * connection this trade actually runs on.
 */
export function VehicleThumb({
  src,
  alt,
  className,
  sizes = "112px",
}: {
  src: string | null | undefined;
  alt: string;
  className: string;
  sizes?: string;
}) {
  return (
    <div className={className}>
      {src ? (
        <Image src={mediaSrc(src)} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
      ) : (
        <CarFront aria-hidden="true" />
      )}
    </div>
  );
}

export function InquiryRow({ inquiry }: { inquiry: PortalInquiry }) {
  return (
    <article className={styles.inquiryRow}>
      <VehicleThumb
        src={inquiry.car?.image}
        alt={inquiry.car?.title || "Vehicle"}
        className={styles.vehicleThumb}
      />
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
        {/* On a phone the seven stage names will not fit, but "where is my
            car" is the question this page exists to answer -- so the wording
            collapses to the stage the car has actually reached rather than
            the whole strip being hidden. */}
        <p className={styles.progressSummary}>{progressSummary(inquiry.progress)}</p>
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

/**
 * Read a page number off a URL. Anything that is not a whole number above
 * zero -- a duplicated parameter, "?page=abc", "?page=-3" -- falls back to
 * page one rather than being handed to the API to reject.
 */
export function pageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
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
/**
 * What the customer calls the car, not what the database calls it. The
 * description is built as "Toyota Wish 2017"; the chassis is a serial number
 * and only stands in when there is no description to show.
 */
export function invoiceVehicleSummary(invoice: PortalInvoice) {
  return invoice.lines
    .map((line) => line.description || line.chassis_number)
    .filter(Boolean)
    .join(", ");
}

export function formatMoney(value: string, currency: string | null | undefined) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return `${currency ?? ""} ${value}`.trim();
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    // Intl throws a RangeError on a null or empty currency code, and it
    // throws while rendering -- one bad row would take the whole page down
    // rather than show one odd figure. The columns behind this are NOT NULL
    // with a USD default today; this keeps that a data question rather than
    // an outage if that ever stops being true.
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

/** "Invoiced · step 3 of 7", or the first stage when nothing is done yet. */
function progressSummary(stages: PortalJourneyStage[]): string {
  const done = stages.filter((stage) => stage.complete);
  const reached = done.length ? done[done.length - 1] : stages[0];
  if (!reached) {
    return "";
  }
  return `${reached.label} \u00b7 step ${Math.max(done.length, 1)} of ${stages.length}`;
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
      {/* Wrapped rather than a bare text node so the narrow layout can drop
          the wording and keep the dots. */}
      <b className={styles.progressLabel}>{label}</b>
    </span>
  );
}
