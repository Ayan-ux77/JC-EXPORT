import styles from "./layout.module.css";
import Link from "next/link";
import { BrandLogo } from "@/app/components/brand-logo";

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
            <ul className={styles.list}>
              <li>
                <button>MARKETING ▼</button>
              </li>
              <li>
                <button>VEHICLES ▼</button>
              </li>
              <li>
                <button className={styles.authBtn}>AUTHENTICATION ▼</button>
              </li>
              <li>
                <button>DASHBOARD ▼</button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
