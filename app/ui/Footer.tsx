import Link from "next/link";
import { getCopy } from "../lib/copy";
import { articleTaxonomyCatalog } from "../lib/content/articleTaxonomy";
import "./ui.css";

interface FooterColumn {
  heading: string;
  links: FooterLink[];
  variant?: "categories";
}

type FooterLink = { label: string; href: string };

type ArticlesNavigation = {
  featuredCategories?: { slug: string; label?: string; href?: string }[];
  seeAllHref?: string;
  seeAllLabel?: string;
  footerHeading?: string;
};

export function Footer() {
  const copy = getCopy("footer");
  const articlesNavigation: ArticlesNavigation =
    getCopy("articles").navigation ?? {};
  const year = new Date().getFullYear();
  const columns = buildColumns(copy.columns, articlesNavigation);

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

function buildColumns(
  rawColumns: FooterColumn[],
  navigation: ArticlesNavigation,
): FooterColumn[] {
  const taxonomyCategories = getCategoryLinks(navigation);
  const fallbackCategories = getFeaturedCategories(navigation);
  const categoryHeading =
    navigation.footerHeading ??
    rawColumns.find((column) =>
      column.heading.toLowerCase().includes("kategor"),
    )?.heading ??
    "Kategorie";

  return rawColumns.map((column) => {
    const isCategoryColumn = column.heading
      .toLowerCase()
      .includes("kategor");

    if (isCategoryColumn) {
      return {
        ...column,
        heading: categoryHeading,
        links: taxonomyCategories.length
          ? taxonomyCategories
          : fallbackCategories,
        variant: "categories",
      };
    }
    return column;
  });
}

function getCategoryLinks(navigation: ArticlesNavigation): FooterLink[] {
  const categoryLinks = articleTaxonomyCatalog.listCategories().map(
    (category) =>
      ({
        href: `/kategoria/${category.slug}/`,
        label: category.label,
      }) satisfies FooterLink,
  );

  if (navigation.seeAllHref) {
    categoryLinks.push({
      href: navigation.seeAllHref,
      label: navigation.seeAllLabel ?? "Wszystkie artykuły",
    });
  }

  return categoryLinks;
}

function getFeaturedCategories(navigation: ArticlesNavigation): FooterLink[] {
  return (
    navigation.featuredCategories?.flatMap((category) => {
      const taxonomyCategory = articleTaxonomyCatalog.getCategory(
        category.slug,
      );
      const hasResolvedDestination =
        Boolean(taxonomyCategory) || Boolean(category.href);

      if (!hasResolvedDestination) {
        return [];
      }

      return {
        href: category.href ?? `/kategoria/${category.slug}/`,
        label: category.label ?? taxonomyCategory?.label ?? category.slug,
      };
    }) ?? []
  );
}

function FooterColumnList({ column }: { column: FooterColumn }) {
  if (!column.links.length) {
    return null;
  }

  const isCategoryColumn = column.variant === "categories";

  return (
    <div
      className={`site-footer__column${
        isCategoryColumn ? " site-footer__column--categories" : ""
      }`}
    >
      <h3>{column.heading}</h3>
      <ul
        className={
          isCategoryColumn ? "site-footer__list site-footer__list--categories" : "site-footer__list"
        }
      >
        {column.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
