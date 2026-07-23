import { NextResponse } from "next/server";

import {
  CUSTOMER_SESSION_COOKIE,
  loginCustomer,
} from "@/data/customer-session";
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
    const body = await readJsonBody(request, 8192);
    const fullName = readText(body.fullName, 140);
    const email = readEmail(body.email);
    const password =
      typeof body.password === "string" ? body.password.slice(0, 256) : "";
    if (fullName.length < 2) {
      throw new FrappeAPIError(400, "NAME_REQUIRED", "Enter your full name.");
    }
    if (
      password.length < 10 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      throw new FrappeAPIError(
        400,
        "WEAK_PASSWORD",
        "Use at least 10 characters with a letter and a number.",
      );
    }
    if (body.privacyConsent !== true) {
      throw new FrappeAPIError(
        400,
        "PRIVACY_CONSENT_REQUIRED",
        "Accept the privacy policy to create an account.",
      );
    }
    await callFrappe(
      "jcexport_erp.customer_portal.register_customer",
      {
        payload: JSON.stringify({
          full_name: fullName,
          email,
          phone: readText(body.phone, 40),
          company: readText(body.company, 140),
          currency: readText(body.currency, 3).toUpperCase() || "USD",
          password,
          privacy_consent: 1,
        }),
      },
      request,
    );
    const { sid, session } = await loginCustomer(email, password);
    const response = NextResponse.json({ data: session }, { status: 201 });
    response.cookies.set({
      name: CUSTOMER_SESSION_COOKIE,
      value: sid,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      priority: "high",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (reason) {
    return integrationErrorResponse(reason);
  }
}

function readText(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, maxLength)
    : "";
}

function readEmail(value: unknown) {
  const email = readText(value, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new FrappeAPIError(
      400,
      "INVALID_EMAIL",
      "Enter a valid email address.",
    );
  }
  return email;
}
