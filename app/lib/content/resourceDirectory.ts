import type { ContentSummary } from "./repositories";
import { TextNormalizer } from "../text/TextNormalizer";

export interface ResourceFilterCriteria {
  format?: string;
  topic?: string;
  duration?: string;
}

export interface ResourceFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface ResourceFilterSet {
  formats: ResourceFilterOption[];
  topics: ResourceFilterOption[];
  durations: ResourceFilterOption[];
}

interface TaggedValue {
  label: string;
  slug: string;
}

export interface ResourceEntry {
  summary: ContentSummary;
  format?: TaggedValue;
  topics: TaggedValue[];
  duration?: TaggedValue;
  license?: string;
  downloadHref?: string;
  detailsHref?: string;
}

export class ResourceDirectory {
  private readonly entries: ResourceEntry[];

  constructor(resources: ContentSummary[]) {
    this.entries = resources.map((summary) => this.toEntry(summary));
  }

  list(criteria: ResourceFilterCriteria = {}): ResourceEntry[] {
    return this.entries.filter((entry) => {
      const matchesFormat = this.matchesTaggedValue(
        entry.format,
        criteria.format,
      );
      const matchesDuration = this.matchesTaggedValue(
        entry.duration,
        criteria.duration,
      );
      const matchesTopic =
        !criteria.topic ||
        entry.topics.some((topic) => topic.slug === criteria.topic);
      return matchesFormat && matchesDuration && matchesTopic;
    });
  }

  findBySlug(slug: string): ResourceEntry | undefined {
    return this.entries.find((entry) => entry.summary.slug === slug);
  }

  getFilters(): ResourceFilterSet {
    const formatMap = new Map<string, ResourceFilterOption>();
    const topicMap = new Map<string, ResourceFilterOption>();
    const durationMap = new Map<string, ResourceFilterOption>();

    this.entries.forEach((entry) => {
      if (entry.format) {
        this.incrementOption(formatMap, entry.format);
      }
      if (entry.duration) {
        this.incrementOption(durationMap, entry.duration);
      }
      entry.topics.forEach((topic) => this.incrementOption(topicMap, topic));
    });

    return {
      formats: this.sortOptions(formatMap),
      topics: this.sortOptions(topicMap),
      durations: this.sortOptions(durationMap),
    };
  }

  private matchesTaggedValue(
    taggedValue: TaggedValue | undefined,
    filter?: string,
  ): boolean {
    if (!filter) {
      return true;
    }
    if (!taggedValue) {
      return false;
    }
    return taggedValue.slug === filter;
  }

  private incrementOption(
    map: Map<string, ResourceFilterOption>,
    value: TaggedValue,
  ) {
    const existing = map.get(value.slug);
    if (existing) {
      map.set(value.slug, {
        ...existing,
        count: existing.count + 1,
      });
      return;
    }
    map.set(value.slug, {
      value: value.slug,
      label: value.label,
      count: 1,
    });
  }

  private sortOptions(
    map: Map<string, ResourceFilterOption>,
  ): ResourceFilterOption[] {
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "pl"),
    );
  }

  private toEntry(summary: ContentSummary): ResourceEntry {
    const formatLabel = this.resolveSingleValue(summary.meta?.format);
    const durationLabel =
      this.resolveSingleValue(summary.meta?.duration) ??
      this.resolveSingleValue(summary.meta?.time);
    const license = this.resolveSingleValue(summary.meta?.license);

    const topics = this.resolveTopicValues(summary);

    return {
      summary,
      format: this.toTaggedValue(formatLabel),
      duration: this.toTaggedValue(durationLabel),
      topics,
      license: license ?? undefined,
      downloadHref: this.resolveLink(summary.meta?.downloadHref),
      detailsHref: this.resolveLink(summary.meta?.detailsHref ?? summary.path),
    };
  }

  private resolveSingleValue(
    value: unknown,
    fallback?: string,
  ): string | undefined {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : undefined;
    }
    if (Array.isArray(value) && value.length) {
      const first = value[0];
      if (typeof first === "string") {
        return this.resolveSingleValue(first);
      }
    }
    return fallback;
  }

  private resolveTopicValues(summary: ContentSummary): TaggedValue[] {
    const topics: string[] = [];

    const metaTopics = summary.meta?.topics;
    if (Array.isArray(metaTopics)) {
      metaTopics.forEach((topic) => {
        if (typeof topic === "string" && topic.trim()) {
          topics.push(topic.trim());
        }
      });
    } else if (typeof metaTopics === "string" && metaTopics.trim()) {
      topics.push(metaTopics.trim());
    }

    (summary.taxonomy?.categories ?? []).forEach((category) => {
      if (category && topics.indexOf(category) === -1) {
        topics.push(category);
      }
    });

    (summary.taxonomy?.tags ?? []).forEach((tag) => {
      if (tag && topics.indexOf(tag) === -1) {
        topics.push(tag);
      }
    });

    return topics
      .map((topic) => this.toTaggedValue(topic))
      .filter((value): value is TaggedValue => Boolean(value));
  }

  private toTaggedValue(value?: string): TaggedValue | undefined {
    if (!value) {
      return undefined;
    }
    const slug = TextNormalizer.slugify(value);
    if (!slug) {
      return undefined;
    }
    return {
      label: value,
      slug,
    };
  }

  private resolveLink(value: unknown): string | undefined {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return undefined;
  }
}
