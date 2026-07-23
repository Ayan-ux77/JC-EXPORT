import { NextResponse } from "next/server";

import {
  CUSTOMER_SESSION_COOKIE,
  loginCustomer,
} from "@/data/customer-session";
import {
  FrappeAPIError,
  assertSameOrigin,
  integrationErrorResponse,
  readJsonBody,
} from "@/data/frappe-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 4096);
    const email = readEmail(body.email);
    const password =
      typeof body.password === "string" ? body.password.slice(0, 256) : "";
    if (!password) {
      throw new FrappeAPIError(
        400,
        "PASSWORD_REQUIRED",
        "Enter your password.",
      );
    }
    const { sid, session } = await loginCustomer(email, password);
    const response = NextResponse.json({ data: session });
    response.cookies.set({
      name: CUSTOMER_SESSION_COOKIE,
      value: sid,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      priority: "high",
      ...(body.remember === true ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });
    return response;
  } catch (reason) {
    return integrationErrorResponse(reason);
  }
}

function readEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new FrappeAPIError(
      400,
      "INVALID_EMAIL",
      "Enter a valid email address.",
    );
  }
  return email;
}
