import "server-only";

import { cookies } from "next/headers";

import type { ShipmentType } from "@/data/vehicle-service";

/**
 * What this buyer has already told the site about themselves.
 *
 * Both of these are read on the server, deliberately. Reading them in the
 * browser would paint FOB in dollars first and swap the numbers underneath
 * the reader a moment later, which looks like a site changing its mind about
 * its own prices.
 *
 * This lived as a private copy in the home page and another in the listing
 * page, and the vehicle detail page -- the one page where somebody decides to
 * buy -- had neither, so choosing a port on the listing and clicking a car
 * threw the port away and quoted plain FOB. One copy, three callers.
 */
export type RememberedDestination = {
  port: string | undefined;
  shipment: ShipmentType | undefined;
};

export async function rememberedDestination(): Promise<RememberedDestination> {
  const raw = (await cookies()).get("jc_destination")?.value;

  if (!raw) {
    return { port: undefined, shipment: undefined };
  }

  const [port, shipment] = raw.split("|");

  return {
    port: port || undefined,
    shipment: (shipment === "RORO" ? "RORO" : "CONTAINER") as ShipmentType,
  };
}

/** The currency they picked in the switcher, if any. Undefined means USD. */
export async function chosenCurrency(): Promise<string | undefined> {
  return (await cookies()).get("jc_currency")?.value || undefined;
}
