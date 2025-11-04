Awesome—below is a **drop‑in Terraform stack** you can paste into a repo and `terraform apply` (after filling a few variables). It covers:

- **Networking**: VPC (2 AZs), public/private subnets, NAT/IGW
- **Database**: RDS PostgreSQL + parameter group forcing SSL
- **Secrets**: Secrets Manager “containers” for DB URL & app secrets (safe‑by‑default: creates the *secret objects* without storing values in state)
- **Containers**: ECR repos; ECS cluster; **two Fargate services** (Django @ :8000, Strapi @ :1337) each behind its own **ALB + ACM** (DNS‑validated)
- **Storage**: S3 buckets for Django static/media and Strapi media
- **Frontend**: Amplify Hosting (Next.js SSR) + domain association
- **DNS**: Route 53 alias records for the API (Django) and CMS (Strapi)

> Security note (important): This configuration does NOT put real secret values in Terraform state by default. It only creates the Secrets Manager secret objects and outputs their ARNs. Set the values securely later (Console/CLI/CI). For quick dev, you can enable “create initial secret versions” via variables—but don’t do that in prod unless you’re comfortable with secrets landing in TF state.
> 

---

## Folder layout

```
infra/
├─ sites/
│  └─ projektbezkodu-dev/
│     ├─ main.tf
│     ├─ variables.tf
│     ├─ outputs.tf
│     └─ terraform.tfvars.example
└─ modules/
   ├─ vpc/
   │  ├─ main.tf  ├─ variables.tf  └─ outputs.tf
   ├─ rds-postgres/
   │  ├─ main.tf  ├─ variables.tf  └─ outputs.tf
   ├─ secrets/
   │  ├─ main.tf  ├─ variables.tf  └─ outputs.tf
   ├─ ecr/
   │  ├─ main.tf  ├─ variables.tf  └─ outputs.tf
   ├─ ecs-cluster/
   │  ├─ main.tf  ├─ variables.tf  └─ outputs.tf
   ├─ ecs-service-alb/
   │  ├─ main.tf  ├─ variables.tf  └─ outputs.tf
   ├─ s3/
   │  ├─ main.tf  ├─ variables.tf  └─ outputs.tf
   └─ amplify-next/
      ├─ main.tf  ├─ variables.tf  └─ outputs.tf

```

> All files are below. Create them with the same paths.
> 

---

# modules/vpc

**modules/vpc/variables.tf**

```hcl
variable "name" { type = string }
variable "az_count" { type = number, default = 2 }
variable "cidr_block" { type = string, default = "10.30.0.0/16" }
variable "create_nat_gateway" { type = bool, default = true }

```

**modules/vpc/main.tf**

```hcl
resource "aws_vpc" "this" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = var.name }
}

data "aws_availability_zones" "available" {}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, var.az_count)
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.this.id
  tags = { Name = "${var.name}-igw" }
}

# Public subnets (one per AZ)
resource "aws_subnet" "public" {
  for_each = toset(local.azs)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.cidr_block, 4, index(local.azs, each.value))
  availability_zone       = each.value
  map_public_ip_on_launch = true
  tags = { Name = "${var.name}-public-${each.value}" }
}

# Private subnets (one per AZ)
resource "aws_subnet" "private" {
  for_each = toset(local.azs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.cidr_block, 4, 8 + index(local.azs, each.value))
  availability_zone = each.value
  tags = { Name = "${var.name}-private-${each.value}" }
}

# NAT gateway (single for cost, can extend to per-AZ)
resource "aws_eip" "nat" {
  count = var.create_nat_gateway ? 1 : 0
  domain = "vpc"
  tags = { Name = "${var.name}-nat-eip" }
}

resource "aws_nat_gateway" "nat" {
  count = var.create_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = element(values(aws_subnet.public)[*].id, 0)
  tags = { Name = "${var.name}-nat" }
  depends_on = [aws_internet_gateway.igw]
}

# Route tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  tags = { Name = "${var.name}-public-rt" }
}
resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_assoc" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id
  tags = { Name = "${var.name}-private-rt" }
}
resource "aws_route" "private_nat" {
  count = var.create_nat_gateway ? 1 : 0
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat[0].id
}

resource "aws_route_table_association" "private_assoc" {
  for_each       = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private.id
}

```

