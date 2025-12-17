import Link from "next/link";

interface TaxonomyEntry {
  label: string;
  slug?: string;
  href?: string;
}

interface TaxonomyChipsProps {
  categories?: TaxonomyEntry[];
  tags?: TaxonomyEntry[];
  ariaLabel?: string;
}

export function TaxonomyChips({
  categories = [],
  tags = [],
  ariaLabel = "Powiązane kategorie i tagi",
}: TaxonomyChipsProps) {
  const items = [...sanitize(categories, "category"), ...sanitize(tags, "tag")];
  if (!items.length) {
    return null;
  }
  return (
    <nav className="pbk-taxonomy-chips" aria-label={ariaLabel}>
      <ul>
        {items.map((item) => (
          <li key={`${item.type}-${item.label}`}>
            <Link className="pbk-taxonomy-chips__chip" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function sanitize(
  entries: TaxonomyEntry[],
  type: "category" | "tag",
): Array<{ label: string; href: string; type: string }> {
  return entries
    .filter((entry) => Boolean(entry?.label))
    .map((entry) => ({
      label: entry.label!,
      type,
      href: buildHref(entry, type),
    }));
}

function buildHref(entry: TaxonomyEntry, type: "category" | "tag"): string {
  if (entry.href) {
    return entry.href;
  }
  if (entry.slug) {
    const base = type === "category" ? "/artykuly/" : "/tag/";
    return `${base}${entry.slug}/`;
  }
  return "#";
}
