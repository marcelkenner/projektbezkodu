resource "aws_amplify_app" "this" {
  name         = var.app_name
  repository   = var.repo_url
  access_token = var.access_token
  platform     = "WEB_COMPUTE"
  build_spec = <<-YAML
version: 1
applications:
  - appRoot: apps/frontend-next
    frontend:
      phases:
        preBuild:
          commands:
            - nvm use 22 || nvm install 22
            - corepack enable || true
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: ./.next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
YAML
  environment_variables = var.env_vars
}

resource "aws_amplify_branch" "branch" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.branch
  enable_auto_build = true
  stage = "PRODUCTION"
}

resource "aws_amplify_domain_association" "domain" {
  app_id      = aws_amplify_app.this.id
  domain_name = var.custom_domain
  depends_on  = [aws_amplify_branch.branch]
  sub_domain {
    branch_name = var.branch
    prefix      = ""
  }
}

output "amplify_app_id" { value = aws_amplify_app.this.id }
output "domain_status"  { value = aws_amplify_domain_association.domain.status }
