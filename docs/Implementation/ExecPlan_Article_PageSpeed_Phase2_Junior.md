# Complete Mobile PageSpeed Follow-Up For Shared CSS, Shared JS, And Tracing

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If `docs/plans.md` exists, this plan must cite its repository-relative path and remain consistent with it. This plan was authored after reading `docs/plans.md` and must continue to follow its rules.

This plan depends on the already-authored first-pass plan at:

`docs/Implementation/ExecPlan_Article_PageSpeed_Mobile_Junior.md`

That earlier file explains the first implementation wave that already landed: explicit high-priority hero image hints, removal of header logo preloads, and narrower article-route CSS imports. This phase-two plan repeats the context needed to continue from the current working tree without requiring the reader to remember previous chat history.

## Purpose / Big Picture


The goal of this phase is to finish the remaining mobile performance work that was intentionally deferred after the first safe implementation pass. The remaining PageSpeed problems are not the easy ones anymore. They now live in shared CSS, shared client-side JavaScript, and an unattributed forced reflow that must be traced before anyone can safely fix it.

After this phase, a visitor opening a representative long-form page such as `/narzedzia/adobe-creative-cloud/cennik/` should still see the same content and the same navigation, but the page should ship less route-critical CSS, less app-owned shared JavaScript, and a documented explanation or fix for the forced reflow warning. The user-visible success case is that mobile Lighthouse/PageSpeed reports improve again after the first pass, and the team can point to saved before/after reports in the repository instead of relying on memory.

This plan is written for a junior developer. Every path, command, and technical term is named explicitly. A "shared stylesheet" means one CSS file imported by many components, so it affects many routes. A "client component" means a React component marked with `"use client"` that ships JavaScript to the browser. A "trace" means a Chrome DevTools Performance recording that shows which script caused layout or style recalculation work.

## Progress


- [x] 2026-04-02: Read `docs/plans.md` and the first-pass plan `docs/Implementation/ExecPlan_Article_PageSpeed_Mobile_Junior.md`.
- [x] 2026-04-02: Inspected the current shared CSS hotspot `app/ui/ui.css`.
- [x] 2026-04-02: Inspected the main shared UI entry points `app/ui/PrimaryNav.tsx`, `app/ui/Footer.tsx`, `app/ui/search/SiteSearchForm.tsx`, `app/ui/ToolOfWeekToast.tsx`, `app/ui/ToolOfWeekToastContainer.tsx`, and `app/ui/KlaroConsentManager.tsx`.
- [x] 2026-04-02: Drafted this phase-two ExecPlan.
- [ ] Implementation not started yet.
- [ ] Baseline Lighthouse reports for this phase not saved yet.
- [ ] CSS split not started yet.
- [ ] Shared client-JavaScript reduction not started yet.
- [ ] Forced reflow owner not identified yet.
- [ ] Browser-target decision not made yet.

## Current State For A New Contributor


The first pass already changed the production HTML in an important way. The representative page:

`/narzedzia/adobe-creative-cloud/cennik/`

now renders its hero image with explicit `fetchPriority="high"` and `loading="eager"`, and the shared header logo is no longer preloaded. That work lives in:

- `app/ui/heroes/ContentHero.tsx`
- `app/ui/heroes/priorityHeroImage.ts`
- `app/ui/BrandLogo.tsx`
- `app/(marketing)/layout.tsx`
- `app/(legal)/layout.tsx`

The remaining work is broader. It is not tied only to one article route. It affects every marketing route that renders the shared header, shared footer, shared toast, or shared search form.

The main shared stylesheet is:

`app/ui/ui.css`

This file is currently 1289 lines long and contains several unrelated style groups in one file. A quick scan shows at least these blocks:

- button styles near the top (`.pbk-button*`)
- form field styles near the top (`.pbk-input*`)
- footer styles around line 382 (`.site-footer*`)
- tool-of-the-week toast styles around line 824 (`.pbk-toolweek*`)
- header and mobile drawer styles around line 1075 (`.site-header*`)
- panel search form styles around line 1232 (`.site-search-form*`)

This matters because a route can end up loading too much CSS if many components all import the same monolithic file instead of importing only the styles they use.

The most important shared UI files currently importing `ui.css` are:

- `app/ui/PrimaryNav.tsx`
- `app/ui/Footer.tsx`
- `app/ui/search/SiteSearchForm.tsx`
- `app/ui/ToolOfWeekToast.tsx`
- many lower-level field/button/card components under `app/ui/`

The main shared client component is:

`app/ui/PrimaryNav.tsx`

