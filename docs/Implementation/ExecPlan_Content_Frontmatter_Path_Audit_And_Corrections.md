# Audit And Correct Broken Content Frontmatter Paths


This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If `docs/plans.md` exists, this plan must cite its repository-relative path and remain consistent with it. This plan was authored after reading `docs/plans.md` and must continue to follow its rules.

## Purpose / Big Picture


The goal is to find real frontmatter path breakage under `content/**`, correct the affected content, and strengthen the existing repository validation so the same class of breakage cannot silently return.

This must be done without destroying the repository's curated canonical URLs. In this codebase, many markdown files intentionally use a `frontmatter.path` that does not match the filename. Those curated paths are valid and are already used for SEO, canonical tags, and sitemap generation. The important distinction is between a curated canonical path that the router can serve and a broken canonical path that no route can resolve.

After this work, a maintainer should be able to trust that every production markdown page under `content/**` either:

- has a canonical `frontmatter.path` that is actually reachable through the repository's routing rules, or
- fails `npm run content:lint` before build.

The user-visible outcome should be easy to observe. A canonical content URL taken from frontmatter should return the intended page locally and in production. The validation command should fail on newly introduced broken paths instead of allowing them to ship.

## Progress


- [x] (2026-04-11 14:35Z) Read `docs/plans.md`, `docs/frontmatter_and_routing.md`, `docs/website_repro_playbook.md`, `scripts/validate-content.mjs`, `scripts/fix-artykuly-paths.mjs`, `app/lib/content/contentLibrary.ts`, `app/lib/content/ArticleHubManager.ts`, and the existing path-related tests.
- [x] (2026-04-11 14:38Z) Verified the current baseline with `source ~/.nvm/nvm.sh && npm run content:lint`; it passes today.
- [x] (2026-04-11 14:41Z) Confirmed the originally reported `/dostepnosc/...` failure is not caused by a broken canonical frontmatter path. The article exists at `content/artykuly/dostepnosc-cyfrowa/index11.md` with canonical `/artykuly/dostepnosc-cyfrowa/pdf-i-dokumenty-na-stronie-jak-publikowac-tresci-w-sposob-dostepny/`. The failing public URL is an unsupported alias.
- [x] (2026-04-11 14:43Z) Ran a repository-wide explicit-path-versus-derived-filename audit and found that naive filename-based mismatch detection is too noisy for this repository.
- [x] (2026-04-11 14:46Z) Drafted this ExecPlan.
- [x] (2026-04-11 15:06Z) Implemented a route-aware content-path audit inside `scripts/validate-content.mjs` using shared rules in `scripts/content-path-rules.mjs`.
- [x] (2026-04-11 15:06Z) Ran the improved audit against the full repository and classified 72 confirmed canonical-path defects: 15 tutorials and 57 tool pages.
- [x] (2026-04-11 15:08Z) Corrected the 72 confirmed broken canonical paths with `scripts/fix-public-content-paths.mjs` and added the missing legacy `/dostepnosc/...` article redirect path.
- [x] (2026-04-11 15:10Z) Updated docs and verified with targeted tests, full tests, ESLint, a production build, and local HTTP checks.

## Surprises & Discoveries


- Observation: the current repository already has strong validation for `/artykuly/**`, but not a general route-reachability audit for all content sections.
  Evidence: `scripts/validate-content.mjs` contains dedicated `/artykuly` hub hierarchy checks and collision checks, but it does not verify that every explicit canonical path is reachable through its owning route family.

- Observation: a filename-based rewrite would be dangerously wrong in this repository.
  Evidence: a one-off audit comparing explicit `frontmatter.path` to the path derived from the source filename reported 625 mismatches, including many intentional curated URLs such as `content/artykuly/dostepnosc-cyfrowa/index11.md` whose canonical path is a readable long-form slug rather than `/index11/`.

- Observation: the reported `/dostepnosc/...` bug is a routing-alias problem, not proof that the article's canonical frontmatter path is broken.
  Evidence: `content/artykuly/dostepnosc-cyfrowa/index11.md` declares canonical `/artykuly/dostepnosc-cyfrowa/pdf-i-dokumenty-na-stronie-jak-publikowac-tresci-w-sposob-dostepny/`, that canonical URL returns HTTP 200, and `app/lib/content/ArticleHubManager.ts` only maps `cms -> cms-bez-kodu` in `SLUG_ALIASES`.

- Observation: the generic content router already has the right canonical source of truth.
  Evidence: `app/lib/content/contentLibrary.ts` prefers explicit `frontmatter.path`, normalizes it, and indexes canonical paths plus selected aliases. Any new audit should reuse that logic rather than reimplement path rules from scratch.

