# Generic OVHcloud Multi-Site Deployment Guide

Date: 2026-04-02

This guide defines a general deployment pattern for running multiple web projects on one OVHcloud server.

For the real CafeBadge production environment, use `docs/Implementation/Runbook_OVH_Production_Deployment_Junior.md`. That runbook is intentionally repo-specific and contains the live server facts for this application. This file is the reusable hosting pattern.

## 1. What This Guide Is For

Use this guide when one OVH server will host more than one website.

The target shape is:

- one Ubuntu server,
- one public Nginx instance,
- one `systemd` service per project,
- one unique local port per project,
- one Nginx site config per domain set,
- one TLS certificate per domain set,
- and isolated Unix users, environment files, logs, and writable storage per project.

Do not treat a shared OVH host like a single-app machine. The important rule is isolation per project, not one giant shared deployment directory.

## 2. Recommended Server Contract

Use a short slug for each project, for example `cafebadge`, `marketing-site`, or `shop`.

For each project `<project>`, use this layout:

- app checkout: `/srv/www/<project>/app`
- shared config: `/srv/www/<project>/shared/.env.production`
- optional writable app data: `/var/lib/<project>`
- logs: `/var/log/<project>`
- Unix user: `<project>`
- `systemd` unit: `/etc/systemd/system/<project>.service`
- Nginx site: `/etc/nginx/sites-available/<project>.conf`
- enabled site symlink: `/etc/nginx/sites-enabled/<project>.conf`
- unique local port: `127.0.0.1:<port>`

Recommended port allocation:

- first project: `3001`
- second project: `3002`
- third project: `3003`

Continue upward and keep a simple inventory in your operator notes. Never let two services bind the same local port.

## 3. One-Time Server Bootstrap

Provision Ubuntu on the OVH server, then connect over SSH with your hardened admin account.

