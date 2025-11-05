# Brand System Approval Matrix

> Covers visual, content, and technical changes for the ProjektBezKodu brand system. Update the responsible names once stakeholders are confirmed.

| Change Type           | Scope Examples                                             | Required Reviewers                                          | Sign-off Authority                                            | SLA             |
| --------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- | --------------- |
| Visual foundations    | Color tokens, typography scale, icon style, spacing system | Brand/design lead, Accessibility reviewer                   | Executive sponsor                                             | 2 business days |
| UI components         | Buttons, forms, navigation, cards, alerts                  | Brand/design lead, Front-end lead, Accessibility reviewer   | Front-end lead (implementation) + Executive sponsor (release) | 2 business days |
| Page templates        | Homepage hero, template detail, comparison layouts         | Brand/design lead, Content/SEO lead, Accessibility reviewer | Executive sponsor                                             | 3 business days |
| Content updates       | Copy tone, CTA language, SEO metadata, disclosures         | Content/SEO lead                                            | Executive sponsor or delegate                                 | 2 business days |
| Asset updates         | Logos, social templates, print collateral                  | Brand/design lead, Accessibility reviewer (for digital use) | Executive sponsor                                             | 3 business days |
| Process/documentation | Playbooks, changelog entries, backups                      | Project manager                                             | Executive sponsor                                             | 2 business days |

## Review Checklist Templates

### Visual / Component Review

- ☐ Tokens referenced documented.
- ☐ Contrast ≥ WCAG AA.
- ☐ Focus states visible (keyboard & pointer).
- ☐ Responsive behaviour reviewed at 360 / 768 / 1024 / 1440.
- ☐ Hand-off notes updated in tracking board with Figma link.

### Content Review

- ☐ Tone matches brand attributes (Helpful, Clear, Practical, Quick, Polish-first, Trustworthy).
- ☐ Polish diacritics verified.
- ☐ SEO checklist completed (keywords, meta, canonical, rel=\"sponsored\" where needed).
- ☐ Accessibility language guidelines followed (no excessive jargon, plain language).
- ☐ Update recorded in changelog (if applicable).

### Technical Implementation Review

- ☐ Tokens/variables used instead of hard-coded values.
- ☐ Component documented in Storybook with states.
- ☐ Tests updated (unit/visual regression).
- ☐ Performance impact assessed (bundle size, CLS).
- ☐ Release notes drafted if change is material.

Record decisions in the tracking board item and note any follow-up tasks.
