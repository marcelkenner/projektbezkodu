# public/media

Mirrors the `content/` hierarchy one-to-one so every markdown entry has a predictable place for its assets.

- Put hero/inline images in `public/media/<same path as markdown>/`.
- Reference them in front matter as `/media/...` so Next serves them statically.
- Never import these files inside React components; treat this directory as the CDN-facing source of truth.
