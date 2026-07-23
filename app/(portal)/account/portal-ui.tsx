import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, MapPin } from "lucide-react";

import type { PortalInquiry } from "@/data/customer-session";
import { isRemoteVehicleMedia } from "@/data/vehicles";

import styles from "./portal.module.css";

export function StatusBadge({ value }: { value: string }) {
  const tone =
    /cancel|reject|overdue/i.test(value)
      ? styles.statusDanger
      : /submit|active|paid|verified|depart|transit|arrived|deliver|release|ship/i.test(value)
        ? styles.statusSuccess
        : /draft|new|pending|await|planning|request/i.test(value)
          ? styles.statusWarning
          : styles.statusNeutral;
  return <span className={`${styles.status} ${tone}`}>{value}</span>;
}

export function InquiryRow({ inquiry }: { inquiry: PortalInquiry }) {
  return (
    <article className={styles.inquiryRow}>
      <div className={styles.vehicleThumb}>
        {inquiry.vehicle?.image ? (
          <Image
            src={inquiry.vehicle.image}
            alt={inquiry.vehicle.title}
            fill
            sizes="112px"
            unoptimized={isRemoteVehicleMedia(inquiry.vehicle.image)}
          />
        ) : (
          <CarFront aria-hidden="true" />
        )}
      </div>
      <div className={styles.inquiryIdentity}>
        <div>
          <span>{inquiry.reference}</span>
          <StatusBadge value={inquiry.status} />
        </div>
        <h2>{inquiry.vehicle?.title || "Vehicle sourcing request"}</h2>
        <p>
          {inquiry.vehicle?.stock_no
            ? `Stock ${inquiry.vehicle.stock_no}`
            : inquiry.next_action || "Our export team is reviewing your request."}
        </p>
      </div>
      <div className={styles.inquiryProgress}>
        <ProgressItem label="Inquiry" complete />
        <ProgressItem label="Quotation" complete={Boolean(inquiry.quotation)} />
        <ProgressItem label="Reserved" complete={Boolean(inquiry.reservation)} />
        <ProgressItem label="Shipment" complete={Boolean(inquiry.shipment)} />
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

export function ShipmentSummary({ inquiry }: { inquiry: PortalInquiry }) {
  const shipment = inquiry.shipment;
  if (!shipment) {
    return null;
  }
  return (
    <article className={styles.shipmentRow}>
      <div>
        <span>{shipment.reference}</span>
        <h2>{inquiry.vehicle?.title || "Vehicle shipment"}</h2>
        <p><MapPin aria-hidden="true" /> {shipment.current_location || "Location update pending"}</p>
      </div>
      <div className={styles.shipmentSchedule}>
        <span><CalendarDays aria-hidden="true" /> ETD {formatDate(shipment.etd)}</span>
        <span><CalendarDays aria-hidden="true" /> ETA {formatDate(shipment.eta)}</span>
      </div>
      <StatusBadge value={shipment.status} />
      <Link href={`/account/inquiries/${encodeURIComponent(inquiry.reference)}`}>
        Track <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}

export function formatDate(value: string) {
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
