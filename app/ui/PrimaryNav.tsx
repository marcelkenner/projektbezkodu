import Link from "next/link";
import type { ReactNode } from "react";
import "./ui.css";

export interface NavLink {
  label: string;
  href: string;
}

interface PrimaryNavProps {
  logo: ReactNode;
  links: NavLink[];
  cta?: {
    label: string;
    href: string;
  };
}

export function PrimaryNav({ logo, links, cta }: PrimaryNavProps) {
  return (
    <header className="pbk-container">
      <nav className="pbk-nav" aria-label="Główna nawigacja">
        <div className="pbk-nav__logo">{logo}</div>
        <div className="pbk-nav__links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="pbk-nav__link">
              {link.label}
            </Link>
          ))}
        </div>
        {cta ? (
          <div className="pbk-nav__cta">
            <Link href={cta.href} className="pbk-button pbk-button--primary">
              {cta.label}
            </Link>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
