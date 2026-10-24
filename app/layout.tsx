import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "V2 Foundry",
    template: "%s · V2 Foundry",
  },
  description:
    "Build your next version. Assess your whole position, pick a few moves, and forge the life that comes next.",
  metadataBase: new URL("https://v2foundry.com"),
  openGraph: {
    title: "V2 Foundry",
    description: "Build your next version.",
    siteName: "V2 Foundry",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="vf-shell">
          <div className="vf-atmosphere" aria-hidden="true">
            <div className="vf-atmosphere__base" />
            <div className="vf-atmosphere__haze" />
            <div className="vf-atmosphere__ember" />
            <div className="vf-atmosphere__grain" />
          </div>
          <div className="vf-shell__content">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
