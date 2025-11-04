<#
.SYNOPSIS
  Bootstrap all files for the AWS affiliate stack (infra modules, site stack, Dockerfiles, app config).
.DESCRIPTION
  - Creates folder structure and writes all necessary files (Terraform modules, site stack, Dockerfiles, Next/Tailwind config, Strapi S3 plugin & health route, Django entrypoint).
  - Does not overwrite existing files unless -Force is supplied.
  - Optional: scaffolds Next.js, Django, and Strapi apps with -ScaffoldApps.
.PARAMETER SiteId
  Short name for the site (e.g., 'projektbezkodu').
.PARAMETER Env
  Environment (e.g., 'dev' or 'prod').
.PARAMETER ParentZone
  Public Route53 zone name that will host your records (e.g., 'example.com').
.PARAMETER AwsRegion
  AWS region for the stack (e.g., 'us-east-1').
.PARAMETER FrontendRepoUrl
  Git URL used by Amplify Hosting.
.PARAMETER FrontendBranch
  Branch name for Amplify builds (default 'main').
.PARAMETER AmplifyAccessToken
  Git provider access token for Amplify (read-only).
.PARAMETER ScaffoldApps
  If supplied, attempts to scaffold Next/Django/Strapi apps.
.PARAMETER Force
  Overwrite existing files.
#>

param(
  [string]$SiteId = "projektbezkodu",
  [string]$Env = "dev",
  [string]$ParentZone = "example.com",
  [string]$AwsRegion = "us-east-1",
  [string]$FrontendRepoUrl = "https://github.com/your-org/affiliate-stack",
  [string]$FrontendBranch = "main",
  [string]$AmplifyAccessToken = "ghp_xxx",
  [switch]$ScaffoldApps,
  [switch]$Force
)

