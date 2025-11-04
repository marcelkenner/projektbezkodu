# Suggested Commands
- `terraform init && terraform apply` (run within `infra/sites/<site>-<env>` to provision infrastructure).
- `docker build -t <tag> apps/backend-django` and similar for Strapi/Next to create container images.
- `aws secretsmanager put-secret-value ...` to populate Secrets Manager values after Terraform.
- `aws ecs update-service --cluster <cluster> --service <service> --force-new-deployment` to roll services.
- Local dev: `docker compose up --build` (if using provided compose template) or framework-specific dev servers (`npm run dev` for Next.js, `python manage.py runserver` for Django, `yarn develop` for Strapi).
- `aws configure` to set credentials on a new workstation.