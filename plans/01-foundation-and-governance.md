# Foundation & Governance Plan

## Purpose
Establish the base capabilities required to run the affiliate stack project successfully: environment access, tooling, team processes, and documentation practices.

## Status Snapshot
- **Last reviewed:** _(update when editing)_
- **Primary owner:** _(assign)_

## Objectives
1. Ensure every contributor has the required tooling, credentials, and workspace configuration.
2. Define governance around secrets, environments, and infrastructure access.
3. Capture working agreements and documentation standards for the project.

## Action Items

### Immediate (Week 0-1)
- [ ] Confirm AWS account ownership, billing alerts, and MFA coverage.
- [ ] Finalize region strategy (e.g., `us-east-1` for stack + `us-east-1` for CloudFront certs).
- [ ] Collect IAM users/roles requiring access and map least-privilege policies.
- [ ] Validate local workstation setup (Node 22, Python 3.12, Terraform ≥1.6, AWS CLI v2, Docker, `aws configure`).
- [ ] Document `.env`/secret handling rules and repository contribution guidelines.

### Near Term (Weeks 1-4)
- [ ] Stand up shared knowledge base (link README, Playbook, and these plans).
- [ ] Define branching strategy + PR review expectations.
- [ ] Establish backup contacts and escalation paths for production issues.
- [ ] Draft cost guardrails (budgets/alerts) and owner responsibilities.

### Ongoing
- [ ] Schedule quarterly access reviews for AWS/IaC secrets.
- [ ] Keep dependency/tooling versions current; record upgrades here.
- [ ] Update working agreements after retrospectives or process changes.

## Risks & Notes
- Unmanaged credentials or unclear ownership will block later phases.
- Align governance updates with security policies before enabling CI/CD.

## Upcoming Review Date
- _(set a calendar reminder and update each pass)_

## References
- `README.md`
- `Playbook/main_playbook.md`
- `Playbook/step_by_step.md`
- `Playbook/docker.md`
- `Playbook/terraform.md`
