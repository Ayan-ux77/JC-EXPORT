import { JcApiError, apiErrorResponse, assertSameOrigin, callApi, readJsonBody } from "@/data/jc-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 2048);
    const email = readEmail(body.email);
    // jc-portal answers the same way whether or not the address has an
    // account, so relaying its message keeps that guarantee rather than
    // risking a second, slightly different copy of it here. It is also the
    // tightest-throttled of these endpoints: sending a code costs a real
    // email, and this is the one route that could be used to spam somebody
    // else's inbox.
    const result = await callApi<{ message: string }>("auth/resend-code", {
      method: "POST",
      body: { email },
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