# ---------- Helpers ----------
function New-Dir {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Write-Text {
  param(
    [Parameter(Mandatory)][string]$Path,
    [Parameter(Mandatory)][string]$Content,
    [switch]$ForceWrite
  )
  $dir = Split-Path -Parent $Path
  if ($dir) { New-Dir $dir }
  if ((Test-Path -LiteralPath $Path) -and -not $ForceWrite) {
    Write-Host "SKIP   $Path (exists; use -Force to overwrite)" -ForegroundColor Yellow
  } else {
    $Content | Set-Content -LiteralPath $Path -Encoding UTF8
    Write-Host "WRITE  $Path" -ForegroundColor Green
  }
}

function Exec {
  param([string]$Cmd, [string]$Cwd=".")
  Write-Host "RUN    $Cmd" -ForegroundColor Cyan
  Push-Location $Cwd
  try {
    & $Cmd
    if ($LASTEXITCODE -ne 0) {
      throw "Command failed: $Cmd (exit $LASTEXITCODE)"
    }
  } finally {
    Pop-Location
  }
}

# ---------- Derived names ----------
$DomainRoot = "$SiteId.$ParentZone"
$ApiHost = "api.$DomainRoot"
$CmsHost = "cms.$DomainRoot"
$SiteFolder = "infra/sites/$SiteId-$Env"

# ---------- Folders ----------
New-Dir "apps/frontend-next"
New-Dir "apps/backend-django"
New-Dir "apps/cms-strapi"
New-Dir "infra/modules"
New-Dir "infra/$SiteId-$Env"
New-Dir ".github/workflows"

# ---------- (Optional) Scaffold apps ----------
if ($ScaffoldApps) {
  # Next.js
  if (-not (Test-Path "apps/frontend-next/package.json")) {
    try {
      Exec "npm --version" "."
      Exec "npm create next-app@latest . -- --ts --eslint --app --src-dir=false --import-alias ""@/*""" "apps/frontend-next"
    } catch {
      Write-Warning "Next.js scaffolding failed. You can scaffold manually later."
    }
  } else {
    Write-Host "SKIP   Next.js app (already exists)" -ForegroundColor Yellow
  }

  # Django (venv + startproject)
  if (-not (Test-Path "apps/backend-django/manage.py")) {
    try {
      Exec "python --version" "."
      New-Dir "apps/backend-django/.venv"  # placeholder; actual venv optional
      Write-Text -Path "apps/backend-django/requirements.txt" -Content @'
Django>=5.1,<5.3
djangorestframework>=3.15
django-cors-headers>=4.4
django-storages>=1.14
boto3>=1.34
gunicorn>=22.0
psycopg[binary]>=3.1
dj-database-url>=2.2
'@ -ForceWrite:$Force
      # Try to create project skeleton
      try {
        Exec "python -m pip install --user django==5.1" "."
        Exec "python -m django --version" "."
        Exec "python -m django startproject project ." "apps/backend-django"
      } catch {
        Write-Warning "Django 'startproject' failed. Create it manually if needed."
      }
    } catch {
      Write-Warning "Python not available; skipping Django scaffolding."
    }
  } else {
    Write-Host "SKIP   Django project (already exists)" -ForegroundColor Yellow
  }

  # Strapi
  if (-not (Test-Path "apps/cms-strapi/package.json")) {
    try {
      Exec "node --version" "."
      # Prefer no-run; fall back to quickstart if not supported
      $cmds = @(
        "npm create strapi-app@latest . -- --no-run --quickstart",
        "npm create strapi-app@latest . -- --quickstart"
      )
      $ok = $false
      foreach ($c in $cmds) {
        try {
          Exec $c "apps/cms-strapi"
          $ok = $true
          break
        } catch {}
      }
      if (-not $ok) { Write-Warning "Strapi scaffolding failed. You can scaffold manually later."; }
    } catch {
      Write-Warning "Node not available; skipping Strapi scaffolding."
    }
  } else {
    Write-Host "SKIP   Strapi app (already exists)" -ForegroundColor Yellow
  }
}

# ---------- Frontend (Next/Tailwind) files ----------
Write-Text -Path "apps/frontend-next/postcss.config.mjs" -Content @'
const config = { plugins: { "@tailwindcss/postcss": {}, }, };
export default config;
'@ -ForceWrite:$Force

New-Dir "apps/frontend-next/app"
Write-Text -Path "apps/frontend-next/app/globals.css" -Content @'
@import "tailwindcss";

@theme {
  --color-brand: #0ea5e9;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}

html, body { @apply h-full bg-white text-gray-900; }
'@ -ForceWrite:$Force

Write-Text -Path "apps/frontend-next/next.config.mjs" -Content @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
};
export default nextConfig;
'@ -ForceWrite:$Force

Write-Text -Path "apps/frontend-next/app/page.tsx" -Content @"
export const revalidate = 300;
export default async function Home() {
  const base = process.env.NEXT_PUBLIC_CMS_BASE ?? '';
  let data: any = {};
  try {
    const res = await fetch(`${base}/api/posts?populate=*`, { next: { revalidate }});
    data = await res.json();
  } catch (e) {}
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-blue-600">Welcome to $DomainRoot</h1>
      <pre className="text-xs bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
"@ -ForceWrite:$Force

Write-Text -Path "apps/frontend-next/Dockerfile" -Content @'
# apps/frontend-next/Dockerfile
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
RUN apk add --no-cache curl
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD curl -fsS "http://127.0.0.1:${PORT}/" || exit 1
CMD ["node","server.js"]
'@ -ForceWrite:$Force

Write-Text -Path "apps/frontend-next/.dockerignore" -Content @'
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
'@ -ForceWrite:$Force

# ---------- Django files ----------
Write-Text -Path "apps/backend-django/requirements.txt" -Content @'
Django>=5.1,<5.3
djangorestframework>=3.15
django-cors-headers>=4.4
django-storages>=1.14
boto3>=1.34
gunicorn>=22.0
psycopg[binary]>=3.1
dj-database-url>=2.2
'@ -ForceWrite:$Force

# Health route & minimal urls if not present
if (-not (Test-Path "apps/backend-django/project/urls.py")) {
  New-Dir "apps/backend-django/project"
  Write-Text -Path "apps/backend-django/project/urls.py" -Content @'
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

def healthz(_): return JsonResponse({"ok": True})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz/", healthz),
]
'@ -ForceWrite:$Force
}

Write-Text -Path "apps/backend-django/entrypoint.sh" -Content @'
#!/usr/bin/env sh
set -e
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo "[entrypoint] Running Django migrations..."
  python manage.py migrate --noinput
fi
if [ "${COLLECTSTATIC}" = "true" ]; then
  echo "[entrypoint] Collecting static files..."
  python manage.py collectstatic --noinput
fi
exec "$@"
'@ -ForceWrite:$Force

Write-Text -Path "apps/backend-django/Dockerfile" -Content @'
# apps/backend-django/Dockerfile
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 PORT=8000
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl tini ca-certificates libjpeg62-turbo zlib1g \
    && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --shell /usr/sbin/nologin django
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=django:django . .
COPY --chown=django:django entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
USER django
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD curl -fsS "http://127.0.0.1:${PORT}/healthz/" || exit 1
ENTRYPOINT ["/usr/bin/tini","-g","--","/app/entrypoint.sh"]
CMD ["gunicorn","project.wsgi:application","--bind","0.0.0.0:8000","--workers","3","--timeout","60"]
'@ -ForceWrite:$Force

Write-Text -Path "apps/backend-django/.dockerignore" -Content @'
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
'@ -ForceWrite:$Force

# ---------- Strapi files ----------
Write-Text -Path "apps/cms-strapi/config/plugins.ts" -Content @'
export default ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        s3Options: { region: env('AWS_REGION', 'us-east-1') },
        params: { Bucket: env('S3_BUCKET') },
      },
    },
  },
});
'@ -ForceWrite:$Force

New-Dir "apps/cms-strapi/src/api/health/controllers"
New-Dir "apps/cms-strapi/src/api/health/routes"

