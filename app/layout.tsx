import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, manrope, jetBrainsMono } from "./ui/fonts";

export const viewport: Viewport = {
  themeColor: "#4338CA",
};

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
        className={`${inter.variable} ${manrope.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
