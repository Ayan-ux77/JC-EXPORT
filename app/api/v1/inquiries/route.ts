import {
  assertSameOrigin,
  callFrappe,
  FrappeAPIError,
  integrationErrorResponse,
  readJsonBody,
  requireIdempotencyKey,
} from "@/data/frappe-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request);
    const idempotencyKey = requireIdempotencyKey(request);
    const payload = sanitizeInquiry(body, idempotencyKey);
    const result = await callFrappe(
      "jcexport_erp.website_api.submit_inquiry",
      {
        payload,
        idempotency_key: idempotencyKey,
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

function sanitizeInquiry(
  body: Record<string, unknown>,
  idempotencyKey: string,
) {
  return {
    inquiry_type: optionalString(body.inquiryType, 80),
    vehicle: optionalString(body.vehicle, 180),
    make: optionalString(body.make, 140),
    model: optionalString(body.model, 140),
    year: optionalString(body.year, 40),
    budget: optionalString(body.budget, 40),
    currency: optionalString(body.currency, 3) || "USD",
    body_type: optionalString(body.bodyType, 100),
    country: optionalString(body.country, 120),
    port: optionalString(body.port, 180),
    shipping: optionalString(body.shipping, 80),
    quote_basis: optionalString(body.quoteBasis, 3) || "CIF",
    name: requiredString(body.name, "Full name", 140),
    company: optionalString(body.company, 140),
    email: optionalString(body.email, 254),
    phone: optionalString(body.phone, 80),
    subject: optionalString(body.subject, 120),
    message: optionalString(body.message, 4000),
    privacy_consent: body.privacyConsent === true,
    marketing_consent: body.marketingConsent === true,
    request_id:
      optionalString(body.requestId, 140) || idempotencyKey,
  };
}

function requiredString(value: unknown, label: string, limit: number) {
  const result = optionalString(value, limit);
  if (!result) {
    throw new FrappeAPIError(400, "INVALID_FORM", `${label} is required.`);
  }
  return result;
}

function optionalString(value: unknown, limit: number) {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value !== "string") {
    throw new FrappeAPIError(
      400,
      "INVALID_FORM",
      "The submitted form contains an invalid field.",
    );
  }
  const result = value.trim();
  if (result.length > limit) {
    throw new FrappeAPIError(
      400,
      "INVALID_FORM",
      "The submitted form contains a field that is too long.",
    );
  }
  return result;
}
