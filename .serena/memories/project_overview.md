# ProjektBezKodu Codebase Overview

- **Purpose**: Next.js 16 App Router project for ProjektBezKodu, delivering a content-focused site with a detailed brand system and AWS static hosting documentation.
- **Tech stack**: React 19, TypeScript, Next.js App Router, Tailwind CSS 4 (PostCSS pipeline). PowerShell scripts support content scaffolding.
- **Key directories**:
  - `app/` – Application entrypoints (`layout.tsx`, root page, globals).
  - `content/` – Markdown content scaffolded for site sections.
  - `docs/` – Planning and brand documentation (AWS, design system, governance).
  - `brand/` – Design assets and tokens (JSON/CSS/TS, changelog, placeholders for logos/icons).
  - `scripts/` – PowerShell utilities (`scaffold.ps1`, `build-evergreen.ps1`).
  - `data/` – Affiliate program JSON consumed by scaffolding script.
  - `public/` – Static assets.
- **Notable constraints**: Files should stay under 500 lines; follow instructions in `AGENTS.md` (mobile-first, OOP mindset, use Serena/Context7, prefer ASCII, etc.).
- **Runtime expectations**: Use `source ~/.nvm/nvm.sh` before Node commands as per AGENTS guidance.
