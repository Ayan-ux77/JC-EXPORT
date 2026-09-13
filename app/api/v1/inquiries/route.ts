import {
  apiErrorResponse,
  assertSameOrigin,
  callApi,
  JcApiError,
  readJsonBody,
  requireIdempotencyKey,
} from "@/data/jc-api";

type InquiryResult = {
  reference: string;
  status: string;
  received_at: string;
};

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request);

    // A double-click, or a phone retrying this POST on a flaky connection,
    // must not create two enquiries that two sales agents both end up
    // answering. jc-portal de-duplicates on this same header for an hour, so
    // the browser's key has to reach it unchanged, not just be checked here.
    const idempotencyKey = requireIdempotencyKey(request);

    const result = await callApi<InquiryResult>("inquiries", {
      method: "POST",
      body: sanitizeInquiry(body),
      request,
      headers: { "Idempotency-Key": idempotencyKey },
    });

    return Response.json(
      { data: result },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (reason) {
    return apiErrorResponse(reason);
  }
}

/**
 * jc-portal's WebsiteInquiryController::store takes one flat set of fields.
 * Everything else the forms collect -- make, budget, shipping preference --
 * has no column of its own there, so it is folded into the two free-text
 * fields a sales agent actually reads rather than being silently dropped.
 */
function sanitizeInquiry(body: Record<string, unknown>) {
  return {
    name: requiredString(body.name, "Full name", 140),
    email: optionalString(body.email, 190) || undefined,
    phone: optionalString(body.phone, 40) || undefined,
    company: optionalString(body.company, 140) || undefined,
    city: optionalString(body.city, 80) || undefined,
    country: optionalString(body.country, 80) || undefined,
    vehicle_slug: optionalString(body.vehicleSlug, 190) || undefined,
    message: buildMessage(body) || undefined,
    vehicle_requirement: buildVehicleRequirement(body) || undefined,
    source: body.source === "CONTACT_FORM" ? "CONTACT_FORM" : "WEBSITE",
    privacy_consent: body.privacyConsent === true,
  };
}

function buildMessage(body: Record<string, unknown>) {
  const subject = optionalString(body.subject, 120);
  const port = optionalString(body.port, 80);
  const shipping = optionalString(body.shipping, 80);
  const message = optionalString(body.message, 4000);

  return [
    subject && `Subject: ${subject}`,
    port && `Preferred port: ${port}`,
    shipping && shipping !== "Not sure" && `Shipping preference: ${shipping}`,
    message,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 4000);
}

function buildVehicleRequirement(body: Record<string, unknown>) {
  const vehicle = optionalString(body.vehicle, 190);
  const makeModel = [optionalString(body.make, 140), optionalString(body.model, 140)]
    .filter(Boolean)
    .join(" ");
  const year = optionalString(body.year, 40);
  const bodyType = optionalString(body.bodyType, 100);
  const budget = optionalString(body.budget, 40);

  return [
    vehicle,
    makeModel,
    year && `Year: ${year}`,
    bodyType && `Body type: ${bodyType}`,
    budget && `Budget: USD ${budget}`,
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 2000);
}

function requiredString(value: unknown, label: string, limit: number) {
  const result = optionalString(value, limit);
  if (!result) {
    throw new JcApiError(400, "INVALID_FORM", `${label} is required.`);
  }
  return result;
}

function optionalString(value: unknown, limit: number) {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value !== "string") {
    throw new JcApiError(
      400,
      "INVALID_FORM",
      "The submitted form contains an invalid field.",
    );
  }
  const result = value.trim();
  if (result.length > limit) {
    throw new JcApiError(
      400,
      "INVALID_FORM",
      "The submitted form contains a field that is too long.",
    );
  }
  return result;
}
