import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orion OS",
  description: "A simple OS-like interface with genie effect",
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