Install the shared server packages once:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx git curl ufw build-essential
```

If you will host Node.js projects, install the Node runtime required by each project. The safest rule is to follow each repository's pinned version, such as `.nvmrc`, instead of assuming one global version will fit every app.

Enable the host firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Verify the baseline:

```bash
sudo systemctl status nginx --no-pager
sudo nginx -t
ss -ltn
```

Expected result:

- SSH is reachable,
- Nginx is installed,
- port `80` is available for Nginx,
- and no application service is yet bound to your future project ports.

## 4. Per-Project Deployment Inputs

Before deploying a project, gather these values:

- project slug, for example `<project>`
- primary domain, for example `example.com`
- optional aliases, for example `www.example.com`
- unique local port, for example `3002`
- Git branch or commit to deploy
- required production environment variables
- whether the app needs writable storage outside the Git checkout

If any of these are unknown, stop and resolve them before editing the server.

### What the repository itself must contain

If you want to repeat this deployment shape in another repository, that repository must include enough information that a junior developer does not need to guess.

At minimum, the repo should contain:

- a correct `package.json` with the real production commands
- a pinned runtime version such as `.nvmrc`
- a complete `.env.example` with placeholders, not secrets
- one environment-variable document that explains every required production variable
- one health-check endpoint such as `/api/health` or `/api/v1/health`
- one verification command such as `npm run verify` or an explicitly documented sequence of lint, test, and build commands
- one repo-specific deployment runbook with the real server facts for that app

For a Next.js app, Context7 confirms the standard production contract is:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

If the repo needs extra preparation before `next build`, keep that in the `build` script itself so the operator still runs one command and not a guessed sequence.

The repo-specific runbook should state all of these values explicitly:

- domain and any aliases
- server IP or hostname
- SSH command
- deploy path on the server
- `systemd` service name
- nginx site config path
- shared `.env.production` path
- local app port
- exact smoke-test steps after deployment

For environment variables, use this simple rule:

- variables prefixed with `NEXT_PUBLIC_` are exposed to browser code and are inlined during `next build`
- variables without `NEXT_PUBLIC_` stay server-side
- if a `NEXT_PUBLIC_` value changes, rebuild the app
- if a server-only value changes, restart at minimum, and rebuild too unless you are certain the app reads it only at runtime

If the app uses a database, background jobs, uploads, email delivery, or third-party APIs, the repo must document:

- the migration command
- the seed or fixture command, if one exists
- the writable directories, if any
- the external services that must be configured before the first production deploy

Optional but strongly recommended files:

- `ops/systemd/<project>.service.example`
- `ops/nginx/<project>.conf.example`
- a short `README.md` section named `Deploy` or `Production`

These files reduce operator mistakes because the server config can be compared against a checked-in example instead of remembered from chat or shell history.

## 5. Create the Project User and Directories

Create a dedicated Unix user and the standard directory structure:

```bash
sudo adduser --disabled-password --gecos "" <project>
sudo mkdir -p /srv/www/<project>/app
sudo mkdir -p /srv/www/<project>/shared
sudo mkdir -p /var/lib/<project>
sudo mkdir -p /var/log/<project>
sudo chown -R <project>:<project> /srv/www/<project>
sudo chown -R <project>:<project> /var/lib/<project>
sudo chown -R <project>:<project> /var/log/<project>
```

This keeps application ownership separate. Do not reuse the same Unix user across unrelated websites unless you deliberately want them to share file access and process permissions.

## 6. Put the Project Code on the Server

Clone the repository as the project user:

```bash
sudo -u <project> git clone <repo-url> /srv/www/<project>/app
```

If the repository already exists on the server, update it instead:

```bash
cd /srv/www/<project>/app
sudo -u <project> git fetch origin --tags
sudo -u <project> git status --short
sudo -u <project> git checkout <branch-or-commit>
```

Do not discard unexpected local changes until you know why they exist.

## 7. Create the Shared Production Environment File

Create the production environment file outside the checkout:

```bash
sudo -u <project> nano /srv/www/<project>/shared/.env.production
```

Protect it:

```bash
sudo chown <project>:<project> /srv/www/<project>/shared/.env.production
sudo chmod 600 /srv/www/<project>/shared/.env.production
```

Then expose it to the app at the conventional path:

```bash
sudo -u <project> ln -sfn /srv/www/<project>/shared/.env.production /srv/www/<project>/app/.env.production
```

That symlink keeps secrets out of the Git checkout while still letting frameworks such as Next.js find `.env.production` during build and runtime.

## 8. Install the Project Runtime and Dependencies

Run build steps as the project user from the app directory.

If the project uses `nvm`, follow the repo's pinned Node version:

```bash
sudo -iu <project>
cd /srv/www/<project>/app
source ~/.nvm/nvm.sh && nvm install
source ~/.nvm/nvm.sh && nvm use
source ~/.nvm/nvm.sh && npm ci
source ~/.nvm/nvm.sh && npm run build
exit
```

If the repository does not use `package-lock.json`, replace `npm ci` with the package-manager install command that the repo actually uses.

For non-Node projects, install and build according to that project's own runtime contract, but keep the same isolation model: separate user, separate directories, separate service, separate Nginx site, separate port.

## 9. Smoke Test the App Locally on Its Own Port

Before adding Nginx, prove that the app can run directly on the server.

For a Node app using `nvm`:

```bash
sudo -iu <project>
cd /srv/www/<project>/app
source ~/.nvm/nvm.sh && PORT=<port> npm run start
```

In a second shell, test the port:

```bash
curl -I http://127.0.0.1:<port>
```

Expected result: an HTTP response from the app on that exact local port.

Do not continue until this succeeds. If the app cannot run locally, Nginx will only hide the real problem behind a `502 Bad Gateway`.

## 10. Create the `systemd` Service

Create `/etc/systemd/system/<project>.service`:

```ini
[Unit]
Description=<project> web app
After=network.target

[Service]
Type=simple
User=<project>
WorkingDirectory=/srv/www/<project>/app
Environment=NODE_ENV=production
Environment=PORT=<port>
EnvironmentFile=/srv/www/<project>/shared/.env.production
ExecStart=/bin/bash -lc 'source /home/<project>/.nvm/nvm.sh && exec npm run start'
Restart=always
RestartSec=5
StandardOutput=append:/var/log/<project>/app.log
StandardError=append:/var/log/<project>/error.log

[Install]
WantedBy=multi-user.target
```

Then enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable <project>
sudo systemctl start <project>
sudo systemctl status <project> --no-pager
```

If the project does not use `nvm`, replace `ExecStart` with the real production start command for that repository.

If the project is not Node-based, keep the same service shape but swap in the correct runtime command, user, working directory, environment file, and port.

## 11. Verify the Service After `systemd` Takes Over

Re-test the app through the local port:

```bash
curl -I http://127.0.0.1:<port>
sudo journalctl -u <project> -n 100 --no-pager
```

Expected result:

- the local port responds,
- the service is `active (running)`,
- and the logs do not show startup crashes or missing environment variables.

## 12. Create the Nginx Site for This Project

Create `/etc/nginx/sites-available/<project>.conf`:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    access_log /var/log/nginx/<project>.access.log;
    error_log /var/log/nginx/<project>.error.log;

    location / {
        proxy_pass http://127.0.0.1:<port>;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~ /\.(?!well-known) {
        deny all;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/<project>.conf /etc/nginx/sites-enabled/<project>.conf
sudo nginx -t
sudo systemctl reload nginx
```

Do not remove other enabled site configs unless you intentionally want to stop those websites. A multi-site server must keep one Nginx config per project.

## 13. Point the Domain to the OVH Server

For each website, point the required DNS records to the OVH server IP.

Typical setup:

- `example.com` -> A -> `<server-ip>`
- `www.example.com` -> A -> `<server-ip>`

Wait until the domain resolves to the server, then verify plain HTTP first:

```bash
curl -I http://example.com
curl -I http://www.example.com
```

Do not request TLS certificates until HTTP works from the real public domain.

## 14. Add HTTPS for This Project

Install Certbot once on the server if it is not already present:

```bash
sudo apt install -y python3-certbot-nginx
```

Request the certificate for this website:

```bash
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

Repeat that process for each additional website. Certbot and Nginx can manage many separate domain sets on the same server as long as each site config and domain list is correct.

## 15. Add a Second or Third Website Safely

When deploying another website to the same OVH host:

1. choose a new project slug,
2. choose a new local port,
3. create a new Unix user and directories,
4. deploy that repository into its own `/srv/www/<project>/app`,
5. create its own `.env.production`,
6. create its own `systemd` unit,
7. create its own Nginx site config,
8. point its own domains,
9. request its own certificate,
10. verify that existing sites still respond after the Nginx reload.

The only shared layers should be Ubuntu, Nginx, the firewall, and Certbot. Everything else should be isolated per project.

## 16. Recommended Operations Checks

Useful server-wide commands:

```bash
sudo systemctl status nginx --no-pager
sudo systemctl list-units --type=service | grep -E 'loaded|running'
sudo nginx -t
ss -ltn | grep 127.0.0.1:
ls -1 /etc/nginx/sites-enabled
```

Useful per-project commands:

```bash
sudo systemctl status <project> --no-pager
sudo journalctl -u <project> -n 100 --no-pager
curl -I http://127.0.0.1:<port>
curl -I https://example.com
```

Use these checks after every deploy and after every server reboot.

## 17. Common Failure Cases

### Port collision

Symptom: the service fails to start or another app responds on the wrong domain.

Check:

```bash
ss -ltnp | grep <port>
```

Fix: give each project its own local port and update both `systemd` and Nginx to match.

### `502 Bad Gateway`

Symptom: Nginx is up but the website returns `502`.

Check:

```bash
sudo systemctl status <project> --no-pager
sudo journalctl -u <project> -n 100 --no-pager
curl -I http://127.0.0.1:<port>
```

Fix: get the app healthy on the local port before touching Nginx again.

### Wrong domain served

Symptom: `example-two.com` renders the content of `example-one.com`.

Check:

```bash
sudo nginx -t
grep -R "server_name" /etc/nginx/sites-available /etc/nginx/sites-enabled
```

Fix: confirm each Nginx site file has the right `server_name` values and points to the right local port.

### Certificate request fails

Symptom: Certbot cannot validate the domain.

Check:

```bash
curl -I http://example.com
dig +short example.com
```

Fix: make sure public DNS points to the OVH server and that the site answers on plain HTTP first.

### Runtime version mismatch

Symptom: build or startup fails after deploy.

Check:

```bash
sudo -iu <project>
cd /srv/www/<project>/app
source ~/.nvm/nvm.sh && node -v
```

Fix: install and use the runtime version that the repository actually pins.

## 18. CafeBadge Repo Note

This repository keeps the real CafeBadge production procedure in `docs/Implementation/Runbook_OVH_Production_Deployment_Junior.md`.

Use this generic guide when you need a reusable OVH server pattern for multiple websites. Use the CafeBadge runbook when you need the actual live commands, paths, domains, service names, and troubleshooting steps for this project.
