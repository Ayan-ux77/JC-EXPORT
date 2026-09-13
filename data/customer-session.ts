import "server-only";

import { cookies } from "next/headers";

import { callApi, JcApiError } from "./jc-api";

export const CUSTOMER_SESSION_COOKIE = "jcexport_customer_session";

/**
 * What auth/login, auth/register and auth/reset-password answer with, and
 * what auth/profile answers on every later request. The cookie of the same
 * name now holds a Sanctum bearer token rather than a Frappe `sid` -- the
 * browser still never sees it, only what goes in it changed.
 */
export type CustomerSession = {
  id: number;
  name: string;
  email: string;
  company?: string;
  country?: string;
  currency: string;
  emailVerified: boolean;
};

/**
 * The account as portal/profile shows it and PUT portal/profile accepts it
 * back. Deliberately not the same shape as CustomerSession: this one carries
 * the postal address a buyer fills in for shipping paperwork, which signing
 * in has no reason to return.
 */
export type PortalProfile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  default_currency: string;
  email_verified: boolean;
};

export type PortalSummary = {
  open_inquiries: number;
  invoices_outstanding: number;
  cars_on_water: number;
};

export type PortalInvoiceLine = {
  description: string | null;
  chassis_number: string | null;
  line_total: string;
};

/**
 * Money is always a decimal STRING here, never a number -- see jc-api.ts.
 * A float would lose cents at the edges, and JSON would drop a trailing
 * ".00" so the same field arrives as 4200 one day and 4200.5 the next.
 */
export type PortalInvoice = {
  /** The handle the portal links its PDF download to. */
  id: number;
  invoice_number: string;
  status: string;
  currency: string;
  grand_total: string;
  paid_amount: string;
  balance_due: string;
  invoice_date: string | null;
  due_date: string | null;
  incoterm: string | null;
  lines: PortalInvoiceLine[];
};

export type PortalPayment = {
  reference_code: string;
  amount: string;
  currency: string;
  received_date: string | null;
  applied_to: Array<{ invoice_number: string; amount: string }>;
};

export type PortalShipmentCourier = {
  tracking_number: string;
  courier_company: string;
  sent_on: string | null;
  delivered: boolean;
};

/**
 * One car's shipping leg, not one inquiry. Several cars can ride on the same
 * invoice and each still gets its own vessel and its own courier envelope,
 * so there is no single "the shipment for this inquiry" concept any more.
 */
export type PortalShipment = {
  id: number;
  car: {
    stock: string | null;
    title: string;
    chassis: string | null;
  };
  vessel: string | null;
  voyage: string | null;
  pol: string | null;
  pod: string | null;
  etd: string | null;
  eta: string | null;
  sailed_on: string | null;
  arrived_on: string | null;
  delivered_on: string | null;
  bl_number: string | null;
  status: string;
  courier: PortalShipmentCourier | null;
};

/**
 * One file about one of the customer's cars. Always listed even when it
 * cannot be fetched yet -- JC does not release shipping documents until that
 * car's invoice is paid in full, the same rule Arrival Watch is built on, and
 * hiding a document that exists is what turns into the phone call this page
 * is meant to prevent.
 */
export type PortalDocument = {
  id: string;
  type: string | null;
  label: string;
  file_name: string;
  size: number;
  uploaded_on: string | null;
  stock: string | null;
  downloadable: boolean;
  withheld_reason: string | null;
};

/**
 * A named step in the seven-stage journey from enquiry to delivery, shared
 * by the compact progress bar and the full journey strip so the two can
 * never disagree about which stage is current -- the label and completion
 * flag come from here, not from a second copy of the stage list on this
 * side.
 */
export type PortalJourneyStage = {
  key: string;
  label: string;
  complete: boolean;
  on: string | null;
};

/**
 * There is no Quotation and no Sales Order stage: those were ERPNext's
 * document model, not how JC actually sells a car. An inquiry is just
 * itself -- reference, status, the car it is about -- and pricing,
 * invoicing and shipping are tracked as their own resources once they
 * exist, not folded into the inquiry that started them. `progress` is the
 * exception: the seven-stage journey is computed once, server-side, so every
 * page that shows it agrees, including for an inquiry with no car attached.
 */
