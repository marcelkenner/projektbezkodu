# Expansion & Optimization Plan

## Purpose
Guide future growth, multi-site rollout, performance tuning, and product enhancements beyond the initial launch.

## Status Snapshot
- **Last reviewed:** _(update when editing)_
- **Primary owner:** _(assign)_

## Objectives
1. Provide a repeatable checklist for launching additional affiliate sites/environments.
2. Identify optimization opportunities across cost, performance, and developer experience.
3. Track strategic roadmap items and experiments.

## Action Items

### Immediate (Week 0-1)
- [ ] Document criteria for “launch-ready” status (features, monitoring, support).
- [ ] Outline process for cloning `infra/sites/<site>-<env>` with required variables and naming.
- [ ] Capture any shared resources (VPC reuse vs. isolation) decisions and trade-offs.

### Near Term (Weeks 1-4)
- [ ] Build automation/script to scaffold a new site stack (copy templates, update tfvars, prompt for domains).
- [ ] Evaluate database strategy (per-site RDS vs shared cluster) and document recommendation.
- [ ] Plan performance/load testing regimen for API and frontend.
- [ ] Explore CDN/image optimization enhancements and caching strategies.

### Ongoing
- [ ] Maintain roadmap of feature iterations, A/B tests, or CMS schema evolution.
- [ ] Track cost/performance metrics for existing sites; feed lessons into new launches.
- [ ] Revisit automation to reduce manual steps (e.g., GitHub repo templating, secrets population).

## Future Ideas & Parking Lot
- Use this section to list deferred initiatives with owners/blocked reasons.
- Example placeholders:
  - Multi-tenant Strapi with role-based content segmentation.
  - Centralized analytics pipeline for affiliate conversions.
  - Infrastructure blue/green deployments or canary releases.

## References
- `README.md`
- `Playbook/main_playbook.md`
- `Playbook/step_by_step.md`
- `Playbook/docker.md`
- `Playbook/terraform.md`
