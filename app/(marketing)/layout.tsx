import type { ReactNode } from "react";
import { PrimaryNav, Footer } from "../ui";
import { getCopy } from "../lib/copy";

const NAV_LINKS = [
  { label: "Artykuły", href: "/artykuly" },
  { label: "Porównania", href: "/porownania" },
  { label: "Tutoriale", href: "/poradniki" },
  { label: "Słownik", href: "/glossary" },
];

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const globalCopy = getCopy("global");

  return (
    <div>
      <PrimaryNav
        logo={<span>ProjektBezKodu</span>}
        links={NAV_LINKS}
        cta={{ label: globalCopy.ctas.secondary, href: "/porownania" }}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