Today it is a full client component because it owns the mobile drawer state (`useState`), the generated drawer id (`useId`), the Escape-key listener (`useEffect`), and body scroll locking (`useEffect`). Because the entire header is inside that client component, even the desktop navigation and desktop search field are bundled together with the mobile drawer logic.

Other shared client components also exist:

- `app/ui/KlaroConsentManager.tsx`
- `app/ui/ServiceWorkerRegistration.tsx`
- `app/ui/ToolOfWeekToastContainer.tsx`

These are rendered from shared layouts:

- `app/layout.tsx`
- `app/(marketing)/layout.tsx`
- `app/(legal)/layout.tsx`

That means content pages can still inherit JavaScript from features that are not part of the article body itself.

## Representative Routes To Use During This Phase


Use the same route set every time you measure or verify. This keeps the before/after comparison meaningful.

Use these URLs:

1. Homepage:

   `/`

2. Representative nested tool article:

   `/narzedzia/adobe-creative-cloud/cennik/`

3. Representative tutorial:

   `/poradniki/airtable-crm-od-zera/`

4. Representative resource detail page:

   `/zasoby/agencje-nocode-pl/`

5. Representative lead magnet detail page:

   `/do-pobrania/start-checklista/`

These routes exercise the shared header, shared footer, shared search form, and a mix of article-like and non-article marketing pages.

## Repository Evidence


The current repository gives us several concrete facts that should drive this phase:

1. `app/ui/ui.css` is 1289 lines long.
   Evidence: `wc -l app/ui/ui.css`

2. `PrimaryNav` is the clearest app-owned shared JavaScript candidate.
   Evidence: `app/ui/PrimaryNav.tsx` is marked `"use client"` and contains state, Escape-key handling, and body scroll locking, even though the desktop nav and desktop search are static markup.

3. `Footer` is server-rendered but still imports the whole shared stylesheet.
   Evidence: `app/ui/Footer.tsx` imports `./ui.css` even though it only uses footer-specific classes plus ordinary links.

4. `SiteSearchForm` imports the shared stylesheet even though it only needs search-form classes plus the lower-level `Button` and `TextField` components.
   Evidence: `app/ui/search/SiteSearchForm.tsx` imports `../ui.css`.

5. The tool-of-the-week toast is a second shared client candidate, but it is less important than the nav split.
   Evidence: `app/ui/ToolOfWeekToastContainer.tsx` is marked `"use client"` and imports `./ui.css`; the presentational component `app/ui/ToolOfWeekToast.tsx` also imports `./ui.css`.

6. Cookie consent is operationally sensitive and should not be casually optimized away.
   Evidence: `app/ui/KlaroConsentManager.tsx` imports Klaro CSS and dynamically imports Klaro script code through `KlaroBootstrapManager`. Breaking it would affect compliance and user consent behavior.

7. The first pass already proved that narrowing CSS scope changes the production HTML in a measurable way.
   Evidence: the Adobe article page dropped from three CSS files to two after removing the route-group-wide article stylesheet import.

8. The forced reflow warning still has no proven owner.
   Evidence: the first-pass plan already recorded that a code search found no obvious geometry reads in `app/`. This phase must use a trace instead of guessing.

9. The shared legacy/polyfill bundle still exists.
   Evidence: `.next/build-manifest.json` still lists `static/chunks/d02061f96f1def86.js` as a root main file. Browser-target work is therefore optional and policy-driven, not automatic.

10. The current `baseline-browser-mapping` warning during build is not the same problem as the PageSpeed legacy-JavaScript warning.
    Evidence: the build warns that the dev dependency data is old, but that warning does not itself change the shipped browser targets. Do not confuse the two.

## Surprises & Discoveries


- Observation: `app/ui/ui.css` already has obvious internal boundaries that make a split straightforward.
  Evidence: the class groups are clustered by concern: buttons/fields at the top, footer in the middle, toast later, and header/search near the end.

- Observation: the first-phase production HTML still ships multiple shared JavaScript chunks on article pages even after the LCP image fix.
  Evidence: the first-pass verification on `/narzedzia/adobe-creative-cloud/cennik/` still showed root runtime chunks and extra shared client chunks in the HTML response.

- Observation: the nav split is a better first JS target than the toast split.
  Evidence: `PrimaryNav.tsx` wraps essential desktop markup inside a client boundary, while the toast is promotional UI and can be considered only after the nav is reduced and measured.

## Decision Log


