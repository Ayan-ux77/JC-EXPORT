import { JcApiError, apiErrorResponse, assertSameOrigin, callApi, readJsonBody } from "@/data/jc-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 2048);
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      throw new JcApiError(400, "INVALID_EMAIL", "Enter a valid email address.");
    }
    // jc-portal answers the same way whether or not the address is
    // registered, so relaying its own message keeps that guarantee instead
    // of risking a second, slightly different copy of it here.
    const result = await callApi<{ message: string }>("auth/forgot-password", {
      method: "POST",
      body: { email },
      request,
    });
    return Response.json({ data: result });
  } catch (reason) {
    return apiErrorResponse(reason);
  }
}
