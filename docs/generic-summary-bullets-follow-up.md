# Summary Bullets Editorial Follow-Up

Created: 2026-04-21

This file is a working checklist for replacing generic `meta.summaryBullets` with useful, article-specific bullets. An editor should be able to open this file, take the next unchecked page, update that page's frontmatter, and mark the item done.

## Goal

Each listed content page should end with three `meta.summaryBullets` that help a reader decide whether to read the page. The bullets must be based on the actual article content, not on a generic template.

Good bullets answer:

- `Werdykt`: what the page concludes or recommends.
- `Dla kogo`: who should care, and who should not.
- `Start`: what the reader should do first after reading.

The labels can stay in Polish if they fit the page, but the text after each label must be specific. Do not keep vague copy such as `krótko i konkretnie`, `kiedy to ma sens`, or `co zrobić jako pierwsze`.

## Editorial Process

1. Pick the first unchecked file from `Candidate Pages`.
2. Open the markdown file and find `meta.summaryBullets` in the frontmatter near the top.
3. Read the page title, hero, SEO description, intro, conclusion, tables, and any "werdykt" or "jak zacząć" sections.
4. Replace only the generic summary bullets with three page-specific bullets. Keep YAML indentation and quoting consistent with the file.
5. Keep each bullet short enough to scan, ideally one sentence. Use concrete nouns, tools, outcomes, limits, and audience names from the article.
6. If a listed file is a `.bak` backup and not part of published content, mark it as `N/A - backup file` instead of editing it.
7. After editing a page, mark its checkbox here as done and add a short note if anything was skipped or needs a writer's review.

Example shape:

- `Werdykt: Shopify ma sens, jeśli liczysz marżę po kosztach wysyłki i zwrotów.`
- `Dla kogo: małe sklepy niszowe i marki testujące sprzedaż; nie dla niskomarżowej elektroniki.`
- `Start: wystaw 5-10 SKU na marketplace i zmierz CAC przed budową własnego sklepu.`

## Acceptance Criteria

A page is done when:

- it has at least three non-empty `meta.summaryBullets`,
- none of the bullets use the generic placeholder phrases listed below,
- every bullet can be traced to a claim, recommendation, or step in that page,
- YAML still parses,
- the checkbox in this file is marked complete.

## Finish Checklist

After finishing a batch of pages:

1. Run `source ~/.nvm/nvm.sh && npm run content:format`.
2. Run `source ~/.nvm/nvm.sh && npm run content:lint`.
3. Fix any YAML or content warnings caused by the edits.
4. Do not run `npm run content:fix:marketing-meta` until `scripts/fix-marketing-meta.mjs` is updated, because its current defaults can reintroduce generic bullets.
5. If all candidate pages are complete, update this file with the final status and move any unresolved pages to a short `Remaining Issues` section.

## Search Criteria

Flagged phrases include exact or near-template variants of:

- `Werdykt: krótko i konkretnie`
- `Dla kogo: kiedy to ma sens i kiedy nie`
- `Start: co zrobić jako pierwsze`
- generated comparison defaults such as `Werdykt: szybkie porównanie kluczowych różnic.`
- generated tutorial/resource defaults such as `Start: zacznij od sekcji „Jak zacząć”.` and `Dla kogo: osoby szukające sprawdzonych zasobów.`

Line numbers point to the first matching generic summary-bullet line in each file. Files with fewer than three generic lines may still need review because one or two placeholder bullets were mixed with more specific bullets.

## Source To Fix Before Regenerating Content

- `scripts/fix-marketing-meta.mjs:101` - comparison/tutorial/resource/default summary bullet templates are generic and can keep reintroducing low-value copy.

## Candidate Pages

