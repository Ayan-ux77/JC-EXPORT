"use client";

import { useRouter } from "next/navigation";
import { BookmarkCheck } from "lucide-react";
import { useState } from "react";

import styles from "../../portal.module.css";

type ReservationResponse = {
  data?: { state?: string };
  error?: { message?: string };
};

export function ReservationAction({ reference }: { reference: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function reserve() {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/account/inquiries/${encodeURIComponent(reference)}/reservation`,
        { method: "POST" },
      );
      const payload = (await response.json()) as ReservationResponse;
      if (!response.ok) {
        throw new Error(payload.error?.message || "Reservation request failed.");
      }
      setMessage(
        payload.data?.state === "reserved"
          ? "Vehicle reserved successfully."
          : "Your request was sent to our sales team.",
      );
      router.refresh();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Reservation request failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.reservationAction}>
      <button type="button" onClick={reserve} disabled={pending}>
        <BookmarkCheck aria-hidden="true" />
        {pending ? "Sending request..." : "Reserve this vehicle"}
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
