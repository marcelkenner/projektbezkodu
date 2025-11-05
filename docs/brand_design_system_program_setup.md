# Program Setup & Governance - Execution Guide

This document operationalises **Section 1** of `brand_design_system_plan.md`. Use it to capture decisions, owners, and artefacts required before moving to design or engineering work.

---

## 1. Initiative Definition

- **Working title**: `ProjektBezKodu Brand System v1.0.0`
- **Problem statement**: unify visual + content experience across templates, tutorials, marketing site, and social artefacts while meeting accessibility and performance targets defined in `brand_design_system.md`.
- **Success criteria**:
  1. All production pages pull from shared tokens/components (no ad-hoc styles).
  2. Accessibility audits pass (WCAG AA contrast, keyboard navigation).
  3. Brand assets (logos, icons, social templates) live in `/brand/` and Figma library with clear usage notes.
- **Target launch window**: **2024-07-15 (target)** - confirm feasibility during kickoff and adjust if scope expands.
- **Budget/time constraints**: note resource limits, sprint allocations, or contractor involvement.

> Action: capture confirmed launch date and resource bounds here once the project sponsor signs off.

---

## 2. Stakeholder Registry

Populate the table once roles are assigned. Avoid leaving cells blank; if a role is unfilled, record “Unassigned” and open a follow-up task.

| Role                   | Name                    | Responsibilities                          | Availability            | Notes                                                |
| ---------------------- | ----------------------- | ----------------------------------------- | ----------------------- | ---------------------------------------------------- |
| Executive sponsor      | Marcel (Founder)        | Approves scope, budget, launch gate       | Weekly checkpoint       | Confirm delegate when unavailable                    |
| Brand/design lead      | Magda Nowak (Freelance) | Owns Figma library, visual QA             | Mon–Thu 09:00–15:00 CET | Contract signature pending                           |
| Front-end lead         | Piotr Zieliński         | Integrates tokens/components into Next.js | Full-time               | Coordinates with content scaffolding team            |
| Content/SEO lead       | Agnieszka Lewandowska   | Maintains copy voice, SEO compliance      | Tue–Fri mornings        | Oversees affiliate disclosures                       |
| Accessibility reviewer | Unassigned              | Runs audits, enforces WCAG                | -                       | Action: source external auditor or train team member |
| Project manager        | Marcel (acting)         | Maintains roadmap, sync notes             | Flexible                | Will delegate once PM hired                          |

> Action: complete the registry and link to each person’s primary Slack/Teams handle for quick approvals.

---

## 3. Delivery Cadence & Meetings

- **Kickoff**: 60 min meeting to align on goals, deliverables, and timeline; capture notes in `/docs/brand/kickoff-notes.md`.
- **Weekly stand-up**: 15 min asynchronous summary (Notion or Slack thread) covering progress, blockers, next steps.
- **Design/dev sync**: 30 min mid-sprint review of token updates, component definitions, and integration status.
- **Stakeholder review**: 45 min at major milestones (Design freeze, Dev freeze, Pre-launch QA).

> Action: create calendar invites or recurring Slack reminders; link to documentation spaces for notes.

---

## 4. Tracking Board Setup

Create a shared board (Notion, Jira, Linear) structured as:

Columns:

1. **Backlog**
2. **Ready**
3. **In Progress**
4. **Review**
5. **Blocked**
6. **Done**

Backlog epics (link each to relevant sections in `brand_design_system_plan.md`):

- Program setup (this section)
- Asset inventory
- Tokens & theming
- Typography & layout
- Components
- Templates & content patterns
- Integration & QA

Checklist to complete:

- [x] Board created and accessible to all stakeholders.
- [x] Custom fields: `Owner`, `Due date`, `Status`, `Dependencies`, `Figma link`, `Repo PR`.
- [ ] Automation: move items to “Review” when Git PR or Figma review requested.
- [ ] Document board URL here: `Board URL: https://notion.so/projektbezkodu/brand-system-v1-kanban (placeholder – replace with final workspace link)`.

---

## 5. Approval Workflow Definition

### Visual/Component Changes

1. Designer prepares change in Figma with before/after frames.
2. Accessibility reviewer checks contrast/focus compliance.
3. Front-end lead reviews implementation notes (tokens impacted, responsive behaviour).
4. Sponsor sign-off required for scope or brand deviations.

### Content Changes

1. Copywriter drafts update; attaches SEO checklist (metadata, internal linking, rel=\"sponsored\" for affiliates).
2. SEO lead verifies keyword and schema requirements.
3. Final approval documented in tracking board with comment.

Artifacts:

- [ ] Approval matrix stored at `/docs/brand/approvals.md`.
- [ ] Checklist templates for visual and content reviews.
- [ ] SLA agreed (e.g., approvals within 2 business days).

---

## 6. Versioning & Change Management

- **Repository**:
  - Add `/brand/CHANGELOG.md` with semantic version template:
    ```
    ## [v1.0.0] - YYYY-MM-DD
    ### Added
    - …
    ### Changed
    - …
    ### Fixed
    - …
    ```
  - Tag releases in git: `git tag brand-system-v1.0.0`.
  - Create `docs/brand/versioning.md` outlining tagging, release branch, and rollback steps.
- **Figma**:
  - Maintain “Published Versions” page with version numbers matching repo.
  - Export `.fig` snapshots to `/brand/figma-exports/` on each release.
- **Communication**:
  - Release notes posted in designated Slack/Teams channel with summary + next steps.

> Action: scaffold changelog and versioning docs early, even if entries are placeholders.

---

## 7. Backup & Disaster Recovery

- **Figma**:
  - Monthly export of entire library (`.fig` + PDF) stored in secure drive (link here).
  - Document restoration steps and access permissions.
- **Git**:
  - Ensure remote backups (GitHub/GitLab). If self-hosted, configure mirror or nightly backup.
  - Record repo backup policy in `/docs/brand/backup-policy.md`.
- **Knowledge base**:
  - Centralise links (Figma, board, docs) in `/docs/brand/index.md`.

Checklist:

- [ ] Figma export location documented.
- [ ] Repo backup strategy confirmed with DevOps/IT.
- [ ] Disaster recovery contact list captured.

---

## 8. Status Tracking

- Maintain this document alongside `brand_design_system_plan.md`.
- Update checkboxes with dates and owners.
- Flag blockers in the tracking board and reference ticket IDs here.

> Once all actions in this guide are complete, mark Section 1 of the master plan as done and move to Section 2.
