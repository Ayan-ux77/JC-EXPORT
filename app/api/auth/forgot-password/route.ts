import {
  FrappeAPIError,
  assertSameOrigin,
  callFrappe,
  integrationErrorResponse,
  readJsonBody,
} from "@/data/frappe-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 2048);
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      throw new FrappeAPIError(
        400,
        "INVALID_EMAIL",
        "Enter a valid email address.",
      );
    }
    await callFrappe<{ accepted: boolean }>(
      "jcexport_erp.customer_portal.request_password_reset",
      { email },
      request,
    );
    return Response.json({
      data: {
        message:
          "If the account exists, password reset instructions have been sent.",
      },
    });
  } catch (reason) {
    return integrationErrorResponse(reason);
  }
}
