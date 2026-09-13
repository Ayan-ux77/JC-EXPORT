import { getPortalShipments } from "@/data/customer-session";

import { EmptySection, ShipmentSummary } from "../portal-ui";
import styles from "../portal.module.css";

export default async function ShipmentsPage() {
  const shipments = await getPortalShipments();
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Export logistics</p>
          <h1>Shipments</h1>
          <span>Booking, vessel, departure, and arrival progress.</span>
        </div>
      </header>
      {shipments.length ? (
        <div className={styles.rowList}>
          {shipments.map((shipment, index) => (
            <ShipmentSummary
              key={shipment.bl_number || shipment.car.chassis || `shipment-${index}`}
              shipment={shipment}
            />
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
