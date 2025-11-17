import { ShareNetwork, FacebookLogo, LinkedinLogo, TwitterLogo, RedditLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

interface ShareInput {
  title: string;
  url: string;
}

type ShareLinkBuilder = (input: ShareInput) => string;

class ArticleShareTarget {
  constructor(
    public readonly id: string,
    public readonly label: string,
    private readonly buildLink: ShareLinkBuilder,
    public readonly Icon: ComponentType<IconProps>,
  ) {}

  getHref(input: ShareInput): string {
    return this.buildLink(input);
  }
}

const SHARE_TARGETS: ArticleShareTarget[] = [
  new ArticleShareTarget("linkedin", "LinkedIn", ({ url, title }) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
  }, LinkedinLogo),
  new ArticleShareTarget("facebook", "Facebook", ({ url }) => {
    const encodedUrl = encodeURIComponent(url);
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }, FacebookLogo),
  new ArticleShareTarget("twitter", "X (Twitter)", ({ url, title }) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  }, TwitterLogo),
  new ArticleShareTarget("reddit", "Reddit", ({ url, title }) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
  }, RedditLogo),
  new ArticleShareTarget("whatsapp", "WhatsApp", ({ url, title }) => {
    const encodedUrl = encodeURIComponent(`${title} ${url}`.trim());
    return `https://wa.me/?text=${encodedUrl}`;
  }, WhatsappLogo),
];

interface ArticleSharePanelProps {
  title: string;
  url: string;
}

export function ArticleSharePanel({ title, url }: ArticleSharePanelProps) {
  const shareInput: ShareInput = { title, url };

  return (
    <section className="article-page__share" aria-labelledby="article-share-heading">
      <div className="article-page__shareIntro">
        <ShareNetwork aria-hidden="true" weight="bold" className="article-page__shareIcon" />
        <div>
          <p id="article-share-heading">Podziel się artykułem</p>
          <p className="article-page__shareSubtext">
            Udostępnij poradnik w swoich kanałach społecznościowych jednym kliknięciem.
          </p>
        </div>
      </div>
      <ul className="article-page__shareList">
        {SHARE_TARGETS.map((target) => (
          <li key={target.id}>
            <a
              className="article-page__shareButton"
              href={target.getHref(shareInput)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Udostępnij na ${target.label}`}
            >
              <target.Icon aria-hidden="true" weight="bold" className="article-page__shareButtonIcon" />
              <span>{target.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
