"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import {
  List as MenuIcon,
  X as CloseIcon,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
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
  const [isMenuOpen, setMenuOpen] = useState(false);
  const drawerId = `site-header-drawer-${useId()}`;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const { body } = document;
    const previousOverflow = body.style.overflow;
    if (isMenuOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isMenuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="site-header" role="banner">
      <div className="pbk-container site-header__inner">
        <Link
          href="/"
          className="site-header__logo"
          aria-label="Strona główna ProjektBezKodu"
          onClick={closeMenu}
        >
          {logo}
        </Link>
        <nav
          className="site-header__nav site-header__nav--desktop"
          aria-label="Główna nawigacja"
        >
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
        <SearchForm
          config={search}
          className="site-header__search site-header__search--desktop"
          inputId="global-search-desktop"
        />
        <button
          type="button"
          className="site-header__menuButton"
          aria-controls={drawerId}
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="sr-only">
            {isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
          </span>
          {isMenuOpen ? (
            <CloseIcon aria-hidden="true" size={22} weight="bold" />
          ) : (
            <MenuIcon aria-hidden="true" size={22} weight="bold" />
          )}
        </button>
      </div>
      <div
        className={`site-header__drawer ${isMenuOpen ? "is-open" : ""}`}
        id={drawerId}
        aria-label="Menu mobilne"
      >
        <nav className="site-header__nav site-header__nav--drawer">
          {links.map((link) => (
            <Link
              key={`drawer-${link.href}`}
              href={link.href}
              className="site-header__navLink"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <SearchForm
          config={search}
          className="site-header__search site-header__search--drawer"
          inputId="global-search-mobile"
        />
      </div>
      <div
        className={`site-header__overlay ${isMenuOpen ? "is-visible" : ""}`}
        aria-hidden="true"
        onClick={closeMenu}
      />
    </header>
  );
}

interface SearchFormProps {
  config: SearchConfig;
  className?: string;
  inputId?: string;
}

function SearchForm({
  config,
  className = "site-header__search",
  inputId = "global-search",
}: SearchFormProps) {
  return (
    <form
      className={className}
      action={config.action}
      role="search"
      aria-label={config.label}
    >
      <label htmlFor={inputId} className="sr-only">
        {config.label}
      </label>
      <input
        id={inputId}
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
