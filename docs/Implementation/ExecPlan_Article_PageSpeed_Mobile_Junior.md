# Improve Mobile PageSpeed For Article-Style Content Pages

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If `docs/plans.md` exists, this plan must cite its repository-relative path and remain consistent with it. This plan was authored after reading `docs/plans.md` and must continue to follow its rules.

## Purpose / Big Picture


The goal is to improve mobile performance for article-style pages, starting with the production URL pattern represented by `/narzedzia/adobe-creative-cloud/cennik/`. Today PageSpeed Insights reports four main issues on that page: render-blocking CSS, a Largest Contentful Paint (LCP) hero image that is not explicitly marked with `fetchpriority="high"`, legacy JavaScript/polyfill overhead in a shared bundle, and a small forced reflow that is not yet attributed to a specific script.

After this work, a visitor opening a long-form content page on mobile should see the hero image discovered earlier, fewer unnecessary bytes competing with the first render, and no shared header logo preload competing with the article hero. The user-visible success case is simple: the page still looks the same, still works on mobile, but PageSpeed and Lighthouse report fewer critical CSS/JS warnings, and the HTML clearly shows the hero image with the correct high-priority loading hint.

This plan is written for a junior developer. Every file path, command, and term is named explicitly. A "render-blocking stylesheet" means a CSS file the browser must download before it can paint the page. An "LCP image" means the biggest above-the-fold image that most strongly affects how quickly the page feels loaded. A "polyfill" means extra JavaScript added so older browsers can understand newer language features.

## Progress


- [x] 2026-04-02: Read `docs/plans.md` and confirmed this document must remain self-contained and be updated as work progresses.
- [x] 2026-04-02: Used Serena to inspect the actual route, hero component, content view model, and layout files used by `/narzedzia/adobe-creative-cloud/cennik/`.
- [x] 2026-04-02: Used Context7 with official Next.js 16 documentation to confirm current guidance for `next/image`, CSS delivery in the App Router, and browser-target/polyfill behavior.
- [x] 2026-04-02: Verified repository evidence for the current target page in `content/narzedzia-no-code/adobe-creative-cloud/cennik/index.md`.
- [x] 2026-04-02: Drafted this ExecPlan.
- [x] 2026-04-02: Implemented the first production-safe pass across article-style and other hero-driven detail pages: shared hero loading hints, shared brand logo reuse without `priority`, removal of the broad content-layout article CSS import, and removal of the duplicate article CSS import from the nested tool-article route.
- [x] 2026-04-02: Updated native above-the-fold hero images on `/zasoby/[slug]`, `/przypadki-uzycia/[slug]`, and `/do-pobrania/[slug]` to use explicit eager/high-priority loading attributes.
- [x] 2026-04-02: Added coverage for the new shared markup behavior in `app/ui/heroes/ContentHero.test.ts` and `app/ui/BrandLogo.test.ts`.
- [x] 2026-04-02: Verified the code with `source ~/.nvm/nvm.sh && npm test`, `source ~/.nvm/nvm.sh && npm run lint`, and `source ~/.nvm/nvm.sh && npm run build`.
- [x] 2026-04-02: Verified the production HTML with `curl -Ls http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/` and confirmed the hero now emits `fetchPriority="high"` + `loading="eager"` while the shared header logo is no longer preloaded.
- [ ] Baseline Lighthouse and DevTools evidence not captured into repository files yet.
- [ ] Shared `app/ui/ui.css` split not started yet.
- [ ] Shared client-JavaScript reduction not started yet.
- [ ] Browser-target decision gate not started yet.
- [ ] Forced reflow root-cause trace not started yet.

## Current State For A New Contributor


The target page is not rendered by a special Adobe-only route. It is rendered by the nested tool-article route:

`app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx`

That route builds a `ContentPageViewModel` and asks it for the hero image, summary bullets, taxonomy, and body content. The hero image for the audited page comes from markdown frontmatter in:

`content/narzedzia-no-code/adobe-creative-cloud/cennik/index.md`

The view model resolves that hero image in:

`app/lib/content/contentPageViewModel.ts`

The hero component that actually renders the image is:

