# Suggested Commands
- Run `Playbook/aws_cli.md` script (or source portions) to install tooling and configure AWS SSO/CLI profiles.
- `terraform init && terraform apply` (within `infra/sites/<site>-<env>` to provision infrastructure).
- `docker build -t <tag> apps/backend-django` and similar for Strapi/Next to create container images.
- `aws secretsmanager put-secret-value ...` to populate Secrets Manager values after Terraform.
- `aws ecs update-service --cluster <cluster> --service <service> --force-new-deployment` to roll services.
- Local dev: `docker compose up --build` (if using provided compose template) or framework-specific dev servers (`npm run dev`, `python manage.py runserver`, `yarn develop`).
- `aws configure sso` or supporting commands for authentication when not using the script.