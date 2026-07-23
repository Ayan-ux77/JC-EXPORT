import { NextResponse } from "next/server";

import {
  CUSTOMER_SESSION_COOKIE,
  resetCustomerPassword,
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
    const key = typeof body.key === "string" ? body.key.trim() : "";
    const password =
      typeof body.password === "string" ? body.password.slice(0, 256) : "";
    if (!/^[A-Za-z0-9]+$/.test(key) || key.length < 20 || key.length > 160) {
      throw new FrappeAPIError(
        400,
        "INVALID_RESET_LINK",
        "This password reset link is invalid or expired.",
      );
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
    const { sid, session } = await resetCustomerPassword(key, password);
    const response = NextResponse.json({ data: session });
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
