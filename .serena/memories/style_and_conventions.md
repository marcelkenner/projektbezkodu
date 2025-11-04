# Style and Conventions
- Follow framework defaults: Next.js with Tailwind CSS v4; Django with standard settings plus `/healthz/` endpoint; Strapi v5 with S3 provider.
- No explicit repo-wide lint/format rules yet; rely on framework tooling (Next.js ESLint defaults, Django conventions, Strapi TypeScript/JavaScript defaults).
- Secrets must never be committed; always use AWS Secrets Manager per playbooks.