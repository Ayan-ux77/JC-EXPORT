"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useShortlist } from "@/data/shortlist";
import styles from "./saved-link.module.css";

/**
 * The way back to the shortlist.
 *
 * A saved list nobody can find is not a feature. The count is the point --
 * it is what reminds a buyer three days later that they were part-way
 * through choosing.
 *
 * Renders as zero on the server and fills in after hydration, because what
 * is saved lives in this browser and the server genuinely does not know it.
 */
export function SavedLink() {
  const { saved } = useShortlist();

  return (
    <Link href="/saved" className={styles.link} aria-label={`Saved vehicles (${saved.length})`}>
      <Heart aria-hidden="true" data-filled={saved.length > 0 ? "true" : "false"} />
      <span className={styles.label}>Saved</span>
      {saved.length > 0 && <span className={styles.count}>{saved.length}</span>}
    </Link>
  );
}
