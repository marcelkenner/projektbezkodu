# ProjektBezKodu OVH Production Runbook

Last verified on 2026-04-03 from the local workstation plus direct SSH inspection of the live OVH host.

This runbook is the source of truth for deploying ProjektBezKodu on the shared OVH host without colliding with the already deployed CafeBadge application.

Follow `docs/plans.md` conventions when updating this file: keep it self-contained, record live values explicitly, and update it whenever the deployment process changes.

## Live target

- Domain: `projektbezkodu.pl`
- Alias domain: `www.projektbezkodu.pl`
- OVH IPv4: `145.239.69.209`
- SSH entrypoint: `ssh -p 49152 marcelkenner@145.239.69.209`
- App user: `projektbezkodu`
- App root: `/srv/www/projektbezkodu/app`
- Shared env file: `/srv/www/projektbezkodu/shared/.env.production`
- App log directory: `/var/log/projektbezkodu`
- Local app port: `3001`
- systemd unit: `projektbezkodu.service`
- Nginx site: `/etc/nginx/sites-available/projektbezkodu.conf`
- Deployed GitHub commit: `703effd7`
- HTTPS: active via Certbot on `projektbezkodu.pl` and `www.projektbezkodu.pl`
- Current certificate expiry: `2026-07-01`

These values intentionally do not reuse CafeBadge paths, users, or ports.

## Required repository files

The deployment expects these checked-in files to exist and stay aligned with the live host:

- `.nvmrc`
- `.env.example`
- `app/api/health/route.ts`
- `ops/systemd/projektbezkodu.service.example`
- `ops/nginx/projektbezkodu.conf.example`

## Environment file

Create `/srv/www/projektbezkodu/shared/.env.production` from `.env.example`, then symlink it into the app checkout as `/srv/www/projektbezkodu/app/.env.production`.

Required for the public site:

- `NEXT_PUBLIC_SITE_URL=https://projektbezkodu.pl`
- `CANONICAL_HOST=projektbezkodu.pl`

Required only if newsletter flows must work:

- `LISTMONK_BASE_URL`
- `LISTMONK_API_TOKEN`
- `LISTMONK_LIST_ID`
- `LISTMONK_LIST_UUID`

The current live host also keeps:

- `LISTMONK_TIMEOUT_MS=10000`
- `LISTMONK_RETRY_ATTEMPTS=2`
- `LISTMONK_RETRY_MIN_DELAY_MS=250`
- `LISTMONK_RETRY_MAX_DELAY_MS=2000`

## Deployment steps

The repository policy says Node commands should be prefixed with `source ~/.nvm/nvm.sh &&` during normal development. The live OVH host currently has matching system `node` and `npm` installed globally, and the deployed `projektbezkodu.service` uses `/usr/bin/npm`. Before deploying, verify the host Node version matches `.nvmrc`.

1. Ensure the dedicated Unix user and directories exist:

       sudo adduser --system --group --home /srv/www/projektbezkodu projektbezkodu
       sudo mkdir -p /srv/www/projektbezkodu/app /srv/www/projektbezkodu/shared /var/log/projektbezkodu
       sudo chown -R projektbezkodu:projektbezkodu /srv/www/projektbezkodu /var/log/projektbezkodu

2. Push the intended deployment commit to GitHub from the local workstation, then clone that repository into a temporary checkout owned by the SSH user:

       rm -rf ~/projektbezkodu-deploy
       git clone git@github.com:marcelkenner/projektbezkodu.git ~/projektbezkodu-deploy
       cd ~/projektbezkodu-deploy
       git checkout <deployment-commit-sha>

3. Sync that checkout into `/srv/www/projektbezkodu/app`, excluding generated directories:

       sudo rsync -a --delete --exclude '.git' --exclude 'node_modules' --exclude '.next' ~/projektbezkodu-deploy/ /srv/www/projektbezkodu/app/
       sudo chown -R projektbezkodu:projektbezkodu /srv/www/projektbezkodu/app

