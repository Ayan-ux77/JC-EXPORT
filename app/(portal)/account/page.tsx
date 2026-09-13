import Link from "next/link";
import { ArrowRight, CircleDollarSign, MessageSquareText, Ship } from "lucide-react";

import { getPortalOverview } from "@/data/customer-session";

import {
  EmptySection,
  formatDate,
  formatMoney,
  InquiryRow,
  invoiceVehicleSummary,
  InvoiceDownloadLink,
  ShipmentSummary,
  StatusBadge,
} from "./portal-ui";
import styles from "./portal.module.css";

export default async function AccountPage() {
  const overview = await getPortalOverview();
  const recentInquiries = overview.recent_inquiries.slice(0, 3);
  const recentInvoices = overview.recent_invoices.slice(0, 3);
  const recentShipments = overview.recent_shipments.slice(0, 2);

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Account overview</p>
          <h1>Welcome, {overview.profile.name.split(" ")[0]}</h1>
          <span>
            Track every step from inquiry to vehicle delivery.
          </span>
        </div>
        <Link href="/vehicles" className={styles.primaryAction}>
          Find a vehicle <ArrowRight aria-hidden="true" />
        </Link>
      </header>

      <section className={styles.metrics} aria-label="Account summary">
        <Metric icon={MessageSquareText} label="Open inquiries" value={overview.summary.open_inquiries} />
        <Metric icon={CircleDollarSign} label="Invoices outstanding" value={overview.summary.invoices_outstanding} />
        <Metric icon={Ship} label="Cars on water" value={overview.summary.cars_on_water} />
      </section>

      <section className={styles.pageSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p>Recent activity</p>
            <h2>Your vehicle requests</h2>
          </div>
          <Link href="/account/inquiries">View all <ArrowRight aria-hidden="true" /></Link>
        </div>
        {recentInquiries.length ? (
          <div className={styles.rowList}>
            {recentInquiries.map((inquiry) => <InquiryRow key={inquiry.reference} inquiry={inquiry} />)}
          </div>
        ) : (
          <EmptySection
            title="No inquiries yet"
            description="Choose a listed vehicle or tell us what you want us to source from Japan."
            action={{ href: "/vehicles", label: "Browse vehicles" }}
          />
        )}
      </section>

      {recentInvoices.length > 0 && (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div>
              <p>Receivables</p>
              <h2>Recent invoices</h2>
            </div>
            <Link href="/account/payments">All invoices <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Invoice</th><th>Vehicle</th><th>Total</th><th>Balance</th><th>Status</th><th>Download</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.invoice_number}>
                    <td>{invoice.invoice_number}<small>{formatDate(invoice.invoice_date)}</small></td>
                    <td>{invoiceVehicleSummary(invoice) || "—"}</td>
                    <td>{formatMoney(invoice.grand_total, invoice.currency)}</td>
                    <td>{formatMoney(invoice.balance_due, invoice.currency)}</td>
                    <td><StatusBadge value={invoice.status} /></td>
                    <td><InvoiceDownloadLink invoice={invoice} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {recentShipments.length > 0 && (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div>
              <p>Logistics</p>
              <h2>Active shipments</h2>
            </div>
            <Link href="/account/shipments">All shipments <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.rowList}>
            {recentShipments.map((shipment, index) => (
              <ShipmentSummary
                key={shipment.bl_number || shipment.car.chassis || `shipment-${index}`}
                shipment={shipment}
              />
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
