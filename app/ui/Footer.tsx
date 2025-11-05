import Link from "next/link";
import { getCopy } from "../lib/copy";
import { articleTaxonomyCatalog } from "../lib/content/articleTaxonomy";
import "./ui.css";

export function Footer() {
  const copy = getCopy("footer");
  const articlesCopy = getCopy("articles");
  const year = new Date().getFullYear();
  const navigation = articlesCopy.navigation ?? {};
  const categoryLinks = (navigation.featuredCategories ?? [])
    .map((category: { slug: string; label?: string; href?: string }) => {
      const taxonomyCategory = articleTaxonomyCatalog.getCategory(category.slug);
      return {
        href: category.href ?? `/kategoria/${category.slug}/`,
        label: category.label ?? taxonomyCategory?.label ?? category.slug,
      };
    })
    .filter(Boolean);

  if (navigation.seeAllHref) {
    categoryLinks.push({
      href: navigation.seeAllHref,
      label: navigation.seeAllLabel ?? navigation.menuLabel ?? "Wszystkie artykuły",
    });
  }

  const footerColumns = [...(copy.columns ?? [])];
  if (categoryLinks.length) {
    footerColumns.unshift({
      heading: navigation.footerHeading ?? "Kategorie artykułów",
      links: categoryLinks,
    });
  }

  return (
    <footer className="pbk-footer">
      <div className="pbk-container pbk-footer__content">
        <div className="pbk-footer__grid">
          {footerColumns.map((column) => (
            <div key={column.heading} className="pbk-footer__column">
              <h3>{column.heading}</h3>
              <ul>
                {(column.links ?? []).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="pbk-footer__newsletter">
            <h3>{copy.newsletter.heading}</h3>
            <p>{copy.newsletter.body}</p>
            <form className="pbk-footer__form">
              <input
                type="email"
                name="footer-email"
                placeholder={copy.newsletter.emailPlaceholder}
                required
              />
              <button type="submit" className="pbk-button pbk-button--primary">
                {copy.newsletter.ctaLabel}
              </button>
            </form>
          </div>
        </div>
        <div className="pbk-footer__meta">
          <p>{copy.copyright.text.replace("{year}", String(year))}</p>
          <p>{copy.copyright.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
