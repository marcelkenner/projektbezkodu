import { getCopy } from "@/app/lib/copy";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { LatestArticlesSection } from "./sections/LatestArticlesSection";
import { NewsletterSection } from "./sections/NewsletterSection";
import { PillarsSection } from "./sections/PillarsSection";
import { ResourcePromosSection } from "./sections/ResourcePromosSection";
import { SocialProofSection } from "./sections/SocialProofSection";
import { WorkflowSection } from "./sections/WorkflowSection";
import "./section.module.css";

export interface HomepageSectionsProps {
  articles: ContentSummary[];
}

export function HomepageSections({ articles }: HomepageSectionsProps) {
  const homepageCopy = getCopy("homepage");

  return (
    <>
      <SocialProofSection copy={homepageCopy.socialProof} />
      <ResourcePromosSection copy={homepageCopy.resources} />
      <PillarsSection copy={homepageCopy.pillars} />
      <WorkflowSection copy={homepageCopy.workflow} />
      <LatestArticlesSection copy={homepageCopy.articles} articles={articles} />
      <NewsletterSection copy={homepageCopy.newsletter} />
    </>
  );
}
