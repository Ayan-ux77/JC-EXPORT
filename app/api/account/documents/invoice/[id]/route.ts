import { requireCustomerToken } from "@/data/customer-session";
import { JcApiError, apiErrorResponse, apiUrl } from "@/data/jc-api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Streams the invoice PDF. Unlike the shipping documents under
 * documents/download, this one has no payment gate -- an unpaid invoice is
 * exactly the one a customer most needs to open, since it is how they know
 * what to pay. Ownership is still checked on the ERP side, never here.
 *
 * A raw fetch, not callApi: callApi always parses JSON, and a PDF's bytes
 * have to reach the browser exactly as jc-portal sent them. This replaces
 * the old documents/[shipment]/[document] route -- invoices are no longer
 * nested under a shipment in the API, so a bare invoice id is all this needs.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const token = await requireCustomerToken();

    const upstream = await fetch(apiUrl(`portal/invoices/${encodeURIComponent(id)}/pdf`), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok || !upstream.body) {
      throw new JcApiError(
        upstream.status === 404 ? 404 : 502,
        upstream.status === 404 ? "NOT_FOUND" : "ERP_ERROR",
        "The document could not be downloaded.",
      );
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/pdf",
        "Content-Disposition":
          upstream.headers.get("content-disposition") ||
          'attachment; filename="invoice.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (reason) {
    return apiErrorResponse(reason);
  }
}
