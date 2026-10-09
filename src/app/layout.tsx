import type { Metadata } from "next";
import { Quicksand, Crimson_Text } from "next/font/google";
import SiteHeader from "../shared/layout/SiteHeader";
import SiteFooter from "../shared/layout/SiteFooter";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-crimson",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "SkinWise — Skincare ingredients, finally made simple", template: "%s · SkinWise" },
  description:
    "SkinWise decodes your product labels, flags ingredient conflicts, and helps you build a skincare routine that actually works.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${crimson.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sw-btn sw-btn-primary absolute left-4 top-2 z-50 -translate-y-20 focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}