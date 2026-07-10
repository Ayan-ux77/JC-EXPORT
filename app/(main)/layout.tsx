import "../globals.css";
import styles from "./layout.module.css";
import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { CiMail } from "react-icons/ci";
import Link from "next/link";

export default function MainLayout({ children }) {
  return (
    <>
      <header className={styles.box}>
        <nav className={styles.nav}>
          <section className={styles.number}>
            <p>
              <LuPhone /> +92 300 1234567
            </p>
            <p>
              <CiMail /> info@jcexport.com
            </p>
          </section>

          <section className={styles.language}>
            <p>
              <span>EN</span>
              <span>اردو</span>
              <span>日本語</span>
            </p>
          </section>
        </nav>

        <section className={styles.logo}>
          <Image src="/home/image 1.png" alt="logo" width={205} height={72} />

          <section className={styles.navbar}>
            <ul className={styles.list}>
              <Link href="/"> Home </Link>
              <Link href="#">About</Link>
              <Link href="#">Inventory</Link>
              <Link href="#">Services</Link>
              <Link href="#">Contact</Link>
              <Link href="/sign-in">Sign in</Link>
            </ul>
          </section>

          <section className={styles.btn}>
            <button className={styles.btn1}>Browse Inventory</button>
            <button className={styles.btn2}>Get a Quote &rarr;</button>
          </section>
        </section>
      </header>

      {/* Render the page content here */}
      <main>{children}</main>
    </>
  );
}
