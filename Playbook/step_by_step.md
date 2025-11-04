Below is a **from‑zero, copy‑paste runbook** to spin up your **multi‑site affiliate stack** on AWS using **Next.js + Tailwind v4 (frontend), Django (API), Strapi v5 (CMS), PostgreSQL (RDS), ECS Fargate, S3, ALB, Amplify, Route 53, ACM, Secrets Manager**—using the Terraform modules and Dockerfiles you already have.

> The steps are grouped into phases you can run in sequence. Everything is explicit—commands, files to create, what to click in AWS, and why.
> 

---

## Phase 0 — Workstation & account prep (one‑time)

**Install tools**

```bash
# macOS (brew); adapt for Linux/Win as needed
brew install node@22 python@3.12 terraform awscli docker
# Optional helpers
brew install jq gh

```

**Verify versions**

```bash
node -v      # v22.x
python3 -V   # 3.12.x
terraform -v # >= 1.6
aws --version
docker --version

```

**Authenticate AWS CLI**

```bash
aws configure
# Enter: AWS Access Key ID, Secret, default region (e.g., us-east-1), output json

```

**Pick your site variables (used throughout)**

> Change these per site you spin up.
> 

```bash
export AWS_REGION="us-east-1"
export SITE_ID="projektbezkodu"           # short name for the brand/site
export ENV="dev"                # dev | prod
export PARENT_ZONE="example.com"  # Route 53 hosted zone already in your account
export DOMAIN_ROOT="${SITE_ID}.${PARENT_ZONE}" # e.g., projektbezkodu.example.com
export API_HOST="api.${DOMAIN_ROOT}"
export CMS_HOST="cms.${DOMAIN_ROOT}"

```

**Create a GitHub repo for your monorepo**

```bash
mkdir affiliate-stack && cd affiliate-stack
git init
gh repo create your-org/affiliate-stack --private --source=. --remote=origin

```

---

## Phase 1 — Scaffold the monorepo & apps

**Folder skeleton**

```bash
mkdir -p apps/frontend-next apps/backend-django apps/cms-strapi
mkdir -p infra/modules infra/sites/${SITE_ID}-${ENV} .github/workflows docs

```

### 1A) Next.js + Tailwind v4

**Create the app**

```bash
cd apps/frontend-next
npm create next-app@latest . -- --ts --eslint --app --src-dir=false --import-alias "@/*"

```

**Add Tailwind v4**

```bash
npm i tailwindcss @tailwindcss/postcss postcss
printf 'const config = { plugins: { "@tailwindcss/postcss": {}, },};export default config;\n' > postcss.config.mjs
mkdir -p app && printf '@import "tailwindcss";\n' > app/globals.css

```

**Minimal homepage pulling from CMS (optional demo)**

```bash
cat > app/page.tsx <<'TS'
export const revalidate = 300;
export default async function Home() {
  const base = process.env.NEXT_PUBLIC_CMS_BASE!;
  const res = await fetch(`${base}/api/posts?populate=cover`, { next: { revalidate } });
  const data = await res.json();
  return <main className="mx-auto max-w-3xl p-6">
    <h1 className="text-3xl font-bold">Hello from {process.env.NEXT_PUBLIC_CMS_BASE}</h1>
    <pre className="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
  </main>
}
TS

```

**Next.js standalone build config (for Docker/local)**

```bash
cat > next.config.mjs <<'JS'
/** @type {import('next').NextConfig} */
export default {
  output: 'standalone',
  reactStrictMode: true,
};
JS

```

**Commit**

```bash
git add . && git commit -m "feat(frontend): next + tailwind v4"
cd ../../

```

### 1B) Django API

**Create project**

```bash
cd apps/backend-django
python3 -m venv .venv && source .venv/bin/activate
pip install django==5.1 djangorestframework django-cors-headers django-storages boto3 gunicorn psycopg[binary]
django-admin startproject project .

```

**`requirements.txt`**

```bash
printf "Django>=5.1,<5.3\ndjangorestframework>=3.15\ndjango-cors-headers>=4.4\ndjango-storages>=1.14\nboto3>=1.34\ngunicorn>=22.0\npsycopg[binary]>=3.1\n" > requirements.txt

```

**Add a health endpoint**

`project/urls.py`:

```python
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

def healthz(_): return JsonResponse({"ok": True})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz/", healthz),
]

```

**Production settings (edit `project/settings.py`)**

- Set from environment:

