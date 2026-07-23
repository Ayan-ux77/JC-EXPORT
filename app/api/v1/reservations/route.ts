import {
  assertSameOrigin,
  callFrappe,
  integrationErrorResponse,
  readJsonBody,
  requireIdempotencyKey,
} from "@/data/frappe-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 4096);
    const publicReference =
      typeof body.reference === "string" ? body.reference.trim() : "";
    const lookupToken =
      typeof body.lookupToken === "string" ? body.lookupToken.trim() : "";
    if (!/^JCI-[A-Z0-9]{10}$/.test(publicReference) || !/^[a-f0-9]{64}$/.test(lookupToken)) {
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
      "jcexport_erp.website_api.request_reservation",
      {
        public_reference: publicReference,
        lookup_token: lookupToken,
        idempotency_key: requireIdempotencyKey(request),
        correlation_id:
          request.headers.get("x-correlation-id") || crypto.randomUUID(),
      },
      request,
    );
    return Response.json(result, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (reason) {
    return integrationErrorResponse(reason);
  }
}
