"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { NavLink } from "@/app/components/nav-link";
import styles from "../layout.module.css";

type NavItem = { label: string; href: string };

type MobileNavProps = {
  navigation: NavItem[];
  accountHref: string;
  accountLabel: string;
};

/**
 * The small-screen menu.
 *
 * It used to be a bare <details>, which cannot do any of the three things a
 * menu has to do: the button kept showing a hamburger while the menu was
 * open, tapping a link left the panel covering the page it had just opened,
 * and nothing closed it but tapping the button again.
 */
export function MobileNav({ navigation, accountHref, accountLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Navigating closes it. Adjusted during render rather than from an effect:
  // closing in an effect renders the menu open once more before correcting
  // itself, so the panel flashes over the new page. Keyed on the path, not an
  // onClick per link, so the back button closes it too -- otherwise it hangs
  // open over the page it just returned to.
  const [renderedPath, setRenderedPath] = useState(pathname);

  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className={styles.mobileMenu} ref={containerRef} data-open={open || undefined}>
      <button
        type="button"
        className={styles.mobileMenuButton}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation">
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
      )}
    </div>
  );
}
