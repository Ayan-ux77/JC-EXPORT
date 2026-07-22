"use client";

import ReactPaginate from "react-paginate";
import styles from "./pagination.module.css";

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (event: { selected: number }) => void;
};

export function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage}
      onPageChange={onPageChange}
      previousLabel="← Prev"
      nextLabel="Next →"
      breakLabel="..."
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      renderOnZeroPageCount={null}
      containerClassName={styles.pagination}
      pageClassName={styles.pageItem}
      pageLinkClassName={styles.pageLink}
      previousClassName={styles.previousItem}
      previousLinkClassName={styles.previousLink}
      nextClassName={styles.nextItem}
      nextLinkClassName={styles.nextLink}
      breakClassName={styles.breakItem}
      breakLinkClassName={styles.breakLink}
      activeClassName={styles.activePage}
      disabledClassName={styles.disabledPage}
    />
  );
}
