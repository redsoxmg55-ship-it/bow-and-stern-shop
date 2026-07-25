import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://shopbowandsternsoap.com'),
  title: "Bow & Stern Soap Co.",
  description: "Handcrafted soap, made with intention. Small-batch bars from the New England coast.",
  alternates: {
    canonical: '/',
  },
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
