"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Pagination } from "@/app/(main)/components/pagination";

type PortalPaginationProps = {
  pageCount: number;
  /** One-based, as the API numbers pages. */
  currentPage: number;
  /**
   * The query parameter this control owns. The payments page carries two
   * independent lists, so each needs its own or paging the invoices would
   * silently reset the remittances beside them.
   */
  param?: string;
};

export function PortalPagination({ pageCount, currentPage, param = "page" }: PortalPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) {
    return null;
  }

  return (
    <Pagination
      pageCount={pageCount}
      currentPage={currentPage - 1}
      onPageChange={({ selected }) => {
        const next = new URLSearchParams(searchParams.toString());
        // Page one is the bare URL. Leaving "?page=1" behind would give the
        // same list two addresses and make the back button feel broken.
        if (selected === 0) {
          next.delete(param);
        } else {
          next.set(param, String(selected + 1));
        }
        const query = next.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
      }}
    />
  );
}
