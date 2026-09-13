import { NextResponse } from "next/server";

import { CUSTOMER_SESSION_COOKIE, logoutCustomer } from "@/data/customer-session";
import { assertSameOrigin } from "@/data/jc-api";

export async function POST(request: Request) {
  assertSameOrigin(request);
  const cookie = request.headers.get("cookie") || "";
  const token =
    cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${CUSTOMER_SESSION_COOKIE}=`))
      ?.slice(CUSTOMER_SESSION_COOKIE.length + 1) || "";
  if (token) {
    await logoutCustomer(decodeURIComponent(token));
  }
  const response = NextResponse.json({ data: { signedOut: true } });
  response.cookies.delete(CUSTOMER_SESSION_COOKIE);
  return response;
}