export type PortalInquiry = {
  reference: string;
  status: string;
  created_at: string | null;
  message: string | null;
  car: {
    stock: string | null;
    slug: string | null;
    title: string;
  } | null;
  // Named so the detail page can link an enquiry straight to what its car
  // turned into, instead of pointing vaguely at the Payments and Shipments
  // pages. Either is null until that step actually happens.
  invoice: { id: number; invoice_number: string; status: string } | null;
  shipment: { id: number; status: string } | null;
  progress: PortalJourneyStage[];
};

export type PortalOverview = {
  profile: PortalProfile;
  summary: PortalSummary;
  // Kept per currency, never summed: a customer owing 5,000 USD and 300,000
  // JPY does not owe 305,000 of anything.
  outstanding_balance: Record<string, string>;
  recent_invoices: PortalInvoice[];
  recent_payments: PortalPayment[];
  recent_shipments: PortalShipment[];
  recent_inquiries: PortalInquiry[];
};

export async function loginCustomer(email: string, password: string) {
  const result = await callApi<CustomerSession & { token: string }>("auth/login", {
    method: "POST",
    body: { email, password },
  });
  const { token, ...session } = result;
  return { token, session };
}

export async function resetCustomerPassword(
  email: string,
  code: string,
  password: string,
  passwordConfirmation: string,
) {
  const result = await callApi<CustomerSession & { token: string }>("auth/reset-password", {
    method: "POST",
    body: { email, code, password, password_confirmation: passwordConfirmation },
  });
  const { token, ...session } = result;
  return { token, session };
}

export async function logoutCustomer(token: string) {
  // Best-effort: a network blip here must not stop the cookie from being
  // cleared, or the customer would look signed out locally while the token
  // is still live on the ERP.
  await callApi("auth/logout", { method: "POST", token }).catch(() => undefined);
}

export async function getCustomerSession() {
  const token = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  try {
    return await callApi<CustomerSession>("auth/profile", { token });
  } catch {
    // An expired or revoked token reads as "signed out", not as a crash --
    // whatever called this redirects to sign-in either way.
    return null;
  }
}

export async function getPortalOverview() {
  return callApi<PortalOverview>("portal/overview", { token: await requireCustomerToken() });
}

export async function getPortalInquiry(reference: string) {
  return callApi<PortalInquiry>(`portal/inquiries/${encodeURIComponent(reference)}`, {
    token: await requireCustomerToken(),
  });
}

/**
 * The full history, not the dashboard's five-item preview -- these back the
 * standalone list pages, which is exactly what a customer opens this account
 * for when the dashboard's "View all" is what they clicked.
 */
export async function getPortalInquiries(page = 1) {
  return callApi<PortalInquiry[]>(`portal/inquiries?page=${page}`, {
    token: await requireCustomerToken(),
  });
}

export async function getPortalInvoices(page = 1) {
  return callApi<PortalInvoice[]>(`portal/invoices?page=${page}`, {
    token: await requireCustomerToken(),
  });
}

export async function getPortalPayments(page = 1) {
  return callApi<PortalPayment[]>(`portal/payments?page=${page}`, {
    token: await requireCustomerToken(),
  });
}

export async function getPortalShipments(page = 1) {
  return callApi<PortalShipment[]>(`portal/shipments?page=${page}`, {
    token: await requireCustomerToken(),
  });
}

/**
 * Not paginated -- a customer's cars rarely carry more than a handful of
 * documents each, nowhere near invoice or payment volume, so there is no
 * page size here to plumb through.
 */
export async function getPortalDocuments() {
  return callApi<PortalDocument[]>("portal/documents", {
    token: await requireCustomerToken(),
  });
}

/**
 * The one place that reads the session cookie for a request that must not
 * proceed without it -- a raw fetch (the document download route) as much as
 * the JSON calls above, so the cookie's name is only ever spelled out once.
 */
export async function requireCustomerToken() {
  const token = (await cookies()).get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) {
    throw new JcApiError(401, "SIGN_IN_REQUIRED", "Sign in is required.");
  }
  return token;
}