- Decision: save concrete before/after reports in the repository before changing the second-wave architecture.
  Rationale: this phase is about broader shared assets. Without saved evidence, the team cannot prove whether the split helped or only moved code around.
  Date/Author: 2026-04-02 / Codex

- Decision: split the monolithic stylesheet before reducing shared client JavaScript.
  Rationale: CSS splitting is lower risk than JS architecture changes and should produce immediately measurable route-level wins.
  Date/Author: 2026-04-02 / Codex

- Decision: treat `PrimaryNav` as the first shared-JS reduction target.
  Rationale: it is clearly app-owned, clearly shared, and contains both static desktop UI and interactive mobile state in one client component.
  Date/Author: 2026-04-02 / Codex

- Decision: do not optimize `KlaroConsentManager` in the first part of this phase unless measurement proves it is necessary.
  Rationale: cookie consent is operationally sensitive, and the repository already treats it as an important workflow.
  Date/Author: 2026-04-02 / Codex

- Decision: keep browser-target work behind an explicit approval gate and use a concrete evergreen matrix only if approved.
  Rationale: changing browser support is a product decision, not a developer convenience tweak.
  Date/Author: 2026-04-02 / Codex

- Decision: treat the existing `AppRouteFileIndex` and `AppRoutePathResolver` build warnings as out of scope for this plan.
  Rationale: those warnings are real but unrelated to the mobile PageSpeed follow-up requested here.
  Date/Author: 2026-04-02 / Codex

## Outcomes & Retrospective


Implementation has not started yet. The intended outcome of this phase is:

- saved before/after Lighthouse evidence in the repository,
- a split replacement for `app/ui/ui.css`,
- a smaller shared client boundary for the marketing header,
- an identified owner for the forced reflow warning,
- and either a documented evergreen-browser decision or an explicit decision to keep the current browser targets.

If this phase is completed correctly, the site should keep the first-pass LCP wins while further reducing CSS and app-owned JS overhead across all representative content/detail pages.

## Plan Of Work


Milestone 1 is to capture reusable evidence. Save mobile Lighthouse reports and simple HTML asset snapshots before making any phase-two edits. The output must live in the repository so another contributor can compare later without rerunning the whole investigation from memory.

Milestone 2 is to split `app/ui/ui.css` by responsibility. Move the obvious class families into dedicated files and update components so they import only the CSS they actually use. The first target files should be:

- `app/ui/button.css`
- `app/ui/form-fields.css`
- `app/ui/site-header.css`
- `app/ui/site-footer.css`
- `app/ui/site-search-form.css`
- `app/ui/tool-of-week.css`

If another small shared file is needed, create it, but do not leave one giant fallback stylesheet in place "just in case."

Milestone 3 is to shrink the header client boundary. Convert `app/ui/PrimaryNav.tsx` into a server component that renders the logo, desktop links, and desktop search statically. Move only the mobile-drawer state and body-scroll logic into a dedicated client helper, for example:

- `app/ui/PrimaryNav.tsx`
- `app/ui/PrimaryNavDrawerClient.tsx`

After this milestone, desktop nav and desktop search should not require the same client bundle as the mobile drawer.

Milestone 4 is to remeasure after the nav split and decide whether a second shared-JS pass is necessary. If the article page still carries a meaningful client chunk for the tool-of-the-week promo, move that promo behind a non-critical client loader so it hydrates after the important page UI. If the chunk cost is negligible after the nav split, stop and document that the toast was intentionally left alone.

Milestone 5 is to trace the forced reflow in a production browser recording. Do not edit code until the actual owner is known. The acceptable outputs of this milestone are:

- a real fix in app code,
- or a documented finding that the warning is framework- or third-party-owned,
- or a documented finding that it is not reproducible locally.

Milestone 6 is the explicit browser-target decision gate. Only after the earlier milestones are measured should the team consider adding a custom `browserslist` to `package.json`. If evergreen-only support is approved, use this exact target list:

    "browserslist": ["chrome 111", "edge 111", "firefox 111", "safari 16.4"]

If evergreen-only support is not approved, record that decision and accept the remaining framework-owned legacy bundle bytes for now.

## Concrete Steps


All commands below run from:

    /home/marcel/src/projektbezkodu

All Node and npm commands in this repository must be prefixed with:

    source ~/.nvm/nvm.sh &&

### 1. Save baseline evidence


Run:

    mkdir -p docs/operations/reports/pagespeed-phase2
    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

Start the production server in a separate terminal:

    source ~/.nvm/nvm.sh && npm run start -- --hostname 127.0.0.1 --port 3000

