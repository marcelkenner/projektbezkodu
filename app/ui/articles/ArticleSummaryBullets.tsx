interface ArticleSummaryBulletsProps {
  bullets?: string[] | null;
  heading?: string;
}

export function ArticleSummaryBullets({
  bullets,
  heading = "Najważniejsze wnioski",
}: ArticleSummaryBulletsProps) {
  if (!bullets || !bullets.length) {
    return null;
  }

  return (
    <section className="pbk-article-summary">
      <h2>{heading}</h2>
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}