**modules/vpc/outputs.tf**

```hcl
output "vpc_id"               { value = aws_vpc.this.id }
output "public_subnet_ids"    { value = [for s in aws_subnet.public  : s.id] }
output "private_subnet_ids"   { value = [for s in aws_subnet.private : s.id] }
output "azs"                  { value = local.azs }

```

---

# modules/rds-postgres

**modules/rds-postgres/variables.tf**

```hcl
variable "name"                { type = string }
variable "vpc_id"              { type = string }
variable "private_subnet_ids"  { type = list(string) }
variable "engine_version"      { type = string, default = "15.5" }
variable "multi_az"            { type = bool,   default = false }
variable "instance_class"      { type = string, default = "db.t4g.medium" }
variable "allocated_storage"   { type = number, default = 50 }
variable "deletion_protection" { type = bool,   default = false }

```

**modules/rds-postgres/main.tf**

```hcl
resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-db-subnets"
  subnet_ids = var.private_subnet_ids
  tags = { Name = "${var.name}-db-subnets" }
}

# Parameter group to force SSL
resource "aws_db_parameter_group" "this" {
  name   = "${var.name}-pg"
  family = "postgres15"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }
}

# Security group for DB (no inbound rules yet; add from site level)
resource "aws_security_group" "db" {
  name        = "${var.name}-db-sg"
  description = "RDS PostgreSQL security group"
  vpc_id      = var.vpc_id
}

resource "aws_db_instance" "this" {
  identifier              = "${var.name}-pg"
  engine                  = "postgres"
  engine_version          = var.engine_version
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  db_subnet_group_name    = aws_db_subnet_group.this.name
  parameter_group_name    = aws_db_parameter_group.this.name
  multi_az                = var.multi_az
  storage_encrypted       = true
  publicly_accessible     = false
  deletion_protection     = var.deletion_protection

  # Use AWS-managed master user secret (recommended with rotate later).
  manage_master_user_password = true
  username                    = "masteruser"

  vpc_security_group_ids = [aws_security_group.db.id]

  skip_final_snapshot = true
  backup_retention_period = 7
  auto_minor_version_upgrade = true

  tags = { Name = "${var.name}-rds" }
}

```

**modules/rds-postgres/outputs.tf**

```hcl
output "endpoint"     { value = aws_db_instance.this.address }
output "port"         { value = aws_db_instance.this.port }
output "sg_id"        { value = aws_security_group.db.id }
output "resource_id"  { value = aws_db_instance.this.id }
output "arn"          { value = aws_db_instance.this.arn }

```

---

# modules/secrets

**modules/secrets/variables.tf**

```hcl
variable "app_secret_prefix"         { type = string } # e.g., "projektbezkodu/dev/"
variable "create_initial_versions"   { type = bool, default = false }

# Optional initial values (ONLY for dev; will land in TF state if used)
variable "initial_django_secret_key" { type = string, default = null, sensitive = true }
variable "initial_allowed_hosts"     { type = string, default = null, sensitive = true } # "api.projektbezkodu.example.com"
variable "initial_strapi_app_keys"   { type = string, default = null, sensitive = true } # "k1,k2,k3,k4"
variable "initial_strapi_api_salt"   { type = string, default = null, sensitive = true }
variable "initial_strapi_admin_jwt"  { type = string, default = null, sensitive = true }
variable "initial_strapi_jwt"        { type = string, default = null, sensitive = true }

# DB URL secret (one URL per app or share)
variable "initial_django_db_url"     { type = string, default = null, sensitive = true }
variable "initial_strapi_db_url"     { type = string, default = null, sensitive = true }

```

**modules/secrets/main.tf**