```python
import os
SECRET_KEY = os.environ["SECRET_KEY"]
DEBUG = False
ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"].split(",")  # "api.projektbezkodu.example.com"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
CSRF_TRUSTED_ORIGINS = [f"https://{h}" for h in ALLOWED_HOSTS]

INSTALLED_APPS += ["rest_framework","corsheaders","storages"]
MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware"] + MIDDLEWARE
CORS_ALLOWED_ORIGINS = [f"https://{os.environ.get('FRONTEND_HOST')}"]

# DATABASE_URL: postgresql://user:pass@host:5432/db?sslmode=require
import dj_database_url
DATABASES = {"default": dj_database_url.config(default=os.environ["DATABASE_URL"], conn_max_age=600)}

AWS_STORAGE_BUCKET_NAME = os.environ.get("DJANGO_S3_BUCKET")
AWS_S3_REGION_NAME = os.environ.get("AWS_REGION", "us-east-1")
STORAGES = {
  "default": {"BACKEND": "storages.backends.s3boto3.S3Boto3Storage", "OPTIONS": {"location": "media"}},
  "staticfiles": {"BACKEND": "storages.backends.s3boto3.S3StaticStorage", "OPTIONS": {"location": "static"}},
}
STATIC_URL = f"https://{os.environ.get('DJANGO_CDN_DOMAIN')}/static/"
MEDIA_URL  = f"https://{os.environ.get('DJANGO_CDN_DOMAIN')}/media/"

```

Add `dj-database-url` to requirements if you used it:

```bash
echo "dj-database-url>=2.2" >> requirements.txt

```

**Commit**

```bash
deactivate
git add . && git commit -m "feat(api): django project + health"
cd ../../

```

### 1C) Strapi v5 CMS

> We’ll lay down the project; production will be built by Docker.
> 

**Create project**

```bash
cd apps/cms-strapi
# Using yarn (corepack enabled in Dockerfile), but any package manager is fine.
npm create strapi-app@latest . -- --quickstart
# It will start a dev server locally (SQLite). Ctrl+C when ready—we will use Postgres in prod.

```

**Configure S3 upload provider**

Install & configure (code will be used at runtime with env vars):

```bash
npm i @strapi/provider-upload-aws-s3
mkdir -p config
cat > config/plugins.ts <<'TS'
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
TS

```

**Strapi health route** (simple middleware or route)

Create `src/api/health/controllers/health.ts` and route to return `{ ok: true }`, or just rely on app boot; for ALB we’ll hit `/_health`—we’ll add a small route:

```bash
mkdir -p src/api/health/controllers src/api/health/routes
cat > src/api/health/controllers/health.ts <<'TS'
export default {
  index(ctx) { ctx.body = { ok: true } },
};
TS
cat > src/api/health/routes/health.ts <<'TS'
export default {
  routes: [
    { method: 'GET', path: '/_health', handler: 'health.index', config: { policies: [] } },
  ],
};
TS

```

**Commit**

```bash
git add . && git commit -m "feat(cms): strapi v5 + s3 provider + health"
cd ../../

```

---

## Phase 2 — Drop in Dockerfiles (you already have them)

Copy the three **Dockerfiles** and `.dockerignore` (from the previous message) into:

- `apps/backend-django/Dockerfile` + `entrypoint.sh` + `.dockerignore`
- `apps/cms-strapi/Dockerfile` + `.dockerignore`
- `apps/frontend-next/Dockerfile` + `.dockerignore`

Then:

```bash
git add . && git commit -m "chore: add dockerfiles for api/cms/frontend"

```

---

## Phase 3 — Terraform infrastructure (copy the code you have)

1. Create the **Terraform modules** and **site stack** exactly as provided earlier:

```
infra/modules/...(vpc, rds-postgres, secrets, ecr, ecs-cluster, ecs-service-alb, s3, amplify-next)
infra/sites/${SITE_ID}-${ENV}/(main.tf, variables.tf, outputs.tf, terraform.tfvars)

```

1. **Remote Terraform state** (recommended)

Create a state bucket + lock table (one time per account/region):

```bash
export TF_STATE_BUCKET="${SITE_ID}-${ENV}-tfstate-$(date +%s)"
aws s3 mb s3://$TF_STATE_BUCKET --region $AWS_REGION
aws dynamodb create-table --region $AWS_REGION \
  --table-name tf-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

```

Create `infra/sites/${SITE_ID}-${ENV}/backend.hcl`:

```hcl
bucket         = "<PUT-YOUR-BUCKET-NAME>"
key            = "state/${SITE_ID}-${ENV}.tfstate"
region         = "<YOUR-REGION>"
dynamodb_table = "tf-locks"
encrypt        = true

```

1. **Fill tfvars** (repo URL & token used by Amplify)

