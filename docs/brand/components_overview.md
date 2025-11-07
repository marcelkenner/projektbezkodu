# UI Component Library Overview

Components live under `app/ui/` and share the brand stylesheet `app/ui/ui.css`. Each component consumes design tokens defined in `brand/tokens/`.

| Component                            | File                                                       | Purpose                                                      |
| ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| Buttons (primary/secondary/tertiary) | `app/ui/Button.tsx`                                        | CTA actions with tokenised colours & focus ring              |
| TextField / SelectField              | `app/ui/TextField.tsx`, `app/ui/SelectField.tsx`           | Form controls with error/description messaging               |
| PrimaryNav                           | `app/ui/PrimaryNav.tsx`                                    | Responsive navigation shell with CTA slot                    |
| Card                                 | `app/ui/Card.tsx`                                          | Feature/testimonial/card layout                              |
| Alert                                | `app/ui/Alert.tsx`                                         | Semantic banners (`info`, `success`, `warning`, `danger`)    |
| Badge                                | `app/ui/Badge.tsx`                                         | Accent/neutral pills for tags                                |
| Stepper                              | `app/ui/Stepper.tsx`                                       | Tutorial progress steps                                      |
| PricingCard                          | `app/ui/PricingCard.tsx`                                   | Pricing ladder entry with CTA                                |
| ComparisonTable                      | `app/ui/ComparisonTable.tsx`                               | Feature comparison tables                                    |
| Modal                                | `app/ui/Modal.tsx`                                         | Overlay panel with close handler                             |
| Toast                                | `app/ui/Toast.tsx`                                         | Toast notifications with optional action                     |
| Hero section                         | `app/(marketing)/homepage/HeroSection.tsx`                 | Homepage hero with CTAs, hero media, and microcopy           |
| Homepage sections                    | `app/(marketing)/homepage/HomepageSections.tsx`            | Social proof, pillars, workflow, articles, and newsletter    |
| Articles filter bar                  | `app/(marketing)/(content)/artykuly/ArticlesFilterBar.tsx` | Sticky filter form for the blog listing page                 |
| Article card                         | `app/(marketing)/(content)/artykuly/ArticleCard.tsx`       | Article grid cards with meta, CTA, and placeholder image     |
| Category hub page                    | `app/(marketing)/(content)/kategoria/[slug]/page.tsx`      | Pillar layout with quick links, featured cards, download CTA |
| Legal page layout                    | `app/(legal)/polityka-prywatnosci/page.tsx`                | Shared structure for privacy policy and terms documents      |

## Usage Notes

- Import components via `app/ui/index.ts`.
- Combine with layout utilities (`pbk-container`, `pbk-stack`, `pbk-grid`) to compose pages.
- Alerts and toasts reuse semantic colour classes defined in `ui.css` for consistent messaging states.
- Extend `ui.css` cautiously; keep file under 500 lines and document changes in this file.
- Add Storybook stories per component to capture states and accessibility notes (see `docs/brand/storybook_setup.md`).
