import { Download, FileCheck2, FileText, Lock } from "lucide-react";

import { getPortalDocuments } from "@/data/customer-session";

import { EmptySection, formatDate } from "../portal-ui";
import styles from "../portal.module.css";

export default async function DocumentsPage() {
  const documents = await getPortalDocuments();

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Export file</p>
          <h1>Documents</h1>
          <span>
            Every document is listed here whether or not it can be downloaded
            yet -- JC releases each one once that car&apos;s invoice is paid
            in full.
          </span>
        </div>
      </header>
      {documents.length ? (
        <section className={styles.pageSection}>
          <div className={styles.sectionHeading}>
            <div><p>Approved and pending</p><h2>All documents</h2></div>
            <FileCheck2 aria-hidden="true" />
          </div>
          <div className={styles.documentList}>
            {documents.map((document) => (
              <article
                key={document.id}
                className={document.downloadable ? undefined : styles.documentWithheld}
              >
                <FileText aria-hidden="true" />
                <div>
                  <strong>{document.label}</strong>
                  <span>
                    {[
                      document.stock ? `Stock ${document.stock}` : null,
                      formatDate(document.uploaded_on),
                      formatFileSize(document.size),
                      !document.downloadable ? document.withheld_reason : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                {document.downloadable ? (
                  <a
                    href={`/api/account/documents/download/${encodeURIComponent(document.id)}`}
                    aria-label={`Download ${document.label}`}
                    title={`Download ${document.label}`}
                  >
                    <Download aria-hidden="true" />
                  </a>
                ) : (
                  <span
                    className={styles.documentLocked}
                    aria-label="Withheld until paid in full"
                    title={document.withheld_reason || "Withheld"}
                  >
                    <Lock aria-hidden="true" />
                  </span>
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

function formatFileSize(bytes: number) {
  if (!bytes) {
    return "";
  }
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}
