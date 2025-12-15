import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);
interface ToolPageProps {
  params: Promise<{ slug: string }>;
}
const baseSegments = (slug: string) => ["narzedzia", slug];

export function generateStaticParams() {
  return coordinator
    .listStaticParams()
    .filter(
      (entry) =>
        entry.segments.length === 2 && entry.segments[0] === "narzedzia",
    )
    .map(({ segments }) => ({ slug: segments[1] }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const viewModel = coordinator.build(baseSegments(slug));
  if (!viewModel) {
    return {};
  }
  return viewModel.getMetadata();
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const viewModel = coordinator.build(baseSegments(slug));
  if (!viewModel) {
    notFound();
  }

  const childArticles = listChildArticles(slug);

  return (
    <section className="section section--surface" id="content">
      <div className="pbk-container pbk-stack pbk-stack--loose">
        <ArticleGrid>
          {childArticles.map((article) => (
            <ArticleCard
              key={article.path}
              title={article.title}
              href={article.path}
              description={article.description}
              hero={article.hero}
              meta={{
                readingTime: article.meta?.duration,
                publishedAt: article.meta?.publishedAt,
                extra: article.meta?.extra ?? [],
              }}
              ctaLabel="Czytaj"
            />
          ))}
        </ArticleGrid>
      </div>
    </section>
  );
}

function listChildArticles(slug: string) {
  return library
    .listRoutes()
    .filter(
      (entry) =>
        entry.path.startsWith(`/narzedzia/${slug}/`) &&
        entry.segments.length >= 2 &&
        entry.document.frontmatter.draft !== true,
    )
    .map((entry) => {
      const fm = entry.document.frontmatter;
      const hero =
        fm.hero?.image?.src ??
        fm.meta?.heroImageSrc ??
        "/img/tools_hero_image.webp";
      const description =
        fm.hero?.subheading ?? fm.seo?.description ?? entry.document.excerpt;
      const primaryCategory = fm.taxonomy?.categories?.[0];
      return {
        title: fm.title ?? entry.segments.at(-1) ?? "Artykuł",
        description,
        path: entry.path,
        hero: {
          src: hero,
          alt: fm.hero?.image?.alt ?? fm.meta?.heroImageAlt ?? fm.title,
          fallbackSrc: "/img/tools_hero_image.webp",
        },
        meta: {
          duration: fm.meta?.duration,
          publishedAt: fm.date,
          extra: primaryCategory ? [{ label: primaryCategory }] : [],
        },
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "pl"));
}
