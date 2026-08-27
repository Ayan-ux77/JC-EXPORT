import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleDollarSign,
  Download,
  FileText,
  MapPin,
  Ship,
} from "lucide-react";

import { getPortalInquiry } from "@/data/customer-session";
import { isRemoteVehicleMedia } from "@/data/vehicles";

import { formatDate, formatMoney, StatusBadge } from "../../portal-ui";
import styles from "../../portal.module.css";

type InquiryPageProps = {
  params: Promise<{ reference: string }>;
};

export default async function InquiryPage({ params }: InquiryPageProps) {
  const { reference } = await params;
  const inquiry = await getPortalInquiry(decodeURIComponent(reference));
  const vehicle = inquiry.vehicle;

  return (
    <>
      <Link href="/account/inquiries" className={styles.backLink}>
        <ArrowLeft aria-hidden="true" /> Back to inquiries
      </Link>
      <header className={styles.detailHeader}>
        <div className={styles.detailVehicle}>
          <div className={styles.detailImage}>
            {vehicle?.image ? (
              <Image
                src={vehicle.image}
                alt={vehicle.title}
                fill
                sizes="180px"
                unoptimized={isRemoteVehicleMedia(vehicle.image)}
              />
            ) : (
              <FileText aria-hidden="true" />
            )}
          </div>
          <div>
            <p>{inquiry.reference}</p>
            <h1>{vehicle?.title || "Vehicle sourcing inquiry"}</h1>
            <span>{vehicle?.stock_no ? `Stock ${vehicle.stock_no}` : "Custom sourcing request"}</span>
          </div>
        </div>
        <StatusBadge value={inquiry.status} />
      </header>

      <section className={styles.journey} aria-label="Order progress">
        <JourneyStep label="Inquiry received" complete date={formatDate(inquiry.received_at)} />
        <JourneyStep label="Quotation" complete={Boolean(inquiry.quotation)} />
        <JourneyStep label="Reserved" complete={Boolean(inquiry.reservation)} />
        <JourneyStep label="Shipment" complete={Boolean(inquiry.shipment)} />
        <JourneyStep label="Delivered" complete={Boolean(inquiry.shipment?.released)} />
      </section>

      <div className={styles.detailGrid}>
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <div>
              <p>Commercial</p>
              <h2>Quotation</h2>
            </div>
            {inquiry.quotation && <StatusBadge value={inquiry.quotation.status} />}
          </div>
          {inquiry.quotation ? (
            <>
              <dl className={styles.definitionGrid}>
                <div><dt>Price basis</dt><dd>{inquiry.quotation.price_basis}</dd></div>
                <div><dt>Currency</dt><dd>{inquiry.quotation.currency}</dd></div>
                <div><dt>FOB price</dt><dd>{formatMoney(inquiry.quotation.fob, inquiry.quotation.currency)}</dd></div>
                <div><dt>Freight</dt><dd>{formatMoney(inquiry.quotation.freight, inquiry.quotation.currency)}</dd></div>
                <div><dt>Insurance</dt><dd>{formatMoney(inquiry.quotation.insurance, inquiry.quotation.currency)}</dd></div>
                <div className={styles.definitionTotal}>
                  <dt>{inquiry.quotation.price_basis || "Quoted"} total</dt>
                  <dd>{formatMoney(inquiry.quotation.total, inquiry.quotation.currency)}</dd>
                </div>
              </dl>
              {!inquiry.reservation && inquiry.quotation.status === "Submitted" && (
                <p className={styles.pendingText}>
                  Your sales representative will confirm the reservation after agreeing the
                  commercial and payment terms with you.
                </p>
              )}
            </>
          ) : (
            <p className={styles.pendingText}>
              Our team is preparing the pricing and shipping options for this request.
            </p>
          )}
        </section>

        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <div><p>Next step</p><h2>Current action</h2></div>
          </div>
          <p className={styles.nextAction}>
            {inquiry.next_action || "No action is required from you right now."}
          </p>
          {inquiry.reservation && (
            <dl className={styles.definitionGrid}>
              <div><dt>Reservation</dt><dd>{inquiry.reservation.reference}</dd></div>
              <div><dt>Status</dt><dd>{inquiry.reservation.status}</dd></div>
              <div><dt>Reserved on</dt><dd>{formatDate(inquiry.reservation.reserved_on)}</dd></div>
              <div><dt>Sales order</dt><dd>{inquiry.reservation.sales_order || "Pending"}</dd></div>
            </dl>
          )}
        </section>
      </div>

      {inquiry.financials.invoices.length > 0 && (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Account</p><h2>Invoices and payments</h2></div>
            <CircleDollarSign aria-hidden="true" />
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Invoice</th><th>Date</th><th>Total</th><th>Paid</th><th>Outstanding</th><th>Status</th></tr></thead>
              <tbody>
                {inquiry.financials.invoices.map((invoice) => (
                  <tr key={invoice.reference}>
                    <td>{invoice.reference}<small>{invoice.invoice_type}</small></td>
                    <td>{formatDate(invoice.posting_date)}</td>
                    <td>{formatMoney(invoice.total, invoice.currency)}</td>
                    <td>{formatMoney(invoice.paid, invoice.currency)}</td>
                    <td>{formatMoney(invoice.outstanding, invoice.currency)}</td>
                    <td><StatusBadge value={invoice.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {inquiry.shipment && (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Logistics</p><h2>Shipment tracking</h2></div>
            <StatusBadge value={inquiry.shipment.status} />
          </div>
          <div className={styles.shipmentFacts}>
            <span><Ship aria-hidden="true" /><small>Vessel / voyage</small><strong>{[inquiry.shipment.vessel, inquiry.shipment.voyage_number].filter(Boolean).join(" / ") || "To be confirmed"}</strong></span>
            <span><CalendarDays aria-hidden="true" /><small>Estimated departure</small><strong>{formatDate(inquiry.shipment.etd)}</strong></span>
            <span><CalendarDays aria-hidden="true" /><small>Estimated arrival</small><strong>{formatDate(inquiry.shipment.eta)}</strong></span>
            <span><MapPin aria-hidden="true" /><small>Current location</small><strong>{inquiry.shipment.current_location || "Update pending"}</strong></span>
          </div>
          {inquiry.shipment.events.length > 0 && (
            <ol className={styles.timeline}>
              {inquiry.shipment.events.map((event, index) => (
                <li key={`${event.time}-${index}`}>
                  <i><Check aria-hidden="true" /></i>
                  <div><strong>{event.type}</strong><span>{event.port || event.notes}</span></div>
                  <time>{formatDate(event.time)}</time>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {inquiry.shipment?.documents.length ? (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Export file</p><h2>Approved documents</h2></div>
            <FileText aria-hidden="true" />
          </div>
          <div className={styles.documentList}>
            {inquiry.shipment.documents.map((document) => (
              <article key={document.reference}>
                <FileText aria-hidden="true" />
                <div><strong>{document.type}</strong><span>Version {document.version} · {formatDate(document.issue_date)}</span></div>
                {document.download_available && (
                  <a
                    href={`/api/account/documents/${encodeURIComponent(inquiry.shipment!.reference)}/${encodeURIComponent(document.reference)}`}
                    aria-label={`Download ${document.type}`}
                    title={`Download ${document.type}`}
                  >
                    <Download aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function JourneyStep({
  label,
  complete = false,
  date,
}: {
  label: string;
  complete?: boolean;
  date?: string;
}) {
  return (
    <div className={complete ? styles.journeyComplete : undefined}>
      <i>{complete && <Check aria-hidden="true" />}</i>
      <strong>{label}</strong>
      <span>{date || (complete ? "Complete" : "Pending")}</span>
    </div>
  );
}