`app/ui/heroes/ContentHero.tsx`

The shared marketing header and logo live in:

`app/(marketing)/layout.tsx`

The root layout that adds shared client-side scripts and global CSS lives in:

`app/layout.tsx`

The content route group has its own layout:

`app/(marketing)/(content)/layout.tsx`

That layout currently imports:

`app/(marketing)/(content)/artykuly/article.module.css`

This matters because it means article styling can be loaded for every content route in that route group, even when a given page does not need it.

The generic content-page helper CSS is:

`app/(marketing)/(content)/[...segments]/content-page.module.css`

The shared UI stylesheet is:

`app/ui/ui.css`

This file is currently very large and is imported by many components, including `PrimaryNav`, `Footer`, form controls, cards, toasts, and article helpers. Because the browser can only paint after critical CSS is ready, this shared stylesheet is a high-probability source of render-blocking overhead.

The target page also loads shared client-side code from the root layout and marketing layout. The most important app-owned client components are:

- `app/ui/PrimaryNav.tsx`
- `app/ui/KlaroConsentManager.tsx`
- `app/ui/ServiceWorkerRegistration.tsx`
- `app/ui/ToolOfWeekToastContainer.tsx`

These do not automatically mean "bad," but they are the first places to inspect when a content page ships JavaScript the reader does not immediately need.

## Repository Evidence


The current repository state gives us several concrete facts:

1. `ContentHero` renders the hero image with `priority`, but the current PageSpeed report still shows the final HTML image without `fetchpriority="high"`. Official Next.js 16 docs reviewed through Context7 say the preferred modern hint is `fetchPriority="high"` or `loading="eager"` rather than relying only on preload-style behavior.

2. The shared marketing header logo in `app/(marketing)/layout.tsx` also uses `priority`. That means every marketing page can preload the logo even when the article hero should be the more important image.

3. The physical logo source file is oversized for header use. `public/projektbezkodu_logo.png` is a 1024x300 PNG and is 228 KB on disk, even though the header renders it at `128x38`.

4. The audited content route imports `article.module.css` twice in the same file:

   `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx`

   Once as a CSS module import and once as a side-effect import. This is a low-risk cleanup candidate.

5. The content route group layout imports `article.module.css` for the whole group:

   `app/(marketing)/(content)/layout.tsx`

   That is a likely source of CSS being present earlier and more broadly than necessary.

6. `app/ui/ui.css` is currently 1289 lines long. That violates the repository size preference and strongly suggests this stylesheet should be split into smaller files by responsibility.

7. The build output already confirms a shared legacy/polyfill bundle. `.next/build-manifest.json` lists `static/chunks/d02061f96f1def86.js` as a root main file, and direct inspection shows it contains polyfills for `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`, `Object.hasOwn`, `trimStart`, and `trimEnd`.

8. `package.json` does not currently define a custom `browserslist`. Because of that, browser-target changes are not a safe "quick fix"; they are a product support decision and must be treated as one.

9. A code search in `app/` did not find obvious geometry reads such as `offsetWidth`, `offsetHeight`, `getBoundingClientRect`, or `scrollHeight`. That means the forced reflow warning should be treated as a tracing task first, not a blind code edit.

10. Official Next.js 16 docs reviewed through Context7 also confirm that production CSS is already concatenated into code-split route CSS files. That means the right fix is to reduce what this route imports, not to hunt for a magical Next.js config switch that disables render-blocking CSS.

## Surprises & Discoveries


- Observation: the nested tool-article page is the correct implementation target for the audited URL.
  Evidence: `/narzedzia/adobe-creative-cloud/cennik/` comes from `content/narzedzia-no-code/adobe-creative-cloud/cennik/index.md` and is rendered by `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx`.

- Observation: the hero image data is not hardcoded in the page component.
  Evidence: `ContentPageViewModel.getHeroImage()` in `app/lib/content/contentPageViewModel.ts` resolves `frontmatter.hero.image` first and then `meta.heroImageSrc`.

- Observation: the shared logo is probably competing with the real LCP image.
  Evidence: `app/(marketing)/layout.tsx` renders the logo with `priority`, and the compiled production HTML preloads that image on marketing pages.

