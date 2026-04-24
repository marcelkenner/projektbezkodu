# Deploy ProjektBezKodu On OVH With Nginx And systemd

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If `docs/plans.md` exists, this plan must cite its repository-relative path and remain consistent with it. This plan was authored after reading `docs/plans.md` and must continue to follow its rules.

## Purpose / Big Picture

The goal is to make `projektbezkodu.pl` deployable on an OVH Ubuntu server in a way that a junior developer can repeat safely. After this work, a junior developer will be able to prepare the repository, create the server service, configure Nginx, attach HTTPS, and verify that the public site works over the real domain.

The user-visible result is simple: visiting `https://<production-domain>` loads the Next.js site, the app responds on a private local port behind Nginx, canonical host redirects still work, and newsletter redirects keep the public domain instead of leaking `127.0.0.1` or an internal port. You can observe success with `curl`, `systemctl`, `journalctl`, a browser visit to the homepage, and one real newsletter test submission if Listmonk is part of the launch.

## Progress

- [x] (2026-04-02 17:13Z) Read `docs/plans.md`, `README.md`, `package.json`, `next.config.ts`, `proxy.ts`, `app/lib/url/CanonicalHostRedirectManager.ts`, `app/api/newsletter/RequestOriginResolver.ts`, `docs/ovh-cloud.md`, and `docs/frontmatter_and_routing.md`.
- [x] (2026-04-02 17:13Z) Used Serena to inspect repository structure and confirm that the runtime is a Next.js App Router application rooted in `app/`.
- [x] (2026-04-02 17:13Z) Used Context7 with official Next.js 16 docs to confirm the supported self-hosting contract: `next build`, `next start`, `PORT=<port>`, and build-time freezing of `NEXT_PUBLIC_*` variables.
- [x] (2026-04-02 17:13Z) Verified the current baseline locally: `source ~/.nvm/nvm.sh && npm test` passed and `source ~/.nvm/nvm.sh && npm run build` passed.
- [x] (2026-04-02 17:13Z) Drafted this ExecPlan.
- [x] (2026-04-02 17:18Z) Corrected the plan after user clarification that `docs/ovh-server-details.md` is valid server-context for this project.
- [ ] Add repository-owned deployment prerequisites that are currently missing: `.nvmrc`, `.env.example`, a health endpoint, checked-in OVH config templates, and a repo-specific runbook.
- [ ] Deploy the app to the OVH server using the runbook created by this plan.
- [ ] Verify public HTTPS behavior on the real production domain.

## Surprises & Discoveries

- Observation: `docs/ovh-server-details.md` can still be useful here as server inventory, but it is not a repo-specific deployment runbook for ProjektBezKodu.
  Evidence: the file contains concrete server facts such as hostname, IPv4, SSH entrypoint, Ubuntu version, Node version, and Nginx version, but its service, paths, and canonical runbook references are named for CafeBadge.

- Observation: the repository already has the standard Next.js production scripts required for self-hosting.
  Evidence: `package.json` defines `"build": "next build"` and `"start": "next start"`.

- Observation: the repository does not yet contain several deployment artifacts that `docs/ovh-cloud.md` says a junior-friendly repo should have.
  Evidence: no `.nvmrc`, no `.env.example`, no `app/api/health/route.ts`, and no checked-in `ops/systemd/*.service.example` or `ops/nginx/*.conf.example` files were found.

- Observation: current deployment notes are mostly Railway-oriented, not OVH-oriented.
  Evidence: `README.md` documents Railway and Listmonk, but not a repo-specific OVH runbook for this app.

- Observation: newsletter redirects depend on forwarded proxy headers.
  Evidence: `app/api/newsletter/RequestOriginResolver.ts` prefers `Forwarded` or `X-Forwarded-Host` and `X-Forwarded-Proto` before falling back to `request.url`.

