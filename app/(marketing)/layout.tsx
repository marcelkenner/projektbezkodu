import type { ReactNode } from "react";
import { PrimaryNav, Footer, ToolOfWeekToastContainer } from "../ui";
import { getCopy } from "../lib/copy";
import { articleTaxonomyCatalog } from "../lib/content/articleTaxonomy";
import { getToolOfWeek } from "../lib/toolShowcase";

const NAV_LINKS = [
  { label: "Porównania", href: "/porownania" },
  { label: "Tutoriale", href: "/poradniki" },
  { label: "Słownik", href: "/glossary" },
  { label: "Szukaj", href: "/szukaj" },
];

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const globalCopy = getCopy("global");
  const articlesCopy = getCopy("articles");
  const navigation = articlesCopy.navigation ?? {};
  const featuredCategories =
    navigation.featuredCategories?.map((category: { slug: string; label?: string; description?: string; href?: string }) => {
      const taxonomyCategory = articleTaxonomyCatalog.getCategory(category.slug);
      return {
        slug: category.slug,
        label: category.label ?? taxonomyCategory?.label ?? category.slug,
        description: category.description ?? taxonomyCategory?.description,
        href: category.href ?? `/kategoria/${category.slug}/`,
      };
    }) ?? [];
  const articlesNav = {
    label: navigation.menuLabel ?? "Artykuły",
    categories: featuredCategories,
    seeAll: navigation.seeAllHref
      ? {
          label: navigation.seeAllLabel ?? navigation.menuLabel ?? "Wszystkie artykuły",
          href: navigation.seeAllHref,
        }
      : undefined,
  };
  const toolOfWeek = getToolOfWeek();

  return (
    <>
      <div>
        <PrimaryNav
          logo={<span>ProjektBezKodu</span>}
          links={NAV_LINKS}
          articlesNav={articlesNav}
          cta={{ label: globalCopy.ctas.secondary, href: "/porownania" }}
        />
        <main>{children}</main>
        <Footer />
      </div>
      {toolOfWeek ? <ToolOfWeekToastContainer tool={toolOfWeek} /> : null}
    </>
  );
}
