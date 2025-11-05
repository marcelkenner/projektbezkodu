# Brand System Backup Policy

## Scope

- Figma library “ProjektBezKodu Brand”
- `/brand/` repository assets (logos, icons, tokens, changelog)
- Documentation (`docs/brand/*.md`, `docs/brand_design_system*.md`)
- Tracking board exports (Notion/Jira/Linear)

## Responsibilities

- **Project manager**: ensures backups happen on schedule, records status.
- **Brand/design lead**: exports Figma library and verifies integrity.
- **DevOps/IT**: confirms repository backups/mirrors are healthy.

## Schedule

- **Weekly**
  - Export Figma `.fig` snapshot and upload to secure drive (`TODO: add location`).
  - Archive board snapshot (PDF/CSV) and store with matching version.
- **Monthly**
  - Verify git remote backups (e.g., GitHub mirror) and document in log.
  - Trigger automated integrity check for asset files (hash comparison).
- **Pre-release (every version)**
  - Confirm latest assets in `/brand/` committed.
  - Store release bundle (tokens, docs, changelog) in archive folder.

## Storage Locations

- `Secure Drive URL: __________________`
- `/brand/figma-exports/` (checked into repo or stored in encrypted storage).
- External backup (e.g., S3 bucket, company NAS) – record bucket/path and access roles.

## Verification

- Maintain `docs/brand/backup-log.md` (create if missing) noting date, performer, files, and verification result.
- Quarterly restore test:
  - Import Figma backup into sandbox account.
  - Clone repo from backup mirror and run Storybook build.
  - Document findings in backup log.

## Incident Response

- Notify stakeholders via agreed channel within 2 hours of data loss.
- Escalate to DevOps/IT for recovery steps.
- Post-mortem to capture root cause, remediation, and policy updates.
