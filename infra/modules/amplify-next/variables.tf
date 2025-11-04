variable "app_name"      { type = string }
variable "repo_url"      { type = string }
variable "access_token"  { type = string, sensitive = true }
variable "branch"        { type = string }
variable "custom_domain" { type = string }
variable "zone_id"       { type = string }
variable "env_vars"      { type = map(string) default = {} }
