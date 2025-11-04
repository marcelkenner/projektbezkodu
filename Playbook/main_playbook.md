Below is a **complete, reusable blueprint** to stand up **one full affiliate site** end‑to‑end on AWS using:

- **Frontend:** Next.js + **Tailwind CSS v4**
- **Backend API:** Django + Gunicorn
- **Database:** Amazon RDS for PostgreSQL
- **Headless CMS:** Strapi (v5 series) with media in S3
- **Everything on AWS:** VPC, ECS Fargate, RDS, S3, CloudFront/Amplify, Route 53, ACM, Secrets Manager, CloudWatch

It’s written so you can stamp out **many separate sites** by changing a handful of variables (domain, site ID, brand/theme). Every step includes **what**, **why**, **where**, and **how** (commands/config).

---

## 0) What you’ll build (reference architecture)

```
                          +---------------------------+
                          |  Route 53 (public DNS)    |
                          +---------------------------+
                               |               |
                    A/AAAA Alias to         A/AAAA Alias to
                 CloudFront/Amplify         ALB (Django) & ALB (Strapi)
                         |                           |
                +-----------------+                 +----------------------+
                |  CloudFront or  |                 |  Application LB(s)   |
                | Amplify Hosting |                 | (HTTPS 443, TLS ACM) |
                +-----------------+                 +----------------------+
                       |                                     |
              Next.js SSR/SSG                         ECS Fargate Services
              (Node 20/22)                             • Django API
                                                       • Strapi CMS (+S3)
                       \                               /
                        \                             /
                         \                           /
                       +-------------------------------+
                       |      VPC (2+ AZs)             |
                       |  Private subnets: ECS/RDS      |
                       |  Public subnets: ALB/NAT       |
                       +-------------------------------+
                                   |
                            Amazon RDS Postgres
                           (Multi-AZ optional/SSL)
                                   |
                               Secrets Manager
                          (DB & app secrets injected)
                                   |
                              Amazon S3 Buckets
               (Strapi uploads, Django static/media, optional CDN)

```

---

## 1) Prerequisites (one-time)

