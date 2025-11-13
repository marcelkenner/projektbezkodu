import { ContentLibrary } from "@/app/lib/content/contentLibrary";

import { ContentPageViewModel } from "./contentPageViewModel";

export class ContentPageCoordinator {
  constructor(private readonly library: ContentLibrary) {}

  build(segments: string[] | undefined): ContentPageViewModel | undefined {
    const entry = this.library.getEntry(segments);
    if (!entry) {
      return undefined;
    }
    return new ContentPageViewModel(entry);
  }

  listStaticParams(): { segments: string[] }[] {
    return this.library.listRoutes().map(({ segments }) => ({ segments }));
  }
}
