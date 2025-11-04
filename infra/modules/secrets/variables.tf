variable "app_secret_prefix"         { type = string }
variable "create_initial_versions"   { type = bool, default = false }
variable "initial_django_secret_key" { type = string, default = null, sensitive = true }
variable "initial_allowed_hosts"     { type = string, default = null, sensitive = true }
variable "initial_strapi_app_keys"   { type = string, default = null, sensitive = true }
variable "initial_strapi_api_salt"   { type = string, default = null, sensitive = true }
variable "initial_strapi_admin_jwt"  { type = string, default = null, sensitive = true }
variable "initial_strapi_jwt"        { type = string, default = null, sensitive = true }
variable "initial_django_db_url"     { type = string, default = null, sensitive = true }
variable "initial_strapi_db_url"     { type = string, default = null, sensitive = true }