Save Lighthouse reports for the two main comparison pages:

    source ~/.nvm/nvm.sh && npx --yes lighthouse http://127.0.0.1:3000/ --preset=mobile --output=json --output=html --output-path=./docs/operations/reports/pagespeed-phase2/home-mobile-baseline
    source ~/.nvm/nvm.sh && npx --yes lighthouse http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ --preset=mobile --output=json --output=html --output-path=./docs/operations/reports/pagespeed-phase2/adobe-tool-article-mobile-baseline

Save quick HTML asset snapshots for the representative content page:

    curl -Ls http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -o '/_next/static/chunks/[A-Za-z0-9]+\.css' | sort -u > docs/operations/reports/pagespeed-phase2/adobe-css-baseline.txt
    curl -Ls http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -o '/_next/static/chunks/[A-Za-z0-9]+\.js' | sort -u > docs/operations/reports/pagespeed-phase2/adobe-js-baseline.txt

Expected baseline at the start of this phase:

- the Adobe page still has the first-pass hero fix,
- there is no logo preload,
- shared CSS and shared JS are still broader than desired,
- and there is no saved forced-reflow trace yet.

### 2. Split `app/ui/ui.css`


Edit these files first:

- `app/ui/ui.css`
- `app/ui/Button.tsx`
- `app/ui/TextField.tsx`
- `app/ui/TextareaField.tsx`
- `app/ui/CheckboxField.tsx`
- `app/ui/SelectField.tsx`
- `app/ui/PrimaryNav.tsx`
- `app/ui/Footer.tsx`
- `app/ui/search/SiteSearchForm.tsx`
- `app/ui/ToolOfWeekToast.tsx`
- `app/ui/ToolOfWeekToastContainer.tsx`

Create these files:

- `app/ui/button.css`
- `app/ui/form-fields.css`
- `app/ui/site-header.css`
- `app/ui/site-footer.css`
- `app/ui/site-search-form.css`
- `app/ui/tool-of-week.css`

If needed, also create:

- `app/ui/surface-primitives.css`

Rules for this split:

1. Move only the class families that belong together.
2. Update component imports immediately after moving a block.
3. Do not leave duplicate rules in both places.
4. Keep each CSS file below the repository’s file-size ceiling.
5. If `app/ui/ui.css` still exists at the end, it must be small and clearly documented as a true shared fallback, not a second dumping ground.

After the split, run:

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

