import Link from "next/link";
import { getCopy } from "../lib/copy";
import { articleTaxonomyCatalog } from "../lib/content/articleTaxonomy";
import "./ui.css";

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export function Footer() {
  const copy = getCopy("footer");
  const year = new Date().getFullYear();
  const columns = buildColumns(copy.columns);

  return (
    <footer className="site-footer">
      <div className="pbk-container site-footer__content">
        <div className="site-footer__grid">
          {columns.map((column) => (
            <FooterColumnList key={column.heading} column={column} />
          ))}
        </div>
        <div className="site-footer__meta">
          {copy.microcopy ? (
            <p className="site-footer__microcopy">{copy.microcopy}</p>
          ) : null}
          <p>{copy.copyright.text.replace("{year}", String(year))}</p>
          <p>{copy.copyright.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function buildColumns(rawColumns: FooterColumn[]): FooterColumn[] {
  const taxonomyCategories = getFeaturedCategories();
  return rawColumns.map((column) => {
    if (column.heading.toLowerCase() === "kategorie" && !column.links.length) {
      return { ...column, links: taxonomyCategories };
    }
    return column;
  });
}

function getFeaturedCategories(): { label: string; href: string }[] {
  const articlesCopy = getCopy("articles");
  const navigation = articlesCopy.navigation ?? {};
  const categories =
    navigation.featuredCategories?.map(
      (category: { slug: string; label?: string; href?: string }) => {
        const taxonomyCategory = articleTaxonomyCatalog.getCategory(
          category.slug,
        );
        return {
          href: category.href ?? `/kategoria/${category.slug}/`,
          label: category.label ?? taxonomyCategory?.label ?? category.slug,
        };
      },
    ) ?? [];

  if (navigation.seeAllHref) {
    categories.push({
      href: navigation.seeAllHref,
      label: navigation.seeAllLabel ?? "Wszystkie artykuły",
    });
  }

  return categories;
}

function FooterColumnList({ column }: { column: FooterColumn }) {
  if (!column.links.length) {
    return null;
  }

  return (
    <div className="site-footer__column">
      <h3>{column.heading}</h3>
      <ul>
        {column.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