- Observation: there is an obvious duplicate CSS import in the audited route.
  Evidence: `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx` imports `article.module.css` both as `articleStyles` and as a separate side-effect import.

- Observation: the content route group currently broadens article CSS scope.
  Evidence: `app/(marketing)/(content)/layout.tsx` side-effect imports `./artykuly/article.module.css`.

- Observation: the shared UI stylesheet is unusually large for a site that wants route-level CSS efficiency.
  Evidence: `wc -l app/ui/ui.css` reports 1289 lines.

- Observation: the SVG logo path is not ready yet.
  Evidence: `docs/operations/svg_optimization_report.md` says the SVG logo files in `brand/logo/` are zero-byte placeholders, so this task cannot depend on a finished SVG wordmark.

- Observation: the forced reflow finding currently has no clear app-level owner.
  Evidence: a repository search found no common layout-thrashing DOM reads in `app/`.

- Observation: removing the route-group-wide article CSS import reduced the Adobe tool-article page from three CSS files to two in the production HTML response.
  Evidence: after the change, the production HTML for `/narzedzia/adobe-creative-cloud/cennik/` linked `/0559d701abc23c45.css` and `/385db9033c8a76d7.css`, instead of the earlier three-file chain reported by PageSpeed.

## Decision Log


- Decision: do the low-risk, high-confidence wins first.
  Rationale: the hero loading hint, the header logo preload, the duplicate CSS import, and the over-broad article stylesheet import all have direct repository evidence and low implementation risk.
  Date/Author: 2026-04-02 / Codex

- Decision: do not start by changing browser targets.
  Rationale: changing `browserslist` can remove legacy code, but it is a support-policy decision and can break older browsers. It is not an acceptable first move for a junior developer without a clear approval gate.
  Date/Author: 2026-04-02 / Codex

- Decision: do not block this work on SVG logo assets.
  Rationale: the repository does not yet contain usable SVG logo files. The first implementation pass should use a smaller raster asset for the header if needed.
  Date/Author: 2026-04-02 / Codex

- Decision: treat the forced reflow warning as a measurement task first.
  Rationale: no direct code evidence points to a specific offender yet, so editing code now would be guesswork.
  Date/Author: 2026-04-02 / Codex

- Decision: keep `next.config.ts` unchanged in the first implementation pass.
  Rationale: the current issues are caused by component/layout behavior and import scope, not by a missing performance toggle in Next.js config.
  Date/Author: 2026-04-02 / Codex

## Outcomes & Retrospective


The first implementation pass is complete. The production HTML for `/narzedzia/adobe-creative-cloud/cennik/` now shows the hero image with `fetchPriority="high"` and `loading="eager"`, and the shared marketing header logo is no longer preloaded. The route-level CSS delivery is also narrower because the broad `app/(marketing)/(content)/layout.tsx` article stylesheet import and the duplicate import in the nested tool-article route were removed.

If later investigation shows that most of the reported old-code bytes come from framework polyfills that are already conditionally served by Next.js, the final plan must record that and avoid unsafe browser-target changes. In that case the measurable win should come from app-owned CSS and client-surface reduction instead.

What remains is the second wave of work: splitting `app/ui/ui.css`, auditing shared client components for unnecessary content-page JavaScript, deciding whether browser-target changes are acceptable, and tracing the forced reflow warning with a production performance recording.

## Plan Of Work


Milestone 1 is to capture a reproducible baseline in production mode. A junior developer must not rely on `next dev` for performance work because development mode behaves differently. Build the app, run the production server locally, save a mobile Lighthouse report, and inspect the actual HTML for the hero image and logo. This gives a before-state that can be compared later.

Milestone 2 is to fix the hero image loading hint. Update `app/ui/heroes/ContentHero.tsx` so article-style hero images use the current explicit loading hints recommended by official Next.js docs. The success condition is not "the prop changed in code"; the success condition is that the rendered HTML for the hero image on `/narzedzia/adobe-creative-cloud/cennik/` shows a high-priority loading hint and is not lazy-loaded.

