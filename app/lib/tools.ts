import tools from "../../data/tools.json";

type Tool = (typeof tools)[number];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolLabel(slug: string): string {
  return getToolBySlug(slug)?.label ?? slug;
}

export function listToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export const allTools: Tool[] = tools;