```hcl
# Create "containers" for secrets; versions optional
resource "aws_secretsmanager_secret" "django_secret_key" {
  name = "${var.app_secret_prefix}django/SECRET_KEY"
}
resource "aws_secretsmanager_secret" "django_allowed_hosts" {
  name = "${var.app_secret_prefix}django/ALLOWED_HOSTS"
}
resource "aws_secretsmanager_secret" "django_db_url" {
  name = "${var.app_secret_prefix}django/DATABASE_URL"
}

resource "aws_secretsmanager_secret" "strapi_app_keys" {
  name = "${var.app_secret_prefix}strapi/APP_KEYS"
}
resource "aws_secretsmanager_secret" "strapi_api_token_salt" {
  name = "${var.app_secret_prefix}strapi/API_TOKEN_SALT"
}
resource "aws_secretsmanager_secret" "strapi_admin_jwt_secret" {
  name = "${var.app_secret_prefix}strapi/ADMIN_JWT_SECRET"
}
resource "aws_secretsmanager_secret" "strapi_jwt_secret" {
  name = "${var.app_secret_prefix}strapi/JWT_SECRET"
}
resource "aws_secretsmanager_secret" "strapi_db_url" {
  name = "${var.app_secret_prefix}strapi/DATABASE_URL"
}

# Optional initial secret versions (dev only!)
resource "aws_secretsmanager_secret_version" "v_django_secret_key" {
  count      = var.create_initial_versions && var.initial_django_secret_key != null ? 1 : 0
  secret_id  = aws_secretsmanager_secret.django_secret_key.id
  secret_string = var.initial_django_secret_key
}
resource "aws_secretsmanager_secret_version" "v_django_allowed_hosts" {
  count      = var.create_initial_versions && var.initial_allowed_hosts != null ? 1 : 0
  secret_id  = aws_secretsmanager_secret.django_allowed_hosts.id
  secret_string = var.initial_allowed_hosts
}
resource "aws_secretsmanager_secret_version" "v_django_db_url" {
  count      = var.create_initial_versions && var.initial_django_db_url != null ? 1 : 0
  secret_id  = aws_secretsmanager_secret.django_db_url.id
  secret_string = var.initial_django_db_url
}

resource "aws_secretsmanager_secret_version" "v_strapi_app_keys" {
  count         = var.create_initial_versions && var.initial_strapi_app_keys != null ? 1 : 0
  secret_id     = aws_secretsmanager_secret.strapi_app_keys.id
  secret_string = var.initial_strapi_app_keys
}
resource "aws_secretsmanager_secret_version" "v_strapi_api_salt" {
  count         = var.create_initial_versions && var.initial_strapi_api_salt != null ? 1 : 0
  secret_id     = aws_secretsmanager_secret.strapi_api_token_salt.id
  secret_string = var.initial_strapi_api_salt
}
resource "aws_secretsmanager_secret_version" "v_strapi_admin_jwt" {
  count         = var.create_initial_versions && var.initial_strapi_admin_jwt != null ? 1 : 0
  secret_id     = aws_secretsmanager_secret.strapi_admin_jwt_secret.id
  secret_string = var.initial_strapi_admin_jwt
}
resource "aws_secretsmanager_secret_version" "v_strapi_jwt" {
  count         = var.create_initial_versions && var.initial_strapi_jwt != null ? 1 : 0
  secret_id     = aws_secretsmanager_secret.strapi_jwt_secret.id
  secret_string = var.initial_strapi_jwt
}
resource "aws_secretsmanager_secret_version" "v_strapi_db_url" {
  count         = var.create_initial_versions && var.initial_strapi_db_url != null ? 1 : 0
  secret_id     = aws_secretsmanager_secret.strapi_db_url.id
  secret_string = var.initial_strapi_db_url
}

```

**modules/secrets/outputs.tf**

```hcl
output "django_secret_key_arn"       { value = aws_secretsmanager_secret.django_secret_key.arn }
output "django_allowed_hosts_arn"    { value = aws_secretsmanager_secret.django_allowed_hosts.arn }
output "django_db_url_arn"           { value = aws_secretsmanager_secret.django_db_url.arn }

output "strapi_app_keys_arn"         { value = aws_secretsmanager_secret.strapi_app_keys.arn }
output "strapi_api_token_salt_arn"   { value = aws_secretsmanager_secret.strapi_api_token_salt.arn }
output "strapi_admin_jwt_secret_arn" { value = aws_secretsmanager_secret.strapi_admin_jwt_secret.arn }
output "strapi_jwt_secret_arn"       { value = aws_secretsmanager_secret.strapi_jwt_secret.arn }
output "strapi_db_url_arn"           { value = aws_secretsmanager_secret.strapi_db_url.arn }

```

---

# modules/ecr

**modules/ecr/variables.tf**

```hcl
variable "repositories" {
  type = list(string)
}

```

**modules/ecr/main.tf**

