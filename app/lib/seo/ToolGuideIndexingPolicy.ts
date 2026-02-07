import type { Metadata } from "next";

export class ToolGuideIndexingPolicy {
  resolveRobots(segments: string[]): Metadata["robots"] | undefined {
    if (segments.length === 1 && segments[0] === "glowny") {
      return {
        index: true,
        follow: true,
      };
    }
    return undefined;
  }
}
