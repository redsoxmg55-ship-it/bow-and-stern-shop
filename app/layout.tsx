import type { Metadata } from "next";
import "./globals.css";
import MaintenancePopup from "@/components/MaintenancePopup";

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
      <body>
        <MaintenancePopup />
        {children}
      </body>
    </html>
  );
}