Milestone 3 is to stop the shared header logo from competing with the hero image. Remove `priority` from the marketing-layout logo and, if the current raster is still too heavy after that, create a smaller header-specific raster asset under `public/` and point the header at it. Do not wait for the unfinished SVG pipeline for this milestone.

Milestone 4 is to reduce route CSS scope. Start with the audited route and the content route group: remove the duplicate `article.module.css` import in `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx`, then remove the broad `article.module.css` import from `app/(marketing)/(content)/layout.tsx`. If a page still needs article styles after that, import them in the page that actually uses the `.article-page*` classes instead of the whole route group.

Milestone 5 is to split oversized shared CSS by responsibility. `app/ui/ui.css` is too large to be a healthy critical-path stylesheet. Split it into smaller files such as a header stylesheet, footer stylesheet, form-controls stylesheet, and card/article-helper stylesheet. Then update each component to import only the CSS it needs. The first components to split are `app/ui/PrimaryNav.tsx`, `app/ui/Footer.tsx`, and `app/ui/search/SiteSearchForm.tsx`, because they affect nearly every marketing page.

Milestone 6 is to reduce app-owned shared client JavaScript without changing behavior. Inventory the components marked with `"use client"` that render on every marketing page. The most likely candidate is `app/ui/PrimaryNav.tsx`, because desktop navigation does not need the same amount of immediate client logic as a mobile drawer. Split it into a mostly server-rendered shell plus a smaller client-only drawer controller if measurement shows a real win. Treat `KlaroConsentManager` carefully because consent behavior is operationally sensitive.

Milestone 7 is to decide, explicitly, whether a browser-target change is allowed. Only after Milestones 2 through 6 are finished should the team consider adding a custom `browserslist` to `package.json`. If that decision is approved, document the supported browser matrix, add the target list, rebuild, and manually smoke-test modern Chrome, Safari, and Firefox. If that approval is not given, record that the polyfill finding is accepted for now.

Milestone 8 is to investigate the forced reflow using a production trace. Capture a Chrome DevTools Performance recording on the local production build, filter for Layout/Recalculate Style work near page load, and identify the actual call stack. If the owner is app code, fix it. If the owner is framework or third-party code, document that finding and do not invent a fake fix.

## Concrete Steps


All commands below run from:

    /home/marcel/src/projektbezkodu

All Node and npm commands in this repository must be prefixed with:

    source ~/.nvm/nvm.sh &&

### 1. Capture the baseline


Run the baseline verification first:

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

Start the production server in a separate terminal:

    source ~/.nvm/nvm.sh && npm run start -- --hostname 127.0.0.1 --port 3000

Save a local mobile Lighthouse report for the exact article URL:

    source ~/.nvm/nvm.sh && npx --yes lighthouse http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ --preset=mobile --output=json --output=html --output-path=./docs/operations/reports/article-pagespeed-mobile-baseline

Inspect the rendered HTML for the hero and logo:

    curl -s http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -n "fetchpriority|loading=|projektbezkodu_logo|adobe-creative-cloud-pricing|rel=\"preload\""

Expected baseline today:

- The hero image is present in HTML.
- The logo preload is present in HTML.
- The hero image does not clearly show `fetchpriority="high"` in the final HTML, matching the PSI complaint.

### 2. Fix the article hero image hint


Edit:

- `app/ui/heroes/ContentHero.tsx`

Do not change unrelated visual styling. Only change how the hero image communicates loading priority.

Implementation target:

- The content hero image on article-style pages should render with an explicit high-priority hint.
- The image must remain above the fold and must not become lazy-loaded.
- Keep width, height, and `sizes="100vw"` unless measurement proves those values are wrong.

If the component needs a clearer API, add a small typed prop that means "this image is the page LCP candidate." Keep that prop narrow and document it in the plan when added.

After the edit, rebuild and verify with:

    source ~/.nvm/nvm.sh && npm run build
    curl -s http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -n "adobe-creative-cloud-pricing|fetchpriority|loading="

Success means the hero image HTML now includes the expected high-priority hint and is not lazy-loaded.

