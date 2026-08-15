import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = DM_Sans({
  variable: "--font-sans-ui",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casino Reviews",
  description: "Independent casino and bookmaker reviews",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full font-[family-name:var(--font-sans-ui)] antialiased">
        {children}
      </body>
    </html>
  );
}