- Observation: `_examples` fixtures live under `content/` and intentionally violate production URL expectations.
  Evidence: files under `content/_examples/**` are used by tests such as `app/lib/content/ContentLibraryFrontmatterPath.test.ts` and must not be treated as production content failures.

- Observation: the real canonical-path defects were concentrated in route-family prefix mistakes, not in curated SEO slugs.
  Evidence: the improved validator found 72 broken explicit paths, grouped as 15 tutorials under `content/poradniki/**` publishing outside `/poradniki/`, 57 tool pages under `content/narzedzia-no-code/**` and top-level tool folders publishing outside `/narzedzia/<tool>/...`, and no additional production-path failures after repair.

- Observation: the original `/dostepnosc/...` report required a routing alias, not a content rewrite.
  Evidence: after fixing the content-path audit, the remaining user-facing failure was resolved by extending `ArticleHubManager` alias handling and the generic catch-all route redirect path, while the canonical article markdown remained unchanged.

## Decision Log


- Decision: do not bulk rewrite `frontmatter.path` values to match filenames.
  Rationale: curated canonical slugs are normal in this repository, and a filename-based rewrite would destroy intentional SEO paths and introduce regressions at scale.
  Date/Author: 2026-04-11 / Codex

- Decision: strengthen the existing build-time validator instead of adding a separate optional checker as the primary enforcement mechanism.
  Rationale: `package.json` already runs `npm run content:lint` before build, so the best long-term fix is to make that command catch real path breakage automatically.
  Date/Author: 2026-04-11 / Codex

- Decision: use route-aware validation based on the repository's own routing modules.
  Rationale: the only meaningful definition of a broken canonical path is "the app cannot serve it as intended." The route owners are `ContentLibrary` for generic content and `ArticleHubManager` plus the `/artykuly` route entrypoint for article content.
  Date/Author: 2026-04-11 / Codex

- Decision: treat routing aliases as a separate concern from canonical content paths.
  Rationale: a missing alias such as `/dostepnosc/...` should not trigger a bulk content rewrite if the canonical article URL is already correct.
  Date/Author: 2026-04-11 / Codex

- Decision: exclude non-production fixture content from the audit.
  Rationale: `_examples` content exists to test path behavior and would otherwise create deliberate false positives.
  Date/Author: 2026-04-11 / Codex

## Outcomes & Retrospective


This section is intentionally incomplete until implementation starts.

The intended outcome is that the repository can distinguish three cases cleanly:

1. valid curated canonical paths that differ from filenames,
2. genuinely broken canonical paths that must be fixed in `content/**`,
3. non-canonical public shortcuts that require explicit alias handling instead of content edits.

Execution is complete.

The repository now distinguishes the three intended cases cleanly:

1. curated canonicals that intentionally differ from filenames and remain valid,
2. broken production canonicals that now fail `npm run content:lint`,
3. non-canonical legacy shortcuts such as `/dostepnosc/...` that redirect to the canonical article path.

The implemented changes corrected 72 broken explicit paths and added one routing-level legacy alias path for the originally reported accessibility article shortcut.

## Context and Orientation


In this repository, "frontmatter" means the YAML block at the top of a markdown file under `content/**`. The `path` field in that frontmatter is the canonical URL for the page when present. That rule is documented in `docs/frontmatter_and_routing.md` and implemented in `app/lib/frontmatter.ts` plus `app/lib/content/contentLibrary.ts`.

The site has two broad routing models for markdown content:

- Generic content routing. The catch-all route `app/(marketing)/(content)/[...segments]/page.tsx` asks `ContentLibrary` in `app/lib/content/contentLibrary.ts` for the canonical route entry. This covers non-article content families such as tutorials, comparisons, resources, and many standalone pages.
- Article routing. The special route `app/(marketing)/(content)/artykuly/[...segments]/page.tsx` uses `ArticleHubManager` in `app/lib/content/ArticleHubManager.ts`, `ArticleRepository` in `app/lib/content/repositories.ts`, and `ContentLibrary` as a fallback.

The validator that runs before build is `scripts/validate-content.mjs`. It already catches invalid `/artykuly` hub shapes, collisions, malformed fenced blocks, and several other issues. The repository also contains one auto-fixer, `scripts/fix-artykuly-paths.mjs`, but that fixer is intentionally limited to `/artykuly/**`.

This matters because the safe fix strategy differs by section:

- For `/artykuly/**`, automated normalization can be safe when it only enforces the repository's documented `/artykuly/<category>/...` invariant.
- For the rest of `content/**`, automatic rewrites are not safe by default because many explicit paths are deliberately curated and do not match directory names.

The audit performed while drafting this plan established one important baseline fact: `source ~/.nvm/nvm.sh && npm run content:lint` currently reports success even though the repository has no general proof that every explicit canonical path is actually reachable by the route that owns it.

## Plan of Work


