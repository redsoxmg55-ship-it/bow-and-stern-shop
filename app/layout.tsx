import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bow & Stern Soap Co.",
  description: "Handcrafted soap, made with intention. Small-batch bars from the New England coast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
