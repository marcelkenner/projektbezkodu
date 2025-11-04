output "django_static_bucket" { value = try(module.bucket_django_static[0].bucket, null) }
output "django_media_bucket"  { value = try(module.bucket_django_media[0].bucket, null) }
output "strapi_media_bucket"  { value = try(module.bucket_strapi_media[0].bucket, null) }
