import { requireCustomerToken } from "@/data/customer-session";
import { JcApiError, apiErrorResponse, apiUrl } from "@/data/jc-api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Streams one shipping document without the customer's bearer token ever
 * reaching the browser -- the same reason the invoice PDF route does a raw
 * fetch instead of callApi: callApi always parses JSON, and a file's bytes
 * have to reach the browser exactly as jc-portal sent them.
 *
 * jc-portal re-checks the release rule at this exact moment (documentDownload
 * re-derives it from the invoice, not from the listing's cached flag), so a
 * link opened from a page that was loaded before the balance was settled
 * still works, and one opened after a refund still does not.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const token = await requireCustomerToken();

    const upstream = await fetch(
      apiUrl(`portal/documents/${encodeURIComponent(id)}/download`),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/octet-stream",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    );

    if (!upstream.ok || !upstream.body) {
      if (upstream.status === 403) {
        throw new JcApiError(
          403,
          "DOCUMENT_WITHHELD",
          "This document is released once the invoice for the vehicle is paid in full.",
        );
      }
      throw new JcApiError(
        upstream.status === 404 ? 404 : 502,
        upstream.status === 404 ? "NOT_FOUND" : "ERP_ERROR",
        "The document could not be downloaded.",
      );
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": upstream.headers.get("content-disposition") || "attachment",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (reason) {
    return apiErrorResponse(reason);
  }
}
