import { getCopy } from "@/app/lib/copy";
import type { ContentSummary } from "@/app/lib/content/repositories";
import { LatestArticlesSection } from "./sections/LatestArticlesSection";
import { NewsletterSection } from "./sections/NewsletterSection";
import { PillarsSection, type PillarsCopy } from "./sections/PillarsSection";
import {
  ResourcePromosSection,
  type ResourcePromoCopy,
} from "./sections/ResourcePromosSection";
import { SocialProofSection } from "./sections/SocialProofSection";
import { WorkflowSection } from "./sections/WorkflowSection";

export interface HomepageSectionsProps {
  articles: ContentSummary[];
}

export function HomepageSections({ articles }: HomepageSectionsProps) {
  const homepageCopy = getCopy("homepage");
  const resourcesCopy = homepageCopy.resources as ResourcePromoCopy;
  const pillarsCopy = homepageCopy.pillars as PillarsCopy;

  return (
    <>
      <SocialProofSection copy={homepageCopy.socialProof} />
      <ResourcePromosSection copy={resourcesCopy} />
      <PillarsSection copy={pillarsCopy} />
      <WorkflowSection copy={homepageCopy.workflow} />
      <LatestArticlesSection copy={homepageCopy.articles} articles={articles} />
      <NewsletterSection copy={homepageCopy.newsletter} />
    </>
  );
}
