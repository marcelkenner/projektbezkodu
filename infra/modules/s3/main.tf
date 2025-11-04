locals {
  django_static = "${var.site_prefix}-django-static"
  django_media  = "${var.site_prefix}-django-media"
  strapi_media  = "${var.site_prefix}-strapi-media"
}

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