Write-Text -Path "apps/cms-strapi/src/api/health/controllers/health.ts" -Content @'
export default {
  index(ctx) { ctx.body = { ok: true }; },
};
'@ -ForceWrite:$Force

Write-Text -Path "apps/cms-strapi/src/api/health/routes/health.ts" -Content @'
export default {
  routes: [
    { method: "GET", path: "/_health", handler: "health.index", config: { policies: [] } },
  ],
};
'@ -ForceWrite:$Force

Write-Text -Path "apps/cms-strapi/Dockerfile" -Content @'
# apps/cms-strapi/Dockerfile
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN yarn build

FROM node:22-alpine AS runner
RUN apk add --no-cache curl
WORKDIR /app
ENV NODE_ENV=production PORT=1337
COPY --from=builder /app ./
RUN mkdir -p .cache .tmp && chown -R node:node /app
USER node
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/_health" || exit 1
CMD ["yarn","start"]
'@ -ForceWrite:$Force

Write-Text -Path "apps/cms-strapi/.dockerignore" -Content @'
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
'@ -ForceWrite:$Force

# ---------- Terraform modules ----------
# modules/vpc
Write-Text -Path "infra/modules/vpc/variables.tf" -Content @'
variable "name" { type = string }
variable "az_count" { type = number, default = 2 }
variable "cidr_block" { type = string, default = "10.30.0.0/16" }
variable "create_nat_gateway" { type = bool, default = true }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/vpc/main.tf" -Content @'
resource "aws_vpc" "this" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = var.name }
}

data "aws_availability_zones" "available" {}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, var.az_count)
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.this.id
  tags = { Name = "${var.name}-igw" }
}

resource "aws_subnet" "public" {
  for_each = toset(local.azs)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.cidr_block, 4, index(local.azs, each.value))
  availability_zone       = each.value
  map_public_ip_on_launch = true
  tags = { Name = "${var.name}-public-${each.value}" }
}

resource "aws_subnet" "private" {
  for_each = toset(local.azs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.cidr_block, 4, 8 + index(local.azs, each.value))
  availability_zone = each.value
  tags = { Name = "${var.name}-private-${each.value}" }
}

resource "aws_eip" "nat" {
  count = var.create_nat_gateway ? 1 : 0
  domain = "vpc"
  tags = { Name = "${var.name}-nat-eip" }
}

resource "aws_nat_gateway" "nat" {
  count = var.create_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = element(values(aws_subnet.public)[*].id, 0)
  tags = { Name = "${var.name}-nat" }
  depends_on = [aws_internet_gateway.igw]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  tags = { Name = "${var.name}-public-rt" }
}
resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}
resource "aws_route_table_association" "public_assoc" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id
  tags = { Name = "${var.name}-private-rt" }
}
resource "aws_route" "private_nat" {
  count = var.create_nat_gateway ? 1 : 0
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat[0].id
}
resource "aws_route_table_association" "private_assoc" {
  for_each       = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private.id
}
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/vpc/outputs.tf" -Content @'
output "vpc_id"             { value = aws_vpc.this.id }
output "public_subnet_ids"  { value = [for s in aws_subnet.public  : s.id] }
output "private_subnet_ids" { value = [for s in aws_subnet.private : s.id] }
output "azs"                { value = local.azs }
'@ -ForceWrite:$Force

# modules/rds-postgres
Write-Text -Path "infra/modules/rds-postgres/variables.tf" -Content @'
variable "name"                { type = string }
variable "vpc_id"              { type = string }
variable "private_subnet_ids"  { type = list(string) }
variable "engine_version"      { type = string, default = "15.5" }
variable "multi_az"            { type = bool,   default = false }
variable "instance_class"      { type = string, default = "db.t4g.medium" }
variable "allocated_storage"   { type = number, default = 50 }
variable "deletion_protection" { type = bool,   default = false }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/rds-postgres/main.tf" -Content @'
resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-db-subnets"
  subnet_ids = var.private_subnet_ids
  tags = { Name = "${var.name}-db-subnets" }
}

resource "aws_db_parameter_group" "this" {
  name   = "${var.name}-pg"
  family = "postgres15"
  parameter { name = "rds.force_ssl" value = "1" }
}

resource "aws_security_group" "db" {
  name        = "${var.name}-db-sg"
  description = "RDS PostgreSQL security group"
  vpc_id      = var.vpc_id
}

resource "aws_db_instance" "this" {
  identifier              = "${var.name}-pg"
  engine                  = "postgres"
  engine_version          = var.engine_version
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  db_subnet_group_name    = aws_db_subnet_group.this.name
  parameter_group_name    = aws_db_parameter_group.this.name
  multi_az                = var.multi_az
  storage_encrypted       = true
  publicly_accessible     = false
  deletion_protection     = var.deletion_protection
  manage_master_user_password = true
  username                = "masteruser"
  vpc_security_group_ids  = [aws_security_group.db.id]
  skip_final_snapshot     = true
  backup_retention_period = 7
  auto_minor_version_upgrade = true
  tags = { Name = "${var.name}-rds" }
}
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/rds-postgres/outputs.tf" -Content @'
output "endpoint"    { value = aws_db_instance.this.address }
output "port"        { value = aws_db_instance.this.port }
output "sg_id"       { value = aws_security_group.db.id }
output "resource_id" { value = aws_db_instance.this.id }
output "arn"         { value = aws_db_instance.this.arn }
'@ -ForceWrite:$Force

