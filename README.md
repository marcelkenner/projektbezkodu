# Affiliate Stack — Complete Guide

**Frontend:** Next.js + Tailwind v4
**API:** Django + Gunicorn
**CMS:** Strapi v5 (+ S3 uploads)
**DB:** PostgreSQL (Amazon RDS)
**Infra:** VPC, ECS Fargate, ALB, S3, RDS, Route 53, ACM, Amplify, Secrets Manager, CloudWatch
**IaC:** Terraform (modules included)

---

## Table of Contents

1. [What you’re building (architecture)](#what-youre-building-architecture)
2. [What gets created (files & folders)](#what-gets-created-files--folders)
3. [Prerequisites (install tools)](#prerequisites-install-tools)
4. [Project setup (generate all files automatically)](#project-setup-generate-all-files-automatically)
5. [Concepts you must know (short primer)](#concepts-you-must-know-short-primer)
6. [End‑to‑end deployment: first site](#end-to-end-deployment-first-site)
7. [Daily workflow (build, push, deploy, content)](#daily-workflow-build-push-deploy-content)
8. [Creating another site (copy/paste blueprint)](#creating-another-site-copypaste-blueprint)
9. [Operations: logs, debugging, rollbacks](#operations-logs-debugging-rollbacks)
10. [Security, secrets, and safety rails](#security-secrets-and-safety-rails)
11. [Cost notes & clean‑up](#cost-notes--clean-up)
12. [FAQ / common errors](#faq--common-errors)

---

## What you’re building (architecture)

```
Users
  │
  ├─> Route 53 (DNS for your domain)
  │
  ├─> CloudFront via Amplify  ──> Next.js (SSR/ISR) frontend
  │                               (builds from GitHub)
  │
  └─> ALB :443 ──> ECS Fargate (Django API)
                    │
                    └─> RDS PostgreSQL (TLS)
  └─> ALB :443 ──> ECS Fargate (Strapi CMS)
                    │
                    └─> S3 (media uploads)
```

* **Amplify Hosting** builds & serves the **Next.js** app behind **CloudFront**.
* **Django** and **Strapi** are **containers** running on **ECS Fargate**, each behind its own **Application Load Balancer (ALB)** with HTTPS (ACM certificates).
* **RDS PostgreSQL** stores the data.
* **S3** stores media (images) for Django (optional) and Strapi (required).
* **Secrets Manager** holds database URLs and app secrets.
* **Terraform** creates all AWS resources, consistently and repeatably.

---

## What gets created (files & folders)

After running our bootstrap script you will have:

```
apps/
  frontend-next/         # Next.js + Tailwind v4 (SSR/ISR)
  backend-django/        # Django API + Gunicorn + health endpoint
  cms-strapi/            # Strapi v5 + /_health + S3 upload provider
infra/
  modules/               # Reusable Terraform modules (vpc, rds, ecr, ecs, alb, s3, amplify, secrets)
  sites/<site>-<env>/    # One stack per site (dev/prod), holds main.tf, tfvars, backend.hcl
.github/workflows/       # (optional) CI/CD you may add later
New-AffiliateProject.ps1 # PowerShell bootstrapper that created all files
README.md                # This file
```

**Important naming convention**

* We’ll call your site **`<site>-<env>`** (e.g., `projektbezkodu-dev`, `projektbezkodu-prod`).
* Public hostnames:

  * Frontend: `projektbezkodu.example.com`
  * API: `api.projektbezkodu.example.com`
  * CMS: `cms.projektbezkodu.example.com`

---

## Prerequisites (install tools)

> You need AWS access to an account you can use for this project. If you are unsure, ask your lead for credentials and the correct **AWS region**.

### Tools to install

**Windows (PowerShell):**

* Install **Git**, **Docker Desktop**, **Node 22**, **Python 3.12**, **Terraform**, **AWS CLI**.

  * Easiest via [winget] (Run PowerShell as Administrator):

    ```powershell
    winget install --id Git.Git -e
    winget install --id Docker.DockerDesktop -e
    winget install --id OpenJS.NodeJS.LTS -e
    winget install --id Python.Python.3.12 -e
    winget install --id Hashicorp.Terraform -e
    winget install --id Amazon.AWSCLI -e
    ```
  * After install, **restart** your shell so PATH is updated.

**macOS (Terminal):**

```bash
brew install git --cask docker
brew install node@22 python@3.12 terraform awscli
```

**Verify versions**

```bash
node -v        # v22.x
python3 -V     # 3.12.x
terraform -v   # >= 1.6
aws --version
docker --version
```

**Log into AWS**

```powershell
aws configure
# Enter Access Key, Secret, Default region (e.g., us-east-1), Output: json
```

---

## Project setup (generate all files automatically)

From the **root of this repo**, run the provided bootstrap script. This writes:

* All Terraform modules and a ready-to-apply **site stack**
* Dockerfiles
* Minimal app scaffolding/config (Next, Django, Strapi)

> If files already exist, the script **skips** them unless you pass `-Force`.

**Example (creates `projektbezkodu-dev`):**

```powershell
pwsh -File .\New-AffiliateProject.ps1 `
  -SiteId projektbezkodu `
  -Env dev `
  -ParentZone example.com `
  -AwsRegion us-east-1 `
  -FrontendRepoUrl "https://github.com/your-org/affiliate-stack" `
  -AmplifyAccessToken "ghp_XXXXXXXXXXXXXXXXXXXX" `
  -ScaffoldApps `
  -Force
```

**What the parameters mean**

* `SiteId` — short brand code (appears in resource names)
* `Env` — environment (`dev`/`prod`)
* `ParentZone` — your Route 53 public hosted zone (must exist in AWS)
* `AwsRegion` — region for your resources
* `FrontendRepoUrl` — Git repo Amplify will build from
* `AmplifyAccessToken` — a **read-only** token so Amplify can pull the repo
* `-ScaffoldApps` — also creates basic app skeletons (ok to omit)

---

## Concepts you must know (short primer)

* **Terraform**: declares cloud resources in code.

  * `terraform init` — prepare the working directory
  * `terraform plan` — see what will change
  * `terraform apply` — create/update resources (you confirm)
  * **State**: Terraform remembers what it created in a **state file**. We store this in S3 (configured in `backend.hcl`) so your team shares the same state.
* **ECR**: Elastic Container Registry for your Docker images.
* **ECS Fargate**: runs your containers without managing servers.
* **ALB**: receives HTTPS on 443 and forwards to your containers.
* **RDS PostgreSQL**: managed Postgres database with backups.
* **Secrets Manager**: stores sensitive values (**never** put secrets in Git).
* **Amplify Hosting**: builds Next.js from Git, serves it through CloudFront.
* **Route 53**: DNS for your domain; we create `A/AAAA` alias records.
* **ACM**: TLS certificates for HTTPS; Terraform sets these up for the ALBs.
* **S3**: buckets for Strapi media (and Django static/media if you choose).

---

## End‑to‑end deployment: first site

We’ll create **ECR first** (to push images), then the **full stack**, then DB users & secrets, then restart services.

> Replace variables with your values if you changed script params.

### 0) Prepare remote state (do once per account)

```powershell
$Bucket = "projektbezkodu-dev-tfstate"
$Region = "us-east-1"

aws s3 mb s3://$Bucket --region $Region
aws dynamodb create-table --region $Region --table-name tf-locks `
  --attribute-definitions AttributeName=LockID,AttributeType=S `
  --key-schema AttributeName=LockID,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST
```

`infra/sites/projektbezkodu-dev/backend.hcl` should match your bucket/region.

### 1) Initialize Terraform (site stack)

```powershell
cd infra/sites/projektbezkodu-dev
terraform init -backend-config=backend.hcl
```

### 2) Create **only ECR** first

We need the repositories so we can push images.

```powershell
terraform apply -target=module.ecr
```

### 3) Build & push Docker images (Django + Strapi)

```powershell
# Log in to ECR
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region us-east-1 |
  docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com"

# Django image
cd ../../../apps/backend-django
docker build -t "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/projektbezkodu-dev-django:latest" .
docker push "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/projektbezkodu-dev-django:latest"

# Strapi image
cd ../cms-strapi
docker build -t "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/projektbezkodu-dev-strapi:latest" .
docker push "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/projektbezkodu-dev-strapi:latest"
```

### 4) Create the full infrastructure

```powershell
cd ../../infra/sites/projektbezkodu-dev
terraform apply
# Review the plan carefully, then type 'yes' when asked.
```

This creates: VPC, subnets, ALBs, ECS cluster/services, RDS, S3, Secrets, Amplify app + domain mapping, and Route 53 DNS records.

### 5) Create databases and users (first time only)

Use **RDS Query Editor v2** in the AWS Console (simplest) or connect with `psql` from a task in the VPC.

SQL to run as the master user:

```sql
CREATE DATABASE django_app;
CREATE DATABASE strapi_app;

CREATE USER django_user WITH ENCRYPTED PASSWORD '<strong-random-1>';
CREATE USER strapi_user WITH ENCRYPTED PASSWORD '<strong-random-2>';

GRANT ALL PRIVILEGES ON DATABASE django_app  TO django_user;
GRANT ALL PRIVILEGES ON DATABASE strapi_app TO strapi_user;
```

### 6) Put secrets into **Secrets Manager** (never in Git)

Build DB URLs (replace endpoint with your real one):

```powershell
$RDS = (terraform output -raw rds_endpoint)
$DJ = "postgresql://django_user:<strong-random-1>@$RDS:5432/django_app?sslmode=require"
$ST = "postgresql://strapi_user:<strong-random-2>@$RDS:5432/strapi_app?sslmode=require"
```

Store them and other required secrets:

```powershell
# Django
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/django/DATABASE_URL   --secret-string $DJ
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/django/SECRET_KEY     --secret-string '<64-char-random>'
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/django/ALLOWED_HOSTS  --secret-string 'api.projektbezkodu.example.com'

# Strapi (APP_KEYS is 4 comma-separated random keys)
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/APP_KEYS          --secret-string 'k1,k2,k3,k4'
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/API_TOKEN_SALT    --secret-string '<random>'
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/ADMIN_JWT_SECRET  --secret-string '<random>'
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/JWT_SECRET        --secret-string '<random>'
aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/DATABASE_URL      --secret-string $ST
```

### 7) Restart ECS services to pick up secrets

```powershell
aws ecs update-service --cluster projektbezkodu-dev --service projektbezkodu-dev-django --force-new-deployment
aws ecs update-service --cluster projektbezkodu-dev --service projektbezkodu-dev-strapi --force-new-deployment
```

### 8) Run Django migrations & collectstatic (one-off task)

```powershell
$TD = (aws ecs describe-services --cluster projektbezkodu-dev --services projektbezkodu-dev-django `
       --query "services[0].taskDefinition" --output text)

# Run a one-off command in the VPC with the same task definition
aws ecs run-task --cluster projektbezkodu-dev --launch-type FARGATE --task-definition $TD `
  --count 1 --network-configuration "awsvpcConfiguration={assignPublicIp=DISABLED,subnets=$(terraform output -json private_subnet_ids),securityGroups=[\"$(terraform output -raw django_task_sg)\"]}" `
  --overrides "{""containerOverrides"":[{""name"":""projektbezkodu-dev-django"",""command"":[""bash"",""-lc"",""python manage.py migrate --noinput && python manage.py collectstatic --noinput""]}]}"
```

### 9) Check everything is healthy

* API health: `https://api.projektbezkodu.example.com/healthz/` → returns `{"ok": true}`
* CMS health: `https://cms.projektbezkodu.example.com/_health` → returns `{"ok": true}`
* Frontend: `https://projektbezkodu.example.com/` (Amplify builds automatically on your default branch)

If something fails, go to **[Operations](#operations-logs-debugging-rollbacks)** below.

---

## Daily workflow (build, push, deploy, content)

* Change code in `apps/backend-django` or `apps/cms-strapi`.
* Build and push images to ECR (you can automate this with GitHub Actions later).
* Force a new deployment:

  ```powershell
  aws ecs update-service --cluster projektbezkodu-dev --service projektbezkodu-dev-django --force-new-deployment
  aws ecs update-service --cluster projektbezkodu-dev --service projektbezkodu-dev-strapi --force-new-deployment
  ```
* Change frontend → **push to GitHub** → Amplify rebuilds automatically.
* CMS content: go to `https://cms.projektbezkodu.example.com/admin`, create/edit content; uploads go to S3 automatically.

---

## Creating another site (copy/paste blueprint)

1. Duplicate the site folder:

   ```powershell
   Copy-Item -Recurse infra\sites\projektbezkodu-dev infra\sites\brandx-prod
   ```
2. Edit `terraform.tfvars`:

   * `site_id = "brandx"`
   * `env = "prod"`
   * `domain_root = "brandx.example.com"`
   * Change `amplify_access_token` if needed.
3. Repeat the same sequence:

   * `terraform init -backend-config=backend.hcl`
   * `terraform apply -target=module.ecr`
   * Build & push images to the **new** repo names (`brandx-prod-django/strapi`)
   * `terraform apply` (full)
   * Create DBs/users; write Secrets; restart ECS; run migrations.

**Tip:** For strong isolation, use a **separate RDS instance** per site. For cost savings, you can share one RDS and create separate **databases** and **users** — but make sure usernames and DB names don’t collide.

---

## Operations: logs, debugging, rollbacks

### Where to look first

* **ECS Service events**
  AWS Console → ECS → Cluster `projektbezkodu-dev` → Services → (django/strapi) → **Events** tab.
  You’ll see deployment/health messages here.
* **Application logs**
  AWS Console → CloudWatch Logs → Log groups `/ecs/projektbezkodu-dev-django` and `/ecs/projektbezkodu-dev-strapi`.
* **ALB target health**
  AWS Console → EC2 → Target Groups → check health checks.
* **Amplify build logs**
  AWS Console → Amplify → your app → Build history.

### Common commands

**List running tasks**

```powershell
aws ecs list-tasks --cluster projektbezkodu-dev --service-name projektbezkodu-dev-django
```

**Describe a task (see last exit code)**

```powershell
aws ecs describe-tasks --cluster projektbezkodu-dev --tasks <task-arn>
```

**ECS Exec into a running container (shell)**

1. Enable ECS Exec (it’s already on in our module).
2. Run:

   ```powershell
   aws ecs execute-command --cluster projektbezkodu-dev --task <task-arn> --container projektbezkodu-dev-django `
     --command "bash" --interactive
   ```

   Use it to inspect environment, run `python manage.py …`, check filesystem, etc.

**Rollback to previous image**
Retag a known-good image in ECR as `:latest`, then force a new deployment.

---

## Security, secrets, and safety rails

* **Never commit secrets** to Git. All sensitive values go in **Secrets Manager**.
* The DB URL **must** end with `?sslmode=require` and RDS is configured to **force SSL**.
* Use **least privilege IAM** in CI (later). For now, keep AWS credentials safe.
* **Do not** open RDS to the internet. Our security groups only allow ECS tasks.
* Prefer **one-off ECS tasks** for migrations over auto-running them on every deploy.
* Avoid `terraform destroy` on **prod**. Ask a lead before running it anywhere.

---

## Cost notes & clean‑up

* **Fargate tasks** (Django & Strapi) cost money while running.
* **RDS** costs even when idle.
* **S3** and **CloudWatch Logs** cost based on storage.
* **Amplify** (builds + hosting) and **data transfer** (CloudFront) also incur charges.

**Clean-up (dev only!)**

```powershell
cd infra/sites/projektbezkodu-dev
terraform destroy
```

This removes **everything** Terraform created. It **won’t** delete your ECR images or Amplify app if you created them elsewhere; review the plan before confirming.

---

## FAQ / common errors

**Q: Amplify domain says “Pending verification”**
A: Ensure your Route 53 hosted zone **for the parent domain** (`example.com`) is authoritative (NS records at your registrar). The Amplify domain association will create the necessary DNS records automatically; just wait for propagation.

**Q: ALB shows targets `unhealthy`**

* Confirm the container is actually listening on the port (8000/1337).
* Check CloudWatch logs for stack traces.
* Make sure health endpoints exist:

  * Django `GET /healthz/` returns 200
  * Strapi `GET /_health` returns 200
* If tasks crash immediately, Secrets might be missing — recheck Secrets Manager values.

**Q: Django errors about `ALLOWED_HOSTS` or CSRF**

* `ALLOWED_HOSTS` secret **must** include `api.<site>.<zone>` (only that host, comma-separated if multiple).
* `CSRF_TRUSTED_ORIGINS` is computed from `ALLOWED_HOSTS` in settings; ensure you access via HTTPS and the correct host.

**Q: Strapi admin doesn’t load / login fails**

* Check that all Strapi secrets exist (APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, JWT_SECRET).
* Ensure `DATABASE_URL` points to the `strapi_app` database and the user has privileges.
* Restart service after changing secrets:

  ```powershell
  aws ecs update-service --cluster projektbezkodu-dev --service projektbezkodu-dev-strapi --force-new-deployment
  ```

**Q: `terraform init` fails about backend bucket**

* Create the S3 bucket and DynamoDB lock table first (see steps).
* Ensure the names in `backend.hcl` match what you created.

**Q: “AccessDenied” when pushing images**

* You must log in to ECR **in the same region** your repos were created:

  ```powershell
  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com"
  ```

**Q: Database connection errors**

* Verify security groups: the RDS SG must allow ingress **from** the ECS task SGs (Terraform creates this).
* Ensure your **DB users** & **databases** exist and the password in the URL is correct.

**Q: How do I rotate DB passwords?**

* Change password in Postgres (via RDS Query Editor).
* Update the `DATABASE_URL` secret in Secrets Manager.
* Force new deployments on both services.

---

### Appendix: Environment variables used by each service

**Django (in ECS task)**

* `SECRET_KEY` — long random string (Secrets Manager)
* `ALLOWED_HOSTS` — `api.<site>.<zone>` (comma-separated if multiple)
* `DATABASE_URL` — `postgresql://user:pass@host:5432/django_app?sslmode=require`
* `FRONTEND_HOST` — `<site>.<zone>` (used for CORS)
* `DJANGO_S3_BUCKET` — bucket for media
* `DJANGO_CDN_DOMAIN` — usually `<bucket>.s3.amazonaws.com`
* `AWS_REGION` — region string

**Strapi**

* `APP_KEYS` — **4** comma-separated random strings
* `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET` — random strings
* `DATABASE_URL` — `postgresql://user:pass@host:5432/strapi_app?sslmode=require`
* `AWS_REGION` — region string
* `S3_BUCKET` — media bucket name

**Frontend (Amplify build env)**

* `NEXT_PUBLIC_API_BASE` — `https://api.<site>.<zone>`
* `NEXT_PUBLIC_CMS_BASE` — `https://cms.<site>.<zone>`

---

## You’re done 🎉

* First deployments are the hardest. Follow the order **exactly**: ECR → push images → full Terraform → DB/users → Secrets → restart ECS → migrate → test.
* When in doubt, read ECS **service events** and **CloudWatch logs**; most issues show up there with a clear error.
* Ask for help **before** running destructive commands in production.