- Observation: canonical host redirects depend on public host configuration.
  Evidence: `app/lib/url/CanonicalHostRedirectManager.ts` uses `CANONICAL_HOST`, then `NEXT_PUBLIC_SITE_URL`, then the hard-coded fallback `https://projektbezkodu.pl`.

- Observation: `NEXT_PUBLIC_*` values are build-time values, not runtime values.
  Evidence: Context7 confirms that Next.js inlines `NEXT_PUBLIC_*` variables during `next build`, while server-only variables remain runtime values.

- Observation: `npm run build` currently mutates markdown files because `prebuild` runs `npm run content:format`.
  Evidence: local build output reported `[content:format] 4 file(s) updated with normalized front matter.` and `git diff` showed frontmatter formatting-only changes.

- Observation: the local build completed successfully but still used many static-generation workers.
  Evidence: `npm run build` completed and reported `Generating static pages using 21 workers (1067/1067) in 46s`. This means a small OVH server may still hit memory pressure during build.

## Decision Log

- Decision: Deploy the app as a standard self-hosted Next.js server using `npm run build` and `npm run start`, fronted by Nginx and supervised by `systemd`.
  Rationale: this is the officially supported Next.js production path confirmed by Context7 and it matches the existing `package.json` scripts.
  Date/Author: 2026-04-02 / Codex

- Decision: Use `docs/ovh-cloud.md` as the generic hosting pattern and use `docs/ovh-server-details.md` only as shared server inventory unless a value is explicitly confirmed for ProjektBezKodu.
  Rationale: the server-details file is useful for infrastructure facts such as SSH access, OS, Node, and Nginx, but its app-specific paths and service names are not safe to copy into a ProjektBezKodu runbook without verification.
  Date/Author: 2026-04-02 / Codex

- Decision: Record the user's clarification that the OVH server-details document applies to this same server.
  Rationale: the plan originally treated that file as unrelated to this project; that assumption was too strong and is now corrected.
  Date/Author: 2026-04-02 / Codex

- Decision: Before touching the OVH server, first add repo-owned operational artifacts.
  Rationale: the generic OVH guide in this repository explicitly says a junior-safe repo should provide a pinned runtime, environment template, health endpoint, and checked-in examples for service and Nginx configuration.
  Date/Author: 2026-04-02 / Codex

- Decision: Standardize the project slug to `projektbezkodu` for deployment assets unless a later server inventory shows a naming conflict.
  Rationale: using the repo/domain name keeps the path, Unix user, service, and config names easy to understand.
  Date/Author: 2026-04-02 / Codex

- Decision: Use the multi-site OVH directory layout from `docs/ovh-cloud.md`: `/srv/www/projektbezkodu/app`, `/srv/www/projektbezkodu/shared/.env.production`, `/var/log/projektbezkodu`, and `127.0.0.1:<port>`.
  Rationale: this layout is already documented in the repo and avoids mixing unrelated sites on the same server.
  Date/Author: 2026-04-02 / Codex

- Decision: Add a simple application health endpoint at `app/api/health/route.ts` that returns HTTP `200` and a tiny JSON payload.
  Rationale: the repo currently has no health route, and the OVH deployment guide explicitly recommends one for smoke tests and failure isolation.
  Date/Author: 2026-04-02 / Codex

- Decision: Add `X-Forwarded-Host` in the Nginx example and the final runbook, not only `Host`.
  Rationale: the newsletter redirect resolver explicitly reads `X-Forwarded-Host`; without it, redirects may use an internal origin.
  Date/Author: 2026-04-02 / Codex

- Decision: Keep the first OVH deployment as a build-on-server flow, but do not proceed until the server can complete `npm run build` successfully.
  Rationale: this is the simplest junior-friendly operational model. If the OVH box cannot build the site because of RAM limits, the deployment approach must be reconsidered before go-live.
  Date/Author: 2026-04-02 / Codex

## Outcomes & Retrospective

At the time this plan was written, no OVH deployment for ProjektBezKodu exists in the repository. The good news is that the application itself is already close to deployable: tests pass, the production build passes, and the app already has the correct `build` and `start` scripts.

