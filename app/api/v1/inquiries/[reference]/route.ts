import {
  callFrappe,
  integrationErrorResponse,
} from "@/data/frappe-api";

export async function GET(
  request: Request,
  context: RouteContext<"/api/v1/inquiries/[reference]">,
) {
  try {
    const { reference } = await context.params;
    const lookupToken = new URL(request.url).searchParams.get("token") || "";
    if (!/^JCI-[A-Z0-9]{10}$/.test(reference) || !/^[a-f0-9]{64}$/.test(lookupToken)) {
      return Response.json(
        {
          error: {
            code: "INVALID_INQUIRY_CREDENTIALS",
            message: "Inquiry credentials are invalid.",
          },
        },
        { status: 400 },
      );
    }
    const result = await callFrappe(
      "jcexport_erp.website_api.get_inquiry_status",
      {
        public_reference: reference,
        lookup_token: lookupToken,
      },
      request,
    );
    return Response.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (reason) {
    return integrationErrorResponse(reason);
  }
}
