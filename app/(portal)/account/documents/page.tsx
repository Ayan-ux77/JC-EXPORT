import Link from "next/link";
import { Download, FileCheck2, FileText } from "lucide-react";

import { getPortalOverview } from "@/data/customer-session";

import { EmptySection, formatDate } from "../portal-ui";
import styles from "../portal.module.css";

export default async function DocumentsPage() {
  const overview = await getPortalOverview();
  const documents = overview.inquiries.flatMap((inquiry) =>
    (inquiry.shipment?.documents || []).map((document) => ({
      ...document,
      inquiry: inquiry.reference,
      vehicle: inquiry.vehicle?.title || "Vehicle shipment",
      shipment: inquiry.shipment!.reference,
    })),
  );

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Export file</p>
          <h1>Documents</h1>
          <span>Only approved customer-visible documents are shown here.</span>
        </div>
      </header>
      {documents.length ? (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Approved</p><h2>Available downloads</h2></div>
            <FileCheck2 aria-hidden="true" />
          </div>
          <div className={styles.documentList}>
            {documents.map((document) => (
              <article key={document.reference}>
                <FileText aria-hidden="true" />
                <div>
                  <strong>{document.type}</strong>
                  <span>{document.vehicle} · Version {document.version} · {formatDate(document.issue_date)}</span>
                </div>
                {document.download_available ? (
                  <a
                    href={`/api/account/documents/${encodeURIComponent(document.shipment)}/${encodeURIComponent(document.reference)}`}
                    aria-label={`Download ${document.type}`}
                    title={`Download ${document.type}`}
                  >
                    <Download aria-hidden="true" />
                  </a>
                ) : (
                  <Link href={`/account/inquiries/${encodeURIComponent(document.inquiry)}`}>
                    View
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : (
        <EmptySection
          title="No documents available"
          description="Approved invoices, inspection files, bills of lading, and export certificates will appear here."
        />
      )}
    </>
  );
}