- **AWS account** with admin access for setup, then use limited IAM roles thereafter.
- **Region choice:** pick a home region (e.g., `us-east-1`). Note: if you use **CloudFront**, its **ACM certificate must be requested in `us-east-1`**; ALB certs can be in your app region. ([AWS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html?utm_source=chatgpt.com))
- **Domains:** you have or will buy domains; we’ll host DNS in **Route 53**.
- **Local tooling:** Node 20/22 (for Next & Strapi), Python 3.12/3.13 (for Django), Docker, AWS CLI v2, Terraform ≥1.6, Git. Tailwind v4 requires new install steps; we’ll show them. Strapi v5 supports Node **20 & 22** LTS. Django 5.1 supports Python 3.10–3.13. ([docs.strapi.io](https://docs.strapi.io/snippets/installation-prerequisites?utm_source=chatgpt.com))

---

## 2) Repository layout (monorepo, reusable for many sites)

```
affiliate-stack/
├─ apps/
│  ├─ frontend-next/        # Next.js + Tailwind v4
│  ├─ backend-django/       # Django + DRF
│  └─ cms-strapi/           # Strapi v5
├─ infra/
│  ├─ modules/              # Reusable TF modules: vpc, rds, ecr, ecs, alb, s3, acm, route53, amplify
│  └─ sites/
│     ├─ projektbezkodu-dev/          # Site-specific TF stack (dev)
│     └─ projektbezkodu-prod/         # Site-specific TF stack (prod)
├─ .github/workflows/       # CI/CD for images (ECR) & deploy (ECS/Amplify)
└─ docs/                    # Playbooks, runbooks

```

You’ll **copy a site folder**, change variables (`site_id`, domain, sizing), commit, and re‑apply to create another website.

---

## 3) Infrastructure as Code: Terraform stacks

> We’ll provision: VPC, subnets, NAT, RDS, Secrets, ECR, ECS+ALB (Django & Strapi), S3, CloudFront/Amplify, Route 53, ACM, CloudWatch.
> 

Create `infra/sites/projektbezkodu-dev/main.tf` (skeleton):

```hcl
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {}  # configure remote state
}

provider "aws" {
  region = var.region
}

locals {
  site_id      = var.site_id        # e.g., "projektbezkodu"
  env          = var.env            # "dev"
  domain_root  = var.domain_root    # e.g., "projektbezkodu.example.com"
  django_host  = "api.${local.domain_root}"
  strapi_host  = "cms.${local.domain_root}"
  next_host    = local.domain_root
}

# --- VPC (2 public + 2 private subnets) ---
module "vpc" {
  source             = "../modules/vpc"
  name               = "${local.site_id}-${local.env}"
  az_count           = 2
  create_nat_gateway = true
}

# --- RDS Postgres ---
module "rds" {
  source                 = "../modules/rds-postgres"
  name                   = "${local.site_id}-${local.env}"
  vpc_id                 = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnet_ids
  engine_version         = "15.5"              # example
  multi_az               = false               # dev = false, prod = true
  instance_class         = "db.t4g.medium"
  allocated_storage      = 50
  enable_performance_insights = true
  # Force SSL: parameter group will set rds.force_ssl=1 (on)
}

# --- Secrets Manager (DB + app) ---
module "secrets" {
  source = "../modules/secrets"
  rds_master_secret_name = "${local.site_id}/${local.env}/rds-master"
  app_secret_prefix      = "${local.site_id}/${local.env}/"
}

# --- ECR repos (django, strapi) ---
module "ecr" {
  source = "../modules/ecr"
  repositories = ["${local.site_id}-django", "${local.site_id}-strapi"]
}

# --- ECS cluster ---
module "ecs" {
  source     = "../modules/ecs-cluster"
  name       = "${local.site_id}-${local.env}"
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}

# --- ALBs + ECS services ---
module "django_service" {
  source                = "../modules/ecs-service-alb"
  service_name          = "${local.site_id}-django"
  cluster_arn           = module.ecs.cluster_arn
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids
  container_image       = module.ecr.repository_urls["${local.site_id}-django"]:latest
  container_port        = 8000
  healthcheck_path      = "/healthz/"
  desired_count         = 2
  cpu                   = 512
  memory                = 1024
  environment = {
    DJANGO_SETTINGS_MODULE = "project.settings"
  }
  secrets = {
    DATABASE_URL  = module.secrets.db_url_arn   # ECS will inject from Secrets Manager
    SECRET_KEY    = module.secrets.django_secret_arn
    ALLOWED_HOSTS = module.secrets.django_allowed_hosts_arn
  }
  hostnames_for_certificate = [local.django_host]
}

module "strapi_service" {
  source                = "../modules/ecs-service-alb"
  service_name          = "${local.site_id}-strapi"
  cluster_arn           = module.ecs.cluster_arn
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids
  container_image       = module.ecr.repository_urls["${local.site_id}-strapi"]:latest
  container_port        = 1337
  healthcheck_path      = "/_health"
  desired_count         = 2
  cpu                   = 512
  memory                = 1024
  environment = {
    NODE_ENV = "production"
  }
  secrets = {
    DATABASE_URL      = module.secrets.db_url_arn
    APP_KEYS          = module.secrets.strapi_app_keys_arn
    API_TOKEN_SALT    = module.secrets.strapi_api_token_salt_arn
    ADMIN_JWT_SECRET  = module.secrets.strapi_admin_jwt_secret_arn
    JWT_SECRET        = module.secrets.strapi_jwt_secret_arn
    S3_BUCKET         = module.secrets.s3_bucket_arn
  }
  hostnames_for_certificate = [local.strapi_host]
}

# --- S3 buckets (media + static) ---
module "s3" {
  source               = "../modules/s3"
  site_prefix          = "${local.site_id}-${local.env}"
  create_django_buckets = true
  create_strapi_bucket  = true
}

# --- Frontend hosting: Amplify (SSR Next.js) or CloudFront+S3 (SSG) ---
module "amplify_next" {
  source           = "../modules/amplify-next"
  app_name         = "${local.site_id}-${local.env}"
  branch           = var.frontend_branch
  repo_url         = var.frontend_repo_url
  custom_domain    = local.next_host
}

# --- Route 53 & ACM (ALIAS records) ---
module "dns" {
  source              = "../modules/route53"
  zone_name           = var.parent_zone   # e.g., example.com
  records = {
    (local.next_host)   = module.amplify_next.domain_target
    (local.django_host) = module.django_service.alb_dns_name
    (local.strapi_host) = module.strapi_service.alb_dns_name
  }
}

```

### Why these choices?

- **ECS Fargate** removes server management; **ALB** gives TLS + health checks. ([AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html?utm_source=chatgpt.com))
- **Secrets Manager → ECS** injects secrets at runtime (no secrets in images/env files). ([AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html?utm_source=chatgpt.com))
- **RDS Postgres** with **`rds.force_ssl=1`** enforces TLS to DB. ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html?utm_source=chatgpt.com))
- **Amplify Hosting** supports **Next.js SSR (up to Next 15) and Node 20/22** runtimes. ([AWS Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html?utm_source=chatgpt.com))
- **CloudFront certs in `us-east-1`** rule. ([AWS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html?utm_source=chatgpt.com))
- **Route 53 alias** records for apex/subdomains to CloudFront/ALB. ([AWS Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html?utm_source=chatgpt.com))