# modules/secrets
Write-Text -Path "infra/modules/secrets/variables.tf" -Content @'
variable "app_secret_prefix"         { type = string }
variable "create_initial_versions"   { type = bool, default = false }
variable "initial_django_secret_key" { type = string, default = null, sensitive = true }
variable "initial_allowed_hosts"     { type = string, default = null, sensitive = true }
variable "initial_strapi_app_keys"   { type = string, default = null, sensitive = true }
variable "initial_strapi_api_salt"   { type = string, default = null, sensitive = true }
variable "initial_strapi_admin_jwt"  { type = string, default = null, sensitive = true }
variable "initial_strapi_jwt"        { type = string, default = null, sensitive = true }
variable "initial_django_db_url"     { type = string, default = null, sensitive = true }
variable "initial_strapi_db_url"     { type = string, default = null, sensitive = true }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/secrets/main.tf" -Content @'
resource "aws_secretsmanager_secret" "django_secret_key" { name = "${var.app_secret_prefix}django/SECRET_KEY" }
resource "aws_secretsmanager_secret" "django_allowed_hosts" { name = "${var.app_secret_prefix}django/ALLOWED_HOSTS" }
resource "aws_secretsmanager_secret" "django_db_url" { name = "${var.app_secret_prefix}django/DATABASE_URL" }

resource "aws_secretsmanager_secret" "strapi_app_keys" { name = "${var.app_secret_prefix}strapi/APP_KEYS" }
resource "aws_secretsmanager_secret" "strapi_api_token_salt" { name = "${var.app_secret_prefix}strapi/API_TOKEN_SALT" }
resource "aws_secretsmanager_secret" "strapi_admin_jwt_secret" { name = "${var.app_secret_prefix}strapi/ADMIN_JWT_SECRET" }
resource "aws_secretsmanager_secret" "strapi_jwt_secret" { name = "${var.app_secret_prefix}strapi/JWT_SECRET" }
resource "aws_secretsmanager_secret" "strapi_db_url" { name = "${var.app_secret_prefix}strapi/DATABASE_URL" }

resource "aws_secretsmanager_secret_version" "v_django_secret_key" {
  count = var.create_initial_versions && var.initial_django_secret_key != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.django_secret_key.id
  secret_string = var.initial_django_secret_key
}
resource "aws_secretsmanager_secret_version" "v_django_allowed_hosts" {
  count = var.create_initial_versions && var.initial_allowed_hosts != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.django_allowed_hosts.id
  secret_string = var.initial_allowed_hosts
}
resource "aws_secretsmanager_secret_version" "v_django_db_url" {
  count = var.create_initial_versions && var.initial_django_db_url != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.django_db_url.id
  secret_string = var.initial_django_db_url
}
resource "aws_secretsmanager_secret_version" "v_strapi_app_keys" {
  count = var.create_initial_versions && var.initial_strapi_app_keys != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_app_keys.id
  secret_string = var.initial_strapi_app_keys
}
resource "aws_secretsmanager_secret_version" "v_strapi_api_salt" {
  count = var.create_initial_versions && var.initial_strapi_api_salt != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_api_token_salt.id
  secret_string = var.initial_strapi_api_salt
}
resource "aws_secretsmanager_secret_version" "v_strapi_admin_jwt" {
  count = var.create_initial_versions && var.initial_strapi_admin_jwt != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_admin_jwt_secret.id
  secret_string = var.initial_strapi_admin_jwt
}
resource "aws_secretsmanager_secret_version" "v_strapi_jwt" {
  count = var.create_initial_versions && var.initial_strapi_jwt != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_jwt_secret.id
  secret_string = var.initial_strapi_jwt
}
resource "aws_secretsmanager_secret_version" "v_strapi_db_url" {
  count = var.create_initial_versions && var.initial_strapi_db_url != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_db_url.id
  secret_string = var.initial_strapi_db_url
}
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/secrets/outputs.tf" -Content @'
output "django_secret_key_arn"       { value = aws_secretsmanager_secret.django_secret_key.arn }
output "django_allowed_hosts_arn"    { value = aws_secretsmanager_secret.django_allowed_hosts.arn }
output "django_db_url_arn"           { value = aws_secretsmanager_secret.django_db_url.arn }
output "strapi_app_keys_arn"         { value = aws_secretsmanager_secret.strapi_app_keys.arn }
output "strapi_api_token_salt_arn"   { value = aws_secretsmanager_secret.strapi_api_token_salt.arn }
output "strapi_admin_jwt_secret_arn" { value = aws_secretsmanager_secret.strapi_admin_jwt_secret.arn }
output "strapi_jwt_secret_arn"       { value = aws_secretsmanager_secret.strapi_jwt_secret.arn }
output "strapi_db_url_arn"           { value = aws_secretsmanager_secret.strapi_db_url.arn }
'@ -ForceWrite:$Force

