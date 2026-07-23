import "server-only";

type FrappeEnvelope<T> = {
  message?: T;
  exception?: string;
  exc_type?: string;
  _server_messages?: string;
};

export class FrappeAPIError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "FrappeAPIError";
  }
}

const frappeOrigin = (
  process.env.FRAPPE_API_URL || "http://jcexport.localhost:8000"
).replace(/\/+$/, "");

export async function callFrappe<T>(
  method: string,
  args: Record<string, unknown>,
  request: Request,
): Promise<T> {
  const apiKey = process.env.FRAPPE_API_KEY;
  const apiSecret = process.env.FRAPPE_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new FrappeAPIError(
      503,
      "INTEGRATION_NOT_CONFIGURED",
      "Website inquiries are temporarily unavailable.",
    );
  }

  const correlationId =
    request.headers.get("x-correlation-id") || crypto.randomUUID();
  const clientIp = getClientIp(request);
  const response = await fetch(
    `${frappeOrigin}/api/method/${method}`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Correlation-ID": correlationId,
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
        "User-Agent": request.headers.get("user-agent") || "JC Export Next.js",
      },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  const payload = (await response.json().catch(() => ({}))) as FrappeEnvelope<T>;
  if (!response.ok || payload.exception) {
    throw new FrappeAPIError(
      response.status >= 400 ? response.status : 502,
      normalizeErrorCode(payload.exc_type),
      extractSafeMessage(payload) || "The request could not be completed.",
    );
  }
  if (payload.message === undefined) {
    throw new FrappeAPIError(
      502,
      "INVALID_ERP_RESPONSE",
      "The request could not be completed.",
    );
  }
  return payload.message;
}

export function integrationErrorResponse(reason: unknown) {
  if (reason instanceof FrappeAPIError) {
    return Response.json(
      {
        error: {
          code: reason.code,
          message: reason.message,
        },
      },
      { status: reason.status },
    );
  }
  return Response.json(
    {
      error: {
        code: "INTEGRATION_ERROR",
        message: "The request could not be completed.",
      },
    },
    { status: 500 },
  );
}

export async function readJsonBody(
  request: Request,
  maxBytes = 16_384,
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new FrappeAPIError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "Send the request as JSON.",
    );
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    throw new FrappeAPIError(
      413,
      "PAYLOAD_TOO_LARGE",
      "The submitted form is too large.",
    );
  }
  try {
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("not an object");
    }
    return value as Record<string, unknown>;
  } catch {
    throw new FrappeAPIError(
      400,
      "INVALID_JSON",
      "The submitted form is invalid.",
    );
  }
}

export function requireIdempotencyKey(request: Request) {
  const key = request.headers.get("idempotency-key")?.trim() || "";
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(key)) {
    throw new FrappeAPIError(
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
      process.env.NEXT_PUBLIC_SITE_URL,
      ...(process.env.WEBSITE_ALLOWED_ORIGINS || "").split(","),
    ]
      .filter(Boolean)
      .map((value) => String(value).replace(/\/+$/, "")),
  );
  if (!allowed.has(origin.replace(/\/+$/, ""))) {
    throw new FrappeAPIError(
      403,
      "ORIGIN_NOT_ALLOWED",
      "This request origin is not allowed.",
    );
  }
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    ""
  ).slice(0, 64);
}

function normalizeErrorCode(value?: string) {
  return (value || "ERP_REQUEST_FAILED")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .toUpperCase();
}

function extractSafeMessage(payload: FrappeEnvelope<unknown>) {
  if (!payload._server_messages) {
    return "";
  }
  try {
    const messages = JSON.parse(payload._server_messages) as string[];
    for (const raw of messages) {
      const parsed = JSON.parse(raw) as { message?: string };
      if (parsed.message) {
        return stripHtml(parsed.message).slice(0, 500);
      }
    }
  } catch {
    return "";
  }
  return "";
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
