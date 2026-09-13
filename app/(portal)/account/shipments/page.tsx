import { getPortalShipments } from "@/data/customer-session";

import { EmptySection, pageParam, ShipmentSummary } from "../portal-ui";
import { PortalPagination } from "../portal-pagination";
import styles from "../portal.module.css";

type PageProps = { searchParams: Promise<{ page?: string | string[] }> };

export default async function ShipmentsPage({ searchParams }: PageProps) {
  const page = pageParam((await searchParams).page);
  const shipments = await getPortalShipments(page);
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Export logistics</p>
          <h1>Shipments</h1>
          <span>Booking, vessel, departure, and arrival progress.</span>
        </div>
      </header>
      {shipments.data.length ? (
        <>
          <div className={styles.rowList}>
            {shipments.data.map((shipment, index) => (
              <ShipmentSummary
                key={shipment.bl_number || shipment.car.chassis || `shipment-${index}`}
                shipment={shipment}
              />
            ))}
          </div>
          <PortalPagination pageCount={shipments.lastPage} currentPage={shipments.page} />
        </>
      ) : (
        <EmptySection
          title="No active shipments"
          description="Shipment tracking begins after a reserved vehicle is booked with a shipping line."
        />
      )}
    </>
  );
}