# modules/ecr
Write-Text -Path "infra/modules/ecr/variables.tf" -Content @'
variable "repositories" { type = list(string) }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/ecr/main.tf" -Content @'
locals { repo_map = { for name in var.repositories : name => name } }
resource "aws_ecr_repository" "repos" {
  for_each = local.repo_map
  name                 = each.value
  image_tag_mutability = "MUTABLE"
  encryption_configuration { encryption_type = "AES256" }
  image_scanning_configuration { scan_on_push = true }
  tags = { Name = each.value }
}
output "repository_urls" { value = { for k, v in aws_ecr_repository.repos : k => v.repository_url } }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/ecr/outputs.tf" -Content @'
output "repository_arns" { value = { for k, v in aws_ecr_repository.repos : k => v.arn } }
'@ -ForceWrite:$Force

# modules/ecs-cluster
Write-Text -Path "infra/modules/ecs-cluster/variables.tf" -Content @'
variable "name" { type = string }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/ecs-cluster/main.tf" -Content @'
resource "aws_ecs_cluster" "this" {
  name = var.name
  setting { name = "containerInsights" value = "enabled" }
}
resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${var.name}"
  retention_in_days = 30
}
output "cluster_arn"  { value = aws_ecs_cluster.this.arn }
output "cluster_name" { value = aws_ecs_cluster.this.name }
output "log_group"    { value = aws_cloudwatch_log_group.this.name }
'@ -ForceWrite:$Force

# modules/ecs-service-alb
Write-Text -Path "infra/modules/ecs-service-alb/variables.tf" -Content @'
variable "service_name"       { type = string }
variable "cluster_arn"        { type = string }
variable "vpc_id"             { type = string }
variable "public_subnet_ids"  { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "container_image"    { type = string }
variable "container_port"     { type = number }
variable "cpu"                { type = number, default = 512 }
variable "memory"             { type = number, default = 1024 }
variable "desired_count"      { type = number, default = 2 }
variable "healthcheck_path"   { type = string, default = "/" }
variable "enable_execute_command" { type = bool, default = true }
variable "environment" { type = map(string) default = {} }
variable "secrets"     { type = map(string) default = {} } # Secrets Manager ARNs
variable "hostnames_for_certificate" { type = list(string) }
variable "hosted_zone_id"            { type = string }
variable "create_route53_record"     { type = bool, default = true }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/ecs-service-alb/main.tf" -Content @'
resource "aws_security_group" "alb" {
  name        = "${var.service_name}-alb-sg"
  description = "ALB SG"
  vpc_id      = var.vpc_id
  ingress { from_port = 443 to_port = 443 protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0   to_port = 0   protocol = "-1"  cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_security_group" "task" {
  name        = "${var.service_name}-task-sg"
  description = "ECS task SG"
  vpc_id      = var.vpc_id
  ingress { from_port = var.container_port to_port = var.container_port protocol = "tcp" security_groups = [aws_security_group.alb.id] }
  egress  { from_port = 0 to_port = 0 protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_lb" "this" {
  name               = "${var.service_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "this" {
  name        = "${var.service_name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id
  health_check {
    path                = var.healthcheck_path
    matcher             = "200-399"
    interval            = 30
    unhealthy_threshold = 5
  }
}

resource "aws_acm_certificate" "this" {
  domain_name       = var.hostnames_for_certificate[0]
  validation_method = "DNS"
  subject_alternative_names = slice(var.hostnames_for_certificate, 1, length(var.hostnames_for_certificate))
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
  zone_id = var.hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.this.certificate_arn
  default_action { type = "forward" target_group_arn = aws_lb_target_group.this.arn }
}

data "aws_region" "current" {}

data "aws_iam_policy_document" "task_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals { type = "Service" identifiers = ["ecs-tasks.amazonaws.com"] }
  }
}

resource "aws_iam_role" "task_execution" {
  name               = "${var.service_name}-exec-role"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}
resource "aws_iam_role" "task_role" {
  name               = "${var.service_name}-task-role"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}

resource "aws_iam_role_policy_attachment" "exec_ecr" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
resource "aws_iam_policy" "secrets_read" {
  name        = "${var.service_name}-secrets-read"
  description = "Allow GetSecretValue for injected secrets"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["secretsmanager:GetSecretValue"],
      Resource = values(var.secrets)
    }]
  })
}
resource "aws_iam_role_policy_attachment" "task_secrets" {
  role       = aws_iam_role.task_role.name
  policy_arn = aws_iam_policy.secrets_read.arn
}