> Tip about multi‑site: Each site lives in its own infra/sites/<site>-<env> folder. Use TF variables for site_id, env, domain_root, sizes. You can share a VPC/cluster for many sites or isolate per site (change module names/prefixes accordingly).
> 

---

## 4) Secrets you must create (one-time per site)

Generate strong secrets locally:

```bash
# Django SECRET_KEY
python - <<'PY'
import secrets, string
alphabet = string.ascii_letters + string.digits + string.punctuation
print(''.join(secrets.choice(alphabet) for _ in range(64)))
PY

# Strapi keys (v5): APP_KEYS (comma-separated), API_TOKEN_SALT, ADMIN_JWT_SECRET, JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

```

Create them in **AWS Secrets Manager** (names used by TF module above), or let Terraform create placeholders and you rotate them later. ECS will **inject** these into containers as env vars through the task definition’s `secrets` block. ([AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html?utm_source=chatgpt.com))

> Rotation (recommended): enable automatic rotation for DB secrets so passwords change safely without downtime. (AWS Documentation)
> 

---

## 5) Database layer (RDS PostgreSQL)

**Why:** managed backups, point‑in‑time restore, patching. Enforce SSL with `rds.force_ssl=1`. ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html?utm_source=chatgpt.com))

**Initial DB setup** (connect with `psql`, from your machine via a bastion or using **ECS Exec** to a one‑off task in the private subnet):

```bash
# Example psql connection (replace host/port/user/db)
psql "host=<rds-endpoint> port=5432 dbname=postgres user=<masteruser> sslmode=require"
# Create app DBs & users (or one DB with two schemas)
CREATE DATABASE django_app;
CREATE DATABASE strapi_app;
CREATE USER django_user WITH ENCRYPTED PASSWORD '<generated>';
CREATE USER strapi_user WITH ENCRYPTED PASSWORD '<generated>';
GRANT ALL PRIVILEGES ON DATABASE django_app TO django_user;
GRANT ALL PRIVILEGES ON DATABASE strapi_app TO strapi_user;

```

AWS docs for `psql` to RDS if you need exact flags. ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.psql.html?utm_source=chatgpt.com))

