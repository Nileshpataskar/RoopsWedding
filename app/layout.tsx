import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Montserrat } from "next/font/google";
import { wedding } from "@/lib/wedding-config";
import { formatLongDate } from "@/lib/format";
import "./globals.css";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const couple = `${wedding.groom.name} & ${wedding.bride.name}`;

export const metadata: Metadata = {
  title: `${couple} · ${wedding.siteName}`,
  description: `You are invited to the wedding of ${couple} on ${formatLongDate(wedding.date.start)}.`,
  applicationName: wedding.siteName,
  openGraph: {
    title: `${couple} are getting married`,
    description: `Join us on ${formatLongDate(wedding.date.start)} at ${wedding.venue.name}.`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7b8460",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}
    >
      <body className="backdrop min-h-svh">{children}</body>
    </html>
  );
}
