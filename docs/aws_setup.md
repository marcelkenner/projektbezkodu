Got it-if this is **just a simple content site**, let’s strip it down to the essentials so you don’t pay for idle compute or databases.

---

## Minimal, low‑cost AWS architecture (recommended)

**Components only:**

- **S3** bucket for static files (HTML/CSS/JS/images)
- **CloudFront** CDN in front (HTTPS, caching, global delivery)
- **ACM** public certificate (for your domain; must be in **us‑east‑1** for CloudFront) ([AWS Documentation][1])
- **Route 53** DNS (optional-use your current DNS if you prefer)

**Not used:** VPC, NAT, ECS, ECR, RDS, Lambda, Strapi, Django-none of that is needed for a static site.

**Why CloudFront instead of S3 website endpoint?** You get HTTPS on your own domain, better performance, and the option to restrict S3 access privately via **Origin Access Control (OAC)** so the bucket isn’t public. ([AWS Documentation][2])

---

## One‑time setup (AWS CLI, Linux)

> Replace values in the **vars** block and run step‑by‑step.

```bash
# ── vars ─────────────────────────────────────────────────────────
export DOMAIN="projektbezkodu.pl"           # root domain in Route 53 (or your DNS)
export HOST="www.projektbezkodu.pl"         # the hostname you’ll serve the site on
export REGION="eu-central-1"          # where the S3 bucket lives
export CERT_REGION="us-east-1"        # must be us-east-1 for CloudFront cert
export BUCKET="site-projektbezkodu-pl"      # any unique name (doesn't have to match HOST)
export PROFILE="AdministratorAccess-869603330574"   # AWS CLI profile to use (SSO or keys)
# ─────────────────────────────────────────────────────────────────

# 1) Create S3 bucket (private, block public access)
if [ "$REGION" = "us-east-1" ]; then
  aws --profile $PROFILE s3api create-bucket --bucket $BUCKET --region us-east-1
else
  aws --profile $PROFILE s3api create-bucket --bucket $BUCKET --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION
fi

aws --profile $PROFILE s3api put-public-access-block --bucket $BUCKET \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# 2) Request ACM certificate (in us-east-1) for HOST (+ optional alt-name DOMAIN)
CERT_ARN=$(aws --profile $PROFILE --region $CERT_REGION acm request-certificate \
  --domain-name "$HOST" --validation-method DNS \
  --subject-alternative-names "$DOMAIN" \
  --query CertificateArn --output text)

echo "CERT_ARN=$CERT_ARN"
# Create the DNS validation CNAMEs in your DNS (Route 53 example):
HZ_ID=$(aws --profile $PROFILE route53 list-hosted-zones-by-name --dns-name "$DOMAIN" --query "HostedZones[0].Id" --output text)
aws --profile $PROFILE --region $CERT_REGION acm describe-certificate --certificate-arn $CERT_ARN \
  --query "Certificate.DomainValidationOptions[].ResourceRecord" --output json > rr.json

# rr.json contains one or more {Name,Type,Value}. Apply them:
jq -r '.[] | "\(.Name) \(.Type) \(.Value)"' rr.json | while read NAME TYPE VALUE; do
cat > change.json <<EOF
{"Comment":"ACM validation","Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"$NAME","Type":"$TYPE","TTL":300,"ResourceRecords":[{"Value":"$VALUE"}]}}]}
EOF
aws --profile $PROFILE route53 change-resource-record-sets --hosted-zone-id "$HZ_ID" --change-batch file://change.json >/dev/null
done
echo "Waiting for ACM validation… (you can continue; distribution creation will fail until validated)"
# You can check with:
# aws --profile $PROFILE --region $CERT_REGION acm describe-certificate --certificate-arn $CERT_ARN --query "Certificate.Status"

# 3) Create CloudFront Origin Access Control (OAC)
cat > oac.json <<'EOF'
{
  "OriginAccessControlConfig": {
    "Name": "oac-static-site",
    "Description": "OAC for static site",
    "SigningProtocol": "sigv4",
    "SigningBehavior": "always",
    "OriginAccessControlOriginType": "s3"
  }
}
EOF
OAC_ID=$(aws --profile $PROFILE cloudfront create-origin-access-control \
  --origin-access-control-config file://oac.json \
  --query 'OriginAccessControl.Id' --output text)
echo "OAC_ID=$OAC_ID"

# 4) Create CloudFront distribution (price optimized, HTTPS, SPA-friendly 404→index.html)
ACCOUNT_ID=$(aws --profile $PROFILE sts get-caller-identity --query Account --output text)
CALLER_REF="cf-$(date +%s)"
cat > dist.json <<EOF
{
  "CallerReference": "$CALLER_REF",
  "Comment": "Static site: $HOST",
  "Enabled": true,
  "Aliases": { "Quantity": 1, "Items": ["$HOST"] },
  "PriceClass": "PriceClass_100",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "s3-$BUCKET",
      "DomainName": "$BUCKET.s3.$REGION.amazonaws.com",
      "S3OriginConfig": { "OriginAccessIdentity": "" },
      "OriginAccessControlId": "$OAC_ID"
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-$BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET","HEAD"] },
    "CachedMethods": { "Quantity": 2, "Items": ["GET","HEAD"] },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html",
      "ErrorCachingMinTTL": 0
    }]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "$CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}
EOF

DIST_ID=$(aws --profile $PROFILE cloudfront create-distribution \
  --distribution-config file://dist.json \
  --query 'Distribution.Id' --output text)
CF_DOMAIN=$(aws --profile $PROFILE cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName' --output text)
echo "DIST_ID=$DIST_ID  CF_DOMAIN=$CF_DOMAIN"

# 5) Lock the S3 bucket to only this CloudFront distribution (OAC policy)
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontReadViaOAC",
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET/*",
    "Condition": { "StringEquals": { "AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DIST_ID" } }
  }]
}
EOF
aws --profile $PROFILE s3api put-bucket-policy --bucket "$BUCKET" --policy file://bucket-policy.json

# 6) (Optional) Create DNS alias record to CloudFront
cat > a-record.json <<EOF
{"Comment":"Alias $HOST to CloudFront","Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"$HOST","Type":"A","AliasTarget":{"HostedZoneId":"Z2FDTNDATAQYW2","DNSName":"$CF_DOMAIN","EvaluateTargetHealth":false}}}]}
EOF
aws --profile $PROFILE route53 change-resource-record-sets --hosted-zone-id "$HZ_ID" --change-batch file://a-record.json
```

