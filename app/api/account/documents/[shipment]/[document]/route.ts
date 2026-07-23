import { fetchCurrentCustomerFile } from "@/data/customer-session";
import { integrationErrorResponse } from "@/data/frappe-api";

type RouteContext = {
  params: Promise<{ shipment: string; document: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { shipment, document } = await context.params;
    const source = await fetchCurrentCustomerFile(
      "jcexport_erp.customer_portal.download_document",
      {
        public_reference: decodeURIComponent(shipment),
        document_name: decodeURIComponent(document),
      },
    );
    return new Response(source.body, {
      headers: {
        "Content-Type":
          source.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition":
          source.headers.get("content-disposition") ||
          'attachment; filename="jcexport-document"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (reason) {
    return integrationErrorResponse(reason);
  }
}
