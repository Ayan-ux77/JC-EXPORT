import { NextResponse } from "next/server";

import { apiErrorResponse } from "@/data/jc-api";
import { getVehicle } from "@/data/vehicle-service";

/**
 * One vehicle, for the saved page.
 *
 * The shortlist lives in the browser, so the only way to turn a saved slug
 * back into a car is a request from the browser -- and the browser must not
 * talk to the ERP directly. This proxies through the site's own origin like
 * every other call, so JC_API_URL stays server-side.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const vehicle = await getVehicle(slug);

    if (!vehicle) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (reason) {
    return apiErrorResponse(reason);
  }
}
