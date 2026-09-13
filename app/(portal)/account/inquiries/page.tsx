import { getPortalInquiries } from "@/data/customer-session";

import { EmptySection, InquiryRow, pageParam } from "../portal-ui";
import { PortalPagination } from "../portal-pagination";
import styles from "../portal.module.css";

type PageProps = { searchParams: Promise<{ page?: string | string[] }> };

export default async function InquiriesPage({ searchParams }: PageProps) {
  const page = pageParam((await searchParams).page);
  const inquiries = await getPortalInquiries(page);
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p>Customer requests</p>
          <h1>Inquiries and orders</h1>
          <span>Every vehicle request you have sent us, and where it stands.</span>
        </div>
      </header>
      {inquiries.data.length ? (
        <>
          <div className={styles.rowList}>
            {inquiries.data.map((inquiry) => (
              <InquiryRow key={inquiry.reference} inquiry={inquiry} />
            ))}
          </div>
          <PortalPagination pageCount={inquiries.lastPage} currentPage={inquiries.page} />
        </>
      ) : (
        <EmptySection
          title="No inquiries yet"
          description="Your submitted vehicle requests will appear here."
          action={{ href: "/vehicles", label: "Browse vehicles" }}
        />
      )}
    </>
  );
}
