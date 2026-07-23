import { getPortalOverview } from "@/data/customer-session";

import { EmptySection, ShipmentSummary } from "../portal-ui";
import styles from "../portal.module.css";

export default async function ShipmentsPage() {
  const overview = await getPortalOverview();
  const shipments = overview.inquiries.filter((inquiry) => inquiry.shipment);
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Export logistics</p>
          <h1>Shipments</h1>
          <span>Booking, vessel, departure, arrival, and release progress.</span>
        </div>
      </header>
      {shipments.length ? (
        <div className={styles.rowList}>
          {shipments.map((inquiry) => (
            <ShipmentSummary key={inquiry.reference} inquiry={inquiry} />
          ))}
        </div>
      ) : (
        <EmptySection
          title="No active shipments"
          description="Shipment tracking begins after a reserved vehicle is booked with a shipping line."
        />
      )}
    </>
  );
}
