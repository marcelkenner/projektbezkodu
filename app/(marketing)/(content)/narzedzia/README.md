# Narzędzia Routes

This folder hosts every route under `/narzedzia`:

- `page.tsx` renders the tools grid using `ToolCatalog`.
- `[slug]/page.tsx` is the structured detail page fed from `data/catalog/tools.json`.
- `[slug]/[...segments]/page.tsx` bridges into the markdown pipeline (any markdown file with `path: /narzedzia/<tool>/<article>/` shows up here via `ContentLibrary` / `ContentPageCoordinator`).

When adding content:

1. Put structured tool metadata in `data/catalog/tools.json`.
2. Author deep-dive articles under `content/narzedzia/<tool>/<topic>/index.md` with `template: "article"` and the correct `path`.
3. Assets live in `public/media/narzedzia/<tool>/<topic>/`.

Keep these files under 500 lines and reuse shared styles in `tools.module.css`.