The remaining work is operational hardening and documentation. The biggest gaps are not feature bugs inside the site; they are missing deployment assets and missing junior-oriented instructions. The highest-risk technical area is server build capacity because the app statically generates more than one thousand pages.

## Context and Orientation

This repository is a Next.js App Router application. The main application code lives in `app/`. Production commands live in `package.json`, where `npm run build` executes `next build` and `npm run start` executes `next start`.

This repository is content-heavy. Before every production build, `prebuild` runs `npm run content:format` and `npm run content:lint`. In plain language, that means the build process first reformats markdown frontmatter and then validates it. Because `content:format` can change files, a build run from a Git checkout can leave the checkout dirty unless the formatting changes are already committed.

The app already contains server-side newsletter routes in `app/api/newsletter/*`. Those routes depend on Listmonk, which is an external newsletter service. The configuration is loaded in `app/lib/newsletter/config.ts` from these environment variables:

`LISTMONK_BASE_URL`, `LISTMONK_API_TOKEN`, `LISTMONK_LIST_ID`, and `LISTMONK_LIST_UUID` are required for newsletter actions. `LISTMONK_TIMEOUT_MS`, `LISTMONK_RETRY_ATTEMPTS`, `LISTMONK_RETRY_MIN_DELAY_MS`, and `LISTMONK_RETRY_MAX_DELAY_MS` are optional retry and timeout controls.

The public site origin is used in two different ways:

- `NEXT_PUBLIC_SITE_URL` is used by `app/lib/url/SiteUrlFactory.ts` to build absolute public URLs. Because it starts with `NEXT_PUBLIC_`, Next.js will freeze it into browser bundles at build time.
- `CANONICAL_HOST` is used by `app/lib/url/CanonicalHostRedirectManager.ts` to decide whether `www` should redirect to the apex host or the other way around.

This matters on OVH because the reverse proxy must preserve the real public host. A reverse proxy is the public web server that accepts requests on ports `80` and `443` and forwards them to the private Next.js process on `127.0.0.1:<port>`. In this repository, that reverse proxy will be Nginx. Nginx must forward `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`, and `X-Forwarded-For` so that canonical redirects and newsletter redirects keep the production domain.

`systemd` is Ubuntu's service manager. It is the part of the server that keeps a process running after reboot and restarts it if it crashes. On OVH, the plan is to run `npm run start` under one `systemd` unit called `projektbezkodu.service`.

No database integration or writable upload directory was discovered during this review. Based on the inspected files, the app is a statically generated and server-rendered content site with an external newsletter dependency, not a database-backed application. That keeps rollback simple because there are no schema migrations in scope for this deployment.

The current documentation state is mixed: `README.md` explains local development and Railway-related deployment details, `docs/ovh-cloud.md` defines a good generic OVH pattern and explicitly says a repo-specific runbook should exist, and `docs/ovh-server-details.md` provides useful shared server facts but is not yet a ProjektBezKodu-specific deployment runbook.

## Plan of Work

Milestone 1 is repository readiness. Add the minimum files and documentation that make OVH deployment understandable without chat context. Create `.nvmrc` so the runtime is pinned. Create `.env.example` with every production variable used by this app, marking required versus optional values in comments or nearby docs. Add `app/api/health/route.ts` and tests so the server can be smoke-tested locally and through `systemd`. Add checked-in example files `ops/systemd/projektbezkodu.service.example` and `ops/nginx/projektbezkodu.conf.example`. Add a repo-specific runbook at `docs/Implementation/Runbook_OVH_Production_Deployment_Junior.md` that uses the same names and paths as those examples.

Milestone 2 is deployment preflight. Gather the real OVH facts that are still unknown today: the real SSH command, the real domain set, whether the server already hosts other sites, the chosen free local port, and the production Listmonk values. Verify that DNS will point to the OVH server and that the server has enough RAM to complete `npm run build`. If the server cannot finish a clean build, stop here and redesign the deploy flow instead of improvising under pressure.

