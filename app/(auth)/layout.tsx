import styles from "./layout.module.css";
import Link from "next/link";
import { BrandLogo } from "@/app/components/brand-logo";
import { ArrowLeft, Headphones } from "lucide-react";

import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={styles.box}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logoLink} aria-label="JC Export home">
            <BrandLogo tone="on-dark" size="compact" />
          </Link>

          <div className={styles.right}>
            <Link href="/vehicles">
              <ArrowLeft aria-hidden="true" /> Browse vehicles
            </Link>
            <Link href="/contact">
              <Headphones aria-hidden="true" /> Contact support
            </Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