```hcl
locals {
  repo_map = { for name in var.repositories : name => name }
}

resource "aws_ecr_repository" "repos" {
  for_each = local.repo_map
  name                 = each.value
  image_tag_mutability = "MUTABLE"
  encryption_configuration { encryption_type = "AES256" }
  image_scanning_configuration { scan_on_push = true }
  tags = { Name = each.value }
}

output "repository_urls" {
  value = { for k, v in aws_ecr_repository.repos : k => v.repository_url }
}

```

**modules/ecr/outputs.tf**

```hcl
output "repository_arns" {
  value = { for k, v in aws_ecr_repository.repos : k => v.arn }
}

```

---

# modules/ecs-cluster

**modules/ecs-cluster/variables.tf**

```hcl
variable "name" { type = string }

```

**modules/ecs-cluster/main.tf**

```hcl
resource "aws_ecs_cluster" "this" {
  name = var.name
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${var.name}"
  retention_in_days = 30
}

output "cluster_arn"   { value = aws_ecs_cluster.this.arn }
output "cluster_name"  { value = aws_ecs_cluster.this.name }
output "log_group"     { value = aws_cloudwatch_log_group.this.name }

```

---

# modules/ecs-service-alb

This module creates: **ALB + HTTPS listener + cert**, **security groups**, **task exec & task roles**, **CloudWatch logs**, **ECS task & service**, and a **target group + health check**.

**modules/ecs-service-alb/variables.tf**

```hcl
variable "service_name"       { type = string }
variable "cluster_arn"        { type = string }
variable "vpc_id"             { type = string }
variable "public_subnet_ids"  { type = list(string) }
variable "private_subnet_ids" { type = list(string) }

variable "container_image"    { type = string }
variable "container_port"     { type = number }
variable "cpu"                { type = number, default = 512 }
variable "memory"             { type = number, default = 1024 }
variable "desired_count"      { type = number, default = 2 }
variable "healthcheck_path"   { type = string, default = "/" }
variable "enable_execute_command" { type = bool, default = true }

# Env and secrets (Secrets Manager ARNs)
variable "environment" {
  type    = map(string)
  default = {}
}
variable "secrets" {
  type = map(string) # key = ENV VAR name, value = secret ARN
  default = {}
}

# TLS & DNS
variable "hostnames_for_certificate" { type = list(string) } # e.g., ["api.projektbezkodu.example.com"]
variable "hosted_zone_id"            { type = string }       # Route 53 zone id for DNS validation & record
variable "create_route53_record"     { type = bool, default = true }

```

**modules/ecs-service-alb/main.tf**

