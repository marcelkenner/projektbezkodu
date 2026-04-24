# OVH server details for CafeBadge production

Last verified on 2026-04-02 by direct SSH inspection of the live host plus public DNS and HTTPS checks.

## Host identity

- Hostname: `ns3091977`
- Reverse DNS: `ns3091977.ip-145-239-69.eu`
- IPv4: `145.239.69.209`
- SSH entrypoint: `ssh -p 49152 marcelkenner@145.239.69.209`
- Operating system: `Ubuntu 24.04.4 LTS`
- Kernel: `6.8.0-106-generic`

## Runtime

- Node.js: `v20.20.0`
- npm: `10.8.2`
- nginx: `1.24.0 (Ubuntu)`
- app service: `cafebadge`
- app service status: `active`
- app user: `cafebadge`
- app working directory: `/srv/cafebadge/app`

## Paths

- app code: `/srv/cafebadge/app`
- shared production env file: `/srv/cafebadge/shared/.env.production`
- public uploads: `/var/lib/cafebadge/uploads`
- private uploads: `/var/lib/cafebadge/private_uploads`
- app logs: `/var/log/cafebadge`
- systemd unit: `/etc/systemd/system/cafebadge.service`

## Network and health

- SSH listens on `49152`
- nginx listens on `80`
- app listens on `127.0.0.1:3000`
- local health endpoint `http://127.0.0.1:3000/api/v1/health` returns `ok` with `database=ok` and `storage=ok`

## Public domain state

- `cafebadge.com` resolves to `145.239.69.209`
- `www.cafebadge.com` resolves to `145.239.69.209`
- `https://cafebadge.com` responds and redirects to `/pl`
- `https://www.cafebadge.com` responds and redirects to `/pl`
- HTTPS is active and served by `nginx/1.24.0 (Ubuntu)` in front of Next.js

## Operational note

- `marcelkenner` uses passworded `sudo`, not passwordless `sudo`

## Canonical repo doc

- The source-of-truth deployment document for this project is `docs/Implementation/Runbook_OVH_Production_Deployment_Junior.md`
- The generic multi-project OVH deployment pattern lives in `docs/ovhcloud-deploy.md`