resource "aws_cloudwatch_log_group" "service" {
  name              = "/ecs/${var.service_name}"
  retention_in_days = 30
}

locals {
  env_list = [for k, v in var.environment : { name = k, value = v }]
  sec_list = [for k, v in var.secrets     : { name = k, valueFrom = v }]
}

resource "aws_ecs_task_definition" "this" {
  family                   = var.service_name
  cpu                      = var.cpu
  memory                   = var.memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task_role.arn
  runtime_platform { operating_system_family = "LINUX" cpu_architecture = "X86_64" }
  container_definitions = jsonencode([{
    name      = var.service_name
    image     = var.container_image
    essential = true
    portMappings = [{ containerPort = var.container_port, hostPort = var.container_port, protocol = "tcp" }]
    environment = local.env_list
    secrets     = local.sec_list
    logConfiguration = { logDriver = "awslogs", options = {
      awslogs-group = aws_cloudwatch_log_group.service.name,
      awslogs-region = data.aws_region.current.name,
      awslogs-stream-prefix = var.service_name
    }}
    healthCheck = { command = ["CMD-SHELL", "curl -fsS http://localhost:${var.container_port}${var.healthcheck_path} || exit 1"], interval = 30, timeout = 5, retries = 3 }
  }])
}

resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  enable_execute_command = var.enable_execute_command
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.task.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }

  lifecycle { ignore_changes = [desired_count] }
}

resource "aws_route53_record" "svc_alias_a" {
  count   = var.create_route53_record ? length(var.hostnames_for_certificate) : 0
  zone_id = var.hosted_zone_id
  name    = var.hostnames_for_certificate[count.index]
  type    = "A"
  alias { name = aws_lb.this.dns_name zone_id = aws_lb.this.zone_id evaluate_target_health = true }
}
resource "aws_route53_record" "svc_alias_aaaa" {
  count   = var.create_route53_record ? length(var.hostnames_for_certificate) : 0
  zone_id = var.hosted_zone_id
  name    = var.hostnames_for_certificate[count.index]
  type    = "AAAA"
  alias { name = aws_lb.this.dns_name zone_id = aws_lb.this.zone_id evaluate_target_health = true }
}
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/ecs-service-alb/outputs.tf" -Content @'
output "alb_dns_name" { value = aws_lb.this.dns_name }
output "alb_zone_id"  { value = aws_lb.this.zone_id }
output "task_sg_id"   { value = aws_security_group.task.id }
output "alb_sg_id"    { value = aws_security_group.alb.id }
output "service_arn"  { value = aws_ecs_service.this.arn }
output "listener_arn" { value = aws_lb_listener.https.arn }
'@ -ForceWrite:$Force

# modules/s3 (+ nested bucket)
Write-Text -Path "infra/modules/s3/variables.tf" -Content @'
variable "site_prefix"           { type = string }
variable "create_django_buckets" { type = bool, default = true }
variable "create_strapi_bucket"  { type = bool, default = true }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/s3/main.tf" -Content @'
locals {
  django_static = "${var.site_prefix}-django-static"
  django_media  = "${var.site_prefix}-django-media"
  strapi_media  = "${var.site_prefix}-strapi-media"
}

module "bucket_django_static" {
  source  = "./bucket"
  count   = var.create_django_buckets ? 1 : 0
  name    = local.django_static
}
module "bucket_django_media" {
  source  = "./bucket"
  count   = var.create_django_buckets ? 1 : 0
  name    = local.django_media
}
module "bucket_strapi_media" {
  source  = "./bucket"
  count   = var.create_strapi_bucket ? 1 : 0
  name    = local.strapi_media
}
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/s3/outputs.tf" -Content @'
output "django_static_bucket" { value = try(module.bucket_django_static[0].bucket, null) }
output "django_media_bucket"  { value = try(module.bucket_django_media[0].bucket, null) }
output "strapi_media_bucket"  { value = try(module.bucket_strapi_media[0].bucket, null) }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/s3/bucket/main.tf" -Content @'
variable "name" { type = string }

resource "aws_s3_bucket" "this" { bucket = var.name }

resource "aws_s3_bucket_versioning" "v" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "enc" {
  bucket = aws_s3_bucket.this.id
  rule { apply_server_side_encryption_by_default { sse_algorithm = "AES256" } }
}