```hcl
# SGs
resource "aws_security_group" "alb" {
  name        = "${var.service_name}-alb-sg"
  description = "ALB SG"
  vpc_id      = var.vpc_id

  ingress { from_port = 443 to_port = 443 protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0   to_port = 0   protocol = "-1"  cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_security_group" "task" {
  name        = "${var.service_name}-task-sg"
  description = "ECS task SG"
  vpc_id      = var.vpc_id

  # Allow from ALB only
  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  egress { from_port = 0 to_port = 0 protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }
}

# ALB + TG
resource "aws_lb" "this" {
  name               = "${var.service_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "this" {
  name        = "${var.service_name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = var.healthcheck_path
    matcher             = "200-399"
    interval            = 30
    unhealthy_threshold = 5
  }
}

# ACM certificate (DNS validated)
resource "aws_acm_certificate" "this" {
  domain_name       = var.hostnames_for_certificate[0]
  validation_method = "DNS"
  subject_alternative_names = slice(var.hostnames_for_certificate, 1, length(var.hostnames_for_certificate))
}

# Create DNS validation records
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
  zone_id = var.hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

# HTTPS listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.this.certificate_arn

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

# IAM roles
data "aws_iam_policy_document" "task_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals { type = "Service" identifiers = ["ecs-tasks.amazonaws.com"] }
  }
}

resource "aws_iam_role" "task_execution" {
  name               = "${var.service_name}-exec-role"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}
resource "aws_iam_role" "task_role" {
  name               = "${var.service_name}-task-role"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}

# Allow pulling from ECR, writing logs, reading secrets
resource "aws_iam_role_policy_attachment" "exec_ecr" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
resource "aws_iam_policy" "secrets_read" {
  name        = "${var.service_name}-secrets-read"
  description = "Allow GetSecretValue for injected secrets"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["secretsmanager:GetSecretValue"],
      Resource = values(var.secrets)
    }]
  })
}
resource "aws_iam_role_policy_attachment" "task_secrets" {
  role       = aws_iam_role.task_role.name
  policy_arn = aws_iam_policy.secrets_read.arn
}

# CloudWatch logs
resource "aws_cloudwatch_log_group" "service" {
  name              = "/ecs/${var.service_name}"
  retention_in_days = 30
}

# Task definition
locals {
  env_list = [for k, v in var.environment : { name = k, value = v }]
  sec_list = [for k, v in var.secrets     : { name = k, valueFrom = v }]
}

resource "aws_ecs_task_definition" "this" {
  family                   = var.service_name
  cpu                      = var.cpu
  memory                   = var.memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task_role.arn
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([{
    name      = var.service_name
    image     = var.container_image
    essential = true
    portMappings = [{ containerPort = var.container_port, hostPort = var.container_port, protocol = "tcp" }]
    environment = local.env_list
    secrets     = local.sec_list
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.service.name
        awslogs-region        = data.aws_region.current.name
        awslogs-stream-prefix = var.service_name
      }
    }
    healthCheck = {
      command  = ["CMD-SHELL", "curl -fsS http://localhost:${var.container_port}${var.healthcheck_path} || exit 1"]
      interval = 30
      timeout  = 5
      retries  = 3
    }
  }])
}

data "aws_region" "current" {}

# ECS service
resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  enable_execute_command = var.enable_execute_command
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.task.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

# Route 53 A/AAAA alias to ALB
resource "aws_route53_record" "svc_alias_a" {
  count   = var.create_route53_record ? length(var.hostnames_for_certificate) : 0
  zone_id = var.hosted_zone_id
  name    = var.hostnames_for_certificate[count.index]
  type    = "A"
  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}
resource "aws_route53_record" "svc_alias_aaaa" {
  count   = var.create_route53_record ? length(var.hostnames_for_certificate) : 0
  zone_id = var.hosted_zone_id
  name    = var.hostnames_for_certificate[count.index]
  type    = "AAAA"
  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}

```

**modules/ecs-service-alb/outputs.tf**

```hcl
output "alb_dns_name"  { value = aws_lb.this.dns_name }
output "alb_zone_id"   { value = aws_lb.this.zone_id }
output "task_sg_id"    { value = aws_security_group.task.id }
output "alb_sg_id"     { value = aws_security_group.alb.id }
output "service_arn"   { value = aws_ecs_service.this.arn }
output "listener_arn"  { value = aws_lb_listener.https.arn }

```

---

# modules/s3

**modules/s3/variables.tf**

```hcl
variable "site_prefix"             { type = string } # e.g., "projektbezkodu-dev"
variable "create_django_buckets"   { type = bool, default = true }
variable "create_strapi_bucket"    { type = bool, default = true }

```

**modules/s3/main.tf**

```hcl
locals {
  django_static = "${var.site_prefix}-django-static"
  django_media  = "${var.site_prefix}-django-media"
  strapi_media  = "${var.site_prefix}-strapi-media"
}

# Common module for a private bucket
module "bucket_django_static" {
  source  = "./bucket"
  count   = var.create_django_buckets ? 1 : 0
  name    = local.django_static
}
module "bucket_django_media" {
  source  = "./bucket"
  count   = var.create_django_buckets ? 1 : 0
  name    = local.django_media
}
module "bucket_strapi_media" {
  source  = "./bucket"
  count   = var.create_strapi_bucket ? 1 : 0
  name    = local.strapi_media
}

```

**modules/s3/bucket/main.tf**

```hcl
variable "name" { type = string }

resource "aws_s3_bucket" "this" {
  bucket = var.name
}

resource "aws_s3_bucket_versioning" "v" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "enc" {
  bucket = aws_s3_bucket.this.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "pab" {
  bucket                  = aws_s3_bucket.this.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "lc" {
  bucket = aws_s3_bucket.this.id
  rule {
    id = "expire-mpu"
    status = "Enabled"
    abort_incomplete_multipart_upload { days_after_initiation = 7 }
  }
}

output "bucket" { value = aws_s3_bucket.this.bucket }
output "arn"    { value = aws_s3_bucket.this.arn }

```

