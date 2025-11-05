import toolOfWeek from "@/data/tool-of-week.json";
import tools from "@/data/tools.json";
import type { Tool } from "./tools";
import { getAffiliateLink } from "./affiliatePrograms";

export type ToolShowcase = Tool & {
  description: string;
  affiliateUrl: string;
  readMorePath: string;
  image: string;
};

function toToolShowcase(tool: Tool): ToolShowcase | undefined {
  const description = tool.description;
  const readMorePath = tool.readMorePath;
  const image = tool.image;
  const affiliateUrl = getAffiliateLink(tool.slug);
  if (!description || !readMorePath || !image || !affiliateUrl) {
    return undefined;
  }
  return {
    ...tool,
    description,
    readMorePath,
    image,
    affiliateUrl,
  };
}

export function getToolOfWeek(): ToolShowcase | undefined {
  const candidate = tools.find((tool) => tool.slug === toolOfWeek.slug);
  if (candidate) {
    const showcase = toToolShowcase(candidate);
    if (showcase) {
      return showcase;
    }
  }
  return tools.map(toToolShowcase).find(Boolean);
}

export function listShowcaseTools(): ToolShowcase[] {
  return tools.map(toToolShowcase).filter((tool): tool is ToolShowcase => Boolean(tool));
}