Milestone 3 is server installation. On the OVH machine, install the shared packages, create the dedicated Unix user `projektbezkodu`, create `/srv/www/projektbezkodu/app`, `/srv/www/projektbezkodu/shared`, and `/var/log/projektbezkodu`, clone the repository, create `/srv/www/projektbezkodu/shared/.env.production`, symlink it to `.env.production` inside the checkout, install the pinned Node version with `nvm`, run `npm ci`, run tests, and run `npm run build`.

Milestone 4 is service wiring. Create `/etc/systemd/system/projektbezkodu.service` from the checked-in example, set `Environment=PORT=<chosen-port>`, point `EnvironmentFile=` at `/srv/www/projektbezkodu/shared/.env.production`, and start the service. Before Nginx is configured, prove that `curl http://127.0.0.1:<chosen-port>` works and that `curl http://127.0.0.1:<chosen-port>/api/health` returns the expected JSON.

Milestone 5 is public traffic. Create `/etc/nginx/sites-available/projektbezkodu.conf` from the checked-in example, point `server_name` to the real domain and alias, proxy to `127.0.0.1:<chosen-port>`, and forward the headers required by this repository. Enable the site, reload Nginx, point DNS to the OVH server, verify plain HTTP, then request HTTPS certificates with Certbot. Only after the public domain works over HTTP should TLS be requested.

Milestone 6 is launch validation and operational notes. Validate the homepage, at least one article page, `/sitemap.xml`, `/robots.txt`, and the newsletter flow. Confirm logs are clean. Record the exact live values in the repo-specific runbook so the next junior developer does not need shell history or chat messages to repeat the deploy.

## Concrete Steps

All repository commands below run from:

    /home/marcel/src/projektbezkodu

All Node commands in this repository must be prefixed with:

    source ~/.nvm/nvm.sh &&

### 1. Add repository deployment prerequisites

Create or update these files in the repository: `.nvmrc`, `.env.example`, `app/api/health/route.ts`, `app/api/health/route.test.ts` or the equivalent test file location used by the repo, `ops/systemd/projektbezkodu.service.example`, `ops/nginx/projektbezkodu.conf.example`, `docs/Implementation/Runbook_OVH_Production_Deployment_Junior.md`, and `README.md` if it is missing the OVH deployment path.

Recommended commands while implementing this milestone:

    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run build

The health route should be intentionally simple for first deployment. Recommended behavior:

    GET /api/health
    -> HTTP 200
    -> Content-Type: application/json
    -> Body: {"ok":true}

Do not make the first health endpoint depend on Listmonk or any third-party service. It should prove that Next.js is up, not that every external dependency is perfect.

### 2. Build the production environment template

Put every production variable the app uses into `.env.example`. Based on the inspected code, include at minimum:

    NEXT_PUBLIC_SITE_URL=https://projektbezkodu.pl
    CANONICAL_HOST=projektbezkodu.pl
    LISTMONK_BASE_URL=
    LISTMONK_API_TOKEN=
    LISTMONK_LIST_ID=
    LISTMONK_LIST_UUID=
    LISTMONK_TIMEOUT_MS=10000
    LISTMONK_RETRY_ATTEMPTS=2
    LISTMONK_RETRY_MIN_DELAY_MS=250
    LISTMONK_RETRY_MAX_DELAY_MS=2000
    NEXT_PUBLIC_HOMEPAGE_HERO_VARIANT=

Mark `NEXT_PUBLIC_HOMEPAGE_HERO_VARIANT` as optional. It is read in `app/(marketing)/homepage/HeroSection.tsx` and falls back to the default variant when unset.

Be explicit in the runbook:

- `NEXT_PUBLIC_SITE_URL` must be the real public origin and must be correct before `npm run build`.
- `CANONICAL_HOST` controls apex-versus-`www` canonical redirects.
- `LISTMONK_*` values are required if newsletter subscribe, unsubscribe, resend, and preferences flows are expected to work in production.

