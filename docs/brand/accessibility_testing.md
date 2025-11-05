# Accessibility & QA Plan

## Automated Checks

- AXE DevTools or Lighthouse audit on staging preview (desktop + mobile).
- ESLint JSX-a11y rules (extend config with pending custom rule).
- Contrast testing via Stark or polaris.dev for new colors.

## Manual Testing

- Keyboard navigation: ensure focusable controls follow logical order, no focus traps in `Modal`.
- Screen reader smoke test: VoiceOver (macOS/iOS) + NVDA (Windows) on homepage and template pages.
- Responsive breakpoints: 360, 768, 1024, 1440 px using browser dev tools.
- Performance baseline: run Lighthouse and record metrics in `docs/brand/performance_log.md` (create on first test).
- Localization: verify Polish diacritics render with selected fonts; fallback fonts load correctly offline.

## Reporting

- Track findings and remediation tasks in the project board.
- Update `docs/brand_design_system_plan.md` Section 11 checkboxes as audits complete.
- Store audit summaries in `docs/brand/qa-reports/` (create folder when first report available).