Useful proof commands:

    wc -l app/ui/*.css app/ui/search/*.css app/ui/heroes/*.css
    rg -n 'ui\.css' app --glob '*.{ts,tsx}'

Success means:

- there is no monolithic `ui.css` import left in the header, footer, or search form path,
- new CSS files remain under the repository size limits,
- and the representative routes still render correctly.

### 3. Split the header client boundary


Refactor these files:

- `app/ui/PrimaryNav.tsx`
- `app/ui/search/SiteSearchForm.tsx`

Create:

- `app/ui/PrimaryNavDrawerClient.tsx`

Implementation target:

- `PrimaryNav.tsx` becomes a server component.
- It renders the logo link, desktop nav links, and desktop search form directly.
- `PrimaryNavDrawerClient.tsx` becomes the only client component responsible for:
  - open/close state,
  - the menu button,
  - the mobile drawer,
  - the overlay,
  - Escape-key handling,
  - body scroll locking.

Do not change the visible navigation copy or link order.

For testability in the current node-only Vitest setup, extract any non-DOM class-name or aria-label derivation into a small pure helper if needed and add unit tests for that helper.

Useful test names include:

- `app/ui/PrimaryNav.test.ts`
- `app/ui/PrimaryNavDrawerState.test.ts`

After the split, verify:

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

And manually confirm in the browser:

1. Desktop navigation renders normally.
2. Mobile menu opens and closes.
3. Pressing Escape closes the menu.
4. Body scroll is locked only while the menu is open.
5. Search still submits to `/szukaj/`.

### 4. Decide whether the tool-of-the-week toast needs a second JS pass


Measure again after Milestone 3 before changing the toast.

Compare the new production HTML and Lighthouse reports for:

- `/`
- `/narzedzia/adobe-creative-cloud/cennik/`

If the shared client bundle is still materially large because of the promotional toast, add:

- `app/ui/ToolOfWeekToastLoader.tsx`

and move the non-critical toast hydration behind that loader. Keep the visible feature identical after hydration, but do not let it compete with critical content.

If the post-nav measurement is already acceptable, do not touch the toast. Record that decision in `Decision Log`.

### 5. Capture and resolve the forced reflow warning


Run the production server and open Chrome DevTools Performance for:

`http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/`

Record a page-load trace and inspect:

- `Layout`
- `Recalculate Style`
- scripting immediately before those events

Write the result into this plan:

- exact owner file if app code,
- exact library if third-party,
- or "not reproducible locally."

If the owner is app code, fix it and add tests where possible.

If the owner is `PrimaryNav`, `Klaro`, or the toast, prefer the smallest targeted fix instead of another broad refactor.

### 6. Browser-target decision gate


Only do this if stakeholders explicitly approve evergreen-only browser support.

Edit:

- `package.json`
- `docs/website_repro_playbook.md`
- this ExecPlan

Add:

    "browserslist": ["chrome 111", "edge 111", "firefox 111", "safari 16.4"]

Then rerun:

    source ~/.nvm/nvm.sh && npm run build
    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint

And manually smoke-test current Chrome, Safari, and Firefox on at least:

- `/`
- `/narzedzia/adobe-creative-cloud/cennik/`
- `/zasoby/agencje-nocode-pl/`

If evergreen-only support is not approved, do not touch `package.json`. Record the decision and stop.

## Validation


The final validation pass for this phase is:

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build
    source ~/.nvm/nvm.sh && npm run start -- --hostname 127.0.0.1 --port 3000

Then collect final reports:

    source ~/.nvm/nvm.sh && npx --yes lighthouse http://127.0.0.1:3000/ --preset=mobile --output=json --output=html --output-path=./docs/operations/reports/pagespeed-phase2/home-mobile-final
    source ~/.nvm/nvm.sh && npx --yes lighthouse http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ --preset=mobile --output=json --output=html --output-path=./docs/operations/reports/pagespeed-phase2/adobe-tool-article-mobile-final

Update the HTML asset snapshots:

    curl -Ls http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -o '/_next/static/chunks/[A-Za-z0-9]+\.css' | sort -u > docs/operations/reports/pagespeed-phase2/adobe-css-final.txt
    curl -Ls http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -o '/_next/static/chunks/[A-Za-z0-9]+\.js' | sort -u > docs/operations/reports/pagespeed-phase2/adobe-js-final.txt

Observable success means:

- representative pages still render and behave correctly,
- the repository now contains baseline and final Lighthouse reports,
- the shared CSS path is split into smaller files,
- `PrimaryNav` no longer forces the whole desktop header into one client component,
- the forced reflow warning has a documented owner or fix,
- and the final Lighthouse/PageSpeed report is better than the saved baseline, or the remaining framework-owned cost is explicitly documented.

Failure signals mean the phase is incomplete:

- a representative route loses styling after the CSS split,
- the mobile nav stops opening, closing, or locking body scroll,
- the search form stops submitting,
- a consent or service-worker workflow breaks,
- or browser support changes are made without approval and smoke testing.

## Risks And Safe Recovery


The biggest risk in this phase is partial CSS migration. If a route loses styling, restore only the specific CSS import needed for that component and continue the split in smaller steps. Do not put everything back into `ui.css` by reflex unless the working tree is clearly broken and you need a safe checkpoint.

The second biggest risk is the nav refactor. If the new server/client boundary breaks menu behavior, keep the CSS split and revert only the nav architecture changes.

The third biggest risk is the browser-target change. If that gate is approved and a supported browser breaks, revert only the `browserslist` change and keep the earlier CSS/JS improvements.

## What Not To Do


Do not guess at the forced reflow owner.

Do not touch `KlaroConsentManager` before measuring.

Do not leave one giant fallback stylesheet plus many tiny files. That defeats the point of the split.

Do not change navigation copy, link order, or search behavior while optimizing the client boundary.

Do not change browser support silently.

Do not mix the unrelated sitemap build warnings into this phase.

## Documentation Updates Required During Implementation


Update these files if behavior changes:

- `docs/website_repro_playbook.md`
  Record the final shared-header architecture, CSS split guidance, and browser-support policy if it changes.

- `docs/operations/audit_checklist.md`
  Add the exact report folder or representative routes if the checklist needs to point future audits to the saved evidence.

- this ExecPlan
  Keep `Progress`, `Decision Log`, `Surprises & Discoveries`, and `Outcomes & Retrospective` current after every milestone.

## Change Log


2026-04-02: Initial phase-two draft created after reading `docs/plans.md`, reviewing the completed first-pass performance ExecPlan, and inspecting the current shared CSS and shared client-entry files in the repository. This plan narrows the deferred work into a measurable second wave instead of leaving it as a vague backlog note.
