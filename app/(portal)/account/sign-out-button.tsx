"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

import styles from "./portal.module.css";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } finally {
      router.replace("/sign-in");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      className={styles.signOut}
      onClick={signOut}
      disabled={pending}
    >
      <LogOut aria-hidden="true" />
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
