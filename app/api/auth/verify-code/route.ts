import { JcApiError, apiErrorResponse, assertSameOrigin, callApi, readJsonBody } from "@/data/jc-api";

/**
 * Confirming a code only marks the address verified -- it does not sign
 * anyone in or out, and jc-portal answers it with a profile, not a token.
 * Registering or logging in already issued whatever session the customer
 * has; this endpoint never touches the session cookie.
 */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 2048);
    const email = readEmail(body.email);
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!/^\d{6}$/.test(code)) {
      throw new JcApiError(
        400,
        "INVALID_CODE",
        "Enter the 6-digit code from your email.",
      );
    }
    const result = await callApi("auth/verify-code", {
      method: "POST",
      body: { email, code },
      request,
    });
    return Response.json({ data: result });
  } catch (reason) {
    return apiErrorResponse(reason);
  }
}

function readEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new JcApiError(400, "INVALID_EMAIL", "Enter a valid email address.");
  }
  return email;
}
