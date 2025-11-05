import Link from "next/link";
import type { ReactNode } from "react";
import "./ui.css";

export interface NavLink {
  label: string;
  href: string;
}

interface ArticleNavLink {
  slug: string;
  label: string;
  description?: string;
  href: string;
}

interface ArticlesNavConfig {
  label: string;
  categories: ArticleNavLink[];
  seeAll?: {
    label: string;
    href: string;
  };
}

interface PrimaryNavProps {
  logo: ReactNode;
  links: NavLink[];
  articlesNav?: ArticlesNavConfig;
  cta?: {
    label: string;
    href: string;
  };
}

export function PrimaryNav({ logo, links, articlesNav, cta }: PrimaryNavProps) {
  return (
    <header className="pbk-container">
      <nav className="pbk-nav" aria-label="Główna nawigacja">
        <div className="pbk-nav__logo">{logo}</div>
        <div className="pbk-nav__links">
          {articlesNav ? <ArticlesDropdown config={articlesNav} /> : null}
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

interface ArticlesDropdownProps {
  config: ArticlesNavConfig;
}

function ArticlesDropdown({ config }: ArticlesDropdownProps) {
  if (!config.categories.length) {
    const href = config.seeAll?.href ?? "/artykuly/";
    return (
      <Link href={href} className="pbk-nav__link">
        {config.label}
      </Link>
    );
  }

  return (
    <details className="pbk-nav__dropdown">
      <summary className="pbk-nav__dropdown-trigger">
        <span>{config.label}</span>
      </summary>
      <div className="pbk-nav__dropdown-panel" role="menu">
        <ul className="pbk-nav__dropdown-list">
          {config.categories.map((category) => (
            <li key={category.slug} className="pbk-nav__dropdown-item">
              <Link href={category.href} role="menuitem">
                <span className="pbk-nav__dropdown-itemLabel">{category.label}</span>
                {category.description ? (
                  <span className="pbk-nav__dropdown-itemDescription">
                    {category.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
        {config.seeAll ? (
          <div className="pbk-nav__dropdown-footer">
            <Link href={config.seeAll.href}>{config.seeAll.label}</Link>
          </div>
        ) : null}
      </div>
    </details>
  );
}
