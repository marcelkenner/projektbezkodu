# AWS Static Site Hosting Plan

> Tracking document for the AWS infrastructure that serves the Projekt No-code static front-end. Update status checkboxes as work progresses.

---

## 0. References & Source Material

- `docs/aws_setup.md` – baseline CLI workflow for S3 + CloudFront + ACM + Route 53.
- `docs/aws_stack.md` – summary of required AWS services.
- AWS docs: ACM in `us-east-1` for CloudFront certificates, CloudFront Origin Access Control (OAC), managed caching policy `658327ea-f89d-4fab-a63d-7e88639e58f6`.

---

## 1. Objectives & Scope

- Deliver a **static-site hosting stack**: S3 (private) + CloudFront (HTTPS) + ACM cert + optional Route 53 DNS.
- Ensure **repeatable provisioning** with documented CLI steps and room for future IaC (e.g., Terraform, CDK).
- Cover **operational lifecycle**: provisioning, validation, deployment, monitoring, and cost controls.
- Single environment (production) for now; note deltas if staging is later required.

---

## 2. Pre‑Flight Checklist (Complete Before Touching AWS)

- [ ] Confirm AWS account ID and administrator profile (`AdministratorAccess-869603330574` per docs) still valid.
- [ ] Verify CLI workstation has `aws`, `jq`, `bash`, `date`, and access to the repository.
- [ ] Capture domain ownership: `projektbezkodu.pl` managed in Route 53? (If external DNS, plan manual CNAME creation.)
- [ ] Decide whether the live hostname is `www.projektbezkodu.pl` (recommended) or apex domain.
- [ ] Ensure budget notifications are configured for the account (existing or new alert?).
- [ ] Record stakeholders for approvals (product, infra, content publisher).

---

## 3. Environment Variables & Shared Constants

- [ ] Populate `.env.aws` (git‑ignored) with:
  ```
  DOMAIN="projektbezkodu.pl"
  HOST="www.projektbezkodu.pl"
  REGION="eu-central-1"
  CERT_REGION="us-east-1"
  BUCKET="site-projektbezkodu-pl"
  PROFILE="AdministratorAccess-869603330574"
  ```
- [ ] Validate `BUCKET` uniqueness (globally) before creation.
- [ ] Decide on object ownership setting (expect bucket owner preferred).

---

## 4. Provisioning Phases

### Phase 4.1 – S3 Bucket (Private Origin)

- [ ] Run `create-bucket` with region conditional (per script in `aws_setup.md`).
- [ ] Apply public access block; confirm effective policy denies everyone.
- [ ] Enable default encryption (SSE-S3) for objects.
- [ ] (Optional) Enable versioning if rollback support is desired; document decision.
- [ ] Tag bucket with `Project=ProjektBezKodu`, `Environment=prod`, `Owner=...`.
- [ ] Record bucket ARN for later policy authoring.

### Phase 4.2 – ACM Certificate (us-east-1)

- [ ] Request cert for `HOST` plus SAN `DOMAIN`.
- [ ] Export validation CNAMEs to `rr.json` (script already in docs).
- [ ] If Route 53 hosts the zone:
  - [ ] Resolve hosted zone ID via CLI.
  - [ ] UPSERT validation records using provided loop.
- [ ] If external DNS:
  - [ ] Copy `Name/Type/Value` to handoff doc for registrar.
  - [ ] Track follow-up owner + ETA.
- [ ] Monitor `Certificate.Status` until `ISSUED` (loop or manual check).
- [ ] Store ACM ARN for CloudFront usage.

### Phase 4.3 – CloudFront Origin Access Control

- [ ] Create OAC (`cloudfront create-origin-access-control`) using `oac.json`.
- [ ] Record OAC ID; ensure naming matches plan (`oac-static-site`).
- [ ] No legacy Origin Access Identity required-confirm no conflicting config.

### Phase 4.4 – CloudFront Distribution