4. Create the shared production env file and symlink it into the app checkout before running the build:

       sudo mkdir -p /srv/www/projektbezkodu/shared
       sudo cp ~/projektbezkodu.env.production /srv/www/projektbezkodu/shared/.env.production
       sudo chown -R projektbezkodu:projektbezkodu /srv/www/projektbezkodu/shared
       sudo ln -sfn /srv/www/projektbezkodu/shared/.env.production /srv/www/projektbezkodu/app/.env.production

5. Install dependencies as the `projektbezkodu` Unix user:

       sudo -u projektbezkodu bash -lc 'cd /srv/www/projektbezkodu/app && npm ci'

6. Validate the checkout before enabling the service:

       sudo -u projektbezkodu bash -lc 'cd /srv/www/projektbezkodu/app && CI=1 npm run test'
       sudo -u projektbezkodu bash -lc 'cd /srv/www/projektbezkodu/app && CI=1 npm run build'

7. Install the service file from `ops/systemd/projektbezkodu.service.example`, then start and enable it:

       sudo cp /srv/www/projektbezkodu/app/ops/systemd/projektbezkodu.service.example /etc/systemd/system/projektbezkodu.service
       sudo systemctl daemon-reload
        sudo systemctl start projektbezkodu.service
       sudo systemctl enable projektbezkodu.service

8. Verify the private app port before touching Nginx:

       curl -I http://127.0.0.1:3001
       curl http://127.0.0.1:3001/api/health

9. Install the isolated Nginx site from `ops/nginx/projektbezkodu.conf.example`, enable it, and reload Nginx:

       sudo cp /srv/www/projektbezkodu/app/ops/nginx/projektbezkodu.conf.example /etc/nginx/sites-available/projektbezkodu.conf
       sudo ln -sfn /etc/nginx/sites-available/projektbezkodu.conf /etc/nginx/sites-enabled/projektbezkodu.conf
       sudo nginx -t
       sudo systemctl reload nginx

10. After DNS for `projektbezkodu.pl` and `www.projektbezkodu.pl` points to `145.239.69.209`, request TLS:

       sudo certbot --nginx -d projektbezkodu.pl -d www.projektbezkodu.pl --non-interactive --agree-tos -m kontakt@projektbezkodu.pl --redirect

## Validation

Private app validation:

    curl -I http://127.0.0.1:3001
    curl http://127.0.0.1:3001/api/health

Reverse-proxy validation on the host before external DNS checks:

    curl -I -H 'Host: projektbezkodu.pl' http://127.0.0.1
    curl -I -H 'Host: www.projektbezkodu.pl' http://127.0.0.1
    curl -H 'Host: projektbezkodu.pl' http://127.0.0.1/api/health

Public validation:

    curl -I http://projektbezkodu.pl
    curl -I http://www.projektbezkodu.pl
    curl -I https://projektbezkodu.pl
    curl -I https://www.projektbezkodu.pl
    curl https://projektbezkodu.pl/api/health
    curl -I https://projektbezkodu.pl/sitemap.xml
    curl -I https://projektbezkodu.pl/robots.txt

Success means:

- `projektbezkodu.service` is active.
- `projektbezkodu.service` is enabled.
- `curl http://127.0.0.1:3001/api/health` returns `{"ok":true}`.
- `curl -I -H 'Host: projektbezkodu.pl' http://127.0.0.1` returns HTTP `200`.
- `curl -I -H 'Host: www.projektbezkodu.pl' http://127.0.0.1` returns HTTP `308`.
- `curl -I https://projektbezkodu.pl` returns HTTP `200`.
- `www.projektbezkodu.pl` redirects to the canonical apex host.
- CafeBadge continues to serve from its existing domain and port unchanged.

## Notes

- Do not reuse CafeBadge service names, directories, Unix users, or ports.
- Use GitHub as the source of truth for the server checkout. Push the deployment commit before cloning on the host.
- The current live deployment commit is `703effd7`; update the runbook whenever a later deployment changes the live SHA.
- The reverse proxy must forward `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`, and `X-Forwarded-For` because canonical redirects and newsletter redirects depend on them.
- If the app fails on `127.0.0.1:3001`, fix the systemd service or build before changing Nginx.