### 3. Stop preloading the header logo on marketing pages


Edit:

- `app/(marketing)/layout.tsx`

Only if needed after measurement, also add a smaller header-specific raster asset under `public/` and update the `Logo` component to use it.

Do not change the legal layout yet. The audited page uses the marketing layout, so keep scope narrow.

Implementation target:

- Remove `priority` from the shared marketing logo so it stops competing with the article hero.
- If the current optimized logo response is still too large, create a smaller header-specific logo source file and use that instead of the 1024x300 original.

Verify with:

    source ~/.nvm/nvm.sh && npm run build
    curl -s http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -n "projektbezkodu_logo|rel=\"preload\" as=\"image\""

Success means the page no longer preloads the header logo and the header still renders correctly on mobile and desktop.

### 4. Narrow the article CSS scope


Edit:

- `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx`
- `app/(marketing)/(content)/layout.tsx`

Then check every page that actually uses `.article-page*` classes and keep a direct import only there. The current candidates already visible in the repository are:

- `app/(marketing)/(content)/[...segments]/page.tsx`
- `app/(marketing)/(content)/artykuly/article/ArticleDetailPage.tsx`
- `app/(marketing)/(content)/poradniki/[slug]/page.tsx`
- `app/(marketing)/(content)/porownania/[slug]/page.tsx`
- `app/(marketing)/(content)/szablony/[slug]/page.tsx`
- `app/(marketing)/(content)/narzedzia/[slug]/[...segments]/page.tsx`

Implementation target:

- Remove the duplicate `article.module.css` import from the audited route.
- Remove the route-group-wide `article.module.css` import from `app/(marketing)/(content)/layout.tsx`.
- Keep article CSS only on routes that truly render article layout classes.

After that, run:

    source ~/.nvm/nvm.sh && npm run build

And manually open at least these pages:

- `/narzedzia/adobe-creative-cloud/cennik/`
- `/artykuly/`
- `/porownania/`
- `/poradniki/`
- `/szablony/`
- one generic content route rendered by `app/(marketing)/(content)/[...segments]/page.tsx`

Success means styles still render correctly, and the baseline Lighthouse rerun shows a lower CSS burden or fewer blocking CSS complaints than before.

### 5. Split `app/ui/ui.css` into smaller files


Edit:

- `app/ui/ui.css`
- `app/ui/PrimaryNav.tsx`
- `app/ui/Footer.tsx`
- `app/ui/search/SiteSearchForm.tsx`

Potential follow-up imports may also need updates in the other UI primitives that currently depend on `ui.css`.

This is the most mechanical part of the work. The safest approach is to split by responsibility, not by random chunks. For example:

- header/navigation styles,
- footer styles,
- form-field styles,
- button styles,
- card/stack helper styles,
- article helper styles that are only used on content pages.

Do not leave the repository in a half-split state where every component still imports both the new CSS files and the old giant stylesheet.

Success means:

- `app/ui/ui.css` is either removed or reduced to a small set of truly shared primitives,
- no replacement CSS file exceeds repository size guidance,
- the target page still renders correctly,
- Lighthouse or PageSpeed shows a reduction in render-blocking CSS bytes compared with the baseline report.

### 6. Audit shared client JavaScript


Read and measure these first:

- `app/layout.tsx`
- `app/ui/PrimaryNav.tsx`
- `app/ui/KlaroConsentManager.tsx`
- `app/ui/ServiceWorkerRegistration.tsx`
- `app/ui/ToolOfWeekToastContainer.tsx`

Implementation target:

- Keep root client behavior only where it is genuinely needed on first paint.
- Start with `PrimaryNav`. Desktop links and branding should remain server-rendered; only the mobile drawer behavior needs client state.
- If the code is split, keep the public behavior identical. The menu must still open, close, lock body scroll, and close on Escape.
- Do not defer or break consent behavior without explicit verification.

Add or update tests around any extracted helper logic. If the split creates a pure state helper or action helper, test that helper with Vitest. If no good pure helper exists, document that the verification is integration-heavy and rely on lint/build/manual checks.

### 7. Browser-target decision gate


Only do this step after the earlier milestones are complete and measured.

