import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleCard, ArticleGrid } from "@/app/ui";
import { ContentLibrary } from "@/app/lib/content/contentLibrary";
import { ContentPageCoordinator } from "@/app/lib/content/contentPageCoordinator";
import { ToolChildArticlesManager } from "@/app/lib/content/ToolChildArticlesManager";

const library = new ContentLibrary();
const coordinator = new ContentPageCoordinator(library);
const childArticlesManager = new ToolChildArticlesManager(library);
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

  const canonicalPath = viewModel.getPath();
  const requestedPath = `/${baseSegments(slug).filter(Boolean).join("/")}/`;
  if (requestedPath !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const childArticles = childArticlesManager.list(slug);

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
