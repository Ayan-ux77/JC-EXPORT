import { NextResponse } from "next/server";

import { CUSTOMER_SESSION_COOKIE, type CustomerSession } from "@/data/customer-session";
import { JcApiError, apiErrorResponse, assertSameOrigin, callApi, readJsonBody } from "@/data/jc-api";

type RegisterResult = Partial<CustomerSession> & { token?: string; message?: string };

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 8192);
    const name = readText(body.fullName, 140);
    const email = readEmail(body.email);
    const password =
      typeof body.password === "string" ? body.password.slice(0, 256) : "";
    if (name.length < 2) {
      throw new JcApiError(400, "NAME_REQUIRED", "Enter your full name.");
    }
    if (
      password.length < 10 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      throw new JcApiError(
        400,
        "WEAK_PASSWORD",
        "Use at least 10 characters with a letter and a number.",
      );
    }
    if (body.privacyConsent !== true) {
      throw new JcApiError(
        400,
        "PRIVACY_CONSENT_REQUIRED",
        "Accept the privacy policy to create an account.",
      );
    }

    const result = await callApi<RegisterResult>("auth/register", {
      method: "POST",
      request,
      body: {
        name,
        email,
        password,
        // The form already checked the two fields match before this ever
        // reached the network, so confirming with the same value repeats a
        // check that already passed rather than trusting the client twice.
        password_confirmation: password,
        phone: readText(body.phone, 40) || undefined,
        company_name: readText(body.company, 140) || undefined,
        default_currency: readText(body.currency, 3).toUpperCase() || undefined,
        privacy_consent: true,
      },
    });

    // An address that already has a portal login answers 202 with no token:
    // jc-portal refuses to overwrite an existing password from this open
    // endpoint, so there is no session to start here.
    if (!result.token) {
      return NextResponse.json(
        { data: { pending: true, message: result.message } },
        { status: 202 },
      );
    }

    const { token, message: _message, ...session } = result;
    const response = NextResponse.json({ data: session }, { status: 201 });
    response.cookies.set({
      name: CUSTOMER_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      priority: "high",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (reason) {
    return apiErrorResponse(reason);
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
    throw new JcApiError(400, "INVALID_EMAIL", "Enter a valid email address.");
  }
  return email;
}
