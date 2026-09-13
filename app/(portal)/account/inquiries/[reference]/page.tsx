import Link from "next/link";
import { ArrowLeft, Check, MessageSquareText } from "lucide-react";

import { getPortalInquiry } from "@/data/customer-session";

import { formatDate, InvoiceDownloadLink, StatusBadge, VehicleThumb } from "../../portal-ui";
import styles from "../../portal.module.css";

type InquiryPageProps = {
  params: Promise<{ reference: string }>;
};

/**
 * An inquiry is just itself -- reference, status, the car it is about, and
 * the seven-stage journey computed once on the ERP side. Full invoice line
 * items and shipment tracking still live on the Payments and Shipments
 * pages, but `invoice`/`shipment` name which ones belong to this car, so
 * this page can link straight to them instead of pointing at those pages in
 * general.
 */
export default async function InquiryPage({ params }: InquiryPageProps) {
  const { reference } = await params;
  const inquiry = await getPortalInquiry(decodeURIComponent(reference));
  const car = inquiry.car;
  const nextStage = inquiry.progress.find((stage) => !stage.complete);

  return (
    <>
      <Link href="/account/inquiries" className={styles.backLink}>
        <ArrowLeft aria-hidden="true" /> Back to inquiries
      </Link>
      <header className={styles.detailHeader}>
        <div className={styles.detailVehicle}>
          <VehicleThumb
            src={car?.image}
            alt={car?.title || "Vehicle"}
            className={styles.detailImage}
            sizes="(max-width: 760px) 100vw, 320px"
          />
          <div>
            <p>{inquiry.reference}</p>
            <h1>{car?.title || "Vehicle sourcing inquiry"}</h1>
            <span>{car?.stock ? `Stock ${car.stock}` : "Custom sourcing request"}</span>
          </div>
        </div>
        <StatusBadge value={inquiry.status} />
      </header>

      <section className={styles.journey} aria-label="Order progress">
        {inquiry.progress.map((stage) => (
          <JourneyStep
            key={stage.key}
            label={stage.label}
            complete={stage.complete}
            date={stage.on ? formatDate(stage.on) : undefined}
          />
        ))}
      </section>

      <div className={styles.detailGrid}>
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <div>
              <p>Customer request</p>
              <h2>Message</h2>
            </div>
            <MessageSquareText aria-hidden="true" />
          </div>
          {inquiry.message ? (
            <p className={styles.nextAction}>{inquiry.message}</p>
          ) : (
            <p className={styles.pendingText}>No message was left with this inquiry.</p>
          )}
        </section>

        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <div><p>Next step</p><h2>Current action</h2></div>
          </div>
          <p className={styles.nextAction}>
            {nextStage
              ? `Next: ${nextStage.label}.`
              : "This vehicle has completed its journey to you."}
          </p>
          {inquiry.invoice || inquiry.shipment ? (
            <dl className={styles.definitionGrid}>
              {inquiry.invoice && (
                <div>
                  <dt>Invoice</dt>
                  <dd>
                    {inquiry.invoice.invoice_number}{" "}
                    <StatusBadge value={inquiry.invoice.status} />{" "}
                    <InvoiceDownloadLink invoice={inquiry.invoice} />
                  </dd>
                </div>
              )}
              {inquiry.shipment && (
                <div>
                  <dt>Shipment</dt>
                  <dd>
                    <StatusBadge value={inquiry.shipment.status} />{" "}
                    <Link href="/account/shipments">View shipments</Link>
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className={styles.pendingText}>
              Invoices and payments for this vehicle appear on the Payments
              page, and shipment tracking on the Shipments page, once they
              exist.
            </p>
          )}
        </section>
      </div>
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
