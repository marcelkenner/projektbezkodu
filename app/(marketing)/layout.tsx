import type { ReactNode } from "react";
import { PrimaryNav, Footer, ToolOfWeekToastContainer } from "../ui";
import { getCopy } from "../lib/copy";
import { getToolOfWeek } from "../lib/toolShowcase";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const homepageCopy = getCopy("homepage");
  const header = homepageCopy.header;
  const toolOfWeek = getToolOfWeek();
  const skipLinkTarget = header.skipLink?.target ?? "#content";
  const skipLinkLabel = header.skipLink?.label ?? "Pomiń do treści";
  const navigationLinks = header.nav ?? [];
  const searchConfig = header.search ?? {
    action: "/szukaj/",
    label: "Szukaj w serwisie",
    placeholder: "Czego szukasz?",
    buttonLabel: "Szukaj",
  };

  return (
    <>
      <div className="site-shell">
        <a className="skip-link" href={skipLinkTarget}>
          {skipLinkLabel}
        </a>
        <PrimaryNav
          logo={<Logo />}
          links={navigationLinks}
          search={searchConfig}
        />
        <main id={skipLinkTarget.replace("#", "")}>{children}</main>
        <Footer />
      </div>
      {toolOfWeek ? <ToolOfWeekToastContainer tool={toolOfWeek} /> : null}
    </>
  );
}

function Logo() {
  return (
    <span className="site-header__wordmark" aria-hidden="true">
      ProjektBezKodu
    </span>
  );
}
