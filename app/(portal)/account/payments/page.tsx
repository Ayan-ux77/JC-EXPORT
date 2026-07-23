import { CircleDollarSign } from "lucide-react";

import { getPortalOverview } from "@/data/customer-session";

import { EmptySection, formatDate, formatMoney, StatusBadge } from "../portal-ui";
import styles from "../portal.module.css";

export default async function PaymentsPage() {
  const overview = await getPortalOverview();
  const invoices = overview.inquiries.flatMap((inquiry) =>
    inquiry.financials.invoices.map((invoice) => ({
      ...invoice,
      inquiry: inquiry.reference,
      vehicle: inquiry.vehicle?.title || "Vehicle order",
    })),
  );
  const payments = overview.inquiries.flatMap((inquiry) =>
    inquiry.financials.payments.map((payment) => ({
      ...payment,
      inquiry: inquiry.reference,
    })),
  );

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Customer account</p>
          <h1>Payments and balances</h1>
          <span>Submitted sales invoices and verified incoming remittances.</span>
        </div>
      </header>

      {invoices.length ? (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Receivables</p><h2>Sales invoices</h2></div>
            <CircleDollarSign aria-hidden="true" />
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Invoice</th><th>Vehicle</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.reference}>
                    <td>{invoice.reference}<small>{formatDate(invoice.posting_date)}</small></td>
                    <td>{invoice.vehicle}<small>{invoice.inquiry}</small></td>
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
      ) : (
        <EmptySection
          title="No invoices yet"
          description="Invoices and outstanding balances appear after a reservation moves into sales processing."
        />
      )}

      {payments.length > 0 && (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Remittances</p><h2>Payment history</h2></div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Reference</th><th>Bank reference</th><th>Received</th><th>Net amount</th><th>Status</th></tr></thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.reference}>
                    <td>{payment.reference}<small>{payment.inquiry}</small></td>
                    <td>{payment.bank_reference}</td>
                    <td>{formatDate(payment.received_on)}</td>
                    <td>{formatMoney(payment.net, payment.currency)}</td>
                    <td><StatusBadge value={payment.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