**modules/s3/outputs.tf**

```hcl
output "django_static_bucket" { value = try(module.bucket_django_static[0].bucket, null) }
output "django_media_bucket"  { value = try(module.bucket_django_media[0].bucket, null) }
output "strapi_media_bucket"  { value = try(module.bucket_strapi_media[0].bucket, null) }

```

---

# modules/amplify-next

> This expects a Git repo URL + an access token (PAT) to let Amplify pull the code. For GitHub, use a scoped token with repo read access. In production you may prefer connecting Amplify to your repo manually once, then manage branches via TF.
> 

**modules/amplify-next/variables.tf**

```hcl
variable "app_name"          { type = string }
variable "repo_url"          { type = string }   # e.g., https://github.com/you/affiliate-stack
variable "access_token"      { type = string, sensitive = true } # Git provider token
variable "branch"            { type = string }   # e.g., "main"
variable "custom_domain"     { type = string }   # e.g., projektbezkodu.example.com
variable "zone_id"           { type = string }   # Route 53 zone id that hosts the domain
variable "env_vars" {
  type    = map(string)
  default = {}
}

```

**modules/amplify-next/main.tf**

```hcl
resource "aws_amplify_app" "this" {
  name       = var.app_name
  repository = var.repo_url
  access_token = var.access_token

  platform = "WEB_COMPUTE" # SSR
  build_spec = <<-YAML
version: 1
applications:
  - appRoot: apps/frontend-next
    frontend:
      phases:
        preBuild:
          commands:
            - nvm use 22 || nvm install 22
            - corepack enable
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

# Custom domain mapping (creates Route53 records when zone in account)
resource "aws_amplify_domain_association" "domain" {
  app_id      = aws_amplify_app.this.id
  domain_name = var.custom_domain
  depends_on  = [aws_amplify_branch.branch]

  sub_domain {
    branch_name = var.branch
    prefix      = "" # apex of the custom domain
  }
}

output "amplify_app_id"  { value = aws_amplify_app.this.id }
output "domain_status"   { value = aws_amplify_domain_association.domain.status }

```

---

# sites/projektbezkodu-dev (your site stack)

**sites/projektbezkodu-dev/variables.tf**

```hcl
variable "region"        { type = string }
variable "site_id"       { type = string } # e.g., "projektbezkodu"
variable "env"           { type = string } # "dev" or "prod"
variable "domain_root"   { type = string } # e.g., "projektbezkodu.example.com"
variable "parent_zone"   { type = string } # e.g., "example.com" (hosted zone name)

# Frontend repo settings
variable "frontend_repo_url" { type = string }
variable "frontend_branch"   { type = string, default = "main" }
variable "amplify_access_token" { type = string, sensitive = true }

# Sizes
variable "rds_instance_class" { type = string, default = "db.t4g.medium" }
variable "rds_allocated_gb"   { type = number, default = 50 }

```

**sites/projektbezkodu-dev/main.tf**