### 3. Pin and verify the runtime

After `.nvmrc` exists, verify the chosen version locally:

    source ~/.nvm/nvm.sh && nvm install
    source ~/.nvm/nvm.sh && nvm use
    source ~/.nvm/nvm.sh && node -v
    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run build

The current local evidence is:

    node -v
    -> v24.14.0

Do not treat that local version as the production contract. The repo needs its own pinned runtime in `.nvmrc`.

### 4. Gather OVH production inputs before touching the host

Collect and write into the runbook the production domain, alias domain, OVH SSH command, whether the server already hosts other sites, the chosen local app port, the deployment branch or commit, and the real Listmonk credentials and URL.

On the server, check whether the chosen port is free:

    ss -ltn | grep 3001

If that command prints nothing, `3001` is free. If it prints a listener, choose `3002` or the next free port and update every later step consistently.

### 5. Prepare the OVH server

Run these commands on the OVH Ubuntu host as an administrative user:

    sudo apt update
    sudo apt upgrade -y
    sudo apt install -y nginx git curl ufw build-essential python3-certbot-nginx
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full'
    sudo ufw enable
    sudo systemctl status nginx --no-pager
    sudo nginx -t

Create the dedicated project user and directories:

    sudo adduser --disabled-password --gecos "" projektbezkodu
    sudo mkdir -p /srv/www/projektbezkodu/app
    sudo mkdir -p /srv/www/projektbezkodu/shared
    sudo mkdir -p /var/log/projektbezkodu
    sudo chown -R projektbezkodu:projektbezkodu /srv/www/projektbezkodu
    sudo chown -R projektbezkodu:projektbezkodu /var/log/projektbezkodu

No writable upload directory is required initially because no upload subsystem was discovered in the repository review.

### 6. Put the repository on the server

Clone the repository as the project user:

    sudo -iu projektbezkodu
    cd /srv/www/projektbezkodu
    git clone <repo-url> app
    cd /srv/www/projektbezkodu/app

Create the production environment file outside the checkout and link it back:

    mkdir -p /srv/www/projektbezkodu/shared
    nano /srv/www/projektbezkodu/shared/.env.production
    ln -sfn /srv/www/projektbezkodu/shared/.env.production /srv/www/projektbezkodu/app/.env.production
    chmod 600 /srv/www/projektbezkodu/shared/.env.production

Install the pinned Node version and dependencies:

    source ~/.nvm/nvm.sh && nvm install
    source ~/.nvm/nvm.sh && nvm use
    source ~/.nvm/nvm.sh && npm ci
    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run build

If `npm run build` leaves the checkout dirty because of `content:format`, stop and compare `git diff`. The long-term fix should be committed in the repo rather than ignored forever on the server.

### 7. Smoke-test Next.js directly before using Nginx

From the server checkout:

    cd /srv/www/projektbezkodu/app
    source ~/.nvm/nvm.sh && PORT=3001 npm run start

In a second shell:

    curl -I http://127.0.0.1:3001
    curl http://127.0.0.1:3001/api/health

Expected result:

- the first command returns an HTTP response instead of timing out
- the second command returns JSON with `{"ok":true}`

Do not proceed to Nginx until this succeeds.

### 8. Create the systemd service

Create `/etc/systemd/system/projektbezkodu.service` using the checked-in example. The important fields should be:

    User=projektbezkodu
    WorkingDirectory=/srv/www/projektbezkodu/app
    Environment=NODE_ENV=production
    Environment=PORT=3001
    EnvironmentFile=/srv/www/projektbezkodu/shared/.env.production
    ExecStart=/bin/bash -lc 'source /home/projektbezkodu/.nvm/nvm.sh && exec npm run start'

Then enable and start it:

    sudo systemctl daemon-reload
    sudo systemctl enable projektbezkodu
    sudo systemctl start projektbezkodu
    sudo systemctl status projektbezkodu --no-pager
    curl -I http://127.0.0.1:3001
    curl http://127.0.0.1:3001/api/health