- [x] `content/artykuly/ai/index.md:22` - 3 generic lines
- [x] `content/artykuly/ai/index27.md:24` - 1 generic line
- [x] `content/artykuly/analityka/index13.md:29` - 3 generic lines
- [x] `content/artykuly/analityka/index28.md:27` - 1 generic line
- [x] `content/artykuly/analityka/index5.md:18` - 3 generic lines
- [x] `content/artykuly/animacje/animacje-no-code-konwersja-chaos.md:29` - 3 generic lines
- [x] `content/artykuly/animacje/index.md:22` - 3 generic lines
- [x] `content/artykuly/animacje/index12.md:11` - 3 generic lines
- [x] `content/artykuly/animacje/index17.md:14` - 3 generic lines
- [x] `content/artykuly/animacje/index18.md:22` - 3 generic lines
- [x] `content/artykuly/architektura/index.md:26` - 3 generic lines
- [x] `content/artykuly/architektura/index12.md:18` - 3 generic lines
- [x] `content/artykuly/architektura/index16.md:18` - 3 generic lines
- [x] `content/artykuly/architektura/index17.md:10` - 3 generic lines
- [x] `content/artykuly/architektura/index18.md:27` - 3 generic lines
- [x] `content/artykuly/architektura/index20.md:14` - 3 generic lines
- [x] `content/artykuly/architektura/index3.md:27` - 3 generic lines
- [x] `content/artykuly/architektura/index9.md:15` - 3 generic lines
- [x] `content/artykuly/automation/index.md:22` - 3 generic lines
- [x] `content/artykuly/automation/index14.md:25` - 3 generic lines
- [x] `content/artykuly/automation/index15.md:25` - 3 generic lines
- [x] `content/artykuly/automation/index17.md:31` - 3 generic lines
- [x] `content/artykuly/automation/index19.md:14` - 3 generic lines
- [x] `content/artykuly/automation/index2.md:14` - 3 generic lines
- [x] `content/artykuly/automation/index20.md:30` - 3 generic lines
- [x] `content/artykuly/automation/index22.md:30` - 3 generic lines
- [x] `content/artykuly/automation/index3.md:18` - 3 generic lines
- [x] `content/artykuly/automation/index8.md:26` - 3 generic lines
- [x] `content/artykuly/badania/index.md:22` - 3 generic lines
- [x] `content/artykuly/badania/index18.md:31` - 1 generic line
- [x] `content/artykuly/badania/index5.md:10` - 3 generic lines
- [x] `content/artykuly/badania/raport-2026-trendy-no-code.md:13` - 3 generic lines
- [x] `content/artykuly/biblioteka-komponentow/cta/index.md:27` - 1 generic line
- [x] `content/artykuly/biblioteka-komponentow/cta/index.md.bak:27` - N/A - backup file
- [x] `content/artykuly/biblioteka-komponentow/faq/index.md:17` - 3 generic lines
- [x] `content/artykuly/biblioteka-komponentow/faq/index.md.bak:17` - N/A - backup file
- [x] `content/artykuly/biblioteka-komponentow/hero/index.md:18` - 3 generic lines
- [x] `content/artykuly/biblioteka-komponentow/hero/index.md.bak:17` - N/A - backup file
- [x] `content/artykuly/biblioteka-komponentow/index.md:17` - 3 generic lines
- [x] `content/artykuly/biblioteka-komponentow/review-testimonials/index.md:25` - 3 generic lines
- [x] `content/artykuly/biblioteka-komponentow/review-testimonials/index.md.bak:25` - N/A - backup file
- [x] `content/artykuly/cms-bez-kodu/index.md:22` - 3 generic lines
- [x] `content/artykuly/cms-bez-kodu/index3.md:27` - 3 generic lines
- [x] `content/artykuly/cms-bez-kodu/index5.md:25` - 3 generic lines
- [x] `content/artykuly/cms-bez-kodu/index6.md:27` - 3 generic lines
- [x] `content/artykuly/cms-bez-kodu/index9.md:10` - 3 generic lines
- [x] `content/artykuly/creative-tools/index.md:26` - 3 generic lines
- [x] `content/artykuly/design-bez-kodu/index.md:25` - 3 generic lines
- [x] `content/artykuly/design-bez-kodu/index15.md:22` - 3 generic lines
- [x] `content/artykuly/design-bez-kodu/index17.md:10` - 3 generic lines
- [x] `content/artykuly/design-bez-kodu/index2.md:11` - 3 generic lines
- [x] `content/artykuly/design-bez-kodu/index20.md:25` - 3 generic lines
- [x] `content/artykuly/design-bez-kodu/index4.md:11` - 3 generic lines
- [x] `content/artykuly/design-bez-kodu/index8.md:33` - 1 generic line
- [x] `content/artykuly/dostepnosc-cyfrowa/index.md:20` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index.md:27` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index17.md:25` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index2.md:25` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index20.md:13` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index4.md:10` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index6.md:11` - 2 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index7.md:20` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/index9.md:14` - 3 generic lines
- [x] `content/artykuly/ecommerce-bez-kodu/sklep-w-weekend-bez-kodu.md:30` - 3 generic lines
- [x] `content/hostinger-link-in-bio/cennik/index.md:26` - 3 generic lines
- [x] `content/later-link-in-bio/faq/index.md:39` - 3 generic lines
- [x] `content/later-link-in-bio/integracje/index.md:30` - 3 generic lines
- [x] `content/linktree/alternatywy/index.md:30` - 3 generic lines
- [x] `content/linktree/cennik/index.md:24` - 3 generic lines
- [x] `content/linktree/ecommerce-pl/index.md:27` - 3 generic lines
- [x] `content/linktree/faq/index.md:24` - 3 generic lines
- [x] `content/linktree/glowny/index.md:24` - 3 generic lines
- [x] `content/linktree/integracje/index.md:26` - 3 generic lines
- [x] `content/lnk-bio/alternatywy/index.md:29` - 3 generic lines
- [x] `content/lnk-bio/cennik/index.md:23` - 3 generic lines
- [x] `content/narzedzia-no-code/beacons/faq/index.md:32` - 3 generic lines
- [x] `content/narzedzia-no-code/beacons/integracje/index.md:15` - 3 generic lines
- [x] `content/narzedzia-no-code/campsite-bio/szablony/index.md:10` - 3 generic lines
- [x] `content/narzedzia-no-code/envato-elements/recenzja/index.md:34` - 3 generic lines
- [x] `content/narzedzia-no-code/glide/glowny/index.md:30` - 3 generic lines
- [x] `content/narzedzia-no-code/kit/alternatywy/index.md:31` - 3 generic lines
- [x] `content/narzedzia-no-code/kit/faq/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/kit/glowny/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/leadpages/cennik/index.md:35` - 1 generic line
- [x] `content/narzedzia-no-code/mailerlite/alternatywy/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/make/faq/index.md:23` - 3 generic lines
- [x] `content/narzedzia-no-code/make/glowny/index.md:31` - 3 generic lines
- [x] `content/narzedzia-no-code/outseta/alternatywy/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/outseta/faq/index.md:30` - 3 generic lines
- [x] `content/narzedzia-no-code/outseta/recenzja/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/paperform/faq/index.md:31` - 3 generic lines
- [x] `content/narzedzia-no-code/paperform/recenzja/index.md:34` - 3 generic lines
- [x] `content/narzedzia-no-code/plausible/alternatywy/index.md:24` - 3 generic lines
- [x] `content/narzedzia-no-code/plausible/glowny/index.md:27` - 3 generic lines
- [x] `content/narzedzia-no-code/relume/faq/index.md:16` - 3 generic lines
- [x] `content/narzedzia-no-code/semrush/alternatywy/index.md:34` - 3 generic lines
- [x] `content/narzedzia-no-code/semrush/faq/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/semrush/recenzja/index.md:27` - 3 generic lines
- [x] `content/narzedzia-no-code/softr/alternatywy/index.md:25` - 3 generic lines
- [x] `content/narzedzia-no-code/surfer/cennik/index.md:24` - 3 generic lines
- [x] `content/narzedzia-no-code/surfer/faq/index.md:27` - 3 generic lines
- [x] `content/narzedzia-no-code/surfer/recenzja/index.md:30` - 3 generic lines
- [x] `content/narzedzia-no-code/tally/alternatywy/index.md:30` - 3 generic lines
- [x] `content/narzedzia-no-code/typeform/alternatywy/index.md:37` - 3 generic lines
- [x] `content/narzedzia-no-code/typeform/cennik/index.md:26` - 3 generic lines
- [x] `content/narzedzia-no-code/typeform/faq/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/typeform/glowny/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/uploadcare/alternatywy/index.md:30` - 3 generic lines
- [x] `content/narzedzia-no-code/uploadcare/cennik/index.md:30` - 3 generic lines
- [x] `content/narzedzia-no-code/uploadcare/integracje/index.md:23` - 3 generic lines
- [x] `content/narzedzia-no-code/zapier/alternatywy/index.md:29` - 3 generic lines
- [x] `content/narzedzia-no-code/zapier/faq/index.md:31` - 3 generic lines
- [x] `content/poradniki/automatyzacja-leadow-make/index.md:26` - 3 generic lines
- [x] `content/poradniki/webflow-blog-krok-po-kroku/index.md:25` - 3 generic lines
- [x] `content/porownania/beehiiv-vs-convertkit/index.md:35` - 1 generic line
- [x] `content/porownania/bunnycdn-vs-cloudflare/index.md:28` - 2 generic lines
- [x] `content/porownania/envato-elements-vs-creative-market/index.md:30` - 2 generic lines
- [x] `content/porownania/fathom-vs-plausible-vs-ga4/index.md:29` - 2 generic lines
- [x] `content/porownania/framer-vs-wordpress/index.md:46` - 3 generic lines
- [x] `content/porownania/getresponse-vs-mailerlite/index.md:37` - 1 generic line
- [x] `content/porownania/hostinger-vs-kinsta/index.md:36` - 1 generic line
- [x] `content/porownania/mailerlite-vs-convertkit/index.md:21` - 3 generic lines
- [x] `content/porownania/nazwa-pl-vs-home-pl/index.md:35` - 1 generic line
- [x] `content/porownania/relume-vs-flowbase/index.md:36` - 2 generic lines
- [x] `content/porownania/shopify-vs-webflow-ecommerce/index.md:24` - 3 generic lines
- [x] `content/porownania/shutterstock-vs-envato-elements/index.md:24` - 3 generic lines
- [x] `content/porownania/softr-vs-glide-vs-bubble/index.md:29` - 2 generic lines
- [x] `content/porownania/squarespace-vs-wix/index.md:27` - 2 generic lines
- [x] `content/porownania/storyblocks-vs-envato-video/index.md:31` - 1 generic line
- [x] `content/porownania/webflow-vs-framer/index.md:36` - 1 generic line
- [x] `content/porownania/webflow-vs-wordpress/index.md:26` - 3 generic lines
- [x] `content/porownania/wix-vs-webflow/index.md:27` - 1 generic line
- [x] `content/zasoby/agencje-nocode-pl/index.md:29` - 3 generic lines
- [x] `content/zasoby/banery-og/index.md:29` - 3 generic lines
- [x] `content/zasoby/grupy-i-spolecznosci/index.md:27` - 3 generic lines
- [x] `content/zasoby/polskie-ikony-i-znaki/index.md:27` - 3 generic lines
- [x] `content/zasoby/prawne-wzory/index.md:30` - 3 generic lines
- [x] `content/zasoby/staze-i-praca/index.md:29` - 3 generic lines
- [x] `content/zasoby/wydarzenia-meetupy/index.md:29` - 3 generic lines

## Final Status

All candidate pages listed above have been reviewed and marked complete. Backup `.bak` files were left unedited and marked N/A earlier in the checklist.

## Remaining Issues

None.