```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" { region = var.region }

# ======== Locals ========
locals {
  name         = "${var.site_id}-${var.env}"
  domain_root  = var.domain_root               # "projektbezkodu.example.com"
  api_host     = "api.${local.domain_root}"
  cms_host     = "cms.${local.domain_root}"
  next_host    = local.domain_root
}

# Hosted zone lookup (parent zone)
data "aws_route53_zone" "parent" {
  name         = var.parent_zone
  private_zone = false
}

# ======== VPC ========
module "vpc" {
  source             = "../../modules/vpc"
  name               = local.name
  az_count           = 2
  create_nat_gateway = true
}

# ======== RDS Postgres ========
module "rds" {
  source                = "../../modules/rds-postgres"
  name                  = local.name
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  instance_class        = var.rds_instance_class
  allocated_storage     = var.rds_allocated_gb
  multi_az              = false
  deletion_protection   = false
}

# ======== Secrets ========
module "secrets" {
  source               = "../../modules/secrets"
  app_secret_prefix    = "${var.site_id}/${var.env}/"
  create_initial_versions = false  # safe-by-default
  # For quick dev, you *may* pass initial_* values and set true (not for prod)
}

# ======== S3 media/static buckets ========
module "s3" {
  source                = "../../modules/s3"
  site_prefix           = local.name
  create_django_buckets = true
  create_strapi_bucket  = true
}

# ======== ECR repos ========
module "ecr" {
  source       = "../../modules/ecr"
  repositories = ["${local.name}-django", "${local.name}-strapi"]
}

# ======== ECS cluster ========
module "ecs" {
  source = "../../modules/ecs-cluster"
  name   = local.name
}

# ======== ECS Services (Django & Strapi) ========

# Django API service
module "svc_django" {
  source                = "../../modules/ecs-service-alb"
  service_name          = "${local.name}-django"
  cluster_arn           = module.ecs.cluster_arn
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids

  container_image       = "${module.ecr.repository_urls["${local.name}-django"]}:latest"
  container_port        = 8000
  desired_count         = 2
  cpu                   = 512
  memory                = 1024
  healthcheck_path      = "/healthz/"

  environment = {
    DJANGO_SETTINGS_MODULE = "project.settings"
    FRONTEND_HOST          = local.next_host
    DJANGO_S3_BUCKET       = module.s3.django_media_bucket
    DJANGO_CDN_DOMAIN      = "${module.s3.django_media_bucket}.s3.amazonaws.com"
    AWS_REGION             = var.region
  }
  secrets = {
    SECRET_KEY   = module.secrets.django_secret_key_arn
    ALLOWED_HOSTS= module.secrets.django_allowed_hosts_arn
    DATABASE_URL = module.secrets.django_db_url_arn
  }

  hostnames_for_certificate = [local.api_host]
  hosted_zone_id            = data.aws_route53_zone.parent.zone_id
}

# Strapi CMS service
module "svc_strapi" {
  source                = "../../modules/ecs-service-alb"
  service_name          = "${local.name}-strapi"
  cluster_arn           = module.ecs.cluster_arn
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids

  container_image       = "${module.ecr.repository_urls["${local.name}-strapi"]}:latest"
  container_port        = 1337
  desired_count         = 2
  cpu                   = 512
  memory                = 1024
  healthcheck_path      = "/_health"

  environment = {
    NODE_ENV     = "production"
    AWS_REGION   = var.region
    S3_BUCKET    = module.s3.strapi_media_bucket
  }
  secrets = {
    DATABASE_URL      = module.secrets.strapi_db_url_arn
    APP_KEYS          = module.secrets.strapi_app_keys_arn
    API_TOKEN_SALT    = module.secrets.strapi_api_token_salt_arn
    ADMIN_JWT_SECRET  = module.secrets.strapi_admin_jwt_secret_arn
    JWT_SECRET        = module.secrets.strapi_jwt_secret_arn
  }

  hostnames_for_certificate = [local.cms_host]
  hosted_zone_id            = data.aws_route53_zone.parent.zone_id
}

# ======== DB inbound rules (allow from ECS tasks only) ========
resource "aws_security_group_rule" "db_from_django" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = module.rds.sg_id
  source_security_group_id = module.svc_django.task_sg_id
}
resource "aws_security_group_rule" "db_from_strapi" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = module.rds.sg_id
  source_security_group_id = module.svc_strapi.task_sg_id
}

# ======== Amplify (Next.js SSR) ========
module "amplify" {
  source           = "../../modules/amplify-next"
  app_name         = local.name
  repo_url         = var.frontend_repo_url
  access_token     = var.amplify_access_token
  branch           = var.frontend_branch
  custom_domain    = local.next_host
  zone_id          = data.aws_route53_zone.parent.zone_id
  env_vars = {
    NEXT_PUBLIC_API_BASE = "https://${local.api_host}"
    NEXT_PUBLIC_CMS_BASE = "https://${local.cms_host}"
  }
}

```

**sites/projektbezkodu-dev/outputs.tf**

```hcl
output "vpc_id"           { value = module.vpc.vpc_id }
output "api_url"          { value = "https://${local.api_host}" }
output "cms_url"          { value = "https://${local.cms_host}" }
output "frontend_url"     { value = "https://${local.next_host}" }
output "rds_endpoint"     { value = module.rds.endpoint }
output "django_task_sg"   { value = module.svc_django.task_sg_id }
output "strapi_task_sg"   { value = module.svc_strapi.task_sg_id }

```

**sites/projektbezkodu-dev/terraform.tfvars.example**

