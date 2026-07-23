import { getPortalOverview } from "@/data/customer-session";

import { EmptySection, InquiryRow } from "../portal-ui";
import styles from "../portal.module.css";

export default async function InquiriesPage() {
  const overview = await getPortalOverview();
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Customer requests</p>
          <h1>Inquiries and orders</h1>
          <span>Quotations, reservations, sales, and delivery progress.</span>
        </div>
      </header>
      {overview.inquiries.length ? (
        <div className={styles.rowList}>
          {overview.inquiries.map((inquiry) => (
            <InquiryRow key={inquiry.reference} inquiry={inquiry} />
          ))}
        </div>
      ) : (
        <EmptySection
          title="No inquiries yet"
          description="Your submitted vehicle requests will appear here."
          action={{ href: "/vehicles", label: "Browse vehicles" }}
        />
      )}
    </>
  );
}
