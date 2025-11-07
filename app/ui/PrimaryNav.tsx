import Link from "next/link";
import type { ReactNode } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import "./ui.css";

export interface NavLink {
  label: string;
  href: string;
}

export interface SearchConfig {
  action: string;
  label: string;
  placeholder: string;
  buttonLabel: string;
}

interface PrimaryNavProps {
  logo: ReactNode;
  links: NavLink[];
  search: SearchConfig;
}

export function PrimaryNav({ logo, links, search }: PrimaryNavProps) {
  return (
    <header className="site-header" role="banner">
      <div className="pbk-container site-header__inner">
        <Link
          href="/"
          className="site-header__logo"
          aria-label="Strona główna ProjektBezKodu"
        >
          {logo}
        </Link>
        <nav className="site-header__nav" aria-label="Główna nawigacja">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-header__navLink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <SearchForm config={search} />
      </div>
    </header>
  );
}

interface SearchFormProps {
  config: SearchConfig;
}

function SearchForm({ config }: SearchFormProps) {
  return (
    <form
      className="site-header__search"
      action={config.action}
      role="search"
      aria-label={config.label}
    >
      <label htmlFor="global-search" className="sr-only">
        {config.label}
      </label>
      <input
        id="global-search"
        name="q"
        type="search"
        required
        placeholder={config.placeholder}
        autoComplete="off"
      />
      <button type="submit" className="site-header__searchButton">
        <MagnifyingGlass aria-hidden="true" size={20} weight="bold" />
        <span className="sr-only">{config.buttonLabel}</span>
      </button>
    </form>
  );
}
