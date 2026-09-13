import { CircleDollarSign } from "lucide-react";

import { getPortalInvoices, getPortalPayments } from "@/data/customer-session";

import {
  EmptySection,
  formatDate,
  formatMoney,
  invoiceVehicleSummary,
  InvoiceDownloadLink,
  pageParam,
  StatusBadge,
} from "../portal-ui";
import { PortalPagination } from "../portal-pagination";
import styles from "../portal.module.css";

// Two paginated lists share this URL, so each owns its own parameter --
// otherwise paging the invoices would silently reset the remittances below.
type PageProps = {
  searchParams: Promise<{ invoices?: string | string[]; payments?: string | string[] }>;
};

export default async function PaymentsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const [invoices, payments] = await Promise.all([
    getPortalInvoices(pageParam(query.invoices)),
    getPortalPayments(pageParam(query.payments)),
  ]);

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Customer account</p>
          <h1>Payments and balances</h1>
          <span>Submitted sales invoices and verified incoming remittances.</span>
        </div>
      </header>

      {invoices.data.length ? (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Receivables</p><h2>Sales invoices</h2></div>
            <CircleDollarSign aria-hidden="true" />
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Invoice</th><th>Vehicle</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Download</th>
                </tr>
              </thead>
              <tbody>
                {invoices.data.map((invoice) => (
                  <tr key={invoice.invoice_number}>
                    <td data-label="Invoice">{invoice.invoice_number}<small>{formatDate(invoice.invoice_date)}</small></td>
                    <td data-label="Vehicle">{invoiceVehicleSummary(invoice) || "—"}</td>
                    <td data-label="Total">{formatMoney(invoice.grand_total, invoice.currency)}</td>
                    <td data-label="Paid">{formatMoney(invoice.paid_amount, invoice.currency)}</td>
                    <td data-label="Balance">{formatMoney(invoice.balance_due, invoice.currency)}</td>
                    <td data-label="Status"><StatusBadge value={invoice.status} /></td>
                    <td data-label="Download"><InvoiceDownloadLink invoice={invoice} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PortalPagination
            pageCount={invoices.lastPage}
            currentPage={invoices.page}
            param="invoices"
          />
        </section>
      ) : (
        <EmptySection
          title="No invoices yet"
          description="Invoices and outstanding balances appear after a reservation moves into sales processing."
        />
      )}

      {payments.data.length > 0 && (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Remittances</p><h2>Payment history</h2></div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              {/* No bank reference or payment status in the new API -- a
                  remittance here is already verified and applied, and which
                  invoices it settled is the useful fact in place of those. */}
              <thead><tr><th>Reference</th><th>Received</th><th>Amount</th><th>Applied to</th></tr></thead>
              <tbody>
                {payments.data.map((payment) => (
                  <tr key={payment.reference_code}>
                    <td data-label="Reference">{payment.reference_code}</td>
                    <td data-label="Received">{formatDate(payment.received_date)}</td>
                    <td data-label="Amount">{formatMoney(payment.amount, payment.currency)}</td>
                    <td data-label="Applied to">{payment.applied_to.map((line) => line.invoice_number).join(", ") || "Unallocated"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PortalPagination
            pageCount={payments.lastPage}
            currentPage={payments.page}
            param="payments"
          />
        </section>
      )}
    </>
  );
}
