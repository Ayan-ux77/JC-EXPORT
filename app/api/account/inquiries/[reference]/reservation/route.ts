import {
  callCurrentCustomer,
} from "@/data/customer-session";
import {
  assertSameOrigin,
  integrationErrorResponse,
} from "@/data/frappe-api";

type RouteContext = {
  params: Promise<{ reference: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    assertSameOrigin(request);
    const { reference } = await context.params;
    const data = await callCurrentCustomer<{
      state: string;
      reservation: unknown;
    }>(
      "jcexport_erp.customer_portal.request_reservation",
      { public_reference: decodeURIComponent(reference) },
      "POST",
    );
    return Response.json({ data });
  } catch (reason) {
    return integrationErrorResponse(reason);
  }
}
