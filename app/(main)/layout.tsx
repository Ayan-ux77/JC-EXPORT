import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Menu, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { BrandLogo } from "@/app/components/brand-logo";

import "../globals.css";
import styles from "./layout.module.css";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Current vehicles", href: "/vehicles" },
      { label: "Featured vehicles", href: "/#vehicles" },
      { label: "Request a quote", href: "/quote" },
      { label: "Shipping & payment", href: "/shipping-and-payment" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Vehicle sourcing", href: "/services#sourcing" },
      { label: "Inspection support", href: "/services#inspection" },
      { label: "International shipping", href: "/services#shipping" },
      { label: "Export documents", href: "/services#documents" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About JC Export", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Buyer FAQ", href: "/faq" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.utilityBar}>
          <div className={styles.utilityInner}>
            <div className={styles.utilityContacts}>
              <a href="tel:+923001234567">
                <Phone aria-hidden="true" /> +92 300 123 4567
              </a>
              <a href="mailto:info@jcexport.com">
                <Mail aria-hidden="true" /> info@jcexport.com
              </a>
            </div>
            <div className={styles.languages} aria-label="Available languages">
              <span>EN</span>
              <span>اردو</span>
              <span>日本語</span>
            </div>
          </div>
        </div>

        <div className={styles.mainNav}>
          <Link href="/" className={styles.logoLink} aria-label="JC Export home">
            <BrandLogo />
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <ul>
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.headerActions}>
            <Link href="/sign-in" className={styles.signInLink}>
              Sign in
            </Link>
            <Link href="/vehicles" className={styles.vehiclesButton}>
              Browse stock
            </Link>
            <Link href="/quote" className={styles.quoteButton}>
              Get a quote <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <details className={styles.mobileMenu}>
            <summary aria-label="Open navigation menu" title="Open navigation">
              <Menu aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/sign-in">Sign in</Link>
              <Link href="/quote" className={styles.mobileQuoteLink}>
                Get a quote <ArrowRight aria-hidden="true" />
              </Link>
            </nav>
          </details>
        </div>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link href="/" aria-label="JC Export home">
              <BrandLogo tone="on-dark" size="footer" />
            </Link>
            <p>
              Japan-sourced used vehicle export with clear condition evidence,
              documentation, and worldwide shipping support.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="JC Export on Facebook" title="Facebook">
                <FaFacebookF aria-hidden="true" />
              </a>
              <a href="#" aria-label="JC Export on Instagram" title="Instagram">
                <FaInstagram aria-hidden="true" />
              </a>
              <a href="#" aria-label="JC Export on YouTube" title="YouTube">
                <FaYoutube aria-hidden="true" />
              </a>
              <a href="#" aria-label="JC Export on LinkedIn" title="LinkedIn">
                <FaLinkedinIn aria-hidden="true" />
              </a>
            </div>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} className={styles.footerColumn} aria-label={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 JC Export. All rights reserved.</p>
          <p>Japan-sourced vehicles. Worldwide support.</p>
        </div>
      </footer>
    </>
  );
}
