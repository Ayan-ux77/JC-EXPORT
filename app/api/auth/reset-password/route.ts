import { NextResponse } from "next/server";

import { CUSTOMER_SESSION_COOKIE, resetCustomerPassword } from "@/data/customer-session";
import { JcApiError, apiErrorResponse, assertSameOrigin, readJsonBody } from "@/data/jc-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonBody(request, 4096);
    const email = readEmail(body.email);
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const password =
      typeof body.password === "string" ? body.password.slice(0, 256) : "";
    if (!/^\d{6}$/.test(code)) {
      throw new JcApiError(
        400,
        "INVALID_CODE",
        "Enter the 6-digit code from your email.",
      );
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
    const { token, session } = await resetCustomerPassword(
      email,
      code,
      password,
      password,
    );
    const response = NextResponse.json({ data: session });
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

function readEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new JcApiError(400, "INVALID_EMAIL", "Enter a valid email address.");
  }
  return email;
}