```bash
cat > infra/sites/${SITE_ID}-${ENV}/terraform.tfvars <<EOF
region             = "${AWS_REGION}"
site_id            = "${SITE_ID}"
env                = "${ENV}"
domain_root        = "${DOMAIN_ROOT}"
parent_zone        = "${PARENT_ZONE}"

frontend_repo_url     = "https://github.com/your-org/affiliate-stack"
frontend_branch       = "main"
amplify_access_token  = "ghp_xxx"  # a read-only GitHub personal access token
EOF

```

1. **Init Terraform**

```bash
cd infra/sites/${SITE_ID}-${ENV}
terraform init -backend-config=backend.hcl

```

---

## Phase 4 — Create *only* the ECR repos first (so you can push images)

Do a targeted apply to create ECR (and optionally VPC/S3/Secrets/RDS if you like). The minimal you need to push is ECR:

```bash
terraform apply -target=module.ecr -auto-approve

```

Find your account ID (used to tag images):

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

```

Login Docker to ECR:

```bash
aws ecr get-login-password --region $AWS_REGION \
| docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

```

---

## Phase 5 — Build & push your images to ECR

> The ECR repo names are ${SITE_ID}-${ENV}-django and ${SITE_ID}-${ENV}-strapi (per your Terraform).
> 
> 
> Tag `:latest` for the first deployment; later you can use `:gitsha`.
> 

**Django**

```bash
cd ../../../apps/backend-django
docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SITE_ID}-${ENV}-django:latest .
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SITE_ID}-${ENV}-django:latest

```

**Strapi**

```bash
cd ../cms-strapi
docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SITE_ID}-${ENV}-strapi:latest .
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${SITE_ID}-${ENV}-strapi:latest

```

*(Frontend is built by Amplify; no push needed.)*

---

## Phase 6 — Provision the full stack with Terraform

Now create **VPC, RDS, ECS, ALBs, S3, Amplify, DNS, ACM**:

```bash
cd ../../infra/sites/${SITE_ID}-${ENV}
terraform apply
# Review plan carefully; type "yes" when ready (omit -auto-approve to double-check)

```

**Why now?**

- This produces: ECR (already done), ECS cluster & services (pointing to your images), ALBs with TLS, S3 buckets, RDS instance, Secrets objects, Amplify app + domain mapping, and Route 53 alias records.

---

## Phase 7 — Database initialization (DBs & users)

We need to create **two databases and two users** (one for Django, one for Strapi).

Because the DB has no public access, the **simplest** first‑time path is **RDS Query Editor v2**:

1. AWS Console → **RDS** → Query Editor v2 → connect to your instance as the `masteruser` (IAM auth works).
2. Run:

```sql
CREATE DATABASE django_app;
CREATE DATABASE strapi_app;

CREATE USER django_user WITH ENCRYPTED PASSWORD '<strong-random-1>';
CREATE USER strapi_user WITH ENCRYPTED PASSWORD '<strong-random-2>';

GRANT ALL PRIVILEGES ON DATABASE django_app  TO django_user;
GRANT ALL PRIVILEGES ON DATABASE strapi_app TO strapi_user;

```

> Keep the two random passwords; you’ll embed them into your DATABASE_URL secrets in the next step.
> 

---

## Phase 8 — Generate app secrets & store them in Secrets Manager

**Generate**

```bash
# Django secret key (64 chars)
python3 - <<'PY'
import secrets, string
alphabet = string.ascii_letters + string.digits + string.punctuation
print(''.join(secrets.choice(alphabet) for _ in range(64)))
PY

# Strapi (v5) secrets
openssl rand -base64 32   # repeat 4 times, comma-join for APP_KEYS
openssl rand -base64 32   # API_TOKEN_SALT
openssl rand -base64 32   # ADMIN_JWT_SECRET
openssl rand -base64 32   # JWT_SECRET

```

**Build connection strings** (replace endpoint with your `terraform output`):

```bash
terraform output rds_endpoint
# Example:
export RDS_HOST="$(terraform output -raw rds_endpoint)"

export DJANGO_DB_URL="postgresql://django_user:<strong-random-1>@${RDS_HOST}:5432/django_app?sslmode=require"
export STRAPI_DB_URL="postgresql://strapi_user:<strong-random-2>@${RDS_HOST}:5432/strapi_app?sslmode=require"

```

**Store into Secrets Manager** (these secret *objects* already exist from Terraform; we’re just putting values):

```bash
# Django
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/django/SECRET_KEY     --secret-string '<DjangoSecret>'
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/django/ALLOWED_HOSTS  --secret-string "${API_HOST}"
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/django/DATABASE_URL   --secret-string "${DJANGO_DB_URL}"

