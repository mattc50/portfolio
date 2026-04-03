import type { Metadata } from "next";
import { Sora, Inter, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CursorOverlay } from "@/components/CursorOverlay";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Swap these out to change the typographic personality of the site.
// See: https://fonts.google.com

// const display = Sora({
//   weight: ["700"],
//   style: ["normal"],
//   subsets: ["latin"],
//   variable: "--font-display",
//   display: "swap",
// });

const display = Inter({
  weight: ["700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Portfolio of Matthew Canabarro",
    template: "%s — Matthew Canabarro",
  },
  description:
    "Product Designer and Design Engineer with a hybrid background spanning product design, frontend engineering, and AI product work.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://matthewcanabarro.com", // ← update if domain differs
    siteName: "Matthew Canabarro",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Nav />
        <main style={{ paddingTop: "var(--nav-height)" }}>
          {children}
        </main>
        <CursorOverlay />
      </body>
    </html>
  );
}
