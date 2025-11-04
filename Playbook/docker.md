Here are **production‑ready Dockerfiles** for all three apps—**Django API**, **Strapi CMS (v5)**, and **Next.js (Tailwind v4) frontend**—plus minimal **.dockerignore** files and an optional **Django entrypoint**. They follow the same ports as your ECS services (Django `:8000`, Strapi `:1337`, Next `:3000`). Each image runs as a non‑root user and includes `curl` so the ALB health checks in your Terraform module work.

> Do not bake secrets (DB URLs, keys) into images. Pass them via ECS task secrets (from Secrets Manager) as designed in your Terraform.
> 

---

## 1) Django API

**apps/backend-django/Dockerfile**

```docker
# apps/backend-django/Dockerfile
# Purpose: Run Django + Gunicorn on port 8000 in production
# Base: Debian slim with Python 3.12

FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

# System deps: curl for healthchecks, tini for signal handling, common libs
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl tini ca-certificates \
      libjpeg62-turbo zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /usr/sbin/nologin django
WORKDIR /app

# Install Python deps first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code
COPY --chown=django:django . .

# Optional entrypoint to run migrations/collectstatic if desired
COPY --chown=django:django entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER django

EXPOSE 8000

# Container-level healthcheck (ALB also checks /healthz/)
HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/healthz/" || exit 1

# Tini is PID 1 to forward signals cleanly
ENTRYPOINT ["/usr/bin/tini","-g","--","/app/entrypoint.sh"]

# Gunicorn defaults; tune workers with WEB_CONCURRENCY env (or use GUNICORN_CMD_ARGS)
CMD ["gunicorn","project.wsgi:application","--bind","0.0.0.0:8000","--workers","3","--timeout","60"]

```

**apps/backend-django/entrypoint.sh**

```bash
#!/usr/bin/env sh
set -e

# Optional automation; prefer ECS one-off task for real prod migrations.
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo "[entrypoint] Running Django migrations..."
  python manage.py migrate --noinput
fi

if [ "${COLLECTSTATIC}" = "true" ]; then
  echo "[entrypoint] Collecting static files..."
  python manage.py collectstatic --noinput
fi

exec "$@"

```

**apps/backend-django/.dockerignore**

```
# apps/backend-django/.dockerignore
__pycache__/
*.py[cod]
*.pyo
*.pyd
.env*
.vscode
.idea
.git
.gitignore
Dockerfile*
.dockerignore
staticfiles/
media/

```

---

## 2) Strapi CMS (v5)

**apps/cms-strapi/Dockerfile**

```docker
# apps/cms-strapi/Dockerfile
# Purpose: Build and run Strapi v5 in production on port 1337
# Base: Node 22 Alpine (small), builds admin UI during image build

# -------- Dependencies stage --------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Prefer corepack-managed Yarn; if you use npm or pnpm, adjust accordingly
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# -------- Builder stage --------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build Strapi admin (does not require DB connection)
ENV NODE_ENV=production
RUN yarn build

# -------- Runner stage --------
FROM node:22-alpine AS runner
RUN apk add --no-cache curl
WORKDIR /app
ENV NODE_ENV=production \
    PORT=1337
# Copy only what's needed to run
COPY --from=builder /app ./
# Ensure writable dirs for cache/tmp if used
RUN mkdir -p .cache .tmp && chown -R node:node /app
USER node

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/_health" || exit 1

# Strapi start
CMD ["yarn","start"]

```

**apps/cms-strapi/.dockerignore**

```
# apps/cms-strapi/.dockerignore
node_modules
.tmp
.cache
build
dist
.env*
.vscode
.idea
.git
.gitignore
Dockerfile*
.dockerignore

```

> Environment variables at runtime (ECS secrets):
> 
> 
> `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `DATABASE_URL`, `AWS_REGION`, `S3_BUCKET` (for the S3 upload provider).
> 

---

## 3) Next.js + Tailwind v4 Frontend

> You’re hosting the frontend with Amplify Hosting (SSR), which builds from your repo (no Dockerfile needed for Amplify). This Dockerfile is still useful for local testing, previews, or if you ever deploy the frontend as a container elsewhere.
> 

**apps/frontend-next/Dockerfile**

```docker
# apps/frontend-next/Dockerfile
# Purpose: Production Next.js container (SSR) on port 3000 using standalone output
# Base: Node 22 Alpine

# -------- Dependencies stage --------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Use npm by default; switch to yarn/pnpm if that's your standard
COPY package.json package-lock.json ./
RUN npm ci

# -------- Builder stage --------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Tailwind v4 is CSS-first; ensure postcss config & globals.css are in repo
# Produce standalone server
RUN npm run build

# -------- Runner stage --------
FROM node:22-alpine AS runner
RUN apk add --no-cache curl
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# Use a minimal runtime by copying standalone server + static assets + public
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/" || exit 1

# server.js is provided by Next in the standalone output
CMD ["node","server.js"]

```

**apps/frontend-next/.dockerignore**

```
# apps/frontend-next/.dockerignore
node_modules
.next
dist
npm-debug.log
.env*
.vscode
.idea
.git
.gitignore
Dockerfile*
.dockerignore

```

**apps/frontend-next/next.config.mjs** (required for standalone output)

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Add any headers/rewrites you need for API/CMS
  // async rewrites() {
  //   return [{ source: '/go/:slug', destination: '/api/redirect/:slug' }];
  // },
};
export default nextConfig;

```

---

## Build & run locally (sanity checks)

```bash
# Django
docker build -t local/django:dev apps/backend-django
docker run --rm -p 8000:8000 \
  -e SECRET_KEY='dev' \
  -e ALLOWED_HOSTS='localhost,127.0.0.1' \
  -e DATABASE_URL='postgresql://user:pass@host:5432/db?sslmode=disable' \
  local/django:dev

# Strapi
docker build -t local/strapi:dev apps/cms-strapi
docker run --rm -p 1337:1337 \
  -e APP_KEYS='k1,k2,k3,k4' \
  -e API_TOKEN_SALT='token' \
  -e ADMIN_JWT_SECRET='secret' \
  -e JWT_SECRET='secret' \
  -e DATABASE_URL='postgresql://user:pass@host:5432/db?sslmode=disable' \
  local/strapi:dev

# Next (standalone)
docker build -t local/next:dev apps/frontend-next
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE='http://localhost:8000' \
  -e NEXT_PUBLIC_CMS_BASE='http://localhost:1337' \
  local/next:dev

```

---

## Notes that align with your Terraform/ECS setup

- **Health checks:** Your ECS module uses an ALB health check hitting `/_health` (Strapi) and `/healthz/` (Django). These Docker images ship with `curl` so those checks succeed.
- **Non‑root users:** Both Node and Django containers drop privileges (`USER node` / `USER django`).
- **Static/media:** Django & Strapi should point at S3 in prod; don’t write to the container filesystem.
- **Migrations:** Prefer ECS one‑off tasks. The Django `entrypoint.sh` option is there for convenience if you want to flip `RUN_MIGRATIONS=true` during a deploy.

If you want, I can also add **multi‑arch** builds (AMD64/ARM64) and a **GitHub Actions** workflow that builds and pushes these to your ECR repos using buildx and OIDC—wired to the module names you already have.