resource "aws_s3_bucket_public_access_block" "pab" {
  bucket = aws_s3_bucket.this.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "lc" {
  bucket = aws_s3_bucket.this.id
  rule {
    id = "expire-mpu"
    status = "Enabled"
    abort_incomplete_multipart_upload { days_after_initiation = 7 }
  }
}

output "bucket" { value = aws_s3_bucket.this.bucket }
output "arn"    { value = aws_s3_bucket.this.arn }
'@ -ForceWrite:$Force

# modules/amplify-next
Write-Text -Path "infra/modules/amplify-next/variables.tf" -Content @'
variable "app_name"      { type = string }
variable "repo_url"      { type = string }
variable "access_token"  { type = string, sensitive = true }
variable "branch"        { type = string }
variable "custom_domain" { type = string }
variable "zone_id"       { type = string }
variable "env_vars"      { type = map(string) default = {} }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/amplify-next/main.tf" -Content @'
resource "aws_amplify_app" "this" {
  name         = var.app_name
  repository   = var.repo_url
  access_token = var.access_token
  platform     = "WEB_COMPUTE"
  build_spec = <<-YAML
version: 1
applications:
  - appRoot: apps/frontend-next
    frontend:
      phases:
        preBuild:
          commands:
            - nvm use 22 || nvm install 22
            - corepack enable || true
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: ./.next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
YAML
  environment_variables = var.env_vars
}

resource "aws_amplify_branch" "branch" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.branch
  enable_auto_build = true
  stage = "PRODUCTION"
}

resource "aws_amplify_domain_association" "domain" {
  app_id      = aws_amplify_app.this.id
  domain_name = var.custom_domain
  depends_on  = [aws_amplify_branch.branch]
  sub_domain {
    branch_name = var.branch
    prefix      = ""
  }
}

output "amplify_app_id" { value = aws_amplify_app.this.id }
output "domain_status"  { value = aws_amplify_domain_association.domain.status }
'@ -ForceWrite:$Force

Write-Text -Path "infra/modules/amplify-next/outputs.tf" -Content @'
output "app_id" { value = aws_amplify_app.this.id }
'@ -ForceWrite:$Force

# ---------- Site stack ----------
Write-Text -Path "$SiteFolder/variables.tf" -Content @'
variable "region"        { type = string }
variable "site_id"       { type = string }
variable "env"           { type = string }
variable "domain_root"   { type = string }
variable "parent_zone"   { type = string }
variable "frontend_repo_url" { type = string }
variable "frontend_branch"   { type = string, default = "main" }
variable "amplify_access_token" { type = string, sensitive = true }
variable "rds_instance_class" { type = string, default = "db.t4g.medium" }
variable "rds_allocated_gb"   { type = number, default = 50 }
'@ -ForceWrite:$Force

Write-Text -Path "$SiteFolder/main.tf" -Content @'
terraform {
  required_version = ">= 1.6.0"
  required_providers { aws = { source = "hashicorp/aws", version = "~> 5.0" } }
  backend "s3" {}
}

provider "aws" { region = var.region }

locals {
  name        = "${var.site_id}-${var.env}"
  domain_root = var.domain_root
  api_host    = "api.${local.domain_root}"
  cms_host    = "cms.${local.domain_root}"
  next_host   = local.domain_root
}

data "aws_route53_zone" "parent" {
  name         = var.parent_zone
  private_zone = false
}

module "vpc" {
  source             = "../../modules/vpc"
  name               = local.name
  az_count           = 2
  create_nat_gateway = true
}

module "rds" {
  source              = "../../modules/rds-postgres"
  name                = local.name
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  instance_class      = var.rds_instance_class
  allocated_storage   = var.rds_allocated_gb
  multi_az            = false
  deletion_protection = false
}

module "secrets" {
  source               = "../../modules/secrets"
  app_secret_prefix    = "${var.site_id}/${var.env}/"
  create_initial_versions = false
}

module "s3" {
  source                = "../../modules/s3"
  site_prefix           = local.name
  create_django_buckets = true
  create_strapi_bucket  = true
}

module "ecr" {
  source       = "../../modules/ecr"
  repositories = ["${local.name}-django", "${local.name}-strapi"]
}

module "ecs" {
  source = "../../modules/ecs-cluster"
  name   = local.name
}

module "svc_django" {
  source                = "../../modules/ecs-service-alb"
  service_name          = "${local.name}-django"
  cluster_arn           = module.ecs.cluster_arn
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids
  container_image       = "${module.ecr.repository_urls["${local.name}-django"]}:latest"
  container_port        = 8000
  desired_count         = 2
  cpu                   = 512
  memory                = 1024
  healthcheck_path      = "/healthz/"
  environment = {
    DJANGO_SETTINGS_MODULE = "project.settings"
    FRONTEND_HOST          = local.next_host
    DJANGO_S3_BUCKET       = module.s3.django_media_bucket
    DJANGO_CDN_DOMAIN      = "${module.s3.django_media_bucket}.s3.amazonaws.com"
    AWS_REGION             = var.region
  }
  secrets = {
    SECRET_KEY    = module.secrets.django_secret_key_arn
    ALLOWED_HOSTS = module.secrets.django_allowed_hosts_arn
    DATABASE_URL  = module.secrets.django_db_url_arn
  }
  hostnames_for_certificate = [local.api_host]
  hosted_zone_id            = data.aws_route53_zone.parent.zone_id
}

