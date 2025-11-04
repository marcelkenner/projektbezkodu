# Application Development Plan

## Purpose
Coordinate work across the three application components—Next.js frontend, Django API, and Strapi CMS—ensuring feature parity, shared contracts, and developer experience.

## Status Snapshot
- **Last reviewed:** _(update when editing)_
- **Primary owners:** Frontend _(assign)_, Backend _(assign)_, CMS _(assign)_

## Objectives
1. Deliver production-ready implementations of each app with consistent health checks and observability hooks.
2. Maintain shared domain models and API contracts between Django and Strapi.
3. Provide a clear local development workflow (Docker Compose or dev containers).

## Action Items

### Immediate (Week 0-1)
- [ ] Audit current app directories (`apps/frontend-next`, `apps/backend-django`, `apps/cms-strapi`) for scaffold completeness.
- [ ] Define MVP feature scope for launch (content types, API endpoints, frontend pages).
- [ ] Set up linting/formatting and basic unit tests for each app.
- [ ] Implement required health endpoints (`/healthz/`, `/_health`).

### Near Term (Weeks 1-4)
- [ ] Build demo content models in Strapi and seed scripts for test data.
- [ ] Implement API authentication + CORS/CSRF configuration aligned with production hosts.
- [ ] Connect frontend to API/CMS via environment-driven configuration; add error handling states.
- [ ] Create local Docker Compose for full-stack development and document usage.
- [ ] Add migration strategy: Django migrations + Strapi content type lifecycle notes.

### Ongoing
- [ ] Track tech debt/backlog items in issue tracker; link references here.
- [ ] Maintain component READMEs with developer setup/testing steps.
- [ ] Monitor dependency updates (Next, Tailwind, Django, Strapi) and schedule upgrades.

## Cross-Team Dependencies
- Requires Secrets Manager values, RDS connectivity, and S3 buckets from infrastructure plan.
- Coordinate release cadence with CI/CD plan.

## Upcoming Milestones
- _(list upcoming releases, beta dates, etc.)_

## References
- `README.md`
- `Playbook/main_playbook.md`
- `Playbook/step_by_step.md`
- `Playbook/docker.md`
- `Playbook/terraform.md`
- `Playbook/aws_cli.md`
