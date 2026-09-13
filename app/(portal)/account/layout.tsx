import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Ship,
  UserRound,
} from "lucide-react";

import { BrandLogo } from "@/app/components/brand-logo";
import { NavLink } from "@/app/components/nav-link";
import { getCustomerSession } from "@/data/customer-session";

import "../../globals.css";
import { SignOutButton } from "./sign-out-button";
import styles from "./portal.module.css";

const navigation = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/account/payments", label: "Payments", icon: CircleDollarSign },
  { href: "/account/shipments", label: "Shipments", icon: Ship },
  { href: "/account/documents", label: "Documents", icon: FileText },
  { href: "/account/profile", label: "Profile", icon: UserRound },
];

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getCustomerSession();
  if (!session) {
    redirect("/sign-in?next=/account");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo} aria-label="Japan Car Export home">
          <BrandLogo tone="on-dark" size="compact" />
        </Link>
        <nav aria-label="Customer account">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                href={item.href}
                activeClassName={styles.navActive}
                revealWhenActive
                // Overview is the section index: without an exact match it
                // would stay lit on every page beneath /account.
                exact={item.href === "/account"}
              >
                <Icon aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <p>{session.name}</p>
          <span>{session.email}</span>
          <SignOutButton />
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <span>Customer portal</span>
            <strong>{session.company || session.name}</strong>
          </div>
          <div className={styles.topbarActions}>
            <Link href="/vehicles">Browse vehicles</Link>
            <Link href="/contact">Get support</Link>
            <span className={styles.mobileSignOut}>
              <SignOutButton />
            </span>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