If stakeholders approve a modern-browser support policy, add an explicit `browserslist` to `package.json` and document the chosen support matrix in:

- `docs/website_repro_playbook.md`
- this ExecPlan

Then rebuild and manually smoke-test current Chrome, Safari, and Firefox.

If stakeholders do not approve the change, record that decision in `Decision Log` and stop here. Do not silently change browser support just to satisfy a Lighthouse audit.

### 8. Forced reflow investigation


Use Chrome DevTools Performance on the production build, not development mode.

Record a page-load trace for:

`http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/`

Look for:

- `Layout`
- `Recalculate Style`
- scripting directly before those events

Write down the real owner in this plan:

- app code,
- Next.js/runtime,
- third-party code such as Klaro,
- or "not reproducible locally."

Only after the owner is known should code changes be made.

## Validation


Run these commands after each milestone that changes code:

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build

For the final verification pass, run:

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run lint
    source ~/.nvm/nvm.sh && npm run build
    source ~/.nvm/nvm.sh && npx --yes lighthouse http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ --preset=mobile --output=json --output=html --output-path=./docs/operations/reports/article-pagespeed-mobile-final

Then verify the actual HTML again:

    curl -s http://127.0.0.1:3000/narzedzia/adobe-creative-cloud/cennik/ | rg -n "fetchpriority|loading=|projektbezkodu_logo|rel=\"preload\""

Observable success conditions:

- The hero image is still present in the initial HTML.
- The hero image now carries the explicit high-priority loading hint.
- The shared header logo is no longer preloaded on the audited page.
- The page still looks correct on mobile and desktop.
- The final Lighthouse report shows fewer or smaller render-blocking CSS warnings than the baseline.
- The final Lighthouse or PageSpeed result shows a lower unused-JS burden or a documented reason why the remaining bytes are framework-owned and intentionally accepted.

Failure signals:

- The hero image becomes lazy-loaded.
- The header logo disappears or becomes blurry on normal displays.
- A content page loses article styling after removing the broad CSS import.
- The mobile menu stops opening or stops locking body scroll.
- A browser-target change is made without documentation and smoke testing.

## Risks And Safe Recovery


The most likely regression is missing styling after CSS import cleanup. That is safe to recover from: re-add the missing import to the specific page component that uses the styles. Do not restore the broad route-group import unless you have confirmed that many pages genuinely need it.

The second likely regression is breaking the mobile navigation while reducing shared client JavaScript. If that happens, revert only the nav split and keep the earlier hero/logo/CSS wins.

Changing browser targets is the riskiest step. If a `browserslist` change causes breakage, revert only the browser-target change and keep the earlier improvements.

## What Not To Do


Do not add random `preconnect` tags. The current PageSpeed report explicitly says there are no good additional preconnect candidates.

Do not change `next.config.ts` first. There is no repository evidence that the current bottleneck is caused by missing Next.js config.

Do not assume the forced reflow comes from app code without a trace.

Do not block the task on the unfinished SVG logo pipeline.

Do not change article content, copy, or metadata fields unless a code change requires a documented content update.

## Documentation Updates Required During Implementation


When implementation begins, update these docs if behavior changes:

- `docs/website_repro_playbook.md`
  Record the final rule for article hero image priority and any agreed browser-support policy.

- `docs/operations/audit_checklist.md`
  Add the exact audited URL and the location of the saved Lighthouse before/after reports if the checklist is expanded.

- This ExecPlan
  Update `Progress`, `Decision Log`, `Surprises & Discoveries`, and `Outcomes & Retrospective` after every milestone or major finding.

## Change Log


2026-04-02: Initial draft created after reviewing `docs/plans.md`, inspecting the content-page route and shared layouts with Serena, and confirming Next.js 16 guidance with Context7. The plan intentionally sequences low-risk wins before any browser-target change.
2026-04-02: Updated after implementation. Recorded the completed first pass (hero image loading hints, shared logo de-prioritization, narrower article CSS scope, and native hero image fixes on resource/case-study/lead-magnet detail pages), plus the production HTML verification outcome and the remaining deferred milestones.