Milestone 1 is to encode a route-aware definition of brokenness. Extend `scripts/validate-content.mjs` so it can answer a simple question for each production markdown document: "If this file declares an explicit canonical `frontmatter.path`, does the repository's actual router resolve that path to this document?" For generic content, this should flow through `ContentLibrary`. For `/artykuly/**`, it should flow through the same article routing rules used by `app/(marketing)/(content)/artykuly/[...segments]/page.tsx`.

Milestone 2 is to add focused tests before changing content. Add or extend Vitest coverage so a future contributor can see the difference between a valid curated path and a broken one. The tests must prove that the validator does not fail on intentional curated slugs, but does fail when a canonical path points outside the owning route family, collides, or cannot be resolved back to the source document.

Milestone 3 is to run the improved audit across the real repository and classify findings. Every finding should be sorted into one of these buckets:

- content correction required,
- route alias correction required,
- intentional exception that should remain valid and be encoded in tests or allowlists only if necessary.

Milestone 4 is to correct the confirmed issues with the smallest safe diff. Use automated fixers only where the repository already has a safe invariant, and perform manual content edits elsewhere. Do not rewrite curated canonical slugs simply because the filename is ugly or numbered.

Milestone 5 is documentation and verification. Update the relevant docs so contributors understand what counts as a broken path, how the validator enforces it, and when a missing alias should be fixed in routing instead of content.

## Concrete Steps


All commands below run from:

    /home/marcel/src/projektbezkodu

All Node and npm commands in this repository should be prefixed with:

    source ~/.nvm/nvm.sh &&

1. Capture the current baseline and preserve the evidence already gathered.

    source ~/.nvm/nvm.sh && npm run content:lint
    source ~/.nvm/nvm.sh && git status --short

   Expected baseline today:

    [content:lint] Validated 1223 markdown file(s) – no front matter issues found.

2. Implement route-aware path validation in `scripts/validate-content.mjs`.

   The validator should ignore fixture content under `content/_examples/**`.

   For generic content families resolved by `ContentLibrary`, the validator should:

   - load the canonical route entry for the explicit `frontmatter.path`,
   - verify that the path resolves,
   - verify that the resolved entry points back to the same source file,
   - fail if the path resolves to a different document or does not resolve at all.

   For article content under `content/artykuly/**`, the validator should:

   - keep the existing hub hierarchy checks,
   - verify that the canonical `/artykuly/...` path resolves through the article routing model,
   - distinguish unsupported aliases from broken canonicals.

   If a shared helper is needed, prefer a small module under `app/lib/content/` or `scripts/` instead of embedding new complexity inside one giant function.

3. Add focused tests.

   Update or extend:

    app/lib/content/ValidateContentScript.test.ts
    app/lib/content/ContentLibraryFrontmatterPath.test.ts
    app/lib/content/ContentLibraryTitleSlug.test.ts

   Add cases that prove:

   - a curated explicit path that differs from the filename remains valid when `ContentLibrary` resolves it back to the same document,
   - a production markdown file with an explicit path that resolves to nothing fails validation,
   - a production markdown file with an explicit path that resolves to a different document fails validation,
   - `_examples` fixtures are ignored by the production audit,
   - `/artykuly/**` canonicals still obey the stricter category-prefix and hub rules.

4. Run the improved audit on the real repository and capture the findings.

   If the validator output is not easy to act on, add a temporary or permanent reporting mode that prints:

   - repository-relative file path,
   - explicit canonical path,
   - owning route family,
   - reason for failure.

   Prefer a human-readable format that can be copied into this plan's `Surprises & Discoveries` and `Decision Log`.

5. Correct confirmed broken content paths.

   For `/artykuly/**`, use `scripts/fix-artykuly-paths.mjs` only when the existing safe normalization rule applies.

   For non-article sections, edit only the confirmed broken files under `content/**`. Do not rewrite a file merely because its filename and canonical slug differ.

   If the audit proves that a public shortcut like `/dostepnosc/...` must remain supported, fix that in routing code such as `app/lib/content/ArticleHubManager.ts` or the relevant route component. Do not change the canonical article frontmatter path unless the canonical itself is wrong.

6. Update documentation.

   At minimum, revise:

    docs/frontmatter_and_routing.md
    docs/content_editor_playbook.md
    docs/website_repro_playbook.md

   Document:

   - that curated canonicals are allowed,
   - that production canonicals must be reachable through the owning route family,
   - that `_examples` are not production content,
   - when to fix routing aliases instead of `frontmatter.path`.

## Validation and Acceptance


Run these commands from `/home/marcel/src/projektbezkodu`:

    source ~/.nvm/nvm.sh && npm test -- app/lib/content/ValidateContentScript.test.ts app/lib/content/ContentLibraryFrontmatterPath.test.ts app/lib/content/ContentLibraryTitleSlug.test.ts
    source ~/.nvm/nvm.sh && npm run content:lint
    source ~/.nvm/nvm.sh && npm run dev

