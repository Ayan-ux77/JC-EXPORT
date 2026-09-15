"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Ship } from "lucide-react";

import type { Destination, ShipmentType } from "@/data/vehicle-service";
import { SelectField } from "@/app/components/select-field";
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
  // Container is the default because it is how most of JC's freight is
  // booked, so RoRo is the choice that has to be said out loud.
  const shipmentType: ShipmentType =
    searchParams.get("shipment_type") === "RORO" ? "RORO" : "CONTAINER";

  function update(next: { destination?: string; shipment?: ShipmentType }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextDestination = next.destination ?? destinationPort;
    const nextShipment = next.shipment ?? shipmentType;

    // Remembered for the next page and the next visit. The URL stays the
    // source of truth -- a shared link must quote the port it names, not the
    // reader's own -- but a buyer who has told us where they are should not
    // have to say it again on every page. A year, because the port someone
    // ships to does not change between visits.
    try {
      document.cookie = nextDestination
        ? `jc_destination=${encodeURIComponent(nextDestination)}|${nextShipment}; path=/; max-age=31536000; samesite=lax`
        : "jc_destination=; path=/; max-age=0; samesite=lax";
    } catch {
      // A browser refusing cookies loses the memory, not the feature.
    }

    if (nextDestination) {
      params.set("destination_port", nextDestination);
      // Container is the default the API assumes, so leaving it out of the
      // URL keeps a shared link short in the common case.
      if (nextShipment === "RORO") {
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
      <div className={styles.field}>
        <span>Ship to</span>
        <SelectField
          ariaLabel="Destination port"
          value={destinationPort}
          onChange={(next) => update({ destination: next })}
          placeholder="Show prices landed at your port"
          options={destinations.map((destination) => ({
            value: destination.name,
            label: destination.country
              ? `${destination.name}, ${destination.country}`
              : destination.name,
          }))}
        />
      </div>

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