### 9. Create the Nginx site

Create `/etc/nginx/sites-available/projektbezkodu.conf` using the checked-in example. The example must include these proxy headers because this repository uses them:

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;

The proxy target must be:

    proxy_pass http://127.0.0.1:3001;

Enable and reload:

    sudo ln -s /etc/nginx/sites-available/projektbezkodu.conf /etc/nginx/sites-enabled/projektbezkodu.conf
    sudo nginx -t
    sudo systemctl reload nginx

### 10. Point DNS and add HTTPS

Point the real domain and alias to the OVH server IP. Then verify plain HTTP first:

    curl -I http://projektbezkodu.pl
    curl -I http://www.projektbezkodu.pl

Only after HTTP works should you request certificates:

    sudo certbot --nginx -d projektbezkodu.pl -d www.projektbezkodu.pl
    sudo certbot renew --dry-run

### 11. Final smoke tests

Run these checks after HTTPS is live:

    sudo systemctl status projektbezkodu --no-pager
    sudo journalctl -u projektbezkodu -n 100 --no-pager
    curl -I https://projektbezkodu.pl
    curl -I https://www.projektbezkodu.pl
    curl https://projektbezkodu.pl/api/health
    curl -I https://projektbezkodu.pl/sitemap.xml
    curl -I https://projektbezkodu.pl/robots.txt

Then open these pages in a browser:

homepage `/`, one article page under `/artykuly/...`, and newsletter page `/newsletter`.

If Listmonk is configured for launch, submit one test email and confirm that the confirmation or thank-you redirect uses the public domain and not `127.0.0.1`, `localhost`, or an internal port.

## Validation and Acceptance

Validation happens in two stages: repository validation and server validation.

Repository validation commands:

    cd /home/marcel/src/projektbezkodu
    source ~/.nvm/nvm.sh && npm test
    source ~/.nvm/nvm.sh && npm run build

Expected result:

- all tests pass
- the build completes
- the health route test passes after it is added
- the OVH runbook and example config files are committed together with the code changes

Server validation commands:

    sudo systemctl status projektbezkodu --no-pager
    sudo journalctl -u projektbezkodu -n 100 --no-pager
    curl -I http://127.0.0.1:3001
    curl http://127.0.0.1:3001/api/health
    curl -I https://projektbezkodu.pl
    curl -I https://www.projektbezkodu.pl
    curl -I https://projektbezkodu.pl/sitemap.xml
    curl -I https://projektbezkodu.pl/robots.txt

Acceptance is behavioral:

- `https://projektbezkodu.pl` returns a successful HTTP response and renders the public site.
- the `www` host redirects to the canonical host chosen in `CANONICAL_HOST`, or the apex redirects to `www` if that is the chosen canonical host.
- `https://projektbezkodu.pl/api/health` returns HTTP `200` with `{"ok":true}`.
- `sudo systemctl status projektbezkodu` reports `active (running)`.
- `curl http://127.0.0.1:3001/api/health` works even without Nginx, proving the Node process itself is healthy.
- at least one article page under `/artykuly/...` loads successfully in a browser.
- if newsletter is part of go-live, a real test submission completes without redirecting to an internal host.

Failure signals that mean the deployment is incomplete or wrong:

- `502 Bad Gateway` from Nginx
- redirects that contain `127.0.0.1`, `localhost`, or `:3001`
- `systemctl` showing crash loops
- missing `LISTMONK_*` values causing newsletter errors
- the server build being killed partway through static generation

## Idempotence and Recovery

Most server setup steps are safe to repeat:

- `apt install` is repeatable
- `mkdir -p` is repeatable
- `ln -sfn` is repeatable
- `systemctl daemon-reload`, `enable`, and `restart` are repeatable
- `certbot renew --dry-run` is repeatable

Safe recovery rules:

- If the app is not healthy on `127.0.0.1:<port>`, do not keep changing Nginx. Fix the Node service first.
- If Nginx serves the wrong site, run `sudo nginx -t` and inspect the enabled site files before retrying Certbot.
- If the build fails because of memory pressure, stop the deploy. Do not guess. Record the failure in this plan and redesign the build strategy before continuing.
- If a deployment of a new commit fails after the server already has a working release, roll back by checking out the previous known-good commit in `/srv/www/projektbezkodu/app`, rerunning `npm ci` if needed, rerunning `npm run build`, and restarting `projektbezkodu.service`.

This project review found no database migrations or local persistent app data. That means rollback should mainly be code rollback plus service restart, which is much safer than a database-backed deploy.

## Artifacts and Notes

Artifacts that should exist when this plan is complete:

`.nvmrc`, `.env.example`, `app/api/health/route.ts`, health-route tests, `ops/systemd/projektbezkodu.service.example`, `ops/nginx/projektbezkodu.conf.example`, and `docs/Implementation/Runbook_OVH_Production_Deployment_Junior.md`.

Useful evidence already collected while drafting this plan:

    source ~/.nvm/nvm.sh && npm test
    -> Test Files 31 passed (31)
    -> Tests 79 passed (79)

    source ~/.nvm/nvm.sh && npm run build
    -> build completed successfully
    -> 1067 static pages generated

    source ~/.nvm/nvm.sh && node -v
    -> v24.14.0

Non-blocking but important note:

- `npm run build` currently formats markdown as part of `prebuild`. Decide whether production deploys should allow that mutation or whether the repo should be kept formatting-clean before every deploy. A junior operator should not have to guess what to do with a dirty checkout on the server.

Plan change note: created on 2026-04-02 after repository inspection, local validation, Serena-assisted codebase review, and Context7 verification of the official Next.js self-hosting contract.

## Interfaces and Dependencies

External runtime dependencies:

- OVH Ubuntu server
- Nginx as the reverse proxy
- `systemd` as the process supervisor
- Certbot for HTTPS certificates
- Node.js pinned by `.nvmrc`
- npm using `package-lock.json`
- Listmonk if newsletter features are required in production

Repository interfaces and files that matter for this deploy:

- `package.json` provides `build` and `start`
- `next.config.ts` contains Next.js runtime config and rewrite rules
- `proxy.ts` normalizes malformed paths and canonicalizes hostnames
- `app/lib/url/CanonicalHostRedirectManager.ts` reads `CANONICAL_HOST` and `NEXT_PUBLIC_SITE_URL`
- `app/lib/url/SiteUrlFactory.ts` reads `NEXT_PUBLIC_SITE_URL`
- `app/api/newsletter/RequestOriginResolver.ts` reads forwarded proxy headers
- `app/lib/newsletter/config.ts` reads `LISTMONK_*`

Required environment variables at the end of the work:

- `NEXT_PUBLIC_SITE_URL`
- `CANONICAL_HOST`
- `LISTMONK_BASE_URL` if newsletter is enabled
- `LISTMONK_API_TOKEN` if newsletter is enabled
- `LISTMONK_LIST_ID` if newsletter is enabled
- `LISTMONK_LIST_UUID` if newsletter is enabled

Optional environment variables at the end of the work:

- `LISTMONK_TIMEOUT_MS`
- `LISTMONK_RETRY_ATTEMPTS`
- `LISTMONK_RETRY_MIN_DELAY_MS`
- `LISTMONK_RETRY_MAX_DELAY_MS`
- `NEXT_PUBLIC_HOMEPAGE_HERO_VARIANT`

Operational contracts that must exist at the end:

- `GET /api/health` returns HTTP `200` with a tiny JSON body
- `projektbezkodu.service` starts the app with `npm run start`
- Nginx proxies the real domain to `127.0.0.1:<port>`
- Nginx forwards `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`, and `X-Forwarded-For`
- the repo-specific OVH runbook contains the real live values for this app
