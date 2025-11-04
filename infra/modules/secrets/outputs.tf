output "django_secret_key_arn"       { value = aws_secretsmanager_secret.django_secret_key.arn }
output "django_allowed_hosts_arn"    { value = aws_secretsmanager_secret.django_allowed_hosts.arn }
output "django_db_url_arn"           { value = aws_secretsmanager_secret.django_db_url.arn }
output "strapi_app_keys_arn"         { value = aws_secretsmanager_secret.strapi_app_keys.arn }
output "strapi_api_token_salt_arn"   { value = aws_secretsmanager_secret.strapi_api_token_salt.arn }
output "strapi_admin_jwt_secret_arn" { value = aws_secretsmanager_secret.strapi_admin_jwt_secret.arn }
output "strapi_jwt_secret_arn"       { value = aws_secretsmanager_secret.strapi_jwt_secret.arn }
output "strapi_db_url_arn"           { value = aws_secretsmanager_secret.strapi_db_url.arn }
