import "../globals.css";
import styles from "./layout.module.css";
import Image from "next/image";
import { LuPhone } from "react-icons/lu";
import { CiMail } from "react-icons/ci";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

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

      <section className={styles.footer}>
        <section className={styles.footerTop}>
          {/* LEFT */}
          <section className={styles.footerLeft}>
            <Image src="/logo1.png" alt="JC Export" width={170} height={45} />

            <p className={styles.footerDesc}>
              Premium Japanese vehicle export from Pakistan to the world.
              Fifteen years, four thousand shipments, zero shortcuts.
            </p>

            <section className={styles.socialIcons}>
              <section className={styles.iconBox}>
                <FaFacebookF />
              </section>

              <section className={styles.iconBox}>
                <FaInstagram />
              </section>

              <section className={styles.iconBox}>
                <FaYoutube />
              </section>

              <section className={styles.iconBox}>
                <FaLinkedinIn />
              </section>
            </section>
          </section>

          {/* Explore */}
          <section className={styles.footerColumn}>
            <h3>EXPLORE</h3>

            <Link href="#">Inventory</Link>
            <Link href="#">Auction Sourcing</Link>
            <Link href="#">Features Cars</Link>
            <Link href="#">Sold Archive</Link>
          </section>

          {/* Services */}
          <section className={styles.footerColumn}>
            <h3>SERVICES</h3>

            <Link href="#">Export</Link>
            <Link href="#">Inspection</Link>
            <Link href="#">Shipping</Link>
            <Link href="#">Documentation</Link>
          </section>

          {/* Company */}
          <section className={styles.footerColumn}>
            <h3>COMPANY</h3>

            <Link href="#">About us</Link>
            <Link href="#">Contact</Link>
            <Link href="#">FAQ</Link>
            <Link href="#">Term & Privacy</Link>
          </section>
        </section>

        <section className={styles.footerLine}></section>

        <section className={styles.footerBottom}>
          <p>© 2026 JC Export. Peshawar, Pakistan.</p>

          <p>Crafted with precision · Designed for export.</p>
        </section>
      </section>

      {/* <footer className={styles.footer1}>
        <section className={styles.logo1}>
          <img src="/logo1.png" alt="logo" />
          <p>
            Premium Japanese vehicle export from Pakistan to the world. Fifteen
            years, four thousand shipments, zero shortcuts.
          </p>
          <section className={styles.socialIcons}>
            <section className={styles.iconBox}>
              <FaFacebookF />
            </section>

            <section className={styles.iconBox}>
              <FaInstagram />
            </section>

            <section className={styles.iconBox}>
              <FaYoutube />
            </section>

            <section className={styles.iconBox}>
              <FaLinkedinIn />
            </section>
            <section className={styles.ex}>
              <h1>Explore</h1>
              <ul className={styles.list1}>
                <li>Inventory</li>
                <li>Auction </li>
                <li>Features Cars</li>
                <li>Solid Archive</li>
              </ul>
            </section>
          </section>
        </section>
      </footer> */}
    </>
  );
}
