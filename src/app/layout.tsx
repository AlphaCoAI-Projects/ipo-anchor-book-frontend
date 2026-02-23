import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPO Anchor Analytics",
  description: "IPO Anchor Book Dashboard — MongoDB-backed analytics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