- [ ] Prepare `dist.json` with:
  - [ ] `CallerReference` unique timestamp.
  - [ ] `Aliases` containing `HOST`.
  - [ ] `DefaultRootObject` `index.html`.
  - [ ] `CachePolicyId` `658327ea-f89d-4fab-a63d-7e88639e58f6`.
  - [ ] `ViewerCertificate` referencing ACM ARN (`us-east-1`).
  - [ ] `CustomErrorResponses` mapping 404→200 for SPA fallback.
  - [ ] `PriceClass_100` for cost optimization.
- [ ] Execute `cloudfront create-distribution` and capture `DIST_ID`/`CF_DOMAIN`.
- [ ] Wait for distribution status `Deployed` before DNS cutover (can parallelize with bucket policy).
- [ ] Document expected propagation time (15–30 minutes).

### Phase 4.5 – S3 Bucket Policy for OAC

- [ ] Craft `bucket-policy.json` binding CloudFront service principal + distribution ARN.
- [ ] Apply policy; run `aws s3api get-bucket-policy` to verify.
- [ ] Ensure no public ACLs exist (`aws s3api get-bucket-acl` check).
- [ ] Consider enabling S3 access logs (optional) to a separate logging bucket.

### Phase 4.6 – DNS (Route 53 or External)

- [ ] If Route 53:
  - [ ] UPSERT `A` Alias pointing to `CF_DOMAIN` (HostedZoneId `Z2FDTNDATAQYW2`).
  - [ ] (Optional) Create matching `AAAA` alias.
  - [ ] Ensure apex (`projektbezkodu.pl`) redirects to `www` (S3 redirect bucket or Route 53 alias to CloudFront with alternate behavior) – log decision.
- [ ] If external DNS:
  - [ ] Supply CloudFront target domain to registrar, confirm TTL ≤300s.
  - [ ] Track confirmation.

---

## 5. Deployment Workflow (Application Team)

- [ ] Next.js configured with `output: 'export'` in `apps/frontend-next/next.config.js`.
- [ ] Build command: `npm ci && npm run build` (produces `out/`).
- [ ] Sync to S3: `aws --profile $PROFILE s3 sync ./out/ s3://$BUCKET/ --delete`.
- [ ] Post-deploy invalidation: `aws --profile $PROFILE cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"`.
- [ ] Document how to stage changes (optional preview bucket/distribution?).
- [ ] Capture deployment checklist for content releases.

---

## 6. Validation & QA

- [ ] Confirm `https://$HOST` serves latest build (check headers for `Via: CloudFront`).
- [ ] Run `aws cloudfront get-distribution` to ensure `Enabled` true.
- [ ] Validate S3 block public access remains true.
- [ ] Test 404 fallback by requesting nonexistent path (`/non-existent` → returns SPA root).
- [ ] Use `dig` or `nslookup` to confirm DNS propagation.
- [ ] Optional: run `lighthouse` / `webpagetest` to benchmark after CDN enablement.

---

## 7. Monitoring, Logging, and Cost Controls

- [ ] Enable CloudWatch metric alarms (4xx, 5xx error rate thresholds).
- [ ] Decide on CloudFront access logs or standard logging (disabled by default).
- [ ] Review AWS Budgets / Cost Explorer alerts for monthly limits.
- [ ] Document runbook for certificate renewal (ACM auto-renews; ensure DNS records persist).
- [ ] Outline incident response (who to ping when site down).

---

## 8. Future Enhancements (Backlog)

- [ ] Infrastructure as Code (Terraform/CDK) for reproducibility.
- [ ] CI/CD pipeline: GitHub Actions → S3 sync + CloudFront invalidation.
- [ ] Staging environment with alternate bucket/distribution + password protection.
- [ ] Lambda@Edge or CloudFront Functions for redirects/headers if needed.
- [ ] Contact form integration (API Gateway + Lambda) – optional later.

---

## 9. Status Tracking

- Maintain one of: `Not Started`, `In Progress`, `Blocked`, `Done` beside each major phase in this document.
- Update checkboxes after every run to keep audit trail.
