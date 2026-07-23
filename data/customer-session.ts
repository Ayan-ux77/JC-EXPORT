import "server-only";

import { cookies } from "next/headers";

import { FrappeAPIError } from "./frappe-api";

export const CUSTOMER_SESSION_COOKIE = "jcexport_customer_session";

export type CustomerSession = {
  user: string;
  full_name: string;
  first_name: string;
  customer: string;
  customer_name: string;
  default_currency: string;
};

export type PortalVehicle = {
  id: string;
  slug: string;
  title: string;
  year: number;
  make: string;
  model: string;
  image: string;
  stock_no: string;
};

export type PortalQuotation = {
  status: string;
  currency: string;
  total: string;
  valid_until: string;
  price_basis: string;
  fob: string;
  freight: string;
  insurance: string;
  cif: string;
};

export type PortalReservation = {
  reference: string;
  status: string;
  reserved_on: string;
  vehicle_id: string;
  sales_order: string | null;
  sales_order_created: boolean;
  shipment_created: boolean;
  export_shipment: string | null;
};

export type PortalShipment = {
  reference: string;
  status: string;
  booking_reference: string;
  vessel: string;
  voyage_number: string;
  etd: string;
  eta: string;
  actual_departure: string;
  actual_arrival: string;
  current_location: string;
  released: boolean;
  events: Array<{
    type: string;
    time: string;
    kind: string;
    port: string;
    notes: string;
  }>;
  documents: Array<{
    reference: string;
    type: string;
    version: number;
    issue_date: string;
    expiry_date: string;
    download_available: boolean;
  }>;
};

export type PortalFinancials = {
  invoices: Array<{
    reference: string;
    status: string;
    currency: string;
    total: string;
    paid: string;
    outstanding: string;
    posting_date: string;
    due_date: string;
    invoice_type: string;
  }>;
  payments: Array<{
    reference: string;
    status: string;
    currency: string;
    gross: string;
    net: string;
    received_on: string;
    bank_reference: string;
  }>;
};

export type PortalInquiry = {
  reference: string;
  status: string;
  received_at: string;
  next_action: string;
  vehicle: PortalVehicle | null;
  quotation: PortalQuotation | null;
  reservation: PortalReservation | null;
  shipment: PortalShipment | null;
  financials: PortalFinancials;
  last_synced_at: string;
};

export type PortalOverview = {
  profile: CustomerSession;
  summary: {
    inquiries: number;
    quotations: number;
    reservations: number;
    shipments: number;
  };
  inquiries: PortalInquiry[];
};

const frappeOrigin = (
  process.env.FRAPPE_API_URL || "http://jcexport.localhost:8000"
).replace(/\/+$/, "");

export async function loginCustomer(email: string, password: string) {
  const response = await fetch(`${frappeOrigin}/api/method/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({ usr: email, pwd: password }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    exception?: string;
  };
  if (!response.ok || payload.exception) {
    throw new FrappeAPIError(
      response.status === 401 ? 401 : 502,
      response.status === 401 ? "INVALID_CREDENTIALS" : "ERP_LOGIN_FAILED",
      response.status === 401
        ? "Email or password is incorrect."
        : "Sign in is temporarily unavailable.",
    );
  }
  const sid = extractSessionId(response.headers);
  if (!sid) {
    throw new FrappeAPIError(
      502,
      "INVALID_LOGIN_RESPONSE",
      "Sign in is temporarily unavailable.",
    );
  }
  try {
    const session = await callFrappeWithSession<CustomerSession>(
      "jcexport_erp.customer_portal.get_session",
      {},
      sid,
      "GET",
    );
    return { sid, session };
  } catch (reason) {
    await logoutCustomer(sid);
    throw reason;
  }
}

export async function logoutCustomer(sid: string) {
  await fetch(`${frappeOrigin}/api/method/logout`, {
    method: "POST",
    headers: {
      Cookie: `sid=${encodeURIComponent(sid)}`,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  }).catch(() => undefined);
}

export async function resetCustomerPassword(key: string, password: string) {
  const response = await fetch(
    `${frappeOrigin}/api/method/frappe.core.doctype.user.user.update_password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        key,
        new_password: password,
        logout_all_sessions: 1,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );
  await parseFrappeResponse<string>(response);
  const sid = extractSessionId(response.headers);
  if (!sid) {
    throw new FrappeAPIError(
      502,
      "INVALID_RESET_RESPONSE",
      "Your password was updated. Please sign in.",
    );
  }
  const session = await callFrappeWithSession<CustomerSession>(
    "jcexport_erp.customer_portal.get_session",
    {},
    sid,
    "GET",
  );
  return { sid, session };
}

