import "server-only";

/**
 * The only place this site talks to jc-portal.
 *
 * Every call goes out from the Next.js server, never the browser: the customer's
 * token lives in an httpOnly cookie the browser cannot read, which is the whole
 * reason it cannot be stolen by a script on the page.
 */

import { site } from "./site";

export class JcApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "JcApiError";
  }
}

const apiOrigin = (
  process.env.JC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export function apiUrl(path: string) {
  return `${apiOrigin}/api/v1/${path.replace(/^\/+/, "")}`;
}

type CallOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  request?: Request;
  /** Extra headers to forward, such as the browser's Idempotency-Key. */
  headers?: Record<string, string>;
  /** Return the whole envelope rather than just `data` -- see callApiPage. */
  keepEnvelope?: boolean;
  /** Seconds to cache. Omit for no caching, which is right for anything personal. */
  revalidate?: number;
  timeoutMs?: number;
};

export async function callApi<T>(path: string, options: CallOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    token,
    request,
    headers: extraHeaders,
    keepEnvelope,
    revalidate,
    timeoutMs = 10_000,
  } = options;

  let response: Response;

  try {
    response = await fetch(apiUrl(path), {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...forwardedHeaders(request),
        ...extraHeaders,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
      // Anything belonging to one customer is never cached; a cached portal
      // page is one customer's invoices served to the next visitor.
      ...(revalidate !== undefined && !token
        ? { next: { revalidate } }
        : { cache: "no-store" as const }),
    });
  } catch (reason) {
    throw new JcApiError(
      503,
      "ERP_UNREACHABLE",
      reason instanceof Error && reason.name === "TimeoutError"
        ? "The system did not respond in time."
        : "The system is unavailable right now.",
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { data?: T; message?: string; errors?: Record<string, string[]> }
    | null;

  if (!response.ok) {
    throw new JcApiError(
      response.status,
      codeForStatus(response.status),
      firstValidationMessage(payload) ||
        payload?.message ||
        "The request could not be completed.",
    );
  }

  if (keepEnvelope) {
    return payload as T;
  }

  // Laravel resources wrap in `data`; a few endpoints answer with a bare
  // object. Both are accepted so callers do not have to know which.
  return (payload && "data" in payload ? payload.data : payload) as T;
}

/** The whole response envelope, for callers that need more than `data`. */
async function callApiRaw<T>(path: string, options: CallOptions = {}): Promise<T> {
  return callApi<T>(path, { ...options, keepEnvelope: true }) as Promise<T>;
}

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
  perPage: number;
};

/**
 * A page of results WITH its pagination meta.
 *
 * callApi() unwraps `data` and discards the rest, which is right for a single
 * record and wrong for a listing: without the total, a catalogue can only show
 * the rows it happens to have fetched and has to filter them in the browser.
 * That caps the site at one page of stock however much is actually for sale.
 */
export async function callApiPage<T>(path: string, options: CallOptions = {}): Promise<Paginated<T>> {
  const payload = await callApiRaw<{
    data: T[];
    meta?: { total?: number; current_page?: number; last_page?: number; per_page?: number };
  }>(path, options);

  const rows = payload?.data ?? [];
  const meta = payload?.meta;

  return {
    data: rows,
    // An endpoint that is not paginated still answers honestly: one page
    // containing everything it returned.
    total: meta?.total ?? rows.length,
    page: meta?.current_page ?? 1,
    lastPage: meta?.last_page ?? 1,
    perPage: meta?.per_page ?? rows.length,
  };
}

/** Laravel returns 422 with a field map; the first message is the useful one. */
function firstValidationMessage(payload: { errors?: Record<string, string[]> } | null) {
  const errors = payload?.errors;
  if (!errors) return "";
  const first = Object.values(errors)[0];
  return Array.isArray(first) ? first[0] || "" : "";
}

function codeForStatus(status: number) {
  switch (status) {
    case 401:
      return "UNAUTHENTICATED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 422:
      return "VALIDATION_FAILED";
    case 429:
      return "TOO_MANY_REQUESTS";
    default:
      return status >= 500 ? "ERP_ERROR" : "REQUEST_FAILED";
  }
}

/**
 * The caller's real IP reaches the ERP so its rate limits count the person
 * rather than this server, which would otherwise look like one very busy user.
 */
function forwardedHeaders(request?: Request): Record<string, string> {
  if (!request) return {};

  const ip = (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    ""
  ).slice(0, 64);

  return {
    ...(ip ? { "X-Forwarded-For": ip } : {}),
    "User-Agent": request.headers.get("user-agent") || "JC Export website",
  };
}

export function apiErrorResponse(reason: unknown) {
  if (reason instanceof JcApiError) {
    return Response.json(
      { error: { code: reason.code, message: reason.message } },
      { status: reason.status },
    );
  }

  return Response.json(
    { error: { code: "REQUEST_FAILED", message: "The request could not be completed." } },
    { status: 500 },
  );
}

export async function readJsonBody(
  request: Request,
  maxBytes = 16_384,
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new JcApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Send the request as JSON.");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    throw new JcApiError(413, "PAYLOAD_TOO_LARGE", "The submitted form is too large.");
  }

  try {
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("not an object");
    }
    return value as Record<string, unknown>;
  } catch {
    throw new JcApiError(400, "INVALID_JSON", "The submitted form is invalid.");
  }
}

export function requireIdempotencyKey(request: Request) {
  const key = request.headers.get("idempotency-key")?.trim() || "";
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(key)) {
    throw new JcApiError(
      400,
      "IDEMPOTENCY_KEY_REQUIRED",
      "A valid idempotency key is required.",
    );
  }
  return key;
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return;
  }

  const allowed = new Set(
    [
      new URL(request.url).origin,
      site.url,
      ...(process.env.WEBSITE_ALLOWED_ORIGINS || "").split(","),
    ]
      .filter(Boolean)
      .map((value) => String(value).replace(/\/+$/, "")),
  );

  if (!allowed.has(origin.replace(/\/+$/, ""))) {
    throw new JcApiError(403, "ORIGIN_NOT_ALLOWED", "This request origin is not allowed.");
  }
}
