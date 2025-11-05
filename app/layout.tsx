import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://projektbezkodu.pl"),
  applicationName: "ProjektBezKodu",
  title: {
    default: "ProjektBezKodu – Profesjonalne strony bez kodu",
    template: "%s | ProjektBezKodu",
  },
  description:
    "Polska biblioteka no-code: szablony, komponenty i tutoriale, dzięki którym uruchomisz profesjonalną stronę bez kodu – szybko i wydajnie.",
  keywords: [
    "no-code",
    "projekt bez kodu",
    "webflow",
    "framer",
    "strony internetowe",
    "szablony",
    "tutoriale",
    "seo",
    "performance",
  ],
  authors: [{ name: "ProjektBezKodu" }],
  themeColor: "#4338CA",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "ProjektBezKodu",
    title: "ProjektBezKodu – Profesjonalne strony bez kodu",
    description:
      "Szablony, komponenty i poradniki po polsku. Zbuduj szybkie, dostępne strony bez kodu.",
    url: "https://projektbezkodu.pl",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProjektBezKodu – Profesjonalne strony bez kodu",
    description:
      "Polskie tutoriale i komponenty no-code, które pomagają wystartować w weekend.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
