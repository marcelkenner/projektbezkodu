# Brand System Versioning & Release Process

## Semantic Versioning

- **Major (X.0.0)**: breaking visual language changes (new typography families, palette shifts), component API changes, or governance overhauls.
- **Minor (0.Y.0)**: new components, templates, or tokens that are backwards compatible.
- **Patch (0.0.Z)**: bug fixes, accessibility improvements, documentation tweaks without visual/API changes.

## Repository Workflow

1. Create a release branch: `git checkout -b release/brand-system-vX.Y.Z`.
2. Update `/brand/CHANGELOG.md` with entries under `## [vX.Y.Z] - YYYY-MM-DD`.
3. Ensure Storybook/docs reflect changes.
4. Request reviews per approval matrix.
5. Merge release branch → `main` once approved.
6. Tag commit: `git tag brand-system-vX.Y.Z && git push origin brand-system-vX.Y.Z`.

## Figma Workflow

- Publish components/tokens under matching version name (`vX.Y.Z`).
- Export `.fig` snapshot to `/brand/figma-exports/ProjektBezKodu-Brand-vX.Y.Z.fig`.
- Update library release notes with summary + implementation guidance.

## Communication

- Post release summary in team channel:
  - Highlights
  - Impacted teams
  - Upgrade instructions
  - Links to PR, Storybook, Figma changelog
- Update `docs/brand/index.md` if new artefacts added.

## Rollback Procedure

- Revert to previous git tag: `git checkout brand-system-vPREV`.
- Restore prior Figma published version (via Library → Versions).
- Communicate rollback rationale and next steps within one business day.