export async function getCustomerSession() {
  const sid = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!sid) {
    return null;
  }
  try {
    return await callFrappeWithSession<CustomerSession>(
      "jcexport_erp.customer_portal.get_session",
      {},
      sid,
      "GET",
    );
  } catch {
    return null;
  }
}

export async function getPortalOverview() {
  return callCurrentCustomer<PortalOverview>(
    "jcexport_erp.customer_portal.get_overview",
  );
}

export async function getPortalInquiry(reference: string) {
  return callCurrentCustomer<PortalInquiry>(
    "jcexport_erp.customer_portal.get_inquiry",
    { public_reference: reference },
  );
}

export async function callCurrentCustomer<T>(
  method: string,
  args: Record<string, string> = {},
  requestMethod: "GET" | "POST" = "GET",
) {
  const sid = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!sid) {
    throw new FrappeAPIError(401, "SIGN_IN_REQUIRED", "Sign in is required.");
  }
  return callFrappeWithSession<T>(method, args, sid, requestMethod);
}

export async function callFrappeGuest<T>(
  method: string,
  args: Record<string, string>,
) {
  const response = await fetch(`${frappeOrigin}/api/method/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  return parseFrappeResponse<T>(response);
}

export async function fetchCurrentCustomerFile(
  method: string,
  args: Record<string, string>,
) {
  const sid = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!sid) {
    throw new FrappeAPIError(401, "SIGN_IN_REQUIRED", "Sign in is required.");
  }
  const query = new URLSearchParams(args);
  const response = await fetch(
    `${frappeOrigin}/api/method/${method}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Cookie: `sid=${encodeURIComponent(sid)}`,
        Accept: "application/octet-stream",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) {
    await parseFrappeResponse<never>(response);
  }
  return response;
}

async function callFrappeWithSession<T>(
  method: string,
  args: Record<string, string>,
  sid: string,
  requestMethod: "GET" | "POST",
) {
  const query = new URLSearchParams(args);
  const response = await fetch(
    `${frappeOrigin}/api/method/${method}${
      requestMethod === "GET" && query.size ? `?${query.toString()}` : ""
    }`,
    {
      method: requestMethod,
      headers: {
        Cookie: `sid=${encodeURIComponent(sid)}`,
        Accept: "application/json",
        ...(requestMethod === "POST"
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body: requestMethod === "POST" ? JSON.stringify(args) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );
  return parseFrappeResponse<T>(response);
}

async function parseFrappeResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as {
    message?: T;
    exception?: string;
    exc_type?: string;
    _server_messages?: string;
  };
  if (!response.ok || payload.exception || payload.message === undefined) {
    throw new FrappeAPIError(
      response.status >= 400 ? response.status : 502,
      payload.exc_type || "ERP_REQUEST_FAILED",
      extractMessage(payload._server_messages) ||
        (response.status === 401
          ? "Your session has expired. Please sign in again."
          : "The request could not be completed."),
    );
  }
  return payload.message;
}

function extractSessionId(headers: Headers) {
  const setCookie = headers.get("set-cookie") || "";
  const match = setCookie.match(/(?:^|,\s*)sid=([^;]+)/i);
  if (!match?.[1]) {
    return "";
  }
  return decodeURIComponent(match[1].replace(/^"|"$/g, ""));
}

function extractMessage(serverMessages?: string) {
  if (!serverMessages) {
    return "";
  }
  try {
    const messages = JSON.parse(serverMessages) as string[];
    for (const message of messages) {
      const value = JSON.parse(message) as { message?: string };
      if (value.message) {
        return value.message.replace(/<[^>]*>/g, "").trim();
      }
    }
  } catch {
    return "";
  }
  return "";
}
