import { SiteArrival } from "@/components/ui/brand-loading/site-arrival";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/config/env";
import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";
import "./globals.css";
const dmSans = localFont({
  src: "../../public/fonts/dm-sans-variable.ttf",
  variable: "--font-dm-sans",
  weight: "100 1000",
  style: "normal",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "Cape Coast Central SDA",
    template: "%s | Cape Coast Central SDA",
  },
  description: "Cape Coast Central Seventh-day Adventist Church",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  const content = (
    <QueryProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteArrival />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
    </QueryProvider>
  );
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="flex min-h-screen flex-col supports-[min-height:100dvh]:min-h-dvh">
        {content}
      </body>
    </html>
  );
}
