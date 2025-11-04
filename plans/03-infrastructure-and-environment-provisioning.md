# Infrastructure & Environment Provisioning Plan

## Purpose
Deliver and maintain the AWS/Terraform infrastructure required for each affiliate site environment (dev, staging, prod) using reusable modules.

## Status Snapshot
- **Last reviewed:** _(update when editing)_
- **Primary owner:** _(assign)_

## Objectives
1. Finalize Terraform state backend, variable sets, and module baselines.
2. Provision core AWS resources (VPC, RDS, ECS, ALBs, S3, Amplify, Route 53, ACM) per environment.
3. Establish processes for repeatable site creation and environment parity.

## Action Items

### Immediate (Week 0-1)
- [ ] Configure Terraform backend bucket + DynamoDB lock table (document names/regions).
- [ ] Populate `terraform.tfvars` and `backend.hcl` for `infra/sites/projektbezkodu-dev`.
- [ ] Ensure AWS CLI profile/SSO access is ready; reuse scripts in `Playbook/aws_cli.md` before Terraform work.
- [ ] Run targeted `terraform apply` for ECR repositories to unblock image pushes.
- [ ] Capture outputs (RDS endpoint, ECS cluster/service ARNs) for downstream teams.

### Near Term (Weeks 1-4)
- [ ] Complete full stack apply for dev; verify resources exist and tag compliance.
- [ ] Create Secrets Manager placeholder secrets and ensure ARNs line up with application expectations.
- [ ] Define plan for staging/prod environments (naming, capacity, Multi-AZ settings).
- [ ] Template instructions for new site provisioning (copy site folder, adjust vars, apply).
- [ ] Implement automated drift detection (e.g., scheduled `terraform plan` with notifications).

### Ongoing
- [ ] Review module versions and AWS provider upgrades quarterly.
- [ ] Track cost impacts of infrastructure changes; align with budgets.
- [ ] Maintain diagram of network/security group relationships.
- [ ] Document any manual AWS console changes and back-port into Terraform.

## Risks & Mitigations
- **Terraform state divergence:** enforce review workflow and remote backend.
- **Credential leakage:** restrict secrets handling to CI/CD or `aws secretsmanager` CLI usage.
- **Infra drift:** schedule periodic plan/apply checks.

## Upcoming Environment Rollouts
- _(list upcoming envs: e.g., prod target date, additional brand launches)_

## References
- `README.md`
- `Playbook/main_playbook.md`
- `Playbook/step_by_step.md`
- `Playbook/docker.md`
- `Playbook/terraform.md`
- `Playbook/aws_cli.md`
