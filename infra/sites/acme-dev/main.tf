terraform {
  required_version = ">= 1.6.0"
  required_providers { aws = { source = "hashicorp/aws", version = "~> 5.0" } }
  backend "s3" {}
}

provider "aws" { region = var.region }

locals {
  name        = "${var.site_id}-${var.env}"
  domain_root = var.domain_root
  api_host    = "api.${local.domain_root}"
  cms_host    = "cms.${local.domain_root}"
  next_host   = local.domain_root
}

data "aws_route53_zone" "parent" {
  name         = var.parent_zone
  private_zone = false
}

module "vpc" {
  source             = "../../modules/vpc"
  name               = local.name
  az_count           = 2
  create_nat_gateway = true
}

module "rds" {
  source              = "../../modules/rds-postgres"
  name                = local.name
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  instance_class      = var.rds_instance_class
  allocated_storage   = var.rds_allocated_gb
  multi_az            = false
  deletion_protection = false
}

module "secrets" {
  source               = "../../modules/secrets"
  app_secret_prefix    = "${var.site_id}/${var.env}/"
  create_initial_versions = false
}

module "s3" {
  source                = "../../modules/s3"
  site_prefix           = local.name
  create_django_buckets = true
  create_strapi_bucket  = true
}

module "ecr" {
  source       = "../../modules/ecr"
  repositories = ["${local.name}-django", "${local.name}-strapi"]
}

module "ecs" {
  source = "../../modules/ecs-cluster"
  name   = local.name
}

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
    SECRET_KEY    = module.secrets.django_secret_key_arn
    ALLOWED_HOSTS = module.secrets.django_allowed_hosts_arn
    DATABASE_URL  = module.secrets.django_db_url_arn
  }
  hostnames_for_certificate = [local.api_host]
  hosted_zone_id            = data.aws_route53_zone.parent.zone_id
}

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
    NODE_ENV   = "production"
    AWS_REGION = var.region
    S3_BUCKET  = module.s3.strapi_media_bucket
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
