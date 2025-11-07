# QA & Audit Checklist – ProjektBezKodu

Last updated: 2024-12-09 by Codex.

## 1. Automated Checks (Completed)

- [x] `npm run lint` – no lint errors (2024-12-09).
- [x] `npm run build` – production build succeeds with Turbopack (2024-12-09).

## 2. Accessibility Review

- [ ] Axe / Lighthouse accessibility scan (desktop & mobile). Run locally via `npm run build && npm run start`, then `npx --yes @axe-core/cli http://localhost:3000`.
- [ ] Keyboard-only navigation across core flows:
  - Homepage → Articles → Detail page.
  - Glossary search with letter anchors.
  - Tutorial filters form (tool + difficulty).
- [ ] Color contrast validation against WCAG 2.1 AA.

## 3. Responsive Verification

- [ ] 360px baseline (mobile).
- [ ] 768px (tablet portrait).
- [ ] 1024px (tablet landscape / small desktop).
- [ ] 1440px (desktop).
- Notes: Pay attention to new tutorial filter controls and glossary navigation badges.

## 4. Performance Audit

- [ ] Lighthouse performance run (mobile) – `npx --yes lighthouse http://localhost:3000 --preset=mobile --output=json --output-path=./docs/operations/reports/lighthouse-mobile.json`.
- [ ] Lighthouse performance run (desktop) – `npx --yes lighthouse http://localhost:3000 --preset=desktop --output=json --output-path=./docs/operations/reports/lighthouse-desktop.json`.
- [ ] Record Core Web Vitals (LCP, CLS, INP) targets in dashboard.

| Audit                | Status | Date | Notes / Report                                    |
| -------------------- | ------ | ---- | ------------------------------------------------- |
| Lighthouse (mobile)  | ☐      | –    | `docs/operations/reports/lighthouse-mobile.json`  |
| Lighthouse (desktop) | ☐      | –    | `docs/operations/reports/lighthouse-desktop.json` |
| Core Web Vitals log  | ☐      | –    | Link to dashboard / screenshot                    |

## 5. Follow-up Actions

1. Capture screenshots or recordings for any failing scenarios.
2. File issues in the tracking board, referencing this checklist.
3. Update this document with dates/results once audits are completed.

## 6. New Surfaces (2024-12 rollout)

- [ ] Resources hub (`/zasoby`) – sprawdź filtry (format/temat/czas), CTA pobierania i dane pliku (rozmiar, checksum).
- [ ] Strony zasobów (`/zasoby/[slug]`) – verify Table of Contents, download CTA, sekcje „Licencja” i „Wersje”.
- [ ] Case studies (`/przypadki-uzycia/[slug]`) – potwierdź breadcrumbs, metryki, CTA końcowe i hero image alt.
- [ ] Offline fallback (`/offline`) – włącz tryb offline w devtools, upewnij się, że lista cache pobiera prerenderowane linki.
- [ ] Strony statusowe (`/410`, `/451`, `/503`) – sprawdź copy, CTA i prawidłowe meta robots (noindex).
