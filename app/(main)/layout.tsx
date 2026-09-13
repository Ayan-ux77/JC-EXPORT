import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Menu, MessageCircle, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { BrandLogo } from "@/app/components/brand-logo";
import { NavLink } from "@/app/components/nav-link";
import { getCustomerSession } from "@/data/customer-session";
import { mailto, site, whatsapp } from "@/data/site";

import "../globals.css";
import styles from "./layout.module.css";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Social links render only when a URL is configured for them.
 *
 * They were four buttons pointing at "#": a row of controls that look
 * clickable, do nothing, and tell a buyer the company is a template. An
 * unconfigured account simply has no icon.
 */
const socialLinks = [
  { label: "Facebook", Icon: FaFacebookF, href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
  { label: "Instagram", Icon: FaInstagram, href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "YouTube", Icon: FaYoutube, href: process.env.NEXT_PUBLIC_YOUTUBE_URL },
  { label: "LinkedIn", Icon: FaLinkedinIn, href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
].filter((link): link is { label: string; Icon: typeof FaFacebookF; href: string } =>
  Boolean(link.href),
);

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
      { label: "About Japan Car Export", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Buyer FAQ", href: "/faq" },
      // Terms and Privacy live in the bottom bar, where legal links are
      // conventionally looked for -- listing them here as well put the same
      // two links in the footer twice.
      { label: "Shipping & payment", href: "/shipping-and-payment" },
    ],
  },
];

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session = await getCustomerSession();
  const accountHref = session ? "/account" : "/sign-in";
  const accountLabel = session ? "My account" : "Sign in";

  const whatsappHref = whatsapp();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.utilityBar}>
          <div className={styles.utilityInner}>
            <div className={styles.utilityContacts}>
              {site.phoneHref && (
                <a href={site.phoneHref}>
                  <Phone aria-hidden="true" /> {site.phone}
                </a>
              )}
              <a href={mailto()}>
                <Mail aria-hidden="true" /> {site.salesEmail}
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
          <Link href="/" className={styles.logoLink} aria-label="Japan Car Export home">
            <BrandLogo />
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <ul>
              {navigation.map((item) => (
                <li key={item.label}>
                  <NavLink
                    href={item.href}
                    activeClassName={styles.navActive}
                    exact={item.href === "/"}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.headerActions}>
            <Link href={accountHref} className={styles.signInLink}>
              {accountLabel}
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
                <NavLink
                  key={item.label}
                  href={item.href}
                  activeClassName={styles.mobileNavActive}
                  exact={item.href === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link href={accountHref}>{accountLabel}</Link>
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
            <Link href="/" aria-label="Japan Car Export home">
              <BrandLogo tone="on-dark" size="footer" />
            </Link>
            <p>
              Japan-sourced used vehicle export with clear condition evidence,
              documentation, and worldwide shipping support.
            </p>
            <div className={styles.footerContact}>
              {site.phoneHref && (
                <a href={site.phoneHref}>
                  <Phone aria-hidden="true" /> {site.phone}
                </a>
              )}
              <a href={mailto()}>
                <Mail aria-hidden="true" /> {site.salesEmail}
              </a>
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> Message us on WhatsApp
                </a>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className={styles.socialLinks}>
                {socialLinks.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Japan Car Export on ${label}`}
                    title={label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
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
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
