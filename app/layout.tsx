import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Japan Car Export | Japanese Used Vehicle Exporter",
  description:
    "Japan Car Export sources, inspects, documents, and ships Japanese used vehicles worldwide with clear FOB pricing at every step.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