```hcl
region             = "us-east-1"
site_id            = "projektbezkodu"
env                = "dev"
domain_root        = "projektbezkodu.example.com"
parent_zone        = "example.com"

frontend_repo_url     = "https://github.com/your-org/affiliate-stack"
frontend_branch       = "main"
amplify_access_token  = "ghp_XXXXXXXXXXXXXXXXXXXXXXXX"

```

---

## How to use (exact steps)

1. **Create files** exactly as shown above.
2. Ensure you have a **public hosted zone** for `example.com` in Route 53 and your registrar points NS to it.
3. In `sites/projektbezkodu-dev/terraform.tfvars`, fill **region**, **domain names**, and **Amplify** repo/token.
4. Initialize and apply:

```bash
cd infra/sites/projektbezkodu-dev
terraform init
terraform apply

```

1. **Set secret values securely** (recommended flow):
    - Build your DB URLs with `sslmode=require`, for example:
        
        ```
        postgresql://django_user:<PASSWORD>@<rds-endpoint>:5432/django_app?sslmode=require
        postgresql://strapi_user:<PASSWORD>@<rds-endpoint>:5432/strapi_app?sslmode=require
        
        ```
        
    - Put them (and all app secrets) into the Secrets Manager secrets created by Terraform:
        
        ```bash
        aws secretsmanager put-secret-value \
          --secret-id projektbezkodu/dev/django/DATABASE_URL \
          --secret-string 'postgresql://...'
        
        aws secretsmanager put-secret-value \
          --secret-id projektbezkodu/dev/django/SECRET_KEY \
          --secret-string '...64+char+random...'
        
        # Strapi (APP_KEYS comma-separated)
        aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/APP_KEYS --secret-string 'k1,k2,k3,k4'
        aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/API_TOKEN_SALT --secret-string '...'
        aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/ADMIN_JWT_SECRET --secret-string '...'
        aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/JWT_SECRET --secret-string '...'
        aws secretsmanager put-secret-value --secret-id projektbezkodu/dev/strapi/DATABASE_URL --secret-string 'postgresql://...'
        
        ```
        
2. **Redeploy services** to pick up secrets (or just `terraform apply` again after images are pushed and services exist):

```bash
aws ecs update-service --cluster projektbezkodu-dev --service projektbezkodu-dev-django --force-new-deployment
aws ecs update-service --cluster projektbezkodu-dev --service projektbezkodu-dev-strapi --force-new-deployment

```

1. **Create DBs & users** (one-time) using `psql` from anywhere that can reach RDS (e.g., run an ECS one-off task in the private subnets):

```bash
psql "host=$(terraform output -raw rds_endpoint) port=5432 dbname=postgres user=masteruser sslmode=require"

CREATE DATABASE django_app;
CREATE DATABASE strapi_app;
CREATE USER django_user WITH ENCRYPTED PASSWORD '<django-password>';
CREATE USER strapi_user WITH ENCRYPTED PASSWORD '<strapi-password>';
GRANT ALL PRIVILEGES ON DATABASE django_app  TO django_user;
GRANT ALL PRIVILEGES ON DATABASE strapi_app TO strapi_user;

```

1. **Amplify** will build and attach your custom domain (it creates the Route 53 records).
    - Frontend: `https://projektbezkodu.example.com`
    - API: `https://api.projektbezkodu.example.com`
    - CMS: `https://cms.projektbezkodu.example.com`

---

## Creating another site (reusable blueprint)

Copy `sites/projektbezkodu-dev` → `sites/brandx-prod`, change:

- `site_id`, `env`, `domain_root`, `parent_zone`, sizes (e.g., Multi‑AZ for prod)
- New repo/branch or same monorepo different brand folder
- Apply again. You’ll get isolated VPC/RDS/ECS/ALBs/secrets for the new site.

---

### Notes & options

- **ALB per service vs shared ALB**: this module creates **one ALB per service** (simpler). You can refactor to a shared ALB + host-based rules later.
- **Private media via CloudFront**: add a CloudFront distribution in front of the S3 media buckets if you need signed URLs/WAF.
- **VPC endpoints**: replace NAT with Interface Endpoints (ECR, Logs, Secrets Manager) for egress‑minimized setups.

If you want, I can also add an **optional CloudFront module for S3 media** and a **shared-ALB module** with host-based routing.