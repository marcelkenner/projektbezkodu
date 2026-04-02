# ProjektBezKodu OVH Production Runbook

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

These values intentionally do not reuse CafeBadge paths, users, or ports.

## Required repository files

The deployment expects these checked-in files to exist and stay aligned with the live host:

- `.nvmrc`
- `.env.example`
- `app/api/health/route.ts`
- `ops/systemd/projektbezkodu.service.example`
- `ops/nginx/projektbezkodu.conf.example`

## Environment file

Create `/srv/www/projektbezkodu/shared/.env.production` from `.env.example`.

Required for the public site:

- `NEXT_PUBLIC_SITE_URL=https://projektbezkodu.pl`
- `CANONICAL_HOST=projektbezkodu.pl`

Required only if newsletter flows must work:

- `LISTMONK_BASE_URL`
- `LISTMONK_API_TOKEN`
- `LISTMONK_LIST_ID`
- `LISTMONK_LIST_UUID`

## Deployment steps

Run all repository commands with `source ~/.nvm/nvm.sh &&`.

1. Ensure the dedicated Unix user and directories exist:

       sudo adduser --system --group --home /srv/www/projektbezkodu projektbezkodu
       sudo mkdir -p /srv/www/projektbezkodu/app /srv/www/projektbezkodu/shared /var/log/projektbezkodu
       sudo chown -R projektbezkodu:projektbezkodu /srv/www/projektbezkodu /var/log/projektbezkodu

2. Clone the repository from GitHub into a temporary checkout owned by the SSH user, then sync it into `/srv/www/projektbezkodu/app`:

       rm -rf ~/projektbezkodu-deploy
       git clone git@github.com:marcelkenner/projektbezkodu.git ~/projektbezkodu-deploy
       rsync -a --delete --exclude '.git' --exclude 'node_modules' --exclude '.next' ~/projektbezkodu-deploy/ /srv/www/projektbezkodu/app/
       sudo chown -R projektbezkodu:projektbezkodu /srv/www/projektbezkodu/app

3. Install the pinned Node version from `.nvmrc`, then install dependencies and build:

       source ~/.nvm/nvm.sh && nvm install
       cd /srv/www/projektbezkodu/app
       source ~/.nvm/nvm.sh && npm ci
       source ~/.nvm/nvm.sh && npm run test
       source ~/.nvm/nvm.sh && npm run build

4. Install the service file from `ops/systemd/projektbezkodu.service.example`, then enable and start it:

       sudo cp ops/systemd/projektbezkodu.service.example /etc/systemd/system/projektbezkodu.service
       sudo systemctl daemon-reload
       sudo systemctl enable --now projektbezkodu.service

5. Verify the private app port before touching Nginx:

       curl -I http://127.0.0.1:3001
       curl http://127.0.0.1:3001/api/health

6. Install the isolated Nginx site from `ops/nginx/projektbezkodu.conf.example`, enable it, and reload Nginx:

       sudo cp ops/nginx/projektbezkodu.conf.example /etc/nginx/sites-available/projektbezkodu.conf
       sudo ln -s /etc/nginx/sites-available/projektbezkodu.conf /etc/nginx/sites-enabled/projektbezkodu.conf
       sudo nginx -t
       sudo systemctl reload nginx

7. After DNS for `projektbezkodu.pl` and `www.projektbezkodu.pl` points to `145.239.69.209`, request TLS:

       sudo certbot --nginx -d projektbezkodu.pl -d www.projektbezkodu.pl

## Validation

Private app validation:

    curl -I http://127.0.0.1:3001
    curl http://127.0.0.1:3001/api/health

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
- `curl http://127.0.0.1:3001/api/health` returns `{"ok":true}`.
- `www.projektbezkodu.pl` redirects to the canonical apex host.
- CafeBadge continues to serve from its existing domain and port unchanged.

## Notes

- Do not reuse CafeBadge service names, directories, Unix users, or ports.
- Use GitHub as the source of truth for the server checkout. Push the deployment commit before cloning on the host.
- The reverse proxy must forward `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`, and `X-Forwarded-For` because canonical redirects and newsletter redirects depend on them.
- If the app fails on `127.0.0.1:3001`, fix the systemd service or build before changing Nginx.