> You can store the application connection strings (postgresql://user:pass@host:5432/dbname?sslmode=require) in Secrets Manager and let Terraform wire them to ECS services as injected secrets. (AWS Documentation)
> 

---

## 6) Build & ship images → ECR, then deploy to ECS

### ECR & GitHub Actions (OIDC, no long-lived keys)

1. In AWS IAM, configure GitHub **OIDC trust** + a deploy role with minimal permissions (ECR push, ECS update). ([GitHub Docs](https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services?utm_source=chatgpt.com))
2. Add workflow `.github/workflows/deploy.yml`:

```yaml
name: build-and-deploy
on:
  push:
    branches: [ main ]
    paths:
      - "apps/backend-django/**"
      - "apps/cms-strapi/**"
      - ".github/workflows/deploy.yml"
jobs:
  dockerize-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v5
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-deploy
          aws-region: us-east-1

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build & push Django
        run: |
          IMAGE="${{ steps.ecr.outputs.registry }}/${{ env.SITE_ID }}-django:$(git rev-parse --short HEAD)"
          docker build -t "$IMAGE" apps/backend-django
          docker push "$IMAGE"
          echo "DJANGO_IMAGE=$IMAGE" >> $GITHUB_ENV

      - name: Build & push Strapi
        run: |
          IMAGE="${{ steps.ecr.outputs.registry }}/${{ env.SITE_ID }}-strapi:$(git rev-parse --short HEAD)"
          docker build -t "$IMAGE" apps/cms-strapi
          docker push "$IMAGE"
          echo "STRAPI_IMAGE=$IMAGE" >> $GITHUB_ENV

      - name: Update ECS services
        run: |
          aws ecs update-service --cluster "${{ env.CLUSTER }}" \
            --service "${{ env.SITE_ID }}-django" \
            --force-new-deployment
          aws ecs update-service --cluster "${{ env.CLUSTER }}" \
            --service "${{ env.SITE_ID }}-strapi" \
            --force-new-deployment

```

GitHub’s OIDC + `aws-actions/configure-aws-credentials` example and rationale. ([GitHub](https://github.com/aws-actions/configure-aws-credentials?utm_source=chatgpt.com))

---

## 7) Django backend (API)

### Dockerfile (apps/backend-django/Dockerfile)

```docker
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# Collect static at build if you like, but with S3 storage it's done at runtime during deploy/migrate.
CMD ["gunicorn", "project.wsgi:application", "--bind", "0.0.0.0:8000", "-w", "4", "--timeout", "60"]

```

**Gunicorn** is the standard WSGI server; start with 2–4×CPU workers or the `2*cores+1` heuristic and tune. ([docs.gunicorn.org](https://docs.gunicorn.org/en/stable/settings.html?utm_source=chatgpt.com))

### Key settings (project/settings.py)

```python
import os
from urllib.parse import urlparse

SECRET_KEY = os.environ["SECRET_KEY"]
DEBUG = False

ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"].split(",")  # e.g., api.projektbezkodu.example.com

# Behind ALB (TLS terminated) — let Django know requests are secure:
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True  # build absolute URLs from X-Forwarded-Host behind ALB
CSRF_TRUSTED_ORIGINS = [f"https://{h}" for h in ALLOWED_HOSTS]

DATABASE_URL = os.environ["DATABASE_URL"]  # postgresql://... ?sslmode=require
# Use dj-database-url or psycopg settings; ensure sslmode=require

# CORS for frontend domain
INSTALLED_APPS += ["corsheaders", "storages"]
MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware", *MIDDLEWARE]
CORS_ALLOWED_ORIGINS = [f"https://{os.environ['FRONTEND_HOST']}"]

# Static/media to S3 via django-storages
AWS_STORAGE_BUCKET_NAME = os.environ["DJANGO_S3_BUCKET"]
AWS_S3_REGION_NAME = os.environ.get("AWS_REGION", "us-east-1")
STORAGES = {
  "default": {"BACKEND": "storages.backends.s3boto3.S3Boto3Storage", "OPTIONS": {"location": "media"}},
  "staticfiles": {"BACKEND": "storages.backends.s3boto3.S3StaticStorage", "OPTIONS": {"location": "static"}}
}
STATIC_URL = f"https://{os.environ['DJANGO_CDN_DOMAIN']}/static/"
MEDIA_URL  = f"https://{os.environ['DJANGO_CDN_DOMAIN']}/media/"

```

- **CSRF_TRUSTED_ORIGINS** requires full scheme (https://) in modern Django. ([Django Project](https://docs.djangoproject.com/en/5.2/ref/csrf/?utm_source=chatgpt.com))
- **SECURE_PROXY_SSL_HEADER/USE_X_FORWARDED_HOST** ensure HTTPS detection + correct host behind ALB. ([Ubuntu](https://ubuntu.com/blog/django-behind-a-proxy-fixing-absolute-urls?utm_source=chatgpt.com))
- **django‑storages S3** configuration for static & media. ([django-storages.readthedocs.io](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html?utm_source=chatgpt.com))

> Migrations & collectstatic on ECS: run a one‑off “task” against the Django image to execute:
> 
> 
> ```bash
> python manage.py migrate --noinput
> python manage.py collectstatic --noinput
> 
> ```
> 
> You can trigger this in GitHub Actions with `aws ecs run-task ...` before `update-service`.
> 

---

## 8) Strapi CMS (v5)

### Dockerfile (apps/cms-strapi/Dockerfile)

```docker
FROM node:22-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]  # "strapi start"

```

### Required environment (v5)

At minimum: `APP_KEYS` (comma-separated), `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `DATABASE_URL`. See Strapi v5 env/installation docs. ([docs.strapi.io](https://docs.strapi.io/cms/deployment?utm_source=chatgpt.com))

### S3 upload provider (media off the container)

1. Install provider in your app:
    
    `yarn add @strapi/provider-upload-aws-s3`
    
2. Configure `config/plugins.ts`:

```tsx
export default ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        s3Options: {
          region: env('AWS_REGION', 'us-east-1'),
        },
        params: {
          Bucket: env('S3_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});

```

Use an **ECS Task Role** that allows `s3:PutObject/GetObject/DeleteObject` on the bucket rather than static keys in env. Provider setup references. ([Strapi](https://strapi.io/blog/how-to-set-up-amazon-s3-upload-provider-plugin-for-our-strapi-app?utm_source=chatgpt.com))

### GraphQL (optional, great for Next)

```
yarn add @strapi/plugin-graphql

```

After enabling, `/graphql` is available; v5 supports updated/Relay-style queries. ([docs.strapi.io](https://docs.strapi.io/cms/plugins/graphql?utm_source=chatgpt.com))

### CORS / admin URL

In `config/middlewares.ts`, configure CORS origins to your frontend/preview domains; Strapi respects middleware config in v5. ([docs.strapi.io](https://docs.strapi.io/cms/configurations/middlewares?utm_source=chatgpt.com))

---

## 9) Next.js + Tailwind v4 frontend

### Create app

```bash
cd apps
npx create-next-app@latest frontend-next --typescript --eslint --app

```

### Install Tailwind v4 (official steps)

```bash
cd frontend-next
npm i tailwindcss @tailwindcss/postcss postcss
# add PostCSS plugin:
printf 'const config = { plugins: { "@tailwindcss/postcss": {}, },};export default config;\n' > postcss.config.mjs
# import Tailwind in global CSS:
mkdir -p app && printf '@import "tailwindcss";\n' > app/globals.css

```

Tailwind v4 uses a CSS-first setup with `@import "tailwindcss"` and the official Next guide now uses the `@tailwindcss/postcss` plugin. Optionally, define design tokens via `@theme { ... }` in your CSS. ([tailwindcss.com](https://tailwindcss.com/docs/guides/nextjs?utm_source=chatgpt.com))

> Why Amplify Hosting for Next: You get managed SSR builds, image optimization, and CF CDN out of the box (supports Next 15; use Node 20/22). Connect repo + branch in the Amplify console; it provisions CloudFront automatically. (AWS Documentation)
> 

### Config: connect to APIs

Create `.env.production` in Amplify (or use Amplify console environment variables):

```
NEXT_PUBLIC_API_BASE=https://api.projektbezkodu.example.com
NEXT_PUBLIC_CMS_BASE=https://cms.projektbezkodu.example.com

```

Usage (Next 13+/15 fetch with ISR):

```tsx
// app/page.tsx
export const revalidate = 300; // 5 min ISR

export default async function Home() {
  const posts = await fetch(`${process.env.NEXT_PUBLIC_CMS_BASE}/api/posts?populate=...`,
    { next: { revalidate } }).then(r => r.json());
  return (<main className="container mx-auto p-6">{/* render posts */}</main>);
}

```

### Affiliate link redirects (clean links)

Create a `middleware.ts` or route handler that 302 redirects `/go/:slug` to actual affiliate URLs fetched from Django/Strapi; this preserves pretty URLs and helps tracking.

---

## 10) DNS, TLS, custom domains

- Request **ACM certs**:
    - For **CloudFront/Amplify**: request in `us-east-1`. ([AWS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html?utm_source=chatgpt.com))
    - For **ALBs** (Django & Strapi): request in **your app region**.
- In **Route 53**, create **A/AAAA alias** records:
    - `projektbezkodu.example.com` → Amplify/CloudFront target
    - `api.projektbezkodu.example.com` → ALB (Django)
    - `cms.projektbezkodu.example.com` → ALB (Strapi)
        
        Alias to CloudFront/ELB is supported and recommended for apex too. ([AWS Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html?utm_source=chatgpt.com))
        

---

## 11) End‑to‑end deployment steps (first site)

1. **Clone template repo** → rename `site_id`, set `domain_root`, etc.
2. **Create DNS hosted zone** for your parent domain in Route 53 (or delegate from registrar).
3. **Terraform apply** the `projektbezkodu-dev` stack:
    
    ```bash
    cd infra/sites/projektbezkodu-dev
    terraform init && terraform apply
    
    ```
    
    This provisions VPC, RDS, ECR, ECS/ALB services, S3, Amplify app, ACM, Route 53.
    
4. **Push app code** to GitHub (frontend & images).
5. **Connect Amplify** to your frontend repo/branch and add custom domain `projektbezkodu.example.com`; Amplify builds Next SSR. ([docs.amplify.aws](https://docs.amplify.aws/gen1/javascript/deploy-and-host/frameworks/deploy-nextjs-app/?utm_source=chatgpt.com))
6. **Add secrets** in Secrets Manager (if not done by TF) and **redeploy** ECS services to read them. ([AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html?utm_source=chatgpt.com))
7. **Initialize DB**:
    - Run `psql` to create DBs/users (or a one‑time TF/automation). ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.psql.html?utm_source=chatgpt.com))
    - Run one‑off ECS tasks:
        
        ```bash
        # Django migrations + collectstatic
        aws ecs run-task --cluster <cluster> --launch-type FARGATE \
          --task-definition <django-task-def> --count 1 \
          --network-configuration "awsvpcConfiguration={subnets=[...],securityGroups=[...]}"
        
        # Strapi build (already done in image) and bootstrap admin (first-run)
        
        ```
        
8. **Open Strapi** at `https://cms.projektbezkodu.example.com/admin` → create content types and entries; media goes to S3 provider. ([Strapi](https://strapi.io/blog/how-to-set-up-amazon-s3-upload-provider-plugin-for-our-strapi-app?utm_source=chatgpt.com))
9. **Smoke test**:
    - `https://api.projektbezkodu.example.com/healthz/` (Django)
    - `https://cms.projektbezkodu.example.com/_health` (Strapi custom endpoint)
    - `https://projektbezkodu.example.com/` (Next via Amplify)

---

## 12) Security & operations essentials

- **Force DB SSL** (`rds.force_ssl=1`) and use `sslmode=require` in connection strings. ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html?utm_source=chatgpt.com))
- **Secrets rotation:** enable Secrets Manager rotation for database credentials; ECS will pick up new secrets on next deployment (you can automate a rolling restart on `RotationSucceeded`). ([AWS Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_turn-on-for-db.html?utm_source=chatgpt.com))
- **CORS/CSRF:**
    - Django: `django-cors-headers` with explicit origins; CSRF trusted origins require scheme. ([PyPI](https://pypi.org/project/django-cors-headers/?utm_source=chatgpt.com))
    - Strapi: configure CORS middleware origins in `config/middlewares.ts`. ([docs.strapi.io](https://docs.strapi.io/cms/configurations/middlewares?utm_source=chatgpt.com))
- **Logging/metrics:** ECS task logs → CloudWatch, ALB access logs, RDS Performance Insights.
- **Budgets/limits:** Set CloudWatch alarms for 5xx on ALB target groups, RDS CPU/I/O.
- **WAF (optional):** if placing CloudFront in front of ALBs, attach AWS WAF.

---

## 13) Reusing the blueprint for more sites

- Copy `infra/sites/projektbezkodu-dev` → `infra/sites/brandX-prod`, change:
    - `site_id`, `env`, `domain_root`, sizes
    - DNS/ACM SANs
- Create separate **ECR repos**, **ECS services**, **RDS instance** (or separate DBs) per site via variables.
- In the monorepo frontend, keep **brand/theme** as config (env, CSS variables in Tailwind v4 `@theme`), and deploy a distinct Amplify app per site/branch.

> If you expect dozens of small sites, consider one shared RDS instance with separate DBs/users. For stronger isolation and easier per‑site rotation, prefer one RDS per site (higher cost).
> 

---

## 14) Concrete app configs and commands

### A) Django requirements.txt (minimal)

```
Django>=5.1,<5.3
gunicorn>=22.0
psycopg[binary]>=3.1
django-cors-headers>=4.4
django-storages>=1.14
boto3>=1.34
django-environ>=0.11
djangorestframework>=3.15

```

**Docs:** Gunicorn with Django; Django settings reference; django‑storages S3 backend. ([Django Project](https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/gunicorn/?utm_source=chatgpt.com))

### B) Strapi environment sample (v5)

```
NODE_ENV=production
APP_KEYS=base64key1,base64key2,base64key3,base64key4
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
DATABASE_URL=postgresql://strapi_user:***@<rds-host>:5432/strapi_app?sslmode=require
AWS_REGION=us-east-1
S3_BUCKET=projektbezkodu-dev-strapi-media

```

**Strapi env + DB config references.** ([docs.strapi.io](https://docs.strapi.io/cms/configurations/environment?utm_source=chatgpt.com))

### C) Tailwind v4 theming (optional)

```css
/* apps/frontend-next/app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #0ea5e9;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}

```

**Tailwind v4 blog/guide:** CSS-first config & v4.1. ([tailwindcss.com](https://tailwindcss.com/blog/tailwindcss-v4?utm_source=chatgpt.com))

---

## 15) DNS & certificates (exact clicks/CLI)

1. **ACM (CloudFront)** – switch to **N. Virginia (us‑east‑1)** → *Request public certificate* for `projektbezkodu.example.com` (and `www` if needed). Validate via DNS CNAME. ([AWS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html?utm_source=chatgpt.com))
2. **ACM (app region)** – request cert for `api.projektbezkodu.example.com`, `cms.projektbezkodu.example.com`.
3. **Route 53** (Hosted zone `example.com`) → *Create records*:
    - `projektbezkodu` (A/AAAA, Alias) → CloudFront/Amplify target. ([AWS Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html?utm_source=chatgpt.com))
    - `api` (A/AAAA, Alias) → choose your **ALB**.
    - `cms` (A/AAAA, Alias) → your **ALB**.
        
        Docs on aliasing to ELB and CloudFront. ([AWS Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html?utm_source=chatgpt.com))
        

---

## 16) Health checks & scaling

- **ALB target groups**: `/healthz/` (Django), `/_health` (Strapi).
- **Auto scaling**: add CPU/Memory target tracking for ECS services (e.g., 60% CPU).
- **Gunicorn tuning**: start `workers=2*CPU+1`, adjust threads/timeouts per load. ([docs.gunicorn.org](https://docs.gunicorn.org/en/stable/settings.html?utm_source=chatgpt.com))

---

## 17) Local development (optional but handy)

A simple `docker-compose.yml` for local dev:

```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    ports: [ "5432:5432" ]
  django:
    build: ./apps/backend-django
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/postgres
      SECRET_KEY: local
      ALLOWED_HOSTS: localhost,127.0.0.1
    command: bash -lc "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
    ports: [ "8000:8000" ]
    depends_on: [ db ]
  strapi:
    build: ./apps/cms-strapi
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/postgres
      APP_KEYS: key1,key2,key3,key4
      API_TOKEN_SALT: token
      ADMIN_JWT_SECRET: admin
      JWT_SECRET: jwt
    ports: [ "1337:1337" ]
    depends_on: [ db ]
  next:
    build: ./apps/frontend-next
    environment:
      NEXT_PUBLIC_API_BASE: http://localhost:8000
      NEXT_PUBLIC_CMS_BASE: http://localhost:1337
    ports: [ "3000:3000" ]

```

---

## 18) Common pitfalls checklist

- **CloudFront/Amplify cert region** must be `us-east-1`. ([AWS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html?utm_source=chatgpt.com))
- **DB SSL:** ensure `?sslmode=require` and RDS param `rds.force_ssl=1`. ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html?utm_source=chatgpt.com))
- **CSRF/CORS:** include **scheme** in Django `CSRF_TRUSTED_ORIGINS` and configure `django-cors-headers`. ([Django Project](https://docs.djangoproject.com/en/5.2/ref/csrf/?utm_source=chatgpt.com))
- **ECS Secrets:** mount secrets via task definition `secrets` field, not env vars in images. ([AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html?utm_source=chatgpt.com))
- **Amplify Node runtime:** use Node 20 or 22 for SSR as older runtimes are no longer supported. ([AWS Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html?utm_source=chatgpt.com))
- **Route 53 alias** to ALB/CloudFront rather than CNAME at apex. ([AWS Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html?utm_source=chatgpt.com))

---

## 19) What to do **right now** (copy/paste runbook)

1. **Fork this plan** and scaffold the repo layout above.
2. **Create site vars**: `site_id=projektbezkodu`, `env=dev`, `domain_root=projektbezkodu.example.com`.
3. **`terraform apply`** the `infra/sites/projektbezkodu-dev` stack.
4. **Add secrets** (Django secret, Strapi keys, DB URLs) in **Secrets Manager**. ([AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html?utm_source=chatgpt.com))
5. **Connect Amplify** to `apps/frontend-next` repo/branch and point domain. ([docs.amplify.aws](https://docs.amplify.aws/gen1/javascript/deploy-and-host/frameworks/deploy-nextjs-app/?utm_source=chatgpt.com))
6. **Push Docker images** via the provided GitHub Actions (ECR login, build, push, `update-service`). ([AWS Documentation](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/build-and-push-docker-images-to-amazon-ecr-using-github-actions-and-terraform.html?utm_source=chatgpt.com))
7. **Run migrations** for Django (ECS run‑task), and log into Strapi admin to create content types.
8. **Verify** health endpoints and homepage.

---

### References (key docs I used to lock the details)

- Tailwind v4 official guide + blog (install & v4 changes). ([tailwindcss.com](https://tailwindcss.com/docs/guides/nextjs?utm_source=chatgpt.com))
- Amplify Hosting support for **Next SSR** + supported Node runtimes. ([AWS Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html?utm_source=chatgpt.com))
- CloudFront certs require **ACM in us‑east‑1**. ([AWS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html?utm_source=chatgpt.com))
- **Route 53 alias** to CloudFront/ELB and how to create records. ([AWS Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html?utm_source=chatgpt.com))
- ECS secrets from **Secrets Manager** (inject as env). ([AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html?utm_source=chatgpt.com))
- **RDS Postgres SSL** and `rds.force_ssl`. ([AWS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html?utm_source=chatgpt.com))
- **Django** deployment settings, CSRF trusted origins, and S3 storage. ([Django Project](https://docs.djangoproject.com/en/5.2/ref/settings/?utm_source=chatgpt.com))
- **Strapi v5** env/deployment + S3 upload provider + GraphQL plugin. ([docs.strapi.io](https://docs.strapi.io/cms/deployment?utm_source=chatgpt.com))
- GitHub Actions **OIDC → AWS** and pushing to **ECR**. ([GitHub Docs](https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services?utm_source=chatgpt.com))

---

If you want, I can drop in **ready‑to‑use Terraform module stubs** and the **Dockerfiles** for all three apps tailored to your naming, so you can `terraform apply`, push the repos, and be up in one pass.

[Step by step](https://www.notion.so/Step-by-step-2a1b8980e86480d7bcacc603fccf4b44?pvs=21)

[Terraform](https://www.notion.so/Terraform-2a1b8980e864803e9811ee1d559df77c?pvs=21)

[Docker](https://www.notion.so/Docker-2a1b8980e864804fa8bdda0d967d43e4?pvs=21)