resource "aws_secretsmanager_secret" "django_secret_key" { name = "${var.app_secret_prefix}django/SECRET_KEY" }
resource "aws_secretsmanager_secret" "django_allowed_hosts" { name = "${var.app_secret_prefix}django/ALLOWED_HOSTS" }
resource "aws_secretsmanager_secret" "django_db_url" { name = "${var.app_secret_prefix}django/DATABASE_URL" }

resource "aws_secretsmanager_secret" "strapi_app_keys" { name = "${var.app_secret_prefix}strapi/APP_KEYS" }
resource "aws_secretsmanager_secret" "strapi_api_token_salt" { name = "${var.app_secret_prefix}strapi/API_TOKEN_SALT" }
resource "aws_secretsmanager_secret" "strapi_admin_jwt_secret" { name = "${var.app_secret_prefix}strapi/ADMIN_JWT_SECRET" }
resource "aws_secretsmanager_secret" "strapi_jwt_secret" { name = "${var.app_secret_prefix}strapi/JWT_SECRET" }
resource "aws_secretsmanager_secret" "strapi_db_url" { name = "${var.app_secret_prefix}strapi/DATABASE_URL" }

resource "aws_secretsmanager_secret_version" "v_django_secret_key" {
  count = var.create_initial_versions && var.initial_django_secret_key != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.django_secret_key.id
  secret_string = var.initial_django_secret_key
}
resource "aws_secretsmanager_secret_version" "v_django_allowed_hosts" {
  count = var.create_initial_versions && var.initial_allowed_hosts != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.django_allowed_hosts.id
  secret_string = var.initial_allowed_hosts
}
resource "aws_secretsmanager_secret_version" "v_django_db_url" {
  count = var.create_initial_versions && var.initial_django_db_url != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.django_db_url.id
  secret_string = var.initial_django_db_url
}
resource "aws_secretsmanager_secret_version" "v_strapi_app_keys" {
  count = var.create_initial_versions && var.initial_strapi_app_keys != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_app_keys.id
  secret_string = var.initial_strapi_app_keys
}
resource "aws_secretsmanager_secret_version" "v_strapi_api_salt" {
  count = var.create_initial_versions && var.initial_strapi_api_salt != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_api_token_salt.id
  secret_string = var.initial_strapi_api_salt
}
resource "aws_secretsmanager_secret_version" "v_strapi_admin_jwt" {
  count = var.create_initial_versions && var.initial_strapi_admin_jwt != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_admin_jwt_secret.id
  secret_string = var.initial_strapi_admin_jwt
}
resource "aws_secretsmanager_secret_version" "v_strapi_jwt" {
  count = var.create_initial_versions && var.initial_strapi_jwt != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_jwt_secret.id
  secret_string = var.initial_strapi_jwt
}
resource "aws_secretsmanager_secret_version" "v_strapi_db_url" {
  count = var.create_initial_versions && var.initial_strapi_db_url != null ? 1 : 0
  secret_id = aws_secretsmanager_secret.strapi_db_url.id
  secret_string = var.initial_strapi_db_url
}