# Strapi
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/strapi/APP_KEYS          --secret-string 'k1,k2,k3,k4'
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/strapi/API_TOKEN_SALT    --secret-string '<APITokenSalt>'
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/strapi/ADMIN_JWT_SECRET  --secret-string '<AdminJWT>'
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/strapi/JWT_SECRET        --secret-string '<JWTSecret>'
aws secretsmanager put-secret-value --secret-id ${SITE_ID}/${ENV}/strapi/DATABASE_URL      --secret-string "${STRAPI_DB_URL}"

```

---

## Phase 9 — Restart ECS services to pick up secrets and stabilize

```bash
aws ecs update-service --cluster ${SITE_ID}-${ENV} --service ${SITE_ID}-${ENV}-django --force-new-deployment
aws ecs update-service --cluster ${SITE_ID}-${ENV} --service ${SITE_ID}-${ENV}-strapi --force-new-deployment

```

**Watch status**

- ECS → Cluster `${SITE_ID}-${ENV}` → Services should reach **Running** with healthy targets.
- ALB Target Groups → Healthy > 1 target each.

**Endpoints to verify**

- Django: `https://${API_HOST}/healthz/` → `{"ok": true}`
- Strapi: `https://${CMS_HOST}/_health` → `{"ok": true}`

---

## Phase 10 — Amplify Hosting (Next.js) configuration

Terraform already created the Amplify app & domain association using your repo URL and token.

**Set environment variables for SSR build (in TF already)**

- `NEXT_PUBLIC_API_BASE = https://${API_HOST}`
- `NEXT_PUBLIC_CMS_BASE = https://${CMS_HOST}`

**Trigger a build**

Push to `main`:

```bash
git push -u origin main

```

Amplify will detect changes, build your app, and attach the custom domain:

- Frontend: `https://${DOMAIN_ROOT}`

---

## Phase 11 — Strapi admin & S3 media

**Open Strapi admin**

`https://${CMS_HOST}/admin`

- Create the initial admin account.
- Confirm **Upload** plugin shows S3 provider (uploads go to `projektbezkodu-dev-strapi-media` bucket per Terraform).

**Create content types**

- *Collection type:* `Post` (title, slug, excerpt, cover image, body rich text).
- Publish one or two posts to test the frontend fetch.

---

## Phase 12 — Django migrations & static (S3)

You can run these via a one‑off ECS task or toggle the container entrypoint flags.

**One‑off ECS task method** (recommended):

```bash
# Get the current task definition ARN used by the service
DJ_TD=$(aws ecs describe-services --cluster ${SITE_ID}-${ENV} \
  --services ${SITE_ID}-${ENV}-django \
  --query "services[0].taskDefinition" --output text)

# Run a one-off task to migrate and collect static
aws ecs run-task \
  --cluster ${SITE_ID}-${ENV} \
  --launch-type FARGATE \
  --task-definition "${DJ_TD}" \
  --count 1 \
  --network-configuration "awsvpcConfiguration={subnets=$(terraform output -json vpc_id >/dev/null; echo -n '['$(terraform output -json private_subnet_ids 2>/dev/null || echo '[]')']'),securityGroups=[\"$(terraform output -raw django_task_sg 2>/dev/null || echo '')\"],assignPublicIp=DISABLED}" \
  --overrides "$(cat <<JSON
{ "containerOverrides": [{
    "name":"${SITE_ID}-${ENV}-django",
    "command":["bash","-lc","python manage.py migrate --noinput && python manage.py collectstatic --noinput"]
}]}
JSON
)"

```

*(If the complex network override bothers you, you can temporarily set `RUN_MIGRATIONS=true` and `COLLECTSTATIC=true` env vars on the service, redeploy once, then remove—your Docker entrypoint supports it.)*

---

## Phase 13 — DNS cross‑checks & TLS

- **Route 53** hosted zone `${PARENT_ZONE}` should show:
    - `A/AAAA` alias → ALB for `api.${DOMAIN_ROOT}`
    - `A/AAAA` alias → ALB for `cms.${DOMAIN_ROOT}`
    - Amplify will have created necessary records for `${DOMAIN_ROOT}`
- **Certificate validation**:
    - ACM certs for `api.` and `cms.` should be **Issued** (DNS validation records created by Terraform).
    - Amplify/CloudFront cert (for `${DOMAIN_ROOT}`) is handled by Amplify when associating the domain.

---

## Phase 14 — CI/CD (optional but recommended)

You can ship images from **GitHub Actions** with **OIDC** (no long‑lived keys). Minimal steps:

