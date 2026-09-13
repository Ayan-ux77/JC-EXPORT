"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Ship } from "lucide-react";

import type { Destination, ShipmentType } from "@/data/vehicle-service";
import styles from "./destination-selector.module.css";

type DestinationSelectorProps = {
  destinations: Destination[];
};

/**
 * The single most important control on the listing and detail pages.
 *
 * A dealer in Mombasa comparing this site against BE FORWARD and SBT is
 * comparing landed cost, not FOB -- FOB is the number JC thinks in, not the
 * number the buyer can act on. The choice lives in the URL (destination_port,
 * shipment_type) rather than component state so a repriced listing can be
 * shared as a link and survives a reload or a direct visit to a vehicle page.
 */
export function DestinationSelector({ destinations }: DestinationSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const destinationPort = searchParams.get("destination_port") ?? "";
  const shipmentType: ShipmentType =
    searchParams.get("shipment_type") === "CONTAINER" ? "CONTAINER" : "RORO";

  function update(next: { destination?: string; shipment?: ShipmentType }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextDestination = next.destination ?? destinationPort;
    const nextShipment = next.shipment ?? shipmentType;

    if (nextDestination) {
      params.set("destination_port", nextDestination);
      // RoRo is the default the API assumes, so leaving it out of the URL
      // keeps a shared link short in the common case.
      if (nextShipment === "CONTAINER") {
        params.set("shipment_type", nextShipment);
      } else {
        params.delete("shipment_type");
      }
    } else {
      params.delete("destination_port");
      params.delete("shipment_type");
    }

    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  }

  // Offering a port with no freight rate behind it teaches buyers the
  // calculator is broken, so an empty list means "say nothing" rather than
  // "show a selector that always answers ask us".
  if (destinations.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <Ship aria-hidden="true" className={styles.icon} />
      <label className={styles.field}>
        <span>Ship to</span>
        <select
          value={destinationPort}
          onChange={(event) => update({ destination: event.target.value })}
        >
          <option value="">Show prices landed at your port</option>
          {destinations.map((destination) => (
            <option key={destination.name} value={destination.name}>
              {destination.name}
              {destination.country ? `, ${destination.country}` : ""}
            </option>
          ))}
        </select>
      </label>

      {destinationPort && (
        <div className={styles.shipmentToggle} role="group" aria-label="Shipment type">
          <button
            type="button"
            aria-pressed={shipmentType === "RORO"}
            onClick={() => update({ shipment: "RORO" })}
          >
            RoRo
          </button>
          <button
            type="button"
            aria-pressed={shipmentType === "CONTAINER"}
            onClick={() => update({ shipment: "CONTAINER" })}
          >
            Container
          </button>
        </div>
      )}
    </div>
  );
}
