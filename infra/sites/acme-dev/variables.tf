variable "region"        { type = string }
variable "site_id"       { type = string }
variable "env"           { type = string }
variable "domain_root"   { type = string }
variable "parent_zone"   { type = string }
variable "frontend_repo_url" { type = string }
variable "frontend_branch"   { type = string, default = "main" }
variable "amplify_access_token" { type = string, sensitive = true }
variable "rds_instance_class" { type = string, default = "db.t4g.medium" }
variable "rds_allocated_gb"   { type = number, default = 50 }
