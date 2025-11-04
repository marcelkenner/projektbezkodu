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
variable "environment" { type = map(string) default = {} }
variable "secrets"     { type = map(string) default = {} } # Secrets Manager ARNs
variable "hostnames_for_certificate" { type = list(string) }
variable "hosted_zone_id"            { type = string }
variable "create_route53_record"     { type = bool, default = true }
