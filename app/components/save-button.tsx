"use client";

import { Heart } from "lucide-react";

import { useShortlist } from "@/data/shortlist";
import styles from "./save-button.module.css";

type SaveButtonProps = {
  slug: string;
  title: string;
};

/**
 * Keep a car, or stop keeping it.
 *
 * Rendered on every card and on the vehicle page. Before hydration the store
 * reports an empty list, so the heart starts hollow and fills in once the
 * browser has read localStorage -- which is correct rather than a flash: the
 * server genuinely does not know what this person has saved.
 */
export function SaveButton({ slug, title }: SaveButtonProps) {
  const { has, toggle } = useShortlist();
  const saved = has(slug);

  return (
    <button
      type="button"
      className={styles.save}
      data-saved={saved ? "true" : "false"}
      aria-pressed={saved}
      // The label says what the button will DO, not what it is, so a screen
      // reader user hears the outcome rather than having to infer it.
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      title={saved ? "Remove from saved" : "Save this vehicle"}
      onClick={(event) => {
        // Cards wrap their image in a link; saving must not navigate.
        event.preventDefault();
        event.stopPropagation();
        toggle(slug);
      }}
    >
      <Heart aria-hidden="true" />
    </button>
  );
}
