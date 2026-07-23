"use client";

import { CircleAlert, RefreshCw } from "lucide-react";

import styles from "./portal.module.css";

export default function AccountError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className={styles.emptyState}>
      <CircleAlert aria-hidden="true" />
      <h1>We could not load your account</h1>
      <p>
        Your session is safe. The ERP may be restarting or temporarily
        unavailable.
      </p>
      <button type="button" onClick={reset}>
        <RefreshCw aria-hidden="true" /> Try again
      </button>
    </section>
  );
}
