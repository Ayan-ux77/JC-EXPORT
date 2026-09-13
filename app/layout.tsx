import type { Metadata } from "next";

import { fontVariables } from "./fonts";
import { site } from "@/data/site";

export const metadata: Metadata = {
  // Without a base, every canonical and social-preview URL Next generates is
  // a relative path, which is the same as having none once the page is shared.
  metadataBase: new URL(site.url),
  title: `${site.name} | Japanese Used Vehicle Exporter`,
  description:
    `${site.name} sources, inspects, documents, and ships Japanese used vehicles worldwide with clear FOB pricing at every step.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /**
     * The type variables belong here, not on each page.
     *
     * They were previously set only by the public marketing pages, so the
     * customer portal and the sign-in screens -- which reference the same
     * var(--font-display) -- resolved it to nothing and quietly fell back to
     * Georgia. A customer signing in watched the site change typeface.
     */
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
