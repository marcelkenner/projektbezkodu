export interface PriorityHeroImageAttributes {
  readonly decoding: "async";
  readonly fetchPriority: "high";
  readonly loading: "eager";
}

const PRIORITY_HERO_IMAGE_ATTRIBUTES: PriorityHeroImageAttributes = {
  decoding: "async",
  fetchPriority: "high",
  loading: "eager",
};

export function getPriorityHeroImageAttributes(): PriorityHeroImageAttributes {
  return PRIORITY_HERO_IMAGE_ATTRIBUTES;
}
