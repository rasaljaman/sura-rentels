import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SessionProvider } from "@/components/auth/session-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sura Rentals | Peer-to-peer car rentals",
  description:
    "Sura Rentals is a modern peer-to-peer car rental marketplace with verified listings and secure bookings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <SessionProvider>
          <ToastProvider>
            <SiteHeader />
            <main className="min-h-screen">{children}</main>
            <SiteFooter />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