- **OAC bucket policy** above follows AWS’s recommended pattern (CloudFront service principal + `AWS:SourceArn` of your distribution). ([AWS Documentation][2])
- **ACM certificate** must be in **us‑east‑1** for CloudFront. ([AWS Documentation][1])
- **PriceClass_100** limits edges to US/Canada/Europe/Israel to cut costs if your audience is there. ([Amazon Web Services, Inc.][3])
- **Managed cache policy** `CachingOptimized` ID used above is the official AWS‑managed policy. ([AWS Documentation][4])

---

## Deploy content (build → upload → invalidate)

If you’re using **Next.js** and can export a static site:

```bash
# in apps/frontend-next
# next.config.js -> module.exports = { output: 'export' }
npm ci && npm run build
# Next.js exports to 'out/' by default
aws --profile $PROFILE s3 sync ./out/ s3://$BUCKET/ --delete
aws --profile $PROFILE cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

For any static site (Hugo, Jekyll, plain HTML), upload your build folder the same way.

---

## Cost‑saving defaults (keep it lean)

- **No servers** (no ECS/EC2/Lambda/RDS).
- **CloudFront price class** set to `PriceClass_100` (can widen later). ([Amazon Web Services, Inc.][3])
- **Logging disabled** (turn on later if needed).
- **Cache everything** with the managed `CachingOptimized` policy-use **invalidations** after deploys instead of low TTLs. ([AWS Documentation][4])
- **Private S3 + OAC** (no public bucket). ([AWS Documentation][2])

That’s it-the simplest possible, production‑grade static hosting on AWS. If you later need light dynamic features (contact form, newsletter), we can add a **single** Lambda + API Gateway HTTP API without touching this core.