Acceptance is behavioral:

- The targeted Vitest command passes and proves the new distinction between valid curated canonicals and truly broken canonical paths.
- `npm run content:lint` fails when a production markdown file declares an explicit canonical path that the repository cannot resolve back to that same file.
- `npm run content:lint` continues to allow intentional curated canonical slugs that are reachable and unique.
- Representative canonical URLs sampled from the fixed findings return the intended page locally.
- The originally reported canonical article URL `http://localhost:3000/artykuly/dostepnosc-cyfrowa/pdf-i-dokumenty-na-stronie-jak-publikowac-tresci-w-sposob-dostepny/` still renders after the audit changes.

Useful success signals:

    [content:lint] Validated <N> markdown file(s) – no front matter issues found.

    Test Files  3 passed
    Tests       <N> passed

Useful failure signals:

- the validator starts flagging most of `content/**` simply because explicit paths differ from filenames,
- a canonical path resolves, but to the wrong source document,
- fixing one broken path creates sitemap or canonical collisions,
- the `/artykuly` path rules regress while adding generic-content validation.

## Idempotence and Recovery


This work should be safe to pause and resume after each milestone.

The validation and audit steps are intended to be idempotent: rerunning them on a clean repository should report the same results and should not mutate files.

If an attempted content correction produces too many unrelated markdown changes, stop and inspect the diff before continuing. Do not keep a broad automated rewrite if the output includes large numbers of intentional curated slugs.

If a routing alias fix and a content fix conflict, keep the canonical path stable first, then add or adjust the alias separately. Canonicals and aliases should not be changed in one ambiguous step.

## Artifacts and Notes


Files likely to change when this plan is executed:

- `scripts/validate-content.mjs`
- `app/lib/content/ValidateContentScript.test.ts`
- `app/lib/content/ContentLibraryFrontmatterPath.test.ts`
- `app/lib/content/ContentLibraryTitleSlug.test.ts`
- `docs/frontmatter_and_routing.md`
- `docs/content_editor_playbook.md`
- `docs/website_repro_playbook.md`
- selected files under `content/**`
- possibly routing files such as `app/lib/content/ArticleHubManager.ts` if a missing supported alias is confirmed

Known evidence captured while drafting:

- `npm run content:lint` currently passes.
- A naive explicit-versus-derived audit reported 625 mismatches, proving that filename-based rewriting is the wrong strategy.
- The reported `/dostepnosc/...` example is an alias gap, not a canonical frontmatter-path failure.

When implementation starts, record each confirmed broken content file here with:

- repository-relative file path,
- old canonical path,
- new canonical path if changed,
- whether the fix was content-only or routing-only.

Summary of executed fixes:

- `content/poradniki/**`: 15 files corrected from bare `/<slug>/` paths to `/poradniki/<slug>/`.
- `content/hostinger-link-in-bio/**`, `content/later-link-in-bio/**`, `content/linktree/**`, `content/lnk-bio/**`: 37 tool pages corrected from bare section paths such as `/faq/` and `/recenzja/` to `/narzedzia/<tool>/...`.
- `content/narzedzia-no-code/**`: 20 tool pages corrected from wrong or truncated `/narzedzia/...` canonicals to the canonical `/narzedzia/<tool>/...` family.
- Routing-only fix: `/dostepnosc/<article-slug>` now redirects to `/artykuly/dostepnosc-cyfrowa/<canonical-article-path>/`.

## Interfaces and Dependencies


Relevant repository interfaces and modules:

- `scripts/validate-content.mjs` is the build-time enforcement point.
- `scripts/fix-artykuly-paths.mjs` is the existing safe normalizer for `/artykuly/**`.
- `app/lib/content/contentLibrary.ts` is the canonical route index for generic markdown content.
- `app/(marketing)/(content)/[...segments]/page.tsx` is the generic content route entrypoint.
- `app/lib/content/ArticleHubManager.ts` plus `app/(marketing)/(content)/artykuly/[...segments]/page.tsx` own `/artykuly/**`.
- `app/lib/content/repositories.ts` provides article and other content summaries used by routing and listings.

The key dependency choice in this plan is to validate against these existing modules instead of inventing a second routing model inside the validator. That keeps the audit aligned with the code that actually serves content.

Plan change note: created on 2026-04-11 after investigating the `/dostepnosc/...` report, confirming the current `content:lint` baseline, and proving that filename-based path mismatch detection would create hundreds of false positives in this repository.
Plan change note: updated on 2026-04-11 after implementation. Added the final audit count (72 content-path fixes), recorded the route-aware validator/fixer, and documented the routing-only `/dostepnosc/...` alias repair.