1. Create an IAM role allowing `sts:AssumeRole` from GitHub’s OIDC provider and granting:
    - `ecr:Batch*`, `ecr:PutImage`, `ecr:CompleteLayerUpload`, `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`
    - `ecs:UpdateService`, `ecs:Describe*`, `iam:PassRole` (if needed)
2. Add a workflow `.github/workflows/build-deploy.yml` that:
    - Checks out code
    - Configures AWS creds via OIDC
    - Builds/pushes the two images
    - Calls `ecs update-service --force-new-deployment` for both services

*(You already have an example from our earlier message—paste it and adjust ARNs.)*

---

## Phase 15 — Local development (optional)

**Quick compose for local hacking**

```yaml
# docker-compose.yml at repo root
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
  django:
    build: ./apps/backend-django
    environment:
      SECRET_KEY: local
      ALLOWED_HOSTS: localhost,127.0.0.1
      DATABASE_URL: postgresql://postgres:postgres@db:5432/postgres?sslmode=disable
      FRONTEND_HOST: localhost:3000
      DJANGO_S3_BUCKET: local-dev-bucket
      DJANGO_CDN_DOMAIN: localhost
    ports: ["8000:8000"]
    depends_on: [db]
    command: bash -lc "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
  strapi:
    build: ./apps/cms-strapi
    environment:
      APP_KEYS: k1,k2,k3,k4
      API_TOKEN_SALT: token
      ADMIN_JWT_SECRET: admin
      JWT_SECRET: jwt
      DATABASE_URL: postgresql://postgres:postgres@db:5432/postgres?sslmode=disable
    ports: ["1337:1337"]
    depends_on: [db]
  next:
    build: ./apps/frontend-next
    environment:
      NEXT_PUBLIC_API_BASE: http://localhost:8000
      NEXT_PUBLIC_CMS_BASE: http://localhost:1337
    ports: ["3000:3000"]

```

Run:

```bash
docker compose up --build

```

---

## Phase 16 — Make it a reusable blueprint (spin up more sites)

For a new site **brandx**:

```bash
export SITE_ID="brandx"
export ENV="prod"
export DOMAIN_ROOT="${SITE_ID}.${PARENT_ZONE}"
export API_HOST="api.${DOMAIN_ROOT}"
export CMS_HOST="cms.${DOMAIN_ROOT}"

# Copy the site folder
cp -R infra/sites/projektbezkodu-dev infra/sites/${SITE_ID}-${ENV}
# Edit infra/sites/${SITE_ID}-${ENV}/terraform.tfvars with new values (domain_root, branch, …)

# Initialize state for that stack (use a different state key)
cd infra/sites/${SITE_ID}-${ENV}
terraform init -backend-config=backend.hcl
terraform apply -target=module.ecr -auto-approve
# Build+push images tagged ${SITE_ID}-${ENV}-django / strapi
# Then full apply + DB init + secrets + ECS restart, same as above

```

---

# Final checklist (one page)

- [ ]  **Tools installed** (Node 22, Python 3.12, Terraform, AWS CLI, Docker)
- [ ]  **Monorepo created** with `apps/frontend-next`, `apps/backend-django`, `apps/cms-strapi`
- [ ]  **Tailwind v4** wired in Next; **Django** health route added; **Strapi** S3 provider + `/_health` route added
- [ ]  **Dockerfiles** placed for all three apps
- [ ]  **Terraform** modules + site stack copied; backend state bucket & lock table created
- [ ]  **Terraform (target ECR)** applied; **images** built & pushed
- [ ]  **Terraform (full)** applied (VPC, RDS, ECS, ALBs, S3, Amplify, DNS, ACM)
- [ ]  **DBs/users** created via **RDS Query Editor v2**
- [ ]  **Secrets** stored in **Secrets Manager** (`DATABASE_URL`, `SECRET_KEY`, Strapi keys, `ALLOWED_HOSTS`)
- [ ]  **ECS services** restarted (**force new deployment**)
- [ ]  **Amplify build** finished; frontend up at `https://${DOMAIN_ROOT}`
- [ ]  **Smoke tests**:
    - `https://${API_HOST}/healthz/` → `{ ok: true }`
    - `https://${CMS_HOST}/_health` → `{ ok: true }`
    - Frontend fetches from CMS/API
- [ ]  **Content** created in Strapi → visible on frontend
- [ ]  **(Optional)** CI/CD via GitHub OIDC pushing to ECR & redeploying ECS

If you want me to tailor the commands to **your exact repo name/ARNs** and pre‑generate the **tfvars**, **backend.hcl**, and a **GitHub Actions** workflow (build + deploy), I can output those immediately with your current variables so you can paste‑and‑go.