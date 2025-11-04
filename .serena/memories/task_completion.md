# Task Completion Checklist
- Validate relevant Terraform plans/applies complete without errors when infrastructure changes are involved.
- Build and push updated Docker images to ECR, then trigger ECS service redeploy if app changes affect runtime.
- Run smoke tests against `/healthz/`, `/_health`, and frontend endpoints after deployments.
- Update plan documents under `plans/` and associated playbooks when scope/process changes.
- Document any manual AWS console actions so they can be back-ported into Terraform.