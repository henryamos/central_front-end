import type { Metadata } from "next";
import localFont from "next/font/local";
import { env } from "@/config/env";
import { MockProvider } from "@/providers/mock-provider";
import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
const figtree = localFont({
  src: "../../public/fonts/figtree-variable.ttf",
  variable: "--font-figtree",
  weight: "300 900",
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
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </QueryProvider>
  );
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        {env.mockingEnabled ? <MockProvider>{content}</MockProvider> : content}
      </body>
    </html>
  );
}
