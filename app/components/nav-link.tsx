"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  /** Class applied on top of `className` when this link is the current page. */
  activeClassName?: string;
  /**
   * Match the path exactly instead of also matching everything beneath it.
   * Needed for a section's own index -- "/account" would otherwise stay lit
   * while the reader is on "/account/payments", and two tabs would look
   * current at once.
   */
  exact?: boolean;
  /**
   * Scroll this link into view when it is the current page. Set on navs that
   * scroll sideways on a phone, where the current tab is otherwise off the
   * right edge and the reader cannot see which page they are on at all.
   */
  revealWhenActive?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "children">;

export function NavLink({
  href,
  children,
  activeClassName,
  exact = false,
  revealWhenActive = false,
  className,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLAnchorElement>(null);

  // A section stays current while the reader is inside it: "Vehicles" should
  // not go dark the moment they open one car's page.
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!revealWhenActive || !isActive) {
      return;
    }
    // "nearest" on the block axis so bringing a tab into view sideways never
    // also scrolls the page away from where the reader left it.
    ref.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [revealWhenActive, isActive]);

  return (
    <Link
      ref={ref}
      href={href}
      // aria-current is what actually tells a screen reader which tab is the
      // current one. The styling below is the sighted half of the same fact.
      aria-current={isActive ? "page" : undefined}
      className={[className, isActive ? activeClassName : null].filter(Boolean).join(" ") || undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