module "svc_strapi" {
  source                = "../../modules/ecs-service-alb"
  service_name          = "${local.name}-strapi"
  cluster_arn           = module.ecs.cluster_arn
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids
  container_image       = "${module.ecr.repository_urls["${local.name}-strapi"]}:latest"
  container_port        = 1337
  desired_count         = 2
  cpu                   = 512
  memory                = 1024
  healthcheck_path      = "/_health"
  environment = {
    NODE_ENV   = "production"
    AWS_REGION = var.region
    S3_BUCKET  = module.s3.strapi_media_bucket
  }
  secrets = {
    DATABASE_URL      = module.secrets.strapi_db_url_arn
    APP_KEYS          = module.secrets.strapi_app_keys_arn
    API_TOKEN_SALT    = module.secrets.strapi_api_token_salt_arn
    ADMIN_JWT_SECRET  = module.secrets.strapi_admin_jwt_secret_arn
    JWT_SECRET        = module.secrets.strapi_jwt_secret_arn
  }
  hostnames_for_certificate = [local.cms_host]
  hosted_zone_id            = data.aws_route53_zone.parent.zone_id
}

resource "aws_security_group_rule" "db_from_django" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = module.rds.sg_id
  source_security_group_id = module.svc_django.task_sg_id
}
resource "aws_security_group_rule" "db_from_strapi" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = module.rds.sg_id
  source_security_group_id = module.svc_strapi.task_sg_id
}

module "amplify" {
  source           = "../../modules/amplify-next"
  app_name         = local.name
  repo_url         = var.frontend_repo_url
  access_token     = var.amplify_access_token
  branch           = var.frontend_branch
  custom_domain    = local.next_host
  zone_id          = data.aws_route53_zone.parent.zone_id
  env_vars = {
    NEXT_PUBLIC_API_BASE = "https://${local.api_host}"
    NEXT_PUBLIC_CMS_BASE = "https://${local.cms_host}"
  }
}
'@ -ForceWrite:$Force

Write-Text -Path "$SiteFolder/outputs.tf" -Content @"
output ""vpc_id""         { value = module.vpc.vpc_id }
output ""api_url""        { value = ""https://$ApiHost"" }
output ""cms_url""        { value = ""https://$CmsHost"" }
output ""frontend_url""   { value = ""https://$DomainRoot"" }
output ""rds_endpoint""   { value = module.rds.endpoint }
output ""django_task_sg"" { value = module.svc_django.task_sg_id }
output ""strapi_task_sg"" { value = module.svc_strapi.task_sg_id }
"@ -ForceWrite:$Force

Write-Text -Path "$SiteFolder/backend.hcl" -Content @"
bucket         = ""${SiteId}-${Env}-tfstate""
key            = ""state/${SiteId}-${Env}.tfstate""
region         = ""$AwsRegion""
dynamodb_table = ""tf-locks""
encrypt        = true
"@ -ForceWrite:$Force

Write-Text -Path "$SiteFolder/terraform.tfvars" -Content @"
region             = ""$AwsRegion""
site_id            = ""$SiteId""
env                = ""$Env""
domain_root        = ""$DomainRoot""
parent_zone        = ""$ParentZone""

frontend_repo_url     = ""$FrontendRepoUrl""
frontend_branch       = ""$FrontendBranch""
amplify_access_token  = ""$AmplifyAccessToken""
"@ -ForceWrite:$Force

# ---------- Root README with quick next steps ----------
Write-Text -Path "README.md" -Content @"
# Affiliate Stack

## Quick start

1) Initialize Terraform state resources (recommended):
   \`\`\`powershell
   aws s3 mb s3://${SiteId}-${Env}-tfstate --region $AwsRegion
   aws dynamodb create-table --region $AwsRegion --table-name tf-locks `
     --attribute-definitions AttributeName=LockID,AttributeType=S `
     --key-schema AttributeName=LockID,KeyType=HASH `
     --billing-mode PAY_PER_REQUEST
   \`\`\`

2) Initialize and apply ECR first:
   \`\`\`powershell
   cd infra/sites/$SiteId-$Env
   terraform init -backend-config=backend.hcl
   terraform apply -target=module.ecr
   \`\`\`

3) Build & push images (Django and Strapi) to the newly created ECR repos, then:
   \`\`\`powershell
   terraform apply
   \`\`\`

4) Create RDS databases/users, store app secrets in Secrets Manager,
   and force new ECS deployments to pick up the secrets.

Frontend will deploy via Amplify to: \`https://$DomainRoot\`  
API: \`https://$ApiHost\`  
CMS: \`https://$CmsHost\`
"@ -ForceWrite:$Force

Write-Host "`nAll files written. Next steps:" -ForegroundColor Green
Write-Host "  1) Create S3 state bucket & DynamoDB lock table (see README)" -ForegroundColor Green
Write-Host "  2) cd infra/sites/$SiteId-$Env ; terraform init -backend-config=backend.hcl" -ForegroundColor Green
Write-Host "  3) terraform apply -target=module.ecr ; build+push images ; terraform apply" -ForegroundColor Green
Write-Host "  4) Initialize DBs, set Secrets Manager values, ECS force-new-deployment" -ForegroundColor Green
