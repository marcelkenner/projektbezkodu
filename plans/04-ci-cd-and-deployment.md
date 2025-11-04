# CI/CD & Deployment Plan

## Purpose
Define how code moves from commit to production across applications and infrastructure, ensuring safe, auditable releases.

## Status Snapshot
- **Last reviewed:** _(update when editing)_
- **Primary owner:** _(assign)_

## Objectives
1. Implement GitHub Actions (or equivalent) workflows for building/pushing images and triggering ECS/Amplify deployments.
2. Leverage AWS IAM OIDC integration to avoid long-lived deploy keys.
3. Codify deployment runbooks, approvals, and rollback procedures.

## Action Items

### Immediate (Week 0-1)
- [ ] Document required GitHub repositories and branches per environment.
- [ ] Create IAM role/policies for GitHub OIDC with least privilege (ECR push, ECS update, Amplify).
- [ ] Draft CI workflow skeleton covering build, unit tests, docker push, and ECS deployment.
- [ ] Decide on infrastructure pipeline strategy (manual `terraform apply` vs. automated).

### Near Term (Weeks 1-4)
- [ ] Add automated test suites (lint/unit/integration) to workflows with gating rules.
- [ ] Configure environment protection rules/reviewers for prod deploys.
- [ ] Implement ECS one-off task trigger for Django migrations before each deploy.
- [ ] Integrate Amplify build notifications and status checks into PR flow.
- [ ] Document rollback steps (retag previous image, redeploy, revert tf changes).

### Ongoing
- [ ] Monitor workflow runtimes and costs; optimize caching/buildx usage.
- [ ] Review IAM permissions and rotate GitHub secrets quarterly.
- [ ] Update pipelines when new services/environments are added.

## Release Calendar & Change Management
- [ ] Maintain upcoming release schedule here.
- [ ] Capture post-deployment reviews and lessons learned.

## Tooling Links
- GitHub Actions workflow location: `.github/workflows/`
- AWS Change Management tickets: _(link if applicable)_

## References
- `README.md`
- `Playbook/main_playbook.md`
- `Playbook/step_by_step.md`
- `Playbook/docker.md`
- `Playbook/terraform.md`
