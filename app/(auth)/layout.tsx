import styles from "./layout.module.css";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={styles.box}>
        <nav className={styles.nav}>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="JC Export Logo"
              width={121}
              height={45}
            />
          </Link>

          <div className={styles.right}>
            <ul className={styles.list}>
              <li>
                <button>MARKETING ▼</button>
              </li>
              <li>
                <button>INVENTORY ▼</button>
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
